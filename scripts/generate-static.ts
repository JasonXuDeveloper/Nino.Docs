/**
 * Runs after `react-router build`: rewrites the page files to the URLs the
 * site links to, and writes the files that are not pages (404.html, sitemap,
 * robots.txt, llms.txt, Markdown copies of each page, social cards).
 */
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type * as PageTree from 'fumadocs-core/page-tree';
import { headlineSerialize } from '../src/lib/benchmarks';
import type { Locale } from '../src/lib/i18n';
import { pageBodyMarkdown } from '../src/lib/markdown';
import { docDescription, markdownPath } from '../src/lib/seo';
import {
  githubUrl,
  languageTag,
  productSummary,
  siteUrl,
} from '../src/lib/site';
import { source } from '../src/lib/source';
import { latestVersion, versions } from '../src/lib/versions';
import { type Card, writeCards } from './og';

const outDir = path.resolve('build/client');
const locales = ['en', 'zh'] as const satisfies Locale[];

type Page = ReturnType<typeof source.getPages>[number];

async function write(file: string, content: string | Buffer) {
  const target = path.join(outDir, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content);
}

const isLatest = (page: Page) => page.slugs[0] === latestVersion;
const versionOf = (page: Page) => page.slugs[0] ?? latestVersion;
const localeOf = (page: Page): Locale => (page.locale === 'zh' ? 'zh' : 'en');

function lastModifiedOf(page: Page) {
  const date = page.data.lastModified;
  return date && !Number.isNaN(date.getTime()) ? date : undefined;
}

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/* ------------------------------------------------------------------ */
/* Page files                                                          */
/* ------------------------------------------------------------------ */

/**
 * React Router writes /en/docs/v4/start as en/docs/v4/start/index.html, which
 * Cloudflare Pages serves at /en/docs/v4/start/ and reaches from the
 * slash-less URL only through a 308 redirect. Every link, canonical URL and
 * sitemap entry uses the slash-less URL, so move each page to
 * en/docs/v4/start.html: Pages then serves it at /en/docs/v4/start directly
 * and redirects the trailing-slash and .html forms there.
 */
async function flattenPages(dir: string) {
  let moved = 0;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'assets') continue;
    const child = path.join(dir, entry.name);
    moved += await flattenPages(child);
    const index = path.join(child, 'index.html');
    try {
      await fs.rename(index, `${child}.html`);
      moved++;
      // Remove the folder if the page was all it held.
      await fs.rmdir(child).catch(() => {});
    } catch {}
  }
  return moved;
}

/* ------------------------------------------------------------------ */
/* Markdown                                                            */
/* ------------------------------------------------------------------ */

const markdownCache = new Map<string, Promise<string>>();

/**
 * The Markdown copy of a page: title, description, canonical URL, version,
 * last update and the body with every component rendered to Markdown.
 */
function markdownOf(page: Page) {
  let cached = markdownCache.get(page.url);
  if (!cached) {
    cached = renderMarkdown(page);
    markdownCache.set(page.url, cached);
  }
  return cached;
}

async function renderMarkdown(page: Page) {
  const lang = localeOf(page);
  const zh = lang === 'zh';
  const version = versionOf(page);
  const date = lastModifiedOf(page);
  const other = source.getPage(page.slugs, zh ? 'en' : 'zh');
  const latest = source.getPage([latestVersion, ...page.slugs.slice(1)], lang);

  const lines = [`# ${page.data.title}`, ''];
  if (page.data.description) lines.push(`> ${page.data.description}`, '');
  lines.push(`URL: ${siteUrl}${page.url}`);
  lines.push(
    isLatest(page)
      ? `${zh ? '版本' : 'Version'}: Nino ${version}${zh ? '（最新）' : ' (latest)'}`
      : `${zh ? '版本' : 'Version'}: Nino ${version}${zh ? `（旧版本，最新为 ${latestVersion}：` : ` (archived; the latest is ${latestVersion}: `}${siteUrl}${latest?.url ?? `/${lang}/docs/${latestVersion}`}${zh ? '）' : ')'}`,
  );
  if (date) lines.push(`${zh ? '最后更新' : 'Last updated'}: ${isoDate(date)}`);
  if (other)
    lines.push(
      `${zh ? 'English' : '中文版'}: ${siteUrl}${markdownPath(other.url)}`,
    );
  lines.push('', await pageBodyMarkdown(page, lang), '');
  return lines.join('\n');
}

/* ------------------------------------------------------------------ */
/* Sitemap and robots.txt                                              */
/* ------------------------------------------------------------------ */

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** hreflang alternates, the same set as the pages' <link rel="alternate"> */
function alternateLinks(urls: Partial<Record<Locale | 'xDefault', string>>) {
  const links: [string, string][] = [];
  if (urls.en) links.push([languageTag.en, urls.en]);
  if (urls.zh) links.push(['zh', urls.zh], [languageTag.zh, urls.zh]);
  const fallback = urls.xDefault ?? urls.en ?? urls.zh;
  if (fallback) links.push(['x-default', fallback]);
  return links
    .map(
      ([lang, url]) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${xmlEscape(siteUrl + url)}"/>`,
    )
    .join('\n');
}

/** The site paths `sitemap()` listed, checked by `checkSitemap()` */
const sitemapUrls: string[] = [];

/**
 * Every sitemap entry must be a page that answers 200 at that URL and names
 * it as its canonical: a URL that redirects or 404s is reported by Search
 * Console (and a not-found page answering 200 as a soft 404).
 */
async function checkSitemap() {
  const problems: string[] = [];
  for (const url of sitemapUrls) {
    const file = path.join(outDir, `${url.slice(1)}.html`);
    const html = await fs.readFile(file, 'utf8').catch(() => undefined);
    if (html === undefined) problems.push(`${url}: no ${file}`);
    else if (!html.includes(`<link rel="canonical" href="${siteUrl}${url}"/>`))
      problems.push(`${url}: its canonical is another URL`);
    else if (/<meta name="robots" content="noindex/.test(html))
      problems.push(`${url}: noindex`);
  }
  if (problems.length > 0)
    throw new Error(
      `Sitemap entries that are not pages:\n${problems.join('\n')}`,
    );
}

/**
 * The home pages and every page of the latest version, in both languages,
 * with the date of the last commit to the page and its language alternates.
 * Archived versions are noindex and not listed.
 */
function sitemap() {
  const entries: string[] = [];
  sitemapUrls.length = 0;
  const entry = (
    url: string,
    alternates: Partial<Record<Locale | 'xDefault', string>>,
    date: Date | undefined,
    priority: string,
  ) => {
    sitemapUrls.push(url);
    entries.push(
      [
        '  <url>',
        `    <loc>${xmlEscape(siteUrl + url)}</loc>`,
        ...(date ? [`    <lastmod>${isoDate(date)}</lastmod>`] : []),
        `    <priority>${priority}</priority>`,
        alternateLinks(alternates),
        '  </url>',
      ].join('\n'),
    );
  };

  // The home pages change with the latest docs and the benchmark data.
  const newest = source
    .getPages()
    .filter(isLatest)
    .map(lastModifiedOf)
    .filter((date): date is Date => date !== undefined)
    .sort((a, b) => b.getTime() - a.getTime())[0];
  for (const locale of locales)
    entry(`/${locale}`, { en: '/en', zh: '/zh', xDefault: '/' }, newest, '1.0');

  for (const locale of locales) {
    for (const page of source.getPages(locale).filter(isLatest)) {
      const depth = page.slugs.length;
      entry(
        page.url,
        {
          en: source.getPage(page.slugs, 'en')?.url,
          zh: source.getPage(page.slugs, 'zh')?.url,
        },
        lastModifiedOf(page),
        depth <= 1 ? '0.9' : depth === 2 ? '0.8' : '0.6',
      );
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

/**
 * Every crawler may read the docs, including AI crawlers and answer engines:
 * the goal is to be found and cited. They are listed by name so the policy is
 * explicit (and so a default that blocks one of them cannot apply). Note that
 * Cloudflare's "Block AI bots" setting and its managed robots.txt can
 * override this file; see README.md.
 */
const crawlers = [
  // Search engines
  'Googlebot',
  'Bingbot',
  'Baiduspider',
  'YandexBot',
  'DuckDuckBot',
  'Applebot',
  'Sogou web spider',
  '360Spider',
  // AI search, assistants and training
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
  'DuckAssistBot',
  'MistralAI-User',
  'cohere-ai',
  'CCBot',
];

function robots() {
  return `# Nino documentation: every crawler, search engines and AI crawlers alike,
# may read and cite these docs. Markdown copies of each page are listed in
# ${siteUrl}/llms.txt.

User-agent: *
${crawlers.map((name) => `User-agent: ${name}`).join('\n')}
Allow: /
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;
}

/* ------------------------------------------------------------------ */
/* llms.txt                                                            */
/* ------------------------------------------------------------------ */

const llmsCopy: Record<
  Locale,
  {
    facts: string[];
    optional: string;
    archived: (version: string) => string;
  }
> = {
  en: {
    facts: [
      'Install: `dotnet add package Nino --prerelease` (NuGet: https://www.nuget.org/packages/Nino); Unity: `openupm add com.jasonxudeveloper.nino`',
      'Optional packages: `Nino.Immutable` (System.Collections.Immutable types), `Nino.AspNetCore` (ASP.NET Core MVC formatters and Minimal API bodies for `application/x-nino`) and `Nino.Codegen` (TypeScript, Go and Rust types and codecs, generated after each build; the same as the `nino-gen` tool, `Nino.Codegen.Tool`)',
      'v4 is still a prerelease on NuGet: without `--prerelease`, NuGet installs the stable 3.9.x, a test build of v4 features that is not compatible with v4.',
      'Go, Rust and TypeScript: code that nino-gen generates from your C# `[NinoType]`s, with the runtimes published with every release from 4.0.0-rc.8: `go get github.com/JasonXuDeveloper/Nino/runtimes/go/v4` ([Go module](https://pkg.go.dev/github.com/JasonXuDeveloper/Nino/runtimes/go/v4)), `cargo add nino-serialization` ([crates.io](https://crates.io/crates/nino-serialization); library `nino`), `npm install nino-serialization` ([npm](https://www.npmjs.com/package/nino-serialization)); they read and write the same bytes as .NET',
      'Unity 2022.3+ on Mono and IL2CPP, and HybridCLR hot-update assemblies with no initialization call; with `com.unity.burst` installed, Burst-compiled SIMD kernels move arrays of tuples and structs and Latin-1 strings. Godot 4 .NET projects use the NuGet package',
      'Analyzer: diagnostics NINO001 to NINO029 while you type, many with a code fix, in the `Nino` package; nino-gen adds NINOGEN001 to NINOGEN004',
      'AI coding agents: `npx skills add JasonXuDeveloper/Nino` installs the `nino-serialization` skill (Claude Code, Codex, Cursor, Copilot and other agents)',
      'Usage: mark a class, struct, record or interface with `[NinoType]`, then call `NinoSerializer.Serialize(value)` and `NinoDeserializer.Deserialize<T>(bytes)`',
      ...(headlineSerialize
        ? [
            `Performance: up to ${headlineSerialize}× faster serialization than MemoryPack in the same benchmark run; see [Nino vs MemoryPack](${siteUrl}/en/docs/${latestVersion}/vs-memorypack)`,
          ]
        : []),
      `Source code and issues: ${githubUrl} (MIT license)`,
      `These docs describe Nino ${latestVersion}, the current version. Its binary format is not compatible with v3.`,
      `Full text of the ${latestVersion} docs: [llms-full.txt](${siteUrl}/llms-full.txt); Chinese: [llms.zh.txt](${siteUrl}/llms.zh.txt)`,
      'Each page below is also served as HTML at the same URL without `.md`.',
    ],
    optional: 'Optional',
    archived: (version) =>
      `Archived docs for projects still on Nino ${version}; the API and binary format differ from ${latestVersion}.`,
  },
  zh: {
    facts: [
      // URLs are Markdown links: bare URLs followed by full-width punctuation
      // (。）：) are misread by link extractors.
      '安装：`dotnet add package Nino --prerelease`（[NuGet](https://www.nuget.org/packages/Nino)）；Unity：`openupm add com.jasonxudeveloper.nino`',
      '可选包：`Nino.Immutable`（System.Collections.Immutable 中的类型）、`Nino.AspNetCore`（用于 `application/x-nino` 的 ASP.NET Core MVC 格式化器与 Minimal API 请求体）和 `Nino.Codegen`（每次构建后生成 TypeScript、Go 和 Rust 类型与编解码器；命令行工具 `nino-gen` 即 `Nino.Codegen.Tool`）',
      'v4 在 NuGet 上仍是预发行版：不加 `--prerelease` 时 NuGet 会安装稳定版 3.9.x，它是测试 v4 功能的过渡版本，与 v4 不兼容。',
      'Go、Rust 和 TypeScript：使用 nino-gen 从你的 C# `[NinoType]` 生成的代码，运行时从 4.0.0-rc.8 起随每个版本发布：`go get github.com/JasonXuDeveloper/Nino/runtimes/go/v4`（[Go 模块](https://pkg.go.dev/github.com/JasonXuDeveloper/Nino/runtimes/go/v4)）、`cargo add nino-serialization`（[crates.io](https://crates.io/crates/nino-serialization)，库名 `nino`）、`npm install nino-serialization`（[npm](https://www.npmjs.com/package/nino-serialization)），读写的字节与 .NET 相同',
      'Unity 2022.3+ 的 Mono 与 IL2CPP，以及 HybridCLR 热更新程序集，无需初始化调用；安装 `com.unity.burst` 后，元组和结构体数组以及 Latin-1 字符串由 Burst 编译的 SIMD 内核搬运。Godot 4 的 .NET 项目直接使用 NuGet 包',
      '分析器：写代码时报告 NINO001 至 NINO029 诊断，多数附带代码修复，包含在 `Nino` 包中；nino-gen 另有 NINOGEN001 至 NINOGEN004',
      'AI 编程助手：`npx skills add JasonXuDeveloper/Nino` 安装 `nino-serialization` skill（Claude Code、Codex、Cursor、Copilot 等）',
      '用法：用 `[NinoType]` 标记类、结构体、记录或接口，然后调用 `NinoSerializer.Serialize(value)` 和 `NinoDeserializer.Deserialize<T>(bytes)`',
      ...(headlineSerialize
        ? [
            `性能：在同一次基准测试中，序列化最高比 MemoryPack 快 ${headlineSerialize} 倍；参见 [Nino 对比 MemoryPack](${siteUrl}/zh/docs/${latestVersion}/vs-memorypack)`,
          ]
        : []),
      `源码与问题反馈：[GitHub](${githubUrl})（MIT 协议）`,
      `本文档对应当前版本 Nino ${latestVersion}，其二进制格式与 v3 不兼容。`,
      `${latestVersion} 文档全文：[llms-full.zh.txt](${siteUrl}/llms-full.zh.txt)。英文版：[llms.txt](${siteUrl}/llms.txt)`,
      '下列每个页面去掉 `.md` 即为对应的 HTML 页面。',
    ],
    optional: 'Optional',
    archived: (version) =>
      `仍在使用 Nino ${version} 的项目可参考的旧版本文档；其 API 与二进制格式均与 ${latestVersion} 不同。`,
  },
};

interface Section {
  name: string;
  pages: Page[];
}

/**
 * Sidebar names of folder index pages ("Advanced Guides" rather than the
 * page's own title, "Overview"), so llms.txt links read well out of context.
 */
const folderLabels = new Map<string, string>();

/** The latest version's pages, grouped and ordered like the sidebar. */
function sidebarSections(locale: Locale): Section[] {
  const byUrl = new Map(source.getPages(locale).map((p) => [p.url, p]));
  const root = source
    .getPageTree(locale)
    .children.find(
      (node): node is PageTree.Folder =>
        node.type === 'folder' &&
        (node.index?.url === `/${locale}/docs/${latestVersion}` ||
          node.children.some(
            (child) =>
              child.type === 'page' &&
              child.url === `/${locale}/docs/${latestVersion}`,
          )),
    );
  const sections: Section[] = [];
  const seen = new Set<string>();
  let current: Section | undefined;

  function add(url: string | undefined) {
    const page = url ? byUrl.get(url) : undefined;
    if (!page || seen.has(page.url)) return;
    seen.add(page.url);
    if (!current) {
      current = { name: 'Docs', pages: [] };
      sections.push(current);
    }
    current.pages.push(page);
  }

  function walk(nodes: PageTree.Node[]) {
    for (const node of nodes) {
      if (node.type === 'separator') {
        current = { name: String(node.name ?? ''), pages: [] };
        sections.push(current);
      } else if (node.type === 'page') {
        add(node.url);
      } else if (node.type === 'folder') {
        // The index page is either the folder's own index or, when meta.json
        // lists "index" among its pages, the child page every sibling nests under.
        const pages = node.children.filter((c) => c.type === 'page');
        const indexUrl =
          node.index?.url ??
          pages.find((p) =>
            pages.every((o) => o === p || o.url.startsWith(`${p.url}/`)),
          )?.url;
        if (indexUrl && typeof node.name === 'string')
          folderLabels.set(indexUrl, node.name);
        add(node.index?.url);
        walk(node.children);
      }
    }
  }
  if (root) {
    add(root.index?.url);
    walk(root.children);
  }
  // Pages missing from the sidebar still belong in the index.
  const rest = source
    .getPages(locale)
    .filter((page) => isLatest(page) && !seen.has(page.url));
  if (rest.length > 0) sections.push({ name: 'More', pages: rest });
  return sections.filter((section) => section.pages.length > 0);
}

/** llms.txt (https://llmstxt.org): summary, key facts and the Markdown pages */
function llmsList(locale: Locale) {
  const t = llmsCopy[locale];
  const lines = [
    '# Nino',
    '',
    `> ${productSummary[locale]}`,
    '',
    ...t.facts.map((fact) => `- ${fact}`),
    '',
  ];
  for (const section of sidebarSections(locale)) {
    lines.push(`## ${section.name}`, '');
    for (const page of section.pages) {
      const description = page.data.description
        ? `: ${page.data.description}`
        : '';
      lines.push(
        `- [${folderLabels.get(page.url) ?? page.data.title}](${siteUrl}${markdownPath(page.url)})${description}`,
      );
    }
    lines.push('');
  }
  lines.push(`## ${t.optional}`, '');
  for (const version of versions) {
    if (version === latestVersion) continue;
    const index = source.getPage([version], locale);
    if (!index) continue;
    lines.push(
      `- [Nino ${version}](${siteUrl}${markdownPath(index.url)}): ${t.archived(version)}`,
    );
  }
  return `${lines.join('\n')}\n`;
}

/** Every page of the latest version, in sidebar order, as one document */
async function llmsFull(locale: Locale) {
  const pages = sidebarSections(locale).flatMap((section) => section.pages);
  const header = [
    `# Nino ${latestVersion} ${locale === 'zh' ? '文档' : 'documentation'}`,
    '',
    `> ${productSummary[locale]}`,
    '',
  ].join('\n');
  const bodies = await Promise.all(pages.map(markdownOf));
  return `${header}\n${bodies.join('\n\n---\n\n')}`;
}

/* ------------------------------------------------------------------ */
/* Social cards                                                        */
/* ------------------------------------------------------------------ */

function cards(): Card[] {
  const list: Card[] = [
    {
      url: '/en',
      lang: 'en',
      eyebrow: 'Nino',
      title: 'High-performance binary serializer for C# and .NET',
      description:
        'Source-generated, zero GC on hot paths. For .NET, Unity (IL2CPP, HybridCLR) and Godot, with the same bytes in TypeScript, Go and Rust.',
    },
    {
      url: '/zh',
      lang: 'zh',
      eyebrow: 'Nino',
      title: '高性能 C# / .NET 二进制序列化库',
      description:
        '基于源生成器，热路径零 GC。支持 .NET、Unity（IL2CPP、HybridCLR）和 Godot，TypeScript、Go 与 Rust 读写相同的字节。',
    },
  ];
  for (const page of source.getPages()) {
    const lang = localeOf(page);
    const seo = {
      lang,
      version: versionOf(page),
      title: page.data.title,
      description: page.data.description,
    };
    list.push({
      url: page.url,
      lang,
      eyebrow: `Nino ${seo.version} ${lang === 'zh' ? '文档' : 'Docs'}`,
      title: page.data.title,
      description: docDescription({
        ...seo,
        latest: isLatest(page),
        url: page.url,
        alternates: {},
        breadcrumbs: [],
      }),
    });
  }
  return list;
}

/* ------------------------------------------------------------------ */

async function main() {
  // Cloudflare Pages serves the 404.html closest to an unknown path (status
  // 404): /zh/404.html under /zh, /en/404.html under /en, /404.html elsewhere.
  // It is shown at any URL, so it must not hydrate: the router would try to
  // load that URL.
  for (const page of ['404', 'en/404', 'zh/404']) {
    const dir = path.join(outDir, page);
    const html = await fs.readFile(path.join(dir, 'index.html'), 'utf8');
    await write(
      `${page}.html`,
      html
        .replace(/<link rel="modulepreload"[^>]*>/g, '')
        .replace(/<script type="module"[\s\S]*?<\/script>/g, '')
        .replace(/<script>[^<]*__reactRouter[\s\S]*?<\/script>/g, ''),
    );
    await fs.rm(dir, { recursive: true, force: true });
  }
  // React Router's fallback for paths it did not prerender: nothing serves it
  // (unknown paths get a 404.html), so it would only be a stray 200 page.
  await fs.rm(path.join(outDir, '__spa-fallback.html'), { force: true });

  const moved = await flattenPages(outDir);

  const tasks: Promise<unknown>[] = [
    write('sitemap.xml', sitemap()),
    write('robots.txt', robots()),
  ];
  for (const locale of locales) {
    const list = llmsList(locale);
    const full = await llmsFull(locale);
    const suffix = locale === 'en' ? '' : `.${locale}`;
    tasks.push(
      write(`llms${suffix}.txt`, list),
      write(`llms-full${suffix}.txt`, full),
      // Also under the language prefix: /zh/llms.txt
      write(`${locale}/llms.txt`, list),
      write(`${locale}/llms-full.txt`, full),
    );
  }

  // Markdown next to each page (/en/docs/v4/start.md), for LLMs and the
  // "Copy Markdown" page action; .mdx is the older URL of the same file.
  for (const page of source.getPages()) {
    tasks.push(
      markdownOf(page).then((markdown) =>
        Promise.all([
          write(`${markdownPath(page.url).slice(1)}`, markdown),
          write(`${page.url.slice(1)}.mdx`, markdown),
        ]),
      ),
    );
  }

  // The social cards are independent of everything above: draw them meanwhile.
  tasks.push(writeCards(cards(), outDir, path.resolve('public/og.png')));
  await Promise.all(tasks);
  await checkSitemap();

  console.log(
    `Wrote static files to ${path.relative('.', outDir)} (${moved} pages moved to .html)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

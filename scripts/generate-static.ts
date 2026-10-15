/**
 * Runs after `react-router build`: writes the files that are not pages
 * (404.html, sitemap, robots.txt, llms.txt, raw Markdown of each page).
 */
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { source } from '../src/lib/source';
import { latestVersion, versions } from '../src/lib/versions';

const siteUrl = 'https://nino.xgamedev.net';
const outDir = path.resolve('build/client');
const locales = ['en', 'zh'] as const;

type Page = ReturnType<typeof source.getPages>[number];

async function write(file: string, content: string) {
  const target = path.join(outDir, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content);
}

async function markdownOf(page: Page) {
  const body = await page.data.getText('processed');
  return `# ${page.data.title}\n\nURL: ${siteUrl}${page.url}\n\n${body}`;
}

// Newest version first, as in the version switcher.
function byVersion(a: Page, b: Page) {
  const rank = (page: Page) =>
    versions.indexOf(page.slugs[0] as (typeof versions)[number]);
  return rank(a) - rank(b);
}

function sitemap() {
  const urls = ['/en', '/zh'];
  for (const locale of locales) {
    for (const page of source.getPages(locale).sort(byVersion))
      urls.push(page.url);
  }
  const entries = urls
    .map((url) => `  <url><loc>${siteUrl}${url}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function llmsList(locale: (typeof locales)[number]) {
  const lines = [
    '# Nino',
    '',
    '> The fastest binary serializer for C#: source-generated, zero-allocation and thread-safe, for Unity, Godot and .NET servers.',
    '',
  ];
  for (const page of source.getPages(locale)) {
    if (page.slugs[0] !== latestVersion) continue;
    const description = page.data.description
      ? `: ${page.data.description}`
      : '';
    lines.push(
      `- [${page.data.title}](${siteUrl}${page.url}.mdx)${description}`,
    );
  }
  return `${lines.join('\n')}\n`;
}

async function llmsFull(locale: (typeof locales)[number]) {
  const pages = source
    .getPages(locale)
    .filter((page) => page.slugs[0] === latestVersion);
  return (await Promise.all(pages.map(markdownOf))).join('\n\n---\n\n');
}

async function main() {
  // Cloudflare serves /404.html (status 404) for unknown paths. It is shown at
  // any URL, so it must not hydrate: the router would try to load that URL.
  const notFound = await fs.readFile(
    path.join(outDir, '404/index.html'),
    'utf8',
  );
  await write(
    '404.html',
    notFound
      .replace(/<link rel="modulepreload"[^>]*>/g, '')
      .replace(/<script type="module"[\s\S]*?<\/script>/g, '')
      .replace(/<script>[^<]*__reactRouter[\s\S]*?<\/script>/g, ''),
  );

  const tasks: Promise<void>[] = [
    write('sitemap.xml', sitemap()),
    write(
      'robots.txt',
      `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
    ),
    write('llms.txt', llmsList('en')),
    write('llms.zh.txt', llmsList('zh')),
    write('llms-full.txt', await llmsFull('en')),
    write('llms-full.zh.txt', await llmsFull('zh')),
  ];

  // Raw Markdown next to each page (/en/docs/v4/start.mdx), used by the
  // "Copy Markdown" and "View as Markdown" page actions.
  for (const locale of locales) {
    for (const page of source.getPages(locale)) {
      tasks.push(write(`${page.url.slice(1)}.mdx`, await markdownOf(page)));
    }
  }

  await Promise.all(tasks);
  console.log(`Wrote static files to ${path.relative('.', outDir)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

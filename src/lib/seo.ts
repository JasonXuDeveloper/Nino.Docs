/**
 * Page metadata for search engines, social cards and answer engines: titles,
 * canonical and hreflang links, Open Graph / Twitter cards and JSON-LD.
 * Used by the `meta` exports of app/routes/home.tsx and app/routes/docs.tsx.
 *
 * Archived versions (every version but `latestVersion`) are `noindex, follow`:
 * their APIs differ from v4, so they must not compete with the current docs
 * in search results or AI answers, while readers who need them still reach
 * them through the version switcher. They are also left out of the sitemap
 * and of llms.txt (except one "Optional" link per version).
 */
import type { MetaDescriptor } from 'react-router';
import type { Locale } from './i18n';
import { release } from './release';
import {
  author,
  codegenNugetUrl,
  cratesUrl,
  githubUrl,
  goModuleUrl,
  languageTag,
  licenseUrl,
  npmUrl,
  nugetUrl,
  ogLocale,
  openUpmUrl,
  productSummary,
  siteUrl,
} from './site';

const otherLocale = (lang: Locale): Locale => (lang === 'zh' ? 'en' : 'zh');

/** The social card of a page: /og/en/docs/v4/start.png, /og/zh.png */
export function ogImagePath(url: string) {
  return `/og${url}.png`;
}

/** The Markdown copy of a docs page, for LLMs: /en/docs/v4/start.md */
export function markdownPath(url: string) {
  return `${url}.md`;
}

const ids = {
  website: `${siteUrl}/#website`,
  software: `${siteUrl}/#software`,
  author: `${siteUrl}/#author`,
};

const softwareRef = {
  '@type': 'SoftwareSourceCode',
  '@id': ids.software,
  name: 'Nino',
  codeRepository: githubUrl,
  // C# for .NET, Unity and Godot; the other three through nino-gen's code
  programmingLanguage: ['C#', 'TypeScript', 'Go', 'Rust'],
};

/** What people search for, per language: categories and platforms, no superlatives */
const keywords: Record<Locale, string> = {
  en: 'C# binary serializer, .NET serialization, high-performance serializer, source generator, zero allocation, MemoryPack alternative, MessagePack alternative, protobuf-net alternative, Unity serializer, IL2CPP, HybridCLR, Burst, Godot, NativeAOT, ASP.NET Core, cross-language binary serialization, TypeScript, Go, Rust, RPC, message queue, cache, IPC',
  zh: 'C# 序列化, .NET 序列化, 二进制序列化, 高性能序列化, 源生成器, 零 GC, MemoryPack 替代, MessagePack 替代, Unity 序列化, IL2CPP, HybridCLR 热更新, Burst, Godot, NativeAOT, ASP.NET Core, 跨语言序列化, TypeScript, Go, Rust, RPC, 消息队列, 缓存, 进程间通信',
};

const authorNode = {
  '@type': 'Person',
  '@id': ids.author,
  name: author.name,
  url: author.url,
};

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: `${siteUrl}/`,
    name: 'Nino',
    alternateName: 'Nino Documentation',
    inLanguage: [languageTag.en, languageTag.zh],
    publisher: { '@id': ids.author },
  };
}

interface Alternates {
  en?: string;
  zh?: string;
  /** The x-default page; the English page when not given. */
  xDefault?: string;
}

function hreflangLinks(alternates: Alternates): MetaDescriptor[] {
  const links: MetaDescriptor[] = [];
  const link = (hrefLang: string, href: string) =>
    links.push({
      tagName: 'link',
      rel: 'alternate',
      hrefLang,
      href: `${siteUrl}${href}`,
    });
  if (alternates.en) link(languageTag.en, alternates.en);
  if (alternates.zh) {
    // Generic Chinese plus the region tag used for <html lang>
    link('zh', alternates.zh);
    link(languageTag.zh, alternates.zh);
  }
  const fallback = alternates.xDefault ?? alternates.en ?? alternates.zh;
  if (fallback) link('x-default', fallback);
  return links;
}

interface CommonInput {
  lang: Locale;
  url: string;
  title: string;
  description: string;
  imageAlt: string;
  alternates: Alternates;
  type: 'website' | 'article';
  indexable: boolean;
}

function commonMeta(input: CommonInput): MetaDescriptor[] {
  const { lang, url, title, description, alternates, indexable } = input;
  const canonical = `${siteUrl}${url}`;
  const image = `${siteUrl}${ogImagePath(url)}`;
  const other = otherLocale(lang);
  return [
    { title },
    { name: 'description', content: description },
    {
      name: 'robots',
      content: indexable
        ? 'index, follow, max-image-preview:large, max-snippet:-1'
        : 'noindex, follow',
    },
    { tagName: 'link', rel: 'canonical', href: canonical },
    ...(indexable ? hreflangLinks(alternates) : []),
    { property: 'og:type', content: input.type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    { property: 'og:locale', content: ogLocale[lang] },
    ...(alternates[other]
      ? [{ property: 'og:locale:alternate', content: ogLocale[other] }]
      : []),
    { property: 'og:image', content: image },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: input.imageAlt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: input.imageAlt },
  ];
}

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */

export function homeMeta({
  lang,
  title,
  description,
  faq = [],
}: {
  lang: Locale;
  title: string;
  description: string;
  /** The home page's visible FAQ, as FAQPage JSON-LD */
  faq?: { question: string; answer: string }[];
}): MetaDescriptor[] {
  const url = `/${lang}`;
  const softwareDescription = productSummary[lang];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      authorNode,
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}${url}#webpage`,
        url: `${siteUrl}${url}`,
        name: title,
        description,
        inLanguage: languageTag[lang],
        isPartOf: { '@id': ids.website },
        about: { '@id': ids.software },
        primaryImageOfPage: `${siteUrl}${ogImagePath(url)}`,
      },
      {
        ...softwareRef,
        description: softwareDescription,
        url: `${siteUrl}/en`,
        license: licenseUrl,
        // The newest release (src/data/release.json), synced before each build
        version: release.version,
        author: { '@id': ids.author },
        runtimePlatform: [
          '.NET',
          '.NET Standard 2.0',
          'Unity',
          'Godot',
          'Node.js',
          'Web browsers',
          'Go',
          'Rust',
        ],
        keywords: keywords[lang],
        sameAs: [
          githubUrl,
          nugetUrl,
          openUpmUrl,
          codegenNugetUrl,
          npmUrl,
          cratesUrl,
          goModuleUrl,
        ],
        targetProduct: {
          '@type': 'SoftwareApplication',
          name: 'Nino',
          applicationCategory: 'DeveloperApplication',
          applicationSubCategory: 'Serialization library',
          softwareVersion: release.version,
          operatingSystem:
            'Cross-platform (any .NET Standard 2.0 runtime, Unity, Godot; Node.js and browsers, Go and Rust through generated code)',
          downloadUrl: nugetUrl,
          installUrl: nugetUrl,
          softwareRequirements:
            '.NET Standard 2.0 or later; Unity 2022.3 or later; Roslyn 4.3 or later and C# 9 or later for the source generator; TypeScript 5.7+, Go 1.22+ or Rust 1.88+ for generated code',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      },
      ...(faq.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${siteUrl}${url}#faq`,
              url: `${siteUrl}${url}`,
              inLanguage: languageTag[lang],
              isPartOf: { '@id': ids.website },
              mainEntity: faq.map(({ question, answer }) => ({
                '@type': 'Question',
                name: question,
                acceptedAnswer: { '@type': 'Answer', text: answer },
              })),
            },
          ]
        : []),
    ],
  };

  return [
    ...commonMeta({
      lang,
      url,
      title,
      description,
      imageAlt: title,
      // x-default is the root, which sends each visitor to their language (functions/[[path]].ts): Google's
      // recommendation for an auto-redirecting home page.
      alternates: { en: '/en', zh: '/zh', xDefault: '/' },
      type: 'website',
      indexable: true,
    }),
    { 'script:ld+json': jsonLd },
  ];
}

/* ------------------------------------------------------------------ */
/* Docs pages                                                          */
/* ------------------------------------------------------------------ */

export interface DocSeo {
  lang: Locale;
  version: string;
  latest: boolean;
  url: string;
  title: string;
  seoTitle?: string;
  description?: string;
  /** ISO date of the last commit that changed the page */
  lastModified?: string;
  /** ISO date of the commit that added the page */
  published?: string;
  alternates: Alternates;
  /** From the docs home to the page itself */
  breadcrumbs: { name: string; url: string }[];
  /** Question and answer pairs of an FAQ page */
  faq?: { question: string; answer: string }[];
}

export function docTitle(seo: DocSeo) {
  if (seo.seoTitle) return seo.seoTitle;
  const docs = seo.lang === 'zh' ? '文档' : 'Docs';
  return `${seo.title} – Nino ${seo.version} ${docs}`;
}

export function docDescription(seo: DocSeo) {
  if (seo.description) return seo.description;
  return seo.lang === 'zh'
    ? `${seo.title}：Nino ${seo.version}（旧版本）文档，C# 二进制序列化库。`
    : `${seo.title}: documentation for Nino ${seo.version} (an archived version), the C# binary serializer.`;
}

export function docMeta(seo: DocSeo): MetaDescriptor[] {
  const title = docTitle(seo);
  const description = docDescription(seo);
  const canonical = `${siteUrl}${seo.url}`;
  const inLanguage = languageTag[seo.lang];

  const graph: Record<string, unknown>[] = [
    websiteNode(),
    authorNode,
    {
      '@type': 'TechArticle',
      '@id': `${canonical}#article`,
      headline: seo.title,
      name: title,
      description,
      url: canonical,
      mainEntityOfPage: canonical,
      inLanguage,
      ...(seo.published ? { datePublished: seo.published } : {}),
      ...(seo.lastModified ? { dateModified: seo.lastModified } : {}),
      image: `${siteUrl}${ogImagePath(seo.url)}`,
      isPartOf: { '@id': ids.website },
      author: { '@id': ids.author },
      publisher: { '@id': ids.author },
      about: softwareRef,
      version: seo.version,
      isAccessibleForFree: true,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: seo.breadcrumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: `${siteUrl}${crumb.url}`,
      })),
    },
  ];

  if (seo.faq && seo.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      url: canonical,
      inLanguage,
      isPartOf: { '@id': ids.website },
      mainEntity: seo.faq.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    });
  }

  return [
    ...commonMeta({
      lang: seo.lang,
      url: seo.url,
      title,
      description,
      imageAlt: title,
      alternates: seo.alternates,
      type: 'article',
      indexable: seo.latest,
    }),
    ...(seo.published
      ? [{ property: 'article:published_time', content: seo.published }]
      : []),
    ...(seo.lastModified
      ? [{ property: 'article:modified_time', content: seo.lastModified }]
      : []),
    {
      tagName: 'link',
      rel: 'alternate',
      type: 'text/markdown',
      href: `${siteUrl}${markdownPath(seo.url)}`,
      title: 'Markdown',
    },
    { 'script:ld+json': { '@context': 'https://schema.org', '@graph': graph } },
  ];
}

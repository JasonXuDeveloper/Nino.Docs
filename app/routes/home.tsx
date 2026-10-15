import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import { ByteMap } from '@/components/byte-map';
import { BenchmarkChart } from '@/components/charts';
import { getLocale, type Locale } from '@/lib/i18n';
import { baseOptions } from '@/lib/layout.shared';
import { latestVersion } from '@/lib/versions';
import type { Route } from './+types/home';

const siteUrl = 'https://nino.xgamedev.net';

interface Item {
  label: string;
  text: string;
  href: string;
}

/** One measured claim: text before the number, the number, text after */
interface Fact {
  before: string;
  value: string;
  after: string;
  href: string;
}

const copy: Record<
  Locale,
  {
    title: string;
    description: string;
    headline: string;
    sub: string;
    start: string;
    whatsNew: string;
    facts: Fact[];
    benchTitle: string;
    benchText: string;
    benchLinks: [string, string];
    featuresTitle: string;
    features: Item[];
    guides: [string, string];
    useCases: Item[];
    oldVersions: string;
    license: string;
  }
> = {
  en: {
    title: 'Nino - The fastest binary serializer for C#',
    description:
      'Nino is a source-generated binary serializer for C#: up to 4.3× faster than MemoryPack, zero GC allocations, for Unity, Godot and .NET servers.',
    headline: 'The fastest binary serializer for C#',
    sub: 'Mark a type with [NinoType] and Nino generates its serializer at compile time. For Unity, Godot and .NET servers.',
    start: 'Get started',
    whatsNew: "What's new in v4",
    facts: [
      {
        before: 'Serializes up to ',
        value: '4.3×',
        after: ' faster than MemoryPack.',
        href: 'vs-memorypack',
      },
      {
        before: 'Deserializes into pooled objects up to ',
        value: '4.9×',
        after: ' faster than MemoryPack overwriting them.',
        href: 'whats-new#deserialize-into-existing-objects',
      },
      {
        before: '',
        value: '0 GC',
        after:
          ': zero GC allocations when serializing or deserializing into pooled objects.',
        href: 'pooling',
      },
      {
        before: 'Generated code compiles ',
        value: '44×',
        after: ' faster than with Nino v3.',
        href: 'v3-vs-v4',
      },
    ],
    benchTitle: 'Benchmarks',
    benchText:
      'BenchmarkDotNet on .NET 10. Nino v4 and MemoryPack 1.21.4 ran side by side; build times are against Nino v3.3.13.',
    benchLinks: ['All benchmarks', 'Nino vs MemoryPack'],
    featuresTitle: 'Features',
    features: [
      {
        label: 'No reflection',
        text: 'Formatters are generated at compile time, so Nino runs on IL2CPP, NativeAOT and HybridCLR.',
        href: 'platforms',
      },
      {
        label: 'Reuse what you have',
        text: 'Deserialize into existing objects and pools instead of allocating new ones.',
        href: 'pooling',
      },
      {
        label: 'One file per type',
        text: 'The incremental generator writes 16× less code than v3 and rebuilds only what changed.',
        href: 'v3-vs-v4',
      },
      {
        label: 'Data that evolves',
        text: "Version-tolerant and keyed types let old and new builds read each other's data.",
        href: 'evolving-data',
      },
      {
        label: 'Polymorphism',
        text: 'Subclasses and interfaces come back as the type that was written.',
        href: 'polymorphism',
      },
      {
        label: 'Same bytes everywhere',
        text: 'CoreCLR, Mono and IL2CPP, 64-bit and 32-bit all read and write one format.',
        href: 'platforms',
      },
    ],
    guides: ['Guides for ', ' and '],
    useCases: [
      { label: 'Unity', text: '', href: 'advanced/unity' },
      { label: 'Godot', text: '', href: 'platforms#godot' },
      { label: 'game servers', text: '', href: 'advanced/networking' },
      { label: 'save games', text: '', href: 'advanced/persistence' },
      {
        label: 'high-throughput services',
        text: '',
        href: 'advanced/high-performance',
      },
    ],
    oldVersions: 'Older versions:',
    license: 'MIT License',
  },
  zh: {
    title: 'Nino - 最快的 C# 二进制序列化库',
    description:
      'Nino 是基于源生成器的 C# 二进制序列化库：最高比 MemoryPack 快 4.3 倍，零 GC 分配，适用于 Unity、Godot 与 .NET 服务端。',
    headline: '最快的 C# 二进制序列化库',
    sub: '给类型标上 [NinoType]，Nino 会在编译期生成它的序列化代码。适用于 Unity、Godot 与 .NET 服务端。',
    start: '快速开始',
    whatsNew: 'v4 新特性',
    facts: [
      {
        before: '序列化比 MemoryPack 最高快 ',
        value: '4.3 倍',
        after: '。',
        href: 'vs-memorypack',
      },
      {
        before: '反序列化到池化对象，比 MemoryPack 覆盖写入最高快 ',
        value: '4.9 倍',
        after: '。',
        href: 'whats-new#deserialize-into-existing-objects',
      },
      {
        before: '',
        value: '0 GC',
        after: '：序列化、复用池化对象反序列化零 GC 分配。',
        href: 'pooling',
      },
      {
        before: '生成的代码编译比 Nino v3 快 ',
        value: '44 倍',
        after: '。',
        href: 'v3-vs-v4',
      },
    ],
    benchTitle: '基准测试',
    benchText:
      'BenchmarkDotNet，.NET 10。Nino v4 与 MemoryPack 1.21.4 在同一次运行中对比；构建时间与 Nino v3.3.13 对比。',
    benchLinks: ['全部基准测试', 'Nino 与 MemoryPack 对比'],
    featuresTitle: '特性',
    features: [
      {
        label: '无反射',
        text: '格式化器在编译期生成，可用于 IL2CPP、NativeAOT 与 HybridCLR。',
        href: 'platforms',
      },
      {
        label: '复用已有对象',
        text: '反序列化到已有对象与对象池，而不是分配新对象。',
        href: 'pooling',
      },
      {
        label: '每个类型一个文件',
        text: '增量生成器的代码量比 v3 少 16 倍，只重新生成改动的部分。',
        href: 'v3-vs-v4',
      },
      {
        label: '数据可演进',
        text: '版本兼容与键控类型让新旧版本互相读取对方的数据。',
        href: 'evolving-data',
      },
      {
        label: '多态',
        text: '子类与接口反序列化后仍是写入时的类型。',
        href: 'polymorphism',
      },
      {
        label: '处处同一格式',
        text: 'CoreCLR、Mono 与 IL2CPP，64 位与 32 位，读写同一种格式。',
        href: 'platforms',
      },
    ],
    guides: ['使用指南：', '与'],
    useCases: [
      { label: 'Unity', text: '', href: 'advanced/unity' },
      { label: 'Godot', text: '', href: 'platforms#godot' },
      { label: '游戏服务器', text: '', href: 'advanced/networking' },
      { label: '游戏存档', text: '', href: 'advanced/persistence' },
      { label: '高吞吐量服务', text: '', href: 'advanced/high-performance' },
    ],
    oldVersions: '旧版本：',
    license: 'MIT 许可证',
  },
};

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap',
  },
];

export function meta({ params }: Route.MetaArgs) {
  const lang = getLocale(params.lang);
  const t = copy[lang];

  return [
    { title: t.title },
    { name: 'description', content: t.description },
    { property: 'og:title', content: t.title },
    { property: 'og:description', content: t.description },
    { property: 'og:url', content: `${siteUrl}/${lang}` },
    { property: 'og:locale', content: lang === 'zh' ? 'zh_CN' : 'en_US' },
    { tagName: 'link', rel: 'canonical', href: `${siteUrl}/${lang}` },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'en',
      href: `${siteUrl}/en`,
    },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'zh',
      href: `${siteUrl}/zh`,
    },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'x-default',
      href: `${siteUrl}/en`,
    },
  ];
}

const primaryButton =
  'inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90';
const secondaryButton =
  'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground';

function Guides({ lang, docs }: { lang: Locale; docs: string }) {
  const t = copy[lang];
  const list = t.useCases;
  const sep = lang === 'zh' ? '、' : ', ';
  return (
    <p className="mt-10 max-w-2xl text-fd-muted-foreground">
      {t.guides[0]}
      {list.map((u, i) => (
        <span key={u.href}>
          {i > 0 && (i === list.length - 1 ? t.guides[1] : sep)}
          <Link
            to={`${docs}/${u.href}`}
            className="font-medium text-fd-foreground underline decoration-fd-border underline-offset-4 hover:decoration-fd-primary"
          >
            {u.label}
          </Link>
        </span>
      ))}
      {lang === 'zh' ? '。' : '.'}
    </p>
  );
}

export default function HomePage({ params }: Route.ComponentProps) {
  const lang = getLocale(params.lang);
  const t = copy[lang];
  const docs = `/${lang}/docs/${latestVersion}`;
  const year = new Date().getFullYear();

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="flex flex-1 flex-col">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-12 pb-12 sm:px-6 md:pt-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-center lg:gap-12">
          <div>
            <h1 className="max-w-md text-4xl leading-[1.08] font-semibold tracking-tight text-balance break-keep md:text-5xl lg:text-[2.5rem]">
              {t.headline}
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-fd-muted-foreground">
              {t.sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={`${docs}/start`} className={primaryButton}>
                {t.start}
              </Link>
              <Link to={`${docs}/whats-new`} className={secondaryButton}>
                {t.whatsNew}
              </Link>
            </div>
          </div>

          <ByteMap lang={lang} />

          <ul className="grid gap-x-8 gap-y-4 border-t pt-6 text-[15px] leading-relaxed text-fd-muted-foreground sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            {t.facts.map((f) => (
              <li key={f.value}>
                <Link
                  to={`${docs}/${f.href}`}
                  className="hover:text-fd-foreground"
                >
                  {f.before}
                  <strong className="font-semibold whitespace-nowrap text-fd-foreground tabular-nums">
                    {f.value}
                  </strong>
                  {f.after}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t.benchTitle}
            </h2>
            <p className="mt-2 text-fd-muted-foreground">{t.benchText}</p>
            <BenchmarkChart
              chart={['serialize', 'deserialize', 'reuse', 'compile']}
              lang={lang}
            />
            <p className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              <Link
                to={`${docs}/perf`}
                className="text-fd-primary hover:underline"
              >
                {t.benchLinks[0]}
              </Link>
              <Link
                to={`${docs}/vs-memorypack`}
                className="text-fd-primary hover:underline"
              >
                {t.benchLinks[1]}
              </Link>
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t.featuresTitle}
          </h2>
          <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((f) => (
              <div key={f.label}>
                <dt className="font-semibold">
                  <Link
                    to={`${docs}/${f.href}`}
                    className="hover:text-fd-primary"
                  >
                    {f.label}
                  </Link>
                </dt>
                <dd className="mt-1.5 leading-relaxed text-fd-muted-foreground">
                  {f.text}
                </dd>
              </div>
            ))}
          </dl>
          <Guides lang={lang} docs={docs} />
        </section>

        <footer className="mt-auto border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-x-8 gap-y-2 px-4 py-6 text-sm text-fd-muted-foreground sm:px-6">
            <p>
              {t.oldVersions}{' '}
              <Link
                to={`/${lang}/docs/v3`}
                className="underline underline-offset-4"
              >
                v3
              </Link>
              {lang === 'zh' ? '、' : ', '}
              <Link
                to={`/${lang}/docs/v2`}
                className="underline underline-offset-4"
              >
                v2
              </Link>
            </p>
            <p>
              {t.license}, © {year} JasonXuDeveloper
            </p>
          </div>
        </footer>
      </main>
    </HomeLayout>
  );
}

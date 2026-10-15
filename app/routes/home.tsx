import { HomeLayout } from 'fumadocs-ui/layouts/home';
import {
  ArrowRight,
  Boxes,
  Cpu,
  Gauge,
  GitBranch,
  Hammer,
  Recycle,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router';
import { MemoryPackRace, V3Race } from '@/components/showcase';
import { Stats } from '@/components/stats';
import { getLocale, type Locale } from '@/lib/i18n';
import { baseOptions, githubUrl } from '@/lib/layout.shared';
import { latestVersion } from '@/lib/versions';
import type { Route } from './+types/home';

const siteUrl = 'https://nino.xgamedev.net';

// Text with highlighted parts: plain strings, or one-element arrays.
type Segment = string | [string];

interface Feature {
  icon: typeof Gauge;
  title: string;
  href: string;
  text: Segment[];
}

const copy: Record<
  Locale,
  {
    title: string;
    tagline: string;
    description: string;
    badge: string;
    start: string;
    whatsNew: string;
    perf: string;
    github: string;
    featuresTitle: string;
    features: Feature[];
    codeTitle: string;
    raceTitle: string;
    raceText: string;
    vsV3: string;
    vsMemoryPack: string;
    readMore: string;
    compare: string;
    codeText: string;
    oldVersions: string;
  }
> = {
  en: {
    title: 'Nino - High-performance binary serialization for C#',
    tagline: 'Ultimate high-performance binary serialization library for C#',
    description:
      'Source-generated and reflection-free, for .NET, Unity (Mono and IL2CPP) and HybridCLR.',
    badge: 'Nino v4 is here',
    start: 'Quick Start',
    whatsNew: "What's New",
    perf: 'Performance',
    github: 'GitHub',
    featuresTitle: 'Why Nino',
    features: [
      {
        icon: Gauge,
        title: 'Faster at runtime',
        href: 'whats-new',
        text: [
          'Serializes ',
          ['2.5–4.3×'],
          ' faster than MemoryPack, and deserializes classes and polymorphic types ',
          ['1.16–1.38×'],
          ' faster.',
        ],
      },
      {
        icon: Hammer,
        title: 'Faster to build',
        href: 'v3-vs-v4',
        text: [
          'Generates ',
          ['16×'],
          ' less code than v3, which compiles ',
          ['44×'],
          ' faster. Editing a type re-generates only that type.',
        ],
      },
      {
        icon: Recycle,
        title: 'Zero-allocation reuse',
        href: 'pooling',
        text: [
          'Pooled and in-place deserialization with ',
          ['0 B'],
          " allocated, up to 4.9× faster than MemoryPack's overwrite mode.",
        ],
      },
      {
        icon: GitBranch,
        title: 'Data that evolves',
        href: 'evolving-data',
        text: [
          'Opt-in ',
          ['version tolerance'],
          ', ',
          ['keyed members'],
          ' and ',
          ['reference tracking'],
          ', per type.',
        ],
      },
      {
        icon: Boxes,
        title: 'Born to be versatile',
        href: 'types',
        text: [
          'Records, generics, ',
          ['polymorphism'],
          ', user collections, immutable collections and ',
          ['pluggable formatters'],
          '.',
        ],
      },
      {
        icon: Cpu,
        title: 'Runs everywhere',
        href: 'start',
        text: [
          'Identical bytes on every target framework, CoreCLR, ',
          ['Unity'],
          ' (Mono and IL2CPP) and ',
          ['HybridCLR'],
          ', with no init calls.',
        ],
      },
    ],
    raceTitle: 'Faster than v3. Faster than MemoryPack.',
    raceText:
      'Up to 1.73× faster serialization than v3 3.3.13 and up to 4.3× faster than MemoryPack 1.21.4, with code that compiles 44× faster than v3. BenchmarkDotNet, .NET 10, same machine.',
    vsV3: 'v4 vs v3 (3.3.13)',
    vsMemoryPack: 'v4 vs MemoryPack (1.21.4)',
    readMore: "See what's new in v4",
    compare: 'Honest comparison with MemoryPack',
    codeTitle: 'Mark a type, call Nino',
    codeText:
      'The source generator writes the formatter at compile time. No reflection, no registration.',
    oldVersions: 'Looking for an older version?',
  },
  zh: {
    title: 'Nino - 高性能 C# 二进制序列化库',
    tagline: '终极高性能 C# 二进制序列化库',
    description:
      '基于源生成器、无反射，适用于 .NET、Unity（Mono 与 IL2CPP）以及 HybridCLR。',
    badge: 'Nino v4 正式发布',
    start: '快速开始',
    whatsNew: 'v4 新特性',
    perf: '性能',
    github: 'GitHub',
    featuresTitle: '为什么选择 Nino',
    features: [
      {
        icon: Gauge,
        title: '运行更快',
        href: 'whats-new',
        text: [
          '序列化比 MemoryPack 快 ',
          ['2.5–4.3 倍'],
          '，类与多态类型的反序列化快 ',
          ['1.16–1.38 倍'],
          '。',
        ],
      },
      {
        icon: Hammer,
        title: '构建更快',
        href: 'v3-vs-v4',
        text: [
          '生成的代码比 v3 少 ',
          ['16 倍'],
          '，编译快 ',
          ['44 倍'],
          '。修改一个类型只会重新生成该类型。',
        ],
      },
      {
        icon: Recycle,
        title: '零分配复用',
        href: 'pooling',
        text: [
          '对象池与原地反序列化，分配 ',
          ['0 B'],
          '，比 MemoryPack 的覆盖模式最高快 4.9 倍。',
        ],
      },
      {
        icon: GitBranch,
        title: '让数据演进',
        href: 'evolving-data',
        text: [
          '按类型选择 ',
          ['版本兼容'],
          '、',
          ['键控成员'],
          '与',
          ['引用追踪'],
          '。',
        ],
      },
      {
        icon: Boxes,
        title: '功能全面',
        href: 'types',
        text: [
          '支持记录、泛型、',
          ['多态'],
          '、用户集合、不可变集合以及',
          ['可插拔的格式化器'],
          '。',
        ],
      },
      {
        icon: Cpu,
        title: '随处运行',
        href: 'start',
        text: [
          '所有目标框架、CoreCLR、',
          ['Unity'],
          '（Mono 与 IL2CPP）和 ',
          ['HybridCLR'],
          ' 上字节完全一致，无需初始化调用。',
        ],
      },
    ],
    raceTitle: '比 v3 更快，比 MemoryPack 更快。',
    raceText:
      '序列化最高比 v3 3.3.13 快 1.73 倍，最高比 MemoryPack 1.21.4 快 4.3 倍；生成的代码编译速度是 v3 的 44 倍。BenchmarkDotNet，.NET 10，同一台机器。',
    vsV3: 'v4 对比 v3（3.3.13）',
    vsMemoryPack: 'v4 对比 MemoryPack（1.21.4）',
    readMore: '查看 v4 新特性',
    compare: '与 MemoryPack 的客观对比',
    codeTitle: '标记类型，调用 Nino',
    codeText: '源生成器在编译期生成格式化器。无反射，无需注册。',
    oldVersions: '在找旧版本？',
  },
};

const sample = `using Nino.Core;

[NinoType]
public class GameData
{
    public int Score;
    public string PlayerName;
    public List<Item> Items;
}

byte[] bytes = NinoSerializer.Serialize(data);
GameData copy = NinoDeserializer.Deserialize<GameData>(bytes);`;

export function meta({ params }: Route.MetaArgs) {
  const lang = getLocale(params.lang);
  const t = copy[lang];

  return [
    { title: t.title },
    { name: 'description', content: `${t.tagline}. ${t.description}` },
    { property: 'og:title', content: t.title },
    { property: 'og:description', content: t.tagline },
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

function Highlighted({ text }: { text: Segment[] }) {
  return text.map((part, i) =>
    typeof part === 'string' ? (
      part
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: static text
      <span key={i} className="nino-gradient-text font-semibold">
        {part[0]}
      </span>
    ),
  );
}

export default function HomePage({ params }: Route.ComponentProps) {
  const lang = getLocale(params.lang);
  const t = copy[lang];
  const docs = `/${lang}/docs/${latestVersion}`;

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="flex flex-1 flex-col">
        <section className="nino-hero relative overflow-hidden px-6 pt-16 pb-12 md:pt-24">
          <div className="nino-grid-glow" aria-hidden="true" />
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <img
              src="/logo.png"
              alt="Nino"
              width={128}
              height={128}
              className="nino-logo mb-6 size-24 md:size-32"
            />
            <Link
              to={`${docs}/whats-new`}
              className="mb-5 inline-flex items-center gap-1.5 rounded-full border bg-fd-card/60 px-3 py-1 text-xs font-medium text-fd-muted-foreground backdrop-blur transition-colors hover:text-fd-foreground"
            >
              <Sparkles className="size-3.5 text-fd-primary" />
              {t.badge}
              <ArrowRight className="size-3" />
            </Link>
            <h1 className="nino-gradient-text text-6xl font-extrabold tracking-tight md:text-7xl">
              Nino
            </h1>
            <p className="mt-4 max-w-2xl text-xl font-semibold text-balance md:text-2xl">
              {t.tagline}
            </p>
            <p className="mt-3 max-w-xl text-fd-muted-foreground text-balance">
              {t.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={`${docs}/start`} className="nino-btn nino-btn-primary">
                {t.start}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to={`${docs}/whats-new`}
                className="nino-btn nino-btn-secondary"
              >
                {t.whatsNew}
              </Link>
              <Link to={`${docs}/perf`} className="nino-btn nino-btn-secondary">
                {t.perf}
              </Link>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nino-btn nino-btn-ghost"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-4"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {t.github}
              </a>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            <Stats lang={lang} />
          </div>
        </section>

        <section className="border-t px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold md:text-3xl">{t.raceTitle}</h2>
              <p className="mx-auto mt-3 max-w-3xl text-fd-muted-foreground text-balance">
                {t.raceText}
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-1 text-sm font-semibold text-fd-muted-foreground">
                  {t.vsV3}
                </h3>
                <V3Race lang={lang} />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-fd-muted-foreground">
                  {t.vsMemoryPack}
                </h3>
                <MemoryPackRace lang={lang} />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Link
                to={`${docs}/whats-new`}
                className="nino-btn nino-btn-primary"
              >
                {t.readMore}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to={`${docs}/vs-memorypack`}
                className="nino-btn nino-btn-secondary"
              >
                {t.compare}
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
              {t.featuresTitle}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.features.map((f) => (
                <Link
                  key={f.title}
                  to={`${docs}/${f.href}`}
                  className="nino-card group rounded-xl border bg-fd-card p-5 transition-colors hover:border-fd-primary/50"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-fd-primary/10 p-2 text-fd-primary">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="mb-1.5 font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-fd-muted-foreground">
                    <Highlighted text={f.text} />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t px-6 py-14">
          <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[2fr_3fr]">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">{t.codeTitle}</h2>
              <p className="mt-3 text-fd-muted-foreground">{t.codeText}</p>
              <Link
                to={`${docs}/start`}
                className="nino-btn nino-btn-primary mt-6"
              >
                {t.start}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <pre className="nino-code overflow-x-auto rounded-xl border bg-fd-card p-5 text-[13px] leading-relaxed">
              <code>{sample}</code>
            </pre>
          </div>
        </section>

        <footer className="border-t px-6 py-8 text-center text-sm text-fd-muted-foreground">
          <p>
            {t.oldVersions}{' '}
            <Link to={`/${lang}/docs/v3`} className="underline">
              v3
            </Link>
            {' · '}
            <Link to={`/${lang}/docs/v2`} className="underline">
              v2
            </Link>
          </p>
          <p className="mt-2">
            MIT License · © {new Date().getFullYear()} JasonXuDeveloper
          </p>
        </footer>
      </main>
    </HomeLayout>
  );
}

import { HomeLayout } from 'fumadocs-ui/layouts/home';
import {
  ArrowRight,
  Cpu,
  Gamepad2,
  Gauge,
  GitBranch,
  Globe,
  Hammer,
  Network,
  Recycle,
  Save,
  Server,
  Shapes,
} from 'lucide-react';
import { Link } from 'react-router';
import { BenchmarkChart } from '@/components/charts';
import { headlineStats, StatCards } from '@/components/showcase';
import { cn } from '@/lib/cn';
import { getLocale, type Locale } from '@/lib/i18n';
import { baseOptions, githubUrl } from '@/lib/layout.shared';
import { latestVersion } from '@/lib/versions';
import type { Route } from './+types/home';

const siteUrl = 'https://nino.xgamedev.net';

interface Item {
  icon: typeof Gauge;
  label: string;
  text: string;
  href: string;
}

const copy: Record<
  Locale,
  {
    title: string;
    description: string;
    pill: string;
    headline: [string, string, string];
    sub: string;
    start: string;
    whatsNew: string;
    github: string;
    highlights: Item[];
    benchTitle: string;
    benchText: string;
    benchLinks: [string, string];
    builtFor: string;
    useCases: Item[];
    codeTitle: string;
    codeText: string;
    oldVersions: string;
  }
> = {
  en: {
    title: 'Nino - The fastest binary serializer for C#',
    description:
      'Nino is a source-generated binary serializer for C#: up to 4.3× faster than MemoryPack, zero GC allocations, for Unity, Godot and .NET servers.',
    pill: 'Nino v4 is out',
    headline: ['The fastest ', 'binary serializer', ' for C#.'],
    sub: 'Up to 4.3× faster than MemoryPack, zero allocations, and 44× faster to compile than v3. For Unity, Godot and .NET servers.',
    start: 'Get Started',
    whatsNew: "What's new in v4",
    github: 'GitHub',
    highlights: [
      {
        icon: Gauge,
        label: 'Faster than MemoryPack',
        text: '2.5–4.3× faster serialization, 1.16–1.38× faster deserialization.',
        href: 'vs-memorypack',
      },
      {
        icon: Recycle,
        label: 'Zero allocation',
        text: '0 B when serializing; reuse objects and pools when deserializing.',
        href: 'pooling',
      },
      {
        icon: Cpu,
        label: 'Compile-time, no reflection',
        text: 'Source-generated, so it runs on IL2CPP, NativeAOT and HybridCLR.',
        href: 'platforms',
      },
      {
        icon: Hammer,
        label: 'Incremental generator',
        text: 'One file per type: 16× less code than v3, compiled 44× faster.',
        href: 'v3-vs-v4',
      },
      {
        icon: GitBranch,
        label: 'Data that evolves',
        text: 'Version tolerance, keyed members and reference tracking, per type.',
        href: 'evolving-data',
      },
      {
        icon: Globe,
        label: 'One format everywhere',
        text: 'Identical bytes on CoreCLR, Mono and IL2CPP, 64-bit and 32-bit.',
        href: 'platforms',
      },
    ],
    benchTitle: 'Benchmarks',
    benchText:
      'BenchmarkDotNet on .NET 10, Nino v4 against MemoryPack 1.21.4 in the same run, and against v3 3.3.13 for build time.',
    benchLinks: ['All benchmarks', 'Nino vs MemoryPack'],
    builtFor: 'Built for',
    useCases: [
      {
        icon: Gamepad2,
        label: 'Unity',
        text: 'Mono, IL2CPP and HybridCLR',
        href: 'advanced/unity',
      },
      {
        icon: Shapes,
        label: 'Godot',
        text: 'Godot 4 .NET projects',
        href: 'platforms#godot',
      },
      {
        icon: Network,
        label: 'Game servers',
        text: 'Messages and networking',
        href: 'advanced/networking',
      },
      {
        icon: Save,
        label: 'Save games',
        text: 'Data that survives updates',
        href: 'advanced/persistence',
      },
      {
        icon: Server,
        label: 'Services',
        text: 'High-throughput .NET',
        href: 'advanced/high-performance',
      },
    ],
    codeTitle: 'Mark a type, call Nino',
    codeText:
      'The source generator writes the formatter at compile time. No reflection, no registration.',
    oldVersions: 'Looking for an older version?',
  },
  zh: {
    title: 'Nino - 最快的 C# 二进制序列化库',
    description:
      'Nino 是基于源生成器的 C# 二进制序列化库：最高比 MemoryPack 快 4.3 倍，零 GC 分配，适用于 Unity、Godot 与 .NET 服务端。',
    pill: 'Nino v4 正式发布',
    headline: ['最快的 C# ', '二进制序列化库', '。'],
    sub: '比 MemoryPack 最高快 4.3 倍，零内存分配，编译比 v3 快 44 倍。适用于 Unity、Godot 与 .NET 服务端。',
    start: '快速开始',
    whatsNew: 'v4 新特性',
    github: 'GitHub',
    highlights: [
      {
        icon: Gauge,
        label: '比 MemoryPack 更快',
        text: '序列化快 2.5–4.3 倍，反序列化快 1.16–1.38 倍。',
        href: 'vs-memorypack',
      },
      {
        icon: Recycle,
        label: '零分配',
        text: '序列化 0 B；反序列化时复用对象与对象池。',
        href: 'pooling',
      },
      {
        icon: Cpu,
        label: '编译期生成，无反射',
        text: '源生成器实现，可用于 IL2CPP、NativeAOT 与 HybridCLR。',
        href: 'platforms',
      },
      {
        icon: Hammer,
        label: '增量生成器',
        text: '每个类型一个文件：代码比 v3 少 16 倍，编译快 44 倍。',
        href: 'v3-vs-v4',
      },
      {
        icon: GitBranch,
        label: '数据可演进',
        text: '按类型启用版本兼容、键控成员与引用追踪。',
        href: 'evolving-data',
      },
      {
        icon: Globe,
        label: '处处同一格式',
        text: 'CoreCLR、Mono 与 IL2CPP，64 位与 32 位，字节完全一致。',
        href: 'platforms',
      },
    ],
    benchTitle: '基准测试',
    benchText:
      'BenchmarkDotNet，.NET 10。Nino v4 与 MemoryPack 1.21.4 在同一次运行中对比，构建时间与 v3 3.3.13 对比。',
    benchLinks: ['全部基准测试', 'Nino 与 MemoryPack 对比'],
    builtFor: '适用于',
    useCases: [
      {
        icon: Gamepad2,
        label: 'Unity',
        text: 'Mono、IL2CPP 与 HybridCLR',
        href: 'advanced/unity',
      },
      {
        icon: Shapes,
        label: 'Godot',
        text: 'Godot 4 .NET 项目',
        href: 'platforms#godot',
      },
      {
        icon: Network,
        label: '游戏服务器',
        text: '消息与网络层',
        href: 'advanced/networking',
      },
      {
        icon: Save,
        label: '游戏存档',
        text: '更新后依然可读的数据',
        href: 'advanced/persistence',
      },
      {
        icon: Server,
        label: '服务端',
        text: '高吞吐量 .NET 服务',
        href: 'advanced/high-performance',
      },
    ],
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
  'inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90';
const secondaryButton =
  'inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground';

function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function HomePage({ params }: Route.ComponentProps) {
  const lang = getLocale(params.lang);
  const t = copy[lang];
  const docs = `/${lang}/docs/${latestVersion}`;

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="flex flex-1 flex-col items-center">
        <section className="relative flex w-full flex-col items-center px-6 pt-10 pb-8 md:pt-16 md:pb-10">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,_var(--tw-gradient-stops))] from-fd-primary/8 to-transparent" />

          <div className="flex max-w-3xl flex-col items-center text-center">
            <img
              src="/logo.png"
              alt="Nino"
              width={48}
              height={48}
              className="mb-4 size-12"
            />
            <Link
              to={`${docs}/whats-new`}
              className="mb-4 inline-flex items-center gap-1 rounded-full border border-fd-border bg-fd-secondary/50 px-3 py-1 text-xs font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              {t.pill}
              <ArrowRight className="size-3" />
            </Link>

            <h1 className="text-4xl font-extrabold tracking-tight text-balance break-keep sm:text-5xl md:text-6xl">
              {t.headline[0]}
              <span className="bg-gradient-to-r from-fd-primary to-blue-400 bg-clip-text text-transparent">
                {t.headline[1]}
              </span>
              {t.headline[2]}
            </h1>

            <p className="mt-3 max-w-xl text-base leading-relaxed text-fd-muted-foreground md:text-lg">
              {t.sub}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link to={`${docs}/start`} className={primaryButton}>
                {t.start}
                <ArrowRight className="size-4" />
              </Link>
              <Link to={`${docs}/whats-new`} className={secondaryButton}>
                {t.whatsNew}
              </Link>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryButton}
              >
                <GitHubIcon />
                {t.github}
              </a>
            </div>
          </div>

          <StatCards
            stats={headlineStats(lang)}
            className="mt-8 mb-0 w-full max-w-3xl"
          />
        </section>

        <section className="w-full border-t px-6 py-8">
          <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
            {t.highlights.map((h) => (
              <Link
                key={h.label}
                to={`${docs}/${h.href}`}
                className="group flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0 rounded-md bg-fd-primary/10 p-2 text-fd-primary">
                  <h.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold group-hover:text-fd-primary">
                    {h.label}
                  </p>
                  <p className="text-sm text-fd-muted-foreground">{h.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="w-full border-t px-6 py-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight">{t.benchTitle}</h2>
            <p className="mt-1 text-sm text-fd-muted-foreground">
              {t.benchText}
            </p>
            <BenchmarkChart
              chart={['serialize', 'deserialize', 'reuse', 'compile']}
              lang={lang}
            />
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
              <Link
                to={`${docs}/perf`}
                className="inline-flex items-center gap-1 text-fd-primary hover:underline"
              >
                {t.benchLinks[0]}
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                to={`${docs}/vs-memorypack`}
                className="inline-flex items-center gap-1 text-fd-primary hover:underline"
              >
                {t.benchLinks[1]}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full border-t px-6 py-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-xl font-bold tracking-tight">
              {t.builtFor}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {t.useCases.map((u) => (
                <Link
                  key={u.label}
                  to={`${docs}/${u.href}`}
                  className="rounded-lg border bg-fd-card p-3 transition-colors hover:bg-fd-accent"
                >
                  <u.icon className="mb-2 size-4 text-fd-primary" />
                  <p className="text-sm font-semibold">{u.label}</p>
                  <p className="text-xs text-fd-muted-foreground">{u.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full border-t px-6 py-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {t.codeTitle}
              </h2>
              <p className="mt-2 text-sm text-fd-muted-foreground">
                {t.codeText}
              </p>
            </div>
            <pre className="overflow-x-auto rounded-lg border bg-fd-secondary/50 p-4 text-[13px] leading-relaxed">
              <code>{sample}</code>
            </pre>
            <Link to={`${docs}/start`} className={cn(primaryButton, 'w-fit')}>
              {t.start}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <footer className="w-full border-t px-6 py-6 text-center text-sm text-fd-muted-foreground">
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
          <p className="mt-1">
            MIT License · © {new Date().getFullYear()} JasonXuDeveloper
          </p>
        </footer>
      </main>
    </HomeLayout>
  );
}

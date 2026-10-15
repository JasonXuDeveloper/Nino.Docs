import { HomeLayout } from 'fumadocs-ui/layouts/home';
import {
  ArrowRight,
  Boxes,
  Cpu,
  GitBranch,
  Globe,
  Hammer,
  Recycle,
} from 'lucide-react';
import { Link } from 'react-router';
import { HomeCompare, HomeStats } from '@/components/home-compare';
import { headlineSerialize } from '@/lib/benchmarks';
import { cn } from '@/lib/cn';
import { getLocale, type Locale } from '@/lib/i18n';
import { baseOptions, githubUrl } from '@/lib/layout.shared';
import { latestVersion } from '@/lib/versions';
import type { Route } from './+types/home';

const siteUrl = 'https://nino.xgamedev.net';

interface Highlight {
  icon: typeof Cpu;
  label: string;
  text: string;
}

const copy: Record<
  Locale,
  {
    title: string;
    description: string;
    pill: string;
    headline: [string, string];
    sub: string;
    start: string;
    github: string;
    highlights: Highlight[];
    guides: string;
    useCases: { label: string; href: string }[];
    older: string;
  }
> = {
  en: {
    title: 'Nino - The fastest binary serializer for C#',
    description: `Nino is a source-generated binary serializer for C#: ${headlineSerialize ? `up to ${headlineSerialize}× faster than MemoryPack, ` : ''}zero GC allocations, for Unity, Godot and .NET servers.`,
    pill: 'C# binary serializer · v4',
    headline: ['The fastest binary serializer', 'for C#.'],
    sub: 'Source-generated, with zero GC allocations, for Unity, Godot and .NET servers.',
    start: 'Get Started',
    github: 'View on GitHub',
    highlights: [
      {
        icon: Cpu,
        label: 'Zero reflection',
        text: 'Formatters are generated at compile time: runs on IL2CPP, NativeAOT and HybridCLR.',
      },
      {
        icon: Recycle,
        label: 'Zero allocation',
        text: 'Serialize without garbage; deserialize into existing objects and pools.',
      },
      {
        icon: Boxes,
        label: 'Polymorphism without tags',
        text: 'Subtypes inherit [NinoType] and come back as their runtime type. No union tags to maintain.',
      },
      {
        icon: GitBranch,
        label: 'Data that evolves',
        text: 'Keyed members, version tolerance and reference tracking, chosen per type.',
      },
      {
        icon: Hammer,
        label: 'Incremental generator',
        text: 'One file per type and 16× less code than v3; an edit re-generates only that type.',
      },
      {
        icon: Globe,
        label: 'Same bytes everywhere',
        text: 'CoreCLR, Mono and IL2CPP, 64-bit and 32-bit all read and write one format.',
      },
    ],
    guides: 'Guides:',
    useCases: [
      { label: 'Unity', href: 'advanced/unity' },
      { label: 'Godot', href: 'platforms#godot' },
      { label: 'Game servers', href: 'advanced/networking' },
      { label: 'Save games', href: 'advanced/persistence' },
    ],
    older: 'Older versions:',
  },
  zh: {
    title: 'Nino - 最快的 C# 二进制序列化库',
    description: `Nino 是基于源生成器的 C# 二进制序列化库：${headlineSerialize ? `最高比 MemoryPack 快 ${headlineSerialize} 倍，` : ''}零 GC 分配，适用于 Unity、Godot 与 .NET 服务端。`,
    pill: 'C# 二进制序列化库 · v4',
    headline: ['最快的二进制序列化库', '为 C# 而生。'],
    sub: '源生成器实现，零 GC 分配，适用于 Unity、Godot 与 .NET 服务端。',
    start: '快速开始',
    github: '在 GitHub 上查看',
    highlights: [
      {
        icon: Cpu,
        label: '零反射',
        text: '格式化器在编译期生成：可用于 IL2CPP、NativeAOT 与 HybridCLR。',
      },
      {
        icon: Recycle,
        label: '零分配',
        text: '序列化不产生垃圾；反序列化可复用已有对象与对象池。',
      },
      {
        icon: Boxes,
        label: '无需标签的多态',
        text: '子类自动继承 [NinoType]，按运行时类型还原，无需维护联合标签。',
      },
      {
        icon: GitBranch,
        label: '数据可演进',
        text: '键控成员、版本兼容与引用追踪，按类型选择。',
      },
      {
        icon: Hammer,
        label: '增量生成器',
        text: '每个类型一个文件，代码比 v3 少 16 倍；修改后只重新生成该类型。',
      },
      {
        icon: Globe,
        label: '处处同一格式',
        text: 'CoreCLR、Mono 与 IL2CPP，64 位与 32 位，读写同一种格式。',
      },
    ],
    guides: '使用指南：',
    useCases: [
      { label: 'Unity', href: 'advanced/unity' },
      { label: 'Godot', href: 'platforms#godot' },
      { label: '游戏服务器', href: 'advanced/networking' },
      { label: '游戏存档', href: 'advanced/persistence' },
    ],
    older: '旧版本：',
  },
};

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
  const sep = lang === 'zh' ? '、' : ', ';

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="flex flex-1 flex-col items-center">
        <section className="flex w-full flex-col items-center px-6 pt-10 pb-8 md:pt-16 md:pb-10">
          <div className="flex max-w-5xl flex-col items-center text-center">
            <span className="mb-4 rounded-full border border-fd-border bg-fd-secondary/50 px-3 py-1 text-xs font-medium text-fd-muted-foreground">
              {t.pill}
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight break-keep sm:text-5xl lg:text-6xl">
              {t.headline[0]}
              <br />
              <span className="bg-linear-to-r/oklab from-fd-primary from-35% to-nino-champagne bg-clip-text text-transparent">
                {t.headline[1]}
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-base leading-relaxed text-fd-muted-foreground md:text-lg">
              {t.sub}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={`${docs}/start`}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors',
                  'bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90',
                )}
              >
                {t.start}
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors',
                  'hover:bg-fd-accent hover:text-fd-accent-foreground',
                )}
              >
                <GitHubIcon />
                {t.github}
              </a>
            </div>
          </div>
        </section>

        <section className="w-full border-t px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <HomeStats lang={lang} docs={docs} />
          </div>
        </section>

        <section className="w-full border-t px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <HomeCompare lang={lang} docs={docs} />
          </div>
        </section>

        <section className="w-full border-t px-6 py-8">
          <div className="mx-auto grid max-w-5xl gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.highlights.map((h) => (
              <div key={h.label} className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 rounded-md bg-fd-primary/10 p-2 text-fd-primary">
                  <h.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{h.label}</p>
                  <p className="text-sm text-fd-muted-foreground">{h.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full border-t px-6 py-6">
          <p className="mx-auto max-w-5xl text-center text-sm text-fd-muted-foreground">
            {t.guides}{' '}
            {t.useCases.map((u, i) => (
              <span key={u.href}>
                {i > 0 && sep}
                <Link
                  to={`${docs}/${u.href}`}
                  className="underline underline-offset-4 hover:text-fd-foreground"
                >
                  {u.label}
                </Link>
              </span>
            ))}
            <span className="mx-3 text-fd-border" aria-hidden="true">
              |
            </span>
            {t.older}{' '}
            <Link
              to={`/${lang}/docs/v3`}
              className="underline underline-offset-4 hover:text-fd-foreground"
            >
              v3
            </Link>
            {sep}
            <Link
              to={`/${lang}/docs/v2`}
              className="underline underline-offset-4 hover:text-fd-foreground"
            >
              v2
            </Link>
          </p>
        </section>
      </main>
    </HomeLayout>
  );
}

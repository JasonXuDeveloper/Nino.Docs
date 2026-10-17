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
import { HomeCompare } from '@/components/home-compare';
import { headlineSerialize } from '@/lib/benchmarks';
import { cn } from '@/lib/cn';
import { getLocale, type Locale } from '@/lib/i18n';
import { baseOptions, githubUrl } from '@/lib/layout.shared';
import { homeMeta } from '@/lib/seo';
import { latestVersion } from '@/lib/versions';
import type { Route } from './+types/home';

interface Highlight {
  icon: typeof Cpu;
  label: string;
  text: string;
}

const copy: Record<
  Locale,
  {
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
    description: `Nino is a general-purpose, high-performance binary serializer for C# and .NET: source-generated, ${headlineSerialize ? `up to ${headlineSerialize}× faster than MemoryPack, ` : ''}zero GC on hot paths. For RPC, microservices, message queues, caching, storage and IPC, with Unity and Godot support.`,
    pill: 'C# binary serializer · v4',
    headline: ['The fastest binary serializer', 'for C#.'],
    sub: 'Source-generated, with zero GC on hot paths. For services, networking and RPC, message queues, caching, storage and IPC, on .NET, Unity and Godot alike.',
    start: 'Get Started',
    github: 'View on GitHub',
    highlights: [
      {
        icon: Cpu,
        label: 'Zero reflection',
        text: 'Formatters are generated at compile time, so Nino runs on IL2CPP, NativeAOT and HybridCLR.',
      },
      {
        icon: Recycle,
        label: 'Zero allocation',
        text: 'Serialize without garbage; deserialize into existing objects and pooled instances.',
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
        text: 'One file per type and 14× less code than v3; editing a type re-generates only that type.',
      },
      {
        icon: Globe,
        label: 'Same bytes everywhere',
        text: 'CoreCLR, Mono and IL2CPP, 64-bit and 32-bit all read and write the same format.',
      },
    ],
    guides: 'Guides:',
    useCases: [
      { label: 'Networking and RPC', href: 'advanced/networking' },
      { label: 'Message queues', href: 'advanced/message-queues' },
      { label: 'Caching', href: 'advanced/caching' },
      { label: 'Persistence', href: 'advanced/persistence' },
      { label: 'Zero allocation', href: 'advanced/zero-allocation' },
      { label: 'Unity', href: 'advanced/unity' },
      { label: 'Godot', href: 'platforms#godot' },
    ],
    older: 'Older versions:',
  },
  zh: {
    description: `Nino 是通用的高性能 C# / .NET 二进制序列化库：基于源生成器，${headlineSerialize ? `最高比 MemoryPack 快 ${headlineSerialize} 倍，` : ''}热路径零 GC 分配。适用于 RPC、微服务、消息队列、缓存、存储与进程间通信，同时支持 Unity 和 Godot。`,
    pill: 'C# 二进制序列化库 · v4',
    headline: ['最快的二进制序列化库', '为 C# 而生。'],
    sub: '基于源生成器，热路径零 GC 分配。适用于服务端、网络与 RPC、消息队列、缓存、存储和进程间通信，.NET、Unity 与 Godot 均可使用。',
    start: '快速开始',
    github: '在 GitHub 上查看',
    highlights: [
      {
        icon: Cpu,
        label: '零反射',
        text: '格式化器在编译期生成，所以 IL2CPP、NativeAOT 与 HybridCLR 都能直接使用。',
      },
      {
        icon: Recycle,
        label: '零分配',
        text: '序列化不产生垃圾；反序列化可以直接填充已有对象和池化实例。',
      },
      {
        icon: Boxes,
        label: '无需标签的多态',
        text: '子类型自动继承 [NinoType]，读回时还原为运行时类型，不用维护 Union 标签。',
      },
      {
        icon: GitBranch,
        label: '数据可演进',
        text: '键控成员、版本容错与引用追踪，按类型选择。',
      },
      {
        icon: Hammer,
        label: '增量生成器',
        text: '每个类型一个文件，生成的代码只有 v3 的 1/14；修改一个类型只重新生成这个类型。',
      },
      {
        icon: Globe,
        label: '处处同一格式',
        text: 'CoreCLR、Mono 与 IL2CPP，64 位与 32 位，读写的都是同一种格式。',
      },
    ],
    guides: '使用指南：',
    useCases: [
      { label: '网络与 RPC', href: 'advanced/networking' },
      { label: '消息队列', href: 'advanced/message-queues' },
      { label: '缓存', href: 'advanced/caching' },
      { label: '持久化', href: 'advanced/persistence' },
      { label: '零分配', href: 'advanced/zero-allocation' },
      { label: 'Unity', href: 'advanced/unity' },
      { label: 'Godot', href: 'platforms#godot' },
    ],
    older: '旧版本：',
  },
};

// Search result titles: the product and the category people search for. The page copy above keeps its own headline.
const seoTitle: Record<Locale, string> = {
  en: 'Nino – High-Performance Binary Serializer for C# and .NET',
  zh: 'Nino – 高性能 C# / .NET 二进制序列化库',
};

export function meta({ params }: Route.MetaArgs) {
  const lang = getLocale(params.lang);
  return homeMeta({
    lang,
    title: seoTitle[lang],
    description: copy[lang].description,
  });
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
        <section className="relative isolate flex w-full flex-col items-center px-6 pt-10 pb-10 md:pt-16 md:pb-14">
          <div
            aria-hidden="true"
            className="nino-hero-glow pointer-events-none absolute inset-0 -z-10"
          />
          <div className="flex max-w-5xl flex-col items-center text-center">
            <span className="mb-4 rounded-full border border-fd-border bg-fd-secondary/50 px-3 py-1 text-xs font-medium text-fd-muted-foreground">
              {t.pill}
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight break-keep sm:text-5xl lg:text-6xl">
              {t.headline[0]}
              <br />
              <span className="bg-linear-to-r/oklab from-nino-grad-from from-25% to-nino-grad-to bg-clip-text text-transparent">
                {t.headline[1]}
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-base leading-relaxed text-balance text-fd-muted-foreground md:text-lg">
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

        <section className="w-full border-t px-4 py-12 sm:px-6 md:py-16">
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

import { HomeLayout } from 'fumadocs-ui/layouts/home';
import {
  ArrowRight,
  Boxes,
  Cpu,
  FileCode,
  Gauge,
  GitBranch,
  Globe,
  Hammer,
  ListChecks,
  Recycle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router';
import { HomeCompare } from '@/components/home-compare';
import { HomeInstall } from '@/components/home-install';
import {
  HomeAbout,
  HomeFaq,
  HomeUseCases,
  homeFaq,
} from '@/components/home-sections';
import {
  build,
  headlineMax,
  headlineSerialize,
  otherLibs,
} from '@/lib/benchmarks';
import { cn } from '@/lib/cn';
import { getLocale, type Locale } from '@/lib/i18n';
import { baseOptions } from '@/lib/layout.shared';
import { homeMeta } from '@/lib/seo';
import { githubUrl } from '@/lib/site';
import { latestVersion } from '@/lib/versions';
import type { Route } from './+types/home';

/** v4's generated source against v3's (generator benchmark, `build` in src/lib/benchmarks.ts) */
const generatedSourceRatio = build[0].ratio;

/** The best serialize win over each other library the report measured (headlineMax), e.g. "9.81" */
const otherHeadlines = otherLibs.flatMap((lib) => {
  const max = headlineMax('serialize', lib.key);
  return max ? [{ label: lib.label, max }] : [];
});

/** ", 9.81× than MessagePack and 12.3× than protobuf-net" / "、比 MessagePack 快 9.81 倍……" */
function othersHeadline(zh: boolean, sep: string) {
  const parts = otherHeadlines.map(({ label, max }) =>
    zh ? `比 ${label} 快 ${max} 倍` : `${max}× than ${label}`,
  );
  if (parts.length === 0) return '';
  if (zh) return `${sep}${parts.join(sep)}`;
  return parts.length > 1
    ? `, ${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`
    : `, ${parts[0]}`;
}

/** One of the four things the page proves, with the highlights (by index) that show it */
interface Claim {
  title: string;
  lead: string;
  items: number[];
  href: string;
  link: string;
}

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
    why: string;
    highlights: Highlight[];
    claims: Claim[];
    older: string;
  }
> = {
  en: {
    description: `Nino is a high-performance binary serializer for C# and .NET: source-generated, ${headlineSerialize ? `up to ${headlineSerialize}× faster than MemoryPack${othersHeadline(false, ', ')}, ` : ''}zero GC on hot paths. For RPC, messaging, caching and storage on .NET, NativeAOT, Unity (IL2CPP, HybridCLR) and Godot, with Go, Rust and TypeScript writing and reading the same bytes.`,
    pill: 'Nino v4 · C# binary serializer',
    headline: ['The fastest binary serializer', 'for C#.'],
    sub: 'One binary format, the same bytes on .NET, Unity, Godot, TypeScript, Go and Rust. Source-generated and SIMD-accelerated (AVX-512, AVX2, Arm64, WebAssembly), with zero GC on hot paths and safe on untrusted input: for services, networking and RPC, message queues, caching, storage and IPC.',
    start: 'Get Started',
    github: 'View on GitHub',
    why: 'Why Nino',
    highlights: [
      {
        icon: Cpu,
        label: 'Compile-time formatters',
        text: 'Formatters are generated at compile time, with no reflection over your members, so Nino runs on IL2CPP, NativeAOT and HybridCLR.',
      },
      {
        icon: ShieldCheck,
        label: 'Safe for untrusted data',
        text: 'Crafted bytes cannot crash the process, allocate out of proportion or name a type to create: they throw one exception.',
      },
      {
        icon: Recycle,
        label: 'Zero allocation on hot paths',
        text: 'Serialize into a reused buffer or straight to a Stream without garbage; deserialize into existing objects and pooled instances.',
      },
      {
        icon: Boxes,
        label: 'Polymorphism without tags',
        text: 'Subtypes inherit [NinoType] and come back as their runtime type. No union tags to maintain.',
      },
      {
        icon: GitBranch,
        label: 'Data that evolves',
        text: 'Keyed members, version tolerance and reference tracking, chosen per type; a layout baseline flags a breaking change as you type.',
      },
      {
        icon: Hammer,
        label: 'Incremental generator',
        text: `One file per type and ${generatedSourceRatio}× less code than v3; editing a type re-generates only that type.`,
      },
      {
        icon: Globe,
        label: 'Same bytes everywhere',
        text: 'CoreCLR, Mono and IL2CPP, 64-bit and 32-bit all read and write the same format, and so do the Go, Rust and TypeScript runtimes.',
      },
      {
        icon: Zap,
        label: 'SIMD on every CPU',
        text: 'AVX-512, AVX2 and SSSE3 on x64, table lookups on Arm64, WebAssembly SIMD on .NET 10, Burst-compiled kernels in Unity; the same bytes on every path.',
      },
      {
        icon: FileCode,
        label: 'TypeScript, Go, Rust and ASP.NET Core',
        text: 'Nino.Codegen generates TypeScript, Go or Rust codecs for your [NinoType]s after each build; Nino.AspNetCore reads and writes application/x-nino bodies for MVC and Minimal APIs.',
      },
      {
        icon: Gauge,
        label: 'Limits for hostile input',
        text: 'Depth, length and hash-collision limits in NinoSettings, and NinoSettings.Untrusted for bytes from outside.',
      },
      {
        icon: ListChecks,
        label: 'Mistakes caught as you type',
        text: '44 analyzer rules, many with a code fix; nino-gen inspect shows what a message holds, byte by byte.',
      },
    ],
    claims: [
      {
        title: 'Fast',
        lead: headlineSerialize
          ? `Up to ${headlineSerialize}× faster than MemoryPack${othersHeadline(false, ', ')}, and 0 B allocated per call on hot paths.`
          : '0 B allocated per call on hot paths.',
        items: [7, 2],
        href: 'benchmarks',
        link: 'Benchmarks',
      },
      {
        title: 'Safe',
        lead: "Bytes from a network peer or a user's file cannot crash the process: invalid input only ever throws NinoDataException.",
        items: [1, 9],
        href: 'security',
        link: 'Untrusted data',
      },
      {
        title: 'Runs everywhere',
        lead: '.NET Standard 2.0 to .NET 11, NativeAOT, ASP.NET Core, Unity (IL2CPP, HybridCLR) and Godot 4, and TypeScript, Go and Rust through generated code.',
        items: [0, 6, 8],
        href: 'platforms',
        link: 'Platforms',
      },
      {
        title: 'Built for production',
        lead: 'Everything is generated at compile time: no reflection over your members, no runtime code generation, no schema files.',
        items: [10, 3, 4, 5],
        href: 'analyzers',
        link: 'Analyzers',
      },
    ],
    older: 'Older versions:',
  },
  zh: {
    description: `Nino 是高性能 C# / .NET 二进制序列化库：基于源生成器，${headlineSerialize ? `最高比 MemoryPack 快 ${headlineSerialize} 倍${othersHeadline(true, '、')}，` : ''}热路径零 GC 分配。适用于 RPC、消息、缓存与存储，支持 .NET、NativeAOT、Unity（IL2CPP、HybridCLR）和 Godot；Go、Rust 和 TypeScript 也能读写同样的字节。`,
    pill: 'Nino v4 · C# 二进制序列化库',
    // U+200B: the one place the first line may break on a phone (break-keep keeps the words whole)
    headline: ['最快的\u200b二进制序列化库', '为 C# 而生。'],
    sub: '一套二进制格式，.NET、Unity、Godot 跨平台、跨运行时字节一致，Go、Rust 和 TypeScript 也能读写同样的字节。基于源生成器，用 SIMD 加速（AVX-512、AVX2、Arm64、WebAssembly），热路径零 GC 分配，不可信的输入也能放心读取。适用于服务端、网络与 RPC、消息队列、缓存、存储和进程间通信。',
    start: '快速开始',
    github: '在 GitHub 上查看',
    why: '为什么选择 Nino',
    highlights: [
      {
        icon: Cpu,
        label: '编译期生成',
        text: '格式化器在编译期生成，不靠反射读写成员，所以 IL2CPP、NativeAOT 与 HybridCLR 都能直接使用。',
      },
      {
        icon: ShieldCheck,
        label: '放心读取不可信数据',
        text: '伪造的字节不会让进程崩溃，不会分配与输入不成比例的内存，也无法指定要创建的类型，只会抛出同一种异常。',
      },
      {
        icon: Recycle,
        label: '热路径零分配',
        text: '序列化到复用的缓冲区或直接写入 Stream，不产生垃圾；反序列化可以直接填充已有对象和池化实例。',
      },
      {
        icon: Boxes,
        label: '无需标签的多态',
        text: '子类型自动继承 [NinoType]，读回时还原为运行时类型，不用维护 Union 标签。',
      },
      {
        icon: GitBranch,
        label: '数据可演进',
        text: '键控成员、版本容错、引用追踪，每个类型按需选择；布局基线在写代码时就指出会破坏已有数据的改动。',
      },
      {
        icon: Hammer,
        label: '增量生成器',
        text: `每个类型一个文件，生成的代码只有 v3 的 1/${generatedSourceRatio}；修改一个类型只重新生成这个类型。`,
      },
      {
        icon: Globe,
        label: '跨平台、跨语言字节一致',
        text: 'CoreCLR、Mono 还是 IL2CPP，64 位还是 32 位，读写的格式都一样；Go、Rust 和 TypeScript 的运行时也读写同样的字节。',
      },
      {
        icon: Zap,
        label: '每种 CPU 都有 SIMD',
        text: 'x64 上用 AVX-512、AVX2 和 SSSE3，Arm64 上用查表指令，.NET 10 上用 WebAssembly SIMD，Unity 中用 Burst 编译的内核；无论走哪条路径，写出的字节都一样。',
      },
      {
        icon: FileCode,
        label: 'TypeScript、Go、Rust 与 ASP.NET Core',
        text: 'Nino.Codegen 在每次构建后为你的 [NinoType] 生成 TypeScript、Go 或 Rust 编解码代码；Nino.AspNetCore 为 MVC 和 Minimal API 读写 application/x-nino 请求体。',
      },
      {
        icon: Gauge,
        label: '防御恶意输入的上限',
        text: '深度、长度和哈希碰撞上限都在 NinoSettings 里；外部来的字节用 NinoSettings.Untrusted。',
      },
      {
        icon: ListChecks,
        label: '写代码时就发现错误',
        text: '44 条分析器规则，许多带一键修复；nino-gen inspect 能逐字节解读一条消息。',
      },
    ],
    claims: [
      {
        title: '快',
        lead: headlineSerialize
          ? `最高比 MemoryPack 快 ${headlineSerialize} 倍${othersHeadline(true, '，')}；热路径上每次调用 0 B 分配。`
          : '热路径上每次调用 0 B 分配。',
        items: [7, 2],
        href: 'benchmarks',
        link: '基准测试',
      },
      {
        title: '安全',
        lead: '网络对端发来的字节、用户的文件，都不会让进程崩溃：任何无效输入都只抛出 NinoDataException。',
        items: [1, 9],
        href: 'security',
        link: '不可信数据',
      },
      {
        title: '哪都能用',
        lead: '.NET Standard 2.0 到 .NET 11、NativeAOT、ASP.NET Core、Unity（IL2CPP、HybridCLR）和 Godot 4，TypeScript、Go 和 Rust 通过生成的代码使用。',
        items: [0, 6, 8],
        href: 'platforms',
        link: '平台',
      },
      {
        title: '专业可靠',
        lead: '一切在编译期生成：不靠反射读写成员，没有运行时代码生成，也不需要 schema 文件。',
        items: [10, 3, 4, 5],
        href: 'analyzers',
        link: '分析器',
      },
    ],
    older: '旧版本：',
  },
};

// Search result titles: the product and the category people search for. The page copy above keeps its own headline.
const seoTitle: Record<Locale, string> = {
  en: 'Nino – The Fastest Binary Serializer for C#, .NET and Unity',
  zh: 'Nino – 最快的 C# 二进制序列化库，支持 .NET 与 Unity',
};

export function meta({ params }: Route.MetaArgs) {
  const lang = getLocale(params.lang);
  return homeMeta({
    lang,
    title: seoTitle[lang],
    description: copy[lang].description,
    faq: homeFaq(lang),
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
          <div className="flex w-full max-w-5xl flex-col items-center text-center">
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

            <p className="mt-3 max-w-3xl text-base leading-relaxed text-balance text-fd-muted-foreground md:text-lg">
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

            <HomeInstall lang={lang} docs={docs} />
          </div>
        </section>

        <section className="w-full border-t px-4 py-12 sm:px-6 md:py-16">
          <div className="mx-auto max-w-5xl">
            <HomeCompare lang={lang} docs={docs} />
          </div>
        </section>

        <section className="w-full border-t px-6 py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight">{t.why}</h2>
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2">
              {t.claims.map((claim) => (
                <div key={claim.title} className="flex flex-col">
                  <h3 className="text-xl font-bold tracking-tight">
                    {claim.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed font-medium">
                    {claim.lead}
                  </p>
                  <div className="mt-5 flex flex-col gap-4">
                    {claim.items.map((i) => {
                      const h = t.highlights[i];
                      return (
                        <div key={h.label} className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0 rounded-md bg-fd-primary/10 p-2 text-fd-primary">
                            <h.icon className="size-4" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{h.label}</p>
                            <p className="text-sm text-fd-muted-foreground">
                              {h.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Link
                    to={`${docs}/${claim.href}`}
                    className="mt-5 text-sm font-medium text-fd-primary underline-offset-4 hover:underline"
                  >
                    {claim.link}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full border-t px-6 py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <HomeAbout lang={lang} />
          </div>
        </section>

        <section className="w-full border-t px-6 py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <HomeUseCases lang={lang} docs={docs} />
          </div>
        </section>

        <section className="w-full border-t px-6 py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <HomeFaq lang={lang} docs={docs} />
          </div>
        </section>

        <section className="w-full border-t px-6 py-6">
          <p className="mx-auto max-w-5xl text-center text-sm text-fd-muted-foreground">
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

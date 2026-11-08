import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { HomeBench, HomeV3 } from '@/components/home-compare';
import { HomeInstall } from '@/components/home-install';
import {
  HomeAbout,
  HomeFaq,
  HomeUseCases,
  homeFaq,
  memoryPackVersion,
} from '@/components/home-sections';
import { build, headlineSerialize } from '@/lib/benchmarks';
import { cn } from '@/lib/cn';
import { getLocale, type Locale } from '@/lib/i18n';
import { baseOptions } from '@/lib/layout.shared';
import { homeMeta } from '@/lib/seo';
import { githubUrl } from '@/lib/site';
import { latestVersion } from '@/lib/versions';
import type { Route } from './+types/home';

/** v4's generated source against v3's (generator benchmark, `build` in src/lib/benchmarks.ts) */
const generatedSourceRatio = build[0].ratio;

/** One of the four things the home page proves: a claim, its facts, the page that shows them */
interface Claim {
  title: string;
  lead: string;
  points: string[];
  href: string;
  link: string;
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
    claims: Claim[];
    older: string;
  }
> = {
  en: {
    description: `Nino is a high-performance binary serializer for C# and .NET: source-generated, ${headlineSerialize ? `up to ${headlineSerialize}× faster than MemoryPack, ` : ''}zero GC on hot paths. For RPC, messaging, caching and storage on .NET, Unity (IL2CPP, HybridCLR) and Godot, with the same bytes in TypeScript, Go and Rust.`,
    pill: 'Nino v4, the C# binary serializer',
    headline: ['The fastest binary serializer', 'for C#.'],
    sub: 'Nino is source-generated and SIMD-accelerated (AVX-512, AVX2, Arm64, WebAssembly), with zero GC on hot paths. For services, networking and RPC, message queues, caching, storage and IPC, on .NET, Unity and Godot alike.',
    start: 'Get Started',
    github: 'View on GitHub',
    why: 'Why Nino',
    claims: [
      {
        title: 'Fast',
        lead: headlineSerialize
          ? `Up to ${headlineSerialize}× faster than MemoryPack, and 0 B allocated per call on hot paths.`
          : '0 B allocated per call on hot paths.',
        points: [
          'SIMD on every CPU: AVX-512, AVX2 and SSSE3 on x64, Arm64, WebAssembly, and Burst-compiled kernels in Unity.',
          'Serialize into reused buffers; deserialize into existing objects and [NinoPooled] instances.',
        ],
        href: 'benchmarks',
        link: 'Benchmarks',
      },
      {
        title: 'Safe',
        lead: "Bytes from a network peer or a user's file cannot crash the process: invalid input only ever throws NinoDataException.",
        points: [
          'Lengths are checked before allocating; depth and hash-collision limits live in NinoSettings.',
          'The bytes cannot name a type to create, and every runtime is tested against the same corpus of malicious inputs.',
        ],
        href: 'security',
        link: 'Untrusted data',
      },
      {
        title: 'Runs everywhere',
        lead: '.NET Standard 2.0 to .NET 10, NativeAOT, ASP.NET Core, Unity (IL2CPP, HybridCLR) and Godot 4.',
        points: [
          'CoreCLR, Mono and IL2CPP, 64-bit and 32-bit, x64 and Arm64 all write the same bytes.',
          'nino-gen generates TypeScript, Go and Rust codecs from your [NinoType]s, so browsers, Node, Go and Rust read them too.',
        ],
        href: 'platforms',
        link: 'Platforms',
      },
      {
        title: 'Built for production',
        lead: 'Everything is generated at compile time: no reflection, no runtime code generation, no schema files.',
        points: [
          '33 analyzers report mistakes as you type, many with a code fix.',
          'Polymorphism without tags; version tolerance, keyed members and reference tracking, chosen per type.',
          `An incremental generator: one file per type, ${generatedSourceRatio}× less code than v3.`,
        ],
        href: 'analyzers',
        link: 'Analyzers',
      },
    ],
    older: 'Older versions:',
  },
  zh: {
    description: `Nino 是高性能 C# / .NET 二进制序列化库：基于源生成器，${headlineSerialize ? `最高比 MemoryPack 快 ${headlineSerialize} 倍，` : ''}热路径零 GC 分配。适用于 RPC、消息、缓存与存储，支持 .NET、Unity（IL2CPP、HybridCLR）和 Godot，可与 TypeScript、Go 和 Rust 互通。`,
    // U+200B: the one place the first line may break (keep-all keeps the words whole)
    pill: 'Nino v4：C# 二进制序列化库',
    headline: ['最快的\u200b二进制序列化库', '为 C# 而生。'],
    sub: 'Nino 基于源生成器，用 SIMD 加速（AVX-512、AVX2、Arm64、WebAssembly），热路径零 GC 分配。适用于服务端、网络与 RPC、消息队列、缓存、存储和进程间通信，.NET、Unity 与 Godot 均可使用。',
    start: '快速开始',
    github: '在 GitHub 上查看',
    why: '为什么选择 Nino',
    claims: [
      {
        title: '快',
        lead: headlineSerialize
          ? `最高比 MemoryPack 快 ${headlineSerialize} 倍，热路径上每次调用 0 B 分配。`
          : '热路径上每次调用 0 B 分配。',
        points: [
          '每种 CPU 都有 SIMD：x64 上的 AVX-512、AVX2 和 SSSE3，Arm64，WebAssembly，以及 Unity 中 Burst 编译的内核。',
          '序列化到复用的缓冲区；反序列化直接填充已有对象和 [NinoPooled] 池化实例。',
        ],
        href: 'benchmarks',
        link: '基准测试',
      },
      {
        title: '安全',
        lead: '网络对端发来的字节、用户的文件，都不会让进程崩溃：任何无效输入都只抛出 NinoDataException。',
        points: [
          '先校验长度再分配内存；深度和哈希碰撞上限都在 NinoSettings 里。',
          '字节无法指定要创建的类型；各语言的运行时都用同一套恶意输入样本测试。',
        ],
        href: 'security',
        link: '不可信数据',
      },
      {
        title: '哪都能用',
        lead: '.NET Standard 2.0 到 .NET 10、NativeAOT、ASP.NET Core、Unity（IL2CPP、HybridCLR）和 Godot 4。',
        points: [
          'CoreCLR、Mono 和 IL2CPP，64 位和 32 位，x64 和 Arm64，写出的字节完全相同。',
          'nino-gen 从你的 [NinoType] 生成 TypeScript、Go 和 Rust 编解码代码，浏览器、Node、Go 和 Rust 也能读写。',
        ],
        href: 'platforms',
        link: '平台',
      },
      {
        title: '专业可靠',
        lead: '一切在编译期生成：没有反射，没有运行时代码生成，也不需要 schema 文件。',
        points: [
          '33 条分析器规则在写代码时就报告错误，许多带一键修复。',
          '多态无需标签；版本容错、键控成员和引用追踪，每个类型按需选择。',
          `增量生成器：每个类型一个文件，生成的代码只有 v3 的 1/${generatedSourceRatio}。`,
        ],
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
        <section className="flex w-full flex-col items-center px-6 pt-12 pb-14 md:pt-20 md:pb-20">
          <div className="flex w-full max-w-5xl flex-col items-center text-center">
            <span className="mb-5 rounded-full border border-fd-border bg-fd-secondary/50 px-3 py-1 text-xs font-medium text-fd-muted-foreground">
              {t.pill}
            </span>

            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight break-keep sm:text-5xl lg:text-6xl">
              {t.headline[0]}
              <br />
              <span className="bg-linear-to-r/oklab from-nino-grad-from from-25% to-nino-grad-to bg-clip-text text-transparent">
                {t.headline[1]}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-balance text-fd-muted-foreground md:text-lg">
              {t.sub}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={`${docs}/start`}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors',
                  'bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90',
                )}
              >
                {t.start}
                <ArrowRight className="size-4" aria-hidden="true" />
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

        <section className="w-full border-t px-6 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <HomeBench lang={lang} docs={docs} memoryPack={memoryPackVersion} />
          </div>
        </section>

        <section className="w-full border-t px-6 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold tracking-tight">{t.why}</h2>
            <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x">
              {t.claims.map((claim) => (
                <div
                  key={claim.title}
                  className="flex flex-col lg:px-6 lg:first:pl-0 lg:last:pr-0"
                >
                  <h3 className="text-xl font-bold tracking-tight">
                    {claim.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed font-medium">
                    {claim.lead}
                  </p>
                  <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-fd-muted-foreground">
                    {claim.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <Link
                    to={`${docs}/${claim.href}`}
                    className="mt-auto pt-4 text-sm font-medium text-fd-primary underline-offset-4 hover:underline"
                  >
                    {claim.link}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full border-t px-6 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <HomeAbout lang={lang} />
          </div>
        </section>

        <section className="w-full border-t px-6 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <HomeUseCases lang={lang} docs={docs} />
          </div>
        </section>

        <section className="w-full border-t px-6 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <HomeV3 lang={lang} docs={docs} />
          </div>
        </section>

        <section className="w-full border-t px-6 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <HomeFaq lang={lang} docs={docs} />
          </div>
        </section>

        <section className="w-full border-t px-6 py-6">
          <p className="mx-auto max-w-6xl text-center text-sm text-fd-muted-foreground">
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

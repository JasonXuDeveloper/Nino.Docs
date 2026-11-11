/*
 * The home page's text sections: what Nino is, where it is used, and a short
 * FAQ. They state the facts plainly so search engines and AI answer engines
 * can quote them; the FAQ also becomes the home page's FAQPage JSON-LD
 * (homeFaq). Every number comes from src/lib/benchmarks.ts.
 */
import {
  ChevronDown,
  Database,
  FileCode,
  Gamepad2,
  Gauge,
  type LucideIcon,
  MessagesSquare,
  Network,
  Server,
  Shapes,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router';
import {
  bestReuse,
  formatClassRange,
  formatRatio,
  otherLibs,
  reuseSpeedup,
} from '@/lib/benchmarks';
import type { Locale } from '@/lib/i18n';
import { release } from '@/lib/release';

const memoryPackVersion = '1.21.4';
const prerelease = release.prerelease ? ' --prerelease' : '';

const serializeRange = formatClassRange('serialize');
const deserializeRange = formatClassRange('deserialize');
/** The same ranges against MessagePack and protobuf-net */

const otherRanges = otherLibs
  .map((other) => ({
    ...other,
    serialize: formatClassRange('serialize', other.key),
    deserialize: formatClassRange('deserialize', other.key),
  }))
  .filter((other) => other.serialize && other.deserialize);
const reuseMax = bestReuse ? formatRatio(reuseSpeedup(bestReuse)) : '';

/** One sentence on speed against MemoryPack, from the synced benchmark data */
function speedSentence(zh: boolean) {
  if (!serializeRange) return '';
  return zh
    ? `在同一次 BenchmarkDotNet 测试中，与 MemoryPack ${memoryPackVersion} 相比，Nino v4 序列化类和多态类型快 ${serializeRange}，反序列化快 ${deserializeRange}；非托管结构体数组两者都是整块拷贝，性能持平。${otherRanges.map((o) => `对比 ${o.label} ${o.version}，类和多态类型的序列化快 ${o.serialize}，反序列化快 ${o.deserialize}。`).join('')}${reuseMax ? `反序列化到已有对象时零分配，比 MemoryPack 的覆盖模式最高快 ${reuseMax}。` : ''}`
    : `In the same BenchmarkDotNet run against MemoryPack ${memoryPackVersion}, Nino v4 serializes classes and polymorphic types ${serializeRange} faster and deserializes them ${deserializeRange} faster; arrays of unmanaged structs are on par, since both copy them as one block.${otherRanges.map((o) => ` Against ${o.label} ${o.version}, it serializes them ${o.serialize} faster and deserializes them ${o.deserialize} faster.`).join('')}${reuseMax ? ` Deserializing into existing objects allocates nothing and is up to ${reuseMax} faster than MemoryPack's overwrite mode.` : ''}`;
}

interface Fact {
  label: string;
  value: string;
  code?: boolean;
}

interface UseCase {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
}

interface FaqItem {
  question: string;
  answer: string;
  href: string;
}

const text: Record<
  Locale,
  {
    aboutTitle: string;
    about: string[];
    facts: Fact[];
    useTitle: string;
    useLead: string;
    useCases: UseCase[];
    faqTitle: string;
    faq: FaqItem[];
    more: string;
    allFaq: string;
  }
> = {
  en: {
    aboutTitle: 'What is Nino?',
    about: [
      'Nino is a general-purpose, high-performance binary serializer for C# and .NET. A Roslyn source generator writes the serialization code at compile time, so there is no reflection, it runs under IL2CPP and NativeAOT, and serializing into a reused buffer allocates nothing.',
      'Mark a class, struct, record or interface with [NinoType] and call NinoSerializer.Serialize and NinoDeserializer.Deserialize: no schema file, no registration. Values declared as a base class or interface come back as their runtime type, each type chooses whether it tolerates added members, uses keys or tracks shared references, and invalid input only ever throws NinoDataException. nino-gen generates TypeScript, Go and Rust code from the same types, so browsers, Node, Go and Rust programs read and write the same bytes as .NET.',
      'Nino is not the right choice when people need to read the data (use JSON) or when programs in Java, Python or C++ must read it (use Protocol Buffers or MessagePack).',
    ],
    facts: [
      {
        label: 'Latest version',
        value: `${release.version}${release.prerelease ? ' (prerelease)' : ''}`,
      },
      {
        label: 'Install',
        value: `dotnet add package Nino${prerelease}`,
        code: true,
      },
      {
        label: 'Unity',
        value: 'openupm add com.jasonxudeveloper.nino',
        code: true,
      },
      {
        label: 'AI coding agents',
        value: 'npx skills add JasonXuDeveloper/Nino',
        code: true,
      },
      {
        label: 'Runs on',
        value:
          '.NET Standard 2.0+, .NET 8, .NET 10, NativeAOT, ASP.NET Core, Unity 2022.3+ (Mono, IL2CPP, HybridCLR), Godot 4; browsers, Node, Go and Rust through generated code (TypeScript, Go, Rust)',
      },
      ...(serializeRange
        ? [
            {
              label: `vs MemoryPack ${memoryPackVersion}`,
              value: `${serializeRange} faster serialization and ${deserializeRange} faster deserialization of classes and polymorphic types`,
            },
          ]
        : []),
      ...otherRanges.map((o) => ({
        label: `vs ${o.label} ${o.version}`,
        value: `${o.serialize} faster serialization and ${o.deserialize} faster deserialization`,
      })),
      {
        label: 'License',
        value: 'MIT, open source on GitHub',
      },
    ],
    useTitle: 'Use Nino wherever objects become bytes',
    useLead:
      'One serializer for every layer of a .NET system, from the network edge to storage, and in game engines too.',
    useCases: [
      {
        icon: Network,
        title: 'Services and RPC',
        text: 'Requests and responses written straight into a PipeWriter or a pooled buffer, with polymorphic messages that need no tags.',
        href: 'advanced/networking',
      },
      {
        icon: Server,
        title: 'ASP.NET Core',
        text: 'application/x-nino request and response bodies in MVC and Minimal APIs, read and written straight from the pipes (Nino.AspNetCore).',
        href: 'advanced/aspnetcore',
      },
      {
        icon: FileCode,
        title: 'TypeScript, Go and Rust',
        text: 'TypeScript, Go and Rust types and codecs generated from your [NinoType]s after each build (Nino.Codegen), with the same bytes as .NET.',
        href: 'advanced/codegen',
      },
      {
        icon: MessagesSquare,
        title: 'Message queues and event streams',
        text: 'One base type for every event, small messages, and formats that let producers and consumers upgrade at different times.',
        href: 'advanced/message-queues',
      },
      {
        icon: Zap,
        title: 'Caching',
        text: 'Compact values for Redis, IDistributedCache, HybridCache or in-process caches, with schema changes across deployments.',
        href: 'advanced/caching',
      },
      {
        icon: Database,
        title: 'Files and storage',
        text: 'Documents, settings, snapshots and logs that survive added, removed and reordered members; shared references and cycles are kept.',
        href: 'advanced/persistence',
      },
      {
        icon: Gauge,
        title: 'Hot paths and IPC',
        text: 'Thread-safe serialization with no per-call allocations for workers, actors, inter-process channels and data pipelines; deserializing into existing objects and [NinoPooled] instances keeps steady-state loops at zero GC.',
        href: 'advanced/high-performance',
      },
      {
        icon: Gamepad2,
        title: 'Unity and HybridCLR',
        text: 'IL2CPP-safe generated code, raw-memory copies of Vector3 and other unmanaged structs, optional Burst-compiled SIMD kernels, and hot-update assemblies found without init calls.',
        href: 'advanced/unity',
      },
      {
        icon: Shapes,
        title: 'Godot 4',
        text: "A regular NuGet package for Godot's .NET projects; Godot's math structs are copied as raw memory.",
        href: 'advanced/godot',
      },
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        question: 'Is Nino faster than MemoryPack?',
        answer: speedSentence(false),
        href: 'vs-memorypack',
      },
      {
        question: 'What can I use Nino for?',
        answer:
          'Anything that turns .NET objects into bytes and back: RPC and network protocols, microservices, message queues and event streams, caches, files and databases, inter-process communication, data pipelines, and games built with Unity or Godot.',
        href: 'advanced',
      },
      {
        question: 'Which platforms does Nino support?',
        answer:
          'The runtime targets netstandard2.0, netstandard2.1, net8.0 and net10.0, so it runs on .NET Framework 4.6.1+, .NET Core, .NET 5–10 and NativeAOT, as well as Unity 2022.3 and later (Mono, IL2CPP, HybridCLR) and Godot 4. Every platform, 64-bit or 32-bit, writes the same bytes. Nino.AspNetCore reads and writes ASP.NET Core bodies, and Nino.Codegen generates TypeScript, Go and Rust codecs that read and write the same bytes in browsers, Node, Go and Rust.',
        href: 'platforms',
      },
      {
        question: 'Does Nino work in Unity with IL2CPP and HybridCLR?',
        answer:
          'Yes. Nino supports Unity 2022.3 and later on Mono and IL2CPP and every player platform. The generated code uses no reflection, and types in HybridCLR hot-update assemblies are found with no initialization call. Vector3, Quaternion and other unmanaged structs are copied as raw memory, AnimationCurve, Gradient and RectOffset are built in, and with com.unity.burst installed, Burst-compiled SIMD kernels move arrays of tuples and structs and Latin-1 strings. Install it from OpenUPM.',
        href: 'advanced/unity',
      },
      {
        question: 'Does Nino use reflection?',
        answer:
          'No. A Roslyn source generator writes the serialization code for every [NinoType] at compile time, so there is no reflection and no runtime code generation, and the code works under IL2CPP and NativeAOT.',
        href: 'performance',
      },
      {
        question: 'Can I change my types after data has been written?',
        answer:
          'Yes. With NinoFormat.VersionTolerant you append members and old code still reads new data; with NinoFormat.Keyed you add, remove, reorder and rename members ([NinoFormerName]). The default positional format is the fastest, for data that is not kept across versions.',
        href: 'evolving-data',
      },
      {
        question: 'How do I install Nino?',
        answer:
          'Run dotnet add package Nino --prerelease in a .NET project, or openupm add com.jasonxudeveloper.nino in a Unity project. Go, Rust and TypeScript programs use code that nino-gen (Nino.Codegen) generates from your C# types, with the runtime from go get, cargo add or npm install. For AI coding agents, npx skills add JasonXuDeveloper/Nino installs the nino-serialization skill. Nino is free and MIT licensed.',
        href: 'start',
      },
    ],
    more: 'Learn more',
    allFaq: 'All questions',
  },
  zh: {
    aboutTitle: 'Nino 是什么？',
    about: [
      'Nino 是通用的高性能 C# / .NET 二进制序列化库。Roslyn 源生成器在编译期生成序列化代码，没有反射，可在 IL2CPP 和 NativeAOT 下运行，序列化到复用的缓冲区时零分配。',
      '给类、结构体、记录或接口加上 [NinoType]，再调用 NinoSerializer.Serialize 和 NinoDeserializer.Deserialize 就行，不用写 schema，也不用注册。声明为基类或接口的值，读回来还是它的实际类型；每个类型可以单独选择版本容错、键控成员或引用追踪；无效输入只会抛出 NinoDataException。nino-gen 还能从同一批类型生成 TypeScript、Go 和 Rust 代码，浏览器、Node、Go 和 Rust 程序读写的字节与 .NET 完全一致。',
      '数据需要人来看时用 JSON；数据要给 Java、Python、C++ 等程序读时，用 Protocol Buffers 或 MessagePack。这两种情况 Nino 不合适。',
    ],
    facts: [
      {
        label: '最新版本',
        value: `${release.version}${release.prerelease ? '（预发行版）' : ''}`,
      },
      {
        label: '安装',
        value: `dotnet add package Nino${prerelease}`,
        code: true,
      },
      {
        label: 'Unity',
        value: 'openupm add com.jasonxudeveloper.nino',
        code: true,
      },
      {
        label: 'AI 编程助手',
        value: 'npx skills add JasonXuDeveloper/Nino',
        code: true,
      },
      {
        label: '运行环境',
        value:
          '.NET Standard 2.0+、.NET 8、.NET 10、NativeAOT、ASP.NET Core、Unity 2022.3+（Mono、IL2CPP、HybridCLR）、Godot 4；浏览器、Node、Go 和 Rust 通过生成的代码（TypeScript、Go、Rust）使用',
      },
      ...(serializeRange
        ? [
            {
              label: `对比 MemoryPack ${memoryPackVersion}`,
              value: `类和多态类型的序列化快 ${serializeRange}，反序列化快 ${deserializeRange}`,
            },
          ]
        : []),
      ...otherRanges.map((o) => ({
        label: `对比 ${o.label} ${o.version}`,
        value: `序列化快 ${o.serialize}，反序列化快 ${o.deserialize}`,
      })),
      { label: '协议', value: 'MIT，在 GitHub 上开源' },
    ],
    useTitle: '对象与字节互转的地方，都能用 Nino',
    useLead:
      '从网络入口到存储，.NET 系统的每一层都可以用同一个序列化库，游戏引擎里也一样。',
    useCases: [
      {
        icon: Network,
        title: '服务与 RPC',
        text: '请求和响应直接写进 PipeWriter 或池化缓冲区，多态消息无需手写标签。',
        href: 'advanced/networking',
      },
      {
        icon: Server,
        title: 'ASP.NET Core',
        text: 'MVC 和 Minimal API 直接从管道读写 application/x-nino 请求体和响应体（Nino.AspNetCore）。',
        href: 'advanced/aspnetcore',
      },
      {
        icon: FileCode,
        title: 'TypeScript、Go 与 Rust',
        text: '每次构建后为你的 [NinoType] 生成 TypeScript、Go 和 Rust 类型与编解码器（Nino.Codegen），与 .NET 字节一致、可以互通。',
        href: 'advanced/codegen',
      },
      {
        icon: MessagesSquare,
        title: '消息队列与事件流',
        text: '所有事件共用一个基类型，消息小巧，生产者和消费者可以分开升级。',
        href: 'advanced/message-queues',
      },
      {
        icon: Zap,
        title: '缓存',
        text: '作为 Redis、IDistributedCache、HybridCache 或进程内缓存的紧凑值格式，跨部署修改结构也没问题。',
        href: 'advanced/caching',
      },
      {
        icon: Database,
        title: '文件与存储',
        text: '文档、配置、快照和日志在增删、调整成员顺序后依然可读，共享引用和循环引用都能保留。',
        href: 'advanced/persistence',
      },
      {
        icon: Gauge,
        title: '热路径与进程间通信',
        text: '线程安全、每次调用零分配，适合后台任务、Actor、进程间通道和数据管道；反序列化到已有对象和 [NinoPooled] 实例，长期运行的循环保持零 GC。',
        href: 'advanced/high-performance',
      },
      {
        icon: Gamepad2,
        title: 'Unity 与 HybridCLR',
        text: '生成的代码兼容 IL2CPP；Vector3 等非托管结构体按原始内存拷贝；可选用 Burst 编译的 SIMD 内核；热更新程序集无需初始化调用即可识别。',
        href: 'advanced/unity',
      },
      {
        icon: Shapes,
        title: 'Godot 4',
        text: 'Godot 的 .NET 项目直接安装 NuGet 包即可；Godot 的数学结构体按原始内存拷贝。',
        href: 'advanced/godot',
      },
    ],
    faqTitle: '常见问题',
    faq: [
      {
        question: 'Nino 比 MemoryPack 快吗？',
        answer: speedSentence(true),
        href: 'vs-memorypack',
      },
      {
        question: 'Nino 能用在哪些地方？',
        answer:
          '凡是要把 .NET 对象转成字节再转回来的地方：RPC 与网络协议、微服务、消息队列与事件流、缓存、文件与数据库、进程间通信、数据管道，以及用 Unity 或 Godot 开发的游戏。',
        href: 'advanced',
      },
      {
        question: 'Nino 支持哪些平台？',
        answer:
          '运行时面向 netstandard2.0、netstandard2.1、net8.0 和 net10.0，因此可运行于 .NET Framework 4.6.1+、.NET Core、.NET 5–10 与 NativeAOT，也支持 Unity 2022.3 及以上（Mono、IL2CPP、HybridCLR）和 Godot 4。所有平台，无论 64 位还是 32 位，写出的字节都相同。Nino.AspNetCore 负责在 ASP.NET Core 中读写请求体与响应，借助 Nino.Codegen 生成的 TypeScript、Go 和 Rust 编解码器，浏览器、Node、Go 和 Rust 都能与之互通。',
        href: 'platforms',
      },
      {
        question: 'Nino 能在 Unity 的 IL2CPP 和 HybridCLR 下使用吗？',
        answer:
          '能。Nino 支持 Unity 2022.3 及以上版本，Mono 和 IL2CPP 均可，覆盖所有 Player 平台。生成的代码不用反射，HybridCLR 热更新程序集里的类型无需初始化调用就能识别。Vector3、Quaternion 等非托管结构体按原始内存拷贝，AnimationCurve、Gradient 和 RectOffset 内置支持；安装 com.unity.burst 后，元组数组、结构体数组和 Latin-1 字符串交给 Burst 编译的 SIMD 内核搬运。从 OpenUPM 安装。',
        href: 'advanced/unity',
      },
      {
        question: 'Nino 使用反射吗？',
        answer:
          '不使用。Roslyn 源生成器在编译期为每个 [NinoType] 生成序列化代码，没有反射，也没有运行时代码生成，在 IL2CPP 和 NativeAOT 下都能正常工作。',
        href: 'performance',
      },
      {
        question: '数据写入之后还能修改类型吗？',
        answer:
          '可以。用 NinoFormat.VersionTolerant 可以在末尾追加成员，旧代码照样能读新数据；用 NinoFormat.Keyed 可以增删、调序和重命名成员（[NinoFormerName]）。默认的按位置格式最快，适合不跨版本保存的数据。',
        href: 'evolving-data',
      },
      {
        question: '如何安装 Nino？',
        answer:
          '在 .NET 项目中运行 dotnet add package Nino --prerelease；Unity 项目中运行 openupm add com.jasonxudeveloper.nino。Go、Rust 和 TypeScript 程序用 nino-gen（Nino.Codegen）从你的 C# 类型生成代码，运行时用 go get、cargo add 或 npm install 安装。给 AI 编程助手用的 nino-serialization skill 用 npx skills add JasonXuDeveloper/Nino 安装。Nino 免费，采用 MIT 协议。',
        href: 'start',
      },
    ],
    more: '了解更多',
    allFaq: '全部问题',
  },
};

/** The home FAQ as plain text, for the FAQPage JSON-LD */
export function homeFaq(lang: Locale) {
  return text[lang].faq
    .filter((item) => item.answer)
    .map(({ question, answer }) => ({ question, answer }));
}

export function HomeAbout({ lang }: { lang: Locale }) {
  const t = text[lang];
  return (
    <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.aboutTitle}</h2>
        {t.about.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-3 leading-relaxed text-fd-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
      </div>
      <dl className="grid content-start gap-3 rounded-xl border bg-fd-card p-5 text-sm">
        {t.facts.map((fact) => (
          <div key={fact.label}>
            <dt className="font-medium">{fact.label}</dt>
            <dd className="mt-0.5 text-fd-muted-foreground">
              {fact.code ? (
                <code className="font-mono text-xs">{fact.value}</code>
              ) : (
                fact.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function HomeUseCases({ lang, docs }: { lang: Locale; docs: string }) {
  const t = text[lang];
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">{t.useTitle}</h2>
      <p className="mt-2 text-fd-muted-foreground">{t.useLead}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t.useCases.map((u) => (
          <Link
            key={u.href}
            to={`${docs}/${u.href}`}
            className="group rounded-xl border bg-fd-card p-4 transition-colors hover:bg-fd-accent"
          >
            <u.icon className="size-5 text-fd-primary" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold">{u.title}</h3>
            <p className="mt-1 text-sm text-fd-muted-foreground">{u.text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

export function HomeFaq({ lang, docs }: { lang: Locale; docs: string }) {
  const t = text[lang];
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">{t.faqTitle}</h2>
      <div className="mt-6 divide-y rounded-xl border bg-fd-card">
        {t.faq
          .filter((item) => item.answer)
          .map((item) => (
            // <details>: the answer stays in the HTML (crawlers read it) and opens on click.
            <details key={item.href} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                <h3 className="text-sm font-semibold">{item.question}</h3>
                <ChevronDown
                  className="size-4 shrink-0 text-fd-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
                {item.answer}{' '}
                <Link
                  to={`${docs}/${item.href}`}
                  className="underline underline-offset-4 hover:text-fd-foreground"
                >
                  {t.more}
                </Link>
              </p>
            </details>
          ))}
      </div>
      <p className="mt-6 text-sm">
        <Link
          to={`${docs}/faq`}
          className="underline underline-offset-4 hover:text-fd-foreground"
        >
          {t.allFaq}
        </Link>
      </p>
    </>
  );
}

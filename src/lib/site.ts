/**
 * Site-wide facts used by the page metadata, the structured data (JSON-LD),
 * the sitemap, robots.txt and llms.txt. Change the domain here only.
 */
import type { Locale } from './i18n';

export const siteUrl = 'https://nino.xgamedev.net';
export const siteName = 'Nino';

export const githubUrl = 'https://github.com/JasonXuDeveloper/Nino';
export const docsRepoUrl = 'https://github.com/JasonXuDeveloper/Nino.Docs';
export const nugetUrl = 'https://www.nuget.org/packages/Nino';
export const openUpmUrl =
  'https://openupm.com/packages/com.jasonxudeveloper.nino/';
export const licenseUrl =
  'https://github.com/JasonXuDeveloper/Nino/blob/main/LICENSE';
export const author = {
  name: 'Jason Xu',
  url: 'https://github.com/JasonXuDeveloper',
};

/** BCP 47 tags: `<html lang>`, hreflang, JSON-LD inLanguage */
export const languageTag: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN',
};
/** Open Graph og:locale */
export const ogLocale: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
};

/**
 * Search engine verification codes, read at build time from Vite env
 * variables (set them on the Cloudflare Pages project). Empty ones are not
 * rendered. See README.md, "Search engines".
 */
export const siteVerification = {
  google: import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined,
  bing: import.meta.env.VITE_BING_SITE_VERIFICATION as string | undefined,
  baidu: import.meta.env.VITE_BAIDU_SITE_VERIFICATION as string | undefined,
};

/**
 * One-paragraph definition of Nino, quoted by llms.txt and the JSON-LD. Keep
 * it true to the Nino source (README, csproj files) and to the docs.
 */
export const productSummary: Record<Locale, string> = {
  en: 'Nino is a general-purpose, high-performance binary serializer for C# and .NET. A Roslyn source generator writes the serialization code for every [NinoType] at compile time, so there is no reflection and no runtime code generation, and serializing into a reused buffer allocates nothing. Use it wherever .NET code turns objects into bytes and back: RPC and network protocols, microservices, message queues and event streams, caches, files and other storage, inter-process communication and data pipelines. The runtime targets netstandard2.0, netstandard2.1, net8.0 and net10.0, and Nino also supports Unity 2022.3+ (Mono, IL2CPP, HybridCLR), Godot 4 (.NET), ASP.NET Core (Nino.AspNetCore), browsers and Node through generated TypeScript or .NET WebAssembly, and Go and Rust through generated code (Nino.Codegen); every platform writes the same bytes. MIT licensed.',
  zh: 'Nino 是通用的高性能 C# / .NET 二进制序列化库。Roslyn 源生成器在编译期为每个 [NinoType] 生成序列化代码，因此没有反射、没有运行时代码生成；序列化到复用的缓冲区时零 GC 分配。凡是 .NET 代码需要在对象和字节之间转换的地方都能使用：RPC 与网络协议、微服务、消息队列与事件流、缓存、文件等存储、进程间通信以及数据管道。运行时面向 netstandard2.0、netstandard2.1、net8.0 和 net10.0，同时支持 Unity 2022.3+（Mono、IL2CPP、HybridCLR）、Godot 4（.NET）、ASP.NET Core（Nino.AspNetCore），通过生成的 TypeScript 或 .NET WebAssembly 支持浏览器和 Node，并通过生成的代码（Nino.Codegen）支持 Go 和 Rust，各平台写出的字节完全相同。MIT 开源协议。',
};

# Writing the Nino docs

How a page of https://nino.xgamedev.net is written. The audit that checks every page against it is Nino's
`audit-docs` skill (`.claude/skills/audit-docs/SKILL.md` in JasonXuDeveloper/Nino).

## Order

The sidebar (`content/docs/v4/meta.json`, `meta.zh.json`) is the reading order: overview, getting started (install,
first type, serialize and deserialize), defining types, features (evolving data, polymorphism, references, pooling,
custom formatters, security), guides and integrations (`advanced/`), reference (analyzers, platforms, wire format,
benchmarks, limits). A page never relies on a feature taught later; it links forward instead of explaining twice.

## Frontmatter

`title`, `description` (one or two sentences, specific, true to the source: it is the search snippet and the
llms.txt line), optional `icon` (a name from lucide's `icons` table), `seoTitle` (when "Title – Nino v4 Docs" would be
too generic) and `faq: true` (the page's `##` questions become FAQPage data).

## Page anatomy

A feature page has these parts, in this order (Chinese headings in brackets):

1. **What it is**: no heading, two to four sentences under the title: what the feature does and the problem it
   solves, in terms of the reader's data (saves, messages, caches), not of the API.
2. **When to use it** [什么时候用]: a `<Callout type="idea" title="Use it for">` and a `<Callout type="warn"
   title="Skip it for">`, the second naming what to use instead.
3. **How to use it** [怎么用]: the recommended form first (an attribute, the generated path, the simplest
   overload), in `<Steps>` or `###` sections, each with a complete example that compiles: the type, the call, what
   it returns. No `...` inside code a reader will copy. A second form appears only where it is the right choice, and
   the page says where.
4. **Full example** [完整例子], where a short program can show the feature alone: the files in `<Accordions>`, then
   the output of a real run.
5. **How to use it fast** [怎么用得快]: the choices that change the cost (buffer overloads, reusing instances,
   pooling, `[NinoUtf8]`, raw structs, untrusted mode), as "Instead of | Do | Why", each with its number through a
   benchmark component where one exists.
6. **What it costs** [开销]: bytes on the wire, time, allocations; what is free when the feature is unused.
7. **Pitfalls** [常见陷阱]: "Mistake | What happens | Caught by", naming the NINO rule or the exception.
8. **Related** [相关页面]: `<Cards>` with two to four pages.

Overview, FAQ and reference pages answer the questions their readers search for, one `##` per question.

## Visual forms

- **Show a fact in the most efficient form, prose last.** Before writing a paragraph, ask whether a table, a support
  matrix, a byte figure, a diagram, `<Steps>`, code tabs, a `TypeTable`, a `Files` tree or a chart shows it faster,
  and use that; prose is for what has no such form (why, trade-offs, caveats). Why: the owner wants the docs
  intuitive, "not necessarily many words" (round 105); readers scan. Evidence: round 105 turned the security page's
  rejection list into one default-versus-`Untrusted` matrix, the evolving-data ✓/✗ table and vs-memorypack's emoji
  table into `<Matrix>`, the ASCII `length | Id | CustomerId` comment into a v1/v2 byte figure, and the platforms
  page's four layout accordions into one table.
- **Each docs pass re-reads Fumadocs' current component and MDX-plugin list for the site's version** (fumadocs-ui and
  fumadocs-core in package.json; `node_modules/fumadocs-core/dist/mdx-plugins`, `fumadocs-ui/dist/components`) and
  adopts what fits a prerendered site with Markdown copies. Why: Fumadocs adds forms between versions, and most of the
  value was already installed and unused. Evidence: round 105 (16.17.3) adopted code-block tabs (34 tab groups that
  only wrapped fences), Mermaid and a banner; it kept `<Steps>` JSX because `remarkSteps` runs after
  `remarkHeading`, whose ids and TOC entries would keep the `[step]` tag; it skipped Twoslash and Auto Type Table
  (TypeScript only), Graph View and KaTeX.
- **Byte figures**: `<Bytes rows={[{ title, fields: [{ hex: '07', kind: 'header', label: 'header 7' }, ...] }]} />`
  (`src/components/bytes.tsx`). Kinds: `header` (header, presence byte, reference header), `length` (lengths and
  counts), `id` (type ids and keys), `value`, `pad` (hatched), `changed` (the bytes a comparison is about). Stack rows
  to compare encodings or versions. The bytes come from the specification's worked examples
  (`docs/spec/wire-format.md`, Appendix A, dumps of a real run) or are derived from its rules and checked there;
  never typed from memory.
- **Support matrices**: `<Matrix columns={[...]} rows={[{ group: 'Platforms' }, { label, cells: ['yes', 'no: why',
  'partial: when', 'n/a', ['yes', <>JSX note</>]] }]} />` for any table whose cells are yes, no or partly with a short
  note; lucide icons on the palette's tints, a ✓/✗/⚠/– table in the Markdown copy. Not for tables of values.
- **The category palette** (`--nino-cat-1` to `--nino-cat-5` in `app/app.css`, light and dark) is for byte figures
  and matrices only; everything else keeps the single accent. Why: the owner allowed a small calm palette for
  these two forms (round 105), where colour carries the meaning (which bytes are a header); elsewhere it would only
  decorate. A colour's meaning is fixed site-wide (1 header, 2 length and yes, 3 id or key, 4 value and partly,
  5 changed and no), and the Markdown copy never depends on it.
- **Diagrams**: Mermaid fences (` ```mermaid `), drawn at build time (`src/lib/mermaid.ts`: Mermaid in a headless
  Chromium through Playwright, on mermaid-isomorphic's page), so the page holds the SVG and loads no Mermaid; the
  `neutral` theme, inverted in dark mode (`src/components/mermaid.tsx`); the Markdown copy keeps the source. Keep
  them small (`flowchart LR` or `TD`, about ten nodes at most, short labels: a wide diagram shrinks its text), no
  styles or colours, Chinese labels on Chinese pages; write `<` and `>` in a label as `#lt;` and `#gt;`. Use one for
  a flow, a decision or an architecture, never for a list. Why: the owner chose EasyEcs docs' build-time rendering
  (round 105) over hand-drawn SVG, and a client-side renderer prerenders empty.

## Code

- C# fences with Shiki notation (`// [!code highlight]`, `// [!code ++]` and `// [!code --]` for before and after,
  `// [!code focus]` in a long example, `title="File.cs"`); alternatives (before and after, Nino and MemoryPack, the
  files of one step) as code-block tabs: consecutive fences with `tab="Nino"` (and `tab-group="..."` to persist the
  choice across a page's groups), not `<Tabs>` around fences.
- Every fence compiles against the current Nino source and reports no NINO warning; examples model a real domain and
  use the recommended form, because readers copy them. `bun run check:csharp` (CI runs it on every change to
  `content/` and daily against Nino's `main`) compiles each v4 fence: type declarations as they are, statements in a
  method, members in a class. What a fragment leaves to the reader (an `order` to serialize, an `app` to map routes
  on, a type another page declares) goes into the page's `scripts/csharp-check/Context/<page>.cs`, never into the
  fence. A fence that redeclares a type of an earlier fence (before and after, two tabs) shadows it.
- A fence with a file title (`title="Program.cs"`) is a whole file a reader copies: it is compiled as a file of its
  own, with its own `using` lines only, so it lists every namespace it uses (`System`, `System.Collections.Generic`,
  `Nino.Core`, ...; a Unity script or a netstandard library has no implicit usings). It still sees the types of the
  page's other fences and of its Context file, and what the Context file's `Snippets` class declares, as files of one
  project do. An untitled fence is a fragment: it gets the implicit usings of an ASP.NET Core project, `Nino.Core`
  and the `using` lines of its Context file. A titled fence that shows only part of its file (the types or the methods
  of a benchmark, one tab each) says so with ` excerpt` in its meta and compiles as a fragment.
- A fence that cannot compile says so in its meta, which Fumadocs does not render: ` ```csharp nocheck ` for a
  signature listing, v3 code, an excerpt with elisions or an API outside .NET (Unity's Burst), and
  ` ```csharp expect="NINO019" ` for an example of a mistake, which must report that diagnostic and nothing else.
  The Chinese page carries the same markers and the same code; only comments are translated.
- Byte examples show what Nino writes today (`docs/spec/wire-format.md` in Nino owns the format).

## Numbers

Never type a benchmark number. Runtime numbers come from `src/data/bench-*.json` (synced from the release's
Performance Report, AGENTS.md) through `BenchValue`, `RuntimeTable`, `ReuseTable`, `ExtraRuntimeTables`,
`ResultsTable`, `BenchSource`, `BenchmarkChart`, `RuntimesTables`, `UnityTables` and `UnityHighlights`. Within 5 % is
on par and is written so; never call Nino "slower"; v3 means 3.3.13.

## Headings and links

- Headings say what the section answers, in title case on English pages (as the site does now).
- Chinese headings carry the English id (`## 键控成员 [#keyed-members]`), so anchors match in both languages.
- Internal links are absolute with locale and version (`/en/docs/v4/pooling#settings`); `bun run lint:links` checks
  targets, anchors and icons.

## Tone: English

Concise and concrete: second person, present tense, active voice. Lead with what the reader gets, then how. Name
things exactly (`[NinoType]`, `NinoSerializer.Serialize`). No marketing adjectives. Say what something costs and
when not to use it.

## Tone: Chinese

Written for Chinese .NET and Unity developers, as one of them would write it: the same content and structure as the
English page, each sentence written natively. API and type names stay English. Short sentences; full-width
punctuation in prose; no 翻译腔 (被 passives, 进行 / 通过……的方式 / 对于……来说 padding, long 的 chains).

| 别这样写 | 这样写 |
| --- | --- |
| 该方法被用于对数据进行序列化。 | 这个方法序列化数据。 |
| 通过使用 `[NinoUtf8]` 的方式，你可以实现更小的字符串。 | 加上 `[NinoUtf8]`，字符串按 UTF-8 写，更小。 |
| 对于不可信数据的场景来说，这是一个非常重要的设置。 | 读不可信的数据时，务必打开它。 |

One term per concept, on every page, in the changelog and in Nino's README.zh.md (grep the variants when you touch a
page):

| Concept | Term | Not |
| --- | --- | --- |
| reference tracking | 引用追踪, 追踪引用 | 引用跟踪, 跟踪 |
| deferring deep bodies | 推迟, 推迟的主体 | 延迟 (also reads as latency), 延后 |
| fixed-size types and values | 固定大小 | 定长 (定长整数 stays for fixed-width integers) |
| version tolerance | 版本容错 | 版本兼容 |
| keyed members | 键控成员, 键控类型 | keyed 成员 |
| the 0/1 byte before a sealed class or nullable value | 存在字节 (English: presence byte) | null 标记, null 标志, 有值字节, null flag, has-value byte |
| the bytes Nino writes (the wire format page, the specification) | 二进制格式 | 线格式 |
| deserializing into an existing value (`Deserialize(data, ref value)`) | 复用反序列化 (English: reuse deserialization); 读入已有实例 for the act | 原地反序列化, in-place deserialization |
| formatter, pool, untrusted, interceptor, polymorphism | 格式化器, 对象池, 不可信, 拦截器, 多态 | |

## Before you commit

```bash
bun run check          # types, Biome, links, anchors and icons
bun run check:csharp   # every C# fence compiles against Nino (NINO_DIR or ../Nino), Chinese fences match English
bun run build          # prerender, static files, sitemap, llms.txt, social cards
```

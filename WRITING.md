# Writing the Nino docs

How a page of https://nino.xgamedev.net is written. The audit that checks every page against it is Nino's
`audit-docs` skill (`.claude/skills/audit-docs/SKILL.md` in JasonXuDeveloper/Nino).

## The reader first

**Every docs pass audits and optimizes the site from the reader's experience; every other rule here (order, visual
forms, components, the IA checklist) serves this one.** Before and after a change, walk the site as three readers and
count the friction (clicks and scrolls to the answer, dead ends, a word used before it is explained, a wall of text,
anything read twice):

1. **The newcomer** who wants a first type serialized in five minutes: home → Quick Start → Serialize and
   Deserialize → Defining Types.
2. **The fact hunter** with one question ("how do I version a type", "is X supported on IL2CPP", "what does NINO007
   mean"): from search or the sidebar to the sentence that answers it.
3. **The evaluator** comparing Nino with MemoryPack: home → Nino vs MemoryPack → the benchmarks → Limitations.

A change that makes a page richer but not easier to read is not made. Why: the owner's rule (round 107): the main
goal is the reader's reading experience. Evidence: round 107's walk found the newcomer path behind six "Overview"
pages and at the bottom of the introduction, "Versioning" (Nino's format history) next to "Evolving Your Data" (how
to version your types), and the evaluator's pages split between "Overview" and "Reference".

## Order

The sidebar (`content/docs/v4/meta.json`, `meta.zh.json`, same order) is the reader's path: **Get Started**
(introduction, quick start, serialize and deserialize), **Define Types**, **Features**, **Guides** (the `advanced/`
folder, collapsed: best practices, performance, use cases, engines and languages), **Compare** (vs MemoryPack, vs
MessagePack, vs protobuf-net, the three benchmark pages, limitations), **Reference** (analyzers, platforms, wire format, struct layouts, SIMD,
performance internals, glossary), **Project** (what's new, migration, format versions, changelog, FAQ). A page never
relies on a feature taught later; it links forward instead of explaining twice.

## Information architecture (every docs pass)

Check each item, in both languages, and fix what fails:

- **One home per fact.** Grep the pages for the same fact or explanation (whats-new, changelog, migration and format
  versions; vs-memorypack, vs-messagepack, vs-protobuf-net and benchmarks; performance internals, high-performance, zero-allocation and best
  practices; platforms, struct layouts, wire format and limitations; defining types, supported types and
  constructors; security and limitations; FAQ and the pages it answers from). The owner explains it; the others say
  it in a sentence and link. A page that only repeats others is merged into its owner. Round 107: v3-vs-v4 was
  whats-new's charts plus a feature table (merged into whats-new#features); best practices carried a second copy
  of the zero-allocation recipes (moved to zero-allocation#message-loop); format versions repeated whats-new's
  v4 feature list; Limitations listed v3 problems that whats-new's table already covers.
- **The sidebar is the reader's path** (above): sections of about 3 to 7 pages; a cluster bigger than that is a
  folder (`defaultOpen: false`), a page of another folder can join it with `"../slug"` in its `meta.json`; folders and
  pages carry an icon. A new folder that would move URLs is worth it only when a section passes about 7 pages
  (round 107 kept the four Compare pages a section: a folder would have moved two URLs for a collapse arrow).
- **Titles are short nouns** that say what the page is, the same in the sidebar, the `<h1>`, link texts and cards
  (`Reuse and Pooling`, not `Reuse Deserialization and Pooling`); the long form goes into `seoTitle`. Two titles that
  read alike for different things are a finding ("Versioning" vs "Evolving Your Data" became "Format Versions").
- **Within a page, common before rare**: the recommended form before alternatives, everyday sections before edge
  cases, history last. Every page opens with a lead of one to three sentences saying what it answers, and ends with
  "Next steps" (or "Related") that follow the sidebar path; no dead ends (a page without a way on).
- **Length**: a page past about 3,000 words is split or folds its rare detail into `<Accordions>`, tabs or a
  collapsed component; a page under about 300 words is merged into its neighbour unless it is a landing page or a reference list drawn from data (the glossary).
- **Moved pages and anchors**: a moved or merged page gets 301s for its URL and `.md` copy in `public/_redirects`
  without a fragment in the target (the browser keeps the old one), entries in `public/_routes.json`'s `exclude`, and
  an `<AnchorRedirect>` on the new page for anchors that changed name; every inbound link moves to the new anchor
  (`bun run lint:links`), including `src/`, `scripts/`, the home page and Nino's README.
- **No orphan pages, no duplicate examples**: every page is in a `meta.json`; one example per idea (a second copy of
  a code sample drifts); one term per concept (the glossary below and `src/data/glossary.json`).
- **The newcomer path from the home page**: the home page's first screen and the introduction's first section point
  to Quick Start, Serialize and Deserialize and Defining Types, then to the comparison and the migration guide.
- **Search and llms.txt**: every `title` and `description` reads well alone (the search result and the llms.txt
  line); after a rename, check `build/client/llms.txt` and the sitemap.
- **Mobile**: look at changed pages at 390px wide: no horizontal page scroll, tables scroll inside their box, filters
  and pills wrap.

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
  (`docs/spec/wire-format.md`, Appendix A and the sections' examples, dumps of a real run), never typed from memory
  or worked out from the rules: a figure the spec has no dump for gets one in Nino's spec first.
- **Support matrices**: `<Matrix columns={[...]} rows={[{ group: 'Platforms' }, { label, cells: ['yes', 'no: why',
  'partial: when', 'n/a', ['yes', <>JSX note</>]] }]} />` for any table whose cells are yes, no or partly with a short
  note; lucide icons on the palette's tints, a ✓/✗/⚠/– table in the Markdown copy. Not for tables of values.
- **The category palette** (`--nino-cat-1` to `--nino-cat-5` in `app/app.css`, light and dark) is for byte figures
  and matrices, and for the two marks that share their meanings: the analyzer rules' severity pills (5 error, 4
  warning) and the changelog's wire-format badge (5 changed); everything else keeps the single accent. Why: the owner allowed a small calm palette for
  these two forms (round 105), where colour carries the meaning (which bytes are a header); elsewhere it would only
  decorate. A colour's meaning is fixed site-wide (1 header, 2 length and yes, 3 id or key, 4 value and partly,
  5 changed and no), and the Markdown copy never depends on it.
- **Diagrams**: Mermaid fences (` ```mermaid `), drawn at build time (`src/lib/mermaid.ts`: Mermaid in a headless
  Chromium through Playwright, on mermaid-isomorphic's page), so the page holds the SVG and loads no Mermaid; the
  `neutral` theme, inverted in dark mode (`src/components/mermaid.tsx`); the Markdown copy keeps the source. Keep
  them small (`flowchart LR`, rounded nodes `A(label)`, no diamonds, about six nodes, short labels: a wide diagram
  shrinks its text; no diagram taller than about 420px at desktop width, which the build's spacing and the component
  cap; a decision with a few outcomes is a "question | answer | use" table, not a flowchart, since round 105's
  diamond trees were taller than a screen), no styles or colours, Chinese labels on Chinese pages; write `<` and `>`
  in a label as `#lt;` and `#gt;`. Use one for a flow or an architecture, never for a list. Why: the owner chose EasyEcs docs' build-time rendering
  (round 105) over hand-drawn SVG, and a client-side renderer prerenders empty.

- **Interactive components are for finding and comparing, and work without JavaScript.** Each renders its full
  content in the prerendered HTML (filters only hide, a collapsed part is prerendered open and folds once mounted,
  as `hidden="until-found"`, which React cannot write; a popover's word is still there), has one data source shared with its Markdown form in `src/lib/markdown.tsx`, and is used only where
  it shortens the reader's way to an answer (the reader first, above). Round 107 added five:
  - **`<AnalyzerRules lang>`** (`src/components/analyzer-rules.tsx`, data `src/data/analyzer-rules.json`, English and
    Chinese in one row): the analyzers page's rules as one list with a search box, severity, code-fix and category
    filters, severity pills (tints 5 error, 4 warning) and a wrench for a code fix; each row's id is its anchor
    (`#nino007`, highlighted when targeted), the old category anchors stay. A rule added to Nino is a row in the JSON,
    nowhere else. Use it only there.
  - **Ratio bars** in `RuntimeTable`, `ExtraRuntimeTables` and `ReuseTable` (`TimeBars` in
    `src/components/bench-data.tsx`): two thin bars per row, Nino in the accent and the other library grey, scaled to
    the larger time, so the shorter is the faster and the gap is the ratio; drawn from the same `Measure`s as the
    numbers, never typed, with a legend line under the table; the Markdown copy keeps only the numbers.
  - **`<Release date collapsed lang>`** around each `## version` of the changelog (`src/components/release.tsx`): a
    timeline step with the date and a badge per subsection (wire format tinted 5, new, performance, fixes) whose
    count is taken from the entries themselves; releases older than the two newest are `collapsed` (a link to one of
    their anchors, find-in-page and the button open them). The next, unreleased version has no `date`. The release
    date is the GitHub release's `published_at`.
  - **`<Term id lang>`** (`src/components/glossary.tsx`, data `src/data/glossary.json`, rendered in full by
    `<Glossary>` on the glossary page): a dotted underline whose definition opens on mouse hover, tap, or Enter after
    Tab (Escape closes); the Markdown copy links the word to its glossary entry. Use it once per page, at the first use
    of a word whose meaning in these docs is specific (top-level call, scratch buffer, type id, presence byte), never on
    every occurrence and never in headings. A new term goes into the JSON in both languages, with its links absolute.
  - **`<BytePlayground lang>`** (`src/components/byte-playground.tsx`, data `src/data/byte-examples.json`) on the wire
    format page: pick an example of the specification's Appendix A (and a string value and encoding) and see the
    labelled bytes in a `<Bytes>` figure. Its bytes are the spec's dumps of a real run, never computed or typed from
    memory; `bun run check:bytes` (below) checks every row. Add an example only when the spec has its dump.
- **Every byte figure is checked**: `bun run check:bytes` (`scripts/check-bytes.ts`, `NINO_DIR` like
  `check:csharp`) finds each `<Bytes>` row of the v4 pages and each playground row in a hex dump of Nino's
  `docs/spec/wire-format.md` or in a file of `conformance/corpus/valid`, and fails on any row it cannot find. Run it
  after any change to a figure and after a wire-format change in Nino.
- **Layout is fixed in the component, checked at 390px, 1024px and 1280px**: at 1024 and up every table and matrix
  fits the column; a table with more columns than fit is restructured (transposed, or reduced to the cells that
  differ, as struct layouts' "Where it differs"), never left to scroll. At 390 a table scrolls inside its box rather
  than squeezing: prose cells keep 6rem and cells of running text 10rem (`TableCell`, `src/mdx-components.tsx`). A
  number never wraps away from its unit (`whitespace-nowrap` on time cells), nor a run of hex bytes (`nino-bytes`);
  inline code breaks inside a token only when it cannot fit a line (`app/app.css`), and a token over 24 characters may
  break anywhere in a table cell from 768px (`InlineCode`); a minimum width that only phones need is a container
  query (`@2xl:min-w-0` in `Matrix`); a code block's copy button shows on hover or focus and sits above the code on
  touch screens, never over it. Why: the owner's complaints were all layout seen at one width only, and "problems
  get solved, not skipped" (round 122). Evidence: round 117's Playwright pass over every v4 page found the
  changelog's long MSBuild code clipped at 390, "366 ns" split over two lines in every benchmark table, the charts'
  axis title cut to "elative time", and the SIMD matrix and five prose tables scrolling at 1280 for one cell; round
  122 found 179 phone table cells squeezed to a word or character per line and two tables of 6 and 9 columns
  scrolling at 1280. Serve `build/client` with a server that maps `/en` to `en.html` (Python's `http.server` lists
  the directory there, and `.html` URLs hydrate the wrong route); emulate touch (`hasTouch`, `isMobile`) to see what
  a phone sees.

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
bun run check:bytes    # every byte figure and playground row is in the spec's dumps or the conformance corpus
bun run build          # prerender, static files, sitemap, llms.txt, social cards
```

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

## Code

- C# fences with Shiki notation (`// [!code highlight]`, `// [!code ++]`, `title="File.cs"`); alternatives (before
  and after, Nino and MemoryPack, the files of one step) in tabs.
- Every fence compiles against the current Nino source and reports no NINO warning; examples model a real domain and
  use the recommended form, because readers copy them.
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

## Before you commit

```bash
bun run check    # types, Biome, links, anchors and icons
bun run build    # prerender, static files, sitemap, llms.txt, social cards
```

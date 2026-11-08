/**
 * Renders a docs page to clean Markdown for LLMs and the `.md` copies: the
 * compiled MDX runs with Markdown versions of every component (Fumadocs'
 * `renderToMarkdown`), so tabs, callouts, cards and the benchmark tables come
 * out as plain Markdown instead of JSX. Build-time only (scripts/).
 */
import { asMarkdown, md, renderToMarkdown } from 'fumadocs-core/server';
import {
  type ComponentProps,
  Children as ReactChildren,
  type ReactNode,
} from 'react';
import {
  analyzerCategories,
  analyzerRules,
  ruleHref,
  ruleText,
} from '@/components/analyzer-rules';
import {
  ArchTabs,
  BenchSource,
  benchValue,
  ExtraRuntimeTables,
  LibraryTables,
  ResultsTable,
  ReuseTable,
  RuntimesTables,
  RuntimeTable,
  UnityHighlights,
  UnityTables,
} from '@/components/bench-data';
import { byteCountText, byteExamples } from '@/components/byte-playground';
import {
  type ByteRow,
  byteCells,
  type MatrixRow,
  parseCell,
} from '@/components/bytes';
import { chartProps } from '@/components/charts/benchmark-charts';
import { type ChartId, isArchChart } from '@/components/charts/ids';
import { glossary, glossaryHref } from '@/components/glossary';
import { getMDXComponents } from '@/mdx-components';
import type { Locale } from './i18n';
import { siteUrl } from './site';
import type { source } from './source';

type Page = NonNullable<ReturnType<typeof source.getPage>>;

interface Children {
  children?: ReactNode;
}

const calloutLabels: Record<Locale, Record<string, string>> = {
  en: { info: 'Note', idea: 'Tip', warn: 'Warning', error: 'Important' },
  zh: { info: '注意', idea: '提示', warn: '警告', error: '重要' },
};

/** Site links become absolute, `#anchor` links point at the page itself. */
function absolute(href: string, pageUrl: string) {
  if (href.startsWith('#')) return `${siteUrl}${pageUrl}${href}`;
  return href.startsWith('/') ? `${siteUrl}${href}` : href;
}

function table(head: ReactNode[], rows: ReactNode[][]) {
  return (
    <table>
      <thead>
        <tr>
          {head.map((cell, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static table
            <th key={i}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells, r) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static table
          <tr key={r}>
            {cells.map((cell, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static table
              <td key={i}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatNs(ns: number) {
  if (ns >= 1_000_000) return `${(ns / 1_000_000).toFixed(2)} ms`;
  if (ns >= 1_000) return `${(ns / 1_000).toFixed(2)} µs`;
  return `${ns.toFixed(ns < 10 ? 2 : 1)} ns`;
}

function markdownComponents(lang: Locale, pageUrl: string) {
  const link = (href: string) => absolute(href, pageUrl);
  // site links inside inline Markdown from a data file
  const links = (text: string) =>
    text.replace(/\]\((\/[^)\s]*)\)/g, (_, href) => `](${link(href)})`);
  const zh = lang === 'zh';
  return {
    a({ href, children }: ComponentProps<'a'>) {
      asMarkdown();
      if (!href) return children;
      return md`[${children}](${link(href)})`;
    },
    FeedbackBlock({ children }: Children) {
      asMarkdown();
      return children;
    },
    // The analyzer rules: a table per category, the same rows as the page.
    AnalyzerRules() {
      asMarkdown();
      const t = ruleText[lang];
      return (
        <>
          {analyzerCategories.map((c) => (
            <div key={c.id}>
              {md`\n**${c[lang]}**\n\n`}
              {table(
                t.head,
                analyzerRules
                  .filter((rule) => rule.category === c.id)
                  .map((rule) => [
                    md`[${rule.id}](${link(ruleHref(rule, lang))})`,
                    t[rule.severity],
                    links(rule[lang].problem),
                    links(rule[lang].fix),
                    rule.codeFix ? '✅' : '',
                  ]),
              )}
            </div>
          ))}
        </>
      );
    },
    // The byte playground: every example, its code and its bytes.
    BytePlayground() {
      asMarkdown();
      const meaning = [zh ? '字节' : 'Bytes', zh ? '含义' : 'Meaning'];
      return (
        <>
          {byteExamples.map((e) => (
            <div key={e.id}>
              {md`\n**${e[lang].title}** (${zh ? '规范附录' : 'specification, Appendix'} ${e.spec})\n\n\`\`\`csharp\n${e.code}\n\`\`\`\n\n${e[lang].note}\n\n`}
              {e.rows?.map((row) => (
                <div key={row.en}>
                  {md`\n\`${row[lang]}\` (${byteCountText(row.fields, zh)}):\n\n`}
                  {table(
                    meaning,
                    row.fields.map((f) => [md`\`${f.hex}\``, f[lang]]),
                  )}
                </div>
              ))}
              {e.strings
                ? table(
                    [
                      zh ? '值' : 'Value',
                      zh ? '默认' : 'Default',
                      '`[NinoUtf8]`',
                    ],
                    e.strings.map((s) => [
                      md`\`${s.value}\``,
                      md`\`${s.def.map((f) => f.hex).join(' ')}\``,
                      md`\`${s.utf8.map((f) => f.hex).join(' ')}\``,
                    ]),
                  )
                : null}
            </div>
          ))}
        </>
      );
    },
    // The glossary as a list; a term in prose links to its entry.
    Glossary() {
      asMarkdown();
      return glossary
        .map(
          (t) =>
            `- **${t[lang].term}**${zh ? '：' : ': '}${links(t[lang].definition)}\n`,
        )
        .join('');
    },
    Term({ id, children }: Children & { id: string }) {
      asMarkdown();
      return md`[${children}](${link(glossaryHref(id, lang))})`;
    },
    // A changelog release: its heading, the date, then the entries as they are.
    Release({ date, children }: Children & { date?: string }) {
      asMarkdown();
      const [heading, ...body] = ReactChildren.toArray(children);
      return md`${heading}${date ? (zh ? `发布于 ${date}\n\n` : `Released ${date}\n\n`) : ''}${body}`;
    },
    AnchorRedirect() {
      asMarkdown();
      return null;
    },
    Callout({
      type = 'info',
      title,
      children,
    }: Children & { type?: string; title?: ReactNode }) {
      asMarkdown();
      return (async () => {
        const label =
          title ?? calloutLabels[lang][type] ?? calloutLabels[lang].info;
        const body = (await md`${children}`).replace(/\n{3,}/g, '\n\n').trim();
        return md.linePrefix('> ')`**${label}**\n\n${body}`;
      })();
    },
    Tabs({ children }: Children) {
      asMarkdown();
      return children;
    },
    Tab({
      value,
      title,
      children,
    }: Children & { value?: string; title?: string }) {
      asMarkdown();
      return md`\n**${title ?? value ?? ''}**\n\n${children}\n\n`;
    },
    Cards({ children }: Children) {
      asMarkdown();
      return md`\n${children}\n\n`;
    },
    Card({
      title,
      href,
      description,
      children,
    }: Children & {
      title?: ReactNode;
      href?: string;
      description?: ReactNode;
    }) {
      asMarkdown();
      const name = href ? md`[${title}](${link(href)})` : title;
      return (async () => {
        const text = (await md`${description ?? children}`)
          .trim()
          .replace(/\s*\n\s*/g, ' ');
        return text ? md`- ${name}: ${text}\n` : md`- ${name}\n`;
      })();
    },
    Steps({ children }: Children) {
      asMarkdown();
      return children;
    },
    Step({ children }: Children) {
      asMarkdown();
      return children;
    },
    // A byte figure: one table per row, the bytes and what they are.
    Bytes({ rows, caption }: { rows: ByteRow[]; caption?: ReactNode }) {
      asMarkdown();
      return (
        <>
          {rows.map((row, r) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static figure
            <div key={r}>
              {row.title ? md`\n**${row.title}**\n\n` : null}
              {table(
                [zh ? '字节' : 'Bytes', zh ? '含义' : 'Meaning'],
                row.fields.map((field) => [
                  md`\`${byteCells(field.hex).join(' ')}\``,
                  field.label,
                ]),
              )}
            </div>
          ))}
          {caption ? md`\n${caption}\n\n` : null}
        </>
      );
    },
    // A support matrix: ✓, ✗, ⚠ and – with the cell's note.
    Matrix({
      columns,
      rows,
      corner,
    }: {
      columns: ReactNode[];
      rows: MatrixRow[];
      corner?: ReactNode;
    }) {
      asMarkdown();
      const symbols: Record<string, string> = {
        yes: '✓',
        no: '✗',
        partial: '⚠',
        'n/a': '–',
      };
      return table(
        [corner ?? '', ...columns],
        rows.map((row) =>
          'group' in row
            ? [<strong key="g">{row.group}</strong>, ...columns.map(() => '')]
            : [
                row.label,
                ...row.cells.map((cell) => {
                  const { mark, note } = parseCell(cell);
                  const symbol = mark ? symbols[mark] : '';
                  return note ? (
                    <>
                      {symbol ? `${symbol} ` : ''}
                      {note}
                    </>
                  ) : (
                    symbol
                  );
                }),
              ],
        ),
      );
    },
    // A ```mermaid fence keeps its source: language models read it well.
    Mermaid({ chart }: { chart: string }) {
      asMarkdown();
      return md`\n\`\`\`mermaid\n${chart.trim()}\n\`\`\`\n\n`;
    },
    // Code-block tabs (```csharp tab="Nino"): each fence under its label.
    CodeBlockTabs({ children }: Children) {
      asMarkdown();
      return children;
    },
    CodeBlockTabsList() {
      asMarkdown();
      return null;
    },
    CodeBlockTab({ value, children }: Children & { value?: string }) {
      asMarkdown();
      return md`\n**${value ?? ''}**\n\n${children}\n\n`;
    },
    Accordions({ children }: Children) {
      asMarkdown();
      return children;
    },
    Accordion({ title, children }: Children & { title?: ReactNode }) {
      asMarkdown();
      return md`\n**${title}**\n\n${children}\n\n`;
    },
    TypeTable({
      type,
    }: {
      type: Record<
        string,
        { type?: ReactNode; description?: ReactNode; default?: ReactNode }
      >;
    }) {
      asMarkdown();
      const entries = Object.entries(type);
      const withDefault = entries.some(([, v]) => v.default !== undefined);
      const head = zh
        ? ['名称', '类型', '说明', ...(withDefault ? ['默认值'] : [])]
        : ['Name', 'Type', 'Description', ...(withDefault ? ['Default'] : [])];
      return table(
        head,
        entries.map(([name, v]) => [
          <code key="n">{name}</code>,
          v.type ? <code key="t">{v.type}</code> : '',
          v.description ?? '',
          ...(withDefault
            ? [v.default !== undefined ? <code key="d">{v.default}</code> : '']
            : []),
        ]),
      );
    },
    Files({ children }: Children) {
      asMarkdown();
      return md`\n${children}\n\n`;
    },
    Folder({ name, children }: Children & { name: string }) {
      asMarkdown();
      return md`- ${name}/\n${md.indent(2)`${children}`}`;
    },
    File({ name }: { name: string }) {
      asMarkdown();
      return `- ${name}\n`;
    },
    CountUp({ value }: { value: string }) {
      asMarkdown();
      return value;
    },
    BenchValue({ k }: { k: string }) {
      asMarkdown();
      return benchValue(k);
    },
    BenchSource(props: { lang?: Locale }) {
      asMarkdown();
      return BenchSource({ ...props, markdown: true });
    },
    RuntimeTable(props: ComponentProps<typeof RuntimeTable>) {
      asMarkdown();
      return RuntimeTable({ ...props, markdown: true });
    },
    ExtraRuntimeTables(props: ComponentProps<typeof ExtraRuntimeTables>) {
      asMarkdown();
      return ExtraRuntimeTables({ ...props, markdown: true });
    },
    LibraryTables(props: ComponentProps<typeof LibraryTables>) {
      asMarkdown();
      return LibraryTables({ ...props, markdown: true });
    },
    ReuseTable(props: ComponentProps<typeof ReuseTable>) {
      asMarkdown();
      return ReuseTable({ ...props, markdown: true });
    },
    // The interactive charts draw the tables that follow them: the Markdown
    // copy (llms.txt, AI readers) keeps the tables only.
    RuntimesChart() {
      return null;
    },
    UnityChart() {
      return null;
    },
    RuntimesTables(props: ComponentProps<typeof RuntimesTables>) {
      asMarkdown();
      return RuntimesTables({ ...props, markdown: true });
    },
    UnityTables(props: ComponentProps<typeof UnityTables>) {
      asMarkdown();
      return UnityTables({ ...props, markdown: true });
    },
    UnityHighlights(props: ComponentProps<typeof UnityHighlights>) {
      asMarkdown();
      return UnityHighlights({ ...props, markdown: true });
    },
    ResultsTable(props: ComponentProps<typeof ResultsTable>) {
      asMarkdown();
      return ResultsTable({ ...props, markdown: true });
    },
    // A chart becomes its title, its data table and its footnotes. Charts
    // drawn next to a table of the same numbers (table={false}) are skipped.
    BenchmarkChart({
      chart,
      table: withTable = true,
    }: {
      chart: ChartId | ChartId[];
      table?: boolean;
    }) {
      asMarkdown();
      if (!withTable) return null;
      const ids = Array.isArray(chart) ? chart : [chart];
      const charts = (arch?: 'x64' | 'arm64') =>
        ids.map((id) => {
          const props = chartProps(id, zh, arch);
          if (!props?.table) return null;
          return (
            <div key={id}>
              <p>
                <strong>{props.title}</strong>
              </p>
              {table(props.table.head, props.table.rows)}
              {props.footnotes?.map((note) => (
                <p key={String(note)}>{note}</p>
              ))}
            </div>
          );
        });
      if (!isArchChart(chart)) return charts();
      // x64 and Arm64 under labels once Arm64 data exists
      return ArchTabs({
        markdown: true,
        render: (ds, tabbed) => charts(tabbed ? ds.arch : undefined),
      });
    },
    // Archived versions' benchmark chart: its numbers as a table.
    BenchChart({
      data,
    }: {
      data: {
        name: string;
        nino: number;
        memorypack?: number;
        messagepack?: number;
      }[];
    }) {
      asMarkdown();
      if (data.length === 0) return null;
      const columns = (['nino', 'memorypack', 'messagepack'] as const).filter(
        (key) => data.some((row) => row[key] !== undefined),
      );
      const names = {
        nino: 'Nino',
        memorypack: 'MemoryPack',
        messagepack: 'MessagePack',
      };
      return table(
        [zh ? '用例' : 'Case', ...columns.map((key) => names[key])],
        data.map((row) => [
          row.name,
          ...columns.map((key) => {
            const value = row[key];
            return value === undefined ? '—' : formatNs(value);
          }),
        ]),
      );
    },
  };
}

/** The page body as Markdown, without the title. */
export async function pageBodyMarkdown(page: Page, lang: Locale) {
  const Body = page.data.body as (props: {
    components: Record<string, unknown>;
  }) => ReactNode;
  // Call the MDX content directly: its elements are then rendered with the
  // Markdown components above, and plain HTML elements become Markdown.
  return renderToMarkdown(
    Body({ components: withFallbacks(markdownComponents(lang, page.url)) }),
  );
}

/**
 * Any other component available to MDX (src/mdx-components.tsx) keeps just
 * its children, so a new component never breaks the build; give it a real
 * Markdown form above when it carries content.
 */
function withFallbacks(components: Record<string, unknown>) {
  const all: Record<string, unknown> = {};
  for (const name of Object.keys(getMDXComponents())) {
    if (!/^[A-Z]/.test(name)) continue;
    all[name] = ({ children }: Children) => {
      asMarkdown();
      return children ?? null;
    };
  }
  return { ...all, ...components };
}

/** Markdown inline syntax to plain text, for JSON-LD */
function plainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\s*\n\s*/g, ' ')
    .trim();
}

/**
 * Question and answer pairs of an FAQ page: every `##` heading that ends with
 * a question mark, and the text under it.
 */
export function faqFromMarkdown(markdown: string) {
  const faq: { question: string; answer: string }[] = [];
  for (const section of markdown.split(/^## /m).slice(1)) {
    const [heading, ...body] = section.split('\n');
    const question = heading.trim();
    if (!/[?？]$/.test(question)) continue;
    const answer = plainText(body.join('\n').split(/^#{1,3} /m)[0]);
    if (answer) faq.push({ question, answer });
  }
  return faq;
}

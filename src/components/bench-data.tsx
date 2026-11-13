/**
 * MDX components that print the v4 runtime benchmarks from src/lib/benchmarks.ts
 * (synced from the release report), so no page types those numbers in.
 *
 * The .NET tables compare Nino with MemoryPack, and with the other libraries
 * (`otherLibs`) in a column each once the synced release measured them ("—"
 * for a case a library cannot express); LibraryTables compares Nino with one of
 * them alone, for its comparison page; GroupTables prints one group of
 * dotnetGroups (time per operation, payload, allocations) under that group's
 * chart on the benchmarks page (BenchGroup), and IfWorkloads picks the prose that fits
 * the synced data (the headline comes from the workloads once it has them). RuntimesTables prints the Go, Rust and
 * TypeScript benchmarks of the same release, UnityTables and UnityHighlights
 * the Unity player's times without and with the Burst kernels, and BuildTables
 * the source generator benchmark (v3 3.3.13 vs v4) at each workload size.
 *
 * Once the synced data has an Arm64 report, every .NET table shows x64 and Arm64 in tabs (`ArchTabs`), each with the source line
 * of its run; without it, the x64 table alone, as before. Values in prose
 * (BenchValue) are always x64.
 */
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Fragment, type ReactNode } from 'react';
import {
  archLabels,
  arm64,
  type BenchDataset,
  type BuildMeasure,
  type BuildSizeTable,
  buildDecimals,
  buildLarge,
  buildRatioText,
  buildRow,
  buildSizes,
  buildSmall,
  buildSource,
  buildSourceNote,
  classRatioRange,
  type DotnetGroupId,
  datasets,
  formatBound,
  formatBytes,
  formatClassRange,
  formatRatio,
  formatWorkloadRange,
  gcNote,
  hasWorkloads,
  lowerBound,
  type Opponent,
  type OtherLib,
  otherLibs,
  payload,
  type RuntimeLang,
  ratioRange,
  reuse,
  reuseSpeedup,
  runtime,
  runtimes,
  runtimesSource,
  sourceNote,
  type TableCase,
  times,
  type UnityCase,
  unity,
  unitySource,
  type Versus,
  v3VersusOf,
  versusOf,
  workloadRange,
  x64,
} from '@/lib/benchmarks';
import type { Locale } from '@/lib/i18n';
import { siteUrl } from '@/lib/site';

type Op = 'serialize' | 'deserialize';

/**
 * One groupId for every architecture switch on the site, persisted: picking
 * Arm64 once switches every table and chart, on this page and the next.
 */
export const archGroupId = 'bench-arch';

/** Props every component that can show both architectures takes */
interface ArchProps {
  lang?: Locale;
  /** The Markdown copy (src/lib/markdown.tsx): both architectures under labels instead of tabs */
  markdown?: boolean;
}

/**
 * `render(dataset)` for x64 alone while there is no Arm64 data; otherwise
 * x64 and Arm64 in synced tabs (both rendered, so the prerendered HTML holds
 * both), or one after the other under labels in Markdown. `render` gets
 * `tabbed` to add the source line naming the machine.
 */
export function ArchTabs({
  render,
  markdown,
}: {
  render: (ds: BenchDataset, tabbed: boolean) => ReactNode;
  markdown?: boolean;
}) {
  if (!arm64) return <>{render(x64, false)}</>;
  if (markdown)
    return (
      <>
        {datasets.map((ds) => (
          <Fragment key={ds.arch}>
            <p>
              <strong>{archLabels[ds.arch]}</strong>
            </p>
            {render(ds, true)}
          </Fragment>
        ))}
      </>
    );
  return (
    <Tabs
      groupId={archGroupId}
      persist
      items={datasets.map((ds) => archLabels[ds.arch])}
    >
      {datasets.map((ds) => (
        <Tab key={ds.arch} value={archLabels[ds.arch]} forceMount>
          {render(ds, true)}
        </Tab>
      ))}
    </Tabs>
  );
}

/** Source line of one architecture's run: the release, and in tabs the machine */
function sourceLine(ds: BenchDataset, zh: boolean, tabbed: boolean) {
  return (
    <p className="text-sm text-fd-muted-foreground">
      <a href={ds.source.url} target="_blank" rel="noopener noreferrer">
        {sourceNote(zh, ds, tabbed)}
      </a>
    </p>
  );
}

function caseName(row: TableCase, zh: boolean) {
  const name = zh && row.zh ? row.zh : row.name;
  return row.code ? <code>{name}</code> : name;
}

/**
 * Two thin bars under a ratio: each time against the larger of the two, so
 * the shorter bar is the faster library and the gap is the ratio itself. Only
 * on the page: the Markdown copy keeps the numbers (the bars carry no others).
 */
function TimeBars({
  bars,
}: {
  bars: { label: string; time: { ns: number; text: string }; nino?: boolean }[];
}) {
  const max = Math.max(...bars.map((bar) => bar.time.ns));
  if (!(max > 0)) return null;
  return (
    <span
      className="mt-1 ml-auto flex w-24 flex-col gap-0.5"
      role="img"
      aria-label={bars.map((bar) => `${bar.label} ${bar.time.text}`).join(', ')}
    >
      {bars.map((bar) => (
        <span
          key={bar.label}
          title={`${bar.label}: ${bar.time.text}`}
          className={
            bar.nino
              ? 'block h-1.5 rounded-full bg-fd-primary'
              : 'block h-1.5 rounded-full bg-fd-muted-foreground/40'
          }
          style={{ width: `${Math.max(2, (bar.time.ns / max) * 100)}%` }}
        />
      ))}
    </span>
  );
}

function barsLegend(zh: boolean, nino: string, other: string) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fd-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-5 rounded-full bg-fd-primary" />
        {nino}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-5 rounded-full bg-fd-muted-foreground/40" />
        {other}
      </span>
      <span>
        {zh
          ? '条形是每行的时间，越短越快。'
          : 'Bars: the time of each row, shorter is faster.'}
      </span>
    </p>
  );
}

/** Nino under FLOOR_NS against a measurable time `ns`: faster by more than ns / FLOOR_NS (formatBound) */
function boundText(ns: number, zh: boolean) {
  const bound = formatBound(ns);
  return zh ? `快 ${times(lowerBound(ns))} 倍以上` : `${bound} faster`;
}

/** `boundNs`: the other time, when Nino ran under FLOOR_NS and it did not (tooFast) */
function ratioCell(ratio: number | undefined, zh: boolean, boundNs?: number) {
  if (boundNs !== undefined) return <strong>{boundText(boundNs, zh)}</strong>;
  if (ratio === undefined) return zh ? '持平' : 'on par';
  const r = times(ratio);
  if (ratio > 1) return <strong>{zh ? `快 ${r} 倍` : `${r}× faster`}</strong>;
  // v4 not ahead: a dash, as in Nino's README and docs/v4-benchmarks.md (the times show it).
  return '—';
}

/**
 * After a time of another serializer: how many times faster Nino is, as in the
 * ratio columns ("on par" within 5%, nothing when Nino is not ahead: the times
 * show it).
 */
function versusNote(vs: Versus | undefined, zh: boolean) {
  if (!vs) return null;
  let text: string | null = null;
  if (vs.tooFast) text = formatBound(vs.time.ns);
  else if (vs.ratio === undefined) text = zh ? '持平' : 'on par';
  else if (vs.ratio > 1) text = formatRatio(vs.ratio);
  if (!text) return null;
  return <span className="text-fd-muted-foreground"> · {text}</span>;
}

function versusLegend(zh: boolean, nino: string) {
  return (
    <p className="text-sm text-fd-muted-foreground">
      {zh
        ? `时间后的 “· 2.1×” 表示这个用例里 ${nino} 比这个序列化器快多少倍；相差 5% 以内算持平；只有时间表示 ${nino} 在这个用例里没有领先。`
        : `“· 2.1×” after a time: how many times faster ${nino} is than that serializer in that case; within 5% is on par; a time alone means ${nino} is not ahead there.`}
    </p>
  );
}

/** Where the numbers come from, with a link to the release or the local report */
export function BenchSource({ lang = 'en', markdown }: ArchProps) {
  const zh = lang === 'zh';
  return ArchTabs({
    markdown,
    render: (ds, tabbed) => sourceLine(ds, zh, tabbed),
  });
}

/**
 * Nino against one other .NET serializer (MessagePack or protobuf-net): a
 * serialize and a deserialize table of every case the synced report measured
 * for that library (the workloads, the main cases, then reference tracking,
 * version tolerance and fixed-size types), and the size of one SimpleClass. A note stands in for
 * them until a release report includes the library. For the comparison pages.
 */
export function LibraryTables({
  lib,
  lang = 'en',
  markdown,
}: ArchProps & { lib: OtherLib }) {
  const zh = lang === 'zh';
  const label = otherLibs.find((other) => other.key === lib)?.label ?? lib;
  // Not measured on any architecture yet: one note, outside the tabs.
  if (!datasets.some((ds) => libraryRows(ds, lib).length > 0))
    return (
      <p className="text-sm text-fd-muted-foreground">
        {zh
          ? `${label} 已在 Nino 的基准测试项目中，读写的数据与 Nino 相同，但已发布的报告还没有收录。等某个版本的报告收录后，结果会显示在这里。`
          : `${label} is in Nino's benchmark project, reading and writing the same data as Nino, but the published report does not include it yet. Its results appear here once a release report does.`}
      </p>
    );
  return ArchTabs({
    markdown,
    render: (ds, tabbed) => (
      <>
        {libraryTables(ds, lib, label, zh, markdown)}
        {tabbed && sourceLine(ds, zh, true)}
      </>
    ),
  });
}

/** The cases of one report that `lib` was measured in, by operation */
function libraryRows(ds: BenchDataset, lib: OtherLib) {
  if (!ds.libraries.includes(lib)) return [];
  return (['serialize', 'deserialize'] as const).flatMap((op) => {
    const rows = [
      ...ds.workloads[op],
      ...ds.runtime[op],
      ...ds.extraRuntime[op],
      ...Object.values(ds.more).flatMap((set) => set[op]),
    ].filter((row) => row.others[lib]);
    return rows.length > 0 ? [{ op, rows }] : [];
  });
}

function libraryTables(
  ds: BenchDataset,
  lib: OtherLib,
  label: string,
  zh: boolean,
  markdown?: boolean,
) {
  const tables = libraryRows(ds, lib);
  if (tables.length === 0)
    return (
      <p className="text-sm text-fd-muted-foreground">
        {zh
          ? `这次运行没有测量 ${label}。`
          : `${label} was not measured in this run.`}
      </p>
    );
  const ninoBytes = ds.payload.v4;
  const otherBytes = ds.payload[lib];
  return (
    <>
      {tables.map(({ op, rows }) => (
        <Fragment key={op}>
          <p>
            <strong>
              {op === 'serialize'
                ? zh
                  ? '序列化'
                  : 'Serialize'
                : zh
                  ? '反序列化'
                  : 'Deserialize'}
            </strong>
          </p>
          <div className="relative overflow-auto prose-no-margin my-6">
            <table>
              <thead>
                <tr>
                  <th>{zh ? '用例' : 'Case'}</th>
                  <th className="text-right">Nino v4</th>
                  <th className="text-right">{label}</th>
                  <th className="text-right">
                    {zh ? `Nino 对比 ${label}` : `Nino vs ${label}`}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const vs = row.others[lib] as Versus;
                  return (
                    <tr key={row.key}>
                      <td>{caseName(row, zh)}</td>
                      <td className="text-right tabular-nums whitespace-nowrap">
                        {row.v4.text}
                      </td>
                      <td className="text-right tabular-nums whitespace-nowrap">
                        {vs.time.text}
                      </td>
                      <td className="text-right tabular-nums">
                        {ratioCell(
                          vs.ratio,
                          zh,
                          vs.tooFast ? vs.time.ns : undefined,
                        )}
                        {!markdown && (
                          <TimeBars
                            bars={[
                              { label: 'Nino v4', time: row.v4, nino: true },
                              { label, time: vs.time },
                            ]}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Fragment>
      ))}
      {!markdown && barsLegend(zh, 'Nino v4', label)}
      {ninoBytes !== null && otherBytes !== null && (
        <p className="text-sm text-fd-muted-foreground">
          {zh
            ? `一个 SimpleClass 序列化后：Nino ${formatBytes(ninoBytes)}，${label} ${formatBytes(otherBytes)}。`
            : `One serialized SimpleClass: ${formatBytes(ninoBytes)} in Nino, ${formatBytes(otherBytes)} in ${label}.`}
        </p>
      )}
    </>
  );
}

/** Shows its children only when the synced data has the workloads (or, with `not`, only when it has none) */
export function IfWorkloads({
  children,
  not,
}: {
  children?: ReactNode;
  not?: boolean;
}) {
  return hasWorkloads === !not ? children : null;
}

/** "Google.Protobuf" may break after its dots on the page ("System.Text.Json" is the widest header) */
function breakable(label: string, markdown?: boolean) {
  if (markdown) return label;
  return label
    .split('.')
    .flatMap((part, i, parts) =>
      i < parts.length - 1 ? [`${part}.`, <wbr key={part} />] : [part],
    );
}

type GroupColumn = 'v4' | 'v3' | Opponent;

/** Nino v4, v3 where the group has v3 numbers (x64), MemoryPack, then each other library with a row */
function groupColumns(rows: TableCase[]) {
  const columns: { key: GroupColumn; label: string }[] = [
    { key: 'v4', label: 'Nino v4' },
  ];
  if (rows.some((row) => row.v3)) columns.push({ key: 'v3', label: 'Nino v3' });
  if (rows.some((row) => row.memorypack))
    columns.push({ key: 'memorypack', label: 'MemoryPack' });
  for (const lib of otherLibs)
    if (rows.some((row) => row.others[lib.key]))
      columns.push({ key: lib.key, label: lib.label });
  return columns;
}

/**
 * The numbers of one group of dotnetGroups, in one architecture: a time table
 * per operation (each time with how many times faster Nino v4 is), then the
 * payload of each serialized case and the bytes allocated per call, where the
 * report has them (v3 has times only). Every group's numbers look alike.
 */
function groupTables(
  ds: BenchDataset,
  group: DotnetGroupId,
  zh: boolean,
  markdown?: boolean,
) {
  const { serialize, deserialize } = ds.groups[group];
  const columns = groupColumns([...serialize, ...deserialize]);
  const name = (row: TableCase) => {
    const text = zh && row.zh ? row.zh : row.name;
    return row.code && !markdown ? <code>{text}</code> : text;
  };
  const size = (value: number | null | undefined) =>
    value === null || value === undefined ? '—' : formatBytes(value);
  const table = (
    rows: TableCase[],
    keys: typeof columns,
    cell: (row: TableCase, key: GroupColumn) => ReactNode,
  ) => (
    // Up to eight columns: a smaller type keeps them inside the column from 1024px
    <div className="relative overflow-auto prose-no-margin my-4 text-sm">
      <table>
        <thead>
          <tr>
            <th>{zh ? '用例' : 'Case'}</th>
            {keys.map((column) => (
              <th key={column.key} className="text-right">
                {breakable(column.label, markdown)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>
                {name(row)}
                {row.gcBound && ' †'}
              </td>
              {keys.map((column) => (
                <td key={column.key} className="text-right tabular-nums">
                  {cell(row, column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  const time = (row: TableCase, key: GroupColumn) => {
    if (key === 'v4')
      return <span className="whitespace-nowrap">{row.v4.text}</span>;
    const vs = key === 'v3' ? v3VersusOf(row) : versusOf(row, key);
    if (!vs) return key === 'v3' ? 'n/a' : '—';
    const note = versusNote(vs, zh);
    // On the page the multiple goes on a line of its own, so the table fits the column
    return (
      <>
        <span className="whitespace-nowrap">{vs.time.text}</span>
        {note && (markdown ? note : <span className="block">{note}</span>)}
      </>
    );
  };
  const label = (en: string, cn: string) => (
    <p>
      <strong>{zh ? cn : en}</strong>
    </p>
  );
  // v3's report has no allocations or payloads
  const byteColumns = columns.filter((column) => column.key !== 'v3');
  const has = (rows: TableCase[], field: 'payload' | 'allocated') =>
    rows.some((row) =>
      byteColumns.some(
        (column) =>
          (row.bytes[column.key as 'v4' | Opponent]?.[field] ?? null) !== null,
      ),
    );
  // One row per case for the allocations: serialize above deserialize where a case has both
  const allocRows = serialize.length > 0 ? serialize : deserialize;
  const deserializeOf = (row: TableCase) =>
    deserialize.find((other) => other.key === row.key);
  const both = serialize.length > 0 && deserialize.length > 0;
  return (
    <>
      {serialize.length > 0 && (
        <>
          {label('Serialize', '序列化')}
          {table(serialize, columns, time)}
        </>
      )}
      {deserialize.length > 0 && (
        <>
          {group === 'reuse'
            ? label('Deserialize', '反序列化')
            : label('Deserialize (new instances)', '反序列化（新实例）')}
          {table(deserialize, columns, time)}
        </>
      )}
      {has(serialize, 'payload') && (
        <>
          {label('Payload', '序列化后的大小')}
          {table(serialize, byteColumns, (row, key) => (
            <span className="whitespace-nowrap">
              {size(row.bytes[key as 'v4' | Opponent]?.payload)}
            </span>
          ))}
        </>
      )}
      {has([...serialize, ...deserialize], 'allocated') && (
        <>
          {both
            ? label(
                markdown
                  ? 'Allocated per call (serialize / deserialize)'
                  : 'Allocated per call (serialize, then deserialize)',
                markdown
                  ? '每次调用分配（序列化 / 反序列化）'
                  : '每次调用分配（上为序列化，下为反序列化）',
              )
            : label('Allocated per call', '每次调用分配')}
          {table(allocRows, byteColumns, (row, key) => {
            const lib = key as 'v4' | Opponent;
            const first = row.bytes[lib]?.allocated;
            if (!both) return size(first);
            const second = deserializeOf(row)?.bytes[lib]?.allocated;
            if (markdown) return `${size(first)} / ${size(second)}`;
            return (
              <>
                <span className="block whitespace-nowrap">{size(first)}</span>
                <span className="block whitespace-nowrap">{size(second)}</span>
              </>
            );
          })}
        </>
      )}
      {versusLegend(zh, 'Nino v4')}
      {[...serialize, ...deserialize].some((row) => row.gcBound) && (
        <p className="text-sm text-fd-muted-foreground">
          {zh ? gcNote.zh : gcNote.en}
        </p>
      )}
    </>
  );
}

/**
 * The numbers behind one group's chart: its tables (groupTables) per
 * architecture, in the site-wide x64 / Arm64 tabs, each with its source line.
 */
export function GroupTables({
  group,
  lang = 'en',
  markdown,
}: ArchProps & { group: DotnetGroupId }) {
  const zh = lang === 'zh';
  return ArchTabs({
    markdown,
    render: (ds, tabbed) => (
      <>
        {groupTables(ds, group, zh, markdown)}
        {sourceLine(ds, zh, tabbed)}
      </>
    ),
  });
}

const runtimeNames: Record<RuntimeLang, string> = {
  go: 'Go',
  rust: 'Rust',
  typescript: 'TypeScript',
};

const operationNames: Record<string, { en: string; zh: string }> = {
  serialize: { en: 'serialize', zh: '序列化' },
  deserialize: { en: 'deserialize', zh: '反序列化' },
  'serialize allocs': { en: 'serialize allocs', zh: '序列化分配次数' },
  'deserialize allocs': { en: 'deserialize allocs', zh: '反序列化分配次数' },
  size: { en: 'size', zh: '大小' },
};

/**
 * The runtime benchmarks of Go, Rust and TypeScript (src/data/bench-runtimes.json,
 * synced from the newest v4 release): one table per language, or the one
 * `only` names. A note stands in for them until a release has these sections.
 */
export function RuntimesTables({
  lang = 'en',
  only,
}: {
  lang?: Locale;
  only?: RuntimeLang;
  /** Accepted for the Markdown copy (src/lib/markdown.tsx); the output is the same */
  markdown?: boolean;
}) {
  const zh = lang === 'zh';
  const tables = runtimes.filter((t) => !only || t.lang === only);
  if (tables.length === 0)
    return (
      <p className="text-sm text-fd-muted-foreground">
        {zh
          ? '这些基准测试已在 Nino 的仓库中，每次发版都会运行，但已发布的报告还没有收录。等某个版本的报告收录后，结果会显示在这里。'
          : "These benchmarks are in Nino's repository and run for every release, but the published reports do not include them yet. Their results appear here once a release report does."}
      </p>
    );
  const date = runtimesSource.publishedAt?.slice(0, 10);
  return (
    <>
      {tables.map((table) => {
        const nino = table.columns.find((c) => c.nino)?.label ?? 'Nino';
        const source = [`Nino ${table.tag}`, date, table.environment].filter(
          Boolean,
        );
        return (
          <Fragment key={table.lang}>
            {!only && (
              <p>
                <strong>{runtimeNames[table.lang]}</strong>
              </p>
            )}
            <div className="relative overflow-auto prose-no-margin my-6">
              <table>
                <thead>
                  <tr>
                    <th>{zh ? '用例' : 'Case'}</th>
                    <th>{zh ? '操作' : 'Operation'}</th>
                    {table.columns.map((column) => (
                      <th key={column.key} className="text-right">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr key={`${row.case}:${row.operation}`}>
                      <td>
                        <code>{row.case}</code>
                      </td>
                      <td>
                        {operationNames[row.operation]?.[zh ? 'zh' : 'en'] ??
                          row.operation}
                      </td>
                      {table.columns.map((column) => {
                        const cell = row.cells[column.key];
                        return (
                          <td
                            key={column.key}
                            className="text-right tabular-nums whitespace-nowrap"
                          >
                            {cell ? (
                              <>
                                {cell.text}
                                {versusNote(cell.vs, zh)}
                              </>
                            ) : (
                              '—'
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {versusLegend(zh, nino)}
            <p className="text-sm text-fd-muted-foreground">
              <a
                href={runtimesSource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {zh ? `${source.join('；')}。` : `${source.join('; ')}.`}
              </a>
            </p>
          </Fragment>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Unity: Burst kernels in an IL2CPP player                            */
/* ------------------------------------------------------------------ */

const unityOperations: Record<string, { en: string; zh: string }> = {
  serialize: { en: 'Serialize', zh: '序列化' },
  deserialize: { en: 'Deserialize', zh: '反序列化' },
};

function unityOperation(operation: string, zh: boolean) {
  return (
    unityOperations[operation.toLowerCase()]?.[zh ? 'zh' : 'en'] ?? operation
  );
}

/** Without Burst / with Burst, by the FLOOR_NS and on-par rules */
function speedupCell(row: UnityCase, zh: boolean) {
  if (row.tooFast) return <strong>{formatBound(row.without.ns)}</strong>;
  if (row.speedup === undefined) return zh ? '持平' : 'on par';
  const r = formatRatio(row.speedup);
  if (row.speedup > 1) return <strong>{r}</strong>;
  return zh ? `${r}（更慢）` : `${r} (slower)`;
}

/** "Nino v4.0.0-rc.9; 2026-11-01; Unity 6000.3.27f1, IL2CPP player, ..." linked to the release */
function unitySourceLine(zh: boolean) {
  const date = unitySource.publishedAt?.slice(0, 10);
  const parts = [`Nino ${unitySource.tag}`, date, unitySource.environment]
    .filter(Boolean)
    .map((part) => String(part).replace(/[.。]$/, ''));
  return (
    <p className="text-sm text-fd-muted-foreground">
      <a href={unitySource.url} target="_blank" rel="noopener noreferrer">
        {zh ? `${parts.join('；')}。` : `${parts.join('; ')}.`}
      </a>
    </p>
  );
}

function unityNoData(zh: boolean) {
  return (
    <p className="text-sm text-fd-muted-foreground">
      {zh
        ? 'Unity 基准测试在 Nino 的发版流程中运行，但已发布的报告还没有收录。等某个版本的报告收录后，结果会显示在这里。'
        : "The Unity benchmark runs in Nino's release workflow, but no published report includes it yet. Its results appear here once a release report does."}
    </p>
  );
}

/**
 * The Unity benchmark (src/data/bench-unity.json, synced from the newest v4
 * release): one table per Unity version, times without and with the Burst
 * kernels and the speedup computed from them. A note stands in for them until
 * a release has the section.
 */
export function UnityTables({
  lang = 'en',
}: {
  lang?: Locale;
  /** Accepted for the Markdown copy (src/lib/markdown.tsx); the output is the same */
  markdown?: boolean;
}) {
  const zh = lang === 'zh';
  if (unity.length === 0) return unityNoData(zh);
  return (
    <>
      {unity.map((version) => (
        <Fragment key={version.unity}>
          <p>
            <strong>Unity {version.unity}</strong>
          </p>
          <div className="relative overflow-auto prose-no-margin my-6">
            <table>
              <thead>
                <tr>
                  <th>{zh ? '用例' : 'Case'}</th>
                  <th>{zh ? '操作' : 'Operation'}</th>
                  <th className="text-right">
                    {zh ? '不用 Burst' : 'Without Burst'}
                  </th>
                  <th className="text-right">
                    {zh ? '使用 Burst' : 'With Burst'}
                  </th>
                  <th className="text-right">{zh ? '加速' : 'Speedup'}</th>
                </tr>
              </thead>
              <tbody>
                {version.rows.map((row) => (
                  <tr key={`${row.case}:${row.operation}`}>
                    <td>
                      <code>{row.case}</code>
                    </td>
                    <td>{unityOperation(row.operation, zh)}</td>
                    <td className="text-right tabular-nums whitespace-nowrap">
                      {row.without.text}
                    </td>
                    <td className="text-right tabular-nums whitespace-nowrap">
                      {row.with.text}
                    </td>
                    <td className="text-right tabular-nums">
                      {speedupCell(row, zh)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Fragment>
      ))}
      {unitySourceLine(zh)}
    </>
  );
}

/**
 * The speedups of the Unity benchmark alone, a column per Unity version, for
 * the Unity guide; nothing at all until a release has the section.
 */
export function UnityHighlights({
  lang = 'en',
  markdown,
}: {
  lang?: Locale;
  /** Accepted for the Markdown copy (src/lib/markdown.tsx); the output is the same */
  markdown?: boolean;
}) {
  const zh = lang === 'zh';
  if (unity.length === 0) return null;
  // The Markdown copies link absolutely, as src/lib/markdown.tsx does for MDX links.
  const page = `${markdown ? siteUrl : ''}/${zh ? 'zh' : 'en'}/docs/v4/benchmarks-unity`;
  const keys: { case: string; operation: string }[] = [];
  const seen = new Set<string>();
  for (const version of unity)
    for (const row of version.rows) {
      const key = `${row.case}:${row.operation}`;
      if (seen.has(key)) continue;
      seen.add(key);
      keys.push({ case: row.case, operation: row.operation });
    }
  return (
    <>
      <div className="relative overflow-auto prose-no-margin my-6">
        <table>
          <thead>
            <tr>
              <th>{zh ? '用例' : 'Case'}</th>
              <th>{zh ? '操作' : 'Operation'}</th>
              {unity.map((version) => (
                <th key={version.unity} className="text-right">
                  {zh
                    ? `加速（Unity ${version.unity}）`
                    : `Speedup (Unity ${version.unity})`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={`${key.case}:${key.operation}`}>
                <td>
                  <code>{key.case}</code>
                </td>
                <td>{unityOperation(key.operation, zh)}</td>
                {unity.map((version) => {
                  const row = version.rows.find(
                    (r) => r.case === key.case && r.operation === key.operation,
                  );
                  return (
                    <td key={version.unity} className="text-right tabular-nums">
                      {row ? speedupCell(row, zh) : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-fd-muted-foreground">
        {zh ? (
          <>
            不用 Burst 的时间除以使用 Burst 的时间（相差 5%
            以内为持平）。两边的时间见 <a href={page}>Unity 基准测试</a>。
          </>
        ) : (
          <>
            Time without Burst divided by time with it (within 5% is on par).
            For both times, see the <a href={page}>Unity benchmark</a>.
          </>
        )}
      </p>
      {unitySourceLine(zh)}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Build time                                                          */
/* ------------------------------------------------------------------ */

const count = (n: number) => n.toLocaleString('en-US');

/** "330 types (N = 30)" / "330 个类型（N = 30）" */
function buildSizeLabel(size: BuildSizeTable, zh: boolean) {
  return zh
    ? `${count(size.types)} 个类型（N = ${size.roots}）`
    : `${count(size.types)} types (N = ${size.roots})`;
}

/** "18.7 MB (363,233 lines)" / "18.7 MB（363,233 行）", or the time as published */
function buildCell(text: string, lines: number | undefined, zh: boolean) {
  if (lines === undefined) return text;
  return zh
    ? `${text}（${count(lines)} 行）`
    : `${text} (${count(lines)} lines)`;
}

function buildRatioCell(row: BuildMeasure, zh: boolean) {
  const text = buildRatioText(row, zh);
  return row.verdict === 'better' ? <strong>{text}</strong> : text;
}

function buildTable(size: BuildSizeTable, zh: boolean) {
  return (
    <>
      <div className="relative overflow-auto prose-no-margin my-6">
        <table>
          <thead>
            <tr>
              <th />
              <th className="text-right">
                {zh ? 'v3（3.3.13）' : 'v3 (3.3.13)'}
              </th>
              <th className="text-right">v4</th>
              <th className="text-right">{zh ? 'v4 对比 v3' : 'v4 vs v3'}</th>
            </tr>
          </thead>
          <tbody>
            {size.rows.map((row) => (
              <tr key={row.key}>
                <td>{zh ? row.zh : row.en}</td>
                <td className="text-right tabular-nums whitespace-nowrap">
                  {buildCell(row.v3, row.v3Lines, zh)}
                </td>
                <td className="text-right tabular-nums whitespace-nowrap">
                  {buildCell(row.v4, row.v4Lines, zh)}
                </td>
                <td className="text-right tabular-nums">
                  {buildRatioCell(row, zh)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {size.measured && (
        <p className="text-sm text-fd-muted-foreground">
          {zh
            ? `每项耗时：v3 取 ${size.measured.v3} 次、v4 取 ${size.measured.v4} 次运行的中位数，第一次运行不计。`
            : `Each time is the median of ${size.measured.v3} runs for v3 and ${size.measured.v4} for v4, after a first run that is not counted.`}
        </p>
      )}
    </>
  );
}

/** The release and runner the build numbers come from, or the local run's note */
function buildSourceLine(zh: boolean) {
  const text = buildSourceNote(zh);
  return (
    <p className="text-sm text-fd-muted-foreground">
      {buildSource.url ? (
        <a href={buildSource.url} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ) : (
        text
      )}
    </p>
  );
}

/**
 * The source generator benchmark (src/data/bench-build.json, synced from the
 * newest v4 release's build section): v3 3.3.13 against v4 at each workload
 * size, in tabs (one after the other under labels in Markdown), then the
 * source line.
 */
export function BuildTables({ lang = 'en', markdown }: ArchProps) {
  const zh = lang === 'zh';
  if (buildSizes.length === 0) return null;
  const tables = markdown ? (
    buildSizes.map((size) => (
      <Fragment key={size.types}>
        <p>
          <strong>{buildSizeLabel(size, zh)}</strong>
        </p>
        {buildTable(size, zh)}
      </Fragment>
    ))
  ) : (
    <Tabs items={buildSizes.map((size) => buildSizeLabel(size, zh))}>
      {buildSizes.map((size) => (
        <Tab key={size.types} value={buildSizeLabel(size, zh)} forceMount>
          {buildTable(size, zh)}
        </Tab>
      ))}
    </Tabs>
  );
  return (
    <>
      {tables}
      {buildSourceLine(zh)}
    </>
  );
}

/** Build-time values for prose (benchValue's build.* keys); '—' without both sizes */
function buildValue(k: string): string {
  const small = buildSmall;
  const large = buildLarge;
  if (!small || !large || small === large) return '—';
  const emit = (size: BuildSizeTable) => buildRow(size, 'emit');
  const source = (size: BuildSizeTable) => buildRow(size, 'source');
  // A range "2–3" of whole numbers, or one number when both round alike
  const range = (a: number, b: number) => {
    const [lo, hi] = [Math.round(Math.min(a, b)), Math.round(Math.max(a, b))];
    return lo === hi ? String(lo) : `${lo}–${hi}`;
  };
  switch (k) {
    case 'build.types.small':
      return small.types.toLocaleString('en-US');
    case 'build.types.large':
      return large.types.toLocaleString('en-US');
    case 'build.types.growth':
      return buildDecimals(large.types / small.types);
    case 'build.v4.emit.growth': {
      const [a, b] = [emit(small), emit(large)];
      return a && b ? buildDecimals(b.v4n / a.v4n) : '—';
    }
    case 'build.v3.emit.growth': {
      const [a, b] = [emit(small), emit(large)];
      return a && b ? buildDecimals(b.v3n / a.v3n) : '—';
    }
    case 'build.v4.source.perType': {
      // MB of source are millions of chars: KB per type
      const [a, b] = [source(small), source(large)];
      return a && b
        ? range((a.v4n * 1e3) / small.types, (b.v4n * 1e3) / large.types)
        : '—';
    }
    case 'build.v4.emit.perType': {
      // seconds -> ms per type
      const [a, b] = [emit(small), emit(large)];
      return a && b
        ? range((a.v4n * 1e3) / small.types, (b.v4n * 1e3) / large.types)
        : '—';
    }
  }
  throw new Error(`Unknown benchmark value: ${k}`);
}

/**
 * One number from the data (x64), for prose:
 * serialize.max / serialize.min / deserialize.max / deserialize.min (ratios
 * against MemoryPack), reuse.max (vs MemoryPack's overwrite), payload.v4 /
 * payload.memorypack (bytes for one SimpleClass),
 * messagepack.serialize / messagepack.deserialize / protobuf.serialize /
 * protobuf.deserialize (the range of wins on classes and polymorphic types;
 * with .max, its top),
 * workloads.<memorypack|messagepack|protobuf|googleprotobuf|json>.<serialize|deserialize>
 * (the range of wins over the workloads; with .max, its top), or
 * serialize:<case key> / deserialize:<case key> (ratio of one case against
 * MemoryPack; serialize:<case key>:messagepack or :protobuf against that library),
 * or a build-time value from the source generator benchmark (no unit, the page
 * writes it): build.types.small and build.types.large (the two workloads'
 * type counts), build.types.growth (how many times the types of the larger
 * workload), build.v3.emit.growth and build.v4.emit.growth (how many times
 * each version's emit time grew with them), build.v4.source.perType (KB of v4 source per type, "4" or "4–5") and
 * build.v4.emit.perType (ms of v4 emit time per type, "2–3").
 */
export function BenchValue({ k }: { k: string }) {
  return <>{benchValue(k)}</>;
}

export function benchValue(k: string): string {
  if (k.startsWith('build.')) return buildValue(k);
  const [op, which] = k.split(/[.:]/) as [string, string];
  const workload = /^workloads\.(\w+)\.(serialize|deserialize)(\.max)?$/.exec(
    k,
  );
  if (
    workload &&
    (workload[1] === 'memorypack' ||
      otherLibs.some((lib) => lib.key === workload[1]))
  ) {
    const lib = workload[1] as Opponent;
    const verb = workload[2] as Op;
    if (workload[3]) {
      const { max } = workloadRange(verb, lib);
      return Number.isFinite(max) ? formatRatio(max) : '—';
    }
    return formatWorkloadRange(verb, lib) || '—';
  }
  if (k === 'reuse.max')
    return formatRatio(Math.max(...reuse.map(reuseSpeedup)));
  if (
    (op === 'messagepack' || op === 'protobuf') &&
    (which === 'serialize' || which === 'deserialize')
  ) {
    if (k.endsWith('.max')) {
      const { max } = classRatioRange(which, undefined, op);
      return Number.isFinite(max) ? formatRatio(max) : '—';
    }
    return formatClassRange(which, op) || '—';
  }
  if (op === 'payload') {
    const value = which === 'v4' ? payload.v4 : payload.memorypack;
    return value === null ? '—' : value.toLocaleString('en-US');
  }
  if ((op === 'serialize' || op === 'deserialize') && k.includes('.')) {
    const range = ratioRange(op);
    const value = which === 'max' ? range.max : range.min;
    return Number.isFinite(value) ? formatRatio(value) : '—';
  }
  if (op === 'serialize' || op === 'deserialize') {
    const row = runtime[op].find((r) => r.key === which);
    if (!row) return '—';
    // serialize:<case>:<library>: against MessagePack or protobuf-net
    const lib = k.split(':')[2] as OtherLib | undefined;
    if (lib) {
      const vs = row.others[lib];
      if (!vs) return '—';
      return vs.tooFast ? formatBound(vs.time.ns) : formatRatio(vs.ratio ?? 1);
    }
    return row.tooFast && row.memorypack
      ? formatBound(row.memorypack.ns)
      : formatRatio(row.ratio ?? 1);
  }
  throw new Error(`Unknown benchmark value: ${k}`);
}

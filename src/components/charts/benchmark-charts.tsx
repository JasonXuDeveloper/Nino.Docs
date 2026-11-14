/**
 * The benchmark charts, built from src/lib/benchmarks.ts. Loaded lazily by
 * ./index.tsx so visx is only downloaded on pages that show a chart.
 */
import { useState } from 'react';
import { Segmented } from '@/components/showcase';
import {
  type Arch,
  arm64,
  type BenchDataset,
  build,
  buildRatioText,
  buildSmall,
  buildSourceNote,
  FLOOR_NS,
  formatTime,
  gcNote,
  isOnPar,
  lowerBound,
  type RuntimeCase,
  runtime,
  sourceNote,
  times,
  V3_RUNTIME,
  v3SourceNote,
  x64,
} from '@/lib/benchmarks';
import type { Locale } from '@/lib/i18n';
import { BarChart, type BarChartProps, type ChartSeries } from './bar-chart';

import type { ChartId } from './ids';

export type { ChartId };

const rel = (value: number) => (value === 0 ? '0' : value.toFixed(1));

function caseLabel(row: { name: string; zh?: string }, zh: boolean) {
  return zh && row.zh ? row.zh : row.name;
}

function seriesFor() {
  return {
    v4: { key: 'v4', label: 'Nino v4', color: 'var(--nino-chart-v4)' },
    mp: { key: 'mp', label: 'MemoryPack', color: 'var(--nino-chart-other)' },
    v3: {
      key: 'v3',
      label: 'Nino v3 (3.3.13)',
      color: 'var(--nino-chart-faint)',
    },
  } satisfies Record<string, ChartSeries>;
}

/**
 * v4 under FLOOR_NS against a measurable time `ns`: faster by more than ns /
 * FLOOR_NS (lowerBound); `than` names the other side where the badges do
 */
const boundBadge = (ns: number, zh: boolean, than?: string) => {
  const r = times(lowerBound(ns));
  return {
    text: zh
      ? `${than ? `比 ${than} ` : ''}快 ${r} 倍以上`
      : `> ${r}× faster${than ? ` than ${than}` : ''}`,
    tone: 'win' as const,
  };
};

function mpBadge(row: RuntimeCase, zh: boolean) {
  if (row.tooFast) return boundBadge(row.memorypack.ns, zh);
  if (row.ratio === undefined)
    return { text: zh ? '持平' : 'on par', tone: 'par' as const };
  const r = times(row.ratio);
  if (row.ratio >= 1)
    return { text: zh ? `快 ${r} 倍` : `${r}× faster`, tone: 'win' as const };
  // v4 not ahead: no badge, as in Nino's README and docs/v4-benchmarks.md (the times show it).
  return undefined;
}

/** The data a Nino-vs-MemoryPack chart is drawn from: one architecture's run */
interface ChartData {
  ds: BenchDataset;
  /** In an architecture tab: the source line also names the machine */
  tabbed: boolean;
}

function memoryPackChart(
  op: 'serialize' | 'deserialize',
  zh: boolean,
  { ds, tabbed }: ChartData,
): BarChartProps {
  const s = seriesFor();
  const rows = ds.runtime[op];
  const hasGc = rows.some((row) => row.gcBound);
  return {
    title: zh
      ? `${op === 'serialize' ? '序列化' : '反序列化（新实例）'}：Nino v4 对比 MemoryPack`
      : `${op === 'serialize' ? 'Serialize' : 'Deserialize (new instances)'}: Nino v4 vs MemoryPack`,
    subtitle: zh
      ? '条形为相对 MemoryPack 的耗时（MemoryPack = 1.0），越短越快；数字为实测耗时。'
      : 'Bars show time relative to MemoryPack (MemoryPack = 1.0), shorter is faster; labels are measured times.',
    series: [s.v4, s.mp],
    rows: rows.map((row) => ({
      label: caseLabel(row, zh),
      code: row.code,
      mark: row.gcBound ? '†' : undefined,
      values: { v4: row.v4.ns / row.memorypack.ns, mp: 1 },
      text: { v4: row.v4.text, mp: row.memorypack.text },
      badge: mpBadge(row, zh),
    })),
    axisLabel: zh
      ? '相对耗时（MemoryPack = 1.0）'
      : 'Relative time (MemoryPack = 1.0)',
    tickFormat: rel,
    footnotes: [
      sourceNote(zh, ds, tabbed),
      ...(hasGc ? [zh ? gcNote.zh : gcNote.en] : []),
    ],
    table: {
      caption: zh ? '数据表' : 'Data table',
      head: zh
        ? ['用例', 'Nino v4', 'MemoryPack', 'v4 对比 MemoryPack']
        : ['Case', 'Nino v4', 'MemoryPack', 'v4 vs MemoryPack'],
      rows: rows.map((row) => [
        caseLabel(row, zh),
        row.v4.text,
        row.memorypack.text,
        mpBadge(row, zh)?.text ?? '—',
      ]),
    },
  };
}

function v3Badge(v3Ns: number, v4Ns: number, zh: boolean) {
  if (v4Ns < FLOOR_NS)
    return v3Ns < FLOOR_NS
      ? { text: zh ? '与 v3 持平' : 'on par with v3', tone: 'par' as const }
      : boundBadge(v3Ns, zh, 'v3');
  const vsV3 = v3Ns / v4Ns;
  if (isOnPar(vsV3))
    return { text: zh ? '与 v3 持平' : 'on par with v3', tone: 'par' as const };
  const r = times(vsV3);
  if (vsV3 > 1)
    return {
      text: zh ? `比 v3 快 ${r} 倍` : `${r}× faster than v3`,
      tone: 'win' as const,
    };
  return undefined;
}

/** Nino v4 vs v3 3.3.13 from V3_RUNTIME; null until it has been measured */
function v3Chart(
  op: 'serialize' | 'deserialize',
  zh: boolean,
): BarChartProps | null {
  const s = seriesFor();
  const entries = runtime[op].flatMap((row) => {
    const measured = V3_RUNTIME.rows[`${op}:${row.key}`];
    return measured ? [{ row, ...measured }] : [];
  });
  if (entries.length === 0) return null;
  const v3Note = v3SourceNote(zh);
  return {
    title: zh
      ? `${op === 'serialize' ? '序列化' : '反序列化'}：Nino v4 对比 v3（3.3.13）`
      : `${op === 'serialize' ? 'Serialize' : 'Deserialize'}: Nino v4 vs v3 (3.3.13)`,
    subtitle: zh
      ? '条形为相对 v3 的耗时（v3 = 1.0），越短越快；数字为同一次运行中的实测耗时。'
      : 'Bars show time relative to v3 (v3 = 1.0), shorter is faster; labels are measured times from the same run.',
    series: [s.v4, s.v3],
    rows: entries.map((e) => ({
      label: caseLabel(e.row, zh),
      code: e.row.code,
      values: { v4: e.v4Ns / e.v3Ns, v3: 1 },
      text: { v4: formatTime(e.v4Ns), v3: formatTime(e.v3Ns) },
      badge: v3Badge(e.v3Ns, e.v4Ns, zh),
    })),
    axisLabel: zh ? '相对耗时（v3 = 1.0）' : 'Relative time (v3 = 1.0)',
    tickFormat: rel,
    footnotes: v3Note ? [v3Note] : undefined,
    table: {
      caption: zh ? '数据表' : 'Data table',
      head: zh
        ? ['用例', 'Nino v4', 'Nino v3', 'v4 对比 v3']
        : ['Case', 'Nino v4', 'Nino v3', 'v4 vs v3'],
      rows: entries.map((e) => [
        caseLabel(e.row, zh),
        formatTime(e.v4Ns),
        formatTime(e.v3Ns),
        v3Badge(e.v3Ns, e.v4Ns, zh)?.text ?? '—',
      ]),
    },
  };
}

function compileChart(zh: boolean): BarChartProps {
  const types = buildSmall?.types.toLocaleString('en-US') ?? '';
  return {
    title: zh
      ? '构建：v4 比 v3（3.3.13）好多少倍'
      : 'Build: how many times better v4 is than v3 (3.3.13)',
    subtitle: zh
      ? `源生成器基准测试，${types} 个类型（N = ${buildSmall?.roots}）。越长越好。`
      : `Source generator benchmark, ${types} types (N = ${buildSmall?.roots}). Longer is better.`,
    series: [
      { key: 'ratio', label: 'v4 vs v3', color: 'var(--nino-chart-v4)' },
    ],
    rows: build.map((row) => ({
      label: zh ? row.zh : row.en,
      values: { ratio: row.ratio },
      text: { ratio: buildRatioText(row, zh) },
      detail: `v3 ${row.v3} → v4 ${row.v4}`,
    })),
    axisLabel: zh ? 'v4 对比 v3（倍）' : 'v4 vs v3 (×)',
    tickFormat: (value) => `${value}×`,
    table: {
      caption: zh ? '数据表' : 'Data table',
      head: zh
        ? ['指标', 'v3（3.3.13）', 'v4', 'v4 对比 v3']
        : ['Measure', 'v3 (3.3.13)', 'v4', 'v4 vs v3'],
      rows: build.map((row) => [
        zh ? row.zh : row.en,
        row.v3,
        row.v4,
        buildRatioText(row, zh),
      ]),
    },
    footnotes: [buildSourceNote(zh)],
  };
}

/**
 * `arch` picks the run of the Nino-vs-MemoryPack charts (x64 by default);
 * given, the footnote names the machine, as in an architecture tab. The v3 and
 * build charts are x64 only and ignore it.
 */
export function chartProps(
  id: ChartId,
  zh: boolean,
  arch?: Arch,
): BarChartProps | null {
  const data: ChartData = {
    ds: arch === 'arm64' && arm64 ? arm64 : x64,
    tabbed: arch !== undefined,
  };
  switch (id) {
    case 'serialize':
    case 'deserialize':
      return memoryPackChart(id, zh, data);
    case 'v3-serialize':
      return v3Chart('serialize', zh);
    case 'v3-deserialize':
      return v3Chart('deserialize', zh);
    case 'compile':
      return compileChart(zh);
  }
}

const tabLabels: Record<ChartId, { en: string; zh: string }> = {
  serialize: { en: 'Serialize', zh: '序列化' },
  deserialize: { en: 'Deserialize', zh: '反序列化' },
  'v3-serialize': { en: 'Serialize', zh: '序列化' },
  'v3-deserialize': { en: 'Deserialize', zh: '反序列化' },
  compile: { en: 'Compile time', zh: '编译时间' },
};

/** Shown in place of a chart whose numbers have not been measured yet */
function Pending({ zh }: { zh: boolean }) {
  return (
    <p className="not-prose my-6 rounded-xl border bg-fd-card p-4 text-sm text-fd-muted-foreground sm:p-5">
      {zh
        ? '与 v3（3.3.13）的运行时对比，将来自与 v4 背靠背的一次直接测量，测完后显示在这里。'
        : 'Runtime numbers against v3 (3.3.13) will come from a direct back-to-back measurement with v4 and appear here once measured.'}
    </p>
  );
}

export interface BenchmarkChartProps {
  /** One chart, or several shown as tabs */
  chart: ChartId | ChartId[];
  lang?: Locale;
  /** Hide the data table when the page already has one next to the chart */
  table?: boolean;
  /** Set by ./index.tsx inside an architecture tab */
  arch?: Arch;
}

export default function BenchmarkCharts({
  chart,
  lang = 'en',
  table = true,
  arch,
}: BenchmarkChartProps) {
  const zh = lang === 'zh';
  const ids = Array.isArray(chart) ? chart : [chart];
  const [current, setCurrent] = useState<ChartId>(ids[0]);
  const props = chartProps(current, zh, arch);
  if (props && !table) {
    props.table = undefined;
    // The build tables next to it (BuildTables) carry the source line.
    if (current === 'compile') props.footnotes = undefined;
  }
  // Under the serialize / deserialize switch, the source line (the run and its machine) goes between the switch and
  // the chart, so a page needs no second set of architecture tabs for it.
  const switched = ids.length > 1 && props?.footnotes?.length;
  const source = switched ? props.footnotes?.[0] : undefined;
  if (switched) props.footnotes = props.footnotes?.slice(1);
  const body = props ? (
    <BarChart key={current} {...props} />
  ) : (
    <Pending zh={zh} />
  );

  if (ids.length === 1) return body;
  return (
    <div className="not-prose my-6">
      <Segmented
        value={current}
        onChange={setCurrent}
        options={ids.map((id) => ({
          value: id,
          label: zh ? tabLabels[id].zh : tabLabels[id].en,
        }))}
      />
      {source && (
        <p className="mt-3 text-xs text-fd-muted-foreground">{source}</p>
      )}
      <div className="-mt-6">{body}</div>
    </div>
  );
}

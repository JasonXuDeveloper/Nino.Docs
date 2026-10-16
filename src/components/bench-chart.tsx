/**
 * <BenchChart data={benchmarks} version="v3" lang="en" /> for the archived
 * versions (v2, v3). Drawn with the same visx BarChart as v4's
 * <BenchmarkChart>, in the same form: one chart per operation behind a tab
 * bar, the documented version in the accent and MemoryPack in neutral grey,
 * bars relative to MemoryPack (= 1.0) with a badge per case.
 *
 * MessagePack is several to hundreds of times slower than both, so plotting it
 * would flatten every other bar; its times are in the tooltip and the data
 * table instead. Numbers come only from the page's own data file
 * (src/data/bench-v3.json, bench-v2.json).
 */
import { lazy, Suspense, useState } from 'react';
import { Segmented } from '@/components/showcase';
import { formatTime } from '@/lib/benchmarks';
import type { Locale } from '@/lib/i18n';

export interface BenchmarkCase {
  /** "<Case> · Serialize" or "<Case> · Deserialize" */
  name: string;
  /** Mean time in nanoseconds */
  nino: number;
  memorypack?: number;
  messagepack?: number;
}

// Imported up front when prerendering, lazily in the browser (see charts/index.tsx).
const BarChart = import.meta.env.SSR
  ? (await import('./charts/bar-chart')).BarChart
  : lazy(() =>
      import('./charts/bar-chart').then((m) => ({ default: m.BarChart })),
    );

type Op = 'serialize' | 'deserialize';

const opLabel: Record<Op, { en: string; zh: string }> = {
  serialize: { en: 'Serialize', zh: '序列化' },
  deserialize: { en: 'Deserialize', zh: '反序列化' },
};

function split(name: string) {
  const [label, op] = name.split(' · ');
  return { label, op: op?.toLowerCase() as Op | undefined };
}

/** MemoryPack time / Nino time, as v4's charts badge it */
function badge(nino: number, memorypack: number, zh: boolean) {
  const ratio = memorypack / nino;
  const r = ratio.toFixed(2);
  if (r === '1.00')
    return { text: zh ? '持平' : 'on par', tone: 'par' as const };
  if (ratio > 1)
    return { text: zh ? `快 ${r} 倍` : `${r}× faster`, tone: 'win' as const };
  return {
    text: zh ? `${r} 倍：MemoryPack 更快` : `${r}×: MemoryPack faster`,
    tone: 'loss' as const,
  };
}

export function BenchChart({
  data,
  version,
  source,
  lang = 'en',
}: {
  data: BenchmarkCase[];
  /** The documented version, e.g. "v3": names the accent series */
  version?: string;
  /** Footnote naming where the numbers come from */
  source?: string;
  lang?: Locale;
}) {
  const zh = lang === 'zh';
  const ops = (['serialize', 'deserialize'] as const).filter((op) =>
    data.some((row) => split(row.name).op === op),
  );
  const [current, setCurrent] = useState<Op>(ops[0] ?? 'serialize');
  if (data.length === 0) return null;

  const nino = version ? `Nino ${version}` : 'Nino';
  const rows = data.filter(
    (row) => split(row.name).op === current && row.memorypack !== undefined,
  );
  const hasMessagePack = data.some((row) => row.messagepack !== undefined);
  const op = zh ? opLabel[current].zh : opLabel[current].en;

  const chart = (
    <BarChart
      key={current}
      title={
        zh ? `${op}：${nino} 对比 MemoryPack` : `${op}: ${nino} vs MemoryPack`
      }
      subtitle={
        zh
          ? '条形为相对 MemoryPack 的耗时（MemoryPack = 1.0），越短越快；数字为实测平均耗时。'
          : 'Bars show time relative to MemoryPack (MemoryPack = 1.0), shorter is faster; labels are measured means.'
      }
      series={[
        { key: 'nino', label: nino, color: 'var(--nino-chart-v4)' },
        {
          key: 'memorypack',
          label: 'MemoryPack',
          color: 'var(--nino-chart-other)',
        },
      ]}
      rows={rows.map((row) => {
        const memorypack = row.memorypack as number;
        return {
          label: split(row.name).label,
          code: true,
          values: { nino: row.nino / memorypack, memorypack: 1 },
          text: {
            nino: formatTime(row.nino),
            memorypack: formatTime(memorypack),
          },
          detail:
            row.messagepack === undefined
              ? undefined
              : `MessagePack: ${formatTime(row.messagepack)}`,
          badge: badge(row.nino, memorypack, zh),
        };
      })}
      axisLabel={
        zh ? '相对耗时（MemoryPack = 1.0）' : 'Relative time (MemoryPack = 1.0)'
      }
      tickFormat={(value) => (value === 0 ? '0' : value.toFixed(1))}
      footnotes={[
        ...(hasMessagePack
          ? [
              zh
                ? 'MessagePack 比两者慢得多，画进图里其他条形会挤成一条线；它的耗时见悬停提示和数据表。'
                : 'MessagePack is much slower than both and would flatten the other bars, so its times are in the tooltips and the data table.',
            ]
          : []),
        ...(source ? [source] : []),
      ]}
      table={{
        caption: zh ? '数据表' : 'Data table',
        head: [
          zh ? '用例' : 'Case',
          nino,
          'MemoryPack',
          ...(hasMessagePack ? ['MessagePack'] : []),
          zh
            ? `${version ?? 'Nino'} 对比 MemoryPack`
            : `${version ?? 'Nino'} vs MemoryPack`,
        ],
        rows: rows.map((row) => [
          split(row.name).label,
          formatTime(row.nino),
          formatTime(row.memorypack as number),
          ...(hasMessagePack
            ? [
                row.messagepack === undefined
                  ? '—'
                  : formatTime(row.messagepack),
              ]
            : []),
          badge(row.nino, row.memorypack as number, zh).text,
        ]),
      }}
    />
  );

  return (
    <Suspense
      fallback={
        <div
          className="not-prose my-6 h-96 rounded-xl border bg-fd-card"
          aria-hidden="true"
        />
      }
    >
      <div className="not-prose my-6">
        <Segmented
          value={current}
          onChange={setCurrent}
          options={ops.map((value) => ({
            value,
            label: zh ? opLabel[value].zh : opLabel[value].en,
          }))}
        />
        <div className="-mt-6">{chart}</div>
      </div>
    </Suspense>
  );
}

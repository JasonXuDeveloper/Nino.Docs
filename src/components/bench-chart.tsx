import { lazy, Suspense } from 'react';

export interface BenchmarkCase {
  /** e.g. "SimpleClass · Serialize" */
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

const series = [
  { key: 'nino', label: 'Nino', color: 'var(--nino-chart-v4)' },
  { key: 'memorypack', label: 'MemoryPack', color: 'var(--nino-chart-other)' },
  {
    key: 'messagepack',
    label: 'MessagePack',
    color: 'var(--nino-chart-faint)',
  },
] as const;

function formatTime(ns: number) {
  if (ns >= 1_000_000) return `${(ns / 1_000_000).toFixed(2)} ms`;
  if (ns >= 1_000) return `${(ns / 1_000).toFixed(2)} µs`;
  return `${ns.toFixed(ns < 10 ? 2 : 1)} ns`;
}

/**
 * Benchmark means of the archived versions (v2, v3) against MemoryPack and
 * MessagePack. Each case is scaled to its slowest serializer, since the cases
 * differ by orders of magnitude. Renders nothing when `data` is empty.
 */
export function BenchChart({
  data,
  lang = 'en',
}: {
  data: BenchmarkCase[];
  lang?: 'en' | 'zh';
}) {
  if (data.length === 0) return null;
  const zh = lang === 'zh';
  const present = series.filter((s) =>
    data.some((row) => row[s.key] !== undefined),
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
      <BarChart
        title={zh ? '基准测试' : 'Benchmarks'}
        subtitle={
          zh
            ? '条形为相对每个用例中最慢者的耗时，越短越快；数字为实测平均耗时。'
            : 'Bars show time relative to the slowest library in each case, shorter is faster; labels are measured means.'
        }
        series={[...present]}
        rows={data.map((row) => {
          const slowest = Math.max(...present.map((s) => row[s.key] ?? 0));
          const values: Record<string, number | undefined> = {};
          const text: Record<string, string> = {};
          for (const s of present) {
            const value = row[s.key];
            values[s.key] = value === undefined ? undefined : value / slowest;
            text[s.key] = value === undefined ? '' : formatTime(value);
          }
          return { label: row.name, values, text };
        })}
        axisLabel={
          zh ? '相对耗时（最慢 = 1.0）' : 'Relative time (slowest = 1.0)'
        }
        tickFormat={(value) => value.toFixed(1)}
        max={1}
        table={{
          caption: zh ? '数据表' : 'Data table',
          head: [zh ? '用例' : 'Case', ...present.map((s) => s.label)],
          rows: data.map((row) => [
            row.name,
            ...present.map((s) => {
              const value = row[s.key];
              return value === undefined ? '—' : formatTime(value);
            }),
          ]),
        }}
      />
    </Suspense>
  );
}

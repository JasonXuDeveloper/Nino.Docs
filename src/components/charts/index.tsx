/**
 * <BenchmarkChart chart="serialize" lang="en" /> for MDX and the home page.
 *
 * The chart code (visx) is a separate chunk loaded only where a chart is used.
 * Charts of Nino against MemoryPack show x64 and Arm64 in the site-wide
 * architecture tabs once Arm64 data exists (see ArchTabs in bench-data.tsx).
 */
import { lazy, Suspense } from 'react';
import { ArchTabs } from '@/components/bench-data';
import type { BenchmarkChartProps } from './benchmark-charts';
import { isArchChart } from './ids';

// Prerendering imports the charts up front so the HTML holds the finished SVG
// in place; the browser loads the chunk lazily and keeps the server markup
// until it arrives.
const Charts = import.meta.env.SSR
  ? (await import('./benchmark-charts')).default
  : lazy(() => import('./benchmark-charts'));

export type { BenchmarkChartProps, ChartId } from './benchmark-charts';

function Chart(props: BenchmarkChartProps) {
  return (
    <Suspense
      fallback={
        <div
          className="not-prose my-6 h-96 animate-pulse rounded-2xl border bg-fd-card motion-reduce:animate-none"
          aria-hidden="true"
        />
      }
    >
      <Charts {...props} />
    </Suspense>
  );
}

export function BenchmarkChart(props: BenchmarkChartProps) {
  if (!isArchChart(props.chart)) return <Chart {...props} />;
  return ArchTabs({
    render: (ds, tabbed) => (
      <Chart {...props} arch={tabbed ? ds.arch : undefined} />
    ),
  });
}

/**
 * <BenchmarkChart chart="serialize" lang="en" /> for MDX and the home page.
 *
 * The chart code (visx) is a separate chunk loaded only where a chart is used.
 */
import { lazy, Suspense } from 'react';
import type { BenchmarkChartProps } from './benchmark-charts';

// Prerendering imports the charts up front so the HTML holds the finished SVG
// in place; the browser loads the chunk lazily and keeps the server markup
// until it arrives.
const Charts = import.meta.env.SSR
  ? (await import('./benchmark-charts')).default
  : lazy(() => import('./benchmark-charts'));

export type { BenchmarkChartProps, ChartId } from './benchmark-charts';

export function BenchmarkChart(props: BenchmarkChartProps) {
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

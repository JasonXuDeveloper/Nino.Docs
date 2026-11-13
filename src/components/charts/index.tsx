/**
 * <BenchmarkChart chart="serialize" lang="en" /> for MDX and the home page.
 *
 * The chart code (visx) is a separate chunk loaded only where a chart is used.
 * Charts of Nino against MemoryPack show x64 and Arm64 in the site-wide
 * architecture tabs once Arm64 data exists (see ArchTabs in bench-data.tsx).
 */
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { lazy, Suspense } from 'react';
import { ArchTabs, GroupTables } from '@/components/bench-data';
import {
  type DotnetGroupId,
  dotnetGroupsShown,
  type RuntimeLang,
} from '@/lib/benchmarks';
import type { Locale } from '@/lib/i18n';
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

// The runtime and Unity explorers: their own chunk, loaded where they are used.
const Explorers = import.meta.env.SSR
  ? (await import('./explorers')).default
  : {
      RuntimesChart: lazy(() =>
        import('./explorers').then((m) => ({ default: m.RuntimesChart })),
      ),
      UnityChart: lazy(() =>
        import('./explorers').then((m) => ({ default: m.UnityChart })),
      ),
      DotnetChart: lazy(() =>
        import('./explorers').then((m) => ({ default: m.DotnetChart })),
      ),
    };

function Fallback() {
  return (
    <div
      className="not-prose my-6 h-96 animate-pulse rounded-2xl border bg-fd-card motion-reduce:animate-none"
      aria-hidden="true"
    />
  );
}

/** Go, Rust and TypeScript against their competitors, relative to Nino */
export function RuntimesChart(props: { lang?: Locale; only?: RuntimeLang }) {
  return (
    <Suspense fallback={<Fallback />}>
      <Explorers.RuntimesChart {...props} />
    </Suspense>
  );
}

/** Unity: with Burst against without, per Unity version */
export function UnityChart(props: { lang?: Locale }) {
  return (
    <Suspense fallback={<Fallback />}>
      <Explorers.UnityChart {...props} />
    </Suspense>
  );
}

/** .NET: one group of cases, Nino v4 against every library and v3, per architecture and operation */
export function DotnetChart(props: { lang?: Locale; group: DotnetGroupId }) {
  return (
    <Suspense fallback={<Fallback />}>
      <Explorers.DotnetChart {...props} />
    </Suspense>
  );
}

/**
 * One group of dotnetGroups on the benchmarks page: its interactive chart,
 * then its numbers (GroupTables: every library's time, payload and
 * allocations, per architecture) in an accordion that starts closed
 * (`#numbers-<group>` opens it). Every group looks the same.
 */
export function BenchGroup({
  group,
  lang = 'en',
}: {
  group: DotnetGroupId;
  lang?: Locale;
}) {
  if (!dotnetGroupsShown.some((shown) => shown.id === group)) return null;
  return (
    <>
      <DotnetChart lang={lang} group={group} />
      <Accordions type="single" collapsible className="my-6">
        <Accordion
          id={`numbers-${group}`}
          value={group}
          title={lang === 'zh' ? '数据' : 'Numbers'}
        >
          <GroupTables group={group} lang={lang} />
        </Accordion>
      </Accordions>
    </>
  );
}

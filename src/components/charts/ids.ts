/**
 * Chart ids, apart from the charts themselves so ./index.tsx and the Markdown
 * renderer can read them without loading the lazily loaded chart chunk.
 */
export type ChartId =
  | 'serialize'
  | 'deserialize'
  | 'reuse'
  | 'v3-serialize'
  | 'v3-deserialize'
  | 'compile'
  | 'allocation'
  | 'payload';

/**
 * Charts of Nino against MemoryPack: drawn once per architecture, in x64 and
 * Arm64 tabs, once Arm64 data exists. The v3 and build charts are x64 only.
 */
export const archCharts: ReadonlySet<ChartId> = new Set<ChartId>([
  'serialize',
  'deserialize',
  'reuse',
  'allocation',
  'payload',
]);

/** True when every chart of a BenchmarkChart is drawn per architecture */
export function isArchChart(chart: ChartId | ChartId[]) {
  return (Array.isArray(chart) ? chart : [chart]).every((id) =>
    archCharts.has(id),
  );
}

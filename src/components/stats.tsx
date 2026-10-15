import { headlineStats, StatCards } from '@/components/showcase';
import type { Locale } from '@/lib/i18n';

/** Headline v4 numbers for MDX (BenchmarkDotNet, .NET 10; v3 baseline 3.3.13). */
export function Stats({ lang = 'en' }: { lang?: Locale }) {
  return <StatCards stats={headlineStats(lang)} />;
}

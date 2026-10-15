import { CountUp } from '@/components/showcase';
import type { Locale } from '@/lib/i18n';

// Headline v4 numbers (BenchmarkDotNet, .NET 10; v3 baseline 3.3.13).
const stats: Record<Locale, [string, string][]> = {
  en: [
    ['4.3×', 'faster than MemoryPack, at most'],
    ['1.73×', 'faster serialization than v3'],
    ['44×', 'faster to compile the generated code than v3'],
    ['16×', 'less generated code than v3'],
  ],
  zh: [
    ['4.3×', '最高快于 MemoryPack'],
    ['1.73×', '序列化最高快于 v3'],
    ['44×', '生成代码的编译快于 v3'],
    ['16×', '生成的代码少于 v3'],
  ],
};

export function Stats({ lang = 'en' }: { lang?: Locale }) {
  return (
    <dl className="not-prose my-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-fd-border md:grid-cols-4">
      {stats[lang].map(([value, label]) => (
        <div
          key={value}
          className="flex flex-col gap-1 bg-fd-card px-4 py-5 text-center"
        >
          <dt className="sr-only">{label}</dt>
          <dd className="text-3xl font-extrabold tracking-tight">
            <CountUp value={value} className="nino-gradient-text" />
          </dd>
          <dd className="text-xs text-fd-muted-foreground">{label}</dd>
        </div>
      ))}
    </dl>
  );
}

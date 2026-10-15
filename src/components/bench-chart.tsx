export interface BenchmarkCase {
  /** e.g. "SimpleClass · Serialize" */
  name: string;
  /** Mean time in nanoseconds */
  nino: number;
  memorypack?: number;
  messagepack?: number;
}

const series = [
  { key: 'nino', label: 'Nino', bar: 'nino-gradient-bg' },
  { key: 'memorypack', label: 'MemoryPack', bar: 'bg-slate-400' },
  { key: 'messagepack', label: 'MessagePack', bar: 'bg-slate-500' },
] as const;

function formatTime(ns: number) {
  if (ns >= 1_000_000) return `${(ns / 1_000_000).toFixed(2)} ms`;
  if (ns >= 1_000) return `${(ns / 1_000).toFixed(2)} μs`;
  return `${ns.toFixed(ns < 10 ? 2 : 1)} ns`;
}

/**
 * Horizontal bar chart of benchmark means; each case is scaled to its slowest
 * serializer. Renders nothing when `data` is empty.
 */
export function BenchChart({
  data,
  lang = 'en',
}: {
  data: BenchmarkCase[];
  lang?: 'en' | 'zh';
}) {
  if (data.length === 0) return null;

  return (
    <figure className="not-prose my-6 rounded-xl border bg-fd-card p-4 text-xs">
      <figcaption className="mb-3 flex flex-wrap items-center gap-4 text-fd-muted-foreground">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className={`size-2.5 rounded-sm ${s.bar}`} />
            {s.label}
          </span>
        ))}
        <span className="ms-auto">
          {lang === 'zh' ? '耗时越短越好' : 'lower is better'}
        </span>
      </figcaption>
      {data.map((row) => {
        const max = Math.max(...series.map((s) => row[s.key] ?? 0));
        return (
          <div key={row.name} className="mt-4 first-of-type:mt-0">
            <p className="mb-1.5 text-sm font-semibold text-fd-foreground">
              {row.name}
            </p>
            {series.map((s) => {
              const value = row[s.key];
              if (value === undefined) return null;
              return (
                <div key={s.key} className="mt-1 flex items-center gap-2">
                  <span className="w-24 shrink-0 text-fd-muted-foreground">
                    {s.label}
                  </span>
                  <span className="h-3 flex-1 overflow-hidden rounded-sm bg-fd-muted">
                    <span
                      className={`block h-full rounded-sm ${s.bar}`}
                      style={{
                        width: `${Math.max((value / max) * 100, 0.5)}%`,
                      }}
                    />
                  </span>
                  <span className="w-36 shrink-0 text-end tabular-nums text-fd-muted-foreground">
                    {formatTime(value)}
                    {s.key !== 'nino' && (
                      <span className="opacity-70">
                        {' '}
                        ({(value / row.nino).toFixed(2)}×)
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </figure>
  );
}

/**
 * Animated pieces of the v4 showcase (home page and "What's New in v4").
 *
 * Everything renders its final state on the server (prerendered HTML, no
 * JavaScript needed to read the numbers). After hydration, elements that are
 * not yet on screen reset and animate when scrolled into view. With
 * prefers-reduced-motion, nothing animates.
 */
import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  type CompareRow,
  vsMemoryPack,
  vsV3Build,
  vsV3Runtime,
} from '@/lib/benchmarks';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

function reducedMotion() {
  return (
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * `shown` is true on the server and for reduced motion. On the client it turns
 * false after hydration for elements below the fold, then true once visible.
 */
function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion() || !('IntersectionObserver' in window))
      return;
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
      // Already visible: replay the animation once.
      setShown(false);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setShown(true)),
      );
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, shown] as const;
}

/* ------------------------------------------------------------------ */
/* Count-up numbers                                                    */
/* ------------------------------------------------------------------ */

/** Animates the first number in `value` ("44×", "1.73×", "6–7×", "0 B"). */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [ref, shown] = useReveal<HTMLSpanElement>();
  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(value);
  const target = match ? Number.parseFloat(match[1]) : 0;
  const decimals = match?.[1].split('.')[1]?.length ?? 0;
  const suffix = match?.[2] ?? '';
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    if (target === 0) return;
    if (!shown) {
      setCurrent(0);
      return;
    }
    if (reducedMotion()) {
      setCurrent(null);
      return;
    }
    const duration = 1200;
    let start: number | undefined;
    let frame = 0;
    const step = (time: number) => {
      start ??= time;
      const t = Math.min((time - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      if (t < 1) {
        setCurrent(target * eased);
        frame = requestAnimationFrame(step);
      } else {
        setCurrent(null);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [shown, target]);

  const text =
    current === null ? value : `${current.toFixed(decimals)}${suffix}`;

  // Screen readers get the final value; the animated digits are hidden from them.
  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      <span aria-hidden="true">{text}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Stat cards                                                          */
/* ------------------------------------------------------------------ */

export interface Stat {
  value: string;
  label: ReactNode;
  note?: ReactNode;
}

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="not-prose my-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={`${stat.value}${String(stat.label)}`}
          className="nino-stat-card relative overflow-hidden rounded-xl border bg-fd-card p-4"
        >
          <CountUp
            value={stat.value}
            className="nino-gradient-text block text-3xl font-extrabold tracking-tight md:text-4xl"
          />
          <p className="mt-1 text-sm font-medium text-fd-foreground">
            {stat.label}
          </p>
          {stat.note && (
            <p className="mt-0.5 text-xs text-fd-muted-foreground">
              {stat.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Race bars                                                           */
/* ------------------------------------------------------------------ */

type SeriesKey = 'v3' | 'v4' | 'memorypack';

const seriesStyle: Record<SeriesKey, { label: string; bar: string }> = {
  v4: { label: 'Nino v4', bar: 'nino-gradient-bg' },
  v3: { label: 'Nino v3 (3.3.13)', bar: 'bg-slate-400 dark:bg-slate-500' },
  memorypack: { label: 'MemoryPack', bar: 'bg-amber-500/80' },
};

function verdict(row: CompareRow, lang: Locale) {
  const zh = lang === 'zh';
  const ratio = row.ratio;
  if (ratio === undefined)
    return {
      text: zh ? '与 MemoryPack 持平' : 'on par with MemoryPack',
      tone: 'par' as const,
    };
  const r = ratio.toFixed(2);
  if (ratio >= 1)
    return {
      text: zh ? `比 MemoryPack 快 ${r} 倍` : `${r}× faster than MemoryPack`,
      tone: 'win' as const,
    };
  return {
    text: zh
      ? `${r} 倍：MemoryPack 更快（受 GC 影响）`
      : `${r}×: MemoryPack faster (GC-bound)`,
    tone: 'loss' as const,
  };
}

function Bars({
  rows,
  series,
  lang,
  showVerdict = true,
}: {
  rows: CompareRow[];
  series: SeriesKey[];
  lang: Locale;
  showVerdict?: boolean;
}) {
  const [ref, shown] = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="flex flex-col gap-5">
      {rows.map((row) => {
        const max = Math.max(...series.map((key) => row[key] ?? 0));
        const v = verdict(row, lang);
        return (
          <div key={row.name}>
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <code className="text-sm font-semibold text-fd-foreground">
                {row.name}
              </code>
              {showVerdict && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    v.tone === 'win' &&
                      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
                    v.tone === 'par' && 'bg-fd-muted text-fd-muted-foreground',
                    v.tone === 'loss' &&
                      'bg-amber-500/15 text-amber-700 dark:text-amber-300',
                  )}
                >
                  {v.text}
                </span>
              )}
            </div>
            {series.map((key, i) => {
              const value = row[key];
              if (value === undefined) return null;
              return (
                <div key={key} className="mt-1 flex items-center gap-2 text-xs">
                  <span className="w-28 shrink-0 truncate text-fd-muted-foreground sm:w-32">
                    {seriesStyle[key].label}
                  </span>
                  <span className="h-3.5 flex-1 overflow-hidden rounded-full bg-fd-muted">
                    <span
                      className={cn(
                        'block h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none',
                        seriesStyle[key].bar,
                      )}
                      style={{
                        width: shown
                          ? `${Math.max((value / max) * 100, 1)}%`
                          : '0%',
                        transitionDelay: `${i * 120}ms`,
                      }}
                    />
                  </span>
                  <span className="w-12 shrink-0 text-end tabular-nums text-fd-muted-foreground">
                    {value.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function Legend({ series, note }: { series: SeriesKey[]; note: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fd-muted-foreground">
      {series.map((key) => (
        <span key={key} className="inline-flex items-center gap-1.5">
          <span className={cn('size-2.5 rounded-full', seriesStyle[key].bar)} />
          {seriesStyle[key].label}
        </span>
      ))}
      <span className="sm:ms-auto">{note}</span>
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="tablist"
      className="mb-5 inline-flex flex-wrap gap-1 rounded-full border bg-fd-muted/50 p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
            value === option.value
              ? 'nino-btn-primary text-white'
              : 'text-fd-muted-foreground hover:text-fd-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v4 vs v3: Serialize / Deserialize / Compile time                    */
/* ------------------------------------------------------------------ */

type RaceTab = 'serialize' | 'deserialize' | 'compile';

export function V3Race({ lang = 'en' }: { lang?: Locale }) {
  const zh = lang === 'zh';
  const [tab, setTab] = useState<RaceTab>('serialize');
  const series: SeriesKey[] = ['v3', 'v4', 'memorypack'];

  return (
    <div className="not-prose my-6 rounded-2xl border bg-fd-card p-4 sm:p-6">
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'serialize', label: zh ? '序列化' : 'Serialize' },
          { value: 'deserialize', label: zh ? '反序列化' : 'Deserialize' },
          { value: 'compile', label: zh ? '编译时间' : 'Compile time' },
        ]}
      />
      {tab === 'compile' ? (
        <CompileTime lang={lang} />
      ) : (
        <>
          <Legend
            series={series}
            note={
              zh
                ? '耗时，以 MemoryPack = 1.00 归一化，越短越好'
                : 'time normalized to MemoryPack = 1.00, shorter is faster'
            }
          />
          <Bars
            key={tab}
            rows={vsV3Runtime[tab]}
            series={series}
            lang={lang}
            showVerdict={false}
          />
          <V3Ratios tab={tab} lang={lang} />
        </>
      )}
    </div>
  );
}

function V3Ratios({
  tab,
  lang,
}: {
  tab: 'serialize' | 'deserialize';
  lang: Locale;
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {vsV3Runtime[tab].map((row) => {
        const value = row.vsV3 ?? 1;
        const onPar = value <= 1;
        return (
          <div
            key={row.name}
            className="rounded-xl border bg-fd-background/60 p-3"
          >
            {onPar ? (
              <span className="text-2xl font-extrabold text-fd-muted-foreground">
                {lang === 'zh' ? '持平' : 'on par'}
              </span>
            ) : (
              <CountUp
                value={`${value.toFixed(2)}×`}
                className="nino-gradient-text text-2xl font-extrabold"
              />
            )}
            <p className="mt-0.5 text-xs text-fd-muted-foreground">
              {lang === 'zh' ? (
                <>
                  <code>{row.name}</code>
                  {onPar ? ' 与 v3 相当' : ' 比 v3 快'}
                </>
              ) : (
                <>
                  {onPar ? 'with v3 on ' : 'faster than v3 on '}
                  <code>{row.name}</code>
                </>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function CompileTime({ lang = 'en' }: { lang?: Locale }) {
  const zh = lang === 'zh';
  const [ref, shown] = useReveal<HTMLDivElement>();
  const lines = 16;

  return (
    <div ref={ref} className="@container">
      <p className="mb-4 text-sm text-fd-muted-foreground">
        {zh
          ? '源生成器基准测试（330 个类型，N = 30），v4 对比 v3 3.3.13。'
          : 'Source generator benchmark (330 types, N = 30), v4 against v3 3.3.13.'}
      </p>
      <div className="grid gap-6 @2xl:grid-cols-[3fr_2fr]">
        <div>
          <p className="mb-2 text-sm font-semibold">
            {zh ? '生成的源码大小' : 'Generated source size'}
          </p>
          {(['v3', 'v4'] as const).map((key) => (
            <div key={key} className="mt-2 flex items-center gap-2 text-xs">
              <span className="w-28 shrink-0 text-fd-muted-foreground">
                {seriesStyle[key].label}
              </span>
              <span className="h-5 flex-1 overflow-hidden rounded-full bg-fd-muted">
                <span
                  className={cn(
                    'block h-full rounded-full transition-[width] duration-[1400ms] ease-out motion-reduce:transition-none',
                    seriesStyle[key].bar,
                  )}
                  style={{
                    width:
                      key === 'v3' ? '100%' : shown ? `${100 / 16}%` : '100%',
                  }}
                />
              </span>
              <span className="w-10 shrink-0 text-end tabular-nums text-fd-muted-foreground">
                {key === 'v3' ? '16' : '1'}
              </span>
            </div>
          ))}
          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            {(['v3', 'v4'] as const).map((key) => (
              <div
                key={key}
                className="rounded-lg border bg-fd-background/60 p-3"
              >
                <p className="mb-2 font-medium">
                  {key === 'v3'
                    ? zh
                      ? 'v3：每个基类内联所有子类型'
                      : 'v3: every base inlines all subtypes'
                    : zh
                      ? 'v4：每个类型一个文件'
                      : 'v4: one file per type'}
                </p>
                <div className="flex flex-col gap-1" aria-hidden="true">
                  {Array.from({ length: key === 'v3' ? lines : 1 }, (_, i) => (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: decorative lines
                      key={i}
                      className={cn(
                        'block h-1 rounded-full',
                        key === 'v3' ? 'bg-slate-400/60' : 'nino-gradient-bg',
                      )}
                      style={{ width: `${55 + ((i * 37) % 45)}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 self-start">
          {vsV3Build.map((stat) => (
            <div
              key={stat.en}
              className="rounded-xl border bg-fd-background/60 p-3"
            >
              <CountUp
                value={stat.value}
                className="nino-gradient-text text-2xl font-extrabold"
              />
              <p className="mt-0.5 text-xs text-fd-muted-foreground">
                {zh ? stat.zh : stat.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v4 vs MemoryPack                                                    */
/* ------------------------------------------------------------------ */

type MemoryPackTab = 'serialize' | 'deserialize' | 'reuse';

export function MemoryPackRace({ lang = 'en' }: { lang?: Locale }) {
  const zh = lang === 'zh';
  const [tab, setTab] = useState<MemoryPackTab>('serialize');
  const series: SeriesKey[] = ['v4', 'memorypack'];

  return (
    <div className="not-prose my-6 rounded-2xl border bg-fd-card p-4 sm:p-6">
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'serialize', label: zh ? '序列化' : 'Serialize' },
          { value: 'deserialize', label: zh ? '反序列化' : 'Deserialize' },
          { value: 'reuse', label: zh ? '复用实例' : 'Reusing instances' },
        ]}
      />
      <Legend
        series={series}
        note={
          tab === 'reuse'
            ? zh
              ? 'Nino 复用实例 vs MemoryPack 覆盖模式，越短越好'
              : 'Nino reusing vs MemoryPack overwrite, shorter is faster'
            : zh
              ? '耗时，以 MemoryPack = 1.00 归一化，越短越好'
              : 'time normalized to MemoryPack = 1.00, shorter is faster'
        }
      />
      <Bars key={tab} rows={vsMemoryPack[tab]} series={series} lang={lang} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Showcase hero                                                       */
/* ------------------------------------------------------------------ */

export function ShowcaseHero({
  lang = 'en',
  children,
}: {
  lang?: Locale;
  children?: ReactNode;
}) {
  const zh = lang === 'zh';
  const stats: Stat[] = [
    {
      value: '4.3×',
      label: zh ? '最高快于 MemoryPack' : 'faster than MemoryPack, at most',
      note: zh ? '序列化多态类数组' : 'serializing a polymorphic class array',
    },
    {
      value: '1.73×',
      label: zh ? '序列化最高快于 v3' : 'faster serialization than v3, at most',
      note: zh ? 'SimpleClass，对比 3.3.13' : 'SimpleClass, vs 3.3.13',
    },
    {
      value: '44×',
      label: zh
        ? '生成代码的编译快于 v3'
        : 'faster to compile the generated code',
      note: zh ? '330 个类型，对比 v3 3.3.13' : '330 types, vs v3 3.3.13',
    },
    {
      value: '16×',
      label: zh ? '生成的代码少于 v3' : 'less generated code than v3',
      note: zh ? '330 个类型' : '330 types',
    },
  ];

  return (
    <div className="nino-showcase not-prose relative my-6 overflow-hidden rounded-2xl border p-6 sm:p-8">
      <div className="nino-grid-glow" aria-hidden="true" />
      <div className="relative">
        <p className="text-xs font-semibold tracking-widest text-fd-primary uppercase">
          {zh
            ? 'Nino v4 对比 v3 与 MemoryPack'
            : 'Nino v4 vs v3 and MemoryPack'}
        </p>
        <p className="mt-2 max-w-2xl text-2xl font-bold text-balance sm:text-3xl">
          {children ??
            (zh
              ? '运行更快，构建更快，生成的代码少得多。'
              : 'Faster to run, faster to build, and a fraction of the generated code.')}
        </p>
        <StatCards stats={stats} />
      </div>
    </div>
  );
}

export { vsMemoryPack, vsV3Runtime };

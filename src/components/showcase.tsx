/**
 * Small shared pieces: reveal-on-scroll, count-up numbers, the stat row and
 * the tab bar used by the charts.
 *
 * Everything renders its final state on the server (prerendered HTML, no
 * JavaScript needed to read the numbers). After hydration, elements that are
 * not yet on screen reset and animate when scrolled into view. With
 * prefers-reduced-motion, nothing animates.
 */
import { type ReactNode, useEffect, useRef, useState } from 'react';
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
export function useReveal<T extends Element>() {
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
/* Stat row                                                            */
/* ------------------------------------------------------------------ */

export interface Stat {
  value: string;
  label: ReactNode;
  note?: ReactNode;
}

/** A row of plain numbers with labels, separated by hairlines. */
export function StatCards({
  stats,
  className,
}: {
  stats: Stat[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        'not-prose my-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-fd-border md:grid-cols-4',
        className,
      )}
    >
      {stats.map((stat) => (
        <div
          key={`${stat.value}${String(stat.label)}`}
          className="flex flex-col gap-1 bg-fd-card px-4 py-4"
        >
          <dt className="order-2 text-xs leading-snug text-fd-muted-foreground">
            {stat.label}
          </dt>
          <dd className="order-1 text-2xl font-bold tracking-tight md:text-3xl">
            <CountUp value={stat.value} />
          </dd>
          {stat.note && (
            <dd className="order-3 text-xs text-fd-muted-foreground/80">
              {stat.note}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}

/** The four headline numbers of v4 (home page, What's New, docs index). */
export function headlineStats(lang: Locale): Stat[] {
  return lang === 'zh'
    ? [
        { value: '4.3×', label: '序列化比 MemoryPack 快' },
        { value: '4.9×', label: '反序列化到已有对象更快' },
        { value: '0 GC', label: '序列化、复用池化对象反序列化零 GC 分配' },
        { value: '44×', label: '编译比 v3 快' },
      ]
    : [
        { value: '4.3×', label: 'faster serialization than MemoryPack' },
        { value: '4.9×', label: 'faster deserializing into existing objects' },
        {
          value: '0 GC',
          label:
            'zero GC allocations when serializing or deserializing into pooled objects',
        },
        { value: '44×', label: 'faster compile than v3' },
      ];
}

export function ShowcaseHero({ lang = 'en' }: { lang?: Locale }) {
  return <StatCards stats={headlineStats(lang)} />;
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

export function Segmented<T extends string>({
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
      className="mb-3 inline-flex max-w-full flex-wrap gap-1 rounded-lg border bg-fd-muted p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-3 py-1 text-sm font-medium transition-colors',
            value === option.value
              ? 'bg-fd-background text-fd-foreground shadow-sm'
              : 'text-fd-muted-foreground hover:text-fd-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

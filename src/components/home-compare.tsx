import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useReveal } from '@/components/showcase';
import {
  type BuildMeasure,
  buildLarge,
  buildRow,
  buildSmall,
  formatBuildRatio,
  formatRatio,
  hasWorkloads,
  otherLibs,
  type RuntimeCase,
  runtime,
  x64,
} from '@/lib/benchmarks';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

/*
 * The home page's numbers, in two layers:
 *
 * 1. A featured card: the case where Nino's serialize beats MemoryPack by the
 *    most (among the workloads once the report has them, as every headline),
 *    with two large figures (how many times faster than the closest and the
 *    slowest library) beside the measured times. Static: never counts up from 0.
 * 2. Three panels on one grid (serialize and deserialize against every
 *    library, each row a case with the range of multiples; vs Nino v3) whose
 *    rows line up across the panels (CSS subgrid on wide screens).
 *
 * Every value comes from src/lib/benchmarks.ts: runtime ratios from the raw
 * means through formatRatio (times()), build ratios as published. Bars
 * are drawn to scale and grow in once when scrolled into view (not with
 * reduced motion); the prerendered HTML already has their final widths.
 */

/** The headline's cases: the workloads once the report has them */
const headlineCases = hasWorkloads ? x64.workloads : runtime;

/** The headline case where Nino beats MemoryPack by the most */
const best = (op: 'serialize' | 'deserialize') =>
  headlineCases[op].reduce<RuntimeCase | undefined>(
    (top, row) => ((row.ratio ?? 0) > Math.max(1, top?.ratio ?? 0) ? row : top),
    undefined,
  );

const polySer = best('serialize');
const count = (n: number) => n.toLocaleString('en-US');

/** Case name inside a sentence: "polymorphic class array", "SimpleClass", "多态类数组" */
function caseName(row: RuntimeCase, zh: boolean) {
  if (zh && row.zh) return row.zh;
  // "RPC request" keeps its capitals
  if (row.code || !/^[A-Z][a-z]/.test(row.name)) return row.name;
  return row.name.charAt(0).toLowerCase() + row.name.slice(1);
}

/** 462 -> "7 min 42 s" / "7 分 42 秒" */
function minutes(seconds: number, zh: boolean) {
  const [min, sec] = zh ? ['分', '秒'] : ['min', 's'];
  if (seconds < 60) return `${seconds} ${sec}`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds - m * 60);
  return s ? `${m} ${min} ${s} ${sec}` : `${m} ${min}`;
}

/** "2.1 s" -> "2.1 秒" in Chinese, as the zh docs write it */
const seconds = (text: string, zh: boolean) =>
  zh ? text.replace(/ s$/, ' 秒') : text;

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Bar({
  label,
  value,
  max,
  text,
  nino,
  thick,
}: {
  label: string;
  value: number;
  max: number;
  text: string;
  nino?: boolean;
  thick?: boolean;
}) {
  // A floor of 1% keeps a sliver visible; nothing (0 B) draws no bar.
  const pct = value > 0 ? Math.max((value / max) * 100, 1) : 0;
  return (
    <div className="grid grid-cols-[7.25rem_minmax(0,1fr)_4.25rem] items-center gap-3 text-xs">
      <span
        className={cn(
          'truncate',
          nino ? 'font-medium text-fd-foreground' : 'text-fd-muted-foreground',
        )}
      >
        {label}
      </span>
      <span className={cn('relative', thick ? 'h-2.5' : 'h-1.5')}>
        {pct > 0 && (
          <span
            className={cn(
              'nino-chart-bar absolute inset-y-0 left-0 rounded-full',
              nino ? 'bg-fd-primary' : 'bg-[var(--nino-chart-other)]',
            )}
            style={{ width: `${pct}%` }}
          />
        )}
      </span>
      <span
        className={cn(
          'text-right tabular-nums',
          nino ? 'font-medium text-fd-foreground' : 'text-fd-muted-foreground',
        )}
      >
        {text}
      </span>
    </div>
  );
}

type Measured = { label: string; value: number; text: string };

/** Nino's bar over the others', on the scale of the slowest */
function Pair({
  a,
  b,
  more = [],
  thick,
}: {
  a: Measured;
  b: Measured;
  more?: Measured[];
  thick?: boolean;
}) {
  const max = Math.max(b.value, ...more.map((m) => m.value));
  return (
    <div className={cn('flex flex-col', thick ? 'gap-2.5' : 'gap-1.5')}>
      <Bar nino thick={thick} {...a} max={max} />
      <Bar thick={thick} {...b} max={max} />
      {more.map((m) => (
        <Bar key={m.label} thick={thick} {...m} max={max} />
      ))}
    </div>
  );
}

/** A case's MessagePack and protobuf-net times, where the report has them */
const otherTimes = (row: RuntimeCase): Measured[] =>
  otherLibs.flatMap((lib) => {
    const v = row.others[lib.key];
    return v ? [{ label: lib.label, value: v.time.ns, text: v.time.text }] : [];
  });

/** A large figure and what it is against ("5.4×", "MemoryPack") */
interface Figure {
  value: string;
  caption: string;
}

interface Row {
  label: string;
  note?: string;
  figures: Figure[];
  body: ReactNode;
}

/** The gradient multiple the home page writes its figures in */
function Multiple({ value, big }: { value: string; big?: boolean }) {
  return (
    <span
      className={cn(
        'bg-linear-to-r/oklab from-nino-grad-from to-nino-grad-to bg-clip-text leading-none font-extrabold tracking-tighter text-transparent tabular-nums',
        big ? 'text-5xl sm:text-6xl' : 'text-3xl',
      )}
    >
      {value}
    </span>
  );
}

function Panel({
  title,
  subtitle,
  rows,
  link,
  href,
  wide,
}: {
  title: string;
  /** One line beside the title: what the figures compare */
  subtitle: string;
  rows: Row[];
  link: string;
  href: string;
  /** Spans both columns, its rows side by side */
  wide?: boolean;
}) {
  const body = rows.map((row, i) => (
    <div
      key={`${row.label} ${row.note ?? ''}`}
      className={cn(
        'flex flex-col gap-3 px-5 py-5 sm:px-6',
        i > 0 && (wide ? 'border-t lg:border-t-0 lg:border-l' : 'border-t'),
      )}
    >
      <p className="flex flex-col">
        <span className="text-sm font-medium">{row.label}</span>
        {row.note && (
          <span className="text-xs text-fd-muted-foreground">{row.note}</span>
        )}
      </p>
      <div className="flex gap-8">
        {row.figures.map((f) => (
          <p key={f.caption} className="flex flex-col gap-1.5">
            <Multiple value={f.value} />
            <span className="text-xs whitespace-nowrap text-fd-muted-foreground">
              {f.caption}
            </span>
          </p>
        ))}
      </div>
      {row.body}
    </div>
  ));
  return (
    <section
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border bg-fd-card',
        wide
          ? 'lg:col-span-2'
          : 'lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:gap-0',
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-5 py-4 sm:px-6">
        <h2 className="font-semibold tracking-tight">{title}</h2>
        <p className="text-xs text-fd-muted-foreground">{subtitle}</p>
      </div>
      {wide ? <div className="lg:grid lg:grid-cols-3">{body}</div> : body}
      <div className="mt-auto border-t px-5 py-3.5 sm:px-6">
        <Link
          to={href}
          className="text-sm font-medium text-fd-primary underline-offset-4 hover:underline"
        >
          {link}
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rows                                                                */
/* ------------------------------------------------------------------ */

/** Every library a case timed besides Nino: MemoryPack, then the others in otherLibs' order */
interface Opponent {
  label: string;
  ns: number;
  text: string;
  /** Its time / Nino's; undefined = on par (or Nino under the floor) */
  ratio?: number;
}

function opponents(row: RuntimeCase): Opponent[] {
  const out: Opponent[] = [
    {
      label: 'MemoryPack',
      ns: row.memorypack.ns,
      text: row.memorypack.text,
      ratio: row.ratio,
    },
  ];
  for (const lib of otherLibs) {
    const v = row.others[lib.key];
    if (v)
      out.push({
        label: lib.label,
        ns: v.time.ns,
        text: v.time.text,
        ratio: v.ratio,
      });
  }
  return out;
}

/** The closest and the slowest opponent of a case; undefined when none is behind */
function spread(
  row: RuntimeCase,
): { low: Opponent; high: Opponent } | undefined {
  const all = [...opponents(row)].sort((a, b) => a.ns - b.ns);
  const high = all.at(-1);
  if (!high?.ratio || high.ratio <= 1) return undefined;
  return { low: all[0], high };
}

/**
 * The headline case's name for a serialize figure: the part before the comma, since
 * the rest can describe the read ("State-sync snapshot, in place")
 */
function headlineName(row: RuntimeCase, zh: boolean) {
  return caseName(row, zh).split(zh ? '，' : ', ')[0];
}

/** Nino's bar over every opponent's */
function AllBars({ row }: { row: RuntimeCase }) {
  const [first, ...rest] = opponents(row).map((o) => ({
    label: o.label,
    value: o.ns,
    text: o.text,
  }));
  return (
    <Pair
      a={{ label: 'Nino v4', value: row.v4.ns, text: row.v4.text }}
      b={first}
      more={rest}
    />
  );
}

/** The panels' cases: three workloads per operation (standard, polymorphic, a larger one), or the first three cases */
const panelKeys = {
  serialize: ['MediaContent', 'RpcCall', 'EventStream'],
  deserialize: ['MediaContent', 'RpcCall', 'IdleSave'],
};

function libraryRows(op: 'serialize' | 'deserialize', zh: boolean): Row[] {
  const cases = hasWorkloads
    ? panelKeys[op].flatMap((key) => {
        const row = x64.workloads[op].find((r) => r.key === key);
        return row ? [row] : [];
      })
    : runtime[op].slice(0, 3);
  return cases.flatMap((row) => {
    const ends = spread(row);
    if (!ends) return [];
    return [
      {
        label: caseName(row, zh),
        figures: [ends.low, ends.high].map((o) => ({
          value: o.ratio ? formatRatio(o.ratio) : zh ? '持平' : 'on par',
          caption: o.label,
        })),
        body: <AllBars row={row} />,
      },
    ];
  });
}

function Before({ v3, v4, big }: { v3: string; v4: string; big?: boolean }) {
  return (
    <p
      className={cn(
        'flex flex-wrap items-baseline gap-x-3 tracking-tight whitespace-nowrap tabular-nums',
        big ? 'text-2xl sm:text-3xl' : 'text-xl',
      )}
    >
      <span className="text-fd-muted-foreground">{v3}</span>
      <span aria-hidden="true" className="text-base text-fd-muted-foreground">
        →
      </span>
      <span className="font-semibold">{v4}</span>
    </p>
  );
}

function v3Rows(zh: boolean): Row[] {
  const types = (n: number) =>
    zh ? `${count(n)} 个类型` : `${count(n)} types`;
  const unit = (row: BuildMeasure) =>
    row.better === 'smaller'
      ? zh
        ? '更小'
        : 'smaller'
      : zh
        ? '更快'
        : 'faster';
  // Only rows where v4 is ahead: the panel shows how many times better.
  const ahead = (row: BuildMeasure | undefined) =>
    row?.verdict === 'better' ? row : undefined;
  const emit = ahead(buildRow(buildLarge, 'emit'));
  const source = ahead(buildRow(buildLarge, 'source'));
  const generator = ahead(buildRow(buildSmall, 'generate'));
  const rows: Row[] = [];
  if (emit)
    rows.push({
      label: zh ? '编译生成的代码' : 'Compile the generated code',
      note: types(buildLarge.types),
      figures: [{ value: formatBuildRatio(emit.ratio), caption: unit(emit) }],
      body: <Before big v3={minutes(emit.v3n, zh)} v4={seconds(emit.v4, zh)} />,
    });
  if (source)
    rows.push({
      label: zh ? '生成的源码' : 'Generated source',
      note: types(buildLarge.types),
      figures: [
        { value: formatBuildRatio(source.ratio), caption: unit(source) },
      ],
      body: <Before v3={source.v3} v4={source.v4} />,
    });
  if (generator)
    rows.push({
      label: zh ? '运行生成器' : 'Run the generator',
      note: types(buildSmall.types),
      figures: [
        { value: formatBuildRatio(generator.ratio), caption: unit(generator) },
      ],
      body: (
        <Before v3={seconds(generator.v3, zh)} v4={seconds(generator.v4, zh)} />
      ),
    });
  return rows;
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function HomeCompare({ lang, docs }: { lang: Locale; docs: string }) {
  const zh = lang === 'zh';
  const [ref, shown] = useReveal<HTMLDivElement>();
  // The headline's closest and slowest opponents
  const extremes = polySer ? spread(polySer) : undefined;
  const libsSubtitle = zh
    ? 'Nino 比最接近和最慢的库快几倍'
    : 'How many times faster Nino is than the closest and the slowest';

  return (
    <div
      ref={ref}
      className="nino-chart flex flex-col gap-10"
      data-hidden={shown ? undefined : ''}
    >
      {polySer && extremes && (
        <section className="overflow-hidden rounded-2xl border bg-fd-card">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-5 py-4 sm:px-8">
            <h2 className="font-semibold tracking-tight">
              {zh ? '序列化速度' : 'Serialize speed'}
              <span className="font-normal text-fd-muted-foreground">
                {' · '}
                {headlineName(polySer, zh)}
              </span>
            </h2>
            <p className="text-xs text-fd-muted-foreground">
              {zh
                ? `对比其他 ${opponents(polySer).length} 个序列化库，同一台 runner`
                : `vs the other ${opponents(polySer).length} serializers, one runner`}
            </p>
          </div>
          <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
            <div className="grid grid-cols-2 gap-6 self-center">
              {[extremes.low, extremes.high].map((o, i) => (
                <div key={o.label} className={cn(i > 0 && 'border-l pl-6')}>
                  <Multiple
                    big
                    value={
                      o.ratio ? formatRatio(o.ratio) : zh ? '持平' : 'on par'
                    }
                  />
                  <p className="mt-3 text-sm font-medium whitespace-nowrap">
                    {o.label}
                  </p>
                  <p className="mt-0.5 text-xs text-fd-muted-foreground">
                    {i === 0
                      ? zh
                        ? '最接近的对手，Nino 比它快'
                        : 'The closest; Nino is this much faster'
                      : zh
                        ? '最慢的对手，Nino 比它快'
                        : 'The slowest; Nino is this much faster'}
                  </p>
                </div>
              ))}
            </div>
            <Pair
              thick
              a={{
                label: 'Nino v4',
                value: polySer.v4.ns,
                text: polySer.v4.text,
              }}
              b={{
                label: 'MemoryPack',
                value: polySer.memorypack.ns,
                text: polySer.memorypack.text,
              }}
              more={otherTimes(polySer)}
            />
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-8">
        <Panel
          title={zh ? '序列化，对比各个库' : 'Serialize, vs every library'}
          subtitle={libsSubtitle}
          rows={libraryRows('serialize', zh)}
          link={zh ? '全部基准测试' : 'All benchmarks'}
          href={`${docs}/benchmarks#${hasWorkloads ? 'workloads' : 'basic-types'}`}
        />
        <Panel
          title={zh ? '反序列化，对比各个库' : 'Deserialize, vs every library'}
          subtitle={libsSubtitle}
          rows={libraryRows('deserialize', zh)}
          link={zh ? '各库怎么处理难点' : 'How each library copes'}
          href={`${docs}/benchmarks#${hasWorkloads ? 'workarounds' : 'basic-types'}`}
        />
        <Panel
          wide
          title={zh ? '对比 Nino v3' : 'vs Nino v3'}
          subtitle={
            zh
              ? '源生成器基准测试，v3.3.13 → v4'
              : 'Source generator benchmark, v3.3.13 → v4'
          }
          rows={v3Rows(zh)}
          link={zh ? 'v4 相比 v3 的变化' : 'What changed since v3'}
          href={`${docs}/whats-new#features`}
        />
      </div>
    </div>
  );
}

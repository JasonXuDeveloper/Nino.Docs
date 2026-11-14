import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useReveal } from '@/components/showcase';
import {
  type BuildMeasure,
  bestReuse,
  buildLarge,
  buildRow,
  buildSmall,
  formatBuildRatio,
  formatBytes,
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
 * 1. One monumental figure: Nino's biggest serialize win over MemoryPack
 *    (among the workloads once the report has them, as every headline),
 *    beside the two measured times on a shared axis. Static: the number is
 *    the first thing read, so it never counts up from 0.
 * 2. Three panels on one grid (vs MemoryPack, vs MessagePack and
 *    protobuf-net, vs Nino v3) whose rows line up across the panels (CSS
 *    subgrid on wide screens).
 *
 * Every value comes from src/lib/benchmarks.ts: runtime ratios from the raw
 * means through formatRatio (times()), build ratios as published. Bars
 * are drawn to scale and grow in once when scrolled into view (not with
 * reduced motion); the prerendered HTML already has their final widths.
 */

const find = (op: 'serialize' | 'deserialize', name: string) =>
  runtime[op].find((r) => r.name === name);

/** The headline's cases: the workloads once the report has them */
const headlineCases = hasWorkloads ? x64.workloads : runtime;

/** The headline case where Nino beats MemoryPack by the most */
const best = (op: 'serialize' | 'deserialize') =>
  headlineCases[op].reduce<RuntimeCase | undefined>(
    (top, row) => ((row.ratio ?? 0) > Math.max(1, top?.ratio ?? 0) ? row : top),
    undefined,
  );

/** The case the panels time every library on: the first workload (the standard MediaContent), or SimpleClass */
const simple = hasWorkloads
  ? x64.workloads.serialize[0]
  : find('serialize', 'SimpleClass');
const polySer = best('serialize');
const polyDes = best('deserialize');
const leaves = bestReuse;
const count = (n: number) => n.toLocaleString('en-US');

/** Case name inside a sentence: "polymorphic class array", "SimpleClass", "多态类数组" */
function caseName(row: RuntimeCase, zh: boolean) {
  if (zh && row.zh) return row.zh;
  // "RPC request" keeps its capitals
  if (row.code || !/^[A-Z][a-z]/.test(row.name)) return row.name;
  return row.name.charAt(0).toLowerCase() + row.name.slice(1);
}

/** "a" or "an" before a case name: "an RPC request", "a log batch" */
const article = (row: RuntimeCase) =>
  /^([aeiou]|RPC\b)/i.test(caseName(row, false)) ? 'an' : 'a';

/** "Serialize SimpleClass", "反序列化多态类数组", "序列化 SimpleClass" */
const action = (verb: string, row: RuntimeCase, zh: boolean) =>
  `${verb}${zh && !row.code ? '' : ' '}${caseName(row, zh)}`;

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
}: {
  a: Measured;
  b: Measured;
  more?: Measured[];
}) {
  const max = Math.max(b.value, ...more.map((m) => m.value));
  return (
    <div className="flex flex-col gap-1.5">
      <Bar nino {...a} max={max} />
      <Bar {...b} max={max} />
      {more.map((m) => (
        <Bar key={m.label} {...m} max={max} />
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

/** A caption over a pair of bars when a row has two measures (time, allocated) */
function Measure({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-fd-muted-foreground">{caption}</span>
      {children}
    </div>
  );
}

interface Row {
  label: string;
  note?: string;
  ratio: string;
  unit: string;
  body: ReactNode;
}

function Panel({
  title,
  rows,
  link,
  href,
  wide,
}: {
  title: string;
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
      <div className="flex items-start justify-between gap-4">
        <p className="flex flex-col">
          <span className="text-sm font-medium">{row.label}</span>
          {row.note && (
            <span className="text-xs text-fd-muted-foreground">{row.note}</span>
          )}
        </p>
        <p className="flex shrink-0 items-baseline gap-1.5 leading-none">
          <span className="bg-linear-to-r/oklab from-nino-grad-from to-nino-grad-to bg-clip-text text-2xl font-semibold tracking-tight text-transparent tabular-nums">
            {row.ratio}
          </span>
          <span className="text-xs text-fd-muted-foreground">{row.unit}</span>
        </p>
      </div>
      {row.body}
    </div>
  ));
  return (
    <section
      className={cn(
        'flex flex-col rounded-xl border',
        wide
          ? 'lg:col-span-2'
          : 'lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:gap-0',
      )}
    >
      <h2 className="px-5 pt-5 pb-1 font-semibold tracking-tight sm:px-6">
        {title}
      </h2>
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

function memorypackRows(zh: boolean): Row[] {
  const faster = zh ? '更快' : 'faster';
  const rows: Row[] = [];
  const timed = (row: RuntimeCase | undefined, verb: string) => {
    if (!row?.ratio) return;
    rows.push({
      label: action(verb, row, zh),
      ratio: formatRatio(row.ratio),
      unit: faster,
      body: (
        <Pair
          a={{ label: 'Nino v4', value: row.v4.ns, text: row.v4.text }}
          b={{
            label: 'MemoryPack',
            value: row.memorypack.ns,
            text: row.memorypack.text,
          }}
        />
      ),
    });
  };
  timed(simple !== polySer ? simple : undefined, zh ? '序列化' : 'Serialize');
  timed(polyDes, zh ? '反序列化' : 'Deserialize');
  if (leaves)
    rows.push({
      label: zh ? '反序列化到池化对象' : 'Deserialize into pooled objects',
      note: zh ? '对比 MemoryPack 覆盖写入' : "vs MemoryPack's overwrite mode",
      ratio: formatRatio(leaves.memorypackOverwrite.ns / leaves.ninoReuse.ns),
      unit: faster,
      body: (
        <div className="flex flex-col gap-4">
          <Measure caption={zh ? '耗时' : 'Time'}>
            <Pair
              a={{
                label: 'Nino v4',
                value: leaves.ninoReuse.ns,
                text: leaves.ninoReuse.text,
              }}
              b={{
                label: 'MemoryPack',
                value: leaves.memorypackOverwrite.ns,
                text: leaves.memorypackOverwrite.text,
              }}
            />
          </Measure>
          {leaves.ninoReuseBytes !== null &&
            leaves.memorypackOverwriteBytes !== null && (
              <Measure caption={zh ? '分配' : 'Allocated'}>
                <Pair
                  a={{
                    label: 'Nino v4',
                    value: leaves.ninoReuseBytes,
                    text: formatBytes(leaves.ninoReuseBytes),
                  }}
                  b={{
                    label: 'MemoryPack',
                    value: leaves.memorypackOverwriteBytes,
                    text: formatBytes(leaves.memorypackOverwriteBytes),
                  }}
                />
              </Measure>
            )}
        </div>
      ),
    });
  return rows;
}

/** Serialize SimpleClass against each library, then deserialize against both */
/** The panels' polymorphic case: the RPC call whose result is an interface (workloads only) */
const polymorphic = hasWorkloads
  ? x64.workloads.serialize.find((r) => r.name.startsWith('RPC call'))
  : undefined;

/** The panels' deserialize case: the first workload's, or SimpleClass */
const simpleDes = hasWorkloads
  ? x64.workloads.deserialize[0]
  : find('deserialize', 'SimpleClass');

/**
 * One row per operation of the panels' case: Nino against every other library
 * the report timed on it; the multiple is the one against the fastest of them
 * (the closest race), whose name the note gives.
 */
function otherRows(zh: boolean): Row[] {
  const rows: Row[] = [];
  const faster = zh ? '更快' : 'faster';
  for (const [row, verb] of [
    [simple, zh ? '序列化' : 'Serialize'],
    [simpleDes, zh ? '反序列化' : 'Deserialize'],
    // A polymorphic workload too: the others need a workaround for an interface result
    [polymorphic, zh ? '序列化' : 'Serialize'],
  ] as const) {
    if (!row) continue;
    const timed = otherLibs.flatMap((lib) => {
      const v = row.others[lib.key];
      return v?.ratio ? [{ lib, v, ratio: v.ratio }] : [];
    });
    if (timed.length === 0) continue;
    const closest = timed.reduce((a, b) => (b.ratio < a.ratio ? b : a));
    rows.push({
      label: action(verb, row, zh),
      note: zh
        ? `对比其中最快的 ${closest.lib.label} ${closest.lib.version}`
        : `vs the fastest of them, ${closest.lib.label} ${closest.lib.version}`,
      ratio: formatRatio(closest.ratio),
      unit: faster,
      body: (
        <Pair
          a={{ label: 'Nino v4', value: row.v4.ns, text: row.v4.text }}
          b={{
            label: timed[0].lib.label,
            value: timed[0].v.time.ns,
            text: timed[0].v.time.text,
          }}
          more={timed.slice(1).map(({ lib, v }) => ({
            label: lib.label,
            value: v.time.ns,
            text: v.time.text,
          }))}
        />
      ),
    });
  }
  return rows;
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
    zh ? `${count(n)} 个类型，v3.3.13 → v4` : `${count(n)} types, v3.3.13 → v4`;
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
      ratio: formatBuildRatio(emit.ratio),
      unit: unit(emit),
      body: <Before big v3={minutes(emit.v3n, zh)} v4={seconds(emit.v4, zh)} />,
    });
  if (source)
    rows.push({
      label: zh ? '生成的源码' : 'Generated source',
      note: types(buildLarge.types),
      ratio: formatBuildRatio(source.ratio),
      unit: unit(source),
      body: <Before v3={source.v3} v4={source.v4} />,
    });
  if (generator)
    rows.push({
      label: zh ? '运行生成器' : 'Run the generator',
      note: types(buildSmall.types),
      ratio: formatBuildRatio(generator.ratio),
      unit: unit(generator),
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

  return (
    <div
      ref={ref}
      className="nino-chart flex flex-col gap-10"
      data-hidden={shown ? undefined : ''}
    >
      {polySer?.ratio && (
        <div className="grid items-end gap-x-14 gap-y-5 lg:grid-cols-[auto_minmax(0,1fr)]">
          <div>
            <p className="text-sm text-fd-muted-foreground">
              {zh
                ? '序列化速度，对比 MemoryPack'
                : 'Serialize speed, vs MemoryPack'}
            </p>
            <span className="mt-2 block bg-linear-to-r/oklab from-nino-grad-from to-nino-grad-to bg-clip-text pb-2 text-[5.5rem] leading-none font-extrabold tracking-tighter text-transparent tabular-nums sm:text-9xl">
              {formatRatio(polySer.ratio)}
            </span>
          </div>
          <div className="flex flex-col gap-4 lg:pb-4">
            <p className="max-w-md text-base leading-snug text-pretty sm:text-lg">
              {zh
                ? `${action('序列化', polySer, zh)}，Nino v4 用时 ${polySer.v4.text}，MemoryPack ${[polySer.memorypack.text, ...otherTimes(polySer).map((m) => `${m.label} ${m.text}`)].join('，')}。`
                : `${action(`Serializing ${article(polySer)}`, polySer, zh)}: ${polySer.v4.text} with Nino v4, ${(() => {
                    const all = [
                      `${polySer.memorypack.text} with MemoryPack`,
                      ...otherTimes(polySer).map(
                        (m) => `${m.text} with ${m.label}`,
                      ),
                    ];
                    return all.length > 1
                      ? `${all.slice(0, -1).join(', ')} and ${all.at(-1)}`
                      : all[0];
                  })()}.`}
            </p>
            <Pair
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
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-8">
        <Panel
          title={zh ? '对比 MemoryPack' : 'vs MemoryPack'}
          rows={memorypackRows(zh)}
          link={zh ? '全部基准测试' : 'All benchmarks'}
          href={`${docs}/benchmarks`}
        />
        {otherRows(zh).length > 0 && (
          <Panel
            title={zh ? '对比其他序列化库' : 'vs other serializers'}
            rows={otherRows(zh)}
            link={zh ? '各库的全部数据' : 'Every library, every case'}
            href={`${docs}/benchmarks#${hasWorkloads ? 'workloads' : 'basic-types'}`}
          />
        )}
        <Panel
          wide
          title={zh ? '对比 Nino v3' : 'vs Nino v3'}
          rows={v3Rows(zh)}
          link={zh ? 'v4 相比 v3 的变化' : 'What changed since v3'}
          href={`${docs}/whats-new#features`}
        />
      </div>
    </div>
  );
}

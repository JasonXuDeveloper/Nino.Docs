import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { CountUp, useReveal } from '@/components/showcase';
import {
  bestReuse,
  build,
  buildLarge,
  formatBuildRatio,
  formatBytes,
  formatRatio,
  type RuntimeCase,
  runtime,
} from '@/lib/benchmarks';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

/*
 * The home page's numbers, in two layers:
 *
 * 1. One monumental figure: Nino's biggest serialize win over MemoryPack,
 *    beside the two measured times on a shared axis.
 * 2. Two panels on one grid (vs MemoryPack, vs Nino v3) whose rows line up
 *    across the panels (CSS subgrid on wide screens).
 *
 * Every value comes from src/lib/benchmarks.ts: runtime ratios from the raw
 * means through formatRatio (two decimals), build ratios as published. Bars
 * are drawn to scale and grow in once when scrolled into view (not with
 * reduced motion); the prerendered HTML already has their final widths.
 */

const find = (op: 'serialize' | 'deserialize', name: string) =>
  runtime[op].find((r) => r.name === name);

/** The case where Nino beats MemoryPack by the most */
const best = (op: 'serialize' | 'deserialize') =>
  runtime[op].reduce<RuntimeCase | undefined>(
    (top, row) => ((row.ratio ?? 0) > (top?.ratio ?? 0) ? row : top),
    undefined,
  );

const simple = find('serialize', 'SimpleClass');
const polySer = best('serialize');
const polyDes = best('deserialize');
const leaves = bestReuse;
const count = (n: number) => n.toLocaleString('en-US');

/** Case name inside a sentence: "polymorphic class array", "SimpleClass", "多态类数组" */
function caseName(row: RuntimeCase, zh: boolean) {
  if (zh && row.zh) return row.zh;
  if (row.code) return row.name;
  return row.name.charAt(0).toLowerCase() + row.name.slice(1);
}

/** "Serialize SimpleClass", "反序列化多态类数组", "序列化 SimpleClass" */
const action = (verb: string, row: RuntimeCase, zh: boolean) =>
  `${verb}${zh && !row.code ? '' : ' '}${caseName(row, zh)}`;

/** 636 -> "10 min 36 s" / "10 分 36 秒" */
function minutes(seconds: number, zh: boolean) {
  const [min, sec] = zh ? ['分', '秒'] : ['min', 's'];
  if (seconds < 60) return `${seconds} ${sec}`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds - m * 60);
  return s ? `${m} ${min} ${s} ${sec}` : `${m} ${min}`;
}

/** "2.2 s" -> "2.2 秒" in Chinese, as the zh docs write it */
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
  // A floor of 1% keeps a sliver visible.
  const pct = Math.max((value / max) * 100, 1);
  return (
    <div className="grid grid-cols-[5.25rem_minmax(0,1fr)_4.25rem] items-center gap-3 text-xs">
      <span
        className={cn(
          'truncate',
          nino ? 'font-medium text-fd-foreground' : 'text-fd-muted-foreground',
        )}
      >
        {label}
      </span>
      <span className={cn('relative', thick ? 'h-2.5' : 'h-1.5')}>
        <span
          className={cn(
            'nino-chart-bar absolute inset-y-0 left-0 rounded-full',
            nino ? 'bg-fd-primary' : 'bg-[var(--nino-chart-other)]',
          )}
          style={{ width: `${pct}%` }}
        />
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

function Pair({
  a,
  b,
}: {
  a: { label: string; value: number; text: string };
  b: { label: string; value: number; text: string };
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Bar nino {...a} max={b.value} />
      <Bar {...b} max={b.value} />
    </div>
  );
}

/** Allocation as a container: Nino's stays empty, MemoryPack's is full */
function Allocation({
  label,
  bytes,
  full,
}: {
  label: string;
  bytes: number;
  full?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5 text-xs">
      <span
        aria-hidden="true"
        className={cn(
          'size-7 shrink-0 rounded-[3px] border',
          full
            ? 'border-transparent bg-[var(--nino-chart-other)]'
            : 'border-dashed border-fd-muted-foreground/60',
        )}
      />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            'tabular-nums',
            full
              ? 'text-fd-muted-foreground'
              : 'font-medium text-fd-foreground',
          )}
        >
          {formatBytes(bytes)}
        </span>
        <span className="text-fd-muted-foreground">{label}</span>
      </span>
    </span>
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
}: {
  title: string;
  rows: Row[];
  link: string;
  href: string;
}) {
  return (
    <section
      className={cn(
        'flex flex-col rounded-xl border',
        'lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:gap-0',
      )}
    >
      <h3 className="px-5 pt-5 pb-1 font-semibold tracking-tight sm:px-6">
        {title}
      </h3>
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={cn(
            'flex flex-col gap-3 px-5 py-5 sm:px-6',
            i > 0 && 'border-t',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="flex flex-col">
              <span className="text-sm font-medium">{row.label}</span>
              {row.note && (
                <span className="text-xs text-fd-muted-foreground">
                  {row.note}
                </span>
              )}
            </p>
            <p className="flex shrink-0 items-baseline gap-1.5 leading-none">
              <span className="text-2xl font-semibold tracking-tight tabular-nums">
                {row.ratio}
              </span>
              <span className="text-xs text-fd-muted-foreground">
                {row.unit}
              </span>
            </p>
          </div>
          {row.body}
        </div>
      ))}
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
          {leaves.ninoReuseBytes !== null &&
            leaves.memorypackOverwriteBytes !== null && (
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <Allocation
                  label={zh ? 'Nino v4 分配' : 'Nino v4 allocates'}
                  bytes={leaves.ninoReuseBytes}
                />
                <Allocation
                  full
                  label={zh ? 'MemoryPack 分配' : 'MemoryPack allocates'}
                  bytes={leaves.memorypackOverwriteBytes}
                />
              </div>
            )}
        </div>
      ),
    });
  return rows;
}

function Before({ v3, v4, big }: { v3: string; v4: string; big?: boolean }) {
  return (
    <p
      className={cn(
        'flex flex-wrap items-baseline gap-x-3 tracking-tight tabular-nums',
        big ? 'text-3xl sm:text-4xl' : 'text-xl',
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
  const { emit, source } = buildLarge;
  const types = (n: number) =>
    zh ? `${count(n)} 个类型，v3.3.13 → v4` : `${count(n)} types, v3.3.13 → v4`;
  const generator = build.find((b) => b.en === 'Running the generator');
  const rows: Row[] = [
    {
      label: zh ? '编译生成的代码' : 'Compile the generated code',
      note: types(buildLarge.types),
      ratio: formatBuildRatio(emit.ratio),
      unit: zh ? '更快' : 'faster',
      body: (
        <Before big v3={minutes(emit.v3n, zh)} v4={seconds(emit.v4, zh)} />
      ),
    },
    {
      label: zh ? '生成的源码' : 'Generated source',
      note: types(buildLarge.types),
      ratio: formatBuildRatio(source.ratio),
      unit: zh ? '更小' : 'smaller',
      body: <Before v3={source.v3} v4={source.v4} />,
    },
  ];
  if (generator)
    rows.push({
      label: zh ? '运行生成器' : 'Run the generator',
      note: types(330),
      ratio: formatBuildRatio(generator.ratio),
      unit: zh ? '更快' : 'faster',
      body: (
        <Before
          v3={seconds(generator.v3, zh)}
          v4={seconds(generator.v4, zh)}
        />
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
            <CountUp
              value={formatRatio(polySer.ratio)}
              className="mt-2 block bg-linear-to-r/oklab from-nino-grad-from to-nino-grad-to bg-clip-text pb-2 text-[5.5rem] leading-none font-extrabold tracking-tighter text-transparent sm:text-9xl"
            />
          </div>
          <div className="flex flex-col gap-4 lg:pb-4">
            <p className="max-w-md text-base leading-snug text-pretty sm:text-lg">
              {zh
                ? `${action('序列化', polySer, zh)}，Nino v4 用时 ${polySer.v4.text}，MemoryPack ${polySer.memorypack.text}。`
                : `${action('Serializing a', polySer, zh)}: ${polySer.v4.text} with Nino v4, ${polySer.memorypack.text} with MemoryPack.`}
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
            />
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-8">
        <Panel
          title={zh ? '对比 MemoryPack' : 'vs MemoryPack'}
          rows={memorypackRows(zh)}
          link={zh ? '全部基准测试' : 'All benchmarks'}
          href={`${docs}/perf`}
        />
        <Panel
          title={zh ? '对比 Nino v3' : 'vs Nino v3'}
          rows={v3Rows(zh)}
          link={zh ? 'v3 与 v4 对比' : 'v3 vs v4 in detail'}
          href={`${docs}/v3-vs-v4`}
        />
      </div>
    </div>
  );
}

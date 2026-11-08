import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useReveal } from '@/components/showcase';
import {
  bestReuse,
  build,
  buildLarge,
  formatBuildRatio,
  formatBytes,
  formatRatio,
  type RuntimeCase,
  runtime,
  sourceNote,
} from '@/lib/benchmarks';
import type { Locale } from '@/lib/i18n';

/*
 * The home page's numbers:
 *
 * 1. HomeBench, the hero's proof: Nino against MemoryPack in the cases where
 *    Nino wins most (serialize, deserialize, deserialize into pooled objects
 *    with the bytes each allocates), with the release it was measured on.
 * 2. HomeV3: what v4 changed against v3 3.3.13, in one row.
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

interface Row {
  label: string;
  note?: string;
  ratio: string;
  unit: string;
  body: ReactNode;
}

/* ------------------------------------------------------------------ */
/* Rows                                                                */
/* ------------------------------------------------------------------ */

function Before({ v3, v4 }: { v3: string; v4: string }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-lg tracking-tight tabular-nums">
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
      body: <Before v3={minutes(emit.v3n, zh)} v4={seconds(emit.v4, zh)} />,
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
        <Before v3={seconds(generator.v3, zh)} v4={seconds(generator.v4, zh)} />
      ),
    });
  return rows;
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

interface Versus {
  label: string;
  note?: string;
  ratio: number;
  nino: { value: number; text: string };
  other: { value: number; text: string };
}

/** The cases the hero shows: Nino's biggest wins, each from the synced report */
function benchCases(zh: boolean): Versus[] {
  const out: Versus[] = [];
  const timed = (row: RuntimeCase | undefined, verb: string) => {
    if (!row?.ratio) return;
    out.push({
      label: action(verb, row, zh),
      ratio: row.ratio,
      nino: { value: row.v4.ns, text: row.v4.text },
      other: { value: row.memorypack.ns, text: row.memorypack.text },
    });
  };
  timed(polySer ?? simple, zh ? '序列化' : 'Serialize');
  timed(polyDes, zh ? '反序列化' : 'Deserialize');
  if (leaves)
    out.push({
      label: zh ? '反序列化到池化对象' : 'Deserialize into pooled objects',
      note: zh ? '对比 MemoryPack 覆盖写入' : "vs MemoryPack's overwrite mode",
      ratio: leaves.memorypackOverwrite.ns / leaves.ninoReuse.ns,
      nino: { value: leaves.ninoReuse.ns, text: leaves.ninoReuse.text },
      other: {
        value: leaves.memorypackOverwrite.ns,
        text: leaves.memorypackOverwrite.text,
      },
    });
  return out;
}

/**
 * One bar per measure: the grey track is MemoryPack, the accent fill Nino, on
 * the same scale, so the fill is the share of MemoryPack's cost Nino pays
 * (empty when Nino allocates nothing).
 */
function Track({
  nino,
  other,
  label,
  caption,
}: {
  nino: { value: number; text: string };
  other: { value: number; text: string };
  label: string;
  /** Names the measure when a case has two bars (time, allocated) */
  caption?: string;
}) {
  const pct = other.value > 0 ? (nino.value / other.value) * 100 : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="img"
        aria-label={label}
        className="relative h-2.5 rounded-full bg-[var(--nino-chart-faint)]"
      >
        {pct > 0 && (
          <span
            className="nino-chart-bar absolute inset-y-0 left-0 rounded-full bg-fd-primary"
            style={{ width: `${Math.max(pct, 1.5)}%` }}
          />
        )}
      </div>
      <div className="flex justify-between gap-4 text-xs tabular-nums">
        <span className="font-medium">
          {caption && (
            <span className="font-normal text-fd-muted-foreground">
              {caption}{' '}
            </span>
          )}
          Nino v4 {nino.text}
        </span>
        <span className="text-fd-muted-foreground">
          MemoryPack {other.text}
        </span>
      </div>
    </div>
  );
}

/** The hero's proof: every number is in the prerendered HTML */
export function HomeBench({
  lang,
  docs,
  memoryPack,
}: {
  lang: Locale;
  docs: string;
  memoryPack: string;
}) {
  const zh = lang === 'zh';
  const [ref, shown] = useReveal<HTMLDivElement>();
  const rows = benchCases(zh);
  if (rows.length === 0) return null;
  const alloc =
    leaves &&
    leaves.ninoReuseBytes !== null &&
    leaves.memorypackOverwriteBytes !== null
      ? {
          nino: {
            value: leaves.ninoReuseBytes,
            text: formatBytes(leaves.ninoReuseBytes),
          },
          other: {
            value: leaves.memorypackOverwriteBytes,
            text: formatBytes(leaves.memorypackOverwriteBytes),
          },
        }
      : undefined;
  const time = (r: Versus) =>
    zh
      ? `耗时：Nino v4 ${r.nino.text}，MemoryPack ${r.other.text}`
      : `Time: Nino v4 ${r.nino.text}, MemoryPack ${r.other.text}`;
  return (
    <div
      ref={ref}
      data-hidden={shown ? undefined : ''}
      className="nino-chart flex w-full flex-col gap-6 text-left"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-semibold tracking-tight">
          {zh
            ? `实测：对比 MemoryPack ${memoryPack}`
            : `Measured against MemoryPack ${memoryPack}`}
        </h2>
        <p className="flex items-center gap-3 text-xs text-fd-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-fd-primary" />
            Nino v4
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[var(--nino-chart-faint)]" />
            MemoryPack
          </span>
        </p>
      </div>
      {rows.map((row, i) => (
        <div key={row.label} className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-4">
            <p className="flex flex-col">
              <span className="text-sm font-medium">{row.label}</span>
              {row.note && (
                <span className="text-xs text-fd-muted-foreground">
                  {row.note}
                </span>
              )}
            </p>
            <p className="shrink-0 text-sm text-fd-muted-foreground">
              <span className="text-2xl font-bold tracking-tight text-fd-primary tabular-nums">
                {formatRatio(row.ratio)}
              </span>{' '}
              {zh ? '更快' : 'faster'}
            </p>
          </div>
          <Track
            nino={row.nino}
            other={row.other}
            label={time(row)}
            caption={
              alloc && i === rows.length - 1
                ? zh
                  ? '耗时'
                  : 'Time'
                : undefined
            }
          />
          {alloc && i === rows.length - 1 && (
            <Track
              nino={alloc.nino}
              other={alloc.other}
              caption={zh ? '分配' : 'Allocated'}
              label={
                zh
                  ? `分配：Nino v4 ${alloc.nino.text}，MemoryPack ${alloc.other.text}`
                  : `Allocated: Nino v4 ${alloc.nino.text}, MemoryPack ${alloc.other.text}`
              }
            />
          )}
        </div>
      ))}
      <p className="text-xs text-fd-muted-foreground">
        {zh
          ? `BenchmarkDotNet，GitHub Actions runner（x64），${sourceNote(true)}`
          : `BenchmarkDotNet on a GitHub Actions runner (x64), ${sourceNote(false)}`}{' '}
        <Link
          to={`${docs}/benchmarks`}
          className="font-medium text-fd-primary underline-offset-4 hover:underline"
        >
          {zh ? '全部测试' : 'All benchmarks'}
        </Link>
      </p>
    </div>
  );
}

/** v4 against v3 3.3.13: build time and generated code, in one row */
export function HomeV3({ lang, docs }: { lang: Locale; docs: string }) {
  const zh = lang === 'zh';
  const rows = v3Rows(zh);
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {zh ? '相比 Nino v3' : 'Compared with Nino v3'}
        </h2>
        <Link
          to={`${docs}/whats-new#features`}
          className="text-sm font-medium text-fd-primary underline-offset-4 hover:underline"
        >
          {zh ? 'v4 相比 v3 的变化' : 'What changed since v3'}
        </Link>
      </div>
      <div className="mt-6 grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-2 sm:px-6 sm:first:pl-0 sm:last:pr-0"
          >
            <p className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight tabular-nums">
                {row.ratio}
              </span>
              <span className="text-sm text-fd-muted-foreground">
                {row.unit}
              </span>
            </p>
            <p className="text-sm font-medium">{row.label}</p>
            {row.body}
            {row.note && (
              <p className="text-xs text-fd-muted-foreground">{row.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { Gauge, Hammer, Leaf, Recycle } from 'lucide-react';
import { Link } from 'react-router';
import { CountUp, useReveal } from '@/components/showcase';
import {
  bestReuse,
  buildLarge,
  formatBytes,
  type ReuseCase,
  type RuntimeCase,
  runtime,
  serializeAllocatesNothing,
  sourceNote,
} from '@/lib/benchmarks';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

/*
 * Home page numbers: the four headline stats and the two compact comparisons
 * (vs MemoryPack, vs Nino v3). All values come from src/lib/benchmarks.ts.
 * Bars are drawn to scale against the slower side and grow in once when
 * scrolled into view (not with reduced motion); the prerendered HTML already
 * has their final widths.
 */

function find(op: 'serialize' | 'deserialize', name: string) {
  return runtime[op].find((r) => r.name === name);
}

/** The case where Nino beats MemoryPack by the most */
function best(op: 'serialize' | 'deserialize') {
  return runtime[op].reduce<RuntimeCase | undefined>(
    (top, row) => ((row.ratio ?? 0) > (top?.ratio ?? 0) ? row : top),
    undefined,
  );
}

const simple = find('serialize', 'SimpleClass');
const polySer = best('serialize');
const polyDes = best('deserialize');
const leaves: ReuseCase | undefined = bestReuse;
const reuseRatio = leaves
  ? leaves.memorypackOverwrite.ns / leaves.ninoReuse.ns
  : undefined;
const count = buildLarge.types.toLocaleString('en-US');

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

interface StatCell {
  icon: typeof Gauge;
  label: string;
  value: string;
  unit: string;
  context: string;
  href: string;
}

const label = (row: { name: string; zh?: string }, zh: boolean) =>
  zh && row.zh ? row.zh : row.name;

/** 0 GC only when the data shows it: Nino's best reuse case and every serialize case allocate 0 B */
const zeroGc = leaves?.ninoReuseBytes === 0 && serializeAllocatesNothing;

function stats(lang: Locale): StatCell[] {
  const zh = lang === 'zh';
  const cells: StatCell[] = [];
  if (polySer?.ratio)
    cells.push({
      icon: Gauge,
      label: zh ? '序列化，对比 MemoryPack' : 'Serialize vs MemoryPack',
      value: polySer.ratio.toFixed(1),
      unit: zh ? '倍' : '× faster',
      context: zh
        ? `${label(polySer, zh)}：${polySer.v4.text} 对比 ${polySer.memorypack.text}`
        : `${label(polySer, zh)}: ${polySer.v4.text} vs ${polySer.memorypack.text}`,
      href: 'vs-memorypack',
    });
  if (leaves && reuseRatio)
    cells.push({
      icon: Recycle,
      label: zh ? '复用池化对象反序列化' : 'Deserialize into pooled objects',
      value: reuseRatio.toFixed(1),
      unit: zh ? '倍' : '× faster',
      context: zh
        ? `对比 MemoryPack 覆盖写入：${leaves.ninoReuse.text} 对比 ${leaves.memorypackOverwrite.text}`
        : `vs MemoryPack's overwrite: ${leaves.ninoReuse.text} vs ${leaves.memorypackOverwrite.text}`,
      href: 'whats-new#deserialize-into-existing-objects',
    });
  if (zeroGc)
    cells.push({
      icon: Leaf,
      label: zh ? '内存分配' : 'Allocations',
      value: '0',
      unit: 'GC',
      context: zh
        ? '序列化、复用池化对象反序列化零 GC'
        : 'serialize and deserialize into pooled objects',
      href: 'pooling',
    });
  cells.push({
    icon: Hammer,
    label: zh ? '构建，对比 Nino v3' : 'Build vs Nino v3',
    value: String(buildLarge.emit.ratio),
    unit: zh ? '倍' : '× faster',
    context: zh
      ? `${count} 个类型：${buildLarge.emit.v3} → ${buildLarge.emit.v4}`
      : `${count} types: ${buildLarge.emit.v3} → ${buildLarge.emit.v4}`,
    href: 'v3-vs-v4',
  });
  return cells;
}

export function HomeStats({ lang, docs }: { lang: Locale; docs: string }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
      {stats(lang).map((s) => (
        <li key={s.label}>
          <Link to={`${docs}/${s.href}`} className="group flex h-full flex-col">
            <span className="flex min-h-10 items-center gap-2.5">
              <span className="shrink-0 rounded-md bg-fd-primary/10 p-2 text-fd-primary">
                <s.icon className="size-4" />
              </span>
              <span className="text-sm leading-snug font-semibold">
                {s.label}
              </span>
            </span>
            <span className="mt-4 flex items-baseline gap-1">
              <CountUp
                value={s.value}
                className="text-4xl leading-none font-bold tracking-tighter text-fd-primary sm:text-5xl"
              />
              <span className="text-sm font-semibold sm:text-base">
                {s.unit}
              </span>
            </span>
            <span className="mt-2 text-sm leading-snug text-fd-muted-foreground group-hover:text-fd-foreground">
              {s.context}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Comparisons                                                         */
/* ------------------------------------------------------------------ */

interface Row {
  label: string;
  note?: string;
  ratio: string;
  unit: string;
  nino: { text: string; value: number };
  other: { text: string; value: number };
}

function runtimeRow(
  row: RuntimeCase | undefined,
  zh: boolean,
  verb: string,
): Row[] {
  if (!row?.ratio) return [];
  return [
    {
      label: `${verb} ${zh || row.code ? label(row, zh) : row.name.charAt(0).toLowerCase() + row.name.slice(1)}`,
      ratio: row.ratio.toFixed(2),
      unit: zh ? '倍' : '× faster',
      nino: { text: row.v4.text, value: row.v4.ns },
      other: { text: row.memorypack.text, value: row.memorypack.ns },
    },
  ];
}

function comparisons(lang: Locale) {
  const zh = lang === 'zh';
  const ser = zh ? '序列化' : 'Serialize';
  const des = zh ? '反序列化' : 'Deserialize';
  const memorypack: Row[] = [
    ...runtimeRow(simple, zh, ser),
    ...(polySer !== simple ? runtimeRow(polySer, zh, ser) : []),
    ...runtimeRow(polyDes, zh, des),
  ];
  if (leaves && reuseRatio)
    memorypack.push({
      label: zh ? '反序列化到池化对象' : 'Deserialize into pooled objects',
      note: zh
        ? `分配 ${formatBytes(leaves.ninoReuseBytes)} 对比 ${formatBytes(leaves.memorypackOverwriteBytes)}`
        : `${formatBytes(leaves.ninoReuseBytes)} vs ${formatBytes(leaves.memorypackOverwriteBytes)} allocated`,
      ratio: reuseRatio.toFixed(2),
      unit: zh ? '倍' : '× faster',
      nino: { text: leaves.ninoReuse.text, value: leaves.ninoReuse.ns },
      other: {
        text: leaves.memorypackOverwrite.text,
        value: leaves.memorypackOverwrite.ns,
      },
    });

  const { emit, source } = buildLarge;
  const v3: Row[] = [
    {
      label: zh ? '编译生成的代码' : 'Compile the generated code',
      note: zh ? `${count} 个类型` : `${count} types`,
      ratio: String(emit.ratio),
      unit: zh ? '倍' : '× faster',
      nino: { text: emit.v4, value: emit.v4n },
      other: { text: emit.v3, value: emit.v3n },
    },
    {
      label: zh ? '生成的源码' : 'Generated source',
      note: zh ? `${count} 个类型` : `${count} types`,
      ratio: String(source.ratio),
      unit: zh ? '倍更小' : '× smaller',
      nino: { text: source.v4, value: source.v4n },
      other: { text: source.v3, value: source.v3n },
    },
  ];
  // Runtime against v3 only once V3_RUNTIME has a direct measurement.
  if (simple?.v3 && simple.vsV3)
    v3.push({
      label: zh ? '序列化 SimpleClass' : 'Serialize SimpleClass',
      ratio: simple.vsV3.toFixed(2),
      unit: zh ? '倍' : '× faster',
      nino: { text: simple.v4.text, value: simple.v4.ns },
      other: { text: simple.v3.text, value: simple.v3.ns },
    });
  return { memorypack, v3 };
}

function Bar({
  value,
  max,
  nino,
  text,
}: {
  value: number;
  max: number;
  nino?: boolean;
  text: string;
}) {
  // A floor of 1% keeps a 0.3% sliver (2.2 s of 636 s) visible.
  const pct = Math.max((value / max) * 100, 1);
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2 flex-1">
        <div
          className={cn(
            'nino-chart-bar absolute inset-y-0 left-0 rounded-full',
            nino ? 'bg-fd-primary' : 'bg-[var(--nino-chart-other)]',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={cn(
          'w-16 shrink-0 text-right text-xs tabular-nums',
          nino ? 'font-medium text-fd-foreground' : 'text-fd-muted-foreground',
        )}
      >
        {text}
      </span>
    </div>
  );
}

function Panel({
  title,
  other,
  rows,
  link,
  href,
}: {
  title: string;
  other: string;
  rows: Row[];
  link: string;
  href: string;
}) {
  const [ref, shown] = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="nino-chart flex flex-col"
      data-hidden={shown ? undefined : ''}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="flex items-center gap-3 text-xs text-fd-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-fd-primary" />
            Nino v4
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[var(--nino-chart-other)]" />
            {other}
          </span>
        </p>
      </div>
      <ul className="mt-5 flex flex-1 flex-col divide-y">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-4 py-4"
          >
            <p className="flex flex-col">
              <span className="text-3xl leading-none font-bold tracking-tighter text-fd-primary tabular-nums">
                {row.ratio}
                <span className="text-xl">
                  {row.unit.startsWith('×') ? '×' : ''}
                </span>
              </span>
              <span className="mt-1 text-xs text-fd-muted-foreground">
                {row.unit.startsWith('×') ? row.unit.slice(2) : row.unit}
              </span>
            </p>
            <div className="flex flex-col gap-1.5">
              <p className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm leading-tight">
                <span>{row.label}</span>
                {row.note && (
                  <span className="text-xs text-fd-muted-foreground">
                    {row.note}
                  </span>
                )}
              </p>
              <Bar
                nino
                value={row.nino.value}
                max={row.other.value}
                text={row.nino.text}
              />
              <Bar
                value={row.other.value}
                max={row.other.value}
                text={row.other.text}
              />
            </div>
          </li>
        ))}
      </ul>
      <Link
        to={href}
        className="mt-2 text-sm font-medium text-fd-primary hover:underline"
      >
        {link}
      </Link>
    </div>
  );
}

export function HomeCompare({ lang, docs }: { lang: Locale; docs: string }) {
  const zh = lang === 'zh';
  const data = comparisons(lang);
  const link = zh ? '全部基准测试 →' : 'All benchmarks →';
  return (
    <>
      <div className="grid gap-12 lg:grid-cols-2">
        <Panel
          title={zh ? '对比 MemoryPack' : 'vs MemoryPack'}
          other="MemoryPack"
          rows={data.memorypack}
          link={link}
          href={`${docs}/perf`}
        />
        <Panel
          title={zh ? '对比 Nino v3' : 'vs Nino v3'}
          other="Nino v3"
          rows={data.v3}
          link={link}
          href={`${docs}/perf`}
        />
      </div>
      <p className="mt-8 text-xs text-fd-muted-foreground">{sourceNote(zh)}</p>
    </>
  );
}

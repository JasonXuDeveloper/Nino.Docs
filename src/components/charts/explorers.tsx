/**
 * Interactive charts of the runtime and Unity benchmarks (the tables under
 * them hold every number): pick a language, a measure and a Unity version, and
 * read the bars against one baseline.
 *
 * - RuntimesChart: per case, every serializer's time (or size) as a multiple
 *   of Nino's generated code, so Nino is 1× and a longer bar costs more.
 * - UnityChart: per case, the time with Burst as a share of the time without
 *   it (100 %), with the speedup beside the case.
 *
 * - DotnetChart: one group of dotnetGroups, each case's MemoryPack, other
 *   libraries (otherLibs) and v3 as multiples of Nino v4's time, per
 *   architecture and operation.
 *
 * The default selection is prerendered; the rest is drawn after a click.
 */
import { useState } from 'react';
import { Segmented } from '@/components/showcase';
import {
  type Arch,
  archLabels,
  type DotnetGroupId,
  datasets,
  dotnetGroups,
  FLOOR_NS,
  formatRatio,
  formatTime,
  gcNote,
  hasV3,
  isOnPar,
  type Opponent as Library,
  otherLibs,
  type RuntimeLang,
  runtimes,
  sourceNote,
  type TableCase,
  unity,
  type Versus,
  v3SourceNote,
  versusOf,
} from '@/lib/benchmarks';
import type { Locale } from '@/lib/i18n';
import { BarChart, type ChartRow, type ChartSeries } from './bar-chart';

const languageNames: Record<RuntimeLang, string> = {
  go: 'Go',
  rust: 'Rust',
  typescript: 'TypeScript',
};

/** Nino first, then greys from dark to light */
const otherColors = [
  'var(--nino-chart-other-strong)',
  'var(--nino-chart-other)',
  'color-mix(in oklab, var(--nino-chart-other) 70%, var(--nino-chart-faint))',
  'var(--nino-chart-faint)',
  'color-mix(in oklab, var(--nino-chart-faint) 60%, transparent)',
  'color-mix(in oklab, var(--nino-chart-faint) 35%, transparent)',
];

/** Bars past this many times Nino's are cut at the edge; their labels give the value */
const RELATIVE_CAP = 10;

type Measure = 'serialize' | 'serializeInto' | 'deserialize' | 'size';

const measureNames: Record<Measure, { en: string; zh: string }> = {
  serialize: { en: 'Serialize', zh: '序列化' },
  serializeInto: { en: 'Serialize into a buffer', zh: '序列化到缓冲区' },
  deserialize: { en: 'Deserialize', zh: '反序列化' },
  size: { en: 'Size', zh: '大小' },
};

const formatSize = (bytes: number) =>
  bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KiB` : `${bytes} B`;

export function RuntimesChart({
  lang = 'en',
  only,
}: {
  lang?: Locale;
  /** One language only (its codegen page): no language switch */
  only?: RuntimeLang;
}) {
  const zh = lang === 'zh';
  const [picked, setLanguage] = useState<RuntimeLang>(
    runtimes[0]?.lang ?? 'go',
  );
  const language = only ?? picked;
  const [measure, setMeasure] = useState<Measure>('serialize');
  const table = runtimes.find((t) => t.lang === language);
  if (!table) return null;
  const raw = table.rows;
  const measures = (Object.keys(measureNames) as Measure[]).filter((m) =>
    raw.some((row) => row.operation === m),
  );
  const current = measures.includes(measure) ? measure : 'serialize';
  const ninoKey = table.columns.find(
    (c) => c.nino && c.key.toLowerCase() === 'nino',
  )?.key;
  if (!ninoKey) return null;
  const series: ChartSeries[] = table.columns.map((column, i) => ({
    key: column.key,
    label: column.label,
    color:
      column.key === ninoKey
        ? 'var(--nino-chart-v4)'
        : column.nino
          ? 'var(--nino-chart-v4-soft)'
          : otherColors[Math.min(i - 1, otherColors.length - 1)],
  }));
  const rows: ChartRow[] = raw
    .filter((row) => row.operation === current)
    .flatMap((row) => {
      const nino = row.cells[ninoKey]?.value;
      if (!nino) return [];
      const values: Record<string, number | undefined> = {};
      const text: Record<string, string> = {};
      for (const column of table.columns) {
        const value = row.cells[column.key]?.value;
        if (value === undefined) continue;
        const relative = value / nino;
        values[column.key] = relative;
        const shown =
          current === 'size' ? formatSize(value) : formatTime(value);
        text[column.key] =
          column.key === ninoKey
            ? shown
            : `${shown} · ${formatRatio(relative)}`;
      }
      return [{ label: row.case, code: true, values, text }];
    });
  const sizeAxis = zh
    ? '编码后的大小，Nino 为 1×（越短越小）'
    : "Encoded size, Nino's = 1× (shorter is smaller)";
  const timeAxis = zh
    ? '耗时，Nino 为 1×（越短越快）'
    : "Time, Nino's = 1× (shorter is faster)";
  return (
    <div className="not-prose my-6">
      <div className="-mb-6 flex flex-wrap gap-x-3">
        {!only && (
          <Segmented
            options={runtimes.map((t) => ({
              value: t.lang,
              label: languageNames[t.lang],
            }))}
            value={language}
            onChange={setLanguage}
          />
        )}
        <Segmented
          options={measures.map((m) => ({
            value: m,
            label: measureNames[m][zh ? 'zh' : 'en'],
          }))}
          value={current}
          onChange={setMeasure}
        />
      </div>
      <BarChart
        title={`${languageNames[language]}: ${measureNames[current][zh ? 'zh' : 'en']}`}
        subtitle={
          zh
            ? `每个序列化库的${current === 'size' ? '大小' : '耗时'}是 Nino 生成代码的几倍；超过 ${RELATIVE_CAP}× 的条在边缘截断，数值见标签。Nino ${table.tag}${table.environment ? `，${table.environment}` : ''}。`
            : `Each serializer's ${current === 'size' ? 'size' : 'time'} as a multiple of Nino's generated code; bars past ${RELATIVE_CAP}× stop at the edge, the label gives the value. Nino ${table.tag}${table.environment ? `, ${table.environment}` : ''}.`
        }
        series={series}
        rows={rows}
        axisLabel={current === 'size' ? sizeAxis : timeAxis}
        tickFormat={(value) => `${value}×`}
        max={Math.min(
          RELATIVE_CAP,
          Math.max(
            1,
            ...rows.flatMap((r) => Object.values(r.values).map((v) => v ?? 0)),
          ),
        )}
      />
    </div>
  );
}

type UnityGroup = 'arrays' | 'strings' | 'classes';

const groupNames: Record<UnityGroup, { en: string; zh: string }> = {
  arrays: { en: 'Struct arrays', zh: '结构体数组' },
  strings: { en: 'Strings', zh: '字符串' },
  classes: { en: 'Classes', zh: '类' },
};

function unityGroup(name: string): UnityGroup {
  if (/string/i.test(name)) return 'strings';
  if (/SimpleClass/.test(name)) return 'classes';
  return 'arrays';
}

export function UnityChart({ lang = 'en' }: { lang?: Locale }) {
  const zh = lang === 'zh';
  const [version, setVersion] = useState(unity.at(-1)?.unity ?? '');
  const [operation, setOperation] = useState('Serialize');
  const [group, setGroup] = useState<UnityGroup>('arrays');
  const table = unity.find((v) => v.unity === version);
  if (!table) return null;
  const without = zh ? '不用 Burst' : 'Without Burst';
  const withBurst = zh ? '使用 Burst' : 'With Burst';
  const series: ChartSeries[] = [
    { key: 'without', label: without, color: 'var(--nino-chart-other)' },
    { key: 'with', label: withBurst, color: 'var(--nino-chart-v4)' },
  ];
  const rows: ChartRow[] = table.rows
    .filter(
      (row) =>
        row.operation.toLowerCase() === operation.toLowerCase() &&
        unityGroup(row.case) === group,
    )
    .map((row) => {
      const share = row.with.ns / row.without.ns;
      const badge = row.tooFast
        ? {
            text: zh ? '更快（快到测不出）' : 'faster (too fast to measure)',
            tone: 'win' as const,
          }
        : row.speedup === undefined
          ? { text: zh ? '持平' : 'on par', tone: 'par' as const }
          : row.speedup > 1
            ? {
                text: zh
                  ? `快 ${formatRatio(row.speedup)}`
                  : `${formatRatio(row.speedup)} faster`,
                tone: 'win' as const,
              }
            : {
                text: zh
                  ? `${formatRatio(row.speedup)}（不用 Burst 更快）`
                  : `${formatRatio(row.speedup)} (faster without)`,
                tone: 'loss' as const,
              };
      return {
        label: row.case,
        code: true,
        values: { without: 1, with: share },
        text: { without: row.without.text, with: row.with.text },
        badge,
      };
    });
  return (
    <div className="not-prose my-6">
      <div className="-mb-6 flex flex-wrap gap-x-3">
        {unity.length > 1 && (
          <Segmented
            options={unity.map((v) => ({
              value: v.unity,
              label: `Unity ${v.unity}`,
            }))}
            value={version}
            onChange={setVersion}
          />
        )}
        <Segmented
          options={['Serialize', 'Deserialize'].map((op) => ({
            value: op,
            label: measureNames[op.toLowerCase() as Measure][zh ? 'zh' : 'en'],
          }))}
          value={operation}
          onChange={setOperation}
        />
        <Segmented
          options={(Object.keys(groupNames) as UnityGroup[]).map((g) => ({
            value: g,
            label: groupNames[g][zh ? 'zh' : 'en'],
          }))}
          value={group}
          onChange={setGroup}
        />
      </div>
      <BarChart
        title={`Unity ${version}: ${measureNames[operation.toLowerCase() as Measure][zh ? 'zh' : 'en']}${zh ? '，' : ', '}${groupNames[group][zh ? 'zh' : 'en']}`}
        subtitle={
          zh
            ? '使用 Burst 内核后的耗时占不用 Burst 时的比例：灰条是 100%，蓝条越短，Burst 省下的时间越多。IL2CPP 播放器，GitHub 托管的 Linux x64 runner。'
            : "The time with Unity's Burst kernels as a share of the time without them: the grey bar is 100 %, and the shorter the accent bar, the more Burst saves. IL2CPP player on a GitHub-hosted Linux x64 runner."
        }
        series={series}
        rows={rows}
        axisLabel={
          zh ? '耗时，不用 Burst 为 100%' : 'Time, without Burst = 100 %'
        }
        tickFormat={(value) => `${Math.round(value * 100)}%`}
        max={Math.max(1, ...rows.map((r) => r.values.with ?? 0))}
      />
    </div>
  );
}

type Opponent = 'all' | Library | 'v3';

/** Every opponent in legend order: v3 (the upgrade), MemoryPack, the other libraries */
const opponentKeys: Exclude<Opponent, 'all'>[] = [
  'v3',
  'memorypack',
  ...otherLibs.map((lib) => lib.key),
];

const opponentNames: Record<Opponent, { en: string; zh: string }> = {
  all: { en: 'All', zh: '全部' },
  memorypack: { en: 'MemoryPack', zh: 'MemoryPack' },
  ...(Object.fromEntries(
    otherLibs.map((lib) => [lib.key, { en: lib.label, zh: lib.label }]),
  ) as Record<Exclude<Library, 'memorypack'>, { en: string; zh: string }>),
  v3: { en: 'Nino v3 (3.3.13)', zh: 'Nino v3（3.3.13）' },
};

/** Greys from dark to light, in opponentKeys order */
const opponentColor = (key: Exclude<Opponent, 'all'>) =>
  otherColors[Math.min(opponentKeys.indexOf(key), otherColors.length - 1)];

/** One opponent's time in a case, by the same rule as the tables */
function opponentOf(row: TableCase, key: Exclude<Opponent, 'all'>) {
  if (key === 'v3')
    return row.v3
      ? ({
          time: row.v3,
          // within 5% is on par, as every other comparison (versus())
          ratio:
            row.vsV3 !== undefined && isOnPar(row.vsV3) ? undefined : row.vsV3,
          tooFast: row.v3TooFast,
        } satisfies Versus)
      : undefined;
  return versusOf(row, key);
}

function versusText(v: Versus, zh: boolean) {
  if (v.tooFast) return zh ? 'Nino 快到测不出' : 'Nino too fast to measure';
  if (v.ratio === undefined) return zh ? '持平' : 'on par';
  return formatRatio(v.ratio);
}

/** Nino ahead, on par or too fast: a badge; the other ahead: none (the times show it) */
function versusBadge(v: Versus, zh: boolean) {
  if (v.tooFast)
    return {
      text: zh ? '更快（快到测不出）' : 'faster (too fast to measure)',
      tone: 'win' as const,
    };
  if (v.ratio === undefined)
    return { text: zh ? '持平' : 'on par', tone: 'par' as const };
  if (v.ratio < 1) return undefined;
  return {
    text: zh ? `快 ${formatRatio(v.ratio)}` : `${formatRatio(v.ratio)} faster`,
    tone: 'win' as const,
  };
}

type Op = 'serialize' | 'deserialize';

/**
 * One group of dotnetGroups (src/lib/benchmarks.ts): each case's time of
 * every library and v3 as a multiple of Nino v4's, per architecture and
 * operation. v3 3.3.13 (x64 only) shows "n/a" in a case it has no port of.
 */
export function DotnetChart({
  lang = 'en',
  group,
}: {
  lang?: Locale;
  group: DotnetGroupId;
}) {
  const zh = lang === 'zh';
  const t = (names: { en: string; zh: string }) => (zh ? names.zh : names.en);
  const [arch, setArch] = useState<Arch>('x64');
  const [pickedOp, setOp] = useState<Op>('serialize');
  const [pickedOpponent, setOpponent] = useState<Opponent>('all');
  const ds = datasets.find((d) => d.arch === arch) ?? datasets[0];
  const sets = ds.groups[group];
  const ops = (['serialize', 'deserialize'] as Op[]).filter(
    (o) => sets[o].length > 0,
  );
  const op = ops.includes(pickedOp) ? pickedOp : ops[0];
  const cases = op ? sets[op] : [];
  // v3 ran on x64 only: there it is a series wherever the site has v3 numbers, n/a in the cases without
  const v3Shown = ds.arch === 'x64' && hasV3;
  const keys = opponentKeys.filter((key) =>
    key === 'v3' ? v3Shown : cases.some((row) => opponentOf(row, key)),
  );
  const opponent: Opponent =
    pickedOpponent !== 'all' && keys.includes(pickedOpponent)
      ? pickedOpponent
      : 'all';
  const shown = opponent === 'all' ? keys : [opponent];
  const series: ChartSeries[] = [
    { key: 'v4', label: 'Nino v4', color: 'var(--nino-chart-v4)' },
    ...shown.map((key) => ({
      key,
      label: t(opponentNames[key]),
      color: opponentColor(key),
    })),
  ];
  const rows: ChartRow[] = cases.flatMap((row) => {
    const base = Math.max(row.v4.ns, FLOOR_NS);
    const values: Record<string, number | undefined> = { v4: 1 };
    const text: Record<string, string> = { v4: row.v4.text };
    for (const key of shown) {
      const v = opponentOf(row, key);
      if (v) {
        values[key] = v.time.ns / base;
        text[key] = `${v.time.text} · ${versusText(v, zh)}`;
      } else if (key === 'v3') {
        // no bar, a label: 3.3.13 has no port of this case
        values[key] = 0;
        text[key] = 'n/a';
      }
    }
    const single = opponent === 'all' ? undefined : opponentOf(row, opponent);
    if (opponent !== 'all' && !single) return [];
    return [
      {
        label: zh && row.zh ? row.zh : row.name,
        code: row.code,
        mark: row.gcBound ? '†' : undefined,
        values,
        text,
        badge: single ? versusBadge(single, zh) : undefined,
      },
    ];
  });
  if (!op) return null;
  const largest = Math.max(
    1,
    ...rows.flatMap((r) => Object.values(r.values).map((v) => v ?? 0)),
  );
  const footnotes = [
    sourceNote(zh, ds, datasets.length > 1),
    shown.includes('v3') ? v3SourceNote(zh) : null,
    rows.some((r) => r.mark) ? t(gcNote) : null,
  ].filter((note): note is string => Boolean(note));
  const opName =
    op === 'serialize' ? t(measureNames.serialize) : t(deserializeNew);
  const groupName = dotnetGroups.find((g) => g.id === group);
  return (
    <div className="not-prose my-6">
      <div className="-mb-6 flex flex-wrap gap-x-3">
        {datasets.length > 1 && (
          <Segmented
            options={datasets.map((d) => ({
              value: d.arch,
              label: archLabels[d.arch],
            }))}
            value={ds.arch}
            onChange={setArch}
          />
        )}
        {ops.length > 1 && (
          <Segmented
            options={ops.map((o) => ({
              value: o,
              label:
                o === 'serialize'
                  ? t(measureNames.serialize)
                  : t(deserializeNew),
            }))}
            value={op}
            onChange={setOp}
          />
        )}
        <Segmented
          options={(['all', ...keys] as Opponent[]).map((key) => ({
            value: key,
            label: t(opponentNames[key]),
          }))}
          value={opponent}
          onChange={setOpponent}
        />
      </div>
      <BarChart
        title={
          zh
            ? `${groupName?.zh}，${opName}：Nino v4 对比${opponent === 'all' ? '其他序列化库' : ` ${t(opponentNames[opponent])}`}`
            : `${groupName?.name}, ${opName.toLowerCase()}: Nino v4 vs ${opponent === 'all' ? 'other serializers' : t(opponentNames[opponent])}`
        }
        subtitle={
          zh
            ? `每个库的耗时是 Nino v4 的几倍，越短越快；标签是实测耗时和倍数，超过 ${RELATIVE_CAP}× 的条在边缘截断。条缺失表示这个库表达不了该用例，v3 标 n/a 表示 3.3.13 没有这个用例。`
            : `Each serializer's time as a multiple of Nino v4's, shorter is faster; labels give the measured time and the multiple, and bars past ${RELATIVE_CAP}× stop at the edge. A missing bar is a case that library cannot express; v3 n/a, a case 3.3.13 has no port of.`
        }
        series={series}
        rows={rows}
        axisLabel={
          zh
            ? '耗时，Nino v4 为 1×（越短越快）'
            : "Time, Nino v4's = 1× (shorter is faster)"
        }
        tickFormat={(value) => `${value}×`}
        max={Math.min(RELATIVE_CAP, largest)}
        footnotes={footnotes}
      />
    </div>
  );
}

const deserializeNew = {
  en: 'Deserialize (new instances)',
  zh: '反序列化（新实例）',
};

export default { RuntimesChart, UnityChart, DotnetChart };

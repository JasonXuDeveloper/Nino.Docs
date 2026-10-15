/**
 * The benchmark charts, built from src/lib/benchmarks.ts. Loaded lazily by
 * ./index.tsx so visx is only downloaded on pages that show a chart.
 */
import { useState } from 'react';
import { Segmented } from '@/components/showcase';
import {
  build,
  formatBytes,
  payload,
  type RuntimeCase,
  reuse,
  reuseSpeedup,
  runtime,
} from '@/lib/benchmarks';
import type { Locale } from '@/lib/i18n';
import { BarChart, type BarChartProps, type ChartSeries } from './bar-chart';

export type ChartId =
  | 'serialize'
  | 'deserialize'
  | 'reuse'
  | 'v3-serialize'
  | 'v3-deserialize'
  | 'compile'
  | 'allocation'
  | 'payload';

const ratioText = (value: number) => value.toFixed(2);
const rel = (value: number) => (value === 0 ? '0' : value.toFixed(1));

function caseLabel(row: { name: string; zh?: string }, zh: boolean) {
  return zh && row.zh ? row.zh : row.name;
}

function seriesFor(zh: boolean) {
  return {
    v4: { key: 'v4', label: 'Nino v4', color: 'var(--nino-chart-v4)' },
    mp: { key: 'mp', label: 'MemoryPack', color: 'var(--nino-chart-other)' },
    v3: {
      key: 'v3',
      label: zh ? 'Nino v3（3.3.13，推算）' : 'Nino v3 (3.3.13, derived)',
      color: 'var(--nino-chart-faint)',
    },
    ninoNew: {
      key: 'ninoNew',
      label: zh ? 'Nino 新建' : 'Nino, new',
      color: 'var(--nino-chart-v4-soft)',
    },
    mpNew: {
      key: 'mpNew',
      label: zh ? 'MemoryPack 新建' : 'MemoryPack, new',
      color: 'var(--nino-chart-faint)',
    },
    ninoReuse: {
      key: 'ninoReuse',
      label: zh ? 'Nino 复用（池化）' : 'Nino reusing (pooled)',
      color: 'var(--nino-chart-v4)',
    },
    mpOverwrite: {
      key: 'mpOverwrite',
      label: zh ? 'MemoryPack 覆盖' : 'MemoryPack overwrite',
      color: 'var(--nino-chart-other-strong)',
    },
  } satisfies Record<string, ChartSeries>;
}

const gcNote = {
  en: '† Vector4[10000] allocates a 160 KB array on the large object heap per call, so it mostly measures gen-2 garbage collections: two runs gave 0.96× and 0.85× with ±15% error. The copy itself is one memcpy in both.',
  zh: '† Vector4[10000] 每次调用都在大对象堆上分配 160 KB 的数组，因此主要测量的是第 2 代垃圾回收：两次运行分别为 0.96 倍和 0.85 倍，误差 ±15%。拷贝本身在两个库中都是一次 memcpy。',
};

function mpBadge(row: RuntimeCase, zh: boolean) {
  if (row.ratio === undefined)
    return { text: zh ? '持平' : 'on par', tone: 'par' as const };
  const r = ratioText(row.ratio);
  if (row.ratio >= 1)
    return { text: zh ? `快 ${r} 倍` : `${r}× faster`, tone: 'win' as const };
  return {
    text: zh ? `${r} 倍：MemoryPack 更快` : `${r}×: MemoryPack faster`,
    tone: 'loss' as const,
  };
}

function memoryPackChart(
  op: 'serialize' | 'deserialize',
  zh: boolean,
): BarChartProps {
  const s = seriesFor(zh);
  const rows = runtime[op];
  const hasGc = rows.some((row) => row.gcBound);
  return {
    title: zh
      ? `${op === 'serialize' ? '序列化' : '反序列化（新实例）'}：Nino v4 对比 MemoryPack 1.21.4`
      : `${op === 'serialize' ? 'Serialize' : 'Deserialize (new instances)'}: Nino v4 vs MemoryPack 1.21.4`,
    subtitle: zh
      ? '条形为相对 MemoryPack 的耗时（MemoryPack = 1.0），越短越快；数字为实测耗时。'
      : 'Bars show time relative to MemoryPack (MemoryPack = 1.0), shorter is faster; labels are measured times.',
    series: [s.v4, s.mp],
    rows: rows.map((row) => ({
      label: caseLabel(row, zh),
      code: row.code,
      mark: row.gcBound ? '†' : undefined,
      values: { v4: row.v4.ns / row.memorypack.ns, mp: 1 },
      text: { v4: row.v4.text, mp: row.memorypack.text },
      badge: mpBadge(row, zh),
    })),
    axisLabel: zh
      ? '相对耗时（MemoryPack = 1.0）'
      : 'Relative time (MemoryPack = 1.0)',
    tickFormat: rel,
    footnotes: hasGc ? [zh ? gcNote.zh : gcNote.en] : undefined,
    table: {
      caption: zh ? '数据表' : 'Data table',
      head: zh
        ? ['用例', 'Nino v4', 'MemoryPack', 'v4 对比 MemoryPack']
        : ['Case', 'Nino v4', 'MemoryPack', 'v4 vs MemoryPack'],
      rows: rows.map((row) => [
        caseLabel(row, zh),
        row.v4.text,
        row.memorypack.text,
        mpBadge(row, zh).text,
      ]),
    },
  };
}

function reuseChart(zh: boolean): BarChartProps {
  const s = seriesFor(zh);
  return {
    title: zh
      ? '反序列化到已有对象：Nino 复用 对比 MemoryPack 覆盖'
      : 'Deserialize into existing objects: Nino reusing vs MemoryPack overwrite',
    subtitle: zh
      ? 'Nino 用 ref 反序列化到已有对象图，新实例取自 [NinoPooled] 对象池；MemoryPack 使用覆盖模式。条形为相对 MemoryPack 新建实例的耗时，数字为实测耗时与每次调用分配的内存。'
      : 'Nino deserializes by ref into the existing graph and takes new instances from [NinoPooled] pools; MemoryPack uses its overwrite mode. Bars show time relative to MemoryPack with new instances; labels are measured times and bytes allocated per call.',
    series: [s.ninoNew, s.mpNew, s.ninoReuse, s.mpOverwrite],
    rows: reuse.map((row) => {
      const base = row.memorypackNew.ns;
      const speedup = reuseSpeedup(row).toFixed(1);
      return {
        label: caseLabel(row, zh),
        values: {
          ninoNew: row.ninoNew.ns / base,
          mpNew: 1,
          ninoReuse: row.ninoReuse.ns / base,
          mpOverwrite: row.memorypackOverwrite.ns / base,
        },
        text: {
          ninoNew: row.ninoNew.text,
          mpNew: row.memorypackNew.text,
          ninoReuse: `${row.ninoReuse.text} · ${formatBytes(row.ninoReuseBytes)}`,
          mpOverwrite: `${row.memorypackOverwrite.text} · ${formatBytes(row.memorypackOverwriteBytes)}`,
        },
        badge: {
          text: zh
            ? `比覆盖模式快 ${speedup} 倍`
            : `${speedup}× faster than overwrite`,
          tone: 'win' as const,
        },
      };
    }),
    axisLabel: zh
      ? '相对耗时（MemoryPack 新建 = 1.0）'
      : 'Relative time (MemoryPack, new instances = 1.0)',
    tickFormat: rel,
    table: {
      caption: zh ? '数据表' : 'Data table',
      head: zh
        ? [
            '用例',
            'Nino 新建',
            'Nino 复用',
            'MemoryPack 新建',
            'MemoryPack 覆盖',
          ]
        : [
            'Case',
            'Nino new',
            'Nino reusing',
            'MemoryPack new',
            'MemoryPack overwrite',
          ],
      rows: reuse.map((row) => [
        caseLabel(row, zh),
        row.ninoNew.text,
        `${row.ninoReuse.text} (${formatBytes(row.ninoReuseBytes)})`,
        row.memorypackNew.text,
        `${row.memorypackOverwrite.text} (${formatBytes(row.memorypackOverwriteBytes)})`,
      ]),
    },
  };
}

function v3Badge(vsV3: number, zh: boolean) {
  if (vsV3 === 1)
    return { text: zh ? '与 v3 持平' : 'on par with v3', tone: 'par' as const };
  const r = ratioText(vsV3);
  if (vsV3 > 1)
    return {
      text: zh ? `比 v3 快 ${r} 倍` : `${r}× faster than v3`,
      tone: 'win' as const,
    };
  return {
    text: zh ? `${r} 倍：v3 更快` : `${r}×: v3 faster`,
    tone: 'loss' as const,
  };
}

function v3Chart(op: 'serialize' | 'deserialize', zh: boolean): BarChartProps {
  const s = seriesFor(zh);
  const rows = runtime[op].filter((row) => row.vsV3 !== undefined);
  const hasGc = rows.some((row) => row.gcBound);
  return {
    title: zh
      ? `${op === 'serialize' ? '序列化' : '反序列化'}：Nino v4 对比 v3（3.3.13）`
      : `${op === 'serialize' ? 'Serialize' : 'Deserialize'}: Nino v4 vs v3 (3.3.13)`,
    subtitle: zh
      ? '耗时以 MemoryPack = 1.0 归一化，越短越快。v3 没有多态用例。'
      : 'Time normalized to MemoryPack = 1.0, shorter is faster. v3 has no polymorphic cases.',
    series: [s.v3, s.v4, s.mp],
    rows: rows.map((row) => {
      const v4 = row.v4.ns / row.memorypack.ns;
      const v3 = v4 * (row.vsV3 ?? 1);
      return {
        label: caseLabel(row, zh),
        code: row.code,
        mark: row.gcBound ? '†' : undefined,
        values: { v3, v4, mp: 1 },
        text: { v3: v3.toFixed(2), v4: v4.toFixed(2), mp: '1.00' },
        badge: v3Badge(row.vsV3 ?? 1, zh),
        detail: zh
          ? `Nino v4 ${row.v4.text}，MemoryPack ${row.memorypack.text}`
          : `Nino v4 ${row.v4.text}, MemoryPack ${row.memorypack.text}`,
      };
    }),
    axisLabel: zh
      ? '相对耗时（MemoryPack = 1.0）'
      : 'Relative time (MemoryPack = 1.0)',
    tickFormat: rel,
    footnotes: [
      zh
        ? 'v3 条形为推算值：v4 的相对耗时乘以公布的 v4 对比 v3 倍数（v3 与 MemoryPack 在同一台机器上单独运行）。'
        : 'The v3 bars are derived: the v4 relative time multiplied by the published v4-vs-v3 ratio (v3 and MemoryPack were run separately on the same machine).',
      ...(hasGc ? [zh ? gcNote.zh : gcNote.en] : []),
    ],
    table: {
      caption: zh ? '数据表' : 'Data table',
      head: zh
        ? ['用例', 'Nino v4', 'MemoryPack', 'v4 对比 v3']
        : ['Case', 'Nino v4', 'MemoryPack', 'v4 vs v3'],
      rows: rows.map((row) => [
        caseLabel(row, zh),
        row.v4.text,
        row.memorypack.text,
        v3Badge(row.vsV3 ?? 1, zh).text,
      ]),
    },
  };
}

function compileChart(zh: boolean): BarChartProps {
  return {
    title: zh
      ? '构建：v4 比 v3（3.3.13）好多少倍'
      : 'Build: how many times better v4 is than v3 (3.3.13)',
    subtitle: zh
      ? '源生成器基准测试，330 个类型（N = 30）。越长越好。'
      : 'Source generator benchmark, 330 types (N = 30). Longer is better.',
    series: [
      { key: 'ratio', label: 'v4 vs v3', color: 'var(--nino-chart-v4)' },
    ],
    rows: build.map((row) => ({
      label: zh ? row.zh : row.en,
      values: { ratio: row.ratio },
      text: {
        ratio: zh
          ? `${row.better === 'smaller' ? '小' : '快'} ${row.ratio} 倍`
          : `${row.ratio}× ${row.better}`,
      },
      detail: `v3 ${row.v3} → v4 ${row.v4}`,
    })),
    axisLabel: zh ? 'v4 对比 v3（倍）' : 'v4 vs v3 (×)',
    tickFormat: (value) => `${value}×`,
    table: {
      caption: zh ? '数据表' : 'Data table',
      head: zh
        ? ['指标', 'v3（3.3.13）', 'v4', 'v4 对比 v3']
        : ['Measure', 'v3 (3.3.13)', 'v4', 'v4 vs v3'],
      rows: build.map((row) => [
        zh ? row.zh : row.en,
        row.v3,
        row.v4,
        zh
          ? `${row.better === 'smaller' ? '小' : '快'} ${row.ratio} 倍`
          : `${row.ratio}× ${row.better}`,
      ]),
    },
  };
}

function allocationChart(zh: boolean): BarChartProps {
  const s = seriesFor(zh);
  return {
    title: zh
      ? '每次调用分配的内存：反序列化到已有对象'
      : 'Bytes allocated per call: deserializing into existing objects',
    subtitle: zh
      ? '越短越好。0 B 表示该调用不产生任何 GC 压力。'
      : 'Shorter is better. 0 B means the call creates no GC pressure at all.',
    series: [s.ninoReuse, s.mpOverwrite],
    rows: reuse.map((row) => ({
      label: caseLabel(row, zh),
      values: {
        ninoReuse: row.ninoReuseBytes,
        mpOverwrite: row.memorypackOverwriteBytes,
      },
      text: {
        ninoReuse: formatBytes(row.ninoReuseBytes),
        mpOverwrite: formatBytes(row.memorypackOverwriteBytes),
      },
    })),
    axisLabel: zh ? '每次调用分配的字节数' : 'Bytes allocated per call',
    tickFormat: (value) => (value >= 1000 ? `${value / 1000}K` : String(value)),
    footnotes: [
      zh
        ? '序列化：两个库在所有用例中都是每次调用 0 B。反序列化为新实例：两者分配的字节数相同（只有结果对象）。'
        : 'Serialize: 0 B per call in both libraries, in every case. Deserialize into new instances: both allocate the same bytes (only the result objects).',
    ],
    table: {
      caption: zh ? '数据表' : 'Data table',
      head: zh
        ? ['用例', 'Nino 复用', 'MemoryPack 覆盖']
        : ['Case', 'Nino reusing', 'MemoryPack overwrite'],
      rows: reuse.map((row) => [
        caseLabel(row, zh),
        formatBytes(row.ninoReuseBytes),
        formatBytes(row.memorypackOverwriteBytes),
      ]),
    },
  };
}

function payloadChart(zh: boolean): BarChartProps {
  const s = seriesFor(zh);
  return {
    title: zh ? '载荷大小' : 'Payload size',
    subtitle: zh
      ? '序列化一个 SimpleClass 写出的字节数，两者基本相同。'
      : 'Bytes written for one SimpleClass: about the same in both.',
    series: [s.v4, s.mp],
    rows: [
      {
        label: payload.name,
        code: true,
        values: { v4: payload.v4, mp: payload.memorypack },
        text: {
          v4: formatBytes(payload.v4),
          mp: formatBytes(payload.memorypack),
        },
      },
    ],
    axisLabel: zh ? '字节' : 'Bytes',
    tickFormat: (value) => value.toLocaleString('en-US'),
    table: {
      caption: zh ? '数据表' : 'Data table',
      head: zh
        ? ['用例', 'Nino v4', 'MemoryPack']
        : ['Case', 'Nino v4', 'MemoryPack'],
      rows: [
        [
          payload.name,
          formatBytes(payload.v4),
          formatBytes(payload.memorypack),
        ],
      ],
    },
  };
}

function chartProps(id: ChartId, zh: boolean): BarChartProps {
  switch (id) {
    case 'serialize':
    case 'deserialize':
      return memoryPackChart(id, zh);
    case 'reuse':
      return reuseChart(zh);
    case 'v3-serialize':
      return v3Chart('serialize', zh);
    case 'v3-deserialize':
      return v3Chart('deserialize', zh);
    case 'compile':
      return compileChart(zh);
    case 'allocation':
      return allocationChart(zh);
    case 'payload':
      return payloadChart(zh);
  }
}

const tabLabels: Record<ChartId, { en: string; zh: string }> = {
  serialize: { en: 'Serialize', zh: '序列化' },
  deserialize: { en: 'Deserialize', zh: '反序列化' },
  reuse: { en: 'Reusing objects', zh: '复用对象' },
  'v3-serialize': { en: 'Serialize', zh: '序列化' },
  'v3-deserialize': { en: 'Deserialize', zh: '反序列化' },
  compile: { en: 'Compile time', zh: '编译时间' },
  allocation: { en: 'Allocations', zh: '内存分配' },
  payload: { en: 'Payload size', zh: '载荷大小' },
};

export interface BenchmarkChartProps {
  /** One chart, or several shown as tabs */
  chart: ChartId | ChartId[];
  lang?: Locale;
  /** Hide the data table when the page already has one next to the chart */
  table?: boolean;
}

export default function BenchmarkCharts({
  chart,
  lang = 'en',
  table = true,
}: BenchmarkChartProps) {
  const zh = lang === 'zh';
  const ids = Array.isArray(chart) ? chart : [chart];
  const [current, setCurrent] = useState<ChartId>(ids[0]);
  const props = chartProps(current, zh);
  if (!table) props.table = undefined;

  if (ids.length === 1) return <BarChart {...props} />;
  return (
    <div className="not-prose my-6">
      <Segmented
        value={current}
        onChange={setCurrent}
        options={ids.map((id) => ({
          value: id,
          label: zh ? tabLabels[id].zh : tabLabels[id].en,
        }))}
      />
      <div className="-mt-6">
        <BarChart key={current} {...props} />
      </div>
    </div>
  );
}

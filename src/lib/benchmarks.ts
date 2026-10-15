/**
 * Every benchmark number the site shows (home page, What's New, v3 vs v4,
 * Nino vs MemoryPack, Benchmarks).
 *
 * Runtime (v4 and MemoryPack): src/data/bench-v4.json. scripts/sync-benchmarks.ts
 * refreshes it before each build from the "Performance Report" of the newest
 * v4 release; the committed file is the fallback. Ratios are computed here
 * from the measured times, never typed in.
 *
 * Runtime against v3: V3_RUNTIME below, the one place for those numbers.
 *
 * Build time (source generator, v3 3.3.13 vs v4): static, from
 * docs/v4-benchmarks.md in the Nino repository; it is not in the release report.
 */
import bench from '@/data/bench-v4.json';

export interface Measure {
  /** Formatted for display, e.g. "1.13 µs" */
  text: string;
  /** In nanoseconds */
  ns: number;
}

interface BenchRow {
  method: string;
  category: string | null;
  meanNs: number;
  allocatedBytes: number | null;
  payloadBytes: number | null;
  rerun?: boolean;
}

/** Where the runtime numbers come from */
export const benchSource = {
  origin: bench.origin as 'release' | 'local' | 'fixture',
  tag: bench.tag,
  url: bench.url,
  publishedAt: bench.publishedAt as string | null,
  environment: bench.environment as string | null,
};

const rows = new Map(
  (bench.rows as BenchRow[]).map((row) => [row.method, row] as const),
);

/** "Nino v4.0.0, measured on GitHub Actions, 2026-10-14." */
export function sourceNote(zh: boolean) {
  const date = benchSource.publishedAt?.slice(0, 10);
  if (benchSource.origin === 'release')
    return zh
      ? `Nino ${benchSource.tag}，GitHub Actions 实测，${date}。`
      : `Nino ${benchSource.tag}, measured on GitHub Actions, ${date}.`;
  return zh
    ? `Nino ${benchSource.tag}，本地实测（docs/v4-benchmarks.md）；下一个附带完整性能报告的 v4 版本发布后自动更新。`
    : `Nino ${benchSource.tag}, measured locally (docs/v4-benchmarks.md); updated automatically from the next v4 release with a complete performance report.`;
}

/** All rows of the report, in report order (for the full results table) */
export const benchRows: readonly BenchRow[] = bench.rows as BenchRow[];

function digits(value: number) {
  if (value >= 100) return Math.round(value).toLocaleString('en-US');
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

/** 151 -> "151 ns", 17040 -> "17.0 µs", 1.234e6 -> "1.23 ms" */
export function formatTime(ns: number) {
  if (ns < 1e3) return `${digits(ns)} ns`;
  if (ns < 1e6) return `${digits(ns / 1e3)} µs`;
  if (ns < 1e9) return `${digits(ns / 1e6)} ms`;
  return `${digits(ns / 1e9)} s`;
}

export const formatBytes = (bytes: number) =>
  `${bytes.toLocaleString('en-US')} B`;

function measure(method: string): Measure | undefined {
  const row = rows.get(method);
  return row ? { text: formatTime(row.meanNs), ns: row.meanNs } : undefined;
}

const bytes = (method: string) => rows.get(method)?.allocatedBytes ?? null;

/** Two decimals; within 5% counts as on par */
function ratioOf(slower: number, faster: number) {
  const ratio = Math.round((slower / faster) * 100) / 100;
  return Math.abs(ratio - 1) < 0.05 ? undefined : ratio;
}

/* ------------------------------------------------------------------ */
/* Runtime                                                             */
/* ------------------------------------------------------------------ */

export interface RuntimeCase {
  /** Benchmark case; `code` cases are type names and render in monospace */
  name: string;
  zh?: string;
  code?: boolean;
  /** Method suffix in Nino.Benchmark, e.g. "SimpleClasses" */
  key: string;
  v4: Measure;
  memorypack: Measure;
  /** MemoryPack time / v4 time; undefined = on par; < 1 = MemoryPack faster */
  ratio?: number;
  /** v3 3.3.13 time / v4 time from V3_RUNTIME; undefined = not measured */
  vsV3?: number;
  v3?: Measure;
  /** Marked * in the tables: re-run with more iterations (local snapshot only) */
  rerun?: boolean;
  /** Dominated by gen-2 GC of a 160 KB array (see the footnote) */
  gcBound?: boolean;
}

interface CaseInfo {
  name: string;
  zh?: string;
  code?: boolean;
  key: string;
  gcBound?: boolean;
}

const cases: Record<'serialize' | 'deserialize', CaseInfo[]> = {
  serialize: [
    { name: 'SimpleClass', code: true, key: 'SimpleClass' },
    { name: 'SimpleClass[100]', code: true, key: 'SimpleClasses' },
    { name: 'Polymorphic class', zh: '多态类', key: 'PolymorphicClass' },
    {
      name: 'Polymorphic class array',
      zh: '多态类数组',
      key: 'PolymorphicClassArray',
    },
    { name: 'Polymorphic Foo[]', zh: '多态 Foo[]', key: 'PolymorphicFooArray' },
    { name: 'SimpleStruct', code: true, key: 'SimpleStruct' },
    { name: 'SimpleStruct[100]', code: true, key: 'SimpleStructs' },
    { name: 'Vector4[10000]', code: true, key: 'Vectors' },
  ],
  deserialize: [
    { name: 'SimpleClass', code: true, key: 'SimpleClass' },
    { name: 'SimpleClass[100]', code: true, key: 'SimpleClasses' },
    { name: 'Polymorphic class', zh: '多态类', key: 'PolymorphicClass' },
    {
      name: 'Polymorphic class array',
      zh: '多态类数组',
      key: 'PolymorphicClassArray',
    },
    { name: 'Polymorphic Foo[]', zh: '多态 Foo[]', key: 'PolymorphicFooArray' },
    { name: 'SimpleStruct', code: true, key: 'SimpleStruct' },
    { name: 'SimpleStruct[100]', code: true, key: 'SimpleStructs' },
    { name: 'Vector4[10000]', code: true, key: 'Vectors', gcBound: true },
  ],
};

/* ------------------------------------------------------------------ */
/* V3_RUNTIME: Nino v3 3.3.13 (NuGet) against v4, measured back to back */
/* ------------------------------------------------------------------ */

/**
 * Fill in from a direct back-to-back BenchmarkDotNet run of Nino 3.3.13 (from
 * NuGet) and v4 on the same machine: mean times in nanoseconds, keyed by
 * "serialize:SimpleClass" / "deserialize:SimpleClasses" (the case keys
 * above). Both times must come from the same run. Empty = not measured yet:
 * the site then shows no v4-vs-v3 runtime numbers.
 */
export const V3_RUNTIME: {
  /** Machine and versions of the run, shown under the v3 charts */
  environment: string | null;
  rows: Partial<Record<string, { v3Ns: number; v4Ns: number }>>;
} = {
  environment: null,
  rows: {},
};

function buildCase(op: 'serialize' | 'deserialize', info: CaseInfo) {
  const verb = op === 'serialize' ? 'Serialize' : 'Deserialize';
  const nino = rows.get(`Nino${verb}${info.key}`);
  const v4 = measure(`Nino${verb}${info.key}`);
  const memorypack = measure(`MemoryPack${verb}${info.key}`);
  if (!v4 || !memorypack || !nino) return [];
  const v3Row = V3_RUNTIME.rows[`${op}:${info.key}`];
  const result: RuntimeCase = {
    ...info,
    v4,
    memorypack,
    ratio: ratioOf(memorypack.ns, v4.ns),
    rerun: nino.rerun,
  };
  if (v3Row) {
    result.v3 = { text: formatTime(v3Row.v3Ns), ns: v3Row.v3Ns };
    result.vsV3 = Math.round((v3Row.v3Ns / v3Row.v4Ns) * 100) / 100;
  }
  return [result];
}

export const runtime: Record<'serialize' | 'deserialize', RuntimeCase[]> = {
  serialize: cases.serialize.flatMap((info) => buildCase('serialize', info)),
  deserialize: cases.deserialize.flatMap((info) =>
    buildCase('deserialize', info),
  ),
};

/** Fastest / slowest win against MemoryPack (ignores on-par and losses) */
export function ratioRange(op: 'serialize' | 'deserialize') {
  const wins = runtime[op]
    .map((row) => row.ratio)
    .filter((ratio): ratio is number => ratio !== undefined && ratio > 1);
  return { min: Math.min(...wins), max: Math.max(...wins) };
}

/* ------------------------------------------------------------------ */
/* Deserializing into existing objects                                 */
/* ------------------------------------------------------------------ */

export interface ReuseCase {
  name: string;
  zh: string;
  ninoNew: Measure;
  /** `ref` deserialization into the existing graph, new instances from [NinoPooled] pools */
  ninoReuse: Measure;
  ninoReuseBytes: number;
  memorypackNew: Measure;
  /** MemoryPack's overwrite mode (deserialize into an existing instance) */
  memorypackOverwrite: Measure;
  memorypackOverwriteBytes: number;
}

const reuseCases = [
  {
    name: 'Pooled node',
    zh: '池化节点',
    methods: [
      'NinoNodeNew',
      'NinoNodePooled',
      'MemoryPackNodeNew',
      'MemoryPackNodeOverwrite',
    ],
  },
  {
    name: 'Pooled leaves, in place',
    zh: '池化叶子，原地复用',
    methods: [
      'NinoLeavesNew',
      'NinoLeavesInPlace',
      'MemoryPackLeavesNew',
      'MemoryPackLeavesOverwrite',
    ],
  },
  {
    name: 'Pooled leaves, pooled elements',
    zh: '池化叶子，池化元素',
    methods: [
      'NinoLeavesNew',
      'NinoLeavesPooledElements',
      'MemoryPackLeavesNew',
      'MemoryPackLeavesOverwrite',
    ],
  },
  {
    name: 'Pooled class',
    zh: '池化类',
    methods: [
      'NinoDeserializeNew',
      'NinoDeserializePooled',
      'MemoryPackDeserializeNew',
      'MemoryPackDeserializeOverwrite',
    ],
  },
];

export const reuse: ReuseCase[] = reuseCases.flatMap(
  ({ name, zh, methods: [ninoNew, ninoReuse, mpNew, mpOverwrite] }) => {
    const a = measure(ninoNew);
    const b = measure(ninoReuse);
    const c = measure(mpNew);
    const d = measure(mpOverwrite);
    const bBytes = bytes(ninoReuse);
    const dBytes = bytes(mpOverwrite);
    if (!a || !b || !c || !d || bBytes === null || dBytes === null) return [];
    return [
      {
        name,
        zh,
        ninoNew: a,
        ninoReuse: b,
        ninoReuseBytes: bBytes,
        memorypackNew: c,
        memorypackOverwrite: d,
        memorypackOverwriteBytes: dBytes,
      },
    ];
  },
);

/** How many times faster Nino reusing is than MemoryPack overwrite (one decimal) */
export function reuseSpeedup(row: ReuseCase) {
  return Math.round((row.memorypackOverwrite.ns / row.ninoReuse.ns) * 10) / 10;
}

/** The reuse case where Nino gains most over MemoryPack's overwrite mode */
export const bestReuse = reuse.reduce<ReuseCase | undefined>(
  (best, row) => (!best || reuseSpeedup(row) > reuseSpeedup(best) ? row : best),
  undefined,
);

/* ------------------------------------------------------------------ */
/* Allocations and payload size                                        */
/* ------------------------------------------------------------------ */

/** True when every serialize case allocated 0 B in both libraries */
export const serializeAllocatesNothing = cases.serialize.every((info) =>
  ['Nino', 'MemoryPack'].every(
    (lib) => (bytes(`${lib}Serialize${info.key}`) ?? 0) === 0,
  ),
);

/** Bytes written for one SimpleClass */
export const payload = {
  name: 'SimpleClass',
  v4: rows.get('NinoSerializeSimpleClass')?.payloadBytes ?? null,
  memorypack: rows.get('MemoryPackSerializeSimpleClass')?.payloadBytes ?? null,
};

/** "2.97×" */
export const times = (value: number, decimals = 2) =>
  `${value.toFixed(decimals)}×`;

/* ------------------------------------------------------------------ */
/* Build time                                                          */
/* ------------------------------------------------------------------ */

export interface BuildMeasure {
  en: string;
  zh: string;
  /** Short label for stat cards */
  short: { en: string; zh: string };
  v3: string;
  v4: string;
  /** v4 better than v3 by this factor, as published */
  ratio: number;
  better: 'smaller' | 'faster';
}

/** v4 vs v3 3.3.13, source generator benchmark with 330 types (N = 30) */
export const build: BuildMeasure[] = [
  {
    en: 'Generated source',
    zh: '生成的源码',
    short: { en: 'smaller generated source', zh: '生成的源码更小' },
    v3: '18.7 MB',
    v4: '1.15 MB',
    ratio: 16,
    better: 'smaller',
  },
  {
    en: 'Compiling the generated code (emit)',
    zh: '编译生成的代码（emit）',
    short: { en: 'faster to compile (emit)', zh: '编译（emit）更快' },
    v3: '56.0 s',
    v4: '1.27 s',
    ratio: 44,
    better: 'faster',
  },
  {
    en: 'Running the generator',
    zh: '运行生成器',
    short: { en: 'faster generator run', zh: '生成器运行更快' },
    v3: '1.11 s',
    v4: '0.14 s',
    ratio: 7.9,
    better: 'faster',
  },
  {
    en: 'Re-generating after editing a member',
    zh: '修改成员后重新生成',
    short: {
      en: 'faster re-generation after editing a member',
      zh: '修改成员后重新生成更快',
    },
    v3: '1.31 s',
    v4: '0.19 s',
    ratio: 6.9,
    better: 'faster',
  },
  {
    en: 'Re-generating after editing a comment',
    zh: '修改注释后重新生成',
    short: {
      en: 'faster re-generation after editing a comment',
      zh: '修改注释后重新生成更快',
    },
    v3: '1.11 s',
    v4: '0.19 s',
    ratio: 5.8,
    better: 'faster',
  },
  {
    en: 'IL of the generated code',
    zh: '生成代码的 IL',
    short: { en: 'smaller IL', zh: 'IL 更小' },
    v3: '2.2 MB',
    v4: '0.37 MB',
    ratio: 6,
    better: 'smaller',
  },
];

/** Stat cards for the build benchmark */
export const vsV3Build = build.map((row) => ({
  value: `${row.ratio}×`,
  en: row.short.en,
  zh: row.short.zh,
}));

/** Build cost at 1,100 types (N = 100), v3.3.13 vs v4 (docs/v4-benchmarks.md) */
export const buildLarge = {
  types: 1100,
  source: { v3: '62.0 MB', v4: '3.9 MB', v3n: 62, v4n: 3.9, ratio: 16 },
  emit: { v3: '636 s', v4: '2.2 s', v3n: 636, v4n: 2.2, ratio: 289 },
};

/* ------------------------------------------------------------------ */
/* Headline numbers                                                    */
/* ------------------------------------------------------------------ */

/** Best serialize win over MemoryPack, one decimal ("4.3") */
export const headlineSerialize = (() => {
  const { max } = ratioRange('serialize');
  return Number.isFinite(max) ? max.toFixed(1) : null;
})();

/** Best reuse win over MemoryPack's overwrite, one decimal ("4.9") */
export const headlineReuse = bestReuse
  ? reuseSpeedup(bestReuse).toFixed(1)
  : null;

/** True when the data shows zero GC on the serialize and reuse paths */
export const headlineZeroGc =
  bestReuse?.ninoReuseBytes === 0 && serializeAllocatesNothing;

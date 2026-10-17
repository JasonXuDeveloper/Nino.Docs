/**
 * Every benchmark number the site shows (home page, What's New, v3 vs v4,
 * Nino vs MemoryPack, Benchmarks).
 *
 * Runtime (v4 and MemoryPack): src/data/bench-v4.json. scripts/sync-benchmarks.ts
 * refreshes it before each build from the "Performance Report" of the newest
 * v4 release; the committed file is the fallback. Ratios are computed here
 * from the measured times, never typed in.
 *
 * Runtime against v3: src/data/bench-v3-runtime.json (V3_RUNTIME below), synced
 * from the "v3 3.3.13 vs v4 (same machine)" section of the same release: Nino
 * 3.3.13 run directly before v4 in the same CI job. Ratios use the v3 and v4
 * times of that section, so both sides always come from one machine and one run.
 *
 * Build time (source generator, v3 3.3.13 vs v4): static, from
 * docs/v4-benchmarks.md in the Nino repository; it is not in the release report.
 */
import benchV3 from '@/data/bench-v3-runtime.json';
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

/** "Nino v4.0.0, 2026-10-14." — tag and date only, linked to the release */
export function sourceNote(zh: boolean) {
  const date = benchSource.publishedAt?.slice(0, 10);
  const parts = [`Nino ${benchSource.tag}`, date].filter(Boolean);
  return zh ? `${parts.join('，')}。` : `${parts.join(', ')}.`;
}

/** All rows of the report, in report order (for the full results table) */
export const benchRows: readonly BenchRow[] = bench.rows as BenchRow[];

/**
 * Below a third of a clock cycle, a time cannot be told apart from
 * BenchmarkDotNet's empty-method overhead. v4 under it against a measurable
 * time is faster, too fast to measure: no ratio, which would only reflect the
 * floor. Both under it is on par. Nino's benchmarks/readme.py and
 * benchmarks/v3/compare.py use the same floor.
 */
export const FLOOR_NS = 0.1;

function digits(value: number) {
  if (value >= 100) return Math.round(value).toLocaleString('en-US');
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

/** 151 -> "151 ns", 17040 -> "17.0 µs", 1.234e6 -> "1.23 ms" */
export function formatTime(ns: number) {
  if (ns < FLOOR_NS) return `< ${FLOOR_NS} ns`;
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

/** A ratio within 5% of 1 (0.95–1.05 at two decimals) is on par: below the run-to-run noise */
export function isOnPar(ratio: number) {
  return Math.round(Math.abs(ratio - 1) * 100) <= 5;
}

/** Two decimals; undefined when on par */
function ratioOf(slower: number, faster: number) {
  const ratio = Math.round((slower / faster) * 100) / 100;
  return isOnPar(ratio) ? undefined : ratio;
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
  /** MemoryPack time / v4 time; undefined = on par (or tooFast); < 1 = MemoryPack faster */
  ratio?: number;
  /** v4 under FLOOR_NS, MemoryPack above it: faster, too fast to measure */
  tooFast?: boolean;
  /** v3 3.3.13 time / v4 time, both from V3_RUNTIME; undefined = not measured (or v3TooFast) */
  vsV3?: number;
  /** v4 under FLOOR_NS in V3_RUNTIME, v3 above it: faster than v3, too fast to measure */
  v3TooFast?: boolean;
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
 * Mean times in nanoseconds of Nino 3.3.13 (from NuGet) and v4 from one
 * back-to-back run on one machine, keyed by "serialize:SimpleClass" /
 * "deserialize:SimpleClasses" (the case keys above). Written by
 * scripts/sync-benchmarks.ts; empty rows = not measured: the site then shows no
 * v4-vs-v3 runtime numbers.
 */
export const V3_RUNTIME: {
  origin: 'release' | 'local' | 'fixture';
  tag: string;
  url: string;
  publishedAt: string | null;
  /** BenchmarkDotNet's environment summary of the v3 run */
  environment: string | null;
  /** Number of v3 runs that v3Ns is the mean of (1: before v4; 2: before and after) */
  runs: number;
  /** Shown instead of the generated description (local runs) */
  note: string | null;
  rows: Partial<Record<string, { v3Ns: number; v4Ns: number }>>;
} = {
  ...benchV3,
  origin: benchV3.origin as 'release' | 'local' | 'fixture',
};

/** "AMD EPYC 7763 2.45GHz, 1 CPU, 4 logical and 2 physical cores; Linux Ubuntu 24.04.2 LTS; .NET 10.0.0" */
function environmentLabel(environment: string) {
  const lines = environment
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const os = /^BenchmarkDotNet v[\d.]+,\s*(.+?)(?:\s*\(.*\))?$/.exec(
    lines[0] ?? '',
  )?.[1];
  const cpu = lines[1];
  const runtime = /\[Host\]\s*:\s*(\.NET [\d.]+)/.exec(environment)?.[1];
  return [cpu, os, runtime].filter(Boolean).join('; ');
}

/** Where the v3 comparison comes from: one or two sentences for the v3 charts */
export function v3SourceNote(zh: boolean): string | null {
  if (Object.keys(V3_RUNTIME.rows).length === 0) return null;
  if (V3_RUNTIME.note) return V3_RUNTIME.note;
  const { tag, runs } = V3_RUNTIME;
  const env = V3_RUNTIME.environment
    ? environmentLabel(V3_RUNTIME.environment)
    : '';
  const local = V3_RUNTIME.origin === 'local';
  if (zh)
    return `Nino 3.3.13（NuGet）在 Nino ${tag} 的基准测试${runs > 1 ? '之前和之后各运行一次' : '之前运行'}，${local ? '' : '同一个 CI 任务、'}同一台机器、相同设置${runs > 1 ? '；v3 取两次的平均值' : ''}。${env ? `${env}。` : ''}`;
  return `Nino 3.3.13 (NuGet) ran ${runs > 1 ? 'before and after' : 'before'} the Nino ${tag} benchmark${local ? '' : ' in the same CI job'}, on the same machine with the same settings${runs > 1 ? '; v3 is the mean of the two runs' : ''}.${env ? ` ${env}.` : ''}`;
}

function buildCase(op: 'serialize' | 'deserialize', info: CaseInfo) {
  const verb = op === 'serialize' ? 'Serialize' : 'Deserialize';
  const nino = rows.get(`Nino${verb}${info.key}`);
  const v4 = measure(`Nino${verb}${info.key}`);
  const memorypack = measure(`MemoryPack${verb}${info.key}`);
  if (!v4 || !memorypack || !nino) return [];
  const v3Row = V3_RUNTIME.rows[`${op}:${info.key}`];
  const unmeasured = v4.ns < FLOOR_NS;
  const result: RuntimeCase = {
    ...info,
    v4,
    memorypack,
    ratio: unmeasured ? undefined : ratioOf(memorypack.ns, v4.ns),
    tooFast: unmeasured && memorypack.ns >= FLOOR_NS,
    rerun: nino.rerun,
  };
  if (v3Row) {
    result.v3 = { text: formatTime(v3Row.v3Ns), ns: v3Row.v3Ns };
    if (v3Row.v4Ns >= FLOOR_NS)
      result.vsV3 = Math.round((v3Row.v3Ns / v3Row.v4Ns) * 100) / 100;
    else if (v3Row.v3Ns >= FLOOR_NS) result.v3TooFast = true;
    else result.vsV3 = 1;
  }
  return [result];
}

export const runtime: Record<'serialize' | 'deserialize', RuntimeCase[]> = {
  serialize: cases.serialize.flatMap((info) => buildCase('serialize', info)),
  deserialize: cases.deserialize.flatMap((info) =>
    buildCase('deserialize', info),
  ),
};

/**
 * Reference tracking (ReferenceTest), version tolerance (VersionTolerantTest)
 * and fixed-size types (FixedSizeTest), against MemoryPack's CircularReference
 * and VersionTolerant modes and its byte[] API. Kept apart from `runtime`, so
 * the headline ratios stay those of the main cases. A case shows only when the
 * synced report has both of its rows; a report without these benchmarks shows
 * none (the page then says the results are still to come). Only the
 * Benchmarks page shows them; deserializing FixedStruct (one 40-byte copy,
 * about a clock cycle) is detail for that page, not for headlines.
 */
const extraCases: Record<'serialize' | 'deserialize', CaseInfo[]> = {
  serialize: [
    {
      name: 'Object graph, 200 tracked nodes',
      zh: '对象图，200 个追踪的节点',
      key: 'Graph',
    },
    { name: 'TolerantClass', code: true, key: 'TolerantClass' },
    { name: 'TolerantClass[100]', code: true, key: 'TolerantClasses' },
    { name: 'FixedStruct', code: true, key: 'FixedStruct' },
    { name: 'FixedClass', code: true, key: 'FixedClass' },
    { name: 'FixedClass[100]', code: true, key: 'FixedClasses' },
  ],
  deserialize: [
    {
      name: 'Object graph, 200 tracked nodes',
      zh: '对象图，200 个追踪的节点',
      key: 'Graph',
    },
    { name: 'TolerantClass', code: true, key: 'TolerantClass' },
    { name: 'TolerantClass[100]', code: true, key: 'TolerantClasses' },
    { name: 'FixedStruct', code: true, key: 'FixedStruct' },
    { name: 'FixedClass', code: true, key: 'FixedClass' },
    { name: 'FixedClass[100]', code: true, key: 'FixedClasses' },
  ],
};

export const extraRuntime: Record<'serialize' | 'deserialize', RuntimeCase[]> =
  {
    serialize: extraCases.serialize.flatMap((info) =>
      buildCase('serialize', info),
    ),
    deserialize: extraCases.deserialize.flatMap((info) =>
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

/** Unmanaged-struct cases, which both libraries copy as one block */
const structKeys = new Set(['SimpleStruct', 'SimpleStructs', 'Vectors']);

/**
 * Fastest / slowest win against MemoryPack on classes and polymorphic types
 * (the cases that are not unmanaged structs)
 */
export function classRatioRange(op: 'serialize' | 'deserialize') {
  const wins = runtime[op]
    .filter((row) => !structKeys.has(row.key))
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

/** How many times faster Nino reusing is than MemoryPack overwrite (two decimals, from the raw means) */
export function reuseSpeedup(row: ReuseCase) {
  return (
    Math.round((row.memorypackOverwrite.ns / row.ninoReuse.ns) * 100) / 100
  );
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

/**
 * The one way to print a ratio. Runtime ratios (computed from the raw means)
 * always show two decimals ("4.33×"); build-time ratios are whole numbers or
 * as published ("221×", "3.1×").
 */
export const formatRatio = (value: number) => `${value.toFixed(2)}×`;
export const formatBuildRatio = (value: number) => `${value}×`;

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
    v4: '1.31 MB',
    ratio: 14,
    better: 'smaller',
  },
  {
    en: 'Compiling the generated code (emit)',
    zh: '编译生成的代码（emit）',
    short: { en: 'faster to compile (emit)', zh: '编译（emit）更快' },
    v3: '42.9 s',
    v4: '0.84 s',
    ratio: 51,
    better: 'faster',
  },
  {
    en: 'Running the generator',
    zh: '运行生成器',
    short: { en: 'faster generator run', zh: '生成器运行更快' },
    v3: '1.01 s',
    v4: '0.32 s',
    ratio: 3.1,
    better: 'faster',
  },
  {
    en: 'Re-generating after editing a member',
    zh: '修改成员后重新生成',
    short: {
      en: 'faster re-generation after editing a member',
      zh: '修改成员后重新生成更快',
    },
    v3: '1.03 s',
    v4: '0.12 s',
    ratio: 8.3,
    better: 'faster',
  },
  {
    en: 'Re-generating after editing a comment',
    zh: '修改注释后重新生成',
    short: {
      en: 'faster re-generation after editing a comment',
      zh: '修改注释后重新生成更快',
    },
    v3: '1.01 s',
    v4: '0.13 s',
    ratio: 7.8,
    better: 'faster',
  },
  {
    en: 'IL of the generated code',
    zh: '生成代码的 IL',
    short: { en: 'smaller IL', zh: 'IL 更小' },
    v3: '2.21 MB',
    v4: '0.42 MB',
    ratio: 5.3,
    better: 'smaller',
  },
];

/** Build cost at 1,100 types (N = 100), v3.3.13 vs v4 (docs/v4-benchmarks.md) */
export const buildLarge = {
  types: 1100,
  source: { v3: '62.0 MB', v4: '4.38 MB', v3n: 62, v4n: 4.38, ratio: 14 },
  emit: { v3: '462 s', v4: '2.1 s', v3n: 462, v4n: 2.1, ratio: 221 },
};

/* ------------------------------------------------------------------ */
/* Headline numbers                                                    */
/* ------------------------------------------------------------------ */

/** Best serialize win over MemoryPack, two decimals ("4.33"), from the raw means */
export const headlineSerialize = (() => {
  const { max } = ratioRange('serialize');
  return Number.isFinite(max) ? max.toFixed(2) : null;
})();

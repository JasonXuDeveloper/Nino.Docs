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
 * Arm64: src/data/bench-v4-arm64.json, synced from the "Arm64 benchmark"
 * section of the same release (the same benchmark classes on GitHub's
 * ubuntu-24.04-arm runners). Both architectures go through `dataset()` below,
 * so the same rules (FLOOR_NS, on par, ratios) apply to both; `arm64` is null
 * until a release has that section. Comparisons with v3 are x64 only.
 *
 * MessagePack (MessagePack-CSharp) and protobuf-net: the `MessagePack…` and
 * `Protobuf…` rows of the same reports, in releases since they joined the
 * benchmark; a case a library cannot express has no row. `libraries` lists the
 * ones a dataset has, so pages show their columns only when the synced release
 * measured them. Every comparison (MemoryPack, MessagePack, protobuf-net)
 * goes through `versus()`, with the same FLOOR_NS and on-par rules.
 *
 * Runtimes outside .NET (Go, Rust, TypeScript): src/data/bench-runtimes.json
 * (`runtimes` below), synced from the runtime sections of the same release.
 *
 * Unity (an IL2CPP player, without and with the Burst kernels):
 * src/data/bench-unity.json (`unity` below), synced from the Unity section of
 * the same release. Speedups are computed here from the two times, with the
 * same FLOOR_NS and on-par rules; the report's own Speedup column is not used.
 *
 * Build time (source generator, v3 3.3.13 vs v4): static, from
 * docs/v4-benchmarks.md in the Nino repository; it is not in the release report.
 */

import benchRuntimes from '@/data/bench-runtimes.json';
import benchUnity from '@/data/bench-unity.json';
import benchV3 from '@/data/bench-v3-runtime.json';
import bench from '@/data/bench-v4.json';
import benchArm64 from '@/data/bench-v4-arm64.json';

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

/** Where one dataset's runtime numbers come from */
export interface BenchSourceInfo {
  origin: 'release' | 'local' | 'fixture' | 'none';
  tag: string;
  url: string;
  publishedAt: string | null;
  environment: string | null;
}

/** The shape of src/data/bench-v4.json and bench-v4-arm64.json */
interface BenchFile extends BenchSourceInfo {
  rows: BenchRow[];
}

export type Arch = 'x64' | 'arm64';

/** Tab labels, in tab order */
export const archLabels: Record<Arch, string> = { x64: 'x64', arm64: 'Arm64' };

/**
 * Below about three clock cycles, times cannot be told apart: a 40-byte
 * struct read measured anywhere from 0.05 to 0.8 ns in Nino and MemoryPack
 * alike, once BenchmarkDotNet subtracts its empty-method overhead. v4 under it against a measurable
 * time is faster, too fast to measure: no ratio, which would only reflect the
 * floor. Both under it is on par. Nino's benchmarks/bdn.py holds the same
 * floor (readme.py, compare_v3.py and ab.py use it).
 */
export const FLOOR_NS = 1;

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

/** The .NET serializers besides Nino and MemoryPack, by their method prefix */
export type OtherLib = 'messagepack' | 'protobuf';

export const otherLibs: { key: OtherLib; prefix: string; label: string }[] = [
  { key: 'messagepack', prefix: 'MessagePack', label: 'MessagePack' },
  { key: 'protobuf', prefix: 'Protobuf', label: 'protobuf-net' },
];

/** Nino against one other serializer in one case */
export interface Versus {
  time: Measure;
  /** Other time / Nino time; undefined = on par (or tooFast); < 1 = the other is ahead */
  ratio?: number;
  /** Nino under FLOOR_NS, the other above it: faster, too fast to measure */
  tooFast?: boolean;
}

/** The one rule for every comparison: FLOOR_NS, then on par within 5% */
export function versus(nino: Measure, other: Measure): Versus {
  const unmeasured = nino.ns < FLOOR_NS;
  return {
    time: other,
    ratio: unmeasured ? undefined : ratioOf(other.ns, nino.ns),
    tooFast: unmeasured && other.ns >= FLOOR_NS,
  };
}

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
  /** MessagePack and protobuf-net, for the cases they can express */
  others: Partial<Record<OtherLib, Versus>>;
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
    {
      name: 'Subtypes through a non-generic base, 1,000',
      zh: '经非泛型基类型的子类型，1,000 个',
      key: 'NonGenericBase',
    },
    {
      name: 'Subtypes of Box<int>, 1,000',
      zh: 'Box<int> 的子类型，1,000 个',
      key: 'GenericIntBase',
    },
    {
      name: 'Subtypes of Box<(int, long)>, 1,000',
      zh: 'Box<(int, long)> 的子类型，1,000 个',
      key: 'GenericUnmanagedTupleBase',
    },
    {
      name: 'Subtypes of Box<(int, string)>, 1,000',
      zh: 'Box<(int, string)> 的子类型，1,000 个',
      key: 'GenericManagedTupleBase',
    },
    {
      name: 'Subtypes of Box<(SealedClass, int)>, 1,000',
      zh: 'Box<(密封类, int)> 的子类型，1,000 个',
      key: 'GenericSealedClassTupleBase',
    },
    {
      name: 'Subtypes of Box<(OpenClass, int)>, 1,000',
      zh: 'Box<(非密封类, int)> 的子类型，1,000 个',
      key: 'GenericOpenClassTupleBase',
    },
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
    {
      name: 'Subtypes through a non-generic base, 1,000',
      zh: '经非泛型基类型的子类型，1,000 个',
      key: 'NonGenericBase',
    },
    {
      name: 'Subtypes of Box<int>, 1,000',
      zh: 'Box<int> 的子类型，1,000 个',
      key: 'GenericIntBase',
    },
    {
      name: 'Subtypes of Box<(int, long)>, 1,000',
      zh: 'Box<(int, long)> 的子类型，1,000 个',
      key: 'GenericUnmanagedTupleBase',
    },
    {
      name: 'Subtypes of Box<(int, string)>, 1,000',
      zh: 'Box<(int, string)> 的子类型，1,000 个',
      key: 'GenericManagedTupleBase',
    },
    {
      name: 'Subtypes of Box<(SealedClass, int)>, 1,000',
      zh: 'Box<(密封类, int)> 的子类型，1,000 个',
      key: 'GenericSealedClassTupleBase',
    },
    {
      name: 'Subtypes of Box<(OpenClass, int)>, 1,000',
      zh: 'Box<(非密封类, int)> 的子类型，1,000 个',
      key: 'GenericOpenClassTupleBase',
    },
  ],
};

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

/* ------------------------------------------------------------------ */
/* Datasets: x64 and Arm64                                             */
/* ------------------------------------------------------------------ */

/** One architecture's report, with everything the site derives from it */
export interface BenchDataset {
  arch: Arch;
  source: BenchSourceInfo;
  /** All rows of the report, in report order (for the full results table) */
  rows: readonly BenchRow[];
  runtime: Record<'serialize' | 'deserialize', RuntimeCase[]>;
  /** See extraCases */
  extraRuntime: Record<'serialize' | 'deserialize', RuntimeCase[]>;
  reuse: ReuseCase[];
  /** True when every serialize case allocated 0 B in both libraries */
  serializeAllocatesNothing: boolean;
  /** Bytes written for one SimpleClass */
  payload: {
    name: string;
    v4: number | null;
    memorypack: number | null;
    messagepack: number | null;
    protobuf: number | null;
  };
  /** MessagePack and protobuf-net, when the report has any of their rows */
  libraries: OtherLib[];
}

type V3Rows = (typeof V3_RUNTIME)['rows'];

/** Derives every runtime number from one report; `v3` only for x64 */
function dataset(arch: Arch, file: BenchFile, v3: V3Rows = {}): BenchDataset {
  const rows = new Map(file.rows.map((row) => [row.method, row] as const));
  const measure = (method: string): Measure | undefined => {
    const row = rows.get(method);
    return row ? { text: formatTime(row.meanNs), ns: row.meanNs } : undefined;
  };
  const bytes = (method: string) => rows.get(method)?.allocatedBytes ?? null;

  function buildCase(op: 'serialize' | 'deserialize', info: CaseInfo) {
    const verb = op === 'serialize' ? 'Serialize' : 'Deserialize';
    const nino = rows.get(`Nino${verb}${info.key}`);
    const v4 = measure(`Nino${verb}${info.key}`);
    const memorypack = measure(`MemoryPack${verb}${info.key}`);
    if (!v4 || !memorypack || !nino) return [];
    const v3Row = v3[`${op}:${info.key}`];
    const { ratio, tooFast } = versus(v4, memorypack);
    const others: RuntimeCase['others'] = {};
    for (const lib of otherLibs) {
      const time = measure(`${lib.prefix}${verb}${info.key}`);
      if (time) others[lib.key] = versus(v4, time);
    }
    const result: RuntimeCase = {
      ...info,
      v4,
      memorypack,
      ratio,
      tooFast,
      others,
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
  const build = (set: Record<'serialize' | 'deserialize', CaseInfo[]>) => ({
    serialize: set.serialize.flatMap((info) => buildCase('serialize', info)),
    deserialize: set.deserialize.flatMap((info) =>
      buildCase('deserialize', info),
    ),
  });

  const reuse = reuseCases.flatMap(
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

  return {
    arch,
    source: {
      origin: file.origin,
      tag: file.tag,
      url: file.url,
      publishedAt: file.publishedAt,
      environment: file.environment,
    },
    rows: file.rows,
    runtime: build(cases),
    extraRuntime: build(extraCases),
    reuse,
    serializeAllocatesNothing: cases.serialize.every((info) =>
      ['Nino', 'MemoryPack'].every(
        (lib) => (bytes(`${lib}Serialize${info.key}`) ?? 0) === 0,
      ),
    ),
    payload: {
      name: 'SimpleClass',
      v4: rows.get('NinoSerializeSimpleClass')?.payloadBytes ?? null,
      memorypack:
        rows.get('MemoryPackSerializeSimpleClass')?.payloadBytes ?? null,
      messagepack:
        rows.get('MessagePackSerializeSimpleClass')?.payloadBytes ?? null,
      protobuf: rows.get('ProtobufSerializeSimpleClass')?.payloadBytes ?? null,
    },
    libraries: otherLibs
      .filter((lib) =>
        file.rows.some((row) => row.method.startsWith(lib.prefix)),
      )
      .map((lib) => lib.key),
  };
}

/** The Performance Report (x64), with the v3 comparison */
export const x64 = dataset('x64', bench as BenchFile, V3_RUNTIME.rows);

/** The Arm64 section of the same release; null until a release has one */
export const arm64: BenchDataset | null =
  benchArm64.rows.length > 0
    ? dataset('arm64', benchArm64 as unknown as BenchFile)
    : null;

/** The datasets to show, x64 first (one entry until Arm64 data exists) */
export const datasets: BenchDataset[] = arm64 ? [x64, arm64] : [x64];

// x64, for the headlines and the pages that show one architecture
export const benchSource: BenchSourceInfo = x64.source;
export const benchRows = x64.rows;
export const runtime = x64.runtime;
export const extraRuntime = x64.extraRuntime;
export const reuse = x64.reuse;
export const serializeAllocatesNothing = x64.serializeAllocatesNothing;
export const payload = x64.payload;

/**
 * "Nino v4.0.0, 2026-10-14." — tag and date, linked to the release. With
 * `machine` (the source line of an architecture tab), also the runner and the
 * CPU, OS and .NET of that run.
 */
export function sourceNote(zh: boolean, ds = x64, machine = false) {
  const { tag, publishedAt, environment, origin } = ds.source;
  const parts = [`Nino ${tag}`, publishedAt?.slice(0, 10)].filter(Boolean);
  const text = zh ? `${parts.join('，')}。` : `${parts.join(', ')}.`;
  if (!machine) return text;
  const runner =
    ds.arch === 'arm64' && origin === 'release'
      ? zh
        ? 'GitHub 的 ubuntu-24.04-arm 运行器'
        : "GitHub's ubuntu-24.04-arm runners"
      : null;
  const env = environment ? environmentLabel(environment) : '';
  const machineText = [runner, env].filter(Boolean).join(zh ? '；' : '; ');
  if (!machineText) return text;
  return zh ? `${text}${machineText}。` : `${text} ${machineText}.`;
}

/** Fastest / slowest win against MemoryPack (ignores on-par and losses) */
export function ratioRange(op: 'serialize' | 'deserialize', ds = x64) {
  const wins = ds.runtime[op]
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
export function classRatioRange(op: 'serialize' | 'deserialize', ds = x64) {
  const wins = ds.runtime[op]
    .filter((row) => !structKeys.has(row.key))
    .map((row) => row.ratio)
    .filter((ratio): ratio is number => ratio !== undefined && ratio > 1);
  return { min: Math.min(...wins), max: Math.max(...wins) };
}

/** How many times faster Nino reusing is than MemoryPack overwrite (two decimals, from the raw means) */
export function reuseSpeedup(row: ReuseCase) {
  return (
    Math.round((row.memorypackOverwrite.ns / row.ninoReuse.ns) * 100) / 100
  );
}

/** The reuse case where Nino gains most over MemoryPack's overwrite mode (x64) */
export const bestReuse = x64.reuse.reduce<ReuseCase | undefined>(
  (best, row) => (!best || reuseSpeedup(row) > reuseSpeedup(best) ? row : best),
  undefined,
);

/**
 * The one way to print a ratio. Runtime ratios (computed from the raw means)
 * always show two decimals ("4.33×"); build-time ratios are whole numbers or
 * as published ("221×", "3.1×").
 */
export const formatRatio = (value: number) => `${value.toFixed(2)}×`;
export const formatBuildRatio = (value: number) => `${value}×`;

/* ------------------------------------------------------------------ */
/* Runtimes outside .NET                                               */
/* ------------------------------------------------------------------ */

export type RuntimeLang = 'go' | 'rust' | 'typescript';

interface RuntimeCellData {
  value: number;
  spread?: string;
}

/** The shape of src/data/bench-runtimes.json (scripts/sync-benchmarks.ts, RuntimesFile) */
interface RuntimesFile {
  origin: 'release' | 'fixture' | 'none';
  tag: string;
  url: string;
  publishedAt: string | null;
  languages: {
    lang: RuntimeLang;
    tag: string;
    environment: string | null;
    serializers: string[];
    rows: {
      case: string;
      operation: string;
      kind: 'time' | 'size' | 'allocs';
      cells: Partial<Record<string, RuntimeCellData>>;
    }[];
  }[];
}

/** Column labels of each language's serializers (as the reports name them); Nino's generated code first */
const runtimeLabels: Record<RuntimeLang, Record<string, string>> = {
  go: {
    Nino: 'Nino',
    NinoTags: 'Nino (tags)',
    Protobuf: 'Protobuf',
    MessagePack: 'MessagePack',
    JSON: 'encoding/json',
    Gob: 'gob',
  },
  rust: {
    nino: 'Nino',
    prost: 'Protobuf (prost)',
    'rmp-serde': 'MessagePack (rmp-serde)',
    bincode: 'bincode',
    postcard: 'postcard',
    serde_json: 'serde_json',
  },
  typescript: {
    Nino: 'Nino',
    Protobuf: 'Protobuf (protobuf-es)',
    MessagePack: 'MessagePack (msgpackr)',
    JSON: 'JSON',
  },
};

/** The column every other serializer is compared with: the code nino-gen generates */
const runtimeNino: Record<RuntimeLang, string> = {
  go: 'Nino',
  rust: 'nino',
  typescript: 'Nino',
};

export interface RuntimeTableCell {
  /** As shown: "7.45 µs ±2%", "28.5 KiB", "0" */
  text: string;
  /** Times of the serializers other than Nino: Nino against this one */
  vs?: Versus;
}

export interface RuntimeLangTable {
  lang: RuntimeLang;
  tag: string;
  environment: string | null;
  /** Keys as in the report, with their labels; `nino` marks Nino's columns (Go also has its struct tags) */
  columns: { key: string; label: string; nino: boolean }[];
  rows: {
    case: string;
    operation: string;
    kind: 'time' | 'size' | 'allocs';
    cells: Partial<Record<string, RuntimeTableCell>>;
  }[];
}

/** A size as the reports print it: "640 B", "28.5 KiB" */
function formatRuntimeSize(bytes: number) {
  return bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KiB` : `${bytes} B`;
}

const runtimesFile = benchRuntimes as unknown as RuntimesFile;

/** Where the runtime sections come from; `origin: 'none'` until a release has one */
export const runtimesSource: BenchSourceInfo = {
  origin: runtimesFile.origin,
  tag: runtimesFile.tag,
  url: runtimesFile.url,
  publishedAt: runtimesFile.publishedAt,
  environment: null,
};

/** One table per language the synced release has, in the order Go, Rust, TypeScript */
export const runtimes: RuntimeLangTable[] = runtimesFile.languages.map(
  (section) => {
    const ninoKey = runtimeNino[section.lang];
    const labels = runtimeLabels[section.lang];
    return {
      lang: section.lang,
      tag: section.tag,
      environment: section.environment,
      columns: section.serializers.map((key) => ({
        key,
        label: labels[key] ?? key,
        nino: key.toLowerCase().startsWith('nino'),
      })),
      rows: section.rows.map((row) => {
        const ninoCell = row.cells[ninoKey];
        const cells: Partial<Record<string, RuntimeTableCell>> = {};
        for (const [key, cell] of Object.entries(row.cells)) {
          if (!cell) continue;
          if (row.kind === 'size') {
            cells[key] = { text: formatRuntimeSize(cell.value) };
            continue;
          }
          if (row.kind === 'allocs') {
            cells[key] = { text: cell.value.toLocaleString('en-US') };
            continue;
          }
          const text = `${formatTime(cell.value)}${cell.spread ? ` ${cell.spread}` : ''}`;
          const compared =
            ninoCell && !key.toLowerCase().startsWith('nino')
              ? versus(
                  { text: formatTime(ninoCell.value), ns: ninoCell.value },
                  { text: formatTime(cell.value), ns: cell.value },
                )
              : undefined;
          cells[key] = { text, vs: compared };
        }
        return {
          case: row.case,
          operation: row.operation,
          kind: row.kind,
          cells,
        };
      }),
    };
  },
);

/* ------------------------------------------------------------------ */
/* Unity: Burst kernels in an IL2CPP player                            */
/* ------------------------------------------------------------------ */

/** The shape of src/data/bench-unity.json (scripts/sync-benchmarks.ts, UnityFile) */
interface UnityFile {
  origin: 'release' | 'fixture' | 'none';
  tag: string;
  url: string;
  publishedAt: string | null;
  environment: string | null;
  versions: {
    unity: string;
    rows: {
      case: string;
      operation: string;
      withoutNs: number;
      withNs: number;
    }[];
  }[];
}

export interface UnityCase {
  case: string;
  /** As the report names it: "Serialize", "Deserialize" */
  operation: string;
  without: Measure;
  with: Measure;
  /**
   * Without Burst / with Burst, two decimals; undefined when on par (within
   * 5%) or tooFast; below 1 when the kernels were slower
   */
  speedup?: number;
  /** With Burst under FLOOR_NS, without it above: faster, too fast to measure */
  tooFast?: boolean;
}

export interface UnityVersionTable {
  unity: string;
  rows: UnityCase[];
}

const unityFile = benchUnity as unknown as UnityFile;

/** Where the Unity numbers come from; `origin: 'none'` until a release has the section */
export const unitySource: BenchSourceInfo = {
  origin: unityFile.origin,
  tag: unityFile.tag,
  url: unityFile.url,
  publishedAt: unityFile.publishedAt,
  environment: unityFile.environment,
};

const measure = (ns: number): Measure => ({ text: formatTime(ns), ns });

/** One table per Unity version the synced release measured, in the report's order */
export const unity: UnityVersionTable[] = unityFile.versions.map((version) => ({
  unity: version.unity,
  rows: version.rows.map((row) => {
    // Burst is the side compared with: the ratio is without / with.
    const vs = versus(measure(row.withNs), measure(row.withoutNs));
    return {
      case: row.case,
      operation: row.operation,
      without: measure(row.withoutNs),
      with: measure(row.withNs),
      speedup: vs.ratio,
      tooFast: vs.tooFast,
    };
  }),
}));

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

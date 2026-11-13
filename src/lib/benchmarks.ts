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
 * The other serializers (`otherLibs`: MessagePack-CSharp, protobuf-net,
 * Google.Protobuf, System.Text.Json): their rows of the same reports, by
 * method prefix, in releases since they joined the benchmark; a case a library
 * cannot express has no row. `libraries` lists the ones a dataset has, so pages
 * show their columns only when the synced release measured them. Every
 * comparison goes through `versus()`, with the same FLOOR_NS and on-par rules.
 *
 * Workloads (WorkloadTest, `workloadCases`): payloads shaped like real ones,
 * every library on each. Once the synced report has them (`hasWorkloads`),
 * the headline numbers come from them; until then from SimpleTest and
 * PolymorphicTest, as before.
 *
 * Runtimes outside .NET (Go, Rust, TypeScript): src/data/bench-runtimes.json
 * (`runtimes` below), synced from the runtime sections of the same release.
 *
 * Unity (an IL2CPP player, without and with the Burst kernels):
 * src/data/bench-unity.json (`unity` below), synced from the Unity section of
 * the same release. Speedups are computed here from the two times, with the
 * same FLOOR_NS and on-par rules; the report's own Speedup column is not used.
 *
 * Build time (source generator, v3 3.3.13 vs v4): src/data/bench-build.json
 * (`buildSizes` below), synced from the build section of the same release
 * (v3 3.3.13 and the release's generator one after the other on one runner, at
 * 330 and 1,100 types); until a release has it, the committed file holds a
 * local run (`origin: 'local'`, its `note` names the machine). Ratios are
 * those the section publishes.
 */

import benchBuild from '@/data/bench-build.json';
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
export type OtherLib = 'messagepack' | 'protobuf' | 'googleprotobuf' | 'json';

/** The versions Nino's Directory.Packages.props pins (the `benchmark` skill: update them with an upgrade) */
// In the order the owner chose for every chart and table: the binary serializers closest to Nino first, then both
// Protobuf libraries, then JSON (Nino's README chart, benchmarks/reports/readme.py, uses the same order).
export const otherLibs: {
  key: OtherLib;
  prefix: string;
  label: string;
  version: string;
}[] = [
  {
    key: 'messagepack',
    prefix: 'MessagePack',
    label: 'MessagePack',
    version: '3.1.12',
  },
  // WorkloadTest only, on its own protoc-generated messages (the same values and field numbers as protobuf-net's)
  {
    key: 'googleprotobuf',
    prefix: 'GoogleProtobuf',
    label: 'Google.Protobuf',
    version: '3.36.2',
  },
  {
    key: 'protobuf',
    prefix: 'Protobuf',
    label: 'protobuf-net',
    version: '3.4.40',
  },
  // WorkloadTest only, source-generated, UTF-8; the version is the runtime's
  {
    key: 'json',
    prefix: 'Json',
    label: 'System.Text.Json',
    version: '.NET 10',
  },
];

/** Every serializer Nino is compared with, MemoryPack first */
export type Opponent = 'memorypack' | OtherLib;

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
  /** The other libraries, for the cases they can express */
  others: Partial<Record<OtherLib, Versus>>;
  /** Payload (serialize rows) and bytes allocated per call, per library */
  bytes: Partial<
    Record<
      'v4' | Opponent,
      { payload: number | null; allocated: number | null }
    >
  >;
  /** Marked * in the tables: re-run with more iterations (local snapshot only) */
  rerun?: boolean;
  /** Dominated by gen-2 GC of a 160 KB array (see the footnote) */
  gcBound?: boolean;
}

/** A case of moreCases: MemoryPack is absent where it cannot round-trip the data (BigInteger, BitArray) */
export type TableCase = Omit<RuntimeCase, 'memorypack'> & {
  memorypack?: Measure;
};

const hasMemoryPack = (row: TableCase): row is RuntimeCase =>
  row.memorypack !== undefined;

interface CaseInfo {
  name: string;
  zh?: string;
  code?: boolean;
  key: string;
  gcBound?: boolean;
  /**
   * The method after the library prefix, where it is not `<Verb><key>`
   * (PooledTest, PooledGraphTest): per prefix ("Nino", "MemoryPack", a
   * library's `prefix`), else `method`; null = that library has no such case.
   */
  method?: string | null;
  methods?: Partial<Record<string, string | null>>;
}

/**
 * The main cases (SimpleTest, PolymorphicTest, and the nullable values of
 * NullableTest and CollectionsTest), which v3 3.3.13 ran too: the runtime
 * tables, the basic, polymorphism and nullable groups of dotnetGroups, and the headlines until the
 * workloads take them over. A case shows only when the report has its rows.
 */
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
    // NullableTest and CollectionsTest's nullable collections (every fifth null): reports since they joined
    {
      name: 'Class of 8 nullable fields, half null',
      zh: '8 个可空字段的类，一半为 null',
      key: 'NullableFields',
    },
    {
      name: '100 classes of nullable fields',
      zh: '100 个可空字段的类',
      key: 'NullableFieldsArray',
    },
    { name: 'SimpleStruct?', code: true, key: 'NullableStruct' },
    {
      name: 'SimpleStruct?[100], every fifth null',
      zh: 'SimpleStruct?[100]，每 5 个有 1 个 null',
      key: 'NullableStructs',
    },
    {
      name: 'Null SimpleClass reference',
      zh: '为 null 的 SimpleClass 引用',
      key: 'NullableObject',
    },
    {
      name: 'SimpleClass[100], every fifth null',
      zh: 'SimpleClass[100]，每 5 个有 1 个 null',
      key: 'NullableObjects',
    },
    { name: 'long?[1000]', code: true, key: 'NullableLongs' },
    { name: 'List<int?> (1,000)', code: true, key: 'NullableInts' },
    { name: 'decimal?[1000]', code: true, key: 'NullableDecimals' },
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
    // NullableTest and CollectionsTest's nullable collections (every fifth null): reports since they joined
    {
      name: 'Class of 8 nullable fields, half null',
      zh: '8 个可空字段的类，一半为 null',
      key: 'NullableFields',
    },
    {
      name: '100 classes of nullable fields',
      zh: '100 个可空字段的类',
      key: 'NullableFieldsArray',
    },
    { name: 'SimpleStruct?', code: true, key: 'NullableStruct' },
    {
      name: 'SimpleStruct?[100], every fifth null',
      zh: 'SimpleStruct?[100]，每 5 个有 1 个 null',
      key: 'NullableStructs',
    },
    {
      name: 'Null SimpleClass reference',
      zh: '为 null 的 SimpleClass 引用',
      key: 'NullableObject',
    },
    {
      name: 'SimpleClass[100], every fifth null',
      zh: 'SimpleClass[100]，每 5 个有 1 个 null',
      key: 'NullableObjects',
    },
    { name: 'long?[1000]', code: true, key: 'NullableLongs' },
    { name: 'List<int?> (1,000)', code: true, key: 'NullableInts' },
    { name: 'decimal?[1000]', code: true, key: 'NullableDecimals' },
  ],
};

/**
 * WorkloadTest's workloads, for both operations: the one list of them on the
 * site (pages, tables, chart and headlines all read it). Changing the
 * benchmark's workloads is an edit here.
 */
export const workloadCases: CaseInfo[] = [
  {
    key: 'MediaContent',
    name: 'MediaContent (jvm-serializers)',
    zh: 'MediaContent（jvm-serializers）',
  },
  {
    key: 'StackOverflowPage',
    name: 'Stack Exchange API page, 20 questions',
    zh: 'Stack Exchange API 一页，20 个问题',
  },
  {
    key: 'RpcCall',
    name: 'RPC call, interface result',
    zh: 'RPC 调用，结果为接口',
  },
  {
    key: 'ProfileCache',
    name: 'Cached profile, previous version',
    zh: '缓存的用户资料，上个版本写入',
  },
  {
    key: 'EventStream',
    name: 'Event store page, generic envelopes',
    zh: '事件流，泛型信封',
  },
  {
    key: 'LogBatch',
    name: 'Log batch, 1,000 events',
    zh: '日志批次，1,000 条',
  },
  {
    key: 'StateSnapshot',
    name: 'State-sync snapshot, in place',
    zh: '状态同步快照，读进已有对象',
  },
  {
    key: 'LockstepFrames',
    name: 'Lockstep, 10 frames of 8 players',
    zh: '帧同步，10 帧 × 8 名玩家',
  },
  {
    key: 'AoiUpdate',
    name: 'MMO AOI update, 200 events',
    zh: 'MMO AOI 增量，200 个事件',
  },
  {
    key: 'WorldRegion',
    name: 'SLG map region, shared alliances',
    zh: 'SLG 地图区域，共享联盟',
  },
  {
    key: 'CardBattleLog',
    name: 'Card battle replay, shared cards',
    zh: '卡牌战斗回放，共享卡牌',
  },
  {
    key: 'IdleSave',
    name: 'Idle save, previous version, in place',
    zh: '放置游戏存档，上个版本，读进已有对象',
  },
];

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
/** True once the site has v3 3.3.13 numbers (x64) */
export const hasV3 = Object.keys(V3_RUNTIME.rows).length > 0;

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
      zh: '对象图，追踪 200 个节点',
      key: 'Graph',
    },
    { name: 'TolerantClass', code: true, key: 'TolerantClass' },
    { name: 'TolerantClass[100]', code: true, key: 'TolerantClasses' },
    { name: 'FixedStruct', code: true, key: 'FixedStruct' },
    { name: 'FixedClass', code: true, key: 'FixedClass' },
    { name: 'FixedClass[100]', code: true, key: 'FixedClasses' },
    {
      name: 'Subtypes through a non-generic base, 1,000',
      zh: '非泛型基类型下的子类型，1,000 个',
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
      zh: '对象图，追踪 200 个节点',
      key: 'Graph',
    },
    { name: 'TolerantClass', code: true, key: 'TolerantClass' },
    { name: 'TolerantClass[100]', code: true, key: 'TolerantClasses' },
    { name: 'FixedStruct', code: true, key: 'FixedStruct' },
    { name: 'FixedClass', code: true, key: 'FixedClass' },
    { name: 'FixedClass[100]', code: true, key: 'FixedClasses' },
    {
      name: 'Subtypes through a non-generic base, 1,000',
      zh: '非泛型基类型下的子类型，1,000 个',
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

/** The same cases for both operations; a case shows for an operation only when the report has its rows */
const bothOps = (list: CaseInfo[]) => ({ serialize: list, deserialize: list });

/**
 * The benchmark classes of common types, collections, BCL types, scattered
 * objects and untrusted reads (CommonTypesTest, CollectionsTest, BclTypesTest,
 * ScatteredTest, UntrustedTest), against every library that can express each
 * case. Only the Benchmarks page shows them (`<MoreRuntimeTables set=...>`).
 */
export type MoreSet =
  | 'common'
  | 'collections'
  | 'bcl'
  | 'scattered'
  | 'untrusted';

const moreCases: Record<
  MoreSet,
  Record<'serialize' | 'deserialize', CaseInfo[]>
> = {
  common: bothOps([
    {
      name: 'TreeNode tree, 1,365 nodes',
      zh: 'TreeNode 树，1,365 个节点',
      key: 'Tree',
    },
    { name: 'InventoryItem[1000]', code: true, key: 'Inventory' },
    { name: 'Waypoint[1000]', code: true, key: 'Waypoints' },
    {
      name: 'Dictionary<string, string> (1,000)',
      code: true,
      key: 'StringDictionary',
    },
    // Reports up to v4.0.0-rc.9 (the workloads replaced them)
    { name: 'List<Player> (100)', code: true, key: 'Players' },
    { name: 'List<Order> (100)', code: true, key: 'Orders' },
    { name: 'List<Shape> (1,000)', code: true, key: 'Shapes' },
  ]),
  collections: bothOps([
    { name: 'List<(int, long)>', code: true, key: 'TupleList' },
    { name: 'KeyValuePair<int, int>[]', code: true, key: 'KeyValuePairs' },
    { name: 'HashSet<int>', code: true, key: 'HashSet' },
    { name: 'Dictionary<int, int>', code: true, key: 'IntDictionary' },
    { name: 'Queue<int>', code: true, key: 'Queue' },
    { name: 'LinkedList<int>', code: true, key: 'LinkedList' },
    { name: 'SortedSet<int>', code: true, key: 'SortedSet' },
    { name: 'SortedDictionary<int, int>', code: true, key: 'SortedDictionary' },
    { name: 'SortedList<int, int>', code: true, key: 'SortedList' },
    {
      name: 'ConcurrentDictionary<int, int>',
      code: true,
      key: 'ConcurrentDictionary',
    },
    { name: 'SelfTree', code: true, key: 'SelfTree' },
  ]),
  bcl: bothOps([
    { name: 'BigInteger', code: true, key: 'BigInteger' },
    { name: 'Uri', code: true, key: 'Uri' },
    { name: 'Version', code: true, key: 'Version' },
    { name: 'StringBuilder', code: true, key: 'StringBuilder' },
    { name: 'BitArray', code: true, key: 'BitArray' },
    { name: 'CultureInfo', code: true, key: 'CultureInfo' },
    { name: 'TimeZoneInfo', code: true, key: 'TimeZoneInfo' },
    { name: 'Lazy<string>', code: true, key: 'Lazy' },
    { name: 'Memory<int>', code: true, key: 'Memory' },
    { name: 'ReadOnlySequence<int>', code: true, key: 'ReadOnlySequence' },
    { name: 'ReadOnlyCollection<int>', code: true, key: 'ReadOnlyCollection' },
    { name: 'IReadOnlyList<string>', code: true, key: 'InterfaceStrings' },
    { name: 'ILookup<int, int>', code: true, key: 'Lookup' },
    { name: 'BlockingCollection<int>', code: true, key: 'BlockingCollection' },
    { name: 'ImmutableHashSet<int>', code: true, key: 'ImmutableHashSet' },
    { name: 'ImmutableSortedSet<int>', code: true, key: 'ImmutableSortedSet' },
    { name: 'ImmutableQueue<int>', code: true, key: 'ImmutableQueue' },
    { name: 'ImmutableStack<int>', code: true, key: 'ImmutableStack' },
    {
      name: 'ImmutableDictionary<int, int>',
      code: true,
      key: 'ImmutableDictionary',
    },
    {
      name: 'ImmutableSortedDictionary<int, int>',
      code: true,
      key: 'ImmutableSortedDictionary',
    },
  ]),
  scattered: bothOps([
    {
      name: 'Shapes, shuffled (1M)',
      zh: '形状，打乱顺序（100 万）',
      key: 'ScatteredShapes',
    },
    {
      name: 'Shapes, allocation order (1M)',
      zh: '形状，分配顺序（100 万）',
      key: 'InOrderShapes',
    },
    {
      name: 'Shapes, in cache (8,192)',
      zh: '形状，在缓存中（8,192）',
      key: 'HotShapes',
    },
    {
      name: 'Classes with a string, shuffled (1M)',
      zh: '带字符串的类，打乱顺序（100 万）',
      key: 'ScatteredItems',
    },
    {
      name: 'Classes with a string, shuffled, into an existing array',
      zh: '带字符串的类，打乱顺序，读进已有数组',
      key: 'ScatteredItemsInto',
    },
  ]),
  untrusted: bothOps([
    {
      name: 'List of 1,000 raw structs, Untrusted on',
      zh: '1,000 个原始结构体的列表，开启 Untrusted',
      key: 'UntrustedList',
    },
  ]),
};

/* ------------------------------------------------------------------ */
/* The chart groups of every .NET case                                 */
/* ------------------------------------------------------------------ */

const caseByKey = (list: CaseInfo[], keys: string[]) =>
  keys.flatMap((key) => list.filter((info) => info.key === key));
const caseKeys = (...keys: string[]) =>
  bothOps([
    ...caseByKey(cases.serialize, keys),
    ...caseByKey(extraCases.serialize, keys),
  ]);

/** Reading new objects and reading into existing ones (PooledTest, PooledGraphTest): deserialize only */
const reuseGroupCases: CaseInfo[] = [
  {
    name: 'Pooled class, new objects',
    zh: '池化类，新对象',
    key: 'DeserializeNew',
    method: 'DeserializeNew',
  },
  {
    name: 'Pooled class, into existing objects',
    zh: '池化类，读进已有对象',
    key: 'DeserializePooled',
    method: null,
    methods: { Nino: 'DeserializePooled', MemoryPack: 'DeserializeOverwrite' },
  },
  {
    name: 'Pooled node, new objects',
    zh: '池化节点，新对象',
    key: 'NodeNew',
    method: 'NodeNew',
  },
  {
    name: 'Pooled node, into existing objects',
    zh: '池化节点，读进已有对象',
    key: 'NodePooled',
    method: null,
    methods: { Nino: 'NodePooled', MemoryPack: 'NodeOverwrite' },
  },
  {
    name: 'Pooled leaves, new objects',
    zh: '池化叶子，新对象',
    key: 'LeavesNew',
    method: 'LeavesNew',
  },
  {
    name: 'Pooled leaves, in place',
    zh: '池化叶子，原地复用',
    key: 'LeavesInPlace',
    method: null,
    methods: { Nino: 'LeavesInPlace', MemoryPack: 'LeavesOverwrite' },
  },
  {
    name: 'Pooled leaves, pooled elements',
    zh: '池化叶子，池化元素',
    key: 'LeavesPooledElements',
    method: null,
    methods: { Nino: 'LeavesPooledElements', MemoryPack: 'LeavesOverwrite' },
  },
  {
    name: 'Plain list, new objects',
    zh: '普通列表，新对象',
    key: 'PlainNew',
    method: 'PlainNew',
  },
];

/** ExternalBufferTest: the caller's buffer writer and a segmented sequence */
const externalCases = bothOps([
  {
    name: 'int[1000] into an external writer',
    zh: 'int[1000]，写进外部 writer',
    key: 'ExternalInts',
  },
  {
    name: 'Memory<int> (1,000) into an external writer',
    zh: 'Memory<int>（1,000），写进外部 writer',
    key: 'ExternalMemory',
  },
  {
    name: 'SimpleClass[100] into an external writer',
    zh: 'SimpleClass[100]，写进外部 writer',
    key: 'ExternalClasses',
  },
  {
    name: 'int[1000] from 3 segments',
    zh: 'int[1000]，从 3 段数据读',
    key: 'SegmentedInts',
  },
]);

const join = (...sets: Record<'serialize' | 'deserialize', CaseInfo[]>[]) => ({
  serialize: sets.flatMap((set) => set.serialize),
  deserialize: sets.flatMap((set) => set.deserialize),
});

export type DotnetGroupId =
  | 'workloads'
  | 'basic'
  | 'polymorphism'
  | 'nullable'
  | 'collections'
  | 'reuse'
  | 'tracking'
  | 'others';

/**
 * Every .NET case in eight groups (the owner's, 2026-11-13; Nino's README and
 * release notes chart the same groups, readme.py's GROUPS): the one place
 * the site's grouped charts and their Markdown tables read. A case shows only
 * when the report has its rows; a group with none shows nothing.
 */
export const dotnetGroups: {
  id: DotnetGroupId;
  name: string;
  zh: string;
  cases: Record<'serialize' | 'deserialize', CaseInfo[]>;
}[] = [
  {
    id: 'workloads',
    name: 'Real workloads',
    zh: '真实场景',
    cases: bothOps(workloadCases),
  },
  {
    id: 'basic',
    name: 'Basic types and structs',
    zh: '基础类型与结构体',
    cases: caseKeys(
      'SimpleClass',
      'SimpleClasses',
      'SimpleStruct',
      'SimpleStructs',
      'Vectors',
      'FixedStruct',
      'FixedClass',
      'FixedClasses',
    ),
  },
  {
    id: 'polymorphism',
    name: 'Polymorphism',
    zh: '多态',
    cases: caseKeys(
      'PolymorphicClass',
      'PolymorphicClassArray',
      'PolymorphicFooArray',
      'NonGenericBase',
      'GenericIntBase',
      'GenericUnmanagedTupleBase',
      'GenericManagedTupleBase',
      'GenericSealedClassTupleBase',
      'GenericOpenClassTupleBase',
    ),
  },
  {
    id: 'nullable',
    name: 'Nullable values',
    zh: '可空值',
    cases: bothOps(
      cases.serialize.filter((info) => info.key.startsWith('Nullable')),
    ),
  },
  {
    id: 'collections',
    name: 'Collections and common types',
    zh: '集合与常用类型',
    cases: join(moreCases.collections, moreCases.common, moreCases.bcl),
  },
  {
    id: 'reuse',
    name: 'Reuse and pooling',
    zh: '复用与对象池',
    cases: { serialize: [], deserialize: reuseGroupCases },
  },
  {
    id: 'tracking',
    name: 'Reference tracking and version tolerance',
    zh: '引用追踪与版本容错',
    cases: caseKeys('Graph', 'TolerantClass', 'TolerantClasses'),
  },
  {
    id: 'others',
    name: 'Others',
    zh: '其他',
    cases: join(moreCases.scattered, moreCases.untrusted, externalCases),
  },
];

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
  /** MessagePack and protobuf-net read new instances only (neither can overwrite one) */
  othersNew: Partial<Record<OtherLib, Measure>>;
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
  /** See moreCases */
  more: Record<MoreSet, Record<'serialize' | 'deserialize', TableCase[]>>;
  /** WorkloadTest (workloadCases); empty until a report has it */
  workloads: Record<'serialize' | 'deserialize', RuntimeCase[]>;
  /** Every case of each of dotnetGroups that the report has, MemoryPack or not */
  groups: Record<
    DotnetGroupId,
    Record<'serialize' | 'deserialize', TableCase[]>
  >;
  reuse: ReuseCase[];
  /** True when every serialize case allocated 0 B in both libraries */
  serializeAllocatesNothing: boolean;
  /** Bytes written for one SimpleClass */
  payload: { name: string } & Record<'v4' | Opponent, number | null>;
  /** The other libraries the report has any rows of */
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
    // A library's method of the case, or '' (no row) when it has none
    const of = (prefix: string) => {
      const suffix =
        info.methods?.[prefix] !== undefined
          ? info.methods[prefix]
          : info.method !== undefined
            ? info.method
            : `${verb}${info.key}`;
      return suffix === null ? '' : `${prefix}${suffix}`;
    };
    const nino = rows.get(of('Nino'));
    const v4 = measure(of('Nino'));
    const memorypack = measure(of('MemoryPack'));
    if (!v4 || !nino) return [];
    const v3Row = v3[`${op}:${info.key}`];
    const { ratio, tooFast } = memorypack
      ? versus(v4, memorypack)
      : { ratio: undefined, tooFast: undefined };
    const others: RuntimeCase['others'] = {};
    const sizes = (method: string) => {
      const row = rows.get(method);
      return row
        ? { payload: row.payloadBytes, allocated: row.allocatedBytes }
        : undefined;
    };
    const caseBytes: RuntimeCase['bytes'] = {
      v4: sizes(of('Nino')),
      memorypack: sizes(of('MemoryPack')),
    };
    for (const lib of otherLibs) {
      const time = measure(of(lib.prefix));
      if (time) others[lib.key] = versus(v4, time);
      caseBytes[lib.key] = sizes(of(lib.prefix));
    }
    // A case no other library was measured in compares nothing
    if (!memorypack && Object.keys(others).length === 0) return [];
    const result: TableCase = {
      ...info,
      v4,
      memorypack,
      ratio,
      tooFast,
      others,
      bytes: caseBytes,
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
  const buildAll = (set: Record<'serialize' | 'deserialize', CaseInfo[]>) => ({
    serialize: set.serialize.flatMap((info) => buildCase('serialize', info)),
    deserialize: set.deserialize.flatMap((info) =>
      buildCase('deserialize', info),
    ),
  });
  // The main, extra and workload tables, the charts and the headlines: cases MemoryPack ran
  const build = (set: Record<'serialize' | 'deserialize', CaseInfo[]>) => {
    const all = buildAll(set);
    return {
      serialize: all.serialize.filter(hasMemoryPack),
      deserialize: all.deserialize.filter(hasMemoryPack),
    };
  };

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
          othersNew: Object.fromEntries(
            otherLibs.flatMap((lib) => {
              const time = measure(mpNew.replace(/^MemoryPack/, lib.prefix));
              return time ? [[lib.key, time]] : [];
            }),
          ),
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
    more: Object.fromEntries(
      Object.entries(moreCases).map(([set, list]) => [set, buildAll(list)]),
    ) as BenchDataset['more'],
    workloads: build({ serialize: workloadCases, deserialize: workloadCases }),
    groups: Object.fromEntries(
      dotnetGroups.map((group) => [group.id, buildAll(group.cases)]),
    ) as BenchDataset['groups'],
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
      ...(Object.fromEntries(
        otherLibs.map((lib) => [
          lib.key,
          rows.get(`${lib.prefix}SerializeSimpleClass`)?.payloadBytes ?? null,
        ]),
      ) as Record<OtherLib, number | null>),
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

/** The groups of dotnetGroups that a dataset has cases of (the charts and their Markdown tables) */
export const dotnetGroupsShown = dotnetGroups.filter((group) =>
  datasets.some(
    (ds) =>
      ds.groups[group.id].serialize.length +
        ds.groups[group.id].deserialize.length >
      0,
  ),
);

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
/** The footnote of a case marked gcBound († in the charts) */
export const gcNote = {
  en: '† Vector4[10000] allocates a 160 KB array on the large object heap per call, so it mostly measures gen-2 garbage collections and varies between runs. The copy itself is one memcpy in both.',
  zh: '† Vector4[10000] 每次调用都在大对象堆上分配 160 KB 的数组，测到的主要是第 2 代垃圾回收，每次运行结果都有波动。拷贝本身在两个库里都是一次 memcpy。',
};

export function sourceNote(zh: boolean, ds = x64, machine = false) {
  const { tag, publishedAt, environment, origin } = ds.source;
  const parts = [`Nino ${tag}`, publishedAt?.slice(0, 10)].filter(Boolean);
  const text = zh ? `${parts.join('，')}。` : `${parts.join(', ')}.`;
  if (!machine) return text;
  const runner =
    ds.arch === 'arm64' && origin === 'release'
      ? zh
        ? 'GitHub 的 ubuntu-24.04-arm runner'
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
 * Fastest / slowest win on classes and polymorphic types (the cases that are
 * not unmanaged structs), against MemoryPack or, with `lib`, MessagePack or
 * protobuf-net
 */
export function classRatioRange(
  op: 'serialize' | 'deserialize',
  ds = x64,
  lib?: OtherLib,
) {
  const wins = ds.runtime[op]
    .filter((row) => !structKeys.has(row.key))
    .map((row) => (lib ? row.others[lib]?.ratio : row.ratio))
    .filter((ratio): ratio is number => ratio !== undefined && ratio > 1);
  return { min: Math.min(...wins), max: Math.max(...wins) };
}

/** classRatioRange as prose ("1.23–4.56×"), or '' without data */
export function formatClassRange(
  op: 'serialize' | 'deserialize',
  lib?: OtherLib,
) {
  const { min, max } = classRatioRange(op, x64, lib);
  return Number.isFinite(min) ? `${min.toFixed(2)}–${formatRatio(max)}` : '';
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

/* ------------------------------------------------------------------ */
/* Workloads and the headline                                          */
/* ------------------------------------------------------------------ */

/** True once the synced report (x64) has WorkloadTest's rows: the workload tables then show them */
export const workloadsMeasured = x64.workloads.serialize.length > 0;

/** Nino against one opponent in one case, by the same rule as the tables */
export function versusOf(row: TableCase, lib: Opponent): Versus | undefined {
  if (lib === 'memorypack')
    return row.memorypack
      ? { time: row.memorypack, ratio: row.ratio, tooFast: row.tooFast }
      : undefined;
  return row.others[lib];
}

/** Fastest / slowest win over the workloads against one library (on par and losses left out) */
export function workloadRange(
  op: 'serialize' | 'deserialize',
  lib: Opponent,
  ds = x64,
) {
  const wins = ds.workloads[op]
    .map((row) => versusOf(row, lib)?.ratio)
    .filter((ratio): ratio is number => ratio !== undefined && ratio > 1);
  return { min: Math.min(...wins), max: Math.max(...wins) };
}

/** "1.46–2.83×" (one win: "2.83×"), or '' without a win */
export function formatWorkloadRange(
  op: 'serialize' | 'deserialize',
  lib: Opponent,
) {
  const { min, max } = workloadRange(op, lib);
  if (!Number.isFinite(max)) return '';
  return min === max
    ? formatRatio(max)
    : `${min.toFixed(2)}–${formatRatio(max)}`;
}

/**
 * The headline's "up to" against one library (two decimals, "4.33"), or null:
 * the best workload win once the report has workloads; until then the best
 * win of the main cases (MemoryPack) or of the classes and polymorphic types
 * (the others).
 */
/**
 * True when the headlines come from the workloads: the report has them, and
 * Nino wins at least one workload against every library it measured, in both
 * operations (so no headline reads "up to — faster"). Until then they come
 * from the classes and polymorphic types.
 */
export const hasWorkloads =
  workloadsMeasured &&
  (['memorypack', ...otherLibs.map((lib) => lib.key)] as Opponent[])
    .filter((lib) =>
      x64.workloads.serialize.some((row) => versusOf(row, lib) !== undefined),
    )
    .every((lib) =>
      (['serialize', 'deserialize'] as const).every((op) =>
        Number.isFinite(workloadRange(op, lib).max),
      ),
    );

export function headlineMax(
  op: 'serialize' | 'deserialize',
  lib: Opponent,
): string | null {
  const { max } = hasWorkloads
    ? workloadRange(op, lib)
    : lib === 'memorypack'
      ? ratioRange(op)
      : classRatioRange(op, x64, lib);
  return Number.isFinite(max) ? max.toFixed(2) : null;
}
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
  /** As measured: nanoseconds, bytes or allocations (the charts plot it) */
  value: number;
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
            cells[key] = {
              value: cell.value,
              text: formatRuntimeSize(cell.value),
            };
            continue;
          }
          if (row.kind === 'allocs') {
            cells[key] = {
              value: cell.value,
              text: cell.value.toLocaleString('en-US'),
            };
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
          cells[key] = { value: cell.value, text, vs: compared };
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

/** The keys of the build rows, in the release section's order (scripts/sync-benchmarks.ts, buildRows) */
type BuildKey = 'source' | 'emit' | 'generate' | 'member' | 'comment' | 'il';

/** The shape of src/data/bench-build.json (scripts/sync-benchmarks.ts, BuildFile) */
interface BuildRow {
  key: BuildKey;
  v3: BuildCell;
  v4: BuildCell;
  /** "14× smaller", "on par" or "—", as published */
  ratio: string;
}

interface BuildCell {
  text: string;
  value: number;
  unit: 'MB' | 's';
  lines?: number;
}

interface BuildFile {
  origin: 'release' | 'local' | 'fixture';
  tag: string;
  url: string;
  publishedAt: string | null;
  environment: string | null;
  note: { en: string; zh: string } | null;
  sizes: {
    types: number;
    roots: number;
    measured: { v3: number; v4: number } | null;
    rows: BuildRow[];
  }[];
}

export interface BuildMeasure {
  key: BuildKey;
  en: string;
  zh: string;
  /** Short label for stat cards */
  short: { en: string; zh: string };
  /** As published: "18.7 MB", "42.9 s" (the line count is in `v3Lines`) */
  v3: string;
  v4: string;
  /** In the row's unit (MB or s) */
  v3n: number;
  v4n: number;
  v3Lines?: number;
  v4Lines?: number;
  /**
   * v4 better than v3 by this factor, as published ("14× smaller" -> 14); for
   * "on par" 1, and for "—" (v4 not ahead) v3 / v4 from the published values
   */
  ratio: number;
  /** "better": `ratio` times smaller or faster; "par": within 5%; "none": v4 not ahead */
  verdict: 'better' | 'par' | 'none';
  better: 'smaller' | 'faster';
}

/** One workload of the build benchmark: `types` types from `roots` root classes */
export interface BuildSizeTable {
  types: number;
  roots: number;
  /** How many runs each time is the median of; null for the local run (its note says) */
  measured: { v3: number; v4: number } | null;
  rows: BuildMeasure[];
}

/** Labels of the build rows (the release section's row labels are the English ones) */
const buildLabels: Record<
  BuildKey,
  { en: string; zh: string; short: { en: string; zh: string } }
> = {
  source: {
    en: 'Generated source',
    zh: '生成的源码',
    short: { en: 'smaller generated source', zh: '生成的源码更小' },
  },
  emit: {
    en: 'Compiling the generated code (emit)',
    zh: '编译生成的代码（emit）',
    short: { en: 'faster to compile (emit)', zh: '编译（emit）更快' },
  },
  generate: {
    en: 'Running the generator',
    zh: '运行生成器',
    short: { en: 'faster generator run', zh: '生成器运行更快' },
  },
  member: {
    en: 'Re-generating after editing a member',
    zh: '修改成员后重新生成',
    short: {
      en: 'faster re-generation after editing a member',
      zh: '修改成员后重新生成更快',
    },
  },
  comment: {
    en: 'Re-generating after editing a comment',
    zh: '修改注释后重新生成',
    short: {
      en: 'faster re-generation after editing a comment',
      zh: '修改注释后重新生成更快',
    },
  },
  il: {
    en: 'IL of the generated code',
    zh: '生成代码的 IL',
    short: { en: 'smaller IL', zh: 'IL 更小' },
  },
};

const buildFile = benchBuild as unknown as BuildFile;

/**
 * Where the build numbers come from: a release's build section, or (origin
 * 'local', empty tag and url) the local run the committed file holds until a
 * release has one; `note` describes that run.
 */
export const buildSource: BenchSourceInfo & {
  origin: BuildFile['origin'];
  note: BuildFile['note'];
} = {
  origin: buildFile.origin,
  tag: buildFile.tag,
  url: buildFile.url,
  publishedAt: buildFile.publishedAt,
  environment: buildFile.environment,
  note: buildFile.note,
};

/** "14× smaller" -> 14; "on par" -> 1; "—" -> v3 / v4 */
function buildRatio(row: BuildRow): Pick<BuildMeasure, 'ratio' | 'verdict'> {
  const published = /^([\d.]+)×/.exec(row.ratio.replace(/\*\*/g, '').trim());
  if (published) return { ratio: Number(published[1]), verdict: 'better' };
  if (/on par/i.test(row.ratio)) return { ratio: 1, verdict: 'par' };
  return { ratio: row.v3.value / row.v4.value, verdict: 'none' };
}

/** The display text of a size cell without its line count: "18.7 MB" */
const cellText = (text: string) => text.replace(/\s*\(.*\)$/, '');

/** Every workload of the build benchmark (v4 vs v3 3.3.13), fewest types first */
export const buildSizes: BuildSizeTable[] = buildFile.sizes.map((size) => ({
  types: size.types,
  roots: size.roots,
  measured: size.measured,
  rows: size.rows.map((row) => ({
    key: row.key,
    ...buildLabels[row.key],
    v3: cellText(row.v3.text),
    v4: cellText(row.v4.text),
    v3n: row.v3.value,
    v4n: row.v4.value,
    v3Lines: row.v3.lines,
    v4Lines: row.v4.lines,
    ...buildRatio(row),
    better: row.v3.unit === 's' ? 'faster' : 'smaller',
  })),
}));

/** The smallest workload (330 types, N = 30): the rows of the compile chart */
export const buildSmall = buildSizes[0];

/** Its rows, v4 vs v3 3.3.13 */
export const build: BuildMeasure[] = buildSmall?.rows ?? [];

/** The largest workload (1,100 types, N = 100): the home page's build numbers */
export const buildLarge = buildSizes[buildSizes.length - 1];

/** One row of a workload, by key */
export const buildRow = (size: BuildSizeTable | undefined, key: BuildKey) =>
  size?.rows.find((row) => row.key === key);

/**
 * "14× smaller" / "小 14 倍", "on par" / "持平", or "—": the build ratio as the
 * tables and charts print it
 */
export function buildRatioText(row: BuildMeasure, zh: boolean) {
  if (row.verdict === 'par') return zh ? '持平' : 'on par';
  if (row.verdict === 'none') return '—';
  if (zh) return `${row.better === 'smaller' ? '小' : '快'} ${row.ratio} 倍`;
  return `${row.ratio}× ${row.better}`;
}

/** As Nino's generator_report.py writes a ratio: one decimal below 10, whole from 10 */
export const buildDecimals = (value: number) =>
  value < 10 ? value.toFixed(1) : value.toFixed(0);

/**
 * The source line of the build tables and chart: the release, its date and
 * runner, or the local run's note.
 */
export function buildSourceNote(zh: boolean): string {
  if (buildSource.note) return zh ? buildSource.note.zh : buildSource.note.en;
  const parts = [
    `Nino ${buildSource.tag}`,
    buildSource.publishedAt?.slice(0, 10),
  ].filter(Boolean);
  const env = buildSource.environment ?? '';
  if (zh)
    return `${parts.join('，')}。v3 3.3.13 和 v4 在同一台 GitHub runner 上先后运行${env ? `：${env}` : ''}。`;
  return `${parts.join(', ')}. v3 3.3.13 and v4 ran one after the other on one GitHub runner${env ? `: ${env}` : ''}.`;
}

/* ------------------------------------------------------------------ */
/* Headline numbers                                                    */
/* ------------------------------------------------------------------ */

/** Best serialize win over MemoryPack, two decimals ("4.33"), from the raw means */
export const headlineSerialize = headlineMax('serialize', 'memorypack');

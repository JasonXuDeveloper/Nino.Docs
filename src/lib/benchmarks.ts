/**
 * Every benchmark number the site shows (home page, What's New, v3 vs v4,
 * Nino vs MemoryPack, Benchmarks). Keep in sync with docs/v4-benchmarks.md in
 * the Nino repository; the MDX tables repeat these numbers.
 *
 * Runtime: BenchmarkDotNet 0.15.2, .NET 10.0.13, server GC, v4 and MemoryPack
 * 1.21.4 in the same run. "v4 vs v3" compares the v4 / MemoryPack ratio with
 * the v3 (3.3.13) / MemoryPack ratio of a separate run on the same machine.
 * Build time: src/Nino.GeneratorBenchmark, 330 types (N = 30), v3 = 3.3.13.
 *
 * Times are kept as published ("17.0 µs") and parsed to nanoseconds.
 */

export interface Measure {
  /** As published, e.g. "1,129 ns" */
  text: string;
  /** In nanoseconds */
  ns: number;
}

const unitNs = { ns: 1, µs: 1e3, ms: 1e6, s: 1e9 } as const;

function t(text: string): Measure {
  const match = /^([\d,.]+) (ns|µs|ms|s)$/.exec(text);
  if (!match) throw new Error(`Bad time: ${text}`);
  const value = Number.parseFloat(match[1].replace(/,/g, ''));
  return { text, ns: value * unitNs[match[2] as keyof typeof unitNs] };
}

export const formatBytes = (bytes: number) =>
  `${bytes.toLocaleString('en-US')} B`;

/* ------------------------------------------------------------------ */
/* Runtime                                                             */
/* ------------------------------------------------------------------ */

export interface RuntimeCase {
  /** Benchmark case; `code` cases are type names and render in monospace */
  name: string;
  zh?: string;
  code?: boolean;
  v4: Measure;
  memorypack: Measure;
  /** v4 vs MemoryPack as published; undefined = on par; < 1 = MemoryPack faster */
  ratio?: number;
  /** v4 vs v3 3.3.13 as published; 1 = on par; undefined = no v3 case */
  vsV3?: number;
  /** Re-run with 20 iterations (marked * in the tables) */
  rerun?: boolean;
  /** Dominated by gen-2 GC of a 160 KB array (see the footnote) */
  gcBound?: boolean;
}

export const runtime: Record<'serialize' | 'deserialize', RuntimeCase[]> = {
  serialize: [
    {
      name: 'SimpleClass',
      code: true,
      v4: t('151 ns'),
      memorypack: t('450 ns'),
      ratio: 2.97,
      vsV3: 1.73,
    },
    {
      name: 'SimpleClass[100]',
      code: true,
      v4: t('17.0 µs'),
      memorypack: t('48.7 µs'),
      ratio: 2.86,
      vsV3: 1.29,
    },
    {
      name: 'Polymorphic class',
      zh: '多态类',
      v4: t('11.5 µs'),
      memorypack: t('31.5 µs'),
      ratio: 2.72,
    },
    {
      name: 'Polymorphic class array',
      zh: '多态类数组',
      v4: t('89.6 µs'),
      memorypack: t('388 µs'),
      ratio: 4.33,
    },
    {
      name: 'Polymorphic Foo[]',
      zh: '多态 Foo[]',
      v4: t('9.9 µs'),
      memorypack: t('31.4 µs'),
      ratio: 3.15,
    },
    {
      name: 'SimpleStruct',
      code: true,
      v4: t('2.3 ns'),
      memorypack: t('5.8 ns'),
      ratio: 2.5,
      vsV3: 1.35,
    },
    {
      name: 'SimpleStruct[100]',
      code: true,
      v4: t('28.6 ns'),
      memorypack: t('30.6 ns'),
      ratio: 1.07,
      vsV3: 1,
      rerun: true,
    },
    {
      name: 'Vector4[10000]',
      code: true,
      v4: t('4.06 µs'),
      memorypack: t('4.10 µs'),
      vsV3: 1,
      rerun: true,
    },
  ],
  deserialize: [
    {
      name: 'SimpleClass',
      code: true,
      v4: t('964 ns'),
      memorypack: t('1,129 ns'),
      ratio: 1.17,
      vsV3: 1.19,
    },
    {
      name: 'SimpleClass[100]',
      code: true,
      v4: t('106 µs'),
      memorypack: t('134 µs'),
      ratio: 1.26,
      vsV3: 1.22,
    },
    {
      name: 'Polymorphic class',
      zh: '多态类',
      v4: t('36.3 µs'),
      memorypack: t('44.8 µs'),
      ratio: 1.23,
      rerun: true,
    },
    {
      name: 'Polymorphic class array',
      zh: '多态类数组',
      v4: t('406 µs'),
      memorypack: t('562 µs'),
      ratio: 1.38,
    },
    {
      name: 'Polymorphic Foo[]',
      zh: '多态 Foo[]',
      v4: t('37.0 µs'),
      memorypack: t('43.1 µs'),
      ratio: 1.16,
    },
    {
      name: 'SimpleStruct[100]',
      code: true,
      v4: t('295 ns'),
      memorypack: t('295 ns'),
      vsV3: 1,
      rerun: true,
    },
    {
      name: 'Vector4[10000]',
      code: true,
      v4: t('173 µs'),
      memorypack: t('147 µs'),
      ratio: 0.85,
      vsV3: 0.9,
      rerun: true,
      gcBound: true,
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

export const reuse: ReuseCase[] = [
  {
    name: 'Pooled node',
    zh: '池化节点',
    ninoNew: t('873 ns'),
    ninoReuse: t('280 ns'),
    ninoReuseBytes: 0,
    memorypackNew: t('952 ns'),
    memorypackOverwrite: t('727 ns'),
    memorypackOverwriteBytes: 1024,
  },
  {
    name: 'Pooled leaves, in place',
    zh: '池化叶子，原地复用',
    ninoNew: t('5.23 µs'),
    ninoReuse: t('1.18 µs'),
    ninoReuseBytes: 0,
    memorypackNew: t('5.38 µs'),
    memorypackOverwrite: t('5.80 µs'),
    memorypackOverwriteBytes: 12800,
  },
  {
    name: 'Pooled leaves, pooled elements',
    zh: '池化叶子，池化元素',
    ninoNew: t('5.23 µs'),
    ninoReuse: t('3.82 µs'),
    ninoReuseBytes: 856,
    memorypackNew: t('5.38 µs'),
    memorypackOverwrite: t('5.80 µs'),
    memorypackOverwriteBytes: 12800,
  },
  {
    name: 'Pooled class',
    zh: '池化类',
    ninoNew: t('780 ns'),
    ninoReuse: t('623 ns'),
    ninoReuseBytes: 1080,
    memorypackNew: t('1,044 ns'),
    memorypackOverwrite: t('857 ns'),
    memorypackOverwriteBytes: 1080,
  },
];

/** How many times faster Nino reusing is than MemoryPack overwrite (2.6, 4.9, ...) */
export function reuseSpeedup(row: ReuseCase) {
  return Math.round((row.memorypackOverwrite.ns / row.ninoReuse.ns) * 10) / 10;
}

/* ------------------------------------------------------------------ */
/* Payload size                                                        */
/* ------------------------------------------------------------------ */

/** Bytes written for one SimpleClass */
export const payload = { name: 'SimpleClass', v4: 1146, memorypack: 1148 };

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

/* ------------------------------------------------------------------ */
/* Derived views for the race bars (times normalized to MemoryPack)    */
/* ------------------------------------------------------------------ */

export interface CompareRow {
  name: string;
  /** Normalized times (MemoryPack = 1.00, lower is faster) */
  v4: number;
  memorypack: number;
  /** Approximate: the v4 time multiplied by the published v4-vs-v3 ratio */
  v3?: number;
  /** Published v4 vs MemoryPack ratio; undefined = on par */
  ratio?: number;
  /** Published v4 vs v3 ratio (1 = on par) */
  vsV3?: number;
  /** Shown instead of the normalized number, e.g. "280 ns · 0 B" */
  detail?: { v4: string; memorypack: string };
}

const round = (value: number) => Math.round(value * 1000) / 1000;

function normalized(row: RuntimeCase): CompareRow {
  const v4 = round(row.v4.ns / row.memorypack.ns);
  return {
    name: row.name,
    v4,
    memorypack: 1,
    v3: row.vsV3 === undefined ? undefined : round(v4 * row.vsV3),
    ratio: row.ratio,
    vsV3: row.vsV3,
  };
}

/** Cases measured against v3 too (v3's benchmarks have no polymorphic cases) */
export const vsV3Runtime = {
  serialize: runtime.serialize
    .filter((row) => row.vsV3 !== undefined)
    .map(normalized),
  deserialize: runtime.deserialize
    .filter((row) => row.vsV3 !== undefined)
    .map(normalized),
};

export const vsMemoryPack = {
  serialize: runtime.serialize.map(normalized),
  deserialize: runtime.deserialize.map(normalized),
  /** Nino reusing vs MemoryPack overwrite, normalized to MemoryPack overwrite */
  reuse: reuse.map(
    (row): CompareRow => ({
      name: row.name,
      v4: round(row.ninoReuse.ns / row.memorypackOverwrite.ns),
      memorypack: 1,
      ratio: reuseSpeedup(row),
      detail: {
        v4: `${row.ninoReuse.text} · ${formatBytes(row.ninoReuseBytes)}`,
        memorypack: `${row.memorypackOverwrite.text} · ${formatBytes(row.memorypackOverwriteBytes)}`,
      },
    }),
  ),
};

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

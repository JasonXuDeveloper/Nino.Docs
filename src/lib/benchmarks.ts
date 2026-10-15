/**
 * Benchmark numbers shown on the home page and on "What's New in v4".
 *
 * v4 vs MemoryPack 1.21.4: docs/v4-benchmarks.md in the Nino repository
 * (BenchmarkDotNet, .NET 10, same run).
 * v4 vs v3 (3.3.13): ratios from a separate back-to-back run of v4 and v3 3.3.13.
 *
 * Times are normalized to MemoryPack = 1.00 (lower is faster). The v3 bars are
 * the v4 time multiplied by the v4-vs-v3 ratio, so they are approximate.
 */

export interface CompareRow {
  /** Benchmark case */
  name: string;
  /** Normalized times (MemoryPack = 1.00) */
  v4: number;
  memorypack: number;
  v3?: number;
  /**
   * v4 vs MemoryPack as published in the benchmark tables (computed from the
   * unrounded times, so it can differ from the bars in the last digit).
   * Undefined: on par.
   */
  ratio?: number;
  /** v4 faster than v3 3.3.13, as published (1 = on par) */
  vsV3?: number;
}

const round = (value: number) => Math.round(value * 1000) / 1000;

function row(
  name: string,
  v4Time: number,
  memoryPackTime: number,
  v4FasterThanV3?: number,
  ratio?: number,
): CompareRow {
  const v4 = round(v4Time / memoryPackTime);
  return {
    name,
    v4,
    memorypack: 1,
    v3: v4FasterThanV3 === undefined ? undefined : round(v4 * v4FasterThanV3),
    ratio,
    vsV3: v4FasterThanV3,
  };
}

/** v4, v3 3.3.13 and MemoryPack on the cases measured against all three */
export const vsV3Runtime = {
  serialize: [
    row('SimpleClass', 151, 450, 1.73, 2.97),
    row('SimpleClass[100]', 17.0, 48.7, 1.29, 2.86),
    row('SimpleStruct', 2.3, 5.8, 1.35, 2.5),
    row('SimpleStruct[100]', 28.6, 30.6, 1, 1.07), // on par with v3
  ],
  deserialize: [
    row('SimpleClass', 964, 1129, 1.19, 1.17),
    row('SimpleClass[100]', 106, 134, 1.22, 1.26),
  ],
};

/** v4 vs MemoryPack 1.21.4, every case of docs/v4-benchmarks.md */
export const vsMemoryPack = {
  serialize: [
    row('SimpleClass', 151, 450, undefined, 2.97),
    row('SimpleClass[100]', 17.0, 48.7, undefined, 2.86),
    row('Polymorphic class', 11.5, 31.5, undefined, 2.72),
    row('Polymorphic class array', 89.6, 388, undefined, 4.33),
    row('Polymorphic Foo[]', 9.9, 31.4, undefined, 3.15),
    row('SimpleStruct', 2.3, 5.8, undefined, 2.5),
    row('SimpleStruct[100]', 28.6, 30.6, undefined, 1.07),
    row('Vector4[10000]', 4.06, 4.1),
  ],
  deserialize: [
    row('SimpleClass', 964, 1129, undefined, 1.17),
    row('SimpleClass[100]', 106, 134, undefined, 1.26),
    row('Polymorphic class', 36.3, 44.8, undefined, 1.23),
    row('Polymorphic class array', 406, 562, undefined, 1.38),
    row('Polymorphic Foo[]', 37.0, 43.1, undefined, 1.16),
    row('SimpleStruct[100]', 295, 295),
    row('Vector4[10000]', 173, 147, undefined, 0.85),
  ],
  // Deserializing into existing instances: Nino reusing vs MemoryPack overwrite
  reuse: [
    row('Pooled node', 280, 727, undefined, 2.6),
    row('Pooled leaves, in place', 1.18, 5.8, undefined, 4.9),
    row('Pooled class', 623, 857, undefined, 1.38),
  ],
};

/** v4 vs v3 3.3.13, source generator benchmark with 330 types (N = 30) */
export const vsV3Build = [
  { value: '16×', en: 'smaller generated source', zh: '生成的源码更小' },
  { value: '44×', en: 'faster to compile (emit)', zh: '编译（emit）更快' },
  { value: '7.9×', en: 'faster generator run', zh: '生成器运行更快' },
  {
    value: '6–7×',
    en: 'faster re-generation after an edit',
    zh: '修改后重新生成更快',
  },
  { value: '6×', en: 'smaller IL', zh: 'IL 更小' },
];

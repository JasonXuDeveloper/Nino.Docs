## What's Changed

* Test fixture for scripts/sync-benchmarks.ts. The numbers below are made up.

## 📊 Performance Report

<details>
<summary>Click to expand benchmark results</summary>

```

BenchmarkDotNet v0.15.2, Linux Ubuntu 24.04.2 LTS (Noble Numbat)
AMD EPYC 7763 2.45GHz, 1 CPU, 4 logical and 2 physical cores
.NET SDK 10.0.100
  [Host]     : .NET 10.0.0 (10.0.25.52411), X64 RyuJIT AVX2
  DefaultJob : .NET 10.0.0 (10.0.25.52411), X64 RyuJIT AVX2


```
| Type             | Method                                   | Categories                   | Mean          | Error       | Min           | Max           | Ratio | Gen0   | Allocated | Alloc Ratio | Payload  |
|----------------- |----------------------------------------- |----------------------------- |--------------:|------------:|--------------:|--------------:|------:|-------:|----------:|------------:|---------:|
| SimpleTest       | **NinoSerializeSimpleClass**             | SimpleClassSerialize         |     200.10 ns |    1.002 ns |     198.00 ns |     202.00 ns |  1.00 |      - |         - |          NA |  1,146 B |
| SimpleTest       | MemoryPackSerializeSimpleClass           | SimpleClassSerialize         |     600.40 ns |    2.110 ns |     596.00 ns |     604.00 ns |  3.00 |      - |         - |          NA |  1,148 B |
| SimpleTest       | MessagePackSerializeSimpleClass          | SimpleClassSerialize         |   1,800.00 ns |   10.000 ns |   1,790.00 ns |   1,810.00 ns |  9.00 |      - |         - |          NA |  1,300 B |
|                  |                                          |                              |               |             |               |               |       |        |           |             |          |
| SimpleTest       | NinoDeserializeSimpleClass               | SimpleClassDeserialize       |   1,000.00 ns |    5.000 ns |     990.00 ns |   1,010.00 ns |  1.00 | 0.1000 |    3.2 KB |        1.00 |        ? |
| SimpleTest       | MemoryPackDeserializeSimpleClass         | SimpleClassDeserialize       |   1,250.00 ns |    6.000 ns |   1,240.00 ns |   1,260.00 ns |  1.25 | 0.1000 |    3.2 KB |        1.00 |        ? |
|                  |                                          |                              |               |             |               |               |       |        |           |             |          |
| SimpleTest       | NinoSerializeVectors                     | VectorsSerialize             |      5.000 μs |   0.0500 μs |      4.950 μs |      5.050 μs |  1.00 |      - |         - |          NA | 160,005 B |
| SimpleTest       | MemoryPackSerializeVectors               | VectorsSerialize             |      5.100 μs |   0.0500 μs |      5.050 μs |      5.150 μs |  1.02 |      - |         - |          NA | 160,005 B |
|                  |                                          |                              |               |             |               |               |       |        |           |             |          |
| PolymorphicTest  | NinoSerializePolymorphicClassArray       | PolymorphicClassArraySerialize |    100.00 μs |    0.500 μs |     99.00 μs |    101.00 μs |  1.00 |      - |         - |          NA | 52.5 KB |
| PolymorphicTest  | MemoryPackSerializePolymorphicClassArray | PolymorphicClassArraySerialize |    450.00 μs |    2.000 μs |    448.00 μs |    452.00 μs |  4.50 |      - |         - |          NA | 51.0 KB |
|                  |                                          |                              |               |             |               |               |       |        |           |             |          |
| PooledGraphTest  | NinoLeavesInPlace                        | Leaves                       |      1.200 μs |   0.0100 μs |      1.190 μs |      1.210 μs |  0.23 |      - |         - |        0.00 |        ? |
| PooledGraphTest  | MemoryPackLeavesOverwrite                | Leaves                       |      6.000 μs |   0.0500 μs |      5.950 μs |      6.050 μs |  1.15 | 0.7500 |   12.5 KB |        1.00 |        ? |
| PooledGraphTest  | NinoLeavesNew                            | Leaves                       |      5.200 μs |   0.0500 μs |      5.150 μs |      5.250 μs |  1.00 | 0.7500 |   12.5 KB |        1.00 |        ? |
|                  |                                          |                              |               |             |               |               |       |        |           |             |          |
| ExtraTest        | NinoSerializeSimpleClasses               | Extra                        |      987.6 ns |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | MemoryPackSerializeSimpleClasses         | Extra                        |      12.34 ns |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | NinoSerializePolymorphicClass            | Extra                        |      12.34 ns |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | MemoryPackSerializePolymorphicClass      | Extra                        |      45.67 μs |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | NinoSerializePolymorphicFooArray         | Extra                        |      45.67 μs |    0.100 ns |             - |             - |  1.00 |      - |         - |          NA |        ? |
| ExtraTest        | MemoryPackSerializePolymorphicFooArray   | Extra                        |      12.34 ns |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | NinoSerializeSimpleStruct                | Extra                        |      12.34 ns |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | MemoryPackSerializeSimpleStruct          | Extra                        |      45.67 μs |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | NinoSerializeSimpleStructs               | Extra                        |      12.34 ns |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | MemoryPackSerializeSimpleStructs         | Extra                        |      45.67 μs |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | NinoDeserializeSimpleClasses             | Extra                        |      987.6 ns |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | MemoryPackDeserializeSimpleClasses       | Extra                        |      12.34 ns |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | NinoDeserializePolymorphicClass          | Extra                        |      12.34 ns |    0.100 ns |             - |             - |  1.00 |      - |         - |          NA |        ? |
| ExtraTest        | MemoryPackDeserializePolymorphicClass    | Extra                        |      12.34 ns |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | NinoDeserializePolymorphicClassArray     | Extra                        |      1.234 ms |    0.100 ns |             - |             - |  1.00 |      - |         - |          NA |        ? |
| ExtraTest        | MemoryPackDeserializePolymorphicClassArray | Extra                        |      45.67 μs |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | NinoDeserializePolymorphicFooArray       | Extra                        |      987.6 ns |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | MemoryPackDeserializePolymorphicFooArray | Extra                        |      12.34 ns |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | NinoDeserializeSimpleStructs             | Extra                        |      987.6 ns |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | MemoryPackDeserializeSimpleStructs       | Extra                        |      45.67 μs |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | NinoDeserializeVectors                   | Extra                        |      987.6 ns |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | MemoryPackDeserializeVectors             | Extra                        |      987.6 ns |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | NinoNodeNew                              | Extra                        |      987.6 ns |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | NinoNodePooled                           | Extra                        |      2.345 μs |    0.100 ns |             - |             - |  1.00 |      - |         - |          NA |        ? |
| ExtraTest        | MemoryPackNodeNew                        | Extra                        |      45.67 μs |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | MemoryPackNodeOverwrite                  | Extra                        |      12.34 ns |    0.100 ns |             - |             - |  1.00 |      - |         - |          NA |        ? |
| ExtraTest        | NinoLeavesPooledElements                 | Extra                        |      2.345 μs |    0.100 ns |             - |             - |  1.00 |      - |         - |          NA |        ? |
| ExtraTest        | MemoryPackLeavesNew                      | Extra                        |      2.345 μs |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | NinoDeserializeNew                       | Extra                        |      1.234 ms |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | NinoDeserializePooled                    | Extra                        |      1.234 ms |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |
| ExtraTest        | MemoryPackDeserializeNew                 | Extra                        |      987.6 ns |    0.100 ns |             - |             - |  1.00 |      - |   1.05 KB |          NA |        ? |
| ExtraTest        | MemoryPackDeserializeOverwrite           | Extra                        |      2.345 μs |    0.100 ns |             - |             - |  1.00 |      - |     856 B |          NA |        ? |

</details>

---
*Benchmark generated automatically on 2026-10-14 12:00:00 UTC*

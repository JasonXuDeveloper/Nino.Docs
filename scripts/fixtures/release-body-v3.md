## What's Changed

* Test fixture for scripts/sync-benchmarks.ts. The numbers below are made up.

## 📊 v3 3.3.13 vs v4 (same machine)

<details>
<summary>Nino v3 3.3.13 (NuGet) against v4.0.1, back to back on the same runner</summary>

`benchmarks/v3` (the same `SimpleTest`, built against Nino 3.3.13 from nuget.org) ran before and after the v4
run below, in the same job on the same runner, with the same BenchmarkDotNet settings
(`--launchCount 1 --warmupCount 5 --iterationCount 15`). MemoryPack runs in both, so its two columns show how much the runner moved.

### v4 vs v3 (v3 run before v4)

| case                             | v3 3.3.13 | v4        | v4 vs v3 | MemoryPack (v4 run) | MemoryPack (v3 run) |
|----------------------------------|----------:|----------:|---------:|--------------------:|--------------------:|
| SerializeSimpleClass             | 260.00 ns | 200.10 ns |    0.77x |           600.40 ns |           600.00 ns |
| SerializeVectors                 |   4.44 μs |   5.00 μs |    1.13x |             5.10 μs |             5.10 μs |
| SerializePolymorphicClassArray   |         - | 100.00 μs |        - |           450.00 μs |                   - |
| SerializeSimpleClasses           |  24.50 μs | 987.60 ns |    0.04x |            12.34 ns |            60.10 μs |
| SerializePolymorphicClass        |         - |  12.34 ns |        - |            45.67 μs |                   - |
| SerializePolymorphicFooArray     |         - |  45.67 μs |        - |            12.34 ns |                   - |
| SerializeSimpleStruct            |   1.71 ns |  12.34 ns |    7.22x |            45.67 μs |             2.10 ns |
| SerializeSimpleStructs           |  15.82 ns |  12.34 ns |    0.78x |            45.67 μs |            18.30 ns |
| DeserializeSimpleClass           |   1.05 μs |   1.00 μs |    0.95x |             1.25 μs |             1.25 μs |
| LeavesInPlace                    |         - |   1.20 μs |        - |                   - |                   - |
| LeavesNew                        |         - |   5.20 μs |        - |             2.35 μs |                   - |
| DeserializeSimpleClasses         |  67.70 μs | 987.60 ns |    0.01x |            12.34 ns |            80.20 μs |
| DeserializePolymorphicClass      |         - |  12.34 ns |        - |            12.34 ns |                   - |
| DeserializePolymorphicClassArray |         - |   1.23 ms |        - |            45.67 μs |                   - |
| DeserializePolymorphicFooArray   |         - | 987.60 ns |        - |            12.34 ns |                   - |
| DeserializeSimpleStructs         | 141.70 ns | 987.60 ns |    6.97x |            45.67 μs |           150.00 ns |
| DeserializeVectors               | 127.20 μs | 987.60 ns |    0.01x |           987.60 ns |           126.00 μs |
| NodeNew                          |         - | 987.60 ns |        - |            45.67 μs |                   - |
| NodePooled                       |         - |   2.35 μs |        - |                   - |                   - |
| LeavesPooledElements             |         - |   2.35 μs |        - |                   - |                   - |
| DeserializeNew                   |         - |   1.23 ms |        - |           987.60 ns |                   - |
| DeserializePooled                |         - |   1.23 ms |        - |                   - |                   - |

v4 vs v3 = mean(v4) / mean(v3); below 1.00x means v4 is faster.
MemoryPack drift (v4 run / v3 run): min 0.00x, max 21747.62x (same code in both runs; the spread is the noise floor of this comparison).

### v4 vs v3 (v3 run after v4)

| case                             | v3 3.3.13 | v4        | v4 vs v3 | MemoryPack (v4 run) | MemoryPack (v3 run) |
|----------------------------------|----------:|----------:|---------:|--------------------:|--------------------:|
| SerializeSimpleClass             | 270.40 ns | 200.10 ns |    0.74x |           600.40 ns |           624.00 ns |
| SerializeVectors                 |   4.62 μs |   5.00 μs |    1.08x |             5.10 μs |             5.30 μs |
| SerializePolymorphicClassArray   |         - | 100.00 μs |        - |           450.00 μs |                   - |
| SerializeSimpleClasses           |  25.48 μs | 987.60 ns |    0.04x |            12.34 ns |            62.50 μs |
| SerializePolymorphicClass        |         - |  12.34 ns |        - |            45.67 μs |                   - |
| SerializePolymorphicFooArray     |         - |  45.67 μs |        - |            12.34 ns |                   - |
| SerializeSimpleStruct            |   1.78 ns |  12.34 ns |    6.93x |            45.67 μs |             2.18 ns |
| SerializeSimpleStructs           |  16.45 ns |  12.34 ns |    0.75x |            45.67 μs |            19.03 ns |
| DeserializeSimpleClass           |   1.09 μs |   1.00 μs |    0.92x |             1.25 μs |             1.30 μs |
| LeavesInPlace                    |         - |   1.20 μs |        - |                   - |                   - |
| LeavesNew                        |         - |   5.20 μs |        - |             2.35 μs |                   - |
| DeserializeSimpleClasses         |  70.41 μs | 987.60 ns |    0.01x |            12.34 ns |            83.41 μs |
| DeserializePolymorphicClass      |         - |  12.34 ns |        - |            12.34 ns |                   - |
| DeserializePolymorphicClassArray |         - |   1.23 ms |        - |            45.67 μs |                   - |
| DeserializePolymorphicFooArray   |         - | 987.60 ns |        - |            12.34 ns |                   - |
| DeserializeSimpleStructs         | 147.37 ns | 987.60 ns |    6.70x |            45.67 μs |           156.00 ns |
| DeserializeVectors               | 132.29 μs | 987.60 ns |    0.01x |           987.60 ns |           131.04 μs |
| NodeNew                          |         - | 987.60 ns |        - |            45.67 μs |                   - |
| NodePooled                       |         - |   2.35 μs |        - |                   - |                   - |
| LeavesPooledElements             |         - |   2.35 μs |        - |                   - |                   - |
| DeserializeNew                   |         - |   1.23 ms |        - |           987.60 ns |                   - |
| DeserializePooled                |         - |   1.23 ms |        - |                   - |                   - |

v4 vs v3 = mean(v4) / mean(v3); below 1.00x means v4 is faster.
MemoryPack drift (v4 run / v3 run): min 0.00x, max 20949.54x (same code in both runs; the spread is the noise floor of this comparison).

### v3 3.3.13 report (run before v4)

```

BenchmarkDotNet v0.15.2, Linux Ubuntu 24.04.2 LTS (Noble Numbat)
AMD EPYC 7763 2.45GHz, 1 CPU, 4 logical and 2 physical cores
.NET SDK 10.0.100
  [Host]             : .NET 10.0.0 (10.0.25.52411), X64 RyuJIT AVX2
  ShortRun-.NET 10.0 : .NET 10.0.0 (10.0.25.52411), X64 RyuJIT AVX2

Job=ShortRun-.NET 10.0  Runtime=.NET 10.0  Server=True  
IterationCount=15  LaunchCount=1  WarmupCount=5  

```
| Method                             | Categories               | Mean         | Min          | Max          | Ratio | Allocated | Alloc Ratio | Payload   |
|----------------------------------- |------------------------- |-------------:|-------------:|-------------:|------:|----------:|------------:|----------:|
| NinoSerializeSimpleClass | SimpleClassSerialize | 260.00 ns | 260.00 ns | 260.00 ns | 1.00 | - | NA | 1,152 B |
| MemoryPackSerializeSimpleClass | SimpleClassSerialize | 600.00 ns | 600.00 ns | 600.00 ns | 1.00 | - | NA | 1,148 B |
| MessagePackSerializeSimpleClass | SimpleClassSerialize | 1,800.00 ns | 1,800.00 ns | 1,800.00 ns | 1.00 | - | NA | 1,300 B |
|                                    |                          |              |              |              |       |           |             |           |
| NinoSerializeSimpleClasses | SimpleClassesSerialize | 24.50 μs | 24.50 μs | 24.50 μs | 1.00 | - | NA | 115.2 KB |
| MemoryPackSerializeSimpleClasses | SimpleClassesSerialize | 60.10 μs | 60.10 μs | 60.10 μs | 1.00 | - | NA | 114.8 KB |
|                                    |                          |              |              |              |       |           |             |           |
| NinoSerializeSimpleStruct | SimpleStructSerialize | 1.71 ns | 1.71 ns | 1.71 ns | 1.00 | - | NA | 24 B |
| MemoryPackSerializeSimpleStruct | SimpleStructSerialize | 2.10 ns | 2.10 ns | 2.10 ns | 1.00 | - | NA | 24 B |
|                                    |                          |              |              |              |       |           |             |           |
| NinoSerializeSimpleStructs | SimpleStructsSerialize | 15.82 ns | 15.82 ns | 15.82 ns | 1.00 | - | NA | 2,404 B |
| MemoryPackSerializeSimpleStructs | SimpleStructsSerialize | 18.30 ns | 18.30 ns | 18.30 ns | 1.00 | - | NA | 2,404 B |
|                                    |                          |              |              |              |       |           |             |           |
| NinoSerializeVectors | VectorsSerialize | 4.44 μs | 4.44 μs | 4.44 μs | 1.00 | - | NA | 160,004 B |
| MemoryPackSerializeVectors | VectorsSerialize | 5.10 μs | 5.10 μs | 5.10 μs | 1.00 | - | NA | 160,005 B |
|                                    |                          |              |              |              |       |           |             |           |
| NinoDeserializeSimpleClass | SimpleClassDeserialize | 1,050.00 ns | 1,050.00 ns | 1,050.00 ns | 1.00 | 3.2 KB | NA | ? |
| MemoryPackDeserializeSimpleClass | SimpleClassDeserialize | 1,250.00 ns | 1,250.00 ns | 1,250.00 ns | 1.00 | 3.2 KB | NA | ? |
|                                    |                          |              |              |              |       |           |             |           |
| NinoDeserializeSimpleClasses | SimpleClassesDeserialize | 67.70 μs | 67.70 μs | 67.70 μs | 1.00 | 320 KB | NA | ? |
| MemoryPackDeserializeSimpleClasses | SimpleClassesDeserialize | 80.20 μs | 80.20 μs | 80.20 μs | 1.00 | 320 KB | NA | ? |
|                                    |                          |              |              |              |       |           |             |           |
| NinoDeserializeSimpleStructs | SimpleStructsDeserialize | 141.70 ns | 141.70 ns | 141.70 ns | 1.00 | 2.4 KB | NA | ? |
| MemoryPackDeserializeSimpleStructs | SimpleStructsDeserialize | 150.00 ns | 150.00 ns | 150.00 ns | 1.00 | 2.4 KB | NA | ? |
|                                    |                          |              |              |              |       |           |             |           |
| NinoDeserializeVectors | VectorsDeserialize | 127.20 μs | 127.20 μs | 127.20 μs | 1.00 | 156 KB | NA | ? |
| MemoryPackDeserializeVectors | VectorsDeserialize | 126.00 μs | 126.00 μs | 126.00 μs | 1.00 | 156 KB | NA | ? |

### v3 3.3.13 report (run after v4)

```

BenchmarkDotNet v0.15.2, Linux Ubuntu 24.04.2 LTS (Noble Numbat)
AMD EPYC 7763 2.45GHz, 1 CPU, 4 logical and 2 physical cores
.NET SDK 10.0.100
  [Host]             : .NET 10.0.0 (10.0.25.52411), X64 RyuJIT AVX2
  ShortRun-.NET 10.0 : .NET 10.0.0 (10.0.25.52411), X64 RyuJIT AVX2

Job=ShortRun-.NET 10.0  Runtime=.NET 10.0  Server=True  
IterationCount=15  LaunchCount=1  WarmupCount=5  

```
| Method                             | Categories               | Mean         | Min          | Max          | Ratio | Allocated | Alloc Ratio | Payload   |
|----------------------------------- |------------------------- |-------------:|-------------:|-------------:|------:|----------:|------------:|----------:|
| NinoSerializeSimpleClass | SimpleClassSerialize | 270.40 ns | 270.40 ns | 270.40 ns | 1.00 | - | NA | 1,152 B |
| MemoryPackSerializeSimpleClass | SimpleClassSerialize | 624.00 ns | 624.00 ns | 624.00 ns | 1.00 | - | NA | 1,148 B |
| MessagePackSerializeSimpleClass | SimpleClassSerialize | 1,872.00 ns | 1,872.00 ns | 1,872.00 ns | 1.00 | - | NA | 1,300 B |
|                                    |                          |              |              |              |       |           |             |           |
| NinoSerializeSimpleClasses | SimpleClassesSerialize | 25.48 μs | 25.48 μs | 25.48 μs | 1.00 | - | NA | 115.2 KB |
| MemoryPackSerializeSimpleClasses | SimpleClassesSerialize | 62.50 μs | 62.50 μs | 62.50 μs | 1.00 | - | NA | 114.8 KB |
|                                    |                          |              |              |              |       |           |             |           |
| NinoSerializeSimpleStruct | SimpleStructSerialize | 1.78 ns | 1.78 ns | 1.78 ns | 1.00 | - | NA | 24 B |
| MemoryPackSerializeSimpleStruct | SimpleStructSerialize | 2.18 ns | 2.18 ns | 2.18 ns | 1.00 | - | NA | 24 B |
|                                    |                          |              |              |              |       |           |             |           |
| NinoSerializeSimpleStructs | SimpleStructsSerialize | 16.45 ns | 16.45 ns | 16.45 ns | 1.00 | - | NA | 2,404 B |
| MemoryPackSerializeSimpleStructs | SimpleStructsSerialize | 19.03 ns | 19.03 ns | 19.03 ns | 1.00 | - | NA | 2,404 B |
|                                    |                          |              |              |              |       |           |             |           |
| NinoSerializeVectors | VectorsSerialize | 4.62 μs | 4.62 μs | 4.62 μs | 1.00 | - | NA | 160,004 B |
| MemoryPackSerializeVectors | VectorsSerialize | 5.30 μs | 5.30 μs | 5.30 μs | 1.00 | - | NA | 160,005 B |
|                                    |                          |              |              |              |       |           |             |           |
| NinoDeserializeSimpleClass | SimpleClassDeserialize | 1,092.00 ns | 1,092.00 ns | 1,092.00 ns | 1.00 | 3.2 KB | NA | ? |
| MemoryPackDeserializeSimpleClass | SimpleClassDeserialize | 1,300.00 ns | 1,300.00 ns | 1,300.00 ns | 1.00 | 3.2 KB | NA | ? |
|                                    |                          |              |              |              |       |           |             |           |
| NinoDeserializeSimpleClasses | SimpleClassesDeserialize | 70.41 μs | 70.41 μs | 70.41 μs | 1.00 | 320 KB | NA | ? |
| MemoryPackDeserializeSimpleClasses | SimpleClassesDeserialize | 83.41 μs | 83.41 μs | 83.41 μs | 1.00 | 320 KB | NA | ? |
|                                    |                          |              |              |              |       |           |             |           |
| NinoDeserializeSimpleStructs | SimpleStructsDeserialize | 147.37 ns | 147.37 ns | 147.37 ns | 1.00 | 2.4 KB | NA | ? |
| MemoryPackDeserializeSimpleStructs | SimpleStructsDeserialize | 156.00 ns | 156.00 ns | 156.00 ns | 1.00 | 2.4 KB | NA | ? |
|                                    |                          |              |              |              |       |           |             |           |
| NinoDeserializeVectors | VectorsDeserialize | 132.29 μs | 132.29 μs | 132.29 μs | 1.00 | 156 KB | NA | ? |
| MemoryPackDeserializeVectors | VectorsDeserialize | 131.04 μs | 131.04 μs | 131.04 μs | 1.00 | 156 KB | NA | ? |

</details>

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

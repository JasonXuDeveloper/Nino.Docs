<!-- Fixture for scripts/sync-benchmarks.ts. SAMPLE ONLY: a local short run, the numbers are noise; it is here for the report format (ReferenceTest, VersionTolerantTest and FixedSizeTest rows). -->

## What's Changed

* SAMPLE release body, not a real release: the benchmark table below is a local short run
  (`--launchCount 1 --warmupCount 1 --iterationCount 3 --iterationTime 100`) of ReferenceTest,
  VersionTolerantTest, FixedSizeTest and the four SimpleClass cases of SimpleTest (so parsers that require
  NinoSerializeSimpleClass accept it). A release run has every case of all seven classes in this one table.
  The numbers are illustrative only, not published results: 3 iterations of 100 ms are noisy (several
  deserialize rows, e.g. NinoDeserializeSimpleClass, have Max far above Median), so read no ratios from them.

## 📊 Performance Report

<details>
<summary>Click to expand benchmark results</summary>

```

BenchmarkDotNet v0.15.2, Linux Ubuntu 24.04.5 LTS (Noble Numbat)
Intel Xeon Processor 2.10GHz, 1 CPU, 4 logical and 4 physical cores
.NET SDK 10.0.402
  [Host]             : .NET 10.0.13 (10.0.1326.50504), X64 RyuJIT AVX-512F+CD+BW+DQ+VL+VBMI
  ShortRun-.NET 10.0 : .NET 10.0.13 (10.0.1326.50504), X64 RyuJIT AVX-512F+CD+BW+DQ+VL+VBMI

Job=ShortRun-.NET 10.0  Runtime=.NET 10.0  Server=True  
IterationCount=3  IterationTime=100ms  LaunchCount=1  
WarmupCount=1  

```
| Type                | Method                               | Mean            | Median          | Min             | Max             | Ratio | Payload  | Gen0    | Gen1   | Allocated | Alloc Ratio |
|-------------------- |------------------------------------- |----------------:|----------------:|----------------:|----------------:|------:|---------:|--------:|-------:|----------:|------------:|
| FixedSizeTest       | NinoDeserializeFixedClass            |      16.8742 ns |      14.8703 ns |      14.7367 ns |      21.0158 ns |  1.03 |        - |  0.0052 |      - |      56 B |        1.00 |
| FixedSizeTest       | MemoryPackDeserializeFixedClass      |      58.6839 ns |      56.9472 ns |      35.7823 ns |      83.3220 ns |  3.57 |        - |  0.0053 |      - |      56 B |        1.00 |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| FixedSizeTest       | NinoSerializeFixedClass              |      35.9212 ns |      35.5510 ns |      26.1246 ns |      46.0882 ns |  1.05 |      41B |  0.0069 |      - |      72 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClass        |      36.8164 ns |      33.2911 ns |      25.5592 ns |      51.5988 ns |  1.08 |      41B |  0.0069 |      - |      72 B |        1.00 |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| FixedSizeTest       | NinoDeserializeFixedClasses          |  10,669.2827 ns |  10,108.2625 ns |   3,792.7092 ns |  18,106.8766 ns |  1.49 |        - |  0.6271 |      - |    6424 B |        1.00 |
| FixedSizeTest       | MemoryPackDeserializeFixedClasses    |   2,219.8000 ns |   2,083.8920 ns |   1,999.7374 ns |   2,575.7706 ns |  0.31 |        - |  0.6149 |      - |    6424 B |        1.00 |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| FixedSizeTest       | NinoSerializeFixedClasses            |   1,587.4283 ns |   1,349.4452 ns |   1,257.8916 ns |   2,154.9483 ns |  1.06 |   4.01KB |  0.4076 |      - |    4128 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClasses      |   3,328.6585 ns |   2,848.1945 ns |   2,111.3409 ns |   5,026.4402 ns |  2.22 |   4.01KB |  0.3804 |      - |    4128 B |        1.00 |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| FixedSizeTest       | NinoDeserializeFixedStruct           |       0.4836 ns |       0.4740 ns |       0.4487 ns |       0.5283 ns |  1.00 |        - |       - |      - |         - |          NA |
| FixedSizeTest       | MemoryPackDeserializeFixedStruct     |       0.7683 ns |       0.5436 ns |       0.5135 ns |       1.2477 ns |  1.60 |        - |       - |      - |         - |          NA |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| FixedSizeTest       | NinoSerializeFixedStruct             |      17.8943 ns |      16.1326 ns |      16.0604 ns |      21.4900 ns |  1.02 |      40B |  0.0061 |      - |      64 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedStruct       |      15.7736 ns |      15.2541 ns |      14.8518 ns |      17.2150 ns |  0.90 |      40B |  0.0061 |      - |      64 B |        1.00 |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| ReferenceTest       | NinoDeserializeGraph                 |  59,621.4256 ns |  10,491.2051 ns |   8,301.4584 ns | 160,071.6135 ns |  4.41 |        - |  1.3089 |      - |   14104 B |        1.00 |
| ReferenceTest       | MemoryPackDeserializeGraph           | 131,823.2940 ns | 103,845.4079 ns |  22,431.1586 ns | 269,193.3153 ns |  9.76 |        - |  1.2262 |      - |   14104 B |        1.00 |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| ReferenceTest       | NinoSerializeGraph                   |   7,132.7982 ns |   7,776.8821 ns |   5,517.6537 ns |   8,103.8588 ns |  1.03 |   5.81KB |       - |      - |         - |          NA |
| ReferenceTest       | MemoryPackSerializeGraph             |  33,503.5625 ns |  33,455.5859 ns |  33,052.7900 ns |  34,002.3116 ns |  4.84 |   5.45KB |       - |      - |         - |          NA |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| SimpleTest          | NinoDeserializeSimpleClass           |  17,191.5081 ns |   4,932.5503 ns |   1,373.4002 ns |  45,268.5737 ns |  5.46 |        - |  0.2413 |      - |    2528 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleClass     |   1,033.9584 ns |     826.6985 ns |     752.0621 ns |   1,523.1145 ns |  0.33 |        - |  0.2326 |      - |    2528 B |        1.00 |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| SimpleTest          | NinoSerializeSimpleClass             |     116.6849 ns |     116.5957 ns |     100.5694 ns |     132.8898 ns |  1.01 |   1.12KB |       - |      - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleClass       |     363.4763 ns |     310.8749 ns |     309.3581 ns |     470.1960 ns |  3.16 |   1.12KB |       - |      - |         - |          NA |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClass         |   2,044.4286 ns |   2,120.7079 ns |     563.0225 ns |   3,449.5554 ns |  1.73 |        - |  0.2404 |      - |    2528 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClass   |   1,400.6325 ns |   1,214.8940 ns |   1,175.1530 ns |   1,811.8506 ns |  1.18 |        - |  0.2432 |      - |    2528 B |        1.00 |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| VersionTolerantTest | NinoSerializeTolerantClass           |      93.4594 ns |      94.1651 ns |      91.3227 ns |      94.8903 ns |  1.00 |   1.13KB |       - |      - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClass     |     661.0033 ns |     572.0658 ns |     569.7884 ns |     841.1556 ns |  7.07 |   1.14KB |       - |      - |         - |          NA |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClasses       | 125,309.4390 ns | 117,362.7356 ns | 112,891.4797 ns | 145,674.1017 ns |  1.01 |        - | 17.8571 | 4.9603 |  253624 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClasses | 328,091.3438 ns | 190,639.1322 ns |  94,119.9808 ns | 699,514.9183 ns |  2.65 |        - | 16.8269 | 4.8077 |  253624 B |        1.00 |
|                     |                                      |                 |                 |                 |                 |       |          |         |        |           |             |
| VersionTolerantTest | NinoSerializeTolerantClasses         |  11,498.1286 ns |  11,414.1722 ns |  10,929.7217 ns |  12,150.4917 ns |  1.00 |  112.7KB |       - |      - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClasses   |  54,930.0135 ns |  44,136.6887 ns |  42,309.6262 ns |  78,343.7256 ns |  4.79 | 113.68KB |       - |      - |         - |          NA |

</details>

---
*Benchmark generated automatically on 2026-10-16 20:30:13 UTC*

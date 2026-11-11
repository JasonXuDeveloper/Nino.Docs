<!--
Parser test fixture: release-body-unity.md with WorkloadTest's rows (the six
workloads against Nino, MemoryPack, MessagePack, protobuf-net
(Protobuf), Google.Protobuf (GoogleProtobuf) and System.Text.Json (Json),
serialize and deserialize) appended to the x64 report and to the Arm64
section. Every number added here is invented (a random multiple of a made-up
Nino time, payload and allocation): for parser tests only; never use them as
data. (This comment must not name the x64 section's title or the runtime
headings: the parser finds those sections by them.)
-->
<!--
Parser test fixture: release-body-arm64.md with the rows of MessagePack and
protobuf-net added next to Nino's in the x64 report and the Arm64 section (the
methods Nino's benchmarks/Nino.Benchmark declares for them), and the sections
of the runtimes outside .NET appended at the end, as written by Nino's
benchmarks/runtimes_report.py from made-up inputs, and the Unity section at the
end, written by Nino's benchmarks/unity_report.py from its test fixtures
(benchmarks/fixtures/unity-bench-*, made-up inputs). Every number added here is
invented (a multiple of Nino's, or random, or a fixture's): for parser tests
only; never use them as data. (This comment must not name the x64 section's title or the
runtime headings: the parser finds those sections by them.)
-->

## 📊 v3 3.3.13 vs v4 (same machine)

<details>
<summary>local</summary>

### v4 vs v3 (v3 run before v4)

| case                             | v3 3.3.13 | v4        | v4 vs v3 | MemoryPack (v4 run) | MemoryPack (v3 run) |
|----------------------------------|----------:|----------:|---------:|--------------------:|--------------------:|
| SerializeFixedClass              |         - |  12.01 ns |        - |            21.89 ns |                   - |
| SerializeFixedClasses            |         - |   1.01 μs |        - |             1.74 μs |                   - |
| SerializeFixedStruct             |         - |  11.50 ns |        - |            11.68 ns |                   - |
| SerializeGraph                   |         - |   4.56 μs |        - |            24.07 μs |                   - |
| SerializePolymorphicClassArray   |         - |  54.99 μs |        - |           280.90 μs |                   - |
| SerializePolymorphicClass        |         - |   6.39 μs |        - |            23.69 μs |                   - |
| SerializePolymorphicFooArray     |         - |   6.23 μs |        - |            23.33 μs |                   - |
| SerializeSimpleClass             | 138.52 ns |  89.61 ns |    0.65x |           382.12 ns |           309.61 ns |
| SerializeSimpleClasses           |  21.18 μs |  10.28 μs |    0.49x |            33.29 μs |            33.69 μs |
| SerializeSimpleStruct            |   1.70 ns |   1.34 ns |    0.79x |             3.03 ns |             3.10 ns |
| SerializeSimpleStructs           |  19.11 ns |  15.06 ns |    0.79x |            15.48 ns |            16.92 ns |
| SerializeTolerantClass           |         - |  94.36 ns |        - |           418.45 ns |                   - |
| SerializeTolerantClasses         |         - |  10.27 μs |        - |            40.56 μs |                   - |
| SerializeVectors                 |   4.11 μs |   4.19 μs |    1.02x |             4.33 μs |             4.14 μs |
| DeserializeFixedClass            |         - |  11.09 ns |        - |            22.06 ns |                   - |
| DeserializeFixedClasses          |         - |   1.37 μs |        - |             2.22 μs |                   - |
| DeserializeFixedStruct           |         - |   0.03 ns |        - |             0.54 ns |                   - |
| DeserializeGraph                 |         - |   5.71 μs |        - |            17.24 μs |                   - |
| LeavesNew                        |         - |   3.88 μs |        - |             4.13 μs |                   - |
| LeavesPooledElements             |         - |   2.45 μs |        - |                   - |                   - |
| LeavesInPlace                    |         - | 505.01 ns |        - |                   - |                   - |
| NodeNew                          |         - | 637.69 ns |        - |           654.55 ns |                   - |
| NodePooled                       |         - | 211.69 ns |        - |                   - |                   - |
| PlainNew                         |         - |   3.16 μs |        - |             3.77 μs |                   - |
| DeserializePolymorphicClassArray |         - | 284.54 μs |        - |           409.23 μs |                   - |
| DeserializePolymorphicClass      |         - |  20.30 μs |        - |            30.33 μs |                   - |
| DeserializePolymorphicFooArray   |         - |  19.62 μs |        - |            28.08 μs |                   - |
| DeserializeNew                   |         - | 548.65 ns |        - |           655.12 ns |                   - |
| DeserializePooled                |         - | 222.15 ns |        - |                   - |                   - |
| DeserializeSimpleClass           | 571.08 ns | 492.84 ns |    0.86x |           722.15 ns |           682.13 ns |
| DeserializeSimpleClasses         |  58.93 μs |  52.93 μs |    0.90x |            66.72 μs |            68.88 μs |
| DeserializeSimpleStruct          |   0.33 ns |   0.31 ns |    0.95x |             0.34 ns |             0.39 ns |
| DeserializeSimpleStructs         | 126.83 ns | 131.30 ns |    1.04x |           133.35 ns |           159.57 ns |
| DeserializeTolerantClass         |         - | 521.07 ns |        - |           764.33 ns |                   - |
| DeserializeTolerantClasses       |         - |  57.68 μs |        - |            79.99 μs |                   - |
| DeserializeVectors               | 111.47 μs | 104.55 μs |    0.94x |           111.23 μs |           112.57 μs |

v4 vs v3 = mean(v4) / mean(v3); below 1.00x means v4 is faster.
MemoryPack drift (v4 run / v3 run): min 0.84x, max 1.23x (same code in both runs; the spread is the noise floor of this comparison).

### v4 vs v3 (v3 run after v4)

| case                             | v3 3.3.13 | v4        | v4 vs v3 | MemoryPack (v4 run) | MemoryPack (v3 run) |
|----------------------------------|----------:|----------:|---------:|--------------------:|--------------------:|
| SerializeFixedClass              |         - |  12.01 ns |        - |            21.89 ns |                   - |
| SerializeFixedClasses            |         - |   1.01 μs |        - |             1.74 μs |                   - |
| SerializeFixedStruct             |         - |  11.50 ns |        - |            11.68 ns |                   - |
| SerializeGraph                   |         - |   4.56 μs |        - |            24.07 μs |                   - |
| SerializePolymorphicClassArray   |         - |  54.99 μs |        - |           280.90 μs |                   - |
| SerializePolymorphicClass        |         - |   6.39 μs |        - |            23.69 μs |                   - |
| SerializePolymorphicFooArray     |         - |   6.23 μs |        - |            23.33 μs |                   - |
| SerializeSimpleClass             | 137.04 ns |  89.61 ns |    0.65x |           382.12 ns |           322.89 ns |
| SerializeSimpleClasses           |  20.90 μs |  10.28 μs |    0.49x |            33.29 μs |            36.55 μs |
| SerializeSimpleStruct            |   1.73 ns |   1.34 ns |    0.78x |             3.03 ns |             2.90 ns |
| SerializeSimpleStructs           |  19.82 ns |  15.06 ns |    0.76x |            15.48 ns |            31.91 ns |
| SerializeTolerantClass           |         - |  94.36 ns |        - |           418.45 ns |                   - |
| SerializeTolerantClasses         |         - |  10.27 μs |        - |            40.56 μs |                   - |
| SerializeVectors                 |   4.20 μs |   4.19 μs |    1.00x |             4.33 μs |             4.07 μs |
| DeserializeFixedClass            |         - |  11.09 ns |        - |            22.06 ns |                   - |
| DeserializeFixedClasses          |         - |   1.37 μs |        - |             2.22 μs |                   - |
| DeserializeFixedStruct           |         - |   0.03 ns |        - |             0.54 ns |                   - |
| DeserializeGraph                 |         - |   5.71 μs |        - |            17.24 μs |                   - |
| LeavesNew                        |         - |   3.88 μs |        - |             4.13 μs |                   - |
| LeavesPooledElements             |         - |   2.45 μs |        - |                   - |                   - |
| LeavesInPlace                    |         - | 505.01 ns |        - |                   - |                   - |
| NodeNew                          |         - | 637.69 ns |        - |           654.55 ns |                   - |
| NodePooled                       |         - | 211.69 ns |        - |                   - |                   - |
| PlainNew                         |         - |   3.16 μs |        - |             3.77 μs |                   - |
| DeserializePolymorphicClassArray |         - | 284.54 μs |        - |           409.23 μs |                   - |
| DeserializePolymorphicClass      |         - |  20.30 μs |        - |            30.33 μs |                   - |
| DeserializePolymorphicFooArray   |         - |  19.62 μs |        - |            28.08 μs |                   - |
| DeserializeNew                   |         - | 548.65 ns |        - |           655.12 ns |                   - |
| DeserializePooled                |         - | 222.15 ns |        - |                   - |                   - |
| DeserializeSimpleClass           | 558.24 ns | 492.84 ns |    0.88x |           722.15 ns |           681.59 ns |
| DeserializeSimpleClasses         |  59.97 μs |  52.93 μs |    0.88x |            66.72 μs |            69.47 μs |
| DeserializeSimpleStruct          |   0.37 ns |   0.31 ns |    0.86x |             0.34 ns |             0.26 ns |
| DeserializeSimpleStructs         | 120.92 ns | 131.30 ns |    1.09x |           133.35 ns |           133.71 ns |
| DeserializeTolerantClass         |         - | 521.07 ns |        - |           764.33 ns |                   - |
| DeserializeTolerantClasses       |         - |  57.68 μs |        - |            79.99 μs |                   - |
| DeserializeVectors               | 106.06 μs | 104.55 μs |    0.99x |           111.23 μs |           112.74 μs |

v4 vs v3 = mean(v4) / mean(v3); below 1.00x means v4 is faster.
MemoryPack drift (v4 run / v3 run): min 0.49x, max 1.31x (same code in both runs; the spread is the noise floor of this comparison).

### v3 3.3.13 report (run before v4)

```

BenchmarkDotNet v0.15.2, Linux Ubuntu 24.04.5 LTS (Noble Numbat)
Intel Xeon Processor 2.10GHz, 1 CPU, 4 logical and 4 physical cores
.NET SDK 10.0.402
  [Host]             : .NET 10.0.13 (10.0.1326.50504), X64 RyuJIT AVX-512F+CD+BW+DQ+VL+VBMI
  ShortRun-.NET 10.0 : .NET 10.0.13 (10.0.1326.50504), X64 RyuJIT AVX-512F+CD+BW+DQ+VL+VBMI

Job=ShortRun-.NET 10.0  Runtime=.NET 10.0  Server=True  
IterationCount=15  LaunchCount=1  WarmupCount=5  

```
| Method                              | Mean            | Min             | Max             | Ratio  | Payload  | Gen0    | Gen1    | Gen2    | Allocated | Alloc Ratio |
|------------------------------------ |----------------:|----------------:|----------------:|-------:|---------:|--------:|--------:|--------:|----------:|------------:|
| NinoDeserializeSimpleClass          |     571.0833 ns |     528.7242 ns |     639.0541 ns |   1.00 |        - |  0.2489 |       - |       - |    2552 B |        1.00 |
| MemoryPackDeserializeSimpleClass    |     682.1343 ns |     656.8223 ns |     721.7187 ns |   1.20 |        - |  0.2422 |       - |       - |    2528 B |        0.99 |
| MessagePackDeserializeSimpleClass   |   1,697.8934 ns |   1,563.6769 ns |   1,829.6066 ns |   2.98 |        - |  0.2480 |       - |       - |    2528 B |        0.99 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleClass            |     138.5202 ns |     124.5299 ns |     149.8588 ns |   1.00 |   1.13KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleClass      |     309.6127 ns |     296.4908 ns |     327.2534 ns |   2.24 |   1.12KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleClass     |     795.3000 ns |     725.0295 ns |     882.5692 ns |   5.76 |   1.09KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleClasses        |  58,933.3048 ns |  53,469.1906 ns |  61,346.6753 ns |   1.00 |        - | 19.0430 |  6.1035 |       - |  262424 B |        1.00 |
| MemoryPackDeserializeSimpleClasses  |  68,875.9038 ns |  63,451.6199 ns |  74,406.4429 ns |   1.17 |        - | 18.0664 |  5.6152 |       - |  253624 B |        0.97 |
| MessagePackDeserializeSimpleClasses | 187,078.5929 ns | 177,186.4778 ns | 198,846.7566 ns |   3.18 |        - | 17.8223 |  5.6152 |       - |  253624 B |        0.97 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleClasses          |  21,177.5329 ns |  19,922.8075 ns |  22,430.1648 ns |   1.00 |  112.5KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleClasses    |  33,692.1875 ns |  31,457.9792 ns |  34,754.4207 ns |   1.59 | 112.11KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleClasses   |  81,231.3851 ns |  74,282.6899 ns |  86,658.4599 ns |   3.84 |  108.6KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleStruct         |       0.3295 ns |       0.1558 ns |       0.4935 ns |   1.10 |        - |       - |       - |       - |         - |          NA |
| MemoryPackDeserializeSimpleStruct   |       0.3912 ns |       0.2174 ns |       0.5642 ns |   1.31 |        - |       - |       - |       - |         - |          NA |
| MessagePackDeserializeSimpleStruct  |      51.3539 ns |      47.1513 ns |      56.8545 ns | 171.47 |        - |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleStruct           |       1.6990 ns |       1.3918 ns |       2.1138 ns |   1.02 |      12B |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleStruct     |       3.0985 ns |       2.7164 ns |       3.5480 ns |   1.85 |      12B |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleStruct    |      42.6600 ns |      39.7481 ns |      45.3052 ns |  25.52 |      16B |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleStructs        |     126.8295 ns |     113.1236 ns |     150.8622 ns |   1.01 |        - |  0.1214 |       - |       - |    1224 B |        1.00 |
| MemoryPackDeserializeSimpleStructs  |     159.5702 ns |     136.8833 ns |     204.9815 ns |   1.27 |        - |  0.1214 |       - |       - |    1224 B |        1.00 |
| MessagePackDeserializeSimpleStructs |   2,721.5494 ns |   2,627.3882 ns |   2,780.3873 ns |  21.63 |        - |  0.1183 |       - |       - |    1224 B |        1.00 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleStructs          |      19.1061 ns |      18.0030 ns |      20.5751 ns |   1.00 |   1.18KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleStructs    |      16.9229 ns |      15.9895 ns |      18.4739 ns |   0.89 |   1.18KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleStructs   |   2,913.9379 ns |   2,719.8361 ns |   3,179.9725 ns | 152.73 |   1.57KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeVectors              | 111,468.0959 ns |  99,428.5867 ns | 120,630.5127 ns |   1.00 |        - |  8.3008 |  8.3008 |  8.3008 |  160017 B |        1.00 |
| MemoryPackDeserializeVectors        | 112,573.5266 ns | 103,659.3510 ns | 123,953.0888 ns |   1.01 |        - |  9.7656 |  9.7656 |  9.7656 |  160020 B |        1.00 |
| MessagePackDeserializeVectors       | 325,860.5296 ns | 297,912.0718 ns | 370,716.4028 ns |   2.93 |        - | 12.6953 | 12.6953 | 12.6953 |  160025 B |        1.00 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeVectors                |   4,111.7408 ns |   3,912.6667 ns |   4,218.2367 ns |   1.00 | 156.25KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeVectors          |   4,135.7887 ns |   3,932.4142 ns |   4,354.1231 ns |   1.01 | 156.25KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeVectors         | 126,967.1170 ns | 120,760.4580 ns | 135,527.0576 ns |  30.89 | 205.08KB |       - |       - |       - |         - |          NA |

### v3 3.3.13 report (run after v4)

```

BenchmarkDotNet v0.15.2, Linux Ubuntu 24.04.5 LTS (Noble Numbat)
Intel Xeon Processor 2.10GHz, 1 CPU, 4 logical and 4 physical cores
.NET SDK 10.0.402
  [Host]             : .NET 10.0.13 (10.0.1326.50504), X64 RyuJIT AVX-512F+CD+BW+DQ+VL+VBMI
  ShortRun-.NET 10.0 : .NET 10.0.13 (10.0.1326.50504), X64 RyuJIT AVX-512F+CD+BW+DQ+VL+VBMI

Job=ShortRun-.NET 10.0  Runtime=.NET 10.0  Server=True  
IterationCount=15  LaunchCount=1  WarmupCount=5  

```
| Method                              | Mean            | Min             | Max             | Ratio  | Payload  | Gen0    | Gen1    | Gen2    | Allocated | Alloc Ratio |
|------------------------------------ |----------------:|----------------:|----------------:|-------:|---------:|--------:|--------:|--------:|----------:|------------:|
| NinoDeserializeSimpleClass          |     558.2425 ns |     509.6893 ns |     615.2968 ns |   1.00 |        - |  0.2470 |       - |       - |    2552 B |        1.00 |
| MemoryPackDeserializeSimpleClass    |     681.5921 ns |     635.0277 ns |     752.5796 ns |   1.22 |        - |  0.2460 |       - |       - |    2528 B |        0.99 |
| MessagePackDeserializeSimpleClass   |   1,682.9841 ns |   1,569.3490 ns |   1,803.9393 ns |   3.02 |        - |  0.2480 |       - |       - |    2528 B |        0.99 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleClass            |     137.0419 ns |     133.1727 ns |     140.6796 ns |   1.00 |   1.13KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleClass      |     322.8855 ns |     294.5821 ns |     373.1254 ns |   2.36 |   1.12KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleClass     |     772.3140 ns |     718.5175 ns |     826.8752 ns |   5.64 |   1.09KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleClasses        |  59,972.6360 ns |  56,808.8087 ns |  64,542.8955 ns |   1.00 |        - | 18.8599 |  5.9204 |       - |  262424 B |        1.00 |
| MemoryPackDeserializeSimpleClasses  |  69,466.4945 ns |  63,608.1096 ns |  74,497.0220 ns |   1.16 |        - | 18.3105 |  5.7373 |       - |  253624 B |        0.97 |
| MessagePackDeserializeSimpleClasses | 187,293.8906 ns | 179,719.8300 ns | 195,557.1622 ns |   3.13 |        - | 17.8223 |  5.3711 |       - |  253624 B |        0.97 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleClasses          |  20,903.5786 ns |  19,102.4445 ns |  23,421.4193 ns |   1.00 |  112.5KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleClasses    |  36,547.4007 ns |  33,524.0962 ns |  39,663.8004 ns |   1.75 | 112.11KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleClasses   |  83,779.5211 ns |  77,655.8854 ns |  88,233.0813 ns |   4.02 |  108.6KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleStruct         |       0.3651 ns |       0.2233 ns |       0.5337 ns |   1.08 |        - |       - |       - |       - |         - |          NA |
| MemoryPackDeserializeSimpleStruct   |       0.2610 ns |       0.1299 ns |       0.3328 ns |   0.77 |        - |       - |       - |       - |         - |          NA |
| MessagePackDeserializeSimpleStruct  |      54.4384 ns |      51.7210 ns |      57.6973 ns | 160.78 |        - |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleStruct           |       1.7253 ns |       1.4587 ns |       2.0685 ns |   1.01 |      12B |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleStruct     |       2.9007 ns |       2.6331 ns |       3.1909 ns |   1.70 |      12B |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleStruct    |      43.9219 ns |      41.2561 ns |      47.5018 ns |  25.81 |      16B |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleStructs        |     120.9160 ns |     112.2146 ns |     132.6397 ns |   1.00 |        - |  0.1214 |       - |       - |    1224 B |        1.00 |
| MemoryPackDeserializeSimpleStructs  |     133.7103 ns |     127.0011 ns |     142.3521 ns |   1.11 |        - |  0.1214 |       - |       - |    1224 B |        1.00 |
| MessagePackDeserializeSimpleStructs |   3,009.6576 ns |   2,847.0600 ns |   3,242.3042 ns |  24.95 |        - |  0.1678 |  0.0076 |  0.0076 |    1224 B |        1.00 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleStructs          |      19.8163 ns |      18.6648 ns |      21.1379 ns |   1.00 |   1.18KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleStructs    |      31.9100 ns |      30.1089 ns |      34.0257 ns |   1.61 |   1.18KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleStructs   |   2,908.4390 ns |   2,681.7356 ns |   3,216.0609 ns | 146.95 |   1.57KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeVectors              | 106,058.5402 ns | 100,978.6194 ns | 114,861.7852 ns |   1.00 |        - |  7.8125 |  7.8125 |  7.8125 |  160015 B |        1.00 |
| MemoryPackDeserializeVectors        | 112,740.7484 ns | 101,507.4133 ns | 129,556.3084 ns |   1.06 |        - |  7.8125 |  7.8125 |  7.8125 |  160015 B |        1.00 |
| MessagePackDeserializeVectors       | 323,916.2269 ns | 293,780.4688 ns | 346,317.0430 ns |   3.06 |        - | 13.1836 | 13.1836 | 13.1836 |  160026 B |        1.00 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeVectors                |   4,201.1885 ns |   4,020.9395 ns |   4,339.8090 ns |   1.00 | 156.25KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeVectors          |   4,074.8037 ns |   3,769.0611 ns |   4,673.7787 ns |   0.97 | 156.25KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeVectors         | 124,837.5960 ns | 120,224.1102 ns | 129,299.5498 ns |  29.73 | 205.08KB |       - |       - |       - |         - |          NA |

</details>

## 📊 Arm64 benchmark

<details>
<summary>The same benchmarks of fixture on an Arm64 runner</summary>

The benchmark classes of the x64 report below, with the same BenchmarkDotNet settings
(`--launchCount 1 --warmupCount 5 --iterationCount 15`), on GitHub's `ubuntu-24.04-arm` runners. Compare Nino with MemoryPack within
this table: the runners differ from the x64 ones, so times across the two tables say little.

```

BenchmarkDotNet v0.15.2, Linux Ubuntu 24.04.5 LTS (Noble Numbat)
Intel Xeon Processor 2.10GHz, 1 CPU, 4 logical and 4 physical cores
.NET SDK 10.0.402
  [Host]             : .NET 10.0.13 (10.0.1326.50504), X64 RyuJIT AVX-512F+CD+BW+DQ+VL+VBMI
  ShortRun-.NET 10.0 : .NET 10.0.13 (10.0.1326.50504), X64 RyuJIT AVX-512F+CD+BW+DQ+VL+VBMI

Job=ShortRun-.NET 10.0  Runtime=.NET 10.0  Server=True  
IterationCount=15  LaunchCount=1  WarmupCount=5  

```
| Type                | Method                                      | Mean              | Median            | Min               | Max               | Ratio  | Payload   | Gen0    | Gen1    | Gen2    | Allocated | Alloc Ratio |
|-------------------- |-------------------------------------------- |------------------:|------------------:|------------------:|------------------:|-------:|----------:|--------:|--------:|--------:|----------:|------------:|
| FixedSizeTest       | NinoDeserializeFixedClass                   |        11.0860 ns |        11.1748 ns |        10.0276 ns |        11.8051 ns |   1.00 |         - |  0.0054 |       - |       - |      56 B |        1.00 |
| FixedSizeTest       | MemoryPackDeserializeFixedClass             |        22.0626 ns |        22.0762 ns |        20.0715 ns |        24.6171 ns |   1.99 |         - |  0.0055 |  0.0001 |  0.0001 |      56 B |        1.00 |
| FixedSizeTest       | MessagePackDeserializeFixedClass                   |        34.3666 ns |        11.1748 ns |        10.0276 ns |        11.8051 ns |   1.00 |         - |  0.0054 |       - |       - |      56 B |        1.00 |
| FixedSizeTest       | ProtobufDeserializeFixedClass                   |        26.6064 ns |        11.1748 ns |        10.0276 ns |        11.8051 ns |   1.00 |         - |  0.0054 |       - |       - |      56 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedClass                     |        12.0111 ns |        11.8445 ns |        11.2881 ns |        13.2462 ns |   1.00 |      41 B |  0.0069 |       - |       - |      72 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClass               |        21.8931 ns |        21.8365 ns |        20.0607 ns |        24.3061 ns |   1.83 |      41 B |  0.0070 |       - |       - |      72 B |        1.00 |
| FixedSizeTest       | MessagePackSerializeFixedClass                     |        37.2344 ns |        11.8445 ns |        11.2881 ns |        13.2462 ns |   1.00 |      41 B |  0.0069 |       - |       - |      72 B |        1.00 |
| FixedSizeTest       | ProtobufSerializeFixedClass                     |        28.8266 ns |        11.8445 ns |        11.2881 ns |        13.2462 ns |   1.00 |      41 B |  0.0069 |       - |       - |      72 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoDeserializeFixedClasses                 |     1,369.5749 ns |     1,376.4601 ns |     1,246.1121 ns |     1,599.6303 ns |   1.00 |         - |  0.6256 |  0.0076 |       - |    6424 B |        1.00 |
| FixedSizeTest       | MemoryPackDeserializeFixedClasses           |     2,221.0162 ns |     2,447.2413 ns |     1,308.8883 ns |     2,836.0838 ns |   1.63 |         - |  0.6256 |  0.0038 |       - |    6424 B |        1.00 |
| FixedSizeTest       | MessagePackDeserializeFixedClasses                 |     4,245.6822 ns |     1,376.4601 ns |     1,246.1121 ns |     1,599.6303 ns |   1.00 |         - |  0.6256 |  0.0076 |       - |    6424 B |        1.00 |
| FixedSizeTest       | ProtobufDeserializeFixedClasses                 |     3,286.9798 ns |     1,376.4601 ns |     1,246.1121 ns |     1,599.6303 ns |   1.00 |         - |  0.6256 |  0.0076 |       - |    6424 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedClasses                   |     1,012.0662 ns |       897.1137 ns |       813.5906 ns |     1,271.8286 ns |   1.03 |   4,104 B |  0.4110 |       - |       - |    4128 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClasses             |     1,742.8963 ns |     1,738.1253 ns |     1,658.9868 ns |     1,857.5017 ns |   1.77 |   4,104 B |  0.3967 |       - |       - |    4128 B |        1.00 |
| FixedSizeTest       | MessagePackSerializeFixedClasses                   |     3,137.4052 ns |       897.1137 ns |       813.5906 ns |     1,271.8286 ns |   1.03 |   4,104 B |  0.4110 |       - |       - |    4128 B |        1.00 |
| FixedSizeTest       | ProtobufSerializeFixedClasses                   |     2,428.9589 ns |       897.1137 ns |       813.5906 ns |     1,271.8286 ns |   1.03 |   4,104 B |  0.4110 |       - |       - |    4128 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoDeserializeFixedStruct                  |         0.0330 ns |         0.0000 ns |         0.0000 ns |         0.1479 ns |      ? |         - |       - |       - |       - |         - |           ? |
| FixedSizeTest       | MemoryPackDeserializeFixedStruct            |         0.5361 ns |         0.5568 ns |         0.2877 ns |         0.8564 ns |      ? |         - |       - |       - |       - |         - |           ? |
| FixedSizeTest       | MessagePackDeserializeFixedStruct                  |         0.1023 ns |         0.0000 ns |         0.0000 ns |         0.1479 ns |      ? |         - |       - |       - |       - |         - |           ? |
| FixedSizeTest       | ProtobufDeserializeFixedStruct                  |         0.0792 ns |         0.0000 ns |         0.0000 ns |         0.1479 ns |      ? |         - |       - |       - |       - |         - |           ? |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedStruct                    |        11.5048 ns |        11.3409 ns |        11.0178 ns |        12.2607 ns |   1.00 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedStruct              |        11.6760 ns |        11.5850 ns |        10.7735 ns |        12.7479 ns |   1.02 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
| FixedSizeTest       | MessagePackSerializeFixedStruct                    |        35.6649 ns |        11.3409 ns |        11.0178 ns |        12.2607 ns |   1.00 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
| FixedSizeTest       | ProtobufSerializeFixedStruct                    |        27.6115 ns |        11.3409 ns |        11.0178 ns |        12.2607 ns |   1.00 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| ReferenceTest       | NinoDeserializeGraph                        |     5,708.5715 ns |     5,747.2174 ns |     5,489.3158 ns |     5,864.1501 ns |   1.00 |         - |  1.3657 |  0.0305 |       - |   14104 B |        1.00 |
| ReferenceTest       | MemoryPackDeserializeGraph                  |    17,241.1692 ns |    17,045.5469 ns |    16,306.2630 ns |    18,759.5018 ns |   3.02 |         - |  1.3733 |  0.0305 |       - |   14104 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| ReferenceTest       | NinoSerializeGraph                          |     4,558.5943 ns |     4,537.5344 ns |     4,387.9276 ns |     4,840.6198 ns |   1.00 |   5,948 B |       - |       - |       - |         - |          NA |
| ReferenceTest       | MemoryPackSerializeGraph                    |    24,065.6332 ns |    23,980.4084 ns |    22,975.4215 ns |    25,947.5957 ns |   5.28 |   5,584 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoLeavesNew                               |     3,876.7935 ns |     3,889.5247 ns |     3,619.7647 ns |     4,062.7215 ns |   1.00 |         - |  1.3275 |  0.0305 |       - |   13656 B |        1.00 |
| PooledGraphTest     | MessagePackLeavesNew                               |    12,018.0599 ns |     3,889.5247 ns |     3,619.7647 ns |     4,062.7215 ns |   1.00 |         - |  1.3275 |  0.0305 |       - |   13656 B |        1.00 |
| PooledGraphTest     | ProtobufLeavesNew                               |     9,304.3044 ns |     3,889.5247 ns |     3,619.7647 ns |     4,062.7215 ns |   1.00 |         - |  1.3275 |  0.0305 |       - |   13656 B |        1.00 |
| PooledGraphTest     | NinoLeavesPooledElements                    |     2,448.3189 ns |     2,463.4706 ns |     2,313.7609 ns |     2,593.9444 ns |   0.63 |         - |  0.0839 |       - |       - |     856 B |        0.06 |
| PooledGraphTest     | NinoLeavesInPlace                           |       505.0119 ns |       504.4580 ns |       470.3849 ns |       544.3157 ns |   0.13 |         - |       - |       - |       - |         - |        0.00 |
| PooledGraphTest     | MemoryPackLeavesNew                         |     4,128.5899 ns |     4,134.1907 ns |     3,812.1796 ns |     4,294.3501 ns |   1.07 |         - |  1.3275 |  0.0229 |       - |   13656 B |        1.00 |
| PooledGraphTest     | MemoryPackLeavesOverwrite                   |     4,388.1175 ns |     4,406.4875 ns |     4,056.5629 ns |     4,780.3392 ns |   1.13 |         - |  1.2360 |  0.0076 |       - |   12800 B |        0.94 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoNodeNew                                 |       637.6911 ns |       631.5708 ns |       611.9775 ns |       682.2081 ns |   1.00 |         - |  0.2136 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | MessagePackNodeNew                                 |     1,976.8424 ns |       631.5708 ns |       611.9775 ns |       682.2081 ns |   1.00 |         - |  0.2136 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | ProtobufNodeNew                                 |     1,530.4586 ns |       631.5708 ns |       611.9775 ns |       682.2081 ns |   1.00 |         - |  0.2136 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | NinoNodePooled                              |       211.6913 ns |       210.3109 ns |       203.9490 ns |       222.2315 ns |   0.33 |         - |       - |       - |       - |         - |        0.00 |
| PooledGraphTest     | MemoryPackNodeNew                           |       654.5474 ns |       656.0013 ns |       609.5359 ns |       702.3794 ns |   1.03 |         - |  0.2117 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | MemoryPackNodeOverwrite                     |       510.6307 ns |       510.1689 ns |       478.4672 ns |       547.9164 ns |   0.80 |         - |  0.0982 |       - |       - |    1024 B |        0.47 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoPlainNew                                |     3,160.7732 ns |     3,172.2773 ns |     2,935.4816 ns |     3,421.1302 ns |   1.00 |         - |  1.2550 |  0.0305 |       - |   12856 B |        1.00 |
| PooledGraphTest     | MemoryPackPlainNew                          |     3,774.2958 ns |     3,737.7184 ns |     3,540.4649 ns |     4,097.0168 ns |   1.20 |         - |  1.2512 |  0.0229 |       - |   12856 B |        1.00 |
| PooledGraphTest     | MessagePackPlainNew                                |     9,798.3969 ns |     3,172.2773 ns |     2,935.4816 ns |     3,421.1302 ns |   1.00 |         - |  1.2550 |  0.0305 |       - |   12856 B |        1.00 |
| PooledGraphTest     | ProtobufPlainNew                                |     7,585.8557 ns |     3,172.2773 ns |     2,935.4816 ns |     3,421.1302 ns |   1.00 |         - |  1.2550 |  0.0305 |       - |   12856 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicClassArray        |   284,544.0570 ns |   278,595.1274 ns |   259,762.4878 ns |   327,473.9668 ns |   1.00 |         - | 31.7383 | 13.6719 |       - |  745624 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicClassArray  |   409,225.6877 ns |   405,800.2476 ns |   354,880.1650 ns |   459,854.7686 ns |   1.44 |         - | 30.2734 | 14.1602 |       - |  745624 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicClassArray | 1,610,212.7331 ns | 1,566,666.2852 ns | 1,455,321.4512 ns | 1,794,850.4629 ns |   5.68 |         - | 46.8750 | 19.5313 |       - | 1162424 B |        1.56 |
| PolymorphicTest     | ProtobufDeserializePolymorphicClassArray        |   682,905.7368 ns |   278,595.1274 ns |   259,762.4878 ns |   327,473.9668 ns |   1.00 |         - | 31.7383 | 13.6719 |       - |  745624 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicClassArray          |    54,994.8444 ns |    54,631.0397 ns |    51,168.9285 ns |    58,656.5017 ns |   1.00 | 397,304 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicClassArray    |   280,897.4215 ns |   275,357.4402 ns |   255,944.9763 ns |   309,417.4329 ns |   5.11 | 384,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicClassArray   |   775,118.1399 ns |   764,609.5889 ns |   731,123.6758 ns |   863,211.1631 ns |  14.11 | 487,103 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | ProtobufSerializePolymorphicClassArray          |   131,987.6266 ns |    54,631.0397 ns |    51,168.9285 ns |    58,656.5017 ns |   1.00 | 397,304 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicClass             |    20,296.9095 ns |    20,234.8878 ns |    18,711.7913 ns |    21,862.8668 ns |   1.00 |         - |  7.3853 |  1.2817 |       - |   79688 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicClass       |    30,326.7067 ns |    29,909.0238 ns |    27,614.4732 ns |    33,737.2495 ns |   1.50 |         - |  7.4158 |  1.0071 |       - |   79688 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicClass      |   185,669.9667 ns |   186,862.6548 ns |   166,402.2502 ns |   195,842.5698 ns |   9.16 |         - |  7.5684 |  0.9766 |       - |   83856 B |        1.05 |
| PolymorphicTest     | ProtobufDeserializePolymorphicClass             |    48,712.5828 ns |    20,234.8878 ns |    18,711.7913 ns |    21,862.8668 ns |   1.00 |         - |  7.3853 |  1.2817 |       - |   79688 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicClass               |     6,390.4397 ns |     6,393.2117 ns |     5,930.3433 ns |     6,901.1617 ns |   1.00 |  53,789 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicClass         |    23,694.2597 ns |    23,657.7426 ns |    21,984.8369 ns |    25,531.2838 ns |   3.72 |  51,760 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicClass        |   106,403.4284 ns |   105,942.4332 ns |   101,983.6055 ns |   111,803.6821 ns |  16.68 |  66,859 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | ProtobufSerializePolymorphicClass               |    15,337.0553 ns |     6,393.2117 ns |     5,930.3433 ns |     6,901.1617 ns |   1.00 |  53,789 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicFooArray          |    19,620.2259 ns |    19,397.0100 ns |    18,294.4601 ns |    21,277.4992 ns |   1.00 |         - |  7.1716 |  1.0681 |       - |   76024 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicFooArray    |    28,076.1534 ns |    27,777.7130 ns |    26,883.9058 ns |    29,895.6654 ns |   1.43 |         - |  7.1106 |  1.0681 |       - |   76024 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicFooArray   |   175,498.7009 ns |   176,374.0947 ns |   166,641.6965 ns |   181,510.7920 ns |   8.96 |         - |  7.0801 |  0.7324 |       - |   76024 B |        1.00 |
| PolymorphicTest     | ProtobufDeserializePolymorphicFooArray          |    47,088.5422 ns |    19,397.0100 ns |    18,294.4601 ns |    21,277.4992 ns |   1.00 |         - |  7.1716 |  1.0681 |       - |   76024 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicFooArray            |     6,231.7819 ns |     6,278.8842 ns |     5,912.0486 ns |     6,508.2156 ns |   1.00 |  52,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicFooArray      |    23,330.3214 ns |    22,961.6185 ns |    20,959.0387 ns |    25,944.3397 ns |   3.75 |  50,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicFooArray     |   105,334.9285 ns |   105,199.2419 ns |    99,884.6250 ns |   111,919.3000 ns |  16.91 |  65,203 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | ProtobufSerializePolymorphicFooArray            |    14,956.2766 ns |     6,278.8842 ns |     5,912.0486 ns |     6,508.2156 ns |   1.00 |  52,404 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledTest          | NinoDeserializeNew                          |       548.6471 ns |       550.9600 ns |       526.5837 ns |       581.2650 ns |   1.00 |         - |  0.2451 |  0.0010 |       - |    2536 B |        1.00 |
| PooledTest          | MessagePackDeserializeNew                          |     1,700.8060 ns |       550.9600 ns |       526.5837 ns |       581.2650 ns |   1.00 |         - |  0.2451 |  0.0010 |       - |    2536 B |        1.00 |
| PooledTest          | ProtobufDeserializeNew                          |     1,316.7530 ns |       550.9600 ns |       526.5837 ns |       581.2650 ns |   1.00 |         - |  0.2451 |  0.0010 |       - |    2536 B |        1.00 |
| PooledTest          | NinoDeserializePooled                       |       222.1494 ns |       220.8111 ns |       206.6481 ns |       240.5492 ns |   0.41 |         - |       - |       - |       - |         - |        0.00 |
| PooledTest          | MemoryPackDeserializeNew                    |       655.1230 ns |       652.9136 ns |       625.4202 ns |       701.2852 ns |   1.20 |         - |  0.2460 |       - |       - |    2536 B |        1.00 |
| PooledTest          | MemoryPackDeserializeOverwrite              |       553.0911 ns |       551.9693 ns |       532.1793 ns |       585.0788 ns |   1.01 |         - |  0.1049 |       - |       - |    1080 B |        0.43 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleClass                  |       492.8397 ns |       501.3566 ns |       458.2103 ns |       555.4371 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleClass            |       722.1478 ns |       725.1683 ns |       626.6078 ns |       832.9610 ns |   1.47 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleClass           |     1,651.7574 ns |     1,647.1260 ns |     1,575.7463 ns |     1,761.2207 ns |   3.36 |         - |  0.2480 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | ProtobufDeserializeSimpleClass                  |     1,182.8153 ns |       501.3566 ns |       458.2103 ns |       555.4371 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleClass                    |        89.6077 ns |        90.1009 ns |        86.2565 ns |        91.9253 ns |   1.00 |   1,150 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleClass              |       382.1221 ns |       380.0247 ns |       354.0909 ns |       404.3215 ns |   4.27 |   1,148 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleClass             |       763.8358 ns |       767.9242 ns |       699.0044 ns |       796.7140 ns |   8.53 |   1,112 B |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufSerializeSimpleClass                    |       215.0585 ns |        90.1009 ns |        86.2565 ns |        91.9253 ns |   1.00 |   1,150 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleClasses                |    52,930.1909 ns |    53,011.7750 ns |    50,106.9024 ns |    54,465.7044 ns |   1.00 |         - | 18.3105 |  5.4932 |       - |  253624 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleClasses          |    66,724.9567 ns |    66,840.7021 ns |    62,312.6951 ns |    70,738.7496 ns |   1.26 |         - | 18.1885 |  5.1270 |       - |  253624 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleClasses         |   182,620.4460 ns |   180,712.2681 ns |   172,319.0024 ns |   196,167.8262 ns |   3.45 |         - | 17.5781 |  4.8828 |       - |  253624 B |        1.00 |
| SimpleTest          | ProtobufDeserializeSimpleClasses                |   127,032.4582 ns |    53,011.7750 ns |    50,106.9024 ns |    54,465.7044 ns |   1.00 |         - | 18.3105 |  5.4932 |       - |  253624 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleClasses                  |    10,280.8855 ns |    10,015.0644 ns |     9,578.6866 ns |    11,789.0480 ns |   1.00 | 115,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleClasses            |    33,288.3297 ns |    32,725.7112 ns |    30,751.6458 ns |    35,792.7002 ns |   3.25 | 114,804 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleClasses           |    79,774.6829 ns |    80,758.9073 ns |    72,051.3616 ns |    84,804.9857 ns |   7.79 | 111,203 B |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufSerializeSimpleClasses                  |    24,674.1252 ns |    10,015.0644 ns |     9,578.6866 ns |    11,789.0480 ns |   1.00 | 115,004 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleStruct                 |         0.3125 ns |         0.3112 ns |         0.1847 ns |         0.4509 ns |   1.06 |         - |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackDeserializeSimpleStruct           |         0.3410 ns |         0.3505 ns |         0.2098 ns |         0.4615 ns |   1.16 |         - |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackDeserializeSimpleStruct          |        52.8118 ns |        52.7863 ns |        49.3811 ns |        56.3096 ns | 179.31 |         - |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufDeserializeSimpleStruct                 |         0.7500 ns |         0.3112 ns |         0.1847 ns |         0.4509 ns |   1.06 |         - |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleStruct                   |         1.3382 ns |         1.3356 ns |         1.0962 ns |         1.6809 ns |   1.01 |      12 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleStruct             |         3.0274 ns |         3.0656 ns |         2.6133 ns |         3.3026 ns |   2.29 |      12 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleStruct            |        42.7727 ns |        42.7392 ns |        40.7685 ns |        45.1772 ns |  32.42 |      16 B |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufSerializeSimpleStruct                   |         3.2117 ns |         1.3356 ns |         1.0962 ns |         1.6809 ns |   1.01 |      12 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleStructs                |       131.3033 ns |       132.5233 ns |       120.2692 ns |       138.7890 ns |   1.00 |         - |  0.1214 |       - |       - |    1224 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleStructs          |       133.3527 ns |       131.4184 ns |       127.2872 ns |       147.4623 ns |   1.02 |         - |  0.1214 |       - |       - |    1224 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleStructs         |     2,919.9335 ns |     2,892.0609 ns |     2,651.3150 ns |     3,327.5507 ns |  22.29 |         - |  0.1297 |  0.0076 |  0.0076 |         - |        0.00 |
| SimpleTest          | ProtobufDeserializeSimpleStructs                |       315.1279 ns |       132.5233 ns |       120.2692 ns |       138.7890 ns |   1.00 |         - |  0.1214 |       - |       - |    1224 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleStructs                  |        15.0572 ns |        15.0926 ns |        13.4741 ns |        16.2973 ns |   1.00 |   1,204 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleStructs            |        15.4777 ns |        15.4198 ns |        14.7406 ns |        16.4751 ns |   1.03 |   1,204 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleStructs           |     2,965.7871 ns |     2,978.7563 ns |     2,677.0252 ns |     3,249.8076 ns | 197.39 |   1,603 B |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufSerializeSimpleStructs                  |        36.1373 ns |        15.0926 ns |        13.4741 ns |        16.2973 ns |   1.00 |   1,204 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClass                |       521.0727 ns |       524.8786 ns |       496.3595 ns |       574.3951 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClass          |       764.3313 ns |       757.7421 ns |       736.4055 ns |       798.7311 ns |   1.47 |         - |  0.2451 |       - |       - |    2528 B |        1.00 |
| VersionTolerantTest | MessagePackDeserializeTolerantClass                |     1,615.3254 ns |       524.8786 ns |       496.3595 ns |       574.3951 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| VersionTolerantTest | ProtobufDeserializeTolerantClass                |     1,250.5745 ns |       524.8786 ns |       496.3595 ns |       574.3951 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoSerializeTolerantClass                  |        94.3630 ns |        94.7205 ns |        87.3816 ns |       101.7905 ns |   1.00 |   1,154 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClass            |       418.4511 ns |       418.8876 ns |       393.4790 ns |       468.7534 ns |   4.44 |   1,164 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MessagePackSerializeTolerantClass                  |       292.5253 ns |        94.7205 ns |        87.3816 ns |       101.7905 ns |   1.00 |   1,154 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | ProtobufSerializeTolerantClass                  |       226.4712 ns |        94.7205 ns |        87.3816 ns |       101.7905 ns |   1.00 |   1,154 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClasses              |    57,682.0058 ns |    56,736.4726 ns |    55,517.0137 ns |    61,734.9037 ns |   1.00 |         - | 18.4326 |  5.7373 |       - |  253624 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClasses        |    79,990.9113 ns |    81,528.4921 ns |    74,885.6201 ns |    85,180.2208 ns |   1.39 |         - | 17.9443 |  5.6152 |       - |  253624 B |        1.00 |
| VersionTolerantTest | MessagePackDeserializeTolerantClasses              |   178,814.2180 ns |    56,736.4726 ns |    55,517.0137 ns |    61,734.9037 ns |   1.00 |         - | 18.4326 |  5.7373 |       - |  253624 B |        1.00 |
| VersionTolerantTest | ProtobufDeserializeTolerantClasses              |   138,436.8139 ns |    56,736.4726 ns |    55,517.0137 ns |    61,734.9037 ns |   1.00 |         - | 18.4326 |  5.7373 |       - |  253624 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoSerializeTolerantClasses                |    10,267.5625 ns |    10,323.3566 ns |     9,426.2225 ns |    10,776.4607 ns |   1.00 | 115,404 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClasses          |    40,558.8009 ns |    40,232.5351 ns |    37,961.6306 ns |    43,179.2206 ns |   3.96 | 116,404 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MessagePackSerializeTolerantClasses                |    31,829.4438 ns |    10,323.3566 ns |     9,426.2225 ns |    10,776.4607 ns |   1.00 | 115,404 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | ProtobufSerializeTolerantClasses                |    24,642.1500 ns |    10,323.3566 ns |     9,426.2225 ns |    10,776.4607 ns |   1.00 | 115,404 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeVectors                      |   104,548.2808 ns |   105,034.5450 ns |    90,615.1733 ns |   113,076.9202 ns |   1.00 |         - |  8.1787 |  8.1787 |  8.1787 |  160016 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeVectors                |   111,234.7055 ns |   111,837.7678 ns |   101,650.6357 ns |   118,846.8276 ns |   1.07 |         - |  8.3008 |  8.3008 |  8.3008 |  160016 B |        1.00 |
| SimpleTest          | MessagePackDeserializeVectors               |   312,742.9745 ns |   308,517.1653 ns |   289,028.3967 ns |   343,698.4690 ns |   3.00 |         - | 12.2070 | 12.2070 | 12.2070 |  160024 B |        1.00 |
| SimpleTest          | ProtobufDeserializeVectors                      |   250,915.8739 ns |   105,034.5450 ns |    90,615.1733 ns |   113,076.9202 ns |   1.00 |         - |  8.1787 |  8.1787 |  8.1787 |  160016 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeVectors                        |     4,185.7958 ns |     4,210.3811 ns |     3,919.2227 ns |     4,510.8003 ns |   1.00 | 160,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeVectors                  |     4,326.0336 ns |     4,331.5631 ns |     4,101.5232 ns |     4,553.1488 ns |   1.03 | 160,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeVectors                 |   126,388.6037 ns |   126,359.8853 ns |   118,694.3779 ns |   134,574.5696 ns |  30.23 | 210,003 B |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufSerializeVectors                        |    10,045.9099 ns |     4,210.3811 ns |     3,919.2227 ns |     4,510.8003 ns |   1.00 | 160,004 B |       - |       - |       - |         - |          NA |
| WorkloadTest        | NinoSerializeRpcRequest | 16.0812 ns | 16.0812 ns | 15.7596 ns | 16.4029 ns | 1.00 | 84,159 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeRpcRequest | 364.8867 ns | 364.8867 ns | 357.5890 ns | 372.1845 ns | 22.69 | 251,640 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeRpcRequest | 8.6590 ns | 8.6590 ns | 8.4858 ns | 8.8322 ns | 0.54 | 260,887 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeRpcRequest | 15.9950 ns | 15.9950 ns | 15.6751 ns | 16.3149 ns | 0.99 | 134,694 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeRpcRequest | 15.6743 ns | 15.6743 ns | 15.3608 ns | 15.9877 ns | 0.97 | 143,997 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeRpcRequest | 15.6142 ns | 15.6142 ns | 15.3019 ns | 15.9265 ns | 0.97 | 257,667 B | - | - | - | 699373 B | NA |
| WorkloadTest        | NinoDeserializeRpcRequest | 56.8359 ns | 56.8359 ns | 55.6992 ns | 57.9726 ns | 1.00 | - | - | - | - | 403978 B | NA |
| WorkloadTest        | MemoryPackDeserializeRpcRequest | 533.8853 ns | 533.8853 ns | 523.2076 ns | 544.5630 ns | 9.39 | - | - | - | - | 327450 B | NA |
| WorkloadTest        | MessagePackDeserializeRpcRequest | 57.9222 ns | 57.9222 ns | 56.7638 ns | 59.0806 ns | 1.02 | - | - | - | - | 206143 B | NA |
| WorkloadTest        | ProtobufDeserializeRpcRequest | 57.9941 ns | 57.9941 ns | 56.8342 ns | 59.1540 ns | 1.02 | - | - | - | - | 109578 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeRpcRequest | 57.1270 ns | 57.1270 ns | 55.9845 ns | 58.2696 ns | 1.01 | - | - | - | - | 225191 B | NA |
| WorkloadTest        | JsonDeserializeRpcRequest | 57.5390 ns | 57.5390 ns | 56.3882 ns | 58.6898 ns | 1.01 | - | - | - | - | 853490 B | NA |
| WorkloadTest        | NinoSerializeOrdersPage | 10,504.2076 ns | 10,504.2076 ns | 10,294.1234 ns | 10,714.2917 ns | 1.00 | 164,683 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeOrdersPage | 7,574.9283 ns | 7,574.9283 ns | 7,423.4298 ns | 7,726.4269 ns | 0.72 | 133,342 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeOrdersPage | 7,204.8949 ns | 7,204.8949 ns | 7,060.7970 ns | 7,348.9928 ns | 0.69 | 188,269 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeOrdersPage | 44,448.9117 ns | 44,448.9117 ns | 43,559.9335 ns | 45,337.8900 ns | 4.23 | 87,149 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeOrdersPage | 10,356.5778 ns | 10,356.5778 ns | 10,149.4463 ns | 10,563.7094 ns | 0.99 | 158,247 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeOrdersPage | 10,758.8873 ns | 10,758.8873 ns | 10,543.7096 ns | 10,974.0651 ns | 1.02 | 67,115 B | - | - | - | 275125 B | NA |
| WorkloadTest        | NinoDeserializeOrdersPage | 25,390.8317 ns | 25,390.8317 ns | 24,883.0151 ns | 25,898.6483 ns | 1.00 | - | - | - | - | 495476 B | NA |
| WorkloadTest        | MemoryPackDeserializeOrdersPage | 448,583.7986 ns | 448,583.7986 ns | 439,612.1227 ns | 457,555.4746 ns | 17.67 | - | - | - | - | 228393 B | NA |
| WorkloadTest        | MessagePackDeserializeOrdersPage | 149,428.4356 ns | 149,428.4356 ns | 146,439.8669 ns | 152,417.0043 ns | 5.89 | - | - | - | - | 887286 B | NA |
| WorkloadTest        | ProtobufDeserializeOrdersPage | 22,155.7639 ns | 22,155.7639 ns | 21,712.6487 ns | 22,598.8792 ns | 0.87 | - | - | - | - | 336522 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeOrdersPage | 22,993.8597 ns | 22,993.8597 ns | 22,533.9825 ns | 23,453.7369 ns | 0.91 | - | - | - | - | 395343 B | NA |
| WorkloadTest        | JsonDeserializeOrdersPage | 26,042.4342 ns | 26,042.4342 ns | 25,521.5855 ns | 26,563.2829 ns | 1.03 | - | - | - | - | 386451 B | NA |
| WorkloadTest        | NinoSerializeUserProfile | 150.1259 ns | 150.1259 ns | 147.1234 ns | 153.1284 ns | 1.00 | 31,682 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeUserProfile | 3,505.6520 ns | 3,505.6520 ns | 3,435.5390 ns | 3,575.7651 ns | 23.35 | 63,296 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeUserProfile | 151.4857 ns | 151.4857 ns | 148.4560 ns | 154.5155 ns | 1.01 | 59,887 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeUserProfile | 1,880.3278 ns | 1,880.3278 ns | 1,842.7213 ns | 1,917.9344 ns | 12.53 | 43,539 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeUserProfile | 84.8221 ns | 84.8221 ns | 83.1256 ns | 86.5185 ns | 0.57 | 40,201 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeUserProfile | 2,125.9273 ns | 2,125.9273 ns | 2,083.4087 ns | 2,168.4458 ns | 14.16 | 60,731 B | - | - | - | 254023 B | NA |
| WorkloadTest        | NinoDeserializeUserProfile | 368.9199 ns | 368.9199 ns | 361.5415 ns | 376.2983 ns | 1.00 | - | - | - | - | 526706 B | NA |
| WorkloadTest        | MemoryPackDeserializeUserProfile | 1,552.0193 ns | 1,552.0193 ns | 1,520.9789 ns | 1,583.0596 ns | 4.21 | - | - | - | - | 692518 B | NA |
| WorkloadTest        | MessagePackDeserializeUserProfile | 366.0999 ns | 366.0999 ns | 358.7779 ns | 373.4219 ns | 0.99 | - | - | - | - | 618769 B | NA |
| WorkloadTest        | ProtobufDeserializeUserProfile | 291.0983 ns | 291.0983 ns | 285.2764 ns | 296.9203 ns | 0.79 | - | - | - | - | 86091 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeUserProfile | 307.5899 ns | 307.5899 ns | 301.4381 ns | 313.7417 ns | 0.83 | - | - | - | - | 610309 B | NA |
| WorkloadTest        | JsonDeserializeUserProfile | 198.3710 ns | 198.3710 ns | 194.4035 ns | 202.3384 ns | 0.54 | - | - | - | - | 350804 B | NA |
| WorkloadTest        | NinoSerializeGameSnapshot | 855.4190 ns | 855.4190 ns | 838.3106 ns | 872.5274 ns | 1.00 | 126,157 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeGameSnapshot | 1,618.7634 ns | 1,618.7634 ns | 1,586.3881 ns | 1,651.1386 ns | 1.89 | 91,978 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeGameSnapshot | 846.6044 ns | 846.6044 ns | 829.6723 ns | 863.5365 ns | 0.99 | 93,851 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeGameSnapshot | 701.9967 ns | 701.9967 ns | 687.9567 ns | 716.0366 ns | 0.82 | 124,678 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeGameSnapshot | 5,724.1509 ns | 5,724.1509 ns | 5,609.6678 ns | 5,838.6339 ns | 6.69 | 106,741 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeGameSnapshot | 629.0838 ns | 629.0838 ns | 616.5021 ns | 641.6655 ns | 0.74 | 67,342 B | - | - | - | 89466 B | NA |
| WorkloadTest        | NinoDeserializeGameSnapshot | 1,711.3751 ns | 1,711.3751 ns | 1,677.1476 ns | 1,745.6026 ns | 1.00 | - | - | - | - | 229928 B | NA |
| WorkloadTest        | MemoryPackDeserializeGameSnapshot | 1,196.1763 ns | 1,196.1763 ns | 1,172.2528 ns | 1,220.0998 ns | 0.70 | - | - | - | - | 720047 B | NA |
| WorkloadTest        | MessagePackDeserializeGameSnapshot | 1,006.3735 ns | 1,006.3735 ns | 986.2460 ns | 1,026.5009 ns | 0.59 | - | - | - | - | 391615 B | NA |
| WorkloadTest        | ProtobufDeserializeGameSnapshot | 1,528.9754 ns | 1,528.9754 ns | 1,498.3959 ns | 1,559.5549 ns | 0.89 | - | - | - | - | 497457 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeGameSnapshot | 29,533.4448 ns | 29,533.4448 ns | 28,942.7759 ns | 30,124.1137 ns | 17.26 | - | - | - | - | 11480 B | NA |
| WorkloadTest        | JsonDeserializeGameSnapshot | 1,755.1885 ns | 1,755.1885 ns | 1,720.0848 ns | 1,790.2923 ns | 1.03 | - | - | - | - | 671119 B | NA |
| WorkloadTest        | NinoSerializeLogBatch | 44,606.8469 ns | 44,606.8469 ns | 43,714.7100 ns | 45,498.9838 ns | 1.00 | 3,714 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeLogBatch | 44,214.2662 ns | 44,214.2662 ns | 43,329.9809 ns | 45,098.5515 ns | 0.99 | 6,694 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeLogBatch | 28,714.9168 ns | 28,714.9168 ns | 28,140.6185 ns | 29,289.2151 ns | 0.64 | 7,180 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeLogBatch | 1,172,897.0974 ns | 1,172,897.0974 ns | 1,149,439.1555 ns | 1,196,355.0394 ns | 26.29 | 6,661 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeLogBatch | 26,965.1800 ns | 26,965.1800 ns | 26,425.8764 ns | 27,504.4836 ns | 0.60 | 4,116 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeLogBatch | 33,875.3134 ns | 33,875.3134 ns | 33,197.8071 ns | 34,552.8197 ns | 0.76 | 6,920 B | - | - | - | 637832 B | NA |
| WorkloadTest        | NinoDeserializeLogBatch | 149,492.7172 ns | 149,492.7172 ns | 146,502.8628 ns | 152,482.5715 ns | 1.00 | - | - | - | - | 247218 B | NA |
| WorkloadTest        | MemoryPackDeserializeLogBatch | 149,128.0549 ns | 149,128.0549 ns | 146,145.4938 ns | 152,110.6160 ns | 1.00 | - | - | - | - | 522446 B | NA |
| WorkloadTest        | MessagePackDeserializeLogBatch | 1,563,623.7610 ns | 1,563,623.7610 ns | 1,532,351.2858 ns | 1,594,896.2362 ns | 10.46 | - | - | - | - | 40983 B | NA |
| WorkloadTest        | ProtobufDeserializeLogBatch | 149,505.4272 ns | 149,505.4272 ns | 146,515.3187 ns | 152,495.5357 ns | 1.00 | - | - | - | - | 582799 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeLogBatch | 78,073.2441 ns | 78,073.2441 ns | 76,511.7792 ns | 79,634.7090 ns | 0.52 | - | - | - | - | 896350 B | NA |
| WorkloadTest        | JsonDeserializeLogBatch | 84,106.8213 ns | 84,106.8213 ns | 82,424.6849 ns | 85,788.9578 ns | 0.56 | - | - | - | - | 4730 B | NA |
| WorkloadTest        | NinoSerializeEventStream | 4,396.7026 ns | 4,396.7026 ns | 4,308.7685 ns | 4,484.6366 ns | 1.00 | 130,225 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeEventStream | 4,365.5602 ns | 4,365.5602 ns | 4,278.2490 ns | 4,452.8714 ns | 0.99 | 144,071 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeEventStream | 2,218.2295 ns | 2,218.2295 ns | 2,173.8649 ns | 2,262.5940 ns | 0.50 | 111,303 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeEventStream | 73,467.7977 ns | 73,467.7977 ns | 71,998.4417 ns | 74,937.1536 ns | 16.71 | 100,399 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeEventStream | 60,650.2531 ns | 60,650.2531 ns | 59,437.2481 ns | 61,863.2582 ns | 13.79 | 123,931 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeEventStream | 49,267.5817 ns | 49,267.5817 ns | 48,282.2300 ns | 50,252.9333 ns | 11.21 | 138,592 B | - | - | - | 664696 B | NA |
| WorkloadTest        | NinoDeserializeEventStream | 11,548.4941 ns | 11,548.4941 ns | 11,317.5242 ns | 11,779.4639 ns | 1.00 | - | - | - | - | 869023 B | NA |
| WorkloadTest        | MemoryPackDeserializeEventStream | 7,693.1413 ns | 7,693.1413 ns | 7,539.2784 ns | 7,847.0041 ns | 0.67 | - | - | - | - | 156657 B | NA |
| WorkloadTest        | MessagePackDeserializeEventStream | 85,230.5504 ns | 85,230.5504 ns | 83,525.9394 ns | 86,935.1614 ns | 7.38 | - | - | - | - | 760234 B | NA |
| WorkloadTest        | ProtobufDeserializeEventStream | 94,189.1349 ns | 94,189.1349 ns | 92,305.3522 ns | 96,072.9176 ns | 8.16 | - | - | - | - | 523977 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeEventStream | 11,794.7072 ns | 11,794.7072 ns | 11,558.8131 ns | 12,030.6014 ns | 1.02 | - | - | - | - | 461501 B | NA |
| WorkloadTest        | JsonDeserializeEventStream | 11,435.8602 ns | 11,435.8602 ns | 11,207.1430 ns | 11,664.5774 ns | 0.99 | - | - | - | - | 48237 B | NA |

</details>

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
IterationCount=15  LaunchCount=1  WarmupCount=5  

```
| Type                | Method                                      | Mean              | Median            | Min               | Max               | Ratio  | Payload   | Gen0    | Gen1    | Gen2    | Allocated | Alloc Ratio |
|-------------------- |-------------------------------------------- |------------------:|------------------:|------------------:|------------------:|-------:|----------:|--------:|--------:|--------:|----------:|------------:|
| FixedSizeTest       | NinoDeserializeFixedClass                   |        11.0860 ns |        11.1748 ns |        10.0276 ns |        11.8051 ns |   1.00 |         - |  0.0054 |       - |       - |      56 B |        1.00 |
| FixedSizeTest       | MemoryPackDeserializeFixedClass             |        22.0626 ns |        22.0762 ns |        20.0715 ns |        24.6171 ns |   1.99 |         - |  0.0055 |  0.0001 |  0.0001 |      56 B |        1.00 |
| FixedSizeTest       | MessagePackDeserializeFixedClass                   |        34.3666 ns |        11.1748 ns |        10.0276 ns |        11.8051 ns |   1.00 |         - |  0.0054 |       - |       - |      56 B |        1.00 |
| FixedSizeTest       | ProtobufDeserializeFixedClass                   |        26.6064 ns |        11.1748 ns |        10.0276 ns |        11.8051 ns |   1.00 |         - |  0.0054 |       - |       - |      56 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedClass                     |        12.0111 ns |        11.8445 ns |        11.2881 ns |        13.2462 ns |   1.00 |      41 B |  0.0069 |       - |       - |      72 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClass               |        21.8931 ns |        21.8365 ns |        20.0607 ns |        24.3061 ns |   1.83 |      41 B |  0.0070 |       - |       - |      72 B |        1.00 |
| FixedSizeTest       | MessagePackSerializeFixedClass                     |        37.2344 ns |        11.8445 ns |        11.2881 ns |        13.2462 ns |   1.00 |      41 B |  0.0069 |       - |       - |      72 B |        1.00 |
| FixedSizeTest       | ProtobufSerializeFixedClass                     |        28.8266 ns |        11.8445 ns |        11.2881 ns |        13.2462 ns |   1.00 |      41 B |  0.0069 |       - |       - |      72 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoDeserializeFixedClasses                 |     1,369.5749 ns |     1,376.4601 ns |     1,246.1121 ns |     1,599.6303 ns |   1.00 |         - |  0.6256 |  0.0076 |       - |    6424 B |        1.00 |
| FixedSizeTest       | MemoryPackDeserializeFixedClasses           |     2,221.0162 ns |     2,447.2413 ns |     1,308.8883 ns |     2,836.0838 ns |   1.63 |         - |  0.6256 |  0.0038 |       - |    6424 B |        1.00 |
| FixedSizeTest       | MessagePackDeserializeFixedClasses                 |     4,245.6822 ns |     1,376.4601 ns |     1,246.1121 ns |     1,599.6303 ns |   1.00 |         - |  0.6256 |  0.0076 |       - |    6424 B |        1.00 |
| FixedSizeTest       | ProtobufDeserializeFixedClasses                 |     3,286.9798 ns |     1,376.4601 ns |     1,246.1121 ns |     1,599.6303 ns |   1.00 |         - |  0.6256 |  0.0076 |       - |    6424 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedClasses                   |     1,012.0662 ns |       897.1137 ns |       813.5906 ns |     1,271.8286 ns |   1.03 |   4,104 B |  0.4110 |       - |       - |    4128 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClasses             |     1,742.8963 ns |     1,738.1253 ns |     1,658.9868 ns |     1,857.5017 ns |   1.77 |   4,104 B |  0.3967 |       - |       - |    4128 B |        1.00 |
| FixedSizeTest       | MessagePackSerializeFixedClasses                   |     3,137.4052 ns |       897.1137 ns |       813.5906 ns |     1,271.8286 ns |   1.03 |   4,104 B |  0.4110 |       - |       - |    4128 B |        1.00 |
| FixedSizeTest       | ProtobufSerializeFixedClasses                   |     2,428.9589 ns |       897.1137 ns |       813.5906 ns |     1,271.8286 ns |   1.03 |   4,104 B |  0.4110 |       - |       - |    4128 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoDeserializeFixedStruct                  |         0.0330 ns |         0.0000 ns |         0.0000 ns |         0.1479 ns |      ? |         - |       - |       - |       - |         - |           ? |
| FixedSizeTest       | MemoryPackDeserializeFixedStruct            |         0.5361 ns |         0.5568 ns |         0.2877 ns |         0.8564 ns |      ? |         - |       - |       - |       - |         - |           ? |
| FixedSizeTest       | MessagePackDeserializeFixedStruct                  |         0.1023 ns |         0.0000 ns |         0.0000 ns |         0.1479 ns |      ? |         - |       - |       - |       - |         - |           ? |
| FixedSizeTest       | ProtobufDeserializeFixedStruct                  |         0.0792 ns |         0.0000 ns |         0.0000 ns |         0.1479 ns |      ? |         - |       - |       - |       - |         - |           ? |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedStruct                    |        11.5048 ns |        11.3409 ns |        11.0178 ns |        12.2607 ns |   1.00 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedStruct              |        11.6760 ns |        11.5850 ns |        10.7735 ns |        12.7479 ns |   1.02 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
| FixedSizeTest       | MessagePackSerializeFixedStruct                    |        35.6649 ns |        11.3409 ns |        11.0178 ns |        12.2607 ns |   1.00 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
| FixedSizeTest       | ProtobufSerializeFixedStruct                    |        27.6115 ns |        11.3409 ns |        11.0178 ns |        12.2607 ns |   1.00 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| ReferenceTest       | NinoDeserializeGraph                        |     5,708.5715 ns |     5,747.2174 ns |     5,489.3158 ns |     5,864.1501 ns |   1.00 |         - |  1.3657 |  0.0305 |       - |   14104 B |        1.00 |
| ReferenceTest       | MemoryPackDeserializeGraph                  |    17,241.1692 ns |    17,045.5469 ns |    16,306.2630 ns |    18,759.5018 ns |   3.02 |         - |  1.3733 |  0.0305 |       - |   14104 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| ReferenceTest       | NinoSerializeGraph                          |     4,558.5943 ns |     4,537.5344 ns |     4,387.9276 ns |     4,840.6198 ns |   1.00 |   5,948 B |       - |       - |       - |         - |          NA |
| ReferenceTest       | MemoryPackSerializeGraph                    |    24,065.6332 ns |    23,980.4084 ns |    22,975.4215 ns |    25,947.5957 ns |   5.28 |   5,584 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoLeavesNew                               |     3,876.7935 ns |     3,889.5247 ns |     3,619.7647 ns |     4,062.7215 ns |   1.00 |         - |  1.3275 |  0.0305 |       - |   13656 B |        1.00 |
| PooledGraphTest     | MessagePackLeavesNew                               |    12,018.0599 ns |     3,889.5247 ns |     3,619.7647 ns |     4,062.7215 ns |   1.00 |         - |  1.3275 |  0.0305 |       - |   13656 B |        1.00 |
| PooledGraphTest     | ProtobufLeavesNew                               |     9,304.3044 ns |     3,889.5247 ns |     3,619.7647 ns |     4,062.7215 ns |   1.00 |         - |  1.3275 |  0.0305 |       - |   13656 B |        1.00 |
| PooledGraphTest     | NinoLeavesPooledElements                    |     2,448.3189 ns |     2,463.4706 ns |     2,313.7609 ns |     2,593.9444 ns |   0.63 |         - |  0.0839 |       - |       - |     856 B |        0.06 |
| PooledGraphTest     | NinoLeavesInPlace                           |       505.0119 ns |       504.4580 ns |       470.3849 ns |       544.3157 ns |   0.13 |         - |       - |       - |       - |         - |        0.00 |
| PooledGraphTest     | MemoryPackLeavesNew                         |     4,128.5899 ns |     4,134.1907 ns |     3,812.1796 ns |     4,294.3501 ns |   1.07 |         - |  1.3275 |  0.0229 |       - |   13656 B |        1.00 |
| PooledGraphTest     | MemoryPackLeavesOverwrite                   |     4,388.1175 ns |     4,406.4875 ns |     4,056.5629 ns |     4,780.3392 ns |   1.13 |         - |  1.2360 |  0.0076 |       - |   12800 B |        0.94 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoNodeNew                                 |       637.6911 ns |       631.5708 ns |       611.9775 ns |       682.2081 ns |   1.00 |         - |  0.2136 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | MessagePackNodeNew                                 |     1,976.8424 ns |       631.5708 ns |       611.9775 ns |       682.2081 ns |   1.00 |         - |  0.2136 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | ProtobufNodeNew                                 |     1,530.4586 ns |       631.5708 ns |       611.9775 ns |       682.2081 ns |   1.00 |         - |  0.2136 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | NinoNodePooled                              |       211.6913 ns |       210.3109 ns |       203.9490 ns |       222.2315 ns |   0.33 |         - |       - |       - |       - |         - |        0.00 |
| PooledGraphTest     | MemoryPackNodeNew                           |       654.5474 ns |       656.0013 ns |       609.5359 ns |       702.3794 ns |   1.03 |         - |  0.2117 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | MemoryPackNodeOverwrite                     |       510.6307 ns |       510.1689 ns |       478.4672 ns |       547.9164 ns |   0.80 |         - |  0.0982 |       - |       - |    1024 B |        0.47 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoPlainNew                                |     3,160.7732 ns |     3,172.2773 ns |     2,935.4816 ns |     3,421.1302 ns |   1.00 |         - |  1.2550 |  0.0305 |       - |   12856 B |        1.00 |
| PooledGraphTest     | MemoryPackPlainNew                          |     3,774.2958 ns |     3,737.7184 ns |     3,540.4649 ns |     4,097.0168 ns |   1.20 |         - |  1.2512 |  0.0229 |       - |   12856 B |        1.00 |
| PooledGraphTest     | MessagePackPlainNew                                |     9,798.3969 ns |     3,172.2773 ns |     2,935.4816 ns |     3,421.1302 ns |   1.00 |         - |  1.2550 |  0.0305 |       - |   12856 B |        1.00 |
| PooledGraphTest     | ProtobufPlainNew                                |     7,585.8557 ns |     3,172.2773 ns |     2,935.4816 ns |     3,421.1302 ns |   1.00 |         - |  1.2550 |  0.0305 |       - |   12856 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicClassArray        |   284,544.0570 ns |   278,595.1274 ns |   259,762.4878 ns |   327,473.9668 ns |   1.00 |         - | 31.7383 | 13.6719 |       - |  745624 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicClassArray  |   409,225.6877 ns |   405,800.2476 ns |   354,880.1650 ns |   459,854.7686 ns |   1.44 |         - | 30.2734 | 14.1602 |       - |  745624 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicClassArray | 1,610,212.7331 ns | 1,566,666.2852 ns | 1,455,321.4512 ns | 1,794,850.4629 ns |   5.68 |         - | 46.8750 | 19.5313 |       - | 1162424 B |        1.56 |
| PolymorphicTest     | ProtobufDeserializePolymorphicClassArray        |   682,905.7368 ns |   278,595.1274 ns |   259,762.4878 ns |   327,473.9668 ns |   1.00 |         - | 31.7383 | 13.6719 |       - |  745624 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicClassArray          |    54,994.8444 ns |    54,631.0397 ns |    51,168.9285 ns |    58,656.5017 ns |   1.00 | 397,304 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicClassArray    |   280,897.4215 ns |   275,357.4402 ns |   255,944.9763 ns |   309,417.4329 ns |   5.11 | 384,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicClassArray   |   775,118.1399 ns |   764,609.5889 ns |   731,123.6758 ns |   863,211.1631 ns |  14.11 | 487,103 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | ProtobufSerializePolymorphicClassArray          |   131,987.6266 ns |    54,631.0397 ns |    51,168.9285 ns |    58,656.5017 ns |   1.00 | 397,304 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicClass             |    20,296.9095 ns |    20,234.8878 ns |    18,711.7913 ns |    21,862.8668 ns |   1.00 |         - |  7.3853 |  1.2817 |       - |   79688 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicClass       |    30,326.7067 ns |    29,909.0238 ns |    27,614.4732 ns |    33,737.2495 ns |   1.50 |         - |  7.4158 |  1.0071 |       - |   79688 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicClass      |   185,669.9667 ns |   186,862.6548 ns |   166,402.2502 ns |   195,842.5698 ns |   9.16 |         - |  7.5684 |  0.9766 |       - |   83856 B |        1.05 |
| PolymorphicTest     | ProtobufDeserializePolymorphicClass             |    48,712.5828 ns |    20,234.8878 ns |    18,711.7913 ns |    21,862.8668 ns |   1.00 |         - |  7.3853 |  1.2817 |       - |   79688 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicClass               |     6,390.4397 ns |     6,393.2117 ns |     5,930.3433 ns |     6,901.1617 ns |   1.00 |  53,789 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicClass         |    23,694.2597 ns |    23,657.7426 ns |    21,984.8369 ns |    25,531.2838 ns |   3.72 |  51,760 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicClass        |   106,403.4284 ns |   105,942.4332 ns |   101,983.6055 ns |   111,803.6821 ns |  16.68 |  66,859 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | ProtobufSerializePolymorphicClass               |    15,337.0553 ns |     6,393.2117 ns |     5,930.3433 ns |     6,901.1617 ns |   1.00 |  53,789 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicFooArray          |    19,620.2259 ns |    19,397.0100 ns |    18,294.4601 ns |    21,277.4992 ns |   1.00 |         - |  7.1716 |  1.0681 |       - |   76024 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicFooArray    |    28,076.1534 ns |    27,777.7130 ns |    26,883.9058 ns |    29,895.6654 ns |   1.43 |         - |  7.1106 |  1.0681 |       - |   76024 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicFooArray   |   175,498.7009 ns |   176,374.0947 ns |   166,641.6965 ns |   181,510.7920 ns |   8.96 |         - |  7.0801 |  0.7324 |       - |   76024 B |        1.00 |
| PolymorphicTest     | ProtobufDeserializePolymorphicFooArray          |    47,088.5422 ns |    19,397.0100 ns |    18,294.4601 ns |    21,277.4992 ns |   1.00 |         - |  7.1716 |  1.0681 |       - |   76024 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicFooArray            |     6,231.7819 ns |     6,278.8842 ns |     5,912.0486 ns |     6,508.2156 ns |   1.00 |  52,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicFooArray      |    23,330.3214 ns |    22,961.6185 ns |    20,959.0387 ns |    25,944.3397 ns |   3.75 |  50,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicFooArray     |   105,334.9285 ns |   105,199.2419 ns |    99,884.6250 ns |   111,919.3000 ns |  16.91 |  65,203 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | ProtobufSerializePolymorphicFooArray            |    14,956.2766 ns |     6,278.8842 ns |     5,912.0486 ns |     6,508.2156 ns |   1.00 |  52,404 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledTest          | NinoDeserializeNew                          |       548.6471 ns |       550.9600 ns |       526.5837 ns |       581.2650 ns |   1.00 |         - |  0.2451 |  0.0010 |       - |    2536 B |        1.00 |
| PooledTest          | MessagePackDeserializeNew                          |     1,700.8060 ns |       550.9600 ns |       526.5837 ns |       581.2650 ns |   1.00 |         - |  0.2451 |  0.0010 |       - |    2536 B |        1.00 |
| PooledTest          | ProtobufDeserializeNew                          |     1,316.7530 ns |       550.9600 ns |       526.5837 ns |       581.2650 ns |   1.00 |         - |  0.2451 |  0.0010 |       - |    2536 B |        1.00 |
| PooledTest          | NinoDeserializePooled                       |       222.1494 ns |       220.8111 ns |       206.6481 ns |       240.5492 ns |   0.41 |         - |       - |       - |       - |         - |        0.00 |
| PooledTest          | MemoryPackDeserializeNew                    |       655.1230 ns |       652.9136 ns |       625.4202 ns |       701.2852 ns |   1.20 |         - |  0.2460 |       - |       - |    2536 B |        1.00 |
| PooledTest          | MemoryPackDeserializeOverwrite              |       553.0911 ns |       551.9693 ns |       532.1793 ns |       585.0788 ns |   1.01 |         - |  0.1049 |       - |       - |    1080 B |        0.43 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleClass                  |       492.8397 ns |       501.3566 ns |       458.2103 ns |       555.4371 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleClass            |       722.1478 ns |       725.1683 ns |       626.6078 ns |       832.9610 ns |   1.47 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleClass           |     1,651.7574 ns |     1,647.1260 ns |     1,575.7463 ns |     1,761.2207 ns |   3.36 |         - |  0.2480 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | ProtobufDeserializeSimpleClass                  |     1,182.8153 ns |       501.3566 ns |       458.2103 ns |       555.4371 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleClass                    |        89.6077 ns |        90.1009 ns |        86.2565 ns |        91.9253 ns |   1.00 |   1,150 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleClass              |       382.1221 ns |       380.0247 ns |       354.0909 ns |       404.3215 ns |   4.27 |   1,148 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleClass             |       763.8358 ns |       767.9242 ns |       699.0044 ns |       796.7140 ns |   8.53 |   1,112 B |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufSerializeSimpleClass                    |       215.0585 ns |        90.1009 ns |        86.2565 ns |        91.9253 ns |   1.00 |   1,150 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleClasses                |    52,930.1909 ns |    53,011.7750 ns |    50,106.9024 ns |    54,465.7044 ns |   1.00 |         - | 18.3105 |  5.4932 |       - |  253624 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleClasses          |    66,724.9567 ns |    66,840.7021 ns |    62,312.6951 ns |    70,738.7496 ns |   1.26 |         - | 18.1885 |  5.1270 |       - |  253624 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleClasses         |   182,620.4460 ns |   180,712.2681 ns |   172,319.0024 ns |   196,167.8262 ns |   3.45 |         - | 17.5781 |  4.8828 |       - |  253624 B |        1.00 |
| SimpleTest          | ProtobufDeserializeSimpleClasses                |   127,032.4582 ns |    53,011.7750 ns |    50,106.9024 ns |    54,465.7044 ns |   1.00 |         - | 18.3105 |  5.4932 |       - |  253624 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleClasses                  |    10,280.8855 ns |    10,015.0644 ns |     9,578.6866 ns |    11,789.0480 ns |   1.00 | 115,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleClasses            |    33,288.3297 ns |    32,725.7112 ns |    30,751.6458 ns |    35,792.7002 ns |   3.25 | 114,804 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleClasses           |    79,774.6829 ns |    80,758.9073 ns |    72,051.3616 ns |    84,804.9857 ns |   7.79 | 111,203 B |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufSerializeSimpleClasses                  |    24,674.1252 ns |    10,015.0644 ns |     9,578.6866 ns |    11,789.0480 ns |   1.00 | 115,004 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleStruct                 |         0.3125 ns |         0.3112 ns |         0.1847 ns |         0.4509 ns |   1.06 |         - |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackDeserializeSimpleStruct           |         0.3410 ns |         0.3505 ns |         0.2098 ns |         0.4615 ns |   1.16 |         - |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackDeserializeSimpleStruct          |        52.8118 ns |        52.7863 ns |        49.3811 ns |        56.3096 ns | 179.31 |         - |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufDeserializeSimpleStruct                 |         0.7500 ns |         0.3112 ns |         0.1847 ns |         0.4509 ns |   1.06 |         - |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleStruct                   |         1.3382 ns |         1.3356 ns |         1.0962 ns |         1.6809 ns |   1.01 |      12 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleStruct             |         3.0274 ns |         3.0656 ns |         2.6133 ns |         3.3026 ns |   2.29 |      12 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleStruct            |        42.7727 ns |        42.7392 ns |        40.7685 ns |        45.1772 ns |  32.42 |      16 B |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufSerializeSimpleStruct                   |         3.2117 ns |         1.3356 ns |         1.0962 ns |         1.6809 ns |   1.01 |      12 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleStructs                |       131.3033 ns |       132.5233 ns |       120.2692 ns |       138.7890 ns |   1.00 |         - |  0.1214 |       - |       - |    1224 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleStructs          |       133.3527 ns |       131.4184 ns |       127.2872 ns |       147.4623 ns |   1.02 |         - |  0.1214 |       - |       - |    1224 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleStructs         |     2,919.9335 ns |     2,892.0609 ns |     2,651.3150 ns |     3,327.5507 ns |  22.29 |         - |  0.1297 |  0.0076 |  0.0076 |         - |        0.00 |
| SimpleTest          | ProtobufDeserializeSimpleStructs                |       315.1279 ns |       132.5233 ns |       120.2692 ns |       138.7890 ns |   1.00 |         - |  0.1214 |       - |       - |    1224 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleStructs                  |        15.0572 ns |        15.0926 ns |        13.4741 ns |        16.2973 ns |   1.00 |   1,204 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleStructs            |        15.4777 ns |        15.4198 ns |        14.7406 ns |        16.4751 ns |   1.03 |   1,204 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleStructs           |     2,965.7871 ns |     2,978.7563 ns |     2,677.0252 ns |     3,249.8076 ns | 197.39 |   1,603 B |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufSerializeSimpleStructs                  |        36.1373 ns |        15.0926 ns |        13.4741 ns |        16.2973 ns |   1.00 |   1,204 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClass                |       521.0727 ns |       524.8786 ns |       496.3595 ns |       574.3951 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClass          |       764.3313 ns |       757.7421 ns |       736.4055 ns |       798.7311 ns |   1.47 |         - |  0.2451 |       - |       - |    2528 B |        1.00 |
| VersionTolerantTest | MessagePackDeserializeTolerantClass                |     1,615.3254 ns |       524.8786 ns |       496.3595 ns |       574.3951 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| VersionTolerantTest | ProtobufDeserializeTolerantClass                |     1,250.5745 ns |       524.8786 ns |       496.3595 ns |       574.3951 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoSerializeTolerantClass                  |        94.3630 ns |        94.7205 ns |        87.3816 ns |       101.7905 ns |   1.00 |   1,154 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClass            |       418.4511 ns |       418.8876 ns |       393.4790 ns |       468.7534 ns |   4.44 |   1,164 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MessagePackSerializeTolerantClass                  |       292.5253 ns |        94.7205 ns |        87.3816 ns |       101.7905 ns |   1.00 |   1,154 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | ProtobufSerializeTolerantClass                  |       226.4712 ns |        94.7205 ns |        87.3816 ns |       101.7905 ns |   1.00 |   1,154 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClasses              |    57,682.0058 ns |    56,736.4726 ns |    55,517.0137 ns |    61,734.9037 ns |   1.00 |         - | 18.4326 |  5.7373 |       - |  253624 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClasses        |    79,990.9113 ns |    81,528.4921 ns |    74,885.6201 ns |    85,180.2208 ns |   1.39 |         - | 17.9443 |  5.6152 |       - |  253624 B |        1.00 |
| VersionTolerantTest | MessagePackDeserializeTolerantClasses              |   178,814.2180 ns |    56,736.4726 ns |    55,517.0137 ns |    61,734.9037 ns |   1.00 |         - | 18.4326 |  5.7373 |       - |  253624 B |        1.00 |
| VersionTolerantTest | ProtobufDeserializeTolerantClasses              |   138,436.8139 ns |    56,736.4726 ns |    55,517.0137 ns |    61,734.9037 ns |   1.00 |         - | 18.4326 |  5.7373 |       - |  253624 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoSerializeTolerantClasses                |    10,267.5625 ns |    10,323.3566 ns |     9,426.2225 ns |    10,776.4607 ns |   1.00 | 115,404 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClasses          |    40,558.8009 ns |    40,232.5351 ns |    37,961.6306 ns |    43,179.2206 ns |   3.96 | 116,404 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MessagePackSerializeTolerantClasses                |    31,829.4438 ns |    10,323.3566 ns |     9,426.2225 ns |    10,776.4607 ns |   1.00 | 115,404 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | ProtobufSerializeTolerantClasses                |    24,642.1500 ns |    10,323.3566 ns |     9,426.2225 ns |    10,776.4607 ns |   1.00 | 115,404 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeVectors                      |   104,548.2808 ns |   105,034.5450 ns |    90,615.1733 ns |   113,076.9202 ns |   1.00 |         - |  8.1787 |  8.1787 |  8.1787 |  160016 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeVectors                |   111,234.7055 ns |   111,837.7678 ns |   101,650.6357 ns |   118,846.8276 ns |   1.07 |         - |  8.3008 |  8.3008 |  8.3008 |  160016 B |        1.00 |
| SimpleTest          | MessagePackDeserializeVectors               |   312,742.9745 ns |   308,517.1653 ns |   289,028.3967 ns |   343,698.4690 ns |   3.00 |         - | 12.2070 | 12.2070 | 12.2070 |  160024 B |        1.00 |
| SimpleTest          | ProtobufDeserializeVectors                      |   250,915.8739 ns |   105,034.5450 ns |    90,615.1733 ns |   113,076.9202 ns |   1.00 |         - |  8.1787 |  8.1787 |  8.1787 |  160016 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeVectors                        |     4,185.7958 ns |     4,210.3811 ns |     3,919.2227 ns |     4,510.8003 ns |   1.00 | 160,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeVectors                  |     4,326.0336 ns |     4,331.5631 ns |     4,101.5232 ns |     4,553.1488 ns |   1.03 | 160,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeVectors                 |   126,388.6037 ns |   126,359.8853 ns |   118,694.3779 ns |   134,574.5696 ns |  30.23 | 210,003 B |       - |       - |       - |         - |          NA |
| SimpleTest          | ProtobufSerializeVectors                        |    10,045.9099 ns |     4,210.3811 ns |     3,919.2227 ns |     4,510.8003 ns |   1.00 | 160,004 B |       - |       - |       - |         - |          NA |
| WorkloadTest        | NinoSerializeRpcRequest | 19.5554 ns | 19.5554 ns | 19.1643 ns | 19.9465 ns | 1.00 | 97,548 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeRpcRequest | 13.9897 ns | 13.9897 ns | 13.7099 ns | 14.2695 ns | 0.72 | 77,959 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeRpcRequest | 19.5252 ns | 19.5252 ns | 19.1347 ns | 19.9157 ns | 1.00 | 99,570 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeRpcRequest | 132.0573 ns | 132.0573 ns | 129.4162 ns | 134.6985 ns | 6.75 | 80,068 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeRpcRequest | 19.5210 ns | 19.5210 ns | 19.1306 ns | 19.9114 ns | 1.00 | 66,663 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeRpcRequest | 10.7894 ns | 10.7894 ns | 10.5736 ns | 11.0052 ns | 0.55 | 86,225 B | - | - | - | 790985 B | NA |
| WorkloadTest        | NinoDeserializeRpcRequest | 49.7018 ns | 49.7018 ns | 48.7078 ns | 50.6959 ns | 1.00 | - | - | - | - | 488644 B | NA |
| WorkloadTest        | MemoryPackDeserializeRpcRequest | 40.8870 ns | 40.8870 ns | 40.0693 ns | 41.7048 ns | 0.82 | - | - | - | - | 174811 B | NA |
| WorkloadTest        | MessagePackDeserializeRpcRequest | 34.5583 ns | 34.5583 ns | 33.8671 ns | 35.2495 ns | 0.70 | - | - | - | - | 730726 B | NA |
| WorkloadTest        | ProtobufDeserializeRpcRequest | 104.5592 ns | 104.5592 ns | 102.4681 ns | 106.6504 ns | 2.10 | - | - | - | - | 282603 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeRpcRequest | 35.3518 ns | 35.3518 ns | 34.6448 ns | 36.0588 ns | 0.71 | - | - | - | - | 415577 B | NA |
| WorkloadTest        | JsonDeserializeRpcRequest | 149.8676 ns | 149.8676 ns | 146.8703 ns | 152.8650 ns | 3.02 | - | - | - | - | 570658 B | NA |
| WorkloadTest        | NinoSerializeOrdersPage | 10,039.8567 ns | 10,039.8567 ns | 9,839.0595 ns | 10,240.6538 ns | 1.00 | 91,885 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeOrdersPage | 10,039.7116 ns | 10,039.7116 ns | 9,838.9174 ns | 10,240.5058 ns | 1.00 | 109,086 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeOrdersPage | 10,222.5161 ns | 10,222.5161 ns | 10,018.0658 ns | 10,426.9664 ns | 1.02 | 129,063 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeOrdersPage | 9,864.3459 ns | 9,864.3459 ns | 9,667.0590 ns | 10,061.6329 ns | 0.98 | 61,776 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeOrdersPage | 7,986.1047 ns | 7,986.1047 ns | 7,826.3827 ns | 8,145.8268 ns | 0.80 | 80,998 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeOrdersPage | 27,964.8311 ns | 27,964.8311 ns | 27,405.5345 ns | 28,524.1277 ns | 2.79 | 54,017 B | - | - | - | 659019 B | NA |
| WorkloadTest        | NinoDeserializeOrdersPage | 25,281.0227 ns | 25,281.0227 ns | 24,775.4022 ns | 25,786.6431 ns | 1.00 | - | - | - | - | 23375 B | NA |
| WorkloadTest        | MemoryPackDeserializeOrdersPage | 25,760.9411 ns | 25,760.9411 ns | 25,245.7223 ns | 26,276.1599 ns | 1.02 | - | - | - | - | 111179 B | NA |
| WorkloadTest        | MessagePackDeserializeOrdersPage | 22,246.5613 ns | 22,246.5613 ns | 21,801.6300 ns | 22,691.4925 ns | 0.88 | - | - | - | - | 548479 B | NA |
| WorkloadTest        | ProtobufDeserializeOrdersPage | 494,498.2957 ns | 494,498.2957 ns | 484,608.3298 ns | 504,388.2616 ns | 19.56 | - | - | - | - | 190803 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeOrdersPage | 25,350.7165 ns | 25,350.7165 ns | 24,843.7022 ns | 25,857.7308 ns | 1.00 | - | - | - | - | 295452 B | NA |
| WorkloadTest        | JsonDeserializeOrdersPage | 681,121.1234 ns | 681,121.1234 ns | 667,498.7009 ns | 694,743.5459 ns | 26.94 | - | - | - | - | 602985 B | NA |
| WorkloadTest        | NinoSerializeUserProfile | 155.5564 ns | 155.5564 ns | 152.4453 ns | 158.6676 ns | 1.00 | 223,155 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeUserProfile | 3,914.6342 ns | 3,914.6342 ns | 3,836.3415 ns | 3,992.9269 ns | 25.17 | 175,479 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeUserProfile | 149.1205 ns | 149.1205 ns | 146.1381 ns | 152.1029 ns | 0.96 | 146,777 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeUserProfile | 158.0797 ns | 158.0797 ns | 154.9181 ns | 161.2413 ns | 1.02 | 174,265 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeUserProfile | 148.9742 ns | 148.9742 ns | 145.9947 ns | 151.9537 ns | 0.96 | 181,890 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeUserProfile | 133.7152 ns | 133.7152 ns | 131.0409 ns | 136.3895 ns | 0.86 | 150,821 B | - | - | - | 322182 B | NA |
| WorkloadTest        | NinoDeserializeUserProfile | 400.6301 ns | 400.6301 ns | 392.6175 ns | 408.6428 ns | 1.00 | - | - | - | - | 24303 B | NA |
| WorkloadTest        | MemoryPackDeserializeUserProfile | 312.5215 ns | 312.5215 ns | 306.2710 ns | 318.7719 ns | 0.78 | - | - | - | - | 638990 B | NA |
| WorkloadTest        | MessagePackDeserializeUserProfile | 405.6348 ns | 405.6348 ns | 397.5221 ns | 413.7475 ns | 1.01 | - | - | - | - | 231700 B | NA |
| WorkloadTest        | ProtobufDeserializeUserProfile | 409.6601 ns | 409.6601 ns | 401.4669 ns | 417.8533 ns | 1.02 | - | - | - | - | 160663 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeUserProfile | 400.6276 ns | 400.6276 ns | 392.6150 ns | 408.6401 ns | 1.00 | - | - | - | - | 169879 B | NA |
| WorkloadTest        | JsonDeserializeUserProfile | 371.1139 ns | 371.1139 ns | 363.6916 ns | 378.5362 ns | 0.93 | - | - | - | - | 395855 B | NA |
| WorkloadTest        | NinoSerializeGameSnapshot | 733.9254 ns | 733.9254 ns | 719.2469 ns | 748.6039 ns | 1.00 | 391,392 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeGameSnapshot | 518.8371 ns | 518.8371 ns | 508.4604 ns | 529.2139 ns | 0.71 | 146,701 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeGameSnapshot | 12,216.2007 ns | 12,216.2007 ns | 11,971.8766 ns | 12,460.5247 ns | 16.65 | 364,521 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeGameSnapshot | 11,934.8724 ns | 11,934.8724 ns | 11,696.1749 ns | 12,173.5698 ns | 16.26 | 433,672 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeGameSnapshot | 425.4883 ns | 425.4883 ns | 416.9785 ns | 433.9980 ns | 0.58 | 425,400 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeGameSnapshot | 477.8245 ns | 477.8245 ns | 468.2680 ns | 487.3809 ns | 0.65 | 271,128 B | - | - | - | 219729 B | NA |
| WorkloadTest        | NinoDeserializeGameSnapshot | 1,811.9927 ns | 1,811.9927 ns | 1,775.7529 ns | 1,848.2326 ns | 1.00 | - | - | - | - | 834789 B | NA |
| WorkloadTest        | MemoryPackDeserializeGameSnapshot | 1,136.1138 ns | 1,136.1138 ns | 1,113.3916 ns | 1,158.8361 ns | 0.63 | - | - | - | - | 718589 B | NA |
| WorkloadTest        | MessagePackDeserializeGameSnapshot | 1,862.6581 ns | 1,862.6581 ns | 1,825.4049 ns | 1,899.9112 ns | 1.03 | - | - | - | - | 365239 B | NA |
| WorkloadTest        | ProtobufDeserializeGameSnapshot | 1,073.1145 ns | 1,073.1145 ns | 1,051.6522 ns | 1,094.5768 ns | 0.59 | - | - | - | - | 729835 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeGameSnapshot | 1,857.8210 ns | 1,857.8210 ns | 1,820.6646 ns | 1,894.9774 ns | 1.03 | - | - | - | - | 859354 B | NA |
| WorkloadTest        | JsonDeserializeGameSnapshot | 1,143.3760 ns | 1,143.3760 ns | 1,120.5085 ns | 1,166.2435 ns | 0.63 | - | - | - | - | 95281 B | NA |
| WorkloadTest        | NinoSerializeLogBatch | 51,558.7343 ns | 51,558.7343 ns | 50,527.5596 ns | 52,589.9090 ns | 1.00 | 104,235 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeLogBatch | 51,957.7167 ns | 51,957.7167 ns | 50,918.5623 ns | 52,996.8710 ns | 1.01 | 181,200 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeLogBatch | 30,076.5276 ns | 30,076.5276 ns | 29,474.9970 ns | 30,678.0581 ns | 0.58 | 143,859 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeLogBatch | 1,343,964.2894 ns | 1,343,964.2894 ns | 1,317,085.0036 ns | 1,370,843.5752 ns | 26.07 | 142,149 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeLogBatch | 876,827.4393 ns | 876,827.4393 ns | 859,290.8905 ns | 894,363.9881 ns | 17.01 | 193,976 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeLogBatch | 476,102.5449 ns | 476,102.5449 ns | 466,580.4940 ns | 485,624.5958 ns | 9.23 | 171,790 B | - | - | - | 563670 B | NA |
| WorkloadTest        | NinoDeserializeLogBatch | 144,520.9409 ns | 144,520.9409 ns | 141,630.5220 ns | 147,411.3597 ns | 1.00 | - | - | - | - | 205519 B | NA |
| WorkloadTest        | MemoryPackDeserializeLogBatch | 145,241.2492 ns | 145,241.2492 ns | 142,336.4242 ns | 148,146.0742 ns | 1.00 | - | - | - | - | 370489 B | NA |
| WorkloadTest        | MessagePackDeserializeLogBatch | 145,394.5067 ns | 145,394.5067 ns | 142,486.6165 ns | 148,302.3968 ns | 1.01 | - | - | - | - | 321243 B | NA |
| WorkloadTest        | ProtobufDeserializeLogBatch | 3,295,415.7419 ns | 3,295,415.7419 ns | 3,229,507.4271 ns | 3,361,324.0568 ns | 22.80 | - | - | - | - | 435962 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeLogBatch | 4,219,147.1917 ns | 4,219,147.1917 ns | 4,134,764.2479 ns | 4,303,530.1355 ns | 29.19 | - | - | - | - | 55770 B | NA |
| WorkloadTest        | JsonDeserializeLogBatch | 2,550,297.7774 ns | 2,550,297.7774 ns | 2,499,291.8218 ns | 2,601,303.7329 ns | 17.65 | - | - | - | - | 889498 B | NA |
| WorkloadTest        | NinoSerializeEventStream | 5,899.5604 ns | 5,899.5604 ns | 5,781.5692 ns | 6,017.5516 ns | 1.00 | 62,341 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeEventStream | 3,948.9114 ns | 3,948.9114 ns | 3,869.9332 ns | 4,027.8896 ns | 0.67 | 117,595 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeEventStream | 5,882.5462 ns | 5,882.5462 ns | 5,764.8953 ns | 6,000.1971 ns | 1.00 | 91,567 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeEventStream | 4,329.0772 ns | 4,329.0772 ns | 4,242.4957 ns | 4,415.6588 ns | 0.73 | 106,927 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeEventStream | 85,584.2263 ns | 85,584.2263 ns | 83,872.5417 ns | 87,295.9108 ns | 14.51 | 107,154 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeEventStream | 5,829.0746 ns | 5,829.0746 ns | 5,712.4931 ns | 5,945.6561 ns | 0.99 | 72,855 B | - | - | - | 451912 B | NA |
| WorkloadTest        | NinoDeserializeEventStream | 13,971.9767 ns | 13,971.9767 ns | 13,692.5372 ns | 14,251.4162 ns | 1.00 | - | - | - | - | 855459 B | NA |
| WorkloadTest        | MemoryPackDeserializeEventStream | 14,305.0928 ns | 14,305.0928 ns | 14,018.9909 ns | 14,591.1946 ns | 1.02 | - | - | - | - | 59038 B | NA |
| WorkloadTest        | MessagePackDeserializeEventStream | 354,470.5792 ns | 354,470.5792 ns | 347,381.1676 ns | 361,559.9908 ns | 25.37 | - | - | - | - | 810106 B | NA |
| WorkloadTest        | ProtobufDeserializeEventStream | 7,494.7478 ns | 7,494.7478 ns | 7,344.8528 ns | 7,644.6427 ns | 0.54 | - | - | - | - | 666280 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeEventStream | 13,832.9891 ns | 13,832.9891 ns | 13,556.3293 ns | 14,109.6489 ns | 0.99 | - | - | - | - | 125969 B | NA |
| WorkloadTest        | JsonDeserializeEventStream | 14,244.1498 ns | 14,244.1498 ns | 13,959.2668 ns | 14,529.0328 ns | 1.02 | - | - | - | - | 454445 B | NA |

</details>

## 🐹 Go runtime benchmark

<details>
<summary>The Go runtime of v4.0.0-rc.9 against Protocol Buffers, MessagePack, encoding/json and gob</summary>

`runtimes/go/bench` (`testing.B`, summarized by benchstat: medians ± their 95% confidence interval): codecs in the shape nino-gen generates (`Nino`) and the struct tags (`NinoTags`) against Protocol Buffers (google.golang.org/protobuf), MessagePack (vmihailenco/msgpack), encoding/json and gob, on AMD EPYC 7763 64-Core Processor, linux/amd64. Allocations are counted per operation; sizes are the encoded bytes.

| Case | Operation | Nino | NinoTags | Protobuf | MessagePack | JSON | Gob |
|---|---|--:|--:|--:|--:|--:|--:|
| simple-class | serialize | 7.45 μs ±2% | 27.25 μs ±1% | 23.74 μs ±2% | 35.97 μs ±2% | 97.72 μs ±2% | 152.89 μs ±0% |
| simple-class | deserialize | 7.43 μs ±0% | 27.85 μs ±1% | 21.46 μs ±1% | 41.54 μs ±1% | 67.06 μs ±1% | 168.50 μs ±1% |
| simple-class | serialize allocs | 0 | 130 | 0 | 908 | 667 | 1036 |
| simple-class | deserialize allocs | 415 | 917 | 281 | 854 | 250 | 804 |
| simple-class | size | 28.5 KiB | 34.2 KiB | 39.9 KiB | 45.6 KiB | 51.3 KiB | 57.0 KiB |
| simple-class-100 | serialize | 18.51 μs ±1% | 58.29 μs ±3% | 52.34 μs ±0% | 82.43 μs ±2% | 209.41 μs ±0% | 471.18 μs ±0% |
| simple-class-100 | deserialize | 22.97 μs ±2% | 56.33 μs ±3% | 56.53 μs ±0% | 96.74 μs ±2% | 216.75 μs ±3% | 469.94 μs ±1% |
| simple-class-100 | serialize allocs | 0 | 1049 | 0 | 409 | 568 | 927 |
| simple-class-100 | deserialize allocs | 906 | 648 | 149 | 493 | 878 | 150 |
| simple-class-100 | size | 15.8 KiB | 18.9 KiB | 22.1 KiB | 25.3 KiB | 28.4 KiB | 31.6 KiB |
| strings-1000 | serialize | 16.67 μs ±1% | 42.58 μs ±1% | 33.46 μs ±2% | 47.81 μs ±3% | 126.97 μs ±0% | 312.13 μs ±1% |
| strings-1000 | deserialize | 14.50 μs ±0% | 49.36 μs ±1% | 35.86 μs ±1% | 49.77 μs ±3% | 135.01 μs ±0% | 292.85 μs ±2% |
| strings-1000 | serialize allocs | 0 | 1041 | 0 | 1093 | 980 | 1040 |
| strings-1000 | deserialize allocs | 436 | 621 | 251 | 317 | 750 | 293 |
| strings-1000 | size | 5.4 KiB | 6.5 KiB | 7.6 KiB | 8.6 KiB | 9.7 KiB | 10.8 KiB |
| strings-mixed-1000 | serialize | 1.56 μs ±0% | 3.37 μs ±3% | 3.52 μs ±1% | 5.45 μs ±3% | 12.48 μs ±2% | 22.50 μs ±1% |
| strings-mixed-1000 | deserialize | 1.40 μs ±3% | 4.36 μs ±0% | 3.61 μs ±0% | 4.69 μs ±2% | 9.59 μs ±0% | 26.18 μs ±0% |
| strings-mixed-1000 | serialize allocs | 0 | 508 | 0 | 1072 | 532 | 1146 |
| strings-mixed-1000 | deserialize allocs | 519 | 282 | 958 | 450 | 193 | 816 |
| strings-mixed-1000 | size | 21.6 KiB | 25.9 KiB | 30.2 KiB | 34.5 KiB | 38.8 KiB | 43.1 KiB |

</details>

## 🦀 Rust runtime benchmark

<details>
<summary>The Rust runtime of v4.0.0-rc.9 against Protocol Buffers, MessagePack, bincode, postcard and serde_json</summary>

`runtimes/rust/bench` (criterion): codecs in the shape nino-gen generates against Protocol Buffers (prost), MessagePack (rmp-serde), bincode, postcard and serde_json. Times are criterion's mean estimates ± half their 95% confidence interval; sizes are the encoded bytes of each case.

| Case | Operation | nino | prost | rmp-serde | bincode | postcard | serde_json |
|---|---|--:|--:|--:|--:|--:|--:|
| f64-10000 | serialize | 5.82 μs ±1.0% | 9.27 μs ±1.0% | 16.69 μs ±1% | 7.59 μs ±1% | 8.01 μs ±1% | 36.44 μs ±1% |
| f64-10000 | deserialize | 5.97 μs ±1% | 10.17 μs ±1% | 15.98 μs ±1% | 5.64 μs ±1.0% | 8.24 μs ±1.0% | 30.11 μs ±1% |
| f64-10000 | size | 20.7 KiB | 22.8 KiB | 26.9 KiB | 21.7 KiB | 18.6 KiB | 43.5 KiB |
| i32-10000 | serialize | 44.41 μs ±1.0% | 92.97 μs ±1% | 185.83 μs ±1% | 74.61 μs ±1.0% | 80.87 μs ±1% | 287.57 μs ±1% |
| i32-10000 | deserialize | 40.45 μs ±1.0% | 116.28 μs ±1% | 202.20 μs ±1% | 61.99 μs ±1% | 65.19 μs ±1.0% | 362.58 μs ±1.0% |
| i32-10000 | size | 33.4 KiB | 36.7 KiB | 43.4 KiB | 35.1 KiB | 30.1 KiB | 70.1 KiB |
| record | serialize | 43.19 μs ±1% | 106.90 μs ±1.0% | 153.58 μs ±1% | 65.35 μs ±1.0% | 74.79 μs ±1% | 324.33 μs ±1% |
| record | deserialize | 54.40 μs ±1.0% | 88.79 μs ±1% | 141.15 μs ±1.0% | 66.35 μs ±1.0% | 78.03 μs ±1.0% | 326.15 μs ±1.0% |
| record | size | 79.9 KiB | 87.9 KiB | 103.9 KiB | 83.9 KiB | 71.9 KiB | 167.8 KiB |
| records-1000 | serialize | 21.06 μs ±1% | 33.07 μs ±1% | 71.61 μs ±1.0% | 26.99 μs ±1% | 25.36 μs ±1% | 103.77 μs ±1% |
| records-1000 | deserialize | 16.16 μs ±1.0% | 45.48 μs ±1% | 70.20 μs ±1% | 20.17 μs ±1.0% | 31.36 μs ±1.0% | 141.89 μs ±1.0% |
| records-1000 | size | 86.6 KiB | 95.2 KiB | 112.5 KiB | 90.9 KiB | 77.9 KiB | 181.8 KiB |
| strings-1000 | serialize | 13.76 μs ±1% | 40.70 μs ±1% | 48.71 μs ±1.0% | 21.56 μs ±1% | 25.55 μs ±1% | 108.01 μs ±1% |
| strings-1000 | deserialize | 16.86 μs ±1.0% | 31.51 μs ±1% | 44.98 μs ±1.0% | 23.00 μs ±1.0% | 30.23 μs ±1.0% | 89.14 μs ±1.0% |
| strings-1000 | size | 64.8 KiB | 71.2 KiB | 84.2 KiB | 68.0 KiB | 58.3 KiB | 136.0 KiB |
| strings-mixed-1000 | serialize | 28.99 μs ±1.0% | 72.08 μs ±1% | 130.62 μs ±1.0% | 50.51 μs ±1.0% | 44.62 μs ±1% | 225.41 μs ±1.0% |
| strings-mixed-1000 | deserialize | 33.03 μs ±1.0% | 82.56 μs ±1.0% | 124.55 μs ±1% | 41.19 μs ±1% | 53.10 μs ±1% | 276.40 μs ±1% |
| strings-mixed-1000 | size | 43.9 KiB | 48.3 KiB | 57.1 KiB | 46.1 KiB | 39.5 KiB | 92.2 KiB |

</details>

## 🌐 TypeScript runtime benchmark

<details>
<summary>Generated TypeScript of v4.0.0-rc.9 against Protocol Buffers, MessagePack and JSON, in Node</summary>

The code nino-gen generates for `runtimes/typescript/bench` (`Program.cs`'s types), against Protocol Buffers (protobuf-es), MessagePack (msgpackr) and `JSON`, in Node v22.18.0, on data .NET wrote, timed by tinybench 5.0.0: the mean time of a pass over each scenario's values, ± its relative margin of error, and passes per second.

| Scenario | Operation | Nino | Protobuf | MessagePack | JSON |
|---|---|--:|--:|--:|--:|
| Player x1000 | serialize | 242.85 μs ±0.4% (4,118/s) | 554.10 μs ±3% (1,805/s) | 638.19 μs ±0.9% (1,567/s) | 1.13 ms ±3% (888/s) |
| Player x1000 | deserialize | 290.51 μs ±0.6% (3,442/s) | 467.70 μs ±0.5% (2,138/s) | 676.80 μs ±0.5% (1,478/s) | 1.16 ms ±2% (864/s) |
| Player x1000 | size | 116.3 KiB | 127.9 KiB | 162.8 KiB | 255.9 KiB |
| Zoo 50 x 100 animals (type ids) | serialize | 109.76 μs ±3% (9,111/s) | 219.14 μs ±0.7% (4,563/s) | 340.42 μs ±0.8% (2,938/s) | 466.69 μs ±2% (2,143/s) |
| Zoo 50 x 100 animals (type ids) | deserialize | 92.09 μs ±3% (10,859/s) | 200.93 μs ±1% (4,977/s) | 309.64 μs ±2% (3,230/s) | 399.49 μs ±0.5% (2,503/s) |
| Zoo 50 x 100 animals (type ids) | size | 338.9 KiB | 372.7 KiB | 474.4 KiB | 745.5 KiB |
| OrderBook 100 x 50 orders | serialize | 194.45 μs ±2% (5,143/s) | 378.26 μs ±1.0% (2,644/s) | 407.08 μs ±1% (2,456/s) | 806.11 μs ±2% (1,241/s) |
| OrderBook 100 x 50 orders | deserialize | 188.88 μs ±3% (5,294/s) | 346.11 μs ±2% (2,889/s) | 497.55 μs ±1% (2,010/s) | 670.12 μs ±2% (1,492/s) |
| OrderBook 100 x 50 orders | size | 387.4 KiB | 426.2 KiB | 542.4 KiB | 852.3 KiB |
| Article x200 (text) | serialize | 143.96 μs ±2% (6,946/s) | 398.29 μs ±2% (2,511/s) | 479.68 μs ±2% (2,085/s) | 839.73 μs ±3% (1,191/s) |
| Article x200 (text) | deserialize | 135.55 μs ±2% (7,377/s) | 415.67 μs ±1% (2,406/s) | 457.30 μs ±2% (2,187/s) | 722.37 μs ±2% (1,384/s) |
| Article x200 (text) | size | 214.2 KiB | 235.6 KiB | 299.9 KiB | 471.2 KiB |
| Mesh 20 x (2 x 500 Vec3, 1500 int) | serialize | 121.72 μs ±3% (8,215/s) | 228.07 μs ±2% (4,385/s) | 253.95 μs ±0.6% (3,938/s) | 411.64 μs ±1.0% (2,429/s) |
| Mesh 20 x (2 x 500 Vec3, 1500 int) | deserialize | 130.50 μs ±1% (7,663/s) | 189.78 μs ±2% (5,269/s) | 239.71 μs ±2% (4,172/s) | 468.11 μs ±3% (2,136/s) |
| Mesh 20 x (2 x 500 Vec3, 1500 int) | size | 197.6 KiB | 217.3 KiB | 276.6 KiB | 434.7 KiB |
| Samples 20 x (3 x 1000 numbers) | serialize | 119.55 μs ±1% (8,364/s) | 268.18 μs ±2% (3,729/s) | 307.82 μs ±0.9% (3,249/s) | 574.68 μs ±0.3% (1,740/s) |
| Samples 20 x (3 x 1000 numbers) | deserialize | 105.03 μs ±1% (9,521/s) | 318.43 μs ±2% (3,140/s) | 265.39 μs ±0.7% (3,768/s) | 615.38 μs ±0.8% (1,625/s) |
| Samples 20 x (3 x 1000 numbers) | size | 269.0 KiB | 296.0 KiB | 376.7 KiB | 591.9 KiB |
| Lookup 50 x (2 maps of 100) | serialize | 224.00 μs ±1% (4,464/s) | 528.56 μs ±2% (1,892/s) | 485.65 μs ±3% (2,059/s) | 1.13 ms ±1% (885/s) |
| Lookup 50 x (2 maps of 100) | deserialize | 239.03 μs ±3% (4,184/s) | 512.95 μs ±2% (1,950/s) | 678.13 μs ±3% (1,475/s) | 954.46 μs ±0.6% (1,048/s) |
| Lookup 50 x (2 maps of 100) | size | 113.6 KiB | 125.0 KiB | 159.1 KiB | 250.0 KiB |
| Event x1000 (long) | serialize | 363.02 μs ±3% (2,755/s) | 921.17 μs ±0.6% (1,086/s) | 1.31 ms ±2% (765/s) | 1.71 ms ±2% (585/s) |
| Event x1000 (long) | deserialize | 409.13 μs ±0.6% (2,444/s) | 908.02 μs ±2% (1,101/s) | 886.16 μs ±0.9% (1,128/s) | 2.17 ms ±2% (461/s) |
| Event x1000 (long) | size | 70.9 KiB | 78.0 KiB | 99.3 KiB | 156.1 KiB |
| Strings 1000 (ASCII) | serialize | 386.00 μs ±3% (2,591/s) | 575.12 μs ±0.6% (1,739/s) | 995.93 μs ±0.7% (1,004/s) | 1.46 ms ±0.7% (686/s) |
| Strings 1000 (ASCII) | deserialize | 329.72 μs ±2% (3,033/s) | 654.36 μs ±1% (1,528/s) | 688.07 μs ±3% (1,453/s) | 1.47 ms ±0.4% (682/s) |
| Strings 1000 (ASCII) | size | 98.1 KiB | 107.9 KiB | 137.4 KiB | 215.9 KiB |
| Strings 1000 (ASCII, Latin-1, other) | serialize | 421.46 μs ±2% (2,373/s) | 651.73 μs ±2% (1,534/s) | 874.38 μs ±0.9% (1,144/s) | 1.80 ms ±2% (554/s) |
| Strings 1000 (ASCII, Latin-1, other) | deserialize | 325.36 μs ±1% (3,074/s) | 774.24 μs ±2% (1,292/s) | 1.07 ms ±3% (931/s) | 1.78 ms ±2% (561/s) |
| Strings 1000 (ASCII, Latin-1, other) | size | 368.2 KiB | 405.1 KiB | 515.5 KiB | 810.1 KiB |

</details>

## 🎮 Unity benchmark (Burst, IL2CPP)

Unity 2022.3.62f2, IL2CPP player (C++ Release, code generation OptimizeSpeed, stripping Minimal, not a Development build, Nino.Core Release), Linux x64, AMD EPYC 9V45 96-Core Processor (4 cores), Burst 1.8.29 (its default x64 targets), kernels SSSE3.
Unity 6000.3.27f1, IL2CPP player (C++ Release, code generation OptimizeSpeed, stripping Minimal, not a Development build, Nino.Core Release), Linux x64, AMD EPYC 7763 64-Core Processor (4 cores), Burst 1.8.31 (x64 targets SSE2, SSE4, AVX2), kernels AVX2.
Each time is the median per call; "Speedup" is without Burst divided by with Burst.

v4.0.0-rc.8, measured in the IL2CPP test player that `.github/workflows/unity.yml` builds and runs on a GitHub-hosted runner (`Test.Runtime.Burst.BurstBenchmark`) with the Unity Performance Testing package 3.6.0 (`Measure.Method`: its warm-up, then 9 measurements of about 100 ms, each the mean time per call): `NinoSerializer.Serialize` to a new array, `NinoDeserializer.Deserialize` into an array of the same length (arrays) or to a new value (strings, the list), without the Burst kernels (`NinoKernels.Register(null)`: Nino.Core's own paths, as without `com.unity.burst`) and with them. Compare within a table: the runners vary between releases.

### Unity 2022.3.62f2

| Case | Operation | Without Burst | With Burst | Speedup |
|---|---|--:|--:|--:|
| (byte, int)[1000] | Serialize | 86.90 μs | 2.93 μs | 29.7× |
| (byte, int)[1000] | Deserialize | 62.40 μs | 784.0 ns | 79.6× |
| ASCII string (1000 chars) | Serialize | 2.20 μs | 1.16 μs | 1.90× |
| ASCII string (1000 chars) | Deserialize | 2.55 μs | 1.54 μs | 1.66× |

### Unity 6000.3.27f1

| Case | Operation | Without Burst | With Burst | Speedup |
|---|---|--:|--:|--:|
| (int, long)[32] | Serialize | 3.28 μs | 835.4 ns | 3.92× |
| (int, long)[32] | Deserialize | 2.43 μs | 441.3 ns | 5.50× |
| (int, long)[1000] | Serialize | 88.12 μs | 2.89 μs | 30.5× |
| (int, long)[1000] | Deserialize | 64.86 μs | 1.16 μs | 55.9× |
| (int, long)[100000] | Serialize | 8.16 ms | 612.00 μs | 13.3× |
| (int, long)[100000] | Deserialize | 6.30 ms | 80.10 μs | 78.7× |
| List&lt;string&gt; of 1000 ASCII strings (8–40 chars) | Serialize | 74.20 μs | 64.50 μs | 1.15× |
| List&lt;string&gt; of 1000 ASCII strings (8–40 chars) | Deserialize | 0.9 ns | 0.8 ns | 1.12× |

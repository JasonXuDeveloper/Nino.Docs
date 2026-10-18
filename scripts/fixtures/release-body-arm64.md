<!--
Parser test fixture: release-body-new.md with an "Arm64 benchmark" section in
front of the x64 report, where Nino's report.yml puts it. The Arm64 numbers (and
environment) below are a copy of this file's x64 report: they were not measured
on Arm64. For parser tests only; never use them as data. (This comment must not
name the x64 section's title: the parser finds that section by it.)
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
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedClass                     |        12.0111 ns |        11.8445 ns |        11.2881 ns |        13.2462 ns |   1.00 |      41 B |  0.0069 |       - |       - |      72 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClass               |        21.8931 ns |        21.8365 ns |        20.0607 ns |        24.3061 ns |   1.83 |      41 B |  0.0070 |       - |       - |      72 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoDeserializeFixedClasses                 |     1,369.5749 ns |     1,376.4601 ns |     1,246.1121 ns |     1,599.6303 ns |   1.00 |         - |  0.6256 |  0.0076 |       - |    6424 B |        1.00 |
| FixedSizeTest       | MemoryPackDeserializeFixedClasses           |     2,221.0162 ns |     2,447.2413 ns |     1,308.8883 ns |     2,836.0838 ns |   1.63 |         - |  0.6256 |  0.0038 |       - |    6424 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedClasses                   |     1,012.0662 ns |       897.1137 ns |       813.5906 ns |     1,271.8286 ns |   1.03 |   4,104 B |  0.4110 |       - |       - |    4128 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClasses             |     1,742.8963 ns |     1,738.1253 ns |     1,658.9868 ns |     1,857.5017 ns |   1.77 |   4,104 B |  0.3967 |       - |       - |    4128 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoDeserializeFixedStruct                  |         0.0330 ns |         0.0000 ns |         0.0000 ns |         0.1479 ns |      ? |         - |       - |       - |       - |         - |           ? |
| FixedSizeTest       | MemoryPackDeserializeFixedStruct            |         0.5361 ns |         0.5568 ns |         0.2877 ns |         0.8564 ns |      ? |         - |       - |       - |       - |         - |           ? |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedStruct                    |        11.5048 ns |        11.3409 ns |        11.0178 ns |        12.2607 ns |   1.00 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedStruct              |        11.6760 ns |        11.5850 ns |        10.7735 ns |        12.7479 ns |   1.02 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| ReferenceTest       | NinoDeserializeGraph                        |     5,708.5715 ns |     5,747.2174 ns |     5,489.3158 ns |     5,864.1501 ns |   1.00 |         - |  1.3657 |  0.0305 |       - |   14104 B |        1.00 |
| ReferenceTest       | MemoryPackDeserializeGraph                  |    17,241.1692 ns |    17,045.5469 ns |    16,306.2630 ns |    18,759.5018 ns |   3.02 |         - |  1.3733 |  0.0305 |       - |   14104 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| ReferenceTest       | NinoSerializeGraph                          |     4,558.5943 ns |     4,537.5344 ns |     4,387.9276 ns |     4,840.6198 ns |   1.00 |   5,948 B |       - |       - |       - |         - |          NA |
| ReferenceTest       | MemoryPackSerializeGraph                    |    24,065.6332 ns |    23,980.4084 ns |    22,975.4215 ns |    25,947.5957 ns |   5.28 |   5,584 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoLeavesNew                               |     3,876.7935 ns |     3,889.5247 ns |     3,619.7647 ns |     4,062.7215 ns |   1.00 |         - |  1.3275 |  0.0305 |       - |   13656 B |        1.00 |
| PooledGraphTest     | NinoLeavesPooledElements                    |     2,448.3189 ns |     2,463.4706 ns |     2,313.7609 ns |     2,593.9444 ns |   0.63 |         - |  0.0839 |       - |       - |     856 B |        0.06 |
| PooledGraphTest     | NinoLeavesInPlace                           |       505.0119 ns |       504.4580 ns |       470.3849 ns |       544.3157 ns |   0.13 |         - |       - |       - |       - |         - |        0.00 |
| PooledGraphTest     | MemoryPackLeavesNew                         |     4,128.5899 ns |     4,134.1907 ns |     3,812.1796 ns |     4,294.3501 ns |   1.07 |         - |  1.3275 |  0.0229 |       - |   13656 B |        1.00 |
| PooledGraphTest     | MemoryPackLeavesOverwrite                   |     4,388.1175 ns |     4,406.4875 ns |     4,056.5629 ns |     4,780.3392 ns |   1.13 |         - |  1.2360 |  0.0076 |       - |   12800 B |        0.94 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoNodeNew                                 |       637.6911 ns |       631.5708 ns |       611.9775 ns |       682.2081 ns |   1.00 |         - |  0.2136 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | NinoNodePooled                              |       211.6913 ns |       210.3109 ns |       203.9490 ns |       222.2315 ns |   0.33 |         - |       - |       - |       - |         - |        0.00 |
| PooledGraphTest     | MemoryPackNodeNew                           |       654.5474 ns |       656.0013 ns |       609.5359 ns |       702.3794 ns |   1.03 |         - |  0.2117 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | MemoryPackNodeOverwrite                     |       510.6307 ns |       510.1689 ns |       478.4672 ns |       547.9164 ns |   0.80 |         - |  0.0982 |       - |       - |    1024 B |        0.47 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoPlainNew                                |     3,160.7732 ns |     3,172.2773 ns |     2,935.4816 ns |     3,421.1302 ns |   1.00 |         - |  1.2550 |  0.0305 |       - |   12856 B |        1.00 |
| PooledGraphTest     | MemoryPackPlainNew                          |     3,774.2958 ns |     3,737.7184 ns |     3,540.4649 ns |     4,097.0168 ns |   1.20 |         - |  1.2512 |  0.0229 |       - |   12856 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicClassArray        |   284,544.0570 ns |   278,595.1274 ns |   259,762.4878 ns |   327,473.9668 ns |   1.00 |         - | 31.7383 | 13.6719 |       - |  745624 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicClassArray  |   409,225.6877 ns |   405,800.2476 ns |   354,880.1650 ns |   459,854.7686 ns |   1.44 |         - | 30.2734 | 14.1602 |       - |  745624 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicClassArray | 1,610,212.7331 ns | 1,566,666.2852 ns | 1,455,321.4512 ns | 1,794,850.4629 ns |   5.68 |         - | 46.8750 | 19.5313 |       - | 1162424 B |        1.56 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicClassArray          |    54,994.8444 ns |    54,631.0397 ns |    51,168.9285 ns |    58,656.5017 ns |   1.00 | 397,304 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicClassArray    |   280,897.4215 ns |   275,357.4402 ns |   255,944.9763 ns |   309,417.4329 ns |   5.11 | 384,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicClassArray   |   775,118.1399 ns |   764,609.5889 ns |   731,123.6758 ns |   863,211.1631 ns |  14.11 | 487,103 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicClass             |    20,296.9095 ns |    20,234.8878 ns |    18,711.7913 ns |    21,862.8668 ns |   1.00 |         - |  7.3853 |  1.2817 |       - |   79688 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicClass       |    30,326.7067 ns |    29,909.0238 ns |    27,614.4732 ns |    33,737.2495 ns |   1.50 |         - |  7.4158 |  1.0071 |       - |   79688 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicClass      |   185,669.9667 ns |   186,862.6548 ns |   166,402.2502 ns |   195,842.5698 ns |   9.16 |         - |  7.5684 |  0.9766 |       - |   83856 B |        1.05 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicClass               |     6,390.4397 ns |     6,393.2117 ns |     5,930.3433 ns |     6,901.1617 ns |   1.00 |  53,789 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicClass         |    23,694.2597 ns |    23,657.7426 ns |    21,984.8369 ns |    25,531.2838 ns |   3.72 |  51,760 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicClass        |   106,403.4284 ns |   105,942.4332 ns |   101,983.6055 ns |   111,803.6821 ns |  16.68 |  66,859 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicFooArray          |    19,620.2259 ns |    19,397.0100 ns |    18,294.4601 ns |    21,277.4992 ns |   1.00 |         - |  7.1716 |  1.0681 |       - |   76024 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicFooArray    |    28,076.1534 ns |    27,777.7130 ns |    26,883.9058 ns |    29,895.6654 ns |   1.43 |         - |  7.1106 |  1.0681 |       - |   76024 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicFooArray   |   175,498.7009 ns |   176,374.0947 ns |   166,641.6965 ns |   181,510.7920 ns |   8.96 |         - |  7.0801 |  0.7324 |       - |   76024 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicFooArray            |     6,231.7819 ns |     6,278.8842 ns |     5,912.0486 ns |     6,508.2156 ns |   1.00 |  52,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicFooArray      |    23,330.3214 ns |    22,961.6185 ns |    20,959.0387 ns |    25,944.3397 ns |   3.75 |  50,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicFooArray     |   105,334.9285 ns |   105,199.2419 ns |    99,884.6250 ns |   111,919.3000 ns |  16.91 |  65,203 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledTest          | NinoDeserializeNew                          |       548.6471 ns |       550.9600 ns |       526.5837 ns |       581.2650 ns |   1.00 |         - |  0.2451 |  0.0010 |       - |    2536 B |        1.00 |
| PooledTest          | NinoDeserializePooled                       |       222.1494 ns |       220.8111 ns |       206.6481 ns |       240.5492 ns |   0.41 |         - |       - |       - |       - |         - |        0.00 |
| PooledTest          | MemoryPackDeserializeNew                    |       655.1230 ns |       652.9136 ns |       625.4202 ns |       701.2852 ns |   1.20 |         - |  0.2460 |       - |       - |    2536 B |        1.00 |
| PooledTest          | MemoryPackDeserializeOverwrite              |       553.0911 ns |       551.9693 ns |       532.1793 ns |       585.0788 ns |   1.01 |         - |  0.1049 |       - |       - |    1080 B |        0.43 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleClass                  |       492.8397 ns |       501.3566 ns |       458.2103 ns |       555.4371 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleClass            |       722.1478 ns |       725.1683 ns |       626.6078 ns |       832.9610 ns |   1.47 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleClass           |     1,651.7574 ns |     1,647.1260 ns |     1,575.7463 ns |     1,761.2207 ns |   3.36 |         - |  0.2480 |       - |       - |    2528 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleClass                    |        89.6077 ns |        90.1009 ns |        86.2565 ns |        91.9253 ns |   1.00 |   1,150 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleClass              |       382.1221 ns |       380.0247 ns |       354.0909 ns |       404.3215 ns |   4.27 |   1,148 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleClass             |       763.8358 ns |       767.9242 ns |       699.0044 ns |       796.7140 ns |   8.53 |   1,112 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleClasses                |    52,930.1909 ns |    53,011.7750 ns |    50,106.9024 ns |    54,465.7044 ns |   1.00 |         - | 18.3105 |  5.4932 |       - |  253624 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleClasses          |    66,724.9567 ns |    66,840.7021 ns |    62,312.6951 ns |    70,738.7496 ns |   1.26 |         - | 18.1885 |  5.1270 |       - |  253624 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleClasses         |   182,620.4460 ns |   180,712.2681 ns |   172,319.0024 ns |   196,167.8262 ns |   3.45 |         - | 17.5781 |  4.8828 |       - |  253624 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleClasses                  |    10,280.8855 ns |    10,015.0644 ns |     9,578.6866 ns |    11,789.0480 ns |   1.00 | 115,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleClasses            |    33,288.3297 ns |    32,725.7112 ns |    30,751.6458 ns |    35,792.7002 ns |   3.25 | 114,804 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleClasses           |    79,774.6829 ns |    80,758.9073 ns |    72,051.3616 ns |    84,804.9857 ns |   7.79 | 111,203 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleStruct                 |         0.3125 ns |         0.3112 ns |         0.1847 ns |         0.4509 ns |   1.06 |         - |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackDeserializeSimpleStruct           |         0.3410 ns |         0.3505 ns |         0.2098 ns |         0.4615 ns |   1.16 |         - |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackDeserializeSimpleStruct          |        52.8118 ns |        52.7863 ns |        49.3811 ns |        56.3096 ns | 179.31 |         - |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleStruct                   |         1.3382 ns |         1.3356 ns |         1.0962 ns |         1.6809 ns |   1.01 |      12 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleStruct             |         3.0274 ns |         3.0656 ns |         2.6133 ns |         3.3026 ns |   2.29 |      12 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleStruct            |        42.7727 ns |        42.7392 ns |        40.7685 ns |        45.1772 ns |  32.42 |      16 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleStructs                |       131.3033 ns |       132.5233 ns |       120.2692 ns |       138.7890 ns |   1.00 |         - |  0.1214 |       - |       - |    1224 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleStructs          |       133.3527 ns |       131.4184 ns |       127.2872 ns |       147.4623 ns |   1.02 |         - |  0.1214 |       - |       - |    1224 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleStructs         |     2,919.9335 ns |     2,892.0609 ns |     2,651.3150 ns |     3,327.5507 ns |  22.29 |         - |  0.1297 |  0.0076 |  0.0076 |         - |        0.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleStructs                  |        15.0572 ns |        15.0926 ns |        13.4741 ns |        16.2973 ns |   1.00 |   1,204 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleStructs            |        15.4777 ns |        15.4198 ns |        14.7406 ns |        16.4751 ns |   1.03 |   1,204 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleStructs           |     2,965.7871 ns |     2,978.7563 ns |     2,677.0252 ns |     3,249.8076 ns | 197.39 |   1,603 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClass                |       521.0727 ns |       524.8786 ns |       496.3595 ns |       574.3951 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClass          |       764.3313 ns |       757.7421 ns |       736.4055 ns |       798.7311 ns |   1.47 |         - |  0.2451 |       - |       - |    2528 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoSerializeTolerantClass                  |        94.3630 ns |        94.7205 ns |        87.3816 ns |       101.7905 ns |   1.00 |   1,154 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClass            |       418.4511 ns |       418.8876 ns |       393.4790 ns |       468.7534 ns |   4.44 |   1,164 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClasses              |    57,682.0058 ns |    56,736.4726 ns |    55,517.0137 ns |    61,734.9037 ns |   1.00 |         - | 18.4326 |  5.7373 |       - |  253624 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClasses        |    79,990.9113 ns |    81,528.4921 ns |    74,885.6201 ns |    85,180.2208 ns |   1.39 |         - | 17.9443 |  5.6152 |       - |  253624 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoSerializeTolerantClasses                |    10,267.5625 ns |    10,323.3566 ns |     9,426.2225 ns |    10,776.4607 ns |   1.00 | 115,404 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClasses          |    40,558.8009 ns |    40,232.5351 ns |    37,961.6306 ns |    43,179.2206 ns |   3.96 | 116,404 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeVectors                      |   104,548.2808 ns |   105,034.5450 ns |    90,615.1733 ns |   113,076.9202 ns |   1.00 |         - |  8.1787 |  8.1787 |  8.1787 |  160016 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeVectors                |   111,234.7055 ns |   111,837.7678 ns |   101,650.6357 ns |   118,846.8276 ns |   1.07 |         - |  8.3008 |  8.3008 |  8.3008 |  160016 B |        1.00 |
| SimpleTest          | MessagePackDeserializeVectors               |   312,742.9745 ns |   308,517.1653 ns |   289,028.3967 ns |   343,698.4690 ns |   3.00 |         - | 12.2070 | 12.2070 | 12.2070 |  160024 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeVectors                        |     4,185.7958 ns |     4,210.3811 ns |     3,919.2227 ns |     4,510.8003 ns |   1.00 | 160,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeVectors                  |     4,326.0336 ns |     4,331.5631 ns |     4,101.5232 ns |     4,553.1488 ns |   1.03 | 160,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeVectors                 |   126,388.6037 ns |   126,359.8853 ns |   118,694.3779 ns |   134,574.5696 ns |  30.23 | 210,003 B |       - |       - |       - |         - |          NA |

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
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedClass                     |        12.0111 ns |        11.8445 ns |        11.2881 ns |        13.2462 ns |   1.00 |      41 B |  0.0069 |       - |       - |      72 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClass               |        21.8931 ns |        21.8365 ns |        20.0607 ns |        24.3061 ns |   1.83 |      41 B |  0.0070 |       - |       - |      72 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoDeserializeFixedClasses                 |     1,369.5749 ns |     1,376.4601 ns |     1,246.1121 ns |     1,599.6303 ns |   1.00 |         - |  0.6256 |  0.0076 |       - |    6424 B |        1.00 |
| FixedSizeTest       | MemoryPackDeserializeFixedClasses           |     2,221.0162 ns |     2,447.2413 ns |     1,308.8883 ns |     2,836.0838 ns |   1.63 |         - |  0.6256 |  0.0038 |       - |    6424 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedClasses                   |     1,012.0662 ns |       897.1137 ns |       813.5906 ns |     1,271.8286 ns |   1.03 |   4,104 B |  0.4110 |       - |       - |    4128 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClasses             |     1,742.8963 ns |     1,738.1253 ns |     1,658.9868 ns |     1,857.5017 ns |   1.77 |   4,104 B |  0.3967 |       - |       - |    4128 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoDeserializeFixedStruct                  |         0.0330 ns |         0.0000 ns |         0.0000 ns |         0.1479 ns |      ? |         - |       - |       - |       - |         - |           ? |
| FixedSizeTest       | MemoryPackDeserializeFixedStruct            |         0.5361 ns |         0.5568 ns |         0.2877 ns |         0.8564 ns |      ? |         - |       - |       - |       - |         - |           ? |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedStruct                    |        11.5048 ns |        11.3409 ns |        11.0178 ns |        12.2607 ns |   1.00 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedStruct              |        11.6760 ns |        11.5850 ns |        10.7735 ns |        12.7479 ns |   1.02 |      40 B |  0.0062 |       - |       - |      64 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| ReferenceTest       | NinoDeserializeGraph                        |     5,708.5715 ns |     5,747.2174 ns |     5,489.3158 ns |     5,864.1501 ns |   1.00 |         - |  1.3657 |  0.0305 |       - |   14104 B |        1.00 |
| ReferenceTest       | MemoryPackDeserializeGraph                  |    17,241.1692 ns |    17,045.5469 ns |    16,306.2630 ns |    18,759.5018 ns |   3.02 |         - |  1.3733 |  0.0305 |       - |   14104 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| ReferenceTest       | NinoSerializeGraph                          |     4,558.5943 ns |     4,537.5344 ns |     4,387.9276 ns |     4,840.6198 ns |   1.00 |   5,948 B |       - |       - |       - |         - |          NA |
| ReferenceTest       | MemoryPackSerializeGraph                    |    24,065.6332 ns |    23,980.4084 ns |    22,975.4215 ns |    25,947.5957 ns |   5.28 |   5,584 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoLeavesNew                               |     3,876.7935 ns |     3,889.5247 ns |     3,619.7647 ns |     4,062.7215 ns |   1.00 |         - |  1.3275 |  0.0305 |       - |   13656 B |        1.00 |
| PooledGraphTest     | NinoLeavesPooledElements                    |     2,448.3189 ns |     2,463.4706 ns |     2,313.7609 ns |     2,593.9444 ns |   0.63 |         - |  0.0839 |       - |       - |     856 B |        0.06 |
| PooledGraphTest     | NinoLeavesInPlace                           |       505.0119 ns |       504.4580 ns |       470.3849 ns |       544.3157 ns |   0.13 |         - |       - |       - |       - |         - |        0.00 |
| PooledGraphTest     | MemoryPackLeavesNew                         |     4,128.5899 ns |     4,134.1907 ns |     3,812.1796 ns |     4,294.3501 ns |   1.07 |         - |  1.3275 |  0.0229 |       - |   13656 B |        1.00 |
| PooledGraphTest     | MemoryPackLeavesOverwrite                   |     4,388.1175 ns |     4,406.4875 ns |     4,056.5629 ns |     4,780.3392 ns |   1.13 |         - |  1.2360 |  0.0076 |       - |   12800 B |        0.94 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoNodeNew                                 |       637.6911 ns |       631.5708 ns |       611.9775 ns |       682.2081 ns |   1.00 |         - |  0.2136 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | NinoNodePooled                              |       211.6913 ns |       210.3109 ns |       203.9490 ns |       222.2315 ns |   0.33 |         - |       - |       - |       - |         - |        0.00 |
| PooledGraphTest     | MemoryPackNodeNew                           |       654.5474 ns |       656.0013 ns |       609.5359 ns |       702.3794 ns |   1.03 |         - |  0.2117 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | MemoryPackNodeOverwrite                     |       510.6307 ns |       510.1689 ns |       478.4672 ns |       547.9164 ns |   0.80 |         - |  0.0982 |       - |       - |    1024 B |        0.47 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledGraphTest     | NinoPlainNew                                |     3,160.7732 ns |     3,172.2773 ns |     2,935.4816 ns |     3,421.1302 ns |   1.00 |         - |  1.2550 |  0.0305 |       - |   12856 B |        1.00 |
| PooledGraphTest     | MemoryPackPlainNew                          |     3,774.2958 ns |     3,737.7184 ns |     3,540.4649 ns |     4,097.0168 ns |   1.20 |         - |  1.2512 |  0.0229 |       - |   12856 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicClassArray        |   284,544.0570 ns |   278,595.1274 ns |   259,762.4878 ns |   327,473.9668 ns |   1.00 |         - | 31.7383 | 13.6719 |       - |  745624 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicClassArray  |   409,225.6877 ns |   405,800.2476 ns |   354,880.1650 ns |   459,854.7686 ns |   1.44 |         - | 30.2734 | 14.1602 |       - |  745624 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicClassArray | 1,610,212.7331 ns | 1,566,666.2852 ns | 1,455,321.4512 ns | 1,794,850.4629 ns |   5.68 |         - | 46.8750 | 19.5313 |       - | 1162424 B |        1.56 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicClassArray          |    54,994.8444 ns |    54,631.0397 ns |    51,168.9285 ns |    58,656.5017 ns |   1.00 | 397,304 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicClassArray    |   280,897.4215 ns |   275,357.4402 ns |   255,944.9763 ns |   309,417.4329 ns |   5.11 | 384,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicClassArray   |   775,118.1399 ns |   764,609.5889 ns |   731,123.6758 ns |   863,211.1631 ns |  14.11 | 487,103 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicClass             |    20,296.9095 ns |    20,234.8878 ns |    18,711.7913 ns |    21,862.8668 ns |   1.00 |         - |  7.3853 |  1.2817 |       - |   79688 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicClass       |    30,326.7067 ns |    29,909.0238 ns |    27,614.4732 ns |    33,737.2495 ns |   1.50 |         - |  7.4158 |  1.0071 |       - |   79688 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicClass      |   185,669.9667 ns |   186,862.6548 ns |   166,402.2502 ns |   195,842.5698 ns |   9.16 |         - |  7.5684 |  0.9766 |       - |   83856 B |        1.05 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicClass               |     6,390.4397 ns |     6,393.2117 ns |     5,930.3433 ns |     6,901.1617 ns |   1.00 |  53,789 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicClass         |    23,694.2597 ns |    23,657.7426 ns |    21,984.8369 ns |    25,531.2838 ns |   3.72 |  51,760 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicClass        |   106,403.4284 ns |   105,942.4332 ns |   101,983.6055 ns |   111,803.6821 ns |  16.68 |  66,859 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicFooArray          |    19,620.2259 ns |    19,397.0100 ns |    18,294.4601 ns |    21,277.4992 ns |   1.00 |         - |  7.1716 |  1.0681 |       - |   76024 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicFooArray    |    28,076.1534 ns |    27,777.7130 ns |    26,883.9058 ns |    29,895.6654 ns |   1.43 |         - |  7.1106 |  1.0681 |       - |   76024 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicFooArray   |   175,498.7009 ns |   176,374.0947 ns |   166,641.6965 ns |   181,510.7920 ns |   8.96 |         - |  7.0801 |  0.7324 |       - |   76024 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicFooArray            |     6,231.7819 ns |     6,278.8842 ns |     5,912.0486 ns |     6,508.2156 ns |   1.00 |  52,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicFooArray      |    23,330.3214 ns |    22,961.6185 ns |    20,959.0387 ns |    25,944.3397 ns |   3.75 |  50,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicFooArray     |   105,334.9285 ns |   105,199.2419 ns |    99,884.6250 ns |   111,919.3000 ns |  16.91 |  65,203 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| PooledTest          | NinoDeserializeNew                          |       548.6471 ns |       550.9600 ns |       526.5837 ns |       581.2650 ns |   1.00 |         - |  0.2451 |  0.0010 |       - |    2536 B |        1.00 |
| PooledTest          | NinoDeserializePooled                       |       222.1494 ns |       220.8111 ns |       206.6481 ns |       240.5492 ns |   0.41 |         - |       - |       - |       - |         - |        0.00 |
| PooledTest          | MemoryPackDeserializeNew                    |       655.1230 ns |       652.9136 ns |       625.4202 ns |       701.2852 ns |   1.20 |         - |  0.2460 |       - |       - |    2536 B |        1.00 |
| PooledTest          | MemoryPackDeserializeOverwrite              |       553.0911 ns |       551.9693 ns |       532.1793 ns |       585.0788 ns |   1.01 |         - |  0.1049 |       - |       - |    1080 B |        0.43 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleClass                  |       492.8397 ns |       501.3566 ns |       458.2103 ns |       555.4371 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleClass            |       722.1478 ns |       725.1683 ns |       626.6078 ns |       832.9610 ns |   1.47 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleClass           |     1,651.7574 ns |     1,647.1260 ns |     1,575.7463 ns |     1,761.2207 ns |   3.36 |         - |  0.2480 |       - |       - |    2528 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleClass                    |        89.6077 ns |        90.1009 ns |        86.2565 ns |        91.9253 ns |   1.00 |   1,150 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleClass              |       382.1221 ns |       380.0247 ns |       354.0909 ns |       404.3215 ns |   4.27 |   1,148 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleClass             |       763.8358 ns |       767.9242 ns |       699.0044 ns |       796.7140 ns |   8.53 |   1,112 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleClasses                |    52,930.1909 ns |    53,011.7750 ns |    50,106.9024 ns |    54,465.7044 ns |   1.00 |         - | 18.3105 |  5.4932 |       - |  253624 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleClasses          |    66,724.9567 ns |    66,840.7021 ns |    62,312.6951 ns |    70,738.7496 ns |   1.26 |         - | 18.1885 |  5.1270 |       - |  253624 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleClasses         |   182,620.4460 ns |   180,712.2681 ns |   172,319.0024 ns |   196,167.8262 ns |   3.45 |         - | 17.5781 |  4.8828 |       - |  253624 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleClasses                  |    10,280.8855 ns |    10,015.0644 ns |     9,578.6866 ns |    11,789.0480 ns |   1.00 | 115,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleClasses            |    33,288.3297 ns |    32,725.7112 ns |    30,751.6458 ns |    35,792.7002 ns |   3.25 | 114,804 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleClasses           |    79,774.6829 ns |    80,758.9073 ns |    72,051.3616 ns |    84,804.9857 ns |   7.79 | 111,203 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleStruct                 |         0.3125 ns |         0.3112 ns |         0.1847 ns |         0.4509 ns |   1.06 |         - |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackDeserializeSimpleStruct           |         0.3410 ns |         0.3505 ns |         0.2098 ns |         0.4615 ns |   1.16 |         - |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackDeserializeSimpleStruct          |        52.8118 ns |        52.7863 ns |        49.3811 ns |        56.3096 ns | 179.31 |         - |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleStruct                   |         1.3382 ns |         1.3356 ns |         1.0962 ns |         1.6809 ns |   1.01 |      12 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleStruct             |         3.0274 ns |         3.0656 ns |         2.6133 ns |         3.3026 ns |   2.29 |      12 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleStruct            |        42.7727 ns |        42.7392 ns |        40.7685 ns |        45.1772 ns |  32.42 |      16 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleStructs                |       131.3033 ns |       132.5233 ns |       120.2692 ns |       138.7890 ns |   1.00 |         - |  0.1214 |       - |       - |    1224 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleStructs          |       133.3527 ns |       131.4184 ns |       127.2872 ns |       147.4623 ns |   1.02 |         - |  0.1214 |       - |       - |    1224 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleStructs         |     2,919.9335 ns |     2,892.0609 ns |     2,651.3150 ns |     3,327.5507 ns |  22.29 |         - |  0.1297 |  0.0076 |  0.0076 |         - |        0.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleStructs                  |        15.0572 ns |        15.0926 ns |        13.4741 ns |        16.2973 ns |   1.00 |   1,204 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleStructs            |        15.4777 ns |        15.4198 ns |        14.7406 ns |        16.4751 ns |   1.03 |   1,204 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleStructs           |     2,965.7871 ns |     2,978.7563 ns |     2,677.0252 ns |     3,249.8076 ns | 197.39 |   1,603 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClass                |       521.0727 ns |       524.8786 ns |       496.3595 ns |       574.3951 ns |   1.00 |         - |  0.2460 |       - |       - |    2528 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClass          |       764.3313 ns |       757.7421 ns |       736.4055 ns |       798.7311 ns |   1.47 |         - |  0.2451 |       - |       - |    2528 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoSerializeTolerantClass                  |        94.3630 ns |        94.7205 ns |        87.3816 ns |       101.7905 ns |   1.00 |   1,154 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClass            |       418.4511 ns |       418.8876 ns |       393.4790 ns |       468.7534 ns |   4.44 |   1,164 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClasses              |    57,682.0058 ns |    56,736.4726 ns |    55,517.0137 ns |    61,734.9037 ns |   1.00 |         - | 18.4326 |  5.7373 |       - |  253624 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClasses        |    79,990.9113 ns |    81,528.4921 ns |    74,885.6201 ns |    85,180.2208 ns |   1.39 |         - | 17.9443 |  5.6152 |       - |  253624 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| VersionTolerantTest | NinoSerializeTolerantClasses                |    10,267.5625 ns |    10,323.3566 ns |     9,426.2225 ns |    10,776.4607 ns |   1.00 | 115,404 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClasses          |    40,558.8009 ns |    40,232.5351 ns |    37,961.6306 ns |    43,179.2206 ns |   3.96 | 116,404 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoDeserializeVectors                      |   104,548.2808 ns |   105,034.5450 ns |    90,615.1733 ns |   113,076.9202 ns |   1.00 |         - |  8.1787 |  8.1787 |  8.1787 |  160016 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeVectors                |   111,234.7055 ns |   111,837.7678 ns |   101,650.6357 ns |   118,846.8276 ns |   1.07 |         - |  8.3008 |  8.3008 |  8.3008 |  160016 B |        1.00 |
| SimpleTest          | MessagePackDeserializeVectors               |   312,742.9745 ns |   308,517.1653 ns |   289,028.3967 ns |   343,698.4690 ns |   3.00 |         - | 12.2070 | 12.2070 | 12.2070 |  160024 B |        1.00 |
|                     |                                             |                   |                   |                   |                   |        |           |         |         |         |           |             |
| SimpleTest          | NinoSerializeVectors                        |     4,185.7958 ns |     4,210.3811 ns |     3,919.2227 ns |     4,510.8003 ns |   1.00 | 160,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeVectors                  |     4,326.0336 ns |     4,331.5631 ns |     4,101.5232 ns |     4,553.1488 ns |   1.03 | 160,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeVectors                 |   126,388.6037 ns |   126,359.8853 ns |   118,694.3779 ns |   134,574.5696 ns |  30.23 | 210,003 B |       - |       - |       - |         - |          NA |

</details>

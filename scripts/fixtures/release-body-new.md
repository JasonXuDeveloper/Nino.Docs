## 📊 v3 3.3.13 vs v4 (same machine)

<details>
<summary>local</summary>

### v4 vs v3 (v3 run before v4)

| case                             | v3 3.3.13 | v4        | v4 vs v3 | MemoryPack (v4 run) | MemoryPack (v3 run) |
|----------------------------------|----------:|----------:|---------:|--------------------:|--------------------:|
| SerializeFixedClass              |         - |  12.70 ns |        - |            25.24 ns |                   - |
| SerializeFixedClasses            |         - | 896.85 ns |        - |             1.78 μs |                   - |
| SerializeFixedStruct             |         - |  12.12 ns |        - |            11.53 ns |                   - |
| SerializeGraph                   |         - |   5.32 μs |        - |            24.87 μs |                   - |
| SerializePolymorphicClassArray   |         - |  58.94 μs |        - |           278.45 μs |                   - |
| SerializePolymorphicClass        |         - |   6.82 μs |        - |            24.43 μs |                   - |
| SerializePolymorphicFooArray     |         - |   6.16 μs |        - |            23.53 μs |                   - |
| SerializeSimpleClass             | 144.03 ns |  94.22 ns |    0.65x |           320.69 ns |           316.38 ns |
| SerializeSimpleClasses           |  23.88 μs |  10.40 μs |    0.44x |            33.05 μs |            34.64 μs |
| SerializeSimpleStruct            |   1.52 ns |   1.57 ns |    1.03x |             2.75 ns |             2.92 ns |
| SerializeSimpleStructs           |  14.68 ns |  14.13 ns |    0.96x |            15.71 ns |            17.44 ns |
| SerializeTolerantClass           |         - |  92.51 ns |        - |           415.44 ns |                   - |
| SerializeTolerantClasses         |         - |  10.67 μs |        - |            41.07 μs |                   - |
| SerializeVectors                 |   4.24 μs |   4.27 μs |    1.01x |             4.21 μs |             4.25 μs |
| DeserializeFixedClass            |         - |  11.63 ns |        - |            25.04 ns |                   - |
| DeserializeFixedClasses          |         - |   1.35 μs |        - |             1.40 μs |                   - |
| DeserializeFixedStruct           |         - |   0.13 ns |        - |             0.46 ns |                   - |
| DeserializeGraph                 |         - |   6.49 μs |        - |            19.31 μs |                   - |
| LeavesNew                        |         - |   3.99 μs |        - |             4.09 μs |                   - |
| LeavesPooledElements             |         - |   2.69 μs |        - |                   - |                   - |
| LeavesInPlace                    |         - | 510.80 ns |        - |                   - |                   - |
| NodeNew                          |         - | 635.60 ns |        - |           650.38 ns |                   - |
| NodePooled                       |         - | 219.11 ns |        - |                   - |                   - |
| PlainNew                         |         - |   2.99 μs |        - |             3.94 μs |                   - |
| DeserializePolymorphicClassArray |         - | 305.81 μs |        - |           412.13 μs |                   - |
| DeserializePolymorphicClass      |         - |  22.62 μs |        - |            37.59 μs |                   - |
| DeserializePolymorphicFooArray   |         - |  22.02 μs |        - |            29.74 μs |                   - |
| DeserializeNew                   |         - | 531.47 ns |        - |           709.77 ns |                   - |
| DeserializePooled                |         - | 461.87 ns |        - |                   - |                   - |
| DeserializeSimpleClass           | 623.83 ns | 538.50 ns |    0.86x |           706.84 ns |           733.43 ns |
| DeserializeSimpleClasses         |  61.75 μs |  56.69 μs |    0.92x |            67.83 μs |            69.45 μs |
| DeserializeSimpleStruct          |   0.50 ns |   0.33 ns |    0.65x |             0.49 ns |             0.34 ns |
| DeserializeSimpleStructs         | 122.40 ns | 125.06 ns |    1.02x |           134.50 ns |           129.21 ns |
| DeserializeTolerantClass         |         - | 538.09 ns |        - |           783.63 ns |                   - |
| DeserializeTolerantClasses       |         - |  55.56 μs |        - |            77.21 μs |                   - |
| DeserializeVectors               | 110.19 μs | 117.92 μs |    1.07x |           112.47 μs |           116.97 μs |

v4 vs v3 = mean(v4) / mean(v3); below 1.00x means v4 is faster.
MemoryPack drift (v4 run / v3 run): min 0.90x, max 1.44x (same code in both runs; the spread is the noise floor of this comparison).

### v4 vs v3 (v3 run after v4)

| case                             | v3 3.3.13 | v4        | v4 vs v3 | MemoryPack (v4 run) | MemoryPack (v3 run) |
|----------------------------------|----------:|----------:|---------:|--------------------:|--------------------:|
| SerializeFixedClass              |         - |  12.70 ns |        - |            25.24 ns |                   - |
| SerializeFixedClasses            |         - | 896.85 ns |        - |             1.78 μs |                   - |
| SerializeFixedStruct             |         - |  12.12 ns |        - |            11.53 ns |                   - |
| SerializeGraph                   |         - |   5.32 μs |        - |            24.87 μs |                   - |
| SerializePolymorphicClassArray   |         - |  58.94 μs |        - |           278.45 μs |                   - |
| SerializePolymorphicClass        |         - |   6.82 μs |        - |            24.43 μs |                   - |
| SerializePolymorphicFooArray     |         - |   6.16 μs |        - |            23.53 μs |                   - |
| SerializeSimpleClass             | 139.57 ns |  94.22 ns |    0.68x |           320.69 ns |           307.89 ns |
| SerializeSimpleClasses           |  20.70 μs |  10.40 μs |    0.50x |            33.05 μs |            34.03 μs |
| SerializeSimpleStruct            |   1.64 ns |   1.57 ns |    0.96x |             2.75 ns |             2.94 ns |
| SerializeSimpleStructs           |  14.99 ns |  14.13 ns |    0.94x |            15.71 ns |            18.59 ns |
| SerializeTolerantClass           |         - |  92.51 ns |        - |           415.44 ns |                   - |
| SerializeTolerantClasses         |         - |  10.67 μs |        - |            41.07 μs |                   - |
| SerializeVectors                 |   4.39 μs |   4.27 μs |    0.97x |             4.21 μs |             4.37 μs |
| DeserializeFixedClass            |         - |  11.63 ns |        - |            25.04 ns |                   - |
| DeserializeFixedClasses          |         - |   1.35 μs |        - |             1.40 μs |                   - |
| DeserializeFixedStruct           |         - |   0.13 ns |        - |             0.46 ns |                   - |
| DeserializeGraph                 |         - |   6.49 μs |        - |            19.31 μs |                   - |
| LeavesNew                        |         - |   3.99 μs |        - |             4.09 μs |                   - |
| LeavesPooledElements             |         - |   2.69 μs |        - |                   - |                   - |
| LeavesInPlace                    |         - | 510.80 ns |        - |                   - |                   - |
| NodeNew                          |         - | 635.60 ns |        - |           650.38 ns |                   - |
| NodePooled                       |         - | 219.11 ns |        - |                   - |                   - |
| PlainNew                         |         - |   2.99 μs |        - |             3.94 μs |                   - |
| DeserializePolymorphicClassArray |         - | 305.81 μs |        - |           412.13 μs |                   - |
| DeserializePolymorphicClass      |         - |  22.62 μs |        - |            37.59 μs |                   - |
| DeserializePolymorphicFooArray   |         - |  22.02 μs |        - |            29.74 μs |                   - |
| DeserializeNew                   |         - | 531.47 ns |        - |           709.77 ns |                   - |
| DeserializePooled                |         - | 461.87 ns |        - |                   - |                   - |
| DeserializeSimpleClass           | 537.65 ns | 538.50 ns |    1.00x |           706.84 ns |           713.53 ns |
| DeserializeSimpleClasses         |  61.93 μs |  56.69 μs |    0.92x |            67.83 μs |            67.26 μs |
| DeserializeSimpleStruct          |   0.30 ns |   0.33 ns |    1.11x |             0.49 ns |             0.39 ns |
| DeserializeSimpleStructs         | 120.53 ns | 125.06 ns |    1.04x |           134.50 ns |           135.77 ns |
| DeserializeTolerantClass         |         - | 538.09 ns |        - |           783.63 ns |                   - |
| DeserializeTolerantClasses       |         - |  55.56 μs |        - |            77.21 μs |                   - |
| DeserializeVectors               | 116.28 μs | 117.92 μs |    1.01x |           112.47 μs |           114.40 μs |

v4 vs v3 = mean(v4) / mean(v3); below 1.00x means v4 is faster.
MemoryPack drift (v4 run / v3 run): min 0.84x, max 1.27x (same code in both runs; the spread is the noise floor of this comparison).

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
| NinoDeserializeSimpleClass          |     623.8258 ns |     563.7145 ns |     691.8123 ns |   1.00 |        - |  0.2480 |       - |       - |    2552 B |        1.00 |
| MemoryPackDeserializeSimpleClass    |     733.4327 ns |     665.4472 ns |     771.1478 ns |   1.18 |        - |  0.2460 |       - |       - |    2528 B |        0.99 |
| MessagePackDeserializeSimpleClass   |   1,858.9630 ns |   1,762.0070 ns |   1,917.2005 ns |   2.99 |        - |  0.2480 |       - |       - |    2528 B |        0.99 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleClass            |     144.0323 ns |     136.0405 ns |     154.5899 ns |   1.00 |   1.13KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleClass      |     316.3754 ns |     296.8986 ns |     329.4886 ns |   2.20 |   1.12KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleClass     |     831.5861 ns |     786.5530 ns |     876.1716 ns |   5.78 |   1.09KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleClasses        |  61,753.2121 ns |  58,146.3444 ns |  65,253.4581 ns |   1.00 |        - | 19.0430 |  5.8594 |       - |  262424 B |        1.00 |
| MemoryPackDeserializeSimpleClasses  |  69,448.0015 ns |  66,865.1617 ns |  72,734.1884 ns |   1.13 |        - | 18.1885 |  5.3711 |       - |  253624 B |        0.97 |
| MessagePackDeserializeSimpleClasses | 202,014.2584 ns | 185,865.7937 ns | 213,256.6033 ns |   3.27 |        - | 17.5781 |  5.1270 |       - |  253624 B |        0.97 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleClasses          |  23,876.6486 ns |  22,388.3750 ns |  25,315.4643 ns |   1.00 |  112.5KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleClasses    |  34,637.7065 ns |  32,451.7314 ns |  37,471.9060 ns |   1.45 | 112.11KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleClasses   |  84,193.9517 ns |  79,971.7628 ns |  89,865.6663 ns |   3.53 |  108.6KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleStruct         |       0.5043 ns |       0.3410 ns |       0.6541 ns |   1.04 |        - |       - |       - |       - |         - |          NA |
| MemoryPackDeserializeSimpleStruct   |       0.3437 ns |       0.1961 ns |       0.5900 ns |   0.71 |        - |       - |       - |       - |         - |          NA |
| MessagePackDeserializeSimpleStruct  |      52.5945 ns |      50.4693 ns |      57.1095 ns | 108.84 |        - |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleStruct           |       1.5227 ns |       1.2451 ns |       1.8026 ns |   1.01 |      12B |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleStruct     |       2.9249 ns |       2.5874 ns |       3.4037 ns |   1.94 |      12B |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleStruct    |      44.4973 ns |      41.7543 ns |      48.8862 ns |  29.54 |      16B |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleStructs        |     122.4018 ns |     115.3743 ns |     133.2145 ns |   1.00 |        - |  0.1214 |       - |       - |    1224 B |        1.00 |
| MemoryPackDeserializeSimpleStructs  |     129.2089 ns |     117.4257 ns |     138.1985 ns |   1.06 |        - |  0.1214 |       - |       - |    1224 B |        1.00 |
| MessagePackDeserializeSimpleStructs |   2,916.9733 ns |   2,639.4108 ns |   3,298.7381 ns |  23.89 |        - |  0.1526 |  0.0038 |  0.0038 |         - |        0.00 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleStructs          |      14.6833 ns |      14.0823 ns |      15.4585 ns |   1.00 |   1.18KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleStructs    |      17.4369 ns |      16.1642 ns |      19.4110 ns |   1.19 |   1.18KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleStructs   |   2,863.9808 ns |   2,727.3154 ns |   3,090.1933 ns | 195.18 |   1.57KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeVectors              | 110,190.9838 ns | 105,674.7727 ns | 116,960.1980 ns |   1.00 |        - |  7.8125 |  7.8125 |  7.8125 |  160015 B |        1.00 |
| MemoryPackDeserializeVectors        | 116,965.2658 ns | 106,737.3722 ns | 130,798.1564 ns |   1.06 |        - |  7.2021 |  7.2021 |  7.2021 |  160014 B |        1.00 |
| MessagePackDeserializeVectors       | 321,380.9371 ns | 309,260.8989 ns | 335,900.7632 ns |   2.92 |        - | 13.6719 | 13.6719 | 13.6719 |  160027 B |        1.00 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeVectors                |   4,240.8273 ns |   3,972.8491 ns |   4,434.0318 ns |   1.00 | 156.25KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeVectors          |   4,248.5429 ns |   4,109.9878 ns |   4,464.7574 ns |   1.00 | 156.25KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeVectors         | 125,001.1926 ns | 117,799.2224 ns | 132,891.1753 ns |  29.51 | 205.08KB |       - |       - |       - |         - |          NA |

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
| NinoDeserializeSimpleClass          |     537.6490 ns |     510.5665 ns |     555.2713 ns |   1.00 |        - |  0.2480 |       - |       - |    2552 B |        1.00 |
| MemoryPackDeserializeSimpleClass    |     713.5309 ns |     663.4472 ns |     768.5889 ns |   1.33 |        - |  0.2470 |       - |       - |    2528 B |        0.99 |
| MessagePackDeserializeSimpleClass   |   1,708.9157 ns |   1,622.0895 ns |   1,837.0526 ns |   3.18 |        - |  0.2460 |       - |       - |    2528 B |        0.99 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleClass            |     139.5690 ns |     133.4130 ns |     150.0023 ns |   1.00 |   1.13KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleClass      |     307.8906 ns |     288.7817 ns |     316.8094 ns |   2.21 |   1.12KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleClass     |     849.0402 ns |     794.8641 ns |     871.6676 ns |   6.09 |   1.09KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleClasses        |  61,929.5478 ns |  55,234.3980 ns |  65,787.3618 ns |   1.00 |        - | 18.7988 |  5.7373 |       - |  262424 B |        1.00 |
| MemoryPackDeserializeSimpleClasses  |  67,263.2314 ns |  64,189.5303 ns |  70,468.1399 ns |   1.09 |        - | 18.1885 |  5.7373 |       - |  253624 B |        0.97 |
| MessagePackDeserializeSimpleClasses | 201,554.0294 ns | 187,054.4751 ns | 218,889.5046 ns |   3.26 |        - | 17.5781 |  5.6152 |       - |  253624 B |        0.97 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleClasses          |  20,701.1615 ns |  19,673.3570 ns |  21,735.7594 ns |   1.00 |  112.5KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleClasses    |  34,034.2314 ns |  31,725.7449 ns |  36,737.7551 ns |   1.65 | 112.11KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleClasses   |  80,247.5472 ns |  76,462.7527 ns |  83,586.3593 ns |   3.88 | 108.59KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleStruct         |       0.2976 ns |       0.1922 ns |       0.4642 ns |   1.05 |        - |       - |       - |       - |         - |          NA |
| MemoryPackDeserializeSimpleStruct   |       0.3904 ns |       0.2117 ns |       0.6289 ns |   1.37 |        - |       - |       - |       - |         - |          NA |
| MessagePackDeserializeSimpleStruct  |      50.4652 ns |      48.6042 ns |      54.1270 ns | 177.30 |        - |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleStruct           |       1.6387 ns |       1.3370 ns |       1.9408 ns |   1.01 |      12B |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleStruct     |       2.9422 ns |       2.6886 ns |       3.2228 ns |   1.82 |      12B |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleStruct    |      45.6264 ns |      43.0023 ns |      48.4565 ns |  28.19 |      16B |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeSimpleStructs        |     120.5344 ns |     108.6345 ns |     128.3060 ns |   1.00 |        - |  0.1214 |       - |       - |    1224 B |        1.00 |
| MemoryPackDeserializeSimpleStructs  |     135.7712 ns |     126.2825 ns |     147.7902 ns |   1.13 |        - |  0.1214 |       - |       - |    1224 B |        1.00 |
| MessagePackDeserializeSimpleStructs |   3,024.8043 ns |   2,840.6185 ns |   3,338.8020 ns |  25.14 |        - |  0.1183 |       - |       - |    1224 B |        1.00 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeSimpleStructs          |      14.9874 ns |      14.0133 ns |      15.9515 ns |   1.00 |   1.18KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeSimpleStructs    |      18.5929 ns |      17.1540 ns |      20.3159 ns |   1.24 |   1.18KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeSimpleStructs   |   2,868.5865 ns |   2,803.8702 ns |   3,024.0357 ns | 191.79 |   1.57KB |       - |       - |       - |         - |          NA |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoDeserializeVectors              | 116,277.0635 ns | 105,526.0914 ns | 131,515.8057 ns |   1.00 |        - |  7.4463 |  7.4463 |  7.4463 |  160015 B |        1.00 |
| MemoryPackDeserializeVectors        | 114,402.0616 ns | 104,338.4339 ns | 125,248.2640 ns |   0.99 |        - |  7.5684 |  7.5684 |  7.5684 |  160015 B |        1.00 |
| MessagePackDeserializeVectors       | 323,684.6110 ns | 301,156.0166 ns | 351,463.7285 ns |   2.80 |        - | 13.6719 | 13.6719 | 13.6719 | 1045473 B |        6.53 |
|                                     |                 |                 |                 |        |          |         |         |         |           |             |
| NinoSerializeVectors                |   4,387.7155 ns |   4,030.3440 ns |   4,870.8260 ns |   1.00 | 156.25KB |       - |       - |       - |         - |          NA |
| MemoryPackSerializeVectors          |   4,373.1603 ns |   4,116.5292 ns |   4,679.3866 ns |   1.00 | 156.25KB |       - |       - |       - |         - |          NA |
| MessagePackSerializeVectors         | 125,419.1550 ns | 120,706.4946 ns | 132,509.7061 ns |  28.68 | 205.08KB |       - |       - |       - |         - |          NA |

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
| Type                | Method                                      | Mean              | Min               | Max               | Ratio  | Payload  | Gen0    | Gen1    | Gen2    | Allocated | Alloc Ratio |
|-------------------- |-------------------------------------------- |------------------:|------------------:|------------------:|-------:|---------:|--------:|--------:|--------:|----------:|------------:|
| FixedSizeTest       | NinoDeserializeFixedClass                   |        11.6258 ns |        10.1242 ns |        13.6588 ns |   1.01 |        - |  0.0055 |       - |       - |      56 B |        1.00 |
| FixedSizeTest       | MemoryPackDeserializeFixedClass             |        25.0354 ns |        22.3595 ns |        27.0725 ns |   2.17 |        - |  0.0055 |       - |       - |      56 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedClass                     |        12.7017 ns |        11.7480 ns |        13.7622 ns |   1.00 |     41 B |  0.0069 |       - |       - |      72 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClass               |        25.2360 ns |        21.9000 ns |        27.9797 ns |   1.99 |     41 B |  0.0070 |       - |       - |      72 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| FixedSizeTest       | NinoDeserializeFixedClasses                 |     1,351.9277 ns |     1,241.8546 ns |     1,447.8704 ns |   1.00 |        - |  0.6237 |  0.0076 |       - |    6424 B |        1.00 |
| FixedSizeTest       | MemoryPackDeserializeFixedClasses           |     1,399.1898 ns |     1,348.2810 ns |     1,472.8270 ns |   1.04 |        - |  0.6256 |  0.0038 |       - |    6424 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedClasses                   |       896.8502 ns |       849.8845 ns |       966.4216 ns |   1.00 |  4,104 B |  0.4110 |       - |       - |    4128 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedClasses             |     1,782.1867 ns |     1,639.5223 ns |     1,909.6682 ns |   1.99 |  4,104 B |  0.3967 |       - |       - |    4128 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| FixedSizeTest       | NinoDeserializeFixedStruct                  |         0.1342 ns |         0.0000 ns |         0.2979 ns |      ? |        - |       - |       - |       - |         - |           ? |
| FixedSizeTest       | MemoryPackDeserializeFixedStruct            |         0.4585 ns |         0.3495 ns |         0.6970 ns |      ? |        - |       - |       - |       - |         - |           ? |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| FixedSizeTest       | NinoSerializeFixedStruct                    |        12.1180 ns |        10.9267 ns |        13.0685 ns |   1.00 |     40 B |  0.0062 |       - |       - |      64 B |        1.00 |
| FixedSizeTest       | MemoryPackSerializeFixedStruct              |        11.5259 ns |        10.0191 ns |        13.2124 ns |   0.95 |     40 B |  0.0062 |       - |       - |      64 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| ReferenceTest       | NinoDeserializeGraph                        |     6,493.5338 ns |     6,041.4956 ns |     6,918.5482 ns |   1.00 |        - |  1.3657 |  0.0305 |       - |   14104 B |        1.00 |
| ReferenceTest       | MemoryPackDeserializeGraph                  |    19,313.9950 ns |    17,895.4335 ns |    20,909.8186 ns |   2.98 |        - |  1.8311 |  0.0610 |       - |   14104 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| ReferenceTest       | NinoSerializeGraph                          |     5,320.0897 ns |     5,037.5267 ns |     5,831.9236 ns |   1.00 |  5,948 B |       - |       - |       - |         - |          NA |
| ReferenceTest       | MemoryPackSerializeGraph                    |    24,869.7771 ns |    23,918.7864 ns |    26,039.6305 ns |   4.68 |  5,584 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| PooledGraphTest     | NinoLeavesNew                               |     3,993.7473 ns |     3,694.8367 ns |     4,261.4628 ns |   1.00 |        - |  1.3199 |  0.0305 |       - |   13656 B |        1.00 |
| PooledGraphTest     | NinoLeavesPooledElements                    |     2,685.6146 ns |     2,515.7773 ns |     3,014.6315 ns |   0.67 |        - |  0.1106 |       - |       - |     856 B |        0.06 |
| PooledGraphTest     | NinoLeavesInPlace                           |       510.7954 ns |       470.9533 ns |       574.9528 ns |   0.13 |        - |       - |       - |       - |         - |        0.00 |
| PooledGraphTest     | MemoryPackLeavesNew                         |     4,093.8430 ns |     3,810.7303 ns |     4,316.2828 ns |   1.03 |        - |  1.3199 |  0.0305 |       - |   13656 B |        1.00 |
| PooledGraphTest     | MemoryPackLeavesOverwrite                   |     4,605.1599 ns |     4,155.0468 ns |     5,160.5884 ns |   1.15 |        - |  1.2360 |  0.0153 |       - |   12800 B |        0.94 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| PooledGraphTest     | NinoNodeNew                                 |       635.6012 ns |       602.9634 ns |       664.3266 ns |   1.00 |        - |  0.2127 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | NinoNodePooled                              |       219.1075 ns |       206.0806 ns |       239.2981 ns |   0.35 |        - |       - |       - |       - |         - |        0.00 |
| PooledGraphTest     | MemoryPackNodeNew                           |       650.3838 ns |       608.6313 ns |       705.2185 ns |   1.02 |        - |  0.2108 |       - |       - |    2192 B |        1.00 |
| PooledGraphTest     | MemoryPackNodeOverwrite                     |       494.5699 ns |       455.2651 ns |       523.9723 ns |   0.78 |        - |  0.0992 |       - |       - |    1024 B |        0.47 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| PooledGraphTest     | NinoPlainNew                                |     2,987.5262 ns |     2,730.5469 ns |     3,389.1456 ns |   1.00 |        - |  1.2550 |  0.0267 |       - |   12856 B |        1.00 |
| PooledGraphTest     | MemoryPackPlainNew                          |     3,942.5045 ns |     3,718.4865 ns |     4,280.5060 ns |   1.32 |        - |  1.2436 |  0.0305 |       - |   12856 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicClassArray        |   305,805.0375 ns |   285,587.2158 ns |   329,967.0396 ns |   1.00 |        - | 32.2266 | 13.6719 |       - |  745624 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicClassArray  |   412,132.4945 ns |   394,320.6270 ns |   425,870.9351 ns |   1.35 |        - | 31.2500 | 14.6484 |       - |  745624 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicClassArray | 1,677,983.3520 ns | 1,598,917.1035 ns | 1,774,075.9277 ns |   5.50 |        - | 48.8281 | 23.4375 |       - | 1162424 B |        1.56 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicClassArray          |    58,939.8916 ns |    56,128.0459 ns |    61,791.5639 ns |   1.00 |397,304 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicClassArray    |   278,448.8347 ns |   258,628.0063 ns |   296,793.5498 ns |   4.73 |384,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicClassArray   |   811,618.8816 ns |   772,685.6250 ns |   854,568.3955 ns |  13.78 |487,103 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicClass             |    22,623.0717 ns |    21,416.0262 ns |    23,807.7134 ns |   1.00 |        - |  7.4463 |  1.0986 |       - |   79688 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicClass       |    37,592.6555 ns |    36,164.0236 ns |    39,974.8661 ns |   1.66 |        - |  7.3853 |  1.0376 |       - |   79688 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicClass      |   206,795.7596 ns |   195,552.6948 ns |   218,218.6001 ns |   9.15 |        - |  7.8125 |  0.7324 |       - |   83856 B |        1.05 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicClass               |     6,823.1230 ns |     6,537.1305 ns |     7,289.7694 ns |   1.00 | 53,789 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicClass         |    24,431.7678 ns |    23,342.0516 ns |    25,642.6310 ns |   3.58 | 51,760 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicClass        |   115,230.0237 ns |   110,871.9188 ns |   120,784.1611 ns |  16.91 | 66,859 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| PolymorphicTest     | NinoDeserializePolymorphicFooArray          |    22,017.0761 ns |    20,525.3840 ns |    23,420.1695 ns |   1.00 |        - |  7.2021 |  1.0071 |       - |   76024 B |        1.00 |
| PolymorphicTest     | MemoryPackDeserializePolymorphicFooArray    |    29,737.3775 ns |    28,591.2295 ns |    30,791.8300 ns |   1.35 |        - |  7.0801 |  1.0681 |       - |   76024 B |        1.00 |
| PolymorphicTest     | MessagePackDeserializePolymorphicFooArray   |   192,893.9829 ns |   188,890.1321 ns |   196,402.4702 ns |   8.77 |        - |  7.0801 |  0.7324 |       - |   76024 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| PolymorphicTest     | NinoSerializePolymorphicFooArray            |     6,163.8003 ns |     5,845.0228 ns |     6,553.7242 ns |   1.00 | 52,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MemoryPackSerializePolymorphicFooArray      |    23,527.5631 ns |    21,960.4257 ns |    24,881.9714 ns |   3.82 | 50,404 B |       - |       - |       - |         - |          NA |
| PolymorphicTest     | MessagePackSerializePolymorphicFooArray     |   104,598.0566 ns |    99,811.0422 ns |   107,545.1891 ns |  16.99 | 65,203 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| PooledTest          | NinoDeserializeNew                          |       531.4666 ns |       513.5100 ns |       550.5622 ns |   1.00 |        - |  0.2451 |  0.0010 |       - |    2536 B |        1.00 |
| PooledTest          | NinoDeserializePooled                       |       461.8679 ns |       439.4161 ns |       492.6606 ns |   0.87 |        - |  0.1049 |       - |       - |    1080 B |        0.43 |
| PooledTest          | MemoryPackDeserializeNew                    |       709.7680 ns |       649.9120 ns |       770.1529 ns |   1.34 |        - |  0.2480 |       - |       - |    2536 B |        1.00 |
| PooledTest          | MemoryPackDeserializeOverwrite              |       573.1106 ns |       532.6091 ns |       626.2235 ns |   1.08 |        - |  0.1040 |       - |       - |    1080 B |        0.43 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleClass                  |       538.5045 ns |       514.2469 ns |       572.2063 ns |   1.00 |        - |  0.2460 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleClass            |       706.8350 ns |       675.3687 ns |       763.3140 ns |   1.31 |        - |  0.2451 |       - |       - |    2528 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleClass           |     1,739.1356 ns |     1,672.0905 ns |     1,865.6628 ns |   3.23 |        - |  0.2460 |       - |       - |    2528 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleClass                    |        94.2163 ns |        89.7516 ns |        99.0466 ns |   1.00 |  1,150 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleClass              |       320.6945 ns |       312.2436 ns |       331.1163 ns |   3.41 |  1,148 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleClass             |       812.5622 ns |       761.7930 ns |       860.9030 ns |   8.63 |  1,112 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleClasses                |    56,691.7134 ns |    53,862.3762 ns |    60,212.9005 ns |   1.00 |        - | 18.1885 |  5.4321 |       - |  253624 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleClasses          |    67,829.4244 ns |    60,682.5389 ns |    74,139.6514 ns |   1.20 |        - | 18.0664 |  5.2490 |       - |  253624 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleClasses         |   196,271.3554 ns |   184,465.0706 ns |   214,233.1777 ns |   3.47 |        - | 18.0664 |  5.3711 |       - |  253624 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleClasses                  |    10,400.0120 ns |     9,721.1468 ns |    10,951.9347 ns |   1.00 |115,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleClasses            |    33,052.4687 ns |    31,100.6632 ns |    36,243.9572 ns |   3.18 |114,804 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleClasses           |    78,339.1272 ns |    73,804.0513 ns |    83,459.1353 ns |   7.54 |111,203 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleStruct                 |         0.3298 ns |         0.1544 ns |         0.5294 ns |   1.14 |        - |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackDeserializeSimpleStruct           |         0.4949 ns |         0.2237 ns |         0.8405 ns |   1.71 |        - |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackDeserializeSimpleStruct          |        50.6639 ns |        49.0971 ns |        52.6515 ns | 175.41 |        - |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleStruct                   |         1.5665 ns |         1.3037 ns |         1.7698 ns |   1.01 |     12 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleStruct             |         2.7541 ns |         2.4821 ns |         3.1323 ns |   1.77 |     12 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleStruct            |        45.3075 ns |        43.9793 ns |        46.5730 ns |  29.13 |     16 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| SimpleTest          | NinoDeserializeSimpleStructs                |       125.0581 ns |       114.2414 ns |       134.5615 ns |   1.00 |        - |  0.1214 |       - |       - |    1224 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeSimpleStructs          |       134.4987 ns |       126.8457 ns |       142.7001 ns |   1.08 |        - |  0.1214 |       - |       - |    1224 B |        1.00 |
| SimpleTest          | MessagePackDeserializeSimpleStructs         |     2,869.6046 ns |     2,726.1429 ns |     2,999.8212 ns |  22.98 |        - |  0.1907 |  0.0038 |  0.0038 |         - |        0.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| SimpleTest          | NinoSerializeSimpleStructs                  |        14.1342 ns |        13.4730 ns |        15.0427 ns |   1.00 |  1,204 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeSimpleStructs            |        15.7109 ns |        14.8129 ns |        17.4521 ns |   1.11 |  1,204 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeSimpleStructs           |     2,925.4516 ns |     2,810.9572 ns |     3,154.8717 ns | 207.17 |  1,603 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClass                |       538.0925 ns |       501.1757 ns |       573.6375 ns |   1.00 |        - |  0.2432 |  0.0010 |       - |    2528 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClass          |       783.6259 ns |       697.3741 ns |       859.2125 ns |   1.46 |        - |  0.2451 |       - |       - |    2528 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| VersionTolerantTest | NinoSerializeTolerantClass                  |        92.5121 ns |        88.8891 ns |        98.4079 ns |   1.00 |  1,154 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClass            |       415.4443 ns |       391.0891 ns |       445.3449 ns |   4.49 |  1,164 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| VersionTolerantTest | NinoDeserializeTolerantClasses              |    55,562.4505 ns |    52,338.6850 ns |    59,576.6766 ns |   1.00 |        - | 18.4326 |  5.5542 |       - |  253624 B |        1.00 |
| VersionTolerantTest | MemoryPackDeserializeTolerantClasses        |    77,210.1807 ns |    70,724.9575 ns |    83,200.6188 ns |   1.39 |        - | 18.0664 |  5.4932 |       - |  253624 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| VersionTolerantTest | NinoSerializeTolerantClasses                |    10,666.4478 ns |     9,983.8269 ns |    11,650.6033 ns |   1.00 |115,404 B |       - |       - |       - |         - |          NA |
| VersionTolerantTest | MemoryPackSerializeTolerantClasses          |    41,074.9874 ns |    39,113.0743 ns |    43,965.6166 ns |   3.86 |116,404 B |       - |       - |       - |         - |          NA |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| SimpleTest          | NinoDeserializeVectors                      |   117,919.5926 ns |   108,761.5326 ns |   126,467.6118 ns |   1.00 |        - |  8.0566 |  8.0566 |  8.0566 |  160016 B |        1.00 |
| SimpleTest          | MemoryPackDeserializeVectors                |   112,469.4955 ns |   104,982.8882 ns |   121,587.6262 ns |   0.96 |        - |  8.1787 |  8.1787 |  8.1787 |  160016 B |        1.00 |
| SimpleTest          | MessagePackDeserializeVectors               |   329,691.6750 ns |   306,397.6907 ns |   359,921.5803 ns |   2.80 |        - | 11.7188 | 11.7188 | 11.7188 |  160023 B |        1.00 |
|                     |                                             |                   |                   |                   |        |          |         |         |         |           |             |
| SimpleTest          | NinoSerializeVectors                        |     4,266.7289 ns |     3,975.4954 ns |     4,546.1557 ns |   1.00 |160,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MemoryPackSerializeVectors                  |     4,205.2902 ns |     4,060.5174 ns |     4,377.7341 ns |   0.99 |160,004 B |       - |       - |       - |         - |          NA |
| SimpleTest          | MessagePackSerializeVectors                 |   124,213.3332 ns |   119,105.4303 ns |   129,732.8820 ns |  29.17 |210,003 B |       - |       - |       - |         - |          NA |

</details>

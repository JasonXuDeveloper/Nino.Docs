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
| WorkloadTest        | NinoSerializeMediaContent | 19.5554 ns | 19.5554 ns | 19.1643 ns | 19.9465 ns | 1.00 | 97,548 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeMediaContent | 13.9897 ns | 13.9897 ns | 13.7099 ns | 14.2695 ns | 0.72 | 77,959 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeMediaContent | 19.5252 ns | 19.5252 ns | 19.1347 ns | 19.9157 ns | 1.00 | 99,570 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeMediaContent | 132.0573 ns | 132.0573 ns | 129.4162 ns | 134.6985 ns | 6.75 | 80,068 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeMediaContent | 19.5210 ns | 19.5210 ns | 19.1306 ns | 19.9114 ns | 1.00 | 66,663 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeMediaContent | 10.7894 ns | 10.7894 ns | 10.5736 ns | 11.0052 ns | 0.55 | 86,225 B | - | - | - | 790985 B | NA |
| WorkloadTest        | NinoDeserializeMediaContent | 49.7018 ns | 49.7018 ns | 48.7078 ns | 50.6959 ns | 1.00 | - | - | - | - | 488644 B | NA |
| WorkloadTest        | MemoryPackDeserializeMediaContent | 40.8870 ns | 40.8870 ns | 40.0693 ns | 41.7048 ns | 0.82 | - | - | - | - | 174811 B | NA |
| WorkloadTest        | MessagePackDeserializeMediaContent | 34.5583 ns | 34.5583 ns | 33.8671 ns | 35.2495 ns | 0.70 | - | - | - | - | 730726 B | NA |
| WorkloadTest        | ProtobufDeserializeMediaContent | 104.5592 ns | 104.5592 ns | 102.4681 ns | 106.6504 ns | 2.10 | - | - | - | - | 282603 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeMediaContent | 35.3518 ns | 35.3518 ns | 34.6448 ns | 36.0588 ns | 0.71 | - | - | - | - | 415577 B | NA |
| WorkloadTest        | JsonDeserializeMediaContent | 149.8676 ns | 149.8676 ns | 146.8703 ns | 152.8650 ns | 3.02 | - | - | - | - | 570658 B | NA |
| WorkloadTest        | NinoSerializeStackOverflowPage | 10,039.8567 ns | 10,039.8567 ns | 9,839.0595 ns | 10,240.6538 ns | 1.00 | 91,885 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeStackOverflowPage | 10,039.7116 ns | 10,039.7116 ns | 9,838.9174 ns | 10,240.5058 ns | 1.00 | 109,086 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeStackOverflowPage | 10,222.5161 ns | 10,222.5161 ns | 10,018.0658 ns | 10,426.9664 ns | 1.02 | 129,063 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeStackOverflowPage | 9,864.3459 ns | 9,864.3459 ns | 9,667.0590 ns | 10,061.6329 ns | 0.98 | 61,776 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeStackOverflowPage | 7,986.1047 ns | 7,986.1047 ns | 7,826.3827 ns | 8,145.8268 ns | 0.80 | 80,998 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeStackOverflowPage | 27,964.8311 ns | 27,964.8311 ns | 27,405.5345 ns | 28,524.1277 ns | 2.79 | 54,017 B | - | - | - | 659019 B | NA |
| WorkloadTest        | NinoDeserializeStackOverflowPage | 25,281.0227 ns | 25,281.0227 ns | 24,775.4022 ns | 25,786.6431 ns | 1.00 | - | - | - | - | 23375 B | NA |
| WorkloadTest        | MemoryPackDeserializeStackOverflowPage | 25,760.9411 ns | 25,760.9411 ns | 25,245.7223 ns | 26,276.1599 ns | 1.02 | - | - | - | - | 111179 B | NA |
| WorkloadTest        | MessagePackDeserializeStackOverflowPage | 22,246.5613 ns | 22,246.5613 ns | 21,801.6300 ns | 22,691.4925 ns | 0.88 | - | - | - | - | 548479 B | NA |
| WorkloadTest        | ProtobufDeserializeStackOverflowPage | 494,498.2957 ns | 494,498.2957 ns | 484,608.3298 ns | 504,388.2616 ns | 19.56 | - | - | - | - | 190803 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeStackOverflowPage | 25,350.7165 ns | 25,350.7165 ns | 24,843.7022 ns | 25,857.7308 ns | 1.00 | - | - | - | - | 295452 B | NA |
| WorkloadTest        | JsonDeserializeStackOverflowPage | 681,121.1234 ns | 681,121.1234 ns | 667,498.7009 ns | 694,743.5459 ns | 26.94 | - | - | - | - | 602985 B | NA |
| WorkloadTest        | NinoSerializeRpcCall | 155.5564 ns | 155.5564 ns | 152.4453 ns | 158.6676 ns | 1.00 | 223,155 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeRpcCall | 3,914.6342 ns | 3,914.6342 ns | 3,836.3415 ns | 3,992.9269 ns | 25.17 | 175,479 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeRpcCall | 149.1205 ns | 149.1205 ns | 146.1381 ns | 152.1029 ns | 0.96 | 146,777 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeRpcCall | 158.0797 ns | 158.0797 ns | 154.9181 ns | 161.2413 ns | 1.02 | 174,265 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeRpcCall | 148.9742 ns | 148.9742 ns | 145.9947 ns | 151.9537 ns | 0.96 | 181,890 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeRpcCall | 133.7152 ns | 133.7152 ns | 131.0409 ns | 136.3895 ns | 0.86 | 150,821 B | - | - | - | 322182 B | NA |
| WorkloadTest        | NinoDeserializeRpcCall | 400.6301 ns | 400.6301 ns | 392.6175 ns | 408.6428 ns | 1.00 | - | - | - | - | 24303 B | NA |
| WorkloadTest        | MemoryPackDeserializeRpcCall | 312.5215 ns | 312.5215 ns | 306.2710 ns | 318.7719 ns | 0.78 | - | - | - | - | 638990 B | NA |
| WorkloadTest        | MessagePackDeserializeRpcCall | 405.6348 ns | 405.6348 ns | 397.5221 ns | 413.7475 ns | 1.01 | - | - | - | - | 231700 B | NA |
| WorkloadTest        | ProtobufDeserializeRpcCall | 409.6601 ns | 409.6601 ns | 401.4669 ns | 417.8533 ns | 1.02 | - | - | - | - | 160663 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeRpcCall | 400.6276 ns | 400.6276 ns | 392.6150 ns | 408.6401 ns | 1.00 | - | - | - | - | 169879 B | NA |
| WorkloadTest        | JsonDeserializeRpcCall | 371.1139 ns | 371.1139 ns | 363.6916 ns | 378.5362 ns | 0.93 | - | - | - | - | 395855 B | NA |
| WorkloadTest        | NinoSerializeProfileCache | 733.9254 ns | 733.9254 ns | 719.2469 ns | 748.6039 ns | 1.00 | 391,392 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeProfileCache | 518.8371 ns | 518.8371 ns | 508.4604 ns | 529.2139 ns | 0.71 | 146,701 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeProfileCache | 12,216.2007 ns | 12,216.2007 ns | 11,971.8766 ns | 12,460.5247 ns | 16.65 | 364,521 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeProfileCache | 11,934.8724 ns | 11,934.8724 ns | 11,696.1749 ns | 12,173.5698 ns | 16.26 | 433,672 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeProfileCache | 425.4883 ns | 425.4883 ns | 416.9785 ns | 433.9980 ns | 0.58 | 425,400 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeProfileCache | 477.8245 ns | 477.8245 ns | 468.2680 ns | 487.3809 ns | 0.65 | 271,128 B | - | - | - | 219729 B | NA |
| WorkloadTest        | NinoDeserializeProfileCache | 1,811.9927 ns | 1,811.9927 ns | 1,775.7529 ns | 1,848.2326 ns | 1.00 | - | - | - | - | 834789 B | NA |
| WorkloadTest        | MemoryPackDeserializeProfileCache | 1,136.1138 ns | 1,136.1138 ns | 1,113.3916 ns | 1,158.8361 ns | 0.63 | - | - | - | - | 718589 B | NA |
| WorkloadTest        | MessagePackDeserializeProfileCache | 1,862.6581 ns | 1,862.6581 ns | 1,825.4049 ns | 1,899.9112 ns | 1.03 | - | - | - | - | 365239 B | NA |
| WorkloadTest        | ProtobufDeserializeProfileCache | 1,073.1145 ns | 1,073.1145 ns | 1,051.6522 ns | 1,094.5768 ns | 0.59 | - | - | - | - | 729835 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeProfileCache | 1,857.8210 ns | 1,857.8210 ns | 1,820.6646 ns | 1,894.9774 ns | 1.03 | - | - | - | - | 859354 B | NA |
| WorkloadTest        | JsonDeserializeProfileCache | 1,143.3760 ns | 1,143.3760 ns | 1,120.5085 ns | 1,166.2435 ns | 0.63 | - | - | - | - | 95281 B | NA |
| WorkloadTest        | NinoSerializeEventStream | 51,558.7343 ns | 51,558.7343 ns | 50,527.5596 ns | 52,589.9090 ns | 1.00 | 104,235 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeEventStream | 51,957.7167 ns | 51,957.7167 ns | 50,918.5623 ns | 52,996.8710 ns | 1.01 | 181,200 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeEventStream | 30,076.5276 ns | 30,076.5276 ns | 29,474.9970 ns | 30,678.0581 ns | 0.58 | 143,859 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeEventStream | 1,343,964.2894 ns | 1,343,964.2894 ns | 1,317,085.0036 ns | 1,370,843.5752 ns | 26.07 | 142,149 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeEventStream | 876,827.4393 ns | 876,827.4393 ns | 859,290.8905 ns | 894,363.9881 ns | 17.01 | 193,976 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeEventStream | 476,102.5449 ns | 476,102.5449 ns | 466,580.4940 ns | 485,624.5958 ns | 9.23 | 171,790 B | - | - | - | 563670 B | NA |
| WorkloadTest        | NinoDeserializeEventStream | 144,520.9409 ns | 144,520.9409 ns | 141,630.5220 ns | 147,411.3597 ns | 1.00 | - | - | - | - | 205519 B | NA |
| WorkloadTest        | MemoryPackDeserializeEventStream | 145,241.2492 ns | 145,241.2492 ns | 142,336.4242 ns | 148,146.0742 ns | 1.00 | - | - | - | - | 370489 B | NA |
| WorkloadTest        | MessagePackDeserializeEventStream | 145,394.5067 ns | 145,394.5067 ns | 142,486.6165 ns | 148,302.3968 ns | 1.01 | - | - | - | - | 321243 B | NA |
| WorkloadTest        | ProtobufDeserializeEventStream | 3,295,415.7419 ns | 3,295,415.7419 ns | 3,229,507.4271 ns | 3,361,324.0568 ns | 22.80 | - | - | - | - | 435962 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeEventStream | 4,219,147.1917 ns | 4,219,147.1917 ns | 4,134,764.2479 ns | 4,303,530.1355 ns | 29.19 | - | - | - | - | 55770 B | NA |
| WorkloadTest        | JsonDeserializeEventStream | 2,550,297.7774 ns | 2,550,297.7774 ns | 2,499,291.8218 ns | 2,601,303.7329 ns | 17.65 | - | - | - | - | 889498 B | NA |
| WorkloadTest        | NinoSerializeLogBatch | 5,899.5604 ns | 5,899.5604 ns | 5,781.5692 ns | 6,017.5516 ns | 1.00 | 62,341 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeLogBatch | 3,948.9114 ns | 3,948.9114 ns | 3,869.9332 ns | 4,027.8896 ns | 0.67 | 117,595 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeLogBatch | 5,882.5462 ns | 5,882.5462 ns | 5,764.8953 ns | 6,000.1971 ns | 1.00 | 91,567 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeLogBatch | 4,329.0772 ns | 4,329.0772 ns | 4,242.4957 ns | 4,415.6588 ns | 0.73 | 106,927 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeLogBatch | 85,584.2263 ns | 85,584.2263 ns | 83,872.5417 ns | 87,295.9108 ns | 14.51 | 107,154 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeLogBatch | 5,829.0746 ns | 5,829.0746 ns | 5,712.4931 ns | 5,945.6561 ns | 0.99 | 72,855 B | - | - | - | 451912 B | NA |
| WorkloadTest        | NinoDeserializeLogBatch | 13,971.9767 ns | 13,971.9767 ns | 13,692.5372 ns | 14,251.4162 ns | 1.00 | - | - | - | - | 855459 B | NA |
| WorkloadTest        | MemoryPackDeserializeLogBatch | 14,305.0928 ns | 14,305.0928 ns | 14,018.9909 ns | 14,591.1946 ns | 1.02 | - | - | - | - | 59038 B | NA |
| WorkloadTest        | MessagePackDeserializeLogBatch | 354,470.5792 ns | 354,470.5792 ns | 347,381.1676 ns | 361,559.9908 ns | 25.37 | - | - | - | - | 810106 B | NA |
| WorkloadTest        | ProtobufDeserializeLogBatch | 7,494.7478 ns | 7,494.7478 ns | 7,344.8528 ns | 7,644.6427 ns | 0.54 | - | - | - | - | 666280 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeLogBatch | 13,832.9891 ns | 13,832.9891 ns | 13,556.3293 ns | 14,109.6489 ns | 0.99 | - | - | - | - | 125969 B | NA |
| WorkloadTest        | JsonDeserializeLogBatch | 14,244.1498 ns | 14,244.1498 ns | 13,959.2668 ns | 14,529.0328 ns | 1.02 | - | - | - | - | 454445 B | NA |
| WorkloadTest        | NinoSerializeStateSnapshot | 19.5554 ns | 19.5554 ns | 19.1643 ns | 19.9465 ns | 1.00 | 97,548 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeStateSnapshot | 13.9897 ns | 13.9897 ns | 13.7099 ns | 14.2695 ns | 0.72 | 77,959 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeStateSnapshot | 19.5252 ns | 19.5252 ns | 19.1347 ns | 19.9157 ns | 1.00 | 99,570 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeStateSnapshot | 132.0573 ns | 132.0573 ns | 129.4162 ns | 134.6985 ns | 6.75 | 80,068 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeStateSnapshot | 19.5210 ns | 19.5210 ns | 19.1306 ns | 19.9114 ns | 1.00 | 66,663 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeStateSnapshot | 10.7894 ns | 10.7894 ns | 10.5736 ns | 11.0052 ns | 0.55 | 86,225 B | - | - | - | 790985 B | NA |
| WorkloadTest        | NinoDeserializeStateSnapshot | 49.7018 ns | 49.7018 ns | 48.7078 ns | 50.6959 ns | 1.00 | - | - | - | - | 488644 B | NA |
| WorkloadTest        | MemoryPackDeserializeStateSnapshot | 40.8870 ns | 40.8870 ns | 40.0693 ns | 41.7048 ns | 0.82 | - | - | - | - | 174811 B | NA |
| WorkloadTest        | MessagePackDeserializeStateSnapshot | 34.5583 ns | 34.5583 ns | 33.8671 ns | 35.2495 ns | 0.70 | - | - | - | - | 730726 B | NA |
| WorkloadTest        | ProtobufDeserializeStateSnapshot | 104.5592 ns | 104.5592 ns | 102.4681 ns | 106.6504 ns | 2.10 | - | - | - | - | 282603 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeStateSnapshot | 35.3518 ns | 35.3518 ns | 34.6448 ns | 36.0588 ns | 0.71 | - | - | - | - | 415577 B | NA |
| WorkloadTest        | JsonDeserializeStateSnapshot | 149.8676 ns | 149.8676 ns | 146.8703 ns | 152.8650 ns | 3.02 | - | - | - | - | 570658 B | NA |
| WorkloadTest        | NinoSerializeLockstepFrames | 10,039.8567 ns | 10,039.8567 ns | 9,839.0595 ns | 10,240.6538 ns | 1.00 | 91,885 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeLockstepFrames | 10,039.7116 ns | 10,039.7116 ns | 9,838.9174 ns | 10,240.5058 ns | 1.00 | 109,086 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeLockstepFrames | 10,222.5161 ns | 10,222.5161 ns | 10,018.0658 ns | 10,426.9664 ns | 1.02 | 129,063 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeLockstepFrames | 9,864.3459 ns | 9,864.3459 ns | 9,667.0590 ns | 10,061.6329 ns | 0.98 | 61,776 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeLockstepFrames | 7,986.1047 ns | 7,986.1047 ns | 7,826.3827 ns | 8,145.8268 ns | 0.80 | 80,998 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeLockstepFrames | 27,964.8311 ns | 27,964.8311 ns | 27,405.5345 ns | 28,524.1277 ns | 2.79 | 54,017 B | - | - | - | 659019 B | NA |
| WorkloadTest        | NinoDeserializeLockstepFrames | 25,281.0227 ns | 25,281.0227 ns | 24,775.4022 ns | 25,786.6431 ns | 1.00 | - | - | - | - | 23375 B | NA |
| WorkloadTest        | MemoryPackDeserializeLockstepFrames | 25,760.9411 ns | 25,760.9411 ns | 25,245.7223 ns | 26,276.1599 ns | 1.02 | - | - | - | - | 111179 B | NA |
| WorkloadTest        | MessagePackDeserializeLockstepFrames | 22,246.5613 ns | 22,246.5613 ns | 21,801.6300 ns | 22,691.4925 ns | 0.88 | - | - | - | - | 548479 B | NA |
| WorkloadTest        | ProtobufDeserializeLockstepFrames | 494,498.2957 ns | 494,498.2957 ns | 484,608.3298 ns | 504,388.2616 ns | 19.56 | - | - | - | - | 190803 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeLockstepFrames | 25,350.7165 ns | 25,350.7165 ns | 24,843.7022 ns | 25,857.7308 ns | 1.00 | - | - | - | - | 295452 B | NA |
| WorkloadTest        | JsonDeserializeLockstepFrames | 681,121.1234 ns | 681,121.1234 ns | 667,498.7009 ns | 694,743.5459 ns | 26.94 | - | - | - | - | 602985 B | NA |
| WorkloadTest        | NinoSerializeAoiUpdate | 155.5564 ns | 155.5564 ns | 152.4453 ns | 158.6676 ns | 1.00 | 223,155 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeAoiUpdate | 3,914.6342 ns | 3,914.6342 ns | 3,836.3415 ns | 3,992.9269 ns | 25.17 | 175,479 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeAoiUpdate | 149.1205 ns | 149.1205 ns | 146.1381 ns | 152.1029 ns | 0.96 | 146,777 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeAoiUpdate | 158.0797 ns | 158.0797 ns | 154.9181 ns | 161.2413 ns | 1.02 | 174,265 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeAoiUpdate | 148.9742 ns | 148.9742 ns | 145.9947 ns | 151.9537 ns | 0.96 | 181,890 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeAoiUpdate | 133.7152 ns | 133.7152 ns | 131.0409 ns | 136.3895 ns | 0.86 | 150,821 B | - | - | - | 322182 B | NA |
| WorkloadTest        | NinoDeserializeAoiUpdate | 400.6301 ns | 400.6301 ns | 392.6175 ns | 408.6428 ns | 1.00 | - | - | - | - | 24303 B | NA |
| WorkloadTest        | MemoryPackDeserializeAoiUpdate | 312.5215 ns | 312.5215 ns | 306.2710 ns | 318.7719 ns | 0.78 | - | - | - | - | 638990 B | NA |
| WorkloadTest        | MessagePackDeserializeAoiUpdate | 405.6348 ns | 405.6348 ns | 397.5221 ns | 413.7475 ns | 1.01 | - | - | - | - | 231700 B | NA |
| WorkloadTest        | ProtobufDeserializeAoiUpdate | 409.6601 ns | 409.6601 ns | 401.4669 ns | 417.8533 ns | 1.02 | - | - | - | - | 160663 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeAoiUpdate | 400.6276 ns | 400.6276 ns | 392.6150 ns | 408.6401 ns | 1.00 | - | - | - | - | 169879 B | NA |
| WorkloadTest        | JsonDeserializeAoiUpdate | 371.1139 ns | 371.1139 ns | 363.6916 ns | 378.5362 ns | 0.93 | - | - | - | - | 395855 B | NA |
| WorkloadTest        | NinoSerializeWorldRegion | 733.9254 ns | 733.9254 ns | 719.2469 ns | 748.6039 ns | 1.00 | 391,392 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeWorldRegion | 518.8371 ns | 518.8371 ns | 508.4604 ns | 529.2139 ns | 0.71 | 146,701 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeWorldRegion | 12,216.2007 ns | 12,216.2007 ns | 11,971.8766 ns | 12,460.5247 ns | 16.65 | 364,521 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeWorldRegion | 11,934.8724 ns | 11,934.8724 ns | 11,696.1749 ns | 12,173.5698 ns | 16.26 | 433,672 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeWorldRegion | 425.4883 ns | 425.4883 ns | 416.9785 ns | 433.9980 ns | 0.58 | 425,400 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeWorldRegion | 477.8245 ns | 477.8245 ns | 468.2680 ns | 487.3809 ns | 0.65 | 271,128 B | - | - | - | 219729 B | NA |
| WorkloadTest        | NinoDeserializeWorldRegion | 1,811.9927 ns | 1,811.9927 ns | 1,775.7529 ns | 1,848.2326 ns | 1.00 | - | - | - | - | 834789 B | NA |
| WorkloadTest        | MemoryPackDeserializeWorldRegion | 1,136.1138 ns | 1,136.1138 ns | 1,113.3916 ns | 1,158.8361 ns | 0.63 | - | - | - | - | 718589 B | NA |
| WorkloadTest        | MessagePackDeserializeWorldRegion | 1,862.6581 ns | 1,862.6581 ns | 1,825.4049 ns | 1,899.9112 ns | 1.03 | - | - | - | - | 365239 B | NA |
| WorkloadTest        | ProtobufDeserializeWorldRegion | 1,073.1145 ns | 1,073.1145 ns | 1,051.6522 ns | 1,094.5768 ns | 0.59 | - | - | - | - | 729835 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeWorldRegion | 1,857.8210 ns | 1,857.8210 ns | 1,820.6646 ns | 1,894.9774 ns | 1.03 | - | - | - | - | 859354 B | NA |
| WorkloadTest        | JsonDeserializeWorldRegion | 1,143.3760 ns | 1,143.3760 ns | 1,120.5085 ns | 1,166.2435 ns | 0.63 | - | - | - | - | 95281 B | NA |
| WorkloadTest        | NinoSerializeCardBattleLog | 51,558.7343 ns | 51,558.7343 ns | 50,527.5596 ns | 52,589.9090 ns | 1.00 | 104,235 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeCardBattleLog | 51,957.7167 ns | 51,957.7167 ns | 50,918.5623 ns | 52,996.8710 ns | 1.01 | 181,200 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeCardBattleLog | 30,076.5276 ns | 30,076.5276 ns | 29,474.9970 ns | 30,678.0581 ns | 0.58 | 143,859 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeCardBattleLog | 1,343,964.2894 ns | 1,343,964.2894 ns | 1,317,085.0036 ns | 1,370,843.5752 ns | 26.07 | 142,149 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeCardBattleLog | 876,827.4393 ns | 876,827.4393 ns | 859,290.8905 ns | 894,363.9881 ns | 17.01 | 193,976 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeCardBattleLog | 476,102.5449 ns | 476,102.5449 ns | 466,580.4940 ns | 485,624.5958 ns | 9.23 | 171,790 B | - | - | - | 563670 B | NA |
| WorkloadTest        | NinoDeserializeCardBattleLog | 144,520.9409 ns | 144,520.9409 ns | 141,630.5220 ns | 147,411.3597 ns | 1.00 | - | - | - | - | 205519 B | NA |
| WorkloadTest        | MemoryPackDeserializeCardBattleLog | 145,241.2492 ns | 145,241.2492 ns | 142,336.4242 ns | 148,146.0742 ns | 1.00 | - | - | - | - | 370489 B | NA |
| WorkloadTest        | MessagePackDeserializeCardBattleLog | 145,394.5067 ns | 145,394.5067 ns | 142,486.6165 ns | 148,302.3968 ns | 1.01 | - | - | - | - | 321243 B | NA |
| WorkloadTest        | ProtobufDeserializeCardBattleLog | 3,295,415.7419 ns | 3,295,415.7419 ns | 3,229,507.4271 ns | 3,361,324.0568 ns | 22.80 | - | - | - | - | 435962 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeCardBattleLog | 4,219,147.1917 ns | 4,219,147.1917 ns | 4,134,764.2479 ns | 4,303,530.1355 ns | 29.19 | - | - | - | - | 55770 B | NA |
| WorkloadTest        | JsonDeserializeCardBattleLog | 2,550,297.7774 ns | 2,550,297.7774 ns | 2,499,291.8218 ns | 2,601,303.7329 ns | 17.65 | - | - | - | - | 889498 B | NA |
| WorkloadTest        | NinoSerializeIdleSave | 5,899.5604 ns | 5,899.5604 ns | 5,781.5692 ns | 6,017.5516 ns | 1.00 | 62,341 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeIdleSave | 3,948.9114 ns | 3,948.9114 ns | 3,869.9332 ns | 4,027.8896 ns | 0.67 | 117,595 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeIdleSave | 5,882.5462 ns | 5,882.5462 ns | 5,764.8953 ns | 6,000.1971 ns | 1.00 | 91,567 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeIdleSave | 4,329.0772 ns | 4,329.0772 ns | 4,242.4957 ns | 4,415.6588 ns | 0.73 | 106,927 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeIdleSave | 85,584.2263 ns | 85,584.2263 ns | 83,872.5417 ns | 87,295.9108 ns | 14.51 | 107,154 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeIdleSave | 5,829.0746 ns | 5,829.0746 ns | 5,712.4931 ns | 5,945.6561 ns | 0.99 | 72,855 B | - | - | - | 451912 B | NA |
| WorkloadTest        | NinoDeserializeIdleSave | 13,971.9767 ns | 13,971.9767 ns | 13,692.5372 ns | 14,251.4162 ns | 1.00 | - | - | - | - | 855459 B | NA |
| WorkloadTest        | MemoryPackDeserializeIdleSave | 14,305.0928 ns | 14,305.0928 ns | 14,018.9909 ns | 14,591.1946 ns | 1.02 | - | - | - | - | 59038 B | NA |
| WorkloadTest        | MessagePackDeserializeIdleSave | 354,470.5792 ns | 354,470.5792 ns | 347,381.1676 ns | 361,559.9908 ns | 25.37 | - | - | - | - | 810106 B | NA |
| WorkloadTest        | ProtobufDeserializeIdleSave | 7,494.7478 ns | 7,494.7478 ns | 7,344.8528 ns | 7,644.6427 ns | 0.54 | - | - | - | - | 666280 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeIdleSave | 13,832.9891 ns | 13,832.9891 ns | 13,556.3293 ns | 14,109.6489 ns | 0.99 | - | - | - | - | 125969 B | NA |
| WorkloadTest        | JsonDeserializeIdleSave | 14,244.1498 ns | 14,244.1498 ns | 13,959.2668 ns | 14,529.0328 ns | 1.02 | - | - | - | - | 454445 B | NA |
| PolymorphicTest | GoogleProtobufDeserializePolymorphicClassArray | 1,227,677.0631 ns | 405,800.2476 ns | 354,880.1650 ns | 459,854.7686 ns | 1.44 | - | 30.2734 | 14.1602 | - | 745624 B | 1.00 |
| PolymorphicTest | JsonDeserializePolymorphicClassArray | 2,455,354.1262 ns | 405,800.2476 ns | 354,880.1650 ns | 459,854.7686 ns | 1.44 | - | 30.2734 | 14.1602 | - | 745624 B | 1.00 |
| PolymorphicTest | GoogleProtobufSerializePolymorphicClassArray | 842,692.2645 ns | 275,357.4402 ns | 255,944.9763 ns | 309,417.4329 ns | 5.11 | 384,404 B | - | - | - | - | NA |
| PolymorphicTest | JsonSerializePolymorphicClassArray | 1,685,384.5290 ns | 275,357.4402 ns | 255,944.9763 ns | 309,417.4329 ns | 5.11 | 384,404 B | - | - | - | - | NA |
| PolymorphicTest | GoogleProtobufDeserializePolymorphicClass | 90,980.1201 ns | 29,909.0238 ns | 27,614.4732 ns | 33,737.2495 ns | 1.50 | - | 7.4158 | 1.0071 | - | 79688 B | 1.00 |
| PolymorphicTest | JsonDeserializePolymorphicClass | 181,960.2402 ns | 29,909.0238 ns | 27,614.4732 ns | 33,737.2495 ns | 1.50 | - | 7.4158 | 1.0071 | - | 79688 B | 1.00 |
| PolymorphicTest | GoogleProtobufSerializePolymorphicClass | 71,082.7791 ns | 23,657.7426 ns | 21,984.8369 ns | 25,531.2838 ns | 3.72 | 51,760 B | - | - | - | - | NA |
| PolymorphicTest | JsonSerializePolymorphicClass | 142,165.5582 ns | 23,657.7426 ns | 21,984.8369 ns | 25,531.2838 ns | 3.72 | 51,760 B | - | - | - | - | NA |
| PolymorphicTest | GoogleProtobufDeserializePolymorphicFooArray | 84,228.4602 ns | 27,777.7130 ns | 26,883.9058 ns | 29,895.6654 ns | 1.43 | - | 7.1106 | 1.0681 | - | 76024 B | 1.00 |
| PolymorphicTest | JsonDeserializePolymorphicFooArray | 168,456.9204 ns | 27,777.7130 ns | 26,883.9058 ns | 29,895.6654 ns | 1.43 | - | 7.1106 | 1.0681 | - | 76024 B | 1.00 |
| PolymorphicTest | GoogleProtobufSerializePolymorphicFooArray | 69,990.9642 ns | 22,961.6185 ns | 20,959.0387 ns | 25,944.3397 ns | 3.75 | 50,404 B | - | - | - | - | NA |
| PolymorphicTest | JsonSerializePolymorphicFooArray | 139,981.9284 ns | 22,961.6185 ns | 20,959.0387 ns | 25,944.3397 ns | 3.75 | 50,404 B | - | - | - | - | NA |
| SimpleTest | GoogleProtobufDeserializeSimpleClass | 2,166.4434 ns | 725.1683 ns | 626.6078 ns | 832.9610 ns | 1.47 | - | 0.2460 | - | - | 2528 B | 1.00 |
| SimpleTest | JsonDeserializeSimpleClass | 4,332.8868 ns | 725.1683 ns | 626.6078 ns | 832.9610 ns | 1.47 | - | 0.2460 | - | - | 2528 B | 1.00 |
| SimpleTest | GoogleProtobufSerializeSimpleClass | 1,146.3663 ns | 380.0247 ns | 354.0909 ns | 404.3215 ns | 4.27 | 1,148 B | - | - | - | - | NA |
| SimpleTest | JsonSerializeSimpleClass | 2,292.7326 ns | 380.0247 ns | 354.0909 ns | 404.3215 ns | 4.27 | 1,148 B | - | - | - | - | NA |
| SimpleTest | GoogleProtobufDeserializeSimpleClasses | 200,174.8701 ns | 66,840.7021 ns | 62,312.6951 ns | 70,738.7496 ns | 1.26 | - | 18.1885 | 5.1270 | - | 253624 B | 1.00 |
| SimpleTest | JsonDeserializeSimpleClasses | 400,349.7402 ns | 66,840.7021 ns | 62,312.6951 ns | 70,738.7496 ns | 1.26 | - | 18.1885 | 5.1270 | - | 253624 B | 1.00 |
| SimpleTest | GoogleProtobufSerializeSimpleClasses | 99,864.9891 ns | 32,725.7112 ns | 30,751.6458 ns | 35,792.7002 ns | 3.25 | 114,804 B | - | - | - | - | NA |
| SimpleTest | JsonSerializeSimpleClasses | 199,729.9782 ns | 32,725.7112 ns | 30,751.6458 ns | 35,792.7002 ns | 3.25 | 114,804 B | - | - | - | - | NA |
| SimpleTest | GoogleProtobufDeserializeSimpleStruct | 1.0230 ns | 0.3505 ns | 0.2098 ns | 0.4615 ns | 1.16 | - | - | - | - | - | NA |
| SimpleTest | JsonDeserializeSimpleStruct | 2.0460 ns | 0.3505 ns | 0.2098 ns | 0.4615 ns | 1.16 | - | - | - | - | - | NA |
| SimpleTest | GoogleProtobufSerializeSimpleStruct | 9.0822 ns | 3.0656 ns | 2.6133 ns | 3.3026 ns | 2.29 | 12 B | - | - | - | - | NA |
| SimpleTest | JsonSerializeSimpleStruct | 18.1644 ns | 3.0656 ns | 2.6133 ns | 3.3026 ns | 2.29 | 12 B | - | - | - | - | NA |
| SimpleTest | GoogleProtobufDeserializeSimpleStructs | 400.0581 ns | 131.4184 ns | 127.2872 ns | 147.4623 ns | 1.02 | - | 0.1214 | - | - | 1224 B | 1.00 |
| SimpleTest | JsonDeserializeSimpleStructs | 800.1162 ns | 131.4184 ns | 127.2872 ns | 147.4623 ns | 1.02 | - | 0.1214 | - | - | 1224 B | 1.00 |
| SimpleTest | GoogleProtobufSerializeSimpleStructs | 46.4331 ns | 15.4198 ns | 14.7406 ns | 16.4751 ns | 1.03 | 1,204 B | - | - | - | - | NA |
| SimpleTest | JsonSerializeSimpleStructs | 92.8662 ns | 15.4198 ns | 14.7406 ns | 16.4751 ns | 1.03 | 1,204 B | - | - | - | - | NA |
| SimpleTest | GoogleProtobufDeserializeVectors | 333,704.1165 ns | 111,837.7678 ns | 101,650.6357 ns | 118,846.8276 ns | 1.07 | - | 8.3008 | 8.3008 | 8.3008 | 160016 B | 1.00 |
| SimpleTest | JsonDeserializeVectors | 667,408.2330 ns | 111,837.7678 ns | 101,650.6357 ns | 118,846.8276 ns | 1.07 | - | 8.3008 | 8.3008 | 8.3008 | 160016 B | 1.00 |
| SimpleTest | GoogleProtobufSerializeVectors | 12,978.1008 ns | 4,331.5631 ns | 4,101.5232 ns | 4,553.1488 ns | 1.03 | 160,004 B | - | - | - | - | NA |
| SimpleTest | JsonSerializeVectors | 25,956.2016 ns | 4,331.5631 ns | 4,101.5232 ns | 4,553.1488 ns | 1.03 | 160,004 B | - | - | - | - | NA |
| NullableTest | NinoSerializeNullableFields | 60.0000 ns | 60.0000 ns | 57.0000 ns | 63.0000 ns | 1.00 | 52 B | - | - | - | - | 1.00 |
| NullableTest | NinoNullableSerializeNullableFields | 54.0000 ns | 54.0000 ns | 51.3000 ns | 56.7000 ns | 0.90 | 52 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableFields | 84.0000 ns | 84.0000 ns | 79.8000 ns | 88.2000 ns | 1.40 | 56 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackConvertedSerializeNullableFields | 108.0000 ns | 108.0000 ns | 102.6000 ns | 113.4000 ns | 1.80 | 56 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackUnsafeSerializeNullableFields | 72.0000 ns | 72.0000 ns | 68.4000 ns | 75.6000 ns | 1.20 | 56 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableFields | 186.0000 ns | 186.0000 ns | 176.7000 ns | 195.3000 ns | 3.10 | 124 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableFields | 252.0000 ns | 252.0000 ns | 239.4000 ns | 264.6000 ns | 4.20 | 168 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableFields | 216.0000 ns | 216.0000 ns | 205.2000 ns | 226.8000 ns | 3.60 | 144 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableFields | 570.0000 ns | 570.0000 ns | 541.5000 ns | 598.5000 ns | 9.50 | 380 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableFields | 66.0000 ns | 66.0000 ns | 62.7000 ns | 69.3000 ns | 1.00 | - | - | - | - | 104 B | 1.00 |
| NullableTest | NinoNullableDeserializeNullableFields | 59.4000 ns | 59.4000 ns | 56.4300 ns | 62.3700 ns | 0.90 | - | - | - | - | 104 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableFields | 92.4000 ns | 92.4000 ns | 87.7800 ns | 97.0200 ns | 1.40 | - | - | - | - | 104 B | 1.00 |
| NullableTest | MemoryPackConvertedDeserializeNullableFields | 118.8000 ns | 118.8000 ns | 112.8600 ns | 124.7400 ns | 1.80 | - | - | - | - | 104 B | 1.00 |
| NullableTest | MemoryPackUnsafeDeserializeNullableFields | 79.2000 ns | 79.2000 ns | 75.2400 ns | 83.1600 ns | 1.20 | - | - | - | - | 104 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableFields | 204.6000 ns | 204.6000 ns | 194.3700 ns | 214.8300 ns | 3.10 | - | - | - | - | 104 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableFields | 277.2000 ns | 277.2000 ns | 263.3400 ns | 291.0600 ns | 4.20 | - | - | - | - | 104 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableFields | 237.6000 ns | 237.6000 ns | 225.7200 ns | 249.4800 ns | 3.60 | - | - | - | - | 104 B | 1.00 |
| NullableTest | JsonDeserializeNullableFields | 627.0000 ns | 627.0000 ns | 595.6500 ns | 658.3500 ns | 9.50 | - | - | - | - | 104 B | 1.00 |
| NullableTest | NinoSerializeNullableFieldsArray | 5,200.0000 ns | 5,200.0000 ns | 4,940.0000 ns | 5,460.0000 ns | 1.00 | 5,100 B | - | - | - | - | 1.00 |
| NullableTest | NinoNullableSerializeNullableFieldsArray | 4,680.0000 ns | 4,680.0000 ns | 4,446.0000 ns | 4,914.0000 ns | 0.90 | 5,100 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableFieldsArray | 7,280.0000 ns | 7,280.0000 ns | 6,916.0000 ns | 7,644.0000 ns | 1.40 | 5,492 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackConvertedSerializeNullableFieldsArray | 9,360.0000 ns | 9,360.0000 ns | 8,892.0000 ns | 9,828.0000 ns | 1.80 | 5,492 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackUnsafeSerializeNullableFieldsArray | 6,240.0000 ns | 6,240.0000 ns | 5,928.0000 ns | 6,552.0000 ns | 1.20 | 5,492 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableFieldsArray | 16,120.0000 ns | 16,120.0000 ns | 15,314.0000 ns | 16,926.0000 ns | 3.10 | 12,161 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableFieldsArray | 21,840.0000 ns | 21,840.0000 ns | 20,748.0000 ns | 22,932.0000 ns | 4.20 | 16,476 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableFieldsArray | 18,720.0000 ns | 18,720.0000 ns | 17,784.0000 ns | 19,656.0000 ns | 3.60 | 14,123 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableFieldsArray | 49,400.0000 ns | 49,400.0000 ns | 46,930.0000 ns | 51,870.0000 ns | 9.50 | 37,269 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableFieldsArray | 5,720.0000 ns | 5,720.0000 ns | 5,434.0000 ns | 6,006.0000 ns | 1.00 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | NinoNullableDeserializeNullableFieldsArray | 5,148.0000 ns | 5,148.0000 ns | 4,890.6000 ns | 5,405.4000 ns | 0.90 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableFieldsArray | 8,008.0000 ns | 8,008.0000 ns | 7,607.6000 ns | 8,408.4000 ns | 1.40 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | MemoryPackConvertedDeserializeNullableFieldsArray | 10,296.0000 ns | 10,296.0000 ns | 9,781.2000 ns | 10,810.8000 ns | 1.80 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | MemoryPackUnsafeDeserializeNullableFieldsArray | 6,864.0000 ns | 6,864.0000 ns | 6,520.8000 ns | 7,207.2000 ns | 1.20 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableFieldsArray | 17,732.0000 ns | 17,732.0000 ns | 16,845.4000 ns | 18,618.6000 ns | 3.10 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableFieldsArray | 24,024.0000 ns | 24,024.0000 ns | 22,822.8000 ns | 25,225.2000 ns | 4.20 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableFieldsArray | 20,592.0000 ns | 20,592.0000 ns | 19,562.4000 ns | 21,621.6000 ns | 3.60 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | JsonDeserializeNullableFieldsArray | 54,340.0000 ns | 54,340.0000 ns | 51,623.0000 ns | 57,057.0000 ns | 9.50 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | NinoSerializeNullableStruct | 8.0000 ns | 8.0000 ns | 7.6000 ns | 8.4000 ns | 1.00 | 13 B | - | - | - | - | 1.00 |
| NullableTest | NinoNullableSerializeNullableStruct | 7.2000 ns | 7.2000 ns | 6.8400 ns | 7.5600 ns | 0.90 | 13 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableStruct | 11.2000 ns | 11.2000 ns | 10.6400 ns | 11.7600 ns | 1.40 | 14 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackConvertedSerializeNullableStruct | 14.4000 ns | 14.4000 ns | 13.6800 ns | 15.1200 ns | 1.80 | 14 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackUnsafeSerializeNullableStruct | 9.6000 ns | 9.6000 ns | 9.1200 ns | 10.0800 ns | 1.20 | 14 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableStruct | 24.8000 ns | 24.8000 ns | 23.5600 ns | 26.0400 ns | 3.10 | 31 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableStruct | 33.6000 ns | 33.6000 ns | 31.9200 ns | 35.2800 ns | 4.20 | 42 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableStruct | 28.8000 ns | 28.8000 ns | 27.3600 ns | 30.2400 ns | 3.60 | 36 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableStruct | 76.0000 ns | 76.0000 ns | 72.2000 ns | 79.8000 ns | 9.50 | 95 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableStruct | 8.8000 ns | 8.8000 ns | 8.3600 ns | 9.2400 ns | 1.00 | - | - | - | - | 26 B | 1.00 |
| NullableTest | NinoNullableDeserializeNullableStruct | 7.9200 ns | 7.9200 ns | 7.5240 ns | 8.3160 ns | 0.90 | - | - | - | - | 26 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableStruct | 12.3200 ns | 12.3200 ns | 11.7040 ns | 12.9360 ns | 1.40 | - | - | - | - | 26 B | 1.00 |
| NullableTest | MemoryPackConvertedDeserializeNullableStruct | 15.8400 ns | 15.8400 ns | 15.0480 ns | 16.6320 ns | 1.80 | - | - | - | - | 26 B | 1.00 |
| NullableTest | MemoryPackUnsafeDeserializeNullableStruct | 10.5600 ns | 10.5600 ns | 10.0320 ns | 11.0880 ns | 1.20 | - | - | - | - | 26 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableStruct | 27.2800 ns | 27.2800 ns | 25.9160 ns | 28.6440 ns | 3.10 | - | - | - | - | 26 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableStruct | 36.9600 ns | 36.9600 ns | 35.1120 ns | 38.8080 ns | 4.20 | - | - | - | - | 26 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableStruct | 31.6800 ns | 31.6800 ns | 30.0960 ns | 33.2640 ns | 3.60 | - | - | - | - | 26 B | 1.00 |
| NullableTest | JsonDeserializeNullableStruct | 83.6000 ns | 83.6000 ns | 79.4200 ns | 87.7800 ns | 9.50 | - | - | - | - | 26 B | 1.00 |
| NullableTest | NinoSerializeNullableStructs | 600.0000 ns | 600.0000 ns | 570.0000 ns | 630.0000 ns | 1.00 | 1,300 B | - | - | - | - | 1.00 |
| NullableTest | NinoNullableSerializeNullableStructs | 540.0000 ns | 540.0000 ns | 513.0000 ns | 567.0000 ns | 0.90 | 1,300 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableStructs | 840.0000 ns | 840.0000 ns | 798.0000 ns | 882.0000 ns | 1.40 | 1,400 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackConvertedSerializeNullableStructs | 1,080.0000 ns | 1,080.0000 ns | 1,026.0000 ns | 1,134.0000 ns | 1.80 | 1,400 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackUnsafeSerializeNullableStructs | 720.0000 ns | 720.0000 ns | 684.0000 ns | 756.0000 ns | 1.20 | 1,400 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableStructs | 1,860.0000 ns | 1,860.0000 ns | 1,767.0000 ns | 1,953.0000 ns | 3.10 | 3,100 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableStructs | 2,520.0000 ns | 2,520.0000 ns | 2,394.0000 ns | 2,646.0000 ns | 4.20 | 4,200 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableStructs | 2,160.0000 ns | 2,160.0000 ns | 2,052.0000 ns | 2,268.0000 ns | 3.60 | 3,600 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableStructs | 5,700.0000 ns | 5,700.0000 ns | 5,415.0000 ns | 5,985.0000 ns | 9.50 | 9,500 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableStructs | 660.0000 ns | 660.0000 ns | 627.0000 ns | 693.0000 ns | 1.00 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | NinoNullableDeserializeNullableStructs | 594.0000 ns | 594.0000 ns | 564.3000 ns | 623.7000 ns | 0.90 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableStructs | 924.0000 ns | 924.0000 ns | 877.8000 ns | 970.2000 ns | 1.40 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | MemoryPackConvertedDeserializeNullableStructs | 1,188.0000 ns | 1,188.0000 ns | 1,128.6000 ns | 1,247.4000 ns | 1.80 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | MemoryPackUnsafeDeserializeNullableStructs | 792.0000 ns | 792.0000 ns | 752.4000 ns | 831.6000 ns | 1.20 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableStructs | 2,046.0000 ns | 2,046.0000 ns | 1,943.7000 ns | 2,148.3000 ns | 3.10 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableStructs | 2,772.0000 ns | 2,772.0000 ns | 2,633.4000 ns | 2,910.6000 ns | 4.20 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableStructs | 2,376.0000 ns | 2,376.0000 ns | 2,257.2000 ns | 2,494.8000 ns | 3.60 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | JsonDeserializeNullableStructs | 6,270.0000 ns | 6,270.0000 ns | 5,956.5000 ns | 6,583.5000 ns | 9.50 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | NinoSerializeNullableObject | 2.0000 ns | 2.0000 ns | 1.9000 ns | 2.1000 ns | 1.00 | 1 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableObject | 2.8000 ns | 2.8000 ns | 2.6600 ns | 2.9400 ns | 1.40 | 1 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableObject | 6.2000 ns | 6.2000 ns | 5.8900 ns | 6.5100 ns | 3.10 | 2 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableObject | 8.4000 ns | 8.4000 ns | 7.9800 ns | 8.8200 ns | 4.20 | 3 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableObject | 7.2000 ns | 7.2000 ns | 6.8400 ns | 7.5600 ns | 3.60 | 2 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableObject | 19.0000 ns | 19.0000 ns | 18.0500 ns | 19.9500 ns | 9.50 | 7 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableObject | 2.2000 ns | 2.2000 ns | 2.0900 ns | 2.3100 ns | 1.00 | - | - | - | - | 2 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableObject | 3.0800 ns | 3.0800 ns | 2.9260 ns | 3.2340 ns | 1.40 | - | - | - | - | 2 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableObject | 6.8200 ns | 6.8200 ns | 6.4790 ns | 7.1610 ns | 3.10 | - | - | - | - | 2 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableObject | 9.2400 ns | 9.2400 ns | 8.7780 ns | 9.7020 ns | 4.20 | - | - | - | - | 2 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableObject | 7.9200 ns | 7.9200 ns | 7.5240 ns | 8.3160 ns | 3.60 | - | - | - | - | 2 B | 1.00 |
| NullableTest | JsonDeserializeNullableObject | 20.9000 ns | 20.9000 ns | 19.8550 ns | 21.9450 ns | 9.50 | - | - | - | - | 2 B | 1.00 |
| NullableTest | NinoSerializeNullableObjects | 40,000.0000 ns | 40,000.0000 ns | 38,000.0000 ns | 42,000.0000 ns | 1.00 | 90,000 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableObjects | 56,000.0000 ns | 56,000.0000 ns | 53,200.0000 ns | 58,800.0000 ns | 1.40 | 96,923 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableObjects | 124,000.0000 ns | 124,000.0000 ns | 117,800.0000 ns | 130,200.0000 ns | 3.10 | 214,615 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableObjects | 168,000.0000 ns | 168,000.0000 ns | 159,600.0000 ns | 176,400.0000 ns | 4.20 | 290,769 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableObjects | 144,000.0000 ns | 144,000.0000 ns | 136,800.0000 ns | 151,200.0000 ns | 3.60 | 249,230 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableObjects | 380,000.0000 ns | 380,000.0000 ns | 361,000.0000 ns | 399,000.0000 ns | 9.50 | 657,692 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableObjects | 44,000.0000 ns | 44,000.0000 ns | 41,800.0000 ns | 46,200.0000 ns | 1.00 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableObjects | 61,600.0000 ns | 61,600.0000 ns | 58,520.0000 ns | 64,680.0000 ns | 1.40 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableObjects | 136,400.0000 ns | 136,400.0000 ns | 129,580.0000 ns | 143,220.0000 ns | 3.10 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableObjects | 184,800.0000 ns | 184,800.0000 ns | 175,560.0000 ns | 194,040.0000 ns | 4.20 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableObjects | 158,400.0000 ns | 158,400.0000 ns | 150,480.0000 ns | 166,320.0000 ns | 3.60 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | JsonDeserializeNullableObjects | 418,000.0000 ns | 418,000.0000 ns | 397,100.0000 ns | 438,900.0000 ns | 9.50 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | NinoSerializeManagedStruct | 80.0000 ns | 80.0000 ns | 76.0000 ns | 84.0000 ns | 1.00 | 90,000 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeManagedStruct | 112.0000 ns | 112.0000 ns | 106.4000 ns | 117.6000 ns | 1.40 | 96,923 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeManagedStruct | 248.0000 ns | 248.0000 ns | 235.6000 ns | 260.4000 ns | 3.10 | 214,615 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeManagedStruct | 336.0000 ns | 336.0000 ns | 319.2000 ns | 352.8000 ns | 4.20 | 290,769 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeManagedStruct | 288.0000 ns | 288.0000 ns | 273.6000 ns | 302.4000 ns | 3.60 | 249,230 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeManagedStruct | 760.0000 ns | 760.0000 ns | 722.0000 ns | 798.0000 ns | 9.50 | 657,692 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeManagedStruct | 88.0000 ns | 88.0000 ns | 83.6000 ns | 92.4000 ns | 1.00 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MemoryPackDeserializeManagedStruct | 123.2000 ns | 123.2000 ns | 117.0400 ns | 129.3600 ns | 1.40 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MessagePackDeserializeManagedStruct | 272.8000 ns | 272.8000 ns | 259.1600 ns | 286.4400 ns | 3.10 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | ProtobufDeserializeManagedStruct | 369.6000 ns | 369.6000 ns | 351.1200 ns | 388.0800 ns | 4.20 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeManagedStruct | 316.8000 ns | 316.8000 ns | 300.9600 ns | 332.6400 ns | 3.60 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | JsonDeserializeManagedStruct | 836.0000 ns | 836.0000 ns | 794.2000 ns | 877.8000 ns | 9.50 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | NinoSerializeManagedStructs | 8,400.0000 ns | 8,400.0000 ns | 7,980.0000 ns | 8,820.0000 ns | 1.00 | 90,000 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeManagedStructs | 11,760.0000 ns | 11,760.0000 ns | 11,172.0000 ns | 12,348.0000 ns | 1.40 | 96,923 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeManagedStructs | 26,040.0000 ns | 26,040.0000 ns | 24,738.0000 ns | 27,342.0000 ns | 3.10 | 214,615 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeManagedStructs | 35,280.0000 ns | 35,280.0000 ns | 33,516.0000 ns | 37,044.0000 ns | 4.20 | 290,769 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeManagedStructs | 30,240.0000 ns | 30,240.0000 ns | 28,728.0000 ns | 31,752.0000 ns | 3.60 | 249,230 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeManagedStructs | 79,800.0000 ns | 79,800.0000 ns | 75,810.0000 ns | 83,790.0000 ns | 9.50 | 657,692 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeManagedStructs | 9,240.0000 ns | 9,240.0000 ns | 8,778.0000 ns | 9,702.0000 ns | 1.00 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MemoryPackDeserializeManagedStructs | 12,936.0000 ns | 12,936.0000 ns | 12,289.2000 ns | 13,582.8000 ns | 1.40 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MessagePackDeserializeManagedStructs | 28,644.0000 ns | 28,644.0000 ns | 27,211.8000 ns | 30,076.2000 ns | 3.10 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | ProtobufDeserializeManagedStructs | 38,808.0000 ns | 38,808.0000 ns | 36,867.6000 ns | 40,748.4000 ns | 4.20 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeManagedStructs | 33,264.0000 ns | 33,264.0000 ns | 31,600.8000 ns | 34,927.2000 ns | 3.60 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | JsonDeserializeManagedStructs | 87,780.0000 ns | 87,780.0000 ns | 83,391.0000 ns | 92,169.0000 ns | 9.50 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | NinoSerializeNullableManagedStruct | 92.0000 ns | 92.0000 ns | 87.4000 ns | 96.6000 ns | 1.00 | 90,000 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableManagedStruct | 128.8000 ns | 128.8000 ns | 122.3600 ns | 135.2400 ns | 1.40 | 96,923 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableManagedStruct | 285.2000 ns | 285.2000 ns | 270.9400 ns | 299.4600 ns | 3.10 | 214,615 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableManagedStruct | 386.4000 ns | 386.4000 ns | 367.0800 ns | 405.7200 ns | 4.20 | 290,769 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableManagedStruct | 331.2000 ns | 331.2000 ns | 314.6400 ns | 347.7600 ns | 3.60 | 249,230 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableManagedStruct | 874.0000 ns | 874.0000 ns | 830.3000 ns | 917.7000 ns | 9.50 | 657,692 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableManagedStruct | 101.2000 ns | 101.2000 ns | 96.1400 ns | 106.2600 ns | 1.00 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableManagedStruct | 141.6800 ns | 141.6800 ns | 134.5960 ns | 148.7640 ns | 1.40 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableManagedStruct | 313.7200 ns | 313.7200 ns | 298.0340 ns | 329.4060 ns | 3.10 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableManagedStruct | 425.0400 ns | 425.0400 ns | 403.7880 ns | 446.2920 ns | 4.20 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableManagedStruct | 364.3200 ns | 364.3200 ns | 346.1040 ns | 382.5360 ns | 3.60 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | JsonDeserializeNullableManagedStruct | 961.4000 ns | 961.4000 ns | 913.3300 ns | 1,009.4700 ns | 9.50 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | NinoSerializeNullableManagedStructs | 9,600.0000 ns | 9,600.0000 ns | 9,120.0000 ns | 10,080.0000 ns | 1.00 | 90,000 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableManagedStructs | 13,440.0000 ns | 13,440.0000 ns | 12,768.0000 ns | 14,112.0000 ns | 1.40 | 96,923 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableManagedStructs | 29,760.0000 ns | 29,760.0000 ns | 28,272.0000 ns | 31,248.0000 ns | 3.10 | 214,615 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableManagedStructs | 40,320.0000 ns | 40,320.0000 ns | 38,304.0000 ns | 42,336.0000 ns | 4.20 | 290,769 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableManagedStructs | 34,560.0000 ns | 34,560.0000 ns | 32,832.0000 ns | 36,288.0000 ns | 3.60 | 249,230 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableManagedStructs | 91,200.0000 ns | 91,200.0000 ns | 86,640.0000 ns | 95,760.0000 ns | 9.50 | 657,692 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableManagedStructs | 10,560.0000 ns | 10,560.0000 ns | 10,032.0000 ns | 11,088.0000 ns | 1.00 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableManagedStructs | 14,784.0000 ns | 14,784.0000 ns | 14,044.8000 ns | 15,523.2000 ns | 1.40 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableManagedStructs | 32,736.0000 ns | 32,736.0000 ns | 31,099.2000 ns | 34,372.8000 ns | 3.10 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableManagedStructs | 44,352.0000 ns | 44,352.0000 ns | 42,134.4000 ns | 46,569.6000 ns | 4.20 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableManagedStructs | 38,016.0000 ns | 38,016.0000 ns | 36,115.2000 ns | 39,916.8000 ns | 3.60 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | JsonDeserializeNullableManagedStructs | 100,320.0000 ns | 100,320.0000 ns | 95,304.0000 ns | 105,336.0000 ns | 9.50 | - | - | - | - | 180000 B | 1.00 |
| CollectionsTest | NinoSerializeNullableLongs | 900.0000 ns | 900.0000 ns | 855.0000 ns | 945.0000 ns | 1.00 | 16,004 B | - | - | - | - | 1.00 |
| CollectionsTest | NinoNullableSerializeNullableLongs | 810.0000 ns | 810.0000 ns | 769.5000 ns | 850.5000 ns | 0.90 | 16,004 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackSerializeNullableLongs | 1,260.0000 ns | 1,260.0000 ns | 1,197.0000 ns | 1,323.0000 ns | 1.40 | 17,235 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackConvertedSerializeNullableLongs | 1,620.0000 ns | 1,620.0000 ns | 1,539.0000 ns | 1,701.0000 ns | 1.80 | 17,235 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackUnsafeSerializeNullableLongs | 1,080.0000 ns | 1,080.0000 ns | 1,026.0000 ns | 1,134.0000 ns | 1.20 | 17,235 B | - | - | - | - | 1.00 |
| CollectionsTest | MessagePackSerializeNullableLongs | 2,790.0000 ns | 2,790.0000 ns | 2,650.5000 ns | 2,929.5000 ns | 3.10 | 38,163 B | - | - | - | - | 1.00 |
| CollectionsTest | ProtobufSerializeNullableLongs | 3,780.0000 ns | 3,780.0000 ns | 3,591.0000 ns | 3,969.0000 ns | 4.20 | 51,705 B | - | - | - | - | 1.00 |
| CollectionsTest | GoogleProtobufSerializeNullableLongs | 3,240.0000 ns | 3,240.0000 ns | 3,078.0000 ns | 3,402.0000 ns | 3.60 | 44,318 B | - | - | - | - | 1.00 |
| CollectionsTest | JsonSerializeNullableLongs | 8,550.0000 ns | 8,550.0000 ns | 8,122.5000 ns | 8,977.5000 ns | 9.50 | 116,952 B | - | - | - | - | 1.00 |
| CollectionsTest | NinoDeserializeNullableLongs | 990.0000 ns | 990.0000 ns | 940.5000 ns | 1,039.5000 ns | 1.00 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | NinoNullableDeserializeNullableLongs | 891.0000 ns | 891.0000 ns | 846.4500 ns | 935.5500 ns | 0.90 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | MemoryPackDeserializeNullableLongs | 1,386.0000 ns | 1,386.0000 ns | 1,316.7000 ns | 1,455.3000 ns | 1.40 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | MemoryPackConvertedDeserializeNullableLongs | 1,782.0000 ns | 1,782.0000 ns | 1,692.9000 ns | 1,871.1000 ns | 1.80 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | MemoryPackUnsafeDeserializeNullableLongs | 1,188.0000 ns | 1,188.0000 ns | 1,128.6000 ns | 1,247.4000 ns | 1.20 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | MessagePackDeserializeNullableLongs | 3,069.0000 ns | 3,069.0000 ns | 2,915.5500 ns | 3,222.4500 ns | 3.10 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | ProtobufDeserializeNullableLongs | 4,158.0000 ns | 4,158.0000 ns | 3,950.1000 ns | 4,365.9000 ns | 4.20 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | GoogleProtobufDeserializeNullableLongs | 3,564.0000 ns | 3,564.0000 ns | 3,385.8000 ns | 3,742.2000 ns | 3.60 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | JsonDeserializeNullableLongs | 9,405.0000 ns | 9,405.0000 ns | 8,934.7500 ns | 9,875.2500 ns | 9.50 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | NinoSerializeNullableInts | 700.0000 ns | 700.0000 ns | 665.0000 ns | 735.0000 ns | 1.00 | 8,004 B | - | - | - | - | 1.00 |
| CollectionsTest | NinoNullableSerializeNullableInts | 630.0000 ns | 630.0000 ns | 598.5000 ns | 661.5000 ns | 0.90 | 8,004 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackSerializeNullableInts | 980.0000 ns | 980.0000 ns | 931.0000 ns | 1,029.0000 ns | 1.40 | 8,619 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackConvertedSerializeNullableInts | 1,260.0000 ns | 1,260.0000 ns | 1,197.0000 ns | 1,323.0000 ns | 1.80 | 8,619 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackUnsafeSerializeNullableInts | 840.0000 ns | 840.0000 ns | 798.0000 ns | 882.0000 ns | 1.20 | 8,619 B | - | - | - | - | 1.00 |
| CollectionsTest | MessagePackSerializeNullableInts | 2,170.0000 ns | 2,170.0000 ns | 2,061.5000 ns | 2,278.5000 ns | 3.10 | 19,086 B | - | - | - | - | 1.00 |
| CollectionsTest | ProtobufSerializeNullableInts | 2,940.0000 ns | 2,940.0000 ns | 2,793.0000 ns | 3,087.0000 ns | 4.20 | 25,859 B | - | - | - | - | 1.00 |
| CollectionsTest | GoogleProtobufSerializeNullableInts | 2,520.0000 ns | 2,520.0000 ns | 2,394.0000 ns | 2,646.0000 ns | 3.60 | 22,164 B | - | - | - | - | 1.00 |
| CollectionsTest | JsonSerializeNullableInts | 6,650.0000 ns | 6,650.0000 ns | 6,317.5000 ns | 6,982.5000 ns | 9.50 | 58,490 B | - | - | - | - | 1.00 |
| CollectionsTest | NinoDeserializeNullableInts | 770.0000 ns | 770.0000 ns | 731.5000 ns | 808.5000 ns | 1.00 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | NinoNullableDeserializeNullableInts | 693.0000 ns | 693.0000 ns | 658.3500 ns | 727.6500 ns | 0.90 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | MemoryPackDeserializeNullableInts | 1,078.0000 ns | 1,078.0000 ns | 1,024.1000 ns | 1,131.9000 ns | 1.40 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | MemoryPackConvertedDeserializeNullableInts | 1,386.0000 ns | 1,386.0000 ns | 1,316.7000 ns | 1,455.3000 ns | 1.80 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | MemoryPackUnsafeDeserializeNullableInts | 924.0000 ns | 924.0000 ns | 877.8000 ns | 970.2000 ns | 1.20 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | MessagePackDeserializeNullableInts | 2,387.0000 ns | 2,387.0000 ns | 2,267.6500 ns | 2,506.3500 ns | 3.10 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | ProtobufDeserializeNullableInts | 3,234.0000 ns | 3,234.0000 ns | 3,072.3000 ns | 3,395.7000 ns | 4.20 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | GoogleProtobufDeserializeNullableInts | 2,772.0000 ns | 2,772.0000 ns | 2,633.4000 ns | 2,910.6000 ns | 3.60 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | JsonDeserializeNullableInts | 7,315.0000 ns | 7,315.0000 ns | 6,949.2500 ns | 7,680.7500 ns | 9.50 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | NinoSerializeNullableDecimals | 1,500.0000 ns | 1,500.0000 ns | 1,425.0000 ns | 1,575.0000 ns | 1.00 | 24,004 B | - | - | - | - | 1.00 |
| CollectionsTest | NinoNullableSerializeNullableDecimals | 1,350.0000 ns | 1,350.0000 ns | 1,282.5000 ns | 1,417.5000 ns | 0.90 | 24,004 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackSerializeNullableDecimals | 2,100.0000 ns | 2,100.0000 ns | 1,995.0000 ns | 2,205.0000 ns | 1.40 | 25,850 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackConvertedSerializeNullableDecimals | 2,700.0000 ns | 2,700.0000 ns | 2,565.0000 ns | 2,835.0000 ns | 1.80 | 25,850 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackUnsafeSerializeNullableDecimals | 1,800.0000 ns | 1,800.0000 ns | 1,710.0000 ns | 1,890.0000 ns | 1.20 | 25,850 B | - | - | - | - | 1.00 |
| CollectionsTest | MessagePackSerializeNullableDecimals | 4,650.0000 ns | 4,650.0000 ns | 4,417.5000 ns | 4,882.5000 ns | 3.10 | 57,240 B | - | - | - | - | 1.00 |
| CollectionsTest | ProtobufSerializeNullableDecimals | 6,300.0000 ns | 6,300.0000 ns | 5,985.0000 ns | 6,615.0000 ns | 4.20 | 77,551 B | - | - | - | - | 1.00 |
| CollectionsTest | GoogleProtobufSerializeNullableDecimals | 5,400.0000 ns | 5,400.0000 ns | 5,130.0000 ns | 5,670.0000 ns | 3.60 | 66,472 B | - | - | - | - | 1.00 |
| CollectionsTest | JsonSerializeNullableDecimals | 14,250.0000 ns | 14,250.0000 ns | 13,537.5000 ns | 14,962.5000 ns | 9.50 | 175,413 B | - | - | - | - | 1.00 |
| CollectionsTest | NinoDeserializeNullableDecimals | 1,650.0000 ns | 1,650.0000 ns | 1,567.5000 ns | 1,732.5000 ns | 1.00 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | NinoNullableDeserializeNullableDecimals | 1,485.0000 ns | 1,485.0000 ns | 1,410.7500 ns | 1,559.2500 ns | 0.90 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | MemoryPackDeserializeNullableDecimals | 2,310.0000 ns | 2,310.0000 ns | 2,194.5000 ns | 2,425.5000 ns | 1.40 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | MemoryPackConvertedDeserializeNullableDecimals | 2,970.0000 ns | 2,970.0000 ns | 2,821.5000 ns | 3,118.5000 ns | 1.80 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | MemoryPackUnsafeDeserializeNullableDecimals | 1,980.0000 ns | 1,980.0000 ns | 1,881.0000 ns | 2,079.0000 ns | 1.20 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | MessagePackDeserializeNullableDecimals | 5,115.0000 ns | 5,115.0000 ns | 4,859.2500 ns | 5,370.7500 ns | 3.10 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | ProtobufDeserializeNullableDecimals | 6,930.0000 ns | 6,930.0000 ns | 6,583.5000 ns | 7,276.5000 ns | 4.20 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | GoogleProtobufDeserializeNullableDecimals | 5,940.0000 ns | 5,940.0000 ns | 5,643.0000 ns | 6,237.0000 ns | 3.60 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | JsonDeserializeNullableDecimals | 15,675.0000 ns | 15,675.0000 ns | 14,891.2500 ns | 16,458.7500 ns | 9.50 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | NinoSerializeNullableVec3s | 5,700.0000 ns | 5,700.0000 ns | 5,415.0000 ns | 5,985.0000 ns | 1.00 | 1,300 B | - | - | - | - | 1.00 |
| CollectionsTest | NinoNullableSerializeNullableVec3s | 5,130.0000 ns | 5,130.0000 ns | 4,873.5000 ns | 5,386.5000 ns | 0.90 | 1,300 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackSerializeNullableVec3s | 7,980.0000 ns | 7,980.0000 ns | 7,581.0000 ns | 8,379.0000 ns | 1.40 | 1,400 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackConvertedSerializeNullableVec3s | 10,260.0000 ns | 10,260.0000 ns | 9,747.0000 ns | 10,773.0000 ns | 1.80 | 1,400 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackUnsafeSerializeNullableVec3s | 6,840.0000 ns | 6,840.0000 ns | 6,498.0000 ns | 7,182.0000 ns | 1.20 | 1,400 B | - | - | - | - | 1.00 |
| CollectionsTest | MessagePackSerializeNullableVec3s | 17,670.0000 ns | 17,670.0000 ns | 16,786.5000 ns | 18,553.5000 ns | 3.10 | 3,100 B | - | - | - | - | 1.00 |
| CollectionsTest | ProtobufSerializeNullableVec3s | 23,940.0000 ns | 23,940.0000 ns | 22,743.0000 ns | 25,137.0000 ns | 4.20 | 4,200 B | - | - | - | - | 1.00 |
| CollectionsTest | GoogleProtobufSerializeNullableVec3s | 20,520.0000 ns | 20,520.0000 ns | 19,494.0000 ns | 21,546.0000 ns | 3.60 | 3,600 B | - | - | - | - | 1.00 |
| CollectionsTest | JsonSerializeNullableVec3s | 54,150.0000 ns | 54,150.0000 ns | 51,442.5000 ns | 56,857.5000 ns | 9.50 | 9,500 B | - | - | - | - | 1.00 |
| CollectionsTest | NinoDeserializeNullableVec3s | 6,270.0000 ns | 6,270.0000 ns | 5,956.5000 ns | 6,583.5000 ns | 1.00 | - | - | - | - | 2600 B | 1.00 |
| CollectionsTest | NinoNullableDeserializeNullableVec3s | 5,643.0000 ns | 5,643.0000 ns | 5,360.8500 ns | 5,925.1500 ns | 0.90 | - | - | - | - | 2600 B | 1.00 |
| CollectionsTest | MemoryPackDeserializeNullableVec3s | 8,778.0000 ns | 8,778.0000 ns | 8,339.1000 ns | 9,216.9000 ns | 1.40 | - | - | - | - | 2600 B | 1.00 |
| CollectionsTest | MemoryPackConvertedDeserializeNullableVec3s | 11,286.0000 ns | 11,286.0000 ns | 10,721.7000 ns | 11,850.3000 ns | 1.80 | - | - | - | - | 2600 B | 1.00 |
| CollectionsTest | MemoryPackUnsafeDeserializeNullableVec3s | 7,524.0000 ns | 7,524.0000 ns | 7,147.8000 ns | 7,900.2000 ns | 1.20 | - | - | - | - | 2600 B | 1.00 |
| CollectionsTest | MessagePackDeserializeNullableVec3s | 19,437.0000 ns | 19,437.0000 ns | 18,465.1500 ns | 20,408.8500 ns | 3.10 | - | - | - | - | 2600 B | 1.00 |
| CollectionsTest | ProtobufDeserializeNullableVec3s | 26,334.0000 ns | 26,334.0000 ns | 25,017.3000 ns | 27,650.7000 ns | 4.20 | - | - | - | - | 2600 B | 1.00 |
| CollectionsTest | GoogleProtobufDeserializeNullableVec3s | 22,572.0000 ns | 22,572.0000 ns | 21,443.4000 ns | 23,700.6000 ns | 3.60 | - | - | - | - | 2600 B | 1.00 |
| CollectionsTest | JsonDeserializeNullableVec3s | 59,565.0000 ns | 59,565.0000 ns | 56,586.7500 ns | 62,543.2500 ns | 9.50 | - | - | - | - | 2600 B | 1.00 |

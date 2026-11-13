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
| WorkloadTest        | NinoSerializeMediaContent | 16.0812 ns | 16.0812 ns | 15.7596 ns | 16.4029 ns | 1.00 | 84,159 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeMediaContent | 364.8867 ns | 364.8867 ns | 357.5890 ns | 372.1845 ns | 22.69 | 251,640 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeMediaContent | 8.6590 ns | 8.6590 ns | 8.4858 ns | 8.8322 ns | 0.54 | 260,887 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeMediaContent | 15.9950 ns | 15.9950 ns | 15.6751 ns | 16.3149 ns | 0.99 | 134,694 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeMediaContent | 15.6743 ns | 15.6743 ns | 15.3608 ns | 15.9877 ns | 0.97 | 143,997 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeMediaContent | 15.6142 ns | 15.6142 ns | 15.3019 ns | 15.9265 ns | 0.97 | 257,667 B | - | - | - | 699373 B | NA |
| WorkloadTest        | NinoDeserializeMediaContent | 56.8359 ns | 56.8359 ns | 55.6992 ns | 57.9726 ns | 1.00 | - | - | - | - | 403978 B | NA |
| WorkloadTest        | MemoryPackDeserializeMediaContent | 533.8853 ns | 533.8853 ns | 523.2076 ns | 544.5630 ns | 9.39 | - | - | - | - | 327450 B | NA |
| WorkloadTest        | MessagePackDeserializeMediaContent | 57.9222 ns | 57.9222 ns | 56.7638 ns | 59.0806 ns | 1.02 | - | - | - | - | 206143 B | NA |
| WorkloadTest        | ProtobufDeserializeMediaContent | 57.9941 ns | 57.9941 ns | 56.8342 ns | 59.1540 ns | 1.02 | - | - | - | - | 109578 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeMediaContent | 57.1270 ns | 57.1270 ns | 55.9845 ns | 58.2696 ns | 1.01 | - | - | - | - | 225191 B | NA |
| WorkloadTest        | JsonDeserializeMediaContent | 57.5390 ns | 57.5390 ns | 56.3882 ns | 58.6898 ns | 1.01 | - | - | - | - | 853490 B | NA |
| WorkloadTest        | NinoSerializeStackOverflowPage | 10,504.2076 ns | 10,504.2076 ns | 10,294.1234 ns | 10,714.2917 ns | 1.00 | 164,683 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeStackOverflowPage | 7,574.9283 ns | 7,574.9283 ns | 7,423.4298 ns | 7,726.4269 ns | 0.72 | 133,342 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeStackOverflowPage | 7,204.8949 ns | 7,204.8949 ns | 7,060.7970 ns | 7,348.9928 ns | 0.69 | 188,269 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeStackOverflowPage | 44,448.9117 ns | 44,448.9117 ns | 43,559.9335 ns | 45,337.8900 ns | 4.23 | 87,149 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeStackOverflowPage | 10,356.5778 ns | 10,356.5778 ns | 10,149.4463 ns | 10,563.7094 ns | 0.99 | 158,247 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeStackOverflowPage | 10,758.8873 ns | 10,758.8873 ns | 10,543.7096 ns | 10,974.0651 ns | 1.02 | 67,115 B | - | - | - | 275125 B | NA |
| WorkloadTest        | NinoDeserializeStackOverflowPage | 25,390.8317 ns | 25,390.8317 ns | 24,883.0151 ns | 25,898.6483 ns | 1.00 | - | - | - | - | 495476 B | NA |
| WorkloadTest        | MemoryPackDeserializeStackOverflowPage | 448,583.7986 ns | 448,583.7986 ns | 439,612.1227 ns | 457,555.4746 ns | 17.67 | - | - | - | - | 228393 B | NA |
| WorkloadTest        | MessagePackDeserializeStackOverflowPage | 149,428.4356 ns | 149,428.4356 ns | 146,439.8669 ns | 152,417.0043 ns | 5.89 | - | - | - | - | 887286 B | NA |
| WorkloadTest        | ProtobufDeserializeStackOverflowPage | 22,155.7639 ns | 22,155.7639 ns | 21,712.6487 ns | 22,598.8792 ns | 0.87 | - | - | - | - | 336522 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeStackOverflowPage | 22,993.8597 ns | 22,993.8597 ns | 22,533.9825 ns | 23,453.7369 ns | 0.91 | - | - | - | - | 395343 B | NA |
| WorkloadTest        | JsonDeserializeStackOverflowPage | 26,042.4342 ns | 26,042.4342 ns | 25,521.5855 ns | 26,563.2829 ns | 1.03 | - | - | - | - | 386451 B | NA |
| WorkloadTest        | NinoSerializeRpcCall | 150.1259 ns | 150.1259 ns | 147.1234 ns | 153.1284 ns | 1.00 | 31,682 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeRpcCall | 3,505.6520 ns | 3,505.6520 ns | 3,435.5390 ns | 3,575.7651 ns | 23.35 | 63,296 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeRpcCall | 151.4857 ns | 151.4857 ns | 148.4560 ns | 154.5155 ns | 1.01 | 59,887 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeRpcCall | 1,880.3278 ns | 1,880.3278 ns | 1,842.7213 ns | 1,917.9344 ns | 12.53 | 43,539 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeRpcCall | 84.8221 ns | 84.8221 ns | 83.1256 ns | 86.5185 ns | 0.57 | 40,201 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeRpcCall | 2,125.9273 ns | 2,125.9273 ns | 2,083.4087 ns | 2,168.4458 ns | 14.16 | 60,731 B | - | - | - | 254023 B | NA |
| WorkloadTest        | NinoDeserializeRpcCall | 368.9199 ns | 368.9199 ns | 361.5415 ns | 376.2983 ns | 1.00 | - | - | - | - | 526706 B | NA |
| WorkloadTest        | MemoryPackDeserializeRpcCall | 1,552.0193 ns | 1,552.0193 ns | 1,520.9789 ns | 1,583.0596 ns | 4.21 | - | - | - | - | 692518 B | NA |
| WorkloadTest        | MessagePackDeserializeRpcCall | 366.0999 ns | 366.0999 ns | 358.7779 ns | 373.4219 ns | 0.99 | - | - | - | - | 618769 B | NA |
| WorkloadTest        | ProtobufDeserializeRpcCall | 291.0983 ns | 291.0983 ns | 285.2764 ns | 296.9203 ns | 0.79 | - | - | - | - | 86091 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeRpcCall | 307.5899 ns | 307.5899 ns | 301.4381 ns | 313.7417 ns | 0.83 | - | - | - | - | 610309 B | NA |
| WorkloadTest        | JsonDeserializeRpcCall | 198.3710 ns | 198.3710 ns | 194.4035 ns | 202.3384 ns | 0.54 | - | - | - | - | 350804 B | NA |
| WorkloadTest        | NinoSerializeProfileCache | 855.4190 ns | 855.4190 ns | 838.3106 ns | 872.5274 ns | 1.00 | 126,157 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeProfileCache | 1,618.7634 ns | 1,618.7634 ns | 1,586.3881 ns | 1,651.1386 ns | 1.89 | 91,978 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeProfileCache | 846.6044 ns | 846.6044 ns | 829.6723 ns | 863.5365 ns | 0.99 | 93,851 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeProfileCache | 701.9967 ns | 701.9967 ns | 687.9567 ns | 716.0366 ns | 0.82 | 124,678 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeProfileCache | 5,724.1509 ns | 5,724.1509 ns | 5,609.6678 ns | 5,838.6339 ns | 6.69 | 106,741 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeProfileCache | 629.0838 ns | 629.0838 ns | 616.5021 ns | 641.6655 ns | 0.74 | 67,342 B | - | - | - | 89466 B | NA |
| WorkloadTest        | NinoDeserializeProfileCache | 1,711.3751 ns | 1,711.3751 ns | 1,677.1476 ns | 1,745.6026 ns | 1.00 | - | - | - | - | 229928 B | NA |
| WorkloadTest        | MemoryPackDeserializeProfileCache | 1,196.1763 ns | 1,196.1763 ns | 1,172.2528 ns | 1,220.0998 ns | 0.70 | - | - | - | - | 720047 B | NA |
| WorkloadTest        | MessagePackDeserializeProfileCache | 1,006.3735 ns | 1,006.3735 ns | 986.2460 ns | 1,026.5009 ns | 0.59 | - | - | - | - | 391615 B | NA |
| WorkloadTest        | ProtobufDeserializeProfileCache | 1,528.9754 ns | 1,528.9754 ns | 1,498.3959 ns | 1,559.5549 ns | 0.89 | - | - | - | - | 497457 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeProfileCache | 29,533.4448 ns | 29,533.4448 ns | 28,942.7759 ns | 30,124.1137 ns | 17.26 | - | - | - | - | 11480 B | NA |
| WorkloadTest        | JsonDeserializeProfileCache | 1,755.1885 ns | 1,755.1885 ns | 1,720.0848 ns | 1,790.2923 ns | 1.03 | - | - | - | - | 671119 B | NA |
| WorkloadTest        | NinoSerializeEventStream | 44,606.8469 ns | 44,606.8469 ns | 43,714.7100 ns | 45,498.9838 ns | 1.00 | 3,714 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeEventStream | 44,214.2662 ns | 44,214.2662 ns | 43,329.9809 ns | 45,098.5515 ns | 0.99 | 6,694 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeEventStream | 28,714.9168 ns | 28,714.9168 ns | 28,140.6185 ns | 29,289.2151 ns | 0.64 | 7,180 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeEventStream | 1,172,897.0974 ns | 1,172,897.0974 ns | 1,149,439.1555 ns | 1,196,355.0394 ns | 26.29 | 6,661 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeEventStream | 26,965.1800 ns | 26,965.1800 ns | 26,425.8764 ns | 27,504.4836 ns | 0.60 | 4,116 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeEventStream | 33,875.3134 ns | 33,875.3134 ns | 33,197.8071 ns | 34,552.8197 ns | 0.76 | 6,920 B | - | - | - | 637832 B | NA |
| WorkloadTest        | NinoDeserializeEventStream | 149,492.7172 ns | 149,492.7172 ns | 146,502.8628 ns | 152,482.5715 ns | 1.00 | - | - | - | - | 247218 B | NA |
| WorkloadTest        | MemoryPackDeserializeEventStream | 149,128.0549 ns | 149,128.0549 ns | 146,145.4938 ns | 152,110.6160 ns | 1.00 | - | - | - | - | 522446 B | NA |
| WorkloadTest        | MessagePackDeserializeEventStream | 1,563,623.7610 ns | 1,563,623.7610 ns | 1,532,351.2858 ns | 1,594,896.2362 ns | 10.46 | - | - | - | - | 40983 B | NA |
| WorkloadTest        | ProtobufDeserializeEventStream | 149,505.4272 ns | 149,505.4272 ns | 146,515.3187 ns | 152,495.5357 ns | 1.00 | - | - | - | - | 582799 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeEventStream | 78,073.2441 ns | 78,073.2441 ns | 76,511.7792 ns | 79,634.7090 ns | 0.52 | - | - | - | - | 896350 B | NA |
| WorkloadTest        | JsonDeserializeEventStream | 84,106.8213 ns | 84,106.8213 ns | 82,424.6849 ns | 85,788.9578 ns | 0.56 | - | - | - | - | 4730 B | NA |
| WorkloadTest        | NinoSerializeLogBatch | 4,396.7026 ns | 4,396.7026 ns | 4,308.7685 ns | 4,484.6366 ns | 1.00 | 130,225 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeLogBatch | 4,365.5602 ns | 4,365.5602 ns | 4,278.2490 ns | 4,452.8714 ns | 0.99 | 144,071 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeLogBatch | 2,218.2295 ns | 2,218.2295 ns | 2,173.8649 ns | 2,262.5940 ns | 0.50 | 111,303 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeLogBatch | 73,467.7977 ns | 73,467.7977 ns | 71,998.4417 ns | 74,937.1536 ns | 16.71 | 100,399 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeLogBatch | 60,650.2531 ns | 60,650.2531 ns | 59,437.2481 ns | 61,863.2582 ns | 13.79 | 123,931 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeLogBatch | 49,267.5817 ns | 49,267.5817 ns | 48,282.2300 ns | 50,252.9333 ns | 11.21 | 138,592 B | - | - | - | 664696 B | NA |
| WorkloadTest        | NinoDeserializeLogBatch | 11,548.4941 ns | 11,548.4941 ns | 11,317.5242 ns | 11,779.4639 ns | 1.00 | - | - | - | - | 869023 B | NA |
| WorkloadTest        | MemoryPackDeserializeLogBatch | 7,693.1413 ns | 7,693.1413 ns | 7,539.2784 ns | 7,847.0041 ns | 0.67 | - | - | - | - | 156657 B | NA |
| WorkloadTest        | MessagePackDeserializeLogBatch | 85,230.5504 ns | 85,230.5504 ns | 83,525.9394 ns | 86,935.1614 ns | 7.38 | - | - | - | - | 760234 B | NA |
| WorkloadTest        | ProtobufDeserializeLogBatch | 94,189.1349 ns | 94,189.1349 ns | 92,305.3522 ns | 96,072.9176 ns | 8.16 | - | - | - | - | 523977 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeLogBatch | 11,794.7072 ns | 11,794.7072 ns | 11,558.8131 ns | 12,030.6014 ns | 1.02 | - | - | - | - | 461501 B | NA |
| WorkloadTest        | JsonDeserializeLogBatch | 11,435.8602 ns | 11,435.8602 ns | 11,207.1430 ns | 11,664.5774 ns | 0.99 | - | - | - | - | 48237 B | NA |
| WorkloadTest        | NinoSerializeStateSnapshot | 16.0812 ns | 16.0812 ns | 15.7596 ns | 16.4029 ns | 1.00 | 84,159 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeStateSnapshot | 364.8867 ns | 364.8867 ns | 357.5890 ns | 372.1845 ns | 22.69 | 251,640 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeStateSnapshot | 8.6590 ns | 8.6590 ns | 8.4858 ns | 8.8322 ns | 0.54 | 260,887 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeStateSnapshot | 15.9950 ns | 15.9950 ns | 15.6751 ns | 16.3149 ns | 0.99 | 134,694 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeStateSnapshot | 15.6743 ns | 15.6743 ns | 15.3608 ns | 15.9877 ns | 0.97 | 143,997 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeStateSnapshot | 15.6142 ns | 15.6142 ns | 15.3019 ns | 15.9265 ns | 0.97 | 257,667 B | - | - | - | 699373 B | NA |
| WorkloadTest        | NinoDeserializeStateSnapshot | 56.8359 ns | 56.8359 ns | 55.6992 ns | 57.9726 ns | 1.00 | - | - | - | - | 403978 B | NA |
| WorkloadTest        | MemoryPackDeserializeStateSnapshot | 533.8853 ns | 533.8853 ns | 523.2076 ns | 544.5630 ns | 9.39 | - | - | - | - | 327450 B | NA |
| WorkloadTest        | MessagePackDeserializeStateSnapshot | 57.9222 ns | 57.9222 ns | 56.7638 ns | 59.0806 ns | 1.02 | - | - | - | - | 206143 B | NA |
| WorkloadTest        | ProtobufDeserializeStateSnapshot | 57.9941 ns | 57.9941 ns | 56.8342 ns | 59.1540 ns | 1.02 | - | - | - | - | 109578 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeStateSnapshot | 57.1270 ns | 57.1270 ns | 55.9845 ns | 58.2696 ns | 1.01 | - | - | - | - | 225191 B | NA |
| WorkloadTest        | JsonDeserializeStateSnapshot | 57.5390 ns | 57.5390 ns | 56.3882 ns | 58.6898 ns | 1.01 | - | - | - | - | 853490 B | NA |
| WorkloadTest        | NinoSerializeLockstepFrames | 10,504.2076 ns | 10,504.2076 ns | 10,294.1234 ns | 10,714.2917 ns | 1.00 | 164,683 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeLockstepFrames | 7,574.9283 ns | 7,574.9283 ns | 7,423.4298 ns | 7,726.4269 ns | 0.72 | 133,342 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeLockstepFrames | 7,204.8949 ns | 7,204.8949 ns | 7,060.7970 ns | 7,348.9928 ns | 0.69 | 188,269 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeLockstepFrames | 44,448.9117 ns | 44,448.9117 ns | 43,559.9335 ns | 45,337.8900 ns | 4.23 | 87,149 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeLockstepFrames | 10,356.5778 ns | 10,356.5778 ns | 10,149.4463 ns | 10,563.7094 ns | 0.99 | 158,247 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeLockstepFrames | 10,758.8873 ns | 10,758.8873 ns | 10,543.7096 ns | 10,974.0651 ns | 1.02 | 67,115 B | - | - | - | 275125 B | NA |
| WorkloadTest        | NinoDeserializeLockstepFrames | 25,390.8317 ns | 25,390.8317 ns | 24,883.0151 ns | 25,898.6483 ns | 1.00 | - | - | - | - | 495476 B | NA |
| WorkloadTest        | MemoryPackDeserializeLockstepFrames | 448,583.7986 ns | 448,583.7986 ns | 439,612.1227 ns | 457,555.4746 ns | 17.67 | - | - | - | - | 228393 B | NA |
| WorkloadTest        | MessagePackDeserializeLockstepFrames | 149,428.4356 ns | 149,428.4356 ns | 146,439.8669 ns | 152,417.0043 ns | 5.89 | - | - | - | - | 887286 B | NA |
| WorkloadTest        | ProtobufDeserializeLockstepFrames | 22,155.7639 ns | 22,155.7639 ns | 21,712.6487 ns | 22,598.8792 ns | 0.87 | - | - | - | - | 336522 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeLockstepFrames | 22,993.8597 ns | 22,993.8597 ns | 22,533.9825 ns | 23,453.7369 ns | 0.91 | - | - | - | - | 395343 B | NA |
| WorkloadTest        | JsonDeserializeLockstepFrames | 26,042.4342 ns | 26,042.4342 ns | 25,521.5855 ns | 26,563.2829 ns | 1.03 | - | - | - | - | 386451 B | NA |
| WorkloadTest        | NinoSerializeAoiUpdate | 150.1259 ns | 150.1259 ns | 147.1234 ns | 153.1284 ns | 1.00 | 31,682 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeAoiUpdate | 3,505.6520 ns | 3,505.6520 ns | 3,435.5390 ns | 3,575.7651 ns | 23.35 | 63,296 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeAoiUpdate | 151.4857 ns | 151.4857 ns | 148.4560 ns | 154.5155 ns | 1.01 | 59,887 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeAoiUpdate | 1,880.3278 ns | 1,880.3278 ns | 1,842.7213 ns | 1,917.9344 ns | 12.53 | 43,539 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeAoiUpdate | 84.8221 ns | 84.8221 ns | 83.1256 ns | 86.5185 ns | 0.57 | 40,201 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeAoiUpdate | 2,125.9273 ns | 2,125.9273 ns | 2,083.4087 ns | 2,168.4458 ns | 14.16 | 60,731 B | - | - | - | 254023 B | NA |
| WorkloadTest        | NinoDeserializeAoiUpdate | 368.9199 ns | 368.9199 ns | 361.5415 ns | 376.2983 ns | 1.00 | - | - | - | - | 526706 B | NA |
| WorkloadTest        | MemoryPackDeserializeAoiUpdate | 1,552.0193 ns | 1,552.0193 ns | 1,520.9789 ns | 1,583.0596 ns | 4.21 | - | - | - | - | 692518 B | NA |
| WorkloadTest        | MessagePackDeserializeAoiUpdate | 366.0999 ns | 366.0999 ns | 358.7779 ns | 373.4219 ns | 0.99 | - | - | - | - | 618769 B | NA |
| WorkloadTest        | ProtobufDeserializeAoiUpdate | 291.0983 ns | 291.0983 ns | 285.2764 ns | 296.9203 ns | 0.79 | - | - | - | - | 86091 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeAoiUpdate | 307.5899 ns | 307.5899 ns | 301.4381 ns | 313.7417 ns | 0.83 | - | - | - | - | 610309 B | NA |
| WorkloadTest        | JsonDeserializeAoiUpdate | 198.3710 ns | 198.3710 ns | 194.4035 ns | 202.3384 ns | 0.54 | - | - | - | - | 350804 B | NA |
| WorkloadTest        | NinoSerializeWorldRegion | 855.4190 ns | 855.4190 ns | 838.3106 ns | 872.5274 ns | 1.00 | 126,157 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeWorldRegion | 1,618.7634 ns | 1,618.7634 ns | 1,586.3881 ns | 1,651.1386 ns | 1.89 | 91,978 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeWorldRegion | 846.6044 ns | 846.6044 ns | 829.6723 ns | 863.5365 ns | 0.99 | 93,851 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeWorldRegion | 701.9967 ns | 701.9967 ns | 687.9567 ns | 716.0366 ns | 0.82 | 124,678 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeWorldRegion | 5,724.1509 ns | 5,724.1509 ns | 5,609.6678 ns | 5,838.6339 ns | 6.69 | 106,741 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeWorldRegion | 629.0838 ns | 629.0838 ns | 616.5021 ns | 641.6655 ns | 0.74 | 67,342 B | - | - | - | 89466 B | NA |
| WorkloadTest        | NinoDeserializeWorldRegion | 1,711.3751 ns | 1,711.3751 ns | 1,677.1476 ns | 1,745.6026 ns | 1.00 | - | - | - | - | 229928 B | NA |
| WorkloadTest        | MemoryPackDeserializeWorldRegion | 1,196.1763 ns | 1,196.1763 ns | 1,172.2528 ns | 1,220.0998 ns | 0.70 | - | - | - | - | 720047 B | NA |
| WorkloadTest        | MessagePackDeserializeWorldRegion | 1,006.3735 ns | 1,006.3735 ns | 986.2460 ns | 1,026.5009 ns | 0.59 | - | - | - | - | 391615 B | NA |
| WorkloadTest        | ProtobufDeserializeWorldRegion | 1,528.9754 ns | 1,528.9754 ns | 1,498.3959 ns | 1,559.5549 ns | 0.89 | - | - | - | - | 497457 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeWorldRegion | 29,533.4448 ns | 29,533.4448 ns | 28,942.7759 ns | 30,124.1137 ns | 17.26 | - | - | - | - | 11480 B | NA |
| WorkloadTest        | JsonDeserializeWorldRegion | 1,755.1885 ns | 1,755.1885 ns | 1,720.0848 ns | 1,790.2923 ns | 1.03 | - | - | - | - | 671119 B | NA |
| WorkloadTest        | NinoSerializeCardBattleLog | 44,606.8469 ns | 44,606.8469 ns | 43,714.7100 ns | 45,498.9838 ns | 1.00 | 3,714 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeCardBattleLog | 44,214.2662 ns | 44,214.2662 ns | 43,329.9809 ns | 45,098.5515 ns | 0.99 | 6,694 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeCardBattleLog | 28,714.9168 ns | 28,714.9168 ns | 28,140.6185 ns | 29,289.2151 ns | 0.64 | 7,180 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeCardBattleLog | 1,172,897.0974 ns | 1,172,897.0974 ns | 1,149,439.1555 ns | 1,196,355.0394 ns | 26.29 | 6,661 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeCardBattleLog | 26,965.1800 ns | 26,965.1800 ns | 26,425.8764 ns | 27,504.4836 ns | 0.60 | 4,116 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeCardBattleLog | 33,875.3134 ns | 33,875.3134 ns | 33,197.8071 ns | 34,552.8197 ns | 0.76 | 6,920 B | - | - | - | 637832 B | NA |
| WorkloadTest        | NinoDeserializeCardBattleLog | 149,492.7172 ns | 149,492.7172 ns | 146,502.8628 ns | 152,482.5715 ns | 1.00 | - | - | - | - | 247218 B | NA |
| WorkloadTest        | MemoryPackDeserializeCardBattleLog | 149,128.0549 ns | 149,128.0549 ns | 146,145.4938 ns | 152,110.6160 ns | 1.00 | - | - | - | - | 522446 B | NA |
| WorkloadTest        | MessagePackDeserializeCardBattleLog | 1,563,623.7610 ns | 1,563,623.7610 ns | 1,532,351.2858 ns | 1,594,896.2362 ns | 10.46 | - | - | - | - | 40983 B | NA |
| WorkloadTest        | ProtobufDeserializeCardBattleLog | 149,505.4272 ns | 149,505.4272 ns | 146,515.3187 ns | 152,495.5357 ns | 1.00 | - | - | - | - | 582799 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeCardBattleLog | 78,073.2441 ns | 78,073.2441 ns | 76,511.7792 ns | 79,634.7090 ns | 0.52 | - | - | - | - | 896350 B | NA |
| WorkloadTest        | JsonDeserializeCardBattleLog | 84,106.8213 ns | 84,106.8213 ns | 82,424.6849 ns | 85,788.9578 ns | 0.56 | - | - | - | - | 4730 B | NA |
| WorkloadTest        | NinoSerializeIdleSave | 4,396.7026 ns | 4,396.7026 ns | 4,308.7685 ns | 4,484.6366 ns | 1.00 | 130,225 B | - | - | - | - | NA |
| WorkloadTest        | MemoryPackSerializeIdleSave | 4,365.5602 ns | 4,365.5602 ns | 4,278.2490 ns | 4,452.8714 ns | 0.99 | 144,071 B | - | - | - | - | NA |
| WorkloadTest        | MessagePackSerializeIdleSave | 2,218.2295 ns | 2,218.2295 ns | 2,173.8649 ns | 2,262.5940 ns | 0.50 | 111,303 B | - | - | - | - | NA |
| WorkloadTest        | ProtobufSerializeIdleSave | 73,467.7977 ns | 73,467.7977 ns | 71,998.4417 ns | 74,937.1536 ns | 16.71 | 100,399 B | - | - | - | - | NA |
| WorkloadTest        | GoogleProtobufSerializeIdleSave | 60,650.2531 ns | 60,650.2531 ns | 59,437.2481 ns | 61,863.2582 ns | 13.79 | 123,931 B | - | - | - | - | NA |
| WorkloadTest        | JsonSerializeIdleSave | 49,267.5817 ns | 49,267.5817 ns | 48,282.2300 ns | 50,252.9333 ns | 11.21 | 138,592 B | - | - | - | 664696 B | NA |
| WorkloadTest        | NinoDeserializeIdleSave | 11,548.4941 ns | 11,548.4941 ns | 11,317.5242 ns | 11,779.4639 ns | 1.00 | - | - | - | - | 869023 B | NA |
| WorkloadTest        | MemoryPackDeserializeIdleSave | 7,693.1413 ns | 7,693.1413 ns | 7,539.2784 ns | 7,847.0041 ns | 0.67 | - | - | - | - | 156657 B | NA |
| WorkloadTest        | MessagePackDeserializeIdleSave | 85,230.5504 ns | 85,230.5504 ns | 83,525.9394 ns | 86,935.1614 ns | 7.38 | - | - | - | - | 760234 B | NA |
| WorkloadTest        | ProtobufDeserializeIdleSave | 94,189.1349 ns | 94,189.1349 ns | 92,305.3522 ns | 96,072.9176 ns | 8.16 | - | - | - | - | 523977 B | NA |
| WorkloadTest        | GoogleProtobufDeserializeIdleSave | 11,794.7072 ns | 11,794.7072 ns | 11,558.8131 ns | 12,030.6014 ns | 1.02 | - | - | - | - | 461501 B | NA |
| WorkloadTest        | JsonDeserializeIdleSave | 11,435.8602 ns | 11,435.8602 ns | 11,207.1430 ns | 11,664.5774 ns | 0.99 | - | - | - | - | 48237 B | NA |
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
| NullableTest | NinoSerializeNullableFields | 72.0000 ns | 72.0000 ns | 68.4000 ns | 75.6000 ns | 1.00 | 52 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableFields | 100.8000 ns | 100.8000 ns | 95.7600 ns | 105.8400 ns | 1.40 | 56 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableFields | 223.2000 ns | 223.2000 ns | 212.0400 ns | 234.3600 ns | 3.10 | 124 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableFields | 302.4000 ns | 302.4000 ns | 287.2800 ns | 317.5200 ns | 4.20 | 168 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableFields | 259.2000 ns | 259.2000 ns | 246.2400 ns | 272.1600 ns | 3.60 | 144 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableFields | 684.0000 ns | 684.0000 ns | 649.8000 ns | 718.2000 ns | 9.50 | 380 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableFields | 79.2000 ns | 79.2000 ns | 75.2400 ns | 83.1600 ns | 1.00 | - | - | - | - | 104 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableFields | 110.8800 ns | 110.8800 ns | 105.3360 ns | 116.4240 ns | 1.40 | - | - | - | - | 104 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableFields | 245.5200 ns | 245.5200 ns | 233.2440 ns | 257.7960 ns | 3.10 | - | - | - | - | 104 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableFields | 332.6400 ns | 332.6400 ns | 316.0080 ns | 349.2720 ns | 4.20 | - | - | - | - | 104 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableFields | 285.1200 ns | 285.1200 ns | 270.8640 ns | 299.3760 ns | 3.60 | - | - | - | - | 104 B | 1.00 |
| NullableTest | JsonDeserializeNullableFields | 752.4000 ns | 752.4000 ns | 714.7800 ns | 790.0200 ns | 9.50 | - | - | - | - | 104 B | 1.00 |
| NullableTest | NinoSerializeNullableFieldsArray | 6,240.0000 ns | 6,240.0000 ns | 5,928.0000 ns | 6,552.0000 ns | 1.00 | 5,100 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableFieldsArray | 8,736.0000 ns | 8,736.0000 ns | 8,299.2000 ns | 9,172.8000 ns | 1.40 | 5,492 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableFieldsArray | 19,344.0000 ns | 19,344.0000 ns | 18,376.8000 ns | 20,311.2000 ns | 3.10 | 12,161 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableFieldsArray | 26,208.0000 ns | 26,208.0000 ns | 24,897.6000 ns | 27,518.4000 ns | 4.20 | 16,476 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableFieldsArray | 22,464.0000 ns | 22,464.0000 ns | 21,340.8000 ns | 23,587.2000 ns | 3.60 | 14,123 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableFieldsArray | 59,280.0000 ns | 59,280.0000 ns | 56,316.0000 ns | 62,244.0000 ns | 9.50 | 37,269 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableFieldsArray | 6,864.0000 ns | 6,864.0000 ns | 6,520.8000 ns | 7,207.2000 ns | 1.00 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableFieldsArray | 9,609.6000 ns | 9,609.6000 ns | 9,129.1200 ns | 10,090.0800 ns | 1.40 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableFieldsArray | 21,278.4000 ns | 21,278.4000 ns | 20,214.4800 ns | 22,342.3200 ns | 3.10 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableFieldsArray | 28,828.8000 ns | 28,828.8000 ns | 27,387.3600 ns | 30,270.2400 ns | 4.20 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableFieldsArray | 24,710.4000 ns | 24,710.4000 ns | 23,474.8800 ns | 25,945.9200 ns | 3.60 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | JsonDeserializeNullableFieldsArray | 65,208.0000 ns | 65,208.0000 ns | 61,947.6000 ns | 68,468.4000 ns | 9.50 | - | - | - | - | 10200 B | 1.00 |
| NullableTest | NinoSerializeNullableStruct | 9.6000 ns | 9.6000 ns | 9.1200 ns | 10.0800 ns | 1.00 | 13 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableStruct | 13.4400 ns | 13.4400 ns | 12.7680 ns | 14.1120 ns | 1.40 | 14 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableStruct | 29.7600 ns | 29.7600 ns | 28.2720 ns | 31.2480 ns | 3.10 | 31 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableStruct | 40.3200 ns | 40.3200 ns | 38.3040 ns | 42.3360 ns | 4.20 | 42 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableStruct | 34.5600 ns | 34.5600 ns | 32.8320 ns | 36.2880 ns | 3.60 | 36 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableStruct | 91.2000 ns | 91.2000 ns | 86.6400 ns | 95.7600 ns | 9.50 | 95 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableStruct | 10.5600 ns | 10.5600 ns | 10.0320 ns | 11.0880 ns | 1.00 | - | - | - | - | 26 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableStruct | 14.7840 ns | 14.7840 ns | 14.0448 ns | 15.5232 ns | 1.40 | - | - | - | - | 26 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableStruct | 32.7360 ns | 32.7360 ns | 31.0992 ns | 34.3728 ns | 3.10 | - | - | - | - | 26 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableStruct | 44.3520 ns | 44.3520 ns | 42.1344 ns | 46.5696 ns | 4.20 | - | - | - | - | 26 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableStruct | 38.0160 ns | 38.0160 ns | 36.1152 ns | 39.9168 ns | 3.60 | - | - | - | - | 26 B | 1.00 |
| NullableTest | JsonDeserializeNullableStruct | 100.3200 ns | 100.3200 ns | 95.3040 ns | 105.3360 ns | 9.50 | - | - | - | - | 26 B | 1.00 |
| NullableTest | NinoSerializeNullableStructs | 720.0000 ns | 720.0000 ns | 684.0000 ns | 756.0000 ns | 1.00 | 1,300 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableStructs | 1,008.0000 ns | 1,008.0000 ns | 957.6000 ns | 1,058.4000 ns | 1.40 | 1,400 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableStructs | 2,232.0000 ns | 2,232.0000 ns | 2,120.4000 ns | 2,343.6000 ns | 3.10 | 3,100 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableStructs | 3,024.0000 ns | 3,024.0000 ns | 2,872.8000 ns | 3,175.2000 ns | 4.20 | 4,200 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableStructs | 2,592.0000 ns | 2,592.0000 ns | 2,462.4000 ns | 2,721.6000 ns | 3.60 | 3,600 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableStructs | 6,840.0000 ns | 6,840.0000 ns | 6,498.0000 ns | 7,182.0000 ns | 9.50 | 9,500 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableStructs | 792.0000 ns | 792.0000 ns | 752.4000 ns | 831.6000 ns | 1.00 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableStructs | 1,108.8000 ns | 1,108.8000 ns | 1,053.3600 ns | 1,164.2400 ns | 1.40 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableStructs | 2,455.2000 ns | 2,455.2000 ns | 2,332.4400 ns | 2,577.9600 ns | 3.10 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableStructs | 3,326.4000 ns | 3,326.4000 ns | 3,160.0800 ns | 3,492.7200 ns | 4.20 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableStructs | 2,851.2000 ns | 2,851.2000 ns | 2,708.6400 ns | 2,993.7600 ns | 3.60 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | JsonDeserializeNullableStructs | 7,524.0000 ns | 7,524.0000 ns | 7,147.8000 ns | 7,900.2000 ns | 9.50 | - | - | - | - | 2600 B | 1.00 |
| NullableTest | NinoSerializeNullableObject | 2.4000 ns | 2.4000 ns | 2.2800 ns | 2.5200 ns | 1.00 | 1 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableObject | 3.3600 ns | 3.3600 ns | 3.1920 ns | 3.5280 ns | 1.40 | 1 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableObject | 7.4400 ns | 7.4400 ns | 7.0680 ns | 7.8120 ns | 3.10 | 2 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableObject | 10.0800 ns | 10.0800 ns | 9.5760 ns | 10.5840 ns | 4.20 | 3 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableObject | 8.6400 ns | 8.6400 ns | 8.2080 ns | 9.0720 ns | 3.60 | 2 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableObject | 22.8000 ns | 22.8000 ns | 21.6600 ns | 23.9400 ns | 9.50 | 7 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableObject | 2.6400 ns | 2.6400 ns | 2.5080 ns | 2.7720 ns | 1.00 | - | - | - | - | 2 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableObject | 3.6960 ns | 3.6960 ns | 3.5112 ns | 3.8808 ns | 1.40 | - | - | - | - | 2 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableObject | 8.1840 ns | 8.1840 ns | 7.7748 ns | 8.5932 ns | 3.10 | - | - | - | - | 2 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableObject | 11.0880 ns | 11.0880 ns | 10.5336 ns | 11.6424 ns | 4.20 | - | - | - | - | 2 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableObject | 9.5040 ns | 9.5040 ns | 9.0288 ns | 9.9792 ns | 3.60 | - | - | - | - | 2 B | 1.00 |
| NullableTest | JsonDeserializeNullableObject | 25.0800 ns | 25.0800 ns | 23.8260 ns | 26.3340 ns | 9.50 | - | - | - | - | 2 B | 1.00 |
| NullableTest | NinoSerializeNullableObjects | 48,000.0000 ns | 48,000.0000 ns | 45,600.0000 ns | 50,400.0000 ns | 1.00 | 90,000 B | - | - | - | - | 1.00 |
| NullableTest | MemoryPackSerializeNullableObjects | 67,200.0000 ns | 67,200.0000 ns | 63,840.0000 ns | 70,560.0000 ns | 1.40 | 96,923 B | - | - | - | - | 1.00 |
| NullableTest | MessagePackSerializeNullableObjects | 148,800.0000 ns | 148,800.0000 ns | 141,360.0000 ns | 156,240.0000 ns | 3.10 | 214,615 B | - | - | - | - | 1.00 |
| NullableTest | ProtobufSerializeNullableObjects | 201,600.0000 ns | 201,600.0000 ns | 191,520.0000 ns | 211,680.0000 ns | 4.20 | 290,769 B | - | - | - | - | 1.00 |
| NullableTest | GoogleProtobufSerializeNullableObjects | 172,800.0000 ns | 172,800.0000 ns | 164,160.0000 ns | 181,440.0000 ns | 3.60 | 249,230 B | - | - | - | - | 1.00 |
| NullableTest | JsonSerializeNullableObjects | 456,000.0000 ns | 456,000.0000 ns | 433,200.0000 ns | 478,800.0000 ns | 9.50 | 657,692 B | - | - | - | - | 1.00 |
| NullableTest | NinoDeserializeNullableObjects | 52,800.0000 ns | 52,800.0000 ns | 50,160.0000 ns | 55,440.0000 ns | 1.00 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MemoryPackDeserializeNullableObjects | 73,920.0000 ns | 73,920.0000 ns | 70,224.0000 ns | 77,616.0000 ns | 1.40 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | MessagePackDeserializeNullableObjects | 163,680.0000 ns | 163,680.0000 ns | 155,496.0000 ns | 171,864.0000 ns | 3.10 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | ProtobufDeserializeNullableObjects | 221,760.0000 ns | 221,760.0000 ns | 210,672.0000 ns | 232,848.0000 ns | 4.20 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | GoogleProtobufDeserializeNullableObjects | 190,080.0000 ns | 190,080.0000 ns | 180,576.0000 ns | 199,584.0000 ns | 3.60 | - | - | - | - | 180000 B | 1.00 |
| NullableTest | JsonDeserializeNullableObjects | 501,600.0000 ns | 501,600.0000 ns | 476,520.0000 ns | 526,680.0000 ns | 9.50 | - | - | - | - | 180000 B | 1.00 |
| CollectionsTest | NinoSerializeNullableLongs | 1,080.0000 ns | 1,080.0000 ns | 1,026.0000 ns | 1,134.0000 ns | 1.00 | 16,004 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackSerializeNullableLongs | 1,512.0000 ns | 1,512.0000 ns | 1,436.4000 ns | 1,587.6000 ns | 1.40 | 17,235 B | - | - | - | - | 1.00 |
| CollectionsTest | MessagePackSerializeNullableLongs | 3,348.0000 ns | 3,348.0000 ns | 3,180.6000 ns | 3,515.4000 ns | 3.10 | 38,163 B | - | - | - | - | 1.00 |
| CollectionsTest | ProtobufSerializeNullableLongs | 4,536.0000 ns | 4,536.0000 ns | 4,309.2000 ns | 4,762.8000 ns | 4.20 | 51,705 B | - | - | - | - | 1.00 |
| CollectionsTest | GoogleProtobufSerializeNullableLongs | 3,888.0000 ns | 3,888.0000 ns | 3,693.6000 ns | 4,082.4000 ns | 3.60 | 44,318 B | - | - | - | - | 1.00 |
| CollectionsTest | JsonSerializeNullableLongs | 10,260.0000 ns | 10,260.0000 ns | 9,747.0000 ns | 10,773.0000 ns | 9.50 | 116,952 B | - | - | - | - | 1.00 |
| CollectionsTest | NinoDeserializeNullableLongs | 1,188.0000 ns | 1,188.0000 ns | 1,128.6000 ns | 1,247.4000 ns | 1.00 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | MemoryPackDeserializeNullableLongs | 1,663.2000 ns | 1,663.2000 ns | 1,580.0400 ns | 1,746.3600 ns | 1.40 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | MessagePackDeserializeNullableLongs | 3,682.8000 ns | 3,682.8000 ns | 3,498.6600 ns | 3,866.9400 ns | 3.10 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | ProtobufDeserializeNullableLongs | 4,989.6000 ns | 4,989.6000 ns | 4,740.1200 ns | 5,239.0800 ns | 4.20 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | GoogleProtobufDeserializeNullableLongs | 4,276.8000 ns | 4,276.8000 ns | 4,062.9600 ns | 4,490.6400 ns | 3.60 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | JsonDeserializeNullableLongs | 11,286.0000 ns | 11,286.0000 ns | 10,721.7000 ns | 11,850.3000 ns | 9.50 | - | - | - | - | 32008 B | 1.00 |
| CollectionsTest | NinoSerializeNullableInts | 840.0000 ns | 840.0000 ns | 798.0000 ns | 882.0000 ns | 1.00 | 8,004 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackSerializeNullableInts | 1,176.0000 ns | 1,176.0000 ns | 1,117.2000 ns | 1,234.8000 ns | 1.40 | 8,619 B | - | - | - | - | 1.00 |
| CollectionsTest | MessagePackSerializeNullableInts | 2,604.0000 ns | 2,604.0000 ns | 2,473.8000 ns | 2,734.2000 ns | 3.10 | 19,086 B | - | - | - | - | 1.00 |
| CollectionsTest | ProtobufSerializeNullableInts | 3,528.0000 ns | 3,528.0000 ns | 3,351.6000 ns | 3,704.4000 ns | 4.20 | 25,859 B | - | - | - | - | 1.00 |
| CollectionsTest | GoogleProtobufSerializeNullableInts | 3,024.0000 ns | 3,024.0000 ns | 2,872.8000 ns | 3,175.2000 ns | 3.60 | 22,164 B | - | - | - | - | 1.00 |
| CollectionsTest | JsonSerializeNullableInts | 7,980.0000 ns | 7,980.0000 ns | 7,581.0000 ns | 8,379.0000 ns | 9.50 | 58,490 B | - | - | - | - | 1.00 |
| CollectionsTest | NinoDeserializeNullableInts | 924.0000 ns | 924.0000 ns | 877.8000 ns | 970.2000 ns | 1.00 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | MemoryPackDeserializeNullableInts | 1,293.6000 ns | 1,293.6000 ns | 1,228.9200 ns | 1,358.2800 ns | 1.40 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | MessagePackDeserializeNullableInts | 2,864.4000 ns | 2,864.4000 ns | 2,721.1800 ns | 3,007.6200 ns | 3.10 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | ProtobufDeserializeNullableInts | 3,880.8000 ns | 3,880.8000 ns | 3,686.7600 ns | 4,074.8400 ns | 4.20 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | GoogleProtobufDeserializeNullableInts | 3,326.4000 ns | 3,326.4000 ns | 3,160.0800 ns | 3,492.7200 ns | 3.60 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | JsonDeserializeNullableInts | 8,778.0000 ns | 8,778.0000 ns | 8,339.1000 ns | 9,216.9000 ns | 9.50 | - | - | - | - | 16008 B | 1.00 |
| CollectionsTest | NinoSerializeNullableDecimals | 1,800.0000 ns | 1,800.0000 ns | 1,710.0000 ns | 1,890.0000 ns | 1.00 | 24,004 B | - | - | - | - | 1.00 |
| CollectionsTest | MemoryPackSerializeNullableDecimals | 2,520.0000 ns | 2,520.0000 ns | 2,394.0000 ns | 2,646.0000 ns | 1.40 | 25,850 B | - | - | - | - | 1.00 |
| CollectionsTest | MessagePackSerializeNullableDecimals | 5,580.0000 ns | 5,580.0000 ns | 5,301.0000 ns | 5,859.0000 ns | 3.10 | 57,240 B | - | - | - | - | 1.00 |
| CollectionsTest | ProtobufSerializeNullableDecimals | 7,560.0000 ns | 7,560.0000 ns | 7,182.0000 ns | 7,938.0000 ns | 4.20 | 77,551 B | - | - | - | - | 1.00 |
| CollectionsTest | GoogleProtobufSerializeNullableDecimals | 6,480.0000 ns | 6,480.0000 ns | 6,156.0000 ns | 6,804.0000 ns | 3.60 | 66,472 B | - | - | - | - | 1.00 |
| CollectionsTest | JsonSerializeNullableDecimals | 17,100.0000 ns | 17,100.0000 ns | 16,245.0000 ns | 17,955.0000 ns | 9.50 | 175,413 B | - | - | - | - | 1.00 |
| CollectionsTest | NinoDeserializeNullableDecimals | 1,980.0000 ns | 1,980.0000 ns | 1,881.0000 ns | 2,079.0000 ns | 1.00 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | MemoryPackDeserializeNullableDecimals | 2,772.0000 ns | 2,772.0000 ns | 2,633.4000 ns | 2,910.6000 ns | 1.40 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | MessagePackDeserializeNullableDecimals | 6,138.0000 ns | 6,138.0000 ns | 5,831.1000 ns | 6,444.9000 ns | 3.10 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | ProtobufDeserializeNullableDecimals | 8,316.0000 ns | 8,316.0000 ns | 7,900.2000 ns | 8,731.8000 ns | 4.20 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | GoogleProtobufDeserializeNullableDecimals | 7,128.0000 ns | 7,128.0000 ns | 6,771.6000 ns | 7,484.4000 ns | 3.60 | - | - | - | - | 48008 B | 1.00 |
| CollectionsTest | JsonDeserializeNullableDecimals | 18,810.0000 ns | 18,810.0000 ns | 17,869.5000 ns | 19,750.5000 ns | 9.50 | - | - | - | - | 48008 B | 1.00 |


| Method                              | Mean            | Error           | StdDev        | Ratio  | RatioSD | Payload  |
|------------------------------------ |----------------:|----------------:|--------------:|-------:|--------:|---------:|
| MessagePackDeserializeSimpleClass   |   2,111.9165 ns |   7,499.7522 ns |   411.0867 ns |   3.56 |    0.66 |        - |
| MemoryPackDeserializeSimpleClass    |     716.2232 ns |   1,189.7453 ns |    65.2140 ns |   1.21 |    0.13 |        - |
| NinoDeserializeSimpleClass          |     596.2149 ns |     953.6227 ns |    52.2713 ns |   1.01 |    0.11 |        - |
|                                     |                 |                 |               |        |         |          |
| MessagePackSerializeSimpleClass     |   1,940.1911 ns |   1,826.9493 ns |   100.1413 ns |  14.90 |    0.67 |   1.09KB |
| MemoryPackSerializeSimpleClass      |     349.8266 ns |     291.9018 ns |    16.0001 ns |   2.69 |    0.11 |   1.12KB |
| NinoSerializeSimpleClass            |     130.2423 ns |      11.4577 ns |     0.6280 ns |   1.00 |    0.01 |   1.13KB |
|                                     |                 |                 |               |        |         |          |
| MessagePackDeserializeSimpleClasses | 129,492.0146 ns |  34,744.4235 ns | 1,904.4591 ns |   2.78 |    0.28 |        - |
| MemoryPackDeserializeSimpleClasses  |  49,776.9275 ns |  10,820.2964 ns |   593.0970 ns |   1.07 |    0.11 |        - |
| NinoDeserializeSimpleClasses        |  46,993.3769 ns |  95,934.3501 ns | 5,258.4855 ns |   1.01 |    0.14 |        - |
|                                     |                 |                 |               |        |         |          |
| MessagePackSerializeSimpleClasses   | 188,402.2113 ns |  71,886.8636 ns | 3,940.3616 ns |  12.06 |    0.79 |  108.6KB |
| MemoryPackSerializeSimpleClasses    |  33,187.0974 ns |   7,086.9444 ns |   388.4593 ns |   2.12 |    0.13 | 112.11KB |
| NinoSerializeSimpleClasses          |  15,679.4751 ns |  20,001.9346 ns | 1,096.3735 ns |   1.00 |    0.09 |  112.5KB |
|                                     |                 |                 |               |        |         |          |
| MessagePackDeserializeSimpleStruct  |      49.4733 ns |      35.1896 ns |     1.9289 ns | 118.07 |    8.78 |        - |
| MemoryPackDeserializeSimpleStruct   |       1.0937 ns |       1.0935 ns |     0.0599 ns |   2.61 |    0.21 |        - |
| NinoDeserializeSimpleStruct         |       0.4207 ns |       0.6128 ns |     0.0336 ns |   1.00 |    0.10 |        - |
|                                     |                 |                 |               |        |         |          |
| MessagePackSerializeSimpleStruct    |     154.2196 ns |      21.8190 ns |     1.1960 ns |  51.87 |    0.80 |      16B |
| MemoryPackSerializeSimpleStruct     |       3.8333 ns |       1.9537 ns |     0.1071 ns |   1.29 |    0.04 |      16B |
| NinoSerializeSimpleStruct           |       2.9734 ns |       0.8583 ns |     0.0470 ns |   1.00 |    0.02 |      16B |
|                                     |                 |                 |               |        |         |          |
| MessagePackDeserializeSimpleStructs |   2,235.5942 ns |     626.8883 ns |    34.3619 ns |  26.30 |    1.45 |        - |
| MemoryPackDeserializeSimpleStructs  |      97.7742 ns |      46.6630 ns |     2.5578 ns |   1.15 |    0.07 |        - |
| NinoDeserializeSimpleStructs        |      85.2357 ns |      99.3527 ns |     5.4459 ns |   1.00 |    0.08 |        - |
|                                     |                 |                 |               |        |         |          |
| MessagePackSerializeSimpleStructs   |  13,647.3813 ns |     775.5311 ns |    42.5095 ns | 555.22 |    1.65 |   1.57KB |
| MemoryPackSerializeSimpleStructs    |      28.4853 ns |      19.1274 ns |     1.0484 ns |   1.16 |    0.04 |   1.57KB |
| NinoSerializeSimpleStructs          |      24.5802 ns |       0.6500 ns |     0.0356 ns |   1.00 |    0.00 |   1.57KB |
|                                     |                 |                 |               |        |         |          |
| MessagePackDeserializeVectors       | 181,637.5767 ns | 102,623.6830 ns | 5,625.1504 ns |   9.00 |    0.70 |        - |
| MemoryPackDeserializeVectors        |  22,174.2897 ns |  21,590.9311 ns | 1,183.4718 ns |   1.10 |    0.09 |        - |
| NinoDeserializeVectors              |  20,290.9944 ns |  32,348.7139 ns | 1,773.1422 ns |   1.00 |    0.11 |        - |
|                                     |                 |                 |               |        |         |          |
| MessagePackSerializeVectors         | 135,819.9974 ns |   3,360.8390 ns |   184.2189 ns |  55.06 |    0.29 | 205.08KB |
| MemoryPackSerializeVectors          |   2,452.3720 ns |      87.4122 ns |     4.7914 ns |   0.99 |    0.01 | 156.25KB |
| NinoSerializeVectors                |   2,466.8759 ns |     263.8007 ns |    14.4598 ns |   1.00 |    0.01 | 156.25KB |

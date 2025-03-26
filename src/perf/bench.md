
| Method                              | Mean            | Error           | StdDev        | Ratio  | RatioSD | Payload  |
|------------------------------------ |----------------:|----------------:|--------------:|-------:|--------:|---------:|
| MessagePackDeserializeSimpleClass   |   1,154.3828 ns |      50.1848 ns |     2.7508 ns |   3.19 |    0.01 |        - |
| MemoryPackDeserializeSimpleClass    |     483.9542 ns |     522.7420 ns |    28.6533 ns |   1.34 |    0.07 |        - |
| NinoDeserializeSimpleClass          |     361.4855 ns |      30.2141 ns |     1.6561 ns |   1.00 |    0.01 |        - |
|                                     |                 |                 |               |        |         |          |
| MessagePackSerializeSimpleClass     |   1,759.8118 ns |      39.7284 ns |     2.1776 ns |  13.57 |    0.09 |   1.09KB |
| MemoryPackSerializeSimpleClass      |     316.6347 ns |     119.7628 ns |     6.5646 ns |   2.44 |    0.05 |   1.12KB |
| NinoSerializeSimpleClass            |     129.6768 ns |      17.8891 ns |     0.9806 ns |   1.00 |    0.01 |   1.13KB |
|                                     |                 |                 |               |        |         |          |
| MessagePackDeserializeSimpleClasses | 117,842.4767 ns |   2,055.7253 ns |   112.6812 ns |   3.14 |    0.01 |        - |
| MemoryPackDeserializeSimpleClasses  |  46,411.1388 ns |   1,902.1978 ns |   104.2659 ns |   1.24 |    0.00 |        - |
| NinoDeserializeSimpleClasses        |  37,528.9739 ns |   1,901.3606 ns |   104.2200 ns |   1.00 |    0.00 |        - |
|                                     |                 |                 |               |        |         |          |
| MessagePackSerializeSimpleClasses   | 183,775.6993 ns |     582.2287 ns |    31.9139 ns |  12.90 |    0.06 | 108.59KB |
| MemoryPackSerializeSimpleClasses    |  33,478.6564 ns |  25,493.8742 ns | 1,397.4053 ns |   2.35 |    0.09 | 112.11KB |
| NinoSerializeSimpleClasses          |  14,248.5986 ns |   1,417.8801 ns |    77.7188 ns |   1.00 |    0.01 |  112.5KB |
|                                     |                 |                 |               |        |         |          |
| MessagePackDeserializeSimpleStruct  |      49.0296 ns |      66.6456 ns |     3.6531 ns | 149.46 |    9.72 |        - |
| MemoryPackDeserializeSimpleStruct   |       0.9118 ns |       0.1365 ns |     0.0075 ns |   2.78 |    0.03 |        - |
| NinoDeserializeSimpleStruct         |       0.3281 ns |       0.0547 ns |     0.0030 ns |   1.00 |    0.01 |        - |
|                                     |                 |                 |               |        |         |          |
| MessagePackSerializeSimpleStruct    |     112.3146 ns |      51.2646 ns |     2.8100 ns |  37.20 |    1.89 |      16B |
| MemoryPackSerializeSimpleStruct     |       3.6370 ns |       0.1188 ns |     0.0065 ns |   1.20 |    0.06 |      16B |
| NinoSerializeSimpleStruct           |       3.0249 ns |       2.9522 ns |     0.1618 ns |   1.00 |    0.07 |      16B |
|                                     |                 |                 |               |        |         |          |
| MessagePackDeserializeSimpleStructs |   2,390.9548 ns |   1,932.5784 ns |   105.9311 ns |  26.36 |    1.01 |        - |
| MemoryPackDeserializeSimpleStructs  |     106.2449 ns |      80.1859 ns |     4.3953 ns |   1.17 |    0.04 |        - |
| NinoDeserializeSimpleStructs        |      90.6977 ns |       1.0714 ns |     0.0587 ns |   1.00 |    0.00 |        - |
|                                     |                 |                 |               |        |         |          |
| MessagePackSerializeSimpleStructs   |  12,987.7442 ns |      92.6262 ns |     5.0772 ns | 525.78 |    1.95 |   1.57KB |
| MemoryPackSerializeSimpleStructs    |      28.1483 ns |       8.4618 ns |     0.4638 ns |   1.14 |    0.02 |   1.57KB |
| NinoSerializeSimpleStructs          |      24.7020 ns |       1.9269 ns |     0.1056 ns |   1.00 |    0.01 |   1.57KB |
|                                     |                 |                 |               |        |         |          |
| MessagePackDeserializeVectors       | 189,357.2390 ns |  61,946.9116 ns | 3,395.5193 ns |   8.19 |    0.15 |        - |
| MemoryPackDeserializeVectors        |  24,289.2075 ns |  22,031.1468 ns | 1,207.6015 ns |   1.05 |    0.05 |        - |
| NinoDeserializeVectors              |  23,130.6682 ns |   4,959.7878 ns |   271.8627 ns |   1.00 |    0.01 |        - |
|                                     |                 |                 |               |        |         |          |
| MessagePackSerializeVectors         | 142,067.3285 ns | 123,778.8606 ns | 6,784.7370 ns |  47.98 |    8.26 | 205.08KB |
| MemoryPackSerializeVectors          |   2,464.2914 ns |     397.9048 ns |    21.8105 ns |   0.83 |    0.14 | 156.25KB |
| NinoSerializeVectors                |   3,028.2839 ns |   9,586.5175 ns |   525.4694 ns |   1.02 |    0.23 | 156.25KB |

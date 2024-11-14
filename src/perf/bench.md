
| Method                              | Mean            | Error       | StdDev      | Ratio  | RatioSD | Payload |
|------------------------------------ |----------------:|------------:|------------:|-------:|--------:|--------:|
| MessagePackDeserializeSimpleClass   |   1,424.7479 ns |   3.7171 ns |   4.1316 ns |   4.82 |    0.02 |       - |
| MemoryPackDeserializeSimpleClass    |     390.3019 ns |   0.9273 ns |   0.9523 ns |   1.32 |    0.01 |       - |
| NinoDeserializeSimpleClass          |     295.4810 ns |   1.0740 ns |   1.0549 ns |   1.00 |    0.00 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleClass     |   1,721.9408 ns |   6.9293 ns |   7.9798 ns |  10.06 |    0.05 |    700B |
| MemoryPackSerializeSimpleClass      |     359.4723 ns |   5.8777 ns |   6.0360 ns |   2.10 |    0.03 |    755B |
| NinoSerializeSimpleClass            |     171.1349 ns |   0.4741 ns |   0.4868 ns |   1.00 |    0.00 |    724B |
|                                     |                 |             |             |        |         |         |
| MessagePackDeserializeSimpleClasses | 140,477.3114 ns | 125.9446 ns | 123.6944 ns |   4.42 |    0.02 |       - |
| MemoryPackDeserializeSimpleClasses  |  39,954.5996 ns |  55.2358 ns |  59.1017 ns |   1.26 |    0.01 |       - |
| NinoDeserializeSimpleClasses        |  31,752.0961 ns | 125.0123 ns | 128.3784 ns |   1.00 |    0.01 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleClasses   | 177,284.9271 ns | 513.3446 ns | 570.5812 ns |  11.97 |    0.14 | 68.36KB |
| MemoryPackSerializeSimpleClasses    |  34,313.0955 ns |  41.9802 ns |  41.2302 ns |   2.32 |    0.03 | 73.73KB |
| NinoSerializeSimpleClasses          |  14,817.4645 ns | 162.0343 ns | 173.3749 ns |   1.00 |    0.02 | 70.71KB |
|                                     |                 |             |             |        |         |         |
| MessagePackDeserializeSimpleStruct  |      42.7664 ns |   0.0872 ns |   0.0969 ns | 111.95 |    0.28 |       - |
| MemoryPackDeserializeSimpleStruct   |       0.9871 ns |   0.0266 ns |   0.0284 ns |   2.58 |    0.07 |       - |
| NinoDeserializeSimpleStruct         |       0.3820 ns |   0.0004 ns |   0.0005 ns |   1.00 |    0.00 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleStruct    |     139.9886 ns |   0.3103 ns |   0.3573 ns |  38.35 |    0.12 |     16B |
| MemoryPackSerializeSimpleStruct     |       3.8768 ns |   0.0048 ns |   0.0047 ns |   1.06 |    0.00 |     16B |
| NinoSerializeSimpleStruct           |       3.6508 ns |   0.0070 ns |   0.0072 ns |   1.00 |    0.00 |     16B |
|                                     |                 |             |             |        |         |         |
| MessagePackDeserializeSimpleStructs |   2,368.1972 ns |   2.4184 ns |   2.5877 ns |  28.21 |    0.20 |       - |
| MemoryPackDeserializeSimpleStructs  |      98.0227 ns |   0.3981 ns |   0.4424 ns |   1.17 |    0.01 |       - |
| NinoDeserializeSimpleStructs        |      83.9503 ns |   0.6401 ns |   0.6286 ns |   1.00 |    0.01 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleStructs   |  13,012.0680 ns |   8.7037 ns |   8.9380 ns | 159.69 |    1.22 |  1.57KB |
| MemoryPackSerializeSimpleStructs    |      85.1753 ns |   0.1523 ns |   0.1564 ns |   1.05 |    0.01 |  1.57KB |
| NinoSerializeSimpleStructs          |      81.4862 ns |   0.6309 ns |   0.6479 ns |   1.00 |    0.01 |  1.57KB |
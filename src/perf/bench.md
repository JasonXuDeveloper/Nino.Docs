
| Method                              | Mean            | Error         | StdDev        | Ratio  | RatioSD | Payload |
|------------------------------------ |----------------:|--------------:|--------------:|-------:|--------:|--------:|
| MessagePackDeserializeSimpleClass   |   1,602.0408 ns |   280.3694 ns |   299.9921 ns |   5.38 |    0.98 |       - |
| MemoryPackDeserializeSimpleClass    |     397.5460 ns |     3.3675 ns |     3.8780 ns |   1.34 |    0.01 |       - |
| NinoDeserializeSimpleClass          |     297.6154 ns |     1.4498 ns |     1.5513 ns |   1.00 |    0.01 |       - |
|                                     |                 |               |               |        |         |         |
| MessagePackSerializeSimpleClass     |   1,657.7894 ns |     4.5565 ns |     4.8754 ns |  11.23 |    0.10 |    700B |
| MemoryPackSerializeSimpleClass      |     304.6196 ns |     0.7492 ns |     0.7694 ns |   2.06 |    0.02 |    755B |
| NinoSerializeSimpleClass            |     147.6062 ns |     1.1318 ns |     1.2580 ns |   1.00 |    0.01 |    764B |
|                                     |                 |               |               |        |         |         |
| MessagePackDeserializeSimpleClasses | 140,946.4577 ns |   848.1796 ns |   942.7494 ns |   4.37 |    0.03 |       - |
| MemoryPackDeserializeSimpleClasses  |  42,786.8541 ns | 2,069.6410 ns | 2,300.4005 ns |   1.33 |    0.07 |       - |
| NinoDeserializeSimpleClasses        |  32,288.3471 ns |   149.7238 ns |   153.7553 ns |   1.00 |    0.01 |       - |
|                                     |                 |               |               |        |         |         |
| MessagePackSerializeSimpleClasses   | 172,452.4950 ns | 1,172.9818 ns | 1,204.5659 ns |  10.81 |    0.09 | 68.36KB |
| MemoryPackSerializeSimpleClasses    |  30,826.6337 ns |    84.3488 ns |    97.1362 ns |   1.93 |    0.01 | 73.73KB |
| NinoSerializeSimpleClasses          |  15,947.5854 ns |    59.9199 ns |    66.6008 ns |   1.00 |    0.01 |    75KB |
|                                     |                 |               |               |        |         |         |
| MessagePackDeserializeSimpleStruct  |      43.7595 ns |     0.1092 ns |     0.1258 ns | 113.48 |   11.85 |       - |
| MemoryPackDeserializeSimpleStruct   |       1.0714 ns |     0.0494 ns |     0.0549 ns |   2.78 |    0.32 |       - |
| NinoDeserializeSimpleStruct         |       0.3898 ns |     0.0357 ns |     0.0411 ns |   1.01 |    0.15 |       - |
|                                     |                 |               |               |        |         |         |
| MessagePackSerializeSimpleStruct    |     144.3852 ns |     0.2121 ns |     0.2358 ns |  28.96 |    0.10 |     16B |
| MemoryPackSerializeSimpleStruct     |       4.7252 ns |     0.0237 ns |     0.0253 ns |   0.95 |    0.01 |     16B |
| NinoSerializeSimpleStruct           |       4.9861 ns |     0.0155 ns |     0.0159 ns |   1.00 |    0.00 |     16B |
|                                     |                 |               |               |        |         |         |
| MessagePackDeserializeSimpleStructs |   2,419.0113 ns |     8.5478 ns |     9.5008 ns |  28.80 |    0.30 |       - |
| MemoryPackDeserializeSimpleStructs  |      97.6313 ns |     0.4855 ns |     0.5194 ns |   1.16 |    0.01 |       - |
| NinoDeserializeSimpleStructs        |      84.0014 ns |     0.8208 ns |     0.8429 ns |   1.00 |    0.01 |       - |
|                                     |                 |               |               |        |         |         |
| MessagePackSerializeSimpleStructs   |  13,319.6423 ns |    31.5738 ns |    33.7837 ns | 275.38 |    0.77 |  1.57KB |
| MemoryPackSerializeSimpleStructs    |      51.6987 ns |     0.0849 ns |     0.0872 ns |   1.07 |    0.00 |  1.57KB |
| NinoSerializeSimpleStructs          |      48.3674 ns |     0.0613 ns |     0.0656 ns |   1.00 |    0.00 |  1.57KB |


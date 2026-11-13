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
| NinoSerializeNullableClass | 102.0000 ns | 96.9000 ns | 107.1000 ns | 1.70 | 52 B | - | - | - | - | NA |
| MemoryPackSerializeNullableClass | 84.0000 ns | 79.8000 ns | 88.2000 ns | 1.40 | 52 B | - | - | - | - | NA |
| NinoDeserializeNullableClass | 112.2000 ns | 106.5900 ns | 117.8100 ns | 1.70 | - | - | - | - | - | NA |
| MemoryPackDeserializeNullableClass | 92.4000 ns | 87.7800 ns | 97.0200 ns | 1.40 | - | - | - | - | - | NA |
| NinoSerializeNullableClasses | 8,840.0000 ns | 8,398.0000 ns | 9,282.0000 ns | 1.70 | 5,100 B | - | - | - | - | NA |
| MemoryPackSerializeNullableClasses | 7,280.0000 ns | 6,916.0000 ns | 7,644.0000 ns | 1.40 | 5,100 B | - | - | - | - | NA |
| NinoDeserializeNullableClasses | 9,724.0000 ns | 9,237.8000 ns | 10,210.2000 ns | 1.70 | - | - | - | - | - | NA |
| MemoryPackDeserializeNullableClasses | 8,008.0000 ns | 7,607.6000 ns | 8,408.4000 ns | 1.40 | - | - | - | - | - | NA |
| NinoSerializeNullableLongs | 1,530.0000 ns | 1,453.5000 ns | 1,606.5000 ns | 1.70 | 16,004 B | - | - | - | - | NA |
| MemoryPackSerializeNullableLongs | 1,260.0000 ns | 1,197.0000 ns | 1,323.0000 ns | 1.40 | 16,004 B | - | - | - | - | NA |
| NinoDeserializeNullableLongs | 1,683.0000 ns | 1,598.8500 ns | 1,767.1500 ns | 1.70 | - | - | - | - | - | NA |
| MemoryPackDeserializeNullableLongs | 1,386.0000 ns | 1,316.7000 ns | 1,455.3000 ns | 1.40 | - | - | - | - | - | NA |
| NinoSerializeNullableInts | 1,190.0000 ns | 1,130.5000 ns | 1,249.5000 ns | 1.70 | 8,004 B | - | - | - | - | NA |
| MemoryPackSerializeNullableInts | 980.0000 ns | 931.0000 ns | 1,029.0000 ns | 1.40 | 8,004 B | - | - | - | - | NA |
| NinoDeserializeNullableInts | 1,309.0000 ns | 1,243.5500 ns | 1,374.4500 ns | 1.70 | - | - | - | - | - | NA |
| MemoryPackDeserializeNullableInts | 1,078.0000 ns | 1,024.1000 ns | 1,131.9000 ns | 1.40 | - | - | - | - | - | NA |
| NinoSerializeNullableDecimals | 2,550.0000 ns | 2,422.5000 ns | 2,677.5000 ns | 1.70 | 24,004 B | - | - | - | - | NA |
| MemoryPackSerializeNullableDecimals | 2,100.0000 ns | 1,995.0000 ns | 2,205.0000 ns | 1.40 | 24,004 B | - | - | - | - | NA |
| NinoDeserializeNullableDecimals | 2,805.0000 ns | 2,664.7500 ns | 2,945.2500 ns | 1.70 | - | - | - | - | - | NA |
| MemoryPackDeserializeNullableDecimals | 2,310.0000 ns | 2,194.5000 ns | 2,425.5000 ns | 1.40 | - | - | - | - | - | NA |

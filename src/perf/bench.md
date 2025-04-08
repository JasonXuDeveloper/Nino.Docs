
| Method                              | Mean            | Error          | StdDev        | Ratio  | RatioSD | Payload  |
|------------------------------------ |----------------:|---------------:|--------------:|-------:|--------:|---------:|
| MessagePackDeserializeSimpleClass   |   2,185.4818 ns |  1,603.2680 ns |    87.8805 ns |   5.17 |    0.30 |        - |
| MemoryPackDeserializeSimpleClass    |     803.8791 ns |  2,727.8901 ns |   149.5249 ns |   1.90 |    0.32 |        - |
| NinoDeserializeSimpleClass          |     423.6331 ns |    392.2947 ns |    21.5030 ns |   1.00 |    0.06 |        - |
|                                     |                 |                |               |        |         |          |
| MessagePackSerializeSimpleClass     |   1,756.9635 ns |    162.8690 ns |     8.9274 ns |  13.68 |    0.07 |   1.09KB |
| MemoryPackSerializeSimpleClass      |     313.9742 ns |     36.5482 ns |     2.0033 ns |   2.44 |    0.02 |   1.12KB |
| NinoSerializeSimpleClass            |     128.4621 ns |      7.9049 ns |     0.4333 ns |   1.00 |    0.00 |   1.13KB |
|                                     |                 |                |               |        |         |          |
| MessagePackDeserializeSimpleClasses | 121,233.0085 ns |  3,000.5145 ns |   164.4683 ns |   3.25 |    0.05 |        - |
| MemoryPackDeserializeSimpleClasses  |  46,809.5000 ns |  4,394.9217 ns |   240.9005 ns |   1.26 |    0.02 |        - |
| NinoDeserializeSimpleClasses        |  37,274.2878 ns | 11,407.1823 ns |   625.2662 ns |   1.00 |    0.02 |        - |
|                                     |                 |                |               |        |         |          |
| MessagePackSerializeSimpleClasses   | 184,607.4591 ns | 46,237.6641 ns | 2,534.4424 ns |  12.92 |    0.15 |  108.6KB |
| MemoryPackSerializeSimpleClasses    |  32,528.3135 ns |  1,266.2714 ns |    69.4086 ns |   2.28 |    0.00 | 112.11KB |
| NinoSerializeSimpleClasses          |  14,286.7016 ns |    143.3106 ns |     7.8553 ns |   1.00 |    0.00 |  112.5KB |
|                                     |                 |                |               |        |         |          |
| MessagePackDeserializeSimpleStruct  |      46.9248 ns |      1.2035 ns |     0.0660 ns | 120.31 |    9.26 |        - |
| MemoryPackDeserializeSimpleStruct   |       0.9389 ns |      0.2493 ns |     0.0137 ns |   2.41 |    0.19 |        - |
| NinoDeserializeSimpleStruct         |       0.3922 ns |      0.6706 ns |     0.0368 ns |   1.01 |    0.11 |        - |
|                                     |                 |                |               |        |         |          |
| MessagePackSerializeSimpleStruct    |     146.7111 ns |      1.6760 ns |     0.0919 ns |  52.05 |    0.62 |      16B |
| MemoryPackSerializeSimpleStruct     |       3.6404 ns |      0.0488 ns |     0.0027 ns |   1.29 |    0.02 |      16B |
| NinoSerializeSimpleStruct           |       2.8189 ns |      0.7128 ns |     0.0391 ns |   1.00 |    0.02 |      16B |
|                                     |                 |                |               |        |         |          |
| MessagePackDeserializeSimpleStructs |   2,247.0066 ns |     81.3845 ns |     4.4610 ns |  24.59 |    0.13 |        - |
| MemoryPackDeserializeSimpleStructs  |     106.7077 ns |     55.1043 ns |     3.0205 ns |   1.17 |    0.03 |        - |
| NinoDeserializeSimpleStructs        |      91.3917 ns |      9.9898 ns |     0.5476 ns |   1.00 |    0.01 |        - |
|                                     |                 |                |               |        |         |          |
| MessagePackSerializeSimpleStructs   |  13,201.4372 ns |    552.1785 ns |    30.2668 ns | 528.49 |    1.06 |   1.57KB |
| MemoryPackSerializeSimpleStructs    |      27.9057 ns |      0.0661 ns |     0.0036 ns |   1.12 |    0.00 |   1.57KB |
| NinoSerializeSimpleStructs          |      24.9794 ns |      0.1411 ns |     0.0077 ns |   1.00 |    0.00 |   1.57KB |
|                                     |                 |                |               |        |         |          |
| MessagePackDeserializeVectors       | 192,061.3674 ns | 72,587.8909 ns | 3,978.7873 ns |   8.44 |    0.60 |        - |
| MemoryPackDeserializeVectors        |  22,620.0659 ns |  3,408.8960 ns |   186.8531 ns |   0.99 |    0.07 |        - |
| NinoDeserializeVectors              |  22,848.6769 ns | 33,779.9756 ns | 1,851.5945 ns |   1.00 |    0.10 |        - |
|                                     |                 |                |               |        |         |          |
| MessagePackSerializeVectors         | 135,550.9609 ns |  2,408.4577 ns |   132.0157 ns |  55.23 |    0.20 | 205.08KB |
| MemoryPackSerializeVectors          |   2,487.1241 ns |    385.5445 ns |    21.1330 ns |   1.01 |    0.01 | 156.25KB |
| NinoSerializeVectors                |   2,454.1336 ns |    184.7375 ns |    10.1261 ns |   1.00 |    0.01 | 156.25KB |


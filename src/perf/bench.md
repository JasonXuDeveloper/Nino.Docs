| Method                              | Mean            | Error       | StdDev      | Ratio  | RatioSD | Payload |
|------------------------------------ |----------------:|------------:|------------:|-------:|--------:|--------:|
| MessagePackDeserializeSimpleClass   |   1,184.5140 ns |   2.1443 ns |   2.2021 ns |   3.48 |    0.01 |       - |
| MemoryPackDeserializeSimpleClass    |     441.6403 ns |   0.5283 ns |   0.5653 ns |   1.30 |    0.00 |       - |
| NinoDeserializeSimpleClass          |     340.8097 ns |   0.8696 ns |   0.8134 ns |   1.00 |    0.00 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleClass     |   1,769.6100 ns |   1.3790 ns |   1.4755 ns |   9.03 |    0.03 |    674B |
| MemoryPackSerializeSimpleClass      |     345.1466 ns |   0.4682 ns |   0.5010 ns |   1.76 |    0.01 |    730B |
| NinoSerializeSimpleClass            |     195.8985 ns |   0.5028 ns |   0.5380 ns |   1.00 |    0.00 |    738B |
|                                     |                 |             |             |        |         |         |
| MessagePackDeserializeSimpleClasses | 118,437.4463 ns |  78.6513 ns |  90.5749 ns |   2.61 |    0.00 |       - |
| MemoryPackDeserializeSimpleClasses  |  43,763.9444 ns |  56.9656 ns |  63.3171 ns |   0.97 |    0.00 |       - |
| NinoDeserializeSimpleClasses        |  45,321.6678 ns |  65.7144 ns |  73.0414 ns |   1.00 |    0.00 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleClasses   | 192,961.7152 ns | 642.3698 ns | 630.8930 ns |  11.47 |    0.10 | 65.82KB |
| MemoryPackSerializeSimpleClasses    |  31,484.0855 ns | 120.2774 ns | 123.5160 ns |   1.87 |    0.02 | 71.29KB |
| NinoSerializeSimpleClasses          |  16,831.1844 ns | 135.8753 ns | 145.3851 ns |   1.00 |    0.01 | 72.08KB |
|                                     |                 |             |             |        |         |         |
| MessagePackDeserializeSimpleStruct  |      49.1841 ns |   0.0283 ns |   0.0278 ns | 119.05 |    1.05 |       - |
| MemoryPackDeserializeSimpleStruct   |       0.9737 ns |   0.0176 ns |   0.0173 ns |   2.36 |    0.05 |       - |
| NinoDeserializeSimpleStruct         |       0.4132 ns |   0.0037 ns |   0.0038 ns |   1.00 |    0.01 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleStruct    |     163.4290 ns |   0.1529 ns |   0.1636 ns |  45.37 |    0.28 |     16B |
| MemoryPackSerializeSimpleStruct     |       3.9490 ns |   0.0083 ns |   0.0085 ns |   1.10 |    0.01 |     16B |
| NinoSerializeSimpleStruct           |       3.6027 ns |   0.0206 ns |   0.0229 ns |   1.00 |    0.01 |     16B |
|                                     |                 |             |             |        |         |         |
| MessagePackDeserializeSimpleStructs |   2,805.5809 ns |   4.3408 ns |   4.8248 ns |  33.81 |    0.19 |       - |
| MemoryPackDeserializeSimpleStructs  |      95.5825 ns |   0.6892 ns |   0.7661 ns |   1.15 |    0.01 |       - |
| NinoDeserializeSimpleStructs        |      82.9915 ns |   0.3921 ns |   0.4515 ns |   1.00 |    0.01 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleStructs   |  13,738.2932 ns |  18.6947 ns |  20.7791 ns | 163.03 |    1.11 |  1.57KB |
| MemoryPackSerializeSimpleStructs    |      87.5151 ns |   0.4402 ns |   0.4893 ns |   1.04 |    0.01 |  1.57KB |
| NinoSerializeSimpleStructs          |      84.2700 ns |   0.5567 ns |   0.5717 ns |   1.00 |    0.01 |  1.57KB |
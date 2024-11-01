
| Method                              | Mean           | Error       | StdDev      | Min            | Max            | Ratio | RatioSD | Payload |
|------------------------------------ |---------------:|------------:|------------:|---------------:|---------------:|------:|--------:|--------:|
| MessagePackDeserializeSimpleClass   |  1,148.5943 ns |  17.8527 ns |  11.8085 ns |  1,139.0573 ns |  1,173.6618 ns |  1.00 |    0.01 |       - |
| MemoryPackDeserializeSimpleClass    |    420.5007 ns |  12.8729 ns |   7.6604 ns |    415.1103 ns |    437.1265 ns |  0.37 |    0.01 |       - |
| NinoDeserializeSimpleClass          |    356.6948 ns |   2.6454 ns |   1.5742 ns |    355.0230 ns |    358.9928 ns |  0.31 |    0.00 |       - |
|                                     |                |             |             |                |                |       |         |         |
| MessagePackSerializeSimpleClass     |  2,002.3146 ns |   1.3240 ns |   0.7879 ns |  2,001.1621 ns |  2,003.4642 ns |  1.00 |    0.00 |    674B |
| MemoryPackSerializeSimpleClass      |    414.5464 ns |   1.7001 ns |   0.8892 ns |    413.5713 ns |    416.0362 ns |  0.21 |    0.00 |    730B |
| NinoSerializeSimpleClass            |    190.2825 ns |   1.0319 ns |   0.6141 ns |    189.3989 ns |    191.3875 ns |  0.10 |    0.00 |    738B |
|                                     |                |             |             |                |                |       |         |         |
| MessagePackDeserializeSimpleClasses | 39,170.7236 ns | 126.3171 ns |  66.0663 ns | 39,097.9411 ns | 39,277.8193 ns |  1.00 |    0.00 |       - |
| MemoryPackDeserializeSimpleClasses  | 12,257.0101 ns |  67.1677 ns |  44.4273 ns | 12,214.9843 ns | 12,343.1028 ns |  0.31 |    0.00 |       - |
| NinoDeserializeSimpleClasses        | 11,248.9657 ns |  87.6847 ns |  52.1798 ns | 11,193.1693 ns | 11,341.3696 ns |  0.29 |    0.00 |       - |
|                                     |                |             |             |                |                |       |         |         |
| MessagePackSerializeSimpleClasses   | 59,292.6239 ns | 142.0982 ns |  93.9892 ns | 59,131.9020 ns | 59,444.3359 ns |  1.00 |    0.00 | 19.75KB |
| MemoryPackSerializeSimpleClasses    | 11,822.4789 ns |  56.6987 ns |  33.7405 ns | 11,757.4730 ns | 11,872.7519 ns |  0.20 |    0.00 | 21.39KB |
| NinoSerializeSimpleClasses          |  5,188.5066 ns |  45.6429 ns |  27.1614 ns |  5,154.5782 ns |  5,231.3837 ns |  0.09 |    0.00 | 21.63KB |
|                                     |                |             |             |                |                |       |         |         |
| MessagePackDeserializeSimpleStruct  |     48.2807 ns |   0.0556 ns |   0.0291 ns |     48.2505 ns |     48.3365 ns |  1.00 |    0.00 |       - |
| MemoryPackDeserializeSimpleStruct   |      1.6136 ns |   0.0042 ns |   0.0022 ns |      1.6111 ns |      1.6183 ns |  0.03 |    0.00 |       - |
| NinoDeserializeSimpleStruct         |      0.5304 ns |   0.0012 ns |   0.0007 ns |      0.5296 ns |      0.5318 ns |  0.01 |    0.00 |       - |
|                                     |                |             |             |                |                |       |         |         |
| MessagePackSerializeSimpleStruct    |    153.6537 ns |   0.8933 ns |   0.5909 ns |    152.7751 ns |    154.5303 ns |  1.00 |    0.01 |     16B |
| MemoryPackSerializeSimpleStruct     |      4.0122 ns |   0.0062 ns |   0.0041 ns |      4.0028 ns |      4.0168 ns |  0.03 |    0.00 |     16B |
| NinoSerializeSimpleStruct           |      3.2271 ns |   0.0057 ns |   0.0030 ns |      3.2217 ns |      3.2319 ns |  0.02 |    0.00 |     16B |
|                                     |                |             |             |                |                |       |         |         |
| MessagePackDeserializeSimpleStructs |    855.9153 ns |   0.6412 ns |   0.3353 ns |    855.4707 ns |    856.4600 ns |  1.00 |    0.00 |       - |
| MemoryPackDeserializeSimpleStructs  |     48.8051 ns |   0.6039 ns |   0.3593 ns |     48.4396 ns |     49.3680 ns |  0.06 |    0.00 |       - |
| NinoDeserializeSimpleStructs        |     33.4900 ns |   0.3035 ns |   0.1806 ns |     33.2976 ns |     33.8873 ns |  0.04 |    0.00 |       - |
|                                     |                |             |             |                |                |       |         |         |
| MessagePackSerializeSimpleStructs   |  4,268.2807 ns | 187.1797 ns | 123.8078 ns |  4,137.8412 ns |  4,484.2037 ns | 1.001 |    0.04 |    483B |
| MemoryPackSerializeSimpleStructs    |     36.2638 ns |   0.7035 ns |   0.4654 ns |     35.7722 ns |     37.0379 ns | 0.009 |    0.00 |    484B |
| NinoSerializeSimpleStructs          |     29.2845 ns |   0.2110 ns |   0.1396 ns |     29.1213 ns |     29.5252 ns | 0.007 |    0.00 |    486B |
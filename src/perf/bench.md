
| Method                              | Mean            | Error       | StdDev      | Ratio  | RatioSD | Payload |
|------------------------------------ |----------------:|------------:|------------:|-------:|--------:|--------:|
| MessagePackDeserializeSimpleClass   |   1,189.1591 ns |   2.6112 ns |   3.0071 ns |   3.44 |    0.02 |       - |
| MemoryPackDeserializeSimpleClass    |     386.6335 ns |   6.0955 ns |   6.2597 ns |   1.12 |    0.02 |       - |
| NinoDeserializeSimpleClass          |     345.9820 ns |   1.2995 ns |   1.3345 ns |   1.00 |    0.01 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleClass     |   1,638.9940 ns |   4.8849 ns |   5.4295 ns |   8.34 |    0.03 |    674B |
| MemoryPackSerializeSimpleClass      |     345.3897 ns |   0.5703 ns |   0.6102 ns |   1.76 |    0.00 |    730B |
| NinoSerializeSimpleClass            |     196.4610 ns |   0.1776 ns |   0.2045 ns |   1.00 |    0.00 |    738B |
|                                     |                 |             |             |        |         |         |
| MessagePackDeserializeSimpleClasses | 118,102.4352 ns |  43.1878 ns |  48.0031 ns |   3.11 |    0.01 |       - |
| MemoryPackDeserializeSimpleClasses  |  39,079.8249 ns |  32.2887 ns |  33.1581 ns |   1.03 |    0.00 |       - |
| NinoDeserializeSimpleClasses        |  37,926.0608 ns |  96.1285 ns | 106.8466 ns |   1.00 |    0.00 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleClasses   | 190,110.8829 ns | 646.5527 ns | 744.5710 ns |  11.29 |    0.09 | 65.82KB |
| MemoryPackSerializeSimpleClasses    |  31,656.0714 ns |  94.5945 ns | 105.1415 ns |   1.88 |    0.01 | 71.29KB |
| NinoSerializeSimpleClasses          |  16,840.9377 ns | 111.0911 ns | 123.4774 ns |   1.00 |    0.01 | 72.08KB |
|                                     |                 |             |             |        |         |         |
| MessagePackDeserializeSimpleStruct  |      48.9905 ns |   0.0223 ns |   0.0219 ns | 130.80 |    0.17 |       - |
| MemoryPackDeserializeSimpleStruct   |       0.9634 ns |   0.0158 ns |   0.0169 ns |   2.57 |    0.04 |       - |
| NinoDeserializeSimpleStruct         |       0.3746 ns |   0.0004 ns |   0.0005 ns |   1.00 |    0.00 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleStruct    |     141.2677 ns |   0.3008 ns |   0.3343 ns |  38.20 |    0.19 |     16B |
| MemoryPackSerializeSimpleStruct     |       3.9620 ns |   0.0240 ns |   0.0246 ns |   1.07 |    0.01 |     16B |
| NinoSerializeSimpleStruct           |       3.6983 ns |   0.0161 ns |   0.0172 ns |   1.00 |    0.01 |     16B |
|                                     |                 |             |             |        |         |         |
| MessagePackDeserializeSimpleStructs |   2,794.3856 ns |   2.4233 ns |   2.7907 ns |  33.28 |    0.15 |       - |
| MemoryPackDeserializeSimpleStructs  |     111.8475 ns |   0.3823 ns |   0.3926 ns |   1.33 |    0.01 |       - |
| NinoDeserializeSimpleStructs        |      83.9682 ns |   0.3803 ns |   0.3905 ns |   1.00 |    0.01 |       - |
|                                     |                 |             |             |        |         |         |
| MessagePackSerializeSimpleStructs   |  13,915.2471 ns |  18.5713 ns |  19.8711 ns | 171.61 |    0.32 |  1.57KB |
| MemoryPackSerializeSimpleStructs    |      86.5175 ns |   1.1389 ns |   1.3116 ns |   1.07 |    0.02 |  1.57KB |
| NinoSerializeSimpleStructs          |      81.0850 ns |   0.1019 ns |   0.1047 ns |   1.00 |    0.00 |  1.57KB |

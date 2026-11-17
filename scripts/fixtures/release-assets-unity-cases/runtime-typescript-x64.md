## 🌐 TypeScript runtime benchmark

<details>
<summary>Generated TypeScript of v4.0.0-rc.10 against Protocol Buffers, MessagePack and JSON, in Node</summary>

`runtimes/typescript/bench` (tinybench 6.2.2, in Node v24.11.1): the .NET suite's cases, read from the bytes Nino.Benchmark writes and written back to them, with the code nino-gen generates (`Nino`) against Protocol Buffers (protobuf-es, on the messages of the suite's .proto files), MessagePack (msgpackr) and `JSON` (to and from UTF-8 bytes), each only where it reads the case back: the mean time of a pass over each case's value (each pass the next of up to 64 variants, so that no pass reads what the one before read), ± its relative margin of error, and passes per second.

| Case | Operation | Nino | Protobuf | MessagePack | JSON |
|---|---|--:|--:|--:|--:|
| Players | serialize | 651.05 μs ±0.9% (1,536/s) |  | 870.12 μs ±0.6% (1,149/s) | 450.36 μs ±3% (2,220/s) |
| Players | serializeInto | 149.51 μs ±2% (6,689/s) |  |  |  |
| Players | deserialize | 120.71 μs ±2% (8,284/s) |  | 851.92 μs ±3% (1,174/s) | 1.16 ms ±2% (865/s) |
| Players | size | 209.0 KiB |  | 69.8 KiB | 282.7 KiB |
| Zoos | serialize | 97.93 μs ±3% (10,211/s) |  | 1.28 ms ±2% (781/s) | 1.36 ms ±2% (734/s) |
| Zoos | serializeInto | 292.79 μs ±0.7% (3,415/s) |  |  |  |
| Zoos | deserialize | 1.63 ms ±1.0% (612/s) |  | 130.26 μs ±0.5% (7,677/s) | 1.17 ms ±2% (852/s) |
| Zoos | size | 333.7 KiB |  | 513.1 KiB | 350.7 KiB |
| NullableLongs | serialize | 1.59 ms ±3% (629/s) | 240.54 μs ±2% (4,157/s) | 1.34 ms ±3% (747/s) | 1.19 ms ±2% (840/s) |
| NullableLongs | serializeInto | 1.15 ms ±2% (869/s) |  |  |  |
| NullableLongs | deserialize | 1.46 ms ±1% (685/s) | 308.21 μs ±2% (3,245/s) | 1.75 ms ±1% (571/s) | 1.68 ms ±4% (595/s) |
| NullableLongs | size | 14.3 KiB | 31.1 KiB | 25.1 KiB | 21.2 KiB |
| Articles | serialize | 1.33 ms ±0.5% (752/s) |  | 50.01 μs ±2% (19,996/s) | 263.03 μs ±1% (3,802/s) |
| Articles | serializeInto | 1.30 ms ±4% (772/s) |  |  |  |
| Articles | deserialize | 572.77 μs ±2% (1,746/s) |  | 238.61 μs ±0.5% (4,191/s) | 1.74 ms ±0.6% (574/s) |
| Articles | size | 805.8 KiB |  | 323.9 KiB | 525.3 KiB |
| HashSet | serialize | 1.10 ms ±4% (908/s) |  | 306.09 μs ±0.9% (3,267/s) | 529.18 μs ±0.3% (1,890/s) |
| HashSet | serializeInto | 1.73 ms ±1% (578/s) |  |  |  |
| HashSet | deserialize | 720.75 μs ±4% (1,387/s) |  | 470.51 μs ±2% (2,125/s) | 741.66 μs ±2% (1,348/s) |
| HashSet | size | 8.3 KiB |  | 3.5 KiB | 5.0 KiB |

</details>

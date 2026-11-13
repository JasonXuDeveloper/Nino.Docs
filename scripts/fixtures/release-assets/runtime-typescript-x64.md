## 🌐 TypeScript runtime benchmark

<details>
<summary>Generated TypeScript of v4.0.0-rc.9 against Protocol Buffers, MessagePack and JSON, in Node</summary>

The code nino-gen generates for `runtimes/typescript/bench` (`Program.cs`'s types), against Protocol Buffers (protobuf-es), MessagePack (msgpackr) and `JSON`, in Node v22.18.0, on data .NET wrote, timed by tinybench 5.0.0: the mean time of a pass over each scenario's values, ± its relative margin of error, and passes per second.

| Scenario | Operation | Nino | Protobuf | MessagePack | JSON |
|---|---|--:|--:|--:|--:|
| Player x1000 | serialize | 242.85 μs ±0.4% (4,118/s) | 554.10 μs ±3% (1,805/s) | 638.19 μs ±0.9% (1,567/s) | 1.13 ms ±3% (888/s) |
| Player x1000 | deserialize | 290.51 μs ±0.6% (3,442/s) | 467.70 μs ±0.5% (2,138/s) | 676.80 μs ±0.5% (1,478/s) | 1.16 ms ±2% (864/s) |
| Player x1000 | size | 116.3 KiB | 127.9 KiB | 162.8 KiB | 255.9 KiB |
| Zoo 50 x 100 animals (type ids) | serialize | 109.76 μs ±3% (9,111/s) | 219.14 μs ±0.7% (4,563/s) | 340.42 μs ±0.8% (2,938/s) | 466.69 μs ±2% (2,143/s) |
| Zoo 50 x 100 animals (type ids) | deserialize | 92.09 μs ±3% (10,859/s) | 200.93 μs ±1% (4,977/s) | 309.64 μs ±2% (3,230/s) | 399.49 μs ±0.5% (2,503/s) |
| Zoo 50 x 100 animals (type ids) | size | 338.9 KiB | 372.7 KiB | 474.4 KiB | 745.5 KiB |
| OrderBook 100 x 50 orders | serialize | 194.45 μs ±2% (5,143/s) | 378.26 μs ±1.0% (2,644/s) | 407.08 μs ±1% (2,456/s) | 806.11 μs ±2% (1,241/s) |
| OrderBook 100 x 50 orders | deserialize | 188.88 μs ±3% (5,294/s) | 346.11 μs ±2% (2,889/s) | 497.55 μs ±1% (2,010/s) | 670.12 μs ±2% (1,492/s) |
| OrderBook 100 x 50 orders | size | 387.4 KiB | 426.2 KiB | 542.4 KiB | 852.3 KiB |
| Article x200 (text) | serialize | 143.96 μs ±2% (6,946/s) | 398.29 μs ±2% (2,511/s) | 479.68 μs ±2% (2,085/s) | 839.73 μs ±3% (1,191/s) |
| Article x200 (text) | deserialize | 135.55 μs ±2% (7,377/s) | 415.67 μs ±1% (2,406/s) | 457.30 μs ±2% (2,187/s) | 722.37 μs ±2% (1,384/s) |
| Article x200 (text) | size | 214.2 KiB | 235.6 KiB | 299.9 KiB | 471.2 KiB |
| Mesh 20 x (2 x 500 Vec3, 1500 int) | serialize | 121.72 μs ±3% (8,215/s) | 228.07 μs ±2% (4,385/s) | 253.95 μs ±0.6% (3,938/s) | 411.64 μs ±1.0% (2,429/s) |
| Mesh 20 x (2 x 500 Vec3, 1500 int) | deserialize | 130.50 μs ±1% (7,663/s) | 189.78 μs ±2% (5,269/s) | 239.71 μs ±2% (4,172/s) | 468.11 μs ±3% (2,136/s) |
| Mesh 20 x (2 x 500 Vec3, 1500 int) | size | 197.6 KiB | 217.3 KiB | 276.6 KiB | 434.7 KiB |
| Samples 20 x (3 x 1000 numbers) | serialize | 119.55 μs ±1% (8,364/s) | 268.18 μs ±2% (3,729/s) | 307.82 μs ±0.9% (3,249/s) | 574.68 μs ±0.3% (1,740/s) |
| Samples 20 x (3 x 1000 numbers) | deserialize | 105.03 μs ±1% (9,521/s) | 318.43 μs ±2% (3,140/s) | 265.39 μs ±0.7% (3,768/s) | 615.38 μs ±0.8% (1,625/s) |
| Samples 20 x (3 x 1000 numbers) | size | 269.0 KiB | 296.0 KiB | 376.7 KiB | 591.9 KiB |
| Lookup 50 x (2 maps of 100) | serialize | 224.00 μs ±1% (4,464/s) | 528.56 μs ±2% (1,892/s) | 485.65 μs ±3% (2,059/s) | 1.13 ms ±1% (885/s) |
| Lookup 50 x (2 maps of 100) | deserialize | 239.03 μs ±3% (4,184/s) | 512.95 μs ±2% (1,950/s) | 678.13 μs ±3% (1,475/s) | 954.46 μs ±0.6% (1,048/s) |
| Lookup 50 x (2 maps of 100) | size | 113.6 KiB | 125.0 KiB | 159.1 KiB | 250.0 KiB |
| Event x1000 (long) | serialize | 363.02 μs ±3% (2,755/s) | 921.17 μs ±0.6% (1,086/s) | 1.31 ms ±2% (765/s) | 1.71 ms ±2% (585/s) |
| Event x1000 (long) | deserialize | 409.13 μs ±0.6% (2,444/s) | 908.02 μs ±2% (1,101/s) | 886.16 μs ±0.9% (1,128/s) | 2.17 ms ±2% (461/s) |
| Event x1000 (long) | size | 70.9 KiB | 78.0 KiB | 99.3 KiB | 156.1 KiB |
| Strings 1000 (ASCII) | serialize | 386.00 μs ±3% (2,591/s) | 575.12 μs ±0.6% (1,739/s) | 995.93 μs ±0.7% (1,004/s) | 1.46 ms ±0.7% (686/s) |
| Strings 1000 (ASCII) | deserialize | 329.72 μs ±2% (3,033/s) | 654.36 μs ±1% (1,528/s) | 688.07 μs ±3% (1,453/s) | 1.47 ms ±0.4% (682/s) |
| Strings 1000 (ASCII) | size | 98.1 KiB | 107.9 KiB | 137.4 KiB | 215.9 KiB |
| Strings 1000 (ASCII, Latin-1, other) | serialize | 421.46 μs ±2% (2,373/s) | 651.73 μs ±2% (1,534/s) | 874.38 μs ±0.9% (1,144/s) | 1.80 ms ±2% (554/s) |
| Strings 1000 (ASCII, Latin-1, other) | deserialize | 325.36 μs ±1% (3,074/s) | 774.24 μs ±2% (1,292/s) | 1.07 ms ±3% (931/s) | 1.78 ms ±2% (561/s) |
| Strings 1000 (ASCII, Latin-1, other) | size | 368.2 KiB | 405.1 KiB | 515.5 KiB | 810.1 KiB |

</details>

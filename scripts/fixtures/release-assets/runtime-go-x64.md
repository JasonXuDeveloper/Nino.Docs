## 🐹 Go runtime benchmark

<details>
<summary>The Go runtime of v4.0.0-rc.9 against Protocol Buffers, MessagePack, encoding/json and gob</summary>

`runtimes/go/bench` (`testing.B`, summarized by benchstat: medians ± their 95% confidence interval): codecs in the shape nino-gen generates (`Nino`) and the struct tags (`NinoTags`) against Protocol Buffers (google.golang.org/protobuf), MessagePack (vmihailenco/msgpack), encoding/json and gob, on AMD EPYC 7763 64-Core Processor, linux/amd64. Allocations are counted per operation; sizes are the encoded bytes.

| Case | Operation | Nino | NinoTags | Protobuf | MessagePack | JSON | Gob |
|---|---|--:|--:|--:|--:|--:|--:|
| simple-class | serialize | 7.45 μs ±2% | 27.25 μs ±1% | 23.74 μs ±2% | 35.97 μs ±2% | 97.72 μs ±2% | 152.89 μs ±0% |
| simple-class | deserialize | 7.43 μs ±0% | 27.85 μs ±1% | 21.46 μs ±1% | 41.54 μs ±1% | 67.06 μs ±1% | 168.50 μs ±1% |
| simple-class | serialize allocs | 0 | 130 | 0 | 908 | 667 | 1036 |
| simple-class | deserialize allocs | 415 | 917 | 281 | 854 | 250 | 804 |
| simple-class | size | 28.5 KiB | 34.2 KiB | 39.9 KiB | 45.6 KiB | 51.3 KiB | 57.0 KiB |
| simple-class-100 | serialize | 18.51 μs ±1% | 58.29 μs ±3% | 52.34 μs ±0% | 82.43 μs ±2% | 209.41 μs ±0% | 471.18 μs ±0% |
| simple-class-100 | deserialize | 22.97 μs ±2% | 56.33 μs ±3% | 56.53 μs ±0% | 96.74 μs ±2% | 216.75 μs ±3% | 469.94 μs ±1% |
| simple-class-100 | serialize allocs | 0 | 1049 | 0 | 409 | 568 | 927 |
| simple-class-100 | deserialize allocs | 906 | 648 | 149 | 493 | 878 | 150 |
| simple-class-100 | size | 15.8 KiB | 18.9 KiB | 22.1 KiB | 25.3 KiB | 28.4 KiB | 31.6 KiB |
| strings-1000 | serialize | 16.67 μs ±1% | 42.58 μs ±1% | 33.46 μs ±2% | 47.81 μs ±3% | 126.97 μs ±0% | 312.13 μs ±1% |
| strings-1000 | deserialize | 14.50 μs ±0% | 49.36 μs ±1% | 35.86 μs ±1% | 49.77 μs ±3% | 135.01 μs ±0% | 292.85 μs ±2% |
| strings-1000 | serialize allocs | 0 | 1041 | 0 | 1093 | 980 | 1040 |
| strings-1000 | deserialize allocs | 436 | 621 | 251 | 317 | 750 | 293 |
| strings-1000 | size | 5.4 KiB | 6.5 KiB | 7.6 KiB | 8.6 KiB | 9.7 KiB | 10.8 KiB |
| strings-mixed-1000 | serialize | 1.56 μs ±0% | 3.37 μs ±3% | 3.52 μs ±1% | 5.45 μs ±3% | 12.48 μs ±2% | 22.50 μs ±1% |
| strings-mixed-1000 | deserialize | 1.40 μs ±3% | 4.36 μs ±0% | 3.61 μs ±0% | 4.69 μs ±2% | 9.59 μs ±0% | 26.18 μs ±0% |
| strings-mixed-1000 | serialize allocs | 0 | 508 | 0 | 1072 | 532 | 1146 |
| strings-mixed-1000 | deserialize allocs | 519 | 282 | 958 | 450 | 193 | 816 |
| strings-mixed-1000 | size | 21.6 KiB | 25.9 KiB | 30.2 KiB | 34.5 KiB | 38.8 KiB | 43.1 KiB |

</details>

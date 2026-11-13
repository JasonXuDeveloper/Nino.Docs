## 🦀 Rust runtime benchmark

<details>
<summary>The Rust runtime of v4.0.0-rc.9 against Protocol Buffers, MessagePack, bincode, postcard and serde_json</summary>

`runtimes/rust/bench` (criterion): codecs in the shape nino-gen generates against Protocol Buffers (prost), MessagePack (rmp-serde), bincode, postcard and serde_json. Times are criterion's mean estimates ± half their 95% confidence interval; sizes are the encoded bytes of each case.

| Case | Operation | nino | prost | rmp-serde | bincode | postcard | serde_json |
|---|---|--:|--:|--:|--:|--:|--:|
| f64-10000 | serialize | 5.82 μs ±1.0% | 9.27 μs ±1.0% | 16.69 μs ±1% | 7.59 μs ±1% | 8.01 μs ±1% | 36.44 μs ±1% |
| f64-10000 | deserialize | 5.97 μs ±1% | 10.17 μs ±1% | 15.98 μs ±1% | 5.64 μs ±1.0% | 8.24 μs ±1.0% | 30.11 μs ±1% |
| f64-10000 | size | 20.7 KiB | 22.8 KiB | 26.9 KiB | 21.7 KiB | 18.6 KiB | 43.5 KiB |
| i32-10000 | serialize | 44.41 μs ±1.0% | 92.97 μs ±1% | 185.83 μs ±1% | 74.61 μs ±1.0% | 80.87 μs ±1% | 287.57 μs ±1% |
| i32-10000 | deserialize | 40.45 μs ±1.0% | 116.28 μs ±1% | 202.20 μs ±1% | 61.99 μs ±1% | 65.19 μs ±1.0% | 362.58 μs ±1.0% |
| i32-10000 | size | 33.4 KiB | 36.7 KiB | 43.4 KiB | 35.1 KiB | 30.1 KiB | 70.1 KiB |
| record | serialize | 43.19 μs ±1% | 106.90 μs ±1.0% | 153.58 μs ±1% | 65.35 μs ±1.0% | 74.79 μs ±1% | 324.33 μs ±1% |
| record | deserialize | 54.40 μs ±1.0% | 88.79 μs ±1% | 141.15 μs ±1.0% | 66.35 μs ±1.0% | 78.03 μs ±1.0% | 326.15 μs ±1.0% |
| record | size | 79.9 KiB | 87.9 KiB | 103.9 KiB | 83.9 KiB | 71.9 KiB | 167.8 KiB |
| records-1000 | serialize | 21.06 μs ±1% | 33.07 μs ±1% | 71.61 μs ±1.0% | 26.99 μs ±1% | 25.36 μs ±1% | 103.77 μs ±1% |
| records-1000 | deserialize | 16.16 μs ±1.0% | 45.48 μs ±1% | 70.20 μs ±1% | 20.17 μs ±1.0% | 31.36 μs ±1.0% | 141.89 μs ±1.0% |
| records-1000 | size | 86.6 KiB | 95.2 KiB | 112.5 KiB | 90.9 KiB | 77.9 KiB | 181.8 KiB |
| strings-1000 | serialize | 13.76 μs ±1% | 40.70 μs ±1% | 48.71 μs ±1.0% | 21.56 μs ±1% | 25.55 μs ±1% | 108.01 μs ±1% |
| strings-1000 | deserialize | 16.86 μs ±1.0% | 31.51 μs ±1% | 44.98 μs ±1.0% | 23.00 μs ±1.0% | 30.23 μs ±1.0% | 89.14 μs ±1.0% |
| strings-1000 | size | 64.8 KiB | 71.2 KiB | 84.2 KiB | 68.0 KiB | 58.3 KiB | 136.0 KiB |
| strings-mixed-1000 | serialize | 28.99 μs ±1.0% | 72.08 μs ±1% | 130.62 μs ±1.0% | 50.51 μs ±1.0% | 44.62 μs ±1% | 225.41 μs ±1.0% |
| strings-mixed-1000 | deserialize | 33.03 μs ±1.0% | 82.56 μs ±1.0% | 124.55 μs ±1% | 41.19 μs ±1% | 53.10 μs ±1% | 276.40 μs ±1% |
| strings-mixed-1000 | size | 43.9 KiB | 48.3 KiB | 57.1 KiB | 46.1 KiB | 39.5 KiB | 92.2 KiB |

</details>

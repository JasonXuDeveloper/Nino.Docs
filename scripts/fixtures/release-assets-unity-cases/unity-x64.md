## 🎮 Unity benchmark (Burst, IL2CPP)

Unity 2022.3.62f2, IL2CPP player (C++ Release, code generation OptimizeSpeed, stripping Minimal, not a Development build, Nino.Core Release), Linux x64, AMD EPYC 9V45 96-Core Processor (4 cores), Burst 1.8.29 (its default x64 targets), kernels SSSE3.
Unity 6000.3.27f1, IL2CPP player (C++ Release, code generation OptimizeSpeed, stripping Minimal, not a Development build, Nino.Core Release), Linux x64, AMD EPYC 7763 64-Core Processor (4 cores), Burst 1.8.31 (x64 targets SSE2, SSE4, AVX2), kernels AVX2.
Each time is the median per call; "Speedup" is without Burst divided by with Burst.

v4.0.0-rc.8, measured in the IL2CPP test player that `.github/workflows/unity.yml` builds and runs on a GitHub-hosted runner (`Test.Runtime.Burst.BurstBenchmark`) with the Unity Performance Testing package 3.6.0 (`Measure.Method`: its warm-up, then 9 measurements of about 100 ms, each the mean time per call): on the cases of the .NET benchmark, read from the bytes .NET writes: `NinoSerializer.Serialize` to a new array and `NinoDeserializer.Deserialize` to a new value, without the Burst kernels (`NinoKernels.Register(null)`: Nino.Core's own paths, as without `com.unity.burst`) and with them. Compare within a table: the runners vary between releases.

### Unity 2022.3.62f2

| Case | Operation | Without Burst | With Burst | Speedup |
|---|---|--:|--:|--:|
| SimpleClass | Serialize | 410.00 ns | 405.00 ns | on par |
| SimpleClass | Deserialize | 520.00 ns | 515.00 ns | on par |
| MediaContent | Serialize | 1.20 μs | 1.19 μs | on par |
| ByteIntPairs1000 | Serialize | 86.90 μs | 2.93 μs | 29.7× |
| ByteIntPairs1000 | Deserialize | 62.40 μs | 784.0 ns | 79.6× |
| AsciiString1000 | Serialize | 2.20 μs | 1.16 μs | 1.90× |
| AsciiString1000 | Deserialize | 2.55 μs | 1.54 μs | 1.66× |

### Unity 6000.3.27f1

| Case | Operation | Without Burst | With Burst | Speedup |
|---|---|--:|--:|--:|
| SimpleClass | Serialize | 410.00 ns | 405.00 ns | on par |
| SimpleClass | Deserialize | 520.00 ns | 515.00 ns | on par |
| MediaContent | Serialize | 1.20 μs | 1.19 μs | on par |
| IntLongPairs32 | Serialize | 3.28 μs | 835.4 ns | 3.92× |
| IntLongPairs32 | Deserialize | 2.43 μs | 441.3 ns | 5.50× |
| IntLongPairs1000 | Serialize | 88.12 μs | 2.89 μs | 30.5× |
| IntLongPairs1000 | Deserialize | 64.86 μs | 1.16 μs | 55.9× |
| IntLongPairs100000 | Serialize | 8.16 ms | 612.00 μs | 13.3× |
| IntLongPairs100000 | Deserialize | 6.30 ms | 80.10 μs | 78.7× |
| AsciiWords | Serialize | 74.20 μs | 64.50 μs | 1.15× |
| AsciiWords | Deserialize | 0.9 ns | 0.8 ns | 1.12× |

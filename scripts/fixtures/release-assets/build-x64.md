## 🏗️ Build: v3 3.3.13 vs v4 (source generator)

<details>
<summary>Nino v3 3.3.13's source generator (NuGet) against v4.0.0's, on one runner</summary>

`benchmarks/Nino.GeneratorBenchmark` on a synthetic assembly of N abstract root classes, each with a chain of 8 derived classes, a sealed leaf and a struct (N × 11 types), compiled in process: it runs the generator, emits the whole assembly, and runs the generator again after adding a member and after adding a comment. Each time is the median of the runs after the first (v3: 3 at 330 types, 2 at 1,100 types; v4: 5 at 330 types, 5 at 1,100 types); v3 and v4 ran one after the other on this runner. Sizes are in millions of chars (source) and bytes (IL).

Environment: Intel Xeon 2.10 GHz, 4 cores, .NET 10.0.0, Roslyn 4.3.0.0

### 330 types (N = 30)

| | v3 (3.3.13) | v4 | v4 vs v3 |
|---|---:|---:|---:|
| Generated source | 18.7 MB (363,233 lines) | 1.31 MB (23,215 lines) | **14× smaller** |
| Compiling the generated code (emit) | 42.9 s | 0.84 s | **51× faster** |
| Running the generator | 1.01 s | 0.32 s | **3.2× faster** |
| Re-generating after editing a member | 1.03 s | 0.12 s | **8.6× faster** |
| Re-generating after editing a comment | 1.01 s | 0.13 s | **7.8× faster** |
| IL of the generated code | 2.21 MB | 0.42 MB | **5.3× smaller** |

### 1,100 types (N = 100)

| | v3 (3.3.13) | v4 | v4 vs v3 |
|---|---:|---:|---:|
| Generated source | 62.0 MB (1,204,143 lines) | 4.38 MB (77,535 lines) | **14× smaller** |
| Compiling the generated code (emit) | 462 s | 2.10 s | **220× faster** |
| Running the generator | 4.60 s | 0.42 s | **11× faster** |
| Re-generating after editing a member | 3.50 s | 0.48 s | **7.3× faster** |
| Re-generating after editing a comment | 4.00 s | 0.44 s | **9.1× faster** |
| IL of the generated code | 7.30 MB | 1.50 MB | **4.9× smaller** |

</details>

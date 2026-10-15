---
title: v3 vs v4
lang: en
outline: deep
---
# v3 vs v4

This page compares Nino v3 with Nino v4: features, build time and generated code, and runtime performance. For upgrading, see [Migrating from v3](/en/doc/migration).

## Features

| | v3 | v4 |
| --- | --- | --- |
| API | generated `Serializer` / `Deserializer` per assembly, extension methods | `NinoSerializer` / `NinoDeserializer` in `Nino.Core` |
| Binary format | positional | positional by default, identical bytes on every target framework; padding zeroed (deterministic output) |
| Version tolerance | `WEAK_VERSION_TOLERANCE` for the whole project, append at the end | `versionTolerant` per type; append to the type or any base class, at any depth |
| Keyed members (reorder / remove / insert) | no | `[NinoType(keyed: true)]` |
| Shared references and cycles | no | `[NinoType(trackReferences: true)]` |
| Deserialize into existing instances | no | `Deserialize(data, ref value)`, with recycling of dropped instances |
| Object pooling | no | `[NinoPooled]`, `[NinoRefDeserialization]` factories, `NinoSettings.SetRecycler<T>` |
| Subtypes of a `[NinoType]` | need their own `[NinoType]` | inherit it |
| User collections (subclasses of `List<T>`, `Dictionary<,>`, ...) | dictionary subclasses need a public indexer | supported without attributes |
| `PriorityQueue<,>`, immutable collections | no | yes (.NET 6+; `Nino.Immutable`) |
| Custom formatters | no | `[NinoCustomFormatter]` per member, `[assembly: NinoFormatter]` per type |
| Boxed / runtime-typed API | no | `Serialize(object)`, `Deserialize(data, Type)` |
| Diagnostics | compile errors in generated code | analyzer with 22 diagnostics, many with code fixes |
| Incremental generator | no: whole-compilation scans, all types re-generated on every edit | one file per type, only edited types re-generated |
| Interceptors | no | on the .NET 9+ SDK |
| Hot update (HybridCLR) | supported | supported, no initialization call |
| Unity | 2022.3+, `Microsoft.CodeAnalysis` installed manually | 2022.3+, generator included in the package |
| Thread safety | inline caches could race under contention | lock-free, copy-on-write registries |

## Build Time and Generated Code

Measured on a synthetic assembly of `N` abstract root classes, each with a chain of 8 derived classes, a sealed leaf and a struct (`N × 11` types). Members are primitives, strings, `List<T>`, `Dictionary<int, string>`, references to other `[NinoType]`s and private fields. Intel Xeon 2.80 GHz, 4 cores, Ubuntu 24.04, .NET SDK 10.0.402; the ratios are what to look at.

### 330 types

| | v3 | v4 | v4 vs v3 |
|---|---:|---:|---:|
| Generated source | 70.6 MB (1,366,440 lines) | 1.15 MB (21,679 lines) | **61× smaller** |
| Compiling the generated code (emit) | 35.9 s | 1.27 s | **28× faster** |
| Running the generator | 4.2 s | 0.14 s | **30× faster** |
| Re-generating after editing a member | 3.7 s | 0.19 s | **20× faster** |
| Re-generating after editing a comment | 5.2 s | 0.19 s | **28× faster** |
| IL of the generated code | 4.9 MB | 0.37 MB | **13× smaller** |

### 1,100 types

| | v3 | v4 | v4 vs v3 |
|---|---:|---:|---:|
| Generated source | 236 MB (4,553,540 lines) | 3.9 MB (72,429 lines) | **61× smaller** |
| Compiling the generated code (emit) | 314 s | 2.2 s | **145× faster** |
| Running the generator | 30.8 s | 0.68 s | **45× faster** |
| Re-generating after editing a member | 7.8 s | 0.57 s | **14× faster** |
| Re-generating after editing a comment | 16.7 s | 0.45 s | **38× faster** |
| IL of the generated code | 16.3 MB | 1.3 MB | **12× smaller** |

v3's cost grows faster than the number of types (3.3× the types took 8.8× the compile time), because every polymorphic base inlined the bodies of all its subtypes. v4 grows linearly: about 3.5 KB of source and 2 ms of compile time per type.

## Runtime

BenchmarkDotNet on .NET 10, v4 against v3 in a back-to-back run on the same machine.

### Serialize

| Case | v4 vs v3 |
|---|---:|
| `SimpleClass` | **1.47× faster** |
| `SimpleClass[100]` | **1.39× faster** |
| Polymorphic class | **2.00× faster** |
| Polymorphic class array | **2.04× faster** |
| Polymorphic `Foo[]` | **1.94× faster** |
| `SimpleStruct` (`int` + `DateTime`) | **1.8× faster** |
| `SimpleStruct[100]` | **1.12× faster** |
| `Vector4[10000]` | on par |

### Deserialize

<!-- V3_DESERIALIZE -->
| Case | v3 | v4 | v4 vs v3 |
|---|---:|---:|---:|
| `SimpleClass` | TBD | TBD | TBD |
| `SimpleClass[100]` | TBD | TBD | TBD |
| Polymorphic class | TBD | TBD | TBD |
| Polymorphic class array | TBD | TBD | TBD |
| Polymorphic `Foo[]` | TBD | TBD | TBD |
| `SimpleStruct[100]` | TBD | TBD | TBD |
| `Vector4[10000]` | TBD | TBD | TBD |
<!-- /V3_DESERIALIZE -->

Deserializing classes is dominated by allocating the result objects. v4 adds what v3 could not do: deserializing into existing instances and pooled instances, which allocates **0 B** per call. See [What's New in v4](/en/doc/whats-new) and the [benchmark details](https://github.com/JasonXuDeveloper/Nino/blob/main/docs/v4-benchmarks.md).

---
title: What's New in v4
lang: en
outline: deep
---
# What's New in v4

Nino v4 is a rewrite of the runtime and the source generator.

::: warning
The v4 binary format is **not compatible** with v3 or the earlier v4 betas/previews, and the API changed. See [Migrating from v3](/en/doc/migration).
:::

## v4 in Numbers

| | v4 |
|---|---|
| Serialize vs MemoryPack | **2.5–4.3× faster** (class 2.97×, polymorphic array 4.33×, struct 2.5×) |
| Deserialize vs MemoryPack | **1.16–1.38× faster** on classes and polymorphic types, on par on raw arrays |
| Reusing instances (`[NinoPooled]`, `ref` deserialization) | **0 B allocated**, up to **4.9× faster** than MemoryPack's overwrite |
| Generated code vs v3 | **61× smaller** source, **12× smaller** IL |
| Build time vs v3 (1,100 types) | compile **145× faster** (314 s → 2.2 s), generator **45× faster** |
| Editing a type in the IDE | re-generates that type only: **0.2–0.6 s** instead of 4–17 s |

Measured with BenchmarkDotNet on .NET 10 against MemoryPack 1.21.4. See the [benchmark details](https://github.com/JasonXuDeveloper/Nino/blob/main/docs/v4-benchmarks.md) and the [v3 vs v4 comparison](/en/doc/v3-vs-v4).

## Highlights

### Faster to build
- **Truly incremental source generator**: one file per `[NinoType]`, equatable models, no whole-compilation scans. Editing a type re-generates only that type, and an edit that changes no model (a comment, a method body) re-generates nothing.
- **Much less generated code**: collections, strings, nullables, tuples and other built-in types are implemented once in `Nino.Core` as generic formatters; the generator only emits code for your `[NinoType]`s.
- **Analyzers and code fixes**: mistakes are reported while you type (NINO001–NINO022), many with a one-click fix. See the [diagnostics list](https://github.com/JasonXuDeveloper/Nino/blob/main/docs/diagnostics.md).

### Faster to run
- **Struct formatters the JIT/AOT compiler inlines**, raw memory copies for unmanaged `[NinoType]` structs and their arrays and lists, and no allocations beyond the result objects.
- **Interceptors on modern SDKs**: with the .NET 9+ SDK, `NinoSerializer`/`NinoDeserializer` calls with a known type are redirected at compile time to the generated formatter (no virtual call). Automatic; set `<NinoInterceptors>false</NinoInterceptors>` to turn it off. See [Interceptors](/en/doc/advanced#interceptors).
- **Thread safe and cache friendly**: lock-free, copy-on-write registries; no shared mutable state on hot paths.

### Reuse instead of allocate
- **Ref deserialization**: `NinoDeserializer.Deserialize(data, ref value)` populates existing objects, lists, arrays and dictionaries in place.
- **Pooled deserialization**: mark a class `[NinoPooled]` and Nino deserializes into instances you hand back with `ReturnToPool()`, reusing their lists, arrays and dictionaries. Dropped instances (the payload is `null`, a list shrinks, the type changes) go back to their pool or to a handler registered with `NinoSettings.SetRecycler<T>`.
- **`[NinoRefDeserialization]` factories** let Nino take new instances from your own pools.

See [Ref Deserialization and Pooling](/en/doc/advanced#ref-deserialization-and-pooling).

### Evolve your data
- **Opt-in version tolerance**: `[NinoType(versionTolerant: true)]` lets you append members to the type or any of its base classes, at any nesting depth.
- **Keyed members**: `[NinoType(keyed: true)]` writes members by name hash, so they can be reordered, removed and inserted.
- **Reference tracking**: `[NinoType(trackReferences: true)]` keeps shared references and cycles.

### More types, your way
- **User collections**: types derived from `List<T>`, `HashSet<T>`, `Dictionary<TKey, TValue>` and friends, without attributes.
- **More built-in types**: `PriorityQueue<TElement, TPriority>` on .NET 6+, and `ImmutableArray<T>` / `ImmutableList<T>` with the `Nino.Immutable` package.
- **Pluggable formatters**: `[assembly: NinoFormatter(typeof(MyFormatter<,>))]` teaches Nino a new type (yours or a third-party one). Type arguments and element formatters are inferred, generated code calls it directly, and the runtime uses the same registration. Nino's own BCL formatters are declared the same way. See [Custom Formatters](/en/doc/advanced#custom-formatters).
- **Subtypes inherit `[NinoType]`** from their base class or interface.

### Runs everywhere
- **One format everywhere**: `netstandard2.0`, `netstandard2.1`, `net8.0` and `net10.0` produce identical bytes, and data is portable between CoreCLR, Mono and IL2CPP, 64-bit and 32-bit.
- **No init calls**: generated registries are found lazily, so hot-update assemblies (HybridCLR) just work.
- **Unity**: the generator ships in the package; nothing else to install.

## Quick Example

```csharp
[NinoType, NinoPooled]
public sealed partial class Packet
{
    public int Id;
    public List<int> Values;

    // Required (the analyzer offers a fix that adds both).
    private static partial IEnumerable<Packet> OnNinoPoolWarmup() => Enumerable.Range(0, 16).Select(_ => new Packet());
    private partial void OnNinoPoolReturn() { /* clear state Nino does not deserialize */ }
}

byte[] bytes = NinoSerializer.Serialize(new Packet { Id = 1, Values = new List<int> { 1, 2, 3 } });

var packet = NinoDeserializer.Deserialize<Packet>(bytes); // reuses a pooled instance (and its list) if there is one
// ... use it ...
packet.ReturnToPool();                                    // returning it twice throws
```

## Learn More
- [Quick Start](/en/doc/start)
- [Migrating from v3](/en/doc/migration)
- [v4 architecture and format (design document)](https://github.com/JasonXuDeveloper/Nino/blob/main/docs/v4-design.md)
- [v4 benchmarks](https://github.com/JasonXuDeveloper/Nino/blob/main/docs/v4-benchmarks.md)

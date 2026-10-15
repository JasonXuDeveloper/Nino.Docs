---
title: Limitations
lang: en
outline: deep
---
# Limitations
This page describes the limitations of Nino v4, and the limitations of earlier versions that v4 resolves.

## Current Limitations
- **Source generator required.** Nino needs its source generator (Roslyn 4.3 or later) and C# 9 or later in the project that declares `[NinoType]`s.
- **Not compatible with v3 data.** The v4 format cannot read data written by v3 or the v4 betas/previews. See [Migrating from v3](/en/doc/migration#converting-v3-data).
- **Positional by default.** Without `versionTolerant` or `keyed`, inserting, removing or reordering members breaks existing data. `versionTolerant` only tolerates appended members; use `keyed` for anything else. Changing a member's type is never tolerated.
- **Raw structs are layout-sensitive.** An unmanaged `[NinoType]` struct written as raw memory is written in its canonical field order: reordering its fields or changing its `StructLayout` breaks existing data. Mark it `versionTolerant` (or `[NinoIgnore]` a field) to write it member by member instead.
- **Little-endian only.** All multi-byte values are written little-endian; big-endian hosts are not supported. (Every platform .NET and Unity run on today is little-endian.)
- **Unsupported member types are skipped.** Delegates, `Task`, pointers, non-generic collections (`ArrayList`), `ReadOnlyCollection<T>`, abstract collections, struct collections and collections without a usable constructor have no formatter: the member is skipped with warning NINO007. Mark it `[NinoIgnore]`, or provide a [custom formatter](/en/doc/advanced#custom-formatters).
- **Collections are values.** The same collection instance in two members is written twice and read back as two instances; `trackReferences` only tracks `[NinoType]` classes.
- **Some types cannot be tracked or pooled.** Types re-created from constructor arguments or read-only members (positional records, for example) cannot use `trackReferences` (NINO016) or `[NinoPooled]` (NINO018). `[NinoPooled]` also requires a `sealed` class.
- **Version-tolerant interfaces.** Members appended to a `[NinoType]` interface are not tolerated; append them to a class.
- **Runtime-only generic instantiations.** A closed generic `[NinoType]` that a process only reads by type id, and never names in code or writes, must be registered at startup with `NinoPolymorphic.Register<T>()`.
- **`PriorityQueue<TElement, TPriority>`** is only available on .NET 6 and later (not on .NET Standard or Unity).
- **Interceptors** need the .NET 9 SDK or later; Unity and older compilers use the regular (slightly slower) calls.
- **Before .NET 8** (including .NET Standard and Unity), types with serialized non-public members or `[NinoPooled]` must be `partial`, and a non-public base member hidden with `new` in a generic type cannot be reached (NINO022).

## Platform Notes
Nino defines its bytes instead of copying whatever a runtime has in memory, so data is portable between CoreCLR, Mono and IL2CPP, and between 64-bit and 32-bit platforms:

- **`Nullable<T>`**: the order of `hasValue` and `value` differs between runtimes (old Mono, in Unity 2019.4 and earlier, puts the value first). A single `T?` is written as a has-value byte followed by the value. Arrays and lists of `T?` use the canonical layout and are converted element by element where the runtime differs.
- **`ValueTuple`**: `ValueTuple` uses `LayoutKind.Auto` on .NET (Core), so its fields may be reordered, while Mono lays them out sequentially. Nino always writes `ValueTuple` and `KeyValuePair` member by member, never as raw memory.
- **`decimal`**: CoreCLR aligns it to 8 bytes, Mono and IL2CPP to 4, so a struct holding a `decimal` can have a different layout. Nino converts it to the canonical layout.
- **`DateTimeOffset`**: written as UTC ticks plus offset minutes (10 bytes), never raw.
- **32-bit platforms**: `long`/`double` fields can be aligned differently (`struct { int a; long b; }` is 16 bytes on x64 and 12 bytes on x86 .NET/Mono). Nino's raw layout is the canonical 64-bit layout; where the runtime differs, values are converted field by field, at some cost to speed.
- **`nint`/`nuint`**: always written as 8 bytes.
- **Padding**: padding bytes in raw structs are zeroed on write, so equal values always produce equal bytes.

## Resolved Limitations
- **`ValueTuple` behaves differently in .NET Core and Unity/Mono**
    ::: info
    Resolved in v4: `ValueTuple`, `KeyValuePair` and `Nullable<T>` have a defined, runtime-independent format, so data is compatible between .NET Core and Unity/Mono/IL2CPP.
    :::
- **`WEAK_VERSION_TOLERANCE` projects cannot read data from projects without it, and vice versa**
    ::: info
    Resolved in v4: version tolerance is an option of each type (`[NinoType(versionTolerant: true)]`) and is part of the type's own format, so it no longer depends on project settings. `WEAK_VERSION_TOLERANCE` still exists for compatibility and only affects the types declared in the project that defines it.
    :::
- **Members can only be appended at the end; no removing or reordering**
    ::: info
    Resolved in v4: version-tolerant types accept members appended to any class of the hierarchy, and `[NinoType(keyed: true)]` allows reordering, removing and inserting members.
    :::
- **Unsupported types cause a compilation error**
    ::: info
    Resolved in v4: the analyzer reports them as warning NINO007 on your code (with a code fix), and the member is skipped.
    :::
- **Shared references and cycles are not preserved**
    ::: info
    Resolved in v4 with `[NinoType(trackReferences: true)]`.
    :::
- **Dictionary subtypes need a public indexer**
    ::: info
    Resolved in v4: user collections derived from `List<T>`, `Dictionary<TKey, TValue>` and friends, or implementing the collection interfaces, work without any extra code.
    :::
- **Cannot rename type name/namespace after serialization**
    ::: info
    Resolved since v3.2.2 with `[NinoFormerName]`.
    :::
- **Cannot serialize/deserialize non-public fields/properties**
    ::: info
    Resolved since v3.0.6 with `containNonPublicMembers`. On .NET 8 and later there are no restrictions; before .NET 8 the type must be `partial`.
    :::
- **Polymorphic unmanaged structs serialized differently with and without casting to their interface**
    ::: info
    Resolved since v3.0.3.
    :::

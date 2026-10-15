---
title: Migrating from v3
lang: en
outline: deep
---
# Migrating from v3

Nino v4 is a breaking release. This page lists every API, attribute and option that changed, with before/after code, and explains what to do with data written by v3.

::: warning
The v4 binary format is **not compatible** with v3 or with the earlier v4 betas/previews. v4 cannot read data written by v3, and v3 cannot read data written by v4. If you have persisted v3 data (save games, caches, config files), read [Converting v3 data](#converting-v3-data) before upgrading.
:::

## Checklist

1. Update the `Nino` NuGet package (or the OpenUPM package in Unity) to v4.
2. Replace `Serializer`/`Deserializer` calls with `NinoSerializer`/`NinoDeserializer`, and remove `using <YourAssembly>.NinoGen;`.
3. Replace `WEAK_VERSION_TOLERANCE` with `[NinoType(versionTolerant: true)]` on the types that need it (optional, see below).
4. Update `[NinoFormerName]` arguments to the runtime type name form.
5. Build, and fix what the analyzer reports (`NINO001`–`NINO022`); most diagnostics have a code fix.
6. Convert or discard persisted v3 data.

## Serialization API

In v3, the generator emitted static `Serializer` and `Deserializer` classes (and extension methods) into each assembly's `<AssemblyName>.NinoGen` namespace. In v4, there is one API in `Nino.Core`, the same for every assembly.

| v3 | v4 |
| --- | --- |
| `using MyGame.NinoGen;` | `using Nino.Core;` |
| `Serializer.Serialize(obj)` / `obj.Serialize()` | `NinoSerializer.Serialize(obj)` |
| `Serializer.Serialize(obj, bufferWriter)` / `obj.Serialize(bufferWriter)` | `NinoSerializer.Serialize(obj, bufferWriter)` |
| `obj.Serialize(ref writer)` | `NinoSerializer.Serialize(obj, ref writer)` |
| `Deserializer.Deserialize(data, out T value)` | `T value = NinoDeserializer.Deserialize<T>(data)` |
| `Deserializer.Deserialize(out T value, ref reader)` | `T value = NinoDeserializer.Deserialize<T>(ref reader)` |
| `Serializer.GetBufferWriter()` / `ReturnBufferWriter(...)` | a reused `NinoArrayBufferWriter` (see [Basic Usage](/en/doc/basic#recommended-usage)) |
| (none) | `NinoDeserializer.Deserialize(data, ref value)`: deserialize into an existing instance |
| (none) | `NinoSerializer.Serialize(object)`, `NinoDeserializer.Deserialize(data, Type)`: boxed / runtime types |

```csharp
using MyGame.NinoGen; // [!code --]
using Nino.Core; // [!code ++]

byte[] bytes = obj.Serialize(); // [!code --]
byte[] bytes = NinoSerializer.Serialize(obj); // [!code ++]

Deserializer.Deserialize(bytes, out ObjClass result); // [!code --]
ObjClass result = NinoDeserializer.Deserialize<ObjClass>(bytes); // [!code ++]
```

Buffer reuse:

```csharp
var bufferWriter = Serializer.GetBufferWriter(); // [!code --]
obj.Serialize(bufferWriter); // [!code --]
Serializer.ReturnBufferWriter(bufferWriter); // [!code --]
var buffer = new NinoArrayBufferWriter(); // keep and reuse it (one per thread) // [!code ++]
buffer.ResetWrittenCount(); // [!code ++]
NinoSerializer.Serialize(obj, buffer); // [!code ++]
```

::: info
`Span<T>` values could be passed to v3's generated `Serialize`. In v4, `T` is a generic type argument, which cannot be a `ref struct`: serialize an array, a `List<T>` or an `ArraySegment<T>` instead.
:::

## Attributes and Options

| v3 | v4 |
| --- | --- |
| `[NinoType]`, `[NinoType(autoCollect, containNonPublicMembers)]` | unchanged; new optional parameters `allowInheritance`, `versionTolerant`, `keyed`, `trackReferences` |
| every subtype needs its own `[NinoType]` | subtypes **inherit** `[NinoType]` from their base class or interface (unless it sets `allowInheritance: false`) |
| `WEAK_VERSION_TOLERANCE` (whole project) | `[NinoType(versionTolerant: true)]` per type; the symbol still exists and turns it on for every type of the project |
| `[NinoFormerName("global::Old.Namespace.Type")]` (name copied from `NinoTypeConst.g.cs`) | `[NinoFormerName("Old.Namespace.Type")]`: runtime form, no `global::`, `+` for nested types |
| `[NinoMember(index)]`, `[NinoIgnore]`, `[NinoUtf8]`, `[NinoConstructor(...)]`, `[NinoExplicitOrder(...)]` | unchanged; `[NinoConstructor]` can also mark a static factory method |
| `[NinoPrivateProxy]` (emitted by the generator) | removed; private members are reached through `[UnsafeAccessor]` (.NET 8+) or a generated accessor in the `partial` type |
| (none) | `[NinoPooled]`, `[NinoRefDeserialization]`, `[NinoCustomFormatter]`, `[assembly: NinoFormatter]` |

### Version tolerance

```csharp
// v3: #define WEAK_VERSION_TOLERANCE in the project settings // [!code --]
[NinoType] // [!code --]
[NinoType(versionTolerant: true)] // [!code ++]
public class SaveData
{
    public int Id;
    public string Name;
    public bool Extra; // appended later
}
```

v4's version tolerance is more capable than v3's: members can be appended to the type **or any of its base classes**, at any nesting depth. For reordering, removing or inserting members, use `[NinoType(keyed: true)]`. See [Version Tolerance](/en/doc/advanced#version-tolerance) and [Keyed Members](/en/doc/advanced#keyed-members).

::: warning
In v3, `WEAK_VERSION_TOLERANCE` also allowed changing a member to an unmanaged type of the same size (`int` → `float`). Do not rely on that in v4: changing a member's type is not a tolerated change.
:::

### Former names

```csharp
[NinoType]
[NinoFormerName("global::MyGame.Items.Sword")] // [!code --]
[NinoFormerName("MyGame.Items.Sword")] // [!code ++]
public class Weapon { ... }
```

Former names only matter for data written by v4 itself (v3 data cannot be read anyway), so you only need them for types renamed after you adopted v4.

### Polymorphism

```csharp
[NinoType]
public abstract class Shape { public int Id; }

[NinoType] // no longer required: inherited from Shape // [!code --]
public class Circle : Shape { public float Radius; }
```

Keeping `[NinoType]` on subtypes is harmless, and lets a subtype set its own options.

## Generated Code
- Generated formatters live in the `<AssemblyName>.NinoGen` namespace but are not meant to be called directly. Remove any code that referenced the v3 generated classes (`Serializer`, `Deserializer`, `NinoTypeConst`, ...).
- There is one generated file per `[NinoType]`, and editing one type re-generates only that type.
- Problems that v3 reported as compile errors in generated code are now analyzer diagnostics on your code. A member whose type cannot be serialized is a warning (NINO007) and is skipped, instead of a compile error. See the [diagnostics list](https://github.com/JasonXuDeveloper/Nino/blob/main/docs/diagnostics.md).

## Unity
- Unity 2022.3 or later is still required.
- The OpenUPM package ships the source generator. You no longer need to install the `Microsoft.CodeAnalysis` NuGet packages into your Unity project manually; remove them if you only added them for Nino.
- Interceptors are not used in Unity (they need the .NET 9+ SDK compiler); calls go through the regular API.
- `asmdef` files still need to reference `Nino.Core.dll` when `Override References` is used.

## HybridCLR
- Hot-update assemblies need **no initialization call**: Nino finds the generated registry of an assembly the first time one of its types is used, even when the assembly is loaded with `Assembly.Load`.
- v4's documentation and tests cover HybridCLR; ILRuntime is no longer listed as supported.

## Converting v3 Data
v4 cannot read v3 data, and the two versions cannot both be referenced by one project (both use the `Nino.Core` assembly and namespace). To keep persisted data:

1. Build a small **converter** that still references Nino v3 and your v3 types. It reads the old data with v3's `Deserializer` and exports it in a neutral form (for example JSON), or hands the objects to a second assembly that references v4 (for example by loading it in a separate `AssemblyLoadContext`).
2. In the v4 application, import the neutral data and write it with `NinoSerializer`.
3. If you cannot convert offline (for example save games on players' devices), ship the converter logic with the game and mark new data with a **header** (a magic number or version byte). Data with the header is read with v4; data without it is converted once and saved again with v4.

See also [Versioning](/en/doc/versioning#what-if-i-really-want-to-deserialize-the-old-data-with-the-new-version).

::: tip
Data that lives only in memory or on the wire between processes you deploy together (network messages, caches) does not need converting: deploy all ends with v4 at once.
:::

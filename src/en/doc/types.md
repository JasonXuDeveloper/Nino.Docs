---
title: Type System
lang: en
outline: deep
---
# Type System

This page lists the types Nino can serialize, and explains how to define your own serializable types with `[NinoType]`, including generics and polymorphism.

::: tip
Mistakes are reported by Nino's analyzer while you type (diagnostics `NINO001`–`NINO022`), many with a one-click code fix. A member whose type Nino cannot serialize is reported as a warning (NINO007) and skipped. See the [diagnostics list](https://github.com/JasonXuDeveloper/Nino/blob/main/docs/diagnostics.md).
:::

## Serializable Types

### Primitive and Unmanaged Types

Nino supports all [unmanaged types](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/unmanaged-types), including user-defined ones. They are written as their raw bytes (little-endian, padding zeroed), and arrays and lists of them are written with a single block copy:
- `bool`, `byte`, `sbyte`, `char`, `short`, `ushort`, `int`, `uint`, `long`, `ulong`, `float`, `double`, `decimal`
- `enum`
- `DateTime`, `TimeSpan`, `Guid`
- `System.Numerics` and Unity types such as `Vector3`, `Quaternion`, `Matrix4x4`
- unmanaged structs, generic structs, record structs and generic record structs

A few unmanaged types have their own portable format instead of raw bytes:
- `DateTimeOffset`: UTC ticks plus the offset in minutes
- `nint`/`nuint`: always 8 bytes
- `Nullable<T>`, `ValueTuple<...>`, `KeyValuePair<TKey, TValue>`: written member by member, because their memory layout differs between runtimes (see [Limitations](/en/doc/limit))

::: info
The raw layout is the canonical 64-bit layout. On runtimes that lay a struct out differently (for example 32-bit platforms), Nino converts field by field, so every platform reads and writes the same bytes.
:::

### Strings

`string` is supported. By default it is written as UTF-16 (one block copy); mark a member with [`[NinoUtf8]`](/en/doc/advanced#string-encoding) to write it as UTF-8.

### Other Built-in Types
- `Nullable<T>` (`T?`) of any serializable `T`
- `ValueTuple` and `Tuple` with 1 to 7 elements
- `KeyValuePair<TKey, TValue>`
- `object`: a member declared as `object` can hold any `[NinoType]` instance; its runtime type is preserved

### Collection Types

Nino supports collections whose elements are serializable types:
- `T[]`, multi-dimensional arrays `T[,]`, `T[,,]`, `T[,,,]`, and `ArraySegment<T>`
- `List<T>`, `HashSet<T>`, `Queue<T>`, `Stack<T>`, `LinkedList<T>`, `SortedSet<T>`
- `Dictionary<TKey, TValue>`, `SortedDictionary<TKey, TValue>`, `SortedList<TKey, TValue>`
- `ConcurrentDictionary<TKey, TValue>`, `ConcurrentQueue<T>`, `ConcurrentStack<T>`, `ConcurrentBag<T>`
- `PriorityQueue<TElement, TPriority>` (.NET 6 and later; not on .NET Standard or Unity)
- `ImmutableArray<T>` and `ImmutableList<T>` with the `Nino.Immutable` package
- Interfaces: `IEnumerable<T>`, `ICollection<T>`, `IList<T>`, `IReadOnlyCollection<T>`, `IReadOnlyList<T>` (read back as `List<T>`), `ISet<T>` and `IReadOnlySet<T>` (.NET 8+) (read back as `HashSet<T>`), `IDictionary<TKey, TValue>`, `IReadOnlyDictionary<TKey, TValue>` and `ReadOnlyDictionary<TKey, TValue>` (read back as `Dictionary<TKey, TValue>`)
- Any other class implementing `ICollection<T>`, `IDictionary<TKey, TValue>` or `IProducerConsumerCollection<T>`

::: info
Collections can be nested freely, for example:
- `List<Dictionary<int, SampleStruct>>[]`
- `Dictionary<int[], List<bool>[]>`
- `IDictionary<string, IList<List<bool>[]>[]>[]`
:::

#### User Collections

Your own collection types work without any attribute: a class derived from `List<T>`, `HashSet<T>`, `Queue<T>`, `Stack<T>` or `Dictionary<TKey, TValue>`, or implementing `IDictionary<TKey, TValue>`, `IProducerConsumerCollection<T>` or `ICollection<T>`, is written exactly like the collection it extends.

```csharp
public class Inventory : List<Item> { }

public class MultiMap<TKey, TValue> : SortedDictionary<TKey, List<TValue>> { }
```

- Nino creates a collection only when the slot is `null`: through a public static [`[NinoRefDeserialization]`](/en/doc/advanced#creating-instances-with-ninorefdeserialization) factory method if the type declares one (for example to take it from a pool), otherwise through a public constructor callable without arguments.
- Collections are filled through the public collection API (`Add`/`Clear`, the dictionary indexer, `Enqueue`, `Push`, `TryAdd`). Subclasses of `List<T>`, `HashSet<T>` and `Dictionary<TKey, TValue>` are filled through the base type, so members hidden with `new` are not called.
- If the collection type is also a `[NinoType]`, its elements are written first and then its own serialized members.
- The declared type decides what is created: a `List<int>` member holding an `Inventory` is read back as a `List<int>`.

::: warning
These collections are not supported, and members of these types are skipped with warning NINO007: abstract collections, collections without a usable constructor or factory, struct collections, non-generic collections (`ArrayList`), `ReadOnlyCollection<T>`, and types implementing `ICollection<T>` for two different `T`.

Deserializing into a collection whose `IsReadOnly` is `true` throws an `InvalidOperationException`, as does data that holds the same key twice for a dictionary or `HashSet<T>`.
:::

## Custom Types

To serialize your own `class`, `struct`, `record`, `record struct` or `interface`, mark it with `[NinoType]`. The source generator emits its formatter at compile time:

::: code-group
```csharp{1} [Custom struct]
[NinoType]
public struct SampleStruct
{
  public int Id;
  public string Name { get; set; }
}
```
```csharp{1} [Custom record]
[NinoType]
public record SampleRecord(int Id, string Name);
```
```csharp{1} [Custom record struct]
[NinoType]
public record struct SampleRecordStruct(int Id, string Name);
```
```csharp{1} [Custom class]
[NinoType]
public class SampleClass
{
  public int Id;
  public string Name { get; set; }
}
```
:::

::: info
A type and every type containing it must be `public` or `internal` (NINO001), and must not be `static` or a `ref struct`.
:::

### NinoType Options

`[NinoType]` takes the following optional parameters:

```csharp
public NinoTypeAttribute(
    bool autoCollect = true,              // serialize every public field and property
    bool containNonPublicMembers = false, // also serialize non-public members
    bool allowInheritance = true,         // subtypes are serializable through this type
    bool versionTolerant = false,         // members can be appended later
    bool keyed = false,                   // members are identified by name hash
    bool trackReferences = false)         // shared references and cycles round-trip
```

| Parameter | Effect |
| --- | --- |
| `autoCollect` | `true`: every public field and property is serialized. `false`: only members marked `[NinoMember]`. |
| `containNonPublicMembers` | Also serialize `private`/`protected`/`internal` members. |
| `allowInheritance` | `true`: subtypes inherit the attribute and can be serialized through this type. `false`: subtypes must declare `[NinoType]` themselves (NINO003). |
| `versionTolerant` | Members can be appended to the type or any of its base classes without breaking existing data. See [Version Tolerance](/en/doc/advanced#version-tolerance). |
| `keyed` | Members are written with a key, so they can be reordered, removed and inserted. See [Keyed Members](/en/doc/advanced#keyed-members). |
| `trackReferences` | Classes only. An object referenced several times is written once, and cycles round-trip. See [Reference Tracking](/en/doc/advanced#reference-tracking). |

Use named arguments for readability, e.g. `[NinoType(versionTolerant: true)]`.

### Which Members are Serialized

By default `[NinoType]` collects every public field and every public property that has a getter and a setter (`set` or `init`), base-class members first, then in declaration order. For records, the primary constructor parameters are collected as well (they are public properties).

- Get-only auto-properties (`public int Id { get; }`) are serialized only when a constructor (or `[NinoConstructor]` factory) takes them as a parameter of the same name (ignoring case); otherwise nothing could restore them, so they are skipped.
- Explicit interface implementations (`int IHasId.Id { get; set; }`) are never serialized.
- An `override` is the same member as the one it overrides. A member hiding a base member with `new` is a separate member: both are serialized, the base one first.

To choose members explicitly, use `[NinoType(false)]` and mark the members with `[NinoMember(index)]`. Members are ordered by index, ascending:

::: code-group
```csharp{1,5} [Class example]
[NinoType(false)]
public class SampleClass
{
  public int Id;          // not serialized
  [NinoMember(1)]
  public string Name { get; set; }
}
```
```csharp{1,3,4} [Record example]
[NinoType(false)]
public record SampleRecord(
                [property: NinoMember(2)] int Id,
                [property: NinoMember(1)] string Name);
```
:::

To include non-public members, set `containNonPublicMembers`:

```csharp{1}
[NinoType(containNonPublicMembers: true)]
public partial class SampleClass
{
  private int Id;
}
```

::: info
On .NET 8 and later, generated code reaches private members through `[UnsafeAccessor]`. On older targets (including .NET Standard and Unity) it uses an accessor generated inside the type, so the type and every type containing it must be `partial` (NINO002, with a code fix).

Private members of a base class are never part of a subtype.
:::

To skip a member that would be collected automatically, mark it with `[NinoIgnore]`:

```csharp{4}
[NinoType]
public class SampleClass
{
  [NinoIgnore]
  public int Id;
  public string Name { get; set; }
}
```

::: info
`[NinoIgnore]` has no effect with `autoCollect: false` (NINO011), and `[NinoMember]` has no effect with `autoCollect: true` (NINO010). A member cannot have both (NINO012). The analyzer offers fixes for all three.
:::

### Unmanaged `[NinoType]` Structs

A `[NinoType]` struct is written as its raw memory (one copy, and arrays/lists of it as one block) when it is unmanaged, not `versionTolerant` or `keyed`, uses the default sequential layout, has no custom member formatters, and every instance field is serialized. Otherwise it is written member by member.

::: warning
For such a raw struct, reordering its fields or changing its `StructLayout` changes the format and breaks existing data. Mark it `versionTolerant` (or `[NinoIgnore]` a field) to opt out of raw copying.
:::

## Generic Types

Nino supports generic types:

::: code-group
```csharp{1} [Generic struct]
[NinoType]
public struct GenericStruct<T>
{
    public T Val;
}
```
```csharp{1} [Generic class]
[NinoType]
public class Generic<T>
{
    public T Val;
}
```
```csharp{1} [Generic record]
[NinoType]
public record SimpleRecord6<T>(int Id, T Data);
```
```csharp{1} [Generic record struct]
[NinoType]
public record struct SimpleRecordStruct2<T>(int Id, T Data);
```
:::

Constraints on type parameters and members declared with other generic types are supported:

```csharp
[NinoType]
public class ComplexGeneric<T> where T : IList
{
    public T Val;
}

[NinoType]
public class ComplexGeneric2<T>
{
    public Generic<T> Val;
}
```

::: info
A generic `[NinoType]` gets one generated formatter per definition, not one per closed type. Closed types such as `Generic<int>` are bound when they are used: the generator registers every closed type its compilation names (member types, base types, type arguments of `NinoSerializer`/`NinoDeserializer` calls), and the runtime closes the rest on first use.

The type arguments must be serializable types, for example `Generic<int>`, `Generic<string>`, `Generic<List<int>>`.
:::

::: warning
A closed generic type that a process only **reads** polymorphically (by its type id), and never names in code or writes, must be registered at startup, e.g. `NinoPolymorphic.Register<Generic<int>>()`. This only matters for instantiations created by reflection or by another assembly.
:::

## Polymorphic Types

Nino serializes the runtime type of a value, so a value declared as a base class or interface is read back as the type it really is:

```csharp{1}
[NinoType]
public class BaseClass
{
  public int Id;
}

public class DerivedClass : BaseClass   // inherits [NinoType]
{
  public string Name;
}
```

```csharp
var list = new List<BaseClass>
{
    new BaseClass { Id = 1 },
    new DerivedClass { Id = 2, Name = "Nino" }
};
byte[] bytes = NinoSerializer.Serialize(list);
List<BaseClass> result = NinoDeserializer.Deserialize<List<BaseClass>>(bytes);
// result[0] is a BaseClass, result[1] is a DerivedClass
```

::: info
In v4, subtypes **inherit** `[NinoType]` (including its options) from their nearest `[NinoType]` base class or interface, unless the base sets `allowInheritance: false`. You can still put `[NinoType]` on a subtype to give it its own options.
:::

::: info
Each non-sealed class, abstract class or interface is written with a 4-byte type id (a stable hash of the type's full name), so a value can be read back as the right subtype. A sealed class only needs a 1-byte null flag, and a struct needs no header. To rename or move a type without breaking existing data, use [`[NinoFormerName]`](/en/doc/advanced#former-name).
:::

### Abstractions
Interfaces and abstract classes work the same way. Mark the interface or abstract class with `[NinoType]`; implementing classes and structs inherit it:

::: code-group

```csharp{1} [Interface example]
[NinoType]
public interface IBase
{
    int A { get; set; }
}

public class Impl : IBase
{
    public int A { get; set; }
}

public struct ImplStruct : IBase
{
    public int A { get; set; }
}
```

```csharp{1} [Abstract class example]
[NinoType]
public abstract class Base
{
    public int A { get; set; }
}

public class Derived : Base
{
    public int B { get; set; }
}
```
:::

A `[NinoType]` interface serializes its own members through the implementing type's members of the same name.

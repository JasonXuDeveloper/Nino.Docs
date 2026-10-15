---
title: Advanced Usage
lang: en
outline: deep
---
# Advanced Usage
This page describes the features of Nino v4 beyond plain serialization: renaming types, member order, constructors, schema evolution (version tolerance and keyed members), reference tracking, ref deserialization and pooling, custom formatters, interceptors and the analyzers.

## Former Name
A non-sealed class, abstract class or interface is written with a type id, a stable 32-bit hash of the type's full name. Renaming the type or moving it to another namespace changes the id, so data written before the rename can no longer be read.

Add `[NinoFormerName]` with the type's old name to keep reading that data:

```csharp{2}
[NinoType]
[NinoFormerName("Old.Namespace.Outer+Item")]
public class Item // [!code --]
public class ItemRenamed // [!code ++]
{
    ...
}
```

::: info
The former name is the **runtime form** of the full name: `Namespace.Type`, with `+` between a nested type and the type containing it (`Namespace.Outer+Inner`), and no `global::` prefix. A type in the global namespace is just `TypeName`.

Types with a former name are found under both names, so old and new data can be read.
:::

## String Encoding
By default, strings are written as UTF-16 (a length and one block copy). Mark a `string` member with `[NinoUtf8]` to write it as UTF-8 instead, which halves the size of ASCII-heavy text:

```csharp
[NinoType]
public class StringData
{
    [NinoUtf8] public string Str;
}
```

::: info
UTF-8 strings are transcoded with the runtime's vectorized UTF-8 encoder, which costs a little time compared with the UTF-16 copy.
:::

## Member Order
Members are written base-class members first, then in declaration order. Two attributes change the order:

- `[NinoMember(index)]` together with `[NinoType(false)]`: only marked members are serialized, ordered by `index` ascending. Indices must be unique within a type (NINO013).
- `[NinoExplicitOrder(...)]` on the type: the listed members (by name) come first, in the given order; the others follow in declaration order.

```csharp
[NinoType]
[NinoExplicitOrder(nameof(Name), nameof(Id))]
public class Ordered
{
    public int Id;
    public string Name;
    public bool Flag;   // written after Name and Id
}
```

::: warning
Without `keyed: true`, the order of members **is** the format: reordering members (or changing their indices) breaks existing data.
:::

## Custom Constructors
Nino needs a way to create each type it deserializes:

1. A constructor or static factory method marked `[NinoConstructor]`, if there is one.
2. Otherwise, the accessible (`public` or `internal`) constructor with the most parameters that all match serialized members by name (ignoring case). For records this is usually the primary constructor; a parameterless constructor matches with zero parameters.
3. Structs fall back to `new T()`.

`[NinoConstructor]` takes the names of the serialized members passed as arguments, in order. Without arguments, parameters are matched by name:

::: code-group
```csharp{15} [Constructor]
[NinoType]
public record SimpleRecord
{
    public int Id;
    public string Name;
    public DateTime CreateTime;

    public SimpleRecord()
    {
        Id = 0;
        Name = string.Empty;
        CreateTime = DateTime.MinValue;
    }

    [NinoConstructor(nameof(Id), nameof(Name))]
    public SimpleRecord(int id, string name)
    {
        Id = id;
        Name = name;
        CreateTime = DateTime.Now;
    }
}
```
```csharp{9} [Factory method]
[NinoType]
public class Move
{
    public ushort ClientX;
    public ushort ClientY;

    private Move() { }

    [NinoConstructor(nameof(ClientX), nameof(ClientY))]
    public static Move Create(ushort clientX, ushort clientY)
    {
        return new Move { ClientX = clientX, ClientY = clientY };
    }
}
```
```csharp{2} [Primary constructor]
[NinoType]
public record SimpleRecord2(int Id, string Name, DateTime CreateTime);
```
```csharp{9} [Struct]
[NinoType]
public struct SimpleStruct
{
    public int Id;
    public string Name;
    public DateTime CreateTime;

    // used instead of the implicit parameterless constructor
    [NinoConstructor(nameof(Id), nameof(Name), nameof(CreateTime))]
    public SimpleStruct(int a, string b, DateTime c)
    {
        Id = a;
        Name = b;
        CreateTime = c;
    }
}
```
:::

### Rules
- The constructor or factory method marked `[NinoConstructor]` must be `public` or `internal` (NINO021).
- Every name in `[NinoConstructor]` (or every parameter, when no names are given) must match a serialized member (NINO005).
- If no constructor can be used, NINO004 is reported.
- A type re-created through a constructor reads read-only members that are not constructor parameters and drops them (NINO006): add them to the constructor, make them settable, or `[NinoIgnore]` them.
- C# 11 `required` members: a constructor marked `[SetsRequiredMembers]` is used when one matches; otherwise the generated code sets the required members with an object initializer.

::: info
Types whose members cannot be assigned after construction (constructor parameters, `init`-only, get-only or `readonly` members) are always **re-created** when deserialized, even by ref deserialization; the old instance is passed to the recycler.
:::

## Version Tolerance
By default, Nino's format is positional and has no per-member overhead: adding, removing or reordering members breaks existing data. Mark a type `versionTolerant` to be able to **append** members later:

```csharp{1}
[NinoType(versionTolerant: true)]
public class SaveData
{
    public int Id;
    public string Name;
    public bool Extra; // [!code ++]
}
```

Each level of the hierarchy (each `[NinoType]` class from the root down to the type itself) is written behind its own 4-byte length:
- **Old data, new code:** members missing from the data keep their current value (ref deserialization) or their default.
- **New data, old code:** trailing bytes the old code does not know are skipped.
- Members can be appended to the type **or any of its base classes**, and this works at any nesting depth, inside collections and polymorphic members.

::: warning
Not tolerated: inserting, removing or reordering members, changing the type of a member, appending members to a `[NinoType]` interface (append them to a class), and adding or removing a `[NinoType]` class in the hierarchy. Use [keyed members](#keyed-members) for those.

With `[NinoType(false)]`, give new members an index greater than every existing index.
:::

::: info
Defining the symbol `WEAK_VERSION_TOLERANCE` in a project turns `versionTolerant` on for **every** type declared in that project (types from referenced assemblies keep their own format). Prefer the per-type option.
:::

## Keyed Members
A type marked `keyed: true` writes each member with a key (a 32-bit hash of the member name, computed at compile time) and its length. Members can then be **reordered, removed and inserted** freely, much like MessagePack's `[Key("name")]`. This is mainly useful for data authored in the Unity editor or kept for a long time.

```csharp{1}
[NinoType(keyed: true)]
public class EnemyConfig
{
    public string Name;
    public float Speed;   // reordered or removed later: still readable
    public int Health;
}
```

- Unknown keys in the data are skipped; members missing from the data keep their current value or their default.
- Renaming a member changes its key, so the old value is not read.
- Cost: 8 bytes per member. Serializing takes about 1.3× and deserializing about 1.2× the time of the positional format.
- Two member names of one type (including inherited ones) that hash to the same key are a compile-time error (NINO014), so collisions cannot corrupt data.
- Keyed structs are never written as raw memory. Polymorphism works as usual.

## Reference Tracking
By default, an object referenced twice is written twice and read back as two instances, and cyclic graphs cannot be serialized. Mark a class `trackReferences: true` (subtypes inherit it) to preserve the object graph:

```csharp{1}
[NinoType(trackReferences: true)]
public class Node
{
    public int Value;
    public Node Next;    // may point back to an earlier node
}

var a = new Node { Value = 1 };
var b = new Node { Value = 2, Next = a };
a.Next = b;                                   // a cycle
var bytes = NinoSerializer.Serialize(a);
var copy = NinoDeserializer.Deserialize<Node>(bytes);
// copy.Next.Next == copy
```

- Each tracked object is written behind a 4-byte reference header: an object already written in the same call is written as its index only.
- Shared references keep their identity across members of any declared type, including `object` and interfaces.
- Tracking covers `[NinoType]` classes, not collections: the same `List<T>` in two members is still written twice.
- Cost: about 28 ns per top-level call plus 4 bytes and one identity lookup per object. Calls without tracked objects pay nothing.

::: warning
Types that must be re-created from constructor arguments or read-only members (for example positional records) cannot be tracked (NINO016). `trackReferences` on a struct is ignored with a warning (NINO015).
:::

## Ref Deserialization and Pooling

### Deserializing into Existing Instances
`NinoDeserializer.Deserialize(data, ref value)` (or `DeserializeRef(ref value, data)`) populates an existing value in place:

- **`null` target:** a new instance is created (from the pool for `[NinoPooled]` types, or through a `[NinoRefDeserialization]` factory).
- **Existing instance of the right type:** populated in place. Lists and arrays reuse their elements by index; dictionaries are merged by key (each value is read into the value its key already maps to, and keys missing from the data are removed).
- **Types that cannot be assigned after construction** are re-created, and the old instance is dropped.

Whenever an existing instance is dropped (the data holds `null`, a list shrinks, an array is reallocated, a dictionary key is removed, the polymorphic type changes), it is passed **exactly once** to the recycler of the slot's declared type:

1. the handler registered with `NinoSettings.SetRecycler<T>`, else
2. `ReturnToPool()` if the instance implements `INinoPooled` (`[NinoPooled]` types, or your own pooled collections implementing the interface), else
3. nothing: the garbage collector takes it.

```csharp
// at startup, before the first serialization call
NinoSettings.SetRecycler<Bullet>(bullet => BulletPool.Return(bullet));

Scene scene = null;
NinoDeserializer.Deserialize(frame1, ref scene);
NinoDeserializer.Deserialize(frame2, ref scene); // bullets removed since frame1 go to BulletPool
```

::: warning
Only register a handler for objects that are exclusively owned by the deserialized object graph. An instance referenced from two slots that both drop it is recycled once per slot.
:::

### Creating Instances with `[NinoRefDeserialization]`
Mark a public static method, callable without arguments, that returns the declaring type. Nino calls it instead of the constructor whenever it has to create an instance, for example to take it from your own object pool, and then populates the instance in place:

```csharp{4}
[NinoType]
public class Bullet
{
    [NinoRefDeserialization]
    public static Bullet Rent() => BulletPool.Rent();

    public int Id;
    public Vector3 Position;
}
```

It also works on collection types (a `List<T>` subclass, an `IDictionary<TKey, TValue>` implementation...). The method may return an instance that still holds elements; they are dropped (and recycled) before the data is read. It must not return `null`, and an invalid method is reported as NINO017.

### `[NinoPooled]`
`[NinoPooled]` gives a `[NinoType]` class a built-in pool. Wherever Nino creates an instance of it (top level, member or collection element), it first takes one from the pool and deserializes into it in place, reusing its lists, arrays, dictionaries and nested objects.

```csharp{1}
[NinoType, NinoPooled]
public sealed partial class Packet
{
    public int Id;
    public List<int> Values;

    // Required; the analyzer offers a fix that adds both (NINO019).
    private static partial IEnumerable<Packet> OnNinoPoolWarmup() => Enumerable.Range(0, 16).Select(_ => new Packet());
    private partial void OnNinoPoolReturn() { /* clear state Nino does not deserialize */ }
}

var packet = NinoDeserializer.Deserialize<Packet>(bytes); // reuses a pooled instance (and its list) if there is one
// ... use it ...
packet.ReturnToPool();                                    // returning it twice throws
```

- The class must be `sealed`, `partial` and populated in place (no constructor-only or read-only members); otherwise NINO018/NINO002 are reported.
- The generator adds `ReturnToPool()` and two partial methods you implement:
  - `OnNinoPoolWarmup()` runs once before the type is first deserialized; the instances it returns go straight into the pool (return `null` or nothing to start empty).
  - `OnNinoPoolReturn()` runs on `ReturnToPool()`: release state that Nino does not deserialize.
- Returning an instance twice throws an `InvalidOperationException`. An instance that is never returned is simply collected.
- Instances dropped by ref deserialization are returned to the pool automatically.
- The pool is thread safe: each thread keeps up to 64 instances of its own, and a shared stack keeps up to 256 by default. Change this at startup with `NinoSettings.DefaultPoolMaxRetained` or `NinoSettings.SetPoolMaxRetained<T>(int)`. `NinoPool<T>.Shared.Clear()` drops every pooled instance.

::: info
With pooling and ref deserialization, deserializing reused instances allocates **0 B** and runs up to 4.9× faster than MemoryPack's overwrite mode. See the [benchmarks](https://github.com/JasonXuDeveloper/Nino/blob/main/docs/v4-benchmarks.md#deserialize-into-existing-instances-pooling).
:::

::: warning
`NinoSettings` values are plain fields read without synchronization: set them in startup code before the first serialization call on any thread.
:::

## Custom Formatters
A formatter is a **struct** implementing `INinoFormatter<T>`:

```csharp
public interface INinoFormatter<T>
{
    void Serialize(T value, ref Writer writer);
    void Deserialize(ref T value, ref Reader reader);
}
```

`Deserialize` receives the current value by `ref`: `default` means "create a new value", an existing instance may be reused. Formatters are called as `default(TFormatter)`, so they have no instance state; keep any state in static fields.

### For One Member
Use `[NinoCustomFormatter]` to serialize a single member with your formatter. The formatter must implement `INinoFormatter<T>` for **exactly** the member type (NINO008):

```csharp
/// Writes a long as a zig-zag varint.
public struct ZigZagLongFormatter : INinoFormatter<long>
{
    public void Serialize(long value, ref Writer writer)
    {
        ulong v = (ulong)((value << 1) ^ (value >> 63));
        while (v >= 0x80)
        {
            writer.Write((byte)(v | 0x80));
            v >>= 7;
        }
        writer.Write((byte)v);
    }

    public void Deserialize(ref long value, ref Reader reader)
    {
        ulong v = 0;
        int shift = 0;
        byte b;
        do
        {
            reader.Read(out b);
            v |= (ulong)(b & 0x7F) << shift;
            shift += 7;
        } while ((b & 0x80) != 0);
        value = (long)(v >> 1) ^ -(long)(v & 1);
    }
}

[NinoType]
public class Delta
{
    [NinoCustomFormatter(typeof(ZigZagLongFormatter))]
    public long Value;
}
```

### For a Type: `[assembly: NinoFormatter]`
To teach Nino a type it does not know (your own or a third-party one), register a formatter on your assembly. Type arguments and element formatters are inferred: a type parameter constrained to `INinoFormatter<E>` receives the formatter Nino resolves for `E`, so element (de)serialization is inlined. Generated code calls the formatter directly, and the runtime uses the same registration.

```csharp
[assembly: NinoFormatter(typeof(RingFormatter<,>))]

public sealed class Ring<T> : IEnumerable<T> { /* a third-party fixed-capacity buffer */ }

public struct RingFormatter<T, TFormatter> : INinoFormatter<Ring<T>>
    where TFormatter : struct, INinoFormatter<T>
{
    public void Serialize(Ring<T> value, ref Writer writer)
    {
        if (value == null)
        {
            writer.Write(-1);
            return;
        }

        writer.Write(value.Capacity);
        writer.Write(value.Count);
        foreach (var item in value)
            default(TFormatter).Serialize(item, ref writer);
    }

    public void Deserialize(ref Ring<T> value, ref Reader reader)
    {
        reader.Read(out int capacity);
        if (capacity < 0)
        {
            value = null;
            return;
        }

        reader.Read(out int count);
        value = new Ring<T>(capacity);
        for (int i = 0; i < count; i++)
        {
            T item = default;
            default(TFormatter).Deserialize(ref item, ref reader);
            value.Push(item);
        }
    }
}

[NinoType]
public sealed class RingHolder
{
    public Ring<int> Ints;          // uses RingFormatter<int, ...>
    public List<Ring<string>> Nested;
}
```

- The formatter is passed as an open generic definition (`typeof(F<,>)`) and must implement `INinoFormatter<P>` exactly once. Every type parameter must be inferable from `P`, from a type constraint (`where TList : List<T>`), or from an `INinoFormatter<E>` constraint. An unusable registration is reported as NINO020.
- To target a bare type parameter (`INinoFormatter<TCollection>`), list the target types: `[assembly: NinoFormatter(typeof(F<,,>), typeof(IList<>))]`.
- When several registrations match, the higher `Priority` wins: `[assembly: NinoFormatter(typeof(F<,>), Priority = 10)]`.
- Nino's own formatters for the BCL types are declared the same way.

::: info
A formatter can also be registered at runtime for the top-level APIs with `NinoFormatterCache<T>.Register<TFormatter>()` (before first use); it then takes precedence over intercepted calls.
:::

## Interceptors
With the .NET 9 SDK or later (Roslyn 4.12+), the generator intercepts `NinoSerializer`/`NinoDeserializer` calls whose type argument is known at the call site and redirects them, at compile time, to the generated formatter: no virtual call, same bytes. For example, deserializing a small non-sealed class went from 15.5 ns to 11.6 ns.

This is automatic. To turn it off, set this in your project file:

```xml
<PropertyGroup>
    <NinoInterceptors>false</NinoInterceptors>
</PropertyGroup>
```

Unity, older compilers and calls inside generic code (`T` a type parameter) use the regular calls.

## Analyzers and Code Fixes
Nino reports mistakes as you type, through a Roslyn analyzer shipped with the generator: types that cannot be named by generated code, missing `partial`, unusable constructors, members that cannot be serialized, conflicting attributes, duplicate indices, keyed hash collisions, invalid pooling or formatter registrations, and more (`NINO001`–`NINO022`). Many come with a code fix in Visual Studio, Rider and VS Code that can be applied to a whole document, project or solution.

Severities can be changed in `.editorconfig`, for example:

```ini
dotnet_diagnostic.NINO006.severity = none
```

Nino also suppresses the compiler's "field is never used / never assigned" and the IDE's "remove unused private member" / "make field readonly" warnings for private members that Nino serializes.

See the [full diagnostics list](https://github.com/JasonXuDeveloper/Nino/blob/main/docs/diagnostics.md) for every id, its cause and its fix.

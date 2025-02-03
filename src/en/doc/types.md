---
title: Type System
lang: en
outline: deep
---
# Type System

This page consists of explanations on types that are serializable in the runtime. In addition, this page includes how to define a custom serializable type and versioning.



## Serializable Types

### Primitive Types

Nino supports serializing all [unmanaged types](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/unmanaged-types), including user-defined types. Nino natively supports:
- byte
- short
- enum
- int
- long
- float
- double
- DateTime
- Guid
- Vector
- Matrix
- unmanaged struct
- unmanaged generic struct
- unmanaged record struct
- unmanaged generic record struct

::: info
Nino also supports the String type
:::

::: info
User-defined `struct`, `struct<T>` (where `T` is an unmanaged type), `record struct`, and `record struct<T>` that only contain fields of unmanaged types are also considered unmanaged types (unmanaged structs), and Nino can automatically serialize them.

For custom unmanaged structs, Nino will automatically serialize and deserialize all fields in the structure, and the order of serialization and deserialization is determined by the order of the fields in the structure (or by using `[StructLayout(LayoutKind.Explicit)]` to specify).

Nino does not support explicitly specifying which fields to exclude or which constructor to use during deserialization.
:::


### Custom Types

If you need to serialize managed types (i.e., not the types mentioned above), add the `[NinoType]` attribute to the `class`, `struct`, `record`, or `record struct` to allow Nino to generate serialization and deserialization functions, for example:

::: code-group
```csharp{1} [Custom managed struct]
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
public record struct SampleRecord(int Id, string Name);
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
By default, the `[NinoType]` attribute will collect all public fields and properties with getters and setters in the corresponding `class` or `struct`. For `record` or `record struct`, it will not only collect all public fields and properties with getters/setters, but also the primary constructor parameters.

If you want to manually mark the members that need to be serialized, use `[NinoType(false)]` to decorate the type, and use `[NinoMember(id)]` to decorate the members that need to be serialized (the tag needs to pass a numeric parameter, which is the position of the member during serialization and deserialization, and the collection order is sorted by the number in the tag in ascending order)

::: code-group
```csharp{1,5} [Trivial example]
[NinoType(false)]
public class SampleClass
{
  public int Id;
  [NinoMember(1)]
  public string Name { get; set; }
}
```
```csharp{1,3,4} [Record example]
[NinoType(false)]
public record SampleRecord(
                [NinoMember(2)] int Id,
                [NinoMember(1)] string Name);
```
```csharp{1,3,4} [Record struct example]
[NinoType(false)]
public record struct SampleRecordStruct(
                [NinoMember(2)] int Id,
                [NinoMember(1)] string Name);
```
:::

::: info
If you need to collect non-public members, such as `protected` and `private` fields, pass additional parameters to the `NinoType` attribute:

```csharp{1}
[NinoType(containNonPublicMembers: true)]
public class SampleClass
{
  private int Id;
}
```
:::

::: info
If you have enabled automatic collection of all fields and properties and need to skip certain fields or properties (i.e. private field/property), please mark them with `[NinoIgnore]` attribute. It should be noted that if automatic collection is not enabled, this tag will be invalid.

```csharp{1,4}
[NinoType]
public class SampleClass
{
  [NinoIgnore]
  public int Id;
  public string Name { get; set; }
}
```
:::


::: warning
`[NinoIgnore]` **does not** work on primary constructor parameters of records, it **does not** work on fields of unmanaged structs either.
:::

### Generic Types

Nino supports serializing and deserializing generic types, such as:


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

::: info

Nino also supports constraints on generic type parameters:

```csharp{1,2}
[NinoType]
public class ComplexGeneric<T> where T : IList
{
    public T Val;
}
```

:::

::: info
Nino also supports serializing and deserializing generic type members declared with generic parameters, for example:

```csharp{1,4}
[NinoType]
public class ComplexGeneric2<T>
{
    public Generic<T> Val;
}
```
:::

::: warning
Nino generates corresponding serializing and deserializing functions when instantiating a generic type (actually defining a generic type with type arguments), so make sure that the generic parameters instantiated are serializable types, for example:

```csharp
Generic<int> generic = new Generic<int>();
Generic<string> generic = new Generic<string>();
Generic<List<int>> generic = new Generic<List<int>>();
```
:::


### Collection Types

In addition to supporting serialization and deserialization of the above types, Nino also supports serialization of collection types containing the above types, such as:
- `List<T>`, where T is a serializable type
- `Dictionary<TKey, TValue>`, where TKey and TValue are serializable types
- `T[]`, where T is a serializable type
- `ICollection<T>`, where T is a serializable type
- `IDictionary<TKey, TValue>`，where TKey and TValue are serializable types
- `Span<T>`, where T is a serializable type
- `HashSet<T>`, where T is a serializable type
- `ArraySegment<T>`, where T is a serializable type

::: warning
When declaring a dictionary subtype, you **must** define a public indexer, **or no serialization/deserialization code will be generated**, i.e.
```csharp
public class MultiMap<T, K> : SortedDictionary<T, List<K>>
{
    
    public new List<K> this[T key]
    {
        get
        {
            if (!TryGetValue(key, out List<K> value))
            {
                value = new List<K>();
                Add(key, value);
            }

            return value;
        }
        
        set
        {
            if (value.Count == 0)
            {
                Remove(key);
            }
            else
            {
                base[key] = value;
            }
        }
    }
}
```
:::


### Nested Types

Nino supports serialization and deserialization of nested serializable types, such as:
- `List<Dictionary<int, SampleStruct>>[]`, where `SampleStruct` is a serializable type
- `Dictionary<int[], List<bool>[]>`
- `IDictionary<string, IList<List<bool>[]>[]>[]`

### Polymorphic Types

Nino supports serializing and deserializing polymorphic types, and it should be noted that each type that needs to be serialized (interface, base class or derived class) needs to be decorated with the `[NinoType]` attribute, for example:

```csharp{1,7,8}
[NinoType]
public class BaseClass
{
  public int Id;
}

[NinoType]
public class DerivedClass : BaseClass
{
  public string Name;
}
```

When we convert a `DerivedClass` object to a `BaseClass` object for serialization, Nino will automatically recognize and serialize all fields and properties of the `DerivedClass`, and automatically convert it to a `DerivedClass` object during deserialization

::: info
In this way, we can serialize a `BaseClass` collection at will, and Nino can still correctly restore the real type of each element during deserialization

```csharp{7}
var list = new List<BaseClass> 
            { 
                new BaseClass { Id = 1 }, 
                new DerivedClass { Id = 2, Name = "Nino" } 
            };
var bytes = Serializer.Serialize(list);
Deserializer.Deserialize(bytes, out List<BaseClass> result); 
// result[0] is a BaseClass object, and result[1] is a DerivedClass object
```
:::

### Abstractions
Nino supports serializing and deserializing interfaces and abstract classes, and it should be noted that the implementation class/struct of the interface or abstract class needs to be decorated with the `[NinoType]` attribute (while the interface and abstract class themselves also need to be decorated with the `[NinoType]` attribute), for example:

::: code-group

```csharp{1,7,8,13,14} [Interface example]
[NinoType]
public interface IBase
{
    int A { get; set; }
}

[NinoType]
public class Impl : IBase
{
    public int A { get; set; }
}

[NinoType]
public struct ImplStruct : IBase
{
    public int A { get; set; }
}
```

```csharp{1,7,8} [Abstract class example]
[NinoType]
public abstract class Base
{
    public int A { get; set; }
}

[NinoType]
public class Derived : Base
{
    public int B { get; set; }
}
```
:::

Since Nino supports polymorphism, serializing the interface or abstract class implementation will automatically remain all metadata, and the deserialization process will automatically restore the real type of the object.



## Version Compatibility
- Renaming fields/properties of the same type that have been serialized is allowed (requires explicit order control via `[NinoMember(id)]`)
- Changing the type of serialized fields/properties to an unmanaged struct of the same memory size (`int`->`uint`, `int`->`float`, `List<long>`->`List<double>`, `List<int[]>`->`List<float[]>`) is allowed
  ::: danger
  Nino performs type checking when deserializing objects, so you cannot modify fields/properties that are declared in reference types.

  Nino allows you to change the declared type of a field/property if and only if the previous and the latest declared type of this field/property is a structural type.
  :::

  ::: code-group
  ```csharp [Allowed modifications]
  [NinoType]
  public class SampleClass
  {
    //float and int have the same memory size, so List<int> can be used
    public List<float> Data; // [!code --]
    public List<int> Data; // [!code ++]
  }
  ```
  
  ```csharp [Invalid modifications]
  [NinoType]
  public class SampleClass2
  {
    // The Data field type cannot be modified to another reference type
    public SampleClass Data; // [!code --]
    public SampleClass2 Data; // [!code warning]
  }
  ```
  :::
- **Adding** new fields/properties that are **not serialized/deserialized** is allowed (either decorated with `[NinoIgnore]` or not marked with `[NinoMember]` in the case of `[NinoType(false)]`)
  ::: warning
  It is not possible to add reference type members to unmanaged structs
  :::

  ::: info
  Adding new serializable members to a nino serializable type and the type will be serialized (with the new members) and deserialized (with the old data without these members being defined) is acheivable. This usually happens with game save data, as the developer may add new members to the data when the game versions. However, additional workarounds and restrictions will be needed to be applied. Please refer to [Advanced Usage](./advanced#weak-version-tolerance) for more information.
  :::

- **Deleting** serialized fields/properties is **not allowed**

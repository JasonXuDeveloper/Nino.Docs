---
title: Supported Types
lang: en
outline: deep
---
# Supported Types

This page consists of a list of types that are serializable in the runtime. In addition, this page includes how to define a custom serializable type and versioning.



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
- Other primitive types

::: info
Nino also supports the String type
:::

::: info
A user-defined `struct` that only has fields of unmanaged types is also considered an unmanaged type, and can be serialized by Nino automatically.

For custom unmanaged structs, Nino will automatically serialize and deserialize all fields in the struct, and the order of serialization and deserialization is determined by the order of the fields in the struct. You cannot explicitly specify which fields to exclude or which constructor to use when deserializing
:::


### Custom Types

If you need to serialize non-unmanaged types, please add the `[NinoType]` attribute to the `class`, `struct`, or `record` so that Nino can generate serialization and deserialization functions, for example:

::: code-group
```csharp{1} [Custom non-unmanaged struct]
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
By default, the `[NinoType]` attribute will collect all public fields and properties with getters and setters in the corresponding `class`/`struct`. For `record`s, it will not only collect all public fields and properties with getters/setters, but also the primary constructor parameters.

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
:::
:::

::: info
If you have enabled automatic collection of all fields and properties and need to skip certain fields or properties, please mark them with `[NinoIgnore]` attribute. It should be noted that if automatic collection is not enabled, this tag will be invalid.

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


### Nested Types

Nino supports serialization and deserialization of nested serializable types, such as:
- `List<Dictionary<int, SampleStruct>>[]`, where `SampleStruct` is a serializable type
- `Dictionary<int[], List<bool>[]>`
- `IDictionary<string, IList<List<bool>[]>[]>[]`

### Polymorphic Types

Nino supports serializing and deserializing polymorphic types, and it should be noted that each type that needs to be serialized (base class or derived class) needs to be decorated with the `[NinoType]` attribute, for example:

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
Nino supports serializing and deserializing interfaces and abstract classes, and it should be noted that the implementation class of the interface or abstract class needs to be decorated with the `[NinoType]` attribute (while the interface and abstract class themselves also need to be decorated with the `[NinoType]` attribute), for example:

::: code-group

```csharp{1,7,8} [Interface example]
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
- Renaming fields/properties of the same type that have been serialized is allowed
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
- Adding new fields/properties that are not serialized/deserialized is allowed (either decorated with `[NinoIgnore]` or not marked with `[NinoMember]` in the case of `[NinoType(false)]`)
  ::: warning
  It is not possible to add reference type members to unmanaged structs
  :::
- **Deleting** serialized fields/properties is **not allowed**

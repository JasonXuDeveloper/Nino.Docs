---
title: Quick Start
lang: en
outline: deep
---
# Quick Start

This page describes how to quickly get started using Nino, including installation, defining serializable types, serialization and deserialization, etc.

## Installation

### .NET Project

::: info
Nino supports projects with .NET 5.0 or higher, or .NET Standard 2.0 or higher
:::

- Nino supports installation via NuGet, simply search for `Nino` in the NuGet package manager in Visual Studio or Rider and install it
- Alternatively, `dotnet` command can be used to install the latest version of Nino:
    ```shell
    dotnet add package Nino
    ```

::: warning
Please be aware that this method does not support .NET Framework projects, and IDEs that do not support `Source Generator` (such as Visual Studio Code)
:::

### Unity Project

::: info
Nino supports projects with Unity 2022.3 or higher, and is compatible with any player platform

We recommend running the `Nino_Unity` sample project from GitHub first to learn how to use Nino in Unity
:::

1. Please look up the needed Nino version from the [Release](https://github.com/JasonXuDeveloper/Nino/releases) and download the corresponding `Nino.unitypackage` plugin
2. Please ensure that the `Microsoft.CodeAnalysis` NuGet package (latest version is fine) is installed to support `Source Generator` in Unity
   > This NuGet package can be installed in the Unity project, for example by executing `dotnet add package Microsoft.CodeAnalysis.CSharp --version 4.10.0` after entering the Unity directory (same level as Assets)
3. Import the downloaded Nino plugin into the Unity project
4. Move the imported Nino folder to a directory with an asmdef (such as the Test directory in the Nino_Unity project), as Unity has a bug that requires the Nino source code to be placed in a directory with an asmdef in order to generate code that does not throw errors for types in that directory
5. If an error occurs stating `Nino.Core references netstandard, Version=2.1.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51. A roslyn analyzer should reference netstandard version 2.0`, please ignore it, as this is a Unity bug
6. If multiple asmdefs are needed, copy the imported Nino directory into directories with different asmdefs

::: tip
If you encounter any issues, please ensure that you have followed the above steps and can run the `Nino_Unity` sample project normally. If the problem persists, please submit an Issue on GitHub
:::

#### Hot Update Code
- Nino supports **HybridCLR** and **ILRuntime**
- If you need to create a C# project externally (not an asmdef within Unity) to write hot update code, please create a .NET Core project and install the Nino library via NuGet ([refer to this](#net-project)), then use the compiled DLL in HybridCLR or ILRuntime


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


### Custom Types

If you need to serialize non-unmanaged types, please add the `[NinoType]` attribute to the class or struct so that Nino can generate serialization and deserialization functions, for example:

```csharp{1}
[NinoType]
public struct SampleStruct
{
  public int Id;
  public string Name { get; set; }
}
```

::: info
By default, the `[NinoType]` attribute will collect all public fields and properties with getters and setters in the corresponding class/struct

If you want to manually mark the members that need to be serialized, use `[NinoType(false)]` to decorate the class or struct, and use `[NinoMember(id)]` to decorate the members that need to be serialized (the tag needs to pass a numeric parameter, which is the position of the member during serialization and deserialization, and the collection order is sorted by the number in the tag in ascending order)

```csharp{1,5}
[NinoType(false)]
public class SampleClass
{
  public int Id;
  [NinoMember(1)]
  public string Name { get; set; }
}
```
:::

::: info
If you have enabled automatic collection of all fields and properties and need to skip certain fields or properties, please mark them with `[NinoIgnore]` attribute. It should be noted that if automatic collection is not enabled, this tag will be invalid


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

### Version Compatibility
- Renaming fields/properties of the same type that have been serialized is allowed
- Changing the type of serialized fields/properties to an unmanaged struct of the same memory size (`int`->`uint`, `int`->`float`, `List<long>`->`List<double>`, `List<int[]>`->`List<float[]>`) is allowed
  ::: danger
  Nino performs type checking when deserializing objects, so you cannot modify fields/properties that are not unmanaged types
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
    // The Data field type cannot be modified to another type
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

### Serialization

#### Standard Usage

```csharp
byte[] Serializer.Serialize(NinoSerializableType val);
void Serializer.Serialize(NinoSerializableType val, IBufferWriter<byte> bufferWriter);
```

Example:

```csharp
ObjClass obj = new ObjClass();
byte[] byteArr = Serializer.Serialize(obj);
//or use extension method
byteArr = obj.Serialize();
```

### Advanced Usage
Please note that the `IBufferWriter<byte>` interface is used to write serialized data to a buffer, and you can implement your own `IBufferWriter<byte>` type according to your needs. This way, you don't necessarily need to allocate a new binary array after serialization is complete
> For example, you can encapsulate an `IBufferWriter<byte>` type with MemoryStream or NetworkStream


### Deserialization

```csharp
void Deserializer.Deserialize(ReadOnlySpan<byte> data, out NinoSerializableType value);
```

> The data can not only be passed as `byte[]`, but also as `ArraySegment<byte>` or `Span<byte>`


#### Standard Usage
```csharp
//assuming byteArr is byte[]
Deserializer.Deserialize(byteArr, out ObjClass obj);
```

### Advanced Usage
```csharp
//assuming data is ReadOnlySequence<byte> from the network layer, i.e. we are using Pipeline
ReadOnlySequence<byte> data = xxxxx;
ObjClass obj;
//If the data is in a single contiguous memory block, we can pass in Span<byte> directly
if(data.IsSingleSegment)
{
  Span<byte> dataSpan = data.FirstSpan;
  Deserializer.Deserialize(dataSpan, out ObjClass obj);
}
//If the data is not in a single contiguous memory block, we need to copy it to a single contiguous memory block first
else
{
  if(data.Length <= 1024)
  {
    //Allocate on the stack
    Span<byte> stackMemory = stackalloc byte[(int)data.Length];
    data.CopyTo(stackMemory);
    Deserializer.Deserialize(stackMemory, out ObjClass obj);
  }
  else
  {
    //Allocate on the heap, use object pool
    byte[] arr = ArrayPool<byte>.Shared.Rent((int)data.Length);
    data.CopyTo(arr);
    Deserializer.Deserialize(arr, out ObjClass obj);
    ArrayPool<byte>.Shared.Return(arr);
  }
}
```


## Limitations

- Need to be used with Source Generator
- Cannot use NinoType to modify custom generic types
- No generic serialization/deserialization of unmanaged types
- Cannot serialize/deserialize non-public fields/properties
- Need to have a parameterless constructor
- When attempting to serialize types that are not supported (such as Queue), a compilation error will occur
- Currently, the serialization and deserialization ends need to correspond one-to-one with the Nino serialization types (i.e., if I use Nino to serialize in Project A, there are 10 NinoType types, then when deserializing the binary generated by Project A in Project B, ensure that Project B also has exactly the same 10 NinoType types)
   ::: info
   This limitation can currently be resolved by copying the generated code from one project to another (NinoSerializerExtension.(Ext.)g.cs and NinoDeserializerExtension.(Ext.)g.cs)
  
   This way, you don't need to worry about whether the number of types between different projects matches, for example, when Server receives data from Client, use the Client's Deserializer, and when Client receives data from Server, use the Server's Deserializer. Each end sends data using its own Serializer
  
   This issue arises because of the need to support polymorphism, so each type needs to be assigned a TypeId, which is currently assigned by the name of all NinoType types in order, so it is necessary to ensure that the type names of different projects are consistent, otherwise the TypeId generated by the two projects will be inconsistent, resulting in the inability to deserialize data across projects. If you have a solution to this problem, please feel free to submit PR
   :::
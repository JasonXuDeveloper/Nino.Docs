---
title: Advanced Usage
lang: en
outline: deep
---
# Advanced Usage
This page describes how to use Nino in more advanced scenarios.

## Custom Constructors
Nino now supports using custom constructors to `deserialize` a nino serialized object. This is useful when you want to perform additional operations when deserializing an object, such as initializing fields or properties that are not serialized.

In addition, this is useful for records, nino can either use the primary constructor or a custom constructor to deserialize the record.

### Usage
The following attribute uses `Field1, Field2, ...` as the arguments for a constructor to deserialize the object.
```csharp
[NinoConstructor(nameof(Field1), nameof(Field2), ...)]
```

For `record`s, Nino will **prioritize** using the primary constructor to deserialize the object. If the primary constructor is not suitable for deserialization, you can use the `[NinoConstructor]` attribute to specify a custom constructor to deserialize the object.

For `class`es, Nino will **automatically** use the `first public constructor` to deserialize the object. Where either the constructor is parameterless or all parameters shares the same name as the **fields or properties in the class that are to be deserialized**. If the constructor is not suitable for deserialization, you can use the `[NinoConstructor]` attribute to specify a custom constructor to deserialize the object.

For `struct`s, Nino will **automatically** use the parameterless constructor to deserialize the object. If the struct should not use a parameterless constructor (struct always have parameterless constructor though) when deserializing, you can use the `[NinoConstructor]` attribute to specify a custom constructor to deserialize the object.

### Restrictions
- The custom constructor must be a `public` constructor.
- The custom constructor must have the same number of parameters as the number of parameters in `NinoConstructor` attribute.
- The parameters in `NinoConstructor` attribute must match the name (ignoring cases) of the fields or properties in the class, struct, or record that are to be deserialized (i.e. these members have to be serialized in the first place).
- The parameters in `NinoConstructor` attribute represents the name of the type's members to be passed as the parameters in the constructor.


### Examples
::: code-group
```csharp{15} [Multiple Constructors]
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
```csharp{2,5,11} [Primary Constructor]
[NinoType]
public record SimpleRecord2(int Id, string Name, DateTime CreateTime);

[NinoType]
public record SimpleRecord4(int Id, string Name, DateTime CreateTime) // Will be used
{
    [NinoIgnore] public bool Flag;

    public int ShouldNotIgnore;

    // Nino will not use this
    public SimpleRecord4() : this(0, "", DateTime.MinValue)
    {
    }
}
```
```csharp{2,9} [Not To Use Primary Constructor]
[NinoType]
public record SimpleRecord5(int Id, string Name, DateTime CreateTime) // Will not be used
{
    [NinoIgnore] public bool Flag;

    public int ShouldNotIgnore;

    // Nino will use this, but not good since we will discard the primary constructor values when deserializing
    [NinoConstructor]
    public SimpleRecord5() : this(0, "", DateTime.MinValue)
    {
    }
}
```
:::

Moreover, not only for records we have the ability to use custom constructors, but also for classes and structs.
::: code-group
```csharp{9} [Force Struct to use Parameterized Constructor]
[NinoType]
public struct SimpleStruct
{
    public int Id;
    public string Name;
    public DateTime CreateTime;
    
    // Will use this constructor to create the struct when deserializing
    [NinoConstructor(nameof(Id), nameof(Name), nameof(CreateTime))]
    public SimpleStruct(int a, string b, DateTime c)
    {
        Id = a;
        Name = b;
        CreateTime = c;
    }
}
```
```csharp{10} [Automatically used Class Parameterized Constructor]
[NinoType]
public class SimpleClassWithConstructor
{
    public int Id;
    public string Name;
    public DateTime CreateTime;
    
    // [NinoConstructor(nameof(Id), nameof(Name), nameof(CreateTime))] - we try not to use this and test if it still works
    // should automatically use this constructor since this is the only public constructor
    public SimpleClassWithConstructor(int id, string name, DateTime createTime)
    {
        Id = id;
        Name = name;
        CreateTime = createTime;
    }
}
```
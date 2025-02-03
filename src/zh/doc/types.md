---
title: 类型系统
lang: zh
outline: deep
---
# 类型系统

本页包含了运行时可序列化的类型。此外，本页还包含了如何定义自定义可序列化类型和版本兼容性。

## 可序列化类型

### 基础类型

Nino支持序列化一切[unmanaged type](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/unmanaged-types)（包括用户自己定义的），也就是说Nino默认支持：
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
- 非托管struct
- 非托管泛型struct
- 非托管record struct
- 非托管泛型record struct

::: info
Nino 也支持String类型
:::

::: info
只包含unmanaged类型字段的用户自定义`struct`、`struct<T>`（`T`是非托管类型）、`record struct`、`record struct<T>`（`T`是非托管类型）也被视为unmanaged类型（非托管结构体），Nino可以自动将其序列化

对于自定义的非托管结构体，Nino会自动序列化和反序列化结构中的所有字段，序列化和反序列化的顺序由结构中字段的顺序决定（或`[StructLayout(LayoutKind.Explicit)]`来指定）。

Nino不支持显式指定要排除哪些字段或在反序列化时使用哪个构造函数
:::


### 自定义类型

如果需要序列化托管类型（即不是上述类型），请给`class`、`struct`、`record`、`record struct`添加`[NinoType]`特性，以便Nino生成序列化和反序列化函数，例如：


::: code-group
```csharp{1} [自定义托管Struct]
[NinoType]
public struct SampleStruct
{
  public int Id;
  public string Name { get; set; }
}
```
```csharp{1} [自定义Record]
[NinoType]
public record SampleRecord(int Id, string Name);
```
```csharp{1} [自定义Record Struct]
[NinoType]
public record struct SampleRecordStruct(int Id, string Name);
```
```csharp{1} [自定义类]
[NinoType]
public class SampleClass
{
  public int Id;
  public string Name { get; set; }
}
```
:::

::: info
`[NinoType]`特性默认会收集对应`类`或`结构体`所有public字段及包含getter与setter的属性。如果是`record`或`record struct`，则会在此之上收集主要构造函数的参数

若希望手动标记需要序列化的成员请使用`[NinoType(false)]`修饰类或结构体并用`[NinoMember(id)]`修饰需要序列化的成员（标签内部需要传入一个数字参数，即序列化和反序列化时该成员的位置，收集顺序是按标签的数字从小到大排序的）：

::: code-group
```csharp{1,5} [常规示范]
[NinoType(false)]
public class SampleClass
{
  public int Id;
  [NinoMember(1)]
  public string Name { get; set; }
}
```
```csharp{1,3,4} [Record示范]
[NinoType(false)]
public record SampleRecord(
                [NinoMember(2)] int Id,
                [NinoMember(1)] string Name);
```
```csharp{1,3,4} [Record Struct示范]
[NinoType(false)]
public record struct SampleRecord(
                [NinoMember(2)] int Id,
                [NinoMember(1)] string Name);
```
:::

::: info
如果需要收集非`public`成员，如`protected`及`private`字段，请给`NinoType`特性传递额外参数：

```csharp{1}
[NinoType(containNonPublicMembers: true)]
public class SampleClass
{
  private int Id;
}
```
:::

::: info
如果开启了自动收集全部字段和属性，且需要略过某些字段或属性（如private字段/属性），请将其打上`[NinoIgnore]`标签，需要注意的是，如果没开启自动收集，该标签会无效


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
`[NinoIgnore]` **不适用** 于record的主要构造函数参数，也 **不适用** 于非托管结构的字段。
:::

### 泛型类型

Nino支持序列化和反序列化泛型类型，例如：

::: code-group
```csharp{1} [泛型struct]
[NinoType]
public struct GenericStruct<T>
{
    public T Val;
}
```
```csharp{1} [泛型类]
[NinoType]
public class Generic<T>
{
    public T Val;
}
```
```csharp{1} [泛型record]
[NinoType]
public record SimpleRecord6<T>(int Id, T Data);
```
```csharp{1} [泛型record struct]
[NinoType]
public record struct SimpleRecordStruct2<T>(int Id, T Data);
```
:::

::: info

Nino还支持对泛型参数进行约束：
```csharp{1,2}
[NinoType]
public class ComplexGeneric<T> where T : IList
{
    public T Val;
}
```

:::

::: info

Nino还支持对使用泛型参数声明的泛型类型成员进行序列化和反序列化，例如：

```csharp{1,4}
[NinoType]
public class ComplexGeneric2<T>
{
    public Generic<T> Val;
}
```
:::

::: warning
Nino会在定义泛型实例类型时生成对应的函数，需要确保实例化的泛型参数是可以被序列化的类型，例如：

```csharp
Generic<int> generic = new Generic<int>();
Generic<string> generic = new Generic<string>();
Generic<List<int>> generic = new Generic<List<int>>();
```
:::

### 集合类型

除了支持序列化和反序列化上述类型之外，Nino还支持序列化上述类型的集合类型（包含字典），例如：
- `List<T>`，T是可序列化类型
- `Dictionary<TKey, TValue>`，TKey和TValue是可序列化类型
- `T[]`，T是可序列化类型
- `ICollection<T>`，T是可序列化类型
- `IDictionary<TKey, TValue>`，TKey和TValue是可序列化类型
- `Span<T>`，T是可序列化类型
- `HashSet<T>`，T是可序列化类型
- `ArraySegment<T>`，T是可序列化类型

::: warning
当定义字典的子类时，**必须**申明一个公开的索引器，**否则不会生成序列化/反序列化代码**，例如：
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


### 嵌套类型

Nino支持序列化和反序列化嵌套的可序列化类型，例如：
- `List<Dictionary<int, SampleStruct>>[]`，SampleStruct是可序列化类型
- `Dictionary<int[], List<bool>[]>`
- `IDictionary<string, IList<List<bool>[]>[]>[]`

### 多态类型

Nino支持序列化和反序列化多态类型，需要注意的是，每个需要序列化的类型（接口、基类或派生类）都需要使用`[NinoType]`特性修饰，例如：

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

当我们把一个`DerivedClass`对象转换为`BaseClass`对象去序列化时，Nino会自动识别并序列化`DerivedClass`的所有字段和属性，反序列化时也会自动转换为`DerivedClass`对象

::: info
这样一来我们可以随便序列化一个`BaseClass`集合，在反序列化时Nino依然能正常还原出每个元素的真实类型：

```csharp{7}
var list = new List<BaseClass> 
            { 
                new BaseClass { Id = 1 }, 
                new DerivedClass { Id = 2, Name = "Nino" } 
            };
var bytes = Serializer.Serialize(list);
Deserializer.Deserialize(bytes, out List<BaseClass> result); 
// result[0]是BaseClass对象，result[1]是DerivedClass对象
```
:::

### 抽象类和接口
Nino支持序列化和反序列化接口和抽象类，需要注意的是接口或抽象类的实现类/结构体需要被`[NinoType]`特性修饰（同时接口和抽象类本身也需要被`[NinoType]`特性修饰），例如：

::: code-group

```csharp{1,7,8,13,14} [接口示例]
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

```csharp{1,7,8} [抽象类示例]
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

因为Nino支持多态，所以序列化接口或抽象类的实现类时会自动保留所有元数据，反序列化过程会自动还原对象的真实类型。


## 版本兼容
- 可以给已序列化的相同类型的字段/属性改名 （需要通过`[NinoMember(id)]`标签指定成员在序列化和反序列化时的位置）
- 可以给已序列化的字段/属性改成相同内存大小的unmanaged struct（`int`->`uint`，`int`->`float`，`List<long>`->`List<double>`，`List<int[]>`->`List<float[]>`）
  ::: danger
  Nino会在反序列化对象时进行类型校验，所以不能修改类型为引用类型的字段/属性

  Nino允许将是值类型（结构体）的字段/属性的类型修改为另一个值类型（例如`public MyStruct val` 可以修改为 `public MyStruct2 val`，但需要确保`MyStruct`和`MyStruct2`都是值类型，且内部内存结构一致）
  :::

  ::: code-group
  ```csharp [允许的修改]
  [NinoType]
  public class SampleClass
  {
    //float和int内存大小一致，可以换成List<int>
    public List<float> Data; // [!code --]
    public List<int> Data; // [!code ++]
  }
  ```
  
  ```csharp [禁止的修改]
  [NinoType]
  public class SampleClass2
  {
    // 这里的Data字段类型不能修改为其他类型
    public SampleClass Data; // [!code --]
    public SampleClass2 Data; // [!code warning]
  }
  ```
  :::


- 可以添加**不被序列化/反序列化**的新的字段/属性（即使用`[NinoIgnore]`修饰的成员，或在`[NinoType(false)]`的情况下不标记`[NinoMember]`的成员）
  ::: warning
  不支持给unmanaged struct添加引用类型成员
  :::

  ::: info
  **添加可序列化新成员**到一个**已序列化的类型**中，并将不包含新成员的老数据进行反序列化是**可行**的。这种情况通常发生在游戏存档数据中，实现这个需求需要额外的处理，并且有限制，请参考[进阶用法](./advanced#弱版本兼容)。
  :::

- **不可以**删除被收集的字段/属性

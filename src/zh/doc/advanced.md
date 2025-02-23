---
title: 进阶用法
lang: zh
outline: deep
---
# 进阶用法
本页描述了Nino的进阶用法

## 字符串编码
Nino支持为`NinoType`中的字符串成员指定编码。默认情况下，Nino使用UTF-16编码来序列化和反序列化这些字符串成员。然而，你可以通过使用`[NinoUtf8]`属性来指定不同的编码。使用UTF-8编码的好处是可以减小序列化数据的大小（将序列化的二进制大小减半）。

::: warning
使用UTF-8编码可能会导致序列化和反序列化这些字段的性能略有下降，大约在5%到10%之间。
:::

::: info
当使用`[NinoUtf8]`标记非字符串成员时，Nino会忽略这个属性。
:::

### 使用方法
```csharp
[NinoType]
public class StringData
{
    [NinoUtf8] public string Str;
    [NinoUtf8] public bool ShouldHaveNoEffect;
}
```

## 版本兼容性
- **重命名**已序列化的字段/属性是允许的（但必须确保成员顺序保持不变，或 `NinoMember` 中指定的 `id` 保持一致）
- **更改**已序列化字段/属性的（**非托管** 结构体）类型为具有相同内存大小的 **非托管** 结构体是允许的（例如：`int` -> `uint`、`int` -> `float`、`List<long>` -> `List<double>`、`List<int[]>` -> `List<float[]>`）
- **更改**已序列化字段/属性的类型为其 **基类/派生类**是允许的
- **在数据结构末尾添加**新字段/属性是允许的（例如，在使用 `[NinoType]` 属性进行 **自动收集** 时，将 **新成员放在**之前收集成员的 **最后一个成员之后**；或者如果使用 `[NinoType(false)]` 和 `[NinoMember(id)]` 属性，则将 `id` 设置为一个合理的值，以便其 **排在**之前成员的最后一个之后，Nino 会按照 `id` 的 **升序**对成员进行排序）
  > 需要在项目中定义符号 `WEAK_VERSION_TOLERANCE` 以启用此功能
- **删除**已序列化字段/属性是不允许的

### 示例

有效更改：
::: code-group
```csharp [非托管相同大小结构体]
[NinoType]
public class SampleClass
{
    // float和int都是4字节
    public List<float> Data; // [!code --]
    public List<int> Data; // [!code ++]
}
```

```csharp [派生 -> 基类]
[NinoType]
public interface IBase
{
}
[NinoType]
public class Derived : IBase;
[NinoType]
public class SampleClass2
{
    public Derived Data; // [!code --]
    public IBase Data; // [!code ++]
}
```

```csharp [基类 -> 派生类]
[NinoType]
public interface IBase
{
}
[NinoType]
public class Derived : IBase;
[NinoType]
public struct DerivedStruct : IBase;
[NinoType]
public class SampleClass2
{
    public IBase Data; // [!code --]
    // 如果Data是DerivedStruct
    public DerivedStruct Data; // [!code ++]
    // 如果Data是Derived
    public Derived Data; // [!code ++]
}
```
:::

无效更改：
::: code-group
```csharp [无关类型]
[NinoType]
public class SampleClass2
{
public SampleClass Data; // [!code --]
// 假设SampleClass2不是SampleClass的基类或派生类
public SampleClass2 Data; // [!code warning]
}
```
    
```csharp [错误的派生类型]
[NinoType]
public interface IBase
{
}
[NinoType]
public class Derived : IBase;
[NinoType]
public struct DerivedStruct : IBase;
[NinoType]
public class SampleClass2
{
    public IBase Data; // [!code --]
    // 如果Data是DerivedStruct
    public Derived Data; // [!code warning]
    // 如果Data是Derived
    public DerivedStruct Data; // [!code warning]
}
```

```csharp [非托管不同大小结构体]
[NinoType]
public class SampleClass2
{
public int Data; // [!code --]
public long Data; // [!code warning]
}
```
:::

有效添加新成员：
::: code-group
```csharp [自动收集]
// 假设WEAK_VERSION_TOLERANCE已定义
[NinoType]
public class SampleClass
{
    public int Id;
    public string Name;
    public bool Extra; // [!code ++]
}
```
```csharp [手动收集]
// 假设WEAK_VERSION_TOLERANCE已定义
[NinoType(false)]
public class SampleClass
{
    [NinoMember(0)] public int Id;
    [NinoMember(1)] public string Name;
    [NinoMember(2)] public bool Extra; // [!code ++]
}
```
:::

无效添加新成员：
::: code-group
```csharp [没定义符号]
// 假设WEAK_VERSION_TOLERANCE未定义
[NinoType]
public class SampleClass
{
    public int Id;
    public string Name;
    public bool Extra; // [!code warning]
}
```

```csharp [新字段未添加到最后]
// 假设WEAK_VERSION_TOLERANCE已定义
[NinoType]
public class SampleClass
{
    public int Id;
    public bool Extra; // [!code warning]
    public string Name;
}
```

```csharp [新字段未添加到最后]
// 假设WEAK_VERSION_TOLERANCE已定义
[NinoType(false)]
public class SampleClass
{
    [NinoMember(0)] public int Id;
    [NinoMember(1)] public string Name;
    [NinoMember(-1)] public bool Extra; // [!code warning]
}
```
:::

## 自定义构造函数
Nino现在支持使用自定义构造函数来`反序列化`一个nino序列化的对象。这在你想要在反序列化对象时执行额外操作时非常有用，比如初始化那些没有被序列化的字段或属性。

另外，这对于`record`来说，nino可以使用主构造函数或自定义构造函数来反序列化record。

### 使用方法
以下属性使用`Field1, Field2, ...`作为构造函数的参数来反序列化对象。
```csharp
[NinoConstructor(nameof(Field1), nameof(Field2), ...)]
```

对于`record`，Nino将**优先**使用主构造函数来反序列化对象。如果不想使用主构造函数，可以使用`[NinoConstructor]`属性来指定自定义构造函数来反序列化对象。

对于`class`，Nino将**自动**使用`第一个public构造函数`来反序列化对象。其中构造函数要么是无参数的，要么所有参数与类中要反序列化的**字段或属性的名称相同**。如果不想使用上述的构造函数进行反序列化，可以使用`[NinoConstructor]`属性来指定自定义构造函数来反序列化对象。

对于`struct`，Nino将**自动**使用无参数构造函数来反序列化对象。如果struct不应该使用无参数构造函数（需要注意，struct始终有无参数构造函数），可以使用`[NinoConstructor]`属性来指定自定义构造函数来反序列化对象。

### 限制
- 自定义构造函数必须是`public`构造函数。
- 自定义构造函数的参数数量必须与`NinoConstructor`标签中的参数数量相同。
- `NinoConstructor`标签的参数必须与类、struct或record中会被反序列化的字段或属性的名称匹配（忽略大小写）
- `NinoConstructor`标签的参数表示这个类型的对应会被反序列化的成员的名称，会按顺序传递给构造函数。

### 示例
::: code-group
```csharp{15} [多个构造函数]
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
```csharp{2,5,11} [主构造函数]
[NinoType]
public record SimpleRecord2(int Id, string Name, DateTime CreateTime);

[NinoType]
public record SimpleRecord4(int Id, string Name, DateTime CreateTime) // 会被使用
{
    [NinoIgnore] public bool Flag;

    public int ShouldNotIgnore;

    // Nino 不会使用这个构造函数
    public SimpleRecord4() : this(0, "", DateTime.MinValue)
    {
    }
}
```
```csharp{2,9} [忽略主构造函数]
[NinoType]
public record SimpleRecord5(int Id, string Name, DateTime CreateTime) // 不会被使用
{
    [NinoIgnore] public bool Flag;

    public int ShouldNotIgnore;

    // Nino会使用这个构造函数，但是这么做不好，因为在反序列化时会忽略序列化的Id, Name, CreateTime
    [NinoConstructor]
    public SimpleRecord5() : this(0, "", DateTime.MinValue)
    {
    }
}
```
:::

除此之外，我们不仅可以针对`record`使用自定义构造函数，也可以针对`class`和`struct`使用自定义构造函数。
::: code-group
```csharp{9} [强制结构体使用带参数的构造函数]
[NinoType]
public struct SimpleStruct
{
    public int Id;
    public string Name;
    public DateTime CreateTime;
    
    // 会使用这个构造函数来创建结构体
    [NinoConstructor(nameof(Id), nameof(Name), nameof(CreateTime))]
    public SimpleStruct(int a, string b, DateTime c)
    {
        Id = a;
        Name = b;
        CreateTime = c;
    }
}
```
```csharp{10} [自动使用类的第一个带参构造函数]
[NinoType]
public class SimpleClassWithConstructor
{
    public int Id;
    public string Name;
    public DateTime CreateTime;
    
    // [NinoConstructor(nameof(Id), nameof(Name), nameof(CreateTime))] - 我们尝试不使用这个，看看是否会自动使用
    // 应该会自动使用这个构造函数，因为这是唯一的public构造函数
    public SimpleClassWithConstructor(int id, string name, DateTime createTime)
    {
        Id = id;
        Name = name;
        CreateTime = createTime;
    }
}
```
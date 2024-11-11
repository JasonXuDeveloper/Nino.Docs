---
title: 进阶用法
lang: zh
outline: deep
---
# 进阶用法
本页描述了Nino的进阶用法

## 弱版本兼容

Nino支持一种更弱（更灵活）的版本兼容机制。这意味着你可以向一个可Nino序列化类型中添加新字段而不会影响反序列化来自旧版本的序列化数据。这个通常用于游戏中的存档数据，在版本迭代中我们可能会给存档数据新增一些成员。

然而，这个机制有一些限制：
- 只能在类型的末尾添加新成员。
- 需要通过`[NinoType(false)]`和`[NinoMember(order)]`属性来明确地对成员进行排序，以确保新成员在旧成员之后添加。
- 不能删除任何现有成员。并且更改现有成员的类型也有限制（参考[类型系统](./types#版本兼容)）。
- 不能定义新的可序列化类型，或需要确保Nino生成的序列化代码里对这个类型的TypeId没有变动过，例如：
  ```csharp
  case 26:
  {
      // use Nino.UnitTests.SaveData.SaveData()
  ```
  我们需要确保在添加新的可序列化类型的后，需要进行版本兼容的类型（如`SaveData`）的TypeId（这里是`26`）没有变动过。

默认情况下，这个弱版本兼容机制是禁用的。要启用它，你需要在项目中添加`WEAK_VERSION_TOLERANCE`定义符号。

::: warning
请注意，启用此功能会导致反序列化性能下降5%。
:::

### 使用方法
```csharp
// 假设已经定义了WEAK_VERSION_TOLERANCE
[NinoType(false)]
{
    [NinoMember(1)] public int Id;
    [NinoMember(2)] public string Name;
    [NinoMember(3)] public DateTime NewField1; // [!code ++]
    [NinoMember(4)] public Generic<int> NewField2; // [!code ++]
}
```

在这个例子中，我们向`SaveData`类添加了两个新字段`NewField1`和`NewField2`。通过使用`[NinoType(false)]`和`[NinoMember(order)]`属性，我们可以确保新字段在旧字段之后添加。这样，旧版本的序列化数据仍然可以正确反序列化（需要定义符号`WEAK_VERSION_TOLERANCE`）。

::: info
这实际上是我们的一个单元测试用例，我们已经验证它可以正常工作。
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
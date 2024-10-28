---
title: 进阶用法
lang: zh
outline: deep
---
# 进阶用法
本页描述了Nino的进阶用法

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
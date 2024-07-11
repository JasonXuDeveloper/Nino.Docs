---
title: 快速开始
lang: zh
outline: deep
---
# 快速开始

本页描述了如何快速上手使用Nino，包含如何安装、定义可序列化类型、序列化与反序列化等内容

## 下载安装

### .NET 项目 

::: info
Nino支持.NET 5.0 及以上版本的项目，或.NET Standard 2.0 及以上版本的项目
:::

- Nino支持通过NuGet包管理器进行安装，可以在Visual Studio或Rider中在NuGet插件中搜索`Nino`并安装
- 除此之外，也可以使用命令行工具`dotnet`进行安装：
    ```shell
    dotnet add package Nino --version 2.0.3
    ```

::: warning
请注意，此方法不支持.NET Framework项目，同时不支持无法使用`Source Generator`的IDE（如Visual Studio Code）
:::

### Unity 项目

::: info
Nino支持Unity 2022.3 及以上版本的项目，支持在任意平台发布

建议先运行GitHub上的`Nino_Unity`示例项目，以了解如何在Unity中使用Nino
:::

1. 请在[Release](https://github.com/JasonXuDeveloper/Nino/releases)页面寻找需要使用的Nino版本，并下载对应的`Nino.unitypackage`插件
2. 请确保已安装`Microsoft.CodeAnalysis`（最新版即可）的NuGet包，以便在Unity内支持`Source Generator`
   > 这个NuGet包可以在Unity项目内安装，例如进入Unity目录（Assets同级目录）后执行`dotnet add package Microsoft.CodeAnalysis.CSharp --version 4.10.0`
3. 将下载好的Nino插件导入Unity项目
4. 把导入后的Nino文件夹移动到一个带有asmdef的目录内（如Nino_Unity工程里的Test目录），这是因为Unity有Bug，必须把Nino源码放在一个asmdef目录内才能对这个目录内类型生成不会报错的代码
5. 如果报错`Nino.Core references netstandard, Version=2.1.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51. A roslyn analyzer should reference netstandard version 2.0`请忽略，这是unity的bug
6. 如果需要多个asmdef使用，就把导入的Nino目录复制到多个带有不同asmdef的目录内

::: tip
遇到问题请先确保已经按照上述步骤操作，同时能够正常运行`Nino_Unity`示例项目，如果问题依然存在，请在GitHub上提交Issue
:::

#### 代码热更
- Nino支持**HybridCLR**与**ILRuntime**
- 如果需要另外在外部创建一个C#工程（不是Unity内的asmdef）来编写热更代码，请创建.NET Core工程并通过NuGet安装Nino库（[参考这里](#net-项目)），再将编译出来的DLL在HybridCLR或ILRuntime中使用


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
- 等其他基础数值结构

::: info
Nino 也支持String类型
:::

### 自定义类型

如果需要序列化非`unmanaged type`，请在类或结构体上添加`[NinoType]`特性，以便Nino生成序列化与反序列化函数，例如

```csharp{1}
[NinoType]
public struct SampleStruct
{
  public int Id;
  public string Name { get; set; }
}
```

::: info
`[NinoType]`特性默认会收集对应类/结构所有public的字段及包含getter与setter的属性

若希望手动标记需要序列化的成员请使用`[NinoType(false)]`修饰类或结构体并用`[NinoMember(id)]`修饰需要序列化的成员（标签内部需要传入一个数字参数，即序列化和反序列化时该成员的位置，收集顺序是按标签的数字从小到大排序的）：

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
如果开启了自动收集全部字段和属性，且需要略过某些字段或属性，请将其打上`[NinoIgnore]`标签，需要注意的是，如果没开启自动收集，该标签会无效


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


### 嵌套类型

Nino支持序列化和反序列化嵌套的可序列化类型，例如：
- `List<Dictionary<int, SampleStruct>>[]`，SampleStruct是可序列化类型
- `Dictionary<int[], List<bool>[]>`
- `IDictionary<string, IList<List<bool>[]>[]>[]`

### 多态类型

Nino支持序列化和反序列化多态类型，需要注意的是，每个需要序列化的类型（基类或派生类）都需要使用`[NinoType]`特性修饰，例如：

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


## 版本兼容
- 可以给已序列化的相同类型的字段/属性改名
- 可以给已序列化的字段/属性改成相同内存大小的unmanaged struct（`int`->`uint`，`int`->`float`，`List<long>`->`List<double>`，`List<int[]>`->`List<float[]>`）
  ::: danger
  Nino会在反序列化对象时进行类型校验，所以不能修改修饰类型为非unmanaged type的字段/属性
  :::

  ::: code-group
  ```csharp [允许的修改]
  [NinoType]
  public class SampleClass
  {
    //float和int内存大小一致，可以换成List<int>，但不能是List<double>
    public List<float> Data; // [!code --]
    public List<int> Data; // [!code ++]
  }
  ```
  
  ```csharp [错误的修改]
  [NinoType]
  public class SampleClass2
  {
    // 这里的Data字段类型不能修改为其他类型
    public SampleClass Data; // [!code --]
    public SampleClass2 Data; // [!code warning]
  }
  ```
  :::


- 可以添加不被序列化/反序列化的新的字段/属性（既使用`[NinoIgnore]`修饰或在`[NinoType(false)]`的情况下不标记`[NinoMember]`）
  ::: warning
  不支持给unmanaged struct添加引用类型成员
  :::
- **不可以**删除被收集的字段/属性

## 序列化

### 标准用法

```csharp
byte[] Serializer.Serialize(可Nino序列化类型 val);
void Serializer.Serialize(可Nino序列化类型 val, IBufferWriter<byte> bufferWriter);
```

示范：

```csharp
ObjClass obj = new ObjClass();
byte[] byteArr = Serializer.Serialize(obj);
//或者使用扩展方法
byteArr = obj.Serialize();
```

### 进阶用法

请自己根据用法封装个实现了`IBufferWriter<byte>`的类型，这样的话不一定需要在序列化结束后分配新的二进制数组
> 例如搭配MemoryStream或NetworkStream封装一个`IBufferWriter<byte>`类型


## 反序列化

```csharp
void Deserializer.Deserialize(ReadOnlySpan<byte> data, out 可Nino序列化类型 value);
```

> data不仅可以传```byte[]```，还可以```ArraySegment<byte>```或```Span<byte>```

### 标准用法
```csharp
//假设这里byteArr是byte[]
Deserializer.Deserialize(byteArr, out ObjClass obj);
```

### 高级用法
```csharp
//假设网络层传来了数据（比如Pipeline），我们收到了ReadOnlySequence<byte>
ReadOnlySequence<byte> data = xxxxx;
ObjClass obj;
//如果数据在一块完整的连续内存，我们直接传入Span<byte>
if(data.IsSingleSegment)
{
  Span<byte> dataSpan = data.FirstSpan;
  Deserializer.Deserialize(dataSpan, out ObjClass obj);
}
//如果数据不在一块完整的连续内存，我们需要先复制到一块连续内存
else
{
  if(data.Length <= 1024)
  {
    //栈上分配
    Span<byte> stackMemory = stackalloc byte[(int)data.Length];
    data.CopyTo(stackMemory);
    Deserializer.Deserialize(stackMemory, out ObjClass obj);
  }
  else
  {
    //堆上分配，搭配对象池
    byte[] arr = ArrayPool<byte>.Shared.Rent((int)data.Length);
    data.CopyTo(arr);
    Deserializer.Deserialize(arr, out ObjClass obj);
    ArrayPool<byte>.Shared.Return(arr);
  }
}
```


## 限制

- 需要搭配Source Generator使用
- 不支持使用NinoType去修饰自定义泛型类型
- 无泛型序列化/反序列化非托管类型的代码
- 无法序列化/反序列化非public字段/属性
- 需要有空参数的构造函数
- 如果定义了不支持序列化的类型（如Queue）则会导致编译错误
- 暂时需要序列化端和反序列化端需要使用Nino序列化的类型一一对应（即假设我在A项目里用了Nino去序列化，有10个NinoType类型，那么我在B项目里反序列化A项目生成的二进制时，需确保B项目里也不多不少只有这10个NinoType类型）
   ::: info
   该限制目前可以通过把一个工程生成的代码复制出来给另一个工程使用（NinoSerializerExtension.(Ext.)g.cs和NinoDeserializerExtension.(Ext.)g.cs）
  
   这样就不需要去管两个工程之间类型数量是否对照了，例如我们可以Server收到Client的数据时使用Client的Deserializer，Client收到Server数据时用Server的Deserializer，两端发送数据时各自用各自的Serializer即可
  
   这个问题出现的原因是因为要兼容多态所以需要给每个类型分配一个TypeId，目前是按全部NinoType的类型名字按顺序分配的ID，所以才需要保证不同工程之间的Nino类型名称一致，不然两个工程生成的TypeId会不一致从而导致无法跨工程反序列化数据，如果有朋友有解决方案欢迎PR
   :::
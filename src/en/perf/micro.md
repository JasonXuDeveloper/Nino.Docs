---
title: 微基准测试
lang: zh
outline: deep
---
# 微基准测试

本页包含了`Nino`与`MessagePack`以及`MemoryPack`的性能对比数据

## 数据结构

::: code-group
```csharp [Simple Class]
[NinoType]
[MemoryPackable]
[MessagePackObject]
public partial class SimpleClass
{
    [Key(0)]
    public int Id;
    [Key(1)]
    public string Name { get; set; }
    [Key(2)]
    public int[] Numbers { get; set; }
    [Key(3)]
    public List<DateTime> Dates { get; set; }
    [Key(4)]
    public Dictionary<int, string> Map1;
    [Key(5)]
    public Dictionary<int, int> Map2 { get; set; }
}
```

```csharp [Simple Struct]
[NinoType]
[MemoryPackable]
[MessagePackObject]
public partial struct SimpleStruct
{
    [Key(0)]
    public int Id;
    [Key(1)]
    public DateTime CreateTime;
}
```

:::
## 数据生成

### 生成函数
::: code-group
```csharp [Simple Class]
public static SimpleClass Create()
{
    Random random = new Random();
    return new SimpleClass
    {
        Id = random.Next(),
        Name = "SimpleClass",
        Numbers = Enumerable.Range(0, 100).Select(n => random.Next()).ToArray(),
        Dates = Enumerable.Range(0, 10).Select(n => DateTime.Now.AddSeconds(random.Next())).ToList(),
        Map1 = Enumerable.Range(0, 10).ToDictionary(n => n, n => n.ToString()),
        Map2 = Enumerable.Range(0, 10).ToDictionary(n => n, n => n * 2)
    };
}
```

```csharp [Simple Struct]
public static SimpleStruct Create()
{
    Random random = new Random();
    return new SimpleStruct
    {
        Id = random.Next(),
        CreateTime = DateTime.Now.AddSeconds(random.Next())
    };
}
```
:::

### 测试数据

```csharp
_simpleClass = SimpleClass.Create();
_simpleClasses = Enumerable.Range(0, 30).Select(_ => SimpleClass.Create()).ToArray();
_simpleStruct = SimpleStruct.Create();
_simpleStructs = Enumerable.Range(0, 30).Select(_ => SimpleStruct.Create()).ToArray();
```


## 测试环境
```
BenchmarkDotNet v0.13.12, macOS Sonoma 14.4 (23E214) [Darwin 23.4.0]
Apple M1, 1 CPU, 8 logical and 8 physical cores
.NET SDK 8.0.302
  [Host]     : .NET 8.0.6 (8.0.624.26715), Arm64 RyuJIT AdvSIMD
  Job-QCQJSF : .NET 8.0.6 (8.0.624.26715), Arm64 RyuJIT AdvSIMD

Runtime=.NET 8.0  IterationCount=10  WarmupCount=3  
```

## 测试结果

| Method                              |           Mean |            Min |            Max | Ratio |     Size |
|-------------------------------------|---------------:|---------------:|---------------:|------:|---------:|
| MessagePackDeserializeSimpleClass   |  1,148.2660 ns |  1,139.8289 ns |  1,154.8804 ns |  1.00 |        - |
| MemoryPackDeserializeSimpleClass    |    449.8288 ns |    414.1244 ns |    552.1924 ns |  0.40 |        - |
| NinoDeserializeSimpleClass          |    298.9580 ns |    296.8175 ns |    302.7422 ns |  0.26 |        - |
|                                     |                |                |                |       |          |
| MessagePackSerializeSimpleClass     |  1,296.4875 ns |  1,288.4005 ns |  1,308.2755 ns |  1.00 |    674 B |
| MemoryPackSerializeSimpleClass      |    425.2460 ns |    419.2683 ns |    443.3696 ns |  0.33 |    730 B |
| NinoSerializeSimpleClass            |    207.5860 ns |    205.9621 ns |    211.1342 ns |  0.16 |    738 B |
|                                     |                |                |                |       |          |
| MessagePackDeserializeSimpleClasses | 34,063.6150 ns | 33,931.1091 ns | 34,243.4489 ns |  1.00 |        - |
| MemoryPackDeserializeSimpleClasses  | 12,436.6578 ns | 12,297.8020 ns | 12,669.8284 ns |  0.37 |        - |
| NinoDeserializeSimpleClasses        |  9,177.5588 ns |  9,129.7035 ns |  9,208.5476 ns |  0.27 |        - |
|                                     |                |                |                |       |          |
| MessagePackSerializeSimpleClasses   | 37,935.0473 ns | 37,833.4935 ns | 38,030.5862 ns |  1.00 | 19.75 KB |
| MemoryPackSerializeSimpleClasses    | 12,568.2318 ns | 12,480.6849 ns | 12,734.0075 ns |  0.33 | 21.39 KB |
| NinoSerializeSimpleClasses          |  5,404.4797 ns |  5,388.4586 ns |  5,423.2680 ns |  0.14 | 21.63 KB |
|                                     |                |                |                |       |          |
| MessagePackDeserializeSimpleStruct  |     47.3220 ns |     47.1874 ns |     47.5376 ns |  1.00 |        - |
| MemoryPackDeserializeSimpleStruct   |      1.5991 ns |      1.5946 ns |      1.6045 ns |  0.03 |        - |
| NinoDeserializeSimpleStruct         |      0.5910 ns |      0.5690 ns |      0.6393 ns |  0.01 |        - |
|                                     |                |                |                |       |          |
| MessagePackSerializeSimpleStruct    |     93.2237 ns |     93.1300 ns |     93.3208 ns |  1.00 |     16 B |
| MemoryPackSerializeSimpleStruct     |      4.2233 ns |      4.1699 ns |      4.3188 ns |  0.05 |     16 B |
| NinoSerializeSimpleStruct           |      4.1687 ns |      3.1891 ns |      6.9510 ns |  0.04 |     16 B |
|                                     |                |                |                |       |          |
| MessagePackDeserializeSimpleStructs |    924.2507 ns |    872.0001 ns |  1,039.7354 ns |  1.00 |        - |
| MemoryPackDeserializeSimpleStructs  |     53.9092 ns |     48.1084 ns |     68.8055 ns |  0.06 |        - |
| NinoDeserializeSimpleStructs        |     31.7620 ns |     31.4062 ns |     32.0834 ns |  0.03 |        - |
|                                     |                |                |                |       |          |
| MessagePackSerializeSimpleStructs   |  2,264.9154 ns |  2,262.4969 ns |  2,267.9900 ns |  1.00 |    483 B |
| MemoryPackSerializeSimpleStructs    |     36.5122 ns |     35.8662 ns |     37.0155 ns |  0.02 |    484 B |
| NinoSerializeSimpleStructs          |     29.5231 ns |     29.1184 ns |     30.0484 ns |  0.01 |    486 B |
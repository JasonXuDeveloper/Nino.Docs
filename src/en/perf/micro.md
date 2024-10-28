---
title: Microbenchmark
lang: en
outline: deep
---

# Microbenchmark

This page contains performance comparison data between `Nino`, `MessagePack`, and `MemoryPack`

## Data Structures

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
## Data Generation

### Generation Function
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

### Benchmark Data

```csharp
_simpleClass = SimpleClass.Create();
_simpleClasses = Enumerable.Range(0, 30).Select(_ => SimpleClass.Create()).ToArray();
_simpleStruct = SimpleStruct.Create();
_simpleStructs = Enumerable.Range(0, 30).Select(_ => SimpleStruct.Create()).ToArray();
```


## Benchmark Environment
```
BenchmarkDotNet v0.13.12, macOS Sonoma 14.4 (23E214) [Darwin 23.4.0]
Apple M1, 1 CPU, 8 logical and 8 physical cores
.NET SDK 8.0.302
  [Host]     : .NET 8.0.6 (8.0.624.26715), Arm64 RyuJIT AdvSIMD
  Job-QCQJSF : .NET 8.0.6 (8.0.624.26715), Arm64 RyuJIT AdvSIMD

Runtime=.NET 8.0  IterationCount=10  WarmupCount=3  
```

## Benchmark Result

Results are the time taken to serialize and deserialize the above data, in nanoseconds, the lower the better

### Bar Chart

<script setup>
const options = {
  responsive: true,
};
const bench = {
  "msgpack":[
    1136.2657,
    1871.5678,
    33904.6509,
    59839.6868,
    48.3331,
    144.9043,
    849.0543,
    4030.4682
  ],
  "memorypack":[
    410.4403,
    419.5725,
    14161.3611,
    11740.4484,
    1.6112,
    3.9498,
    48.5860,
    35.7185
  ],
  "nino":[
    412.8562,
    188.8688,
    12953.3525,
    5210.3862,
    0.5299,
    3.6388,
    26.7749,
    28.7374
  ]
};
function getDataset(s, d){
  return [
    {
      label: 'MessagePack',
      backgroundColor: '#f87979',
      data: [bench["msgpack"][s], bench["msgpack"][d]]
    },
    {
      label: 'MemoryPack',
      backgroundColor: '#7f79f8',
      data: [bench["memorypack"][s], bench["memorypack"][d]]
    },
    {
      label: 'Nino',
      backgroundColor: '#79f8b4',
      data: [bench["nino"][s], bench["nino"][d]]
    }
  ]
}
const simpleClassData = {
  labels: [
    'SimpleClass Serialization', 'SimpleClass Deserialization'
  ],
  datasets: getDataset(1, 0)
};
const simpleStructData = {
  labels: [
    'SimpleStruct Serialization', 'SimpleStruct Deserialization'
  ],
  datasets: getDataset(5, 4)
};
const simpleClassesData = {
  labels: [
    'SimpleClasses Serialization', 'SimpleClasses Deserialization'
  ],
  datasets: getDataset(3, 2)
};
const simpleStructsData = {
  labels: [
    'SimpleStructs Serialization', 'SimpleStructs Deserialization'
  ],
  datasets: getDataset(7, 6)
};
</script>

<BarChart :chartData="simpleClassData" :chartOptions="options"/>
<BarChart :chartData="simpleStructData" :chartOptions="options"/>
<BarChart :chartData="simpleClassesData" :chartOptions="options"/>
<BarChart :chartData="simpleStructsData" :chartOptions="options"/>



### Results Table


<div class="container" style="overflow-y: auto;">

| Method                              | Mean           | Error       | StdDev      | Min            | Max            | Ratio | Payload |
|------------------------------------ |---------------:|------------:|------------:|---------------:|---------------:|------:|--------:|
| MessagePackDeserializeSimpleClass   |  1,136.2657 ns |   1.1671 ns |   0.6945 ns |  1,135.0927 ns |  1,137.0287 ns |  1.00 |       - |
| MemoryPackDeserializeSimpleClass    |    410.4403 ns |   0.8699 ns |   0.5754 ns |    409.6905 ns |    411.4832 ns |  0.36 |       - |
| NinoDeserializeSimpleClass          |    412.8562 ns |   1.9615 ns |   1.2974 ns |    410.5808 ns |    414.7145 ns |  0.36 |       - |
|                                     |                |             |             |                |                |       |         |
| MessagePackSerializeSimpleClass     |  1,871.5678 ns |   7.7533 ns |   5.1283 ns |  1,860.9761 ns |  1,877.6836 ns |  1.00 |    674B |
| MemoryPackSerializeSimpleClass      |    419.5725 ns |  31.4231 ns |  18.6994 ns |    410.0792 ns |    463.1201 ns |  0.22 |    730B |
| NinoSerializeSimpleClass            |    188.8688 ns |   0.8833 ns |   0.5843 ns |    187.4881 ns |    189.3958 ns |  0.10 |    738B |
|                                     |                |             |             |                |                |       |         |
| MessagePackDeserializeSimpleClasses | 33,904.6509 ns |  32.8095 ns |  21.7015 ns | 33,869.6263 ns | 33,939.5676 ns |  1.00 |       - |
| MemoryPackDeserializeSimpleClasses  | 14,161.3611 ns |  41.4687 ns |  24.6773 ns | 14,142.5870 ns | 14,208.2545 ns |  0.42 |       - |
| NinoDeserializeSimpleClasses        | 12,953.3525 ns |  33.2459 ns |  19.7841 ns | 12,939.5669 ns | 12,999.1932 ns |  0.38 |       - |
|                                     |                |             |             |                |                |       |         |
| MessagePackSerializeSimpleClasses   | 59,839.6868 ns | 226.5035 ns | 149.8180 ns | 59,567.5735 ns | 60,061.6277 ns |  1.00 | 19.75KB |
| MemoryPackSerializeSimpleClasses    | 11,740.4484 ns |  78.1940 ns |  51.7205 ns | 11,636.6908 ns | 11,806.3005 ns |  0.20 | 21.39KB |
| NinoSerializeSimpleClasses          |  5,210.3862 ns |  29.4638 ns |  19.4885 ns |  5,168.0587 ns |  5,235.1119 ns |  0.09 | 21.63KB |
|                                     |                |             |             |                |                |       |         |
| MessagePackDeserializeSimpleStruct  |     48.3331 ns |   0.0211 ns |   0.0126 ns |     48.3183 ns |     48.3607 ns |  1.00 |       - |
| MemoryPackDeserializeSimpleStruct   |      1.6112 ns |   0.0016 ns |   0.0009 ns |      1.6103 ns |      1.6133 ns |  0.03 |       - |
| NinoDeserializeSimpleStruct         |      0.5299 ns |   0.0015 ns |   0.0010 ns |      0.5292 ns |      0.5315 ns |  0.01 |       - |
|                                     |                |             |             |                |                |       |         |
| MessagePackSerializeSimpleStruct    |    144.9043 ns |   0.0909 ns |   0.0601 ns |    144.8253 ns |    145.0088 ns |  1.00 |     16B |
| MemoryPackSerializeSimpleStruct     |      3.9498 ns |   0.0136 ns |   0.0090 ns |      3.9253 ns |      3.9555 ns |  0.03 |     16B |
| NinoSerializeSimpleStruct           |      3.6388 ns |   0.0100 ns |   0.0052 ns |      3.6298 ns |      3.6481 ns |  0.03 |     16B |
|                                     |                |             |             |                |                |       |         |
| MessagePackDeserializeSimpleStructs |    849.0543 ns |   1.1185 ns |   0.6656 ns |    848.3950 ns |    850.4543 ns |  1.00 |       - |
| MemoryPackDeserializeSimpleStructs  |     48.5860 ns |   0.3531 ns |   0.2101 ns |     48.4330 ns |     48.9597 ns |  0.06 |       - |
| NinoDeserializeSimpleStructs        |     26.7749 ns |   0.1823 ns |   0.1085 ns |     26.5572 ns |     26.8512 ns |  0.03 |       - |
|                                     |                |             |             |                |                |       |         |
| MessagePackSerializeSimpleStructs   |  4,030.4682 ns |  24.7602 ns |  16.3773 ns |  4,012.0767 ns |  4,056.3513 ns | 1.000 |    483B |
| MemoryPackSerializeSimpleStructs    |     35.7185 ns |   0.2794 ns |   0.1461 ns |     35.5804 ns |     35.9146 ns | 0.009 |    484B |
| NinoSerializeSimpleStructs          |     28.7374 ns |   0.2275 ns |   0.1504 ns |     28.5790 ns |     28.9201 ns | 0.007 |    486B |

</div>

<style>
.container {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
}
.container::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
}
</style>
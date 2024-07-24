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
const simpleClassData = {
  labels: [
    'SimpleClass Serialization', 'SimpleClass Deserialization'
  ],
  datasets: [
    {
      label: 'MessagePack',
      backgroundColor: '#f87979',
      data: [2106.8237, 1143.9211]
    },
    {
      label: 'MemoryPack',
      backgroundColor: '#7f79f8',
      data: [412.2793, 415.9840]
    },
    {
      label: 'Nino',
      backgroundColor: '#79f8b4',
      data: [229.6169, 298.0485]
    }
  ]
};
const simpleStructData = {
  labels: [
    'SimpleStruct Serialization', 'SimpleStruct Deserialization'
  ],
  datasets: [
    {
      label: 'MessagePack',
      backgroundColor: '#f87979',
      data: [154.2944, 48.8596]
    },
    {
      label: 'MemoryPack',
      backgroundColor: '#7f79f8',
      data: [4.0231, 1.6226]
    },
    {
      label: 'Nino',
      backgroundColor: '#79f8b4',
      data: [3.2994, 0.5649]
    }
  ]
};
const simpleClassesData = {
  labels: [
    'SimpleClasses Serialization', 'SimpleClasses Deserialization'
  ],
  datasets: [
    {
      label: 'MessagePack',
      backgroundColor: '#f87979',
      data: [60958.8440, 34073.3532]
    },
    {
      label: 'MemoryPack',
      backgroundColor: '#7f79f8',
      data: [11422.3475, 12290.2177]
    },
    {
      label: 'Nino',
      backgroundColor: '#79f8b4',
      data: [5415.0241, 9174.3446]
    }
  ]
};
const simpleStructsData = {
  labels: [
    'SimpleStructs Serialization', 'SimpleStructs Deserialization'
  ],
  datasets: [
    {
      label: 'MessagePack',
      backgroundColor: '#f87979',
      data: [4547.5040, 852.9569]
    },
    {
      label: 'MemoryPack',
      backgroundColor: '#7f79f8',
      data: [36.6025, 48.9702]
    },
    {
      label: 'Nino',
      backgroundColor: '#79f8b4',
      data: [28.9929, 31.9655]
    }
  ]
};
</script>

<BarChart :chartData="simpleClassData" :chartOptions="options"/>
<BarChart :chartData="simpleStructData" :chartOptions="options"/>
<BarChart :chartData="simpleClassesData" :chartOptions="options"/>
<BarChart :chartData="simpleStructsData" :chartOptions="options"/>



### Results Table


<div class="container" style="overflow-y: auto;">

| Method                              |           Mean |       Error |      StdDev |            Min |            Max | Ratio | RatioSD |  Payload |
|-------------------------------------|---------------:|------------:|------------:|---------------:|---------------:|------:|--------:|---------:|
| MessagePackDeserializeSimpleClass   |  1,143.9211 ns |  16.1659 ns |   9.6200 ns |  1,136.1986 ns |  1,163.1313 ns |  1.00 |    0.00 |        - |
| MemoryPackDeserializeSimpleClass    |    415.9840 ns |   4.3499 ns |   2.8772 ns |    412.5200 ns |    420.1489 ns |  0.36 |    0.00 |        - |
| NinoDeserializeSimpleClass          |    298.0485 ns |   3.0089 ns |   1.9902 ns |    296.1641 ns |    300.8748 ns |  0.26 |    0.00 |        - |
|                                     |                |             |             |                |                |       |         |          |
| MessagePackSerializeSimpleClass     |  2,106.8237 ns | 311.3631 ns | 205.9474 ns |  1,965.2651 ns |  2,500.4037 ns |  1.00 |    0.00 |    674 B |
| MemoryPackSerializeSimpleClass      |    412.2793 ns |   3.6694 ns |   2.1836 ns |    408.7637 ns |    415.8436 ns |  0.20 |    0.02 |    730 B |
| NinoSerializeSimpleClass            |    229.6169 ns |   1.9565 ns |   1.1643 ns |    228.0030 ns |    231.3166 ns |  0.11 |    0.01 |    738 B |
|                                     |                |             |             |                |                |       |         |          |
| MessagePackDeserializeSimpleClasses | 34,073.3532 ns | 263.1596 ns | 156.6020 ns | 33,927.4699 ns | 34,399.0987 ns |  1.00 |    0.00 |        - |
| MemoryPackDeserializeSimpleClasses  | 12,290.2177 ns | 112.1596 ns |  74.1866 ns | 12,204.9885 ns | 12,384.6556 ns |  0.36 |    0.00 |        - |
| NinoDeserializeSimpleClasses        |  9,174.3446 ns |  85.4543 ns |  56.5227 ns |  9,113.9577 ns |  9,270.8155 ns |  0.27 |    0.00 |        - |
|                                     |                |             |             |                |                |       |         |          |
| MessagePackSerializeSimpleClasses   | 60,958.8440 ns | 488.5614 ns | 323.1531 ns | 60,472.8038 ns | 61,521.7412 ns |  1.00 |    0.00 | 19.75 KB |
| MemoryPackSerializeSimpleClasses    | 11,422.3475 ns | 100.8657 ns |  66.7164 ns | 11,359.0374 ns | 11,556.3049 ns |  0.19 |    0.00 | 21.39 KB |
| NinoSerializeSimpleClasses          |  5,415.0241 ns |  51.6538 ns |  34.1658 ns |  5,377.3324 ns |  5,473.7482 ns |  0.09 |    0.00 | 21.63 KB |
|                                     |                |             |             |                |                |       |         |          |
| MessagePackDeserializeSimpleStruct  |     48.8596 ns |   0.4929 ns |   0.2578 ns |     48.6193 ns |     49.2249 ns |  1.00 |    0.00 |        - |
| MemoryPackDeserializeSimpleStruct   |      1.6226 ns |   0.0218 ns |   0.0144 ns |      1.6078 ns |      1.6447 ns |  0.03 |    0.00 |        - |
| NinoDeserializeSimpleStruct         |      0.5649 ns |   0.0130 ns |   0.0086 ns |      0.5568 ns |      0.5772 ns |  0.01 |    0.00 |        - |
|                                     |                |             |             |                |                |       |         |          |
| MessagePackSerializeSimpleStruct    |    154.2944 ns |   1.8234 ns |   1.2060 ns |    152.9772 ns |    156.5525 ns |  1.00 |    0.00 |     16 B |
| MemoryPackSerializeSimpleStruct     |      4.0231 ns |   0.0395 ns |   0.0261 ns |      3.9796 ns |      4.0619 ns |  0.03 |    0.00 |     16 B |
| NinoSerializeSimpleStruct           |      3.2994 ns |   0.0400 ns |   0.0209 ns |      3.2657 ns |      3.3307 ns |  0.02 |    0.00 |     16 B |
|                                     |                |             |             |                |                |       |         |          |
| MessagePackDeserializeSimpleStructs |    852.9569 ns |   9.4730 ns |   5.6373 ns |    847.3035 ns |    864.4550 ns |  1.00 |    0.00 |        - |
| MemoryPackDeserializeSimpleStructs  |     48.9702 ns |   1.0181 ns |   0.5325 ns |     48.4226 ns |     50.0060 ns |  0.06 |    0.00 |        - |
| NinoDeserializeSimpleStructs        |     31.9655 ns |   0.2854 ns |   0.1493 ns |     31.7017 ns |     32.1070 ns |  0.04 |    0.00 |        - |
|                                     |                |             |             |                |                |       |         |          |
| MessagePackSerializeSimpleStructs   |  4,547.5040 ns |  55.6864 ns |  36.8331 ns |  4,504.2184 ns |  4,594.6798 ns | 1.000 |    0.00 |    483 B |
| MemoryPackSerializeSimpleStructs    |     36.6025 ns |   0.6121 ns |   0.3201 ns |     36.1424 ns |     36.9414 ns | 0.008 |    0.00 |    484 B |
| NinoSerializeSimpleStructs          |     28.9929 ns |   0.7809 ns |   0.5165 ns |     28.4835 ns |     29.7630 ns | 0.006 |    0.00 |    486 B |

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
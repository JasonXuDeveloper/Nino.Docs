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
    [Key(0)] public int Id;
    [Key(1)] public bool Tag;
    [Key(2)] public Guid Guid;
    [Key(3)] public DateTime CreateTime;
    [Key(4)] public string Name { get; set; }
    [Key(5)] [NinoUtf8] public string Desc;
    [Key(6)] public int[] Numbers { get; set; }
    [Key(7)] public List<DateTime> Dates { get; set; }
    [Key(8)] public Dictionary<int, string> Map1;
    [Key(9)] public Dictionary<int, int> Map2 { get; set; }
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
        Tag = random.Next() % 2 == 0,
        Guid = Guid.NewGuid(),
        CreateTime = DateTime.Now,
        Name = Guid.NewGuid().ToString(),
        Desc = Enumerable.Range(0, 10).Select(_ => Guid.NewGuid().ToString()).Aggregate((a, b) => a + b),
        Numbers = Enumerable.Range(0, 100).Select(_ => random.Next()).ToArray(),
        Dates = Enumerable.Range(0, 10).Select(_ => DateTime.Now.AddSeconds(random.Next())).ToList(),
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
_simpleClasses = Enumerable.Range(0, 100).Select(_ => SimpleClass.Create()).ToArray();
_simpleStruct = SimpleStruct.Create();
_simpleStructs = Enumerable.Range(0, 100).Select(_ => SimpleStruct.Create()).ToArray();
```


## Benchmark Environment
```
BenchmarkDotNet v0.14.0, macOS Sonoma 14.4 (23E214) [Darwin 23.4.0]
Apple M1, 1 CPU, 8 logical and 8 physical cores
.NET SDK 9.0.100-rc.2.24474.11
  [Host]     : .NET 8.0.6 (8.0.624.26715), Arm64 RyuJIT AdvSIMD
  Job-IBNCAG : .NET 9.0.0 (9.0.24.47305), Arm64 RyuJIT AdvSIMD

Runtime=.NET 9.0  IterationCount=20  WarmupCount=1 
```

## Benchmark Result

Results are the time taken to serialize and deserialize the above data, in nanoseconds, the lower the better

### Bar Chart

<script setup>
import { getBench, getDataset } from '/js/bench.js';
import { onMounted } from 'vue';
import Chart from 'chart.js/auto'

onMounted(() => {
  const table = document.getElementById("bench");
  const bench = getBench(table);
  const options = {
    responsive: true,
  };

  new Chart(
    document.getElementById('simple_class'),
    {
      type: 'bar',
      data: {
        labels: [
                  'SimpleClass Serialization', 'SimpleClass Deserialization'
                ],
        datasets: getDataset(bench, 1, 0)
      },
      options: options
    }
  );

  new Chart(
    document.getElementById('simple_struct'),
    {
      type: 'bar',
      data: {
        labels: [
                  'SimpleStruct Serialization', 'SimpleStruct Deserialization'
                ],
        datasets: getDataset(bench, 5, 4)
      },
      options: options
    }
  );

  new Chart(
    document.getElementById('simple_classes'),
    {
      type: 'bar',
      data: {
        labels: [
                  'SimpleClasses Serialization', 'SimpleClasses Deserialization'
                ],
        datasets: getDataset(bench, 3, 2)
      },
      options: options
    }
  );

  new Chart(
    document.getElementById('simple_structs'),
    {
      type: 'bar',
      data: {
        labels: [
                  'SimpleStructs Serialization', 'SimpleStructs Deserialization'
                ],
        datasets: getDataset(bench, 7, 6)
      },
      options: options
    }
  );
});

</script>

<canvas id="simple_class"></canvas>
<canvas id="simple_struct"></canvas>
<canvas id="simple_classes"></canvas>
<canvas id="simple_structs"></canvas>


### Results Table
<div class="container" id="bench" style="overflow-y: auto;">
<!--@include: @/perf/bench.md-->
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
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
    [NinoUtf8] 
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
        Name = Guid.NewGuid().ToString(),
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
_simpleClasses = Enumerable.Range(0, 100).Select(_ => SimpleClass.Create()).ToArray();
_simpleStruct = SimpleStruct.Create();
_simpleStructs = Enumerable.Range(0, 100).Select(_ => SimpleStruct.Create()).ToArray();
```


## 测试环境
```
BenchmarkDotNet v0.14.0, macOS Sonoma 14.4 (23E214) [Darwin 23.4.0]
Apple M1, 1 CPU, 8 logical and 8 physical cores
.NET SDK 9.0.100-rc.2.24474.11
  [Host]     : .NET 8.0.6 (8.0.624.26715), Arm64 RyuJIT AdvSIMD
  Job-IBNCAG : .NET 9.0.0 (9.0.24.47305), Arm64 RyuJIT AdvSIMD

Runtime=.NET 9.0  IterationCount=20  WarmupCount=1 
```

## 测试结果

测试结果为序列化和反序列化上述数据的耗时，单位为纳秒，结果越低越好

### 柱状图

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
                  'SimpleClass 序列化', 'SimpleClass 反序列化'
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
                  'SimpleStruct 序列化', 'SimpleStruct 反序列化'
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
                  'SimpleClasses 序列化', 'SimpleClasses 反序列化'
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
                  'SimpleStructs 序列化', 'SimpleStructs 反序列化'
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


### 表格数据
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
---
layout: home
layoutClass: 'm-home-layout'
hero:
  name: "Nino"
  text: ""
  tagline: 实用的高性能C#序列化库，包括但不限于对.NET Core 应用或Unity/Godot游戏带来令人难以置信的收益。
  actions:
    - text: 快速开始
      link: /zh/start
    - text: 性能对比
      link: /zh/perf/
      theme: alt
features:
  - title: 比快更快
    details: 序列化与反序列化性能完胜JSON、Protobuf、MessagePack等常规方案<small class="bottom-small">大部分压测数据优于MemoryPack等同类方案</small>
    link: ./#
  - title: 简单好用
    details: 通过Source Generator技术在用户编写代码时自动生成所需的数据序列化与反序列化函数<small class="bottom-small">生成代码透明可见且支持NativeAOT等非JIT环境</small>
    link: ./#
  - title: 功能强大
    details: 支持多种数据类型的序列化与反序列化，包括但不限于基础类型、结构体、类、集合、字典等<small class="bottom-small">除此之外更支持序列化与反序列化多态类型</small>
    link: ./#
---

<style>
.m-home-layout .details small {
  opacity: 0.8;
}

.m-home-layout .bottom-small {
  display: block;
  margin-top: 2em;
  text-align: right;
}
</style>

---
layout: home
layoutClass: 'm-home-layout'
hero:
  name: "Nino"
  text: ""
  tagline: Definite useful and high performance serialization library for any C# projects, including but not limited to .NET Core apps or Unity/Godot games.
  actions:
    - text: Quick Start
      link: /en/start
    - text: Performance Analysis
      link: /en/perf/micro
      theme: alt
features:
  - title: Faster than fast
    details: Serialization and deserialization runs significantly faster than JSON, Protobuf, MessagePack, etc. trivial solutions<small class="bottom-small">Most benchmark results are better than MemoryPack and other similar solutions</small>
    link: ./#
  - title: Easy to use
    details: By using Source Generator, Nino automatically generates serialization and deserialization functions while the user is writing the program<small class="bottom-small">The generated code is transparent and support non JIT platforms like NativeAOT natively</small>
    link: ./#
  - title: Powerful yet versatile
    details: Support serializing and deserializing various data structures, i.e. primitives, structs, classes, collections, dictionaries, etc.<small class="bottom-small">Besides Nino also supports serializing and deserializing objects with polymorphism</small>
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

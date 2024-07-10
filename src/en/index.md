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
      link: /en/performance
      theme: alt
features:
  - title: Faster than fast
    details: Serialization and deserialization runs faster than JSON, Protobuf, MessagePack, etc. trivial solutions<small class="bottom-small">Most benchmark results are better than MemoryPack and other similar solutions</small>
  - title: Easy to use
    details: By using Source Generator Nino automatically generated serialization and deserialization functions while the user is writing the program<small class="bottom-small">The generated code is transparent and support non-JIT platforms like NativeAOT natively</small>
  - title: Powerful yet versatile
    details: Support serializing and deserializing various data structures, incl. but not limit to primitives, structs, classes, collections, dictionaries, etc.<small class="bottom-small">Besides Nino also supports serialization and deserialization objects with polymorphism</small>
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

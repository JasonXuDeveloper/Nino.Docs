---
layout: home
layoutClass: 'm-home-layout'
hero:
  name: "Nino <small style='font-size:2rem'>v4</small>"
  text: ""
  tagline: Ultimate high-performance binary serialization library for C#.
  actions:
    - text: Quick Start
      link: /en/doc/start
    - text: What's New in v4
      link: /en/doc/whats-new
      theme: alt
    - text: Performance Analysis
      link: /en/perf/micro
      theme: alt
features:
  - title: Faster at runtime
    details: Serializes <a class="highlight">2.5×</a> to <a class="highlight">4.3×</a> faster than MemoryPack <br> Deserializes <a class="highlight">1.16×</a> to <a class="highlight">1.38×</a> faster on classes and polymorphic types
    link: /en/doc/whats-new
  - title: Faster to build
    details: Generated code is <a class="highlight">61×</a> smaller than v3 <br> Compiles <a class="highlight">145×</a> faster, and editing a type re-generates only that type
    link: /en/doc/v3-vs-v4
  - title: Zero-allocation reuse
    details: Pooled and in-place deserialization with <a class="highlight">0 B</a> allocated <br> Up to <a class="highlight">4.9×</a> faster than MemoryPack's overwrite
    link: /en/doc/advanced#ref-deserialization-and-pooling
  - title: Born to be versatile
    details: Supports <a class="highlight">records</a>, <a class="highlight">polymorphism</a>, <a class="highlight">generics</a>, <a class="highlight">version tolerance</a>, <a class="highlight">keyed members</a>, <a class="highlight">reference tracking</a> and <a class="highlight">Unity</a>
    link: /en/doc/types
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

.highlight{
  font-weight: 1000;
  font-size: 1rem;
  color: var(--vp-c-brand-light);
}
</style>

---
layout: home
layoutClass: 'm-home-layout'
hero:
  name: "Nino <small style='font-size:2rem'>v3</small>"
  text: ""
  tagline: Ultimate high-performance binary serialization library for C#.
  actions:
    - text: Quick Start
      link: /en/doc/start
    - text: Performance Analysis
      link: /en/perf/micro
      theme: alt
features:
  - title: It's a leap change
    details: Overall performance speeds up by <a class="highlight">25%</a> compared to Nino v2
    link: ./#
  - title: Plausibly the best
    details: <a class="highlight">30%</a> to <a class="highlight">120%</a> faster than MemoryPack <br> <a class="highlight">360%</a> to <a class="highlight">900%</a> faster than MessagePack
    link: ./#
  - title: Born to be versatile
    details: Supports <a class="highlight">records</a>, <a class="highlight">polymorphism</a>, <a class="highlight">generics</a>, <a class="highlight">cross-project references</a>, and more to be discovered
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

.highlight{
  font-weight: 1000;
  font-size: 1rem;
  color: var(--vp-c-brand-light);
}
</style>

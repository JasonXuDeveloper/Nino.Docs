---
title: 限制
lang: zh
outline: deep
---
# 限制
本页描述了Nino的限制。

## 当前限制
- 需要搭配Source Generator使用
- 无法序列化/反序列化非public字段/属性
- 如果定义了不支持序列化的类型（如Queue）则会导致编译错误
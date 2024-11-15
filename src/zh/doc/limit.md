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
- 暂时需要序列化端和反序列化端需要使用Nino序列化的类型一一对应（即假设我在A项目里用了Nino去序列化，有10个NinoType类型，那么我在B项目里反序列化A项目生成的二进制时，需确保B项目里也不多不少只有这10个NinoType类型）
   ::: info
   该限制目前可以通过把一个工程生成的代码复制出来给另一个工程使用（NinoSerializerExtension.(Ext.)g.cs和NinoDeserializerExtension.(Ext.)g.cs）
  
   这样就不需要去管两个工程之间类型数量是否对照了，例如我们可以Server收到Client的数据时使用Client的Deserializer，Client收到Server数据时用Server的Deserializer，两端发送数据时各自用各自的Serializer即可
  
   这个问题出现的原因是因为要兼容多态所以需要给每个类型分配一个TypeId，目前是按全部NinoType的类型名字按顺序分配的ID，所以才需要保证不同工程之间的Nino类型名称一致，不然两个工程生成的TypeId会不一致从而导致无法跨工程反序列化数据
   :::
   ::: info
   该限制现已在`Nino v3.0.0`中正式解决，迁移到`Nino v3.0.0`或更高版本后无需额外修改，即可解决此问题
   :::

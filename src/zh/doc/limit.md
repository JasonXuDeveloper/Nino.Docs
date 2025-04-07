---
title: 限制
lang: zh
outline: deep
---
# 限制
本页描述了Nino的限制。

## 当前限制
- 需要搭配Source Generator使用
- 使用了`WEAK_VERSION_TOLERANCE`定义的项目无法反序列化由未使用`WEAK_VERSION_TOLERANCE`定义的项目序列化的数据，反之亦然
- 如果定义了不支持序列化的类型（如Queue）则会导致编译错误
- `ValueTuple`在`.NET Core`与`Unity/Mono`中行为不同  
    ::: info  
    这不是Nino的问题。如果你查看`Mono`中`ValueTuple`的实现，[这个链接](https://github.com/mono/mono/blob/main/mcs/class/corlib/Mono/RuntimeStructs.cs)，他们没有为所有`ValueTuple`指定结构布局，所以Nino会依次序列化/反序列化它的字段。请注意，Unity目前在编辑器及运行模式下使用的是`Mono`（当未选择IL2CPP时）。我不确定IL2CPP对此有何处理，但我认为它与Mono保持一致。  
    
    然而，在`.NET Core`的实现中，[这个链接](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Private.CoreLib/src/System/ValueTuple.cs)，他们选择使用`LayoutKind.Auto`进行布局，这可能导致与`Mono`实现不同的结果。因此，`ValueTuple`在`.NET Core`与`Unity/Mono`之间并不兼容。  
    :::


## 已解决的限制
- 无法在序列化后重命名类型名称/命名空间
    ::: info
    该功能于v3.2.2实现，现在你可以在序列化后重命名类型名称/命名空间，仍然可以反序列化由旧类型名称/命名空间序列化的旧数据
    :::
- 无法版本兼容集合
    ::: info
    该问题于v3.2.0解决，现在你可以修改已被序列化的类型的数据结构，仍然可以反序列化由旧数据结构序列化的旧数据，即使它是一个包含多态元素的集合（列表，字典等）
    :::

- 无法序列化/反序列化非public字段/属性
    ::: info
    该问题于v3.0.6解决，但是有如下需要注意的地方：
    - 如果在`NET8.0`以下版本使用，需要给包含private成员的类型添加`partial`修饰符，如`partial class MyClass`
    - 如果在`NET8.0`以下版本使用，不可以在嵌套类型（NestedType）可序列化类型中定义private成员
    - 如果在`NET8.0`及以上版本使用，**没有任何限制**
    :::
- 对于多态非托管结构，序列化结构时根据是否将其转换为接口类型会产生不同的序列化结果，需要使用不同的反序列化方法才能获得正确的结果
    ::: info
    该问题于v3.0.3修复 - 所有多态非托管结构都将以统一的方式进行序列化和反序列化，无论是否将其转换为接口类型
    :::
- 如果你打算在大端平台上使用Nino，你需要在`Nino.Core`项目中添加`BIG_ENDIAN`定义符号然后手动编译一份`dll`来使用。默认情况下，Nino会认为运行在小端（C#默认小端），这可能会导致在大端系统上反序列化错误
    ::: info
    理论上全部运行.NET的平台（含Unity）都是小端的，所以你不需要担心这个问题。

    如果遇到大小端的问题，再去添加`BIG_ENDIAN`定义符号即可。
    :::
---
title: Limitations
lang: en
outline: deep
---
# Limitations
This page describes the limitations of Nino.

## Current Limitations
- Need to be used with Source Generator
- `WEAK_VERSION_TOLERANCE` defined project cannot deserialize data serialized by a project without `WEAK_VERSION_TOLERANCE` defined, and vice versa
- When attempting to serialize types that are not supported (such as Queue), a compilation error will occur
- `ValueTuple` behaves differently in `.NET Core` and `Unity/Mono`
  ::: info
  This is not Nino's fault. If you look at the implementation for `ValueTuple` in `Mono`, [this link](https://github.com/mono/mono/blob/0f53e9e151d92944cacab3e24ac359410c606df6/mcs/class/corlib/Mono/RuntimeStructs.cs#L83), they did not specify the struct layout of all valuetuples, so its fields will be serialized/deserialized sequentially by Nino. Note that Unity is currently using `Mono` in its editor, or player mode as well (while IL2CPP is not selected). I am not sure what IL2CPP does with this but I believe it is consitent with Mono.

  However, in `.NET Core`'s implementation, [this link here](https://github.com/dotnet/runtime/blob/37e4d45236e68946db9d264593aa31a9c00534bc/src/libraries/System.Private.CoreLib/src/System/ValueTuple.cs#L425), they choose to use `LayoutKind.Auto` to layout valuetuples, that can lead to a different result compared to the `Mono` implementation. So `ValueTuple` is not compatible between `.NET Core` and `Unity/Mono`.

  :::

## Resolved Limitations
- Cannot rename type name/namespace after serialization
    ::: info
    This feature was implemented in v3.2.2, and now you can rename the type name/namespace after serialization and still be able to deserialize the old data serialized by the old type name/namespace
    :::
- Have no version tolerance for collections
    ::: info
    This feature was implemented in v3.2.0, and now you can modify the data structure of a type and still be able to deserialize the old data serialized by the old data structure, even it is a colection (list, dictionary, etc.) with polymorphic elements
    :::
- Cannot serialize/deserialize non-public fields/properties
    ::: info
    This feature was implemented in v3.0.6, but there are some things to note:
    - If you are using a version below `NET8.0`, you need to add the `partial` modifier to the type that contains private members, such as `partial class MyClass`
    - If you are using a version below `NET8.0`, you cannot define private members in the serializable nested type
    - If you are using version `NET8.0` and above, **there are no restrictions**
    :::
- For polymorphic unmanaged struct, serializing the struct with and without casting to its interface produces different results, and requires different deserialization methods to obtain the correct result
    ::: info
    This problem was fixed since v3.0.3 - all polymorphic unmanaged structs will be serialized and deserialized in a uniformed way no matter whether it is casted to its interface or not
    :::
- If your project aims to run on big-endian platforms, you need to add the define symbol `BIG_ENDIAN` to `Nino.Core` project and to compile it on your own then use the compiled `dll`. Otherwise, Nino assumes the platform is little-endian (default by C#) and may lead to incorrect deserialization on big-endian platforms.
    ::: info
    In theory, all platforms running on .NET (including Unity) are little-endian, so you don't need to worry about this issue.

    If you encounter big-endian issues, then add the `BIG_ENDIAN` define symbol will solve the problem.
    :::
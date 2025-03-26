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
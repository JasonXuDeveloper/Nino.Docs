---
title: Limitations
lang: en
outline: deep
---
# Limitations
This page describes the limitations of Nino.

## Current Limitations
- Need to be used with Source Generator
- Cannot serialize/deserialize non-public fields/properties
    ::: tip
    This feature was implemented in v3.0.6, but there are some things to note:
    - If you are using a version below `NET8.0`, you need to add the `partial` modifier to the type that contains private members, such as `partial class MyClass`
    - If you are using a version below `NET8.0`, you cannot define private members in the serializable nested type
    - If you are using version `NET8.0` and above, **there are no restrictions**
    :::
- When attempting to serialize types that are not supported (such as Queue), a compilation error will occur
- For polymorphic unmanaged struct, serializing the struct with and without casting to its interface produces different results, and requires different deserialization methods to obtain the correct result
    ::: tip
    This is problem fixed from v3.0.3 - all polymorphic unmanaged structs will be serialized and deserialized in a uniformed way no matter whether it is casted to its interface or not
    :::
- If your project aims to run on big-endian platforms, you need to add the define symbol `BIG_ENDIAN` to `Nino.Core` project and to compile it on your own then use the compiled `dll`. Otherwise, Nino assumes the platform is little-endian (default by C#) and may lead to incorrect deserialization on big-endian platforms.
    ::: info
    In theory, all platforms running on .NET (including Unity) are little-endian, so you don't need to worry about this issue.

    If you encounter big-endian issues, then add the `BIG_ENDIAN` define symbol will solve the problem.
    :::
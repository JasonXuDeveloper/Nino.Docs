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
- When attempting to serialize types that are not supported (such as Queue), a compilation error will occur
- For polymorphic unmanaged struct, serializing the struct with and without casting to its interface produces different results, and requires different deserialization methods to obtain the correct result
    > This is problem fixed from v3.0.3 - all polymorphic unmanaged structs will be serialized and deserialized in a uniformed way no matter whether it is casted to its interface or not
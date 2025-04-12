---
title: Versioning
lang: en
outline: deep
---

# Versioning

## Incompatibility
Note that these Nino versions are not compatible with their earlier versions, and the generated code may need to be updated accordingly.

- `v3.0.0`
  
  We obsoleted the v2 implementation and rewrite the entire project, so the generated code will be different from the v2 version.

- `v3.0.3`
  
  We fixed the issue of polymorphic unmanaged structs, so the generated code will be different from the v3.0.0 version.

- `v3.2.0`
  
  We added the ability to modify the data structure of a type and still be able to deserialize the old data serialized by the old data structure (including modifying the data structure of list elements, that can be polymorphic), so the generated code will be different from the v3.0.3 version.

- `v3.3.4`
  
  We added alignments to unmanaged fields, which allows a faster memory access when deserializing data. It also inlines the calls to copy unmanaged fields onto the memory, which makes serialization faster. However, this increases the output size and is not compatabile with previous versions.


## Migrating from Nino v2
If you are migrating from Nino v2, the only thing you need to do is to update to the latest version of Nino, then change the namespace of the generated code from `AssemblyName_Nino` to `AssemblyName.NinoGen`.

## What if I really want to deserialize the old data with the new version?

If you really want to deserialize the old data with the new version, please follow the steps below:

1. **Copy** the old generated code (particularlly the **old deserializer** with its **dependencies**) to the new project, change a namespace so no one gets confused.
2. **Upgrade** to the **desired version** of Nino, so that a **new** serializer and deserializer are **generated**.
3. Use the **old deserializer** to deserialize the **old data**, then use the **new serializer** to serialize the data again. If this is about game **checkpoints**, you can distinguish old and new data by having a **header** for the checkpoint data if the data is using a newer version of Nino (i.e. save the data with the newer Nino and add a header to the data before saving the checkpoint, so the next time by reading the **header implies** the program should use the **newer deseiralizer** to deserialize the data), otherwise **fallback** to deserialize it with the **old**, hard-copied **deserializer**.

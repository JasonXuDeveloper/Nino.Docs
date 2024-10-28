---
title: Basic Usage
lang: en
outline: deep
---
# Basic Usage
This page describes the basic usage of Nino, including how to serialize and deserialize data.


## Serialization

### Standard Usage

```csharp
byte[] Serializer.Serialize(NinoSerializableType val);
void Serializer.Serialize(NinoSerializableType val, IBufferWriter<byte> bufferWriter);
```

Example:

```csharp
ObjClass obj = new ObjClass();
byte[] byteArr = Serializer.Serialize(obj);
//or use extension method
byteArr = obj.Serialize();
```

### Recommended Usage
Please note that the `IBufferWriter<byte>` interface is used to write serialized data to a buffer, and you can implement your own `IBufferWriter<byte>` type according to your needs. This way, you don't necessarily need to allocate a new binary array after serialization is complete
> For example, you can encapsulate an `IBufferWriter<byte>` type with MemoryStream or NetworkStream
>
> Alternatively, you can use the `ArrayBufferWriter<byte>` class provided by .NET Core, reusing (with calling `ResetWrittenCount()`) an identical `ArrayBufferWriter` across multiple serialization operations avoids unnecessary memory allocation significantly

For example:

```csharp
ObjClass obj = new ObjClass();
ArrayBufferWriter<byte> bufferWriter = new ArrayBufferWriter<byte>();
Serializer.Serialize(obj, bufferWriter);
//re-serialize it using extension method
bufferWriter.ResetWrittenCount(); //reset the written count
obj.Serialize(bufferWriter); //serialize again, this time no memory allocation will be performed
```


## Deserialization

```csharp
void Deserializer.Deserialize(ReadOnlySpan<byte> data, out NinoSerializableType value);
```

> The data can not only be passed as `byte[]`, but also as `ArraySegment<byte>` or `Span<byte>`, or `Memory<byte>.Span`


### Standard Usage
```csharp
//assuming byteArr is byte[]
Deserializer.Deserialize(byteArr, out ObjClass obj);
```

### Recommended Usage
```csharp
//assuming data is ReadOnlySequence<byte> from network, i.e. we are using Pipeline
ReadOnlySequence<byte> data = xxxxx;
ObjClass obj;
//If the data is in a single contiguous memory block, we can pass in Span<byte> directly
if(data.IsSingleSegment)
{
  Span<byte> dataSpan = data.FirstSpan;
  Deserializer.Deserialize(dataSpan, out obj);
}
//If the data is not in a single contiguous memory block, we need to copy it to a single contiguous memory block first
else
{
  if(data.Length <= 1024)
  {
    //Allocate on the stack
    Span<byte> stackMemory = stackalloc byte[(int)data.Length];
    data.CopyTo(stackMemory);
    Deserializer.Deserialize(stackMemory, out obj);
  }
  else
  {
    //Allocate on the heap, use object pool
    byte[] arr = ArrayPool<byte>.Shared.Rent((int)data.Length);
    data.CopyTo(arr);
    Deserializer.Deserialize(arr, out obj);
    ArrayPool<byte>.Shared.Return(arr);
  }
}
```

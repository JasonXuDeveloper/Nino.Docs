---
title: Basic Usage
lang: en
outline: deep
---
# Basic Usage
This page describes the basic usage of Nino: serializing and deserializing values with `NinoSerializer` and `NinoDeserializer` (namespace `Nino.Core`).

::: info
Every method of `NinoSerializer` and `NinoDeserializer` is **thread safe** and can be called concurrently without locking. Per-call state (scratch buffers, reference tables) is kept per thread, and no hot path writes shared memory.
:::

## Serialization

### API

```csharp
// Into a new byte array
byte[] NinoSerializer.Serialize<T>(T value);

// Into any IBufferWriter<byte>
void NinoSerializer.Serialize<T>(T value, IBufferWriter<byte> bufferWriter);

// With an existing Writer (for custom formatters and advanced scenarios)
void NinoSerializer.Serialize<T>(T value, ref Writer writer);

// Boxed values, when the type is only known at runtime
byte[] NinoSerializer.Serialize(object value);    // as value.GetType(); value must not be null
void NinoSerializer.SerializeBoxed(object value, IBufferWriter<byte> bufferWriter, Type type);
void NinoSerializer.SerializeBoxed(object value, ref Writer writer, Type type);
```

`T` can be any [serializable type](/en/doc/types): a `[NinoType]`, a primitive, a string, a collection, and so on.

### Standard Usage

```csharp
ObjClass obj = new ObjClass();
byte[] bytes = NinoSerializer.Serialize(obj);
```

### Recommended Usage
`Serialize<T>(value)` allocates one `byte[]` for the result. To avoid that, serialize into a buffer you reuse.

`NinoArrayBufferWriter` is Nino's own `IBufferWriter<byte>`, backed by `ArrayPool<byte>.Shared`. Nino writes into it **in place**; any other `IBufferWriter<byte>` (such as .NET's `ArrayBufferWriter<byte>`, or a writer wrapping a `PipeWriter` or `Stream`) receives the bytes with one extra copy at the end.

```csharp
var buffer = new NinoArrayBufferWriter();

NinoSerializer.Serialize(obj, buffer);
ReadOnlySpan<byte> bytes = buffer.WrittenSpan; // or buffer.WrittenMemory
// ... send or store the bytes ...

buffer.ResetWrittenCount();                    // reuse the same buffer
NinoSerializer.Serialize(obj, buffer);         // no allocation this time
```

::: warning
`NinoArrayBufferWriter` itself is **not** thread safe: use one instance per thread (or per operation). Call `Dispose()` when you no longer need it to return its array to the pool.
:::

::: info
The same applies to `ArrayBufferWriter<byte>`: reuse one instance and call `ResetWrittenCount()` between operations.
:::

### Using a Writer

`Writer` is a `ref struct` that writes into a `NinoArrayBufferWriter`. It is useful to write several values back to back, or inside a [custom formatter](/en/doc/advanced#custom-formatters):

```csharp
var buffer = new NinoArrayBufferWriter();
var writer = new Writer(buffer);
NinoSerializer.Serialize(header, ref writer);
NinoSerializer.Serialize(body, ref writer);
writer.Flush(); // commits the written bytes to buffer.WrittenCount (Dispose() does the same)
```

::: info
When you create the `Writer` yourself and serialize types with `trackReferences`, call `writer.ReleaseReferences()` once the logical call is done; the top-level `NinoSerializer` overloads that create their own writer do this for you.
:::


## Deserialization

### API

```csharp
// A new value
T NinoDeserializer.Deserialize<T>(ReadOnlySpan<byte> data);

// Into an existing value, reusing its instances
void NinoDeserializer.Deserialize<T>(ReadOnlySpan<byte> data, ref T value);
void NinoDeserializer.DeserializeRef<T>(ref T value, ReadOnlySpan<byte> data); // same as above

// With an existing Reader
T NinoDeserializer.Deserialize<T>(ref Reader reader);
void NinoDeserializer.Deserialize<T>(ref T value, ref Reader reader);
void NinoDeserializer.DeserializeRef<T>(ref T value, ref Reader reader);        // same as above

// Boxed values, when the type is only known at runtime
object NinoDeserializer.Deserialize(ReadOnlySpan<byte> data, Type type);
void NinoDeserializer.Deserialize(ReadOnlySpan<byte> data, Type type, ref object value);
void NinoDeserializer.DeserializeBoxed(ref object value, ref Reader reader, Type type);
```

> The data can be passed as `byte[]`, `ArraySegment<byte>`, `Span<byte>`, `Memory<byte>.Span` or anything else convertible to `ReadOnlySpan<byte>`.

::: info
When you create the `Reader` yourself (`new Reader(span)`) and read types with `trackReferences`, call `reader.ReleaseReferences()` when done, as with `Writer`.
:::

### Standard Usage
```csharp
// assuming bytes is byte[]
ObjClass obj = NinoDeserializer.Deserialize<ObjClass>(bytes);

// a value serialized with NinoSerializer.Serialize(object)
object boxed = NinoDeserializer.Deserialize(bytes, typeof(ObjClass));
```

### Deserializing into an Existing Value
Pass an existing value by `ref` and Nino populates it in place, reusing the instance and its nested objects, lists, arrays and dictionaries where it can. Pass `null`/`default` and a new value is created.

```csharp
ObjClass obj = null;
foreach (var message in messages)
{
    // the first call creates obj, later calls reuse it
    NinoDeserializer.Deserialize(message, ref obj);
    Handle(obj);
}
```

Instances that are dropped along the way (the data holds `null`, a list shrinks, a dictionary key disappears, the polymorphic type changes) can be returned to an object pool. See [Ref Deserialization and Pooling](/en/doc/advanced#ref-deserialization-and-pooling).

### Recommended Usage
Deserialize directly from the memory you already have, without copying it into a new `byte[]`:

```csharp
// assuming data is a ReadOnlySequence<byte> from the network, i.e. we are using System.IO.Pipelines
ReadOnlySequence<byte> data = xxxxx;
ObjClass obj;
// If the data is in a single contiguous memory block, pass the span directly
if (data.IsSingleSegment)
{
    obj = NinoDeserializer.Deserialize<ObjClass>(data.FirstSpan);
}
// Otherwise, copy it to a single contiguous memory block first
else
{
    if (data.Length <= 1024)
    {
        // Allocate on the stack
        Span<byte> stackMemory = stackalloc byte[(int)data.Length];
        data.CopyTo(stackMemory);
        obj = NinoDeserializer.Deserialize<ObjClass>(stackMemory);
    }
    else
    {
        // Rent from the array pool
        byte[] arr = ArrayPool<byte>.Shared.Rent((int)data.Length);
        data.CopyTo(arr);
        obj = NinoDeserializer.Deserialize<ObjClass>(arr.AsSpan(0, (int)data.Length));
        ArrayPool<byte>.Shared.Return(arr);
    }
}
```

::: info
Every length read from the payload is validated against the remaining bytes before anything is allocated, so malformed or hostile input cannot trigger huge allocations. Truncated data throws an `InvalidOperationException` ("unexpected end of data") instead of reading past the end.
:::

---
title: 基础用法
lang: zh
outline: deep
---
# 基础用法

本页描述了Nino的基础用法，包括如何序列化和反序列化数据。

## 序列化

### 标准用法

```csharp
byte[] Serializer.Serialize(可Nino序列化类型 val);
void Serializer.Serialize(可Nino序列化类型 val, IBufferWriter<byte> bufferWriter);
```

示范：

```csharp
ObjClass obj = new ObjClass();
byte[] byteArr = Serializer.Serialize(obj);
//或者使用扩展方法
byteArr = obj.Serialize();
```

### 推荐用法

请自己根据用法封装个实现了`IBufferWriter<byte>`的类型，这样的话不一定需要在序列化结束后分配新的二进制数组
> 例如搭配MemoryStream或NetworkStream封装一个`IBufferWriter<byte>`类型
>
> 或者使用.NET Core提供的`ArrayBufferWriter<byte>`类，通过复用（调用`ResetWrittenCount()`）一个相同的`ArrayBufferWriter`在多次序列化操作中避免不必要的内存分配

示范：

```csharp
ObjClass obj = new ObjClass();
ArrayBufferWriter<byte> bufferWriter = new ArrayBufferWriter<byte>();
Serializer.Serialize(obj, bufferWriter);
//使用扩展方法重新序列化
bufferWriter.ResetWrittenCount(); //重置写入计数
obj.Serialize(bufferWriter); //再次序列化，这次不会进行内存分配
```


## 反序列化

```csharp
void Deserializer.Deserialize(ReadOnlySpan<byte> data, out 可Nino序列化类型 value);
```

> data不仅可以传```byte[]```，还可以```ArraySegment<byte>```或```Span<byte>```

### 标准用法
```csharp
//假设这里byteArr是byte[]
Deserializer.Deserialize(byteArr, out ObjClass obj);
```

### 推荐用法
```csharp
//假设网络层传来了数据（比如Pipeline），我们收到了ReadOnlySequence<byte>
ReadOnlySequence<byte> data = xxxxx;
ObjClass obj;
//如果数据在一块完整的连续内存，我们直接传入Span<byte>
if(data.IsSingleSegment)
{
  Span<byte> dataSpan = data.FirstSpan;
  Deserializer.Deserialize(dataSpan, out obj);
}
//如果数据不在一块完整的连续内存，我们需要先复制到一块连续内存
else
{
  if(data.Length <= 1024)
  {
    //栈上分配
    Span<byte> stackMemory = stackalloc byte[(int)data.Length];
    data.CopyTo(stackMemory);
    Deserializer.Deserialize(stackMemory, out obj);
  }
  else
  {
    //堆上分配，搭配对象池
    byte[] arr = ArrayPool<byte>.Shared.Rent((int)data.Length);
    data.CopyTo(arr);
    Deserializer.Deserialize(arr, out obj);
    ArrayPool<byte>.Shared.Return(arr);
  }
}
```

// What content/docs/v4/perf.mdx leaves to the reader: the usings of Nino's benchmark files (benchmarks/Nino.Benchmark),
// and the fields and Create methods of the parts of them the page leaves out.
using System.Buffers;
using System.Numerics;
using System.Runtime.InteropServices;
using BenchmarkDotNet.Attributes;
using MemoryPack;
using MessagePack;

namespace Docs.Page_perf;

public sealed partial class SimpleClass
{
    public static SimpleClass Create() => new SimpleClass();
}

public sealed partial class PooledLeaf
{
    public static PooledLeaf Create(Random random) => new PooledLeaf();
}

public sealed partial class PooledNode
{
    public static PooledNode Create(Random random) => new PooledNode();
}

public sealed partial class RefGraph
{
    public static RefGraph Create(int count) => new RefGraph();
}

public partial struct FixedStruct
{
    public static FixedStruct Create(Random random) => default;
}

public sealed partial class FixedClass
{
    public static FixedClass Create(Random random) => new FixedClass();
}

public partial class Snippets
{
    public static NinoArrayBufferWriter _ninoBuffer;
    public static ArrayBufferWriter<byte> _memoryPackBuffer, _messagePackBuffer;

    public static SimpleClass SimpleClass;
    public static byte[][] SerializedSimpleClass;

    public static PooledSimpleClass _memoryPackTarget;

    public static byte[] NinoNode, MemoryPackNode, NinoLeaves, MemoryPackLeaves;
    public static PooledNode _memoryPackNode;
    public static List<PooledLeaf> _ninoLeaves, _memoryPackLeaves;

    public static RefGraph Graph;
    public static byte[] NinoGraph, MemoryPackGraph;

    public static TolerantClass TolerantClass;
    public static byte[] NinoTolerantClass, MemoryPackTolerantClass;

    public static FixedClass FixedClass;
    public static byte[] NinoFixedClass, MemoryPackFixedClass;
}

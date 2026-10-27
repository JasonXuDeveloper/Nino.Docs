// What content/docs/v4/advanced/zero-allocation.mdx leaves to the reader: its message types, the transport and the
// application's handlers, and the test framework of the last example (MSTest).
using System.Buffers;
using System.Net.Sockets;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Docs.Page_advanced_zero_allocation;

[NinoType] public abstract class Message { public int RequestId; }
[NinoType] public sealed class Order { public long Id; public decimal Total; }
[NinoType] public sealed class OrderBook { public long Sequence; public List<double> Bids, Asks; }
[NinoType] public sealed class MetricsBatch { public long Sequence; public List<double> Values; }
[NinoType] public sealed class Quote { public int InstrumentId; public double Bid, Ask; }

public partial class Snippets
{
    public static Order order;
    public static NinoArrayBufferWriter buffer;
    public static List<Tick> ticks;
    public static Socket socket;
    public static CancellationToken ct;
    public static Stream networkStream;
    public static string path;
    public static int size;

    public static void Send(ReadOnlySpan<byte> bytes) { }
    public static void Apply(Tick tick) { }
    public static void Handle(Message message) { }
    public static bool TryReceive(out ReadOnlySpan<byte> frame) { frame = default; return false; }
    public static void Publish(OrderBook book) { }
    public static void Aggregate(MetricsBatch batch) { }
    public static Tick ReadAt(ReadOnlySpan<byte> records, int index) => default;
}

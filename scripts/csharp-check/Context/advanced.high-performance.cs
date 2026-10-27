// What content/docs/v4/advanced/high-performance.mdx leaves to the reader: its message types and the values the
// fragments send and receive.
using System.IO.Hashing;
using System.IO.Pipelines;

namespace Docs.Page_advanced_high_performance;

[NinoType]
public sealed class Quote
{
    public int InstrumentId;
    public double Bid, Ask;
}

[NinoType]
public struct Tick
{
    public long Timestamp;
    public double Price;
    public int InstrumentId;
}

[NinoType] public sealed class Header { public int Kind; public int Length; }
[NinoType] public sealed class Body { public string Text; }
[NinoType] public sealed class MetricsBatch { public long Sequence; public List<double> Values; }
[NinoType] public sealed class GameState { public long Tick; public List<int> Entities; }

public partial class Snippets
{
    public static NinoArrayBufferWriter buffer;
    public static Header header;
    public static Body body;
    public static Quote message;
    public static PipeWriter pipeWriter;
    public static byte[] payload, data, frame1, frame2;
    public static GameState state;
    public static ulong lastHash;

    public static void Process(TelemetryEvent telemetryEvent) { }
    public static void Send(ReadOnlySpan<byte> bytes) { }
}

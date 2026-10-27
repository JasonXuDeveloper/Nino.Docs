// What content/docs/v4/advanced/streams.mdx leaves to the reader: the values it writes and the stream it reads.
using System.Buffers;
using System.Buffers.Binary;
using System.IO.Compression;

namespace Docs.Page_advanced_streams;

[NinoType] public sealed class Checkpoint { public long Sequence; public List<string> Keys; }
[NinoType] public sealed class AuditEvent { public long At; public string User; public string Action; }

public partial class Snippets
{
    public static string path;
    public static Checkpoint checkpoint;
    public static Stream stream;
    public static NinoArrayBufferWriter buffer;

    public static void Index(AuditEvent auditEvent) { }
}

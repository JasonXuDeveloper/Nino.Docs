// What content/docs/v4/advanced/type-design.mdx leaves to the reader: the state the deterministic-bytes fragment
// hashes, the buffer it writes into and where it sends the bytes.
using System.IO.Hashing;

namespace Docs.Page_advanced_type_design;

[NinoType] public sealed class GameState { public long Tick; public List<int> Entities; }

public partial class Snippets
{
    public static NinoArrayBufferWriter buffer;
    public static GameState state;
    public static ulong lastHash;

    public static void Send(ReadOnlySpan<byte> bytes) { }
}

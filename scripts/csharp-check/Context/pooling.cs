// What content/docs/v4/pooling.mdx leaves to the reader: the transport its messages arrive on and the application's
// handler.
namespace Docs.Page_pooling;

public interface ITransport { bool TryReceive(out ReadOnlyMemory<byte> message); }

public partial class Snippets
{
    public static ITransport transport;
    public static byte[] bytes;
    public static List<ReadOnlyMemory<byte>> messages;

    public static void Apply<T>(T snapshot) { }
}

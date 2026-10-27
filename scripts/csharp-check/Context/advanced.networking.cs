// What content/docs/v4/advanced/networking.mdx leaves to the reader: the connection's pipe and the application's
// handlers.
using System.Buffers;
using System.IO.Pipelines;

namespace Docs.Page_advanced_networking;

public partial class Snippets
{
    public static FrameWriter frameWriter;
    public static IDuplexPipe pipe;   // the connection's transport
    public static PriceUpdate update;
    public static ReadOnlySequence<byte> frame;

    public static void Handle(Message message) { }
    public static void OnLogin(Login login) { }
    public static void OnPrice(PriceUpdate price) { }
    public static void OnChat(Chat chat) { }
}

// What content/docs/v4/security.mdx leaves to the reader: the message type, the payload and its peer, the
// application's handler and logger.
namespace Docs.Page_security;

[NinoType] public abstract class Message { public int RequestId; }

public sealed class Log { public void Warn(string message) { } }

public partial class Snippets
{
    public static byte[] payload;
    public static string peer;
    public static Log log;

    public static void Handle(Message message) { }
}

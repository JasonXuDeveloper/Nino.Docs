// What content/docs/v4/advanced/message-queues.mdx leaves to the reader: the payload and the event in hand, and the
// application's handlers.
namespace Docs.Page_advanced_message_queues;

public partial class Snippets
{
    public static byte[] payload;
    public static OrderEvent evt;

    public static void Reserve(OrderPlaced placed) { }
    public static void Notify(OrderShipped shipped) { }
    public static void Release(OrderCancelled cancelled) { }
    public static void Record(Sample sample) { }
}

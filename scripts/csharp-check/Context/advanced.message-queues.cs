// What content/docs/v4/advanced/message-queues.mdx leaves to the reader: the broker's configuration and channel, the
// event in hand and the application's handlers.
using Confluent.Kafka;
using RabbitMQ.Client;

namespace Docs.Page_advanced_message_queues;

public partial class Snippets
{
    public static byte[] payload;
    public static OrderEvent evt;
    public static ProducerConfig config;
    public static ConsumerConfig consumerConfig;
    public static IChannel channel;

    public static void Reserve(OrderPlaced placed) { }
    public static void Notify(OrderShipped shipped) { }
    public static void Release(OrderCancelled cancelled) { }
    public static void Handle(OrderEvent evt) { }
    public static void Record(Sample sample) { }
}

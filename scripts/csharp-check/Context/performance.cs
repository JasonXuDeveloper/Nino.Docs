// What content/docs/v4/performance.mdx leaves to the reader: the order and the reading it serializes.
using System.Runtime.InteropServices;

namespace Docs.Page_performance;

[NinoType] public sealed class Order { public long Id; public string Customer; }

public partial class Snippets
{
    public static Order order;
    public static SensorReading reading;
}

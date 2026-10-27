// What content/docs/v4/index.mdx leaves to the reader: the OrderLine and the order it serializes.
namespace Docs.Page_index;

[NinoType] public struct OrderLine { public int ProductId; public int Quantity; }

public partial class Snippets
{
    public static Order order;
}

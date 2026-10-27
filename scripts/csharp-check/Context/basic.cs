// What content/docs/v4/basic.mdx leaves to the reader: the Order it serializes, the bytes and buffers it reads from
// and the field it handles by reflection.
using System.Buffers;
using System.Reflection;

namespace Docs.Page_basic;

[NinoType] public sealed class Order { public long Id; public string Customer; }
[NinoType] public sealed class Header { public int Kind; public int Length; }
[NinoType] public sealed class Body { public string Text; }

public partial class Snippets
{
    public static Order order;
    public static byte[] bytes, rented;
    public static int received;
    public static List<byte[]> messages;
    public static NinoArrayBufferWriter buffer;
    public static Header header;
    public static Body body;
    public static ArrayPool<byte> pinnedPool;
    public static FieldInfo field;
    public static object target;
    public static TreeNode deepTree;

    public static void Handle(Order order) { }
}

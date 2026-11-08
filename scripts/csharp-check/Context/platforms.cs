// What content/docs/v4/platforms.mdx leaves to the reader: the path of the assembly it loads, and what the first
// example loaded; the hot-update types its registration check names.
using System.Reflection;
using System.Runtime.Loader;

namespace Docs.Page_platforms;

public partial class Snippets
{
    public static string path;
    public static Assembly logic;
    public static AssemblyLoadContext context;
}

[NinoType] public sealed class EnterDungeon { public int DungeonId; }
[NinoType] public sealed class ItemStack { public int ItemId; public int Count; }
public sealed class Inventory : List<ItemStack> { }

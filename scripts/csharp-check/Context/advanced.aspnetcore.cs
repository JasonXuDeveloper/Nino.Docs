// What content/docs/v4/advanced/aspnetcore.mdx leaves to the reader: the app from the first Program.cs and the
// application's own Save and Load.
using Nino.AspNetCore;

namespace Docs.Page_advanced_aspnetcore;

public partial class Snippets
{
    public static string[] args;
    public static WebApplication app;

    public static Order Save(Order order) => order;
    public static Order Load(int id) => new Order { Id = id };
}

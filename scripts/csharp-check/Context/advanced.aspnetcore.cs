// What content/docs/v4/advanced/aspnetcore.mdx leaves to the reader: the app from the first Program.cs, the types it
// sends and the application's own Save and Load.
using Nino.AspNetCore;

namespace Docs.Page_advanced_aspnetcore;

[NinoType]
public class Order
{
    public int Id;
    public string Customer;
}

[NinoType]
public abstract class Shape { }

public sealed class Circle : Shape { public double Radius; }

public sealed class Square : Shape { public double Side; }

public partial class Snippets
{
    public static string[] args;
    public static WebApplication app;
    public static HttpClient http;
    public static Order order;

    public static Order Save(Order order) => order;
    public static Order Load(int id) => new Order { Id = id };
}

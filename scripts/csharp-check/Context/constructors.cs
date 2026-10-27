// What content/docs/v4/constructors.mdx leaves to the reader: the messages it reads and ObjectPool<T> from
// Pooled Collections (pooling.mdx).
using System.Collections.Concurrent;

namespace Docs.Page_constructors;

public static class ObjectPool<T> where T : class, new()
{
    public static T Rent() => new T();
    public static void Return(T item) { }
}

public partial class Snippets
{
    public static List<byte[]> messages;
}

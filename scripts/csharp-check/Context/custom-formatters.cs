// What content/docs/v4/custom-formatters.mdx leaves to the reader: the third-party Ring<T> and Grid<T> its formatters
// are for (as their comments describe them) and the Contract its last example reads.
using System.Collections;
using System.Numerics;
using System.Runtime.CompilerServices;

namespace Docs.Page_custom_formatters;

public sealed class Ring<T> : IEnumerable<T>
{
    private readonly List<T> _items;
    public Ring(int capacity) { Capacity = capacity; _items = new List<T>(capacity); }
    public int Count => _items.Count;
    public int Capacity { get; }
    public void Push(T item) => _items.Add(item);
    public void Clear() => _items.Clear();
    public List<T>.Enumerator GetEnumerator() => _items.GetEnumerator();
    IEnumerator<T> IEnumerable<T>.GetEnumerator() => GetEnumerator();
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

public sealed class Grid<T>
{
    public Grid(int width, int height) { Width = width; Cells = new T[width * height]; }
    public int Width { get; }
    public T[] Cells { get; }
}

[NinoType] public sealed class Person { public string Name; }
public sealed class Contract { public int Id; public Person Owner; }

public partial class Snippets { }

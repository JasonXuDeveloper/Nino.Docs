// What content/docs/v4/types.mdx leaves to the reader: the OrderLine its collection holds.
using System.Collections.Immutable;

namespace Docs.Page_types;

[NinoType] public struct OrderLine { public int ProductId; public int Quantity; }

// What content/docs/v4/advanced/caching.mdx leaves to the reader: the host's command line, and where profiles come from
// on a cache miss.
namespace Docs.Page_advanced_caching;

public partial class Snippets
{
    public static string[] args;
    public static ValueTask<UserProfile> LoadProfileAsync(long id, CancellationToken ct) => default;
}

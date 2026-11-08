// What content/docs/v4/evolving-data.mdx leaves to the reader: the Move whose layout it prints, and the PlayerData
// its layout baseline records.
using System.Reflection;

namespace Docs.Page_evolving_data
{
    [NinoType] public struct Move { public float VelocityX; public float VelocityY; }
}

namespace MyGame.Save
{
    [NinoType(format: NinoFormat.Keyed)]
    public sealed class PlayerData
    {
        public int Health;
        public string Name;
    }
}

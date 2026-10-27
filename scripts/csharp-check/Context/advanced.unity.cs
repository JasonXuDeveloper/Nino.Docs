// What content/docs/v4/advanced/unity.mdx leaves to the reader: Unity's own API (the members the page uses, as Unity
// declares them), the hot-update assembly's bytes and the game's types.
using System.Reflection;
using UnityEngine;

namespace UnityEngine
{
    public struct Vector3 { public float x, y, z; }
    public struct Quaternion { public float x, y, z, w; }
    public struct Color32 { public byte r, g, b, a; }

    public static class Debug { public static void Log(object message) { } }

    public class Object { }
    public class TextAsset : Object { public byte[] bytes => null; }
    public static class Resources { public static T Load<T>(string path) where T : Object => null; }

    public enum RuntimeInitializeLoadType { AfterSceneLoad, BeforeSceneLoad, AfterAssembliesLoaded, BeforeSplashScreen, SubsystemRegistration }

    [AttributeUsage(AttributeTargets.Method)]
    public sealed class RuntimeInitializeOnLoadMethodAttribute : Attribute
    {
        public RuntimeInitializeOnLoadMethodAttribute(RuntimeInitializeLoadType loadType) { }
    }
}

namespace Docs.Page_advanced_unity
{
    [NinoType, NinoPooled]
    public sealed partial class Bullet
    {
        public Vector3 Position;
        public Vector3 Velocity;

        private static partial IEnumerable<Bullet> OnNinoPoolWarmup() => null;
        private partial void OnNinoPoolReturn() { }
    }

    [NinoType] public struct MyStruct { public int Value; }
    [NinoType] public sealed class Box<T> { public T Value; }

    public partial class Snippets
    {
        public static byte[] dllBytes;
        public static ItemTable table;
    }
}

---
title: Quick Start
lang: en
outline: deep
---
# Quick Start

This page describes how to install Nino v4 in different types of projects and how to serialize your first type.

::: tip
New to v4, or upgrading from v3? Read [What's New in v4](/en/doc/whats-new) and the [migration guide](/en/doc/migration) first. The v4 binary format is **not compatible** with v3 or the earlier v4 betas.
:::

## Installation

### .NET Project

::: info
The runtime (`Nino.Core`) targets `netstandard2.0`, `netstandard2.1`, `net8.0` and `net10.0`, so any project that can consume a .NET Standard 2.0 library can use it. All targets produce identical bytes.

The source generator needs a compiler with Roslyn 4.3 or later (Visual Studio 2022 17.3+, Rider, or the .NET 6.0.400 SDK and later). Generated code uses C# 9 features, so the project must compile with `LangVersion` 9 or later (older .NET Framework projects default to C# 7.3 and need `<LangVersion>9</LangVersion>` or later).
:::

- Search for `Nino` in the NuGet package manager of Visual Studio or Rider and install it
- Or use the `dotnet` CLI:
    ```shell
    dotnet add package Nino
    # Optional: ImmutableArray<T> / ImmutableList<T> support
    dotnet add package Nino.Immutable
    ```

::: info
The `Nino` package brings in two packages, both of which are required:
- `Nino.Serialization`: the runtime library (`Nino.Core.dll`)
- `Nino.Generator`: the source generator, analyzers and code fixes

`Nino.Immutable` is optional and adds formatters for `ImmutableArray<T>` and `ImmutableList<T>`.
:::

::: tip
With the .NET 9 SDK or later, `NinoSerializer`/`NinoDeserializer` calls with a known type are redirected at compile time to the generated formatter (interceptors). This is automatic; see [Interceptors](/en/doc/advanced#interceptors).
:::

### Unity Project

::: info
Nino supports Unity 2022.3 or later on every player platform (Mono and IL2CPP).

The `Nino.Unity` sample project on GitHub shows how to use Nino in Unity and includes a set of unit tests (via `TestRunner`).
:::

Install Nino through the Unity Package Manager from [OpenUPM](https://openupm.com/packages/com.jasonxudeveloper.nino/#modal-manualinstallation), for example:

```shell
openupm add com.jasonxudeveloper.nino
```

The package ships `Nino.Core.dll` together with the source generator (`Nino.Generator.dll`, labelled as a `RoslynAnalyzer`), so nothing else has to be installed.

::: warning
If you use `asmdef` files, make sure `Auto Referenced` is enabled, or, when `Override References` is used, explicitly add a reference to `Nino.Core.dll`.
:::

::: info
Unity compiles against .NET Standard, which has no `[UnsafeAccessor]`. A type that serializes non-public members (or uses `[NinoPooled]`) must therefore be declared `partial`, together with every type that contains it. The analyzer reports this (NINO002) and offers a fix.
:::

::: tip
If you run into problems, first check that you can run the `Nino.Unity` sample project. If the problem persists, please open an issue on GitHub.
:::

#### Hot Update Code
- Nino supports **HybridCLR**. Generated registries are found lazily the first time one of their types is used, so a hot-update assembly loaded with `Assembly.Load` needs **no initialization call**.
- Hot-update code can live in a Unity `asmdef`, or in an external C# project that installs Nino from NuGet ([see above](#net-project)); use the compiled DLL in HybridCLR as usual.

## First Serialization

Mark a type with `[NinoType]`, then call `NinoSerializer` and `NinoDeserializer` (namespace `Nino.Core`):

```csharp
using Nino.Core;

[NinoType]
public class GameData
{
    public int Score;
    public string PlayerName;
    public DateTime LastPlayed;
}

var data = new GameData { Score = 1000, PlayerName = "Player1", LastPlayed = DateTime.Now };

// Serialize
byte[] bytes = NinoSerializer.Serialize(data);

// Deserialize
GameData restored = NinoDeserializer.Deserialize<GameData>(bytes);
```

Continue with [Basic Usage](/en/doc/basic) for buffer reuse and in-place deserialization, and with the [Type System](/en/doc/types) for what can be serialized.

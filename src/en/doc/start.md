---
title: Quick Start
lang: en
outline: deep
---
# Quick Start

This page describes how to quickly install Nino in different types of projects.
## Installation

### .NET Project

::: info
Nino supports projects with .NET 5.0 or higher, or .NET Standard 2.0 or higher
:::

- Nino supports installation via NuGet, simply search for `Nino` in the NuGet package manager in Visual Studio or Rider and install it
- Alternatively, `dotnet` command can be used to install the latest version of Nino:
    ```shell
    dotnet add package Nino
    ```

::: info
Nino requires two NuGet packages to be installed: `Nino.Generator` and `Nino.Serialization`, both are necessary

Look up and install the package `Nino` in the NuGet package manager to automatically install these two packages
:::

::: warning
Please be aware that this installation does not support .NET Framework projects, and IDEs that do not support `Source Generator`
:::

### Unity Project

::: info
Nino supports projects with Unity 2022.3 or higher, and is compatible with any player platform

We recommend running the `Nino.Unity` sample project from GitHub first to learn how to use Nino in Unity, it also includes a set of unit tests (via `TestRunner`)
:::

1. `Nino` can be installed in Unity via the Unity Package Manager (`UPM`), please refer to [this link](https://openupm.com/packages/com.jasonxudeveloper.nino/#modal-manualinstallation) for more information


::: warning

By default, Unity 2022.3 or higher should have `Microsoft.CodeAnalysis` installed, if not, please install it manually

We require `Microsoft.CodeAnalysis` NuGet package (latest version is fine) to be installed to support `Source Generator` in Unity
   > This NuGet package can be manually installed in the Unity project, for example by executing `dotnet add package Microsoft.CodeAnalysis.CSharp --version 4.10.0` after entering the Unity directory (same level as Assets)
:::

::: warning
If you are using `asmdef`, please make sure either `auto referencing` is enabled or when `override references` is used, explicitly add reference to `Nino.Core.dll` is needed
:::

::: tip
If you encounter any issues, please ensure that you have followed the above steps and can run the `Nino.Unity` sample project normally. If the problem persists, please submit an Issue on GitHub
:::

#### Hot Update Code
- Nino supports **HybridCLR** and **ILRuntime**
- If you need to create a C# project externally (not an asmdef within Unity) to write hot update code, please create a .NET Core project and install the Nino library via NuGet ([refer to this](#net-project)), then use the compiled DLL in HybridCLR or ILRuntime

### Migrating from Nino v2
If you are migrating from Nino v2, the only thing you need to do is to update to the latest version of Nino, then change the namespace of the generated code from `AssemblyName_Nino` to `AssemblyName.NinoGen`.
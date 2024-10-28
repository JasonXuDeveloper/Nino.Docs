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

::: warning
Please be aware that this installation does not support .NET Framework projects, and IDEs that do not support `Source Generator`
:::

### Unity Project

::: info
Nino supports projects with Unity 2022.3 or higher, and is compatible with any player platform

We recommend running the `Nino_Unity` sample project from GitHub first to learn how to use Nino in Unity
:::

1. Please look up the needed Nino version from the [Release](https://github.com/JasonXuDeveloper/Nino/releases) and download the corresponding `Nino.unitypackage` plugin
2. Please ensure that the `Microsoft.CodeAnalysis` NuGet package (latest version is fine) is installed to support `Source Generator` in Unity
   > This NuGet package can be installed in the Unity project, for example by executing `dotnet add package Microsoft.CodeAnalysis.CSharp --version 4.10.0` after entering the Unity directory (same level as Assets)
3. Import the downloaded Nino plugin into the Unity project
4. Move the imported Nino folder to a directory with an asmdef (such as the Test directory in the Nino_Unity project), as Unity has a bug that requires the Nino source code to be placed in a directory with an asmdef in order to generate code that does not throw errors for types in that directory
5. If an error occurs stating `Nino.Core references netstandard, Version=2.1.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51. A roslyn analyzer should reference netstandard version 2.0`, please ignore it, as this is a Unity bug
6. If multiple asmdefs are needed, copy the imported Nino directory into directories with different asmdefs

::: tip
If you encounter any issues, please ensure that you have followed the above steps and can run the `Nino_Unity` sample project normally. If the problem persists, please submit an Issue on GitHub
:::

#### Hot Update Code
- Nino supports **HybridCLR** and **ILRuntime**
- If you need to create a C# project externally (not an asmdef within Unity) to write hot update code, please create a .NET Core project and install the Nino library via NuGet ([refer to this](#net-project)), then use the compiled DLL in HybridCLR or ILRuntime

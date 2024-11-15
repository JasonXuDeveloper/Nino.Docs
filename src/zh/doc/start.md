---
title: 快速开始
lang: zh
outline: deep
---
# 快速开始

本页描述了如何在不同类型的项目中快速安装Nino

## 下载安装

### .NET 项目 

::: info
Nino支持.NET 5.0 及以上版本的项目，或.NET Standard 2.0 及以上版本的项目
:::

- Nino支持通过NuGet包管理器进行安装，可以在Visual Studio或Rider中在NuGet管理中搜索`Nino`并安装
- 除此之外，也可以使用命令行工具`dotnet`进行安装：
    ```shell
    dotnet add package Nino
    ```

::: info
Nino需要安装两个NuGet包：`Nino.Generator`和`Nino.Serialization`，二者缺一不可

直接在NuGet管理器中安装`Nino`会自动安装这两个包
:::

::: warning
请注意，此方法不支持.NET Framework项目，同时不支持无法使用`Source Generator`的IDE（如Visual Studio Code）
:::

### Unity 项目

::: info
Nino支持Unity 2022.3 及以上版本的项目，支持在任意平台发布

建议先运行GitHub上的`Nino.Unity`示例项目，以了解如何在Unity中使用Nino，示例项目还包含一套单元测试（通过`TestRunner`实现）
:::

`Nino`可以通过Unity Package Manager（`UPM`）安装到Unity中，请参考[这个链接](https://openupm.com/packages/com.jasonxudeveloper.nino/#modal-manualinstallation)获取更多信息

::: info
默认情况下，Unity 2022.3 及以上版本应该已经安装了`Microsoft.CodeAnalysis`，如果没有，请手动安装

我们需要安装`Microsoft.CodeAnalysis` NuGet包（最新版本即可）以支持Unity内的`Source Generator`
   > 这个NuGet包可以在Unity项目内安装，例如进入Unity目录（Assets同级目录）后执行`dotnet add package Microsoft.CodeAnalysis.CSharp --version 4.10.0`
:::


::: warning
如果使用`asmdef`，请确保已经开启`自动引用`，或在使用`覆盖引用`时，需要显式添加对`Nino.Core.dll`的引用
:::

::: tip
遇到问题请先确保已经按照上述步骤操作，同时能够正常运行`Nino.Unity`示例项目，如果问题依然存在，请在GitHub上提交Issue
:::

#### 代码热更
- Nino支持**HybridCLR**与**ILRuntime**
- 如果需要另外在外部创建一个C#工程（不是Unity内的asmdef）来编写热更代码，请创建.NET Core工程并通过NuGet安装Nino库（[参考这里](#net-项目)），再将编译出来的DLL在HybridCLR或ILRuntime中使用

### 从Nino v2迁移
如果你正在从Nino v2迁移，唯一需要做的事情就是更新到最新版本的Nino，然后将生成的代码的命名空间从`AssemblyName_Nino`改为`AssemblyName.NinoGen`
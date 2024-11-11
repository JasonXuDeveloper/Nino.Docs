---
title: 快速开始
lang: zh
outline: deep
---
# 快速开始

本页描述了如何快速上手使用Nino，包含如何安装、定义可序列化类型、序列化与反序列化等内容

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

建议先运行GitHub上的`Nino_Unity`示例项目，以了解如何在Unity中使用Nino
:::

1. 请在[Release](https://github.com/JasonXuDeveloper/Nino/releases)页面寻找需要使用的Nino版本，并下载对应的`Nino.unitypackage`插件
2. 请确保已安装`Microsoft.CodeAnalysis`（最新版即可）的NuGet包，以便在Unity内支持`Source Generator`
   > 这个NuGet包可以在Unity项目内安装，例如进入Unity目录（Assets同级目录）后执行`dotnet add package Microsoft.CodeAnalysis.CSharp --version 4.10.0`
3. 将下载好的Nino插件导入Unity项目
4. 把导入后的Nino文件夹移动到一个带有asmdef的目录内（如Nino_Unity工程里的Test目录），这是因为Unity有Bug，必须把Nino源码放在一个asmdef目录内才能对这个目录内类型生成不会报错的代码
5. 如果报错`Nino.Core references netstandard, Version=2.1.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51. A roslyn analyzer should reference netstandard version 2.0`请忽略，这是unity的bug
6. 如果需要多个asmdef使用，就把导入的Nino目录复制到多个带有不同asmdef的目录内

::: tip
遇到问题请先确保已经按照上述步骤操作，同时能够正常运行`Nino_Unity`示例项目，如果问题依然存在，请在GitHub上提交Issue
:::

#### 代码热更
- Nino支持**HybridCLR**与**ILRuntime**
- 如果需要另外在外部创建一个C#工程（不是Unity内的asmdef）来编写热更代码，请创建.NET Core工程并通过NuGet安装Nino库（[参考这里](#net-项目)），再将编译出来的DLL在HybridCLR或ILRuntime中使用

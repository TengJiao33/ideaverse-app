

# IdeaVerse-App 🚀

**一个可视化的、基于节点的工作流编辑器，用于构建、测试和管理复杂的 AI Prompt 模板。**
**写在最前面：**大一下小学期，第一次尝试软件开发，这个功能单调，逻辑尴尬的小软件是我边学习边结合Gemini的建议一点一点写的，充满了稚嫩和懵懂。

 A visual, node-based workflow editor for building, testing, and managing complex AI prompt templates.

-----

[](https://www.google.com/search?q=https://your-live-demo-url.com)

## 🌟 关于项目 | About The Project

你是否曾为了获得理想的 AI 输出而反复调试、拼接冗长的 Prompt？`IdeaVerse` 正是为此而生。

它将复杂的 Prompt 编写过程，转变为一个直观、可视化的流程。通过拖拽代表不同指令的节点（如“任务”、“角色”、“格式”），并将它们连接起来，你可以像搭建流程图一样，清晰地构建出 Prompt 的逻辑结构。

最重要的是，`IdeaVerse` 支持**动态变量模板**。你可以在指令中嵌入 `{{变量}}` 占位符，在最终生成时，应用会自动为你创建一个表单来填充这些变量。这使得你的 Prompt 模板可以被轻松复用，极大地提高了与 AI 协作的效率。（这个功能目前有很大的问题，待修复）

## ✨ 主要功能 | Key Features

  * **可视化节点编辑器**: 通过拖拽“任务指令”、“角色扮演”、“格式要求”等不同功能的节点到画布上，构建你的指令流。
  * **顺序化指令链接**: 用鼠标将节点连接起来，清晰地定义指令的先后顺序和逻辑关系。
  * **动态变量模板**: 在节点的文本中使用 `{{变量名}}` 语法创建模板。在生成时，应用会自动弹出窗口，让你填充所有变量。
  * **工作流本地存储**: 可以将你精心设计的指令流命名并保存在浏览器中，随时加载和编辑，不怕丢失。
  * **一键生成与复制**: 只需一次点击，即可根据你的工作流和输入的变量，生成最终的 Prompt，并轻松复制到剪贴板。

## 🛠️ 技术栈 | Tech Stack

技术栈全是Gemini推荐的，哈哈哈哈哈哈

  * **核心框架**: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
  * **节点式UI库**: [@xyflow/react](https://reactflow.dev/) (React Flow)
  * **UI组件库**: [@mantine/core](https://mantine.dev/)
  * **图标库**: [@tabler/icons-react](https://tabler-icons-react.vercel.app/)

## 🚀 如何使用 | How To Use

体验 `IdeaVerse` 的功能非常简单：

1.  **拖拽节点**: 从左侧导航栏将“任务”、“角色”或“格式”节点拖拽到右侧的画布上。
2.  **编写指令**: 在每个节点内的文本框中输入具体的指令内容。需要动态填充的地方，请使用 `{{占位符}}` 格式，例如 `写一篇关于{{主题}}的文章`。
3.  **连接节点**: 按住一个节点右侧的圆点，拖拽出一条线，连接到另一个节点左侧的圆点，以此来确定指令的生成顺序。
4.  **生成Prompt**: 点击右上角的 **🚀** (火箭) 按钮。
5.  **填充变量**: 如果你的指令中包含了 `{{变量}}`，此时会弹出一个表单，请填写每个变量对应的内容。
6.  **获取结果**: 在最终弹窗中，你会得到完整、可用的 Prompt。点击“复制到剪贴板”按钮即可使用。
7.  **(可选) 保存/加载**: 点击“保存”按钮可以存储你当前的工作流，以便将来通过“加载流程”菜单再次使用。

## 📦 本地部署 | Getting Started Locally

在自己的电脑上运行或进行二次开发，请遵循以下步骤：

1.  **克隆**
    ```bash
    git clone https://github.com/TengJiao33/ideaverse-app.git
    ```
2.  **进入项目目录**
    ```bash
    cd ideaverse-app
    ```
3.  **依赖**
    ```bash
    npm install
    ```
4.  **启动服务器**
    ```bash
    npm run dev
    ```

## 🗺️ 未来路线图 | Roadmap

  * [ ] 接入真实 AI 模型 API，实现应用内直接对话和测试
  * [ ] 实现用户账户系统，支持工作流云端同步
  * [ ] 增加更多功能的节点类型（例如：分支判断、循环等）
  * [ ] 共享工作流模板，创建社区生态

## ❤️ 如何贡献 | Contributing

欢迎任何形式的贡献！如果你有好的想法或发现了 Bug，请随时提交 [Issues](https://www.google.com/search?q=https://github.com/TengJiao33/ideaverse-app/issues) 或发起 [Pull Requests](https://www.google.com/search?q=https://github.com/TengJiao33/ideaverse-app/pulls)。

# Strand

> 优雅、纯粹。专为 macOS 打造的非官方 Threads 多账号客户端与官方网站。

---

## 架构概览 (Monorepo)

本项目采用现代标准 Monorepo 架构，统一由工作区（npm / pnpm workspaces）进行管理：

```
threadsMac/
├── apps/
│   ├── desktop/            # macOS 桌面客户端应用 (Electron + React 19 + TypeScript)
│   └── web/                # 官方落地页门户网站 (Next.js 15 App Router + shadcn/ui + Lucide + Tailwind CSS v4)
├── package.json            # 根工作区配置与统一快捷脚本
├── pnpm-workspace.yaml     # pnpm 兼容配置
└── README.md
```

### 1. 桌面客户端 (`apps/desktop`)
- **多账号独立沙箱**：基于 Electron 分区 (`persist:account-<id>`)，Cookie 与缓存完全物理隔离，避免登入登出与串号烦恼。
- **纯粹黑白美学**：汲取 Threads 经典黑白视觉基调与 Claude 桌面端几何形态，专注沉浸。
- **键盘优先**：支持 `⌘B` 抽屉式侧边栏折叠、`⌘1~9` 快速切换账号、`⌘,` 快捷设置等。
- **隐私至上**：零三方服务中转、不采集任何敏感凭据、纯本地安全存储。
- **支持架构**：提供经过签名的 Apple Silicon (`arm64`) 与 Intel (`x64`) 的 `.dmg` 安装包与 `.zip` 压缩包。

### 2. 官方网站 (`apps/web`)
- **技术栈**：Next.js 15 (App Router) + shadcn/ui + Lucide React + Tailwind CSS v4。
- **极致 SEO 优化**：服务端静态预渲染 (SSG)、OpenGraph、Twitter Card、`robots.txt`、`sitemap.xml` 及 Schema.org `SoftwareApplication` 结构化数据 (JSON-LD)。
- **设计风格**：与客户端完全同构的黑白极简与玻璃拟态质感，支持一键切换深色/浅色主题。
- **双语支持**：内置英文与简体中文全量本地化，自动识别系统首选语言。
- **交互式产品沙盒**：在网页端高保真模拟 macOS 窗口交互，支持点选切换账号、折叠侧边栏、预览设置对话框与发帖界面。
- **下载与指引**：直观的 Apple Silicon / Intel 镜像下载卡片与首发安装安全提示。

---

## 常用脚本 (Root Workspace)

在仓库根目录下即可统一调度所有子应用：

| 命令 | 描述 |
| :--- | :--- |
| `npm run dev:web` (或 `npm run dev`) | 启动 Web 官网本地开发服务器 (`http://localhost:5173`) |
| `npm run dev:desktop` | 启动 macOS 桌面客户端开发模式 (HMR 热重载) |
| `npm run build` | 统一编译构建桌面端与官网应用 |
| `npm run build:web` | 单独构建官网静态发布资源 (输出至 `apps/web/dist`) |
| `npm run build:desktop` | 单独构建桌面端可执行捆绑包 (输出至 `apps/desktop/out`) |
| `npm run test` | 运行所有测试用例 (Vitest) |
| `npm run typecheck` | 执行全局 TypeScript 类型检查 |
| `npm run package:dmg` | 打包生成 macOS DMG 安装包 (存入 `apps/desktop/release`) |
| `npm run package:zip` | 打包生成 macOS ZIP 分发包 |
| `npm run dist` | 同时生成 DMG 与 ZIP 完整分发文件 |

---

## 免责声明

Strand 是一个独立的开源项目。与 Meta Platforms, Inc. 或 Threads 无任何隶属、赞助、认可或合作关系。

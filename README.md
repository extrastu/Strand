<div align="center">

# Strand

<p>
  <strong>An elegant, distraction-free multi-account desktop client for Threads on macOS.</strong>
</p>

<p>
  <strong>English</strong> | <a href="README.zh-CN.md">简体中文</a>
</p>

<p>
  <a href="https://github.com/extrastu/Strand/releases/tag/v0.2.1">
    <img src="https://img.shields.io/badge/Release-v0.2.1-black?style=flat-square" alt="Version 0.2.1" />
  </a>
  <a href="https://istrand.vercel.app/">
    <img src="https://img.shields.io/badge/Website-istrand.vercel.app-black?style=flat-square" alt="Website" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
  </a>
  <img src="https://img.shields.io/badge/Platform-macOS%2013+-101010?style=flat-square&logo=apple" alt="macOS 13+" />
</p>

<p>
  🔗 <strong>GitHub Repository</strong>: <a href="https://github.com/extrastu/Strand">https://github.com/extrastu/Strand</a> &nbsp;|&nbsp;
  🌐 <strong>Official Website</strong>: <a href="https://istrand.vercel.app/">https://istrand.vercel.app/</a>
</p>

---

</div>

## Architecture Overview (Monorepo)

Strand is organized as a modern monorepo powered by workspace management (`npm` / `pnpm` workspaces):

```
threadsMac/
├── apps/
│   ├── desktop/            # macOS desktop client (Electron + React 19 + TypeScript)
│   └── web/                # Official web portal (Next.js 15 App Router + shadcn/ui + Lucide + Tailwind CSS v4)
├── package.json            # Root workspace scripts & dependencies
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── README.md               # English documentation (Default)
├── README.zh-CN.md         # Simplified Chinese documentation
└── LICENSE                 # MIT License
```

### 1. Desktop Application (`apps/desktop`)
- **Isolated Multi-Account Sessions**: Strictly isolated partitions (`persist:account-<id>`) with separate cookies, cache, and IndexedDB storage. No cross-talk or constant re-logging.
- **Monochrome Aesthetics**: Inspired by Threads classic black-and-white palette and Claude desktop geometry for deep, distraction-free focus.
- **Keyboard-First Workflow**: `⌘B` to toggle sidebar drawer with smooth spring animation, `⌘1~9` to instantly jump between accounts, and `⌘,` for settings.
- **Privacy by Design**: Zero middleman servers, no scraping scripts, no credential storage. Local-first security.
- **Universal macOS Binaries**: Native support for Apple Silicon (`arm64`) and Intel (`x64`) with signed DMG and portable ZIP archives.

### 2. Official Website (`apps/web`)
- **Tech Stack**: Next.js 15 (App Router) + shadcn/ui + Lucide React + Tailwind CSS v4.
- **SEO & Performance**: Server-side static generation (SSG), OpenGraph, Twitter Cards, `robots.txt`, `sitemap.xml`, and Schema.org `SoftwareApplication` JSON-LD rich snippets.
- **Design Alignment**: Clean monochrome aesthetics and glassmorphism that perfectly mirror the desktop application.
- **Bilingual & Adaptive**: Automatically follows browser language preference with graceful fallback to English, alongside manual language toggling.
- **Interactive Sandbox**: High-fidelity in-browser macOS window mockup to preview multi-account switching, sidebar collapse, and settings.
- **Download Center**: Direct download cards for Apple Silicon and Intel machines with first-launch verification instructions.

---

## Workspace Commands

Manage and run all sub-applications directly from the repository root:

| Command | Description |
| :--- | :--- |
| `npm run dev:web` (or `npm run dev`) | Start Next.js official website development server (`http://localhost:3000`) |
| `npm run dev:desktop` | Start macOS desktop client with HMR hot reload |
| `npm run build` | Build both desktop client and web portal |
| `npm run build:web` | Build web portal for production (Next.js static export / SSG) |
| `npm run build:desktop` | Build desktop client bundle (`apps/desktop/out`) |
| `npm run test` | Run complete automated test suite (Vitest) |
| `npm run typecheck` | Perform TypeScript typechecking across all packages |
| `npm run package:dmg` | Package macOS DMG installer into `apps/desktop/release` |
| `npm run package:zip` | Package macOS ZIP distribution archive |
| `npm run dist` | Generate both DMG and ZIP release files |

---

## Download & Installation

Grab the latest release from [GitHub Releases](https://github.com/extrastu/Strand/releases) or the [Official Download Center](https://istrand.vercel.app/#download):

- **DMG Installer (Apple Silicon)**: [`Strand-0.2.1-darwin-arm64.dmg`](https://github.com/extrastu/Strand/releases/download/v0.2.1/Strand-0.2.1-darwin-arm64.dmg)
- **Portable ZIP (Apple Silicon)**: [`Strand-0.2.1-darwin-arm64.zip`](https://github.com/extrastu/Strand/releases/download/v0.2.1/Strand-0.2.1-darwin-arm64.zip)

> **First Launch Tip**: Strand is an open-source, ad-hoc signed application. If macOS displays a verification prompt on first launch, right-click (or Control-click) `Strand.app` in `/Applications` and select **Open**.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Disclaimer

Strand is an independent open-source project. It is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc. or Threads.

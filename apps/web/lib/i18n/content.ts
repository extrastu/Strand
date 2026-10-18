export type Language = 'en' | 'zh-CN'

export const content = {
  en: {
    nav: {
      features: 'Features',
      showcase: 'Showcase',
      shortcuts: 'Shortcuts',
      faq: 'FAQ',
      download: 'Download',
      changelog: 'Changelog',
      github: 'GitHub',
    },
    changelogPage: {
      tag: "Release History",
      title: 'Changelog',
      subtitle: 'All the latest releases, features, improvements, and updates for Strand on macOS.',
      backHome: 'Back to Home',
      downloadDmg: 'Download .dmg',
      downloadZip: 'Download .zip',
      releaseNotes: 'Release Notes',
      latestBadge: 'Latest Release',
      categories: {
        features: 'New Features',
        improvements: 'Improvements',
        fixes: 'Bug Fixes',
      },
      releases: [
        {
          version: 'v0.2.2',
          date: 'October 18, 2026',
          isLatest: true,
          summary: 'Automatic in-place updates on macOS, toast UI refinements, and official Changelog link in Settings.',
          dmgUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.2/Strand-0.2.2-darwin-arm64.dmg',
          zipUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.2/Strand-0.2.2-darwin-arm64.zip',
          releaseUrl: 'https://github.com/extrastu/Strand/releases/tag/v0.2.2',
          sections: [
            {
              category: 'features',
              items: [
                'Automatic in-place updater for macOS: downloads, unpacks, and replaces Strand.app with single-click restart prompt.',
                'Settings > About panel now provides direct links to Official Website, Changelog, and GitHub repository.',
              ],
            },
            {
              category: 'improvements',
              items: [
                'Redesigned Toast notification layout with flexible height and whitespace protection to prevent text wrapping.',
                'Prioritized native .zip archives for faster and cleaner in-place updates.',
              ],
            },
          ],
        },
        {
          version: 'v0.2.1',
          date: 'October 18, 2026',
          isLatest: false,
          summary: 'Dedicated Changelog portal launch, automated release badges, and full SEO enhancements.',
          dmgUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.1/Strand-0.2.1-darwin-arm64.dmg',
          zipUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.1/Strand-0.2.1-darwin-arm64.zip',
          releaseUrl: 'https://github.com/extrastu/Strand/releases/tag/v0.2.1',
          sections: [
            {
              category: 'features',
              items: [
                'Added dedicated Changelog page to official web portal with full bilingual release history.',
                'Integrated real-time version badge into GitHub README synced with releases.',
                'Enhanced navigation bar and footer with direct Changelog routes.',
              ],
            },
            {
              category: 'improvements',
              items: [
                'Optimized sitemap.xml and Schema.org metadata for changelog release tracking.',
                'Polished typography and responsive layout for mobile changelog inspection.',
              ],
            },
          ],
        },
        {
          version: 'v0.2.0',
          date: 'October 18, 2026',
          isLatest: false,
          summary: 'Major architecture evolution to Monorepo, official Next.js 15 landing website, and enhanced multi-account keyboard workflows.',
          dmgUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.0/Strand-0.2.0-darwin-arm64.dmg',
          zipUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.0/Strand-0.2.0-darwin-arm64.zip',
          releaseUrl: 'https://github.com/extrastu/Strand/releases/tag/v0.2.0',
          sections: [
            {
              category: 'features',
              items: [
                'Monorepo architecture with npm/pnpm workspaces managing apps/desktop and apps/web.',
                'Brand-new official website built with Next.js 15 App Router, shadcn/ui, and Tailwind CSS v4.',
                'Global account switching with ⌘1~9 shortcuts across isolated webview partitions.',
                'Settings dialog with General (Theme, Language) and About tabs.',
                'Full bilingual support (English & 简体中文) with 100% dictionary coverage.',
              ],
            },
            {
              category: 'improvements',
              items: [
                'Smooth spring drawer animations when collapsing or expanding the sidebar with ⌘B.',
                'Automated ad-hoc codesigning and DMG/ZIP distribution packaging scripts.',
                'Browser language auto-detection with graceful fallback to English.',
                'Comprehensive SEO optimization with OpenGraph, JSON-LD, robots.txt, and sitemap.',
                'Zero-config traffic analytics via @vercel/analytics.',
              ],
            },
            {
              category: 'fixes',
              items: [
                'Fixed before-input-event propagation when keyboard focus resides inside Threads webview.',
                'Fixed theme synchronization across main window chrome and webview sessions.',
              ],
            },
          ],
        },
        {
          version: 'v0.1.0',
          date: 'October 16, 2026',
          isLatest: false,
          summary: 'Initial public release of Strand, the unofficial Threads multi-account client for macOS.',
          releaseUrl: 'https://github.com/extrastu/Strand/releases',
          sections: [
            {
              category: 'features',
              items: [
                'Isolated multi-account webview partitions (persist:account-<id>) with zero cookie leaks.',
                'Minimalist monochrome aesthetic inspired by Threads and Claude desktop geometry.',
                'Sidebar account management with add, switch, rename, and remove capabilities.',
                'Native macOS keyboard shortcuts and window controls.',
                'Strict local privacy: zero middleman servers and no telemetry collection.',
              ],
            },
          ],
        },
      ],
    },
    hero: {
      badge: 'Strand v0.2.2 for macOS is out',
      titlePrimary: 'Threads, refined for',
      titleSecondary: 'macOS workflow.',
      description:
        'An elegant, distraction-free desktop client for Threads. Seamlessly manage multiple accounts with strictly isolated local sessions, native monochrome aesthetics, and zero data tracking.',
      downloadDmg: 'Download for Apple Silicon',
      downloadDmgSub: 'macOS 13+ · .dmg (103 MB)',
      downloadZip: 'Download .zip Archive',
      viewReleases: 'All Releases',
      intelNotice: 'Need Intel (x64) build? Grab it from Releases.',
      platformNote: 'Native on Apple Silicon & Intel · macOS Ventura, Sonoma, Sequoia',
    },
    mockup: {
      windowTitle: 'Strand — @alex',
      switchHint: 'Click accounts to test interactive multi-account switching',
      toggleSidebar: 'Toggle sidebar (Cmd+B)',
      settingsTitle: 'Settings',
      themeLabel: 'Theme',
      langLabel: 'Language',
      aboutLabel: 'About',
      accounts: [
        { id: '1', name: 'Alex River', handle: '@alex', followers: '14.2k', bio: 'Design engineer & open-source tinkerer.', postsCount: '342' },
        { id: '2', name: 'Studio Strand', handle: '@strand_app', followers: '58.9k', bio: 'Official updates for Strand macOS client.', postsCount: '89' },
        { id: '3', name: 'Elena Chen', handle: '@elena_c', followers: '8.4k', bio: 'Photography, typography, and coffee enthusiast.', postsCount: '612' },
      ],
      samplePost: {
        text: 'Just switched to Strand on Mac. Having completely isolated browser partitions for personal and work accounts without juggling tabs is a game-changer.',
        time: '2h ago',
        replies: 24,
        likes: 182,
      },
    },
    features: {
      tag: 'Capabilities',
      title: 'Crafted for daily focus and multi-account flow',
      subtitle: 'Everything you need to read and publish on Threads without browser tab clutter.',
      items: [
        {
          title: 'Isolated Multi-Account Sessions',
          desc: 'Each account lives in its own sandboxed partition. Zero shared cookies, zero cross-talk, no constant re-logging.',
          icon: 'Users',
        },
        {
          title: 'Monochrome Mac Aesthetics',
          desc: 'Adopts Threads classic black-and-white palette alongside Claude-inspired desktop geometry. Clean, distraction-free, and timeless.',
          icon: 'Palette',
        },
        {
          title: 'Privacy & Local Sandbox',
          desc: 'No middleman servers, no telemetry, no scraping, no credential storage. Your passwords stay directly with Threads authentication.',
          icon: 'ShieldCheck',
        },
        {
          title: 'Instant Keyboard Navigation',
          desc: 'Collapse the sidebar with ⌘B, jump across accounts with ⌘1~9, and glide with native macOS ergonomics.',
          icon: 'Command',
        },
        {
          title: 'Live System Theme & Bilingual',
          desc: 'Follows macOS Dark/Light appearance instantaneously. Complete English and 简体中文 interface with zero missing strings.',
          icon: 'Languages',
        },
        {
          title: 'Ultralight Resource Footprint',
          desc: 'Built with a single renderer and smart webview background suspensions. Crisp performance and gentle battery usage.',
          icon: 'Zap',
        },
      ],
    },
    shortcuts: {
      tag: 'Productivity',
      title: 'Keyboard-first, just like Mac should be',
      subtitle: 'Keep your hands on the keyboard with intuitive shortcuts.',
      keys: [
        { key: '⌘ B', desc: 'Toggle sidebar visibility with smooth spring animation' },
        { key: '⌘ 1 ... 9', desc: 'Directly switch to account by position' },
        { key: '⌘ N', desc: 'Add new Threads account partition' },
        { key: '⌘ ,', desc: 'Open Settings dialog (Theme, Language, About)' },
        { key: 'Esc', desc: 'Dismiss active dialog or overlay' },
      ],
    },
    downloadSection: {
      tag: 'Get Started',
      title: 'Download Strand for macOS',
      subtitle: 'Choose the installation package suitable for your Mac.',
      appleSilicon: {
        title: 'Apple Silicon (Recommended)',
        desc: 'M1, M2, M3, M4 Macs with native ARM64 speed and battery optimization.',
        btn: 'Download DMG (Apple Silicon)',
        filename: 'Strand-0.2.2-darwin-arm64.dmg',
      },
      zipPackage: {
        title: 'Portable ZIP Archive',
        desc: 'Direct drag-and-drop portable package for Apple Silicon machines.',
        btn: 'Download ZIP',
        filename: 'Strand-0.2.2-darwin-arm64.zip',
      },
      checksumNote: 'SHA-256 integrity checksums available on GitHub Releases.',
      installTipTitle: 'Installation Tip',
      installTipText: 'Strand is an open-source, ad-hoc signed app. If macOS displays a verification warning on first run, right-click (or Control-click) Strand.app in Applications and choose Open.',
    },
    faq: {
      tag: 'Questions & Answers',
      title: 'Frequently Asked Questions',
      items: [
        {
          q: 'Is Strand affiliated with Instagram, Meta, or Threads?',
          a: 'No. Strand is an independent, unofficial open-source project created for macOS users. It is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc.',
        },
        {
          q: 'How does Strand handle multiple accounts securely?',
          a: 'Strand utilizes Electron partition webviews (`persist:account-<id>`). Each partition has completely separate local cookies, cache, and IndexedDB storage. Strand never touches or inspects your credentials.',
        },
        {
          q: 'Is there any telemetry or data collection?',
          a: 'None. Strand does not track user events, does not inject scraping scripts into Threads pages, and has zero analytics backends.',
        },
        {
          q: 'Does it support Windows or Linux?',
          a: 'Strand is currently fine-tuned specifically for macOS design guidelines (SF Pro typography, native window controls, theme sync). Windows and Linux builds may be explored in future community editions.',
        },
      ],
    },
    footer: {
      tagline: 'An unofficial, native-inspired desktop experience for Threads on macOS.',
      disclaimer: 'Threads and Meta are trademarks of Meta Platforms, Inc. Strand is an independent project.',
      rights: 'All rights reserved.',
      links: {
        changelog: 'Changelog',
        releases: 'Releases',
        repo: 'Source Code',
        issues: 'Report Issue',
        license: 'MIT License',
      },
      licenseNote: 'Open-source under the MIT License.',
    },
  },
  'zh-CN': {
    nav: {
      features: '核心特性',
      showcase: '界面预览',
      shortcuts: '快捷键',
      faq: '常见问题',
      download: '立即下载',
      changelog: '更新日志',
      github: 'GitHub 仓库',
    },
    changelogPage: {
      tag: "版本历史",
      title: '更新日志',
      subtitle: 'Strand macOS 客户端的所有最新版本、新功能、性能优化与问题修复记录。',
      backHome: '返回首页',
      downloadDmg: '下载 .dmg 安装包',
      downloadZip: '下载 .zip 压缩包',
      releaseNotes: 'GitHub 发行说明',
      latestBadge: '最新版本',
      categories: {
        features: '新功能与特性',
        improvements: '优化与改进',
        fixes: '问题修复',
      },
      releases: [
        {
          version: 'v0.2.2',
          date: '2026 年 10 月 18 日',
          isLatest: true,
          summary: 'macOS 自动无缝热更新支持，Toast 提醒布局优化，设置面板新增官网、更新日志与 GitHub 链接。',
          dmgUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.2/Strand-0.2.2-darwin-arm64.dmg',
          zipUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.2/Strand-0.2.2-darwin-arm64.zip',
          releaseUrl: 'https://github.com/extrastu/Strand/releases/tag/v0.2.2',
          sections: [
            {
              category: 'features',
              items: [
                '全新 macOS 自动无缝热更新：下载完成后自动就地解压替换 Strand.app 并提醒用户一键重启生效。',
                '设置「关于」面板新增官网、更新日志与 GitHub 官方仓库链接直达。',
              ],
            },
            {
              category: 'improvements',
              items: [
                '全面重构 Toast 提示组件布局，解除固定高度与换行压缩问题，支持操作按钮自适应单行排版。',
                'macOS 更新机制优先拉取 .zip 格式免挂载解压，大幅提升更新平滑度。',
              ],
            },
          ],
        },
        {
          version: 'v0.2.1',
          date: '2026 年 10 月 18 日',
          isLatest: false,
          summary: '官方网站上线更新日志页面，接入动态版本号 Badge，全面优化 SEO 与依赖项。',
          dmgUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.1/Strand-0.2.1-darwin-arm64.dmg',
          zipUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.1/Strand-0.2.1-darwin-arm64.zip',
          releaseUrl: 'https://github.com/extrastu/Strand/releases/tag/v0.2.1',
          sections: [
            {
              category: 'features',
              items: [
                '官方网站上线专属更新日志（Changelog）页面，提供完整中英文版本演进记录。',
                'GitHub README 接入版本号动态 Shields Badge，实时同步 Release 状态。',
                '顶部导航栏与页脚新增更新日志直达入口。',
              ],
            },
            {
              category: 'improvements',
              items: [
                '优化 sitemap.xml 索引与 Schema.org 结构化数据，增强更新日志搜索引擎收录。',
                '调优移动端与桌面端的排版间距与响应式阅读体验。',
              ],
            },
          ],
        },
        {
          version: 'v0.2.0',
          date: '2026 年 10 月 18 日',
          isLatest: false,
          summary: '重大架构演进：迁移为 Monorepo 体系，新增 Next.js 15 官方门户网站，支持全局快捷键多账号切换。',
          dmgUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.0/Strand-0.2.0-darwin-arm64.dmg',
          zipUrl: 'https://github.com/extrastu/Strand/releases/download/v0.2.0/Strand-0.2.0-darwin-arm64.zip',
          releaseUrl: 'https://github.com/extrastu/Strand/releases/tag/v0.2.0',
          sections: [
            {
              category: 'features',
              items: [
                '重构为 npm/pnpm workspaces Monorepo 统一调度 apps/desktop 与 apps/web。',
                '全新构建基于 Next.js 15 App Router、shadcn/ui 与 Tailwind CSS v4 的官方网站。',
                '支持跨 Webview 分区的 ⌘1~9 快捷键快速切换多账号。',
                '全新设置面板：支持外观主题（跟随系统 / 浅色 / 深色）、语言切换及关于信息。',
                '完整中英双语国际化支持，文案覆盖率 100%。',
              ],
            },
            {
              category: 'improvements',
              items: [
                '⌘B 快捷折叠/展开侧边栏时加入细腻的弹性抽屉过渡动效。',
                '自动化 ad-hoc 签名与 DMG / ZIP 压缩安装包构建脚本。',
                '官网智能跟随浏览器首选语言，并在无法识别时平滑回滚至英文。',
                '深度 SEO 体系构建：包含 OpenGraph、JSON-LD 知识图谱、robots.txt 及 sitemap.xml。',
                '集成 @vercel/analytics 实现零配置网站访问统计。',
              ],
            },
            {
              category: 'fixes',
              items: [
                '修复焦点处于 Threads 网页内时键盘快捷键被拦截丢失的问题。',
                '修复应用原生窗口边框与网页会话之间的主题色同步问题。',
              ],
            },
          ],
        },
        {
          version: 'v0.1.0',
          date: '2026 年 10 月 16 日',
          isLatest: false,
          summary: 'Strand macOS 客户端首次正式公开发布。',
          releaseUrl: 'https://github.com/extrastu/Strand/releases',
          sections: [
            {
              category: 'features',
              items: [
                '基于独立沙箱分区（persist:account-<id>）的多账号无缝隔离，零 Cookie 串号风险。',
                '汲取 Threads 经典黑白视觉与 Claude 桌面端几何质感的高级极简美学。',
                '侧边栏账号管理器：支持添加、无缝切换、重命名与移除账号。',
                'macOS 原生快捷键与窗口交通灯控制集成。',
                '纯本地沙箱存储，不设中间服务器，零埋点零数据抓取。',
              ],
            },
          ],
        },
      ],
    },
    hero: {
      badge: 'Strand v0.2.2 已正式发布',
      titlePrimary: '专为 macOS 打造的',
      titleSecondary: 'Threads 多账号优雅体验。',
      description:
        '专注、纯粹的 Threads macOS 桌面客户端。采用独立沙箱会话机制，多账号自由切换无缝不串号；原生黑白极简美学，纯本地隔离，保护隐私零追踪。',
      downloadDmg: '下载 Apple Silicon 版',
      downloadDmgSub: 'macOS 13+ · .dmg 安装包 (103 MB)',
      downloadZip: '下载 .zip 压缩包',
      viewReleases: '查看所有版本',
      intelNotice: '需要 Intel (x64) 架构安装包？请前往 GitHub Releases 下载。',
      platformNote: '原生支持 Apple Silicon 与 Intel 芯片 · 兼容 macOS Ventura、Sonoma 及 Sequoia',
    },
    mockup: {
      windowTitle: 'Strand — @alex',
      switchHint: '点击账号即可交互式预览多账号切换效果',
      toggleSidebar: '折叠侧边栏 (Cmd+B)',
      settingsTitle: '设置',
      themeLabel: '外观主题',
      langLabel: '显示语言',
      aboutLabel: '关于应用',
      accounts: [
        { id: '1', name: 'Alex River', handle: '@alex', followers: '14.2k', bio: '设计工程师与开源爱好者。探索人机交互极限。', postsCount: '342' },
        { id: '2', name: 'Studio Strand', handle: '@strand_app', followers: '58.9k', bio: 'Strand macOS 客户端官方动态发布页。', postsCount: '89' },
        { id: '3', name: 'Elena Chen', handle: '@elena_c', followers: '8.4k', bio: '摄影、排版与手冲咖啡探索者。', postsCount: '612' },
      ],
      samplePost: {
        text: '终于在 Mac 上用到了 Strand！多账号完全独立沙箱隔离，工作号和生活号终于不用在浏览器标签页里反复登入退出了，真香。',
        time: '2 小时前',
        replies: 24,
        likes: 182,
      },
    },
    features: {
      tag: '功能亮点',
      title: '为专注浏览与高效多账号管理量身定制',
      subtitle: '告别杂乱的浏览器标签页，享受桌面级的高效发帖与阅读流。',
      items: [
        {
          title: '独立沙箱与多账号隔离',
          desc: '每个账号运行于独立的持久化分区 (`persist:account-id`)，Cookie 完全物理隔离，互不串扰。',
          icon: 'Users',
        },
        {
          title: '黑白纯粹原生美学',
          desc: '汲取 Threads 经典黑白视觉基调与 Claude 桌面端几何形态，去除非必要元素，专注沉浸。',
          icon: 'Palette',
        },
        {
          title: '纯本地沙箱与零数据追踪',
          desc: '无中间服务器、零埋点、不注入页面、不收集凭据。登录过程由 Threads 官方直接验证。',
          icon: 'ShieldCheck',
        },
        {
          title: '键盘工作流极速交互',
          desc: '⌘B 快捷折叠展开侧边栏、⌘1~9 顺滑切换账号、⌘, 呼出设置，深度贴合 macOS 键盘使用习惯。',
          icon: 'Command',
        },
        {
          title: '原生双色主题与中英双语',
          desc: '无缝跟随 macOS 系统暗黑/高亮模式，提供精心校对的简体中文与英文全界面本地化支持。',
          icon: 'Languages',
        },
        {
          title: '轻量高效与超低能耗',
          desc: '精简单渲染进程架构，后台账号智能休眠，丝滑运行不发烫，给 Mac 带来长久续航。',
          icon: 'Zap',
        },
      ],
    },
    shortcuts: {
      tag: '高效操作',
      title: '键盘优先，尽显 Mac 原生本色',
      subtitle: '双手无需离开键盘，即可轻松掌控多账号与界面布局。',
      keys: [
        { key: '⌘ B', desc: '展开或折叠侧边栏（带有弹性抽屉过渡动效）' },
        { key: '⌘ 1 ... 9', desc: '按序号快速切换至对应的 Threads 账号' },
        { key: '⌘ N', desc: '添加新的 Threads 账号登录分区' },
        { key: '⌘ ,', desc: '打开设置面板（外观主题、语言、关于）' },
        { key: 'Esc', desc: '关闭当前浮层或弹窗对话框' },
      ],
    },
    downloadSection: {
      tag: '即刻体验',
      title: '下载 Strand for macOS',
      subtitle: '选择适合您 Mac 设备的安装包，开启清爽的多账号 Threads 旅程。',
      appleSilicon: {
        title: 'Apple Silicon 安装包 (推荐)',
        desc: '适用于搭载 M1, M2, M3, M4 芯片的 Mac，原生 ARM64 极速启动与续航优化。',
        btn: '下载 DMG 安装包 (Apple Silicon)',
        filename: 'Strand-0.2.2-darwin-arm64.dmg',
      },
      zipPackage: {
        title: '便携 ZIP 压缩包',
        desc: '解压即用无需挂载安装映像，适合偏好免安装的用户。',
        btn: '下载 ZIP 压缩包',
        filename: 'Strand-0.2.2-darwin-arm64.zip',
      },
      checksumNote: '所有发行包的 SHA-256 校验和均公布在 GitHub Releases 页面。',
      installTipTitle: '首次安装提示',
      installTipText: 'Strand 为开源项目并采用 ad-hoc 签名。若首次运行时提示“无法验证开发者”，请在“应用程序”目录中右键（或按住 Control 点击）Strand.app，选择“打开”即可。',
    },
    faq: {
      tag: '答疑解惑',
      title: '常见问题解答',
      items: [
        {
          q: 'Strand 是 Meta 或 Threads 官方客户端吗？',
          a: '不是。Strand 是专为 macOS 用户打造的独立开源非官方客户端，与 Meta Platforms, Inc. 或 Threads 无任何隶属、赞助或背书关系。',
        },
        {
          q: '使用多账号是否安全？会不会被封号？',
          a: 'Strand 采用 Electron 标准的 Webview 多 Session 分区隔离技术，每个账号都在其独立的沙箱里与 Threads 官网通信，等同于在多个独立浏览器中登录，且不注入任何爬虫或修改脚本，纯粹还原官方网页。',
        },
        {
          q: 'Strand 会收集我的账号或个人信息吗？',
          a: '绝对不会。Strand 没有任何后端服务器，所有账号信息仅存储在您本地的 Application Support 目录中，代码完全开源透明。',
        },
        {
          q: '未来会支持 Windows 或 Linux 吗？',
          a: '当前版本重点针对 macOS 原生美学（SF Pro 字体栈、原生窗口控制、跟随系统主题等）进行深度打磨。后续将根据社区反馈探索跨平台支持。',
        },
      ],
    },
    footer: {
      tagline: '专为 macOS 用户打造的非官方、原生质感 Threads 多账号桌面客户端。',
      disclaimer: 'Threads 与 Meta 均为 Meta Platforms, Inc. 的商标。Strand 是一项独立的开源实验。',
      rights: '保留所有权利。',
      links: {
        changelog: '更新日志',
        releases: '版本发布',
        repo: '开源仓库',
        issues: '反馈问题',
        license: 'MIT 开源协议',
      },
      licenseNote: '基于 MIT 协议完全开源开放。',
    },
  },
}

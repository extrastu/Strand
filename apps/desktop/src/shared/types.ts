// Types and constants shared by the main process, the preload bridge and the renderer.

export type AccountType = 'personal' | 'creator'

export const ACCOUNT_TYPES: readonly AccountType[] = ['personal', 'creator']
export const MAX_NAME_LENGTH = 40

export interface Account {
  id: string
  name: string
  type: AccountType
}

export interface AccountsState {
  accounts: Account[]
  activeId: string | null
}

export interface AccountInput {
  name: string
  type: AccountType
}

export type ThemeSetting = 'system' | 'light' | 'dark'
export type Language = 'zh-CN' | 'en'

export const THEMES: readonly ThemeSetting[] = ['system', 'light', 'dark']
export const LANGUAGES: readonly Language[] = ['zh-CN', 'en']

export type ShortcutAction = 'toggleSidebar' | 'addAccount' | 'settings' | 'search'

export const SHORTCUT_ACTIONS: readonly ShortcutAction[] = [
  'toggleSidebar',
  'addAccount',
  'settings',
  'search',
]

export type ShortcutMap = Record<ShortcutAction, string>

export const DEFAULT_SHORTCUTS: ShortcutMap = {
  toggleSidebar: 'Mod+B',
  addAccount: 'Mod+N',
  settings: 'Mod+,',
  search: 'Mod+F',
}

export interface Settings {
  theme: ThemeSetting
  language: Language
  shortcuts?: Partial<Record<ShortcutAction, string>>
  autoCheckUpdates?: boolean
}

export interface UpdateInfo {
  version: string
  releaseName: string
  releaseNotes: string
  publishedAt: string
  downloadUrl: string
  releaseUrl: string
  assetName: string
  assetSize: number
}

export type UpdateState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'available'; info: UpdateInfo }
  | { status: 'not-available'; checkedAt: string; currentVersion: string }
  | { status: 'downloading'; info: UpdateInfo; percent: number; transferred: number; total: number }
  | { status: 'downloaded'; info: UpdateInfo; filePath: string }
  | { status: 'error'; message: string }

export interface AboutInfo {
  name: string
  version: string
  electron: string
  chromium: string
}

export const SIDEBAR_WIDTH = 240
export const SIDEBAR_WIDTH_HIDDEN = 0 // collapsed: the sidebar is gone and the account page fills the window
export const TOPBAR_HEIGHT = 44

export const IPC = {
  getState: 'accounts:get',
  add: 'accounts:add',
  update: 'accounts:update',
  remove: 'accounts:remove',
  select: 'accounts:select',
  copyName: 'accounts:copy',
  collapse: 'sidebar:collapse',
  overlay: 'view:overlay',
  settingsGet: 'settings:get',
  settingsSet: 'settings:set',
  about: 'app:about',
  dragStart: 'window:drag-start',
  dragMove: 'window:drag-move',
  accountsChanged: 'accounts:changed',
  navBack: 'nav:back',
  navForward: 'nav:forward',
  navReload: 'nav:reload',
  navState: 'nav:state',
  navChanged: 'nav:changed',
  openExternal: 'shell:open-external',
  modState: 'window:mod-state',
  updaterCheck: 'updater:check',
  updaterDownload: 'updater:download',
  updaterInstall: 'updater:install',
  updaterOpenRelease: 'updater:open-release',
  updaterState: 'updater:state',
  updaterStatusChanged: 'updater:status-changed',
} as const

export interface NavigationState {
  canGoBack: boolean
  canGoForward: boolean
}

/** What the preload exposes to the renderer as `window.threads`. */
export interface ThreadsApi {
  accounts: {
    getState(): Promise<AccountsState>
    add(input: AccountInput): Promise<AccountsState>
    update(id: string, input: AccountInput): Promise<AccountsState>
    remove(id: string): Promise<AccountsState>
    select(id: string): Promise<AccountsState>
    copyName(id: string): Promise<string>
    onChanged?(callback: (state: AccountsState) => void): () => void
  }
  navigation: {
    goBack(): Promise<void>
    goForward(): Promise<void>
    reload(): Promise<void>
    getState(): Promise<NavigationState>
    onChanged?(callback: (state: NavigationState) => void): () => void
  }
  sidebar: {
    /** Resolves to the sidebar width in px that the main process now uses. */
    setCollapsed(collapsed: boolean, animated?: boolean): Promise<number>
  }
  settings: {
    get(): Promise<Settings>
    /** Applies the given fields (theme is applied to the whole app at once) and resolves to all settings. */
    set(patch: Partial<Settings>): Promise<Settings>
  }
  about(): Promise<AboutInfo>
  openExternal(url: string): Promise<void>
  onModStateChanged?(callback: (pressed: boolean) => void): () => void
  updater: {
    check(manual?: boolean): Promise<UpdateState>
    download(): Promise<void>
    install(): Promise<void>
    openReleasePage(): Promise<void>
    getState(): Promise<UpdateState>
    onStatusChanged?(callback: (state: UpdateState) => void): () => void
  }
  /** Account pages are native views drawn above the renderer; hide them while a dialog is open. */
  overlay: {
    set(open: boolean): Promise<void>
  }
  windowDrag: {
    start(): void
    move(dx: number, dy: number): void
  }
}

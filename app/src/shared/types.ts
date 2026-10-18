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
  dragStart: 'window:drag-start',
  dragMove: 'window:drag-move',
} as const

/** What the preload exposes to the renderer as `window.threads`. */
export interface ThreadsApi {
  accounts: {
    getState(): Promise<AccountsState>
    add(input: AccountInput): Promise<AccountsState>
    update(id: string, input: AccountInput): Promise<AccountsState>
    remove(id: string): Promise<AccountsState>
    select(id: string): Promise<AccountsState>
    copyName(id: string): Promise<string>
  }
  sidebar: {
    /** Resolves to the sidebar width in px that the main process now uses. */
    setCollapsed(collapsed: boolean): Promise<number>
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

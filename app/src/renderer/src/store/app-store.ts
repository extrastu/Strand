import { toast } from 'sonner'
import { create } from 'zustand'
import type { Account, AccountInput, AccountsState } from '@shared/types'

export type DialogState = { kind: 'add' } | { kind: 'edit'; id: string } | { kind: 'remove'; id: string } | null

const COLLAPSED_KEY = 'sidebarCollapsed'

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

function writeCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0')
  } catch {
    // storage can be unavailable; the flag is only a convenience
  }
}

interface AppStore {
  accounts: Account[]
  activeId: string | null
  collapsed: boolean
  ready: boolean
  dialog: DialogState

  init(): Promise<void>
  select(id: string): Promise<void>
  /** Add (id === null) or edit an account. Resolves true on success; failures are toasted. */
  save(id: string | null, input: AccountInput): Promise<boolean>
  remove(id: string): Promise<void>
  copyName(id: string): Promise<void>
  setCollapsed(collapsed: boolean): Promise<void>
  openDialog(dialog: Exclude<DialogState, null>): void
  closeDialog(): void
}

const removingIds = new Set<string>()

const apply = (state: AccountsState) => ({ accounts: state.accounts, activeId: state.activeId })

export const useAppStore = create<AppStore>()((set, get) => ({
  accounts: [],
  activeId: null,
  collapsed: false,
  ready: false,
  dialog: null,

  async init() {
    try {
      set({ ...apply(await window.threads.accounts.getState()), ready: true })
    } catch {
      // Stay not-ready: showing "no accounts" while main still has an active account would be a lie.
      toast.error('读取账号失败,请重启应用。')
      return
    }
    // Always tell main which width to use, so both sides agree even if the stored flag is missing.
    await get().setCollapsed(readCollapsed())
  },

  async select(id) {
    if (id === get().activeId) return
    try {
      set(apply(await window.threads.accounts.select(id)))
    } catch {
      toast.error('切换失败,请重试。')
    }
  },

  async save(id, input) {
    try {
      const next = id
        ? await window.threads.accounts.update(id, input)
        : await window.threads.accounts.add(input)
      set(apply(next))
      return true
    } catch {
      toast.error('保存失败,请重试。名称需为 1–40 个字符。')
      return false
    }
  },

  async remove(id) {
    if (removingIds.has(id)) return // a second click while the first removal is in flight
    removingIds.add(id)
    try {
      set(apply(await window.threads.accounts.remove(id)))
    } catch {
      toast.error('删除失败,请重试。')
    } finally {
      removingIds.delete(id)
      get().closeDialog()
    }
  },

  async copyName(id) {
    try {
      toast.success(`已复制账号名称:${await window.threads.accounts.copyName(id)}`)
    } catch {
      toast.error('复制失败,请重试。')
    }
  },

  async setCollapsed(collapsed) {
    try {
      await window.threads.sidebar.setCollapsed(collapsed)
      writeCollapsed(collapsed)
      set({ collapsed })
    } catch {
      toast.error('侧边栏切换失败,请重试。')
    }
  },

  openDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),
}))

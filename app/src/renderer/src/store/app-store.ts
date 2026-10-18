import { toast } from 'sonner'
import { create } from 'zustand'
import { defaultLanguageFor } from '@shared/locale'
import { DEFAULT_SHORTCUTS } from '@shared/types'
import type { AboutInfo, Account, AccountInput, AccountsState, Settings } from '@shared/types'
import { translate } from '@/i18n'
import type { MessageKey, Params } from '@/i18n'

export type DialogState =
  | { kind: 'add' }
  | { kind: 'edit'; id: string }
  | { kind: 'remove'; id: string }
  | { kind: 'settings' }
  | null

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
  /** Until the saved settings arrive the language is guessed from the browser locale; the UI waits (see App). */
  settings: Settings
  settingsLoaded: boolean
  about: AboutInfo | null

  init(): Promise<void>
  select(id: string): Promise<void>
  /** Add (id === null) or edit an account. Resolves true on success; failures are toasted. */
  save(id: string | null, input: AccountInput): Promise<boolean>
  remove(id: string): Promise<void>
  copyName(id: string): Promise<void>
  setCollapsed(collapsed: boolean, animated?: boolean): Promise<void>
  updateSettings(patch: Partial<Settings>): Promise<void>
  loadAbout(): Promise<void>
  openDialog(dialog: Exclude<DialogState, null>): void
  closeDialog(): void
}

const removingIds = new Set<string>()

const apply = (state: AccountsState) => ({ accounts: state.accounts, activeId: state.activeId })

/** Translates with the language that is current when called, for toasts fired from actions. */
function t(key: MessageKey, params?: Params): string {
  return translate(useAppStore.getState().settings.language, key, params)
}

export const useAppStore = create<AppStore>()((set, get) => ({
  accounts: [],
  activeId: null,
  collapsed: false,
  ready: false,
  dialog: null,
  settings: {
    theme: 'system',
    language: defaultLanguageFor(typeof navigator === 'undefined' ? '' : navigator.language),
    shortcuts: DEFAULT_SHORTCUTS,
  },
  settingsLoaded: false,
  about: null,

  async init() {
    let settingsFailed = false
    try {
      set({ settings: await window.threads.settings.get() })
    } catch {
      settingsFailed = true // keep the guessed defaults, and say so once the toaster exists
    }
    set({ settingsLoaded: true })
    if (settingsFailed) setTimeout(() => toast.error(t('toast.settingsLoadFailed')), 0)
    try {
      set({ ...apply(await window.threads.accounts.getState()), ready: true })
    } catch {
      // Stay not-ready: showing "no accounts" while main still has an active account would be a lie.
      toast.error(t('toast.loadFailed'))
      return
    }
    // Always tell main which width to use, so both sides agree even if the stored flag is missing.
    await get().setCollapsed(readCollapsed(), false)
  },

  async select(id) {
    if (id === get().activeId) return
    try {
      set(apply(await window.threads.accounts.select(id)))
    } catch {
      toast.error(t('toast.switchFailed'))
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
      toast.error(t('toast.saveFailed'))
      return false
    }
  },

  async remove(id) {
    if (removingIds.has(id)) return // a second click while the first removal is in flight
    removingIds.add(id)
    try {
      set(apply(await window.threads.accounts.remove(id)))
    } catch {
      toast.error(t('toast.deleteFailed'))
    } finally {
      removingIds.delete(id)
      get().closeDialog()
    }
  },

  async copyName(id) {
    try {
      toast.success(t('toast.copied', { name: await window.threads.accounts.copyName(id) }))
    } catch {
      toast.error(t('toast.copyFailed'))
    }
  },

  async setCollapsed(collapsed, animated = true) {
    try {
      writeCollapsed(collapsed)
      set({ collapsed })
      await window.threads.sidebar.setCollapsed(collapsed, animated)
    } catch {
      toast.error(t('toast.sidebarFailed'))
    }
  },

  async updateSettings(patch) {
    try {
      set({ settings: await window.threads.settings.set(patch) })
    } catch {
      toast.error(t('toast.settingsFailed'))
    }
  },

  async loadAbout() {
    if (get().about) return
    try {
      set({ about: await window.threads.about() })
    } catch {
      // the About panel simply shows no version line
    }
  },

  openDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),
}))

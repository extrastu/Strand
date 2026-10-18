// Multi-account Threads shell: the renderer (sidebar + top bar) is this window's own page, plus one
// isolated WebContentsView per account. No injection into Threads pages, no API calls.
import path from 'node:path'
import { app, BrowserWindow, clipboard, dialog, ipcMain, nativeImage, nativeTheme, session, shell, WebContentsView } from 'electron'
import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { DEFAULT_SHORTCUTS, IPC, SIDEBAR_WIDTH, SIDEBAR_WIDTH_HIDDEN, TOPBAR_HEIGHT } from '@shared/types'
import { defaultLanguageFor } from '@shared/locale'
import type { AboutInfo, AccountInput, AccountsState, Settings } from '@shared/types'
import { createStore, partitionFor } from './accounts'
import type { AccountStore } from './accounts'
import { resolveUserDataDir } from './legacy-data'
import { classifyLink, isWrapperUrl } from './links'
import { createSettingsStore } from './settings'
import type { SettingsStore } from './settings'
import { AppUpdater } from './updater'
import iconPath from '../../build/icon.png?asset'

const APP_NAME = 'Strand'
app.setName(APP_NAME)
app.setAboutPanelOptions({ applicationName: APP_NAME })
// The app used to be called ThreadsMac: keep its accounts and logins. A --user-data-dir switch (tests) wins.
if (!app.commandLine.hasSwitch('user-data-dir')) {
  app.setPath('userData', resolveUserDataDir(app.getPath('appData'), APP_NAME, ['ThreadsMac']))
}

const LOGIN_URL = 'https://www.threads.com/login'
const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

let win: BrowserWindow
let store: AccountStore
let settings: SettingsStore
let updater: AppUpdater
let sidebarWidth = SIDEBAR_WIDTH
let overlayOpen = false // a renderer dialog is open, so account pages must not cover it
const views = new Map<string, WebContentsView>() // account id -> view, created lazily and kept alive
const removing = new Set<string>() // accounts mid-removal: showActive must not recreate their view

function createView(id: string): WebContentsView {
  const partition = partitionFor(id)
  session.fromPartition(partition).setUserAgent(CHROME_UA)
  const view = new WebContentsView({ webPreferences: { partition } })
  const wc = view.webContents

  // Route a link: in-app pages load in this view, external ones go to the default browser.
  // Returns true if the navigation to `url` should proceed unchanged.
  const route = (url: string): boolean => {
    const link = classifyLink(url)
    if (link.kind === 'external') void shell.openExternal(link.url)
    else if (link.kind === 'internal' && link.url !== url) void wc.loadURL(link.url) // unwrapped shim
    return link.kind === 'internal' && link.url === url
  }
  wc.setWindowOpenHandler(({ url }) => {
    if (route(url)) void wc.loadURL(url)
    return { action: 'deny' }
  })
  const guard = (event: { preventDefault(): void }, url: string): void => {
    if (route(url)) return
    event.preventDefault()
    // A blocked redirect can leave the shim page (blank) on screen; step back to the real page.
    if (isWrapperUrl(wc.getURL()) && wc.navigationHistory.canGoBack()) wc.navigationHistory.goBack()
  }
  wc.on('will-navigate', guard)
  wc.on('will-redirect', guard)

  wc.on('before-input-event', (event, input) => {
    const isMeta = input.key === 'Meta' || input.code?.startsWith('Meta') || input.code?.startsWith('OS')
    const isCtrl = input.key === 'Control' || input.code?.startsWith('Control')
    const isModifierKey = process.platform === 'darwin' ? isMeta : (isCtrl || isMeta)

    if (isModifierKey) {
      const isDown = input.type === 'keyDown'
      if (win && !win.isDestroyed()) {
        win.webContents.send(IPC.modState, isDown)
      }
    } else if (input.type === 'keyUp') {
      const hasMod = process.platform === 'darwin' ? input.meta : (input.control || input.meta)
      if (!hasMod && win && !win.isDestroyed()) {
        win.webContents.send(IPC.modState, false)
      }
    }

    if (input.type !== 'keyDown') return
    const isMod = process.platform === 'darwin' ? input.meta : (input.control || input.meta)
    if (isMod && !input.alt && !input.shift) {
      let digit: number | null = null
      if (input.key >= '1' && input.key <= '9') {
        digit = parseInt(input.key, 10)
      } else if (input.code && /^(?:Digit|Numpad)([1-9])$/.test(input.code)) {
        const match = input.code.match(/^(?:Digit|Numpad)([1-9])$/)
        if (match && match[1]) digit = parseInt(match[1], 10)
      }

      if (digit !== null && digit >= 1 && digit <= 9) {
        event.preventDefault()
        const { accounts, activeId } = store.getState()
        const target = accounts[digit - 1]
        if (target && target.id !== activeId) {
          store.setActive(target.id)
          showActive()
          if (!win.isDestroyed()) {
            win.webContents.send(IPC.accountsChanged, store.getState())
          }
        }
      }
    }
  })

  const onNav = (): void => {
    const { activeId } = store?.getState() ?? {}
    if (id === activeId) emitNavigationState()
  }
  wc.on('did-navigate', onNav)
  wc.on('did-navigate-in-page', onNav)
  wc.on('did-finish-load', onNav)

  void wc.loadURL(LOGIN_URL)
  win.contentView.addChildView(view)
  views.set(id, view)
  return view
}

function getActiveView(): WebContentsView | undefined {
  const { activeId } = store?.getState() ?? {}
  if (!activeId) return undefined
  return views.get(activeId)
}

function getNavigationState(): { canGoBack: boolean; canGoForward: boolean } {
  const view = getActiveView()
  if (!view) return { canGoBack: false, canGoForward: false }
  const wc = view.webContents
  return {
    canGoBack: wc.navigationHistory.canGoBack(),
    canGoForward: wc.navigationHistory.canGoForward(),
  }
}

function emitNavigationState(): void {
  if (win && !win.isDestroyed()) {
    win.webContents.send(IPC.navChanged, getNavigationState())
  }
}

function layout(): void {
  const { width, height } = win.getContentBounds()
  const bounds = {
    x: sidebarWidth,
    y: TOPBAR_HEIGHT,
    width: Math.max(0, width - sidebarWidth),
    height: Math.max(0, height - TOPBAR_HEIGHT),
  }
  for (const view of views.values()) view.setBounds(bounds)
}

// Show only the active account's view; the others stay loaded but hidden.
function showActive(): void {
  const { accounts, activeId } = store.getState()
  if (activeId && !views.has(activeId) && !removing.has(activeId)) createView(activeId)
  for (const [id, view] of views) view.setVisible(!overlayOpen && id === activeId)
  layout()
  const active = accounts.find((a) => a.id === activeId)
  win.setTitle(active ? `${APP_NAME} — ${active.name}` : APP_NAME)
  emitNavigationState()
}

function destroyView(id: string): void {
  const view = views.get(id)
  if (!view) return
  win.contentView.removeChildView(view)
  view.webContents.close()
  views.delete(id)
}

// The renderer asks for confirmation before calling this.
async function removeAccount(id: string): Promise<void> {
  if (!store.getState().accounts.some((a) => a.id === id)) throw new Error(`unknown account: ${id}`)
  removing.add(id)
  try {
    destroyView(id)
    try {
      await session.fromPartition(partitionFor(id)).clearStorageData()
    } catch (err) {
      removing.delete(id)
      if (!views.has(id)) createView(id) // account stays listed, so give it its view back
      showActive()
      throw err
    }
    store.remove(id)
  } finally {
    removing.delete(id)
  }
  showActive()
}

// Only the app's own page (the window's main frame) may drive the accounts API.
function fromRenderer(event: IpcMainEvent | IpcMainInvokeEvent): boolean {
  return event.sender === win.webContents && event.senderFrame === win.webContents.mainFrame
}

function handle<P>(channel: string, fn: (payload: P) => unknown): void {
  ipcMain.handle(channel, (event, payload: P) => {
    if (!fromRenderer(event)) throw new Error('untrusted sender')
    return fn((payload ?? {}) as P)
  })
}

let dragOrigin: [number, number] | null = null

function registerWindowDrag(): void {
  ipcMain.on(IPC.dragStart, (event) => {
    if (fromRenderer(event)) dragOrigin = win.getPosition() as [number, number]
  })
  ipcMain.on(IPC.dragMove, (event, delta: { dx?: unknown; dy?: unknown } | undefined) => {
    if (!dragOrigin || !fromRenderer(event)) return
    const dx = Number(delta?.dx)
    const dy = Number(delta?.dy)
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return
    win.setPosition(Math.round(dragOrigin[0] + dx), Math.round(dragOrigin[1] + dy))
  })
}

function registerIpc(): void {
  registerWindowDrag()
  const state = (): AccountsState => store.getState()
  handle<undefined>(IPC.getState, () => state())
  handle<AccountInput>(IPC.add, ({ name, type }) => {
    store.add({ name, type })
    showActive()
    return state()
  })
  handle<{ id: string } & AccountInput>(IPC.update, ({ id, name, type }) => {
    store.update(id, { name, type })
    showActive()
    return state()
  })
  handle<{ id: string }>(IPC.remove, async ({ id }) => {
    await removeAccount(id)
    return state()
  })
  handle<{ id: string }>(IPC.select, ({ id }) => {
    store.setActive(id)
    showActive()
    return state()
  })
  handle<{ id: string }>(IPC.copyName, ({ id }) => {
    const account = state().accounts.find((a) => a.id === id)
    if (!account) throw new Error(`unknown account: ${id}`)
    clipboard.writeText(account.name)
    return account.name
  })
  handle<undefined>(IPC.settingsGet, () => settings.get())
  handle<Partial<Settings>>(IPC.settingsSet, (patch) => {
    // Only the known fields are taken; the store rejects invalid values and keeps what it had.
    const next = settings.set({
      theme: patch.theme,
      language: patch.language,
      shortcuts: patch.shortcuts,
      autoCheckUpdates: patch.autoCheckUpdates,
    })
    nativeTheme.themeSource = next.theme // the renderer, the window chrome and the account pages follow
    return next
  })
  handle<undefined>(IPC.about, (): AboutInfo => ({
    name: app.getName(),
    version: app.getVersion(),
    electron: process.versions.electron,
    chromium: process.versions.chrome,
  }))
  handle<{ open?: unknown }>(IPC.overlay, ({ open }) => {
    overlayOpen = open === true
    showActive()
  })
  handle<{ collapsed?: unknown; animated?: unknown }>(IPC.collapse, async ({ collapsed, animated }) => {
    const targetWidth = collapsed === true ? SIDEBAR_WIDTH_HIDDEN : SIDEBAR_WIDTH
    if (animated === false) {
      if (collapseAnimTimer) {
        clearInterval(collapseAnimTimer)
        collapseAnimTimer = null
      }
      sidebarWidth = targetWidth
      layout()
      return sidebarWidth
    }
    return animateSidebar(targetWidth, 200)
  })
  handle<undefined>(IPC.navBack, () => {
    const view = getActiveView()
    if (view && view.webContents.navigationHistory.canGoBack()) {
      view.webContents.navigationHistory.goBack()
    }
    emitNavigationState()
  })
  handle<undefined>(IPC.navForward, () => {
    const view = getActiveView()
    if (view && view.webContents.navigationHistory.canGoForward()) {
      view.webContents.navigationHistory.goForward()
    }
    emitNavigationState()
  })
  handle<undefined>(IPC.navReload, () => {
    const view = getActiveView()
    if (view) {
      view.webContents.reload()
    }
  })
  handle<undefined>(IPC.navState, () => getNavigationState())
  handle<string>(IPC.openExternal, (url) => {
    if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
      void shell.openExternal(url)
    }
  })
  handle<{ manual?: boolean }>(IPC.updaterCheck, ({ manual }) => updater.check(manual === true))
  handle<undefined>(IPC.updaterDownload, () => updater.download())
  handle<undefined>(IPC.updaterInstall, () => updater.install())
  handle<undefined>(IPC.updaterOpenRelease, () => updater.openReleasePage())
  handle<undefined>(IPC.updaterState, () => updater.getState())
}

let collapseAnimTimer: NodeJS.Timeout | null = null

function animateSidebar(targetWidth: number, durationMs = 200): Promise<number> {
  return new Promise((resolve) => {
    if (collapseAnimTimer) {
      clearInterval(collapseAnimTimer)
      collapseAnimTimer = null
    }
    const startWidth = sidebarWidth
    if (startWidth === targetWidth || durationMs <= 0) {
      sidebarWidth = targetWidth
      layout()
      return resolve(sidebarWidth)
    }

    const startTime = Date.now()
    const frameInterval = 16

    collapseAnimTimer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(1, elapsed / durationMs)
      // Ease out cubic: 1 - (1 - progress)^3
      const ease = 1 - Math.pow(1 - progress, 3)
      sidebarWidth = Math.round(startWidth + (targetWidth - startWidth) * ease)
      layout()

      if (progress >= 1) {
        if (collapseAnimTimer) clearInterval(collapseAnimTimer)
        collapseAnimTimer = null
        sidebarWidth = targetWidth
        layout()
        resolve(sidebarWidth)
      }
    }, frameInterval)
  })
}

void app.whenReady().then(() => {
  // A packaged app takes its icon from icon.icns; in dev the Dock would show Electron's, so set ours.
  if (process.platform === 'darwin' && !app.isPackaged) {
    const icon = nativeImage.createFromPath(iconPath)
    if (!icon.isEmpty()) app.dock?.setIcon(icon)
  }
  try {
    store = createStore(path.join(app.getPath('userData'), 'accounts.json'))
    settings = createSettingsStore(path.join(app.getPath('userData'), 'settings.json'), {
      theme: 'system',
      language: defaultLanguageFor(app.getLocale()),
      shortcuts: DEFAULT_SHORTCUTS,
      autoCheckUpdates: true,
    })
    updater = new AppUpdater(() => win, () => settings)
  } catch (err) {
    // Reading the data failed for a reason other than "missing" or "corrupt" (permissions, a folder in
    // the way, ...). Starting anyway could overwrite good data, so say what is wrong and stop.
    dialog.showErrorBox(
      APP_NAME,
      `${APP_NAME} could not read its data in:\n${app.getPath('userData')}\n\n${err instanceof Error ? err.message : String(err)}`,
    )
    app.quit()
    return
  }
  nativeTheme.themeSource = settings.get().theme
  win = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 720,
    minHeight: 480,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 15 },
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })
  win.on('resize', layout)
  // The app's own page owns the preload bridge, so it must never navigate away or open windows.
  win.webContents.on('will-navigate', (event, url) => {
    if (url !== win.webContents.getURL()) event.preventDefault()
  })
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) void shell.openExternal(url)
    return { action: 'deny' }
  })
  registerIpc()

  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (!app.isPackaged && devUrl) void win.loadURL(devUrl)
  else void win.loadFile(path.join(__dirname, '../renderer/index.html'))
  // A reloaded or crashed renderer has no dialog open and starts expanded: reset what it had told us.
  win.webContents.on('did-start-loading', () => {
    overlayOpen = false
    sidebarWidth = SIDEBAR_WIDTH
  })
  win.webContents.on('did-finish-load', () => {
    showActive()
    updater.startAutoCheck()
  })
})

app.on('window-all-closed', () => app.quit())

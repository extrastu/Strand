// Multi-account Threads shell: the renderer (sidebar + top bar) is this window's own page, plus one
// isolated WebContentsView per account. No injection into Threads pages, no API calls.
import path from 'node:path'
import { app, BrowserWindow, clipboard, ipcMain, nativeImage, session, shell, WebContentsView } from 'electron'
import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { IPC, SIDEBAR_WIDTH, SIDEBAR_WIDTH_HIDDEN, TOPBAR_HEIGHT } from '@shared/types'
import type { AccountInput, AccountsState } from '@shared/types'
import { createStore, partitionFor } from './accounts'
import type { AccountStore } from './accounts'
import { classifyLink, isWrapperUrl } from './links'
import iconPath from '../../build/icon.png?asset'

app.setName('ThreadsMac')

const LOGIN_URL = 'https://www.threads.com/login'
const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

let win: BrowserWindow
let store: AccountStore
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

  void wc.loadURL(LOGIN_URL)
  win.contentView.addChildView(view)
  views.set(id, view)
  return view
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
  win.setTitle(active ? `Threads — ${active.name}` : 'Threads')
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
  handle<{ open?: unknown }>(IPC.overlay, ({ open }) => {
    overlayOpen = open === true
    showActive()
  })
  handle<{ collapsed?: unknown }>(IPC.collapse, ({ collapsed }) => {
    sidebarWidth = collapsed === true ? SIDEBAR_WIDTH_HIDDEN : SIDEBAR_WIDTH
    layout()
    return sidebarWidth
  })
}

void app.whenReady().then(() => {
  // A packaged app takes its icon from icon.icns; in dev the Dock would show Electron's, so set ours.
  if (process.platform === 'darwin') {
    const icon = nativeImage.createFromPath(iconPath)
    if (!icon.isEmpty()) app.dock?.setIcon(icon)
  }
  store = createStore(path.join(app.getPath('userData'), 'accounts.json'))
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
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  registerIpc()

  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (!app.isPackaged && devUrl) void win.loadURL(devUrl)
  else void win.loadFile(path.join(__dirname, '../renderer/index.html'))
  // A reloaded or crashed renderer has no dialog open and starts expanded: reset what it had told us.
  win.webContents.on('did-start-loading', () => {
    overlayOpen = false
    sidebarWidth = SIDEBAR_WIDTH
  })
  win.webContents.on('did-finish-load', showActive)
})

app.on('window-all-closed', () => app.quit())

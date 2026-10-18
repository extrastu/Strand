'use strict'
// Multi-account Threads shell: a sidebar (this window's own page) plus one isolated
// WebContentsView per account. No injection into Threads pages, no API calls.
const path = require('node:path')
const { app, BrowserWindow, WebContentsView, clipboard, dialog, ipcMain, session, shell } = require('electron')
const { createStore, partitionFor } = require('./accounts')
const { classifyLink, isWrapperUrl } = require('./links')

app.setName('ThreadsMac')

const LOGIN_URL = 'https://www.threads.com/login'
const SIDEBAR_FILE = path.join(__dirname, 'sidebar.html')
const SIDEBAR_WIDTH = 240
const TOPBAR_HEIGHT = 38 // draggable strip across the window; account pages sit below it
const SIDEBAR_WIDTH_COLLAPSED = 72 // wide enough to clear the macOS traffic lights
const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

let win
let store
let sidebarWidth = SIDEBAR_WIDTH
const views = new Map() // account id -> WebContentsView, created lazily and kept alive

function createView(id) {
  const partition = partitionFor(id)
  session.fromPartition(partition).setUserAgent(CHROME_UA)
  const view = new WebContentsView({ webPreferences: { partition } })
  const wc = view.webContents

  // Route a link: in-app pages load in this view, external ones go to the default browser.
  // Returns true if the navigation to `url` should proceed unchanged.
  const route = (url) => {
    const link = classifyLink(url)
    if (link.kind === 'external') shell.openExternal(link.url)
    else if (link.kind === 'internal' && link.url !== url) wc.loadURL(link.url) // unwrapped shim
    return link.kind === 'internal' && link.url === url
  }
  wc.setWindowOpenHandler(({ url }) => {
    if (route(url)) wc.loadURL(url)
    return { action: 'deny' }
  })
  const guard = (event, url) => {
    if (route(url)) return
    event.preventDefault()
    // A blocked redirect can leave the shim page (blank) on screen; step back to the real page.
    if (isWrapperUrl(wc.getURL()) && wc.navigationHistory.canGoBack()) wc.navigationHistory.goBack()
  }
  wc.on('will-navigate', guard)
  wc.on('will-redirect', guard)

  wc.loadURL(LOGIN_URL)
  win.contentView.addChildView(view)
  views.set(id, view)
  return view
}

function layout() {
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
function showActive() {
  const { activeId } = store.getState()
  if (activeId && !views.has(activeId)) createView(activeId)
  for (const [id, view] of views) view.setVisible(id === activeId)
  layout()
  const active = store.getState().accounts.find((a) => a.id === activeId)
  win.setTitle(active ? `Threads — ${active.name}` : 'Threads')
}

function destroyView(id) {
  const view = views.get(id)
  if (!view) return
  win.contentView.removeChildView(view)
  view.webContents.close()
  views.delete(id)
}

async function removeAccount(id) {
  const account = store.getState().accounts.find((a) => a.id === id)
  if (!account) throw new Error(`unknown account: ${id}`)
  const { response } = await dialog.showMessageBox(win, {
    type: 'warning',
    buttons: ['取消', '删除'],
    defaultId: 0,
    cancelId: 0,
    message: `删除账号「${account.name}」?`,
    detail: '会清除这个账号在本应用里的登录状态,不会影响 Threads 上的账号本身。',
  })
  if (response !== 1) return false
  destroyView(id)
  try {
    await session.fromPartition(partitionFor(id)).clearStorageData()
  } catch (err) {
    if (!views.has(id)) createView(id) // account stays listed, so give it its view back
    showActive()
    throw err
  }
  store.remove(id)
  showActive()
  return true
}

// Only the local sidebar page may drive the accounts API.
function fromSidebar(event) {
  return event.sender === win.webContents && event.senderFrame === win.webContents.mainFrame
}

function handle(channel, fn) {
  ipcMain.handle(channel, (event, payload) => {
    if (!fromSidebar(event)) throw new Error('untrusted sender')
    return fn(payload ?? {})
  })
}

let dragOrigin = null

function registerWindowDrag() {
  ipcMain.on('window:drag-start', (event) => {
    if (fromSidebar(event)) dragOrigin = win.getPosition()
  })
  ipcMain.on('window:drag-move', (event, delta) => {
    if (!dragOrigin || !fromSidebar(event)) return
    const dx = Number(delta?.dx)
    const dy = Number(delta?.dy)
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return
    win.setPosition(Math.round(dragOrigin[0] + dx), Math.round(dragOrigin[1] + dy))
  })
}

function registerIpc() {
  registerWindowDrag()
  handle('accounts:get', () => store.getState())
  handle('accounts:add', ({ name, type }) => {
    store.add({ name, type })
    showActive()
    return store.getState()
  })
  handle('accounts:update', ({ id, name, type }) => {
    store.update(id, { name, type })
    showActive()
    return store.getState()
  })
  handle('accounts:remove', async ({ id }) => {
    await removeAccount(id)
    return store.getState()
  })
  handle('accounts:copy', ({ id }) => {
    const account = store.getState().accounts.find((a) => a.id === id)
    if (!account) throw new Error(`unknown account: ${id}`)
    clipboard.writeText(account.name)
    return account.name
  })
  handle('sidebar:collapse', ({ collapsed }) => {
    sidebarWidth = collapsed === true ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH
    layout()
    return sidebarWidth
  })
  handle('accounts:select', ({ id }) => {
    store.setActive(id)
    showActive()
    return store.getState()
  })
}

app.whenReady().then(() => {
  store = createStore(path.join(app.getPath('userData'), 'accounts.json'))
  win = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 720,
    minHeight: 480,
    titleBarStyle: 'hiddenInset',
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  })
  win.on('resize', layout)
  // The sidebar page owns the preload bridge, so it must never navigate or open windows.
  win.webContents.on('will-navigate', (event) => event.preventDefault())
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  registerIpc()
  win.loadFile(SIDEBAR_FILE)
  win.webContents.once('did-finish-load', showActive)
})

app.on('window-all-closed', () => app.quit())

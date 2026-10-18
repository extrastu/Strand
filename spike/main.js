// Spike: validates per-account sessions, intent prefill, and a global-hotkey quick-post window.
// No auto-clicking, no DOM injection, no scraping: the user logs in and presses Post by hand.
const { app, BrowserWindow, WebContentsView, Menu, globalShortcut, clipboard, session } = require('electron')

const HOTKEY = 'Command+Shift+Space'
const HOST = 'https://www.threads.com/login' // also try https://www.threads.net (see RESULTS.md)
const ACCOUNTS = ['persist:acct-1', 'persist:acct-2']
const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

let main
let quick
const views = new Map()
let active = ACCOUNTS[0]

function viewFor(partition) {
  if (views.has(partition)) return views.get(partition)
  session.fromPartition(partition).setUserAgent(CHROME_UA)
  const view = new WebContentsView({ webPreferences: { partition } })
  view.webContents.loadURL(HOST)
  views.set(partition, view)
  return view
}

function layout() {
  const { width, height } = main.getContentBounds()
  const view = views.get(active)
  if (view) view.setBounds({ x: 0, y: 0, width, height })
}

function switchAccount(partition) {
  active = partition
  for (const v of views.values()) main.contentView.removeChildView(v)
  main.contentView.addChildView(viewFor(partition))
  main.setTitle(`Threads spike — ${partition}`)
  layout()
}

function showQuick() {
  const text = clipboard.readText().trim() || 'Spike test post'
  const url = `${HOST}/intent/post?text=${encodeURIComponent(text)}`
  if (!quick || quick.isDestroyed()) {
    quick = new BrowserWindow({
      width: 520,
      height: 420,
      frame: false,
      alwaysOnTop: true,
      type: 'panel', // macOS NSPanel: shown without activating the whole app
      skipTaskbar: true,
      show: false,
      webPreferences: { partition: active },
    })
    quick.setAlwaysOnTop(true, 'floating')
    quick.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    quick.webContents.on('before-input-event', (e, input) => {
      if (input.type === 'keyDown' && input.key === 'Escape') quick.hide()
    })
    quick.on('closed', () => (quick = null))
  }
  quick.webContents.session.setUserAgent(CHROME_UA)
  quick.webContents.loadURL(url)
  quick.show()
  quick.focus()
}

function buildMenu() {
  const accountItems = ACCOUNTS.map((p) => ({ label: p, click: () => switchAccount(p) }))
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      { role: 'appMenu' },
      { label: 'Account', submenu: accountItems },
      { label: 'Quick', submenu: [{ label: `Show quick post (${HOTKEY})`, click: showQuick }] },
      { role: 'editMenu' },
      { role: 'viewMenu' },
    ]),
  )
}

app.whenReady().then(() => {
  main = new BrowserWindow({ width: 1100, height: 800 })
  main.on('resize', layout)
  buildMenu()
  switchAccount(active)
  // The quick window uses the account that was active when it was created; recreate on switch.
  const ok = globalShortcut.register(HOTKEY, () => {
    if (quick && !quick.isDestroyed() && quick.webContents.session !== session.fromPartition(active)) {
      quick.destroy()
    }
    showQuick()
  })
  console.log(`globalShortcut ${HOTKEY} registered: ${ok}`)
})

app.on('will-quit', () => globalShortcut.unregisterAll())
app.on('window-all-closed', () => app.quit())

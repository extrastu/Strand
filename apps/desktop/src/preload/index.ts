import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '@shared/types'
import type { ThreadsApi } from '@shared/types'

const api: ThreadsApi = {
  accounts: {
    getState: () => ipcRenderer.invoke(IPC.getState),
    add: (input) => ipcRenderer.invoke(IPC.add, input),
    update: (id, input) => ipcRenderer.invoke(IPC.update, { id, ...input }),
    remove: (id) => ipcRenderer.invoke(IPC.remove, { id }),
    select: (id) => ipcRenderer.invoke(IPC.select, { id }),
    copyName: (id) => ipcRenderer.invoke(IPC.copyName, { id }),
    onChanged: (callback) => {
      const listener = (_event: Electron.IpcRendererEvent, state: import('@shared/types').AccountsState) => callback(state)
      ipcRenderer.on(IPC.accountsChanged, listener)
      return () => {
        ipcRenderer.removeListener(IPC.accountsChanged, listener)
      }
    },
  },
  sidebar: {
    setCollapsed: (collapsed, animated) => ipcRenderer.invoke(IPC.collapse, { collapsed, animated }),
  },
  settings: {
    get: () => ipcRenderer.invoke(IPC.settingsGet),
    set: (patch) => ipcRenderer.invoke(IPC.settingsSet, patch),
  },
  about: () => ipcRenderer.invoke(IPC.about),
  overlay: {
    set: (open) => ipcRenderer.invoke(IPC.overlay, { open }),
  },
  // Window dragging is done by hand: -webkit-app-region does not reliably move this window.
  windowDrag: {
    start: () => ipcRenderer.send(IPC.dragStart),
    move: (dx, dy) => ipcRenderer.send(IPC.dragMove, { dx, dy }),
  },
}

contextBridge.exposeInMainWorld('threads', api)

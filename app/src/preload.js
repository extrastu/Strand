'use strict'
const { contextBridge, ipcRenderer } = require('electron')

// Window dragging is done by hand: -webkit-app-region does not reliably move this window.
contextBridge.exposeInMainWorld('windowDrag', {
  start: () => ipcRenderer.send('window:drag-start'),
  move: (dx, dy) => ipcRenderer.send('window:drag-move', { dx, dy }),
})

contextBridge.exposeInMainWorld('accounts', {
  getState: () => ipcRenderer.invoke('accounts:get'),
  add: (name, type) => ipcRenderer.invoke('accounts:add', { name, type }),
  update: (id, name, type) => ipcRenderer.invoke('accounts:update', { id, name, type }),
  remove: (id) => ipcRenderer.invoke('accounts:remove', { id }),
  select: (id) => ipcRenderer.invoke('accounts:select', { id }),
  copyName: (id) => ipcRenderer.invoke('accounts:copy', { id }),
  setCollapsed: (collapsed) => ipcRenderer.invoke('sidebar:collapse', { collapsed }),
})

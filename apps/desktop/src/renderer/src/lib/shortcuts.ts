/**
 * Utilities for formatting, recording, and matching customizable keyboard shortcuts.
 */

export function formatShortcutForDisplay(shortcut: string): string {
  if (!shortcut) return ''
  const isMac =
    typeof navigator !== 'undefined'
      ? /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)
      : true
  const parts = shortcut.split('+')
  const key = parts[parts.length - 1] ?? ''
  const modifiers = parts.slice(0, -1)

  if (isMac) {
    let result = ''
    if (modifiers.includes('Ctrl')) result += '⌃'
    if (modifiers.includes('Alt')) result += '⌥'
    if (modifiers.includes('Shift')) result += '⇧'
    if (modifiers.includes('Mod')) result += '⌘'

    let displayKey = key
    if (key.length === 1) displayKey = key.toUpperCase()
    else if (key === 'Escape') displayKey = 'Esc'
    return result + displayKey
  }

  const formattedMods = modifiers.map((m) => (m === 'Mod' ? 'Ctrl' : m))
  let displayKey = key
  if (key.length === 1) displayKey = key.toUpperCase()
  return [...formattedMods, displayKey].join('+')
}

export interface KeyboardEventLike {
  key: string
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
}

export function matchShortcut(e: KeyboardEventLike, shortcut: string): boolean {
  if (!shortcut) return false

  const tokens = shortcut.split('+')
  if (tokens.length === 0) return false

  const targetKey = tokens[tokens.length - 1] ?? ''
  if (!targetKey) return false
  const modifiers = new Set(tokens.slice(0, -1).map((t) => t.toLowerCase()))

  const wantMod = modifiers.has('mod')
  const wantShift = modifiers.has('shift')
  const wantAlt = modifiers.has('alt')
  const wantCtrl = modifiers.has('ctrl')

  // Check Mod: on Mac, Command (metaKey) or Ctrl; on non-Mac, Ctrl
  const hasMeta = e.metaKey
  const hasCtrl = e.ctrlKey
  const hasMod = hasMeta || hasCtrl

  if (wantMod) {
    if (!hasMod) return false
  } else {
    // If not wanting Mod, metaKey must be false
    if (hasMeta) return false
    // If not wanting Ctrl, ctrlKey must be false
    if (!wantCtrl && hasCtrl) return false
  }

  if (wantShift !== e.shiftKey) return false
  if (wantAlt !== e.altKey) return false

  // Check key matching
  const eventKey = e.key.toLowerCase()
  const expectedKey = targetKey.toLowerCase()

  if (expectedKey === 'space') return eventKey === ' ' || eventKey === 'space'
  if (expectedKey === 'esc' || expectedKey === 'escape') return eventKey === 'escape'

  return eventKey === expectedKey
}

export function eventToShortcutString(e: KeyboardEventLike): string | null {
  // If it's only a modifier key, return null so recording waits for the main key
  if (['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) {
    return null
  }

  const parts: string[] = []
  if (e.metaKey || e.ctrlKey) parts.push('Mod')
  if (e.altKey) parts.push('Alt')
  if (e.shiftKey) parts.push('Shift')

  const isFunctionKey = /^F([1-9]|1[0-2])$/i.test(e.key)
  // Require at least one modifier unless it's a function key (F1-F12)
  if (parts.length === 0 && !isFunctionKey) {
    return null
  }

  let key = e.key
  if (key === ' ') key = 'Space'
  else if (key.length === 1) key = key.toUpperCase()

  parts.push(key)
  return parts.join('+')
}

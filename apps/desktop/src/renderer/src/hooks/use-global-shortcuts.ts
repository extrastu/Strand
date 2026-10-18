import { useEffect } from 'react'
import { DEFAULT_SHORTCUTS } from '@shared/types'
import { matchShortcut } from '@/lib/shortcuts'
import { useAppStore } from '@/store/app-store'

/**
 * Handles application-wide global keyboard shortcuts:
 * - Toggle sidebar
 * - Add account
 * - Settings
 * - Switch account by index (Mod+1 ... Mod+9)
 */
export function useGlobalShortcuts() {
  const shortcuts = useAppStore((s) => s.settings.shortcuts ?? DEFAULT_SHORTCUTS)
  const collapsed = useAppStore((s) => s.collapsed)
  const setCollapsed = useAppStore((s) => s.setCollapsed)
  const openDialog = useAppStore((s) => s.openDialog)
  const closeDialog = useAppStore((s) => s.closeDialog)
  const dialog = useAppStore((s) => s.dialog)
  const accounts = useAppStore((s) => s.accounts)
  const activeId = useAppStore((s) => s.activeId)
  const select = useAppStore((s) => s.select)
  const canGoBack = useAppStore((s) => s.canGoBack)
  const canGoForward = useAppStore((s) => s.canGoForward)
  const goBack = useAppStore((s) => s.goBack)
  const goForward = useAppStore((s) => s.goForward)
  const reload = useAppStore((s) => s.reload)
  const setModPressed = useAppStore((s) => s.setModPressed)

  useEffect(() => {
    const isMac =
      typeof navigator !== 'undefined'
        ? /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)
        : true

    function updateModState(e: KeyboardEvent) {
      const isMod = isMac
        ? (e.metaKey || e.key === 'Meta')
        : (e.ctrlKey || e.key === 'Control' || e.metaKey || e.key === 'Meta')
      setModPressed(isMod)
    }

    function handleKeyDown(e: KeyboardEvent) {
      updateModState(e)

      // Toggle Sidebar
      if (shortcuts.toggleSidebar && matchShortcut(e, shortcuts.toggleSidebar)) {
        e.preventDefault()
        void setCollapsed(!collapsed)
        return
      }

      // Add Account
      if (shortcuts.addAccount && matchShortcut(e, shortcuts.addAccount)) {
        e.preventDefault()
        openDialog({ kind: 'add' })
        return
      }

      // Settings
      if (shortcuts.settings && matchShortcut(e, shortcuts.settings)) {
        e.preventDefault()
        openDialog({ kind: 'settings' })
        return
      }

      // Switch Account by index: Mod+1 ... Mod+9
      for (let i = 1; i <= 9; i++) {
        if (matchShortcut(e, `Mod+${i}`)) {
          e.preventDefault()
          const target = accounts[i - 1]
          if (target && target.id !== activeId) {
            if (dialog?.kind === 'edit' || dialog?.kind === 'remove') {
              closeDialog()
            }
            void select(target.id)
          }
          return
        }
      }

      // Back: Mod+[
      if (matchShortcut(e, 'Mod+[')) {
        e.preventDefault()
        if (canGoBack) void goBack()
        return
      }

      // Forward: Mod+]
      if (matchShortcut(e, 'Mod+]')) {
        e.preventDefault()
        if (canGoForward) void goForward()
        return
      }

      // Reload: Mod+R
      if (matchShortcut(e, 'Mod+R')) {
        e.preventDefault()
        void reload()
        return
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === 'Meta' || e.key === 'Control' || e.key === 'OS') {
        setModPressed(false)
        return
      }
      const isMod = isMac ? e.metaKey : (e.ctrlKey || e.metaKey)
      if (!isMod) {
        setModPressed(false)
      }
    }

    function handleBlur() {
      setModPressed(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleBlur)
    document.addEventListener('visibilitychange', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleBlur)
      document.removeEventListener('visibilitychange', handleBlur)
    }
  }, [shortcuts, collapsed, setCollapsed, openDialog, closeDialog, dialog, accounts, activeId, select, canGoBack, canGoForward, goBack, goForward, reload, setModPressed])
}

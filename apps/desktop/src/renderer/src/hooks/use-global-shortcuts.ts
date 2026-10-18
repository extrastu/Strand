import { useEffect } from 'react'
import { DEFAULT_SHORTCUTS } from '@shared/types'
import { matchShortcut } from '@/lib/shortcuts'
import { useAppStore } from '@/store/app-store'

/**
 * Handles application-wide global keyboard shortcuts:
 * - Toggle sidebar
 * - Add account
 * - Settings
 * - Focus sidebar search
 */
export function useGlobalShortcuts() {
  const shortcuts = useAppStore((s) => s.settings.shortcuts ?? DEFAULT_SHORTCUTS)
  const collapsed = useAppStore((s) => s.collapsed)
  const setCollapsed = useAppStore((s) => s.setCollapsed)
  const openDialog = useAppStore((s) => s.openDialog)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
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

      // Search in Sidebar
      if (shortcuts.search && matchShortcut(e, shortcuts.search)) {
        e.preventDefault()
        if (collapsed) {
          void setCollapsed(false).then(() => {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('focus-sidebar-search'))
            }, 60)
          })
        } else {
          window.dispatchEvent(new CustomEvent('focus-sidebar-search'))
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, collapsed, setCollapsed, openDialog])
}

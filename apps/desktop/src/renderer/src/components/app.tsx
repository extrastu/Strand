import { useEffect } from 'react'
import { AccountDialog } from '@/components/account-dialog'
import { EmptyState } from '@/components/empty-state'
import { RemoveAccountDialog } from '@/components/remove-account-dialog'
import { SettingsDialog } from '@/components/settings-dialog'
import { Sidebar } from '@/components/sidebar'
import { TitleBar } from '@/components/title-bar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useGlobalShortcuts } from '@/hooks/use-global-shortcuts'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app-store'

export function App() {
  useGlobalShortcuts()
  const collapsed = useAppStore((s) => s.collapsed)
  const language = useAppStore((s) => s.settings.language)
  const settingsLoaded = useAppStore((s) => s.settingsLoaded)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  // Wait for the saved language: rendering the guessed one first would flash the wrong language.
  if (!settingsLoaded) return null

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-full flex-col">
        <TitleBar />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div
            className={cn(
              'h-full shrink-0 overflow-hidden bg-sidebar transition-[width] duration-200 ease-out',
              !collapsed && 'border-r border-border',
            )}
            style={{ width: collapsed ? 0 : 240 }}
            aria-hidden={collapsed}
          >
            <div
              className="h-full w-[240px] transition-transform duration-200 ease-out"
              style={{ transform: `translateX(${collapsed ? -240 : 0}px)` }}
            >
              <Sidebar />
            </div>
          </div>
          {/* The active account's page is a native view drawn over this area by the main process. */}
          <main className="min-w-0 flex-1">
            <EmptyState />
          </main>
        </div>
      </div>
      <AccountDialog />
      <RemoveAccountDialog />
      <SettingsDialog />
      {/* Toasts sit in the 44px title bar row: everything below it can be covered by the account page. */}
      <Toaster position="top-center" offset={{ top: 4 }} />
    </TooltipProvider>
  )
}

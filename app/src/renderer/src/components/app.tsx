import { AccountDialog } from '@/components/account-dialog'
import { EmptyState } from '@/components/empty-state'
import { RemoveAccountDialog } from '@/components/remove-account-dialog'
import { Sidebar } from '@/components/sidebar'
import { TitleBar } from '@/components/title-bar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAppStore } from '@/store/app-store'

export function App() {
  const collapsed = useAppStore((s) => s.collapsed)

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-full flex-col">
        <TitleBar />
        <div className="flex min-h-0 flex-1">
          {!collapsed && <Sidebar />}
          {/* The active account's page is a native view drawn over this area by the main process. */}
          <main className="min-w-0 flex-1">
            <EmptyState />
          </main>
        </div>
      </div>
      <AccountDialog />
      <RemoveAccountDialog />
      {/* Toasts sit in the 44px title bar row: everything below it can be covered by the account page. */}
      <Toaster position="top-center" offset={{ top: 4 }} />
    </TooltipProvider>
  )
}

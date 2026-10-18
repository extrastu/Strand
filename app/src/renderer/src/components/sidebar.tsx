import { Plus } from 'lucide-react'
import { AccountRow } from '@/components/account-row'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app-store'

/** Account list. Collapsing removes it entirely (see App), so it only has the expanded layout. */
export function Sidebar() {
  const accounts = useAppStore((s) => s.accounts)
  const activeId = useAppStore((s) => s.activeId)
  const openDialog = useAppStore((s) => s.openDialog)

  return (
    <aside aria-label="账号" className="flex h-full w-[240px] shrink-0 flex-col border-r bg-background">
      <h2 className="shrink-0 px-4 pt-3 pb-2 text-[13px] font-semibold text-muted-foreground">账号</h2>

      {/* A plain scroller: Radix ScrollArea widens its content to fit the rows, pushing them out of the sidebar. */}
      <nav className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <ul className="flex flex-col gap-1 px-2 pb-2">
          {accounts.map((account) => (
            <AccountRow key={account.id} account={account} active={account.id === activeId} />
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t p-3">
        <Button className="w-full" onClick={() => openDialog({ kind: 'add' })}>
          <Plus aria-hidden />
          添加账号
        </Button>
      </div>
    </aside>
  )
}

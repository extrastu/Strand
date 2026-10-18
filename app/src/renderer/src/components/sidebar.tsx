import { Plus } from 'lucide-react'
import { AccountRow } from '@/components/account-row'
import { useAppStore } from '@/store/app-store'

/** Account list. Collapsing removes it entirely (see App), so it only has the expanded layout. */
export function Sidebar() {
  const accounts = useAppStore((s) => s.accounts)
  const activeId = useAppStore((s) => s.activeId)
  const openDialog = useAppStore((s) => s.openDialog)

  return (
    <aside aria-label="账号" className="flex h-full w-[240px] shrink-0 flex-col border-r bg-sidebar">
      {/* Like Claude's "New chat": the primary action sits first, as a solid black / white circle with a plus. */}
      <button
        type="button"
        onClick={() => openDialog({ kind: 'add' })}
        className="mx-2 mt-3 flex h-10 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-150 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Plus className="size-3.5" strokeWidth={2.5} aria-hidden />
        </span>
        添加账号
      </button>

      <h2 className="shrink-0 px-5 pt-5 pb-1.5 text-xs font-medium text-muted-foreground">账号</h2>

      {/* A plain scroller: Radix ScrollArea widens its content to fit the rows, pushing them out of the sidebar. */}
      <nav className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <ul className="flex flex-col gap-0.5 px-2 pb-3">
          {accounts.map((account) => (
            <AccountRow key={account.id} account={account} active={account.id === activeId} />
          ))}
        </ul>
      </nav>
    </aside>
  )
}

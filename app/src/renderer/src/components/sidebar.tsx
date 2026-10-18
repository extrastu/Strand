import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Search, Settings, X } from 'lucide-react'
import { AccountRow } from '@/components/account-row'
import { useT } from '@/i18n/use-t'
import { useAppStore } from '@/store/app-store'

/** Account list. Collapsing removes it entirely (see App), so it only has the expanded layout. */
export function Sidebar() {
  const t = useT()
  const accounts = useAppStore((s) => s.accounts)
  const activeId = useAppStore((s) => s.activeId)
  const openDialog = useAppStore((s) => s.openDialog)

  const [query, setQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter accounts by name or type
  const filteredAccounts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return accounts
    return accounts.filter(
      (a) => a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q),
    )
  }, [accounts, query])

  // Global keyboard shortcuts: ⌘N for add account, ⌘, for settings, ⌘F for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey
      if (isCmdOrCtrl && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        openDialog({ kind: 'add' })
      } else if (isCmdOrCtrl && e.key === ',') {
        e.preventDefault()
        openDialog({ kind: 'settings' })
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openDialog])

  const showSearch = accounts.length >= 2 || query.length > 0

  return (
    <aside aria-label={t('sidebar.aria')} className="flex h-full w-[240px] shrink-0 flex-col border-r border-border/80 bg-sidebar select-none">
      {/* Vercel-style Top Action Header */}
      <div className="flex shrink-0 flex-col gap-2 p-2.5 pb-1">
        <button
          type="button"
          onClick={() => openDialog({ kind: 'add' })}
          className="group relative flex h-8.5 w-full cursor-pointer items-center justify-between rounded-lg border border-border/80 bg-background/80 px-2.5 text-xs font-medium text-foreground shadow-2xs transition-all duration-150 hover:border-border hover:bg-accent/80 hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/60 outline-none"
        >
          <span className="flex items-center gap-2">
            <span className="flex size-4.5 items-center justify-center rounded-md bg-foreground text-background transition-transform duration-150 group-hover:scale-105">
              <Plus className="size-3" strokeWidth={2.5} aria-hidden />
            </span>
            <span className="truncate">{t('sidebar.add')}</span>
          </span>
          <kbd className="pointer-events-none inline-flex items-center rounded border border-border/70 bg-muted/60 px-1 py-0.2 font-mono text-[9px] text-muted-foreground">
            ⌘N
          </kbd>
        </button>

        {/* Quick Filter Box */}
        {showSearch && (
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" aria-hidden />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setQuery('')
                  searchInputRef.current?.blur()
                }
              }}
              placeholder={t('sidebar.searchPlaceholder')}
              className="h-8 w-full rounded-lg border border-border/70 bg-muted/30 pr-7 pl-8 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-ring/60 focus:bg-background focus:ring-1 focus:ring-ring/40 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  searchInputRef.current?.focus()
                }}
                className="absolute right-2 flex size-4 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                aria-label={t('sidebar.clearSearch')}
              >
                <X className="size-3" aria-hidden />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Section Header */}
      <div className="flex shrink-0 items-center justify-between px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        <h2>{t('sidebar.heading')}</h2>
        <span className="font-mono text-[10px] text-muted-foreground/80 bg-muted/70 rounded-full px-1.5 py-0.2">
          {query.trim() ? `${filteredAccounts.length}/${accounts.length}` : accounts.length}
        </span>
      </div>

      {/* Account List */}
      <nav className="sidebar-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2 pb-2">
        {accounts.length === 0 ? (
          <div className="mt-3 flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-center">
            <p className="text-xs font-medium text-foreground">{t('sidebar.emptyTitle')}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{t('sidebar.emptyHint')}</p>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-3 py-8 text-center">
            <p className="text-xs text-muted-foreground">{t('sidebar.noResults')}</p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-2 cursor-pointer text-[11px] text-primary underline underline-offset-4 hover:opacity-80"
            >
              {t('sidebar.clearSearch')}
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-1 pt-0.5">
            {filteredAccounts.map((account) => (
              <AccountRow key={account.id} account={account} active={account.id === activeId} />
            ))}
          </ul>
        )}
      </nav>

      {/* Vercel-style Settings Footer */}
      <div className="shrink-0 border-t border-border/70 p-2">
        <button
          type="button"
          onClick={() => openDialog({ kind: 'settings' })}
          className="group flex h-9 w-full cursor-pointer items-center justify-between rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-all duration-150 hover:bg-accent/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 outline-none"
        >
          <span className="flex items-center gap-2.5">
            <Settings className="size-4 shrink-0 transition-transform duration-200 group-hover:rotate-45" aria-hidden />
            <span>{t('sidebar.settings')}</span>
          </span>
          <kbd className="pointer-events-none inline-flex items-center rounded border border-border/60 bg-muted/40 px-1 py-0.2 font-mono text-[9px] text-muted-foreground/70">
            ⌘,
          </kbd>
        </button>
      </div>
    </aside>
  )
}

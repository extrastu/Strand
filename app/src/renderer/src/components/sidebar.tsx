import {
  Check,
  ChevronsUpDown,
  Copy,
  Pencil,
  Plus,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import { DEFAULT_SHORTCUTS } from '@shared/types'
import { AccountAvatar } from '@/components/account-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useT } from '@/i18n/use-t'
import { TYPE_LABEL_KEY } from '@/lib/labels'
import { formatShortcutForDisplay } from '@/lib/shortcuts'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app-store'

export function Sidebar() {
  const t = useT()
  const accounts = useAppStore((s) => s.accounts)
  const activeId = useAppStore((s) => s.activeId)
  const active = accounts.find((a) => a.id === activeId)
  const select = useAppStore((s) => s.select)
  const copyName = useAppStore((s) => s.copyName)
  const openDialog = useAppStore((s) => s.openDialog)
  const shortcuts = useAppStore((s) => s.settings.shortcuts ?? DEFAULT_SHORTCUTS)

  return (
    <aside
      aria-label={t('sidebar.aria')}
      className="flex h-full w-[240px] shrink-0 flex-col bg-sidebar select-none text-foreground"
    >
      {/* Top Active Account Profile Card with Switcher Dropdown */}
      <div className="pt-2 px-2 pb-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="group flex w-full cursor-pointer items-center justify-between rounded-xl p-2 text-left transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-ring/60 outline-none"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                {active ? (
                  <AccountAvatar account={active} className="size-8.5" />
                ) : (
                  <div className="flex size-8.5 shrink-0 items-center justify-center rounded-lg bg-card border border-border/80 text-xs font-semibold shadow-2xs">
                    S
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xs font-semibold leading-tight text-foreground">
                    {active ? active.name : t('sidebar.noActiveAccount')}
                  </h2>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {active ? `${t(TYPE_LABEL_KEY[active.type])} · Threads` : 'Strand for macOS'}
                  </p>
                </div>
              </div>
              <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-xl p-1.5 shadow-pop">
            {/* Accounts List for Switching */}
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              {t('sidebar.heading')}
            </div>
            {accounts.map((acc) => {
              const isSelected = acc.id === activeId
              return (
                <DropdownMenuItem
                  key={acc.id}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs cursor-pointer',
                    isSelected && 'bg-accent font-semibold text-foreground',
                  )}
                  onSelect={() => void select(acc.id)}
                >
                  <AccountAvatar account={acc} className="size-5.5" />
                  <span className="truncate flex-1">{acc.name}</span>
                  <span className="text-[10px] text-muted-foreground/70 font-mono uppercase">
                    {t(TYPE_LABEL_KEY[acc.type])}
                  </span>
                  {isSelected && <Check className="size-3.5 text-foreground shrink-0" />}
                </DropdownMenuItem>
              )
            })}

            <DropdownMenuSeparator className="my-1" />

            {/* Single Add Account Entry Point */}
            <DropdownMenuItem
              className="gap-2 rounded-lg px-2 py-1.5 text-xs cursor-pointer"
              onSelect={() => openDialog({ kind: 'add' })}
            >
              <Plus className="size-3.5 text-muted-foreground" />
              <span className="flex-1">{t('sidebar.add')}</span>
              {shortcuts.addAccount && (
                <kbd className="font-mono text-[9px] text-muted-foreground">
                  {formatShortcutForDisplay(shortcuts.addAccount)}
                </kbd>
              )}
            </DropdownMenuItem>

            {/* Active Account Actions */}
            {active && (
              <>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  className="gap-2 rounded-lg px-2 py-1.5 text-xs cursor-pointer"
                  onSelect={() => void copyName(active.id)}
                >
                  <Copy className="size-3.5 text-muted-foreground" />
                  <span>{t('row.copyName')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 rounded-lg px-2 py-1.5 text-xs cursor-pointer"
                  onSelect={() => openDialog({ kind: 'edit', id: active.id })}
                >
                  <Pencil className="size-3.5 text-muted-foreground" />
                  <span>{t('row.edit')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  className="gap-2 rounded-lg px-2 py-1.5 text-xs cursor-pointer"
                  onSelect={() => openDialog({ kind: 'remove', id: active.id })}
                >
                  <Trash2 className="size-3.5" />
                  <span>{t('row.delete')}</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-2">
        {accounts.length === 0 && (
          <div className="mt-3 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 p-4 text-center">
            <p className="text-xs font-medium text-foreground">{t('sidebar.emptyTitle')}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{t('sidebar.emptyHint')}</p>
          </div>
        )}
      </div>

      {/* Bottom Settings Button */}
      <div className="mt-auto shrink-0 border-t border-border/60 p-2">
        <button
          type="button"
          onClick={() => openDialog({ kind: 'settings' })}
          className="flex h-8.5 w-full cursor-pointer items-center justify-between rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-ring/60 outline-none"
        >
          <span className="flex items-center gap-2.5">
            <SlidersHorizontal className="size-3.5" aria-hidden />
            <span>{t('sidebar.settings')}</span>
          </span>
          {shortcuts.settings && (
            <kbd className="pointer-events-none inline-flex items-center font-mono text-[10px] text-muted-foreground/70">
              {formatShortcutForDisplay(shortcuts.settings)}
            </kbd>
          )}
        </button>
      </div>
    </aside>
  )
}

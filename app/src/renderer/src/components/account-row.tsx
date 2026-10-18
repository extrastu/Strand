import { Check, Copy, Ellipsis, Pencil, Trash2 } from 'lucide-react'
import type { Account } from '@shared/types'
import { AccountAvatar } from '@/components/account-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useT } from '@/i18n/use-t'
import { TYPE_LABEL_KEY } from '@/lib/labels'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app-store'

export function AccountRow({ account, active }: { account: Account; active: boolean }) {
  const t = useT()
  const select = useAppStore((s) => s.select)
  const copyName = useAppStore((s) => s.copyName)
  const openDialog = useAppStore((s) => s.openDialog)

  return (
    <li
      className={cn(
        'group relative flex items-center rounded-lg mx-2 transition-all duration-150',
        'has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-ring/60',
        active
          ? 'bg-selected text-foreground font-medium shadow-2xs'
          : 'text-foreground/80 hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.04]',
      )}
    >
      <button
        type="button"
        aria-current={active ? 'true' : undefined}
        onClick={() => void select(account.id)}
        className="flex h-8.5 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg px-2 text-left outline-none"
      >
        <span className="relative shrink-0">
          <AccountAvatar account={account} />
          {active && (
            <span className="absolute -right-0.5 -bottom-0.5 flex size-2.5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-1.5 ring-background">
              <Check className="size-1.5" strokeWidth={3.5} aria-hidden />
            </span>
          )}
        </span>
        <span className="flex min-w-0 flex-1 items-center justify-between gap-1.5">
          <span
            className={cn(
              'block truncate text-xs',
              active ? 'font-semibold text-foreground' : 'font-medium text-foreground/85',
            )}
          >
            {account.name}
          </span>
          <span
            className={cn(
              'inline-flex shrink-0 items-center rounded border px-1 py-0.2 text-[9px] font-mono font-medium uppercase tracking-wider leading-none',
              account.type === 'creator'
                ? 'border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20'
                : 'border-border/70 bg-card/60 text-muted-foreground',
            )}
          >
            {t(TYPE_LABEL_KEY[account.type])}
          </span>
        </span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('row.more', { name: account.name })}
            className="absolute top-1/2 right-1.5 -translate-y-1/2 size-6 rounded-md text-muted-foreground opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/60 data-[state=open]:bg-muted data-[state=open]:opacity-100"
          >
            <Ellipsis className="size-3.5" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 rounded-lg p-1">
          <DropdownMenuItem className="gap-2 rounded-md px-2 py-1.5 text-xs" onSelect={() => void copyName(account.id)}>
            <Copy className="size-3.5 text-muted-foreground" aria-hidden />
            {t('row.copyName')}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 rounded-md px-2 py-1.5 text-xs"
            onSelect={() => openDialog({ kind: 'edit', id: account.id })}
          >
            <Pencil className="size-3.5 text-muted-foreground" aria-hidden />
            {t('row.edit')}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            variant="destructive"
            className="gap-2 rounded-md px-2 py-1.5 text-xs"
            onSelect={() => openDialog({ kind: 'remove', id: account.id })}
          >
            <Trash2 className="size-3.5" aria-hidden />
            {t('row.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

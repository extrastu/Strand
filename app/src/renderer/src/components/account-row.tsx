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
        'group relative flex items-center rounded-xl transition-colors duration-150',
        'has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-inset has-[button:focus-visible]:ring-ring/60',
        active ? 'bg-selected' : 'hover:bg-accent',
      )}
    >
      <button
        type="button"
        aria-current={active ? 'true' : undefined}
        onClick={() => void select(account.id)}
        className="flex h-[52px] min-w-0 flex-1 items-center gap-3 rounded-xl px-3 text-left outline-none"
      >
        <span className="relative shrink-0">
          <AccountAvatar account={account} />
          {active && (
            <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-foreground text-background ring-2 ring-selected">
              <Check className="size-2.5" strokeWidth={3} aria-hidden />
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm leading-5 font-medium">{account.name}</span>
          <Badge variant="secondary" className="mt-0.5 h-[18px] rounded-full bg-foreground/[0.07] px-1.5 text-[11px] font-normal text-foreground/70">
            {t(TYPE_LABEL_KEY[account.type])}
          </Badge>
        </span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('row.more', { name: account.name })}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-inherit text-muted-foreground opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-foreground/10 hover:text-foreground focus-visible:ring-0 data-[state=open]:bg-foreground/10 data-[state=open]:opacity-100"
          >
            <Ellipsis aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={() => void copyName(account.id)}>
            <Copy aria-hidden />
            {t('row.copyName')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => openDialog({ kind: 'edit', id: account.id })}>
            <Pencil aria-hidden />
            {t('row.edit')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => openDialog({ kind: 'remove', id: account.id })}>
            <Trash2 aria-hidden />
            {t('row.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

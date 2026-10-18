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
import { TYPE_LABEL } from '@/lib/labels'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app-store'

export function AccountRow({ account, active }: { account: Account; active: boolean }) {
  const select = useAppStore((s) => s.select)
  const copyName = useAppStore((s) => s.copyName)
  const openDialog = useAppStore((s) => s.openDialog)

  return (
    <li
      className={cn(
        'group relative flex items-center rounded-xl transition-colors duration-150 hover:bg-accent',
        'has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-inset has-[button:focus-visible]:ring-ring/70',
        active && 'bg-accent',
      )}
    >
      <button
        type="button"
        aria-current={active ? 'true' : undefined}
        onClick={() => void select(account.id)}
        className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-xl px-3 text-left outline-none"
      >
        <span className="relative shrink-0">
          <AccountAvatar account={account} />
          {active && (
            <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-accent">
              <Check className="size-2.5" strokeWidth={3} aria-hidden />
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{account.name}</span>
          <Badge variant="secondary" className="mt-0.5 h-5 rounded-full bg-foreground/[0.07] px-2 text-xs font-normal text-foreground/70">
            {TYPE_LABEL[account.type]}
          </Badge>
        </span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`更多操作:${account.name}`}
            className="absolute top-1/2 right-1 -translate-y-1/2 bg-accent opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-secondary focus-visible:ring-0 data-[state=open]:opacity-100"
          >
            <Ellipsis aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={() => void copyName(account.id)}>
            <Copy aria-hidden />
            复制账号名称
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => openDialog({ kind: 'edit', id: account.id })}>
            <Pencil aria-hidden />
            编辑
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => openDialog({ kind: 'remove', id: account.id })}>
            <Trash2 aria-hidden />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

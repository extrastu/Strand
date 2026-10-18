import type { Account } from '@shared/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initialOf } from '@/lib/labels'
import { cn } from '@/lib/utils'

/** Creator accounts get the solid squircle, personal accounts get the quiet bordered neutral style. */
export function AccountAvatar({ account, className }: { account: Account; className?: string }) {
  return (
    <Avatar className={cn('size-6.5 shrink-0 rounded-lg ring-1 ring-border/80 after:hidden', className)}>
      <AvatarFallback
        className={cn(
          'font-mono text-[11px] font-semibold select-none rounded-lg',
          account.type === 'creator'
            ? 'bg-primary text-primary-foreground'
            : 'bg-card text-foreground/85 border border-border/60 shadow-2xs',
        )}
      >
        {initialOf(account.name)}
      </AvatarFallback>
    </Avatar>
  )
}

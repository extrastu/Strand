import type { Account } from '@shared/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initialOf } from '@/lib/labels'
import { cn } from '@/lib/utils'

/** Creator accounts get the solid circle, personal accounts get the quiet bordered neutral style. */
export function AccountAvatar({ account, className }: { account: Account; className?: string }) {
  return (
    <Avatar className={cn('size-7 shrink-0 rounded-full ring-1 ring-border/80 after:hidden', className)}>
      <AvatarFallback
        className={cn(
          'font-mono text-xs font-medium select-none',
          account.type === 'creator'
            ? 'bg-primary text-primary-foreground font-semibold'
            : 'bg-muted/80 text-foreground/80 border border-border/40',
        )}
      >
        {initialOf(account.name)}
      </AvatarFallback>
    </Avatar>
  )
}

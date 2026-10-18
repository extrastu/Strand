import type { Account } from '@shared/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initialOf } from '@/lib/labels'
import { cn } from '@/lib/utils'

/** Creator accounts get the solid (black / white) circle, personal accounts the quiet grey one. */
export function AccountAvatar({ account, className }: { account: Account; className?: string }) {
  return (
    <Avatar className={cn('size-9', className)}>
      <AvatarFallback
        className={cn(
          'text-[15px] font-semibold',
          account.type === 'creator' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground',
        )}
      >
        {initialOf(account.name)}
      </AvatarFallback>
    </Avatar>
  )
}

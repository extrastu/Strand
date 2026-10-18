import { Plus, UsersRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app-store'

export function EmptyState() {
  const ready = useAppStore((s) => s.ready)
  const empty = useAppStore((s) => s.accounts.length === 0)
  const openDialog = useAppStore((s) => s.openDialog)
  if (!ready || !empty) return null

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
        <UsersRound className="size-6 text-primary" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-serif text-2xl">还没有账号</h1>
        <p className="max-w-xs text-balance text-sm text-muted-foreground">添加账号后,在右侧用 Threads 账号登录。个人号和创作者号互不干扰。</p>
      </div>
      <Button onClick={() => openDialog({ kind: 'add' })}>
        <Plus aria-hidden />
        添加账号
      </Button>
    </div>
  )
}

import { PanelLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useWindowDrag } from '@/hooks/use-window-drag'
import { TYPE_LABEL } from '@/lib/labels'
import { useAppStore } from '@/store/app-store'

/**
 * 44px row across the whole window, like a macOS title bar: traffic lights, the sidebar toggle right
 * after them, the active account centered. Drags the window. Everything below it can be covered by
 * the account page, so nothing that must stay visible lives below this row's edge.
 */
export function TitleBar() {
  const active = useAppStore((s) => s.accounts.find((a) => a.id === s.activeId))
  const collapsed = useAppStore((s) => s.collapsed)
  const setCollapsed = useAppStore((s) => s.setCollapsed)
  const onDrag = useWindowDrag()
  const label = collapsed ? '显示侧边栏' : '隐藏侧边栏'

  return (
    <header
      onPointerDown={onDrag}
      className="grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b bg-background pr-4 pl-[76px]"
    >
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={label}
              aria-expanded={!collapsed}
              className="text-muted-foreground hover:text-foreground aria-expanded:bg-transparent aria-expanded:hover:bg-accent"
              onClick={() => void setCollapsed(!collapsed)}
            >
              <PanelLeft aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </div>
      {active ? (
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium">{active.name}</span>
          <Badge variant="secondary" className="h-[18px] shrink-0 rounded-full bg-foreground/[0.07] px-1.5 text-[11px] font-normal text-foreground/70">
            {TYPE_LABEL[active.type]}
          </Badge>
        </div>
      ) : (
        <div />
      )}
      <div />
    </header>
  )
}

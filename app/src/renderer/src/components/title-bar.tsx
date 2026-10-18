import { PanelLeft } from 'lucide-react'
import { DEFAULT_SHORTCUTS } from '@shared/types'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useWindowDrag } from '@/hooks/use-window-drag'
import { useT } from '@/i18n/use-t'
import { TYPE_LABEL_KEY } from '@/lib/labels'
import { formatShortcutForDisplay } from '@/lib/shortcuts'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app-store'

/**
 * 44px row across the whole window, like a macOS title bar: traffic lights, the sidebar toggle,
 * and the active account. Drags the window. Everything below it can be covered by
 * the account page, so nothing that must stay visible lives below this row's edge.
 */
export function TitleBar() {
  const t = useT()
  const active = useAppStore((s) => s.accounts.find((a) => a.id === s.activeId))
  const collapsed = useAppStore((s) => s.collapsed)
  const setCollapsed = useAppStore((s) => s.setCollapsed)
  const shortcuts = useAppStore((s) => s.settings.shortcuts ?? DEFAULT_SHORTCUTS)
  const onDrag = useWindowDrag()
  const baseLabel = collapsed ? t('titlebar.showSidebar') : t('titlebar.hideSidebar')
  const shortcutHint = shortcuts.toggleSidebar ? ` (${formatShortcutForDisplay(shortcuts.toggleSidebar)})` : ''
  const label = baseLabel + shortcutHint

  return (
    <header
      onPointerDown={onDrag}
      className="relative h-11 shrink-0 flex items-center select-none bg-background overflow-hidden"
    >
      {/* Sidebar top background strip: animates width from 240px to 0px */}
      <div
        className={cn(
          'h-full shrink-0 overflow-hidden bg-sidebar transition-[width] duration-200 ease-out',
          !collapsed && 'border-r border-border',
        )}
        style={{ width: collapsed ? 0 : 240 }}
      />

      {/* Floating Toggle Button: glides smoothly between x=204px and x=76px */}
      <div
        className="absolute top-2 z-10 transition-transform duration-200 ease-out"
        style={{
          left: 76,
          transform: `translateX(${collapsed ? 0 : 128}px)`,
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={label}
              aria-expanded={!collapsed}
              className="size-7 rounded-md text-muted-foreground hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]"
              onClick={() => void setCollapsed(!collapsed)}
            >
              <PanelLeft className="size-4" aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </div>

      {/* Right Content Header: border-b only on main content area, with animated left padding */}
      <div
        className="flex h-full flex-1 items-center justify-between border-b border-border pr-4 transition-[padding-left] duration-200 ease-out"
        style={{ paddingLeft: collapsed ? 116 : 16 }}
      >
        {active ? (
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-medium text-foreground">{active.name}</span>
            <span className="rounded border border-border/80 bg-muted/60 px-1.5 py-0.2 text-[10px] font-mono font-medium text-muted-foreground uppercase">
              {t(TYPE_LABEL_KEY[active.type])}
            </span>
          </div>
        ) : (
          <div />
        )}
      </div>
    </header>
  )
}

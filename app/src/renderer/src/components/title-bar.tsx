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
      className={cn(
        'h-11 shrink-0 flex items-center select-none border-b border-border bg-background',
        collapsed && 'pl-[76px] pr-4 justify-between',
      )}
    >
      {!collapsed ? (
        <>
          {/* Header row directly above sidebar: shares bg-sidebar and right border, holding traffic lights and toggle */}
          <div className="flex h-full w-[240px] shrink-0 items-center justify-between border-r border-border bg-sidebar pl-[76px] pr-2">
            <div />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={label}
                  aria-expanded={true}
                  className="size-7 rounded-md text-muted-foreground hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]"
                  onClick={() => void setCollapsed(true)}
                >
                  <PanelLeft className="size-4" aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          </div>

          {/* Header row above active page */}
          <div className="flex flex-1 items-center justify-between px-4">
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
        </>
      ) : (
        <div className="flex flex-1 items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={label}
                aria-expanded={false}
                className="size-7 rounded-md text-muted-foreground hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]"
                onClick={() => void setCollapsed(false)}
              >
                <PanelLeft className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
          {active && (
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium text-foreground">{active.name}</span>
              <span className="rounded border border-border/80 bg-muted/60 px-1.5 py-0.2 text-[10px] font-mono font-medium text-muted-foreground uppercase">
                {t(TYPE_LABEL_KEY[active.type])}
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

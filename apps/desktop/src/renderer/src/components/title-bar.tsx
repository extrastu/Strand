import { ChevronLeft, ChevronRight, PanelLeft, RotateCw } from 'lucide-react'
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
 * 44px row across the whole window, like a macOS title bar: traffic lights, navigation controls
 * (back, forward, refresh), the sidebar toggle, and the active account. Drags the window.
 * Everything below it can be covered by the account page, so nothing that must stay visible lives below this row's edge.
 */
export function TitleBar() {
  const t = useT()
  const active = useAppStore((s) => s.accounts.find((a) => a.id === s.activeId))
  const collapsed = useAppStore((s) => s.collapsed)
  const setCollapsed = useAppStore((s) => s.setCollapsed)
  const canGoBack = useAppStore((s) => s.canGoBack)
  const canGoForward = useAppStore((s) => s.canGoForward)
  const goBack = useAppStore((s) => s.goBack)
  const goForward = useAppStore((s) => s.goForward)
  const reload = useAppStore((s) => s.reload)
  const shortcuts = useAppStore((s) => s.settings.shortcuts ?? DEFAULT_SHORTCUTS)
  const isModPressed = useAppStore((s) => s.isModPressed)
  const onDrag = useWindowDrag()
  const baseLabel = collapsed ? t('titlebar.showSidebar') : t('titlebar.hideSidebar')
  const shortcutHint = shortcuts.toggleSidebar && isModPressed ? ` (${formatShortcutForDisplay(shortcuts.toggleSidebar)})` : ''
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

      {/* Navigation & Controls Toolbar: traffic lights are at x=16..70, toolbar starts at x=76 */}
      <div className="absolute top-2 left-[76px] z-10 flex items-center gap-1">
        {/* Navigation Buttons: Back, Forward, Reload */}
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('titlebar.back')}
                disabled={!canGoBack || !active}
                className="size-7 rounded-md text-muted-foreground hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08] disabled:opacity-30 disabled:pointer-events-none"
                onClick={() => void goBack()}
              >
                <ChevronLeft className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isModPressed ? `${t('titlebar.back')} (${formatShortcutForDisplay('Mod+[')})` : t('titlebar.back')}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('titlebar.forward')}
                disabled={!canGoForward || !active}
                className="size-7 rounded-md text-muted-foreground hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08] disabled:opacity-30 disabled:pointer-events-none"
                onClick={() => void goForward()}
              >
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isModPressed ? `${t('titlebar.forward')} (${formatShortcutForDisplay('Mod+]')})` : t('titlebar.forward')}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('titlebar.reload')}
                disabled={!active}
                className="size-7 rounded-md text-muted-foreground hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08] disabled:opacity-30 disabled:pointer-events-none"
                onClick={() => void reload()}
              >
                <RotateCw className="size-3.5" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isModPressed ? `${t('titlebar.reload')} (${formatShortcutForDisplay('Mod+R')})` : t('titlebar.reload')}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Floating Sidebar Toggle Button: glides smoothly between docking at x=172px (collapsed) and pinning at x=204px (expanded) */}
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `translateX(${collapsed ? 4 : 36}px)`,
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
            <TooltipContent side="bottom">{label}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Right Content Header: border-b only on main content area, with animated left padding */}
      <div
        className="flex h-full flex-1 items-center justify-between border-b border-border pr-4 transition-[padding-left] duration-200 ease-out"
        style={{ paddingLeft: collapsed ? 220 : 16 }}
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

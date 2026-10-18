import {
  AlertCircle,
  AtSign,
  CheckCircle2,
  Download,
  ExternalLink,
  Info,
  Keyboard,
  Loader2,
  Monitor,
  Moon,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Sun,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { toast } from 'sonner'
import { DEFAULT_SHORTCUTS, LANGUAGES, SHORTCUT_ACTIONS, THEMES } from '@shared/types'
import type { Language, ShortcutAction, ThemeSetting } from '@shared/types'
import iconUrl from '@build/icon.png'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { LANGUAGE_NAMES } from '@/i18n/languages'
import type { MessageKey } from '@/i18n'
import { useT } from '@/i18n/use-t'
import { eventToShortcutString, formatShortcutForDisplay } from '@/lib/shortcuts'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app-store'

type Section = 'general' | 'shortcuts' | 'about'

const SECTIONS: { id: Section; icon: LucideIcon; label: MessageKey }[] = [
  { id: 'general', icon: SlidersHorizontal, label: 'settings.general' },
  { id: 'shortcuts', icon: Keyboard, label: 'settings.shortcuts' },
  { id: 'about', icon: Info, label: 'settings.about' },
]

const THEME_ICON: Record<ThemeSetting, LucideIcon> = { system: Monitor, light: Sun, dark: Moon }
const THEME_KEY: Record<ThemeSetting, MessageKey> = {
  system: 'settings.theme.system',
  light: 'settings.theme.light',
  dark: 'settings.theme.dark',
}

const SHORTCUT_ITEMS: { action: ShortcutAction; title: MessageKey; desc: MessageKey }[] = [
  { action: 'toggleSidebar', title: 'shortcuts.toggleSidebar', desc: 'shortcuts.toggleSidebarDesc' },
  { action: 'addAccount', title: 'shortcuts.addAccount', desc: 'shortcuts.addAccountDesc' },
  { action: 'settings', title: 'shortcuts.settings', desc: 'shortcuts.settingsDesc' },
]

export function SettingsDialog() {
  const open = useAppStore((s) => s.dialog?.kind === 'settings')
  const closeDialog = useAppStore((s) => s.closeDialog)

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeDialog()}>
      <DialogContent className="h-[80vh] w-[80vw] max-w-[80vw] sm:max-w-[80vw] gap-0 overflow-hidden rounded-2xl p-0 shadow-[var(--shadow-pop)]">
        {open && <SettingsBody />}
      </DialogContent>
    </Dialog>
  )
}

function SettingsBody() {
  const t = useT()
  const [section, setSection] = useState<Section>('general')
  const tabs = useRef<Record<Section, HTMLButtonElement | null>>({
    general: null,
    shortcuts: null,
    about: null,
  })

  // Up / Down move through the section list (roving tabindex), as in a vertical tab list.
  function onKeyDown(event: KeyboardEvent) {
    const index = SECTIONS.findIndex((s) => s.id === section)
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
    if (step === 0) return
    event.preventDefault()
    const target = SECTIONS[(index + step + SECTIONS.length) % SECTIONS.length]
    if (!target) return
    setSection(target.id)
    tabs.current[target.id]?.focus()
  }

  return (
    <div className="grid h-full grid-cols-[200px_1fr]">
      <div className="flex flex-col gap-3 border-r p-5">
        <DialogTitle className="px-2.5 pt-1 font-serif text-xl font-normal">{t('settings.title')}</DialogTitle>
        <DialogDescription className="sr-only">{t('settings.description')}</DialogDescription>
        <div role="tablist" aria-orientation="vertical" aria-label={t('settings.nav')} onKeyDown={onKeyDown} className="flex flex-col gap-0.5">
          {SECTIONS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              ref={(el) => {
                tabs.current[id] = el
              }}
              type="button"
              role="tab"
              id={`settings-tab-${id}`}
              aria-selected={section === id}
              aria-controls="settings-panel"
              tabIndex={section === id ? 0 : -1}
              onClick={() => setSection(id)}
              className={cn(
                'flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors duration-150 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/60',
                section === id && 'bg-selected font-medium',
              )}
            >
              <Icon className="size-4" aria-hidden />
              {t(label)}
            </button>
          ))}
        </div>
      </div>
      <div role="tabpanel" id="settings-panel" aria-labelledby={`settings-tab-${section}`} className="overflow-y-auto p-8">
        {section === 'general' ? (
          <GeneralPanel />
        ) : section === 'shortcuts' ? (
          <ShortcutsPanel />
        ) : (
          <AboutPanel />
        )}
      </div>
    </div>
  )
}

function GeneralPanel() {
  const t = useT()
  const theme = useAppStore((s) => s.settings.theme)
  const language = useAppStore((s) => s.settings.language)
  const autoCheckUpdates = useAppStore((s) => s.settings.autoCheckUpdates !== false)
  const updateSettings = useAppStore((s) => s.updateSettings)

  return (
    <div className="grid gap-7">
      <section className="grid gap-3">
        <div>
          <h3 className="text-sm font-medium">{t('settings.theme.label')}</h3>
          <p className="text-xs text-muted-foreground">{t('settings.theme.description')}</p>
        </div>
        <RadioGroup
          value={theme}
          onValueChange={(value) => void updateSettings({ theme: value as ThemeSetting })}
          aria-label={t('settings.theme.label')}
          className="grid-cols-3"
        >
          {THEMES.map((value) => {
            const Icon = THEME_ICON[value]
            return (
              <Label
                key={value}
                htmlFor={`theme-${value}`}
                className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors duration-150 hover:bg-accent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/60 has-[[aria-checked=true]]:border-foreground has-[[aria-checked=true]]:bg-accent"
              >
                <RadioGroupItem value={value} id={`theme-${value}`} className="pointer-events-none absolute size-0 opacity-0" />
                <Icon className="size-5" aria-hidden />
                {t(THEME_KEY[value])}
              </Label>
            )
          })}
        </RadioGroup>
      </section>

      <section className="grid gap-3">
        <div>
          <h3 className="text-sm font-medium">{t('settings.language.label')}</h3>
          <p className="text-xs text-muted-foreground">{t('settings.language.description')}</p>
        </div>
        <Select value={language} onValueChange={(value) => void updateSettings({ language: value as Language })}>
          <SelectTrigger aria-label={t('settings.language.label')} className="h-10 w-52 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((value) => (
              <SelectItem key={value} value={value}>
                {LANGUAGE_NAMES[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="flex items-center justify-between rounded-xl border border-border/70 p-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium">{t('settings.autoCheckUpdates.label')}</h3>
          <p className="text-xs text-muted-foreground">{t('settings.autoCheckUpdates.description')}</p>
        </div>
        <Switch
          checked={autoCheckUpdates}
          onCheckedChange={(checked) => void updateSettings({ autoCheckUpdates: checked })}
          aria-label={t('settings.autoCheckUpdates.label')}
        />
      </section>
    </div>
  )
}

function ShortcutsPanel() {
  const t = useT()
  const shortcuts = useAppStore((s) => s.settings.shortcuts ?? DEFAULT_SHORTCUTS)
  const updateSettings = useAppStore((s) => s.updateSettings)
  const [recordingAction, setRecordingAction] = useState<ShortcutAction | null>(null)

  const hasCustom = SHORTCUT_ACTIONS.some(
    (act) => (shortcuts[act] ?? DEFAULT_SHORTCUTS[act]) !== DEFAULT_SHORTCUTS[act],
  )

  useEffect(() => {
    const currentAction = recordingAction
    if (!currentAction) return

    function onKeyDown(e: globalThis.KeyboardEvent) {
      e.preventDefault()
      e.stopPropagation()

      if (e.key === 'Escape') {
        setRecordingAction(null)
        return
      }

      const newShortcut = eventToShortcutString(e)
      if (!newShortcut) return

      const conflictingAction = SHORTCUT_ACTIONS.find(
        (act) =>
          act !== currentAction &&
          (shortcuts[act] ?? DEFAULT_SHORTCUTS[act]) === newShortcut,
      )

      if (conflictingAction || /^Mod\+[1-9]$/i.test(newShortcut)) {
        toast.error(t('settings.shortcuts.conflict'))
        return
      }

      void updateSettings({
        shortcuts: {
          ...shortcuts,
          [currentAction as string]: newShortcut,
        },
      })
      toast.success(t('toast.shortcutUpdated'))
      setRecordingAction(null)
    }

    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [recordingAction, shortcuts, updateSettings, t])

  const resetShortcut = (action: ShortcutAction) => {
    void updateSettings({
      shortcuts: {
        ...shortcuts,
        [action]: DEFAULT_SHORTCUTS[action],
      },
    })
    toast.success(t('toast.shortcutUpdated'))
  }

  const resetAllShortcuts = () => {
    void updateSettings({
      shortcuts: { ...DEFAULT_SHORTCUTS },
    })
    toast.success(t('toast.shortcutUpdated'))
  }

  return (
    <div className="grid gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium">{t('settings.shortcuts.label')}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('settings.shortcuts.description')}</p>
        </div>
        {hasCustom && (
          <Button
            variant="outline"
            size="xs"
            onClick={resetAllShortcuts}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3" aria-hidden />
            {t('settings.shortcuts.resetAll')}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {SHORTCUT_ITEMS.map(({ action, title, desc }) => {
          const isRecording = recordingAction === action
          const currentShortcut = shortcuts[action] ?? DEFAULT_SHORTCUTS[action]
          const isCustom = currentShortcut !== DEFAULT_SHORTCUTS[action]

          return (
            <div
              key={action}
              className="flex items-center justify-between rounded-xl border border-border/70 p-3 transition-colors hover:bg-muted/20"
            >
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">{t(title)}</h4>
                <p className="text-xs text-muted-foreground">{t(desc)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRecordingAction(isRecording ? null : action)}
                  className={cn(
                    'flex h-7 min-w-16 cursor-pointer items-center justify-center rounded-md border px-2.5 font-mono text-xs font-medium transition-all outline-none',
                    isRecording
                      ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/40 animate-pulse'
                      : 'border-border/80 bg-muted/60 text-foreground hover:border-border hover:bg-accent',
                  )}
                >
                  {isRecording ? t('settings.shortcuts.recording') : formatShortcutForDisplay(currentShortcut)}
                </button>
                {isCustom && !isRecording && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('shortcuts.reset')}
                    onClick={() => resetShortcut(action)}
                    className="size-7 rounded-md text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="size-3.5" aria-hidden />
                  </Button>
                )}
              </div>
            </div>
          )
        })}

        <div className="flex items-center justify-between rounded-xl border border-border/70 p-3 transition-colors hover:bg-muted/20">
          <div className="space-y-0.5">
            <h4 className="text-sm font-medium">{t('shortcuts.switchAccount')}</h4>
            <p className="text-xs text-muted-foreground">{t('shortcuts.switchAccountDesc')}</p>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <kbd className="inline-flex h-7 items-center justify-center rounded-md border border-border/80 bg-muted/60 px-2.5 font-medium text-foreground">
              {formatShortcutForDisplay('Mod+1')} ... {formatShortcutForDisplay('Mod+9')}
            </kbd>
          </div>
        </div>
      </div>

      {recordingAction && (
        <p className="text-xs text-muted-foreground/80">{t('settings.shortcuts.recordingHint')}</p>
      )}
    </div>
  )
}

function AboutPanel() {
  const t = useT()
  const about = useAppStore((s) => s.about)
  const loadAbout = useAppStore((s) => s.loadAbout)

  useEffect(() => {
    void loadAbout()
  }, [loadAbout])

  const openAuthorThreads = () => {
    const url = 'https://www.threads.com/@thre.addrop'
    if (window.threads?.openExternal) {
      void window.threads.openExternal(url)
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center max-w-sm mx-auto">
      <img src={iconUrl} alt={t('about.iconAlt')} width={80} height={80} className="rounded-2xl shadow-sm" />
      <div>
        <h3 className="font-serif text-2xl">{about?.name ?? 'Strand'}</h3>
        {about && <p className="text-sm text-muted-foreground">{t('about.version', { version: about.version })}</p>}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{t('about.description')}</p>

      <UpdateSection />

      <div className="pt-1">
        <Button
          variant="outline"
          onClick={openAuthorThreads}
          className="gap-2 rounded-full px-5 py-2 font-medium text-xs hover:border-foreground/30 hover:bg-accent transition-colors"
        >
          <AtSign className="size-3.5 text-muted-foreground" aria-hidden />
          <span>{t('about.followAuthor')}</span>
          <ExternalLink className="size-3 text-muted-foreground" aria-hidden />
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 w-full space-y-1">
        {about ? (
          <p className="text-xs text-muted-foreground">{t('about.runtime', { electron: about.electron, chromium: about.chromium })}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{t('about.unavailable')}</p>
        )}
        <p className="text-xs text-muted-foreground/80">{t('about.notice')}</p>
      </div>
    </div>
  )
}

function UpdateSection() {
  const t = useT()
  const updateState = useAppStore((s) => s.updateState)
  const checkForUpdates = useAppStore((s) => s.checkForUpdates)
  const downloadUpdate = useAppStore((s) => s.downloadUpdate)
  const installUpdate = useAppStore((s) => s.installUpdate)
  const openReleasePage = useAppStore((s) => s.openReleasePage)

  return (
    <div className="w-full rounded-xl border border-border/70 bg-card/40 p-3 text-left">
      {updateState.status === 'idle' && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{t('updater.check')}</span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs rounded-lg cursor-pointer"
            onClick={() => void checkForUpdates(true)}
          >
            <RefreshCw className="mr-1.5 size-3" />
            {t('updater.check')}
          </Button>
        </div>
      )}

      {updateState.status === 'checking' && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-0.5">
          <Loader2 className="size-3.5 animate-spin text-foreground" />
          <span>{t('updater.checking')}</span>
        </div>
      )}

      {updateState.status === 'not-available' && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
            <span>{t('updater.upToDate')}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-[11px] text-muted-foreground hover:text-foreground px-2 cursor-pointer"
            onClick={() => void checkForUpdates(true)}
          >
            <RefreshCw className="mr-1 size-2.5" />
            {t('updater.check')}
          </Button>
        </div>
      )}

      {updateState.status === 'available' && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Sparkles className="size-3.5 text-amber-500 shrink-0" />
            <span>{t('updater.available', { version: updateState.info.version })}</span>
          </div>
          {updateState.info.releaseNotes && (
            <p className="line-clamp-2 text-[11px] text-muted-foreground leading-normal">
              {updateState.info.releaseNotes}
            </p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              className="h-7 text-xs rounded-lg cursor-pointer"
              onClick={() => void downloadUpdate()}
            >
              <Download className="mr-1.5 size-3" />
              {t('updater.download')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs rounded-lg cursor-pointer"
              onClick={() => void openReleasePage()}
            >
              {t('updater.releaseNotes')}
            </Button>
          </div>
        </div>
      )}

      {updateState.status === 'downloading' && (
        <div className="space-y-1.5 py-0.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t('updater.downloading', { percent: updateState.percent })}</span>
            <span className="font-mono text-[10px]">
              {(updateState.transferred / (1024 * 1024)).toFixed(1)} /{' '}
              {(updateState.total / (1024 * 1024)).toFixed(1)} MB
            </span>
          </div>
          <Progress value={updateState.percent} className="h-1.5" />
        </div>
      )}

      {updateState.status === 'downloaded' && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
            <span>{t('updater.downloaded')}</span>
          </div>
          <Button
            size="sm"
            className="h-7 text-xs rounded-lg cursor-pointer"
            onClick={() => void installUpdate()}
          >
            {t('updater.install')}
          </Button>
        </div>
      )}

      {updateState.status === 'error' && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span className="truncate max-w-[180px]">{updateState.message}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs rounded-lg cursor-pointer"
            onClick={() => void checkForUpdates(true)}
          >
            {t('updater.retry')}
          </Button>
        </div>
      )}
    </div>
  )
}

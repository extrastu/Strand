import { Info, Monitor, Moon, SlidersHorizontal, Sun } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { LANGUAGES, THEMES } from '@shared/types'
import type { Language, ThemeSetting } from '@shared/types'
import iconUrl from '@build/icon.png'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LANGUAGE_NAMES } from '@/i18n/languages'
import type { MessageKey } from '@/i18n'
import { useT } from '@/i18n/use-t'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app-store'

type Section = 'general' | 'about'

const SECTIONS: { id: Section; icon: LucideIcon; label: MessageKey }[] = [
  { id: 'general', icon: SlidersHorizontal, label: 'settings.general' },
  { id: 'about', icon: Info, label: 'settings.about' },
]

const THEME_ICON: Record<ThemeSetting, LucideIcon> = { system: Monitor, light: Sun, dark: Moon }
const THEME_KEY: Record<ThemeSetting, MessageKey> = {
  system: 'settings.theme.system',
  light: 'settings.theme.light',
  dark: 'settings.theme.dark',
}

export function SettingsDialog() {
  const open = useAppStore((s) => s.dialog?.kind === 'settings')
  const closeDialog = useAppStore((s) => s.closeDialog)

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeDialog()}>
      <DialogContent className="h-[420px] gap-0 overflow-hidden rounded-2xl p-0 shadow-[var(--shadow-pop)] sm:max-w-[640px]">
        {open && <SettingsBody />}
      </DialogContent>
    </Dialog>
  )
}

function SettingsBody() {
  const t = useT()
  const [section, setSection] = useState<Section>('general')
  const tabs = useRef<Record<Section, HTMLButtonElement | null>>({ general: null, about: null })

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
    <div className="grid h-full grid-cols-[176px_1fr]">
      <div className="flex flex-col gap-3 border-r p-4">
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
      <div role="tabpanel" id="settings-panel" aria-labelledby={`settings-tab-${section}`} className="overflow-y-auto p-6">
        {section === 'general' ? <GeneralPanel /> : <AboutPanel />}
      </div>
    </div>
  )
}

function GeneralPanel() {
  const t = useT()
  const theme = useAppStore((s) => s.settings.theme)
  const language = useAppStore((s) => s.settings.language)
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

  return (
    <div className="flex flex-col items-center gap-3 pt-4 text-center">
      <img src={iconUrl} alt={t('about.iconAlt')} width={72} height={72} />
      <div>
        <h3 className="font-serif text-2xl">{about?.name ?? 'Strand'}</h3>
        {about && <p className="text-sm text-muted-foreground">{t('about.version', { version: about.version })}</p>}
      </div>
      <p className="max-w-xs text-sm">{t('about.description')}</p>
      {about ? (
        <p className="text-xs text-muted-foreground">{t('about.runtime', { electron: about.electron, chromium: about.chromium })}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{t('about.unavailable')}</p>
      )}
      <p className="max-w-xs text-xs text-muted-foreground">{t('about.notice')}</p>
    </div>
  )
}

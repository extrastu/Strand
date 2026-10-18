// User settings (theme, language). Same discipline as the accounts store: validated on read,
// atomic writes, in-memory rollback if a write fails. No credentials.
//
// Only what the user has actually chosen is written. A field they never touched keeps following the
// default (for the language: the system language), so it is not frozen by an unrelated change.
import fs from 'node:fs'
import path from 'node:path'
import { LANGUAGES, THEMES } from '@shared/types'
import type { Language, Settings, ThemeSetting } from '@shared/types'

export interface SettingsStore {
  get(): Settings
  set(patch: Partial<Settings>): Settings
}

function oneOf<T extends string>(allowed: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
}

// Missing file: nothing chosen yet. Unparsable JSON or JSON that is not an object: the file is kept
// as .corrupt and nothing is chosen. Any other read error throws, so a transient failure can never
// lead to overwriting good settings.
function read(file: string): Partial<Settings> {
  let raw: string
  try {
    raw = fs.readFileSync(file, 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return {}
    throw err
  }
  try {
    const data: unknown = JSON.parse(raw)
    if (data === null || typeof data !== 'object' || Array.isArray(data)) throw new Error('not an object')
    const record = data as Record<string, unknown>
    const chosen: Partial<Settings> = {}
    if (oneOf<ThemeSetting>(THEMES, record.theme)) chosen.theme = record.theme
    if (oneOf<Language>(LANGUAGES, record.language)) chosen.language = record.language
    return chosen
  } catch {
    try {
      fs.copyFileSync(file, `${file}.corrupt`)
    } catch {
      // best-effort backup
    }
    return {}
  }
}

export function createSettingsStore(file: string, defaults: Settings): SettingsStore {
  let chosen = read(file)

  const effective = (c: Partial<Settings>): Settings => ({ ...defaults, ...c })

  const save = (c: Partial<Settings>): void => {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const tmp = `${file}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(c, null, 2))
    fs.renameSync(tmp, file)
  }

  return {
    get: () => effective(chosen),
    set(patch) {
      const next: Partial<Settings> = { ...chosen }
      if (patch.theme !== undefined) {
        if (!oneOf<ThemeSetting>(THEMES, patch.theme)) throw new Error(`theme must be one of ${THEMES.join(', ')}`)
        next.theme = patch.theme
      }
      if (patch.language !== undefined) {
        if (!oneOf<Language>(LANGUAGES, patch.language)) throw new Error(`language must be one of ${LANGUAGES.join(', ')}`)
        next.language = patch.language
      }
      // Writing even when the value equals the default records an explicit choice.
      if (patch.theme === undefined && patch.language === undefined) return effective(chosen)
      save(next) // throws before anything changes in memory, so there is nothing to roll back
      chosen = next
      return effective(chosen)
    },
  }
}

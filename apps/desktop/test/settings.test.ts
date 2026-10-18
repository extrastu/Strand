import { test } from 'vitest'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createSettingsStore } from '../src/main/settings'
import type { Settings } from '@shared/types'

const DEFAULTS: Settings = { theme: 'system', language: 'en' }

function tmpFile() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'strand-settings-'))
  return path.join(dir, 'nested', 'settings.json')
}

function writeRaw(file: string, content: string) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

test('a missing file gives the defaults and creates nothing', () => {
  const file = tmpFile()
  const store = createSettingsStore(file, DEFAULTS)
  assert.deepEqual(store.get(), DEFAULTS)
  assert.equal(fs.existsSync(path.dirname(file)), false)
})

test('set persists and a new instance reads it back', () => {
  const file = tmpFile()
  const first = createSettingsStore(file, DEFAULTS)
  assert.deepEqual(first.set({ theme: 'dark' }), { theme: 'dark', language: 'en' })
  assert.deepEqual(first.set({ language: 'zh-CN' }), { theme: 'dark', language: 'zh-CN' })
  assert.deepEqual(createSettingsStore(file, DEFAULTS).get(), { theme: 'dark', language: 'zh-CN' })
})

test('theme and language can be set together', () => {
  const store = createSettingsStore(tmpFile(), DEFAULTS)
  assert.deepEqual(store.set({ theme: 'light', language: 'zh-CN' }), { theme: 'light', language: 'zh-CN' })
})

test('invalid values are rejected and nothing changes, in memory or on disk', () => {
  const file = tmpFile()
  const store = createSettingsStore(file, DEFAULTS)
  store.set({ theme: 'dark' })
  assert.throws(() => store.set({ theme: 'neon' as never }), /theme must be one of/)
  assert.throws(() => store.set({ language: 'fr' as never }), /language must be one of/)
  assert.throws(() => store.set({ theme: 'light', language: 'fr' as never }), /language must be one of/)
  assert.deepEqual(store.get(), { theme: 'dark', language: 'en' })
  assert.deepEqual(createSettingsStore(file, DEFAULTS).get(), { theme: 'dark', language: 'en' })
})

test('unknown keys are ignored and an empty patch changes nothing', () => {
  const store = createSettingsStore(tmpFile(), DEFAULTS)
  assert.deepEqual(store.set({ colour: 'red' } as never), DEFAULTS)
  assert.deepEqual(store.set({}), DEFAULTS)
})

test('a corrupt file yields the defaults and is backed up', () => {
  const file = tmpFile()
  writeRaw(file, '{not json')
  const store = createSettingsStore(file, DEFAULTS)
  assert.deepEqual(store.get(), DEFAULTS)
  assert.equal(fs.readFileSync(`${file}.corrupt`, 'utf8'), '{not json')
})

test('a read error other than missing or corrupt throws instead of using defaults', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'strand-settings-'))
  assert.throws(() => createSettingsStore(dir, DEFAULTS), /EISDIR/)
})

test('unknown values in the file fall back per field and valid ones are kept', () => {
  const file = tmpFile()
  writeRaw(file, JSON.stringify({ theme: 'neon', language: 'zh-CN' }))
  assert.deepEqual(createSettingsStore(file, DEFAULTS).get(), { theme: 'system', language: 'zh-CN' })
  writeRaw(file, JSON.stringify({ theme: 'dark', language: 'fr' }))
  assert.deepEqual(createSettingsStore(file, DEFAULTS).get(), { theme: 'dark', language: 'en' })
  writeRaw(file, JSON.stringify([1, 2, 3]))
  assert.deepEqual(createSettingsStore(file, DEFAULTS).get(), DEFAULTS)
})

test('the default language is used until the user picks one', () => {
  const file = tmpFile()
  assert.equal(createSettingsStore(file, { theme: 'system', language: 'zh-CN' }).get().language, 'zh-CN')
  const store = createSettingsStore(file, { theme: 'system', language: 'zh-CN' })
  store.set({ language: 'en' })
  assert.equal(createSettingsStore(file, { theme: 'system', language: 'zh-CN' }).get().language, 'en')
})

test('a failed write rolls the in-memory state back', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'strand-settings-'))
  const file = path.join(dir, 'settings.json')
  const store = createSettingsStore(file, DEFAULTS)
  fs.mkdirSync(file) // after loading, make the target a directory so the final rename fails
  assert.throws(() => store.set({ theme: 'dark' }))
  assert.deepEqual(store.get(), DEFAULTS)
})

test('get returns a copy that cannot mutate the store', () => {
  const store = createSettingsStore(tmpFile(), DEFAULTS)
  const s = store.get()
  s.theme = 'dark'
  assert.equal(store.get().theme, 'system')
})

test('choosing the value that equals the default is still recorded as an explicit choice', () => {
  const file = tmpFile()
  createSettingsStore(file, { theme: 'system', language: 'zh-CN' }).set({ language: 'zh-CN' })
  // A different system language later must not change what the user chose.
  assert.equal(createSettingsStore(file, { theme: 'system', language: 'en' }).get().language, 'zh-CN')
})

test('only what the user chose is written: a theme change does not record the default language', () => {
  const file = tmpFile()
  createSettingsStore(file, { theme: 'system', language: 'zh-CN' }).set({ theme: 'dark' })
  assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), { theme: 'dark' })
  // The system language changed later and the user never picked one, so the new default applies.
  assert.deepEqual(createSettingsStore(file, { theme: 'system', language: 'en' }).get(), { theme: 'dark', language: 'en' })
})

test('both fields are written once both have been chosen, and later changes keep the other one', () => {
  const file = tmpFile()
  const store = createSettingsStore(file, DEFAULTS)
  store.set({ theme: 'light' })
  store.set({ language: 'zh-CN' })
  store.set({ theme: 'dark' })
  assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), { theme: 'dark', language: 'zh-CN' })
})

test('valid JSON of the wrong shape is treated as corrupt: defaults and a backup', () => {
  for (const raw of ['[1,2,3]', 'null', '5', '"x"']) {
    const file = tmpFile()
    writeRaw(file, raw)
    assert.deepEqual(createSettingsStore(file, DEFAULTS).get(), DEFAULTS, raw)
    assert.equal(fs.readFileSync(`${file}.corrupt`, 'utf8'), raw, raw)
  }
})

test('shortcuts can be set and persisted independently', () => {
  const file = tmpFile()
  const defaults: Settings = {
    theme: 'system',
    language: 'en',
    shortcuts: { toggleSidebar: 'Mod+B', addAccount: 'Mod+N', settings: 'Mod+,', search: 'Mod+F' },
  }
  const store = createSettingsStore(file, defaults)
  store.set({ shortcuts: { toggleSidebar: 'Mod+Shift+S' } })
  assert.equal(store.get().shortcuts?.toggleSidebar, 'Mod+Shift+S')
  assert.equal(store.get().shortcuts?.addAccount, 'Mod+N')
  assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), {
    shortcuts: { toggleSidebar: 'Mod+Shift+S' },
  })

  // Read back by a new store instance
  const second = createSettingsStore(file, defaults)
  assert.equal(second.get().shortcuts?.toggleSidebar, 'Mod+Shift+S')
  assert.equal(second.get().shortcuts?.addAccount, 'Mod+N')
})

test('invalid shortcuts or unknown actions are rejected', () => {
  const file = tmpFile()
  const store = createSettingsStore(file, DEFAULTS)
  assert.throws(() => store.set({ shortcuts: 'invalid' as never }), /shortcuts must be an object/)
  assert.throws(() => store.set({ shortcuts: { unknownAction: 'Mod+K' } as never }), /unknown shortcut action/)
  assert.throws(() => store.set({ shortcuts: { toggleSidebar: '' } }), /invalid shortcut/)
})

test('autoCheckUpdates can be configured, persisted, and validated', () => {
  const file = tmpFile()
  const defaults: Settings = { theme: 'system', language: 'en', autoCheckUpdates: true }
  const store = createSettingsStore(file, defaults)
  assert.equal(store.get().autoCheckUpdates, true)

  store.set({ autoCheckUpdates: false })
  assert.equal(store.get().autoCheckUpdates, false)

  const reloaded = createSettingsStore(file, defaults)
  assert.equal(reloaded.get().autoCheckUpdates, false)

  assert.throws(() => store.set({ autoCheckUpdates: 'yes' as never }), /autoCheckUpdates must be a boolean/)
})

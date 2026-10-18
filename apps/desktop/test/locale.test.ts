import { test } from 'vitest'
import assert from 'node:assert/strict'
import { defaultLanguageFor } from '@shared/locale'

test('any Chinese locale defaults to Simplified Chinese', () => {
  for (const locale of ['zh', 'zh-CN', 'zh-Hans-CN', 'zh_CN', 'zh-TW', 'zh-Hant-HK', 'ZH-cn']) {
    assert.equal(defaultLanguageFor(locale), 'zh-CN', locale)
  }
})

test('everything else defaults to English', () => {
  for (const locale of ['en', 'en-US', 'en-GB', 'fr-FR', 'ja-JP', 'de', 'zhx', 'pt-BR', '', 'garbage']) {
    assert.equal(defaultLanguageFor(locale), 'en', locale)
  }
})

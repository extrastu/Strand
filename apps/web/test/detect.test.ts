import { test } from 'vitest'
import assert from 'node:assert/strict'
import { matchLanguage } from '../lib/i18n/detect'

test('matches Chinese browser language variants to zh-CN', () => {
  assert.equal(matchLanguage(['zh-CN']), 'zh-CN')
  assert.equal(matchLanguage(['zh-TW']), 'zh-CN')
  assert.equal(matchLanguage(['zh-HK']), 'zh-CN')
  assert.equal(matchLanguage(['zh-Hans-CN']), 'zh-CN')
  assert.equal(matchLanguage(['zh']), 'zh-CN')
  assert.equal(matchLanguage(['ZH-cn']), 'zh-CN')
})

test('matches English browser language to en', () => {
  assert.equal(matchLanguage(['en-US']), 'en')
  assert.equal(matchLanguage(['en-GB']), 'en')
  assert.equal(matchLanguage(['en']), 'en')
})

test('respects user priority in candidates list', () => {
  assert.equal(matchLanguage(['zh-CN', 'en-US']), 'zh-CN')
  assert.equal(matchLanguage(['en-US', 'zh-CN']), 'en')
})

test('falls back to en when no supported languages match', () => {
  assert.equal(matchLanguage(['ja-JP']), 'en')
  assert.equal(matchLanguage(['fr-FR', 'de-DE']), 'en')
  assert.equal(matchLanguage(['es-ES']), 'en')
  assert.equal(matchLanguage(['ko-KR']), 'en')
  assert.equal(matchLanguage([]), 'en')
  assert.equal(matchLanguage(['unknown', '']), 'en')
})

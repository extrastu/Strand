import { test } from 'vitest'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { zhCN } from '../src/renderer/src/i18n/zh-CN'
import { en } from '../src/renderer/src/i18n/en'
import { translate } from '../src/renderer/src/i18n'

const SRC = path.join(__dirname, '../src')
// CJK punctuation, kana, ideographs (incl. extension A and compatibility), hangul, full-width forms.
const CJK = /[　-ヿ㐀-䶿一-鿿가-힯豈-﫿＀-￯]/
const ESCAPE = /\\u([0-9a-fA-F]{4})/g
// A string written as "中" counts as CJK too.
const hasCjk = (text: string) => CJK.test(text.replace(ESCAPE, (_, hex: string) => String.fromCharCode(parseInt(hex, 16))))
// The Chinese dictionary and the language names (each language written in itself) may contain CJK.
const ALLOWED = new Set(['renderer/src/i18n/zh-CN.ts', 'renderer/src/i18n/languages.ts'])

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) return sourceFiles(p)
    return /\.(ts|tsx|css|html)$/.test(e.name) ? [p] : []
  })
}

test('both dictionaries have exactly the same keys', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zhCN).sort())
})

test('no entry is empty, and placeholders match between languages', () => {
  const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
  for (const key of Object.keys(zhCN) as (keyof typeof zhCN)[]) {
    assert.ok(zhCN[key].trim() !== '', `zh-CN ${key} is empty`)
    assert.ok(en[key].trim() !== '', `en ${key} is empty`)
    assert.deepEqual(placeholders(en[key]), placeholders(zhCN[key]), `placeholders differ for ${key}`)
  }
})

test('the English dictionary contains no CJK text', () => {
  for (const [key, value] of Object.entries(en)) assert.equal(hasCjk(value), false, `${key}: ${value}`)
})

test('the guard itself sees kana, hangul, compatibility ideographs and \\u escapes', () => {
  for (const sample of ['ひらがな', 'カタカナ', '한국어', '豈', '中文', '\\u4e2d\\u6587']) {
    assert.equal(hasCjk(sample), true, sample)
  }
  assert.equal(hasCjk('plain ASCII and a \\u0041 escape'), false)
})

test('no CJK character (also as a \\u escape) appears in the app source outside the allowed i18n files', () => {
  const offenders = sourceFiles(SRC)
    .filter((f) => !ALLOWED.has(path.relative(SRC, f)))
    .filter((f) => hasCjk(fs.readFileSync(f, 'utf8')))
    .map((f) => path.relative(SRC, f))
  assert.deepEqual(offenders, [])
})

test('translate fills placeholders and falls back to the key for unknown ones', () => {
  assert.equal(translate('en', 'toast.copied', { name: 'Main' }), 'Copied account name: Main')
  assert.equal(translate('zh-CN', 'toast.copied', { name: '主号' }), '已复制账号名称:主号')
  assert.equal(translate('en', 'nope' as never), 'nope')
})

import type { Language } from './types'

/** First-run language: any Chinese locale gives Simplified Chinese, everything else English. */
export function defaultLanguageFor(locale: string): Language {
  return /^zh([-_]|$)/i.test(locale) ? 'zh-CN' : 'en'
}

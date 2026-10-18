import type { Language } from '@shared/types'
import { en } from './en'
import { zhCN } from './zh-CN'
import type { MessageKey } from './zh-CN'

export type { MessageKey }
export type Params = Record<string, string | number>

export const dictionaries: Record<Language, Record<MessageKey, string>> = { 'zh-CN': zhCN, en }

/** Looks a message up and fills `{placeholders}`. An unknown key comes back as the key itself. */
export function translate(language: Language, key: MessageKey, params?: Params): string {
  const template = dictionaries[language][key]
  if (template === undefined) return key
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match))
}

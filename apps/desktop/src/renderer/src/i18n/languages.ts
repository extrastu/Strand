import type { Language } from '@shared/types'

// Each language is named in itself, so it stays recognisable whatever the current UI language is.
export const LANGUAGE_NAMES: Record<Language, string> = {
  'zh-CN': '简体中文',
  en: 'English',
}

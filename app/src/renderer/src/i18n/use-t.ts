import { useCallback } from 'react'
import { useAppStore } from '@/store/app-store'
import { translate } from './index'
import type { MessageKey, Params } from './index'

/** `t('key', { name })` in the current UI language; re-renders the caller when the language changes. */
export function useT() {
  const language = useAppStore((s) => s.settings.language)
  return useCallback((key: MessageKey, params?: Params) => translate(language, key, params), [language])
}

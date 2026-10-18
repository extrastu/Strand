import type { AccountType } from '@shared/types'
import type { MessageKey } from '@/i18n'

export const TYPE_LABEL_KEY: Record<AccountType, MessageKey> = {
  personal: 'type.personal',
  creator: 'type.creator',
}

export const TYPE_HINT_KEY: Record<AccountType, MessageKey> = {
  personal: 'type.personalHint',
  creator: 'type.creatorHint',
}

export function initialOf(name: string): string {
  return Array.from(name.trim())[0]?.toUpperCase() ?? '?'
}

import type { AccountType } from '@shared/types'

export const TYPE_LABEL: Record<AccountType, string> = {
  personal: '个人',
  creator: '创作者',
}

export const TYPE_HINT: Record<AccountType, string> = {
  personal: '日常使用的账号',
  creator: '用来发布内容的账号',
}

export function initialOf(name: string): string {
  return Array.from(name.trim())[0]?.toUpperCase() ?? '?'
}

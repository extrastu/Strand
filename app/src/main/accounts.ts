// Account metadata store. Holds names, types and the active id only: no credentials or cookies.
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { ACCOUNT_TYPES, MAX_NAME_LENGTH } from '@shared/types'
import type { Account, AccountInput, AccountsState, AccountType } from '@shared/types'

const SAFE_ID = /^[A-Za-z0-9-]+$/ // ids become part of a session partition name

function cleanName(name: unknown): string {
  if (typeof name !== 'string') throw new Error('name must be a string')
  const trimmed = name.trim()
  if (!trimmed) throw new Error('name is required')
  if ([...trimmed].length > MAX_NAME_LENGTH) throw new Error(`name must be at most ${MAX_NAME_LENGTH} characters`)
  return trimmed
}

function cleanType(type: unknown): AccountType {
  if (!ACCOUNT_TYPES.includes(type as AccountType)) {
    throw new Error(`type must be one of ${ACCOUNT_TYPES.join(', ')}`)
  }
  return type as AccountType
}

// Names read from disk are repaired rather than rejected, so an account (and its login) is never lost.
function repairName(name: string): string {
  return [...name.trim()].slice(0, MAX_NAME_LENGTH).join('').trim() || '—'
}

function isValidAccount(a: unknown): a is Account {
  if (a === null || typeof a !== 'object') return false
  const { id, name, type } = a as Record<string, unknown>
  return (
    typeof id === 'string' &&
    SAFE_ID.test(id) &&
    typeof name === 'string' &&
    ACCOUNT_TYPES.includes(type as AccountType)
  )
}

const empty = (): AccountsState => ({ accounts: [], activeId: null })

// Missing file or unparsable JSON starts empty (a corrupt file is kept as .corrupt);
// any other read error throws, so a transient failure can never lead to overwriting good data.
function read(file: string): AccountsState {
  let raw: string
  try {
    raw = fs.readFileSync(file, 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return empty()
    throw err
  }
  try {
    const data = JSON.parse(raw) as { accounts?: unknown; activeId?: unknown }
    const seen = new Set<string>()
    const accounts: Account[] = []
    for (const a of Array.isArray(data.accounts) ? data.accounts : []) {
      if (!isValidAccount(a) || seen.has(a.id)) continue // duplicate ids would share one session
      seen.add(a.id)
      accounts.push({ id: a.id, name: repairName(a.name), type: a.type })
    }
    return { accounts, activeId: typeof data.activeId === 'string' ? data.activeId : null }
  } catch {
    try {
      fs.copyFileSync(file, `${file}.corrupt`)
    } catch {
      // best-effort backup
    }
    return empty()
  }
}

export function partitionFor(id: string): string {
  return `persist:acct-${id}`
}

export interface AccountStore {
  getState(): AccountsState
  add(input: AccountInput): Account
  update(id: string, input: AccountInput): void
  rename(id: string, name: string): void
  retype(id: string, type: AccountType): void
  setActive(id: string): void
  remove(id: string): void
}

export function createStore(
  file: string,
  { newId = () => crypto.randomUUID() }: { newId?: () => string } = {},
): AccountStore {
  const state = read(file)

  const find = (id: string): Account => {
    const account = state.accounts.find((a) => a.id === id)
    if (!account) throw new Error(`unknown account: ${id}`)
    return account
  }

  // A dangling or missing activeId falls back to the first account.
  const resolveActive = (): string | null => {
    if (state.accounts.some((a) => a.id === state.activeId)) return state.activeId
    return state.accounts[0]?.id ?? null
  }

  const save = (): void => {
    state.activeId = resolveActive()
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const tmp = `${file}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2))
    fs.renameSync(tmp, file)
  }

  // Run a mutation and persist it; if anything throws, restore the previous in-memory state.
  const mutate = <T>(fn: () => T): T => {
    const before = { accounts: state.accounts.map((a) => ({ ...a })), activeId: state.activeId }
    try {
      const result = fn()
      save()
      return result
    } catch (err) {
      state.accounts = before.accounts
      state.activeId = before.activeId
      throw err
    }
  }

  state.activeId = resolveActive()

  return {
    getState() {
      return { accounts: state.accounts.map((a) => ({ ...a })), activeId: resolveActive() }
    },
    add({ name, type }) {
      return mutate(() => {
        const account: Account = { id: newId(), name: cleanName(name), type: cleanType(type) }
        state.accounts.push(account)
        state.activeId = account.id
        return { ...account }
      })
    },
    update(id, { name, type }) {
      mutate(() => {
        const account = find(id)
        const next = { name: cleanName(name), type: cleanType(type) }
        Object.assign(account, next)
      })
    },
    rename(id, name) {
      mutate(() => {
        find(id).name = cleanName(name)
      })
    },
    retype(id, type) {
      mutate(() => {
        find(id).type = cleanType(type)
      })
    },
    setActive(id) {
      mutate(() => {
        find(id)
        state.activeId = id
      })
    },
    remove(id) {
      mutate(() => {
        find(id)
        state.accounts = state.accounts.filter((a) => a.id !== id)
      })
    },
  }
}

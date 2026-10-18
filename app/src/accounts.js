'use strict'
// Account metadata store. Holds names, types and the active id only: no credentials or cookies.
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

const TYPES = ['personal', 'creator']
const MAX_NAME = 40
const SAFE_ID = /^[A-Za-z0-9-]+$/ // ids become part of a session partition name

function cleanName(name) {
  if (typeof name !== 'string') throw new Error('name must be a string')
  const trimmed = name.trim()
  if (!trimmed) throw new Error('name is required')
  if ([...trimmed].length > MAX_NAME) throw new Error(`name must be at most ${MAX_NAME} characters`)
  return trimmed
}

function cleanType(type) {
  if (!TYPES.includes(type)) throw new Error(`type must be one of ${TYPES.join(', ')}`)
  return type
}

// Names read from disk are repaired rather than rejected, so an account (and its login) is never lost.
function repairName(name) {
  return [...name.trim()].slice(0, MAX_NAME).join('').trim() || '未命名'
}

function isValidAccount(a) {
  return (
    a !== null &&
    typeof a === 'object' &&
    typeof a.id === 'string' &&
    SAFE_ID.test(a.id) &&
    typeof a.name === 'string' &&
    TYPES.includes(a.type)
  )
}

// Missing file or unparsable JSON starts empty (a corrupt file is kept as .corrupt);
// any other read error throws, so a transient failure can never lead to overwriting good data.
function read(file) {
  let raw
  try {
    raw = fs.readFileSync(file, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') return { accounts: [], activeId: null }
    throw err
  }
  try {
    const data = JSON.parse(raw)
    const seen = new Set()
    const accounts = []
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
    return { accounts: [], activeId: null }
  }
}

function partitionFor(id) {
  return `persist:acct-${id}`
}

function createStore(file, { newId = () => crypto.randomUUID() } = {}) {
  const state = read(file)

  const find = (id) => {
    const account = state.accounts.find((a) => a.id === id)
    if (!account) throw new Error(`unknown account: ${id}`)
    return account
  }

  // A dangling or missing activeId falls back to the first account.
  const resolveActive = () => {
    if (state.accounts.some((a) => a.id === state.activeId)) return state.activeId
    return state.accounts.length ? state.accounts[0].id : null
  }

  const save = () => {
    state.activeId = resolveActive()
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const tmp = `${file}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2))
    fs.renameSync(tmp, file)
  }

  // Run a mutation and persist it; if anything throws, restore the previous in-memory state.
  const mutate = (fn) => {
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
        const account = { id: newId(), name: cleanName(name), type: cleanType(type) }
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

module.exports = { createStore, partitionFor, TYPES }

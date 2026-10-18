'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { createStore, partitionFor } = require('../src/accounts')

function tmpFile() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'threads-accounts-'))
  return path.join(dir, 'nested', 'accounts.json')
}

function counterIds() {
  let n = 0
  return () => `id${++n}`
}

test('starts empty when the file is missing', () => {
  const store = createStore(tmpFile())
  assert.deepEqual(store.getState(), { accounts: [], activeId: null })
})

test('add creates an account, makes it active, and returns it', () => {
  const store = createStore(tmpFile(), { newId: counterIds() })
  const a = store.add({ name: ' 主号 ', type: 'personal' })
  assert.deepEqual(a, { id: 'id1', name: '主号', type: 'personal' })
  assert.equal(store.getState().activeId, 'id1')
  store.add({ name: '创作', type: 'creator' })
  assert.equal(store.getState().activeId, 'id2')
  assert.equal(store.getState().accounts.length, 2)
})

test('add rejects bad names and types', () => {
  const store = createStore(tmpFile())
  assert.throws(() => store.add({ name: '   ', type: 'personal' }), /name is required/)
  assert.throws(() => store.add({ name: 'x'.repeat(41), type: 'personal' }), /at most 40/)
  assert.throws(() => store.add({ name: 'ok', type: 'business' }), /type must be one of/)
  assert.throws(() => store.add({ name: 42, type: 'personal' }), /name must be a string/)
  assert.equal(store.getState().accounts.length, 0)
})

test('rename and retype update the account', () => {
  const store = createStore(tmpFile(), { newId: counterIds() })
  store.add({ name: 'a', type: 'personal' })
  store.rename('id1', ' b ')
  store.retype('id1', 'creator')
  assert.deepEqual(store.getState().accounts[0], { id: 'id1', name: 'b', type: 'creator' })
  assert.throws(() => store.rename('nope', 'x'), /unknown account/)
  assert.throws(() => store.retype('nope', 'creator'), /unknown account/)
  assert.throws(() => store.rename('id1', ''), /name is required/)
  assert.throws(() => store.retype('id1', 'bogus'), /type must be one of/)
})

test('setActive switches the active account and rejects unknown ids', () => {
  const store = createStore(tmpFile(), { newId: counterIds() })
  store.add({ name: 'a', type: 'personal' })
  store.add({ name: 'b', type: 'creator' })
  store.setActive('id1')
  assert.equal(store.getState().activeId, 'id1')
  assert.throws(() => store.setActive('nope'), /unknown account/)
  assert.equal(store.getState().activeId, 'id1')
})

test('remove drops the account and falls back to another active account', () => {
  const store = createStore(tmpFile(), { newId: counterIds() })
  store.add({ name: 'a', type: 'personal' })
  store.add({ name: 'b', type: 'creator' })
  store.add({ name: 'c', type: 'creator' })
  store.setActive('id2')
  store.remove('id2')
  const s = store.getState()
  assert.deepEqual(s.accounts.map((x) => x.id), ['id1', 'id3'])
  assert.equal(s.activeId, 'id1')
  store.remove('id1')
  store.remove('id3')
  assert.deepEqual(store.getState(), { accounts: [], activeId: null })
  assert.throws(() => store.remove('id1'), /unknown account/)
})

test('removing a non-active account keeps the active one', () => {
  const store = createStore(tmpFile(), { newId: counterIds() })
  store.add({ name: 'a', type: 'personal' })
  store.add({ name: 'b', type: 'creator' })
  store.remove('id1')
  assert.equal(store.getState().activeId, 'id2')
})

test('state persists across store instances', () => {
  const file = tmpFile()
  const first = createStore(file, { newId: counterIds() })
  first.add({ name: 'a', type: 'personal' })
  first.add({ name: 'b', type: 'creator' })
  first.setActive('id1')
  const second = createStore(file)
  assert.deepEqual(second.getState(), first.getState())
  assert.equal(second.getState().activeId, 'id1')
})

test('a corrupt file yields an empty store and is overwritten on the next write', () => {
  const file = tmpFile()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, '{not json')
  const store = createStore(file, { newId: counterIds() })
  assert.deepEqual(store.getState(), { accounts: [], activeId: null })
  store.add({ name: 'a', type: 'personal' })
  assert.equal(createStore(file).getState().accounts.length, 1)
})

test('invalid entries and a dangling activeId in the file are repaired on load', () => {
  const file = tmpFile()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(
    file,
    JSON.stringify({
      accounts: [
        { id: 'ok', name: 'good', type: 'creator' },
        { id: 'bad-type', name: 'x', type: 'business' },
        { id: 7, name: 'x', type: 'personal' },
        null,
      ],
      activeId: 'gone',
    }),
  )
  const s = createStore(file).getState()
  assert.deepEqual(s.accounts, [{ id: 'ok', name: 'good', type: 'creator' }])
  assert.equal(s.activeId, 'ok')
})

test('getState returns a copy that cannot mutate the store', () => {
  const store = createStore(tmpFile(), { newId: counterIds() })
  store.add({ name: 'a', type: 'personal' })
  const s = store.getState()
  s.accounts[0].name = 'hacked'
  s.accounts.push({ id: 'x', name: 'x', type: 'personal' })
  assert.equal(store.getState().accounts[0].name, 'a')
  assert.equal(store.getState().accounts.length, 1)
})

test('partitionFor builds a persistent per-account partition name', () => {
  assert.equal(partitionFor('abc'), 'persist:acct-abc')
})

test('update changes name and type together, and a bad value changes nothing on disk', () => {
  const file = tmpFile()
  const store = createStore(file, { newId: counterIds() })
  store.add({ name: 'a', type: 'personal' })
  store.update('id1', { name: 'b', type: 'creator' })
  assert.deepEqual(store.getState().accounts[0], { id: 'id1', name: 'b', type: 'creator' })
  assert.throws(() => store.update('id1', { name: 'c', type: 'bogus' }), /type must be one of/)
  assert.throws(() => store.update('id1', { name: '', type: 'personal' }), /name is required/)
  assert.deepEqual(store.getState().accounts[0], { id: 'id1', name: 'b', type: 'creator' })
  assert.deepEqual(createStore(file).getState().accounts[0], { id: 'id1', name: 'b', type: 'creator' })
})

test('a failed save rolls the in-memory state back', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'threads-accounts-'))
  const file = path.join(dir, 'accounts.json')
  const store = createStore(file, { newId: counterIds() })
  fs.mkdirSync(file) // after loading, make the target a directory so the final rename fails
  assert.throws(() => store.add({ name: 'a', type: 'personal' }))
  assert.deepEqual(store.getState(), { accounts: [], activeId: null })
})

test('duplicate ids in the file are collapsed so two accounts never share a partition', () => {
  const file = tmpFile()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(
    file,
    JSON.stringify({
      accounts: [
        { id: 'same', name: 'first', type: 'personal' },
        { id: 'same', name: 'second', type: 'creator' },
      ],
      activeId: 'same',
    }),
  )
  const s = createStore(file).getState()
  assert.deepEqual(s.accounts, [{ id: 'same', name: 'first', type: 'personal' }])
})

test('names loaded from disk are trimmed, clamped to 40 chars, and never empty', () => {
  const file = tmpFile()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(
    file,
    JSON.stringify({
      accounts: [
        { id: 'a', name: '  padded  ', type: 'personal' },
        { id: 'b', name: 'x'.repeat(80), type: 'personal' },
        { id: 'c', name: '   ', type: 'creator' },
      ],
      activeId: 'a',
    }),
  )
  const names = createStore(file).getState().accounts.map((a) => a.name)
  assert.equal(names[0], 'padded')
  assert.equal(names[1], 'x'.repeat(40))
  assert.equal(names[2], '未命名')
})

test('a corrupt file is backed up before it can be overwritten', () => {
  const file = tmpFile()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, '{not json')
  const store = createStore(file, { newId: counterIds() })
  store.add({ name: 'a', type: 'personal' })
  assert.equal(fs.readFileSync(`${file}.corrupt`, 'utf8'), '{not json')
})

test('a read error other than missing or corrupt throws instead of starting empty', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'threads-accounts-'))
  // The "file" is a directory, so reading it fails with EISDIR, not ENOENT or a parse error.
  assert.throws(() => createStore(dir), /EISDIR/)
})

test('ids that are not safe partition names are dropped on load', () => {
  const file = tmpFile()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(
    file,
    JSON.stringify({
      accounts: [
        { id: '../evil', name: 'x', type: 'personal' },
        { id: 'a b', name: 'x', type: 'personal' },
        { id: 'ok-1', name: 'good', type: 'personal' },
      ],
      activeId: 'ok-1',
    }),
  )
  assert.deepEqual(createStore(file).getState().accounts.map((a) => a.id), ['ok-1'])
})

test('name length counts characters, so truncation never splits an emoji', () => {
  const file = tmpFile()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify({ accounts: [{ id: 'a', name: `${'x'.repeat(39)}😀😀`, type: 'personal' }] }))
  const loaded = createStore(file).getState().accounts[0].name
  assert.equal(loaded, `${'x'.repeat(39)}😀`)
  const store = createStore(tmpFile())
  assert.doesNotThrow(() => store.add({ name: '😀'.repeat(40), type: 'personal' }))
  assert.throws(() => store.add({ name: '😀'.repeat(41), type: 'personal' }), /at most 40/)
})

import { test } from 'vitest'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { resolveUserDataDir } from '../src/main/legacy-data'

function appDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'strand-appdata-'))
}

function makeProfile(appData: string, name: string, accounts = '{"accounts":[],"activeId":null}') {
  const dir = path.join(appData, name)
  fs.mkdirSync(path.join(dir, 'Partitions', 'acct-1'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'accounts.json'), accounts)
  fs.writeFileSync(path.join(dir, 'Partitions', 'acct-1', 'cookie'), 'login')
  return dir
}

test('a fresh install uses the new directory and creates nothing', () => {
  const appData = appDataDir()
  const dir = resolveUserDataDir(appData, 'Strand', ['ThreadsMac'])
  assert.equal(dir, path.join(appData, 'Strand'))
  assert.deepEqual(fs.readdirSync(appData), [])
})

test('data from the old directory is moved to the new one, intact', () => {
  const appData = appDataDir()
  makeProfile(appData, 'ThreadsMac', '{"accounts":[{"id":"a","name":"main","type":"personal"}],"activeId":"a"}')
  const dir = resolveUserDataDir(appData, 'Strand', ['ThreadsMac'])
  assert.equal(dir, path.join(appData, 'Strand'))
  assert.equal(fs.existsSync(path.join(appData, 'ThreadsMac')), false)
  assert.match(fs.readFileSync(path.join(dir, 'accounts.json'), 'utf8'), /"name":"main"/)
  assert.equal(fs.readFileSync(path.join(dir, 'Partitions', 'acct-1', 'cookie'), 'utf8'), 'login')
})

test('when both exist the new directory wins and the old one is left alone', () => {
  const appData = appDataDir()
  makeProfile(appData, 'ThreadsMac', 'OLD')
  makeProfile(appData, 'Strand', 'NEW')
  const dir = resolveUserDataDir(appData, 'Strand', ['ThreadsMac'])
  assert.equal(dir, path.join(appData, 'Strand'))
  assert.equal(fs.readFileSync(path.join(dir, 'accounts.json'), 'utf8'), 'NEW')
  assert.equal(fs.readFileSync(path.join(appData, 'ThreadsMac', 'accounts.json'), 'utf8'), 'OLD')
})

test('if the move fails the old directory keeps being used, so nothing is lost', () => {
  const appData = appDataDir()
  makeProfile(appData, 'ThreadsMac', 'OLD')
  const failingFs = { ...fs, renameSync: () => { throw new Error('EXDEV') } } as unknown as typeof fs
  const dir = resolveUserDataDir(appData, 'Strand', ['ThreadsMac'], failingFs)
  assert.equal(dir, path.join(appData, 'ThreadsMac'))
  assert.equal(fs.readFileSync(path.join(dir, 'accounts.json'), 'utf8'), 'OLD')
  assert.equal(fs.existsSync(path.join(appData, 'Strand')), false)
})

test('with several old names the first one that exists is used', () => {
  const appData = appDataDir()
  makeProfile(appData, 'threads-mac', 'SECOND')
  makeProfile(appData, 'ThreadsMac', 'FIRST')
  const dir = resolveUserDataDir(appData, 'Strand', ['ThreadsMac', 'threads-mac'])
  assert.equal(fs.readFileSync(path.join(dir, 'accounts.json'), 'utf8'), 'FIRST')
  assert.equal(fs.existsSync(path.join(appData, 'threads-mac')), true)
})

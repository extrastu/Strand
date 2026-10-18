import { test } from 'vitest'
import assert from 'node:assert/strict'
import { compareVersions, findBestAsset } from '../src/main/updater'
import type { GitHubReleaseAsset } from '../src/main/updater'

test('compareVersions handles standard semver comparison', () => {
  assert.equal(compareVersions('0.2.0', '0.2.0'), 0)
  assert.equal(compareVersions('0.2.1', '0.2.0') > 0, true)
  assert.equal(compareVersions('0.2.0', '0.2.1') < 0, true)
  assert.equal(compareVersions('1.0.0', '0.9.9') > 0, true)
  assert.equal(compareVersions('0.10.0', '0.2.0') > 0, true)
})

test('compareVersions handles v prefix and whitespace', () => {
  assert.equal(compareVersions('v0.2.1', '0.2.0') > 0, true)
  assert.equal(compareVersions('  v1.0.0  ', 'v1.0.0'), 0)
  assert.equal(compareVersions('V2.0.0', '1.9.9') > 0, true)
})

test('compareVersions handles prereleases', () => {
  assert.equal(compareVersions('1.0.0', '1.0.0-beta.1') > 0, true)
  assert.equal(compareVersions('1.0.0-beta.1', '1.0.0') < 0, true)
  assert.equal(compareVersions('1.0.0-beta.2', '1.0.0-beta.1') > 0, true)
})

test('findBestAsset picks matching DMG based on architecture', () => {
  const assets: GitHubReleaseAsset[] = [
    { name: 'Strand-0.2.1-darwin-x64.dmg', browser_download_url: 'https://download/x64.dmg', size: 1000 },
    { name: 'Strand-0.2.1-darwin-arm64.dmg', browser_download_url: 'https://download/arm64.dmg', size: 1000 },
    { name: 'Strand-0.2.1-darwin-arm64.zip', browser_download_url: 'https://download/arm64.zip', size: 800 },
  ]

  const armBest = findBestAsset(assets, 'darwin', 'arm64')
  assert.equal(armBest?.name, 'Strand-0.2.1-darwin-arm64.dmg')

  const x64Best = findBestAsset(assets, 'darwin', 'x64')
  assert.equal(x64Best?.name, 'Strand-0.2.1-darwin-x64.dmg')
})

test('findBestAsset falls back to any DMG or ZIP', () => {
  const assets: GitHubReleaseAsset[] = [
    { name: 'Strand-0.2.1.zip', browser_download_url: 'https://download/zip', size: 800 },
  ]
  assert.equal(findBestAsset(assets, 'darwin', 'arm64')?.name, 'Strand-0.2.1.zip')
  assert.equal(findBestAsset([], 'darwin', 'arm64'), null)
})

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { app, shell } from 'electron'
import type { BrowserWindow } from 'electron'
import { IPC } from '@shared/types'
import type { UpdateInfo, UpdateState } from '@shared/types'
import type { SettingsStore } from './settings'

export interface GitHubReleaseAsset {
  name: string
  browser_download_url: string
  size: number
}

export interface GitHubRelease {
  tag_name: string
  name: string
  body?: string
  html_url: string
  published_at: string
  assets: GitHubReleaseAsset[]
}

/**
 * Compares two semantic version strings.
 * Returns:
 *   > 0 if v1 > v2
 *   < 0 if v1 < v2
 *   0 if v1 === v2
 */
export function compareVersions(v1: string, v2: string): number {
  const clean = (v: string): { nums: number[]; prerelease: string | null } => {
    const raw = v.trim().replace(/^[vV]/, '')
    const [core, prerelease] = raw.split('-')
    const nums = (core || '').split('.').map((n) => parseInt(n, 10) || 0)
    return { nums, prerelease: prerelease ?? null }
  }

  const c1 = clean(v1)
  const c2 = clean(v2)
  const len = Math.max(c1.nums.length, c2.nums.length, 3)

  for (let i = 0; i < len; i++) {
    const n1 = c1.nums[i] ?? 0
    const n2 = c2.nums[i] ?? 0
    if (n1 > n2) return 1
    if (n1 < n2) return -1
  }

  // If core versions match: a version with NO prerelease is newer than one WITH a prerelease
  if (!c1.prerelease && c2.prerelease) return 1
  if (c1.prerelease && !c2.prerelease) return -1
  if (c1.prerelease && c2.prerelease) {
    return c1.prerelease.localeCompare(c2.prerelease)
  }

  return 0
}

/**
 * Finds the most suitable release asset for the target platform and architecture.
 */
export function findBestAsset(
  assets: GitHubReleaseAsset[],
  platform: NodeJS.Platform = process.platform,
  arch: string = process.arch,
): GitHubReleaseAsset | null {
  if (!Array.isArray(assets) || assets.length === 0) return null

  const targetArch = arch === 'arm64' ? 'arm64' : 'x64'

  if (platform === 'darwin') {
    // 1. ZIP for exact architecture (extracts directly without disk mounting)
    const zipArch = assets.find(
      (a) => a.name.endsWith('.zip') && a.name.toLowerCase().includes(targetArch),
    )
    if (zipArch) return zipArch

    // 2. Universal or any macOS ZIP
    const zipAny = assets.find(
      (a) =>
        a.name.endsWith('.zip') &&
        (a.name.toLowerCase().includes('darwin') ||
          a.name.toLowerCase().includes('mac') ||
          a.name.toLowerCase().includes('universal')),
    )
    if (zipAny) return zipAny

    // 3. DMG for exact architecture
    const dmgArch = assets.find(
      (a) => a.name.endsWith('.dmg') && a.name.toLowerCase().includes(targetArch),
    )
    if (dmgArch) return dmgArch

    // 4. Universal or any macOS DMG
    const dmgAny = assets.find(
      (a) =>
        a.name.endsWith('.dmg') &&
        (a.name.toLowerCase().includes('darwin') ||
          a.name.toLowerCase().includes('mac') ||
          a.name.toLowerCase().includes('universal')),
    )
    if (dmgAny) return dmgAny

    // 5. Fallback to any ZIP or DMG
    const anyZip = assets.find((a) => a.name.endsWith('.zip'))
    if (anyZip) return anyZip
    const anyDmg = assets.find((a) => a.name.endsWith('.dmg'))
    if (anyDmg) return anyDmg
  }

  return assets[0] ?? null
}

export class AppUpdater {
  private state: UpdateState = { status: 'idle' }
  private getWindow: () => BrowserWindow | null
  private getSettings: () => SettingsStore | null
  private repo: string

  constructor(
    getWindow: () => BrowserWindow | null,
    getSettings: () => SettingsStore | null,
    repo = 'extrastu/Strand',
  ) {
    this.getWindow = getWindow
    this.getSettings = getSettings
    this.repo = repo
  }

  getState(): UpdateState {
    return this.state
  }

  private broadcast(state: UpdateState): void {
    this.state = state
    const win = this.getWindow()
    if (win && !win.isDestroyed()) {
      win.webContents.send(IPC.updaterStatusChanged, state)
    }
  }

  async check(manual = false): Promise<UpdateState> {
    if (this.state.status === 'checking' || this.state.status === 'downloading') {
      return this.state
    }

    this.broadcast({ status: 'checking' })

    const currentVersion = app.getVersion()
    const url = `https://api.github.com/repos/${this.repo}/releases/latest`

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 12000)

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Strand-App',
          Accept: 'application/vnd.github.v3+json',
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout))

      if (response.status === 404) {
        const notAvailable: UpdateState = {
          status: 'not-available',
          checkedAt: new Date().toISOString(),
          currentVersion,
        }
        this.broadcast(notAvailable)
        return notAvailable
      }

      if (!response.ok) {
        throw new Error(`GitHub API returned status ${response.status}`)
      }

      const release = (await response.json()) as GitHubRelease
      const targetVersion = (release.tag_name || '').replace(/^[vV]/, '')

      if (!targetVersion) {
        throw new Error('Invalid release payload: missing tag_name')
      }

      if (compareVersions(targetVersion, currentVersion) > 0) {
        const bestAsset = findBestAsset(release.assets || [])
        const info: UpdateInfo = {
          version: targetVersion,
          releaseName: release.name || `Strand v${targetVersion}`,
          releaseNotes: release.body || '',
          publishedAt: release.published_at || new Date().toISOString(),
          downloadUrl: bestAsset ? bestAsset.browser_download_url : release.html_url,
          releaseUrl: release.html_url,
          assetName: bestAsset?.name || `Strand-${targetVersion}.dmg`,
          assetSize: bestAsset?.size || 0,
        }

        const availableState: UpdateState = { status: 'available', info }
        this.broadcast(availableState)
        return availableState
      }

      const upToDateState: UpdateState = {
        status: 'not-available',
        checkedAt: new Date().toISOString(),
        currentVersion,
      }
      this.broadcast(upToDateState)
      return upToDateState
    } catch (err) {
      const message =
        err instanceof Error
          ? err.name === 'AbortError'
            ? 'Connection timed out'
            : err.message
          : String(err)
      const errorState: UpdateState = { status: 'error', message }
      this.broadcast(errorState)
      return errorState
    }
  }

  async download(): Promise<void> {
    if (this.state.status !== 'available') {
      throw new Error('No update available to download')
    }

    const { info } = this.state

    // If downloadUrl is not a direct binary asset, redirect to browser
    if (!info.downloadUrl.endsWith('.dmg') && !info.downloadUrl.endsWith('.zip')) {
      await shell.openExternal(info.downloadUrl)
      return
    }

    const tempDir = app.getPath('temp')
    const destPath = path.join(tempDir, info.assetName)
    const partPath = `${destPath}.download`

    this.broadcast({
      status: 'downloading',
      info,
      percent: 0,
      transferred: 0,
      total: info.assetSize,
    })

    try {
      const response = await fetch(info.downloadUrl, {
        headers: {
          'User-Agent': 'Strand-App',
        },
      })

      if (!response.ok || !response.body) {
        throw new Error(`Download failed with status ${response.status}`)
      }

      const totalHeader = response.headers.get('content-length')
      const total = totalHeader ? parseInt(totalHeader, 10) : info.assetSize
      let transferred = 0
      let lastReport = 0

      const fileStream = fs.createWriteStream(partPath)

      for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) {
        fileStream.write(chunk)
        transferred += chunk.length
        const now = Date.now()
        if (now - lastReport > 200 || transferred >= total) {
          lastReport = now
          const percent = total > 0 ? Math.min(100, Math.round((transferred / total) * 100)) : 0
          this.broadcast({
            status: 'downloading',
            info,
            percent,
            transferred,
            total,
          })
        }
      }

      await new Promise<void>((resolve, reject) => {
        fileStream.end((err: Error | null) => (err ? reject(err) : resolve()))
      })

      fs.renameSync(partPath, destPath)

      // Automatically install the update in-place
      await this.applyUpdate(destPath, info)
    } catch (err) {
      try {
        if (fs.existsSync(partPath)) fs.unlinkSync(partPath)
      } catch {
        // best effort cleanup
      }
      const message = err instanceof Error ? err.message : String(err)
      this.broadcast({ status: 'error', message })
      throw err
    }
  }

  async install(): Promise<void> {
    if (this.state.status === 'downloaded') {
      await this.applyUpdate(this.state.filePath, this.state.info)
    }
  }

  restart(): void {
    app.relaunch()
    app.exit(0)
  }

  private async applyUpdate(filePath: string, info: UpdateInfo): Promise<void> {
    this.broadcast({ status: 'installing', info })

    if (process.platform !== 'darwin') {
      this.broadcast({ status: 'downloaded', info, filePath })
      return
    }

    if (!app.isPackaged) {
      // In development mode, simulate successful installation
      this.broadcast({ status: 'ready-to-restart', info })
      return
    }

    const currentAppBundle = path.resolve(process.execPath, '../../..')
    if (!currentAppBundle.endsWith('.app') || !fs.existsSync(currentAppBundle)) {
      this.broadcast({ status: 'downloaded', info, filePath })
      return
    }

    const stagingDir = path.join(app.getPath('temp'), `strand-staging-${Date.now()}`)
    fs.mkdirSync(stagingDir, { recursive: true })

    try {
      if (filePath.endsWith('.zip')) {
        execFileSync('/usr/bin/ditto', ['-x', '-k', filePath, stagingDir])
      } else if (filePath.endsWith('.dmg')) {
        const mountPoint = path.join(app.getPath('temp'), `strand-mount-${Date.now()}`)
        fs.mkdirSync(mountPoint, { recursive: true })
        try {
          execFileSync('hdiutil', ['attach', '-nobrowse', '-readonly', '-mountpoint', mountPoint, filePath])
          const mountedApp = path.join(mountPoint, 'Strand.app')
          if (!fs.existsSync(mountedApp)) {
            throw new Error('Strand.app not found inside DMG')
          }
          execFileSync('/usr/bin/ditto', [mountedApp, path.join(stagingDir, 'Strand.app')])
        } finally {
          try {
            execFileSync('hdiutil', ['detach', mountPoint])
            fs.rmSync(mountPoint, { recursive: true, force: true })
          } catch {
            // ignore unmount errors
          }
        }
      } else {
        throw new Error(`Unsupported update archive format: ${filePath}`)
      }

      const extractedApp = path.join(stagingDir, 'Strand.app')
      if (!fs.existsSync(extractedApp)) {
        throw new Error('Strand.app not found in update archive')
      }

      const appParentDir = path.dirname(currentAppBundle)
      const preparedNewApp = path.join(appParentDir, `.Strand-new-${Date.now()}.app`)
      const backupApp = path.join(appParentDir, `.Strand-old-${Date.now()}.app`)

      // Copy from temp into destination parent folder with ditto (same filesystem guarantees atomic rename)
      execFileSync('/usr/bin/ditto', [extractedApp, preparedNewApp])

      // Atomic swap
      fs.renameSync(currentAppBundle, backupApp)
      try {
        fs.renameSync(preparedNewApp, currentAppBundle)
      } catch (swapErr) {
        if (fs.existsSync(backupApp) && !fs.existsSync(currentAppBundle)) {
          fs.renameSync(backupApp, currentAppBundle)
        }
        throw swapErr
      }

      // Cleanup
      try {
        fs.rmSync(backupApp, { recursive: true, force: true })
        fs.rmSync(stagingDir, { recursive: true, force: true })
        fs.unlinkSync(filePath)
      } catch {
        // best effort cleanup
      }

      this.broadcast({ status: 'ready-to-restart', info })
    } catch {
      try {
        fs.rmSync(stagingDir, { recursive: true, force: true })
      } catch {
        // ignore
      }
      // If auto-install failed (e.g. read-only permissions in /Applications),
      // fallback to 'downloaded' so user can open the installer manually
      this.broadcast({ status: 'downloaded', info, filePath })
    }
  }

  async openReleasePage(): Promise<void> {
    if (
      this.state.status === 'available' ||
      this.state.status === 'downloading' ||
      this.state.status === 'downloaded'
    ) {
      await shell.openExternal(this.state.info.releaseUrl)
    } else {
      await shell.openExternal(`https://github.com/${this.repo}/releases`)
    }
  }

  startAutoCheck(delayMs = 3000): void {
    setTimeout(() => {
      const settings = this.getSettings()
      if (settings && settings.get().autoCheckUpdates === false) {
        return
      }
      void this.check(false)
    }, delayMs)
  }
}

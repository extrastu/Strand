// Packages the already-built app (out/) into release/Strand-darwin-<arch>/Strand.app for local use.
// Can also build DMG and ZIP distribution files with --dmg, --zip, or --all flags.
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, rmSync, symlinkSync } from 'node:fs'
import { packager } from '@electron/packager'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const version = pkg.version ?? '0.2.1'
const appName = pkg.productName ?? 'Strand'
const arch = process.arch === 'arm64' ? 'arm64' : 'x64'

const buildDmg = process.argv.includes('--dmg') || process.argv.includes('--all')
const buildZip = process.argv.includes('--zip') || process.argv.includes('--all')

// Only the bundled output and package.json are shipped: every dependency is bundled into out/ already.
const keep = (p) => p === '/package.json' || p === '/out' || p.startsWith('/out/')

const paths = await packager({
  dir: '.',
  name: appName,
  out: 'release',
  platform: 'darwin',
  arch,
  icon: 'build/icon.icns',
  appBundleId: 'app.strand.mac',
  appCategoryType: 'public.app-category.social-networking',
  overwrite: true,
  asar: true,
  prune: false,
  ignore: (p) => p !== '' && !keep(p),
})

// Renaming the bundle and rewriting its Info.plist leave Electron's own signature unsealed. Seal the
// whole bundle with an ad-hoc signature (no developer identity), which is what Apple Silicon needs to run it.
for (const dir of paths) {
  const app = `${dir}/${appName}.app`
  try {
    copyFileSync('build/icon.icns', `${app}/Contents/Resources/electron.icns`)
  } catch (err) {
    console.warn(`could not copy icon: ${err.message}`)
  }
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'inherit' })
  execFileSync('codesign', ['--verify', '--deep', '--strict', app], { stdio: 'inherit' })
  console.log(`signed (ad hoc) and verified: ${app}`)

  if (buildZip) {
    console.log(`Creating ZIP archive for ${appName}...`)
    const zipName = `${appName}-${version}-darwin-${arch}.zip`
    const zipPath = `release/${zipName}`
    rmSync(zipPath, { force: true })
    execFileSync('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', app, zipPath])
    console.log(`ZIP created: ${zipPath}`)
  }

  if (buildDmg) {
    console.log(`Creating DMG installer for ${appName}...`)
    const dmgName = `${appName}-${version}-darwin-${arch}.dmg`
    const dmgPath = `release/${dmgName}`
    const stagingDir = `release/.tmp-${appName}-dmg`

    rmSync(dmgPath, { force: true })
    rmSync(stagingDir, { recursive: true, force: true })
    mkdirSync(stagingDir, { recursive: true })

    // Copy app preserving all attributes and create /Applications drag-and-drop link
    execFileSync('ditto', [app, `${stagingDir}/${appName}.app`])
    symlinkSync('/Applications', `${stagingDir}/Applications`)

    // Set custom volume icon if available
    try {
      copyFileSync('build/icon.icns', `${stagingDir}/.VolumeIcon.icns`)
      execFileSync('SetFile', ['-a', 'C', stagingDir])
    } catch {
      // Ignore if SetFile is unavailable
    }

    execFileSync(
      'hdiutil',
      [
        'create',
        '-volname',
        appName,
        '-srcfolder',
        stagingDir,
        '-ov',
        '-format',
        'UDZO',
        '-imagekey',
        'zlib-level=9',
        dmgPath,
      ],
      { stdio: 'inherit' },
    )

    rmSync(stagingDir, { recursive: true, force: true })
    console.log(`DMG created: ${dmgPath}`)
  }
}

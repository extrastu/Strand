// Packages the already-built app (out/) into release/Strand-darwin-<arch>/Strand.app for local use.
// Run through `npm run package`, which builds first. Not notarized: fine on the machine that built it.
import { execFileSync } from 'node:child_process'
import { copyFileSync } from 'node:fs'
import { packager } from '@electron/packager'

// Only the bundled output and package.json are shipped: every dependency is bundled into out/ already.
const keep = (p) => p === '/package.json' || p === '/out' || p.startsWith('/out/')

const paths = await packager({
  dir: '.',
  name: 'Strand',
  out: 'release',
  platform: 'darwin',
  arch: process.arch === 'arm64' ? 'arm64' : 'x64',
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
  const app = `${dir}/Strand.app`
  try {
    copyFileSync('build/icon.icns', `${app}/Contents/Resources/electron.icns`)
  } catch (err) {
    console.warn(`could not copy icon: ${err.message}`)
  }
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'inherit' })
  execFileSync('codesign', ['--verify', '--deep', '--strict', app], { stdio: 'inherit' })
  console.log(`signed (ad hoc) and verified: ${app}`)
}

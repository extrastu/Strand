// Decides which directory holds the app's user data (accounts and logins) after a rename.
// Electron derives it from the app name, so a new name would otherwise start from an empty folder.
import nodeFs from 'node:fs'
import path from 'node:path'

/**
 * Returns the directory to use as userData. If only an old-name directory exists it is moved to the
 * new name; if that move fails the old directory keeps being used. Data is never overwritten.
 */
export function resolveUserDataDir(
  appData: string,
  currentName: string,
  legacyNames: string[],
  fs: typeof nodeFs = nodeFs,
): string {
  const current = path.join(appData, currentName)
  if (fs.existsSync(current)) return current
  for (const name of legacyNames) {
    const legacy = path.join(appData, name)
    if (!fs.existsSync(legacy)) continue
    try {
      fs.renameSync(legacy, current)
      return current
    } catch {
      return legacy // could not move it (for example another volume): keep using it where it is
    }
  }
  return current
}

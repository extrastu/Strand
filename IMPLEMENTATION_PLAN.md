STATUS: in-progress

# Implementation plan — settings dialog (theme, language, about)

Branch `refactor/ts-shadcn-ui`; behavior baseline is `1ba1f98`. Spec: `PROMPT.md`.

## Next
1. `/verify` (adversarial pass) before any commit.
2. User manual check: open Settings from the sidebar, switch theme and language, restart and confirm both are remembered, read the About text.

## Done
- Settings dialog (uncommitted): sidebar "设置" row pinned to the bottom; dialog with a section list (通用 / 关于, Up / Down keys, roving tabindex), theme as three icon cards (system / light / dark), language as a Select (简体中文 / English), About (icon, name, version from the app, description, Electron / Chromium, unofficial notice).
- Theme goes through `nativeTheme.themeSource` in the main process, persisted in `settings.json`; verified live: the renderer class, the renderer media query and an account page's `prefers-color-scheme` all change at once, and survive a relaunch.
- Language: typed dictionaries `zh-CN` / `en` (no library), `t()` through the store, `<html lang>` follows; every UI string moved; first-run default from `app.getLocale()`; verified live in both languages (settings dialog, account dialog, delete confirmation, empty-name error, toast, close label) and across a relaunch.
- Tests: 53 pass (34 before; 12 settings store, 2 locale, 5 i18n guards: key parity, no empty entries, placeholder parity, no CJK in `en`, no CJK in the renderer source outside the allowed i18n files).
- Found by screenshot: a selected personal account's avatar circle had the same color as the selected row; avatar background is now a translucent foreground tint.
- shadcn: Select added through the CLI; its generated `cn` import (it resolved to an unrelated npm package) was fixed again and the stray dependency removed; no net change to package.json. Root `tsconfig.json` now has `paths`, so the CLI resolves `@/` correctly.
- Not covered: the first-run language default against a real non-Chinese / Chinese system locale (unit-tested mapping only); Cmd+, shortcut (out of scope, so settings are unreachable while the sidebar is hidden).
- Baseline up to `1ba1f98`: accounts shell, TypeScript / React / shadcn / Zustand / lucide rebuild, Claude-desktop layout in the Threads black-and-white palette, app icon (two overlapping circles), renamed to Strand with the user-data migration.

- First `/verify` pass on the settings feature (10 findings): fixed the settings store so only fields the user chose are written (a theme change no longer freezes the system-derived language), JSON of the wrong shape is backed up like corrupt JSON, a settings or accounts read error at startup shows an error box and quits instead of leaving a windowless app, the UI waits for the saved language so a guessed one never flashes, a settings load failure and a missing About info are visible, the repaired account name is now a neutral "—" instead of a hard-coded Chinese word in `main`, the unused DialogFooter close label goes through the dictionary, and the CJK guard now covers kana, hangul, compatibility ideographs and `\u` escapes in all of `src` (not only the renderer), with its own test. One existing assertion changed on purpose: the repaired-name expectation in `accounts.test.ts` ("未命名" became "—") because of that hard-coded string. 57 tests pass.
- Left as is: the window title is the brand name plus the account name, so it needs no translation (spec wording clarified); picking the language that is already shown in the Select fires no event, so it does not record an explicit choice (matters only if the system language later changes).

- Local packaging (uncommitted): `npm run package` builds and then runs `scripts/package.mjs` with `@electron/packager` (new dev dependency; chosen over electron-builder because it only turns the built `out/` into an app and nothing else is needed for local use). Output: `app/release/Strand-darwin-<arch>/Strand.app` (git-ignored, 234 MB). Everything is bundled into `out/`, so only `package.json` and `out/` go into the asar. Electron's signature is not valid after the bundle is renamed, so the script ad-hoc signs the whole bundle (`codesign --force --deep --sign -`) and verifies it (identifier `app.strand.mac`); without that step `codesign --verify` failed. The Dock icon call in dev is skipped when packaged (the icon comes from `icon.icns`, which is byte-identical to `build/icon.icns`; the packager's ".icon" warning is only about the newer format and is harmless).
- Checked on the packaged app, on a throwaway profile: it starts from the asar, window title and process name "Strand", the typed bridge is present, About shows version 0.2.0 and the 1024px icon, the strict CSP is in the page, adding an account works. Not checked: the Dock tile and Finder icon by eye, a run against the real data (the first real launch performs the ThreadsMac to Strand move), Gatekeeper behavior for a quarantined copy.
- Not done: notarization, a DMG, a universal binary, auto-update.

## Known open issues / deliberate choices carried over
- Fallback after removing the active account is the first remaining account.
- Subframe navigations are not blocked; `about:blank` popups and non-http(s) schemes are dropped.
- Real accounts have only been exercised by the user, never by the test runs; the Strand data migration has not run against the real data yet (the first real launch does it).
- In dev the menu bar and Dock label say "Electron" (Electron.app's Info.plist).
- `-webkit-app-region` did not move the window; keep the manual IPC drag.
- Do not `pkill` by a generic Electron pattern while testing: the user may be running their own instance.

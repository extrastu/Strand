# PROMPT.md — Strand: settings dialog with theme, language and about

Behavior baseline: commit `1ba1f98` (`git show 1ba1f98:PROMPT.md` is the previous spec). Everything that spec requires still holds: accounts, isolated sessions, link policy, collapse, drag, security, contrast, the black-and-white palette on Claude desktop's layout and shapes. This feature adds to it.

## Goal

A "设置 / Settings" entry at the bottom of the sidebar opens a settings dialog with two sections: **General** (theme: system / light / dark; language: 简体中文 / English) and **About**. Changing either takes effect immediately, is remembered across launches, and the whole UI follows the chosen language.

## Done when

1. **Entry.** The sidebar gets a "设置" row pinned to its bottom (gear icon, same row style as the other sidebar rows). Clicking it opens the settings dialog. (Not in this feature: a Cmd+, shortcut or an app-menu item. The entry is in the sidebar only, so it is unreachable while the sidebar is hidden.)
2. **Dialog.** A wide dialog (about 640px) in the existing style: a left list with "通用" and "关于", content on the right. It opens on General. Escape and the close button dismiss it. While it is open the account page is hidden, exactly as for the other dialogs (the existing overlay mechanism); no stuck-hidden account page afterwards.
3. **Theme.** Three choices: follow system, light, dark. It is applied with Electron's `nativeTheme.themeSource`, so the renderer's `prefers-color-scheme`, the window chrome and the account pages (Threads honors `prefers-color-scheme`) all follow it. "Follow system" keeps tracking the OS appearance live. Persisted in the main process.
4. **Language.** Two choices: 简体中文 and English. On first run the default is chosen from the system locale (any `zh` locale gives 简体中文, everything else English); after the user picks one, that choice wins. Persisted in the main process. Switching re-renders the UI at once, without a restart, and sets `<html lang>`.
5. **Everything is translated.** No user-visible string stays hard-coded: sidebar, title bar, account dialog, remove confirmation, row menu, empty state, toasts, tooltips and aria-labels, the type labels, the settings dialog itself. (The window title is the brand name "Strand" plus the account name, so nothing in it needs translating; clarified after the first verification pass.) A small typed dictionary module (`zh-CN`, `en`), no new dependency. A test fails if the two dictionaries differ in keys, and a test fails if a CJK character appears in `src/renderer/src` outside the `zh-CN` dictionary.
6. **About.** Shows the app icon, "Strand", the version (from the app, not hard-coded), a one-line description, the Electron and Chromium versions in small muted text, and an unofficial notice: not affiliated with or endorsed by Meta or Threads. No links.
7. **Persistence.** A `settings.json` next to `accounts.json` in the userData folder: `{ theme, language }`, validated on read (unknown values fall back to defaults, a corrupt file is backed up as `.corrupt` and defaults are used, a read error other than missing/corrupt throws), written atomically, mutations roll back if the write fails. Same discipline as the accounts store. No credentials.
8. **IPC.** `settings:get` and `settings:set` (partial `{ theme?, language? }`), typed in `src/shared`, same sender check and input validation as the existing handlers; an invalid value is rejected, the stored value stays.
9. **State.** The renderer keeps settings in the existing Zustand store (selector use only, no Context). Dialog state gains a `settings` kind.
10. **shadcn.** Added through the CLI, only what is needed (expected: Select for the language, RadioGroup or ToggleGroup for the theme). No new package: `radix-ui` already covers them.
11. **Design.** Same language as the rest: Threads black-and-white palette, Claude desktop layout, 12px controls, 20px dialog, serif dialog title, circular icon buttons, text contrast at least 4.5:1 in both themes (recomputed for any new color pair), focus rings, keyboard reachable (Tab order, Escape, arrow keys in the section list and the radio group). Reviewed by CDP screenshots of the settings dialog in light and dark, in both languages, on General and About, and of the sidebar with the new row.
12. **Tests.** `npm run typecheck`, `npm test`, `npm run build` exit 0. New tests: settings store (defaults, validation, corrupt file, read error, rollback on failed write, persistence across instances), locale-to-default-language mapping, dictionary key parity, no hard-coded CJK outside `zh-CN`. The existing 34 tests stay green, none weakened.
13. **Manual check by the user**: open settings, switch theme and language, restart, confirm both are remembered; check the About text.

## Never touch

- Account-view behavior (partitions, user agent, link policy, no injection into Threads pages, no scraping, no Threads or Meta API calls). The UI language does not change the language of the Threads pages.
- The userData migration (`resolveUserDataDir`) and its tests.
- No dependency beyond the current set. No i18n library.
- Not in this feature: Cmd+, / app menu, "follow system" as a language option, more languages, drafts, snippets, publish history, quick post, packaging.
- No credentials in code or files.

## Stop if

- `nativeTheme.themeSource` does not reach the account pages or the renderer in a way that makes "follow system" track live: stop and report before building a workaround.
- Translating the UI needs a library or changes to the account-view code: stop and report.
- A baseline test has to be weakened or deleted to go green.

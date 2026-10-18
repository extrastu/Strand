# PROMPT.md — Threads Mac client: multi-account shell (MVP, feature 1 of 1)

Supersedes the WebView spike spec. The spike (`spike/`) proved isolated per-account sessions and account switching work; see `spike/RESULTS.md`.

## Goal

A macOS Electron app where I keep my personal and creator Threads accounts logged in side by side in one window, and switch between them from a sidebar.

## Done when

All of these hold, in a new `app/` directory (leave `spike/` as is):

1. `cd app && npm start` opens one window: a sidebar on the left listing accounts, the selected account's Threads page on the right.
2. **Add account**: asks for a display name and a type (个人 / 创作者). It creates a new isolated session `persist:acct-<id>` and loads `https://www.threads.com/login` (the Threads-account login, not the Instagram-only landing page).
3. **Switch**: clicking an account shows its page. Other accounts' pages stay loaded in the background, so switching does not reload or log out.
4. **Persist**: after quit and relaunch, the account list, each account's type, the last active account, and every login are still there. Account metadata lives in a JSON file under `app.getPath('userData')`; no credentials, tokens or cookies are written by our code.
5. **Isolation**: two accounts logged in at once never share cookies or login state.
6. **Manage**: rename an account, change its type, remove it. Removing asks for confirmation and clears that account's session storage.
7. **Links**: any navigation or `window.open` to a host outside threads.com / threads.net / instagram.com / facebook.com opens in the default browser, not inside the app.
8. `cd app && npm test` is green. It covers the account store logic (add, rename, retype, remove, persist/load, last-active fallback when the active account is removed, corrupt or missing file) with `node:test`, no extra dependencies.
9. Manual check by the user: items 2–6 above, with two real accounts.

## Never touch

- `spike/` (read-only reference).
- No Threads/Meta API calls, no Meta developer app.
- No DOM injection into Threads pages, no auto-clicking, no scraping, no network interception.
- Not in this feature: quick-post window, global shortcut, drafts, text snippets, publish history, scheduling.
- No dependency beyond `electron` (dev). No credentials in code or files.

## Stop if

- Meta blocks login in the embedded view and a normal Chrome user agent does not fix it: record it and stop.
- More than 8 source files are needed, or anything outside `app/`, `PROMPT.md`, `IMPLEMENTATION_PLAN.md` has to change.
- A test has to be weakened or deleted to go green.

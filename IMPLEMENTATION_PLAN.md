STATUS: in-progress

# Implementation plan — multi-account shell

## Done
- Spike (`spike/`): isolated sessions and switching confirmed; login entry is `threads.com/login`.
- `app/src/accounts.js`: account store (transactional mutations with rollback, atomic update, load repair for bad names / duplicate / unsafe ids, corrupt-file backup, non-parse read errors throw). 20 tests in `app/test/accounts.test.js`, `npm test` green.
- `app/src/main.js`, `preload.js`, `sidebar.html`: window with sidebar + one lazily created `WebContentsView` per account (`persist:acct-<id>`), external-link guard on navigate/redirect/window.open, sidebar page locked down, IPC accepted only from the sidebar's main frame, remove-account confirms and clears session storage.
- After the user's first manual trial: per-row 复制 button (copies the account's display name via the main process clipboard, with a toast), and a collapsible sidebar (240px <-> 72px rail, remembered in localStorage). Click on a row still switches.
- External links: five paths (window.open, target=_blank, same-tab link, location.href, noopener) all reach the default browser and leave the account view on threads.com (checked against a local logger).
- Smoke-tested through the debug protocol with a throwaway profile: add, switch, update, persistence across relaunch, lazy view creation, sidebar navigation blocked.

- Window drag: `-webkit-app-region` did not move the window (the user could not drag even with the full-width top bar; synthetic events cannot drive web drag regions, so that could not be reproduced that way). Replaced by manual dragging: the sidebar header strip and the 38px top bar track pointer movement and ask the main process (IPC `window:drag-start` / `window:drag-move`, sidebar-only) to move the window. Verified by posting real mouse events and reading the native window position through System Events: both strips move the window, the Threads page and sidebar list do not.

## Next
1. Manual check by the user with two real accounts: login at `threads.com/login`, switch, relaunch, remove (confirmation + logout), external links open in the default browser.
2. `/verify` has not passed yet: two adversarial passes each found issues; the real ones were fixed. Copy button and collapse were added after the last pass, so a fresh pass is pending.
3. Link shims: user reported a blank in-app page plus the browser opening for real post links (Threads wraps them in `l.threads.com/?u=...`). Fixed by `app/src/links.js` (unwraps `u`, opens the real URL externally, never loads the shim; goes back if a shim page was left on screen) with 9 tests; verified end to end with a local logger. Still to confirm on a real post by the user.

## Known open issues / deliberate choices
- Fallback after removing the active account is the first remaining account (spec wording "last-active" read loosely).
- Subframe navigations are not blocked (login/captcha embeds third-party frames).
- `window.open('about:blank')` popups and non-http(s) schemes (mailto:, tel:) are dropped, not forwarded.
- Not in this feature: quick post, drafts, snippets, publish history.

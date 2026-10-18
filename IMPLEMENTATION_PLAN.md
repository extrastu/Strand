STATUS: in-progress

# Implementation plan — TS + React + shadcn + Zustand + lucide rebuild

Work on a new branch (e.g. `refactor/ts-shadcn-ui`) cut from `feat/multi-account-shell` (`8c4aa95` is the behavior baseline).

## Done
- Baseline multi-account shell committed (`8c4aa95`).
- Rebuild on `refactor/ts-shadcn-ui` (uncommitted): electron-vite + React 19 + TS strict, Tailwind 4, shadcn (radix) components, Zustand store, lucide icons, Threads light/dark tokens. `typecheck`, `test` (29 ported cases, assertions intact), `build` exit 0; `npm run dev` starts with HMR.
- Verified against a throwaway profile through the debug protocol: typed bridge, add / edit / remove (AlertDialog, view destroyed, session cleared, active falls back), persistence across relaunch, lazy views, collapse (240/72, geometry), account pages hidden while a dialog is open, copy + toast (36px pill inside the 44px strip), real-mouse window drag (sidebar strip and top bar move the window; page and list do not), 6 external-link paths incl. `l.threads.com` shims. CDP screenshots reviewed in light and dark for: empty state, add dialog, list, row menu, remove confirmation, collapsed rail, toast.
- Design deviations from the spec text, on purpose: secondary text is #6b6b6b / #8d8d8d (spec said #777; that only reaches 4.5:1 on white and 4.2:1 on #101010); top bar is 44px (was 38).

- First `/verify` pass (14 findings): fixed the real ones: removal vs. dialog-close race (no view is recreated for an account mid-removal), overlay flag and sidebar width reset when the renderer reloads, overlay IPC failures surfaced, double-click delete guarded in the store, init failure no longer shows "no accounts", collapse state always pushed to main on load, menu shadow removed, dialog radius 16px, icon buttons 44px, badge text contrast raised to >= 6.4:1 (computed).
- Left as is on purpose: toast state lives in Sonner, not in the Zustand store (spec wording says the store holds it; moving it would add code for no behavior); the app page may "navigate" to its own URL (reload) but nothing else; the dev server page has no CSP (Vite HMR needs inline scripts; production has the strict CSP); `shadcn` is a devDependency only for `shadcn/tailwind.css`, which the generated components' `data-open:` / `data-checked:` variants need (state it in the commit body); Electron stays at ^33.

- User feedback after a manual trial: toggle moves to the title bar next to the traffic lights; collapsing hides the whole sidebar (no rail); fix the heavy focus ring on rows and rows/ellipsis overflowing the sidebar (Radix ScrollArea widened its content). Spec updated accordingly.

- User feedback after the commit `3088667`: icon-button hover must be a true circle (the 44px circle was flush with the title bar edges) and the whole UI should follow the Claude desktop design language. Spec item 8 rewritten and implemented on top of the commit (uncommitted): warm paper tokens (light and dark), terracotta primary and focus ring, serif display headings, 12px buttons and 20px dialogs, 32px circular icon buttons with a 44px invisible hit area (hover circle no longer touches the title bar edges), Claude-style top "添加账号" row, quieter rows with the check on the avatar, soft shadows only on floating surfaces. Contrast recomputed for the final tokens: 30 text/surface pairs, minimum 4.63:1. Regression smoke passed (add, edit, delete, hide/show, geometry, real-mouse drag, toggle click). Screenshots reviewed in light and dark: empty state, list, hover on the toggle, add dialog. Then the user asked for the Threads black-and-white palette back (layout and interaction stay Claude-desktop): tokens are now white / #101010 with a black (dark: white) primary and the Threads blue only on focus rings; secondary text #666666 / #999999. Contrast recomputed: 28 text/surface pairs, all >= 4.5:1 (the first draft failed dark muted-on-selected at 4.32, fixed). Light and dark screenshots reviewed: empty state, list, add dialog. Remove confirmation and the row menu were not re-screenshotted after the restyle.

## Next
1. `/verify` again on the latest changes before any commit (title bar toggle, hide-sidebar collapse and the row layout changed after the first pass).
2. User manual check with two real accounts: login at `threads.com/login`, switch, remove, real post links, drag, light and dark.

## Known open issues / deliberate choices carried over
- Fallback after removing the active account is the first remaining account.
- Subframe navigations are not blocked; `about:blank` popups and non-http(s) schemes are dropped.
- Link shims, account removal and the confirmation dialog were never tested against real accounts.
- Pitfall from the baseline: `-webkit-app-region` did not move the window; keep the manual IPC drag.
- Do not `pkill` by a generic Electron pattern while testing: the user may be running their own instance.

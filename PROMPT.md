# PROMPT.md — Rebuild the app in TypeScript + React + shadcn/ui + Zustand + lucide, Threads look

Supersedes the multi-account shell spec (committed as `8c4aa95`; it stays the behavior baseline).

## Goal

The same multi-account Threads shell, rebuilt in TypeScript with a React renderer (shadcn/ui, Zustand, lucide-react), designed to look and feel like Threads. No new features.

## Done when

1. **Stack.** `app/` is an electron-vite project (main, preload, renderer), TypeScript `strict`, React, Tailwind, shadcn/ui components, Zustand, lucide-react. `npm run typecheck`, `npm test` and `npm run build` all exit 0; `npm run dev` starts the app with HMR; `npm start` runs the built app.
2. **Behavior parity.** Everything the baseline did still works, checked by smoke test and by the user:
   add / rename / retype / remove accounts (removal confirms and clears that account's session storage); isolated `persist:acct-<id>` sessions with lazily created, kept-alive views; metadata persisted in `userData/accounts.json` with no credentials; last active account restored; login entry `https://www.threads.com/login`; Chrome UA; external links to the default browser including `l.threads.com` shims; copy-account-name with toast; collapsible sidebar (240 / hidden entirely: width 0, no rail, no account list; the account page then fills the window); window dragging by the top strips (manual IPC drag, not `-webkit-app-region`); top bar showing the active account.
3. **State.** One Zustand store in the renderer holds accounts, active id, collapsed flag and toast state; components read it through selectors. No React Context for app state, no prop-drilled account data beyond a row component's own props.
4. **Typed IPC.** Request/response and state types live in `src/shared/`, imported by main, preload and renderer. The preload exposes one typed API object. Main keeps the baseline guards: only the sidebar main frame may call, inputs validated, sidebar page cannot navigate or open windows.
5. **Logic ported, tests kept.** The account store and link classification move to TypeScript. All 29 baseline test cases are ported (Vitest) with their assertions intact (none weakened or deleted) and pass.
6. **shadcn/ui.** Built from shadcn components added through its CLI into `src/renderer/components/ui/`, using only those the UI needs (expected: Button, Input, Label, Dialog, AlertDialog, DropdownMenu, Tooltip, Avatar, Badge, ScrollArea, Sonner). Add / edit account is a Dialog; remove confirmation is an AlertDialog; per-row actions (复制 / 编辑 / 删除) live in a DropdownMenu and are also keyboard reachable.
7. **Icons.** lucide-react only. No emoji or text glyphs (‹ ›) used as icons.
8. **Threads design.** Light and dark follow the system and share one token set on `:root` / `.dark`:
   - Light: white background, near-black text (#101010); dark: #101010 background, #181818 raised surfaces, near-white text (#F3F5F7).
   - Secondary text #777; hairline dividers (about #E6E6E6 light, rgba(243,245,247,.15) dark); no drop shadows on surfaces.
   - Primary button is solid black on light and solid white on dark; secondary is outlined; fully rounded (pill) buttons and badges; 12-16px radius for dialogs and rows. Accent blue only for focus rings and links.
   - System font stack (SF Pro on macOS), 15px base, tight but airy rows, 44px minimum tap height for rows and buttons, restrained motion (150-200ms ease-out; respects `prefers-reduced-motion`).
   - Title bar row (44px, whole window width, drags the window): sidebar toggle button right of the traffic lights (macOS style), active account centered. The toggle stays in the title bar in both states.
   - Account rows: circular avatar (first character), name, quiet type badge (个人 / 创作者 in neutral tones, no orange), active row marked by a subtle surface tint plus a check or dot, not a saturated fill.
   - Reviewed by screenshots of the renderer in light and dark (Chrome DevTools Protocol capture, `prefers-color-scheme` emulated) for: populated list, empty state, collapsed rail, add dialog, remove confirmation. Findings fixed before done.
9. **A11y and quality.** Visible `:focus-visible` rings, labels on all icon-only buttons, dialogs trap and restore focus, text contrast at least 4.5:1 in both themes, no horizontal overflow at the 720px minimum window width.
10. **Security and packaging.** `contextIsolation` on, `nodeIntegration` off, renderer sandboxed (preload built as CommonJS), strict CSP on the renderer page (no `unsafe-inline` scripts, no remote assets or fonts, no CDN). Account views keep their own partitions and no preload.
11. **Manual check by the user**, with two real accounts: items 2, 8 and the external-link, remove and drag behaviors.

## Never touch

- `spike/` and git history; no force operations.
- Account-view behavior: partitions, UA, link policy, no injection into Threads pages, no auto-clicking, no scraping, no Threads/Meta API calls.
- Not in this feature: quick post, global shortcut, drafts, snippets, publish history, scheduling.
- No dependency outside this set, each justified in the commit body: electron, electron-vite, vite, @vitejs/plugin-react, react, react-dom, typescript, tailwindcss (with whatever its shadcn setup needs), shadcn's runtime deps (radix-ui, class-variance-authority, clsx, tailwind-merge, animation plugin), sonner, zustand, lucide-react, vitest, and `@types/*`.
- No credentials in code or files.

## Stop if

- A behavior listed in item 2 regresses and cannot be restored without changing the baseline's design: stop and report.
- electron-vite with a sandboxed preload cannot do what the baseline did (typed IPC, drag, collapse): stop and report instead of loosening the security items.
- A baseline test has to be weakened or deleted to go green.
- A dependency outside the allowed set looks necessary.

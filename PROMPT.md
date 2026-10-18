# PROMPT.md — Rebuild the app in TypeScript + React + shadcn/ui + Zustand + lucide, Threads look

Supersedes the multi-account shell spec (committed as `8c4aa95`; it stays the behavior baseline).

## Goal

The same multi-account Threads shell, rebuilt in TypeScript with a React renderer (shadcn/ui, Zustand, lucide-react), designed with Claude desktop's layout, shapes and interaction and Threads' black-and-white palette. No new features.

## Done when

1. **Stack.** `app/` is an electron-vite project (main, preload, renderer), TypeScript `strict`, React, Tailwind, shadcn/ui components, Zustand, lucide-react. `npm run typecheck`, `npm test` and `npm run build` all exit 0; `npm run dev` starts the app with HMR; `npm start` runs the built app.
2. **Behavior parity.** Everything the baseline did still works, checked by smoke test and by the user:
   add / rename / retype / remove accounts (removal confirms and clears that account's session storage); isolated `persist:acct-<id>` sessions with lazily created, kept-alive views; metadata persisted in `userData/accounts.json` with no credentials; last active account restored; login entry `https://www.threads.com/login`; Chrome UA; external links to the default browser including `l.threads.com` shims; copy-account-name with toast; collapsible sidebar (240 / hidden entirely: width 0, no rail, no account list; the account page then fills the window); window dragging by the top strips (manual IPC drag, not `-webkit-app-region`); top bar showing the active account.
3. **State.** One Zustand store in the renderer holds accounts, active id, collapsed flag and toast state; components read it through selectors. No React Context for app state, no prop-drilled account data beyond a row component's own props.
4. **Typed IPC.** Request/response and state types live in `src/shared/`, imported by main, preload and renderer. The preload exposes one typed API object. Main keeps the baseline guards: only the sidebar main frame may call, inputs validated, sidebar page cannot navigate or open windows.
5. **Logic ported, tests kept.** The account store and link classification move to TypeScript. All 29 baseline test cases are ported (Vitest) with their assertions intact (none weakened or deleted) and pass.
6. **shadcn/ui.** Built from shadcn components added through its CLI into `src/renderer/components/ui/`, using only those the UI needs (expected: Button, Input, Label, Dialog, AlertDialog, DropdownMenu, Tooltip, Avatar, Badge, ScrollArea, Sonner). Add / edit account is a Dialog; remove confirmation is an AlertDialog; per-row actions (复制 / 编辑 / 删除) live in a DropdownMenu and are also keyboard reachable.
7. **Icons.** lucide-react only. No emoji or text glyphs (‹ ›) used as icons.
8. **Claude desktop design language** (layout, shapes and interaction; the palette stays Threads black and white). Light and dark follow the system and share one token set on `:root` / `.dark`:
   - Threads black-and-white palette (the user wants this color scheme; layout and interaction follow Claude desktop). Light: white page and sidebar, text #101010, hairlines #E6E6E6, hover #F5F5F5, selected #ECECEC. Dark: #101010 page and sidebar, #181818 raised surfaces, text #F3F5F7, hairlines about rgba(243,245,247,.15), hover #1E1E1E, selected #2A2A2A.
   - No brand color. The primary button and the creator avatar are solid black on light and solid white on dark; the only chroma is the Threads blue (#0095F6 light, #4CB5F9 dark) on focus rings, plus a muted red for destructive actions.
   - Type: system sans for the UI at 14px; macOS serif (`ui-serif`, New York) for display headings only (dialog titles, empty state). Medium weight, not bold, for list items.
   - Shapes: text buttons and inputs 12px radius, dialogs 20px, menus 12px, badges and avatars fully round. Icon-only buttons are 32px circles whose hover/selected background is a true circle, with the 44px tap area provided by an invisible hit extension, so the circle never touches the row edges.
   - Soft warm shadows are allowed on floating surfaces (dialogs, menus, toasts) only.
   - Sidebar: an "添加账号" row at the top in the style of Claude's "New chat" (solid black / white circle with a plus, hover tint), then the account list. Rows are 52px with a 32px avatar, hover = faint tint, selected = slightly stronger tint, check badge on the avatar; the row actions button fades in on hover and overlays the row end.
   - Title bar row (44px, whole window width, drags the window): sidebar toggle right of the traffic lights, active account centered, hairline below. Toggle stays in both states.
   - Motion 150-200ms ease-out, respects `prefers-reduced-motion`.
   - Reviewed by screenshots of the renderer in light and dark (Chrome DevTools Protocol capture, `prefers-color-scheme` emulated) for: populated list, empty state, hidden sidebar, add dialog, remove confirmation, row menu, hover on an icon button. Findings fixed before done.
9. **A11y and quality.** Visible `:focus-visible` rings, labels on all icon-only buttons, dialogs trap and restore focus, text contrast at least 4.5:1 in both themes (checked by computation for every text/surface pair used), no horizontal overflow at the 720px minimum window width.
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

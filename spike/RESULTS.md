# Spike results

Automated (done by agent):
- `npm start` launches; `globalShortcut Command+Shift+Space registered: true`.
- Console shows `ffmpeg_common ... Unsupported pixel format` noise: stock Electron lacks proprietary codecs, so some Threads videos may not play. Not a blocker for posting.

Manual checks (reported by user):

| # | Check | Result | Notes |
|---|---|---|---|
| 1 | Per-account session (`persist:acct-1` / `persist:acct-2`), switching accounts | PASS | User: switching works. |
| 4 | Login friction | PASS, with a caveat | Must open `https://www.threads.com/login` to get the Threads-account login; the bare `threads.com` page only offers Instagram login. Use `/login` as the entry URL. |
| 2 | Intent prefill via `/intent/post?text=` in the quick window | DROPPED | User decided the hotkey-opens-post-page flow is not wanted. Note: `HOST` in `main.js` was changed to `.../login`, so the intent URL it builds is malformed anyway; not investigated further. |
| 3 | Hotkey floating window over another app | NOT REPORTED | Hotkey registers fine; window behaviour not confirmed. Moot if the quick window is dropped. |

## What this means

- Multi-account via isolated WebView sessions: **go**.
- Quick posting via the Threads web page: **dropped** by user, so the spike does not prove any fast-posting path.
- Without the official API, the only way to publish from this app is through the Threads web composer. Whatever replaces the dropped flow has to be decided first (see open question in the session).

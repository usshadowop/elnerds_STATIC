---
name: verify
description: Build, run, and drive this site to verify changes end-to-end.
---

# Verifying changes to elnerds.com

Static Vite + React SPA. No tests; verification = drive the page in a browser.

## Build / launch

- **In the Claude remote sandbox, use npm, not bun.** `bun install` hangs
  forever here (it ignores the agent proxy's `no_proxy`/CA config and silently
  retries TLS). `npm ci --no-audit --no-fund` works; the repo keeps
  `package-lock.json` in sync. CI (`.github/workflows/deploy.yml`) still uses bun.
- Dev server: `npm run dev -- --port <port> --strictPort` (background, log to file).
- Prod build: `npm run build` (vite build; does NOT typecheck).
- `npx tsc --noEmit` has pre-existing failures: `.PNG` (uppercase) imports in
  `src/components/site/Team.tsx`. Ignore those; only new errors matter.
- ESLint has 6 pre-existing react-refresh warnings in `src/components/ui/`.

## Driving pages

- Routes are client-side (`src/lib/router.tsx`); deep links like `/rsvp` work
  directly against the dev server.
- Playwright: `npm i playwright-core` in the scratchpad (not the repo), launch
  with `executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"`.
  The directory is version-suffixed — `/opt/pw-browsers/chromium` does not
  exist; `ls /opt/pw-browsers` if the build number has moved. Don't run
  `playwright install`.
- The sandbox Chromium can't reach the public internet (navigating to
  https://elnerds.com fails `ERR_CONNECTION_RESET`; it doesn't use the agent
  proxy). To drive the deployed build, serve it locally instead —
  `npx serve -s dist -l 4173` — after confirming with `curl` that the live
  bytes match `dist/`.
- That also means **Nunito never loads** (it comes from Google Fonts), and
  the fallback font is wider. So any width or overflow measurement is wrong
  without the real font. Fetch it with curl, which does use the proxy: the
  `fonts.googleapis.com/css2?family=Nunito…` CSS from `index.html` (send a
  Chrome User-Agent to get woff2) plus each `fonts.gstatic.com` file it
  names. Then serve them through `context.route()` and wait on
  `document.fonts.ready`. Abort every other external request.

## Game Day schedule (`/gameday`, `/gameday_holding`, home page)

The run of show comes from the sheet (`$ENDPOINT?action=gameday`) and
half of what it draws depends on the clock, so drive it with both pinned:

- Save the live payload with curl (`curl -sSL "$ENDPOINT?action=gameday" -o
  gameday.json`), start the dev server with `VITE_RSVP_ENDPOINT=$ENDPOINT`, and
  answer that request from `context.route()` with the saved JSON (plus
  `access-control-allow-origin: *`). The real rows, no Apps Script call.
- Pin the time with `page.clock.install({ time: new Date("2026-11-14T15:15:00-06:00") })`
  before `goto`, in a context with `timezoneId: "America/Chicago"`. During
  Game Day `/gameday` is the Command Center; before kickoff it is the
  countdown page, and `/gameday_holding` is the Command Center.
- Phones (below `md`, try 390px and 320px) get the timeline in
  `GamedayAgenda.tsx`. Cards are the divs with an inline `4px solid` border:
  check no card's bottom passes the next card's top, and that
  `document.documentElement.scrollWidth` equals the viewport width. Detail
  rows are `button[aria-expanded]`; open a few and check again.
- The sticky site nav (`nav.sticky`) lands in the middle of element
  screenshots of a tall section; hide it with `addStyleTag` for pictures.
- The pre-installed `playwright` package also works here
  (`require("playwright")` from any directory, `chromium.launch()` with no
  options), as an alternative to `playwright-core` with an `executablePath`.

## RSVP form (`/rsvp`)

- Needs `VITE_RSVP_ENDPOINT` (a Google Apps Script Web App URL) at dev-server
  start; without it the page shows a "Setup needed" banner.
- The form POSTs JSON as `text/plain` to that endpoint (avoids a CORS
  preflight Apps Script can't answer). The event name can be pre-filled via
  `/rsvp?event=<name>`.
- To verify without the real script, run a mock server (POST → `{"ok":true}`)
  and point `VITE_RSVP_ENDPOINT` at it. Assert the POSTed JSON body
  (`name`, `email`, `event`, `attending`, `guests`, `message`).
- Flows worth driving: empty submit (zod errors), bad email, happy path →
  "You're on the list!" screen, "Submit another" reset, server 5xx → inline
  error box, guests > 20 rejected client-side.

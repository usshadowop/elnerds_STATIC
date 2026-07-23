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
  with `executablePath: "/opt/pw-browsers/chromium"`. Don't run
  `playwright install`.

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

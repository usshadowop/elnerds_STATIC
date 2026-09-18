# Deploy pipeline

- **Status:** Live
- **Last reviewed:** 2026-09-18
- **Covers:** `.github/workflows/deploy.yml`, `package.json`, `vite.config.ts`, `public/CNAME`

## Purpose

Push to `main` → https://elnerds.com. No staging, no CI checks on pull
requests.

## Where it lives

- `.github/workflows/deploy.yml` — build + deploy jobs.
- `package.json` — the `build` script.
- `public/CNAME`, `public/.nojekyll` — custom domain and Pages behaviour.

## How it works

On push to `main` (or manual dispatch), the `build` job checks out, installs
with `bun install --frozen-lockfile`, runs `bun run build` with
`VITE_RSVP_ENDPOINT` in the environment, and uploads `dist/` as a Pages
artifact. The `deploy` job publishes it. Concurrency group `pages` with
`cancel-in-progress`, so a rapid second push supersedes the first.

The build script is `vite build && cp dist/index.html dist/404.html` — that
copy is what makes SPA deep links work on Pages.

## Decisions and gotchas

- **A green merge is not a green deploy.** The job can fail on infrastructure
  with nothing wrong in the diff — on PR #30 `setup-bun` took a 503 from
  GitHub's release CDN and never reached the build. Nothing checks PRs, so the
  only thing that catches this is verifying the live bundle hash changed after
  a merge. Re-run the failed job.
- **Deep links return HTTP 404 and that is expected.** `404.html` is a copy of
  `index.html`, so `/rsvp/bingo` serves the full app with a 404 *status* and
  the client router renders the right page. Verify deep links by response
  body or by driving a browser — never by status code.
- **CI uses bun; the Claude sandbox must use npm.** `bun install` hangs in the
  sandbox (it ignores the agent proxy's CA config and silently retries TLS).
  `package-lock.json` is kept in sync for that reason.
- `bun.lock` tarball URLs must point at `registry.npmjs.org`. The repo was
  exported from a Lovable sandbox whose lockfile pointed at a private npm
  cache, which made `bun install` hang forever outside it (fixed in PR #17).
- `vite build` does **not** typecheck. `npx tsc --noEmit` has pre-existing
  failures (uppercase `.PNG` imports in `Team.tsx`); only new errors matter.

## Manual steps and open questions

- Verifying a deploy: fetch https://elnerds.com/, extract the hashed
  `assets/index-*.js` name, and grep it for a string unique to the change. For
  `public/` assets like `/email/`, poll the URL with a cache-busting query.
- A docs-only change produces an identical bundle hash, so there's nothing to
  verify beyond the merge.

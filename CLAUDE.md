# CLAUDE.md

Static marketing/RSVP site for the Extra Life Nerds charity gaming team,
live at https://elnerds.com. Vite + React 19 + TypeScript + Tailwind v4,
managed with Bun. See README.md for the full stack and project structure.

## Commands

```bash
bun install --frozen-lockfile   # install (fast; see lockfile note below)
bun run dev                     # Vite dev server
bun run build                   # production build to dist/
bun run lint                    # ESLint
```

The `.claude/skills/verify` skill documents how to run and drive the site
end-to-end, including testing the RSVP form against a stub endpoint.

## Ship-live workflow

Pushing to `main` triggers `.github/workflows/deploy.yml` (GitHub Pages).
There are no CI checks on PRs, so build locally before merging. The
established flow for "push live":

1. Branch off latest `origin/main`, commit, push the branch.
2. Open a PR and squash-merge it (PRs #17–#22 follow this pattern).
3. Deploy takes ~1 minute. Verify by fetching https://elnerds.com/,
   extracting the hashed `assets/index-*.js` bundle name, and grepping it
   for a string unique to the change.

A merged PR is finished — restart the working branch from `origin/main`
for follow-up work (the remote branch is usually auto-deleted on merge).

## Single sources of truth

- `src/lib/rsvpEvents.ts` — per-event RSVP page config (slugs, fields,
  locations, `mapUrl` place links). The event cards in
  `src/components/site/Schedule.tsx` link here by slug and inherit
  `mapUrl` for their Directions chips.
- `apps-script/Code.gs` — the Google Apps Script RSVP backend mirrors the
  slugs and field labels from `rsvpEvents.ts`; keep them in sync when
  events change (see `apps-script/README.md`).
- Location lines follow the format "VenueName, street, city, ST zip"
  (e.g. "Improving, 3033 Excelsior Blvd #180, Minneapolis, MN 55416").

## Gotchas

- `bun.lock` tarball URLs must point at `registry.npmjs.org`. The repo was
  originally exported from a Lovable sandbox whose lockfile pointed at a
  private npm cache (`europe-west4-npm.pkg.dev/...`), which made
  `bun install` hang forever outside that sandbox. Fixed in PR #17 — if
  install ever hangs again, check the lockfile URLs first.
- `VITE_RSVP_ENDPOINT` is baked into the deploy workflow (public by
  design). Without it locally, `/rsvp` shows a "Setup needed" banner and
  submissions fail.
- `bunfig.toml` enforces a 24h supply-chain guard on new package versions;
  confirm with the user before adding any exclusion.
- Directions links: use `https://www.google.com/maps/dir/?api=1&destination=...`
  when the route should start from the visitor's location. Shared
  `maps.app.goo.gl` directions links bake in the creator's origin;
  plain place-page short links are fine for "view on map" spots.

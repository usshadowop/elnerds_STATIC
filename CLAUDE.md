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

**In the Claude remote sandbox, use npm instead**: `npm ci --no-audit
--no-fund`, then `npm run build` / `npm run dev`. `bun install` hangs
there for reasons unrelated to the lockfile fix below — it ignores the
agent proxy's CA config and silently retries TLS. `package-lock.json` is
kept in sync; CI still uses bun.

The `.claude/skills/verify` skill documents how to run and drive the site
end-to-end, including testing the RSVP form against a stub endpoint.

## Ship-live workflow

Pushing to `main` triggers `.github/workflows/deploy.yml` (GitHub Pages).
There are no CI checks on PRs, so build locally before merging. The
established flow for "push live":

1. Branch off latest `origin/main`, commit, push the branch.
2. Open a PR and squash-merge it (PRs #17–#27 follow this pattern).
3. Deploy is usually live 20–40s after the merge. Verify by fetching
   https://elnerds.com/, extracting the hashed `assets/index-*.js` bundle
   name, and grepping it for a string unique to the change. For
   `public/` assets like `/email/`, poll the URL directly with a
   cache-busting query until the new content appears.

A merged PR is finished — restart the working branch from `origin/main`
for follow-up work (the remote branch is usually auto-deleted on merge).

## Single sources of truth

- `src/lib/rsvpEvents.ts` — per-event RSVP page config (slugs, fields,
  locations, `mapUrl` place links). The event cards in
  `src/components/site/Schedule.tsx` link here by slug and inherit
  `mapUrl` for their Directions chips, plus `calendar.end` for the
  Future/Past split below.
- `src/components/site/Schedule.tsx` — one `EVENTS` array holds every
  event, past and future. **The Future/Past split is automatic**: each
  card carries an `endsAt` ISO timestamp *with a timezone offset* (CDT is
  `-05:00`, CST is `-06:00`), and once that moment passes on the
  visitor's clock the card moves to Past Events, greys out, gains a
  "Completed" badge, and drops its RSVP chip — no code change or redeploy
  needed. Events with an `rsvpSlug` inherit `endsAt` from their RSVP
  page's `calendar.end`, so their date lives in `rsvpEvents.ts` only; set
  `endsAt` explicitly on events with no RSVP page. An event with neither
  never archives. Section year labels ("2026 Future Events") are derived
  from the events in each section, not hardcoded.
- `apps-script/Code.gs` — the Google Apps Script RSVP backend mirrors the
  slugs and field labels from `rsvpEvents.ts`; keep them in sync when
  events change (see `apps-script/README.md`).
- Location lines follow the format "VenueName, street, city, ST zip"
  (e.g. "Improving, 3033 Excelsior Blvd #180, Minneapolis, MN 55416").
- `email/elnerds-announcement.html` — the announcement email. Edit only
  this file, then copy it over **both** `public/email/elnerds-announcement.html`
  and `public/email/index.html`; the two public copies are what serve
  https://elnerds.com/email/ and drift silently if you forget.
  `email/elnerds-announcement-vip.html` is a separate VIP variant that has
  to be edited alongside it (same content plus a VIP badge and greeting).

## Announcement email (Brevo)

Sent through Brevo as `info@elnerds.com`; `email/BREVO_SETUP.md` documents
the full send. Notes that cost time to work out:

- Brevo Template Language is **Pongo2** (Django-style), not a bespoke
  syntax. Defaults go through a filter — `{{ contact.FULL_NAME|default:"there" }}`.
  A bare `{{contact.X,"fallback"}}` silently fails to resolve.
- The mailing list stores the name as **`FULL_NAME`**, not Brevo's stock
  `FIRSTNAME`. Attribute names are case-sensitive, and a miss degrades
  silently to the default — every recipient gets "Hi there" (PR #27).
- There is no reliable first-word filter: `first` returns the first
  *character* of a string, `truncatewords:1` appends an ellipsis. A
  first-name greeting needs a real `FIRSTNAME` attribute in Brevo.
- Tags that exist: `{{ unsubscribe }}` (Brevo won't save a campaign
  without it) and `{{ mirror }}` ("view in browser"). There is **no**
  `{{update_profile}}` equivalent — it ships as a dead link.
- Paste via **Import a code / Rich HTML**, never the drag-and-drop
  editor, which rewrites the markup. Re-pasting HTML can regenerate the
  plain-text part and clobber hand edits to it.
- The email is deliberately light-only (`color-scheme: light only` plus
  `light` meta); Gmail mobile and Outlook.com still force their own
  inversion and no email HTML can opt out.
- Design is CSS/tables, not images — only the header logo and CMN badge
  are `<img>`, both with alt text, so it survives images-off intact.
- Free plan caps at **300 emails/day** across all campaigns.

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
  plain place-page short links are fine for "view on map" spots. The
  email's Directions chips use the `dir/` form for the same reason (PR #24).
- **SPA deep links return HTTP 404 from Pages and that is expected.** The
  `build` script copies `index.html` to `404.html` (see `package.json`),
  so `/rsvp/bingo` serves the full app with a 404 *status*; the client
  router then renders the right page. Verify deep links by checking the
  response body (or driving a browser), never by status code.
- Restarting the working branch after a merge: the remote branch is
  auto-deleted, which makes `git push --force-with-lease` fail with
  "stale info" against the local tracking ref. Run `git remote prune
  origin` first, then push normally — no force needed.

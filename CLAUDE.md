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

## Session handoff

**Read this section first; update it before you finish.** Everything else
in this file is durable knowledge about the repo. These two blocks are
*state* — what's in flight and what just happened — and they're the only
things a fresh session can't work out by reading the code.

### Open threads

A running tally of work that is **not** finished, each with the date it
started waiting. Only two kinds of entry belong here: something a human
has to do outside the repo, and a decision that's genuinely open. Ideas,
nice-to-haves and "someone should refactor this" do not — they belong in
a feature card's *Manual steps and open questions*, or nowhere.

| Since | Waiting on | What |
| --- | --- | --- |
| 2026-08-12 | Owner | Fill in the four `Gameday *` tabs in the RSVP sheet before Nov 14. They exist now, holding starter rows. Also delete the test row `newsletter-test@example.com` from the `Newsletter` tab. |
| 2026-09-18 | Owner (decision) | Should `/gameday` go in the top nav for Game Day? It's link-only today, reachable from the hero button while the marathon runs. |
| 2026-09-18 | Owner (decision) | Final-total card: keep the "Extra Life 2026 — Final Total" label and exact cents (`$3,179.74`), or drop to a bare rounded figure? |
| 2026-09-18 | Someone | `/gillette-childrens-hospital` is routed in `App.tsx` but renders an empty `<main>` and nothing links to it. Build it or delete the route. Confirmed still a stub 2026-09-24. |
| 2026-09-24 | Owner (decision) | Automate the `Covers` audit? Two manual audits this session found two real gaps the commit guard structurally cannot catch — a file missing from a card, and `use-now.ts` owned by no card. The `SessionStart` hook could diff every card's `Covers` against the repo and against what the covered code imports. Offered, not built. |
| 2026-09-24 | Owner (decision) | Should `src/App.tsx` (the route table) be covered by a card? Left uncovered deliberately — a routing card for a 20-line table is the "write a card on principle" thing the index warns against. |
| 2026-09-24 | **Owner (input)** | The "3 things" message of 2026-09-18 listed only two. The third was never named. |

Rules that keep this honest:

- **Verify before you remove a line.** Check the live thing, don't assume
  it got done — the `Code.gs` line above sat unnoticed for five weeks
  because nothing ever re-checked it.
- Keep the `Since` date from when the thread *opened*, not when you last
  touched it. Staleness should be visible at a glance.
- If a thread turns out to be permanent repo knowledge ("this always
  needs a manual redeploy"), write it into the relevant section below
  instead and drop it from here.

### Last session

Replace this each session — it describes the *previous* one only. `git
log` is the changelog; this is orientation. Five bullets is plenty.

*Session of 2026-09-24 → 09-25 (donation ticker #40–#42, badge fix #43,
newsletter signup #44, `Code.gs` redeployed):*

- **Shipped a latest-donations ticker** under the hero countdown: the 6
  newest DonorDrive donations, with a "See all donations ↓" link to
  `#donors`. The details are in `docs/features/extra-life-api.md`. Two
  things tripped it up:
  - `/donations` sends `max-age=14400`, so the hook fetches with
    `cache: "no-store"`;
  - a tap on a phone left `:hover` stuck on, which froze the strip.
- **The Donors badges squashed into ovals on phones (#43).** Any fixed-size
  icon next to text that can wrap needs `shrink-0`.
- **Shipped the newsletter signup (#44).** It saves to a `Newsletter` sheet
  tab through `Code.gs`; the owner picked that over Brevo. The card is
  `docs/features/newsletter-signup.md`.
- **The owner redeployed `Code.gs`**, closing the thread open since Aug 12.
  The first live read found Run of Show times coming back as 1899 dates.
  The `getDisplayValues()` fix is in, and the owner redeployed again
  (Version 4). The live script now matches the repo, verified 2026-09-25.
- The sandbox browser can't reach DonorDrive or Apps Script. Every check
  here stubbed those services with `page.route` against a local build, and
  the `Code.gs` handler was run in Node against fake Google services.

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
4. Update **Session handoff** above: prune anything that landed, add
   anything the work left waiting, and rewrite "Last session".
5. Update the feature's card in `docs/features/` **in the same commit** —
   see below.

## Feature cards

`docs/features/` holds one card per feature: what it does, where it lives,
how it actually works, and what was decided along the way.
`docs/features/README.md` is the index and defines the card format. Read the
card for a feature before working on it; it's there so you don't have to
re-derive a mechanism from the code.

**Working on a feature includes updating its card, in the same commit.** A
card that lies about the code is worse than no card, so this is enforced
rather than trusted:

- Each card declares the paths it owns on its `**Covers:**` line.
- `.claude/hooks/feature-card-guard.sh` (a `PreToolUse` hook on `Bash`,
  wired in `.claude/settings.json`) **blocks a `git commit`** that stages a
  file a card covers without staging that card, and names the card. For a
  change no card describes — a lockfile bump, a typo, the cards themselves
  — put `no-card` in the commit message and it goes through.
- `.claude/hooks/feature-card-report.sh` (a `SessionStart` hook) lists
  cards not reviewed in 90+ days, so features nobody has touched still
  resurface.

When you review a card and it's still accurate, bump **Last reviewed**
anyway — that's the signal someone looked, and it's what keeps the 90-day
report meaningful. Not every feature needs a card: write one when a
feature grows a mechanism worth explaining, not on principle.

**A green merge is not a green deploy.** The deploy job can fail on
infrastructure with nothing wrong in the diff (on PR #30 `setup-bun` took
a 503 from GitHub's release CDN and never reached the build). Since
nothing checks PRs, the bundle-hash check in step 3 is the only thing that
catches it — if the hash doesn't change, look at the workflow run and
re-run failed jobs.

A merged PR is finished — restart the working branch from `origin/main`
for follow-up work (the remote branch is usually auto-deleted on merge).
If the branch still holds commits that were squash-merged under different
SHAs, rebase it onto the new `main` (`git rebase --onto origin/main
<last-merged-commit>`) or GitHub will report conflicts on content that is
already there.

## Single sources of truth

- `src/lib/rsvpEvents.ts` — per-event RSVP page config (slugs, fields,
  locations, `mapUrl` place links). The event cards in
  `src/components/site/Schedule.tsx` link here by slug and inherit
  `mapUrl` for their Directions chips, plus `calendar.end` for the
  Future/Past split below.
- `src/lib/scheduleEvents.ts` — one `EVENTS` array holds every event, past
  and future, and feeds **both** the schedule cards
  (`src/components/site/Schedule.tsx`) and the hero pills above the
  headline (`src/components/site/Hero.tsx`). Adding an event is one entry
  here. **Everything date-driven is automatic**: each event carries an
  `endsAt` ISO timestamp *with a timezone offset* (CDT is `-05:00`, CST is
  `-06:00`), and once that moment passes on the visitor's clock the card
  moves to Past Events, greys out, gains a "Completed" badge, drops its
  RSVP chip, and its hero pill disappears — no code change or redeploy
  needed. Events with an `rsvpSlug` inherit `endsAt` from their RSVP
  page's `calendar.end`, so their date lives in `rsvpEvents.ts` only; set
  `endsAt` explicitly on events with no RSVP page. An event with neither
  never archives. Section year labels ("2026 Future Events") are derived
  from the events in each section, not hardcoded.
- A hero pill is just a `chip: { label, className, dotClassName }` on the
  event. Omit `chip` to keep an event out of the hero. The class strings
  are spelled out in full because Tailwind can't see class names
  assembled at runtime.
- `src/hooks/use-now.ts` — the shared ticking clock (default one minute)
  behind all of the above, so a page left open across an event's end
  updates without a reload.
- `src/components/site/DonationTicker.tsx` — the "Latest" donations strip
  under the countdown. The number shown (6) is set where the ticker calls
  `useExtraLifeDonations`.
- `src/pages/Newsletter.tsx` (`/newsletter`): newsletter signup, with
  `?ref=Name` pre-filling "Referred by". It posts to the RSVP endpoint with
  `type: "newsletter"`, and `Code.gs` writes it to a `Newsletter` sheet tab.
- `src/hooks/use-countdown.ts` (`useGameday`) — drives the hero card's
  three states off the marathon's `calendar.start`/`calendar.end`:
  counting down to kickoff, a "Gameday is LIVE!" 24-hour countdown plus
  the Command Center button, then the team's Extra Life total as
  "$X Raised". Nothing to switch by hand on the day.
- `src/pages/CommandCenter.tsx` (`/gameday`) — the Command Center. Its
  contents are **edited live in the RSVP spreadsheet's "Gameday *" tabs**,
  served by `doGet(?action=gameday)` in `Code.gs` and re-read once a
  minute, so the run of show can change mid-marathon without a deploy.
  `src/lib/gamedayContent.ts` holds the shipped fallback copy, used
  whenever that read fails — including before `Code.gs` is redeployed.
  Editing the fallback in the repo does **not** change what the sheet
  serves; during the event, edit the sheet.
- `apps-script/Code.gs` — the Google Apps Script RSVP backend mirrors the
  slugs and field labels from `rsvpEvents.ts`; keep them in sync when
  events change (see `apps-script/README.md`).
- **RSVPs close on their own when an event ends** (`calendar.end` in
  `rsvpEvents.ts`, via `hasEventEnded()`): the schedule card drops its
  RSVP chip, `/rsvp/<slug>` swaps the form for an "RSVPs are closed"
  notice, `/rsvp` moves the event to an "Already happened" group, and
  `doPost` in `Code.gs` rejects the submission. The backend half only
  applies after `Code.gs` is redeployed by hand (**Deploy → Manage
  deployments → ✏️ → New version**) — a repo edit alone changes nothing
  live.
- Location lines follow the format "VenueName, street, city, ST zip"
  (e.g. "Improving, 3033 Excelsior Blvd #180, Minneapolis, MN 55416").
- `branding/` — design source of truth for surfaces that can't read the
  site's Tailwind tokens. `branding/email/` holds the email template,
  a ten-block library, the palette/type/layout values, and
  `DESIGN_BRIEF.md` — a self-contained brief to point a developer or an
  AI model at ("build me an email, follow
  `branding/email/DESIGN_BRIEF.md`"). New campaigns are written into
  `email/`, not `branding/`.
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

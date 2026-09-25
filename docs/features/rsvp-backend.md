# RSVP backend

- **Status:** Live, including the close-on-end rejection (redeployed 2026-09-25, verified)
- **Last reviewed:** 2026-09-25 (newsletter handler added, redeploy verified)
- **Covers:** `apps-script/Code.gs`, `src/lib/rsvp.ts`, `src/lib/rsvpEvents.ts`, `src/pages/Rsvp.tsx`, `src/hooks/use-now.ts`

## Purpose

Per-event RSVP pages that land submissions in a spreadsheet and send the
registrant a confirmation with add-to-calendar and cancel links — without
running a server.

## Where it lives

- `src/lib/rsvpEvents.ts` — the single source of truth for events with RSVP
  pages: slug, title, date label, location, `mapUrl`, accent colours,
  `calendar` bounds, and the tailored field list.
- `src/pages/Rsvp.tsx` — `/rsvp` (chooser) and `/rsvp/<slug>` (form). Builds a
  Zod schema from the event's field list.
- `src/lib/rsvp.ts` — the POST client.
- `apps-script/Code.gs` — the backend. `apps-script/README.md` has the setup
  and redeploy steps.

## How it works

The form POSTs JSON to an Apps Script web app. `doPost` validates, appends a
row to a per-event tab of the "elnerds RSVPs" spreadsheet (tabs and columns
created automatically from the submitted field labels), then emails the
registrant a confirmation and the captain a notification. Each row carries a
UUID token; the confirmation's cancel link comes back as
`doGet(?action=cancel&token=…)`, which marks the row "Cancelled" and notifies
the captain.

**RSVPs close on their own when an event ends.** `hasEventEnded()` in
`rsvpEvents.ts` reads `calendar.end`, and three layers act on it: the schedule
card drops its RSVP chip, `/rsvp/<slug>` replaces the form with an "RSVPs are
closed" panel (and `/rsvp` moves the event to an "Already happened" group), and
`hasEnded_(slug)` in `doPost` rejects late submissions.

The same `doPost` also receives newsletter signups. A body with
`type: "newsletter"` goes to `handleNewsletter_` before any RSVP
validation, and is saved to a "Newsletter" tab. See
[newsletter-signup](newsletter-signup.md).

## Decisions and gotchas

- **The request is deliberately `text/plain`.** Apps Script web apps don't
  answer CORS preflights for JSON, so the client sends a "simple" request the
  browser won't preflight and the script parses the body itself.
- **The endpoint URL is public by design** — it ships in the browser bundle, so
  a GitHub secret would add no protection. It lives in `deploy.yml` directly.
  Rotating it means a new value there; "Manage deployments → New version"
  keeps the same `/exec` URL.
- **A missing or unparseable `calendar.end` leaves the event open**, so a
  config typo can't silently take a live RSVP page down.
- **An unknown slug is treated as still open** by `hasEnded_`, so a brand-new
  event on the site keeps working until `Code.gs` catches up with it.
- The page also re-checks the clock in `onSubmit`, for the case where an event
  ends while the form is sitting on screen.
- The `EVENTS` map in `Code.gs` mirrors slugs and dates from `rsvpEvents.ts`.
  These are two copies that must be kept in sync by hand — the backend has no
  way to read the frontend's config.
- Free Gmail sends cap at ~100 recipients/day and each RSVP is 2 emails, so
  ~50 RSVPs/day.

## Manual steps and open questions

- **Every `Code.gs` change needs a manual redeploy.** In the Apps Script
  editor: paste the file in, then **Deploy → Manage deployments → ✏️ → New
  version**. The URL stays the same and no secret changes. A repo edit alone
  changes nothing live.
- **The live deployment matches the repo** as of 2026-09-25 (Version 4).
  Checked then:
  - `?action=gameday` returns display-value times ("8:00 AM");
  - an RSVP for the already-finished Bingo event is refused;
  - newsletter signups save and de-duplicate.
- Adding an RSVP event means an entry in `rsvpEvents.ts` **and** a matching
  entry in `Code.gs`'s `EVENTS`, then a redeploy.

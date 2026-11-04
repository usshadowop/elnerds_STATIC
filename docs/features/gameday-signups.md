# Game Day event sign-ups (`/gameday_events`)

- **Status:** Site live 2026-11-04. The sheet half needs the `Code.gs` redeploy (CLAUDE.md open thread); until then the page says "Sign-ups open soon".
- **Last reviewed:** 2026-11-04 (built; live spots-left chips)
- **Covers:** `src/pages/GamedayEvents.tsx`, `src/lib/gamedaySignup.ts`

## Purpose

A page where participants sign up for specific Game Day events: D&D
sessions, tournaments and so on. Some events already have an outside sign-up
(an Extra Life donation incentive); the rest need somewhere to collect names.
The owner asked for both on one page, fed from its own sheet tab
(2026-11-04).

## Where it lives

- `src/pages/GamedayEvents.tsx`: the page (route `gameday_events` in
  `App.tsx`). It's linked from a teal "Sign up for Game Day events" bar above
  the home page's Game Day Schedule card (`MainEventSchedule` in
  `Schedule.tsx`) and from the nav's **Events** dropdown ("All Events",
  "Game Day Sign-ups") in `SiteNav.tsx`.
- `src/lib/gamedaySignup.ts`: the form's POST (`type: "gameday_signup"`).
- The list comes through `useGamedayContent` (`signups` in
  `gamedayContent.ts`, covered by gameday-content), so it re-reads once a
  minute like the schedule.
- `apps-script/Code.gs`: `readSignupEvents_` (the list), and
  `handleGamedaySignup_` (the form).

## How it works

**`Gameday Signups` tab** (RSVP sheet, created with headers only):

| Event | When | Details | Sign-up link |
| --- | --- | --- | --- |
| Shown as the card title | Pink line under it; free text | Body text; links allowed, like Event Details | Optional URL |

- **A row with a Sign-up link** gets an orange "Sign up" button that opens
  the link in a new tab. Paste the URL as text, or link a word with Insert →
  Link; either works. Only `http(s)`, `mailto` and `www.` addresses are
  accepted.
- **A row without one** gets a "Sign up below" button, and its Event appears
  as a checkbox in the form at the bottom. With no such rows, the form is
  hidden.
- Rows with an empty Event cell are skipped. An empty tab shows "Sign-ups
  open soon".

**The form** asks for name, email, events (checkboxes) and optional notes,
with a hidden honeypot field. `handleGamedaySignup_`:

- Re-reads the tab and accepts only events that are listed **without** a
  link. A stale page that offers a removed event gets "Pick at least one
  event (reload)".
- Writes to an **`Event Signups`** tab (Timestamp, Name, Email, Events,
  Notes), created on the first submission. Events are stored as
  "Event (When)".
- Keeps **one row per email**: signing up again replaces that person's
  picks and notes.
- Emails the captain on every submission, marking repeats as "updated". No
  confirmation email goes to the participant; the page shows the events
  they picked.
- Refuses everything once the marathon's `calendar.end` has passed. The
  page also hides its buttons and the form then, and shows a "has wrapped"
  note.

## Decisions and gotchas

- **Live spots left.** A row whose link (or a link in its Details) is an
  Extra Life incentive shows "3 of 5 left" or "Full" from DonorDrive,
  refreshed every minute. When it's full, the Sign up button becomes a grey
  "Full". Mechanism in the [extra-life-api](extra-life-api.md) card.

- **The checkbox value is the Event text.** Renaming an event in the sheet
  while someone has the page open makes their submission fail with the
  reload message, rather than recording a name that no longer exists.
- **Separate from Event Details.** The owner chose a dedicated tab, so the
  list under the schedule and this page can say different things.
- The page shows only what the sheet holds, with no shipped example copy.
  On a failed read it shows "Sign-ups open soon".

## Manual steps and open questions

- `Code.gs` must be redeployed before the tab exists or the form works
  (open thread in CLAUDE.md). Until then a submission gets a generic
  failure from the old script. That's harmless, but the page shows "open
  soon", so nobody should reach the form before the redeploy.

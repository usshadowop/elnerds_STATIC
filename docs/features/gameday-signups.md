# Game Day event sign-ups (`/gameday_events`)

- **Status:** Live 2026-11-04 (site and `Code.gs`). The `Gameday Signups` tab exists and is empty, so the page says "Sign-ups open soon" until rows are typed.
- **Last reviewed:** 2026-11-10 (watch page message)
- **Covers:** `src/pages/GamedayEvents.tsx`, `src/pages/LeadershipDnD.tsx`, `src/lib/gamedaySignup.ts`

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

Two more columns (2026-11-08) drive the grouped **Event Details** under the
Game Day schedule (see gameday-content):

- **E, Group:** rows with the same Group share one card. Leave it blank for
  a card of its own.
- **F, Price:** the pink label on the card ("$35 / seat", "$20",
  "Donation"). The first non-blank Price in a group wins.

`/gameday_events` uses them too (2026-11-09). Events that share a Group
sit under a section heading with the group name and its Price in pink, in
the order each group first appears. An event with no Group keeps a
standalone card, with its Price shown next to the time ("· Donation").
`groupSignups()` in `gamedayContent.ts` does the grouping for both views,
so the page and Event Details always agree.

- **A row with a Sign-up link** gets an orange button that opens the link
  in a new tab. It reads **"Sign up on Extra Life"** when the link is on
  `extra-life.org` or a subdomain such as `dd.extra-life.org` (owner's
  wording, 2026-11-07), and plain "Sign up" for any other site. Paste the URL as text, or link a word with Insert →
  Link; either works. Only `http(s)`, `mailto` and `www.` addresses are
  accepted.
- **A row linking a page on this site** (host `elnerds.com`, e.g.
  `https://elnerds.com/leadership_DandD`) is a watch-only event
  (2026-11-10): a magenta **"Watch Here"** button to that page in the same
  tab, plus a **"Full"** chip, in both Event Details and this page. It never
  appears in the form. `ownPagePath()` in `gamedayContent.ts` decides.
  `/leadership_DandD` (`LeadershipDnD.tsx`) is the leadership team's D&D
  one-shot: it embeds the `Gameday Streams` row whose name mentions
  "Leadership" or "D&D" (needs an Embed URL; until then it says "Goes live at
  9:30 PM on Game Day. Game starts at 10 PM.").
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
- Adds **a new row for every submission**, even from an email already in
  the tab, so someone who signs up for MTG now and Smash later keeps both.
  Until 2026-11-07 a repeat email overwrote its earlier row and lost the
  first picks; the owner hit that and asked for one row per sign-up. To see
  everything one person picked, filter the tab by Email.
- Emails the captain on every submission ("Game Day sign-up: <name>"). No
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

- Filling the `Gameday Signups` tab is the owner's job. The form only
  appears once at least one row has no Sign-up link.

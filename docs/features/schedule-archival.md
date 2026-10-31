# Date-driven event archival

- **Status:** Live
- **Last reviewed:** 2026-10-31 (home grid hides the now-line)
- **Covers:** `src/lib/scheduleEvents.ts`, `src/components/site/Schedule.tsx`, `src/hooks/use-now.ts`

## Purpose

The schedule used to be two hand-maintained arrays: an event that had already
happened sat under "Future Events" until someone moved the object and
redeployed. Now every event archives itself the moment it ends — card, badge,
RSVP chip and hero pill all follow from one timestamp.

## Where it lives

- `src/lib/scheduleEvents.ts` — the `EVENTS` array (all events, past and
  future) plus `endsAtMs`, `hasEnded` and `splitByDate`.
- `src/components/site/Schedule.tsx` — renders the two sections. Presentation
  only; it holds no event data.
- `src/components/site/Hero.tsx` — reads the same array for the hero pills.

## How it works

Each event carries an `endsAt` ISO timestamp **with a timezone offset** (CDT is
`-05:00`, CST is `-06:00`). `splitByDate(EVENTS, now)` partitions on that at
render time, sorting future soonest-first and past most-recent-first. Because
the site is a client-rendered SPA, this needs no rebuild: the card moves on the
visitor's own clock. `useNow()` re-checks every minute so a page left open
across an event's end updates without a reload.

Events with an `rsvpSlug` don't set `endsAt` — they inherit it from that
event's `calendar.end` in `rsvpEvents.ts`, the same inheritance `mapUrl`
already used, so the date lives in exactly one place.

A past event greys out, gains a "Completed" badge, and **drops its RSVP chip**
(see [rsvp-backend](rsvp-backend.md) — a finished event shouldn't collect new
submissions).

## Decisions and gotchas

- **Upcoming events are two groups.** "Extra Life Nerds Events" (the
  team's own, the marathon among them) lead; events flagged `partner` sit
  below under "Partner Events", in their usual colours. The partner group
  only renders when there is one. (Grey partner cards were mocked up on
  2026-10-14 and turned down.)
- **The main event card wears a header band**: a magenta→purple→teal strip
  with a trophy, "The Big One · Game Day 2026", a live "N days away" pill
  (counted to the marathon's `calendar.start`), and the RSVP (orange) and
  Directions buttons. Other cards keep those buttons floating top-left;
  moving them into the band is what keeps the main card's body tight. The
  title is gradient text. Glow-ring and full-gradient looks were mocked up
  and turned down. Below `sm` the band stacks (title line, then the
  buttons) with slightly tighter letter-spacing and a nowrap pill; from
  `sm` up it is the single row seen on desktop. The "Details" badge and
  the card body share a `relative` wrapper so the badge sits a fixed
  distance under the band however tall it wraps — it used to be pinned
  3.75rem from the card top and landed on the Directions button on phones
  (2026-10-23).

- **Past Events start collapsed.** The section is one button ("Click to see
  N past events", with the derived year label above it) that toggles the
  list open; it closes again on a second click. The list only grows through
  the year, and the upcoming events are what visitors come for. Plain React
  state, so a reload folds it back up — deliberate.

- **An event with no resolvable end never archives.** `endsAtMs` returns
  `Infinity` when `endsAt` is missing or unparseable, so a config typo leaves
  the event visible under Future rather than vanishing into Past. Failing
  toward "still showing" is the safe direction for a fundraiser.
- **`use-now.ts` is shared, and three cards cover it on purpose.** The same
  ticking clock drives this feature, the hero's Game Day states and the RSVP
  close. It's 20 lines and rarely touched, but a change to its interval or
  its cleanup breaks all three at once — so editing it blocks the commit
  until all three cards are staged, which forces whoever changes it to look
  at every dependent feature rather than just the one they had in mind.
- **Section year labels are derived**, not hardcoded — `yearPrefix` reads the
  years of the events actually in each section, so "2026 Future Events"
  becomes 2027 on its own.
- **An empty Future section renders a "nothing on the calendar" note** rather
  than a bare gap, for when every event has passed.
- Adding an event is one entry in `EVENTS`. Give it a `chip` to put it in the
  hero; omit `chip` to keep it out.

## Manual steps and open questions

None. This feature is fully self-driving.

## Game Day schedule under the main card (added 2026-10-31)

`MainEventSchedule` in `Schedule.tsx` renders the run-of-show grid
(`GamedaySchedule`, the same component `/gameday` uses) directly beneath
the main-event card, outside its Details fold, with `id="gameday-schedule"`
(the hero's blue chip links to it). It reads the same sheet-driven content
through `useGamedayContent`, so the home page polls `?action=gameday` once
a minute while open, exactly like the Command Center, and shows the
sheet's rows as they are (starter rows included). Until the first read
settles it shows a "Loading the schedule…" placeholder rather than the
shipped fallback. It passes `showNowLine={false}`, so the home page grid has
no now-line, legend or current-block pulse (2026-10-31). There is deliberately no link to the Command Center and
no "example" note (both removed the same day at the owner's request). The
mechanics of the grid stay documented in the gameday-content card.

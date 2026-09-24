# Date-driven event archival

- **Status:** Live
- **Last reviewed:** 2026-09-24 (Covers audited against imports)
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

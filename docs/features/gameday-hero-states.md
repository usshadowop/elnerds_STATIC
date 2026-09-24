# Game Day hero states

- **Status:** Live
- **Last reviewed:** 2026-09-24 (Covers audited against imports)
- **Covers:** `src/hooks/use-countdown.ts`, `src/components/site/Hero.tsx`, `src/hooks/use-now.ts`

## Purpose

The hero countdown only knew how to count down to Nov 14. At 8:00 AM that
morning it would hit zero and sit at `00:00:00:00` for the next twelve months.
It now carries three states across Game Day without anyone switching anything
on the day.

## Where it lives

- `src/hooks/use-countdown.ts` — `useGameday(startIso, endIso)`, which ticks
  once a second and reports both the phase and the time left in it.
- `src/components/site/Hero.tsx` — the card itself, plus `GrandTotalCard` and
  the Command Center button.

## How it works

Bounds come from the marathon's `calendar.start` / `calendar.end` in
`rsvpEvents.ts` — not a fourth hand-written copy of that date. `useGameday`
returns `phase` (`before` | `live` | `after`) and a countdown to whichever
boundary is next.

| Phase | Card |
| --- | --- |
| `before` | "Countdown to Gameday", four units to kickoff |
| `live` | "Gameday is LIVE!" + a 24-hour countdown to the finish, plus a full-width button to [/gameday](gameday-content.md) |
| `after` | The team's Extra Life total as "$X Raised" |

## Decisions and gotchas

- **The live countdown drops Days and does not wrap hours at 24.**
  `Math.floor((diff / 3_600_000) % 24)` reads `0` when `diff` is exactly 24
  hours — i.e. "00 Hours" at the precise moment the marathon starts. The hook
  exposes `totalHours` for this, and the live timer is three columns.
- **The grand total never prints "$0 Raised."** On a fundraising page that
  reads as a catastrophic year rather than a loading state. While the fetch is
  in flight the card says "Counting up the total…"; if the API is unreachable
  it thanks people instead of showing a number we can't stand behind.
- **`GrandTotalCard` only renders in the `after` phase**, so the Extra Life
  request doesn't fire the other eleven months.
- Cents appear only when the total has them (`$61,250`, not `$61,250.00`).
- The event name in the label comes from the API, so it reads "Extra Life
  2027" next year with no edit.
- `useGameday` replaced a generic `useCountdown`; the hero was its only caller.
  One ticking clock now reports the phase *and* the remainder, instead of a
  second interval alongside the countdown just to work out the state.

## Manual steps and open questions

- **Open:** keep the "Extra Life 2026 — Final Total" label and exact cents, or
  drop to a bare rounded figure? (Owner decision, open since 2026-09-18.)
- The final total stays up until a new marathon with future dates is added to
  `EVENTS`, at which point the card returns to counting down. Nothing expires
  on its own in between.

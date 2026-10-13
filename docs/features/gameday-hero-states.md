# Game Day hero states

- **Status:** Live
- **Last reviewed:** 2026-10-13 (incentives chip added under the event pills)
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
  the Command Center button. Also the button row under the ticker: Donate Now
  (orange, to the Extra Life team page), Join The Team (teal outline, to
  `/registration`) and RSVP (blue, to the `/rsvp` chooser). These show in
  every phase.
- Also in `Hero.tsx`, under the event pills and above the headline: the
  **incentives chip**, a filled orange→magenta→purple pill with a pinging
  dot that links to `/incentives` (the Game Day donation incentives page,
  `src/pages/Incentives.tsx`). It is deliberately not styled like the event
  pills, so it reads as "something to earn" rather than another date.

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

The incentives chip follows the same phases: shown in `before` and `live`,
gone in `after`, since every incentive on that page is for this year's
marathon. The page itself stays up (with its own "has wrapped" banner), so a
link sent by text or email never dies.

Under the card, in every phase, sits the latest-donations ticker. Its
mechanism is described in [extra-life-api](extra-life-api.md). The hero only
chooses how often it refreshes: every minute while `live`, every five minutes
otherwise.

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
- **The button row wraps on narrow phones.** With three buttons it no longer
  fits on one line everywhere. Measured with Nunito loaded, it stays on one
  row from 375px wide; at 360px and below, RSVP drops to a centered second
  line. It used to be `flex-nowrap`, which would push Donate Now off the
  left edge. The buttons use `px-4` below `sm` to keep 375px on one row.
- The RSVP button's blue is the `--color-blue` token in `src/styles.css`.
  The rest of the palette had no blue.
- **The incentives chip blinks with a radiating ring, not by fading.** Its
  `animate-incentive-glow` (keyframes in `src/styles.css`) pulses a
  box-shadow outward every two seconds, so the text never dims; the dot
  uses Tailwind's `animate-ping`. Both carry `motion-reduce:animate-none`,
  verified: with `prefers-reduced-motion: reduce` the computed
  `animation-name` is `none`.
- The chip reads "Donation incentives live" at every width. Below `sm` it
  drops the trailing arrow and tightens padding and tracking, which is what
  keeps it on one line at 320px (measured with Nunito loaded: 311px wide
  from 360px up, narrower below, no horizontal overflow).
- `useGameday` replaced a generic `useCountdown`; the hero was its only caller.
  One ticking clock now reports the phase *and* the remainder, instead of a
  second interval alongside the countdown just to work out the state.

## Manual steps and open questions

- **Open:** keep the "Extra Life 2026 — Final Total" label and exact cents, or
  drop to a bare rounded figure? (Owner decision, open since 2026-09-18.)
- The final total stays up until a new marathon with future dates is added to
  `EVENTS`, at which point the card returns to counting down. Nothing expires
  on its own in between.

# Extra Life API integration

- **Status:** Live
- **Last reviewed:** 2026-09-18
- **Covers:** `src/hooks/useExtraLifeTeam.ts`, `src/hooks/useExtraLifeDonors.ts`, `src/components/site/ActiveRoster.tsx`, `src/components/site/Donors.tsx`

## Purpose

Live fundraising data — team total, participant roster, donor list — pulled
from DonorDrive so the site doesn't carry numbers that go stale the moment
someone donates.

## Where it lives

- `src/hooks/useExtraLifeTeam.ts` — team record + participants (team ID
  `73600`).
- `src/hooks/useExtraLifeDonors.ts` — donor list.
- `src/components/site/ActiveRoster.tsx` — the roster section, with skeleton
  placeholders while loading.
- `src/components/site/Hero.tsx` — the post-Game-Day grand total (see
  [gameday-hero-states](gameday-hero-states.md)).

## How it works

Plain `fetch` against `https://dd.extra-life.org/api`, each hook owning its own
`AbortController` and loading/error state. Participants are sorted captain
first, then co-captains, then by donations descending. Donors are sorted by
total descending.

## Decisions and gotchas

- **Use `dd.extra-life.org`, not `extra-life.org/api`.** The latter issues a
  cross-origin 302 to the former *without* CORS headers on the redirect, which
  browsers reject. `dd.extra-life.org` serves 200 with
  `access-control-allow-origin: *`, so fetch works from the browser. This is
  written at the top of `useExtraLifeTeam.ts` and is easy to "fix" backwards.
- **The `/donors` endpoint caps `limit` at 100 and does not support `offset`** —
  passing one returns an empty string rather than an array. So the hook
  requests the maximum page in a single call and there is no pagination. If the
  team ever exceeds 100 donors, the list silently truncates.
- `useExtraLifeTeam` is called independently by `ActiveRoster` and (in the
  `after` phase only) by the hero, so that's two fetches of the same data on
  one page. Harmless at this size; worth a shared cache if a third consumer
  appears.
- The API is unreachable from the Claude sandbox's browser, so verification
  needs a stubbed route (`page.route`) rather than a live call.

## Manual steps and open questions

- The team ID `73600` and the event year are baked into the hooks. A new Extra
  Life season may need the ID checked.
- `src/components/site/Stats.tsx` still carries **hardcoded** yearly totals
  ("$51K raised in 2025"). Those are historical and not available from the
  current-season API, so they're hand-maintained — a candidate for its own card
  if it ever grows a source.

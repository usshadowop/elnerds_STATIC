# Feature cards

One card per feature of elnerds.com: what it does, where it lives, how it
actually works, and what was decided along the way. Bookkeeping for future
work — so the next person (or session) doesn't have to re-derive a mechanism
from the code.

## Cards

| Card | Feature | Status |
| --- | --- | --- |
| [schedule-archival](schedule-archival.md) | Event cards that move themselves Future → Past | Live |
| [gameday-hero-states](gameday-hero-states.md) | Hero countdown across Game Day, and the total after | Live |
| [gameday-content](gameday-content.md) | Command Center contents, editable mid-event from a sheet | Live, dormant |
| [rsvp-backend](rsvp-backend.md) | RSVP form → sheet → confirmation + cancel emails | Live |
| [extra-life-api](extra-life-api.md) | Live team, roster and donor data from DonorDrive | Live |
| [deploy-pipeline](deploy-pipeline.md) | Push to `main` → GitHub Pages | Live |
| [branding-docs](branding-docs.md) | The email template, block library and design brief | Live |

Features without a card yet: Stats, Why We Play, Sponsors, Donors,
Leadership Team, SiteNav, Footer, Registration, Patient Profiles, the
client-side router, design tokens, and the Brevo send procedure. Most
are a static list in one file; write a card when one grows a mechanism
worth explaining, not on principle.

## Card format

Every card opens with a machine-readable header, then six sections:

```markdown
# <Feature name>

- **Status:** Live | Partial | Stub | Planned — plus anything qualifying it
- **Last reviewed:** YYYY-MM-DD
- **Covers:** `src/path/one.ts`, `src/path/two.tsx`, `apps-script/*.gs`

## Purpose
## Where it lives
## How it works
## Decisions and gotchas
## Manual steps and open questions
```

`Covers` is not decoration — it's the path→card mapping the staleness check
reads (below). Globs are matched against staged file paths, so keep it
accurate when files move.

## Keeping cards from going stale

A stale card is worse than no card: it's confidently wrong. Three things
keep them honest, and only the first depends on anyone remembering.

1. **The rule:** working on a feature includes updating its card, in the
   same commit. Stated in CLAUDE.md's ship-live workflow.
2. **A commit guard** (`.claude/hooks/feature-card-guard.sh`, wired as a
   `PreToolUse` hook on `Bash`): when a commit stages a file that a card
   `Covers` without staging that card, the commit is blocked and the card
   is named. Escape hatch for changes a card genuinely doesn't describe —
   a lockfile bump, a typo, the cards themselves — is `[no-card]` anywhere
   in the commit message.
3. **A session report** (`.claude/hooks/feature-card-report.sh`, wired as a
   `SessionStart` hook): lists cards not reviewed in 90+ days at the start
   of a session, so features nobody has touched still resurface. Untouched
   code drifts too — the site's dependencies and the Extra Life API move
   underneath it.

When you review a card and it's still accurate, bump **Last reviewed**
anyway. That's the signal that someone looked, and it's what keeps the
90-day report meaningful.

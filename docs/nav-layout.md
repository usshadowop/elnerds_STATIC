# Header nav layout — how it fits, and what to watch

Context for anyone changing `src/components/site/SiteNav.tsx`.

## The constraint

The nav row is a three-group flex layout (logo · links · actions) inside
`max-w-6xl` (1152px). Adding a single item to any group can push the total past
1152px, and the failure is ugly rather than obvious: because the bar is a fixed
`h-16`, overflowing content wraps to a second line *inside* that fixed height,
so labels stack and the Donate button slides on top of the last nav link.

That is exactly what happened when the Discord icon was added (commit
`410f929`) — the row needed 1184px. Fixed in `0621b36`.

## Current width budget

Measured in Chromium at the widths where each breakpoint applies:

| Viewport | logo | links | actions | total (incl. gaps) | available | slack |
|---------:|-----:|------:|--------:|-------------------:|----------:|------:|
| 1280+    | 218  | 479   | 334     | 1063               | 1152      | 89    |
| 1120     | 218  | 447   | 318     | 1015               | 1072      | 57    |
| 1024     | 218  | 447   | 209     | 906                | 976       | 70    |

`available` = viewport capped at 1152, minus the `px-6` (48px) padding.

## Rules that keep it from breaking again

1. **Nothing in the row may wrap.** Every group carries `whitespace-nowrap` and
   `shrink-0`. Keep it that way — wrapping is what makes the bar look broken,
   and removing `whitespace-nowrap` hides an overflow instead of surfacing it.
2. **Desktop row starts at `lg` (1024px).** It never fit at `md`; below `lg` the
   hamburger menu takes over.
3. **Social icons appear at `min-[1120px]`.** Between 1024 and 1119 they would
   cost ~96px the row does not have. They remain reachable in the footer and in
   the mobile menu at those widths.
4. **Top-level links are capped at five.** "Sponsors" and "Team" are dropdowns
   precisely to stay under that. A sixth top-level link will not fit — add it as
   a dropdown child instead.

## Before you add anything to the nav

Run the width check against the dev server (`npm run dev`) — this is how the
numbers above were produced:

```js
// node measure.mjs, with playwright available
const row = document.querySelector("nav").firstElementChild;
row.scrollWidth - row.clientWidth; // must be 0 at every width
```

Check 1536 / 1440 / 1366 / 1280 / 1200 / 1120 / 1119 / 1024 / 900 / 390.
`scrollWidth - clientWidth` must be `0` at all of them. Note this only catches
overflow once `whitespace-nowrap` is in place; without it the row silently wraps
and `scrollWidth` stays clean while the bar looks wrong.

## Dropdown behaviour

Hover *and* keyboard: the panel is `invisible`/`opacity-0` and revealed by
`group-hover:*` plus `group-focus-within:*`. `invisible` keeps the panel links
out of the tab order until the trigger button is focused, at which point
`focus-within` reveals them and keeps the panel open while focus is inside.

The `pt-3` on the panel wrapper (not `mt-3`) is deliberate — it keeps the hover
target contiguous with the trigger so the panel does not close in the gap.

There is no click-to-open and no Escape-to-close; the panel is hover/focus only.
If the nav ever needs click or touch behaviour, switch to the Radix
`dropdown-menu` already vendored in `src/components/ui/`.

## Known open items

- **Team dropdown grouping is a judgement call.** "Active Roster"
  (`#active-roster`) and "Leadership" (`#team`) used to be two top-level links
  named "Team" and "Leadership", which was ambiguous. They are now children of a
  "Team" dropdown. Reverting that is a small change, but the row gets tight at
  1024px again — re-run the width check if you do.
- **Section ids are confusing.** `#team` is the *leadership* section and
  `#active-roster` is the roster. Renaming `#team` → `#leadership` would be
  clearer, but it is a public anchor URL, so check for external links first.
- **Tablet menu CTAs stretch.** At ~900px the open mobile menu's two-column
  Donate / Join Team buttons span the full width and look oversized. Cosmetic
  only; capping the inner column width would fix it.
- **`tsc --noEmit` has 8 pre-existing errors** for the uppercase `.PNG` imports
  in `src/components/site/Team.tsx`. Unrelated to the nav; Vite builds fine.
  Adding a `*.PNG` module declaration to a `.d.ts` would clear them.

## Deploying

`.github/workflows/deploy.yml` publishes to GitHub Pages (`elnerds.com`) on
**push to `main` only**. A feature branch alone changes nothing live. CI runs
`bun install --frozen-lockfile`, so a dependency change must include an updated
`bun.lock` or the deploy fails.

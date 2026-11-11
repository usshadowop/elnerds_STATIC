# Command Center content pipeline

- **Status:** Live. `Code.gs` was redeployed 2026-09-25, and the four tabs exist
- **Last reviewed:** 2026-11-11 (phone schedule is now a timeline with duration bars)
- **Covers:** `src/lib/gamedayContent.ts`, `src/hooks/use-gameday-content.ts`, `src/pages/CommandCenter.tsx`, `src/pages/GamedayCountdown.tsx`, `src/components/site/GamedaySchedule.tsx`, `src/components/site/GamedayAgenda.tsx`, `src/components/site/GamedayEventDetails.tsx`

## Routing (since 2026-11-10)

`/gameday` shows `GamedayCountdown.tsx` ("GOES LIVE ON GAME DAY" and a big countdown) while `useGameday` says `before`, and the Command Center (`CommandCenter.tsx`) from kickoff on, with nothing to switch by hand. The Command Center is always reachable at `/gameday_holding` for preview. Both are routed in `App.tsx`.

## Purpose

`/gameday` is the page to sit on during the marathon: where to watch, what's on
next, how to chip in. A command center whose run of show is a hardcoded array
is only useful until the first time plans change — at 2am, when the room moves
to Mario Kart, nobody is opening a pull request. So its contents are edited in
a spreadsheet during the event.

## Where it lives

- `src/pages/CommandCenter.tsx` — the page (route `/gameday`, wired in
  `App.tsx`). Presentation only. The closing "Links to our sponsors!" grid
  is a hand-maintained list in the file (Improving, Papa Johns Roseville,
  Q’s Cue, Placemaker Hospitality, Gillette Children's; five tiles across
  at `lg`), not sheet content, with each
  sponsor's logo from `src/assets/logos/sponsors/` (Improving's and
  Gillette's from their sites, Papa John's from Wikimedia, Q’s Cue's is the
  profile picture of their Facebook page, `qs-cue.jpg`, 480px on black,
  shown `rounded-full`; Placemaker's is their site's share image with the
  white background made transparent, `placemaker.png`). The three food
  vendors are repeated in the home page's Food Donation card
  (`Donors.tsx`); change both together.
  Above the streams, a "Come visit" card shows the marathon's venue from
  `rsvpEvents.ts` with a directions button in the `maps/dir/` form.
- `src/lib/gamedayContent.ts` — types, the shipped fallback copy, `fetch` and
  the response parser.
- `src/hooks/use-gameday-content.ts` — the polling hook.
- `src/components/site/GamedaySchedule.tsx` — the "Schedule" section: the
  run-of-show rows laid out as a lane grid with a "now" line (rules below).
- `src/components/site/GamedayAgenda.tsx` — `ResponsiveGamedaySchedule`,
  which both pages render: below `md` the **phone timeline**
  (`GamedayAgenda`, rules below); from `md` up the grid itself. Until
  2026-11-11 phones got a plain list plus a "See the full timeline" button
  that opened the grid full-screen; the timeline replaced both.
  Since 2026-10-31 the home page's Schedule section renders the same grid
  under the main-event card (`MainEventSchedule` in `Schedule.tsx`, owned
  by schedule-archival), fed by the same hook.
- `apps-script/Code.gs` — `doGet(?action=gameday)` and `getGamedayContent_()`.

## How it works

Four tabs in the RSVP spreadsheet drive the page:

| Tab | Columns |
| --- | --- |
| `Gameday Streams` | Name, Description, Embed URL, Channel URL |
| `Gameday Run of Show` | Time, Title, Detail |
| `Gameday Incentives` | Amount, What |
| `Gameday Notice` | one banner message in cell **A2** |
| `Gameday Event Details` | Title, Details (since 2026-11-04) |

The tabs are created with headers and starter rows the first time the page
asks for them (Event Details gets headers only, no starter rows), so setup is opening the sheet and typing. The page fetches
`?action=gameday` and re-reads once a minute, so an edit reaches every open
browser within about a minute — nobody refreshes.

A stream tile with a blank **Embed URL** shows a sample still (an event
photo from `src/assets/carousel/`) with a "Live" badge, a "Sample" tag and a
play button, so the demo reads as a stream wall; fill it in and the tile
becomes a live player.

- **Drawing-ticket blurb** (2026-11-10): a fixed line under the "Event Details" heading in `GamedayEventDetails.tsx` ("All entrants into any event get 1 free prize drawing ticket, and the winner gets 5 additional tickets."). Hard-coded, not from the sheet.

## Decisions and gotchas

- **Prize boxes under events** (2026-11-10): a "Prize: …" line in a
  `Gameday Signups` Details cell renders as a pink box under that event (see
  gameday-signups); `PrizeBox` in `GamedayEventDetails.tsx`.

- **Event Details has four sections** (2026-11-10): Dungeons & Dragons,
  Magic: The Gathering, Video Games, Other, each a heading over its group
  cards. `sectionSignups()` in `gamedayContent.ts` files each sign-up row by
  regex on its Group + Event text (`SECTIONS` / `sectionOf()`); anything
  unmatched, and anything mentioning "leadership", goes to Other. No sheet
  column and no `Code.gs` change; a new kind of event means a new line in
  `SECTIONS`. Empty sections are hidden, and a section with one group is full
  width. `/gameday_events` uses the same sections. The old "leftover rows"
  list still renders any `Gameday Event Details` rows, but the two that used
  to live there (dexterity games, Mecha Chameleon) are now sign-up rows under
  Other.

- **Event Details is grouped by activity** (2026-11-08, option B of three
  mockups the owner reviewed). The section is built from the
  `Gameday Signups` tab:
  - Rows that share a **Group** (column E) become one card, with that
    group's **Price** (column F) as the pink label on the right.
  - Each row is a line: its When in blue (`text-blue`), the event name
    without its " w/ …" suffix, a live spots chip, and a button. The button
    always says **"Sign up"** (owner's call, 2026-11-09). It's orange with a ↗
    for a link (Extra Life opens in a new tab), or teal-outlined for the
    form (`/gameday_events#signup-form`).
  - Details shared by every row in a group show once under the card title;
    otherwise each line carries its own.
  - A row with no Group gets a card of its own.
  - A row whose link is a page on elnerds.com shows a "Full" chip and a
    "Watch Here" button instead of "Sign up" (see gameday-signups).
  - The grouping is `groupSignups()` in `gamedayContent.ts`, shared with
    `/gameday_events`.
  - Desktop lays the cards out in two balanced CSS columns; phones get one.
  - Rows still in the `Gameday Event Details` tab render under the cards in
    the old one-line style, for notes that aren't sign-up events (the 4am
    challenge).
  - The old single-line rendering of every event (below) applies to those
    leftover rows only.

- **"Event Details" under the schedule** (2026-11-04,
  `GamedayEventDetails.tsx`): the rows of the `Gameday Event Details` tab,
  under a small pink "EVENT DETAILS" label, directly below the schedule on
  both the home page and `/gameday`, phones included. Title shows in pink
  bold, Details beside it; owner asked for exactly these two columns. It
  replaces a workaround: sign-ups typed into Run of Show with "$35" in the
  Time column, which landed in the untimed list under the grid.
  - **Links in Details:** `readEventDetails_` in `Code.gs` sends the cell's
    rich-text runs, so words linked in Sheets (Insert → Link) keep their URL;
    `detailParts` in `gamedayContent.ts` also links bare `https://…` and
    `www.…` text. Only `http(s)` and `mailto` URLs become links; anything
    else renders as text. Links open in a new tab.
  - **No fallback copy.** An empty tab, a failed read, or a backend without
    the tab hides the section. Stale sign-ups are worse than none.
  - `RichText` in `GamedayEventDetails.tsx` renders those parts and is
    shared with `/gameday_events`.
  - **Live spots left:** a row whose Details links an Extra Life incentive
    gets a "3 of 5 left" / "Full" chip after its title (`SpotsChip`; data
    via `useIncentiveStock`, see extra-life-api). So don't type "5 left"
    into the cell.
- **The same payload carries `signups`**, the `Gameday Signups` tab that
  lists events on `/gameday_events`. Parsed in `gamedayContent.ts` (sign-up
  links pass `safeLink`) and described in the
  [gameday-signups](gameday-signups.md) card.

- **The sheet's rows are the schedule, starter rows included** (decided
  2026-10-31, reversing PR #76). From 2026-10-13 to 10-31 an untouched
  "Gameday Run of Show" tab was treated as empty and the 2025 example
  shown instead; the owner, having seen the example, asked for the live
  rows. So until someone edits the tab, both `/gameday` and the home page
  show Kickoff / TBD / TBD / Open house wraps / Finale. The shipped
  `FALLBACK_CONTENT.runOfShow` (the 2025 day) now appears only when the
  read fails or the tab is genuinely empty.
- **No flash of the example.** `useGamedayContent` reports `settled` once
  the first read has finished either way; both pages show a "Loading the
  schedule…" placeholder until then, rather than drawing the fallback and
  swapping it a second later (the flash PR #76 was written to stop).

- **The schedule is laid out like the printed 2025 run of show**, not a
  list: a navy Time / Event header, red hourly pills, lanes of sky-blue
  black-bordered blocks, lime-green meal banners. Everything below is
  computed from the rows on every render, so editing the sheet re-packs the
  grid; nobody touches code.
  - **Time cells** are read by `parseShowTime` in `gamedayContent.ts` as a
    range ("9:30a - 12:30p", "11 - 1p", "8am Saturday - 8am Sunday") or a
    single time, which gets an hour. A start with no meridian borrows the
    end's and flips to AM when it would land after the end. Times before
    8 AM or marked "Sunday" are the second morning. A cell with no clock
    time ("TBD") is listed under the grid, not dropped.
  - **Lanes and stacking.** Blocks are placed longest first, each into the
    first lane where it overlaps nothing. Failing that, a block of three
    hours or less may ride on top of a block at least twice as long in the
    same lane (never the all-day block), provided the one underneath keeps
    about 100 minutes clear for its own label; the label moves into that
    gap. Riders are shifted 12px right at full lane width so they overhang
    the block beneath. **A lane that holds riders is 12px wider on its
    right** (2026-11-04), so the overhang lands in white space and the usual
    6px gap still separates it from the next lane; before that every lane
    was the same width and a rider ran into the next lane's blocks (MTG over
    a D&D session, reported from the live site). The extra comes off the
    shared width, so the last lane's overhang also stays inside the grid
    with no horizontal scrollbar (the 2026-10-31 fix, now a special case).
    Padding on the lane box can't do this because absolutely placed children
    measure `%` against the padding box. The thresholds (`MAX_OVERLAY_MIN`, `MIN_LABEL_MIN`,
    `RIDE_PX`) are constants at the top of `GamedaySchedule.tsx`.
  - **Meals.** A row whose title or detail mentions breakfast, lunch,
    dinner, waffles, snacks, food or pizza becomes a green banner in the
    first lane only (the all-day block's), so the other lanes stay free;
    banners that start together share that lane's width. The banner's
    time span is a *minimum* height: in a narrow lane the text wraps and
    the banner grows past its hour rather than clipping (phone overlay,
    2026-10-31). Lanes are at least 150px wide for the same reason.
  - **Quiet hours fold.** Two or more consecutive hours with nothing
    starting or ending collapse to one "…" row, so the overnight stretch
    doesn't dominate.
  - **Current blocks** (the ones the now-line crosses) glow with a magenta
    pulse that fades fully in and out (`now-pulse` in `styles.css`); with
    reduced motion they get a static ring instead.
  - **The now-line row is centred on its time** (`-translate-y-1/2`). With
    its top edge there it drew about ten minutes late, below a block that
    hadn't ended yet (reported from the live site 2026-10-15, PR #83).
    Check line position with the clock forced, not by eye.
- **Phones get a timeline of cards with duration bars** (`GamedayAgenda`,
  below `md`; owner's design from a mockup canvas, shipped 2026-11-11). It
  replaced a plain list, which showed no durations and could only tag the
  current row, and the full-screen grid overlay behind it.
  - Red hour pills down the left. Each event is a card at its start time
    whose top-left corner turns down into a thin bar ending at its end time.
    **The bars sit right beside the hour pills, left of the cards** (moved
    from the cards' right edge 2026-11-11, owner's ask, so they read against
    the times).
    The all-day row (24 h or longer) is a banner above; untimed rows are
    listed underneath in plain text.
  - **Bars touch** (owner's ask): lanes are packed longest first, lane 0 the
    outermost (next to the hour pills, farthest from the cards, so short
    events' arms stay short), and neighbours overlap by one outline, so
    one black line separates them with no white between. Outlines are 4px
    (owner's ask), bars 13px wide so a strip of colour survives the outline.
  - **Every card sits at its own start time.** Where cards would crowd, the
    stretch of time before the next start grows until the card above clears
    it, so busy hours are taller than quiet ones. The owner rejected the
    alternative (every hour the same height), which slid afternoon cards up to
    an hour below their bars. Bars and the now-line use the same scale, so
    they stay true. Cards sharing a start stack. Two or more quiet hours fold
    into a 48px band.
  - **Card heights are measured from the page** (`useLayoutEffect` plus a
    `ResizeObserver` on each card's content), so text never runs into the
    next card on any phone width or font load. The first layout uses a guess
    and is corrected before paint.
  - **Details are folded** (owner's ask, 2026-11-11): a card shows its time
    and title, plus "Details – click to expand" when the row has a Detail. The
    whole card is the button (`aria-expanded`); opening it shows the detail
    and "Hide details", and the cards below move down to make room.
  - **Cards run the length of their bar where there's room** (owner's ask,
    2026-11-11): a card stretches down to its event's end time unless the
    next card starts first, so blank space inside a card is deliberate. The
    measurement is of the card's *content*, not the card, or the stretch would
    feed back into the layout and push every later card down.
  - **The now-line** runs under the cards and over the bars, with a dot on
    every bar it crosses and a pink time pill in the gutter (the hour pill it
    would cover is hidden). During Game Day it also tags current cards NOW
    with a pink outline, fades finished events (solid faded colours, not
    opacity, so a card and its arm don't darken where they overlap) and adds
    an "On now" card above with what's running, until when, what's next and
    a "Jump to now" button. Before and after, the line previews on the
    visitor's clock like the grid's, labelled "Preview", with none of the
    live extras. The home page turns it all off (`showNowLine={false}`).
  - `FOOD`, `clockLabel`, `DAY_MINUTES` and `START_HOUR` live in
    `gamedayContent.ts` and feed both views, so they can never disagree on
    what a meal or a time is.
- **The home page hides the now-line** (`showNowLine={false}` from
  `MainEventSchedule`): no line, no "Preview" legend, no pulse on current
  blocks. Before Game Day a line following the visitor's clock read as if
  something were on right now (owner, 2026-10-31). `/gameday` keeps it.
- **The "now" line is real only during Game Day.** Outside it the line
  previews with the visitor's own clock (today's 2:15 PM sits where
  Saturday's 2:15 PM will), labelled as a preview, so the page can be
  checked any day. During the event it's minutes since the marathon's
  `calendar.start`, so it reads the same in every timezone.
- The shipped fallback run of show is **the 2025 schedule** (from the
  printed Canva run of show), not the 2026 plan. It shows only when the
  sheet can't be read or its tab is empty.

- **Nothing here can leave the page blank.** Every failure path — endpoint not
  yet redeployed, network down, a tab emptied out, a half-typed row — falls
  back to `FALLBACK_CONTENT` in `gamedayContent.ts`. A stale run of show beats
  an empty page in the middle of the event. A failed poll keeps the last good
  content on screen rather than swapping in an error state.
- **Editing the fallback in the repo does not change what the sheet serves.**
  During the event, edit the sheet.
- Rows whose first cell is blank are skipped, so gaps and half-typed rows in
  the sheet are safe.
- **Embed URLs are the platform's embed address, not the channel page**, and
  Twitch additionally needs `&parent=elnerds.com` or the player refuses to
  load.
- **Times are read as displayed text, not raw cell values.** Sheets turns a
  typed "8:00 AM" into a time value, which `getValues()` returns as "Sat Dec 30
  1899 08:00:00 GMT-0600". The first live read after the redeploy showed
  exactly that. `getGamedayContent_` now uses `getDisplayValues()`. It went live
  in the Version 4 deployment, verified 2026-09-25: the times read
  "8:00 AM".
- **CORS is fine.** Verified against the live deployment that the Apps Script
  `ContentService` JSON path returns `access-control-allow-origin: *` on both
  the 302 and the final 200, so the cross-origin browser read works. (The
  `HtmlService` path — what a plain GET returns — does not, which is a useful
  tell for whether the redeploy has happened.)

## Manual steps and open questions

- The four `Gameday *` tabs exist now, with starter rows, and **those
  starter rows are what the site shows** (two "TBD" blocks included). They
  need real content before Nov 14. For the run of show, Time cells may be ranges
  ("9:30a - 12:30p"); meal rows just need the meal word in the title.
- The sponsor list is hand-maintained in `CommandCenter.tsx`. Papa Johns is
  the Roseville store (1133 Larpenteur Ave W) and links to its page on
  locations.papajohns.com; Q’s Cue (BBQ catering, Woodbury, veteran-owned,
  Joshua Quast) links to its Facebook page, which is the only web presence
  on their business card. Both supplied by the owner 2026-11-06, replacing
  "Papa Johns Eden Prairie" and "Random Taco Company" (the Taco Bell logo
  was deleted with it). Placemaker Hospitality (Kim Bartmann's Minneapolis
  restaurant group, placemakerhospitality.com) was added as a third food
  donor the same day.
- **Open:** should `/gameday` go in the top nav for Game Day? It's link-only
  today, reachable from the hero button while the marathon runs.

- **The 2026 rows can be written by `fillRunOfShow2026` in `Code.gs`**
  (editor-run, 2026-10-31) instead of typed. Either way the sheet is what
  the site shows.

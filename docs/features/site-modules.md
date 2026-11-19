# Modules

- **Status:** Live. Two modules saved. Gameday totals is on the homepage (hero and roster) and the Command Center; Extra Life Page donation totals is only on `/modules`.
- **Last reviewed:** 2026-11-19 (Sussie and Derpy confirmed as one lot; the silent auction line is worked out from the bid sheets and the payments found on Extra Life; `/silent-auction`; Donation matching $1,050 without Morgan's match)
- **Covers:** `src/lib/siteModules.ts`, `src/pages/Modules.tsx`, `src/components/modules/*`, `src/lib/gamedayTotals.ts`, `src/lib/silentAuction.ts`, `src/hooks/useSilentAuction.ts`, `src/pages/SilentAuction.tsx`

## Purpose

The owner wanted pieces of a page saved so they can be reused later, and one
page that shows every saved piece at once ("We'll have several modules and I
want to be able to see them all simultaneously on a page"). Homepage templates
(the home-templates card) save whole-page layouts. Modules save the parts.

## Where it lives

- `src/lib/siteModules.ts`: the list. Each module has a slug, name,
  description, date saved, the file it lives in, how to put it on a page, where
  the site shows it today, and a preview width (`card`, max-w-2xl, or `wide`).
- `src/components/modules/`: one component per module, plus
  `ModulePreview.tsx`, which renders a module by slug for `/modules` (the same
  pattern as `HomeTemplatePage.tsx`).
- `src/pages/Modules.tsx`: `/modules`, also reachable as `/module` (the owner
  asked for "/module"). Every module rendered live, one after another, with its
  name, saved date, description, file, usage and where it's on the site. A row
  of jump links appears once there are two or more modules. `useNoIndex()`,
  listed under "For the team" in `sitePages.ts`, linked from nowhere else.

## The modules

| Module | Component | Saved | From |
| --- | --- | --- | --- |
| Extra Life Page donation totals | `ExtraLifeDonationTotals` | 2026-11-15 | The "Team fundraising" card under the hero countdown |
| Gameday totals | `GamedayTotals` | 2026-11-15 | New: the owner's grand total for Game Day 2026 |

**Extra Life Page donation totals.** The Team Total / Goal / Participants block
and its progress bar in a white card, read live from DonorDrive
(`useExtraLifeTeam`). Props: `label` (default "Team fundraising") and
`refreshMs` (omit to read once; `/modules` re-reads every minute). It shows the
`TeamProgress` skeleton while loading and, if the first read fails, a "See it on
Extra Life" link. It never shows $0. The figures inside are the shared
`TeamProgress` block (extra-life-api card), so the module changes when the hero,
roster and Command Center versions do. When it was saved the team stood at
$45,393.05 of $60,000 with 49 participants.

**Gameday totals.** One big grand total: the Extra Life team total (live, as
above) plus the money raised that isn't on the Extra Life page, with every part
listed underneath (the Extra Life row carries a "Live" tag). The extra amounts
are `GAMEDAY_TOTAL_ITEMS` in `src/lib/gamedayTotals.ts`, typed in by hand. For
Game Day 2026 they are the owner's figures of 2026-11-15: Chips $580, Cash
bucket $175 (then $575, once a $400 check that hadn't been counted turned up),
Donation matching $1,125, Silent auction remaining payouts $910
($2,790 in all; with the Extra Life page at $45,418.05 the card read
$48,208.05). Props: `label` (default "Gameday totals"), `items` (another list
in place of the file's) and `refreshMs`. The sum is done in cents, so it never
shows floating-point dust. The grand total waits for the Extra Life figure: a
placeholder while it loads, and "the grand total can't be added up" plus a
link if it fails. It never shows a total that is missing the biggest part. The
breakdown rows show either way. `children` go at the bottom of the card (the
Command Center puts its Donate Now and Team page links there).

**Live line items (2026-11-15).** A line item can also be live:
`extraLifeGiftsSince: { participantId, since }` is a running total of
everything given to one Extra Life participant's page since `since`, read from
DonorDrive by `useExtraLifeGiftsSince` (`src/hooks/useExtraLifeGiftsSince.ts`)
and re-read on the module's `refreshMs`. It is shown with a "Live" tag like the
team row.

The first is **"New leadership additions"**: gifts to Pam van Muijen's page
(participant 567979) from 2026-11-13 00:00 Central on. Pam is on the
leadership team, but her page is on **another Extra Life team** (NCC-AL5, team
74636), so none of it is in our team total and adding it double-counts
nothing. When added it was $645 from 13 gifts, all on Nov 14–15, and the
grand total read $49,169.57.

- **Only use a live line for a page on another team.** Anyone on team 73600
  is already in the team row.
- DonorDrive lists donations newest first, and **its `offset` counts from 1**:
  `offset=1` is the first gift, `offset=101` the 101st (checked 2026-11-15).
  The hook pages by 100, drops repeats by `donationID` and stops at the first
  gift older than `since`.
- Gifts whose donor hid the amount have no `amount`, so they can't be added.
  None of Pam's do: her 24 visible amounts add up to her page's `sumDonations`.
- `parseDonorDriveDate` (`src/lib/donationFormat.ts`) pads fractional seconds
  to three digits. DonorDrive sends some with two (`…:33.30+0000`), and
  Safari's date parser only takes three. A date that still won't parse is left
  out rather than guessed at.
- The grand total waits for every live figure, not just the team's. If Pam's
  page can't be read, her row shows "—" and the card says the grand total
  can't be added up.
- Checked with Pam's real gifts ($645), with a made-up 250-gift list (two pages
  read, then stopped at the cutoff: $149, the hidden-amount gift left out), and
  with her page failing.

**Lines that shrink as their money reaches Extra Life (2026-11-18).** After
Game Day the leadership team started entering the chip slips and the $75 RSVP
matches as gifts on each person's Extra Life page. Each one then lands in the
team total, so the typed-in Chips and Donation matching lines counted it
twice. The owner asked for it to come off the line by itself once it shows up
on the person's page. So a line can be `amount` plus `lessExtraLifeGifts: {
teamId, since, displayName }`: it shows `amount` minus everything given to our
team's pages under that display name since `since`, never below $0, with a
"Live" tag.

- **The display names are the contract.** Chips are entered as **"Poker Chip
  Donations"** and RSVP matches as **"RSVP Donation Match"** (the names the
  owner used for the first of each, 2026-11-18). Case and extra spaces don't
  matter; any other wording does, and that gift stays counted twice. Anonymous
  gifts have no name and never match.
- `since` is 2026-11-15 00:00 Central, the day the typed-in figures were set.
  Nothing tagged was entered before 2026-11-18 (checked).
- The small print under the line says how much has moved: "$95 of $580 now
  on Extra Life pages". When everything has, "All $580 now on Extra Life
  pages", plus "($620 entered)" if more was entered than the line held.
- When this was built: Chips $580 − $95 = $485, Donation matching $1,125 − $75
  = $1,050 (both to Jared Campbell), grand total $50,922.57. Before, it would
  have read $51,092.57, with that $170 counted twice. The chip slips photographed 2026-11-18 add
  up to $525 on top of that $95, so $620 against the $580 typed in: once
  they're all entered the Chips line reads $0 and the grand total ends up $40
  higher than the typed figure allowed for. The owner's answer, the same day:
  go by the slips. **Chips is $620** since 2026-11-18, so the line reads $525,
  exactly the photographed slips still to be entered.
- **Donation matching is $1,050 since 2026-11-19**: the owner took Morgan's
  match off the list of 15, and the other 14 were all on Extra Life pages that
  day, so the line reads $0. Chips also reads $0 ("$652 entered"): four of the
  $10 slips went in as $18 gifts.
- Checked in a browser against real DonorDrive data, then with the 12
  combined chip gifts added (some with odd capitals and spacing: Chips $0,
  "($620 entered)"), with 150 tagged gifts (a second page, read with
  `offset=101`), and with the team list failing ("—" on the live lines, no
  grand total). No overflow at 320px and 390px on the homepage.

**The silent auction line (2026-11-19).** "Silent auction remaining payouts"
was the owner's typed $910 (2026-11-15) until the owner asked for each
auction payment to be found and taken off automatically, by amount. Now it is
`silentAuction: true` in `gamedayTotals.ts`, and its figure is the winning
bids in `src/lib/silentAuction.ts` (`AUCTION_WINS`) whose payment hasn't been
found yet. `/silent-auction` (`src/pages/SilentAuction.tsx`, a team page,
`useNoIndex()`) lists every item with the gift that paid it, or the
same-amount gifts that might have.

- **Where the bids come from.** The bid-sheet photos in the captain's Drive
  folder "Event Photos 2026" (`1_zrOgjnMRc3900sHP_IO05ZO1cMyYorq`, shared with
  the Drive connector's account), mostly taken 8:16–8:23 AM on Nov 15 as the
  auctions closed. A Drive full-text search for "silent auction" finds them
  (Google reads the text in photos). The sheets carry bidders' phone numbers
  and emails, so the repo holds only the item, the winning bid and the page to
  pay on, never a winner's name or a photo. Three items have no sheet photo
  and were added from the payment that names them (Hubworld, the bacon, the
  KPop Squishmallows); each item's `source` says which.
- **Winners pay on the page of whoever brought the item**, the name
  scribbled on the sheet ("PAM", "Jon D", "John H"); the owner confirmed the
  pages of the six unpaid items on 2026-11-19. Pam's items were paid on
  her page, which is on another team, so `useSilentAuction` reads our team's
  list and Pam's (`AUCTION_PAYMENT_PAGES`) from 7 AM Nov 15
  (`AUCTION_PAYMENTS_SINCE`), an hour before the auctions closed: two winners
  paid at 7:24 and 7:39 AM. Pam's gifts are also the live "New leadership
  additions" line, so a payment there is in the grand total once and comes off
  this line; nothing is counted twice.
- **The amount alone isn't enough** (`matchAuctionPayments`). A gift counts
  only if it is exactly the winning bid **and** its name or message mentions
  the auction or the item (each item's `keywords`), or it was given on the
  item's page. The best-tied gift wins, then the earliest; a gift pays one
  item. On 2026-11-19, five unrelated $30 gifts and a $20 one had come in
  after the close, the same as two unpaid bids: by amount alone, both items
  would have shown as paid. Those are listed under the item as "same amount,
  but nothing else ties it", not counted.
- **Gifts under a display name that has its own line** ("Poker Chip
  Donations", "RSVP Donation Match", from `claimedDisplayNames()`) are never
  taken: a $75 RSVP match is not a $75 bid.
- **By hand, per item:** `paidBy: "<donationID>"` when the matcher can't find
  the payment (another page, a different amount, two items in one gift; the id
  is the small code under each gift on `/silent-auction`), or `paidOutside:
  "<what happened>"` for cash or a check. Gifts that mention the auction but
  match no item are listed at the bottom of `/silent-auction`, so a win
  missing from the list shows up.
- When built: 12 items, $1,055 in winning bids, $735 paid (Avengers poster
  $350, Hubworld $100 and Kutná Hora $40 on Pam's page; the bacon $100, the
  "Stuffies" $110, the keyboard and playmat $35), **$320 owed** (Timberwolves
  tickets $125, Root $90, Grogu $35, Chip Theory Kids $30, Hexeh $20, the pink
  necklace $20). The line had read $910, so the grand total dropped $590.
- Checked against the live gifts (the numbers above), with made-up gifts (an
  RSVP match the size of a bid, two items of one amount, a gift set by
  `paidBy`, a cash item, a stray "silent auction" gift), and in a browser at
  320px, 390px and 1280px with no sideways scroll.

**Where Gameday totals is used (2026-11-15).** The owner asked for it
"everywhere the old module was, for last minute announcements". So it replaced
the Team Total / Goal / Participants block in all three places:

- under the hero countdown, in `TeamProgressCard` in `Hero.tsx`, read once;
- at the top of the roster section, in `ActiveRoster.tsx`, read once;
- on the Command Center, in `GamedayDonations.tsx`, re-read every minute.

The live homepage (Gameday Week Runup) therefore shows it twice, as it did the
old block. To go back, put `TeamProgress` (or `<ExtraLifeDonationTotals />`)
back in those three files.

**The big figure sizes to its card, not the window.** The card is an
`@container`, and the figure is `clamp(1.75rem, 16cqw, 4.5rem)`. On the
Command Center the card is two-fifths of the row at `lg`, about 333px inside at
1024px wide. A window-based size (`11vw`, capped at 72px) would make
"$48,208.05" about 383px wide there, which overflows. Measured with Nunito: it
fits its card on the homepage and the Command Center from 320px to 1440px.

## Decisions and gotchas

- **Modules are live, not snapshots.** A module is a component that fetches its
  own data, so it can be put on any page with nothing passed in. To freeze a
  figure (say, a final total), save a separate module that takes the number as
  a prop.
- **On phones, `/modules` shows each module unframed.** The first build put the
  module inside the entry's panel and a dashed "stage". At 320px that left the
  donation totals about 170px, and "$45,393" ran into "$60,000". Below `sm` the
  panel and stage drop away, so the module gets the full content width, the same
  288px it has under the homepage countdown. Measured with Nunito loaded: from
  320px to 1280px each figure stays inside its column, with no sideways scroll.
  The donation totals need roughly that width. Don't put them in a column much
  narrower than a phone screen.
- The hero's own `TeamProgressCard` was left as it is, not switched to the module.
  It hides on a failed fetch, which the module doesn't, and the live homepage
  didn't need to change to save the module.

## Manual steps and open questions

- **When do the homepage and Command Center go back** to the plain Extra
  Life total (or something else)? The owner's call; see Open threads in
  CLAUDE.md.
- **Only Cash bucket is a plain typed amount now.** "New leadership
  additions" keeps itself current, Chips and Donation matching shrink by
  themselves as their gifts are entered, and the silent auction line follows
  the payments (above). To change a typed amount, or add an auction win, edit
  `src/lib/gamedayTotals.ts` or `src/lib/silentAuction.ts` and push. Cash
  bucket doesn't shrink: if it is ever entered on Extra Life pages, give it a
  `lessExtraLifeGifts` with its own display name, or lower it by hand. List
  only money that is **not** on the Extra Life page; anything also entered
  there (an offline donation) would be counted twice.
- **Open on the auction list (2026-11-19):** whether the owner's $910 and the
  sheets agree (the list holds $1,055 in winning bids; leaving out the $110
  "Stuffies", paid before the close, that's $945 against $910); the agate necklace (item A,
  bidder's name scribbled out); the stretch bracelet (item B: $10 on the noon
  Saturday photo, then a $25 "Bracelet" gift to the Holts at 7:39 AM Sunday);
  Hoplomachus: Victorum and the Too Many Bones pack (on the auction list, no
  sheet photo, no payment found). Until answered, none of these is on the
  list. (The $110 "Stuffies" was Sussie and Derpy as one lot, the owner
  confirmed the same day.)

- A new module: a component in `src/components/modules/`, a case in
  `ModulePreview.tsx`, an entry in `SITE_MODULES` and its slug in
  `SiteModuleSlug`. Update the table above in the same commit.

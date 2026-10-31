# The "elnerds RSVPs" spreadsheet

- **Status:** Live. Owned by `captainextralifenerds@gmail.com`; nine tabs as of 2026-10-31
- **Last reviewed:** 2026-10-31 (first write-up, from `Code.gs` and the live sheet)
- **Covers:** `apps-script/Code.gs`, `apps-script/README.md`

## Purpose

One Google Sheet is the whole back office: every RSVP, every newsletter
signup, and the Command Center's live content. Three other cards each
describe one path into it ([rsvp-backend](rsvp-backend.md),
[newsletter-signup](newsletter-signup.md),
[gameday-content](gameday-content.md)). This card is the map of the sheet
itself: which tab came from where, what writes to it, what reads it, and
which parts were made by hand. Read this before touching the sheet or
assuming a tool can edit it.

## Where it lives

- The sheet is in the **captain account's Drive**
  (`captainextralifenerds@gmail.com`), because that account owns the Apps
  Script project that created it. `getSpreadsheet_()` in `Code.gs` stores its
  ID in the script property `SPREADSHEET_ID`; if the sheet is ever deleted the
  next request silently creates a fresh, empty one under the same name.
- It is shared to `us.shadow.op@gmail.com` and, since 2026-10-31, to
  `stevenlarker1982@gmail.com` as an editor.
- **Nothing in this repo holds a copy of the data.** The repo holds only the
  script that writes it and the site code that reads one part of it.

## How it works

Every write comes from `apps-script/Code.gs`, running as the captain
account, triggered by a visitor on elnerds.com. The site itself never
touches the sheet; it only POSTs to, or GETs from, the script's `/exec` URL.

| Tab | Created by | Columns | Written by | Read by |
| --- | --- | --- | --- | --- |
| `24-Hour Marathon` | `getEventSheet_` on the first marathon RSVP | Timestamp, Name, Email, *one per field label in `rsvpEvents.ts`*, Status, Token | `doPost` appends a row per RSVP; `handleCancel_` sets Status to "Cancelled" | Nothing on the site. Humans, and the captain's "New RSVP" emails point here |
| `(past) Extra Life Bingo` | `getEventSheet_` on the first Bingo RSVP, as `Extra Life Bingo` | Same shape, with Bingo's four fields | Same as above; `doPost` now refuses Bingo (event ended) | Nothing on the site |
| `Newsletter` | `handleNewsletter_` on the first signup | Timestamp, Email, Referred by | `handleNewsletter_` appends; duplicates add nothing | Nothing on the site. Exported by hand into Brevo |
| `Gameday Streams` | `getGamedaySheet_` on the first `?action=gameday` | Name, Description, Embed URL, Channel URL | **Humans only** | `/gameday`, once a minute |
| `Gameday Run of Show` | same | Time, Title, Detail | **Humans only** | `/gameday`, once a minute |
| `Gameday Incentives` | same | Amount, What | **Humans only** | `/gameday`, once a minute |
| `Gameday Notice` | same | one header; the banner text goes in **A2** | **Humans only** | `/gameday`, once a minute |
| `RSVP Stats` | **A human** | Merged-cell dashboard: confirmed count, guests, headcount, duration and hardware breakdowns | Humans (or formulas; not checked) | Nothing on the site |

How the three script-made shapes come about:

- **Event tabs are named after the event title** (`title.slice(0, 90)`),
  and the title comes from `rsvpEvents.ts` via the POST body. The
  columns between Email and Status are the event's **field labels, in
  order, as of the first submission**. They are written once, when the tab
  is empty, and never updated: if a field is added to `rsvpEvents.ts` later,
  new rows carry the extra value in the position the form sends it, but the
  header row does not change to match. Values are the raw option values
  (`full_24`, `pc`), not the labels the visitor saw.
- **Status/Token** are appended by the script. Token is a UUID that the
  confirmation email's Cancel link carries back; `handleCancel_` scans
  every tab that has both a `Token` and a `Status` header, so renaming an
  event tab (as happened with `(past) Extra Life Bingo`) does not break old
  cancel links.
- **Gameday tabs are seeded with starter rows** (`GAMEDAY_SECTIONS` in
  `Code.gs`) so the sheet shows the expected shape. The site treats the
  untouched Run of Show seed as "unfilled" and keeps its built-in example
  (see gameday-content). The script only ever *reads* these tabs after
  creating them.

## Decisions and gotchas

- **There is no API for editing cells from a Claude session.** The Google
  Drive connector available in Claude sessions can read the sheet's
  contents and change its metadata (title, folder, star, lock), but cannot
  write to a cell. Being made an editor on the sheet does not change this.
  Every time the sheet's content has changed, it was either `Code.gs`
  reacting to a visitor or a person typing in Sheets. Claude has never
  edited a cell; what looked like it was the script creating tabs and
  columns on first use. Checked against all 19 PRs that mention the sheet
  (2026-10-31): none describes a direct edit.
- **The only write paths are the ones listed above**, and none of them can
  be pointed at an arbitrary cell. `doPost` only appends RSVP or newsletter
  rows; `?action=cancel` only flips one Status cell for a token it is
  given. Writing to the Gameday tabs from outside Sheets would need a new,
  secret-guarded action in `Code.gs` and a redeploy; this was offered on
  2026-10-31 and not built.
- **Two tabs were made or changed by hand and the script knows nothing of
  them:** `RSVP Stats` (a dashboard) and the `(past)` prefix on the Bingo
  tab. The script tolerates both. A new Bingo RSVP, if the event were
  reopened, would create a fresh `Extra Life Bingo` tab rather than reuse
  the renamed one.
- **Column headers freeze at first use.** See above. Removing or
  reordering a field in `rsvpEvents.ts` mid-season would misalign new rows
  under the old headers. Add new fields at the end, or start a new tab by
  changing the event title.
- **Times typed into the Gameday tabs are read as display text**
  (`getDisplayValues()`), because Sheets converts "8:00 AM" to a date
  (PR #44). RSVP tabs are read with `getValues()` by `handleCancel_`, which
  only compares the Token column, so the conversion does not matter there.
- **Reads of RSVP data from the site are impossible by design.** The
  endpoint's only GET actions are `cancel` and `gameday`, so the public
  `/exec` URL cannot be used to pull the attendee list.
- A deleted sheet is silently replaced by an empty one. The old data is in
  the captain account's Drive trash for 30 days; after that only the
  captain's notification emails hold it.

## Manual steps and open questions

- **Filling the Gameday tabs is a person's job**, by typing in Sheets. As of
  2026-10-31 all four still hold their starter rows (checked by reading the
  live sheet). The CLAUDE.md open thread from 2026-08-12 tracks this.
- The `newsletter-test@example.com` row noted in newsletter-signup is gone
  from the `Newsletter` tab (checked 2026-10-31).
- `RSVP Stats` is hand-maintained; whether its figures are formulas or
  typed numbers was not checked. If someone wants it live, it could be
  rebuilt with `COUNTIF`s over the marathon tab.
- Open: should `Code.gs` gain a guarded write action so the Gameday tabs
  can be filled from a chat session? Trade-off is a secret in Script
  Properties on a public endpoint versus five minutes of typing.

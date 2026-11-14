# Prizes, donation tokens and printed Game Day signs

- **Status:** Live. `/prizes` and the donation tokens since 2026-11-14 (Game Day); the printed table numbers and poker chip sign were made and printed the same day
- **Last reviewed:** 2026-11-14
- **Covers:** `src/pages/Prizes.tsx`, `src/components/site/DonationChips.tsx`, `public/email/assets/chip-*.png`, `branding/print/*`, `src/assets/Table numbers/*`, `src/assets/Poker chips/*`

## Purpose

Everything about winning things at Game Day, in one place:

- **`/prizes`:** the prize drawings, the silent auctions, the donation tokens,
  prizes you can win in an event, and photos of the prize tables. It's sent by
  link (the Game Day email, texts), so it stands on its own.
- **Donation tokens (the poker chips):** real poker chips handed out during
  the event, each worth a donation of its value. They appear on `/prizes`, in
  the Game Day email and on a printed sign.
- **Printed signs for the room:** the table-number cards and the poker chip
  sign, plus the scripts that make them, so they can be reprinted or changed.

## Where it lives

- `src/pages/Prizes.tsx` (`/prizes`): the page. Its top comment says which
  words are the owner's.
- `src/components/site/DonationChips.tsx`: `DonationChip` (one chip drawn as
  SVG) and `DonationChipsSection` (the "Donation tokens" block, anchor
  `#donation-tokens`). **This is the source of truth for the chip rules.**
- `public/email/assets/chip-{10,25,50}.png`: the same chips as PNGs, for
  emails (no SVG in email clients). The Game Day email
  (`email/elnerds-gameday-parking-prizes.html`) has a "Donation tokens"
  block with the same words.
- `src/lib/prizes.ts`: drawing times, auction items and prize-table list,
  shared with the homepage. Owned by the home-templates card, not this one.
- `branding/print/`: the print generators (see its README).
  - `make_table_numbers.py`: table-number cards.
  - `make_poker_chips_sign.py`: the poker chip sign.
  - `print.cjs`: prints HTML to PDF with Chromium.
  - `assets/`: Nunito, tinted logos, the Mirage Makes logo.
- `src/assets/Table numbers/`: the printed set, tables 1–50. One PDF per
  sheet plus one combined file (7 sheets, 8 cards each, the last sheet only
  49–50). The owner also has a copy in a "Table numbers" folder in their
  Google Drive.
- `src/assets/Poker chips/poker-chips-sign.pdf`: the printed sign.
- Nothing in `src/assets/*/` above is imported, so none of it ships in the
  site bundle. They live there because the owner asked for them there.

## How it works

**The donation tokens.** Three chips: white $10, blue $25, red $50, all
courtesy of Mirage Makes. You get them as prizes (every raffle prize comes
with a white $10 chip), as rewards for events and tournaments, and handed out
for all sorts of reasons through the night. You use one by donating it to
anyone's Extra Life page (your own included) or by spending it to enter an
event. These are the owner's words of 2026-11-14, as written in
`DonationChips.tsx`.

**One drawing, three copies.** The chip is modelled on the real white token
(`2026_photos/prizes/donation-token.jpg`): a rim, 16 recessed blocks and the
value on a raised centre. `DonationChip` draws it in a 120×120 viewBox, and
the colours are in its `CHIPS` list. The email PNGs are screenshots of those
SVGs at 192px. The print sign ports the same geometry to Python (`chip_svg`).
Change the drawing in `DonationChips.tsx` first, then re-shoot the PNGs and
update `CHIPS`/`chip_svg` in the sign script.

**`/prizes` sections, top to bottom:**

1. Prize drawings ($1 tickets, 9 drawings 10 AM–10 PM, must be present).
2. Silent auctions (all event, no need to be present).
3. Donation tokens.
4. Event prizes, read live from the `Gameday Signups` tab. Any row whose
   Details cell has a `Prize:` line shows up, so no code change is needed;
   the section hides when there are none.
5. Prize-table photos (`public/photos/prizes/`).

After the marathon ends (`useGameday` phase `after`) a "has wrapped" note
appears at the top. The page stays up.

**What links to `/prizes`:** the homepage Gameday Week Runup cards
(`GamedayRunup.tsx`, including one straight to `#donation-tokens`), the
Command Center's "Come visit" card, the `/gameday` countdown, the free-ticket
line above Event Details, and the Game Day email.

**The printed signs.** Both scripts build an HTML page and print it to a
letter-size PDF with headless Chromium (`print.cjs`). The PDFs are vector
with Nunito embedded, so they stay sharp at any size.

- **Table numbers:**
  - Layout: a 2 × 4 grid of 4 × 2.5 in cells. Each card sits 0.09 in inside
    its cell, so a rough cut on the dashed lines doesn't clip the border.
  - Style: the number is Nunito Black with an orange→magenta face, a white
    edge, a teal extrusion and a navy outline. Behind it is a faint copy of
    the team logo's wings (lettering removed). A teal footer reads "PLAY
    GAMES. HEAL KIDS."
  - Rebuild everything with:
    `--start 1 --end 50 --set "src/assets/Table numbers"`.
- **Poker chip sign:** the email's "Donation tokens" block word for word
  (eyebrow, heading, lead line, the three chips, "How you get them", "How you
  use them", "Tokens courtesy of Mirage Makes"), plus one line that appears
  **only on the sign**: "There is an envelope container in the hallway where
  you can submit your donations for processing." That's the owner's wording
  of 2026-11-14.

## Decisions and gotchas

- **The chip rules have one home.** When they change, edit
  `DonationChips.tsx`, then the email block, then `GET`/`USE` in
  `make_poker_chips_sign.py`, and reprint. The sign got its wording from the
  email, at the owner's direction.
- **No hearts or sparkles on the print designs.** The first table-number
  draft had 8-bit pixel hearts and four-point sparkles; the owner rejected
  both. Small confetti squares are still on the table cards.
- **Table cards say only the number.** There's no "TABLE" label, because
  the owner never asked for one.
- **The table-card watermark is the team logo with its lettering cut out**
  (`assets/wings-teal.png`). The full logo put a half-hidden "EXTRA LI…
  NERDS" behind every number. The winged-controller mark
  (`src/assets/logos/Controller_Wings.svg`) was considered and left out:
  it's lopsided and hand-drawn, so it doesn't sit evenly behind a centred
  number.
- **`print.cjs`, not `.js`.** `package.json` has `"type": "module"`, so a
  `.js` file there can't `require('playwright')`.
- **Fonts are committed** (`assets/nunito-*.woff2`, SIL Open Font License) so
  the scripts work offline. The site loads Nunito from Google Fonts instead.
- **"sheet N of M" footer.** A sheet built on its own once read "sheet 1 of
  1". `--set` passes each sheet its real number; use it when rebuilding a
  set.
- **Checking a print without eyes:** `pdftotext -layout` on the PDF shows
  every word and number, and `pdftoppm -r 90 -png` renders a page to look at.

## Manual steps and open questions

- **Printing:** letter paper, 100% scale ("Actual size", not "Fit to page"),
  or the 4 × 2.5 in cells shrink.
- **Reprinting needs** Python 3, Node, and Playwright's Chromium
  (`require('playwright')`). In the Claude cloud sandbox they're already
  installed. Elsewhere, `npx playwright install chromium` once.
- **Who handles the hallway envelope container** and what "processing" means
  isn't written down anywhere in the repo. The sign says only what the owner
  said.
- `src/pages/Parking.tsx` (`/parking`) was built alongside `/prizes` but has
  no card. Write one if it grows a mechanism.

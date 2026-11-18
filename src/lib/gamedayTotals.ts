// The money the "Gameday totals" module adds on top of the live Extra Life
// team total (src/components/modules/GamedayTotals.tsx, shown on /modules).
//
// List only money that is NOT already on the Extra Life team page. Anything
// that was also entered there (an offline donation, say) is already in the
// live total, and listing it here would count it twice. That includes gifts
// to anyone on our team (team 73600): an `extraLifeGiftsSince` line is only
// for a page on another team.
//
// Three kinds of line item:
// - a fixed amount, typed in: `amount` in dollars (cents are fine, 12.5 shows
//   as $12.50);
// - a live one: `extraLifeGiftsSince`, a running total of everything given to
//   one Extra Life participant's page since a date, read from DonorDrive;
// - money on its way onto Extra Life: `amount` plus `lessExtraLifeGifts`. The
//   line shows `amount` minus what has been entered on our team's pages under
//   one display name since a date (never below $0), so each gift comes off
//   here as it lands in the team total and nothing is counted twice.

import type { GiftsSince } from "@/hooks/useExtraLifeGiftsSince";

const TEAM_ID = 73600;

type ItemBase = {
  /** What the money is, as shown on the card. */
  label: string;
  /** Optional small print under the label. */
  note?: string;
};

export type GamedayTotalItem =
  | (ItemBase & { amount: number })
  | (ItemBase & { extraLifeGiftsSince: GiftsSince })
  | (ItemBase & {
      /** The full amount, typed in, before any of it is on Extra Life. */
      amount: number;
      /** The gifts that move it onto Extra Life pages; they come off `amount`. */
      lessExtraLifeGifts: GiftsSince;
    });

// Game Day 2026 (Nov 14–15), the owner's figures as of 2026-11-15.
export const GAMEDAY_TOTAL_ITEMS: GamedayTotalItem[] = [
  // From 2026-11-18 the chip slips are being donated onto each person's Extra
  // Life page, always with the display name "Poker Chip Donations". The owner
  // asked for each one to come off this line by itself once it shows up.
  // $620 is what the slips add up to (owner, 2026-11-18): the 17 photographed
  // ($525) plus the two in the first gift ($95). It was $580 before.
  {
    label: "Chips",
    amount: 620,
    lessExtraLifeGifts: { teamId: TEAM_ID, since: "2026-11-15T00:00:00-06:00", displayName: "Poker Chip Donations" },
  },
  // $175 in the bucket plus a $400 check that turned up later (owner, 2026-11-15).
  { label: "Cash bucket", amount: 575 },
  // The fifteen $75 RSVP matches, paid from 2026-11-18 as gifts to each page
  // with the display name "RSVP Donation Match". Same as the chips.
  {
    label: "Donation matching",
    amount: 1125,
    lessExtraLifeGifts: { teamId: TEAM_ID, since: "2026-11-15T00:00:00-06:00", displayName: "RSVP Donation Match" },
  },
  { label: "Silent auction remaining payouts", amount: 910 },
  // Pam van Muijen (leadership team) fundraises on another team's page
  // (NCC-AL5, team 74636), so none of it is in our team total. The owner asked
  // for everything given there from Nov 13 on (2026-11-15). Her page:
  // https://www.extra-life.org/participants/Pam-vanMuijen
  {
    label: "New leadership additions",
    extraLifeGiftsSince: { participantId: 567979, since: "2026-11-13T00:00:00-06:00" },
  },
];

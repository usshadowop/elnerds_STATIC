// The money the "Gameday totals" module adds on top of the live Extra Life
// team total (src/components/modules/GamedayTotals.tsx, shown on /modules).
//
// List only money that is NOT already on the Extra Life team page. Anything
// that was also entered there (an offline donation, say) is already in the
// live total, and listing it here would count it twice. That includes gifts
// to anyone on our team (team 73600): a live line item is only for a page on
// another team.
//
// Two kinds of line item:
// - a fixed amount, typed in: `amount` in dollars (cents are fine, 12.5 shows
//   as $12.50);
// - a live one: `extraLifeGiftsSince`, a running total of everything given to
//   one Extra Life participant's page since a date, read from DonorDrive.

import type { GiftsSince } from "@/hooks/useExtraLifeGiftsSince";

type ItemBase = {
  /** What the money is, as shown on the card. */
  label: string;
  /** Optional small print under the label. */
  note?: string;
};

export type GamedayTotalItem =
  | (ItemBase & { amount: number })
  | (ItemBase & { extraLifeGiftsSince: GiftsSince });

// Game Day 2026 (Nov 14–15), the owner's figures as of 2026-11-15.
export const GAMEDAY_TOTAL_ITEMS: GamedayTotalItem[] = [
  { label: "Chips", amount: 580 },
  { label: "Cash bucket", amount: 175 },
  { label: "Donation matching", amount: 1125 },
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

// The money the "Gameday totals" module adds on top of the live Extra Life
// team total (src/components/modules/GamedayTotals.tsx, shown on /modules).
//
// List only money that is NOT already on the Extra Life team page. Anything
// that was also entered there (an offline donation, say) is already in the
// live total, and listing it here would count it twice.
//
// Amounts are dollars; cents are fine (12.5 shows as $12.50).

export type GamedayTotalItem = {
  /** What the money is, as shown on the card. */
  label: string;
  amount: number;
  /** Optional small print under the label. */
  note?: string;
};

// Game Day 2026 (Nov 14–15), the owner's figures as of 2026-11-15.
export const GAMEDAY_TOTAL_ITEMS: GamedayTotalItem[] = [
  { label: "Chips", amount: 580 },
  { label: "Cash bucket", amount: 175 },
  { label: "Donation matching", amount: 1125 },
  { label: "Silent auction remaining payouts", amount: 910 },
];

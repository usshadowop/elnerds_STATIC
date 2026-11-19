// Game Day 2026's silent auction: every winning bid, and which Extra Life gift
// paid it. The unpaid ones add up to the "Silent auction remaining payouts"
// line in Gameday totals (src/lib/gamedayTotals.ts); /silent-auction
// (src/pages/SilentAuction.tsx) lists every item with the gift that paid it.
//
// Winners pay by donating on an Extra Life page, almost always the page of
// whoever brought the item: the "PAM", "Jon D" and "John H" scribbled on the
// bid sheets. The matcher below finds each payment by its amount plus one more
// sign, so a gift that only happens to be the same amount isn't taken for one
// (on 2026-11-19 there were five unrelated $30 gifts and a $20 one after the
// auction closed, the same as two unpaid bids).
//
// The winning bids come from the bid-sheet photos in the captain's Drive
// folder "Event Photos 2026", taken as the auctions closed. The sheets carry
// bidders' phone numbers and emails, so nothing but the item, the bid and the
// page goes in this file: no winner's name, no photo. Items with no sheet
// photo were added from the payment that names them; mark those as such.

/** The pages winners pay on. A gift to any of them is read (useSilentAuction). */
export const PAM_PAGE = "Pam van Muijen";
const DECKENBACH = "The Deckenbach Clan";
const HOLT = "Jon & Bri Holt";

export const AUCTION_PAYMENT_PAGES = [
  // Our team, every page.
  { teamId: 73600 },
  // Pam van Muijen's page is on another team (NCC-AL5), and the items she
  // brought ("PAM" on the sheet) were paid there. Her gifts since Nov 13 are
  // the live "New leadership additions" line, so a payment there is already in
  // the grand total and must come off this line too.
  { participantId: 567979 },
] as const;

/** Payments are looked for from an hour before the auctions closed (8 AM
 *  Sunday): two winners paid at 7:24 and 7:39 AM. Anything earlier was given
 *  while the bidding was still open. */
export const AUCTION_PAYMENTS_SINCE = "2026-11-15T07:00:00-06:00";

export type AuctionWin = {
  /** What was won, as on the bid sheet. */
  item: string;
  /** The winning bid in dollars: the payment has to be exactly this. */
  amount: number;
  /** The Extra Life page it should be paid on (recipient name, as DonorDrive
   *  spells it): whoever brought the item. */
  page: string;
  /** Words that tie a gift to this item when they're in its name or message
   *  ("Hubworld", "bacon"). "auction" counts for every item. */
  keywords: string[];
  /** Where the facts came from: the bid-sheet photo, or how else we know. */
  source: string;
  /** The DonorDrive donationID of the gift that paid it, when the matcher
   *  can't find it (paid on another page, a different amount, two items in one
   *  gift). Shown on /silent-auction under each gift. */
  paidBy?: string;
  /** Paid some other way (cash, a check): what happened. Counts as paid. */
  paidOutside?: string;
};

export const AUCTION_WINS: AuctionWin[] = [
  {
    item: "Avengers signed poster (Level Up Games)",
    amount: 350,
    page: PAM_PAGE,
    keywords: ["avengers", "poster"],
    source: "Bid sheet photo 20261115_082254.jpg",
  },
  {
    item: "Timberwolves vs. Suns, 4 tickets (Mon Dec 21, 7 PM)",
    amount: 125,
    page: DECKENBACH,
    keywords: ["timberwolves", "suns", "tickets"],
    source: "Bid sheet photo 20261115_082125.jpg",
  },
  {
    item: "Hubworld: Aidalon, signed (Earthborne Games)",
    amount: 100,
    page: PAM_PAGE,
    keywords: ["hubworld", "aidalon"],
    source: "No sheet photo; the payment on Pam's page names it (Nov 15)",
  },
  {
    item: "A year's supply of candied bacon",
    amount: 100,
    page: "Josh Oswald",
    keywords: ["bacon"],
    source: "No sheet photo; the payment to Josh's page names it (Nov 15)",
  },
  {
    item: "KPop Demon Hunters Squishmallows, Sussie and Derpy",
    amount: 110,
    page: DECKENBACH,
    keywords: ["stuffies", "squishmallow", "sussie", "derpy"],
    source: "Sussie's sheet at 2:15 AM (20261115_021521.jpg) had $40; the final sheet wasn't photographed. The payment, \"Silent Auction Stuffies\", is $110",
  },
  {
    item: "Root + The Homeland Expansion (Leder Games)",
    amount: 90,
    page: PAM_PAGE,
    keywords: ["root", "homeland"],
    source: "Bid sheet photo 20261115_082231.jpg",
  },
  {
    item: "Kutná Hora (Czech Games Edition)",
    amount: 40,
    page: PAM_PAGE,
    keywords: ["kutna", "kutná"],
    source: "Bid sheet photo 20261115_081649.jpg",
  },
  {
    item: "Extra Life keyboard and playmat combo",
    amount: 35,
    page: "Zach Lamb",
    keywords: ["keyboard", "playmat"],
    source: "Bid sheet photo 20261115_082309.jpg",
  },
  {
    item: "Grogu Squishmallow",
    amount: 35,
    page: DECKENBACH,
    keywords: ["grogu", "squishmallow"],
    source: "Bid sheet photo 20261115_082251.jpg",
  },
  {
    item: "Chip Theory Kids: Versus Play Collection",
    amount: 30,
    page: PAM_PAGE,
    keywords: ["chip theory", "versus play"],
    source: "Bid sheet photo 20261115_082233.jpg",
  },
  {
    item: "Hexeh, out of print",
    amount: 20,
    page: PAM_PAGE,
    keywords: ["hexeh"],
    source: "Bid sheet photo 20261115_082130.jpg",
  },
  {
    item: "Pink rhodonite and pearl necklace (Beads by Bri, item C)",
    amount: 20,
    page: HOLT,
    keywords: ["necklace", "rhodonite"],
    source: "Bid sheet photo 20261115_082235.jpg",
  },
];

// ── Matching ─────────────────────────────────────────────────────────────────

/** The fields of a DonorDrive gift the matcher reads. */
export type AuctionGift = {
  donationID: string;
  amount?: number;
  displayName?: string;
  message?: string;
  recipientName?: string;
  createdDateUTC: string;
};

/** How a payment was tied to its item. */
export type PaidHow =
  /** `paidBy` names the gift. */
  | "set"
  /** Same amount, and the gift's name or message mentions the auction or the item. */
  | "named"
  /** Same amount, given on the page the item came from. */
  | "page";

export type AuctionResult = { win: AuctionWin } & (
  | { status: "paid"; how: PaidHow; gift?: AuctionGift }
  | { status: "paid-outside"; note: string }
  /** `maybe`: gifts of the same amount nothing else ties to this item. */
  | { status: "waiting"; maybe: AuctionGift[] }
);

export type AuctionTally = {
  results: AuctionResult[];
  /** All the winning bids. */
  total: number;
  /** The ones paid, on Extra Life or otherwise. */
  paid: number;
  /** The ones still owed: the Gameday totals line. */
  unpaid: number;
  /** Gifts that mention the auction but match no item: a payment for
   *  something not on the list, or one with the wrong amount. */
  strays: AuctionGift[];
};

const cents = (n: number) => Math.round(n * 100);
const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
const text = (g: AuctionGift) => norm(`${g.displayName ?? ""} ${g.message ?? ""}`);
const mentionsAuction = (g: AuctionGift) => text(g).includes("auction");
const mentions = (g: AuctionGift, win: AuctionWin) =>
  mentionsAuction(g) || win.keywords.some((k) => text(g).includes(norm(k)));
const toPage = (g: AuctionGift, win: AuctionWin) =>
  typeof g.recipientName === "string" && norm(g.recipientName) === norm(win.page);
const time = (g: AuctionGift) => g.createdDateUTC;

/**
 * Ties each win to the gift that paid it. A gift pays at most one win (unless
 * `paidBy` names it for several). A gift counts automatically only when its
 * amount is exactly the winning bid **and** either it mentions the auction or
 * the item, or it went to the page the item came from. When several fit, the
 * best-tied one wins, then the earliest. Same-amount gifts with nothing else
 * tying them are offered as `maybe` on /silent-auction, never counted.
 *
 * `gifts` should already be limited to AUCTION_PAYMENTS_SINCE; gifts under
 * `ignoreNames` (the chips, the RSVP matches) are never taken.
 */
export function matchAuctionPayments(
  wins: AuctionWin[],
  gifts: AuctionGift[],
  ignoreNames: string[] = [],
): AuctionTally {
  const ignored = new Set(ignoreNames.map(norm));
  const pool = gifts.filter(
    (g) => typeof g.amount === "number" && !(g.displayName && ignored.has(norm(g.displayName))),
  );
  const byId = new Map(gifts.map((g) => [g.donationID, g]));
  const taken = new Set<string>();
  const paid = new Map<number, { how: PaidHow; gift?: AuctionGift }>();

  // Gifts named by hand first, so the matcher can't hand them to another item.
  wins.forEach((w, i) => {
    if (w.paidOutside || !w.paidBy) return;
    taken.add(w.paidBy);
    paid.set(i, { how: "set", gift: byId.get(w.paidBy) });
  });

  // Every (win, gift) pair of the same amount with something else tying them.
  const pairs: { i: number; g: AuctionGift; score: number }[] = [];
  wins.forEach((w, i) => {
    if (w.paidOutside || paid.has(i)) return;
    for (const g of pool) {
      if (cents(g.amount as number) !== cents(w.amount)) continue;
      const score = (mentions(g, w) ? 2 : 0) + (toPage(g, w) ? 1 : 0);
      if (score > 0) pairs.push({ i, g, score });
    }
  });
  pairs.sort((a, b) => b.score - a.score || time(a.g).localeCompare(time(b.g)) || a.i - b.i);
  for (const { i, g, score } of pairs) {
    if (paid.has(i) || taken.has(g.donationID)) continue;
    taken.add(g.donationID);
    paid.set(i, { how: score >= 2 ? "named" : "page", gift: g });
  }

  const results: AuctionResult[] = wins.map((win, i) => {
    if (win.paidOutside) return { win, status: "paid-outside", note: win.paidOutside };
    const p = paid.get(i);
    if (p) return { win, status: "paid", ...p };
    const maybe = pool
      .filter((g) => !taken.has(g.donationID) && cents(g.amount as number) === cents(win.amount))
      .sort((a, b) => time(a).localeCompare(time(b)));
    return { win, status: "waiting", maybe };
  });

  const sum = (rs: AuctionResult[]) => rs.reduce((c, r) => c + cents(r.win.amount), 0) / 100;
  return {
    results,
    total: sum(results),
    paid: sum(results.filter((r) => r.status !== "waiting")),
    unpaid: sum(results.filter((r) => r.status === "waiting")),
    strays: pool.filter((g) => !taken.has(g.donationID) && mentionsAuction(g)),
  };
}

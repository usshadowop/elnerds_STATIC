// /silent-auction: the team's tracker for Game Day 2026's silent auction. Every
// winning bid (src/lib/silentAuction.ts) with the Extra Life gift that paid it,
// found live on DonorDrive, or what's still owed. What's owed is the "Silent
// auction remaining payouts" line in Gameday totals. Not linked from anywhere
// and kept out of search engines, like /modules.
//
// Nothing here is private: winners aren't named (the bid sheets are only in
// the captain's Drive), and the gifts shown are already public on Extra Life.

import { ArrowLeft, CircleCheck, Clock, Gavel } from "lucide-react";

import { LoadingBox } from "@/components/site/LoadingBox";
import { useNoIndex } from "@/hooks/use-noindex";
import { useSilentAuction } from "@/hooks/useSilentAuction";
import { money, parseDonorDriveDate } from "@/lib/donationFormat";
import { claimedDisplayNames } from "@/lib/gamedayTotals";
import type { AuctionGift, AuctionResult, PaidHow } from "@/lib/silentAuction";

const BASE = import.meta.env.BASE_URL;

const HOW: Record<PaidHow, string> = {
  set: "set by hand",
  named: "same amount, and it names the auction or the item",
  page: "same amount, given on the page the item came from",
};

function when(g: AuctionGift): string {
  const at = parseDonorDriveDate(g.createdDateUTC);
  if (Number.isNaN(at)) return "";
  return new Date(at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
}

/** One gift: who gave how much to whom, when, what they wrote, and its id. */
function Gift({ g }: { g: AuctionGift }) {
  return (
    <span className="block">
      <span className="font-bold text-ink">{money(g.amount ?? 0)}</span> from{" "}
      <span className="font-bold text-ink">{g.displayName || "Anonymous"}</span>
      {g.recipientName && <> to {g.recipientName}</>}, {when(g)}
      {g.message && <span className="block italic">&ldquo;{g.message}&rdquo;</span>}
      <span className="block font-mono text-[11px] text-ink-soft/70">{g.donationID}</span>
    </span>
  );
}

function Item({ r }: { r: AuctionResult }) {
  const paid = r.status !== "waiting";
  return (
    <li className="rounded-2xl border border-line bg-paper p-5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-extrabold leading-snug text-ink">{r.win.item}</h3>
          <p className="text-xs text-ink-soft">Pay on {r.win.page}&rsquo;s page</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-display text-xl font-extrabold tabular-nums text-ink">{money(r.win.amount)}</span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest ${
              paid ? "bg-teal-soft text-teal" : "bg-magenta-soft text-magenta"
            }`}
          >
            {paid ? <CircleCheck className="size-3.5" /> : <Clock className="size-3.5" />}
            {paid ? "Paid" : "Waiting"}
          </span>
        </div>
      </div>

      <div className="mt-3 text-sm text-ink-soft">
        {r.status === "paid" &&
          (r.gift ? (
            <>
              <Gift g={r.gift} />
              <span className="mt-1 block text-xs">Matched: {HOW[r.how]}.</span>
            </>
          ) : (
            <span className="block">Paid by gift {r.win.paidBy}, set by hand (it isn&rsquo;t in the gifts read since the auction closed).</span>
          ))}
        {r.status === "paid-outside" && <span className="block">Paid outside Extra Life: {r.note}</span>}
        {r.status === "waiting" &&
          (r.maybe.length > 0 ? (
            <>
              <span className="block text-xs font-bold uppercase tracking-widest text-ink-soft/80">
                Same amount, but nothing else ties it to this item
              </span>
              <span className="mt-1 block space-y-2">
                {r.maybe.slice(0, 3).map((g) => (
                  <Gift key={g.donationID} g={g} />
                ))}
              </span>
              {r.maybe.length > 3 && <span className="mt-1 block text-xs">and {r.maybe.length - 3} more</span>}
            </>
          ) : (
            <span className="block">No gift of {money(r.win.amount)} since the auction closed.</span>
          ))}
      </div>
      <p className="mt-3 text-[11px] text-ink-soft/70">From: {r.win.source}</p>
    </li>
  );
}

export function SilentAuction() {
  useNoIndex();
  const { tally, isLoading, error } = useSilentAuction({ ignoreNames: claimedDisplayNames(), refreshMs: 60_000 });
  const waiting = tally?.results.filter((r) => r.status === "waiting") ?? [];
  const paid = tally?.results.filter((r) => r.status !== "waiting") ?? [];

  return (
    <main className="bg-cream px-4 pt-16 pb-24 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-3xl">
        <a
          href={BASE}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-teal"
        >
          <ArrowLeft className="size-4" />
          Back to elnerds.com
        </a>
        <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">For the team</p>
        <h1 className="flex items-center gap-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          <Gavel className="size-8 shrink-0 text-teal" />
          Silent auction payments
        </h1>
        <p className="mt-3 text-base text-ink-soft">
          Every Game Day 2026 winning bid, and the Extra Life gift that paid it, found automatically on our
          team&rsquo;s pages and Pam&rsquo;s. What&rsquo;s still owed is the &ldquo;Silent auction remaining
          payouts&rdquo; line in the{" "}
          <a href={`${BASE}modules#module-gameday-totals`} className="font-bold text-teal underline underline-offset-2">
            Gameday totals
          </a>
          , and it drops by itself as payments come in. Re-checked every minute.
        </p>

        {!tally ? (
          isLoading ? (
            <LoadingBox className="mt-8 rounded-2xl">Reading the Extra Life gifts…</LoadingBox>
          ) : (
            <p className="mt-8 rounded-2xl border border-line bg-paper p-6 text-sm font-bold text-ink-soft">
              The Extra Life gifts aren&rsquo;t loading right now{error ? ` (${error})` : ""}. Try again in a minute.
            </p>
          )
        ) : (
          <>
            <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Still owed", money(tally.unpaid), `${waiting.length} item${waiting.length === 1 ? "" : "s"}`],
                ["Paid", money(tally.paid), `${paid.length} item${paid.length === 1 ? "" : "s"}`],
                ["All winning bids", money(tally.total), `${tally.results.length} items`],
              ].map(([label, figure, sub]) => (
                <div key={label} className="rounded-2xl border border-line bg-white p-5 text-center shadow-[var(--shadow-soft)]">
                  <dt className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-ink-soft">{label}</dt>
                  <dd className="mt-2 font-display text-3xl font-extrabold tabular-nums text-teal">{figure}</dd>
                  <dd className="mt-1 text-xs text-ink-soft">{sub}</dd>
                </div>
              ))}
            </dl>

            {waiting.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-xl font-extrabold text-ink">Waiting for payment</h2>
                <ul className="mt-4 space-y-3">
                  {waiting.map((r) => (
                    <Item key={r.win.item} r={r} />
                  ))}
                </ul>
              </section>
            )}

            {paid.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-xl font-extrabold text-ink">Paid</h2>
                <ul className="mt-4 space-y-3">
                  {paid.map((r) => (
                    <Item key={r.win.item} r={r} />
                  ))}
                </ul>
              </section>
            )}

            {tally.strays.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-xl font-extrabold text-ink">Auction gifts that match no item</h2>
                <p className="mt-2 text-sm text-ink-soft">
                  These mention the auction but aren&rsquo;t the amount of any item on the list: a win that isn&rsquo;t
                  listed yet, or a payment that differs from the bid.
                </p>
                <ul className="mt-4 space-y-3">
                  {tally.strays.map((g) => (
                    <li key={g.donationID} className="rounded-2xl border border-line bg-paper p-5 text-sm text-ink-soft">
                      <Gift g={g} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        <section className="mt-12 rounded-2xl border border-dashed border-line p-6 text-sm text-ink-soft">
          <h2 className="font-display text-lg font-extrabold text-ink">How a payment is found</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              The gift has to be exactly the winning bid, given after 7 AM Sunday, Nov 15 (an hour before the auctions
              closed).
            </li>
            <li>
              And something else has to tie it to the item: its name or message mentions the auction or the item, or it
              was given on the page of whoever brought the item.
            </li>
            <li>
              A gift that only matches the amount is listed under the item but not counted. If it is the payment, or a
              winner paid a different amount, the gift&rsquo;s id (the small code under it) can be set on the item by
              hand.
            </li>
            <li>Chip donations and RSVP matches are never taken for auction payments.</li>
          </ul>
          <p className="mt-3">
            The list of items is <code className="rounded bg-paper px-1">src/lib/silentAuction.ts</code>.
          </p>
        </section>
      </div>
    </main>
  );
}

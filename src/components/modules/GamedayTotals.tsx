// Module: "Gameday totals". The team's Extra Life page total, read live from
// DonorDrive, plus the other money raised for the event that isn't on that
// page (src/lib/gamedayTotals.ts), added up into one big figure with the
// breakdown underneath. Listed on /modules (src/lib/siteModules.ts).
//
// Since 2026-11-15 it stands in for the old Team Total / Goal / Participants
// block everywhere that block was: under the hero countdown (Hero.tsx), atop
// the roster (ActiveRoster.tsx) and on the Command Center (GamedayDonations.tsx).
//
// Line items are either typed-in amounts or live ones: a running total of
// one Extra Life participant's gifts since a date (useExtraLifeGiftsSince).
// Every live figure re-reads on the same `refreshMs` as the team total.
//
// The grand total only shows once every live figure is in: while they load
// the card shows a placeholder, and if one can't be read the card says so
// instead of showing a total that's short by part of the money.

import type { ReactNode } from "react";

import { useExtraLifeGiftsSince } from "@/hooks/useExtraLifeGiftsSince";
import { useExtraLifeTeam } from "@/hooks/useExtraLifeTeam";
import { money } from "@/lib/donationFormat";
import { GAMEDAY_TOTAL_ITEMS, type GamedayTotalItem } from "@/lib/gamedayTotals";

const TEAM_PAGE_URL = "https://www.extra-life.org/team/73600";

/** Adds dollar amounts without floating-point dust ($0.1 + $0.2). */
function sumCents(amounts: number[]): number {
  return amounts.reduce((cents, a) => cents + Math.round(a * 100), 0) / 100;
}

function LiveTag() {
  return (
    // Inline, so on a narrow phone it wraps with the words.
    <span className="ml-1 inline-block rounded-full bg-teal-soft px-2 py-0.5 align-middle text-[10px] font-extrabold uppercase leading-normal tracking-widest text-teal">
      Live
    </span>
  );
}

/** A live figure: the amount, "…" while the first read is out, "—" if it failed. */
function liveFigure(amount: number | undefined, isLoading: boolean) {
  return typeof amount === "number" ? money(amount) : isLoading ? "…" : "—";
}

function Row({ label, note, children }: { label: ReactNode; note?: string; children: ReactNode }) {
  return (
    <li className="flex items-baseline justify-between gap-4 py-2.5">
      <span className="min-w-0 text-left">
        <span className="block text-sm font-bold text-ink">{label}</span>
        {note && <span className="block text-xs text-ink-soft">{note}</span>}
      </span>
      <span className="shrink-0 font-display text-base font-extrabold tabular-nums text-ink">{children}</span>
    </li>
  );
}

export function GamedayTotals({
  label = "Gameday totals",
  items = GAMEDAY_TOTAL_ITEMS,
  refreshMs,
  children,
}: {
  /** The small heading above the total. */
  label?: string;
  /** The money added to the Extra Life total. Defaults to src/lib/gamedayTotals.ts. */
  items?: GamedayTotalItem[];
  /** Re-read the live figures on this interval (ms). Omit to read them once. */
  refreshMs?: number;
  /** Anything to show at the bottom of the card, such as buttons. */
  children?: ReactNode;
}) {
  const { team, isLoading: teamLoading } = useExtraLifeTeam(refreshMs);
  const liveSpecs = items.flatMap((i) => ("extraLifeGiftsSince" in i ? [i.extraLifeGiftsSince] : []));
  const gifts = useExtraLifeGiftsSince(liveSpecs, refreshMs);

  // Each line item's amount: typed in, or its live running total (undefined
  // until read). Live items take their totals in the order they're listed.
  let nextLive = 0;
  const rows = items.map((item) => ({
    item,
    live: "extraLifeGiftsSince" in item,
    amount: "amount" in item ? item.amount : gifts.amounts[nextLive++],
  }));

  const extraLife = team?.sumDonations;
  const parts = [extraLife, ...rows.map((r) => r.amount)];
  const total = parts.every((a) => typeof a === "number") ? sumCents(parts as number[]) : undefined;
  const isLoading = teamLoading || gifts.isLoading;

  return (
    // A size container, so the big figure scales with the card rather than the
    // window: the card is a third of the Command Center's width but most of a
    // phone's.
    <div className="@container rounded-2xl border border-line bg-white p-6 text-center shadow-[var(--shadow-soft)]">
      <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.25em] text-ink-soft">{label}</p>

      {typeof total === "number" ? (
        <>
          <p className="whitespace-nowrap font-display text-[clamp(1.75rem,16cqw,4.5rem)] font-extrabold leading-none tabular-nums text-teal">
            {money(total)}
          </p>
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-ink-soft sm:text-sm">
            Raised for Gillette Children&rsquo;s Hospital
          </p>
        </>
      ) : isLoading ? (
        <div className="animate-pulse py-1" aria-label="Adding up the total">
          <div className="mx-auto h-14 w-56 max-w-full rounded bg-line" />
          <div className="mx-auto mt-3 h-3 w-48 max-w-full rounded bg-line" />
        </div>
      ) : (
        <p className="py-2 text-sm font-bold text-ink-soft">
          The Extra Life figures aren&rsquo;t loading right now, so the grand total can&rsquo;t be added up.{" "}
          <a href={TEAM_PAGE_URL} target="_blank" rel="noreferrer" className="text-teal underline">
            See it on Extra Life
          </a>
          .
        </p>
      )}

      <ul className="mt-6 divide-y divide-line border-t border-line">
        <Row
          label={
            <>
              Extra Life team page <LiveTag />
            </>
          }
        >
          {liveFigure(extraLife, teamLoading)}
        </Row>
        {rows.map(({ item, live, amount }) => (
          <Row
            key={item.label}
            label={
              live ? (
                <>
                  {item.label} <LiveTag />
                </>
              ) : (
                item.label
              )
            }
            note={item.note}
          >
            {live ? liveFigure(amount, gifts.isLoading) : money(amount as number)}
          </Row>
        ))}
      </ul>
      {children}
    </div>
  );
}

// The Command Center's fundraising section, under the streams: the Gameday
// totals module (the same one as the home page: the Extra Life total plus the
// event's other money) beside a list of the latest donations. Both read
// DonorDrive and refresh every minute, so a page left open on a second monitor
// keeps counting up. Until 2026-11-15 the left card was the team total with
// its goal bar (`TeamProgress`).

import { ExternalLink, Heart } from "lucide-react";

import { GamedayTotals } from "@/components/modules/GamedayTotals";
import { LoadingBox } from "@/components/site/LoadingBox";
import { useNow } from "@/hooks/use-now";
import { useExtraLifeDonations, type ExtraLifeDonation } from "@/hooks/useExtraLifeDonations";
import { money, timeAgo } from "@/lib/donationFormat";

const REFRESH_MS = 60_000;
/** How many donations the list shows. */
const LIST_LENGTH = 10;
const TEAM_PAGE_URL = "https://www.extra-life.org/team/73600";

function DonationRow({ d, now }: { d: ExtraLifeDonation; now: number }) {
  const message = d.message?.trim();
  return (
    <li className="flex gap-3 py-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-magenta-soft">
        <Heart className="size-4 fill-magenta text-magenta" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink">
          <span className="font-extrabold">{d.displayName || "Anonymous"}</span>
          {d.recipientName && <span className="text-ink-soft"> for {d.recipientName}</span>}
        </p>
        {message && (
          <p className="mt-0.5 line-clamp-2 text-sm italic text-ink-soft">&ldquo;{message}&rdquo;</p>
        )}
      </div>
      {/* Amount over time, on the right of every row at every width. */}
      <div className="flex shrink-0 flex-col items-end">
        {typeof d.amount === "number" && (
          <span className="font-display text-base font-extrabold leading-tight tabular-nums text-teal">
            {money(d.amount)}
          </span>
        )}
        <span className="text-xs text-ink-soft/70">{timeAgo(d.createdDateUTC, now)}</span>
      </div>
    </li>
  );
}

export function GamedayDonations({ donateUrl }: { donateUrl: string }) {
  const { donations, isLoading: donationsLoading } = useExtraLifeDonations(LIST_LENGTH, REFRESH_MS);
  const now = useNow(30_000);

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Gameday totals ---------------------------------------------------- */}
      {/* A failed refresh keeps the last total; the module handles loading and
          a first read that never landed. */}
      <div className="lg:col-span-2 lg:self-start">
        <GamedayTotals refreshMs={REFRESH_MS}>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 pt-6">
            <a
              href={donateUrl}
              className="inline-block rounded-full bg-orange px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:brightness-110"
            >
              Donate Now
            </a>
            <a
              href={TEAM_PAGE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-teal transition-colors hover:text-teal-bright"
            >
              Team page <ExternalLink className="size-3.5" />
            </a>
          </div>
        </GamedayTotals>
      </div>

      {/* Latest donations -------------------------------------------------- */}
      <div className="rounded-2xl border border-line bg-paper p-6 shadow-[var(--shadow-soft)] lg:col-span-3">
        <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.25em] text-ink-soft">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-magenta opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-magenta" />
          </span>
          Latest donations
        </p>
        {donations.length > 0 ? (
          <ul className="divide-y divide-line" aria-live="polite">
            {donations.map((d) => (
              <DonationRow key={d.donationID} d={d} now={now} />
            ))}
          </ul>
        ) : donationsLoading ? (
          <LoadingBox className="mt-3 rounded-xl">Loading donations&hellip;</LoadingBox>
        ) : (
          <p className="py-8 text-center text-sm font-bold text-ink-soft">
            No donations to show right now.{" "}
            <a href={donateUrl} className="text-teal underline">
              Be the next one
            </a>
            !
          </p>
        )}
      </div>
    </div>
  );
}

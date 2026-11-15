// Module: "Extra Life Page donation totals". The Team Total / Goal /
// Participants brick with its progress bar, in a white card, read live from
// the team's Extra Life page (DonorDrive). Saved 2026-11-15 from the card
// under the hero countdown, so it can be dropped onto any page later:
// <ExtraLifeDonationTotals /> fetches its own data and needs nothing passed in.
//
// The brick itself is the shared `TeamProgress` block (also in the hero, the
// roster section and the Command Center), so a change there shows here too.
// Listed on /modules with every other module (src/lib/siteModules.ts).

import { TeamProgress, TeamProgressSkeleton } from "@/components/site/TeamProgress";
import { useExtraLifeTeam } from "@/hooks/useExtraLifeTeam";

const TEAM_PAGE_URL = "https://www.extra-life.org/team/73600";

export function ExtraLifeDonationTotals({
  label = "Team fundraising",
  refreshMs,
}: {
  /** The small heading above the figures. */
  label?: string;
  /** Re-read the total on this interval (ms). Omit to read it once. */
  refreshMs?: number;
}) {
  const { team, isLoading } = useExtraLifeTeam(refreshMs);

  return (
    <div className="rounded-2xl border border-line bg-white p-6 text-center shadow-[var(--shadow-soft)]">
      <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.25em] text-ink-soft">{label}</p>
      {/* A failed refresh keeps the last total; only a first read that never
          landed shows the link. Never a $0, which reads as a terrible year. */}
      {team ? (
        <TeamProgress team={team} />
      ) : isLoading ? (
        <TeamProgressSkeleton />
      ) : (
        <p className="text-sm font-bold text-ink-soft">
          The team total isn&rsquo;t loading right now.{" "}
          <a href={TEAM_PAGE_URL} target="_blank" rel="noreferrer" className="text-teal underline">
            See it on Extra Life
          </a>
          .
        </p>
      )}
    </div>
  );
}

import type { ExtraLifeTeam } from "@/hooks/useExtraLifeTeam";

// The team's fundraising summary — total, goal, participants and a progress
// bar. Rendered inside the Team section's summary card and, since 2026-11-07,
// in a card of its own under the hero countdown. One component so the two
// never drift.
const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

function teamProgressPct(team: ExtraLifeTeam) {
  return team.fundraisingGoal > 0 ? Math.min((team.sumDonations / team.fundraisingGoal) * 100, 100) : 0;
}

export function TeamProgress({ team }: { team: ExtraLifeTeam }) {
  const pct = teamProgressPct(team);
  return (
    <>
      <div className="grid grid-cols-3 gap-2 text-center sm:gap-4">
        <div>
          <div className="min-w-0 whitespace-nowrap font-display text-[clamp(1.125rem,5.5vw,1.875rem)] font-extrabold tabular-nums text-teal">
            {money(team.sumDonations)}
          </div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
            Team Total
          </div>
        </div>
        <div>
          <div className="min-w-0 whitespace-nowrap font-display text-[clamp(1.125rem,5.5vw,1.875rem)] font-extrabold tabular-nums text-magenta">
            {money(team.fundraisingGoal)}
          </div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
            Goal
          </div>
        </div>
        <div>
          <div className="min-w-0 whitespace-nowrap font-display text-[clamp(1.125rem,5.5vw,1.875rem)] font-extrabold tabular-nums text-orange">
            {team.numParticipants}
          </div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
            Participants
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="h-3 w-full overflow-hidden rounded-full bg-teal-soft">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal to-teal-bright transition-all duration-1000 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs font-bold text-ink-soft">
          {pct.toFixed(1)}% of goal reached
        </p>
      </div>
    </>
  );
}

export function TeamProgressSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-8 w-20 rounded bg-line" />
            <div className="h-3 w-16 rounded bg-line" />
          </div>
        ))}
      </div>
      <div className="mt-5 h-3 w-full rounded-full bg-line" />
    </div>
  );
}

import { useExtraLifeTeam, type ExtraLifeParticipant } from "@/hooks/useExtraLifeTeam";

/* ───── currency formatter ───── */
const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });

/* ───── skeleton placeholder ───── */
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-line bg-paper p-6">
      <div className="flex items-center gap-4">
        <div className="size-14 shrink-0 rounded-full bg-line" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 rounded bg-line" />
          <div className="h-3 w-20 rounded bg-line" />
        </div>
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-line" />
      <div className="mt-3 flex justify-between">
        <div className="h-3 w-16 rounded bg-line" />
        <div className="h-3 w-12 rounded bg-line" />
      </div>
    </div>
  );
}

/* ───── participant card ───── */
function ParticipantCard({ p }: { p: ExtraLifeParticipant }) {
  const pct = p.fundraisingGoal > 0 ? Math.min((p.sumDonations / p.fundraisingGoal) * 100, 100) : 0;

  return (
    <div className="group relative flex flex-col rounded-3xl border border-line bg-paper p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      {/* badges */}
      <div className="absolute right-4 top-4 flex gap-1.5">
        {p.isTeamCaptain && (
          <span className="rounded-full bg-teal px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
            Captain
          </span>
        )}
        {p.isTeamCoCaptain && (
          <span className="rounded-full bg-purple px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
            Co-Captain
          </span>
        )}
        {p.streamIsLive && (
          <span className="flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-white" />
            Live
          </span>
        )}
      </div>

      {/* avatar + name */}
      <div className="flex items-center gap-4">
        <img
          src={p.avatarImageURL}
          alt={p.displayName}
          className="size-14 shrink-0 rounded-full border-2 border-line object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="min-w-0 pr-16">
          <h3 className="truncate font-display text-lg font-extrabold text-ink">
            {p.displayName}
          </h3>
          <p className="text-xs font-bold text-ink-soft">
            {p.numDonations} {p.numDonations === 1 ? "donation" : "donations"}
          </p>
        </div>
      </div>

      {/* progress bar */}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-teal-soft">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal to-teal-bright transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex items-baseline justify-between text-xs font-bold">
          <span className="text-teal">{money(p.sumDonations)} raised</span>
          <span className="text-ink-soft">of {money(p.fundraisingGoal)}</span>
        </div>
      </div>

      {/* actions */}
      <div className="mt-4 flex gap-2">
        <a
          href={p.links.donate}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-xl bg-magenta px-4 py-2.5 text-center text-xs font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:bg-magenta/90 hover:shadow-md"
        >
          Donate
        </a>
        <a
          href={p.links.page}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-line px-4 py-2.5 text-center text-xs font-extrabold uppercase tracking-wider text-ink-soft transition-all duration-200 hover:border-teal hover:text-teal"
        >
          Profile
        </a>
      </div>
    </div>
  );
}

/* ───── main section ───── */
export function ActiveRoster() {
  const { team, participants, isLoading, error } = useExtraLifeTeam();

  if (error) {
    return (
      <section id="active-roster" className="bg-paper px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
            Active Roster
          </p>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Our Participants
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft">
            We couldn't load the roster right now.{" "}
            <a
              href="https://dd.extra-life.org/teams/73600"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-teal underline underline-offset-2 hover:text-teal-bright"
            >
              Visit our team page →
            </a>
          </p>
        </div>
      </section>
    );
  }

  const teamPct =
    team && team.fundraisingGoal > 0
      ? Math.min((team.sumDonations / team.fundraisingGoal) * 100, 100)
      : 0;

  return (
    <section id="active-roster" className="bg-paper px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
            Active Roster
          </p>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
            Our Participants
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm font-medium text-ink-soft">
            Every member of our team is playing for the kids. Click donate to support any participant directly.
          </p>
        </div>

        {/* team summary stats */}
        {!isLoading && team && (
          <div className="mx-auto mb-12 max-w-2xl rounded-3xl border border-line bg-cream p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-display text-2xl font-extrabold text-teal sm:text-3xl">
                  {money(team.sumDonations)}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                  Team Total
                </div>
              </div>
              <div>
                <div className="font-display text-2xl font-extrabold text-magenta sm:text-3xl">
                  {money(team.fundraisingGoal)}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                  Goal
                </div>
              </div>
              <div>
                <div className="font-display text-2xl font-extrabold text-orange sm:text-3xl">
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
                  style={{ width: `${teamPct}%` }}
                />
              </div>
              <p className="mt-2 text-center text-xs font-bold text-ink-soft">
                {teamPct.toFixed(1)}% of goal reached
              </p>
            </div>
          </div>
        )}

        {/* loading skeleton */}
        {isLoading && (
          <div className="mx-auto mb-12 max-w-2xl">
            <div className="animate-pulse rounded-3xl border border-line bg-cream p-6 sm:p-8">
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
          </div>
        )}

        {/* participant grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : participants.map((p) => <ParticipantCard key={p.participantID} p={p} />)}
        </div>

        {/* join CTA */}
        {!isLoading && team && (
          <div className="mt-12 text-center">
            <a
              href={team.links.join}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-2xl bg-teal px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-lift)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-bright hover:shadow-lg"
            >
              Join Our Team
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

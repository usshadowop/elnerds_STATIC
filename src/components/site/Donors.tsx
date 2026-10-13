import { ArrowUpRight, Building2 } from "lucide-react";
import { useExtraLifeDonors } from "@/hooks/useExtraLifeDonors";

// The Game Day venue is a donation too, and a big one: it gets its own block
// above the in-kind list rather than a line in it.
const VENUE = {
  name: "Improving",
  href: "https://www.improving.com/",
  blurb: "The home of Game Day 2026 — their Minneapolis office, donated for the whole 24 hours.",
};

const inKindDonors: { name: string; href?: string }[] = [
  { name: "Mike Hochscheidt - Miniatures" },
  { name: "Mike Smith - Board Games" },
];

const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

function ExtraLifeDonorWall() {
  const { donors, isLoading, error } = useExtraLifeDonors();

  if (isLoading) {
    return (
      <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <li key={i} className="border-l-2 border-teal/40 pl-3">
            <div className="h-3.5 w-24 animate-pulse rounded bg-teal/15" />
            <div className="mt-1.5 h-2.5 w-12 animate-pulse rounded bg-teal/10" />
          </li>
        ))}
      </ul>
    );
  }

  if (error || donors.length === 0) {
    return (
      <p className="text-sm font-bold text-ink-soft">
        Be the first to donate this year —{" "}
        <a
          href="https://www.extra-life.org/team/73600"
          target="_blank"
          rel="noreferrer"
          className="text-teal underline underline-offset-2 hover:text-teal-bright"
        >
          support the team →
        </a>
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
      {donors.map((donor) => (
        <li
          key={donor.donorID ?? donor.displayName}
          className="border-l-2 border-teal/40 pl-3"
        >
          <span className="block truncate text-sm font-bold text-ink">
            {donor.displayName}
          </span>
          <span className="text-xs font-bold text-teal">
            {money(donor.sumDonations)}
            {donor.numDonations > 1 && (
              <span className="font-semibold text-ink-soft">
                {" "}
                &middot; {donor.numDonations} gifts
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Donors() {
  return (
    <section id="donors" className="bg-paper px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
            Our Supporters
          </p>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
            2026 Donors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-soft sm:text-lg">
            Every contribution — large, small, cash, or in-kind — helps heal kids at
            Gillette Children&rsquo;s Hospital.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-line bg-cream p-8 shadow-[var(--shadow-soft)] md:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal text-white font-display font-extrabold">
                EL
              </span>
              <div>
                <h3 className="font-display text-xl font-extrabold text-ink">
                  Extra Life Donors
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">
                  Donations through Extra Life
                </p>
              </div>
            </div>
            <ExtraLifeDonorWall />
          </div>

          <div className="flex flex-col gap-8">
            <div className="rounded-3xl border border-line bg-cream p-8 shadow-[var(--shadow-soft)]">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-purple text-white">
                  <Building2 className="size-5" />
                </span>
                <h3 className="font-display text-xl font-extrabold text-ink">Venue Donation</h3>
              </div>
              <a
                href={VENUE.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 font-display text-3xl font-extrabold tracking-tight text-purple underline decoration-purple/30 decoration-4 underline-offset-8 transition-colors hover:text-magenta hover:decoration-magenta/40 sm:text-4xl"
              >
                {VENUE.name}
                <ArrowUpRight className="size-6 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <p className="mt-4 text-sm text-ink-soft">{VENUE.blurb}</p>
            </div>

            <div className="flex-1 rounded-3xl border border-line bg-cream p-8 shadow-[var(--shadow-soft)]">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-orange text-white font-display font-extrabold">
                  IK
                </span>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-ink">
                    In-Kind Donors
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">
                    Goods &amp; services
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                {inKindDonors.map((donor) => (
                  <li
                    key={donor.name}
                    className="border-l-2 border-orange/50 pl-3 text-sm font-bold text-ink"
                  >
                    {donor.href ? (
                      <a
                        href={donor.href}
                        target="_blank"
                        rel="noreferrer"
                        className="underline transition-colors hover:text-orange"
                      >
                        {donor.name}
                      </a>
                    ) : (
                      donor.name
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

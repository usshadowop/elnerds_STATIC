const extraLifeDonors = [
  "Alex Rivera",
  "Jordan Chen",
  "Sam Patel",
  "Taylor Brooks",
  "Morgan Hayes",
  "Casey Nguyen",
  "Jamie Lopez",
  "Riley Thompson",
  "Drew Kim",
  "Avery Johnson",
  "Skyler Martinez",
  "Quinn O'Brien",
  "Reese Anderson",
  "Parker Singh",
  "Hayden Clark",
  "Logan Walker",
  "Cameron Reed",
  "Emerson Diaz",
  "Sloane Murphy",
  "Blair Sullivan",
];

const inKindDonors = ["Pixel Cafe", "Quest Energy"];

export function Donors() {
  return (
    <section id="donors" className="bg-paper px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
            Our Supporters
          </p>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
            Donors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-soft sm:text-lg">
            Every contribution — large, small, cash, or in-kind — helps heal kids at
            Children&rsquo;s Miracle Network Hospitals.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-line bg-cream p-8 shadow-[var(--shadow-soft)] md:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-teal text-white font-display font-extrabold">
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
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {extraLifeDonors.map((name) => (
                <li
                  key={name}
                  className="border-l-2 border-teal/40 pl-3 text-sm font-bold text-ink"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-line bg-cream p-8 shadow-[var(--shadow-soft)]">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-orange text-white font-display font-extrabold">
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
              {inKindDonors.map((name) => (
                <li
                  key={name}
                  className="border-l-2 border-orange/50 pl-3 text-sm font-bold text-ink"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

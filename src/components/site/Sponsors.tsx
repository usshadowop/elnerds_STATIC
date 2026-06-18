export function Sponsors() {
  return (
    <section id="sponsors" className="bg-cream px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-gradient-to-br from-teal to-purple p-10 text-center text-white sm:p-14">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/70">
            Thank You
          </p>
          <h3 className="mx-auto mb-4 max-w-3xl font-display text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
            Our 2024 sponsors and donors helped us raise over{" "}
            <span className="text-orange">$43,000</span> for Children&rsquo;s Miracle Network.
          </h3>
          <p className="mx-auto mb-10 max-w-2xl text-white/80 sm:text-lg">
            Team Extra Life Nerds is in your debt. Thank you for making the games count.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-white/90">
            {["TECH GEAR PRO", "VALKYRIE STREAMING", "PIXEL CAFE", "QUEST ENERGY", "TITAN PERIPHERALS"].map(
              (name) => (
                <span
                  key={name}
                  className="font-display text-base font-extrabold tracking-wider sm:text-lg"
                >
                  {name}
                </span>
              ),
            )}
          </div>
          <div className="mt-10">
            <a
              href="https://www.extra-life.org/team/73600"
              className="inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:brightness-110"
            >
              Become a 2026 Sponsor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

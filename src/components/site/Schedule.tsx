const ITEMS = [
  {
    time: "Nov 14 · 8:00 AM – 5:00 PM",
    title: "Open House Family Gaming",
    blurb: "Drop in, meet the team, and play with us. Open to all ages — bring the whole family.",
    color: "border-teal",
    accent: "text-teal",
  },
  {
    time: "Nov 14, 8 AM → Nov 15, 8 AM",
    title: "24-Hour Marathon Kickoff",
    blurb:
      "We go live and don't stop for 24 straight hours. Every minute of play helps fund care for kids at Gillette Children's Hospital.",
    color: "border-magenta",
    accent: "text-magenta",
    main: true,
  },
  {
    time: "Nov 15 · 8:00 AM",
    title: "Finale & Grand Total",
    blurb: "Cross the finish line together and reveal what we raised — for the kids.",
    color: "border-orange",
    accent: "text-orange",
  },
];

export function Schedule() {
  return (
    <section id="schedule" className="bg-cream px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">
            Game Day 2026
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Two days. One mission.
          </h2>
        </div>

        <div className="grid gap-4">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className={`group relative grid gap-4 rounded-2xl border-l-4 bg-paper p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 md:grid-cols-12 md:items-center md:gap-6 ${item.color}`}
            >
              {item.main && (
                <span className="absolute right-4 top-4 rounded-full bg-magenta px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Main Event
                </span>
              )}
              <div className="md:col-span-4">
                <p className={`font-display text-base font-extrabold ${item.accent}`}>
                  {item.time}
                </p>
              </div>
              <div className="md:col-span-8">
                <h3 className="mb-1 font-display text-xl font-extrabold text-ink">{item.title}</h3>
                <p className="text-sm text-ink-soft sm:text-base">{item.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

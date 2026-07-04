import { useState } from "react";

interface SubEvent {
  time: string;
  title: string;
  blurb: string;
  color: string;
  accent: string;
}

interface EventItem {
  time: string;
  title: string;
  blurb: string;
  details?: string;
  detailsList?: string[];
  color: string;
  accent: string;
  main?: boolean;
  subEvents?: SubEvent[];
}

const ITEMS: EventItem[] = [
  {
    time: "Aug 8 · 3:00 PM – 6:00 PM",
    title: "Extra Life Bingo",
    blurb: "Join the Extra Life Leadership for a thrilling night of Bingo located at Truplayerz Sports Training & Upper Deck Lounge!",
    detailsList: [
      "10 game Bingo bundle — $20",
      "16 oz pounders — $6/each, 2 for $8",
      "12 oz cans — $4",
      "Nutrl vodka seltzers — $5",
    ],
    details: "All proceeds go directly to Gillette Children's Hospital through Extra Life.",
    color: "border-purple",
    accent: "text-purple",
  },
  {
    time: "Nov 14, 8 AM → Nov 15, 8 AM",
    title: "24-Hour Marathon",
    blurb:
      "We go live and don't stop for 24 straight hours. Every minute of play helps fund care for kids at Gillette Children's Hospital.",
    details:
      "The main event! We kick off 24 consecutive hours of gaming at 8:00 AM on November 14th and don't stop until 8:00 AM on November 15th. Join us in person or watch the livestream. Every donation and every hour of play makes a difference.",
    color: "border-magenta",
    accent: "text-magenta",
    main: true,
    subEvents: [
      {
        time: "Nov 14 · 8:00 AM – 5:00 PM",
        title: "Open House Family Gaming",
        blurb: "Drop in, meet the team, and play with us. Open to all ages — bring the whole family.",
        color: "border-teal",
        accent: "text-teal",
      },
      {
        time: "Nov 15 · 8:00 AM",
        title: "Finale & Grand Total",
        blurb: "Cross the finish line together and reveal what we raised — for the kids.",
        color: "border-orange",
        accent: "text-orange",
      },
    ],
  },
];

export function Schedule() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="schedule" className="bg-cream px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">
            2026 Events
          </p>
        </div>

        <div className="grid gap-4">
          {ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.title}
                className={`group relative rounded-2xl border-l-4 bg-paper shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 ${item.color}`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full cursor-pointer p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="grid gap-4 md:grid-cols-12 md:items-center md:gap-6">
                    <div className="md:col-span-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={`font-display text-base font-extrabold ${item.accent}`}>
                          {item.time}
                        </p>
                        {item.main && (
                          <span className="shrink-0 rounded-full bg-magenta px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                            Main Event
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-7">
                      <h3 className="mb-1 font-display text-xl font-extrabold text-ink">{item.title}</h3>
                      <p className="text-sm text-ink-soft sm:text-base">{item.blurb}</p>
                    </div>
                    <div className="md:col-span-1 md:flex md:justify-end">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                        isOpen
                          ? "bg-ink/10 text-ink-soft"
                          : "bg-teal-soft text-teal"
                      }`}>
                        {isOpen ? "Close" : "Details"}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expandable details */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-line px-6 pt-4 pb-6">
                    {/* Line-item list (e.g. Bingo pricing) */}
                    {item.detailsList && (
                      <ul className="mb-3 space-y-1">
                        {item.detailsList.map((line) => (
                          <li key={line} className="text-sm font-semibold text-ink sm:text-base">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.details && (
                      <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
                        {item.details}
                      </p>
                    )}

                    {/* Sub-events (nested cards) */}
                    {item.subEvents && (
                      <div className="mt-4 grid gap-3">
                        {item.subEvents.map((sub) => (
                          <div
                            key={sub.title}
                            className={`rounded-xl border-l-4 bg-cream p-4 ${sub.color}`}
                          >
                            <div className="grid gap-2 sm:grid-cols-12 sm:items-center sm:gap-4">
                              <div className="sm:col-span-4">
                                <p className={`font-display text-sm font-extrabold ${sub.accent}`}>
                                  {sub.time}
                                </p>
                              </div>
                              <div className="sm:col-span-8">
                                <h4 className="mb-0.5 font-display text-base font-extrabold text-ink">
                                  {sub.title}
                                </h4>
                                <p className="text-sm text-ink-soft">{sub.blurb}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

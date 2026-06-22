"use client";

import { useEffect, useState } from "react";

const YEARLY_RAISED = [
  { value: "$43.5K", label: "Raised in 2023" },
  { value: "$53.5K", label: "Raised in 2024" },
  { value: "$51K", label: "Raised in 2025" },
];

const STATS = [
  { value: "$500K+", label: "Raised All-Time", color: "text-teal", bg: "bg-teal-soft" },
  { value: "100+", label: "Active Gamers", color: "text-purple", bg: "bg-teal-soft" },
  { value: "#21", label: "Of 2,800+ Teams", color: "text-orange", bg: "bg-orange-soft" },
];

const FADE_MS = 1000;
const CYCLE_MS = 5000;

export function Stats() {
  const [yearIndex, setYearIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setYearIndex((i) => (i + 1) % YEARLY_RAISED.length);
        setVisible(true);
      }, FADE_MS);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  const yearly = YEARLY_RAISED[yearIndex];

  return (
    <section id="mission" className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
            Our Impact
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Every controller. Every dollar. Every kid.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div
            className={`rounded-2xl ${STATS[0].bg} p-6 text-center transition-transform hover:-translate-y-1`}
          >
            <div
              className={`mb-2 font-display text-4xl font-extrabold md:text-5xl ${STATS[0].color}`}
            >
              {STATS[0].value}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              {STATS[0].label}
            </div>
          </div>
          <div className="rounded-2xl bg-magenta-soft p-6 text-center transition-transform hover:-translate-y-1">
            <div
              className={`mb-2 font-display text-4xl font-extrabold text-magenta transition-opacity duration-1000 md:text-5xl ${visible ? "opacity-100" : "opacity-0"}`}
            >
              {yearly.value}
            </div>
            <div
              className={`text-xs font-bold uppercase tracking-wider text-ink-soft transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
            >
              {yearly.label}
            </div>
          </div>
          {STATS.slice(1).map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl ${s.bg} p-6 text-center transition-transform hover:-translate-y-1`}
            >
              <div className={`mb-2 font-display text-4xl font-extrabold md:text-5xl ${s.color}`}>
                {s.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

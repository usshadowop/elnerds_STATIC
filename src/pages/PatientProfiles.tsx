import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import adelynn from "@/assets/kids/Adelynn.jpg";
import benny from "@/assets/kids/Benny.jpg";
import carter from "@/assets/kids/Carter.jpg";
import holli from "@/assets/kids/Holli.jpg";
import john from "@/assets/kids/John.jpg";
import kayden from "@/assets/kids/Kayden.jpg";
import lainey from "@/assets/kids/Lainey.jpg";
import leo from "@/assets/kids/Leo.jpg";
import liam from "@/assets/kids/Liam.jpg";
import logan from "@/assets/kids/Logan.jpg";
import maverick from "@/assets/kids/Maverick.jpg";
import mckinley from "@/assets/kids/McKinley.jpg";
import rosemary from "@/assets/kids/Rosemary.jpg";
import sam from "@/assets/kids/Sam.jpg";
import cam from "@/assets/kids/2026_CMN_Champion_-_Cam_Moskowitz_One-pager.jpg";

const profiles = [
  { name: "Cam Moskowitz", tag: "2026 CMN Champion", photo: cam },
  { name: "Adelynn", tag: "Local Champion", photo: adelynn },
  { name: "Benny", tag: "Local Champion", photo: benny },
  { name: "Carter", tag: "Local Champion", photo: carter },
  { name: "Holli", tag: "Local Champion", photo: holli },
  { name: "John", tag: "Local Champion", photo: john },
  { name: "Kayden", tag: "Local Champion", photo: kayden },
  { name: "Lainey", tag: "Local Champion", photo: lainey },
  { name: "Leo", tag: "Local Champion", photo: leo },
  { name: "Liam", tag: "Local Champion", photo: liam },
  { name: "Logan", tag: "Local Champion", photo: logan },
  { name: "Maverick", tag: "Local Champion", photo: maverick },
  { name: "McKinley", tag: "Local Champion", photo: mckinley },
  { name: "Rosemary", tag: "Local Champion", photo: rosemary },
  { name: "Sam", tag: "Local Champion", photo: sam },
];

export function PatientProfiles() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
      if (e.key === "ArrowRight") setActiveIdx((i) => (i === null ? i : (i + 1) % profiles.length));
      if (e.key === "ArrowLeft")
        setActiveIdx((i) => (i === null ? i : (i - 1 + profiles.length) % profiles.length));
    };
    window.addEventListener("keydown", onKey);
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = orig;
    };
  }, [activeIdx]);

  const active = activeIdx === null ? null : profiles[activeIdx];

  return (
    <main>
      <section className="bg-cream px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
              Why We Play
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
              Meet the Kids
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-ink-soft sm:text-lg">
              Every dollar raised helps kids like these get the care they need at
              Gillette Children&rsquo;s Hospital. Tap a profile to read their story.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {profiles.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setActiveIdx(i)}
                className="group overflow-hidden rounded-2xl border border-line bg-paper text-left shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="aspect-[1275/1650] overflow-hidden">
                  <img
                    src={p.photo}
                    alt={p.name}
                    className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="font-display text-sm font-extrabold text-ink">{p.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft">
                    {p.tag}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.name}'s story`}
          onClick={() => setActiveIdx(null)}
        >
          <div className="relative max-h-full w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveIdx(null)}
              aria-label="Close"
              className="absolute -top-3 -right-3 z-10 grid size-10 place-items-center rounded-full bg-white text-ink shadow-[var(--shadow-lift)] transition hover:bg-magenta hover:text-white"
            >
              <X className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveIdx((i) => (i === null ? i : (i - 1 + profiles.length) % profiles.length))}
              aria-label="Previous profile"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/90 text-teal shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIdx((i) => (i === null ? i : (i + 1) % profiles.length))}
              aria-label="Next profile"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/90 text-teal shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-white"
            >
              <ChevronRight className="size-6" />
            </button>

            <div className="max-h-[85vh] overflow-y-auto rounded-2xl border border-line shadow-[var(--shadow-lift)]">
              <img src={active.photo} alt={active.name} className="w-full" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

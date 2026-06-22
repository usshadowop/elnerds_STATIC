import { useState } from "react";
import { ChevronUp, ChevronDown, Youtube, X } from "lucide-react";
import storyImg from "@/assets/why-we-play.jpg";
import event1 from "@/assets/carousel/event-1.jpg";
import event2 from "@/assets/carousel/event-2.jpg";
import event3 from "@/assets/carousel/event-3.jpg";
import event4 from "@/assets/carousel/event-4.jpg";
import event5 from "@/assets/carousel/event-5.jpg";

const slides = [
  { src: storyImg, alt: "A lit candle beside a game controller, in memory of Victoria Enmon" },
  { src: event1, alt: "Extra Life Nerds volunteer at the fundraiser event table" },
  { src: event2, alt: "Volunteer cooking waffles at the Extra Life event" },
  { src: event3, alt: "Community members chatting at the Extra Life fundraiser" },
  { src: event4, alt: "A young attendee trying an Invincikids VR headset" },
  { src: event5, alt: "Extra Life Nerds team member at a gaming station with RGB PC" },
];

export function WhyWePlay() {
  const [idx, setIdx] = useState(0);
  const n = slides.length;
  const at = (i: number) => slides[(i % n + n) % n];
  const prev = () => setIdx((i) => (i - 1 + n) % n);
  const next = () => setIdx((i) => (i + 1) % n);

  return (
    <section id="story" className="bg-paper px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20">
        <div className="order-2 md:order-1">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-teal-soft to-magenta-soft"
            />

            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-1/2 top-2 z-10 grid size-10 -translate-x-1/2 place-items-center rounded-full bg-white/90 text-teal shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-white"
            >
              <ChevronUp className="size-5" />
            </button>

            <div className="flex flex-col items-center gap-3">
              {/* Previous (peek) */}
              <img
                src={at(idx - 1).src}
                alt=""
                aria-hidden
                className="h-16 w-[78%] cursor-pointer rounded-2xl object-cover opacity-50 blur-[1px] transition hover:opacity-80 sm:h-20"
                onClick={prev}
              />

              {/* Current */}
              <img
                key={idx}
                src={at(idx).src}
                alt={at(idx).alt}
                loading="lazy"
                className="aspect-[4/5] w-full animate-fade-in rounded-3xl border border-line object-cover shadow-[var(--shadow-lift)]"
              />

              {/* Next (peek) */}
              <img
                src={at(idx + 1).src}
                alt=""
                aria-hidden
                className="h-16 w-[78%] cursor-pointer rounded-2xl object-cover opacity-50 blur-[1px] transition hover:opacity-80 sm:h-20"
                onClick={next}
              />
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute bottom-2 left-1/2 z-10 grid size-10 -translate-x-1/2 place-items-center rounded-full bg-white/90 text-teal shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-white"
            >
              <ChevronDown className="size-5" />
            </button>

            <div className="mt-4 flex justify-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-teal" : "w-1.5 bg-ink-soft/30"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
            Our Story
          </p>
          <h2 className="mb-6 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Why We Play
          </h2>

          <VictoriaStoryReveal />

          <div className="space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg">
            <p>
              Extra Life began with a young girl named{" "}
              <span className="font-extrabold text-ink">Victoria Enmon</span>. During her battle
              with acute lymphoblastic leukemia, video games were her escape and her joy.
            </p>
            <p>
              The gaming community rallied to support her hospital. Though Victoria passed away,
              her legacy ignited a global movement of gamers playing for kids who can&rsquo;t.
            </p>
            <p>
              Every dollar Extra Life Nerds raises supports Gillette Children&rsquo;s Hospital —
              funding life-saving equipment, research, and care for kids in our community.
            </p>
          </div>
          <div className="mt-10">
            <a
              href="https://www.extra-life.org/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:bg-teal-bright"
            >
              Learn About Extra Life →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function VictoriaStoryReveal() {
  const [open, setOpen] = useState(false);
  const videoId = "rHSZ_82wiJg";

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-3 rounded-full border-2 border-magenta/30 bg-white px-5 py-3 text-left shadow-[var(--shadow-soft)] transition-all hover:border-magenta hover:shadow-[var(--shadow-lift)]"
        aria-label="Learn about Victoria's Story"
      >
        <span className="grid size-10 place-items-center rounded-full bg-magenta text-white transition-transform group-hover:scale-110">
          <Youtube className="size-5" />
        </span>
        <span className="font-display text-base font-extrabold tracking-tight text-ink sm:text-lg">
          Learn about{" "}
          <span className="bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
            Victoria&rsquo;s Story
          </span>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label="Victoria's Story video"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute -top-3 -right-3 z-10 grid size-10 place-items-center rounded-full bg-white text-ink shadow-[var(--shadow-lift)] transition hover:bg-magenta hover:text-white"
            >
              <X className="size-5" />
            </button>
            <div className="overflow-hidden rounded-2xl border border-line shadow-[var(--shadow-lift)]">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Victoria's Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="aspect-video w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

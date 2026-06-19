import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Baby, Building2, X } from "lucide-react";
import heroImg from "@/assets/hero-marathon.jpg";
import { useCountdown } from "@/hooks/use-countdown";
import { StyledButton } from "@/components/site/StyledButton";

// Game Day 2026 kickoff: Nov 14, 2026 8:00 AM Central Time (US) = 14:00 UTC
const GAME_DAY_ISO = "2026-11-14T14:00:00Z";

// Carousel images — add more entries here to extend the carousel.
const carouselSlides: { src: string; alt: string }[] = [
  {
    src: heroImg,
    alt: "Families and gamers smiling together at an Extra Life charity gaming event",
  },
];

function Unit({ value, label, accent }: { value: number; label: string; accent: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <span
        className={`inline-block min-w-[2.5ch] text-center font-display text-4xl font-extrabold tabular-nums sm:text-5xl md:text-6xl ${accent}`}
      >
        {value.toString().padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-ink-soft">
        {label}
      </span>
    </div>
  );
}

function FloatingHearts({ active }: { active: boolean }) {
  // 6 hearts at fixed positions/delays so animation is consistent.
  const hearts = [
    { left: "8%", delay: "0s", size: 14 },
    { left: "22%", delay: "0.25s", size: 18 },
    { left: "42%", delay: "0.5s", size: 12 },
    { left: "60%", delay: "0.1s", size: 16 },
    { left: "78%", delay: "0.4s", size: 14 },
    { left: "92%", delay: "0.6s", size: 18 },
  ];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      {hearts.map((h, i) => (
        <Heart
          key={i}
          size={h.size}
          className="absolute bottom-2 fill-magenta text-magenta opacity-0"
          style={{
            left: h.left,
            animation: active ? `heart-float 1.6s ${h.delay} ease-out infinite` : "none",
            animationFillMode: "both",
          }}
        />
      ))}
    </div>
  );
}

const GILLETTE_VIDEO_ID = "f2grSvl9KgM";

export function Hero() {
  const c = useCountdown(GAME_DAY_ISO);
  const [slide, setSlide] = useState(0);
  const [heartsOn, setHeartsOn] = useState(false);
  const [gilletteVideoOpen, setGilletteVideoOpen] = useState(false);
  const slides = carouselSlides.length;
  const prev = () => setSlide((s) => (s - 1 + slides) % slides);
  const next = () => setSlide((s) => (s + 1) % slides);

  return (
    <section id="top" className="relative overflow-hidden px-4 pt-12 pb-16 sm:px-6 lg:pt-20 lg:pb-24">
      {/* Soft ambient color */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, var(--color-teal-soft), transparent 70%), radial-gradient(40% 40% at 10% 20%, var(--color-magenta-soft), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-teal">
          <span className="size-2 rounded-full bg-magenta" aria-hidden />
          Game Day · Nov 14–15, 2026
        </div>

        <h1 className="mb-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl lg:text-8xl">
          Play Games.{" "}
          <span className="bg-gradient-to-r from-teal via-magenta to-orange bg-clip-text text-transparent">
            Heal Kids.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base text-ink-soft sm:text-lg md:text-xl">
          We&rsquo;re the Extra Life Nerds — a community of gamers raising funds for
          Gillette Children&rsquo;s Hospital through 24 hours of nonstop play.
        </p>

        {/* Countdown card */}
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.25em] text-ink-soft">
            Countdown to kickoff
          </p>
          <div
            role="timer"
            aria-label="Countdown to Game Day 2026"
            className="grid grid-cols-4 items-center gap-4 sm:gap-6"
          >
            <Unit value={c.days} label="Days" accent="text-teal" />
            <Unit value={c.hours} label="Hours" accent="text-magenta" />
            <Unit value={c.minutes} label="Mins" accent="text-purple" />
            <Unit value={c.seconds} label="Secs" accent="text-orange" />
          </div>
        </div>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          <div
            className="relative"
            onMouseEnter={() => setHeartsOn(true)}
            onMouseLeave={() => setHeartsOn(false)}
            onFocus={() => setHeartsOn(true)}
            onBlur={() => setHeartsOn(false)}
          >
            <a
              href="https://www.extra-life.org/team/73600"
              className="relative z-10 inline-block rounded-full bg-orange px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:brightness-110"
            >
              Donate Now
            </a>
            <FloatingHearts active={heartsOn} />
          </div>
          <a
            href={`${import.meta.env.BASE_URL}registration`}
            className="rounded-full border-2 border-teal bg-white px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-teal transition-all hover:bg-teal hover:text-white"
          >
            Join The Team
          </a>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-line shadow-[var(--shadow-lift)]">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${slide * 100}%)` }}
            >
              {carouselSlides.map((s, i) => (
                <div key={i} className="w-full shrink-0">
                  <img
                    src={s.src}
                    alt={s.alt}
                    width={1600}
                    height={896}
                    className="aspect-[16/9] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {slides > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-white/90 text-teal shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-white sm:left-4"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-white/90 text-teal shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-white sm:right-4"
              >
                <ChevronRight className="size-6" />
              </button>

              <div className="mt-4 flex justify-center gap-2">
                {carouselSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === slide ? "w-6 bg-teal" : "w-2 bg-ink-soft/30"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <StyledButton
            icon={Baby}
            text="Get to know"
            highlight="the kids"
            href={`${import.meta.env.BASE_URL}patient-profiles`}
          />
          <StyledButton
            icon={Building2}
            text="Get to know"
            highlight="Gillette"
            onClick={() => setGilletteVideoOpen(true)}
          />
        </div>
      </div>

      {gilletteVideoOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label="Gillette Children's Hospital video"
          onClick={() => setGilletteVideoOpen(false)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setGilletteVideoOpen(false)}
              aria-label="Close video"
              className="absolute -top-3 -right-3 z-10 grid size-10 place-items-center rounded-full bg-white text-ink shadow-[var(--shadow-lift)] transition hover:bg-magenta hover:text-white"
            >
              <X className="size-5" />
            </button>
            <div className="overflow-hidden rounded-2xl border border-line shadow-[var(--shadow-lift)]">
              <iframe
                src={`https://www.youtube.com/embed/${GILLETTE_VIDEO_ID}?autoplay=1`}
                title="Gillette Children's Hospital"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="aspect-video w-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

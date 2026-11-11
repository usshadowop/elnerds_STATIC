// Placemaker Hospitality is the parent company of several restaurants, and
// asked to be shown as those restaurants rather than under its own logo. So its
// entry is a small carousel: one restaurant at a time, each with its own logo
// and a link to its own site, credited "by Placemaker Hospitality".
//
// - The order is fixed (`PLACEMAKER_RESTAURANTS`), but the restaurant it opens
//   on is picked at random on every page load, so each one is first equally often.
// - It advances by itself every 4 seconds and loops. Autoplay holds while a mouse
//   is over it or keyboard focus is inside it, and is off entirely when the
//   visitor's device asks for reduced motion. The arrows and dots always work,
//   and any change of slide starts a fresh 4 seconds.
// - Two layouts share one engine: `PlacemakerCarouselRow` is the row in the home
//   page's Food Donation card, `PlacemakerCarouselTile` the tile in the
//   /gameday sponsor grid.

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { FocusEvent, PointerEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { PLACEMAKER_NAME, PLACEMAKER_RESTAURANTS } from "@/lib/placemakerRestaurants";

const AUTOPLAY_MS = 4000;
const COUNT = PLACEMAKER_RESTAURANTS.length;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Module-level, so React subscribes once rather than on every render.
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
}

function useCarousel() {
  // A random first restaurant, chosen once per page load.
  const [index, setIndex] = useState(() => Math.floor(Math.random() * COUNT));
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion();
  const autoplaying = !hovered && !focused && !reducedMotion;

  const go = useCallback((step: number) => setIndex((i) => (i + step + COUNT) % COUNT), []);

  // One timer per slide: whether the slide changed by hand or by this timer, the
  // next change is a fresh 4 seconds away. Pausing cancels it; resuming restarts it.
  useEffect(() => {
    if (!autoplaying) return;
    const timer = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, autoplaying, go]);

  const regionProps = {
    // Only a real mouse pauses it: on a phone a tap leaves "hover" stuck on, and
    // the same trap froze the donation ticker once (see the extra-life-api card).
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setHovered(true);
    },
    onPointerLeave: () => setHovered(false),
    // Keyboard focus pauses it; a mouse click or a tap on a button does not.
    onFocus: (e: FocusEvent) => {
      if (e.target.matches(":focus-visible")) setFocused(true);
    },
    onBlur: (e: FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
    },
  };

  return {
    index,
    setIndex,
    go,
    regionProps,
    // Screen readers are told about a new slide only when it changed on request,
    // not on every tick of the timer.
    live: autoplaying ? ("off" as const) : ("polite" as const),
  };
}

// Every slide stays laid out in the same grid cell, so the carousel is always as
// tall as its tallest slide and the card around it never jumps. Inactive slides
// are hidden from sight, from the tab order and from screen readers.
//
// Each slide element also gets `inert={!active}`: the moment a slide stops being
// current it can take no focus and no clicks, even while it is still fading out.
// Without it, the 300ms fade left the old slide focusable (a Tab could land on it,
// then lose focus when the fade ended), and on the wrap from the last restaurant
// to the first the old slide sits on top, so a click opened the wrong restaurant.
const slideClass = (active: boolean) =>
  `transition-[opacity,visibility] duration-300 motion-reduce:transition-none ${
    active ? "visible opacity-100" : "invisible opacity-0"
  }`;

function ArrowButton({
  direction,
  onClick,
  className = "",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous restaurant" : "Next restaurant"}
      className={`grid size-8 shrink-0 place-items-center rounded-full bg-white text-gold shadow-[var(--shadow-soft)] ring-1 ring-line transition hover:bg-gold hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
    >
      <Icon className="size-5" />
    </button>
  );
}

function Dots({
  index,
  onSelect,
  className = "",
}: {
  index: number;
  onSelect: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center ${className}`}>
      {PLACEMAKER_RESTAURANTS.map((r, i) => (
        <button
          key={r.name}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Show ${r.name}`}
          aria-current={i === index}
          className="group grid h-6 place-items-center px-0.5 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold"
        >
          <span
            className={`h-2 rounded-full transition-all motion-reduce:transition-none ${
              i === index ? "w-5 bg-gold" : "w-2 bg-ink-soft/30 group-hover:bg-ink-soft/50"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/** The Placemaker row in the home page's Food Donation card. Sits where the other
 *  rows do and looks like them: logo on the left, the name as a link, a small line
 *  under it. */
export function PlacemakerCarouselRow() {
  const c = useCarousel();
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${PLACEMAKER_NAME} restaurants`}
      className="border-l-2 border-gold/50 pl-3"
      {...c.regionProps}
    >
      <div aria-live={c.live} className="grid">
        {PLACEMAKER_RESTAURANTS.map((r, i) => (
          <div
            key={r.name}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${COUNT}`}
            inert={i !== c.index}
            className={`col-start-1 row-start-1 flex items-center gap-3 ${slideClass(i === c.index)}`}
          >
            <span className="grid h-14 w-20 shrink-0 place-items-center sm:w-24">
              <img src={r.logo} alt="" className="max-h-14 max-w-full object-contain" />
            </span>
            <span className="min-w-0">
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1 text-sm font-bold text-ink underline decoration-gold/40 decoration-2 underline-offset-4 transition-colors hover:text-gold"
              >
                {r.name}
                <ArrowUpRight className="size-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <span className="block text-xs font-bold uppercase tracking-widest text-ink-soft">
                by {PLACEMAKER_NAME}
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <ArrowButton direction="prev" onClick={() => c.go(-1)} />
        <Dots index={c.index} onSelect={c.setIndex} />
        <ArrowButton direction="next" onClick={() => c.go(1)} />
      </div>
    </div>
  );
}

/** The Placemaker tile in the /gameday "Links to our sponsors!" grid: the same
 *  shape as its neighbours, with the arrows over the logo. */
export function PlacemakerCarouselTile() {
  const c = useCarousel();
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${PLACEMAKER_NAME} restaurants`}
      className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]"
      {...c.regionProps}
    >
      <div className="relative border-b border-line bg-white">
        {/* The logos are clickable for a mouse, but hidden from screen readers and
            the tab order: the text link below goes to the same place. */}
        <div aria-hidden="true" className="grid h-28">
          {PLACEMAKER_RESTAURANTS.map((r, i) => (
            <div
              key={r.name}
              inert={i !== c.index}
              className={`col-start-1 row-start-1 grid place-items-center px-11 ${slideClass(i === c.index)}`}
            >
              <a href={r.href} target="_blank" rel="noreferrer" tabIndex={-1}>
                <img src={r.logo} alt="" className="max-h-16 max-w-full object-contain" />
              </a>
            </div>
          ))}
        </div>
        <ArrowButton direction="prev" onClick={() => c.go(-1)} className="absolute left-1.5 top-1/2 -translate-y-1/2" />
        <ArrowButton direction="next" onClick={() => c.go(1)} className="absolute right-1.5 top-1/2 -translate-y-1/2" />
        <Dots index={c.index} onSelect={c.setIndex} className="absolute inset-x-0 bottom-0 justify-center" />
      </div>
      <div aria-live={c.live} className="grid flex-1">
        {PLACEMAKER_RESTAURANTS.map((r, i) => (
          <div
            key={r.name}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${COUNT}`}
            inert={i !== c.index}
            className={`col-start-1 row-start-1 flex ${slideClass(i === c.index)}`}
          >
            <a
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-1 items-center justify-between gap-3 px-5 py-4"
            >
              <span>
                <span className="block font-display text-base font-extrabold text-ink">{r.name}</span>
                <span className="block text-xs font-bold uppercase tracking-widest text-ink-soft">
                  by {PLACEMAKER_NAME}
                </span>
              </span>
              <ExternalLink className="size-4 shrink-0 text-teal transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

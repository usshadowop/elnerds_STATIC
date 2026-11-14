// /parking — where to park for Game Day and how to get from the lot to the
// room: the owner's annotated map, then the walk in, one photo per step.
// Sent by link (the Game Day email, texts) and linked from the Command Center
// and the /gameday countdown, so it stands on its own.
//
// The images are 1200px copies in public/photos/parking/, so the Game Day email can
// show the same files at fixed addresses (elnerds.com/photos/parking/...). The
// full-size sources are in 2026_photos/arrival/. The step text describes only
// what the photos and signs show.

import { ArrowLeft, ArrowRight, MapPin, Navigation } from "lucide-react";

import { getRsvpEvent } from "@/lib/rsvpEvents";

const BASE = import.meta.env.BASE_URL;
const IMG = `${BASE}photos/parking/`;

// The venue line is the marathon's RSVP location, so it's written down once.
// Directions use the dir/ form so the route starts from the visitor.
const VENUE = getRsvpEvent("marathon")?.location ?? "Improving, 3033 Excelsior Blvd #180, Minneapolis, MN 55416";
const [VENUE_NAME, ...VENUE_REST] = VENUE.split(", ");
const VENUE_ADDRESS = VENUE_REST.join(", ");
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE)}`;

// The arrow colours on the map image itself.
const ROUTES = [
  { swatch: "bg-[#e8261f]", label: "Red", text: "Coming from the east on W Lake St" },
  { swatch: "bg-[#2563eb]", label: "Blue", text: "Coming from the west on W Lake St, or from the south on Excelsior Blvd" },
];

const STEPS = [
  {
    file: "1-building-entrance.jpg",
    title: "Head for the covered entrance",
    text: "From the parking lot, look for the canopy with the Lakeside Center sign.",
  },
  {
    file: "2-front-doors.jpg",
    title: "In through the glass doors",
    text: "They open onto the ground floor.",
  },
  {
    file: "3-directory-with-arrows.jpg",
    title: "Spot our arrows on the directory",
    text: "Just inside, the Lakeside Center directory has Game Day arrows taped on, pointing to Improving, suite 180.",
  },
  {
    file: "4-lobby-hallway.jpg",
    title: "Walk down the hallway",
    text: "The long one, with the orange sculpture overhead.",
  },
  {
    file: "5-vending-and-stairs.jpg",
    title: "Up one level to the first floor",
    text: "Take the stairs at the Vending & Stairs sign, or the elevators around the corner to the left. Improving is suite 180.",
    // A tall photo whose signs sit high up: keep them in the 4:3 crop.
    position: "object-[center_25%]",
  },
];

function Eyebrow({ children, className = "text-magenta" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] ${className}`}>{children}</p>;
}

export function Parking() {
  return (
    <main className="bg-cream px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-5xl">
        <a
          href={BASE}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-teal"
        >
          <ArrowLeft className="size-4" />
          Back to elnerds.com
        </a>

        <div className="mb-10 text-center">
          <Eyebrow>Game Day 2026 · Saturday, Nov 14</Eyebrow>
          <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-5xl">
            Parking &amp; Getting In
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft sm:text-lg">
            Improving is inside Lakeside Center, one floor up from the entrance. Here&rsquo;s where to park
            and how to find us once you&rsquo;re through the doors.
          </p>
        </div>

        {/* Address + directions -------------------------------------------- */}
        <div className="mb-12 flex flex-col items-start gap-4 rounded-2xl border border-line bg-paper p-5 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-soft text-teal">
              <MapPin className="size-6" />
            </span>
            <div>
              <p className="font-display text-lg font-extrabold text-ink">{VENUE_NAME}</p>
              <p className="text-sm text-ink-soft">{VENUE_ADDRESS}</p>
            </div>
          </div>
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-teal px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:bg-teal-bright"
          >
            <Navigation className="size-4" />
            Directions
          </a>
        </div>

        {/* Where to park ---------------------------------------------------- */}
        <section className="mb-16">
          <Eyebrow className="text-teal">Where to park</Eyebrow>
          <h2 className="mb-5 font-display text-2xl font-extrabold text-ink sm:text-3xl">
            The lot beside the building, off Excelsior Blvd
          </h2>
          <a
            href={`${IMG}parking-map.jpg`}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]"
          >
            <img
              src={`${IMG}parking-map.jpg`}
              alt="Aerial map of Improving at Lakeside Center: a red route from the east along W Lake St and blue routes from the west on W Lake St and from the south on Excelsior Blvd, all ending in the parking lot beside the building, off Excelsior Blvd."
              width={1185}
              height={702}
              className="block h-auto w-full"
            />
          </a>
          <p className="mt-2 text-center text-xs text-ink-soft">Tap the map or any photo to see it full size.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {ROUTES.map((r) => (
              <li key={r.label} className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-4">
                <span className={`mt-1.5 h-1.5 w-8 shrink-0 rounded-full ${r.swatch}`} aria-hidden />
                <p className="text-sm text-ink sm:text-base">
                  <span className="font-extrabold">{r.label}:</span> {r.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* The walk in ------------------------------------------------------ */}
        <section>
          <Eyebrow className="text-orange">The way in</Eyebrow>
          <h2 className="mb-6 font-display text-2xl font-extrabold text-ink sm:text-3xl">
            From the lot to the room
          </h2>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <li
                key={s.file}
                className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]"
              >
                <a href={`${IMG}${s.file}`} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={`${IMG}${s.file}`}
                    alt={s.title}
                    loading="lazy"
                    className={`block aspect-[4/3] w-full object-cover ${s.position ?? ""}`}
                  />
                </a>
                <div className="flex gap-3 p-5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-magenta font-display text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold leading-snug text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-14 text-center">
          <a
            href={`${BASE}gameday`}
            className="inline-flex items-center gap-2 rounded-full bg-magenta px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:opacity-90"
          >
            Made it? Open the Game Day page
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </main>
  );
}

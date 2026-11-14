// /prizes — Game Day's hourly prize drawings and silent auctions, the donation
// tokens (poker chips, DonationChips.tsx), the prizes you can win in an event,
// and a look at the prize tables. Sent by link (the
// Game Day email, texts) and linked from the Command Center and the /gameday
// countdown, so it stands on its own.
//
// The drawing and auction rules are the owner's words of 2026-11-14; change
// them here if they change. The free-ticket line is the same promise as the
// one above Event Details (GamedayEventDetails.tsx); keep the two together.
// "Win it in an event" is read live from the Gameday Signups tab: any row with
// a "Prize:" line in its Details cell shows up, so it needs no edit here.
// The photos are 1200px copies in public/photos/prizes/ (sources in
// 2026_photos/prizes/), so emails can use the same files.

import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, CircleCheck, Clock, Gavel, Gift, MapPin, Repeat, Store, Ticket } from "lucide-react";

import { DonationChipsSection } from "@/components/site/DonationChips";
import { PrizeBox } from "@/components/site/GamedayEventDetails";
import { LoadingBox } from "@/components/site/LoadingBox";
import { useGameday } from "@/hooks/use-countdown";
import { useGamedayContent } from "@/hooks/use-gameday-content";
import { getRsvpEvent } from "@/lib/rsvpEvents";

const BASE = import.meta.env.BASE_URL;
const IMG = `${BASE}photos/prizes/`;

const MARATHON = getRsvpEvent("marathon")?.calendar;
const GAME_DAY_START = MARATHON?.start ?? "2026-11-14T08:00:00-06:00";
const GAME_DAY_END = MARATHON?.end ?? "2026-11-15T08:00:00-06:00";

const SOURCE_URL = "https://www.sourcecandg.com";

const TABLE_PHOTOS = [1, 2, 3, 4, 5, 6].map((n) => `table-${n}.jpg`);

// What the setup-night photos show, so people can tell what's up for grabs.
const SPOTTED = [
  "Codenames",
  "Codenames Duet",
  "Eternal Palace",
  "Wispwood",
  "Mystic Paths",
  "Distant Suns",
  "Biomos",
  "Ahoy",
  "Kingyo",
  "Fort",
  "Get 9",
  "Schitt's Creek: Love That Journey",
  "Neighborhood Hide & Seek",
];

function Eyebrow({ children, className = "text-magenta" }: { children: ReactNode; className?: string }) {
  return <p className={`mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] ${className}`}>{children}</p>;
}

function Rule({ icon: Icon, children, tone }: { icon: typeof Ticket; children: ReactNode; tone: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${tone}`}>
        <Icon className="size-4" />
      </span>
      <span className="text-sm text-ink sm:text-base">{children}</span>
    </li>
  );
}

/** Every Game Day event with a "Prize:" line, live from the sheet. The whole
 *  section hides when there are none (or the sheet can't be read). */
function EventPrizes() {
  const { content, settled } = useGamedayContent();
  const withPrizes = content.signups.filter((s) => s.prize);
  if (settled && withPrizes.length === 0) return null;

  return (
    <section className="mb-16">
      <Eyebrow className="text-orange">Win it in an event</Eyebrow>
      <h2 className="mb-2 font-display text-2xl font-extrabold text-ink sm:text-3xl">Event prizes</h2>
      <p className="mb-6 text-sm text-ink-soft sm:text-base">
        Some Game Day events have a prize of their own.{" "}
        <a href={`${BASE}gameday_events`} className="font-bold text-teal underline underline-offset-2 hover:text-teal-bright">
          Sign up for events
        </a>
      </p>
      {!settled ? (
        <LoadingBox className="rounded-2xl">Loading event prizes…</LoadingBox>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {withPrizes.map((s) => (
            <li key={`${s.event}|${s.when}`} className="rounded-2xl border border-line bg-paper p-5 shadow-[var(--shadow-soft)]">
              <p className="font-display text-lg font-extrabold leading-snug text-ink">{s.event}</p>
              <p className="mb-3 text-sm font-bold text-ink-soft">{s.when}</p>
              {s.prize && <PrizeBox prize={s.prize} />}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Prizes() {
  const { phase } = useGameday(GAME_DAY_START, GAME_DAY_END);

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
            Prizes &amp; Silent Auctions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft sm:text-lg">
            Prize drawings every hour from noon to 3 PM, silent auctions running the whole event, and
            donation tokens to win all night.
          </p>
        </div>

        {phase === "after" && (
          <div className="mb-10 rounded-2xl border border-line bg-paper px-5 py-4 text-center">
            <p className="text-sm font-bold text-ink-soft">
              Game Day 2026 has wrapped. These were the prizes and auctions for the 2026 marathon. Thanks
              to everyone who played, bid, and donated.
            </p>
          </div>
        )}

        {/* The two ways to win ---------------------------------------------- */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 md:items-start">
          <section className="rounded-3xl border border-line bg-paper p-7 shadow-[var(--shadow-soft)] sm:p-8">
            <Eyebrow>Prize drawings</Eyebrow>
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Every hour, noon to 3 PM</h2>
            <ul className="mt-6 space-y-4">
              <Rule icon={Ticket} tone="bg-magenta-soft text-magenta">
                <strong>Tickets are $1 each.</strong>
              </Rule>
              <Rule icon={Clock} tone="bg-magenta-soft text-magenta">
                A drawing every hour from noon to 3 PM on Saturday, with multiple prizes up for grabs
                each hour.
              </Rule>
              <Rule icon={Repeat} tone="bg-magenta-soft text-magenta">
                Every ticket you enter can win in any hour&rsquo;s drawing.
              </Rule>
              <Rule icon={MapPin} tone="bg-magenta-soft text-magenta">
                <strong>You must be present to win.</strong>{" "}
                <a href={`${BASE}parking`} className="font-bold text-teal underline underline-offset-2 hover:text-teal-bright">
                  How to get here
                </a>
              </Rule>
              <Rule icon={Gift} tone="bg-magenta-soft text-magenta">
                <strong>Win free tickets:</strong> everyone who enters a Game Day event gets 1 free ticket,
                and each event&rsquo;s winner gets 5 more.{" "}
                <a href={`${BASE}gameday_events`} className="font-bold text-teal underline underline-offset-2 hover:text-teal-bright">
                  See the events
                </a>
              </Rule>
            </ul>
          </section>

          <section className="rounded-3xl border border-line bg-paper p-7 shadow-[var(--shadow-soft)] sm:p-8">
            <Eyebrow className="text-teal">Silent auctions</Eyebrow>
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">All event long</h2>
            <ul className="mt-6 space-y-4">
              <Rule icon={Gavel} tone="bg-teal-soft text-teal">
                Silent auctions run through the entire event, 8 AM Saturday to 8 AM Sunday.
              </Rule>
              <Rule icon={CircleCheck} tone="bg-teal-soft text-teal">
                <strong>You don&rsquo;t need to be present to win.</strong>
              </Rule>
            </ul>
          </section>
        </div>

        {/* Donation tokens (the poker chips) --------------------------------- */}
        <DonationChipsSection />

        {/* Event prizes, live from the sheet --------------------------------- */}
        <EventPrizes />

        {/* The prize tables ------------------------------------------------- */}
        <section>
          <Eyebrow className="text-purple">A look at the prizes</Eyebrow>
          <h2 className="mb-2 font-display text-2xl font-extrabold text-ink sm:text-3xl">On the prize tables</h2>
          <p className="mb-6 text-sm text-ink-soft sm:text-base">
            Photos from setup night. Tap any photo to see it full size.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {TABLE_PHOTOS.map((file, i) => (
              <a
                key={file}
                href={`${IMG}${file}`}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)]"
              >
                <img
                  src={`${IMG}${file}`}
                  alt={`Prize table, section ${i + 1} of 6: board games, puzzles and plush`}
                  loading="lazy"
                  className="block aspect-[4/3] w-full object-cover"
                />
              </a>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <p className="text-sm text-ink sm:text-base">
              <span className="font-extrabold">Spotted on the tables:</span> {SPOTTED.join(", ")}, the Extra
              Life 1000-piece puzzle, a dice tray, Squishmallows and more plush, and $25 gift certificates to
              Source Comics &amp; Games.
            </p>
          </div>

          {/* Thanks to Source ---------------------------------------------- */}
          <div className="mt-6 flex flex-col gap-5 overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)] sm:flex-row sm:items-center">
            <a
              href={`${IMG}source-gift-certificate.jpg`}
              target="_blank"
              rel="noreferrer"
              className="block shrink-0 sm:w-56"
            >
              <img
                src={`${IMG}source-gift-certificate.jpg`}
                alt="A $25 Source Comics & Games gift certificate made out to “Extra Life Event Donation”"
                loading="lazy"
                className="block aspect-[4/3] w-full object-cover object-[center_70%] sm:aspect-square"
              />
            </a>
            <div className="px-5 pb-5 sm:py-5 sm:pr-6 sm:pl-0">
              <p className="mb-1 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">
                <Store className="size-3.5" /> Thank you
              </p>
              <p className="font-display text-lg font-extrabold text-ink">Source Comics &amp; Games</p>
              <p className="mt-1 text-sm text-ink-soft">
                Donated the $25 gift certificates on the prize tables. Find them at 2057 Snelling Ave N,
                Roseville.
              </p>
              <a
                href={SOURCE_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-teal underline underline-offset-2 hover:text-teal-bright"
              >
                sourcecandg.com
              </a>
            </div>
          </div>
        </section>

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <a
            href={`${BASE}parking`}
            className="inline-flex items-center gap-2 rounded-full border-2 border-teal px-6 py-2.5 text-sm font-extrabold uppercase tracking-wider text-teal transition-all hover:bg-teal-soft"
          >
            Parking &amp; way in
          </a>
          <a
            href={`${BASE}gameday`}
            className="inline-flex items-center gap-2 rounded-full bg-magenta px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-[var(--shadow-soft)] transition-all hover:opacity-90"
          >
            Open the Game Day page
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </main>
  );
}

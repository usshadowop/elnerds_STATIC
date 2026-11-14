// /prizes — Game Day's prize drawings (9, from 10 AM to 10 PM) and silent auctions, the donation
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
import { ArrowLeft, ArrowRight, CircleCheck, Clock, Coins, Gavel, Gift, MapPin, Repeat, Store, Ticket } from "lucide-react";

import { DonationChipsSection } from "@/components/site/DonationChips";
import { PrizeBox } from "@/components/site/GamedayEventDetails";
import { LoadingBox } from "@/components/site/LoadingBox";
import { useGameday } from "@/hooks/use-countdown";
import { useGamedayContent } from "@/hooks/use-gameday-content";
import { getRsvpEvent } from "@/lib/rsvpEvents";
import { sponsorLogos } from "@/lib/sponsorLogos";

const BASE = import.meta.env.BASE_URL;
const IMG = `${BASE}photos/prizes/`;

const MARATHON = getRsvpEvent("marathon")?.calendar;
const GAME_DAY_START = MARATHON?.start ?? "2026-11-14T08:00:00-06:00";
const GAME_DAY_END = MARATHON?.end ?? "2026-11-15T08:00:00-06:00";

const SOURCE_URL = "https://sourcecomicsandgames.com/";
const LEVEL_UP_URL = "https://www.levelupshoponline.com/";

// Nine drawings, one every 1½ hours from 10 AM to 10 PM on Saturday (the
// owner, 2026-11-14). The Game Day email lists the same times.
const DRAWING_TIMES = ["10 AM", "11:30 AM", "1 PM", "2:30 PM", "4 PM", "5:30 PM", "7 PM", "8:30 PM", "10 PM"];

// Silent-auction items, from the owner's list of 2026-11-14 (no photos except
// the poster, which is featured on its own below the list). The Game Day email
// lists the same items.
const AUCTION_ITEMS: { group: string; items: string[] }[] = [
  {
    group: "Squishmallows",
    items: ["Sussie and Derpy from KPop Demon Hunters", "Grogu from The Mandalorian"],
  },
  {
    group: "Board games",
    items: [
      "Hoplomachus: Victorum (Chip Theory Games)",
      "A Too Many Bones pack (Chip Theory Games)",
      "Kutná Hora (Czech Games Edition)",
      "Hexeh, out of print (Hexeh Games)",
      "Hubworld: Aidalon, signed and unreleased, still crowdfunding (Earthborne Games)",
    ],
  },
  { group: "Jewelry", items: ["Handmade stone jewelry"] },
];

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
    <section className="mt-16">
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
            Nine prize drawings from 10 AM to 10 PM, silent auctions running the whole event, and
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
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">9 drawings, 10 AM to 10 PM</h2>
            <ul className="mt-6 space-y-4">
              <Rule icon={Ticket} tone="bg-magenta-soft text-magenta">
                <strong>Tickets are $1 each.</strong>
              </Rule>
              <Rule icon={Clock} tone="bg-magenta-soft text-magenta">
                A drawing every 1&frac12; hours on Saturday, with multiple prizes up for grabs in each one:
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {DRAWING_TIMES.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-magenta-soft px-2.5 py-0.5 text-xs font-extrabold whitespace-nowrap text-magenta"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              </Rule>
              <Rule icon={Repeat} tone="bg-magenta-soft text-magenta">
                Every ticket you enter can win in any drawing.
              </Rule>
              <Rule icon={Coins} tone="bg-magenta-soft text-magenta">
                <strong>Every raffle prize comes with a $10 donation token</strong> (a white chip, see
                below).
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

            <div className="mt-6 rounded-2xl bg-teal-soft p-5">
              <p className="mb-3 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">
                <Gift className="size-3.5" /> Up for bid
              </p>
              <div className="space-y-4">
                {AUCTION_ITEMS.map((g) => (
                  <div key={g.group}>
                    <p className="font-display text-base font-extrabold text-ink">{g.group}</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-soft marker:text-teal">
                      {g.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <p className="text-sm font-bold text-ink">&hellip;and the big one below.</p>
              </div>
            </div>

            {/* The headline auction item (the owner's photos, 2026_photos/auction/) */}
            <div className="mt-7 overflow-hidden rounded-2xl border border-line">
              <a href={`${IMG}avengers-signed-poster.jpg`} target="_blank" rel="noreferrer" className="block">
                <img
                  src={`${IMG}avengers-signed-poster.jpg`}
                  alt="A framed The Avengers movie poster signed by the cast"
                  loading="lazy"
                  className="block aspect-[4/3] w-full object-cover"
                />
              </a>
              <div className="p-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal">The big one</p>
                <p className="mt-1 font-display text-lg font-extrabold leading-snug text-ink">
                  A signed <em>The Avengers</em> poster
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  Framed, signed by Robert Downey Jr., Chris Evans, Chris Hemsworth, Mark Ruffalo, Scarlett
                  Johansson and Jeremy Renner, with a certificate of authenticity.
                </p>

                {/* Thanks to Level Up Games, who donated it */}
                <div className="mt-4 flex flex-col items-start gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:gap-4">
                  <a
                    href={LEVEL_UP_URL}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="grid h-12 w-24 shrink-0 place-items-start sm:place-items-center"
                  >
                    <img src={sponsorLogos.levelUp} alt="" className="max-h-11 w-auto object-contain" />
                  </a>
                  <p className="text-sm text-ink-soft">
                    <span className="font-bold text-ink">Donated by Level Up Games.</span> Thank you! They
                    sell board games, comics, roleplaying games, trading cards and video games, run events,
                    and take trade-ins.{" "}
                    <a
                      href={LEVEL_UP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold whitespace-nowrap text-teal underline underline-offset-2 hover:text-teal-bright"
                    >
                      levelupshoponline.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Donation tokens (the poker chips) --------------------------------- */}
        <DonationChipsSection />

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
                Donated several $25 gift certificates for the prize tables. Find them at 2057 Snelling Ave N,
                Roseville.
              </p>
              <a
                href={SOURCE_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-teal underline underline-offset-2 hover:text-teal-bright"
              >
                sourcecomicsandgames.com
              </a>
            </div>
          </div>
        </section>

        {/* Event prizes, live from the sheet (at the bottom, the owner's call) */}
        <EventPrizes />

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

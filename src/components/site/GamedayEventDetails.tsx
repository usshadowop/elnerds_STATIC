// "Event Details" under the Game Day schedule (home page and /gameday).
//
// Since 2026-11-08 it is built from the "Gameday Signups" tab, grouped by
// activity, and since 2026-11-10 those cards sit under section headings
// (Dungeons & Dragons, Magic, Video Games, Other; see sectionSignups()): rows that share a Group (column E) become one card with the
// group's Price (column F) in pink, and each row is a line with its time in
// blue, a live spots chip for Extra Life incentives, and a sign-up button.
// Rows with no Group get a card of their own. Anything still typed into the
// "Gameday Event Details" tab (Title, Details) is listed under the cards for
// notes that aren't sign-up events. Hidden while both tabs are empty.

import {
  incentiveOf,
  spotsLabel,
  useIncentiveStock,
  type IncentiveStock,
} from "@/hooks/useExtraLifeIncentives";
import { useState } from "react";
import { ArrowUpRight, Gift } from "lucide-react";

import {
  ownPagePath,
  sectionSignups,
  type GamedayEventDetail,
  type GamedaySignupEvent,
  type GamedayTextPart,
} from "@/lib/gamedayContent";

/** Live "3 of 5 left" / "Full" chip for an Extra Life incentive; nothing
 *  when the row links no incentive or its count is unknown. */
export function SpotsChip({ stock }: { stock: IncentiveStock | undefined }) {
  const label = spotsLabel(stock);
  if (!label) return null;
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 align-[1px] text-[11px] font-extrabold ${
        label.full ? "bg-line text-ink-soft" : "bg-magenta-soft text-magenta"
      }`}
    >
      {label.text}
    </span>
  );
}

/** The "Full" chip for a watch-only row (one that links a page on this site). */
export function FullChip() {
  return (
    <span className="inline-block whitespace-nowrap rounded-full bg-line px-2 py-0.5 align-[1px] text-[11px] font-extrabold text-ink-soft">
      Full
    </span>
  );
}

/** Sheet text with its links: linked runs become new-tab links, the rest
 *  plain text. Also used by /gameday_events. */
export function RichText({ parts }: { parts: GamedayTextPart[] }) {
  return (
    <>
      {parts.map((part, j) =>
        part.url ? (
          <a
            key={j}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-teal underline underline-offset-2 hover:text-teal-bright"
          >
            {part.text}
          </a>
        ) : (
          <span key={j}>{part.text}</span>
        ),
      )}
    </>
  );
}

// Photos of prizes, shown by a "Click to see prize image" link in the box.
// Matched against the prize text from the sheet; files live in public/.
const PRIZE_IMAGES: { match: RegExp; src: string; alt: string }[] = [
  {
    match: /greatsword/i,
    src: `${import.meta.env.BASE_URL}prize-greatsword.jpg`,
    alt: "The moonlight greatsword prize",
  },
];

/** The little box under an event that has a prize ("Grand prize: a moonlight
 *  greatsword!"), from the Details cell's "Prize:" line. */
export function PrizeBox({
  prize,
  claimed,
  className = "",
}: {
  prize: NonNullable<GamedaySignupEvent["prize"]>;
  /** Spots claimed so far on the event's Extra Life incentive. With a
   *  "…8 or more participants" prize, shows "1/8 so far" (live). */
  claimed?: number;
  className?: string;
}) {
  const min = Number(/(\d+)\s+or\s+more/i.exec(prize.text.map((p) => p.text).join(""))?.[1]);
  const progress = min > 0 && claimed != null ? claimed : null;
  const [open, setOpen] = useState(false);
  const image = PRIZE_IMAGES.find((i) => i.match.test(prize.text.map((p) => p.text).join("")));
  return (
    <span
      className={`flex items-start gap-1.5 rounded-lg bg-magenta-soft px-2.5 py-1.5 text-xs font-bold text-ink ${className}`}
    >
      <Gift className="mt-0.5 size-3.5 shrink-0 text-magenta" />
      <span className="min-w-0 break-words">
        <span className="text-magenta">{prize.label}:</span> <RichText parts={prize.text} />
        {progress != null && (
          <span className="ml-1.5 inline-block whitespace-nowrap rounded-full bg-magenta px-2 py-0.5 text-[11px] font-extrabold text-white">
            {progress >= min ? `${progress}/${min} unlocked!` : `${progress}/${min} so far`}
          </span>
        )}
        {image && (
          <>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="mt-1 block font-extrabold text-teal underline underline-offset-2 hover:text-teal-bright"
            >
              {open ? "Hide prize image" : "Click to see prize image"}
            </button>
            {open && (
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="mt-2 block w-full max-w-md rounded-lg border border-line"
              />
            )}
          </>
        )}
      </span>
    </span>
  );
}

const SIGNUP_PAGE = `${import.meta.env.BASE_URL}gameday_events`;

const partsText = (parts: GamedayTextPart[]) =>
  parts
    .map((p) => p.text)
    .join("")
    .trim();

/** One slot's sign-up button. Every button says "Sign up" (owner's call,
 *  2026-11-09); the color tells them apart: orange for an outside page such
 *  as an Extra Life incentive (opens in a new tab, with the ↗ arrow), teal
 *  outline for the site's own form. */
function SlotButton({ row }: { row: GamedaySignupEvent }) {
  const own = ownPagePath(row.link);
  if (own) {
    return (
      <a
        href={`${import.meta.env.BASE_URL}${own}`}
        className="inline-flex shrink-0 items-center rounded-full bg-magenta px-3.5 py-1.5 text-xs font-extrabold whitespace-nowrap text-white shadow-[var(--shadow-soft)] transition-all hover:brightness-110"
      >
        Watch Here
      </a>
    );
  }
  return row.link ? (
    <a
      href={row.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange px-3.5 py-1.5 text-xs font-extrabold whitespace-nowrap text-white shadow-[var(--shadow-soft)] transition-all hover:brightness-110"
    >
      Sign up <ArrowUpRight className="size-3.5" />
    </a>
  ) : (
    <a
      href={`${SIGNUP_PAGE}#signup-form`}
      className="inline-flex shrink-0 items-center rounded-full border-2 border-teal px-3 py-1 text-xs font-extrabold whitespace-nowrap text-teal transition-all hover:bg-teal hover:text-white"
    >
      Sign up
    </a>
  );
}

export function GamedayEventDetails({
  items,
  signups = [],
}: {
  items: GamedayEventDetail[];
  signups?: GamedaySignupEvent[];
}) {
  // Rows that link an Extra Life incentive get their live spots-left count.
  const stock = useIncentiveStock([
    ...signups.flatMap((r) => [r.link, ...r.details.map((p) => p.url)]),
    ...items.flatMap((i) => i.details.map((p) => p.url)),
  ]);
  const sections = sectionSignups(signups);
  if (sections.length === 0 && items.length === 0) return null;
  return (
    <div className="mt-4 border-t border-line pt-4">
      <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
        Event Details
      </p>
      <p className="mb-4 text-sm font-bold text-ink-soft">
        All entrants into any event get 1 free prize drawing ticket, and the winner gets 5
        additional tickets.{" "}
        <a
          href={`${import.meta.env.BASE_URL}prizes`}
          className="text-teal underline underline-offset-2 hover:text-teal-bright"
        >
          How the drawings work
        </a>
      </p>

      {sections.map((sec) => (
        <div key={sec.key} className="mb-5">
          <h3 className="mb-2.5 border-b-2 border-line pb-1.5 font-display text-lg font-extrabold text-ink">
            {sec.title}
          </h3>
          <div className={`gap-3 ${sec.groups.length > 1 ? "md:columns-2" : ""}`}>
          {sec.groups.map((g) => {
            // Details shared by every row go under the title once; otherwise
            // each line carries its own.
            const texts = g.rows.map((r) => partsText(r.details));
            const shared = texts.every((t) => t === texts[0]) ? g.rows[0].details : null;
            return (
              <div
                key={g.key}
                className="mb-3 break-inside-avoid rounded-2xl border border-line bg-paper px-4 py-3.5 sm:px-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-display text-base font-extrabold text-ink">{g.title}</h4>
                  {g.price && (
                    <span className="shrink-0 font-display text-base font-extrabold text-magenta">
                      {g.price}
                    </span>
                  )}
                </div>
                {shared && shared.length > 0 && (
                  <p className="mt-0.5 whitespace-pre-line break-words text-xs text-ink-soft sm:text-[13px]">
                    <RichText parts={shared} />
                  </p>
                )}
                <ul className="mt-2">
                  {g.rows.map((r, i) => {
                    const inc = incentiveOf(r.link, r.details);
                    // In a group card, "D&D Session #1 w/ Ben Stoddart" reads
                    // as "D&D Session #1": the card title already says who.
                    const name =
                      g.rows.length > 1 || r.group ? r.event.replace(/\s+w\/\s.*$/i, "") : "";
                    return (
                      <li
                        key={`${r.event}-${i}`}
                        className="flex items-center justify-between gap-3 border-t border-line py-2.5"
                      >
                        <div className="min-w-0 text-sm leading-snug">
                          {r.when && <span className="font-extrabold text-blue">{r.when}</span>}
                          {name && (
                            <span className="font-bold text-ink">
                              {r.when ? " · " : ""}
                              {name}
                            </span>
                          )}
                          {ownPagePath(r.link) && (
                            <>
                              {" "}
                              <FullChip />
                            </>
                          )}
                          {inc && stock.has(inc.incentiveID) && (
                            <>
                              {" "}
                              <SpotsChip stock={stock.get(inc.incentiveID)} />
                            </>
                          )}
                          {!shared && r.details.length > 0 && (
                            <span className="mt-0.5 block whitespace-pre-line break-words text-xs text-ink-soft">
                              <RichText parts={r.details} />
                            </span>
                          )}
                          {r.prize && <PrizeBox prize={r.prize} claimed={stock.get(inc?.incentiveID ?? "")?.claimed} className="mt-1.5" />}
                        </div>
                        <SlotButton row={r} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <ul className={`space-y-2 ${sections.length > 0 ? "mt-4" : ""}`}>
          {items.map((item, i) => (
            <li key={`${item.title}-${i}`} className="text-sm leading-snug">
              {item.title && <span className="font-extrabold text-magenta">{item.title}</span>}
              {(() => {
                const inc = incentiveOf(undefined, item.details);
                return inc && stock.has(inc.incentiveID) ? (
                  <>
                    {" "}
                    <SpotsChip stock={stock.get(inc.incentiveID)} />
                  </>
                ) : null;
              })()}
              {item.title && item.details.length > 0 && " "}
              <span className="whitespace-pre-line break-words text-ink-soft">
                <RichText parts={item.details} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

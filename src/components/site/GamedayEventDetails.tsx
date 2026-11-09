// "Event Details" under the Game Day schedule (home page and /gameday).
//
// Since 2026-11-08 it is built from the "Gameday Signups" tab, grouped by
// activity: rows that share a Group (column E) become one card with the
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
import { ArrowUpRight } from "lucide-react";

import {
  groupSignups,
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
  const groups = groupSignups(signups);
  if (groups.length === 0 && items.length === 0) return null;
  return (
    <div className="mt-4 border-t border-line pt-4">
      <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
        Event Details
      </p>

      {groups.length > 0 && (
        <div className="gap-3 md:columns-2">
          {groups.map((g) => {
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
      )}

      {items.length > 0 && (
        <ul className={`space-y-2 ${groups.length > 0 ? "mt-4" : ""}`}>
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

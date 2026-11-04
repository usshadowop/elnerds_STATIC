// "Event Details" under the Game Day schedule: sign-ups, prices and links,
// typed into the "Gameday Event Details" tab of the RSVP sheet (Title,
// Details). Rendered on the home page's schedule card and on /gameday,
// directly under the schedule; hidden while the tab is empty.

import {
  incentiveOf,
  spotsLabel,
  useIncentiveStock,
  type IncentiveStock,
} from "@/hooks/useExtraLifeIncentives";
import type { GamedayEventDetail, GamedayTextPart } from "@/lib/gamedayContent";

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

export function GamedayEventDetails({ items }: { items: GamedayEventDetail[] }) {
  // A row that links an Extra Life incentive gets its live spots-left count.
  const stock = useIncentiveStock(items.flatMap((i) => i.details.map((p) => p.url)));
  if (items.length === 0) return null;
  return (
    <div className="mt-4 border-t border-line pt-4">
      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">
        Event Details
      </p>
      <ul className="space-y-2">
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
    </div>
  );
}

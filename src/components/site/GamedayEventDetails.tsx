// "Event Details" under the Game Day schedule: sign-ups, prices and links,
// typed into the "Gameday Event Details" tab of the RSVP sheet (Title,
// Details). Rendered on the home page's schedule card and on /gameday,
// directly under the schedule; hidden while the tab is empty.

import type { GamedayEventDetail } from "@/lib/gamedayContent";

export function GamedayEventDetails({ items }: { items: GamedayEventDetail[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-4 border-t border-line pt-4">
      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.3em] text-magenta">Event Details</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={`${item.title}-${i}`} className="text-sm leading-snug">
            {item.title && <span className="font-extrabold text-magenta">{item.title}</span>}
            {item.title && item.details.length > 0 && " "}
            <span className="whitespace-pre-line break-words text-ink-soft">
              {item.details.map((part, j) =>
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
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

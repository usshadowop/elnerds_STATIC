import { Heart } from "lucide-react";
import { useNow } from "@/hooks/use-now";
import { useExtraLifeDonations, type ExtraLifeDonation } from "@/hooks/useExtraLifeDonations";

/** Roughly how long each donation takes to cross the strip, in seconds. */
const SECONDS_PER_ITEM = 6;
const MAX_MESSAGE = 60;

function money(amount: number): string {
  const fractionDigits = Number.isInteger(amount) ? 0 : 2;
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function timeAgo(iso: string, now: number): string {
  // DonorDrive sends "+0000"; Safari's Date parser wants "+00:00".
  const then = Date.parse(iso.replace(/([+-]\d{2})(\d{2})$/, "$1:$2"));
  if (Number.isNaN(then)) return "";
  const mins = Math.max(0, Math.floor((now - then) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function Item({ d, now }: { d: ExtraLifeDonation; now: number }) {
  const message = d.message?.trim();
  const short = message && message.length > MAX_MESSAGE ? `${message.slice(0, MAX_MESSAGE - 1)}…` : message;

  return (
    <li className="flex shrink-0 items-center gap-2 px-5 text-sm whitespace-nowrap">
      <Heart className="size-3.5 shrink-0 fill-magenta text-magenta" aria-hidden />
      <span className="font-extrabold text-ink">{d.displayName || "Anonymous"}</span>
      {typeof d.amount === "number" && (
        <span className="font-extrabold tabular-nums text-teal">{money(d.amount)}</span>
      )}
      {d.recipientName && <span className="text-ink-soft">for {d.recipientName}</span>}
      {short && <span className="italic text-ink-soft">&ldquo;{short}&rdquo;</span>}
      <span className="text-xs text-ink-soft/70">{timeAgo(d.createdDateUTC, now)}</span>
    </li>
  );
}

/**
 * A scrolling strip of the team's latest donations, straight from DonorDrive.
 * Renders nothing until there's something to show, and nothing if the API is
 * unreachable — an empty or broken ticker is worse than none.
 */
export function DonationTicker({ refreshMs }: { refreshMs?: number }) {
  const { donations } = useExtraLifeDonations(10, refreshMs);
  const now = useNow(30_000);

  if (donations.length === 0) return null;

  const duration = `${Math.max(20, donations.length * SECONDS_PER_ITEM)}s`;

  return (
    <section
      aria-label="Latest donations"
      className="mx-auto -mt-6 mb-10 flex max-w-2xl items-stretch overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-soft)]"
    >
      <div className="flex shrink-0 items-center gap-2 bg-magenta px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white sm:px-4">
        <Heart className="size-3.5 fill-white" aria-hidden />
        <span className="hidden sm:inline">Latest</span>
      </div>

      <div className="donation-ticker relative min-w-0 flex-1 overflow-hidden py-3">
        {/* The list is rendered twice so the loop joins up seamlessly; the
            copy is hidden from screen readers. */}
        <div className="donation-ticker-track flex w-max" style={{ animationDuration: duration }}>
          <ul className="flex">
            {donations.map((d) => (
              <Item key={d.donationID} d={d} now={now} />
            ))}
          </ul>
          <ul className="flex" aria-hidden>
            {donations.map((d) => (
              <Item key={d.donationID} d={d} now={now} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

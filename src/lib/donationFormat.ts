// Formatting for DonorDrive donations, shared by the hero's scrolling ticker
// (`DonationTicker`) and the Command Center's list (`GamedayDonations`).

/** Whole dollars when the amount is whole, cents otherwise. */
export function money(amount: number): string {
  const fractionDigits = Number.isInteger(amount) ? 0 : 2;
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/** "just now", "12m ago", "3h ago"… */
export function timeAgo(iso: string, now: number): string {
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

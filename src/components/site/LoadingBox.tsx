import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

/** The dashed placeholder a Game Day section shows until its first sheet read
 *  settles: a teal spinner over a line of text (owner's pick from mockups,
 *  2026-11-13). The spinner stands still for reduced motion. Used by the home
 *  page and Command Center schedules and the /gameday_events list. */
export function LoadingBox({ children, className = "rounded-xl" }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="status"
      className={`flex h-40 flex-col items-center justify-center gap-3 border border-dashed border-line text-sm font-semibold text-ink-soft ${className}`}
    >
      <LoaderCircle className="size-[30px] animate-spin text-teal motion-reduce:animate-none" strokeWidth={2.6} aria-hidden />
      {children}
    </div>
  );
}

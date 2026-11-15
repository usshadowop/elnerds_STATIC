import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

/** The site's one loading placeholder: a dashed box with a teal spinner over
 *  a line of text (owner's pick from mockups, 2026-11-13), shown until a
 *  section's first read settles. The spinner stands still for reduced motion.
 *  Use it for any new loading state so they all match; the gameday-content
 *  card lists where it's used. */
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

import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row md:gap-8">
        <p className="text-center text-xs text-ink-soft">
          &copy; {new Date().getFullYear()} Extra Life Nerds. All proceeds support Gillette
          Children&rsquo;s Hospital.
        </p>
        <div className="flex gap-5">
          <a
            href="https://www.instagram.com/elnerdsmn/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-extrabold uppercase tracking-widest text-ink-soft transition-colors hover:text-magenta"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/extralifenerds/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-extrabold uppercase tracking-widest text-ink-soft transition-colors hover:text-teal"
          >
            Facebook
          </a>
          <a
            href="https://www.extra-life.org/team/73600"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-extrabold uppercase tracking-widest text-ink-soft transition-colors hover:text-orange"
          >
            Donate
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="mailto:info@elnerds.com"
            className="flex items-center gap-2 text-ink-soft transition-colors hover:text-magenta"
          >
            <Mail className="size-4 shrink-0" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest">
              Contact Extra Life Nerds
            </span>
          </a>
          <a
            href="mailto:granttgray@gillettechildrens.com"
            className="flex items-center gap-2 text-ink-soft transition-colors hover:text-teal"
          >
            <Mail className="size-4 shrink-0" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest">
              Contact Gillette
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

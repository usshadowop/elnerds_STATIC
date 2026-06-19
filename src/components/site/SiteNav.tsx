import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoUrl from "@/assets/eln-logo.svg";

const NAV_LINKS = [
  { href: "#mission", label: "Our Impact" },
  { href: "#schedule", label: "Game Day" },
  { href: "#story", label: "Our Story" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#team", label: "Team Organization" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [open]);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight text-teal">
          <img src={logoUrl} alt="Extra Life Nerds logo" className="size-9 rounded-full object-cover" />
          <span>Extra Life Nerds</span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-bold md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-ink/70 transition-colors hover:text-teal">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden gap-3 md:flex">
          <a
            href="http://elnerds.com/registration-steps/"
            className="rounded-full border-2 border-teal px-5 py-2 text-sm font-extrabold text-teal transition-all hover:bg-teal hover:text-white"
          >
            Join Team
          </a>
          <a
            href="https://www.extra-life.org/team/73600"
            className="rounded-full bg-orange px-5 py-2 text-sm font-extrabold text-white shadow-[var(--shadow-soft)] transition-all hover:brightness-110"
          >
            Donate
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-full p-2 text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-cream md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-bold text-ink/80 hover:bg-teal-soft hover:text-teal"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <a
                href="http://elnerds.com/registration-steps/"
                className="rounded-full border-2 border-teal px-4 py-3 text-center text-sm font-extrabold text-teal"
              >
                Join Team
              </a>
              <a
                href="https://www.extra-life.org/team/73600"
                className="rounded-full bg-orange px-4 py-3 text-center text-sm font-extrabold text-white"
              >
                Donate
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

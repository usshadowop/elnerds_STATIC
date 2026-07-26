import { useEffect, useState } from "react";
import { Menu, X, Instagram, Facebook, ChevronDown } from "lucide-react";
import { DiscordIcon } from "./DiscordIcon";
import logoUrl from "@/assets/eln-logo.svg";

const HOME = import.meta.env.BASE_URL;

type NavLink = { href: string; label: string };
type NavItem = NavLink | { label: string; children: NavLink[] };

const NAV_LINKS: NavItem[] = [
  { href: `${HOME}#mission`, label: "Our Impact" },
  { href: `${HOME}#schedule`, label: "Events" },
  { href: `${HOME}#story`, label: "Our Story" },
  {
    label: "Sponsors",
    children: [
      { href: `${HOME}#donors`, label: "Current" },
      { href: `${HOME}#sponsors`, label: "Past" },
    ],
  },
  {
    label: "Team",
    children: [
      { href: `${HOME}#active-roster`, label: "Active Roster" },
      { href: `${HOME}#team`, label: "Leadership" },
    ],
  },
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href={`${HOME}#top`}
          className="flex shrink-0 items-center gap-2 font-display text-xl font-extrabold tracking-tight whitespace-nowrap text-teal"
        >
          <img src={logoUrl} alt="Extra Life Nerds logo" className="size-9 shrink-0 rounded-full object-cover" />
          <span>Extra Life Nerds</span>
        </a>

        <div className="hidden items-center gap-5 text-sm font-bold whitespace-nowrap lg:flex xl:gap-7">
          {NAV_LINKS.map((l) =>
            "children" in l ? (
              <div key={l.label} className="group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className="flex items-center gap-1 text-ink/70 transition-colors group-hover:text-teal group-focus-within:text-teal"
                >
                  {l.label}
                  <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="min-w-36 rounded-xl border border-line bg-cream p-1.5 shadow-[var(--shadow-soft)]">
                    {l.children.map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        className="block rounded-lg px-3 py-2 text-ink/70 transition-colors hover:bg-teal-soft hover:text-teal"
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-ink/70 transition-colors hover:text-teal"
              >
                {l.label}
              </a>
            ),
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <a
            href="https://www.extra-life.org/team/73600"
            className="rounded-full bg-orange px-4 py-2 text-sm font-extrabold whitespace-nowrap text-white shadow-[var(--shadow-soft)] transition-all hover:brightness-110 xl:px-5"
          >
            Donate
          </a>
          <a
            href={`${HOME}registration`}
            className="rounded-full border-2 border-teal px-4 py-2 text-sm font-extrabold whitespace-nowrap text-teal transition-all hover:bg-teal hover:text-white xl:px-5"
          >
            Join Team
          </a>
          <div className="ml-1 hidden items-center gap-3 border-l border-line pl-3 min-[1120px]:flex">
            <a
              href="https://www.instagram.com/elnerdsmn/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex items-center text-ink/70 transition-colors hover:text-magenta"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href="https://www.facebook.com/extralifenerds/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex items-center text-ink/70 transition-colors hover:text-teal"
            >
              <Facebook className="size-5" />
            </a>
            <a
              href="https://discord.gg/fg2FMBXwub"
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
              className="flex items-center text-ink/70 transition-colors hover:text-orange"
            >
              <DiscordIcon className="size-5" />
            </a>
          </div>
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-full p-2 text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-cream lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((l) =>
              "children" in l ? (
                <div key={l.label} className="px-3 py-3">
                  <span className="text-sm font-bold text-ink/80">{l.label}</span>
                  <div className="mt-2 flex flex-col gap-1 pl-3">
                    {l.children.map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-bold text-ink/70 hover:bg-teal-soft hover:text-teal"
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-bold text-ink/80 hover:bg-teal-soft hover:text-teal"
                >
                  {l.label}
                </a>
              ),
            )}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <a
                href="https://www.extra-life.org/team/73600"
                className="rounded-full bg-orange px-4 py-3 text-center text-sm font-extrabold text-white"
              >
                Donate
              </a>
              <a
                href={`${HOME}registration`}
                className="rounded-full border-2 border-teal px-4 py-3 text-center text-sm font-extrabold text-teal"
              >
                Join Team
              </a>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              <a
                href="https://www.instagram.com/elnerdsmn/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-ink/70 transition-colors hover:text-magenta"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="https://www.facebook.com/extralifenerds/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-ink/70 transition-colors hover:text-teal"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href="https://discord.gg/fg2FMBXwub"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="text-ink/70 transition-colors hover:text-orange"
              >
                <DiscordIcon className="size-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

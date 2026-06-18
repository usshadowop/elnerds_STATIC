import logoUrl from "@/assets/eln-logo.svg";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row md:gap-8">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-teal">
          <img src={logoUrl} alt="Extra Life Nerds logo" className="size-9 rounded-full object-cover" />
          Extra Life Nerds
        </a>
        <p className="text-center text-xs text-ink-soft">
          &copy; {new Date().getFullYear()} Extra Life Nerds. All proceeds support Children&rsquo;s
          Miracle Network Hospitals.
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
      </div>
    </footer>
  );
}

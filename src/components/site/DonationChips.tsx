// Game Day's donation tokens: poker chips worth a donation (white $10, blue
// $25, red $50). Drawn here as SVG so the site needs no image files. Emails
// can't rely on SVG, so they use PNGs of this same drawing,
// public/email/assets/chip-{10,25,50}.png: screenshots of the chips on /prizes
// (each <svg> carries data-chip) at 192px with a transparent background.
// Change the drawing, then re-shoot the PNGs.
//
// The chip is modelled on the white "10" token in 2026_photos/prizes/
// donation-token.jpg: a rim, a ring of recessed blocks, and the value on a
// raised centre. The rules in the copy are the owner's words of 2026-11-14.

import type { ReactNode } from "react";
import { ExternalLink, Gift, HandCoins, Ticket, Trophy } from "lucide-react";

export type ChipValue = 10 | 25 | 50;

type ChipStyle = { value: ChipValue; name: string; base: string; blocks: string; edge: string; text: string };

const CHIPS: ChipStyle[] = [
  { value: 10, name: "White", base: "#f8f8f6", blocks: "#e2e2dd", edge: "#c4c4bd", text: "#535a64" },
  { value: 25, name: "Blue", base: "#2f6fd6", blocks: "#2459b5", edge: "#1a428a", text: "#ffffff" },
  { value: 50, name: "Red", base: "#d83b3b", blocks: "#b52e2e", edge: "#8c2222", text: "#ffffff" },
];

const C = 60; // centre of the 120×120 viewBox
const BLOCKS = 16;

/** One recessed block of the chip's edge ring, as an annular sector. */
function sector(i: number, r0: number, r1: number) {
  const span = 360 / BLOCKS;
  const gap = 6;
  const a0 = ((i * span + gap / 2 - 90) * Math.PI) / 180;
  const a1 = (((i + 1) * span - gap / 2 - 90) * Math.PI) / 180;
  const pt = (r: number, a: number) => `${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`;
  return `M ${pt(r1, a0)} A ${r1} ${r1} 0 0 1 ${pt(r1, a1)} L ${pt(r0, a1)} A ${r0} ${r0} 0 0 0 ${pt(r0, a0)} Z`;
}

export function DonationChip({ value, size = 96, className = "" }: { value: ChipValue; size?: number; className?: string }) {
  const chip = CHIPS.find((c) => c.value === value)!;
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label={`${chip.name} donation token, $${value}`}
      data-chip={value}
      className={`drop-shadow-[0_3px_6px_rgba(20,30,50,0.18)] ${className}`}
    >
      <circle cx={C} cy={C} r={58} fill={chip.base} stroke={chip.edge} strokeWidth={1.5} />
      {Array.from({ length: BLOCKS }, (_, i) => (
        <path key={i} d={sector(i, 43, 54)} fill={chip.blocks} stroke={chip.edge} strokeWidth={0.6} strokeOpacity={0.5} />
      ))}
      <circle cx={C} cy={C} r={39} fill={chip.base} stroke={chip.edge} strokeWidth={1.2} />
      <text
        x={C}
        y={C}
        textAnchor="middle"
        dominantBaseline="central"
        fill={chip.text}
        style={{ fontFamily: "Nunito, system-ui, sans-serif", fontWeight: 900, fontSize: 34, letterSpacing: "-1px" }}
      >
        {value}
      </text>
    </svg>
  );
}

function Way({ icon: Icon, children }: { icon: typeof Gift; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-gold-soft text-gold">
        <Icon className="size-4" />
      </span>
      <span className="text-sm text-ink sm:text-base">{children}</span>
    </li>
  );
}

/** The donation-token section on /prizes. */
export function DonationChipsSection() {
  return (
    <section id="donation-tokens" className="mb-16 scroll-mt-28 rounded-3xl border border-line bg-paper p-7 shadow-[var(--shadow-soft)] sm:p-8">
      <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.3em] text-gold">Donation tokens</p>
      <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Poker chips worth real donations</h2>
      <p className="mt-3 max-w-2xl text-sm text-ink-soft sm:text-base">
        Look out for our donation tokens through the night. Each chip is worth a donation of its value.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-6 sm:justify-start sm:gap-10">
        {CHIPS.map((c) => (
          <div key={c.value} className="flex flex-col items-center">
            <DonationChip value={c.value} />
            <p className="mt-2 font-display text-xl font-extrabold text-ink">${c.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">{c.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 font-display text-lg font-extrabold text-ink">How you get them</h3>
          <ul className="space-y-4">
            <Way icon={Gift}>Given out as prizes.</Way>
            <Way icon={Trophy}>Rewards for events and tournaments.</Way>
            <Way icon={HandCoins}>Handed out for all sorts of reasons throughout the night.</Way>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg font-extrabold text-ink">How you use them</h3>
          <ul className="space-y-4">
            <Way icon={HandCoins}>
              <strong>Donate it to anyone&rsquo;s Extra Life page</strong>, including your own.
            </Way>
            <Way icon={Ticket}>
              <strong>Use it to enter an event.</strong>
            </Way>
          </ul>
        </div>
      </div>

      <p className="mt-8 text-xs text-ink-soft">
        Tokens courtesy of{" "}
        <a
          href="https://miragemakes.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 font-bold text-teal underline underline-offset-2 hover:text-teal-bright"
        >
          Mirage Makes
          <ExternalLink className="size-3" />
        </a>
        .
      </p>
    </section>
  );
}

#!/usr/bin/env python3
"""Poker chip (donation token) sign: one letter-size page, portrait.

    python3 branding/print/make_poker_chips_sign.py "src/assets/Poker chips/poker-chips-sign.pdf"

The words are the Game Day email's "Donation tokens" block
(email/elnerds-gameday-parking-prizes.html, same as /prizes in
src/components/site/DonationChips.tsx), plus the envelope drop-off blurb that
exists only on this sign. The chips are drawn exactly as DonationChip draws
them. Change the rules there first, then here. See docs/features/prizes.md.
"""
import math, pathlib, subprocess, sys, tempfile

HERE = pathlib.Path(__file__).resolve().parent
ASSET = (HERE / "assets").as_uri()

INK, INK_SOFT, TEAL, MAGENTA, ORANGE = "#1a2b4a", "#4a5a73", "#1d6e7a", "#c8327c", "#e87722"
GOLD, GOLD_SOFT, ORANGE_SOFT = "#9e7c05", "#fcf4de", "#fce8d6"

# The three tokens, exactly as DonationChips.tsx (CHIPS) draws them.
CHIPS = [
    dict(value=10, name="White", base="#f8f8f6", blocks="#e2e2dd", edge="#c4c4bd", text="#535a64"),
    dict(value=25, name="Blue", base="#2f6fd6", blocks="#2459b5", edge="#1a428a", text="#ffffff"),
    dict(value=50, name="Red", base="#d83b3b", blocks="#b52e2e", edge="#8c2222", text="#ffffff"),
]

# Lucide icons used beside the same lines on /prizes (24x24, stroke icons).
ICONS = {
    "gift": '<path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/>'
            '<path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/>'
            '<rect x="3" y="7" width="18" height="4" rx="1"/>',
    "trophy": '<path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"/>'
              '<path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"/>'
              '<path d="M18 9h1.5a1 1 0 0 0 0-5H18"/><path d="M4 22h16"/>'
              '<path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6 9H4.5a1 1 0 0 1 0-5H6"/>',
    "hand-coins": '<path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/>'
                  '<path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/>'
                  '<path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/>',
    "ticket": '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>'
              '<path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
}

GET = [
    ("gift", "Given out as prizes. Every raffle prize comes with a white $10 chip."),
    ("trophy", "Rewards for events and tournaments."),
    ("hand-coins", "Handed out for all sorts of reasons throughout the night."),
]
USE = [
    ("hand-coins", "<strong>Donate it to anyone&rsquo;s Extra Life page</strong>, including your own."),
    ("ticket", "<strong>Use it to enter an event.</strong>"),
]


def chip_svg(c, size_in):
    """Port of DonationChip: 120x120 viewBox, rim, 16 recessed blocks, raised centre."""
    C, BLOCKS, gap = 60, 16, 6
    def pt(r, a):
        return f"{C + r * math.cos(a):.2f} {C + r * math.sin(a):.2f}"
    def sector(i, r0, r1):
        span = 360 / BLOCKS
        a0 = math.radians(i * span + gap / 2 - 90)
        a1 = math.radians((i + 1) * span - gap / 2 - 90)
        return f"M {pt(r1, a0)} A {r1} {r1} 0 0 1 {pt(r1, a1)} L {pt(r0, a1)} A {r0} {r0} 0 0 0 {pt(r0, a0)} Z"
    blocks = "".join(f'<path d="{sector(i, 43, 54)}" fill="{c["blocks"]}" stroke="{c["edge"]}" '
                     f'stroke-width="0.6" stroke-opacity="0.5"/>' for i in range(BLOCKS))
    return (f'<svg class="chip" viewBox="0 0 120 120" width="{size_in}in" height="{size_in}in">'
            f'<circle cx="60" cy="60" r="58" fill="{c["base"]}" stroke="{c["edge"]}" stroke-width="1.5"/>{blocks}'
            f'<circle cx="60" cy="60" r="39" fill="{c["base"]}" stroke="{c["edge"]}" stroke-width="1.2"/>'
            f'<text x="60" y="60" text-anchor="middle" dominant-baseline="central" fill="{c["text"]}" '
            f'font-family="Nunito" font-weight="900" font-size="34" letter-spacing="-1">{c["value"]}</text></svg>')


def title_svg(text, uid):
    """Extruded title in the table-number style: ink outline, teal extrusion, gradient face."""
    vw, vh, fs, base = 900, 122, 118, 101
    cap = fs * 0.705
    depth, dx, dy = 11, 0.9, 0.95
    ink = "".join(f'<use href="#{uid}" x="{i * dx:.2f}" y="{i * dy:.2f}"/>' for i in range(depth + 1))
    teal = "".join(f'<use href="#{uid}" x="{i * dx:.2f}" y="{i * dy:.2f}"/>' for i in range(depth))
    return f'''<svg class="title" viewBox="0 0 {vw} {vh}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <text id="{uid}" x="{vw / 2}" y="{base}" text-anchor="middle" font-size="{fs}" font-family="Nunito"
          font-weight="900" letter-spacing="-1">{text}</text>
    <linearGradient id="{uid}f" gradientUnits="userSpaceOnUse" x1="0" y1="{base - cap:.1f}" x2="0" y2="{base}">
      <stop offset="0" stop-color="#f59a3c"/><stop offset=".45" stop-color="{ORANGE}"/><stop offset="1" stop-color="{MAGENTA}"/>
    </linearGradient>
    <linearGradient id="{uid}g" gradientUnits="userSpaceOnUse" x1="0" y1="{base - cap:.1f}" x2="0" y2="{base - cap * .45:.1f}">
      <stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <g fill="{INK}" stroke="{INK}" stroke-width="14" stroke-linejoin="round">{ink}</g>
  <g fill="{TEAL}" stroke="{TEAL}" stroke-width="3" stroke-linejoin="round">{teal}</g>
  <use href="#{uid}" fill="url(#{uid}f)" stroke="#fff" stroke-width="8" stroke-linejoin="round" style="paint-order:stroke fill"/>
  <use href="#{uid}" fill="url(#{uid}g)"/>
</svg>'''


ENVELOPE = f'''<svg class="envelope" viewBox="0 0 130 142" xmlns="http://www.w3.org/2000/svg">
  <rect x="54" y="2" width="22" height="30" rx="3" fill="{MAGENTA}" stroke="{INK}" stroke-width="3.5"/>
  <path d="M34 32 L65 64 L96 32 Z" fill="{MAGENTA}" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <rect x="2" y="54" width="126" height="86" rx="9" fill="{ORANGE_SOFT}" stroke="{INK}" stroke-width="4"/>
  <path d="M6 60 L65 106 L124 60" fill="none" stroke="{INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M6 136 L50 92 M124 136 L80 92" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round" opacity=".55"/>
</svg>'''


def ways(items):
    return "".join(
        f'<li><span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
        f'stroke-linecap="round" stroke-linejoin="round">{ICONS[icon]}</svg></span><span>{text}</span></li>'
        for icon, text in items)


def html():
    chips = "".join(f'<div class="tok">{chip_svg(c, 1.25)}<div class="val">${c["value"]}</div>'
                    f'<div class="nm">{c["name"]}</div></div>' for c in CHIPS)
    return f'''<!doctype html>
<html><head><meta charset="utf-8"><title>Poker chips sign</title>
<style>
@font-face {{ font-family: Nunito; font-weight: 700; src: url({ASSET}/nunito-800.woff2) format("woff2"); }}
@font-face {{ font-family: Nunito; font-weight: 800; src: url({ASSET}/nunito-800.woff2) format("woff2"); }}
@font-face {{ font-family: Nunito; font-weight: 900; src: url({ASSET}/nunito-900.woff2) format("woff2"); }}
@page {{ size: 8.5in 11in; margin: 0; }}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; padding: 0; background: #fff; font-family: Nunito, sans-serif; color: {INK}; }}
.page {{ position: relative; width: 8.5in; height: 11in; overflow: hidden; }}
.frame {{ position: absolute; inset: 0.22in; border: 0.1in solid {TEAL}; border-radius: 0.3in; overflow: hidden;
          background: linear-gradient(#fdfaf6, #e6f2f3); display: flex; flex-direction: column; }}
.wings {{ position: absolute; left: 50%; top: 0.95in; width: 6.6in; transform: translateX(-50%); opacity: .09; }}
.body {{ position: relative; flex: 1; min-height: 0; padding: 0.3in 0.5in 0.12in; display: flex; flex-direction: column; align-items: center; }}
.eyebrow {{ font-weight: 800; font-size: 13pt; letter-spacing: .32em; text-transform: uppercase; color: {GOLD}; margin: 0; }}
.title {{ display: block; width: 7.1in; height: auto; margin-top: 0.02in; }}
.sub {{ font-weight: 900; font-size: 27pt; line-height: 1; margin: 0.02in 0 0; letter-spacing: -.01em; }}
.lead {{ font-weight: 700; font-size: 14pt; line-height: 1.35; color: {INK_SOFT}; text-align: center; max-width: 5.9in; margin: 0.1in 0 0; }}
.chips {{ display: flex; gap: 0.8in; margin-top: 0.2in; }}
.tok {{ display: flex; flex-direction: column; align-items: center; }}
.chip {{ filter: drop-shadow(0 3px 5px rgba(20,30,50,.2)); }}
.val {{ font-weight: 900; font-size: 24pt; line-height: 1; margin-top: 0.08in; }}
.nm {{ font-weight: 800; font-size: 9pt; letter-spacing: .2em; text-transform: uppercase; color: {INK_SOFT}; margin-top: 0.04in; }}
.cols {{ display: grid; grid-template-columns: 1fr 1fr; gap: 0.22in; width: 100%; margin-top: 0.18in; }}
.card {{ background: #fff; border: 1.5px solid #e6eaed; border-radius: 0.18in; padding: 0.16in 0.22in; }}
.card h3 {{ margin: 0 0 0.1in; font-weight: 900; font-size: 15pt; }}
.card ul {{ list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.09in; }}
.card li {{ display: flex; gap: 0.12in; align-items: flex-start; font-weight: 700; font-size: 12pt; line-height: 1.3; }}
.card li strong {{ font-weight: 900; }}
.ico {{ flex: none; width: 0.32in; height: 0.32in; border-radius: 50%; background: {GOLD_SOFT}; color: {GOLD};
        display: grid; place-items: center; margin-top: -0.02in; }}
.ico svg {{ width: 0.17in; height: 0.17in; }}
.drop {{ position: relative; width: 100%; margin-top: 0.18in; background: #fff; border: 0.06in solid {TEAL};
         border-radius: 0.22in; padding: 0.17in 0.3in; display: flex; align-items: center; gap: 0.28in; }}
.drop::after {{ content: ""; position: absolute; inset: 0.07in; border: 1.6px dotted {MAGENTA}; border-radius: 0.15in; opacity: .6; }}
.envelope {{ flex: none; width: 0.95in; height: auto; }}
.drop p {{ margin: 0; font-weight: 800; font-size: 17pt; line-height: 1.3; }}
.drop em {{ font-style: normal; font-weight: 900; color: {TEAL}; }}
.thanks {{ margin-top: auto; padding-top: 0.08in; display: flex; align-items: center; gap: 0.1in;
           font-weight: 800; font-size: 10pt; color: {INK_SOFT}; }}
.thanks img {{ height: 0.36in; }}
.foot {{ position: relative; flex: none; height: 0.62in; background: {TEAL}; border-top: 0.05in solid {MAGENTA};
         display: flex; align-items: center; justify-content: center; gap: 0.3in; }}
.foot img {{ height: 0.44in; }}
.foot span {{ color: #fff; font-weight: 800; font-size: 14pt; letter-spacing: .22em; }}
</style></head><body>
<section class="page"><div class="frame">
  <img class="wings" src="{ASSET}/wings-teal.png" alt="">
  <div class="body">
    <p class="eyebrow">Donation tokens</p>
    {title_svg("POKER CHIPS", "t")}
    <p class="sub">worth real donations</p>
    <p class="lead">Keep an eye out for our donation tokens all night. Each chip is worth a donation of its value.</p>
    <div class="chips">{chips}</div>
    <div class="cols">
      <div class="card"><h3>How you get them</h3><ul>{ways(GET)}</ul></div>
      <div class="card"><h3>How you use them</h3><ul>{ways(USE)}</ul></div>
    </div>
    <div class="drop">{ENVELOPE}
      <p>There is an <em>envelope container in the hallway</em> where you can submit your donations for processing.</p>
    </div>
    <div class="thanks">Tokens courtesy of <img src="{ASSET}/mirage-makes.png" alt="Mirage Makes"></div>
  </div>
  <div class="foot"><img src="{ASSET}/logo-white.png" alt="Extra Life Nerds"><span>PLAY GAMES. HEAL KIDS.</span></div>
</div></section>
</body></html>'''


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    out = pathlib.Path(sys.argv[1]).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        src = pathlib.Path(tmp) / "sign.html"
        src.write_text(html())
        subprocess.run(["node", str(HERE / "print.cjs"), str(src), str(out)], check=True)
    print("wrote", out)


if __name__ == "__main__":
    main()

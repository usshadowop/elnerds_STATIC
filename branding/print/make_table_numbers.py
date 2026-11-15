#!/usr/bin/env python3
"""Table-number cards: letter paper, 2 x 4 = 8 cards a sheet, cut on the dashed lines.

    # one PDF, any range (a sample sheet, or spares)
    python3 branding/print/make_table_numbers.py --start 1 --end 8 --out sample.pdf

    # the whole printed set: one file per sheet plus one combined file
    python3 branding/print/make_table_numbers.py --start 1 --end 50 --set "src/assets/Table numbers"

Each cell is 4 x 2.5 in; the card sits 0.09 in inside it so a rough cut doesn't
clip the border. The footer line under each sheet says which tables it holds and
"sheet N of M". See docs/features/prizes.md for the design decisions.
"""
import argparse, pathlib, subprocess, tempfile

HERE = pathlib.Path(__file__).resolve().parent
ASSET = (HERE / "assets").as_uri()

# ---- brand palette (src/styles.css) ----------------------------------------
INK, TEAL, MAGENTA, ORANGE, PURPLE = "#1a2b4a", "#1d6e7a", "#c8327c", "#e87722", "#6b3d8a"
CREAM, TEAL_SOFT = "#fdfaf6", "#e6f2f3"

# ---- page geometry (inches) -------------------------------------------------
PAGE_W, PAGE_H = 8.5, 11.0
COLS, ROWS = 2, 4
CELL_W, CELL_H = 4.0, 2.5
MARGIN_X = (PAGE_W - COLS * CELL_W) / 2      # 0.25
MARGIN_Y = (PAGE_H - ROWS * CELL_H) / 2      # 0.50
PER_PAGE = COLS * ROWS

# ---- card geometry: SVG user units are 1/100 inch ---------------------------
INSET = 9                                    # white gutter inside each cell
CW, CH = int(CELL_W * 100) - 2 * INSET, int(CELL_H * 100) - 2 * INSET   # 382 x 232
FOOT = 34                                    # footer band height


def confetti(x, y, s, fill, rot=0):
    return (f'<rect x="{x - s / 2}" y="{y - s / 2}" width="{s}" height="{s}" fill="{fill}" '
            f'transform="rotate({rot} {x} {y})"/>')


def card(n: int) -> str:
    label = str(n)
    fs = 216 if len(label) <= 2 else 170          # font size (units); 3-digit safety
    cx = CW / 2
    # Digits are ~0.705em tall; centre them in the space above the footer,
    # nudged up 4 units for the extrusion that hangs below them.
    digit_h = fs * 0.705
    area_top, area_bot = 14, CH - FOOT - 8
    base = (area_top + area_bot) / 2 + digit_h / 2 - 4
    DEPTH, DX, DY = 9, 0.9, 0.95                  # extrusion: offset copies going down-right
    uid = f"n{n}"
    ext_ink = "".join(f'<use href="#{uid}" x="{i * DX:.2f}" y="{i * DY:.2f}"/>' for i in range(DEPTH + 1))
    ext_teal = "".join(f'<use href="#{uid}" x="{i * DX:.2f}" y="{i * DY:.2f}"/>' for i in range(DEPTH))
    g_top, g_bot = base - digit_h, base
    return f'''
<svg class="card" xmlns="http://www.w3.org/2000/svg" width="{CW / 100}in" height="{CH / 100}in" viewBox="0 0 {CW} {CH}">
  <defs>
    <linearGradient id="bg{n}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{CREAM}"/><stop offset="1" stop-color="{TEAL_SOFT}"/>
    </linearGradient>
    <linearGradient id="face{n}" gradientUnits="userSpaceOnUse" x1="0" y1="{g_top:.1f}" x2="0" y2="{g_bot:.1f}">
      <stop offset="0" stop-color="#f59a3c"/><stop offset=".45" stop-color="{ORANGE}"/><stop offset="1" stop-color="{MAGENTA}"/>
    </linearGradient>
    <linearGradient id="gloss{n}" gradientUnits="userSpaceOnUse" x1="0" y1="{g_top:.1f}" x2="0" y2="{g_top + digit_h * 0.55:.1f}">
      <stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="card{n}"><rect width="{CW}" height="{CH}" rx="16"/></clipPath>
    <text id="{uid}" x="{cx}" y="{base:.1f}" text-anchor="middle" font-size="{fs}"
          font-family="Nunito" font-weight="900" letter-spacing="-4">{label}</text>
  </defs>
  <g clip-path="url(#card{n})">
    <rect width="{CW}" height="{CH}" fill="url(#bg{n})"/>
    <image href="{ASSET}/wings-teal.png" x="{cx - 150}" y="{(CH - FOOT) / 2 - 70}" width="300" height="138" opacity=".10"/>
    {confetti(24, 100, 5, TEAL, 20)} {confetti(CW - 26, 104, 5, PURPLE, -15)}
    {confetti(58, 28, 4, ORANGE, 30)} {confetti(CW - 60, 30, 4, TEAL, 10)}
    {confetti(60, 168, 4, PURPLE, 25)} {confetti(CW - 62, 172, 4, MAGENTA, -20)}
    <g fill="{INK}" stroke="{INK}" stroke-width="13" stroke-linejoin="round">{ext_ink}</g>
    <g fill="{TEAL}" stroke="{TEAL}" stroke-width="3" stroke-linejoin="round">{ext_teal}</g>
    <use href="#{uid}" fill="url(#face{n})" stroke="#ffffff" stroke-width="7" stroke-linejoin="round" style="paint-order:stroke fill"/>
    <use href="#{uid}" fill="url(#gloss{n})"/>
    <rect x="0" y="{CH - FOOT}" width="{CW}" height="{FOOT}" fill="{TEAL}"/>
    <rect x="0" y="{CH - FOOT}" width="{CW}" height="3" fill="{MAGENTA}"/>
    <text x="{cx}" y="{CH - FOOT / 2 + 5.4}" text-anchor="middle" fill="#ffffff"
          font-family="Nunito" font-weight="800" font-size="13" letter-spacing="2.4">PLAY GAMES. HEAL KIDS.</text>
  </g>
  <rect x="2.5" y="2.5" width="{CW - 5}" height="{CH - 5}" rx="14" fill="none" stroke="{TEAL}" stroke-width="5"/>
  <rect x="9" y="9" width="{CW - 18}" height="{CH - FOOT - 12}" rx="9" fill="none" stroke="{MAGENTA}"
        stroke-width="1.4" stroke-dasharray="1 5" stroke-linecap="round" opacity=".7"/>
</svg>'''


def cut_guides(count_on_page: int) -> str:
    """Dashed cut lines around every occupied cell, drawn once per shared edge."""
    segs = set()
    for i in range(count_on_page):
        r, c = divmod(i, COLS)
        x0, y0 = MARGIN_X + c * CELL_W, MARGIN_Y + r * CELL_H
        x1, y1 = x0 + CELL_W, y0 + CELL_H
        segs |= {(x0, y0, x1, y0), (x0, y1, x1, y1), (x0, y0, x0, y1), (x1, y0, x1, y1)}
    lines = "".join(f'<line x1="{a}" y1="{b}" x2="{c}" y2="{d}"/>' for a, b, c, d in sorted(segs))
    # viewBox is in inches, so stroke and dash sizes are inches too
    return (f'<svg class="guides" width="{PAGE_W}in" height="{PAGE_H}in" viewBox="0 0 {PAGE_W} {PAGE_H}" '
            f'xmlns="http://www.w3.org/2000/svg"><g stroke="#9aa5b4" stroke-width="0.006" '
            f'stroke-dasharray="0.05 0.04" fill="none">{lines}</g></svg>')


def build_html(numbers: list[int], first_sheet: int = 1, of: int | None = None) -> str:
    pages = []
    total = (len(numbers) + PER_PAGE - 1) // PER_PAGE
    of = of or total
    for p in range(total):
        chunk = numbers[p * PER_PAGE:(p + 1) * PER_PAGE]
        cells = "".join(
            f'<div class="cell" style="left:{MARGIN_X + (i % COLS) * CELL_W}in;top:{MARGIN_Y + (i // COLS) * CELL_H}in">{card(n)}</div>'
            for i, n in enumerate(chunk))
        slug = (f'<div class="slug">Extra Life Nerds · table numbers {chunk[0]}–{chunk[-1]} · '
                f'sheet {first_sheet + p} of {of} · cut on the dashed lines</div>')
        pages.append(f'<section class="page">{cut_guides(len(chunk))}{cells}{slug}</section>')
    return f'''<!doctype html>
<html><head><meta charset="utf-8"><title>Extra Life Nerds table numbers</title>
<style>
@font-face {{ font-family: Nunito; font-weight: 900; src: url({ASSET}/nunito-900.woff2) format("woff2"); }}
@font-face {{ font-family: Nunito; font-weight: 800; src: url({ASSET}/nunito-800.woff2) format("woff2"); }}
@page {{ size: {PAGE_W}in {PAGE_H}in; margin: 0; }}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; padding: 0; background: #fff; }}
.page {{ position: relative; width: {PAGE_W}in; height: {PAGE_H}in; overflow: hidden; break-after: page; }}
.page:last-child {{ break-after: auto; }}
.guides {{ position: absolute; left: 0; top: 0; }}
.cell {{ position: absolute; width: {CELL_W}in; height: {CELL_H}in; display: flex; align-items: center; justify-content: center; }}
.card {{ display: block; }}
.slug {{ position: absolute; left: 0; right: 0; bottom: 0.2in; text-align: center; font: 800 6.5pt Nunito, sans-serif;
         letter-spacing: .08em; text-transform: uppercase; color: #a6b0be; }}
</style></head><body>{"".join(pages)}</body></html>'''


def render(numbers: list[int], out: pathlib.Path, first_sheet: int = 1, of: int | None = None):
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        src = pathlib.Path(tmp) / "cards.html"
        src.write_text(build_html(numbers, first_sheet, of))
        subprocess.run(["node", str(HERE / "print.cjs"), str(src), str(out)], check=True)
    print("wrote", out)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--start", type=int, default=1)
    ap.add_argument("--end", type=int, default=8)
    out = ap.add_mutually_exclusive_group(required=True)
    out.add_argument("--out", help="write one PDF holding every sheet")
    out.add_argument("--set", metavar="DIR", help="write one PDF per sheet plus a combined one into DIR")
    a = ap.parse_args()
    numbers = list(range(a.start, a.end + 1))
    if a.out:
        render(numbers, pathlib.Path(a.out).resolve())
        return
    folder = pathlib.Path(a.set).resolve()
    sheets = [numbers[i:i + PER_PAGE] for i in range(0, len(numbers), PER_PAGE)]
    for k, chunk in enumerate(sheets, 1):
        render(chunk, folder / f"table-numbers-sheet-{k}-of-{len(sheets)}_tables-{chunk[0]}-{chunk[-1]}.pdf", k, len(sheets))
    render(numbers, folder / f"table-numbers-ALL-{numbers[0]}-{numbers[-1]}_{len(sheets)}-sheets.pdf")


if __name__ == "__main__":
    main()

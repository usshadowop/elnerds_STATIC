#!/usr/bin/env python3
"""Builds public/email/index.html: the email template with every block from
blocks.html dropped into its content slot, so https://elnerds.com/email/
shows the whole design system at a glance.

GENERATED output. Don't edit public/email/index.html by hand; edit
template.html or blocks.html and re-run this (build-bundle.sh runs it too).

Placeholders are left visible on purpose: the page is a map of what to
fill in, not a finished email.
"""
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parent.parent / "public" / "email" / "index.html"

template = (HERE / "template.html").read_text()
blocks_src = (HERE / "blocks.html").read_text()

FONT = "font-family:'Nunito',Helvetica,Arial,sans-serif;"


def label(num, name):
    return (
        '<tr><td style="padding:28px 24px 8px 24px;" align="left">'
        f'<p style="margin:0; {FONT} font-size:11px; font-weight:800; letter-spacing:1.5px; '
        f'text-transform:uppercase; color:#8a97a8; border-top:1px dashed #c2ccd8; padding-top:10px;">'
        f"Block {num} &middot; {name}</p></td></tr>"
    )


def wrap_row(inner, bg=None):
    # Blocks that aren't table rows (cards, lists, chips) go inside a padded
    # cell, the way they'd sit inside a section in a real email.
    style = "padding:16px 40px 0 40px;" + (f" background-color:{bg};" if bg else "")
    return f'<tr><td class="px" style="{style}" align="center">\n{inner}\n</td></tr>'


pattern = re.compile(
    r"<!-- =+\n\s+(\d+)\. ([^\n]*?) — .*?=+ -->\n(.*?)(?=\n\n\n<!-- =+|\Z)", re.S
)
rows = []
for m in pattern.finditer(blocks_src):
    num, name, body = m.group(1), m.group(2).strip().title(), m.group(3).strip()
    rows.append(label(num, name))
    if body.startswith("<tr"):
        rows.append(body)
    else:
        # Chips belong inside a tinted band; everything else on white.
        rows.append(wrap_row(body, "#e6f2f3" if num == "5" else None))

if len(rows) != 24:
    raise SystemExit(f"expected 12 blocks in blocks.html, found {len(rows) // 2}")

page = template.replace("[[CONTENT_SECTIONS]]", "\n".join(rows))
page = page.replace("<title>[[BROWSER_TITLE]]</title>", "<title>Email Template | Extra Life Nerds</title>")

notice = f"""
  <div style="max-width:600px; margin:16px auto 0; padding:14px 18px; background-color:#ffffff; border:1px dashed #1d6e7a; border-radius:12px; {FONT} font-size:13px; line-height:1.55; font-weight:600; color:#4a5a73;">
    <strong style="color:#1a2b4a;">Extra Life Nerds email template.</strong>
    Anything in <code>[[DOUBLE_BRACKETS]]</code> is a placeholder, and every block
    from the library is shown once in the middle. To build an email, follow
    <a href="https://github.com/usshadowop/elnerds_STATIC/blob/main/branding/email/DESIGN_BRIEF.md" style="color:#1d6e7a;">the design brief</a>.
    Past emails are listed in
    <a href="https://github.com/usshadowop/elnerds_STATIC/blob/main/email/archive/README.md" style="color:#1d6e7a;">the email archive</a>.
  </div>
"""
page, n = re.subn(r"(<body[^>]*>)", r"\1" + notice.replace("\\", "\\\\"), page, count=1)
if n != 1:
    raise SystemExit("could not find <body> in template.html")

OUT.write_text(page)
print(f"Wrote {OUT.relative_to(HERE.parent.parent)} ({len(page)} bytes)")

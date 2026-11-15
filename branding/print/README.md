# Print

Printable signs for the room on Game Day, made from the same brand as the site
(Nunito, the `src/styles.css` palette, the team logo). Each script writes a
letter-size PDF: vector, with fonts embedded.

| Script | Makes | Printed copy |
| --- | --- | --- |
| `make_table_numbers.py` | Table-number cards, 8 a sheet, cut on the dashed lines | `src/assets/Table numbers/` (tables 1–50) |
| `make_poker_chips_sign.py` | The poker chip (donation token) sign, one page | `src/assets/Poker chips/poker-chips-sign.pdf` |

```bash
python3 branding/print/make_table_numbers.py --start 1 --end 50 --set "src/assets/Table numbers"
```

```bash
python3 branding/print/make_table_numbers.py --start 51 --end 58 --out spares.pdf
```

```bash
python3 branding/print/make_poker_chips_sign.py "src/assets/Poker chips/poker-chips-sign.pdf"
```

Each script builds an HTML page in a temp folder and hands it to `print.cjs`,
which prints it with Playwright's Chromium. That needs Python 3, Node and
Playwright (already set up in the Claude cloud sandbox; elsewhere run
`npx playwright install chromium` once).

`assets/` holds what the pages load:

- **`nunito-800.woff2`, `nunito-900.woff2`:** Nunito, SIL Open Font License.
- **`wings-teal.png`:** the team logo's wings, with the lettering cut out.
- **`logo-white.png`:** the team logo, cropped.
- **`mirage-makes.png`:** copied from `2026_sponsors/`.

Print at 100% ("Actual size"), not "Fit to page".

How the designs work, what was decided and why, and where the chip rules come
from: [`docs/features/prizes.md`](../../docs/features/prizes.md).

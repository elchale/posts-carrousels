"""Cut the Propaga landing-page screenshots into slide-sized crops.

The landing shots are full 1440x900 desktop frames saved at 1920px wide
(propaga/frontend/e2e/marketing/landing-shots.spec.ts renders them at 2x and
downscales). A whole dashboard dropped into a carousel slide is unreadable —
1920px of UI squeezed into a 1080px slide, seen ~400px wide on a phone, puts the
interface text at about 4px. So each crop here shows ONE thing at close to its
native scale: a pair of result cards, three chat bubbles, four leads rows.

Crops are given as fractions of the source so they survive a re-render of the
screenshots at a different width. Output goes to brands/propaga/product/, which
is where render.py looks for slide images.

  python tools/shots.py            # write the crops
  python tools/shots.py --sheet    # also write a contact sheet to check them
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(r"C:\Users\Personal\Desktop\Carlos\Apps\Progress\propaga\frontend\src\assets\landing")
OUT = ROOT / "brands" / "propaga" / "product"

# name -> (source file, (x0, y0, x1, y1) as fractions of the source)
CROPS: dict[str, tuple[str, tuple[float, float, float, float]]] = {
    # --- campañas: the numbers a shop owner actually asks for ---------------
    # Two result cards at a time. The full four-card block was tried and dropped:
    # at slide width the figures shrink to the point of being decoration.
    "shot-respuestas":  ("screens/campaigns.webp", (0.213, 0.435, 0.588, 0.628)),
    "shot-fuera":       ("screens/campaigns.webp", (0.582, 0.435, 0.948, 0.628)),
    # Stops before the cost column: the source card clips it, and half a column
    # header reads as a broken render rather than as a table that continues.
    "shot-ciudades":    ("screens/campaigns.webp", (0.228, 0.655, 0.556, 0.968)),
    "shot-nollego":     ("screens/campaigns.webp", (0.575, 0.655, 0.945, 0.868)),
    # --- bandeja: the conversation itself -----------------------------------
    "shot-chat":        ("screens/inbox.webp",     (0.439, 0.080, 1.000, 0.410)),
    "shot-campana-chat":("screens/inbox.webp",     (0.600, 0.425, 1.000, 0.700)),
    "shot-lista":       ("screens/inbox.webp",     (0.169, 0.169, 0.428, 0.533)),
    # --- leads ---------------------------------------------------------------
    "shot-leads":       ("screens/leads.webp",     (0.222, 0.270, 0.640, 0.533)),
    # --- posts y comentarios -------------------------------------------------
    # Cut at the end of the comment text, not at the panel edge: the empty right
    # half only makes the card wider, and a wider card is a smaller card.
    "shot-comentarios": ("screens/content.webp",   (0.453, 0.618, 0.760, 0.826)),
    "shot-posts":       ("screens/content.webp",   (0.222, 0.234, 0.433, 0.764)),
    # --- canales -------------------------------------------------------------
    "shot-canales":     ("screens/channels.webp",  (0.218, 0.179, 0.950, 0.928)),
    # One account card, not both: the second sits far to the right, and keeping it
    # doubles the crop width, which halves everything on the slide.
    "shot-whatsapp":    ("screens/channels.webp",  (0.218, 0.455, 0.546, 0.678)),
    # --- el celular ----------------------------------------------------------
    "shot-movil":       ("screens/inbox-mobile.webp", (0.0, 0.0, 1.0, 0.58)),
}


def build(sheet: bool = False) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    made: list[tuple[str, Image.Image]] = []
    for name, (src, box) in CROPS.items():
        im = Image.open(SRC / src).convert("RGB")
        w, h = im.size
        x0, y0, x1, y1 = box
        crop = im.crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h)))
        crop.save(OUT / f"{name}.png")
        made.append((name, crop))
        print(f"{name:20} {crop.width}x{crop.height}  <- {src}")

    if sheet:
        cols = 3
        cell = 640
        rows = (len(made) + cols - 1) // cols
        sheet_im = Image.new("RGB", (cols * cell, rows * (cell + 40)), "#141418")
        from PIL import ImageDraw
        d = ImageDraw.Draw(sheet_im)
        for i, (name, crop) in enumerate(made):
            c = crop.copy()
            c.thumbnail((cell - 20, cell - 20), Image.LANCZOS)
            x = (i % cols) * cell + (cell - c.width) // 2
            y = (i // cols) * (cell + 40) + 30
            sheet_im.paste(c, (x, y))
            d.text(((i % cols) * cell + 12, (i // cols) * (cell + 40) + 8),
                   f"{name}  {crop.width}x{crop.height}", fill="#ffffff")
        out = ROOT / "tools" / "_shots-sheet.png"
        sheet_im.save(out)
        print(f"\ncontact sheet -> {out}")


if __name__ == "__main__":
    build(sheet="--sheet" in sys.argv)

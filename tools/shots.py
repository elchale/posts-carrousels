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

# Two kinds of crop, on purpose:
#
#   FULL views  — the whole screen, nav rail included. Nobody reads the labels at
#                 slide size; you recognise the shape of a real product: two panes,
#                 a post with its photo, avatars, unread badges. Use these when the
#                 message is "todo en un solo lugar".
#   DETAIL crops — one panel, near native scale, meant to be read: a figure, a
#                 quoted reply, four rows of contacts.
#
# name -> (source file, (x0, y0, x1, y1) as fractions of the source)
CROPS: dict[str, tuple[str, tuple[float, float, float, float]]] = {
    # --- FULL views ----------------------------------------------------------
    "shot-bandeja":     ("screens/inbox.webp",     (0.000, 0.000, 1.000, 1.000)),
    "shot-chat":        ("screens/inbox.webp",     (0.433, 0.000, 0.996, 1.000)),
    "shot-contenido":   ("screens/content.webp",   (0.000, 0.000, 1.000, 1.000)),
    # The right pane of /content: the post WITH its photo and the comments under
    # it. Cropping to the comment text alone loses the photo, and the photo is
    # what makes it read as "this is your Instagram post".
    "shot-comentarios": ("screens/content.webp",   (0.451, 0.030, 0.990, 0.972)),
    "shot-campanas":    ("screens/campaigns.webp", (0.205, 0.012, 0.992, 0.988)),
    "shot-leads-full":  ("screens/leads.webp",     (0.150, 0.010, 0.992, 0.840)),
    "shot-canales":     ("screens/channels.webp",  (0.150, 0.020, 0.975, 0.960)),
    "shot-movil":       ("screens/inbox-mobile.webp", (0.0, 0.0, 1.0, 0.78)),

    # --- DETAIL crops --------------------------------------------------------
    "shot-respuestas":  ("screens/campaigns.webp", (0.213, 0.435, 0.588, 0.628)),
    "shot-fuera":       ("screens/campaigns.webp", (0.582, 0.435, 0.948, 0.628)),
    # Stops before the cost column: the source card clips it, and half a column
    # header reads as a broken render rather than as a table that continues.
    "shot-ciudades":    ("screens/campaigns.webp", (0.228, 0.655, 0.556, 0.968)),
    "shot-campana-chat":("screens/inbox.webp",     (0.600, 0.425, 1.000, 0.700)),
    "shot-lista":       ("screens/inbox.webp",     (0.169, 0.155, 0.428, 0.600)),
    "shot-leads":       ("screens/leads.webp",     (0.212, 0.259, 0.792, 0.556)),
    "shot-posts":       ("screens/content.webp",   (0.218, 0.215, 0.437, 0.800)),
    # One account card, not both: the second sits far to the right, and keeping it
    # doubles the crop width, which halves everything on the slide.
    "shot-whatsapp":    ("screens/channels.webp",  (0.218, 0.455, 0.546, 0.678)),
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

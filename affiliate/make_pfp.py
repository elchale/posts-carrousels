"""Profile pictures for the four US affiliate accounts.

A PFP is read at ~40px in a feed. Anything with more than one word, a thin
stroke or a photo turns to mush at that size — so these are single-word marks
with a heavy face and one flat colour each. Run:

    python affiliate/make_pfp.py

Output: affiliate/pfp/*.png  (1080x1080, ready to upload)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT.parents[0] / "shared" / "fonts"
OUT = Path(__file__).resolve().parent / "pfp"
S = 1080


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / name), size)


def centered(draw: ImageDraw.ImageDraw, text: str, fnt, color: str, cy: int,
             track: int = 0) -> None:
    """Draw text centred on the canvas at vertical centre cy, with tracking."""
    if track:
        widths = [draw.textbbox((0, 0), ch, font=fnt)[2] -
                  draw.textbbox((0, 0), ch, font=fnt)[0] for ch in text]
        total = sum(widths) + track * (len(text) - 1)
        x = (S - total) / 2
        b = draw.textbbox((0, 0), text, font=fnt)
        y = cy - (b[3] + b[1]) / 2
        for ch, w in zip(text, widths):
            draw.text((x, y), ch, font=fnt, fill=color)
            x += w + track
        return
    b = draw.textbbox((0, 0), text, font=fnt)
    draw.text(((S - (b[2] + b[0])) / 2, cy - (b[3] + b[1]) / 2),
              text, font=fnt, fill=color)


def canvas(bg: str) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    im = Image.new("RGB", (S, S), bg)
    return im, ImageDraw.Draw(im)


# ---------------------------------------------------------------- account A
# @cheapfixdaily — amber ground, black word. Amber survives a dark feed and a
# light one, and nobody else in the finds niche is using it (they all default
# to white or beige).
AMBER, INK = "#F5B32E", "#141414"


def pfp_a() -> Image.Image:
    im, d = canvas(AMBER)
    centered(d, "FIX", font("Anton-Regular.ttf", 560), INK, S // 2 - 40)
    centered(d, "DAILY", font("Inter-Bold.ttf", 88), INK, S // 2 + 300, track=26)
    return im


def pfp_a_alt() -> Image.Image:
    """Alt: the price tag. Reads as 'cheap' before a single word is parsed."""
    im, d = canvas(INK)
    d.rounded_rectangle([120, 300, 960, 780], radius=48, fill=AMBER)
    centered(d, "$10-20", font("Anton-Regular.ttf", 260), INK, 540)
    return im


# ---------------------------------------------------------------- account B
# @theservicestack / @thestradestack — near-black with one mint accent: a
# literal stack of three bars. Geometry survives 40px better than any word.
NIGHT, MINT, PAPER = "#0E1113", "#4ED6A8", "#F2F4F7"


def pfp_b() -> Image.Image:
    im, d = canvas(NIGHT)
    x0, x1 = 170, 910
    for i, y in enumerate((250, 470, 690)):
        colour = MINT if i == 0 else PAPER
        inset = i * 72          # narrowing bars = a stack in perspective
        d.rounded_rectangle([x0 + inset, y, x1 - inset, y + 150],
                            radius=30, fill=colour)
    return im


def pfp_b_alt() -> Image.Image:
    """Alt: the pain, not the brand — a missed call badge."""
    im, d = canvas(NIGHT)
    d.ellipse([260, 260, 820, 820], outline=MINT, width=26)
    centered(d, "24/7", font("ChakraPetch-Bold.ttf", 250), PAPER, 540)
    return im


BUILDS = [
    ("cheapfixdaily-tiktok.png", pfp_a),
    ("cheapfixdaily-instagram.png", pfp_a),
    ("cheapfixdaily-ALT.png", pfp_a_alt),
    ("theservicestack-tiktok.png", pfp_b),
    ("thestradestack-instagram.png", pfp_b),
    ("stack-ALT.png", pfp_b_alt),
]

if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for name, fn in BUILDS:
        fn().save(OUT / name, "PNG")
        print("wrote", (OUT / name).relative_to(ROOT))

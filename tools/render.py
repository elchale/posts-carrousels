"""Render carousels: series JSON + graded plates + fonts -> slide PNGs.

Usage:
  python render.py                 # render every series of every brand
  python render.py comehometag     # one brand
  python render.py comehometag s1  # one series (prefix match on file name)

Input : brands/<b>/posts/<series>.json   (see PLAN-180 §8 / series files)
Output: brands/<b>/out/<series>/<slug>/
          ig/01..08.png   1080x1350 (Instagram + Facebook)
          tt/01..08.png   1080x1920 (TikTok photo mode)
          li.pdf          (Qolca only — LinkedIn document post)
          captions.txt    per-platform captions + alt text

Layout contract (see STRATEGY §4): master 1080x1920; ALL text inside the
centered 1080x1080 core (y 420..1500) so every crop survives; the 4:5 export
is the center crop y 285..1635.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
BRANDS = ROOT / "brands"
FONTS = ROOT.parents[0] / "shared" / "fonts"
W, H = 1080, 1920
CORE_X0, CORE_X1 = 96, 984
CORE_Y0, CORE_Y1 = 440, 1490
IG_CROP = (0, 285, 1080, 1635)


def font(name: str, size: int, weight: int | None = None) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONTS / name), size)
    if weight is not None:
        try:
            f.set_variation_by_axes([weight])
        except OSError:
            pass
    return f


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, maxw: int) -> list[str]:
    lines, cur = [], ""
    for word in text.split():
        cand = f"{cur} {word}".strip()
        if draw.textlength(cand, font=fnt) <= maxw or not cur:
            cur = cand
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def fit_text(draw, text, fname, weight, max_size, min_size, maxw, maxh, leading=1.08):
    """Largest font size whose wrapped block fits maxw x maxh."""
    for size in range(max_size, min_size - 1, -4):
        fnt = font(fname, size, weight)
        lines = wrap(draw, text, fnt, maxw)
        lh = round(size * leading)
        if len(lines) * lh <= maxh and all(draw.textlength(l, font=fnt) <= maxw for l in lines):
            return fnt, lines, lh
    fnt = font(fname, min_size, weight)
    return fnt, wrap(draw, text, fnt, maxw), round(min_size * leading)


def draw_block(draw, lines, fnt, lh, y, color, align="center", shadow=False):
    for line in lines:
        w = draw.textlength(line, font=fnt)
        x = (W - w) / 2 if align == "center" else CORE_X0
        if shadow:
            draw.text((x + 3, y + 4), line, font=fnt, fill=(0, 0, 0, 160))
        draw.text((x, y), line, font=fnt, fill=color)
        y += lh
    return y


def draw_kicker(draw, text, color, y, fname="Montserrat-Variable.ttf"):
    fnt = font(fname, 34, 700)
    spaced = " ".join(text.upper())
    w = draw.textlength(spaced, font=fnt)
    draw.text(((W - w) / 2, y), spaced, font=fnt, fill=color)
    return y + 56


def block_height(draw, text, fname, weight, size_range, maxw, maxh, leading=1.08):
    fnt, lines, lh = fit_text(draw, text, fname, weight, size_range[0], size_range[1], maxw, maxh, leading)
    return fnt, lines, lh, len(lines) * lh


class Renderer:
    def __init__(self, brand_dir: Path):
        self.dir = brand_dir
        self.cfg = json.loads((brand_dir / "brand.json").read_text(encoding="utf-8"))
        self.plates: dict[str, list[Path]] = {}
        for p in sorted((brand_dir / "plates_graded").glob("*.png")):
            fam = "cine" if p.stem.startswith("cine") else p.stem.rsplit("-", 1)[0].replace("-", "_")
            # value_* families also pool under plain "value"
            self.plates.setdefault(fam, []).append(p)
            if fam.startswith("value_"):
                self.plates.setdefault("value", []).append(p)

    def plate_for(self, role_cfg: dict, slide: dict, post_i: int, slide_i: int) -> Path:
        if "plate" in slide:  # explicit override, e.g. "cine-04-mama"
            return self.dir / "plates_graded" / f"{slide['plate']}.png"
        pool = self.plates[role_cfg["family"]]
        return pool[(post_i * 3 + slide_i) % len(pool)]

    def render_slide(self, slide: dict, n: int, total: int, post_i: int) -> Image.Image:
        role = slide["role"]
        rc = self.cfg["roles"][role]
        im = Image.open(self.plate_for(rc, slide, post_i, n)).convert("RGB")
        draw = ImageDraw.Draw(im)
        disp = self.cfg["display_font"]
        dw = self.cfg["display_weight"]
        body_f = self.cfg["body_font"]
        text_c, sub_c, acc = rc["text"], rc["sub"], rc["accent"]
        shadow = role == "story"

        # slide index (not on cover/cta)
        if role not in ("cover", "cta"):
            fnt = font(body_f, 30, 600)
            s = f"{n + 1}/{total}"
            draw.text((CORE_X1 - draw.textlength(s, font=fnt), CORE_Y0 - 6), s, font=fnt, fill=sub_c)

        h_text = slide.get("h", "")
        b_text = slide.get("b", "")

        if role == "cover":
            y = CORE_Y0 + 30
            if slide.get("kicker"):
                y = draw_kicker(draw, slide["kicker"], acc, y)
            fnt, lines, lh, hh = block_height(draw, h_text, disp, dw, (128, 64), 860, 700)
            top = y + (CORE_Y1 - 170 - y - hh) / 2
            draw_block(draw, lines, fnt, lh, top, text_c, shadow=shadow)
            if b_text:
                bf = font(body_f, 40, 600)
                blines = wrap(draw, b_text + "  →", bf, 800)
                draw_block(draw, blines, bf, 52, CORE_Y1 - 60 - 52 * len(blines), acc)
            self._tag(draw, sub_c)

        elif role in ("rehook", "stat", "story"):
            fnt, lines, lh, hh = block_height(draw, h_text, disp, dw, (112, 56), 860, 620)
            bh = 0
            blines: list[str] = []
            bf = font(body_f, 42, 500)
            if b_text:
                blines = wrap(draw, b_text, bf, 780)
                bh = len(blines) * 56 + 40
            top = CORE_Y0 + (CORE_Y1 - CORE_Y0 - hh - bh) / 2
            y = draw_block(draw, lines, fnt, lh, top, text_c, shadow=shadow)
            if blines:
                draw_block(draw, blines, bf, 56, y + 40, sub_c, shadow=shadow)

        elif role in ("value", "paper"):
            fnt, lines, lh, hh = block_height(draw, h_text, disp, dw, (88, 52), 860, 380)
            bf = font(body_f, 42, 500)
            blines = wrap(draw, b_text, bf, 800) if b_text else []
            num_h = 130 if slide.get("n") else 0
            total_h = num_h + hh + (44 + len(blines) * 58 if blines else 0)
            y = max(CORE_Y0 + 20, CORE_Y0 + (CORE_Y1 - CORE_Y0 - total_h) / 2)
            if slide.get("n"):
                nf = font(disp, 84, dw)
                s = str(slide["n"])
                w = draw.textlength(s, font=nf)
                draw.text(((W - w) / 2, y), s, font=nf, fill=acc)
                y += num_h
            y = draw_block(draw, lines, fnt, lh, y, text_c)
            if blines:
                draw_block(draw, blines, bf, 58, y + 44, sub_c)

        elif role == "cta":
            fnt, lines, lh, hh = block_height(draw, h_text, disp, dw, (116, 60), 860, 480)
            top = CORE_Y0 + 90
            y = draw_block(draw, lines, fnt, lh, top, text_c)
            if b_text:
                bf = font(body_f, 44, 500)
                blines = wrap(draw, b_text, bf, 780)
                y = draw_block(draw, blines, bf, 60, y + 50, sub_c)
            # website chip
            tag = self.cfg["tag"]
            cf = font(body_f, 40, 700)
            tw = draw.textlength(tag, font=cf)
            cx0, cy0 = (W - tw) / 2 - 36, CORE_Y1 - 130
            draw.rounded_rectangle((cx0, cy0, cx0 + tw + 72, cy0 + 84), 42, fill=acc)
            draw.text(((W - tw) / 2, cy0 + 20), tag, font=cf, fill="#ffffff")
        else:
            raise ValueError(f"unknown role {role}")
        return im

    def _tag(self, draw, color):
        fnt = font(self.cfg["body_font"], 32, 600)
        tag = self.cfg["tag"]
        w = draw.textlength(tag, font=fnt)
        draw.text(((W - w) / 2, 1560), tag, font=fnt, fill=color)

    def render_post(self, post: dict, post_i: int, out: Path, pdf: bool) -> None:
        slides = post["slides"]
        ig_dir, tt_dir = out / "ig", out / "tt"
        ig_dir.mkdir(parents=True, exist_ok=True)
        tt_dir.mkdir(parents=True, exist_ok=True)
        ig_pages = []
        for i, slide in enumerate(slides):
            im = self.render_slide(slide, i, len(slides), post_i)
            im.save(tt_dir / f"{i + 1:02d}.jpg", quality=92)
            ig = im.crop(IG_CROP)
            ig.save(ig_dir / f"{i + 1:02d}.jpg", quality=92)
            ig_pages.append(ig)
        if pdf:
            ig_pages[0].save(out / "li.pdf", save_all=True, append_images=ig_pages[1:],
                             resolution=96.0)
        cap = post.get("caption", {})
        txt = "\n\n".join(
            [f"== {k.upper()} ==\n{v}" for k, v in cap.items()] +
            ([f"== ALT ==\n{post['alt']}"] if post.get("alt") else [])
        )
        (out / "captions.txt").write_text(txt, encoding="utf-8")


def main() -> None:
    brand_filter = sys.argv[1] if len(sys.argv) > 1 else None
    series_filter = sys.argv[2] if len(sys.argv) > 2 else None
    total = 0
    for bdir in sorted(BRANDS.iterdir()):
        if not (bdir / "brand.json").exists():
            continue
        if brand_filter and bdir.name != brand_filter:
            continue
        r = Renderer(bdir)
        pdf = bdir.name == "qolca"
        for sfile in sorted((bdir / "posts").glob("*.json")):
            if series_filter and not sfile.stem.startswith(series_filter):
                continue
            data = json.loads(sfile.read_text(encoding="utf-8"))
            for i, post in enumerate(data["posts"]):
                out = bdir / "out" / sfile.stem / post["slug"]
                r.render_post(post, i, out, pdf)
                total += 1
            print(f"{bdir.name}/{sfile.stem}: {len(data['posts'])} posts")
    print(f"TOTAL: {total} carousels")


if __name__ == "__main__":
    main()

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

from PIL import Image, ImageDraw, ImageFilter, ImageFont

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

        if slide.get("shot"):
            self._shot_slide(im, draw, slide, rc, disp, dw, body_f)
            return im

        if slide.get("img"):
            self._product_slide(im, draw, slide, rc, disp, dw, body_f)
            return im

        if role == "cover":
            y = CORE_Y0 + 30
            if slide.get("kicker"):
                y = draw_kicker(draw, slide["kicker"], acc, y)
            fnt, lines, lh, hh = block_height(draw, h_text, disp, dw, (176, 64), 860, 700)
            top = y + (CORE_Y1 - 170 - y - hh) / 2
            draw_block(draw, lines, fnt, lh, top, text_c, shadow=shadow)
            if b_text:
                bf = font(body_f, 40, 600)
                blines = wrap(draw, b_text + "  →", bf, 800)
                draw_block(draw, blines, bf, 52, CORE_Y1 - 60 - 52 * len(blines), acc)
            self._tag(draw, sub_c)

        elif role in ("rehook", "stat", "story"):
            # first-slide stories are covers of their series → poster-size type
            max_sz = 150 if n == 0 else 112
            fnt, lines, lh, hh = block_height(draw, h_text, disp, dw, (max_sz, 56), 860, 620)
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

    def _shot_slide(self, im, draw, slide, rc, disp, dw, body_f):
        """Headline, then a real screenshot of the product, then one line of copy.

        Different from `_product_slide` on purpose. A product photo reads at any
        size; a screenshot does not — interface text is ~20px in the source, so the
        crop gets nearly the full core width and whatever height the copy leaves it.
        The crops in brands/propaga/product/ are cut to suit (tools/shots.py): one
        panel each, never a whole dashboard.
        """
        text_c, sub_c = rc["text"], rc["sub"]
        pad = 18            # white margin between the card edge and the screenshot
        gap_h, gap_b = 44, 40

        # Headline and caption are measured first; the screenshot takes whatever
        # height is left, and then the three of them are centred as one block —
        # centring the image inside the leftover space instead leaves the caption
        # stranded mid-slide with a hole under it.
        hf, hlines, hlh, hh = block_height(draw, slide.get("h", ""), disp, dw, (76, 46), 860, 250)

        blines: list[str] = []
        bf = font(body_f, 38, 500)
        if slide.get("b"):
            blines = wrap(draw, slide["b"], bf, 800)
        bh = len(blines) * 50
        tail = gap_b + bh if blines else 0

        max_img_h = (CORE_Y1 - CORE_Y0 - 20) - hh - gap_h - tail - 2 * pad
        shot = Image.open(self.dir / "product" / slide["shot"]).convert("RGB")
        scale = min((888 - 2 * pad) / shot.width, max_img_h / shot.height)
        sw, sh = max(1, round(shot.width * scale)), max(1, round(shot.height * scale))
        shot = shot.resize((sw, sh), Image.LANCZOS)

        card_w, card_h = sw + 2 * pad, sh + 2 * pad
        cx0 = (W - card_w) // 2
        block_h = hh + gap_h + card_h + tail
        y = CORE_Y0 + max(10, (CORE_Y1 - CORE_Y0 - block_h) // 2)
        cy0 = y + hh + gap_h

        draw_block(draw, hlines, hf, hlh, y, text_c)

        # soft drop shadow so a white panel still separates from a light plate
        shadow = Image.new("L", (W, H), 0)
        ImageDraw.Draw(shadow).rounded_rectangle(
            (cx0 + 4, cy0 + 14, cx0 + card_w - 4, cy0 + card_h + 12), 26, fill=105)
        im.paste(Image.new("RGB", (W, H), (26, 16, 10)),
                 (0, 0), shadow.filter(ImageFilter.GaussianBlur(18)))

        card = Image.new("RGB", (card_w, card_h), "#ffffff")
        clip = Image.new("L", (sw, sh), 0)
        ImageDraw.Draw(clip).rounded_rectangle((0, 0, sw - 1, sh - 1), 10, fill=255)
        card.paste(shot, (pad, pad), clip)
        mask = Image.new("L", (card_w, card_h), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, card_w - 1, card_h - 1), 24, fill=255)
        im.paste(card, (cx0, cy0), mask)
        draw.rounded_rectangle((cx0, cy0, cx0 + card_w - 1, cy0 + card_h - 1), 24,
                               outline="#e2ddd6", width=2)

        if blines:
            draw_block(draw, blines, bf, 50, cy0 + card_h + gap_b, sub_c)

    def _product_slide(self, im, draw, slide, rc, disp, dw, body_f):
        """White rounded card with the product photo + headline + body below."""
        text_c, sub_c = rc["text"], rc["sub"]
        card_w, card_h = 660, 560
        cx0 = (W - card_w) // 2
        cy0 = CORE_Y0 + 10
        # rounded white card
        card = Image.new("RGB", (card_w, card_h), "#ffffff")
        mask = Image.new("L", (card_w, card_h), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, card_w, card_h), 36, fill=255)
        # product photo fitted inside with padding
        prod = Image.open(self.dir / "product" / slide["img"]).convert("RGB")
        pw, ph = prod.size
        scale = min((card_w - 60) / pw, (card_h - 60) / ph)
        prod = prod.resize((int(pw * scale), int(ph * scale)), Image.LANCZOS)
        card.paste(prod, ((card_w - prod.width) // 2, (card_h - prod.height) // 2))
        im.paste(card, (cx0, cy0), mask)
        # headline + body under the card
        y = cy0 + card_h + 56
        fnt, lines, lh, hh = block_height(draw, slide.get("h", ""), disp, dw, (84, 52), 860, 260)
        y = draw_block(draw, lines, fnt, lh, y, text_c)
        if slide.get("b"):
            bf = font(body_f, 40, 500)
            blines = wrap(draw, slide["b"], bf, 800)
            draw_block(draw, blines, bf, 54, y + 34, sub_c)

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
        for d in (ig_dir, tt_dir):
            for stale in d.glob('*.jpg'):
                stale.unlink()
            for stale in d.glob('*.png'):
                stale.unlink()
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

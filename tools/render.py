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
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

# Duotono de marca para fotos de evento (CALENDARIO-90 R4: la foto se colorea
# a la paleta). (sombra, luz) por marca; keep = cuánto color original respira.
EVENT_TONES = {
    "comehometag": ("#2a2148", "#f3effc", 0.22),
    "propaga": ("#3a1c14", "#fdf6ec", 0.25),
    "qolca": ("#0d162f", "#eaf2ff", 0.20),
    "radarestatal": ("#0c2440", "#f6f9fc", 0.18),
}


def brand_tone(img: Image.Image, brand: str) -> Image.Image:
    """Duotone a photo into the brand palette, keeping a breath of original
    colour so faces stay recognizable (that's the whole point of the photo)."""
    dark, light, keep = EVENT_TONES.get(brand, ("#222222", "#f5f5f5", 0.25))
    gray = ImageOps.autocontrast(img.convert("L"), cutoff=1)
    toned = ImageOps.colorize(gray, black=dark, white=light)
    return Image.blend(toned, img, keep)

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


# Arrows (U+2190-21FF) are deliberately NOT in here: Montserrat has "→" and the
# cover copy uses it.
EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF\U00002600-\U000027BF\U00002B00-\U00002BFF\U0000FE0F]"
)


def strip_emoji(text: str) -> str:
    """Drop emoji before they reach the canvas.

    Pillow draws with one font and no fallback, so an emoji in slide copy comes
    out as a tofu box — 22 slides shipped that way before this existed. Captions
    are untouched: those are pasted as text into Instagram, where emoji render.
    """
    if not text:
        return text
    out = re.sub(r"\s{2,}", " ", EMOJI.sub("", text))
    # An emoji sitting just inside a bracket or before a comma leaves an orphan
    # space behind: "(obvio 😄)" -> "(obvio )".
    out = re.sub(r"\s+([)\]},.;:!?»])", r"\1", out)
    # Same for a closing straight quote — but only when it IS closing, i.e. what
    # follows is a space, punctuation or the end. An opening one keeps its space.
    out = re.sub(r'\s+"(?=[\s.,;:!?)\]]|$)', '"', out)
    return out.strip(" ·—-")


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


def recap_items(post: dict) -> list[tuple[str, str]]:
    """The post's value slides collapsed to one line each: (number, headline).

    This is what the `recap` slide draws, and why adding one costs no writing:
    the checklist already exists, spread over three slides. Slides that carry an
    image or a screenshot are skipped — their headline is a caption for the
    picture, not a step.
    """
    out: list[tuple[str, str]] = []
    for s in post.get("slides", []):
        if s.get("role") not in ("value", "paper") or not s.get("h"):
            continue
        if s.get("img") or s.get("shot"):
            continue
        out.append((str(s.get("n", "")), strip_emoji(s["h"])))
    # Series that don't number their steps, or number only some of them: a blank
    # badge next to one item looks like a rendering bug, so renumber the lot.
    if not all(n for n, _ in out):
        out = [(str(i + 1), h) for i, (_, h) in enumerate(out)]
    return out


class Renderer:
    def __init__(self, brand_dir: Path):
        self.dir = brand_dir
        self.cfg = json.loads((brand_dir / "brand.json").read_text(encoding="utf-8"))
        self._logo_src: Image.Image | None = None
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

    def render_slide(self, slide: dict, n: int, total: int, post_i: int,
                     post: dict | None = None) -> Image.Image:
        role = slide["role"]
        # `recap` is derived from the rest of the post, so a brand that never
        # configured the role still renders it — on its value plates.
        rc = self.cfg["roles"].get(role) or self.cfg["roles"]["value"]
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

        h_text = strip_emoji(slide.get("h", ""))
        b_text = strip_emoji(slide.get("b", ""))

        if slide.get("shot"):
            self._shot_slide(im, draw, slide, rc, disp, dw, body_f)
            return im

        if slide.get("img"):
            self._product_slide(im, draw, slide, rc, disp, dw, body_f)
            return im

        if role == "cover":
            y = CORE_Y0 + 30
            if slide.get("kicker"):
                y = draw_kicker(draw, strip_emoji(slide["kicker"]), acc, y)
            fnt, lines, lh, hh = block_height(draw, h_text, disp, dw, (176, 64), 860, 700)
            top = y + (CORE_Y1 - 170 - y - hh) / 2
            draw_block(draw, lines, fnt, lh, top, text_c, shadow=shadow)
            if b_text:
                bf = font(body_f, 40, 600)
                blines = wrap(draw, b_text + "  →", bf, 800)
                draw_block(draw, blines, bf, 52, CORE_Y1 - 60 - 52 * len(blines), acc)
            self._tag(im, draw, sub_c)

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
            # A "story" in slide 1 IS the cover of that post (s6 of every brand),
            # so it gets the same footer lockup a `cover` role would.
            if role == "story" and n == 0:
                self._tag(im, draw, sub_c)

        elif role == "recap":
            self._recap_slide(im, draw, slide, post or {}, rc, disp, dw, body_f)

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
            # The mark opens the closing slide; the cover carries the other one.
            top = CORE_Y0 + 90
            lg = self._logo(102)
            if lg is not None:
                im.paste(lg, ((W - lg.width) // 2, CORE_Y0 + 4), lg)
                top = CORE_Y0 + 4 + lg.height + 44
            fnt, lines, lh, hh = block_height(draw, h_text, disp, dw, (116, 60), 860, 430)
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

    def _recap_slide(self, im, draw, slide, post, rc, disp, dw, body_f):
        """The whole checklist on ONE slide — the thing a save is actually for.

        A carousel that spreads three steps over three slides has nothing worth
        keeping: to use the list next Saturday you have to swipe your own saved
        post. This slide is the artifact. It carries the brand lockup on purpose
        — it is the frame that gets screenshotted and forwarded, so it has to say
        whose list it is.

        Everything defaults off the post: title = the cover headline (it already
        names the topic), items = `recap_items`. So the JSON addition is one
        line, `{"role": "recap"}`, and any post can override `kicker`/`h`/`items`.
        """
        text_c, sub_c, acc = rc["text"], rc["sub"], rc["accent"]

        items: list[tuple[str, str]] = []
        if slide.get("items"):
            items = [(str(i + 1), strip_emoji(t)) for i, t in enumerate(slide["items"])]
        else:
            items = recap_items(post)
        title = strip_emoji(slide.get("h") or post.get("slides", [{}])[0].get("h", ""))

        y = draw_kicker(draw, strip_emoji(slide.get("kicker", "para guardar")), acc, CORE_Y0 + 26)
        tf, tlines, tlh, th = block_height(draw, title, disp, dw, (88, 52), 860, 260)

        # The items are fitted to whatever height is left under the title, then
        # title+list are centred as one block: fitting the list first and letting
        # the title float leaves a hole in the middle of the slide.
        num_w, gap_row = 84, 30
        text_w = CORE_X1 - CORE_X0 - num_w
        avail = (CORE_Y1 - 30) - (y + th + 54)
        for size in range(46, 25, -2):
            bf = font(body_f, size, 600)
            rows = [(n, wrap(draw, t, bf, text_w)) for n, t in items]
            lh = round(size * 1.16)
            hh = sum(len(l) * lh for _, l in rows) + gap_row * max(0, len(rows) - 1)
            if hh <= avail:
                break
        nf = font(disp, min(72, size + 20), dw)

        block = th + 54 + hh
        y = y + max(0, ((CORE_Y1 - 30) - y - block) / 2)
        y = draw_block(draw, tlines, tf, tlh, y, text_c) + 54
        for n, lines in rows:
            draw.text((CORE_X0 + 4, y - 6), n, font=nf, fill=acc)
            for line in lines:
                draw.text((CORE_X0 + num_w, y), line, font=bf, fill=text_c)
                y += lh
            y += gap_row
        self._tag(im, draw, sub_c)

    def _shot_slide(self, im, draw, slide, rc, disp, dw, body_f):
        """Headline, then a real screenshot of the product, then one line of copy.

        Different from `_product_slide` on purpose. A product photo reads at any
        size; a screenshot does not — interface text is ~20px in the source, so the
        crop gets nearly the full core width and whatever height the copy leaves it.
        The crops in brands/propaga/product/ are cut to suit (tools/shots.py): one
        panel each, never a whole dashboard.
        """
        text_c, sub_c = rc["text"], rc["sub"]
        pad = 16            # white margin between the card edge and the screenshot
        gap_h, gap_b = 34, 32
        # Wider than the 888px text core: the core rule exists so TEXT survives the
        # square profile-grid crop, and every crop is full width, so an image can
        # spill past it horizontally. Vertically it still has to stay inside.
        card_max_w = 1000

        # Headline and caption are measured first; the screenshot takes whatever
        # height is left, and then the three of them are centred as one block —
        # centring the image inside the leftover space instead leaves the caption
        # stranded mid-slide with a hole under it. The type is deliberately smaller
        # than on a text slide: here the screenshot is the argument.
        hf, hlines, hlh, hh = block_height(draw, strip_emoji(slide.get("h", "")), disp, dw, (68, 44), 860, 170)

        blines: list[str] = []
        bf = font(body_f, 36, 500)
        if slide.get("b"):
            blines = wrap(draw, strip_emoji(slide["b"]), bf, 820)
        bh = len(blines) * 46
        tail = gap_b + bh if blines else 0

        max_img_h = (CORE_Y1 - CORE_Y0 - 16) - hh - gap_h - tail - 2 * pad
        shot = Image.open(self.dir / "product" / slide["shot"]).convert("RGB")
        scale = min((card_max_w - 2 * pad) / shot.width, max_img_h / shot.height)
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
            draw_block(draw, blines, bf, 46, cy0 + card_h + gap_b, sub_c)

    def _product_slide(self, im, draw, slide, rc, disp, dw, body_f):
        """Rounded card with a photo + headline + body below.

        Two treatments, split by filename:
        - `evento-*` (fotos de evento/celebridad): the photo FILLS a large card
          (cover-fit + center-crop, no padding) and is duotoned to the brand
          palette so it sits inside the identity instead of on top of it.
        - anything else (screenshots/producto): contain-fit with white padding —
          a screenshot must never be cropped.
        """
        text_c, sub_c = rc["text"], rc["sub"]
        is_evento = str(slide["img"]).startswith("evento-")
        card_w, card_h = (860, 660) if is_evento else (660, 560)
        cx0 = (W - card_w) // 2
        cy0 = CORE_Y0 + 10
        card = Image.new("RGB", (card_w, card_h), "#ffffff")
        mask = Image.new("L", (card_w, card_h), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, card_w, card_h), 36, fill=255)
        prod = Image.open(self.dir / "product" / slide["img"]).convert("RGB")
        pw, ph = prod.size
        if is_evento:
            # cover-fit: scale so the photo overflows the card, center-crop
            scale = max(card_w / pw, card_h / ph)
            prod = prod.resize((round(pw * scale), round(ph * scale)), Image.LANCZOS)
            x0 = (prod.width - card_w) // 2
            # bias the crop upward: faces live in the top half of portraits
            y0 = min((prod.height - card_h) // 3, prod.height - card_h)
            prod = prod.crop((x0, y0, x0 + card_w, y0 + card_h))
            prod = brand_tone(prod, self.dir.name)
            card.paste(prod, (0, 0))
        else:
            scale = min((card_w - 60) / pw, (card_h - 60) / ph)
            prod = prod.resize((int(pw * scale), int(ph * scale)), Image.LANCZOS)
            card.paste(prod, ((card_w - prod.width) // 2, (card_h - prod.height) // 2))
        im.paste(card, (cx0, cy0), mask)
        # headline + body under the card
        y = cy0 + card_h + 56
        fnt, lines, lh, hh = block_height(draw, strip_emoji(slide.get("h", "")), disp, dw, (84, 52), 860, 260)
        y = draw_block(draw, lines, fnt, lh, y, text_c)
        if slide.get("b"):
            bf = font(body_f, 40, 500)
            blines = wrap(draw, strip_emoji(slide["b"]), bf, 800)
            draw_block(draw, blines, bf, 54, y + 34, sub_c)

    def _logo(self, height: int) -> Image.Image | None:
        """The brand mark at `height` px, or None if the brand has no logo file.

        Each mark is the one the brand actually serves on its own site (see the
        README), kept transparent and full-colour — all three read on their own
        plates, so there is no light/dark variant to pick between.
        """
        name = self.cfg.get("logo")
        if not name:
            return None
        if self._logo_src is None:
            self._logo_src = Image.open(self.dir / name).convert("RGBA")
        src = self._logo_src
        return src.resize((max(1, round(src.width * height / src.height)), height), Image.LANCZOS)

    def _tag(self, im, draw, color):
        """Cover footer: the mark and the domain side by side, centred as one lockup."""
        fnt = font(self.cfg["body_font"], 32, 600)
        tag = self.cfg["tag"]
        tw = draw.textlength(tag, font=fnt)
        bbox = draw.textbbox((0, 0), tag, font=fnt)
        cy = 1566
        lg = self._logo(46)
        if lg is None:
            draw.text(((W - tw) / 2, cy - (bbox[3] + bbox[1]) / 2), tag, font=fnt, fill=color)
            return
        gap = 16
        x = (W - (lg.width + gap + tw)) / 2
        im.paste(lg, (round(x), round(cy - lg.height / 2)), lg)
        draw.text((x + lg.width + gap, cy - (bbox[3] + bbox[1]) / 2), tag, font=fnt, fill=color)

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
            im = self.render_slide(slide, i, len(slides), post_i, post)
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

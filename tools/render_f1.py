"""F1 renderer — the measured million-view slide formula (ESTRATEGIA-VIRAL-2026-09 §4).

Photo full-bleed + black scrim + huge condensed ALL-CAPS white type in the
bottom third, ONE accent per slide, a 44px monochrome monogram inside the type
block. Flat brand-colour slides (Flamingo style) for list/interior content.
No emoji PNGs, no slide counters, no duotone: the photo ships as shot.

Series JSON opts in with {"format": "f1"}. Slide schema:
  role: "cover" | "value" | "closer"
  photo:  file in brands/<b>/photos/  (full-bleed; omit -> flat brand colour)
  img:    file in brands/<b>/product/ (closer only: product shot on a card)
  kicker: small spaced caps line (cover only, optional)
  h:      the big line. *palabras* entre asteriscos van en color de ACENTO.
  b:      small white line(s); '\n' = hard break (max ~75 chars total)
  label:  one/two-word accent label above h (value slides, optional)

Both cuts render NATIVELY (no shared crop): ig/ 1080x1350 and tt/ 1080x1920,
same fractions of frame height, so TikTok never shows dead thirds again.

Usage: python tools/render_f1.py [brand] [series] [slug1,slug2]
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from render import ROOT, BRANDS, font, strip_emoji, cover_crop as _cover_crop_1920  # noqa: E402

W = 1080
FORMATS = {"ig": 1350, "tt": 1920}

# F1 palette per brand: bright accent (readable on near-black), flat slide
# ground + text. Kept deliberately distinct across the five brands (defensa
# contra el flag de originalidad multi-cuenta). brand.json {"f1": {...}}
# overrides any key.
F1 = {
    "comehometag": {"accent": "#c9b3ff", "flat_bg": "#231a3f", "flat_text": "#f4f0ff"},
    "propaga":     {"accent": "#ff5964", "flat_bg": "#f7efe2", "flat_text": "#211409",
                    "flat_dark_text": True},
    "qolca":       {"accent": "#6cb1ff", "flat_bg": "#0d1526", "flat_text": "#eaf2ff"},
    "radarestatal": {"accent": "#79b4f2", "flat_bg": "#0c2440", "flat_text": "#f2f7fd"},
    "diplomy":     {"accent": "#8fb8ff", "flat_bg": "#0a1f45", "flat_text": "#f5f8ff"},
}
CAP = 0.72          # cap-height/em for the display faces in use
ACCENT_RE = re.compile(r"\*([^*]+)\*")

# Categorías sin foto curada -> la vecina más cercana (la curaduría decide qué
# sobrevive; los posts no se editan). Sin alias ni archivo -> lámina plana.
PHOTO_ALIAS = {
    "comehometag": {"abuelo": "abuela", "nino-mochila": "nino-mano",
                     "perro-collar": "perro-cara",
                     "familia-parque": "nino-mano", "correa": "perro-parque",
                     "mercado": "noche-calle"},
    "qolca": {"boda-prep": "boda-mesas", "papeles": "cuaderno",
              "celular-noche": "tienda-cerrada"},
    "propaga": {"foto-producto": "manos-celular", "calendario": "laptop-mesa"},
    "radarestatal": {"edificio-gob": "lima", "camiones": "almacen"},
    "diplomy": {"estudiando": "aula", "profesor": "aula",
                "laptop-curso": "aula", "diploma": "graduacion"},
}


def cover_crop(p: Path, H: int) -> Image.Image:
    im = Image.open(p).convert("RGB")
    w, h = im.size
    nw = max(W, round(w * H / h))
    nh = H
    if nw < W:  # never happens (nw>=W) but keep safe
        nw = W
    im = im.resize((nw, nh), Image.LANCZOS)
    x0 = (nw - W) // 2
    return im.crop((x0, 0, x0 + W, H))


def scrim(im: Image.Image, H: int) -> None:
    """The measured pubity curve: 0 to 38% -> .45 at 52% -> .94 at 74% -> solid."""
    ramp = Image.new("L", (1, H), 0)
    px = ramp.load()
    stops = [(0.0, 0.0), (0.38, 0.0), (0.52, 0.45), (0.74, 0.94), (0.78, 1.0), (1.0, 1.0)]
    for y in range(H):
        t = y / H
        for (t0, a0), (t1, a1) in zip(stops, stops[1:]):
            if t0 <= t <= t1:
                f = 0 if t1 == t0 else (t - t0) / (t1 - t0)
                a = a0 + (a1 - a0) * f
                break
        else:
            a = 1.0
        px[0, y] = int(round(255 * a))
    im.paste(Image.new("RGB", (W, H), (0, 0, 0)), (0, 0), ramp.resize((W, H)))


def parse_accent(text: str) -> list[tuple[str, bool]]:
    """'ven *ya* aqui' -> [('ven',F),('ya',T),('aqui',F)] word-level."""
    out: list[tuple[str, bool]] = []
    pos = 0
    for m in ACCENT_RE.finditer(text):
        for wd in text[pos:m.start()].split():
            out.append((wd, False))
        for wd in m.group(1).split():
            out.append((wd, True))
        pos = m.end()
    for wd in text[pos:].split():
        out.append((wd, False))
    return out


def wrap_words(draw, words: list[tuple[str, bool]], fnt, maxw: int) -> list[list[tuple[str, bool]]]:
    lines: list[list[tuple[str, bool]]] = []
    cur: list[tuple[str, bool]] = []
    for wd, acc in words:
        cand = " ".join(w for w, _ in cur + [(wd, acc)])
        if draw.textlength(cand, font=fnt) <= maxw or not cur:
            cur.append((wd, acc))
        else:
            lines.append(cur)
            cur = [(wd, acc)]
    if cur:
        lines.append(cur)
    return lines


def fit_display(draw, text: str, fname: str, weight, max_size: int, maxw: int,
                max_lines: int = 4, leading: float = 1.08):
    """Biggest size at which the accent-parsed text fits maxw in <=max_lines."""
    words = parse_accent(text)
    for size in range(max_size, 39, -4):
        fnt = font(fname, size, weight)
        lines = wrap_words(draw, words, fnt, maxw)
        if len(lines) <= max_lines:
            return fnt, lines, round(size * leading)
    fnt = font(fname, 40, weight)
    return fnt, wrap_words(draw, words, fnt, maxw), round(40 * leading)


def draw_lines(draw, lines, fnt, lh, y, color, accent, align="center", x0=0):
    space = draw.textlength(" ", font=fnt)
    for line in lines:
        total = sum(draw.textlength(w, font=fnt) for w, _ in line) + space * (len(line) - 1)
        x = (W - total) / 2 if align == "center" else x0
        for wd, acc in line:
            draw.text((x, y), wd, font=fnt, fill=accent if acc else color)
            x += draw.textlength(wd, font=fnt) + space
        y += lh
    return y


class F1Renderer:
    def __init__(self, brand_dir: Path):
        self.dir = brand_dir
        self.brand = brand_dir.name
        self.cfg = json.loads((brand_dir / "brand.json").read_text(encoding="utf-8"))
        pal = dict(F1.get(self.brand, F1["qolca"]))
        pal.update(self.cfg.get("f1", {}))
        self.pal = pal
        self.disp = self.cfg["display_font"]
        self.dw = self.cfg.get("display_weight") or (800 if "Variable" in self.disp else None)
        self.body = self.cfg["body_font"]
        self._logo_alpha: Image.Image | None = None

    # -- chrome ------------------------------------------------------------
    def _mono_logo(self, height: int, color=(255, 255, 255)) -> Image.Image | None:
        """The brand mark as a flat monochrome silhouette (the 44px monogram)."""
        name = self.cfg.get("logo")
        if not name or not (self.dir / name).exists():
            return None
        if self._logo_alpha is None:
            self._logo_alpha = Image.open(self.dir / name).convert("RGBA")
        src = self._logo_alpha
        w = max(1, round(src.width * height / src.height))
        a = src.resize((w, height), Image.LANCZOS).getchannel("A")
        out = Image.new("RGBA", (w, height), color + (0,))
        out.putalpha(a)
        return out

    def monogram_row(self, im, draw, y: int, H: int, light=True) -> int:
        """logo + hairline rules left/right, centred. Returns new y."""
        col = (255, 255, 255) if light else (20, 20, 24)
        line = (255, 255, 255, 140) if light else (20, 20, 24, 110)
        h = max(30, round(0.030 * H))
        lg = self._mono_logo(h, col)
        pad = 26
        mid = y + h // 2
        if lg is not None:
            x0 = (W - lg.width) // 2
            im.paste(lg, (x0, y), lg)
            for a, b in ((int(0.055 * W), x0 - pad), (x0 + lg.width + pad, W - int(0.055 * W))):
                if b > a:
                    draw.line((a, mid, b, mid), fill=line, width=2)
        return y + h + round(0.012 * H)

    # -- slides ------------------------------------------------------------
    def resolve_photo(self, name: str, salt: int) -> Path | None:
        """Exact file, or CATEGORY prefix resolved against the curated pool.

        Agents write `"photo": "perro-calle"`; curation decides which files
        exist. Same category in different posts rotates by `salt` so feeds
        don't repeat one photo (defensa contra el flag de originalidad)."""
        d = self.dir / "photos"
        p = d / name
        if p.suffix and p.exists():
            return p
        pool = sorted(x for x in d.glob(f"{name}*.jpg") if x.is_file())
        if not pool:
            alias = PHOTO_ALIAS.get(self.brand, {}).get(name)
            if alias:
                pool = sorted(x for x in d.glob(f"{alias}*.jpg") if x.is_file())
        if not pool:
            return None
        return pool[salt % len(pool)]

    def slide(self, s: dict, H: int, salt: int = 0) -> Image.Image:
        role = s.get("role", "value")
        photo = s.get("photo")
        p = self.resolve_photo(photo, salt) if photo else None
        if photo and p is None:
            print(f"  ! photo missing: {self.brand}/photos/{photo} -> flat")
        if p is not None:
            im = cover_crop(p, H)
            scrim(im, H)
            light = True
        else:
            im = Image.new("RGB", (W, H), self.pal["flat_bg"])
            light = not self.pal.get("flat_dark_text")
        draw = ImageDraw.Draw(im)
        if role == "cover":
            self._cover(im, draw, s, H, light, photo=p is not None)
        elif role == "closer":
            self._closer(im, draw, s, H, light, photo=p is not None)
        else:
            self._value(im, draw, s, H, light, photo=p is not None)
        return im

    def _text_colors(self, light: bool):
        return ("#ffffff", self.pal["accent"]) if light else \
               (self.pal["flat_text"], self.pal["accent"])

    def _cover(self, im, draw, s, H, light, photo):
        text_c, acc = self._text_colors(light)
        margin = round(0.045 * W)
        maxw = W - 2 * margin
        max_sz = round((0.122 if H <= 1400 else 0.095) * H)
        h_text = strip_emoji(s.get("h", ""))
        fnt, lines, lh = fit_display(draw, h_text, self.disp, self.dw, max_sz, maxw)
        sub = strip_emoji(s.get("b") or s.get("sub") or "")
        bf = font(self.body, round(0.030 * H), 600)
        sublines = []
        if sub:
            from render import wrap
            sublines = wrap(draw, sub, bf, maxw - 60)
        sub_lh = round(0.038 * H)
        kick = strip_emoji(s.get("kicker", ""))
        kf = font(self.body, round(0.020 * H), 700)
        block = len(lines) * lh + (len(sublines) * sub_lh + round(0.018 * H) if sublines else 0)
        chrome = round(0.030 * H) + round(0.012 * H)          # monogram row
        kh = round(0.034 * H) if kick else 0
        bottom = H - round(0.035 * H)
        y = bottom - block
        y0 = y - chrome - kh
        if kick:
            sp = " ".join(kick.upper())
            kw = draw.textlength(sp, font=kf)
            draw.text(((W - kw) / 2, y0), sp, font=kf, fill=acc if photo else acc)
            y0 += kh
        self.monogram_row(im, draw, y0, H, light)
        y = draw_lines(draw, lines, fnt, lh, y, text_c, acc)
        if sublines:
            yy = y + round(0.014 * H)
            for l in sublines:
                lw = draw.textlength(l, font=bf)
                draw.text(((W - lw) / 2, yy), l, font=bf,
                          fill="#dcdcdc" if light else "#6b6b66")
                yy += sub_lh

    def _value(self, im, draw, s, H, light, photo):
        text_c, acc = self._text_colors(light)
        margin = round(0.06 * W)
        maxw = W - 2 * margin
        label = strip_emoji(s.get("label", ""))
        h_text = strip_emoji(s.get("h", ""))
        b_text = strip_emoji(s.get("b", ""))
        lf = font(self.disp, round((0.070 if H <= 1400 else 0.054) * H), self.dw)
        hf_max = round((0.088 if H <= 1400 else 0.066) * H)
        fnt, lines, lh = fit_display(draw, h_text, self.disp, self.dw, hf_max, maxw, max_lines=3)
        bf = font(self.body, round(0.0285 * H), 500)
        from render import wrap
        blines = wrap(draw, b_text, bf, maxw - 40) if b_text else []
        b_lh = round(0.040 * H)
        lab_h = round(lf.size * 1.15) if label else 0
        block = lab_h + len(lines) * lh + (round(0.020 * H) + len(blines) * b_lh if blines else 0)
        if photo:
            y = H - round(0.035 * H) - block
        else:
            y = (H - block) / 2
        if label:
            lw = draw.textlength(label.upper(), font=lf)
            draw.text(((W - lw) / 2, y), label.upper(), font=lf, fill=acc)
            y += lab_h
        y = draw_lines(draw, lines, fnt, lh, y, text_c, acc)
        if blines:
            yy = y + round(0.020 * H)
            for l in blines:
                lw = draw.textlength(l, font=bf)
                draw.text(((W - lw) / 2, yy), l, font=bf,
                          fill="#e6e6e6" if light else ("#5c5148" if self.pal.get("flat_dark_text") else "#c9d4e4"))
                yy += b_lh

    def _closer(self, im, draw, s, H, light, photo):
        text_c, acc = self._text_colors(light)
        margin = round(0.055 * W)
        maxw = W - 2 * margin
        img = s.get("img") or s.get("shot")
        h_text = strip_emoji(s.get("h", ""))
        b_text = strip_emoji(s.get("b", ""))
        max_sz = round((0.085 if H <= 1400 else 0.065) * H)
        fnt, lines, lh = fit_display(draw, h_text, self.disp, self.dw, max_sz, maxw, max_lines=3)
        bf = font(self.body, round(0.030 * H), 600)
        from render import wrap
        blines = wrap(draw, b_text, bf, maxw - 40) if b_text else []
        b_lh = round(0.040 * H)
        tag = self.cfg.get("tag", "")
        tag_h = round(0.052 * H) if tag else 0
        chrome = round(0.030 * H) + round(0.012 * H)
        block = chrome + len(lines) * lh + (round(0.018 * H) + len(blines) * b_lh if blines else 0) + tag_h

        prod = None
        if img and (self.dir / "product" / img).exists():
            prod = Image.open(self.dir / "product" / img).convert("RGB")
            card_w = round(0.52 * W)
            scale = card_w / prod.width
            card_h = min(round(0.30 * H), round(prod.height * scale))
            prod = prod.resize((card_w, round(prod.height * scale)), Image.LANCZOS)
            prod = prod.crop((0, 0, card_w, min(prod.height, card_h)))
        gap = round(0.045 * H)
        group = block + ((prod.height + gap) if prod is not None else 0)
        y = max(round(0.06 * H), (H - group) / 2)
        if prod is not None:
            mask = Image.new("L", prod.size, 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, prod.width - 1, prod.height - 1), 28, fill=255)
            top = round(y)
            sh = Image.new("L", (W, H), 0)
            ImageDraw.Draw(sh).rounded_rectangle(
                ((W - prod.width) // 2 + 4, top + 12, (W + prod.width) // 2 + 4, top + prod.height + 12),
                28, fill=100)
            im.paste(Image.new("RGB", (W, H), (0, 0, 0)), (0, 0), sh.filter(ImageFilter.GaussianBlur(16)))
            im.paste(prod, ((W - prod.width) // 2, top), mask)
            y = top + prod.height + gap
        y = self.monogram_row(im, draw, round(y), H, light)
        y = draw_lines(draw, lines, fnt, lh, y, text_c, acc)
        if blines:
            y += round(0.018 * H)
            for l in blines:
                lw = draw.textlength(l, font=bf)
                draw.text(((W - lw) / 2, y), l, font=bf, fill="#e6e6e6" if light else text_c)
                y += b_lh
        if tag:
            tf = font(self.body, round(0.026 * H), 700)
            tw = draw.textlength(tag, font=tf)
            draw.text(((W - tw) / 2, y + round(0.012 * H)), tag, font=tf, fill=acc)

    # -- post --------------------------------------------------------------
    def render_post(self, post: dict, out: Path, post_i: int = 0) -> None:
        for fmt, H in FORMATS.items():
            d = out / fmt
            d.mkdir(parents=True, exist_ok=True)
            for stale in list(d.glob("*.jpg")) + list(d.glob("*.png")):
                stale.unlink()
            for i, s in enumerate(post["slides"]):
                self.slide(s, H, salt=post_i * 3 + i).save(d / f"{i + 1:02d}.jpg", quality=92)
        cap = post.get("caption", {})
        txt = "\n\n".join(
            [f"== {k.upper()} ==\n{v}" for k, v in cap.items()] +
            ([f"== ALT ==\n{post['alt']}"] if post.get("alt") else [])
        )
        (out / "captions.txt").write_text(txt, encoding="utf-8")


def main() -> None:
    brand_f = sys.argv[1] if len(sys.argv) > 1 else None
    series_f = sys.argv[2] if len(sys.argv) > 2 else None
    slugs = set(sys.argv[3].split(",")) if len(sys.argv) > 3 else None
    total = 0
    for bdir in sorted(BRANDS.iterdir()):
        if not (bdir / "brand.json").exists():
            continue
        if brand_f and bdir.name != brand_f:
            continue
        r = F1Renderer(bdir)
        for sfile in sorted((bdir / "posts").glob("*.json")):
            if series_f and not sfile.stem.startswith(series_f):
                continue
            data = json.loads(sfile.read_text(encoding="utf-8"))
            if data.get("format") != "f1":
                continue
            done = 0
            for pi, post in enumerate(data["posts"]):
                if slugs and post["slug"] not in slugs:
                    continue
                r.render_post(post, bdir / "out" / sfile.stem / post["slug"], pi)
                done += 1
                total += 1
            if done:
                print(f"{bdir.name}/{sfile.stem}: {done} posts (f1)")
    print(f"TOTAL: {total} carousels (f1)")


if __name__ == "__main__":
    main()

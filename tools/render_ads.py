"""render_ads — creatividades ESTÁTICAS para Meta Ads, sobre el sistema visual F1.

Un carrusel se gana el swipe; un anuncio se gana el clic. Mismo lenguaje visual
que F1 (foto full-bleed, scrim medido, display condensada gigante, UN acento por
pieza, monograma) pero con las cuatro estructuras de respuesta directa que
miden mejor en estático 2026: gancho problema→solución, comparación antes/
después, los pasos del mecanismo, y la pieza de producto con objeciones.

A diferencia de F1, TODA pieza termina en un CTA visible: sin él es un post,
no un anuncio.

Series JSON: brands/<b>/ads/<archivo>.json
  {"brand": "comehometag", "ads": [ {...}, ... ]}

Campos por anuncio:
  id      nombre de archivo
  layout  "hook" | "split" | "pasos" | "oferta"
  photo   archivo en ads/shots/ o en photos/ (hook)
  a / b   {photo, label, h} de cada mitad (split)
  steps   ["...", "...", "..."] (pasos)
  img     archivo en product/ (pasos, oferta)
  kicker  línea chica espaciada arriba del titular (hook)
  h       el titular. *palabras* entre asteriscos van en ACENTO
  sub     línea chica bajo el titular
  bullets ["...", ...] (oferta)
  cta     el texto de la píldora
  tag     el dominio bajo la píldora (default: brand.json "tag")

Cortes: 4x5 (1080x1350, el del feed), 1x1 (1080x1080) y 9x16 (1080x1920,
Reels/Stories). Cada uno se compone NATIVO, no se recorta del mismo lienzo.

Uso: python tools/render_ads.py [brand] [archivo] [id1,id2]
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from render import BRANDS, font, strip_emoji, wrap, on_accent  # noqa: E402
from render_f1 import (  # noqa: E402
    F1, W, cover_crop, draw_lines, fit_display, parse_accent, wrap_words,
)

FORMATS = {"4x5": 1350, "1x1": 1080, "9x16": 1920}
DANGER = "#ff6b6b"


def cover_panel(p: Path, w: int, h: int, ay: float = 0.5) -> Image.Image:
    """Aspect-fill honesto: escala por el lado que falta y recorta el resto.
    `render_f1.cover_crop` solo sirve para lienzos 1080 de alto >= ancho; en un
    panel apaisado estira la foto."""
    im = Image.open(p).convert("RGB")
    iw, ih = im.size
    s = max(w / iw, h / ih)
    nw, nh = max(w, round(iw * s)), max(h, round(ih * s))
    im = im.resize((nw, nh), Image.LANCZOS)
    x = (nw - w) // 2
    y = min(max(round((nh - h) * ay), 0), nh - h)
    return im.crop((x, y, x + w, y + h))


def top_scrim(im: Image.Image, H: int, frac: float = 0.16) -> None:
    """Sombra suave arriba para que la marca se lea sobre cualquier foto."""
    n = round(H * frac)
    ramp = Image.new("L", (1, n))
    px = ramp.load()
    for y in range(n):
        px[0, y] = int(round(150 * (1 - y / n) ** 1.6))
    im.paste(Image.new("RGB", (im.width, n), (0, 0, 0)), (0, 0), ramp.resize((im.width, n)))


def ad_scrim(im: Image.Image, H: int, top: float, full: float) -> None:
    """Scrim negro que arranca en `top` (fracción) y llega a sólido en `full`."""
    ramp = Image.new("L", (1, H), 0)
    px = ramp.load()
    for y in range(H):
        t = y / H
        if t <= top:
            a = 0.0
        elif t >= full:
            a = 1.0
        else:
            f = (t - top) / (full - top)
            a = f * f * (3 - 2 * f)          # smoothstep, sin banda visible
        px[0, y] = int(round(255 * a * 0.97))
    im.paste(Image.new("RGB", im.size, (0, 0, 0)), (0, 0), ramp.resize(im.size))


def pill(draw, cx: int, y: int, text: str, fnt, bg: str, fg: str) -> int:
    """Píldora de CTA centrada en cx. Devuelve el borde inferior."""
    tw = draw.textlength(text, font=fnt)
    h = round(fnt.size * 2.35)
    w = round(tw + fnt.size * 2.3)
    x0 = cx - w // 2
    draw.rounded_rectangle([x0, y, x0 + w, y + h], radius=h // 2, fill=bg)
    draw.text((x0 + (w - tw) / 2, y + (h - fnt.size * 1.30) / 2), text, font=fnt, fill=fg)
    return y + h


class AdRenderer:
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
        self._logo: Image.Image | None = None

    # ---------------------------------------------------------------- chrome
    def logo(self, h: int, color=(255, 255, 255)) -> Image.Image | None:
        name = self.cfg.get("logo")
        if not name or not (self.dir / name).exists():
            return None
        if self._logo is None:
            self._logo = Image.open(self.dir / name).convert("RGBA")
        src = self._logo
        w = max(1, round(src.width * h / src.height))
        a = src.resize((w, h), Image.LANCZOS).getchannel("A")
        out = Image.new("RGBA", (w, h), color + (0,))
        out.putalpha(a)
        return out

    def wordmark(self, im, draw, H: int, light=True) -> None:
        """Logo + dominio arriba a la izquierda: en un anuncio la marca se ve
        desde el primer instante, no al final como en un carrusel."""
        col = (255, 255, 255) if light else (24, 22, 40)
        h = round(0.034 * H)
        x, y = round(0.055 * W), round(0.045 * H)
        lg = self.logo(h, col)
        if lg is not None:
            im.paste(lg, (x, y), lg)
            x += lg.width + round(h * 0.42)
        f = font(self.body, round(h * 0.62), 700)
        draw.text((x, y + h * 0.30), self.cfg.get("tag", self.brand), font=f, fill=col)

    def resolve(self, name: str | None) -> Path | None:
        if not name:
            return None
        for d in (self.dir / "ads" / "shots", self.dir / "photos", self.dir / "product"):
            p = d / name
            if p.exists():
                return p
            hit = sorted(d.glob(f"{name}*"))
            if hit:
                return hit[0]
        return None

    def cta_block(self, im, draw, H: int, y: int, ad: dict, light=True) -> None:
        """Píldora + dominio. Va SIEMPRE, es lo que separa un anuncio de un post."""
        acc = self.pal["accent"]
        cf = font(self.body, round(0.026 * H), 700)
        y = pill(draw, W // 2, y, ad.get("cta", "Más información"), cf, acc, on_accent(acc))
        tag = ad.get("tag", self.cfg.get("tag", ""))
        if tag:
            tf = font(self.body, round(0.022 * H), 600)
            tw = draw.textlength(tag, font=tf)
            draw.text(((W - tw) / 2, y + round(0.016 * H)), tag, font=tf,
                      fill="#c9c9d6" if light else "#6b6b7a")

    # --------------------------------------------------------------- layouts
    def _hook(self, ad: dict, H: int) -> Image.Image:
        p = self.resolve(ad.get("photo"))
        if p is None:
            raise SystemExit(f"  ! falta la foto {ad.get('photo')} en {self.brand}")
        im = cover_panel(p, W, H, ad.get("anchor", 0.5))
        # el bloque de texto es más alto que en F1 porque abajo va el CTA
        ad_scrim(im, H, 0.22 if H >= 1300 else 0.18, 0.70)
        top_scrim(im, H)
        draw = ImageDraw.Draw(im)
        self.wordmark(im, draw, H)

        margin = round(0.055 * W)
        maxw = W - 2 * margin
        acc = self.pal["accent"]
        bottom = H - round(0.055 * H)

        cta_h = round(0.026 * H * 2.35) + round(0.016 * H) + round(0.022 * H)
        sub = strip_emoji(ad.get("sub", ""))
        bf = font(self.body, round(0.028 * H), 600)
        sublines = wrap(draw, sub, bf, maxw - 40) if sub else []
        sub_lh = round(0.037 * H)
        kick = strip_emoji(ad.get("kicker", ""))
        kf = font(self.body, round(0.019 * H), 700)
        kh = round(0.032 * H) if kick else 0

        max_sz = round((0.112 if H <= 1400 else 0.088) * H)
        fnt, lines, lh = fit_display(draw, strip_emoji(ad["h"]), self.disp, self.dw,
                                     max_sz, maxw, max_lines=4)
        block = (kh + len(lines) * lh
                 + (round(0.030 * H) + len(sublines) * sub_lh if sublines else 0)
                 + round(0.040 * H) + cta_h)
        y = bottom - block
        if kick:
            sp = " ".join(kick.upper())
            kw = draw.textlength(sp, font=kf)
            draw.text(((W - kw) / 2, y), sp, font=kf, fill=acc)
            y += kh
        y = draw_lines(draw, lines, fnt, lh, y, "#ffffff", acc)
        if sublines:
            y += round(0.030 * H)
            for l in sublines:
                lw = draw.textlength(l, font=bf)
                draw.text(((W - lw) / 2, y), l, font=bf, fill="#dedee8")
                y += sub_lh
        self.cta_block(im, draw, H, round(y + round(0.040 * H)), ad)
        return im

    def _split(self, ad: dict, H: int) -> Image.Image:
        """Comparación: la mitad de arriba es el problema, la de abajo la solución.
        El formato más viejo de respuesta directa y el que sigue ganando."""
        # con dominio/tag bajo la píldora el pie necesita más aire, o se corta
        foot = round((0.245 if ad.get("tag", self.cfg.get("tag")) else 0.185) * H)
        panel = (H - foot) // 2
        im = Image.new("RGB", (W, H), self.pal["flat_bg"])
        draw = ImageDraw.Draw(im)
        acc = self.pal["accent"]

        for i, key in enumerate(("a", "b")):
            part = ad[key]
            p = self.resolve(part.get("photo"))
            if p is None:
                raise SystemExit(f"  ! falta la foto {part.get('photo')}")
            ph = cover_panel(p, W, panel, part.get("anchor", 0.5))
            ad_scrim(ph, panel, 0.20, 0.96)
            if i == 0:
                top_scrim(ph, panel, 0.30)
            im.paste(ph, (0, i * panel))
            d2 = ImageDraw.Draw(im)
            col = DANGER if i == 0 else acc
            lf = font(self.disp, round(panel * 0.085), self.dw)
            label = part.get("label", "").upper()
            hf_max = round(panel * 0.115)
            fnt, lines, lh = fit_display(d2, strip_emoji(part["h"]), self.disp, self.dw,
                                         hf_max, W - round(0.11 * W), max_lines=2)
            lab_h = round(lf.size * 1.32) if label else 0
            block = lab_h + len(lines) * lh
            y = (i + 1) * panel - round(panel * 0.075) - block
            if label:
                lw = d2.textlength(label, font=lf)
                d2.text(((W - lw) / 2, y), label, font=lf, fill=col)
                y += lab_h
            draw_lines(d2, lines, fnt, lh, y, "#ffffff", col)

        # franja divisoria
        draw.rectangle([0, panel - 3, W, panel + 3], fill=acc)

        y = 2 * panel + round(0.030 * H)
        self.wordmark(im, draw, H, light=True)
        h_text = strip_emoji(ad.get("h", ""))
        if h_text:
            bf = font(self.body, round(0.027 * H), 600)
            for l in wrap(draw, h_text, bf, W - round(0.12 * W)):
                lw = draw.textlength(l, font=bf)
                draw.text(((W - lw) / 2, y), l, font=bf, fill=self.pal["flat_text"])
                y += round(0.036 * H)
            y += round(0.012 * H)
        bg = self.pal["flat_bg"].lstrip("#")
        dark = sum(int(bg[i:i + 2], 16) for i in (0, 2, 4)) < 3 * 128
        self.cta_block(im, draw, H, y, ad, light=dark)
        return im

    def _card(self, im, draw, img_name: str, top: int, H: int, frac=0.46,
              max_h: int | None = None) -> int:
        """Foto de producto sobre tarjeta blanca redondeada con sombra."""
        p = self.resolve(img_name)
        if p is None:
            return top
        prod = Image.open(p).convert("RGB")
        cw = round(frac * W)
        prod = prod.resize((cw, round(prod.height * cw / prod.width)), Image.LANCZOS)
        ch = min(max_h or round(0.26 * H), prod.height)
        prod = prod.crop((0, max(0, (prod.height - ch) // 2), cw, max(0, (prod.height - ch) // 2) + ch))
        x0 = (W - cw) // 2
        sh = Image.new("L", (W, H), 0)
        ImageDraw.Draw(sh).rounded_rectangle((x0 + 5, top + 14, x0 + cw + 5, top + ch + 14), 30, fill=110)
        im.paste(Image.new("RGB", (W, H), (0, 0, 0)), (0, 0), sh.filter(ImageFilter.GaussianBlur(18)))
        mask = Image.new("L", (cw, ch), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, cw - 1, ch - 1), 30, fill=255)
        im.paste(prod, (x0, top), mask)
        return top + ch

    def _cta_top(self, H: int) -> int:
        """El CTA va SIEMPRE anclado abajo, a la misma altura en las tres piezas:
        centrar el bloque entero dejaba la píldora fuera del lienzo cuando el
        contenido crecía."""
        cta_h = round(0.026 * H) * 2.35 + round(0.016 * H) + round(0.022 * H) * 1.4
        return round(H - 0.050 * H - cta_h)

    def _pasos(self, ad: dict, H: int) -> Image.Image:
        """El mecanismo en 3 pasos: convierte cuando el producto es raro y la
        objeción real es «no entiendo cómo funciona»."""
        im = Image.new("RGB", (W, H), self.pal["flat_bg"])
        draw = ImageDraw.Draw(im)
        acc = self.pal["accent"]
        txt = self.pal["flat_text"]
        light = not self.pal.get("flat_dark_text")
        self.wordmark(im, draw, H, light=light)

        margin = round(0.085 * W)
        maxw = W - 2 * margin
        cta_top = self._cta_top(H)

        fnt, lines, lh = fit_display(draw, strip_emoji(ad["h"]), self.disp, self.dw,
                                     round(0.070 * H), maxw, max_lines=2)
        nf = font(self.disp, round(0.058 * H), self.dw)
        sf = font(self.body, round(0.029 * H), 600)
        step_lh = round(sf.size * 1.34)
        gap = round(0.028 * H)
        wrapped = [wrap(draw, s, sf, maxw - round(0.105 * W)) for s in ad.get("steps", [])]

        y = round(0.140 * H)
        y = draw_lines(draw, lines, fnt, lh, y, txt, acc)
        y += round(0.046 * H)
        for i, w in enumerate(wrapped):
            num = f"{i + 1}"
            nw = draw.textlength(num, font=nf)
            draw.text((margin, y - round(0.010 * H)), num, font=nf, fill=acc)
            yy = y
            for l in w:
                draw.text((margin + nw + round(0.042 * W), yy), l, font=sf, fill=txt)
                yy += step_lh
            y = yy + gap

        # la tarjeta de producto ocupa lo que sobre, nunca empuja al CTA
        room = cta_top - round(0.030 * H) - y
        if ad.get("img") and room > round(0.10 * H):
            self._card(im, draw, ad["img"], round(y + (room - min(room, round(0.26 * H))) / 2),
                       H, frac=0.50, max_h=min(room, round(0.26 * H)))
        self.cta_block(im, draw, H, cta_top, ad, light=light)
        return im

    def _oferta(self, ad: dict, H: int) -> Image.Image:
        """Producto + objeciones resueltas. Es la pieza de retargeting: la ve
        quien ya entendió qué es y todavía no compra."""
        im = Image.new("RGB", (W, H), self.pal["flat_bg"])
        draw = ImageDraw.Draw(im)
        acc = self.pal["accent"]
        txt = self.pal["flat_text"]
        light = not self.pal.get("flat_dark_text")
        self.wordmark(im, draw, H, light=light)

        margin = round(0.085 * W)
        maxw = W - 2 * margin
        cta_top = self._cta_top(H)

        fnt, lines, lh = fit_display(draw, strip_emoji(ad["h"]), self.disp, self.dw,
                                     round(0.078 * H), maxw, max_lines=3)
        bullets = ad.get("bullets", [])
        bull_x = margin + round(0.052 * W)
        bf = font(self.body, round(0.030 * H), 600)
        while bullets and max(draw.textlength(b, font=bf) for b in bullets) > W - bull_x - margin:
            bf = font(self.body, bf.size - 2, 600)
        b_lh = round(bf.size * 1.62)

        tail = len(lines) * lh + round(0.038 * H) + len(bullets) * b_lh
        top = round(0.135 * H)
        room = cta_top - round(0.040 * H) - tail - top
        if ad.get("img") and room > round(0.10 * H):
            card_h = min(room, round(0.30 * H))
            y = self._card(im, draw, ad["img"], round(top + (room - card_h) / 2), H,
                           frac=0.56, max_h=card_h) + round(0.040 * H)
        else:
            y = top
        y = draw_lines(draw, lines, fnt, lh, round(y), txt, acc)
        y += round(0.038 * H)
        for bl in bullets:
            cx = margin + round(0.014 * W)
            cy = y + b_lh * 0.30
            r = round(0.011 * W)
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=acc)
            draw.text((bull_x, y), bl, font=bf, fill=txt)
            y += b_lh
        self.cta_block(im, draw, H, cta_top, ad, light=light)
        return im

    # ------------------------------------------------------------------ main
    def render(self, ad: dict, out: Path) -> None:
        fn = {"hook": self._hook, "split": self._split,
              "pasos": self._pasos, "oferta": self._oferta}[ad.get("layout", "hook")]
        out.mkdir(parents=True, exist_ok=True)
        for key, H in FORMATS.items():
            fn(ad, H).save(out / f"{ad['id']}_{key}.jpg", quality=93)
        print(f"  ok {ad['id']} ({ad.get('layout','hook')})")


def main() -> None:
    brand_f = sys.argv[1] if len(sys.argv) > 1 else None
    file_f = sys.argv[2] if len(sys.argv) > 2 else None
    ids = set(sys.argv[3].split(",")) if len(sys.argv) > 3 else None
    total = 0
    for bdir in sorted(BRANDS.iterdir()):
        if not (bdir / "brand.json").exists() or (brand_f and bdir.name != brand_f):
            continue
        adir = bdir / "ads"
        if not adir.is_dir():
            continue
        r = AdRenderer(bdir)
        for f in sorted(adir.glob("*.json")):
            if file_f and not f.stem.startswith(file_f):
                continue
            data = json.loads(f.read_text(encoding="utf-8"))
            print(f"{bdir.name}/{f.stem}:")
            for ad in data["ads"]:
                if ids and ad["id"] not in ids:
                    continue
                r.render(ad, adir / "out" / f.stem)
                total += 1
    print(f"TOTAL: {total} anuncios x {len(FORMATS)} cortes")


if __name__ == "__main__":
    main()

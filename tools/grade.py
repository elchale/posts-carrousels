"""Grade the raw GPT plates onto each brand's palette.

Input : brands/<b>/plates/*.png        (1024x1536-ish, palette drift)
Output: brands/<b>/plates_graded/*.png (1080x1920 masters, on-palette,
        scrims baked on cine plates, accents drawn, mirrored variants added)

Deterministic; safe to re-run (full overwrite of plates_graded).
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1] / "brands"
W, H = 1080, 1920


def hex2rgb(s: str) -> np.ndarray:
    return np.array([int(s[i : i + 2], 16) for i in (1, 3, 5)], dtype=np.float32)


def load_master(p: Path) -> np.ndarray:
    """Resize to height 1920, center-crop width to 1080. Float 0..1."""
    im = Image.open(p).convert("RGB")
    w, h = im.size
    nw = max(W, round(w * H / h))
    im = im.resize((nw, H), Image.LANCZOS)
    x0 = (nw - W) // 2
    im = im.crop((x0, 0, x0 + W, H))
    return np.asarray(im, dtype=np.float32) / 255.0


def lum(a: np.ndarray) -> np.ndarray:
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def wb_to(a: np.ndarray, white: str, p: float = 97.0, strength: float = 1.0) -> np.ndarray:
    """Scale channels so the p-th percentile hits `white`."""
    tw = hex2rgb(white) / 255.0
    cur = np.percentile(a.reshape(-1, 3), p, axis=0)
    gain = tw / np.maximum(cur, 1e-4)
    gain = 1.0 + (gain - 1.0) * strength
    return np.clip(a * gain, 0, 1)


def splittone(a: np.ndarray, shadow: str, highlight: str, strength: float) -> np.ndarray:
    """Photographic tint: shadows toward `shadow`, highlights toward `highlight`."""
    sh, hi = hex2rgb(shadow) / 255.0, hex2rgb(highlight) / 255.0
    t = np.clip(lum(a), 0, 1)[..., None]
    tone = sh * (1 - t) + hi * t
    return np.clip(a * (1 - strength) + tone * strength * (0.25 + 0.75 * a), 0, 1)


def duotone(a: np.ndarray, dark: str, light: str, keep: float) -> np.ndarray:
    """Map luminance onto a dark→light ramp; `keep` retains original color."""
    d, l = hex2rgb(dark) / 255.0, hex2rgb(light) / 255.0
    t = np.clip(lum(a), 0, 1)[..., None]
    ramp = d * (1 - t) + l * t
    return np.clip(ramp * (1 - keep) + a * keep, 0, 1)


def desat(a: np.ndarray, amount: float) -> np.ndarray:
    g = lum(a)[..., None]
    return np.clip(a * (1 - amount) + g * amount, 0, 1)


def exposure(a: np.ndarray, gain: float = 1.0, gamma: float = 1.0) -> np.ndarray:
    return np.clip((a * gain) ** gamma, 0, 1)


def scrim(a: np.ndarray, start: float, alpha: float) -> np.ndarray:
    """Black gradient: 0 above `start` (fraction of height), ramping to `alpha` at bottom."""
    y = np.linspace(0, 1, a.shape[0])[:, None, None]
    t = np.clip((y - start) / max(1e-4, 1 - start), 0, 1)
    return a * (1 - alpha * (t**1.3))


def top_scrim(a: np.ndarray, end: float, alpha: float) -> np.ndarray:
    y = np.linspace(0, 1, a.shape[0])[:, None, None]
    t = np.clip((end - y) / max(1e-4, end), 0, 1)
    return a * (1 - alpha * (t**1.5))


def add_glow(a: np.ndarray, color: str, cx: float, cy: float, r: float, strength: float) -> np.ndarray:
    """Additive soft radial glow (screen-ish)."""
    c = hex2rgb(color) / 255.0
    yy, xx = np.mgrid[0 : a.shape[0], 0 : a.shape[1]].astype(np.float32)
    d = np.sqrt(((xx / W - cx) ** 2) + ((yy / H - cy) ** 2)) / r
    g = np.exp(-(d**2))[..., None] * strength
    return np.clip(1 - (1 - a) * (1 - c * g), 0, 1)


def draw_diag(a: np.ndarray, color: str, width: int = 5, blur: int = 3) -> np.ndarray:
    """One thin diagonal accent line (Qolca covers)."""
    im = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(im)
    d.line([(-50, int(H * 0.78)), (W + 50, int(H * 0.30))], fill=255, width=width)
    m = np.asarray(im.filter(ImageFilter.GaussianBlur(blur)), dtype=np.float32)[..., None] / 255.0
    c = hex2rgb(color) / 255.0
    return np.clip(a * (1 - m * 0.9) + c * m * 0.9, 0, 1)


def save(a: np.ndarray, p: Path) -> None:
    Image.fromarray((a * 255).round().astype(np.uint8)).save(p, optimize=True)


# ---------------------------------------------------------------- brand recipes

# Palettes scraped from the live sites (2026-07-28):
#   comehometag.com : violet #6a4cff · pink #ec6aa6 · blue #4776f8 · navy ink
#                     #0e1a30 · lavender lights #ece8ff/#f9fbff · amber #ffb84d
#   qolca.org       : deep navy #0d162f/#1a2444 · jade #00a86b/#14c47d ·
#                     warm cream #f6f5f0/#efede5 · slate #5d6985/#8a94ae
#   propaga.pe      : crimson #be001a · orange #ff7300/#c2410c · gold #ffc266/
#                     #b88700 · warm stone #faf9f8/#57534e · dark #2d1a1a

CHT = dict(
    # violet→pink light gradient covers, lavender paper, navy-violet darks
    cover=lambda a: duotone(a, "#b9a8f0", "#f5f3ff", keep=0.15),
    cta=lambda a: add_glow(duotone(a, "#d8c8f4", "#fbf9ff", keep=0.12), "#ecd2f8", 0.5, 0.55, 0.5, 0.30),
    emph=lambda a: duotone(a, "#131829", "#7c5cf6", keep=0.20),
    value_paper=lambda a: duotone(a, "#dcd8f2", "#f9f8ff", keep=0.10),
    value_sage=lambda a: duotone(a, "#e8c8dc", "#fdf4f9", keep=0.10),
    cine=lambda a: scrim(top_scrim(splittone(a, "#16123a", "#d8a0b8", 0.30), 0.18, 0.35), 0.42, 0.74),
)

QOL = dict(
    cover=lambda a: draw_diag(splittone(exposure(a, 1.0, 1.02), "#0d162f", "#2a3a5c", 0.55), "#5aa7ff"),
    cta=lambda a: add_glow(splittone(a, "#0d162f", "#243354", 0.55), "#5aa7ff", 0.5, 1.0, 0.55, 0.32),
    emph=lambda a: splittone(exposure(a, 1.15, 1.0), "#0a1226", "#2c3f66", 0.50),
    value_paper=lambda a: duotone(a, "#ccd8ec", "#f3f7fd", keep=0.10),
    value_slate=lambda a: splittone(a, "#111c38", "#3c4a6a", 0.50),
    cine=lambda a: scrim(top_scrim(splittone(desat(a, 0.12), "#0a1226", "#a8c4e8", 0.30), 0.18, 0.35), 0.42, 0.74),
)

PRO = dict(
    cover=lambda a: duotone(a, "#ffb36b", "#fdf6ee", keep=0.15),
    cta=lambda a: add_glow(duotone(a, "#ffc890", "#fdf8f0", keep=0.12), "#ffb04d", 0.5, 0.85, 0.55, 0.32),
    emph=lambda a: duotone(a, "#f0b8a8", "#fdf3ec", keep=0.12),
    value_blanco=lambda a: duotone(a, "#e8ddd2", "#fcfaf7", keep=0.10),
    value_menta=lambda a: duotone(a, "#f2d2b4", "#fdf8ef", keep=0.10),
    # bold warm grade: maroon shadows, orange highlights (brand red-orange)
    cine=lambda a: scrim(top_scrim(splittone(exposure(a, 1.15, 0.94), "#2d1a1a", "#ff9550", 0.32), 0.15, 0.30), 0.45, 0.68),
)

RAD = dict(
    # radarestatal.pe (2026-08-02): el logo es la paleta — solo azul/celeste.
    # paper #F6F9FC, ink #0C2440, radar #2E7BE0, sky #CFE3FA, mist #EAF2FD.
    # Marca LIGHT: portadas claras con "ping" celeste; emph = azul tinta oscuro.
    # keep=0.30 en cover: los anillos/retícula de radar SON la marca — a 0.10
    # el duotono los borraba (visto 2026-08-03 en las plates propias).
    cover=lambda a: add_glow(duotone(a, "#cfe3fa", "#f6f9fc", keep=0.30), "#9cc4f2", 0.5, 0.42, 0.55, 0.25),
    cta=lambda a: add_glow(duotone(a, "#cfe3fa", "#f8fafd", keep=0.10), "#7fb4f5", 0.5, 0.80, 0.50, 0.30),
    emph=lambda a: duotone(a, "#0c2440", "#2e7be0", keep=0.18),
    value_paper=lambda a: duotone(a, "#d9e5f2", "#f9fbfe", keep=0.10),
    value_slate=lambda a: duotone(a, "#bfd9f6", "#eaf2fd", keep=0.10),
    # plates propias 2026-08-03: mist = workhorse claro, sky = alt celeste
    value_mist=lambda a: duotone(a, "#d9e5f2", "#f9fbfe", keep=0.10),
    value_sky=lambda a: duotone(a, "#bfd9f6", "#eaf2fd", keep=0.10),
    cine=lambda a: scrim(top_scrim(splittone(desat(a, 0.10), "#081a33", "#8fbcec", 0.30), 0.18, 0.35), 0.42, 0.74),
)

RECIPES = {"comehometag": CHT, "qolca": QOL, "propaga": PRO, "radarestatal": RAD}

# families that get mirrored variants to fill inventory (all abstracts)
MIRROR_FAMILIES = ("cover", "cta", "emph", "value")


def family_of(name: str) -> str:
    if name.startswith("cine"):
        return "cine"
    for fam in ("cover", "cta", "emph", "value-paper", "value-sage",
                "value-slate", "value-blanco", "value-menta",
                "value-mist", "value-sky"):
        if name.startswith(fam):
            return fam.replace("-", "_")
    raise ValueError(name)


def main() -> None:
    for brand, recipes in RECIPES.items():
        src = ROOT / brand / "plates"
        dst = ROOT / brand / "plates_graded"
        dst.mkdir(exist_ok=True)
        for old in dst.glob("*.png"):
            old.unlink()
        n = 0
        for f in sorted(src.glob("*.png")):
            fam = family_of(f.stem)
            fn = recipes[fam]
            a = fn(load_master(f))
            save(a, dst / f.name)
            n += 1
            if not f.stem.startswith("cine"):
                # mirrored + slightly re-exposed variant doubles the inventory
                v = exposure(a[:, ::-1], 0.985, 1.01)
                save(v, dst / f"{f.stem}-m.png")
                n += 1
        print(f"{brand}: {n} graded plates")


if __name__ == "__main__":
    main()

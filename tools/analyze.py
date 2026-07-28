"""Palette analysis of the generated plates.

Reports, per image: size, mean luminance, luminance of the center core (where
text goes), and the 4 dominant colors (k-means in RGB) with shares — so we can
see how far each plate drifted from its brand palette.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "brands"


def dominant(px: np.ndarray, k: int = 4, iters: int = 12) -> list[tuple[str, float]]:
    """Tiny k-means, deterministic seed."""
    rng = np.random.default_rng(7)
    pts = px[rng.choice(len(px), min(4000, len(px)), replace=False)].astype(np.float32)
    centers = pts[rng.choice(len(pts), k, replace=False)]
    for _ in range(iters):
        d = ((pts[:, None, :] - centers[None]) ** 2).sum(-1)
        lab = d.argmin(1)
        for i in range(k):
            sel = pts[lab == i]
            if len(sel):
                centers[i] = sel.mean(0)
    d = ((pts[:, None, :] - centers[None]) ** 2).sum(-1)
    lab = d.argmin(1)
    out = []
    for i in np.argsort(-np.bincount(lab, minlength=k)):
        share = (lab == i).mean()
        r, g, b = centers[i].round().astype(int)
        out.append((f"#{r:02x}{g:02x}{b:02x}", round(float(share), 2)))
    return out


def analyze(p: Path) -> dict:
    im = Image.open(p).convert("RGB")
    w, h = im.size
    small = im.resize((96, int(96 * h / w)))
    a = np.asarray(small, dtype=np.float32)
    lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]) / 255
    # center core ~ the middle square where text lives
    ch, cw = lum.shape[0] // 2, lum.shape[1] // 2
    r = lum.shape[1] // 3
    core = lum[ch - r : ch + r, cw - r : cw + r]
    return {
        "size": f"{w}x{h}",
        "lum": round(float(lum.mean()), 2),
        "core_lum": round(float(core.mean()), 2),
        "core_std": round(float(core.std()), 2),
        "dom": dominant(a.reshape(-1, 3)),
    }


def main() -> None:
    report = {}
    for brand_dir in sorted(ROOT.iterdir()):
        plates = brand_dir / "plates"
        if not plates.is_dir():
            continue
        report[brand_dir.name] = {
            f.name: analyze(f) for f in sorted(plates.glob("*.png"))
        }
    json.dump(report, sys.stdout, indent=1)


if __name__ == "__main__":
    main()

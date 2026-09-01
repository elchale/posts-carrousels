"""Contact sheets of photos/raw candidates for visual curation."""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT.parents[0] / "shared" / "fonts"
COLS, TH_W, TH_H, LABEL = 5, 300, 380, 34

def sheet(brand: str):
    raw = ROOT / "brands" / brand / "photos" / "raw"
    files = sorted(raw.glob("*.jpg"))
    if not files:
        print(f"{brand}: no photos"); return
    fnt = ImageFont.truetype(str(FONTS / "Inter-Bold.ttf"), 22)
    per = COLS * 6
    for si in range(0, len(files), per):
        batch = files[si:si+per]
        rows = (len(batch) + COLS - 1) // COLS
        im = Image.new("RGB", (COLS*TH_W, rows*(TH_H+LABEL)), "#181818")
        d = ImageDraw.Draw(im)
        for i, f in enumerate(batch):
            try:
                t = Image.open(f).convert("RGB")
            except Exception:
                continue
            t.thumbnail((TH_W-8, TH_H-8))
            x, y = (i % COLS)*TH_W, (i // COLS)*(TH_H+LABEL)
            im.paste(t, (x+4+(TH_W-8-t.width)//2, y+4+(TH_H-8-t.height)//2))
            d.text((x+8, y+TH_H+4), f.stem, font=fnt, fill="#ffffff")
        out = raw.parent / f"_sheet-{si//per+1:02d}.jpg"
        im.save(out, quality=80)
        print(out)

for b in (sys.argv[1:] or ["comehometag","qolca","propaga","radarestatal","diplomy"]):
    sheet(b)

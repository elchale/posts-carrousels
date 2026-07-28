"""Generate captions.md per post + README.md per brand (GitHub-friendly).

Replaces the old .docx flow. Markdown code-fences render on GitHub (web and
mobile app) with a one-tap COPY button — ideal for posting from the phone.

Caption best practices applied (research 2026-07-28):
  IG: hook line first (125 visible chars), blank lines between blocks,
      3-5 niche hashtags on their own line.
  TikTok: keyword front-loaded, generic tags (#parati/#fyp/#viral) stripped.
  Facebook: conversational, question-led, hashtags removed.

Writes: brands/<b>/out/<series>/<slug>/captions.md
        brands/<b>/README.md   (upload guide, per brand)
Deletes any legacy captions.docx / GUIA-DE-SUBIDA.docx it finds.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "brands"

GENERIC_TAGS = {"parati", "fyp", "foryou", "foryoupage", "viral", "xyzbca"}

BRAND_NAMES = {"comehometag": "ComeHomeTag", "qolca": "Qolca", "propaga": "Propaga"}


def split_hashtags(text: str) -> tuple[str, list[str]]:
    tags = re.findall(r"#[\wáéíóúñÁÉÍÓÚÑ]+", text)
    body = re.sub(r"\s*#[\wáéíóúñÁÉÍÓÚÑ]+", "", text).strip()
    return body, tags


def fmt_ig(caption: str) -> str:
    body, tags = split_hashtags(caption)
    m = re.match(r"(.+?[.!?…])\s+(.*)", body, re.S)
    hook, rest = (m.group(1), m.group(2)) if m else (body, "")
    parts = [hook]
    if rest:
        parts.append(rest)
    if tags:
        parts.append(" ".join(tags[:5]))
    return "\n\n".join(parts)


def fmt_tt(caption: str) -> str:
    body, tags = split_hashtags(caption)
    tags = [t for t in tags if t.lstrip("#").lower() not in GENERIC_TAGS][:5]
    return body + ("\n" + " ".join(tags) if tags else "")


def fmt_fb(caption: str) -> str:
    body, _ = split_hashtags(caption)
    return body


def fence(text: str) -> str:
    return "```text\n" + text + "\n```"


def post_md(brand: str, series: str, post: dict, out: Path) -> None:
    cap = post.get("caption", {})
    title = post["slides"][0].get("h", post["slug"])
    n = len(post["slides"])
    lines = [
        f"# {title}",
        "",
        f"`{brand}` · `{series}` · **{n} láminas** — sube SIEMPRE en orden 01 → {n:02d}",
        "",
    ]
    if cap.get("tt"):
        lines += [
            "## 🎵 TikTok",
            f"Fotos de `tt/` (9:16) · **⚠ AGREGA UN SONIDO EN TENDENCIA** (sin sonido no hay alcance) · copia:",
            "",
            fence(fmt_tt(cap["tt"])),
            "",
        ]
    if cap.get("ig"):
        lines += [
            "## 📸 Instagram",
            f"Fotos de `ig/` (4:5) · copia el caption:",
            "",
            fence(fmt_ig(cap["ig"])),
            "",
        ]
        if post.get("alt"):
            lines += [
                "**ALT** (Opciones avanzadas → Texto alternativo, lámina 1 — ayuda al SEO):",
                "",
                fence(post["alt"]),
                "",
            ]
    if cap.get("fb"):
        lines += [
            "## 👥 Facebook",
            "Las mismas fotos de `ig/` · SIN hashtags (en FB no ayudan) · copia:",
            "",
            fence(fmt_fb(cap["fb"])),
            "",
        ]
    if (out / "li.pdf").exists():
        lines += [
            "## 💼 LinkedIn",
            "Sube `li.pdf` como **documento** (no como imágenes) en el perfil personal.",
            "Caption: usa el de Facebook, o el de Instagram sin hashtags.",
            "",
        ]
    (out / "captions.md").write_text("\n".join(lines), encoding="utf-8")


GUIDE = """# GUÍA DE SUBIDA — {name}

Cada post vive en `out/<serie>/<post>/` y contiene:

| Qué | Para qué |
|---|---|
| `ig/01..08.jpg` | Instagram y Facebook (4:5) |
| `tt/01..08.jpg` | TikTok, publicación de fotos (9:16) |
| `captions.md` | Los textos listos — cada uno en un bloque con botón COPIAR |
{pdf_row}
## Reglas rápidas

1. **Orden siempre**: 01, 02, 03... La lámina 01 es la portada.
2. **Instagram**: el caption ya trae el gancho en la primera línea y 3-5
   hashtags al final. Pega tal cual. Si puedes, agrega el ALT a la lámina 1.
3. **TikTok**: agrega un **sonido en tendencia** ANTES de publicar — el audio
   es parte de la distribución incluso en fotos. Sin sonido no hay alcance.
4. **Facebook**: caption propio (conversacional, con pregunta), SIN hashtags.
5. **Después de publicar**: quédate 30 minutos respondiendo comentarios y
   mensajes. La primera hora decide la distribución.
6. **Cadencia**: 1 carrusel al día. Constancia > volumen.
7. **Cada primer lunes**: revisa envíos y guardados por post. Lo que vuela se
   repite; lo que no, se corta.
"""


def main() -> None:
    total = 0
    for bdir in sorted(ROOT.iterdir()):
        posts_dir = bdir / "posts"
        if not posts_dir.is_dir():
            continue
        # clean legacy docx
        for old in list(bdir.rglob("*.docx")):
            old.unlink()
        pdf_row = "| `li.pdf` | LinkedIn (documento) |\n" if bdir.name == "qolca" else ""
        (bdir / "README.md").write_text(
            GUIDE.format(name=BRAND_NAMES.get(bdir.name, bdir.name), pdf_row=pdf_row),
            encoding="utf-8",
        )
        for sf in sorted(posts_dir.glob("*.json")):
            data = json.loads(sf.read_text(encoding="utf-8"))
            for post in data["posts"]:
                out = bdir / "out" / sf.stem / post["slug"]
                if out.is_dir():
                    post_md(bdir.name, sf.stem, post, out)
                    total += 1
        print(f"{bdir.name}: README + captions.md OK")
    print(f"TOTAL: {total} captions.md")


if __name__ == "__main__":
    main()

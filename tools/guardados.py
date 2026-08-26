"""Score every post on the SHAPE that gets a carousel saved. See GUARDADOS.md.

This measures form, not outcome: it cannot know what will perform. What it can
do is check each post against the six traits that the one post people actually
saved ("Haz esto antes de salir con tus hijos") has and most of the library
doesn't — a named recurring moment, a counted cost, an imperative, a counted
list, a one-slide artifact to keep, and a handoff to a named third person.

Usage:
  python guardados.py            # all brands -> stdout + ORDEN.md
  python guardados.py comehometag
"""
from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BRANDS = ROOT / "brands"


def flat(text: str) -> str:
    """lowercase, unaccented — so one pattern matches 'señales' and 'senales'."""
    n = unicodedata.normalize("NFD", text.lower())
    return "".join(c for c in n if unicodedata.category(c) != "Mn")


# Each trait: (label, weight, pattern). Patterns run over the flattened cover
# (headline + subline) unless noted in score().
TRAITS = [
    # A moment the reader will live again, and knows when. You only park
    # something in Guardados if you can picture the day you'll need it.
    ("rutina", 2, r"antes de|al (entrar|salir|subir|bajar|llegar|viajar)|cada (salida|manana|dia|vez|noche)"
                  r"|este (domingo|sabado|fin de semana)|proxim|en (la playa|el mall|el centro comercial|el estadio"
                  r"|el mercado|el aeropuerto|la feria|el parque|el bus|el micro|el concierto|el centro|la procesion)"
                  r"|verano|diciembre|navidad|enero|febrero|marzo|agosto|septiembre|octubre|noviembre|julio"
                  r"|campana|viaj|primer dia de clases|dia del nino|black friday|san valentin|fiestas patrias"),
    # Counted and timeboxed: the reader knows exactly what they are keeping and
    # what it will cost them to use it.
    ("costo", 2, r"\b\d+\s*(segundos|minutos|min|horas|semanas|dias)\b|\bde \d+ (segundos|minutos)\b"),
    # An order, not a topic. "Haz esto" beats "lo que pasa cuando".
    ("imperativo", 1, r"\b(haz|hazlo|hazla|guarda|guardalo|ensena|ensenale|prepara|elige|elijan|revisa|pon|ponle"
                      r"|dile|dilo|fotografia|arma|juega|juegalo|comparte|compartelo|manda|envia|envialo|imprime"
                      r"|memoriza|anota|escribe|busca|avisa|activa|define|ensayen|ensayalo|copia|prueba|no bordes"
                      r"|no borres|no copies|deja de)\b"),
    # A counted set is a promise about size — the reader can tell it will fit in
    # their head next Saturday.
    ("lista", 1, r"\b\d+\s+(pasos|reglas|costumbres|senales|frases|acuerdos|defensas|preguntas|ideas|formas"
                 r"|errores|mitos|mentiras|razones|regalos|conversaciones|habitos|cosas|tipos|formulas"
                 r"|plantillas|ganchos|fechas|numeros|fuentes|verdades|puntos|causas|huecos|posts)\b"),
]

# The disaster already happening. These get read, not kept — a save means
# planning to re-open it, and nobody plans to re-open the worst day of their
# life. Not a defect (they're the reach posts); it just isn't a save shape.
EMERGENCIA = (r"se perdio|se pierde|salio solo|se extravio|extraviad|desaparec|encontraste"
              r"|quedo abajo|no reconocio|ya no estaba|se escapo|faltaba una")
PREVENCION = r"antes|prepara|plan|ensay|rutina|previen|costumbre|hoy|habito"


def score(post: dict) -> tuple[int, list[str], list[str]]:
    cover = post["slides"][0]
    head = flat(f"{cover.get('h','')} {cover.get('b','')}")
    last = post["slides"][-1]
    tail = flat(f"{last.get('h','')} {last.get('b','')}")
    caps = flat(" ".join(post.get("caption", {}).values()))

    pts, hit, flags = 0, [], []
    for label, w, pat in TRAITS:
        if re.search(pat, head):
            pts += w
            hit.append(label)

    # The artifact: one slide that holds the whole list, so the saved post is
    # usable without swiping it again.
    if any(s["role"] == "recap" for s in post["slides"]):
        pts += 2
        hit.append("recap")
    else:
        # Only count slides that hold ONE step. A slide whose body is itself a
        # list ("1 … · 2 … · 3 …", the Propaga swipe files) can't be folded into
        # a one-line item, and two steps aren't a checklist — the myth/argument
        # posts (CHT s5) live there on purpose. Three atomic steps is where a
        # keepable list starts.
        steps = [s for s in post["slides"]
                 if s["role"] in ("value", "paper") and s.get("h") and not s.get("img") and not s.get("shot")
                 and len(s.get("b", "")) < 180 and " · " not in s.get("b", "")
                 and not re.search(r"\d\)", s.get("b", ""))]
        if len(steps) >= 3:
            flags.append("sin recap (hay %d pasos que caben en una lamina)" % len(steps))

    # A save is often just the parking spot before a send. Naming who it's for
    # ("los abuelos", "la niñera", "tus hermanos") converts one into the other.
    if re.search(r"abuelos|ninera|hermanos|grupo familiar|cuidador|al grupo|tu jefe|socio|amigo|mama que|papa ", tail):
        pts += 1
        hit.append("handoff")

    if re.search(r"guarda|guardalo|guardala|guardate", tail + " " + caps):
        pts += 1
        hit.append("pide guardar")
    else:
        flags.append("no pide guardar")

    if re.search(EMERGENCIA, head) and not re.search(PREVENCION, head):
        pts -= 1
        flags.append("portada de emergencia, sin ancla de prevencion")
    return pts, hit, flags


def main() -> None:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    md = ["# Orden de publicación por forma-de-guardado",
          "",
          "Generado por `tools/guardados.py` — mide la FORMA de cada post contra los",
          "seis rasgos de `GUARDADOS.md`, no su rendimiento. Publica de arriba hacia",
          "abajo: los de más puntaje son los que le dan al lector algo que querrá",
          "volver a abrir. Los de abajo siguen sirviendo (alcance, comentarios,",
          "envíos), solo no son posts de guardado.", ""]
    for bdir in sorted(BRANDS.iterdir()):
        if not (bdir / "brand.json").exists() or (only and bdir.name != only):
            continue
        rows = []
        for sfile in sorted((bdir / "posts").glob("*.json")):
            data = json.loads(sfile.read_text(encoding="utf-8"))
            for post in data["posts"]:
                pts, hit, flags = score(post)
                rows.append((pts, sfile.stem, post["slug"], post["slides"][0].get("h", ""), hit, flags))
        rows.sort(key=lambda r: (-r[0], r[1], r[2]))
        print(f"\n=== {bdir.name}  ({len(rows)} posts, media {sum(r[0] for r in rows)/len(rows):.1f})")
        md += [f"## {bdir.name}", "", "| pts | serie | post | portada | rasgos | pendientes |",
               "|---:|---|---|---|---|---|"]
        for pts, series, slug, head, hit, flags in rows:
            # stdout stays ASCII: the Windows console here is cp1252.
            print(f"{pts:3}  {series[:2]} {slug:28} {' '.join(hit)}"
                  + (f"   [{'; '.join(flags)}]" if flags else ""))
            md.append(f"| {pts} | {series[:2]} | `{slug}` | {head} | {' · '.join(hit)} | {'; '.join(flags)} |")
        md.append("")
    (ROOT / "ORDEN.md").write_text("\n".join(md), encoding="utf-8")
    print(f"\n-> {ROOT / 'ORDEN.md'}")


if __name__ == "__main__":
    main()

"""Fetch CC0/public-domain photo candidates for the F1 slide system.

Openverse API (keyless) filtered to license cc0+pdm so no attribution is owed.
Downloads land in brands/<b>/photos/raw/<cat>-NN.jpg with a manifest
(photos/raw/manifest.json) recording source URL + license per file, so the
"cero falacias" rule extends to image provenance.

Only candidates: curation (pick + rename into photos/) happens by eye.
Filters: height >= 880, not ultra-wide (w/h <= 1.9) so a 9:16 full-bleed crop
survives.

Usage: python tools/photos_fetch.py [brand]
"""
from __future__ import annotations

import io
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UA = {"User-Agent": "Mozilla/5.0 (carousel-photo-curation; contact: repo owner)"}

# (category, query, n_candidates)
QUERIES: dict[str, list[tuple[str, str, int]]] = {
    "comehometag": [
        ("perro-calle", "stray dog street", 6),
        ("perro-collar", "dog collar closeup", 6),
        ("perro-parque", "dog running park", 6),
        ("perro-cara", "dog face portrait", 6),
        ("cachorro", "puppy portrait", 5),
        ("gato", "cat portrait home", 5),
        ("nino-mano", "child holding hand parent", 6),
        ("nino-mochila", "child backpack school", 5),
        ("abuelo", "elderly man walking street", 6),
        ("abuela", "grandmother portrait", 5),
        ("familia-parque", "family walking park evening", 5),
        ("mercado", "street market latin america", 5),
        ("noche-calle", "empty street night lamp", 5),
        ("correa", "dog leash walk sidewalk", 5),
    ],
    "qolca": [
        ("autos-lote", "car dealership lot", 6),
        ("autos-llaves", "car keys hand", 5),
        ("boda-mesas", "wedding reception tables", 6),
        ("boda-prep", "wedding preparation", 5),
        ("inmobiliaria", "apartment building facade", 5),
        ("llaves-casa", "house keys door", 5),
        ("mostrador", "small shop counter owner", 6),
        ("celular-noche", "phone screen dark night", 5),
        ("papeles", "paperwork desk stack", 5),
        ("cuaderno", "handwritten notebook ledger", 5),
        ("tienda-cerrada", "closed shop shutter night", 5),
        ("restaurante-cocina", "restaurant kitchen busy", 5),
    ],
    "propaga": [
        ("dueno-tienda", "small business owner shop", 6),
        ("celular-cafe", "person phone cafe", 6),
        ("laptop-mesa", "laptop desk work", 5),
        ("vendedor", "street food vendor", 5),
        ("letrero-abierto", "open sign shop door", 5),
        ("foto-producto", "product photography setup", 5),
        ("panaderia", "bakery display bread", 5),
        ("manos-celular", "hands typing smartphone", 5),
        ("calendario", "calendar planner desk", 5),
    ],
    "radarestatal": [
        ("obra", "construction site workers", 6),
        ("edificio-gob", "government building lima peru", 6),
        ("documentos", "documents stack office", 5),
        ("almacen", "warehouse forklift boxes", 5),
        ("camiones", "trucks logistics fleet", 5),
        ("archivo", "file archive folders", 5),
        ("casco", "safety helmet construction", 5),
        ("carretera", "road construction machinery", 5),
        ("oficina-reunion", "office meeting table", 5),
        ("lima", "lima peru plaza", 6),
    ],
    "cheapfix": [
        ("cocina-fregadero", "kitchen sink drain", 6),
        ("cocina-desorden", "kitchen counter", 6),
        ("ducha", "shower bathroom tile", 5),
        ("bano", "bathroom sink counter", 5),
        ("cables", "cables", 5),
        ("escritorio", "home desk setup", 5),
        ("auto-interior", "car interior seats", 6),
        ("dormitorio", "bedroom nightstand lamp", 5),
        ("armario", "closet clothes hangers", 5),
        ("despensa", "pantry", 5),
        ("sofa", "living room sofa", 5),
        ("lavanderia", "laundry room washing machine", 5),
        ("entrada", "front door", 5),
        ("cajon", "kitchen drawer", 5),
        ("mascota-sofa", "dog on couch home", 5),
        ("ventana", "window blinds", 5),
    ],
    "servicestack": [
        ("plomero", "plumber working pipes", 6),
        ("electricista", "electrician working wires", 6),
        ("jardinero", "landscaper lawn mower yard", 5),
        ("contratista", "contractor construction house", 6),
        ("camioneta", "pickup truck", 5),
        ("telefono", "smartphone hand", 6),
        ("laptop-noche", "laptop desk night", 5),
        ("oficina-casa", "home office desk work", 5),
        ("papeleo", "paperwork", 5),
        ("herramientas", "tool belt hand tools", 5),
        ("limpieza", "cleaning service home", 5),
        ("pintor", "house painter", 5),
        ("hvac", "air conditioner", 5),
        ("calendario", "calendar schedule planner", 5),
        ("cliente-puerta", "handshake", 5),
    ],
    "diplomy": [
        ("graduacion", "graduation cap ceremony", 6),
        ("aula", "students classroom", 6),
        ("laptop-curso", "online course laptop home", 5),
        ("estudiando", "studying notes coffee", 5),
        ("auditorio", "lecture hall audience", 5),
        ("profesor", "teacher whiteboard class", 5),
        ("diploma", "diploma certificate hands", 5),
        ("biblioteca", "library study", 5),
    ],
}


def search(query: str, n: int) -> list[dict]:
    params = urllib.parse.urlencode({
        "q": query,
        "license": "cc0,pdm",
        "size": "large",
        "page_size": 20,
    })
    req = urllib.request.Request(
        f"https://api.openverse.org/v1/images/?{params}", headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    out = []
    for res in data.get("results", []):
        w, h = res.get("width") or 0, res.get("height") or 0
        if h < 880 or (w and h and w / h > 1.9):
            continue
        out.append(res)
        if len(out) >= n:
            break
    return out


def fetch(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=45) as r:
            blob = r.read()
        if len(blob) < 25_000:  # placeholder / error page
            return False
        dest.write_bytes(blob)
        return True
    except Exception:
        return False


def main() -> None:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for brand, queries in QUERIES.items():
        if only and brand != only:
            continue
        raw = ROOT / "brands" / brand / "photos" / "raw"
        raw.mkdir(parents=True, exist_ok=True)
        manifest_p = raw / "manifest.json"
        manifest = json.loads(manifest_p.read_text()) if manifest_p.exists() else {}
        got_total = 0
        for cat, q, n in queries:
            if any(k.startswith(cat + "-") for k in manifest):
                continue  # category already fetched
            try:
                results = search(q, n)
            except Exception as e:
                print(f"{brand}/{cat}: search FAILED {e}")
                time.sleep(3)
                continue
            got = 0
            for res in results:
                url = res.get("url") or ""
                name = f"{cat}-{got + 1:02d}.jpg"
                if fetch(url, raw / name):
                    manifest[name] = {
                        "source": res.get("foreign_landing_url") or url,
                        "license": res.get("license"),
                        "provider": res.get("provider"),
                        "w": res.get("width"), "h": res.get("height"),
                        "query": q,
                    }
                    got += 1
                if got >= n:
                    break
            got_total += got
            print(f"{brand}/{cat}: {got}")
            manifest_p.write_text(json.dumps(manifest, indent=1))
            time.sleep(1.2)  # be polite to the API
        print(f"== {brand}: {got_total} new candidates")


if __name__ == "__main__":
    main()

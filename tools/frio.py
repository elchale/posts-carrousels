# -*- coding: utf-8 -*-
"""Lint de audiencia fria: laminas que dan por sabido de que hablamos.

Uso:  python tools/frio.py        (desde carousels/)
Salida: conteo por marca + tools/_frio.json con cada lamina marcada.

Heuristica: un SUSTANTIVO DE PRODUCTO/TEMA con articulo desnudo (the/a/el/la/
los/las) y sin ningun ANCLA en la misma lamina (posesivo, actor, o el ambito
del tema). Si nadie dijo de que va esto, "the certificate" no significa nada
para quien acaba de aterrizar en el post.
"""
import json, re, sys
from pathlib import Path
from collections import defaultdict

NOUNS = {
 'diplomy': r'certificate|badge|credential|link|page|criteria|batch|intake|profile',
 'comehometag': r'pulsera|llavero|placa|QR|c[oó]digo|tag|chip',
 'qolca': r'automatizaci[oó]n|bot|agente|sistema|flujo|herramienta|IA',
 'propaga': r'app|herramienta|calendario|programaci[oó]n|publicaci[oó]n|contenido',
 'radarestatal': r'radar|proceso|feed|ficha|alerta|plataforma|app|sistema',
}
ART = {
 'diplomy': r'\b(the|a|an)\s+',
 'default': r'\b(el|la|los|las|un|una|unos|unas)\s+',
}
ANCHOR = {
 'diplomy': r'\b(your|you|student|students|school|academy|course|graduate|graduates|issue|issuing|attendee|training|we)\b',
 'default': r'\b(tu|tus|su|sus|mi|mis|tuyo|tuya|de tu|tienda|negocio|cliente|clientes|hijo|hija|ni[nñ]o|abuelo|mascota|empresa|MYPE|Estado|SEACE|alumno)\b',
}

def scan(brand, path):
    d = json.loads(Path(path).read_text(encoding='utf-8'))
    noun = NOUNS[brand]
    art = ART.get(brand, ART['default'])
    anchor = ANCHOR.get(brand, ANCHOR['default'])
    hits = []
    for post in d['posts']:
        for i, s in enumerate(post['slides']):
            if s.get('role') in ('recap',):
                continue
            for field in ('h', 'b'):
                t = s.get(field) or ''
                if not t:
                    continue
                if re.search(art + r'(' + noun + r')\b', t, re.I) and not re.search(anchor, t, re.I):
                    hits.append((post['slug'], i + 1, s.get('role',''), field, t.replace('\n', ' | ')))
    return hits, sum(len(p['slides']) for p in d['posts']), len(d['posts'])

tot_h = tot_s = tot_p = 0
per_brand = {}
for brand in ('diplomy', 'comehometag', 'qolca', 'propaga', 'radarestatal'):
    bh = []; bs = bp = 0
    for f in sorted(Path(f'brands/{brand}/posts').glob('*.json')):
        h, ns, np_ = scan(brand, f)
        bh += [(f.stem,) + x for x in h]; bs += ns; bp += np_
    per_brand[brand] = bh
    tot_h += len(bh); tot_s += bs; tot_p += bp
    print(f'{brand:14} {bp:4} posts  {bs:5} laminas  ->  {len(bh):4} laminas marcadas')
print(f'{"TOTAL":14} {tot_p:4} posts  {tot_s:5} laminas  ->  {tot_h:4} marcadas')
json.dump(per_brand, open('tools/_frio.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

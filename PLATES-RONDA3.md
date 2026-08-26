# PLATES-RONDA3.md — sesión de imágenes ChatGPT para la ronda de 90 (ago–oct)

Complemento de `PLATES.md` (las 108+ plates de la ronda 1 SE REUTILIZAN — esto
es solo lo nuevo). Target: **34 keepers obligatorios** + 7 opcionales.
Tiempo estimado: ~2 horas.

## Reglas de flujo (idénticas a PLATES.md — releer si hace falta)

1. **Siempre portrait/vertical** (1024×1536). El renderizador recorta a 9:16.
2. **Re-roll, no conformarse.** Abstractos: 3–4 tiradas por prompt, quedarse
   con los MÁS planos/aburridos (el fondo no compite con el titular).
   Cinematics: 2–3 tiradas, quedarse con 1.
3. **Rechazo instantáneo si:** letras o pseudo-texto en cualquier parte (zoom
   al 100% y revisar) · cara visible (cinematics) · forma reconocible de
   marca/logo · centro ocupado (ahí va nuestro texto).
4. **Guardar como PNG** en la carpeta indicada con el nombre EXACTO.
5. Re-rolls buenos pero redundantes: guardarlos igual con sufijo `-b`
   (inventario de sobra es gratis).

Raíz: `CLIPPING\carousels\`

Al terminar: avisar a Claude — corre `tools/grade.py` sobre lo nuevo, purga
los clones de Qolca que no encajan en Radar Estatal (`cine-06-clinica` etc.)
y valida 2–3 posts de prueba.

---

# 1 · RADAR ESTATAL — `brands\radarestatal\plates\` (26 keepers) — EL bloque

Paleta SOLO azul: paper `#F6F9FC` · tinta `#0C2440` · radar `#2E7BE0` ·
celeste `#CFE3FA`. Sensación: **profesional-videojuego** (HUD, radar,
precisión) — nunca caricaturesco. Marca LIGHT: portadas y value claras; emph
oscuro azul-tinta. Motivo: anillos y barridos de radar, retícula blueprint.
**NADA con forma de mapa** (el logo es el mapa del Perú — un mapa en la plate
leería como logo, regla 3).

## 1.1 Abstractos (20)

**A — Covers · quedarse 4 → `cover-01.png` … `cover-04.png`**
```
Very light minimal abstract background, near-white cool paper tone with a
faint technical blueprint grid at 5 percent opacity, two or three thin
concentric radar rings in light blue barely visible in an upper corner, one
single thin electric blue accent line, precise and technical HUD feeling, no
text, no letters, no numbers, no logos, no maps, no people, no icons,
extremely simple composition, generous empty center for text overlay, subtle
fine noise texture, vertical portrait, uniform to all edges, nothing
important near the left or right edges
```

**B — Value claro (el caballo de batalla) · quedarse 6 → `value-mist-01.png` … `value-mist-06.png`**
```
Almost flat very light blue-gray paper background, extremely subtle cool
vignette at the corners, one barely visible thin light blue horizontal rule
in the upper third, minimal and precise, no text, no letters, no numbers, no
logos, no maps, no people, no icons, huge empty center, subtle fine grain,
vertical portrait, uniform to all edges, nothing important near the left or
right edges
```

**C — Value alt (celeste) · quedarse 4 → `value-sky-01.png` … `value-sky-04.png`**
```
Soft abstract gradient background, pale sky blue fading into near-white
toward the center, one very faint sweep of lighter blue like a slow radar
arc crossing the upper area, airy and clean, technical but calm, no text, no
letters, no numbers, no logos, no maps, no people, no icons, extremely
simple, large empty center for text overlay, subtle noise, vertical
portrait, colors continuing to all edges, nothing important near the left or
right edges
```

**D — Emphasis (lámina oscura de dato grande) · quedarse 3 → `emph-01.png` … `emph-03.png`**
```
Deep dark navy ink abstract background with a very faint blueprint grid
fading into darkness, one dim electric blue radar sweep glow rising from a
lower corner, darkest at the center for large white text, precise technical
HUD mood, no text, no letters, no numbers, no logos, no maps, no people, no
icons, extremely simple, subtle noise, vertical portrait, uniform to all
edges, nothing important near the left or right edges
```

**E — CTA · quedarse 3 → `cta-01.png` … `cta-03.png`**
```
Very light cool paper background with one soft electric blue circular glow
pulsing in the exact center like a quiet radar ping, two extremely faint
concentric rings around it, calm and confident, no text, no letters, no
numbers, no logos, no maps, no people, no icons, extremely simple, large
soft-lit center for text overlay, subtle fine grain, vertical portrait,
nothing important near the left or right edges
```

## 1.2 Cinematics 🎬 (6) — el mundo del proveedor del Estado

Sufijo compartido — pegar después de cada línea de escena:
```
— cinematic film still, anamorphic lens, shallow depth of field, cold blue
corporate color grade, film grain, no visible faces, no text, no letters, no
logos, no readable documents or screens, dark gradient from the bottom
covering the lower 60% of the frame, large dark areas for text overlay,
vertical portrait, photorealistic, shot on 35mm, nothing important near the
left or right edges
```

| Archivo | Línea de escena (pegar + sufijo) |
|---|---|
| `cine-11-ferreteria.png` | A hardware store owner seen from behind at his counter, shelves of tools and supplies rising behind him, warm work light against cool shadows |
| `cine-12-obra.png` | A small construction site at dawn, one worker in a safety helmet seen from behind looking at the structure, morning haze |
| `cine-13-bases.png` | A thick spiral-bound stack of official documents with colored sticky tabs on a dark desk, dramatic side light, dust in the air |
| `cine-14-imprenta.png` | Inside a small print shop at night, large printing machine running, paper sheets stacked, one worker blurred in the background |
| `cine-15-reparto.png` | A delivery van with open rear doors being loaded with boxes at dawn on an empty street, long shadows |
| `cine-16-madrugada.png` | A person seen from behind working late at a desk lamp over piles of paperwork, the rest of the office dark, city lights out the window |

> Los clones azules de Qolca que SÍ encajan (papeles, acuerdo, almacén,
> ventana, oficina, café) se quedan como inventario extra. Claude purga los
> que no (clínica, teléfono si sobra) al regradear.

---

# 2 · QOLCA — `brands\qolca\plates\` (3 keepers) — los nichos nuevos

Escenas de MENCIÓN (doctrina: nunca post mono-nicho — estas plates dan
variedad visual, no posts dedicados). Sufijo: el MISMO de Qolca en PLATES.md
(cold teal-and-orange corporate color grade…).

| Archivo | Línea de escena (pegar + sufijo Qolca de PLATES.md §2.2) |
|---|---|
| `cine-11-autos.png` | A used car dealership lot at dusk, rows of parked cars under string lights, one salesperson silhouette walking between them |
| `cine-12-boda.png` | An elegant wedding venue being set up, empty decorated tables with candles and flowers, staff blurred in the warm background |
| `cine-13-inmobiliaria.png` | A bright empty model apartment with floor-to-ceiling windows over the city, a sales folder on the kitchen counter, late afternoon light |

---

# 3 · COMEHOMETAG — `brands\comehometag\plates\` (3 keepers) — huecos del calendario

Sufijo: el MISMO de CHT en PLATES.md §1.2 (warm amber and teal…).

| Archivo | Línea de escena (pegar + sufijo CHT) |
|---|---|
| `cine-13-halloween.png` | Small children in colorful costumes seen from behind walking down a dark residential street at night, porch lights and jack-o-lanterns glowing ahead |
| `cine-14-mochila.png` | A packed emergency backpack and a small pair of children's shoes waiting by the front door, warm hallway light, everything else dim |
| `cine-15-concierto.png` | A massive stadium concert crowd seen from behind, thousands of phone lights glowing in the dark, stage lights far away |

`cine-13` = bloque Halloween (31 oct) · `cine-14` = simulacros (14 ago + 13
oct nocturno) · `cine-15` = BTS/conciertos (multitudes con hermanitas).

---

# 4 · PROPAGA — `brands\propaga\plates\` (2 keepers) — rampa de campañas

Sufijo: el MISMO de Propaga en PLATES.md §3.2 (warm natural, overlay 50%).

| Archivo | Línea de escena (pegar + sufijo Propaga) |
|---|---|
| `cine-11-campana.png` | A small shop owner seen from behind decorating their storefront window with holiday lights at night, warm glow spilling onto the street |
| `cine-12-planner.png` | A desk with an open paper planner, colorful sticky notes and a phone, hands pointing at a date, cozy morning light |

`cine-11` = rampa Cyber Wow/navidad (oct) + Halloween tienda ·
`cine-12` = "la campaña se planifica antes" (evergreen de fechas).

---

# 5 · OPCIONAL — eventos generables (7) → te ahorran descargas

Van al pool compartido `carousels\eventos\` (SIN gradear — el duotono por
marca lo saca grade.py después). Fotos realistas, sin caras, sin marcas.

**5.1 `eventos\gastronomia\` (4)** — días del Lomo Saltado (9/10), Anticucho
(17/10), Chifa (21/10) y temporada de turrón. Un prompt por plato:
```
Overhead food photography of [PLATO], served on a rustic plate on a dark
wooden table, steam rising, dramatic warm side light, shallow depth of
field, no people, no hands, no text, no letters, no logos, vertical
portrait, photorealistic, nothing important near the left or right edges
```
- `lomo-saltado.png` → [PLATO] = "Peruvian lomo saltado with french fries and rice"
- `anticuchos.png` → [PLATO] = "Peruvian anticuchos, grilled beef heart skewers with golden potatoes"
- `chifa.png` → [PLATO] = "Peruvian chifa fried rice arroz chaufa with chopsticks"
- `turron.png` → [PLATO] = "Peruvian turrón de Doña Pepa, layered anise pastry with colorful sprinkles"

**5.2 `eventos\cine\` (2)** — sirve a Spider-Man resaca, PAW Patrol (14/08),
re-estreno Endgame (25/09) y The Social Reckoning (9/10):
```
A packed movie theater audience seen from behind in the dark, faces not
visible, the glowing blank screen ahead, floating dust in the projector
beam, cinematic mood, no text, no letters, no logos, no recognizable movie
content on the screen, vertical portrait, photorealistic, nothing important
near the left or right edges
```
- `sala-llena.png` (prompt tal cual) · `popcorn.png` (variar: "Close-up of a
  striped popcorn bucket and tickets on a cinema seat armrest, projector
  light in the dark background")

**5.3 `eventos\halloween\` (1)** — `nocturna.png`: reusar el prompt de CHT
`cine-13-halloween` SIN el sufijo de grade CHT (versión neutra para el pool;
las otras marcas la duotonan).

> El resto de eventos (simulacro INDECI, Mes Morado, Santa Rosa, Apple, BTS,
> Alzheimer) = FOTOS REALES descargadas — lista aparte cuando toque.

---

# 6 · ESCENAS MITOLÓGICAS para ganchos de celebridad → `eventos\odisea\escenas\`

Las fórmulas de gancho (skill §Fórmulas) piden la ESCENA actuada. Mitología =
dominio público, se genera versión GENÉRICA (nunca el diseño de la película).
Sufijo compartido — pegar tras cada línea:
```
— dramatic mythological illustration, ancient greek setting, painterly
cinematic style, rich lighting, no text, no letters, no logos, expressive
theatrical poses, vertical portrait, nothing important near the left or
right edges
```

| Archivo | Escena |
|---|---|
| `telemaco-barco.png` | A determined young greek man standing at the bow of a wooden ship at sea, searching the horizon, wind in his cloak |
| `circe-chanchos.png` | A beautiful greek sorceress in flowing robes smirking, surrounded by confused pigs wearing scraps of sailor clothing, torchlit palace |
| `odiseo-mastil.png` | A greek hero tied tightly to a ship mast, screaming with desperate wide eyes, sailors with wax in their ears rowing calmly around him |
| `ciclope-dolido.png` | A giant one-eyed cyclops covering his wounded single eye, crying dramatically at a cave entrance, firelight, theatrical pain |
| `penelope-tejiendo.png` | An elegant greek woman weaving a large tapestry by candlelight, undoing threads, patient tired expression, suitors feasting blurred in the background |
| `caballo-troya.png` | A giant wooden horse on wheels standing before ancient city gates at dusk, soldiers peeking from a hatch in its belly |
| `tio-ben.png` | A warm wise elderly american uncle in a cardigan looking at the camera with gentle serious eyes, suburban porch, golden hour — photorealistic portrait (NO superhero elements) |

> Regla de uso: si el rasgo es del ACTOR (Holland spoilea, Sink guardó el
> secreto) → foto CC de Commons ya descargada. Si es del PERSONAJE/mito
> (Penélope, el cíclope, Circe) → estas escenas generadas.

## Tracker de sesión

- [ ] RE abstractos A–E (20 keepers, ~50 min)
- [ ] RE cinematics 11–16 (6, ~30 min)
- [ ] Qolca cinematics 11–13 (3, ~15 min)
- [ ] CHT cinematics 13–15 (3, ~15 min)
- [ ] Propaga cinematics 11–12 (2, ~10 min)
- [ ] (Opcional) eventos 5.1–5.3 (7, ~25 min)

**34 obligatorios (+7 opcionales) ≈ 2h – 2h25.** Al terminar, avisar a
Claude: regradea todo (`tools/grade.py`), purga los clones sobrantes de
Radar Estatal y arma 2–3 posts de validación antes del lote de agosto.

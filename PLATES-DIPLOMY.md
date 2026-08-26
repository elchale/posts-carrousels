# PLATES-DIPLOMY.md — sesión de imágenes para la 5ta marca

Complemento de `PLATES.md` y `PLATES-RONDA3.md`. **Nada se reutiliza de las
otras marcas**: Diplomy es la única con motivo de sello/grabado y comparte
color con Radar Estatal, así que una plate de radar aquí leería como la marca
equivocada. Target: **30 keepers obligatorios** + 4 objetos opcionales.
Tiempo estimado: ~1h45.

Carpeta destino: `carousels\brands\diplomy\plates\`

## Reglas de flujo (idénticas a las rondas anteriores)

1. **Siempre portrait / vertical** (llegan 1024×1536). El renderizador sube a
   1920 de alto y recorta los lados a 1080 — por eso cada prompt dice "nothing
   important near the left or right edges".
2. **Re-roll, no conformarse.** Abstractos: 3–4 tiradas por prompt, quedarse
   con los MÁS planos y aburridos (el fondo no compite con el titular).
   Cinematics: 2–3 tiradas, quedarse con 1.
3. **Rechazo instantáneo si:** hay letras, números o pseudo-texto en cualquier
   parte (zoom al 100%) · se ve una cara (cinematics) · aparece un documento
   legible de frente · el centro está ocupado (ahí va nuestro texto).
4. **Guardar como PNG** con el nombre EXACTO de la tabla.
5. Re-rolls buenos pero redundantes: guardarlos con sufijo `-b`.

### El riesgo específico de ESTA marca

El tema es "certificados", y un certificado tiene texto. **Todo modelo de
imagen va a intentar escribir letras falsas en cuanto vea la palabra
"certificate" o "diploma".** Por eso:

- Los abstractos hablan del **patrón grabado** (guilloché, roseta, borde
  ornamental, sello en relieve), nunca de un documento.
- Los cinematics enseñan documentos **enrollados, de canto, por detrás,
  desenfocados o en blanco**. Ninguna escena tiene un papel legible de frente.
- Cada prompt lleva `no text, no letters, no numbers` — no quitarlo nunca.

Si aun así sale una lámina con garabatos tipo letra: se descarta, no se
"arregla". Una sola pseudo-letra en el fondo de una lámina la delata como IA.

---

# 1 · ABSTRACTOS (20 keepers)

Paleta: blanco frío `#FBFCFE` · tinta `#0A1F45` · azul rey `#0058D8` · celeste
`#84B8F8` · neblina `#DCEAFB`. Motivo: **grabado de imprenta fina** — líneas
guilloché, rosetas concéntricas, bordes ornamentales, relieve de sello.
**Prohibido**: dorado, laureles, pergamino amarillento, anillos de radar
(esos son de Radar Estatal), circuitos, escudos heráldicos.

**A — Portadas · quedarse 4 → `cover-01.png` … `cover-04.png`**
```
Very light minimal abstract background, clean cool white paper tone, an
extremely faint engraved guilloche line pattern of fine interwoven curves at 6
percent opacity in one upper corner, one single thin royal blue accent line,
precise fine engraving feeling like banknote printing, no text, no letters, no
numbers, no logos, no seals, no medals, no ribbons, no people, no icons,
extremely simple composition, generous empty center for text overlay, subtle
fine noise texture, vertical portrait, uniform to all edges, nothing important
near the left or right edges
```

**B — Value blanco, el caballo de batalla · quedarse 6 → `value-paper-01.png` … `value-paper-06.png`**
```
Plain cool white paper background with a very subtle fine grain and one thin
pale blue hairline border running near all four edges of the frame like the
inner rule of a printed document, otherwise completely empty, flat and
minimal, no text, no letters, no numbers, no logos, no people, no icons, huge
empty center, vertical portrait, nothing important near the left or right
edges
```

**C — Value celeste, la alterna · quedarse 4 → `value-sky-01.png` … `value-sky-04.png`**
```
Soft abstract gradient background, pale sky blue fading into near white toward
the center, one very large extremely faint concentric rosette pattern of thin
engraved rings barely visible behind the center, calm and precise, no text, no
letters, no numbers, no logos, no people, no icons, extremely simple, large
empty center for text overlay, subtle noise, vertical portrait, colors
continuing to all edges, nothing important near the left or right edges
```

**D — Emphasis, la lámina oscura del dato grande · quedarse 3 → `emph-01.png` … `emph-03.png`**
```
Deep dark navy ink abstract background with an extremely faint engraved
guilloche pattern of fine curved lines fading into darkness, one dim royal
blue glow rising from a lower corner, darkest at the center for large white
text, precise and institutional mood, no text, no letters, no numbers, no
logos, no seals, no people, no icons, extremely simple, subtle noise, vertical
portrait, uniform to all edges, nothing important near the left or right edges
```

**E — CTA · quedarse 3 → `cta-01.png` … `cta-03.png`**
```
Clean cool white paper background with one soft royal blue circular glow in the
exact center like light through an embossed seal impression, two extremely
faint concentric engraved rings around it, calm and confident, no text, no
letters, no numbers, no logos, no people, no icons, extremely simple, large
soft lit center for text overlay, subtle fine grain, vertical portrait,
nothing important near the left or right edges
```

---

# 2 · CINEMATICS 🎬 (10 keepers) — el mundo de la academia chica

Sufijo compartido — **pegar después de cada línea de escena**:
```
— cinematic film still, anamorphic lens, shallow depth of field, cool blue
color grade with clean white highlights, film grain, no visible faces, no
text, no letters, no numbers, no logos, no readable documents, no readable
screens, dark gradient from the bottom covering the lower 60% of the frame,
large dark areas for text overlay, vertical portrait, photorealistic, shot on
35mm, nothing important near the left or right edges
```

| Archivo | Línea de escena (pegar + sufijo) |
|---|---|
| `cine-01-aula.png` | An empty small classroom after class, rows of chairs and a bare desk, late afternoon light coming through window blinds, dust in the air |
| `cine-02-entrega.png` | Close up of two pairs of hands passing a rolled paper document tied with a thin ribbon, warm indoor light, everything else dark |
| `cine-03-imprenta.png` | Inside a small print shop at night, a stack of heavy blank paper sheets under a printing press, machinery blurred in the background |
| `cine-04-escritorio.png` | Hands typing on a laptop at a small office desk, the screen turned away from the camera, one desk lamp, dark room around |
| `cine-05-congreso.png` | An empty conference hall before the audience arrives, long rows of chairs facing a lit stage, cool light |
| `cine-06-acreditacion.png` | A registration desk at an event with rows of blank name badges and coiled lanyards laid out on the table, soft morning light |
| `cine-07-taller.png` | Close up of a student's hands working at a vocational workshop bench with tools, sparks of light, dark workshop behind |
| `cine-08-telefono.png` | A person seen from behind holding a phone showing a blurred unreadable profile page, café window light in front of them |
| `cine-09-ceremonia.png` | A small graduation ceremony seen from the last row, out of focus figures standing at the front, warm hall lights |
| `cine-10-archivador.png` | An open filing cabinet drawer packed with old paper folders, dramatic side light, dust floating, dark office |

Reparto por pilar de contenido (para que el renderizador tenga escena para
todo): fraude y confianza → `cine-02`, `cine-10` · cómo-hacer del emisor →
`cine-03`, `cine-04`, `cine-06` · el certificado como marketing → `cine-08`,
`cine-09` · negocio de la formación → `cine-01`, `cine-05`, `cine-07`.

---

# 3 · OPCIONAL — objetos a pantalla completa (4) → `brands\diplomy\product\`

Para portadas con imagen (el renderizador las usa a sangre completa y las
duotona a la paleta). **El nombre TIENE que empezar con `evento-`**: ese
prefijo es lo que dispara el tratamiento de imagen completa en
`tools/render.py` (`_product_slide`); cualquier otro nombre se renderiza
contenido con márgenes blancos, como una captura de pantalla.

Sufijo compartido para los cuatro:
```
— macro product photography, extreme shallow depth of field, cool blue and
white tones, soft studio light, dark clean background, no text, no letters, no
numbers, no logos, no people, vertical portrait, photorealistic, nothing
important near the left or right edges
```

| Archivo | Objeto |
|---|---|
| `evento-sello.png` | A blank embossed wax seal on smooth cool white paper, no marking on the seal, raking light showing the relief |
| `evento-roseta.png` | A blank ribbon rosette award medallion lying on white paper, deep blue ribbon, no writing on it |
| `evento-rollo.png` | A single rolled paper document tied with a thin blue ribbon standing upright, soft shadow |
| `evento-relieve.png` | Extreme macro of an embossed blind stamp relief pattern on thick cotton paper, no letters, raking side light |

---

# 4 · LO QUE NO SE GENERA

- **Las capturas del producto** (`product/shot-*.png`): son reales, salen de la
  app cuando esté desplegada. La captura clave de esta marca es la **página de
  verificación** con el check verde y la marca de la academia; es el producto
  entero en una sola imagen y va a aparecer en casi todas las láminas 6.
- **Cualquier imagen de un certificado con texto**: si un post necesita
  enseñar un certificado, se compone después con el diseño real del producto,
  nunca con un documento inventado por el modelo.

## Tracker de sesión

- [ ] A · portadas (4, ~10 min)
- [ ] B · value blanco (6, ~15 min)
- [ ] C · value celeste (4, ~10 min)
- [ ] D · emphasis (3, ~10 min)
- [ ] E · cta (3, ~10 min)
- [ ] Cinematics 01–10 (10, ~50 min)
- [ ] (Opcional) objetos 4 (~15 min)

Al terminar, avisar a Claude: corre `tools/grade.py` (la receta `diplomy` ya
está escrita), revisa que ninguna plate tenga pseudo-texto y arma 2–3 posts de
validación antes del primer lote.

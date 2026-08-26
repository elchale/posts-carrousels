# PLATES.md — the complete image-generation session

Everything to generate with ChatGPT, in order, with copy-paste prompts and the
exact file each keeper becomes. Target: **92 kept images** (~47 prompts with
re-rolls). This is the ONLY image work in the whole 180-carousel plan.

## Workflow rules (read once, then grind)

1. **Portrait always.** Ask ChatGPT for portrait / vertical — files arrive
   1024×1536 (2:3). That's expected: the renderer upscales to height 1920 and
   center-crops the sides to 1080 for the 9:16 master. Every prompt already
   says "nothing important near the left or right edges" for this reason.
2. **Re-roll, don't settle.** Abstract prompts: run each **3–4×**, keep the
   count listed (pick the FLATTEST, most boring ones — a background that's
   interesting competes with the headline). Cinematic prompts: run each
   **2–3×**, keep 1.
3. **Reject instantly if:** any letter-like shapes or pseudo-text anywhere
   (the #1 AI-image failure — zoom to 100% and check) · a visible face
   (cinematic) · a recognizable brand/logo shape · the center is busy (that's
   where our text goes).
4. **Save as PNG** into the folder given per section, with the exact filename.
   The renderer will key on these names.
5. Re-rolls that are good but redundant: keep them anyway with a `-b` suffix
   (e.g. `value-paper-03-b.png`) — spare inventory is free.

Folder root: `CLIPPING\carousels\brands\`

Naming: `<family>-<nn>.png` — families are `cover`, `value-*`, `emph`, `cta`,
`cine`.

---

# 1 · COMEHOMETAG — `brands\comehometag\plates\` (32 keepers)

Palette: warm amber, cream, soft teal. Mood: hopeful, protective, warm. Fear
lives in the TEXT, never in the image.

## 1.1 Abstract (20)

**A — Covers · keep 4 → `cover-01.png` … `cover-04.png`**
```
Soft abstract gradient background, warm amber and cream fading into deep teal,
gentle out-of-focus bokeh lights in the upper third like late afternoon sun
through a window, no text, no letters, no logos, no people, no objects,
extremely simple composition, generous empty space in the center for text
overlay, subtle fine film grain, vertical portrait, composition centered with
nothing important near the left or right edges, colors continuing naturally to
all edges
```

**B — Value workhorse · keep 6 → `value-paper-01.png` … `value-paper-06.png`**
```
Very soft cream paper texture background, extremely subtle warm vignette at the
corners, almost flat, minimal and calm, no text, no letters, no logos, no
people, no objects, huge empty center, subtle fine grain, vertical portrait,
uniform to all edges, nothing important near the left or right edges
```

**C — Value alt · keep 4 → `value-sage-01.png` … `value-sage-04.png`**
```
Muted abstract gradient background, soft sage green blending into warm sand
beige, very low contrast, calm and airy, no text, no letters, no logos, no
people, no objects, extremely simple, large empty center for text overlay,
subtle film grain, vertical portrait, colors continuing to all edges, nothing
important near the left or right edges
```

**D — Emphasis (the big-stat slide, white text on dark) · keep 3 →
`emph-01.png` … `emph-03.png`**
```
Deep dusk abstract gradient background, dark teal blue at the top melting into
a faint warm apricot glow at the bottom, dark enough for large white text in
the center, no text, no letters, no logos, no people, no objects, extremely
simple, subtle film grain, vertical portrait, colors continuing to all edges,
nothing important near the left or right edges
```

**E — CTA · keep 3 → `cta-01.png` … `cta-03.png`**
```
Soft cream background with one gentle warm amber glow in the exact center like
distant candlelight, calm and hopeful, no text, no letters, no logos, no
people, no objects, extremely simple, large soft-lit center for text overlay,
subtle fine grain, vertical portrait, nothing important near the left or right
edges
```

## 1.2 Cinematic 🎬 (12) — one prompt each, keep 1 per seed

Shared suffix — paste this after every scene line below:
```
— cinematic film still, anamorphic lens, shallow depth of field, warm amber
and teal color grade, film grain, no visible faces, no text, no letters, no
logos, dark gradient from the bottom covering the lower 60% of the frame,
large dark areas for text overlay, vertical portrait, photorealistic, shot on
35mm, nothing important near the left or right edges
```

| File | Scene line (paste + suffix) |
|---|---|
| `cine-01-manos.png` | A small child's hand holding a large adult hand, a crowded Latin American market blurred in the warm background |
| `cine-02-zapatos.png` | A pair of tiny children's shoes alone on beach sand at dusk, soft waves far behind |
| `cine-03-abuelo.png` | An elderly man seen from behind sitting on a park bench, golden hour light, long shadows |
| `cine-04-mama.png` | A mother's silhouette scanning a busy shopping mall crowd, motion blur around her stillness |
| `cine-05-abuela.png` | An elderly woman's hands knitting under warm lamp light, dark cozy room |
| `cine-06-procesion.png` | A family seen from behind walking in a candlelit religious procession at night, purple and gold tones |
| `cine-07-columpio.png` | An empty playground swing swaying slightly at blue hour, park lights just turning on |
| `cine-08-papa.png` | A father carrying a sleeping child up the stairs, silhouetted against a warm hallway light |
| `cine-09-ventana.png` | A grandmother and small child seen from behind at a window, rain outside, warm interior light |
| `cine-10-pulsera.png` | Macro shot of a simple fabric wristband on a small child's wrist, extreme shallow depth of field, warm light |
| `cine-11-perro.png` | A dog sitting at an open doorway looking out at rain, seen from behind, warm house light behind it |
| `cine-12-reencuentro.png` | Two people in a tight embrace seen from behind at an airport arrivals hall, bokeh lights, joyful warm tones |

---

# 2 · QOLCA — `brands\qolca\plates\` (30 keepers)

Palette: near-black charcoal, deep navy, one electric-cyan accent, off-white
for light slides. Mood: precise, technical, confident. **No circuit-board /
robot / brain clichés ever.**

## 2.1 Abstract (20)

**A — Covers · keep 4 → `cover-01.png` … `cover-04.png`**
```
Minimal abstract technical background, near-black charcoal with a very faint
blueprint grid at 6 percent opacity, one single thin electric cyan diagonal
line as the only accent, no text, no letters, no logos, no people, no icons,
no circuit boards, extremely simple, generous empty center for text overlay,
subtle noise texture, vertical portrait, uniform to all edges, nothing
important near the left or right edges
```

**B — Value workhorse · keep 6 → `value-slate-01.png` … `value-slate-06.png`**
```
Dark slate gray abstract background with one soft dim spotlight gradient in
the upper center, almost flat, serious and clean, no text, no letters, no
logos, no people, no icons, extremely simple, huge empty center, subtle noise
texture, vertical portrait, uniform to all edges, nothing important near the
left or right edges
```

**C — Value light (screenshot slides) · keep 4 → `value-paper-01.png` … `value-paper-04.png`**
```
Clean off-white paper background in Swiss graphic design style, one thin
horizontal electric cyan rule in the upper third, otherwise completely empty,
no text, no letters, no logos, no people, extremely minimal, subtle paper
grain, vertical portrait, nothing important near the left or right edges
```

**D — Emphasis · keep 3 → `emph-01.png` … `emph-03.png`**
```
Deep navy blue abstract background with an extremely faint isometric grid
fading into darkness, darkest at the center for large white text, no text, no
letters, no logos, no people, no icons, extremely simple, subtle noise,
vertical portrait, uniform to all edges, nothing important near the left or
right edges
```

**E — CTA · keep 3 → `cta-01.png` … `cta-03.png`**
```
Near-black charcoal background with a soft electric cyan glow rising from the
bottom edge like a horizon light, dark empty center, no text, no letters, no
logos, no people, extremely simple, subtle noise texture, vertical portrait,
nothing important near the left or right edges
```

## 2.2 Cinematic 🎬 (10)

Shared suffix for all Qolca scenes:
```
— cinematic film still, anamorphic lens, shallow depth of field, cold
teal-and-orange corporate color grade, film grain, no visible faces, no text,
no letters, no logos, no readable screens, dark gradient from the bottom
covering the lower 60% of the frame, large dark areas for text overlay,
vertical portrait, photorealistic, shot on 35mm, nothing important near the
left or right edges
```

| File | Scene line |
|---|---|
| `cine-01-ventana.png` | A silhouetted figure standing at a rain-streaked office window at 2am, city lights glowing far below |
| `cine-02-oficina.png` | An empty open-plan office at night, one single monitor glowing blue in the darkness |
| `cine-03-cafe.png` | Hands typing on a laptop at a dark café table, warm side light, steam from a coffee cup |
| `cine-04-pizarra.png` | A person seen from behind studying a whiteboard covered in blurred diagrams, dim room |
| `cine-05-almacen.png` | A warehouse worker seen from behind walking between tall industrial shelves, shafts of light |
| `cine-06-clinica.png` | A clinic reception desk with motion-blurred staff passing, calm cool light |
| `cine-07-papeles.png` | Tall stacks of paper invoices on a desk, dramatic side light, dust in the air |
| `cine-08-telefono.png` | Macro shot of a smartphone screen glowing with blurred unreadable notifications in a dark room |
| `cine-09-acuerdo.png` | Two people shaking hands, backlit in a bright doorway, seen as silhouettes |
| `cine-10-amanecer.png` | Dawn breaking over the Lima skyline seen from a dark high office floor, city waking up |

---

# 3 · PROPAGA — `brands\propaga\plates\` (30 keepers)

Palette: coral, warm yellow, mint, lilac, off-white. Mood: bright, friendly,
energetic SaaS. Cinematic set uses a LIGHTER grade + only ~50% overlay.

## 3.1 Abstract (20)

**A — Covers · keep 4 → `cover-01.png` … `cover-04.png`**
```
Clean bright abstract background, soft coral and warm yellow gradient over
off-white, one large soft-edged geometric circle partially visible in a lower
corner, flat modern illustration style, no text, no letters, no logos, no
people, no UI elements, extremely simple, generous empty center for text
overlay, very subtle paper grain, vertical portrait, colors continuing to all
edges, nothing important near the left or right edges
```

**B — Value workhorse · keep 6 → `value-blanco-01.png` … `value-blanco-06.png`**
```
Plain warm off-white background with a very subtle paper grain and a thin
coral border line running near all four edges of the frame, otherwise
completely empty, flat and minimal, no text, no letters, no logos, no people,
huge empty center, vertical portrait
```

**C — Value alt · keep 4 → `value-menta-01.png` … `value-menta-04.png`**
```
Soft abstract wash background, pale mint green fading into white toward the
center, airy and fresh, flat modern style, no text, no letters, no logos, no
people, no objects, extremely simple, large empty center for text overlay,
very subtle grain, vertical portrait, colors continuing to all edges, nothing
important near the left or right edges
```

**D — Emphasis · keep 3 → `emph-01.png` … `emph-03.png`**
```
Soft lilac and cream abstract background with one large pale circle glowing
gently behind the center, flat modern illustration style, calm but bright, no
text, no letters, no logos, no people, extremely simple, empty center for
dark text overlay, subtle grain, vertical portrait, nothing important near the
left or right edges
```

**E — CTA · keep 3 → `cta-01.png` … `cta-03.png`**
```
Warm yellow glow spreading from the bottom edge over an off-white background,
cheerful and energetic, flat modern style, no text, no letters, no logos, no
people, extremely simple, empty center, subtle paper grain, vertical portrait,
nothing important near the left or right edges
```

## 3.2 Cinematic 🎬 (10)

Shared suffix for all Propaga scenes — note the lighter overlay:
```
— cinematic film still, shallow depth of field, warm natural color grade with
soft highlights, film grain, no visible faces, no text, no letters, no logos,
no readable screens, soft dark gradient from the bottom covering the lower
50% of the frame, room for text overlay in the lower half, vertical portrait,
photorealistic, shot on 35mm, nothing important near the left or right edges
```

| File | Scene line |
|---|---|
| `cine-01-cama.png` | A person seen from behind editing something on a phone in bed at night, screen glow on the sheets |
| `cine-02-tripode.png` | A café table with a phone on a small tripod, hands adjusting it, warm morning light |
| `cine-03-abierto.png` | A small shop owner seen from behind flipping a hanging OPEN sign shape on a glass door, morning street light |
| `cine-04-cafe-frio.png` | A cluttered desk at midnight with a cold half-finished coffee and a glowing laptop, seen from the side |
| `cine-05-analytics.png` | Hands holding a phone showing a blurred colorful chart screen, cozy room bokeh behind |
| `cine-06-puesto.png` | A street market vendor seen from behind arranging their colorful stall at golden hour |
| `cine-07-caos.png` | Top-down shot of a desk with an open laptop, scattered notebooks and pens, warm lamp light |
| `cine-08-caminando.png` | A person walking through a city street at dusk looking at their phone, seen from behind, colorful bokeh |
| `cine-09-amigas.png` | Two friends laughing at something on a phone, faces cropped out of frame, warm daylight |
| `cine-10-amanecer.png` | A runner at sunrise seen from behind with a phone strapped to their arm, long shadows on the road |

---

## Session tracker

Work top to bottom; tick as you go. Suggested pacing — each abstract family is
~10 min (3–4 rolls, pick keepers), each cinematic seed ~5 min (2–3 rolls):

- [ ] CHT abstract A–E (20 keepers, ~50 min)
- [ ] CHT cinematic 1–12 (~1 hr)
- [ ] Qolca abstract A–E (20, ~50 min)
- [ ] Qolca cinematic 1–10 (~50 min)
- [ ] Propaga abstract A–E (20, ~50 min)
- [ ] Propaga cinematic 1–10 (~50 min)

≈ 5–6 focused hours for the entire visual foundation of 180 carousels.

When done, tell Claude — next step is writing ComeHomeTag S1 (the first 10
checklists) and hand-assembling 2–3 posts on these plates to validate the
template before the renderer gets built.

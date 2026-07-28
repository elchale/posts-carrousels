# PLAN-180 — 60 carousels × 3 brands, one upload everywhere

Date: **2026-07-28**. Extends `STRATEGY.md` (the research base — read it first).
This file adds the second research round (cinematic/celebrity imagery, share
psychology, cross-posting mechanics) and the full production plan: **180
carousels, organized so ~30–40 image plates per brand carry all 60 posts.**

---

## 1. Straight talk about "99% viral"

No plan can make a *single* post viral with 99% probability — anyone who claims
that is selling something. What CAN be engineered to near-certainty is a
**portfolio outcome**:

- Virality is a heavy-tail lottery. Most posts land near the median (~56 IG /
  ~500 TikTok views at our follower level), a few outliers do 10–100×.
- If each well-crafted carousel has even a ~2% chance of a 10× outlier, then
  across 180 posts: **P(at least one big outlier) = 1 − 0.98¹⁸⁰ ≈ 97%**, and
  the expected number of outliers is ~3–4. With the share-trigger design in §4
  the per-post odds should be better than that.
- The plan's job is therefore threefold: (a) raise the per-post floor (design +
  SEO + save/send optimization), (b) fatten the tail (every post carries an
  explicit share trigger), and (c) **detect and clone the winners fast** (§7 —
  this is where the real compounding is; the first outlier tells us what the
  audience wants 60 more of).

That's the honest version of 99%: near-certainty that the *batch* produces
winners, plus a loop that converts each winner into a repeatable format.

---

## 2. The cinematic-plate theory — verdict from research round 2

Carlos's theory: AI-generate a background of a recognizable character/celebrity
(e.g. DiCaprio) or a scene (people in an office), put a dark overlay on it, and
let the mood carry the text. Verdict in three parts:

### 2a. Real celebrities: NO — and this one isn't a judgment call

- **[LEGAL]** Right of publicity + false endorsement (Lanham Act §43(a)) apply
  to a *brand account* using a real person's likeness to promote a product —
  which is exactly what Propaga/Qolca/ComeHomeTag posts are. **"It was
  AI-generated" is explicitly not a defense**, and 2026 state laws (CA AB 1836,
  Tennessee ELVIS Act, NY's synthetic-performer disclosure law effective
  2026-06-09) broadened the surface this year.
- **[PLATFORM]** TikTok's policy bans using "the likeness, voice, name...
  of any third party without permission," and TikTok is rolling out **automated
  AI-likeness detection** right now (testing since July 2026). Meta pulled its
  own celebrity-likeness feature after 3 days of backlash. The detection is
  about to be machine-scale, and a small brand account is exactly what gets
  auto-actioned with no appeal worth having.
- Meme pages get away with movie stills because they're quasi-personal accounts
  rights-holders don't bother suing, and even they eat takedowns constantly. A
  business account selling a product is a different legal category.

### 2b. The aesthetic itself: YES — it's a proven viral genre

The look Carlos is describing (emotional cinematic image + dark overlay + short
text) is the **hopecore / motivational-slideshow genre**, one of the most viral
slideshow formats on TikTok. The mechanism works because the image supplies the
*emotional arousal* and the text supplies the *identity claim* — the two
ingredients share psychology says a post needs (§4). We keep 100% of this and
0% of the legal risk by swapping "identifiable celebrity" for **archetype
scenes**:

- Not DiCaprio raising a glass → **a man in a tuxedo raising a glass, shot from
  behind, golden party bokeh**. The *frame* is what's recognizable, not the face.
- Not a specific actor in an office → **a silhouetted figure at a rain-streaked
  office window at 2am, city lights below**.
- Not a real lost-child photo → **a small hand holding a large hand, crowded
  market blurred behind, warm light** — emotion without a face to fake.

### 2c. The three-birds rule: faces turned away

From STRATEGY §5: the AI-slop penalty (−12% to −35%) attaches to AI *faces and
people*, and viewers detect AI mainly through faces/hands. So the plate rule:

> **Cinematic plates never show a front-facing face.** Backs, silhouettes,
> hands, over-shoulder shots, figures at distance, faces cropped at the frame.
> Plus a **55–75% black gradient overlay** baked into the plate.

The overlay does triple duty: text legibility (WCAG contrast for free), hiding
residual AI artifacts, and the moody tone Carlos wants. Faceless composition
simultaneously dodges (1) likeness law, (2) slop detection by viewers, (3) the
uncanny valley. This is the whole theory, validated — just aimed one notch away
from real celebrities.

### 2d. Cinematic plate prompts (add to the §5 plate libraries)

Skeleton — note it *breaks* STRATEGY §5's "no people" rule deliberately, and
compensates with the faceless + overlay clauses:

```
Cinematic film still, [SCENE WITH FIGURE(S) SEEN FROM BEHIND / SILHOUETTED /
HANDS ONLY], anamorphic lens, shallow depth of field, moody color grade
[warm amber / teal-orange / cold blue], film grain, no visible faces, no text,
no letters, no logos, no watermarks, dark gradient overlay from bottom
covering 60% of frame, large dark areas for text overlay, vertical 9:16,
photorealistic, shot on 35mm
```

Ten scene seeds per brand in §5's brand sections below. Generate 4 per seed,
keep the one with the most usable dark area — same batch discipline as before.

---

## 3. One master file, every platform — the exact spec

**[MEASURED]** Cross-posting research round 2: there is **no cross-platform
duplicate-content penalty** — platforms can't detect it. What tanks reach is:
(1) **watermarks** (−40–60% on the receiving platform — we have none, native
PNGs), (2) **copy-pasted captions** (caption must be re-typed per platform),
(3) TikTok audio reused on IG. So "upload the same 60 everywhere" is fully
viable; only the caption and sound are per-platform work (~3 min/post).

**[MEASURED]** Format update that changes STRATEGY §4: Instagram's carousel
uploader now also accepts **3:4 (1080×1440)** — matching the current profile
grid — but does NOT accept 9:16 (it crops it to 3:4). 4:5 remains the default
with the longest engagement track record.

### The spec

- **Master canvas: 1080×1920.** All text inside the **centered 1080×1080
  core** (this survives every crop that exists: IG 4:5, IG 3:4, grid square,
  TikTok UI rails).
- Renderer emits three exports per slide, automatically, from the one master:
  - `ig/` **1080×1350** center crop → Instagram + Facebook
  - `tt/` **1080×1920** full → TikTok photo mode
  - `li.pdf` **1080×1350** pages → LinkedIn (Qolca only)
- Slide count: **8** (STRATEGY §3 — valid everywhere).
- Per-platform at upload time: fresh caption in platform register (IG =
  keyword-first Spanish; TikTok = shorter + trending sound attached — sound is
  a distribution signal on photo posts; FB = comment-bait question, since FB's
  algorithm weights "meaningful interactions"), alt text on IG.

One design pass, zero re-layout, and Carlos's constraint ("same 60 to all
socials") holds exactly — the files differ only by crop, which the renderer
does.

**TikTok nuance worth knowing:** Buffer's median still favors video on TikTok
(3.39% vs 1.92%), but the slideshow *genre* (meme dumps, hopecore, listicles)
produces regular mega-outliers — the median and the tail disagree. Since our
carousels are free marginal uploads there, TikTok is pure upside: expect
mediocre medians and occasional spikes, and don't read the medians as failure.

---

## 4. The share layer — what makes the same carousel also SEND

STRATEGY optimized for saves. Virality (reaching non-followers) runs on
**sends** — Mosseri's highest-weight signal — and share psychology is
well-researched (NYT Customer Insight Group + high-arousal studies):

1. **94%** share to give *valuable* content to someone specific → checklists,
   swipe files. ("Send to the person who needs this.")
2. **68%** share to *define themselves* → "this is literally me/us" content.
   The single strongest viral trigger for meme-adjacent series.
3. **78%** share to *maintain relationships* → content addressed to a dyad:
   parent↔child, jefe↔empleado, CM↔cliente.
4. **84%** share to *promote beliefs* → PSA content (ComeHomeTag's lane).
5. High-arousal emotion (awe, fear→relief, amusement, indignation) beats
   informative-but-flat content at any quality level.

**Rule: every carousel in the matrix below has ONE designated share trigger**,
and the final slide asks for exactly that action ("Envíaselo a...", "Etiqueta
a...", "Guarda esto") — never a generic "share if you liked it."

---

## 5. The 180 — content matrix

Per brand: **6 series × 10 carousels**. Each series locks a format archetype, a
plate set, a share trigger, and a CTA — so writing a carousel is only writing 8
lines of text. Series marked 🎬 use the cinematic plates (that's the ≥10
AI-image-driven carousels per brand Carlos asked for; the cinematic sets also
bleed into covers of other series where noted).

Effort split (CHT 45 / Qolca 35 / Propaga 20) now governs *polish and posting
order*, not volume — volume is fixed at 60/60/60.

---

### 5.1 COMEHOMETAG — 60

Plates: ~20 abstract warm (STRATEGY §5) + **12 cinematic** from these seeds:
child's hand in adult's hand at a crowded market · small shoes alone on beach
sand at dusk · an elderly man from behind on a park bench, golden hour · a
mother's silhouette scanning a crowd at a mall · abuela's hands knitting, warm
lamp light · a family from behind, walking at a procession, candles · empty
swing at blue hour · a father carrying a sleeping child up stairs, silhouette ·
grandmother and child from behind at a window · a wristband on a small wrist,
macro, shallow DOF · dog at a doorway looking out at rain · reunion hug from
behind, airport bokeh.

**S1 · Protocolos (checklists)** — trigger #1 valuable / #4 belief. CTA:
*"Guárdalo. Ojalá nunca lo necesites."*
1. Los primeros 10 minutos si se pierde tu hijo
2. Qué hacer ANTES de salir a un lugar lleno de gente
3. Si tu papá con Alzheimer salió solo de casa: paso a paso
4. Cómo enseñarle a tu hijo qué hacer si se pierde (juego de 5 min)
5. El protocolo del centro comercial: punto de encuentro en 30 segundos
6. Qué decirle al personal de seguridad (y qué NO)
7. La foto que debes tomarle a tu hijo cada mañana de paseo
8. Checklist de viaje con abuelos: 8 cosas antes de salir
9. Si encuentras a un niño perdido: qué hacer sin asustarlo
10. El plan familiar de 15 minutos que nadie hace

**S2 · Lugares de riesgo** — trigger #3 relationship ("envíaselo a quien va
contigo"). One location each: playa · Jockey Plaza/mall · procesión (Señor de
los Milagros) · estadio · aeropuerto · mercado/feria · parque de diversiones ·
transporte público · concierto · Navidad en el centro. Format: "Los 3 puntos
ciegos de [lugar] + el plan de 60 segundos."

**S3 · La realidad en números** — trigger #4 belief + high-arousal. One stat
per carousel, fear+efficacy SAME post (non-negotiable): 51 desapariciones/día
(Sidpol) · 52% menores · 200K+ peruanos con Alzheimer (MINSA) · 6/10 con
demencia se extravían (alz.org) · minutos críticos tras una desaparición ·
cuántos niños se pierden en playas cada verano · etc. Cinematic covers, data
slides on abstract plates.

**S4 · Alzheimer y los abuelos** 🎬 — the verified untapped Spanish niche.
Trigger #3 (adult children of aging parents — the actual buyers). Series title:
*"Cuidar al que te cuidó."* 10 posts: señales tempranas de deambulación · por
qué se van (no es capricho, es la enfermedad) · cómo hablarle a un abuelo
perdido · la culpa del cuidador · 7 frases que calman a una persona con
demencia · cómo preparar la casa · qué llevar siempre puesto · el día que papá
no reconoció la calle (historia) · mitos del GPS para adultos mayores · cómo
pedir ayuda sin sentir que fallas.

**S5 · Mitos y comparaciones** — trigger #1. "El GPS es la única opción" (sin
batería/sin app/sin mensualidad) · "eso solo pasa en películas" · "mi hijo
nunca se soltaría" · "los AirTags sirven para niños" (no — no son para
personas) · "las pulseras con nombre y teléfono bordado" (datos expuestos vs QR)
· "$45 al mes" (AngelSense wedge, sin nombrarla) · "mi mamá siempre está
acompañada" · "en Perú eso no funciona" · "es de mal padre pensarlo" (es lo
contrario) · "ya le enseñé mi número de memoria" (el pánico borra la memoria).

**S6 · Historias** 🎬 — pure hopecore register, trigger #5 arousal (fear→relief).
Real reunions when we have them; till then, composite second-person narratives
("Perdiste de vista a tu hija 40 segundos...") over the cinematic plates, one
sentence per slide, product appears only as the resolution. 10 story arcs:
supermercado · playa · procesión · abuelo que salió por pan · niño en el
aeropuerto · la mascota que volvió · el turno de noche de una madre · mellizos
en la feria · el primer día de clases · la llamada de un desconocido bueno.

---

### 5.2 QOLCA — 60 (LinkedIn PDF is the primary render; IG/TikTok secondary)

Plates: ~20 abstract dark-technical + **10 cinematic** seeds: silhouetted
figure at rain-streaked office window, 2am city lights · empty office at night,
one monitor glowing · hands on a laptop in a dark café · a whiteboard full of
diagrams, person from behind · warehouse worker from behind among shelves ·
clinic reception, motion-blurred staff · stacks of paper invoices, dramatic
side light · a phone buzzing with WhatsApp notifications, macro · two people
shaking hands, backlit doorway · dawn over Lima skyline from an office.

**S1 · Antes / después** — trigger #1. Real processes, real hours: cotizaciones
por WhatsApp · confirmación de citas (clínica) · seguimiento de leads
inmobiliaria · conciliación de pedidos e-commerce · reportes semanales ·
facturación · onboarding de clientes · inventario · respuestas de soporte ·
cobranza. Format: 3 slides manual pain → 3 slides automated → 1 slide numbers
(hrs/mes, S/. ahorrados) → CTA.

**S2 · Teardowns** — trigger #1 + proof. "Cómo construimos X en N días" with
real screenshots every 3rd slide: agente de WhatsApp para clínica · bot de
cotización · CRM automático desde formularios · pipeline de facturas · chatbot
que agenda · integración tienda-almacén · dashboard de ventas · flujo de
cobranza · asistente interno de la empresa · el sistema que corre este perfil.

**S3 · Por industria** — trigger #3 ("envíaselo a tu jefe/socio"). "5 procesos
que tu [X] sigue haciendo a mano en 2026": e-commerce · inmobiliaria · clínica
· logística · restaurante · estudio contable · academia/instituto · agencia ·
constructora · concesionario.

**S4 · Costos y verdades** — trigger #2 identity (the honest builder) + #1.
Nobody in Lima publishes numbers; we do: cuánto cuesta un agente de WhatsApp
de verdad · cuánto cuesta mantenerlo al mes · cuándo NO automatizar · lo que
las agencias no te dicen del "chatbot con IA" · build vs comprar SaaS · cuánto
tarda realmente un proyecto · qué pasa cuando el bot no sabe responder · el
costo oculto de no automatizar (con cálculo) · por qué cobramos por proyecto y
no por hora · qué preguntar antes de contratar a cualquiera (incluidos
nosotros).

**S5 · Errores** — trigger #2 ("this is my company"). Por qué tu chatbot no
vende nada · automatizaste el proceso equivocado · tu CRM es un Excel con otro
nombre · respondes rápido pero no cierras · el bot que suena a bot · medir
mensajes en vez de ventas · automatizar el caos (caos más rápido) · el error de
esperar "la herramienta perfecta" · capacitación cero · nadie es dueño del
proceso.

**S6 · El futuro del trabajo** 🎬 — the vision series, trigger #5 awe +
#2 identity. Cinematic plates, one bold claim per slide, LinkedIn-native tone:
lo que una empresa de 3 personas puede hacer en 2026 · los trabajos que la IA
no toca (y los que ya tocó) en Perú · por qué LatAm puede saltarse una
generación de software · la oficina de noche (historia del fundador) · qué
haría yo con una clínica hoy · el empleado que nunca duerme · 10 años de
procesos en 10 slides · la verdad sobre "la IA te va a reemplazar" · empresas
peruanas que ya operan así · por qué construimos en vez de asesorar.

---

### 5.3 PROPAGA — 60

Plates: ~20 abstract bright + **10 cinematic** seeds (relatable-creator lane,
lighter grade, overlay ~50%): person from behind editing on a phone in bed,
screen glow · café table with phone on a tripod, hands · a small shop owner
from behind flipping the "abierto" sign · desk with cold coffee at midnight ·
hands holding a phone showing a blurred analytics screen · street vendor
stall, golden hour, from behind · laptop + notebook chaos, top-down · person
walking with phone, city bokeh · two friends laughing at a phone, faces
cropped · sunrise run with phone armband.

**S1 · Swipe files** — trigger #1, the save-machine. 30 ideas de contenido
para tu negocio este mes · 15 hooks en español para copiar hoy · 10 CTAs que
no dan vergüenza · 12 plantillas de historias que venden · 20 preguntas para
tu audiencia · 8 formatos de carrusel (meta, muy on-brand) · 10 bios que
convierten · plantilla de calendario semanal · 15 respuestas a comentarios
difíciles · el kit del primer mes de una marca nueva.

**S2 · Calendarios LatAm** — trigger #1 + seasonal search. Agosto (Día del
Niño) · Setiembre (primavera) · Octubre (Señor de los Milagros/Halloween) ·
Noviembre (Black Friday) · Diciembre (Navidad) · Enero (verano) · Febrero (San
Valentín) · Marzo (regreso a clases) · Fiestas Patrias especial · el calendario
anual completo (el post pilar).

**S3 · Noticias de plataforma en español** — the unoccupied 2–3-week gap.
Evergreen-ized: qué cambió en el algoritmo de IG este trimestre · carruseles
vs reels con datos reales · el "second chance" de los carruseles · SEO en
Instagram explicado en cristiano · qué son los sends y por qué importan · TikTok
photo mode para negocios · por qué murieron los hashtags · los 3 números que sí
debes mirar en Insights · qué pasa cuando publicas a la misma hora siempre ·
IG ahora aparece en Google: qué hacer.

**S4 · Errores de CM** — trigger #2 ("this is literally me"). Por qué tus posts
no llegan a nadie (y no es el algoritmo) · publicas y desapareces · tu feed es
un catálogo · respondes comentarios 3 días tarde · el logo gigante en cada
post · "¿pensamientos?" no es un CTA · borras posts que "no funcionaron" ·
compras seguidores una vez y lo pagas un año · le hablas a todos = a nadie ·
subes el mismo caption a todas las redes (meta, again).

**S5 · Crecimiento táctico** — trigger #1. Cómo pasar de 0 a 1,000 seguidores
sin pagar · la primera hora de un post decide todo · qué publicar cuando no
tienes nada que decir · cómo convertir 1 idea en 7 posts · guarda-señales: cómo
se diseña un post para saves · la regla del 80/20 del contenido de negocio ·
cómo leer Insights en 5 minutos · colaboraciones para cuentas chicas · qué
hacer con un post que explotó · cuándo publicar (la respuesta honesta).

**S6 · La vida del que publica** 🎬 — the identity/meme series, trigger #2 at
full power, cinematic-relatable plates: nadie vio el post que te tomó 3 horas ·
"¿y tú cuánto cobras?" — el cliente que quiere todo gratis · el día que un
desconocido compró por un post · publicar con 12 seguidores (todos tu familia)
· el community manager a las 11pm · cuando tu jefe dice "hazlo viral" · el
negocio que empezó en una cochera y una cuenta de IG · 500 views también es un
salón lleno de gente · lo que nadie te dice del primer año · por qué sigues
publicando.

---

## 6. Production batching — how 180 gets made without dying

The unit of work is a **series (10 posts)**, never a single carousel:

1. **Plates week (once):** generate all plate libraries — ~60 abstract + ~32
   cinematic across the 3 brands, batches of 4 per seed, keep 1. One or two
   sittings in ChatGPT. This is the only image-generation work in the entire
   plan; after this, images are a solved problem.
2. **Text sprints:** one series = 10 carousels × 8 slides = **80 short lines**.
   That's one focused writing session per series; 18 sessions total. Write in
   the post-JSON format from STRATEGY §8 so it feeds the renderer directly.
3. **Render batch:** renderer emits ig/ + tt/ (+ li.pdf for Qolca) per post.
4. **Upload cadence:** 1 carousel/brand/day ≈ **2 months of daily posting** per
   brand from this one batch — comfortably above the verified 3–5 posts/week
   stagnation floor. Post the strongest series first: CHT S1, Qolca S3,
   Propaga S1.

Order of operations: build plates → write CHT S1 → **hand-assemble and post 2–3
of them BEFORE building the renderer** (STRATEGY §9 still applies — validate
the template on real posts, then automate the remaining ~175).

---

## 7. The compounding loop — where the "99%" actually comes from

Weekly, per brand, three numbers from IG Insights + TikTok analytics:
- **Swipe-through 1→2** (target 60–75%) — diagnoses hooks.
- **Save rate** (target 1.5–3%) — diagnoses value slides.
- **Sends** (no benchmark; rank posts against each other) — diagnoses virality.

Rules, mechanical, no sentiment:
- A post in the top 10% on sends or saves → its *series* gets 10 more posts
  written in that exact format next sprint, and the post itself gets reposted
  to the weaker platforms with a new cover (Mosseri's second-chance logic —
  slide 2 becomes the new slide 1).
- A series whose posts are all bottom-third after 5 posts → stop posting it,
  redistribute its remaining slots to the top series.
- Day-30: reallocate the CHT/Qolca/Propaga polish split toward whichever brand
  is producing DMs/WhatsApp conversations, per the 15-day plan's original rule.

180 hand-designed lottery tickets, every one carrying a share trigger, with a
kill-and-clone loop reading the results weekly — that is the maximum-probability
machine that actually exists.

---

## Sources (round 2 — round 1 sources in STRATEGY.md)

Celebrity likeness / AI law & policy:
- [BMD — risks of AI-generated implied celebrity endorsements](https://www.bmdllc.com/resources/blog/risks-of-using-ai-generated-implied-celebrity-endorsements-in-advertising/)
- [Holon Law — synthetic media & right of publicity risk map 2026](https://holonlaw.com/entertainment-law/synthetic-media-voice-cloning-and-the-new-right-of-publicity-risk-map-for-2026/)
- [Outside GC — right of publicity in the AI era](https://outsidegc.com/blog/retail-marketing-social-media/right-of-publicity-revisited-in-the-ai-era/)
- [Influencer Marketing Hub — AI disclosure rules by platform](https://influencermarketinghub.com/ai-disclosure-rules/)
- [TikTok seller policy — AI content restrictions](https://seller-us.tiktok.com/university/essay?knowledge_id=491489038501663)
- [MBW — TikTok's likeness-detection tool test](https://www.musicbusinessworldwide.com/tiktok-is-testing-an-opt-in-likeness-detection-tool-that-lets-us-creators-find-and-report-ai-deepfakes-of-themselves/)
- [AuditSocials — TikTok synthetic media policy vs Meta & Google](https://www.auditsocials.com/blog/tiktok-synthetic-media-policy-platform-comparison-2026)

Genre & formats:
- [nss G-Club — the hopecore trend](https://www.nssgclub.com/en/lifestyle/36145/hopecore-trend-tiktok)
- [GhostShorts — TikTok photo mode 2026](https://ghostshorts.com/blog/tiktok-photo-mode-algorithm-2026)
- [OpenClip — TikTok slideshow ideas](https://openclip.app/guides/tiktok-slideshow-ideas)

Cross-posting & specs:
- [Slidy — cross-posting without watermark penalties](https://slidycreator.com/blog/cross-posting-without-watermarks/)
- [Influencer Marketing Hub — cross-posting matrix](https://influencermarketinghub.com/cross-posting-matrix/)
- [Conbersa — cross-posting without getting flagged](https://www.conbersa.ai/learn/how-to-cross-post-without-getting-flagged)
- [CarouselPost — IG carousel sizes incl. new 3:4](https://carouselpost.io/guides/instagram-carousel-size)
- [Your Social Team — IG's new grid format](https://yoursocial.team/blog/instagram-new-grid-format)

Share psychology:
- [NFX — why people share](https://www.nfx.com/post/why-people-share)
- [Comgroup — psychology of viral content (NYT CIG data)](https://www.comgroup.com/blog/the-psychology-of-viral-content-why-we-share)

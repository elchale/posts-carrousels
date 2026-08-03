# CALENDARIO-90 — tendencias ago–oct 2026 + reglas para la ronda de 90

Ronda 3 (arrancada 2026-08-02). Alcance: **90 posts por marca** (agosto,
septiembre y octubre 2026 = ~1/día), reemplaza el lote de 60. Este doc mapea
las fechas y tendencias a las que anclar ganchos. La reescritura de ganchos
(más listos / más graciosos) viene DESPUÉS de este mapa, como paso propio.

---

## REGLAS DURAS (antes de escribir un solo gancho)

### R1 — Regla de audiencia fría: CERO incoherencias
Estos posts son para gente que **descubre** la marca en ese momento. Cada post
debe funcionar para alguien que NUNCA ha oído hablar de ComeHomeTag, Propaga o
Qolca. El objetivo es darle un insight interesante, enseñarle algo, o mostrarle
qué hacemos y cómo podemos ayudarle — no hablarle como si ya fuera cliente.

- ❌ PROHIBIDO: hablar como si el producto ya fuera conocido.
  Ejemplo real del error: *"antes de salir asegúrate que tenga su pulsera"* —
  el lector no sabe qué pulsera; no informa, no tiene sentido en frío.
- ✅ Si un post menciona el producto, el post lo INTRODUCE en el mismo post
  (la lámina de producto existente hace esto: nombra la marca + pitch de una
  línea). El gancho y las láminas de valor nunca presuponen ese conocimiento.
- Prueba rápida antes de aprobar un post: léelo como un extraño que llegó por
  el FYP. Si alguna lámina genera "¿de qué pulsera/sistema/panel hablan?",
  se reescribe.
- Esta regla convive con la regla de Qolca-sin-clientes (ver memoria /
  PLAN-180): nada de resultados inventados ni cifras de dinero en Qolca.

### R2 — Anclar a fechas ≠ hablar de la fecha
La fecha es la percha del gancho, no el tema. "Feliz día del niño 🎈" es un
post muerto. "Este domingo habrá X mil niños en parques llenos — 3 cosas que
haría antes de salir" usa la fecha para el problema que SÍ es nuestro tema.

### R3 — Tendencias globales solo si el puente es de una línea
Un evento global (GTA 6, iPhone plegable) entra solo si el puente a la marca
se explica en una frase. Si necesitas un párrafo para justificar la conexión,
es relleno.

### R4 — Imágenes de posts de eventos (decidido 2026-08-02; opciones, no regla dura)
Los posts anclados a evento/celebridad deben reconocerse como EL evento antes
de leer. Cualquiera de estas opciones vale — se elige por post:
- **Fondo**: la foto del evento como background coloreada a la marca
  (duotono/grading con `tools/grade.py`, mismo tratamiento que los plates).
- **Overlay**: un plate normal con la imagen del evento puesta ENCIMA,
  centrada dentro de la lámina (mismo mecanismo que los campos `img`/`shot`
  del renderizador).
- Mezclas (fondo abstracto + recorte del evento, etc.) también valen si el
  evento se reconoce al instante.

**Organización (2026-08-02):** máximo **1–2 imágenes por portada**, siempre
del TEMA (si no aporta reconocimiento, no va). Tres patrones fijos de
colocación:
1. **FONDO**: la foto ocupa toda la lámina, duotono a colores de marca
   (grade.py), texto encima en el core de 1080×1080.
2. **CARD**: plate normal + la foto centrada en tarjeta bajo el titular
   (mecanismo `img` del renderizador, hasta ~1000px de ancho).
3. **FRANJA**: plate arriba con el texto, la foto como banda inferior (o
   superior) de la lámina — útil cuando la foto es horizontal.
Originales en `carousels/eventos/<evento>/*.jpg` (pool compartido — la misma
foto sirve a varias marcas; grade.py saca la versión de cada una). Nombrar
por evento, no por marca.
- Preferir fotos donde la escena es el sujeto (multitud, estadio, escenario,
  producto, consola, cola de fans): reconocibles al instante y sin riesgo.
- Caras reconocibles de celebridades: el veredicto de julio (PLAN-180 §2a)
  sigue vigente — en cuentas de marca con lámina de producto es publicidad,
  no editorial. Si Carlos decide usarlas igual (norma de las páginas meme),
  es decisión suya y consciente; por defecto, escena > cara.
- Nada de key-art oficial de juegos/pósters de películas tal cual (copyright
  directo); sí fotos propias-de-escena, capturas transformadas al duotono.

### R5 — Estándar de ganchos
Todo texto de post pasa por el skill **`copy-carruseles`**
(`.claude/skills/copy-carruseles/SKILL.md`): la portada abre una brecha de
curiosidad en ≤10 palabras usando los mecanismos RANKEADOS POR NUESTROS DATOS
(imperativo con urgencia 854 · paradoja concreta 540 · contraintuitiva /
aviso de error / personaje misterioso / humor por probar), evita los quemados
(list tease puro 582–626 plano, pregunta de manual, queja plana, escenario
estrecho), cero olor a venta antes de la lámina 6, lámina 2 DIRECTO AL GRANO
(el regancho está eliminado — decisión 2026-08-02), CTA con callback.

---

## Lectura rápida de la ronda 1 (5 días, contexto para esta ronda)

TikTok reparte 138–854 views por post y **ninguno pasó de 1K** — nada está
ganando la segunda ola de distribución (los listicles de Propaga clavados en
582–626 = techo de distribución por defecto, nadie desliza). IG en frío casi
no reparte (6–229). Detalle completo y lecciones en la memoria
`carousel-stats-round1-2026-08`. Conclusión operativa: los ganchos actuales no
generan swipe/save; esta ronda los rediseña y ancla a momentos con búsqueda y
conversación ya existentes.

---

## AGOSTO 2026

| Fecha | Evento | Marca | Ángulo |
|---|---|---|---|
| vie 14, 3pm | **2º Simulacro Nacional Multipeligro** (INDECI; conmemora el terremoto de Pisco del 15/08/2007) | CHT | Plan familiar de emergencia: ¿tus hijos saben qué hacer si el temblor los agarra separados de ti? ¿Y tu papá con Alzheimer? |
| dom 16 | **Día del Niño** (tercer domingo; el más celebrado en Perú) | CHT | Parques/centros comerciales llenos ese fin de semana = escenario real de niño perdido. |
| | | Propaga/Qolca | Fecha comercial: las tiendas que venden para niños necesitan contenido/campaña ESA semana → "qué publicar para el Día del Niño" (Propaga), "la fecha pico llega y nadie contesta tus WhatsApp" (Qolca). |
| mar 26 | **Día Nacional del Adulto Mayor** (Perú) | CHT | Semana entera de contenido de abuelos/Alzheimer. 200K+ peruanos con Alzheimer (MINSA), 6/10 con demencia deambulan (alz.org). |
| dom 30 | **Santa Rosa de Lima** (feriado) | CHT | Feriado = salidas familiares + aglomeración en el pozo de los deseos (miles hacen cola con niños y abuelos). |
| | | Propaga | Feriado = día de ventas para negocios; contenido "tu negocio en feriados". |
| todo el mes | Copa Libertadores octavos (11–20 ago) + resaca post-Mundial 2026 | todas | Fútbol como analogía/meme en ganchos, no como tema. |
| todo el mes | Hype pre-GTA 6 (tráiler 3 inminente; lanzamiento 19 nov) | Propaga | Gancho contrarian: "Rockstar publica 2 veces al año y rompe internet — qué copiarle (y qué no) si tienes un negocio real". |

## SEPTIEMBRE 2026

| Fecha | Evento | Marca | Ángulo |
|---|---|---|---|
| **todo el mes** | **Mes Mundial del Alzheimer** (ADI) | CHT | EL mes de CHT en el trimestre: campaña en bloque (5–8 posts), no un post suelto. Nicho verificado como evergreen y sin competencia en español. |
| lun 21 | **Día Mundial del Alzheimer** | CHT | Pico del bloque anterior; ese día sí puede ser el post más directo de producto (introduciéndolo, R1). |
| mar 8–mié 9 | **Evento Apple: iPhone 18 Pro + primer iPhone plegable** | Qolca/Propaga | Conversación tech global gratis. Qolca: "tu celular se pliega, pero tu negocio sigue apuntando pedidos en cuaderno". Propaga: qué aprende un negocio chico del lanzamiento más ensayado del mundo. |
| dom 13 | **Día de la Familia** (Perú, segundo domingo) | CHT | Salidas familiares; versión suave (no miedo) del mensaje. |
| mar 23 | **Día de la Primavera / Día de la Juventud** (Perú) | Propaga | Los negocios hacen promos de primavera → ideas de contenido para esa semana. |
| med. mes | Arranca la fase liga de la Champions; Libertadores cuartos (22–24) | todas | Solo analogías/memes de gancho. |
| todo el mes | Vitrina fría: TIFF, IFA Berlín, estrenos menores (Practical Magic 2 11/09, Resident Evil reboot 18/09) | — | Débil para las 3 marcas; usar solo si algo explota orgánicamente. (Corrección 2026-08-02: Clayface NO es 11/09 — se movió al 23/10.) |

## OCTUBRE 2026

| Fecha | Evento | Marca | Ángulo |
|---|---|---|---|
| **todo el mes** | **Mes Morado — Señor de los Milagros** (procesiones: cientos de miles en las calles de Lima; fechas fuertes ~18, 19 y 28) | CHT | La procesión más grande de Sudamérica = EL escenario de "niño/abuelo perdido en multitud" más real y local que existe. Bloque de posts, tono respetuoso (fecha religiosa: cero humor negro aquí). |
| jue 1 | **Día Internacional de las Personas Mayores** (ONU) | CHT | Puente entre el mes del Alzheimer (sep) y el Mes Morado. |
| jue 8 | **Combate de Angamos** (feriado) | CHT/Propaga | Feriado largo: salidas (CHT) + ventas de feriado (Propaga). |
| mar 13, 8pm | **3er Simulacro Nacional Multipeligro — NOCTURNO** + Día Internacional para la Reducción del Riesgo de Desastres | CHT | Ángulo único: emergencia DE NOCHE. "¿Tu familia sabe qué hacer si pasa a las 8pm con los niños dormidos?" |
| 9 / 17 / 21 | Días del Lomo Saltado / Anticucho / Chifa (Perú) + temporada de turrón todo el mes | Propaga/Qolca | Los restaurantes son cliente objetivo: "tu restaurante en el día del anticucho: así se aprovecha una fecha gratis". |
| vie 16 | Estreno *Street Fighter* (Momoa) | — | Meme-able pero puente débil; opcional. |
| sáb 31 | **Halloween + Día de la Canción Criolla** | CHT | Niños disfrazados, de noche, en la calle, sueltos = el pico de ansiedad de padres del año. Post fuerte seguro. |
| | | Propaga | Contenido de Halloween para negocios (disfraces, dulces, promos). |
| últimas 2 sem | **Rampa a Cyber Wow (2–5 nov) + campaña navideña** (los negocios la planifican en oct) | Qolca/Propaga | "Tu tienda entra a Cyber Wow con el WhatsApp sin automatizar" (Qolca) · "la campaña de navidad se planifica en octubre, no el 15 de dic" (Propaga). |
| todo el mes | GTA 6 a 3 semanas del lanzamiento (19 nov); hype Avengers: Doomsday / Dune 3 (dic) | Propaga | Conversación masiva para ganchos/analogías de marketing. |

## FARÁNDULA / POP (investigado 2026-08-02 — percha de ganchos, R3 aplica)

| Fecha | Evento | Nota para ganchos |
|---|---|---|
| resaca ago | **Spider-Man: Brand New Day** (estrenó 31/07: US$355M de apertura doméstica, la 2ª mayor de la historia) + **The Odyssey** de Nolan (US$911M+ en 3 findes) — juntos rompieron el récord del mayor finde de taquilla de la historia (US$430M, superando al de Endgame) | LA conversación de cine de todo agosto. Propaga: "el finde más grande de la historia del cine — qué hicieron para que TODOS hablen de lo mismo". |
| resaca ago | **Boda Taylor Swift + Travis Kelce** (3/07, Madison Square Garden, ofició Adam Sandler, ~1.000 invitados) | Resaca aún viva. Percha para Qolca vía mención del rubro bodas-eventos ("hasta la boda del año se organizó por chat…" tipo puente de una línea). |
| vie 14 ago | Estreno **PAW Patrol 3: The Dino Movie** — el viernes ANTES del Día del Niño (dom 16) | Cines y malls llenos de niños ese finde exacto = refuerza el bloque Día del Niño de CHT (niño perdido en multitud) y la fecha comercial de Propaga/Qolca. |
| vie 21–28 ago | Estrenos menores: Insidious: Out of the Further (21) · Coyote vs. Acme + re-estreno Terminator 2 (28) | Solo si algo explota; puente débil. |
| sáb 29 ago | Paulo Londra — Estadio Nacional, Lima | Estadio lleno en Lima = búsqueda local ese finde. |
| jue 3 sep | **Premios Juventud** — Marbella, España (1ª vez fuera de América; Univision/ViX; Carín León lidera con 9 nominaciones) | Pico de farándula latina de inicios de sep. |
| mié 9 sep | Helloween — Parque de la Exposición, Lima (gira 40 aniversario) | Búsqueda local ese día; audiencia metal adulta. |
| vie 11 sep | Romeo Santos + Prince Royce — Estadio Nacional, Lima · estreno **Practical Magic 2** (vuelven Sandra Bullock y Nicole Kidman) | Concierto masivo local (público adulto/parejas) + nostalgia femenina adulta el mismo finde. |
| sáb 12 sep | **Canelo Álvarez vuelve — "México contra el Mundo"** (Riad; 1ª cartelera de Canelo Promotions, rival TBD) | Conversación LatAm masculina masiva ese finde. |
| lun 14 sep | Premios Emmy | Global, moderado en ES. |
| mié 16 sep | **Nominaciones Latin Grammy** (la gala es 12/11, fuera de ventana) · Neagley, spin-off de Reacher (Prime) | El día de nominaciones ES la conversación (quién lidera, quién quedó fuera). |
| vie 18 sep | Estreno **Resident Evil** (reboot de Zach Cregger) | Audiencia gamer; puente débil salvo gancho de una línea. |
| mié 23–jue 24 sep | Robbie Williams — Arena 1, Lima | |
| vie 25 sep | **Re-estreno de Avengers: Endgame en cines** (rampa oficial de Marvel hacia Doomsday, 18/12) | Meme-able masivo; nostalgia MCU + los números de taquilla como analogía de negocio. |
| dom 27 sep | **MTV VMAs** (vuelven a Los Ángeles; simulcast CBS) + 5SOS en Lima | Pico farándula global. |
| vie 2 oct | Estreno **Digger** — Iñárritu dirige a Tom Cruise, su primera comedia, en IMAX | Cinefilia + celebrity mainstream; moderado-fuerte. |
| sáb 3 oct | Raphael — Lima | Audiencia adulta/familiar local. |
| **jue 8–vie 9 oct** | **BTS EN LIMA — Estadio San Marcos** (gira de reunión; 8 oct es feriado por Angamos) | El evento pop del trimestre en Perú: ARMYs acampando, colas, multitudes → CHT tiene ángulo REAL (multitudes/hermanitas menores en tumultos); Propaga: "qué aprende tu negocio del fandom más organizado del mundo". |
| vie 9 oct | **The Social Reckoning** (la secuela de La Red Social: la historia de Facebook continúa) + La Leyenda de Aang (familiar) — mismo finde que BTS | EL estreno del trimestre para Propaga/Qolca: una película sobre la red social donde los negocios peruanos VENDEN. Puente de una línea garantizado. |
| sáb 17 oct | Iron Maiden — Estadio Nacional, Lima (mismo día: Grupo Frontera en Lima — audiencias distintas, mismo finde de búsqueda) | |
| lun 19–jue 22 oct | Billboard Latin Music Week + **Premios Billboard de la Música Latina** (22 oct, Miami, Telemundo) | Farándula latina fuerte. |
| vie 23 oct | Estreno **Clayface** (DC — fecha corregida: NO es 11/09) + **Lupin Parte 4** (Netflix) | Doble percha pop ese finde. |
| lun 26 oct | **Balón de Oro** (Londres) | Toda la conversación fútbol ese día; ¿Yamal/Mbappé/Dembélé? |
| vie 30 oct | **Nocturne** (Apple TV+) — víspera de Halloween | Refuerza la semana Halloween si explota. |
| ~fin oct | Stranger Things: Tales from '85 T2 (animada; sin fecha, se espera cerca de Halloween) | Confirmar fecha antes de usar. |
| oct | Gaming: Call of Duty Modern Warfare 4 (oct) · Marvel's Wolverine PS5 (15 sep) · EA FC 27 (~fin sep, patrón anual, sin fecha oficial) | Audiencia joven; puente débil salvo gancho de una línea. |
| — | Demon Slayer: Infinity Castle 2 **NO sale en 2026** (confirmado Ufotable → 2027) | No anclar nada a esto. |
| continuo | Esto es Guerra / El Gran Chef Famosos siguen al aire; farándula peruana diaria es impredecible | Solo reactivo (si algo explota), no planificable. |

### Detalle prensa: Spider-Man + La Odisea (verificado 2026-08-03 — el NIVEL de profundidad que Carlos pide para todo evento grande)

Ángulos con cara de celebridad en portada (fotos CC en `eventos/spiderman/` y
`eventos/odisea/`). Regla nueva: para cada evento grande, investigar prensa a
ESTE nivel antes de escribir sus posts.

- **Sadie Sink** guardó en secreto su personaje durante TODO el press tour
  (esquivó preguntas hasta el estreno; el personaje se reveló en el estreno
  del 28/07). Contraste cómico validado por prensa: Tom Holland es famoso por
  spoilear todo. → percha "guardar secretos / manejar información".
- **Plot beats meme-ables** (ya públicos): Hulk SÍ se acuerda de Peter Parker,
  la MJ de Zendaya NO se acuerda; la chica nueva parece romance pero Peter
  sigue enamorado de MJ. → perchas de "olvidar/recordar clientes" (Qolca) y
  triángulos de atención.
- **El director Destin Daniel Cretton** calcó encuadres de los cómics
  (side-by-sides circulando en prensa/fans). → percha "copiar bien a los
  mejores" (Propaga).
- **Zendaya está en LAS DOS películas** del finde récord (MJ + Atenea). →
  percha "estar en todas partes".
- **La Odisea sin CGI**: cíclope = marioneta de 18 m subida a una colina
  griega; remolino de Caribdis = jet-skis haciendo círculos; gigantes =
  perspectiva forzada (dobles de 2.10 m contra dobles de 1.37 m — la doble de
  Damon mide 1.37). → percha "hacerlo de verdad se nota" (calidad/artesanía).
- **Matt Damon se pierde en todas sus películas** (meme consagrado: Rescatando
  al soldado Ryan, Interestelar, Misión Rescate… y ahora Odiseo 10 años
  perdido). → percha "perderse vs tener mapa" (Radar Estatal).
- **Penélope** esperó 20 años tejiendo y destejiendo; Odiseo… no fue igual de
  fiel (chiste cultural seguro, es literatura clásica). → percha
  fidelidad/constancia.
- Datos duros del finde: apertura doméstica de Spider-Man US$355M (2ª mayor de
  la historia) + finde colectivo récord US$430M. Odisea: US$911M+ en 3 findes.

### Detalle prensa: el resto del trimestre (investigado 2026-08-03, mismo nivel)

**The Social Reckoning (9 oct)** — fotos en `eventos/social-reckoning/`:
- Es la historia REAL de Frances Haugen (Mikey Madison): la empleada que se
  llevó los secretos de Facebook al Wall Street Journal ("The Facebook Files").
  Thriller, no drama de origen. Sorkin dirige.
- **Jeremy Strong (Kendall de Succession) es el nuevo Zuckerberg**; Jesse
  Eisenberg fue reemplazado y "rompió su silencio" al respecto — meta-chiste:
  ni a Zuckerberg lo recuerdan igual. Jeremy Allen White (The Bear) es el
  periodista. Bill Burr en el cast.
- Perchas: la empleada que expone todo (información/transparencia — RE) ·
  "hasta Zuckerberg fue reemplazado" (nadie es insustituible) · los archivos
  internos que hunden (lo que tu propio Excel diría de ti — Qolca).

**Re-estreno Endgame (25 sep) + rampa Doomsday (18 dic)** — foto en
`eventos/doomsday/`:
- **RDJ vuelve como el VILLANO**: Iron Man ahora es Doctor Doom (los Russo
  cuentan que su voz de Doom les dio "escalofríos"; sector de fans indignado:
  "stupid casting"). Percha de oro: tu mejor empleado/héroe vuelve como tu
  competencia.
- Endgame tuvo el finde récord que Spider-Man+Odisea acaban de romper —
  loop de datos citables entre los tres posts.

**Digger (2 oct)** — foto en `eventos/digger/`:
- **Tom Cruise irreconocible**: panza, calvicie con peinado de cortina,
  acento sureño — el hombre que salta de aviones hecho señor común. Primera
  comedia de Iñárritu; sátira de un magnate petrolero "salvador del mundo".
  El tráiler debutó en la final del Mundial.
- Perchas: hasta Cruise dejó su fórmula a los 60+ (reinventarse) · el
  billonario que causa el desastre y se vende como salvador (humo vs
  sustancia — todas las marcas B2B).

**Practical Magic 2 (11 sep)** — fotos en `eventos/practical-magic/`:
- Bullock + Kidman vuelven de brujas **28 años después**; las hijas son Joey
  King y **Maisie Williams (Arya Stark)**. Vuelven también las tías del 98
  (Channing/Wiest). Maldición familiar por resolver.
- Perchas: nostalgia femenina adulta 35-50 (la audiencia de CHT) · "las
  maldiciones familiares no se heredan si las resuelves hoy" (CHT suave) ·
  brujería vs método (Propaga: "sin brujería").

**BTS en Lima (8–9 oct)** — fotos en `eventos/bts/` (incl. la de la Casa
Blanca, dominio público):
- Contexto del regreso: los 7 completaron el servicio militar (jun 2025),
  álbum nuevo en marzo, y esta es su **primera gira mundial desde 2019**
  (la de 2020 se canceló por COVID): 79 shows, 34 ciudades. Lima = 2 noches
  en San Marcos, la primera es FERIADO (Angamos).
- Perchas: 7 tipos esperaron 2 años y volvieron más grandes (pausas que no
  matan — Propaga/Qolca) · ARMYs acampando días antes (la logística de
  esperar: CHT multitudes/hermanitas) · el fandom más organizado del mundo.

**GTA 6 (19 nov, hype todo oct)**:
- Récords citables: tráiler 2 = 475M vistas en 24h (récord mundial hasta que
  lo rompió el tráiler de Spider-Man este año); tráiler 1 = el más visto de
  la historia gamer. Rockstar calla 5 meses y el mundo habla por ellos.
- Percha Propaga: el silencio como estrategia SOLO funciona si eres Rockstar
  — tu negocio no puede desaparecer 5 meses (el contraste es el chiste).

### Capa de dinámicas y chismes (investigado 2026-08-03 — verificado, con reglas de uso)

- **Social Reckoning**: Jeremy Strong **se niega a hablar con Jesse
  Eisenberg** ("su Zuckerberg no tiene nada que ver con el mío") — el nuevo
  Zuckerberg no le habla al antiguo. Encima Strong arrastra la guerra del
  method acting con sus ex-compañeros de Succession (Brian Cox: "American
  s***"; Culkin también lo criticó). Perchas: reemplazos que no se saludan ·
  el que se mete TANTO en el personaje.
- **Practical Magic 2**: la maldición ES el gancho — **todo hombre que ama a
  una Owens muere** (premisa canónica del 98). Meta-chisme comprobable:
  Sandra Bullock declaró que Kidman está **"free and wild"** tras su
  divorcio real (finalizado ene 2026). REGLA: el chiste va a la MALDICIÓN
  ficticia y a la cita de Bullock; jamás burla directa al divorcio.
- **Doomsday**: el anuncio del cast fue un livestream de **5 horas y media
  mostrando SILLAS** (27 nombres; 55 trending topics; #1 en X por 7 horas) —
  Marvel hizo un stream de sillas y rompió internet. Vuelven los X-Men
  originales (Stewart, McKellen, Marsden, Romijn). Y la fecha se movió de
  mayo a diciembre (hasta Marvel se atrasa). Perchas: anunciar con sillas >
  anunciar gritando · hasta los X-Men salieron de su retiro.
- **Digger/Cruise**: chisme real comprobable: Cruise y **Ana de Armas**
  salieron ~9 meses (nunca lo confirmaron) y quedaron "amigos"; ella sigue
  llamándolo "mentor". Uso ligero. El ángulo fuerte sigue siendo la
  transformación (panza + cortina) — el hombre-imagen-perfecta rompiendo su
  propia imagen.
- **BTS**: dinámicas seguras — RM el líder-filósofo que habló en la Casa
  Blanca; **Jungkook** el benjamín convertido en la máquina de récords solista
  (140+ semanas en Billboard Global); Jin el mayor (34) que salió primero del
  servicio; todos volvieron JUNTOS tras el ejército y agotaron 79 shows.
  **REGLA: el caso DUI de Suga (2024, multa, scooter) NO se usa** — chisme
  negativo de persona real + audiencia ARMY = pérdida neta.
- **GTA 6**: la historia del hackeo es cine: un chico de 18 (grupo Lapsus$),
  EN LIBERTAD BAJO FIANZA y sin laptop, hackeó Rockstar **desde un hotel con
  un Amazon Fire Stick, la TV del cuarto y su celular**, filtró 90 videos y
  amenazó con soltar el código fuente. Corte lo halló responsable (hechos
  judiciales públicos, citables). Percha: si un chico con un Fire Stick tumbó
  a Rockstar, tu negocio con contraseña "123456"…

## Tendencias rodantes (sin fecha, válidas los 3 meses)

- **IA en pymes**: sigue siendo LA conversación B2B (Intuit 2026: 77% de pymes
  usa IA a diario; MIT NANDA: 95% de pilotos no llega a producción). Qolca vive
  aquí — citando terceros, nunca resultados propios (regla Qolca).
- **WhatsApp como canal de venta** en LatAm: evergreen de Qolca.
- **Mundial 2026 resaca**: terminó el 19 de julio; los memes y "lecciones de"
  siguen vivos unas semanas más de agosto.
- **Búsqueda > audio trending**: los captions siguen keyword-first (verdicto
  ronda 1: audio trending −59%, búsqueda +114%).

## Cómo usar este calendario en el plan de 90

- ~35–40% de los posts anclados a fecha (los bloques: Alzheimer sep, Mes
  Morado oct, simulacros, Día del Niño, Halloween, rampa Cyber Wow). El resto
  evergreen — el calendario da la CADENCIA de publicación, no el 100% del tema.
- Los bloques se publican EN los días previos a la fecha (la búsqueda ocurre
  antes del día, no después). Regla práctica: post anclado sale 2–5 días antes.
- Fechas religiosas (Mes Morado, Santa Rosa): informativo/empático, sin chistes.
- Siguiente paso (pendiente): rediseño de ganchos — más curiosidad/gracia —
  sobre esta percha. No escrito aún.

Fuentes de verificación (2026-08-02): INDECI vía prensa (simulacros 14/08 y
13/10), calendarios Perú (Día del Niño 16/08, Adulto Mayor 26/08, Familia
13/09), ADI (mes/día mundial del Alzheimer), MacRumors/Forbes (evento Apple
8–9/09), Rockstar vía prensa (GTA 6 → 19/11), IAB Perú (Cyber Wow 2–5/11).

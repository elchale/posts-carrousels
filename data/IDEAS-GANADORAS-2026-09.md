# IDEAS GANADORAS — minería de cuentas TikTok por nicho (2026-09-01)

Banco de **temas, ganchos verbatim y mecánicas** de las cuentas que hoy revientan
en los 7 nichos de nuestras marcas. Objetivo: mejorar los ~190 posts pendientes.
**No se tocó ningún post** — este documento es solo el insumo.

---

## 0 · Método y honestidad de los números

**Todos los números de views salen de la API del propio TikTok**, capturada con
`tools/tiktok_scan.mjs` (Playwright + Chrome real): se navega al perfil y se
interceptan las respuestas de `api/post/item_list`, que traen `playCount`,
`diggCount`, `collectCount` y `shareCount` por post. Fecha de captura:
**2026-09-01 / 09-02**. Cero cifras estimadas o de memoria.

**Cómo se descubrieron las cuentas** (la parte cara):
- `tikwm.com/api/?url=<post>` → funciona por curl **si mandas User-Agent de
  navegador**; sin UA cae en el challenge de Cloudflare. Devuelve play_count,
  digg, comment, share + `images[]` en photo posts. **Es la única vía para leer
  la lámina 1 de un carrusel de fotos** (bajas `images[0]` y la lees).
- `tikwm.com/api/user/posts` y `/api/feed/search` están **bloqueados por
  Cloudflare** (GET y POST, con y sin UA). `/api/feed/list?region=PE` sí responde.
- El **buscador y las páginas de hashtag de TikTok** (`/search?q=`, `/tag/`)
  devuelven cuerpo vacío + captcha para sesión no logueada, incluso con Chrome
  real. Los perfiles sí son públicos → el escaneo por perfil es la vía fiable.
- Descubrimiento de handles: **urlebird.com/hash/<tag>/** (200 OK por curl,
  entrega handle + id de video + views + título por tarjeta). Se minaron **65+
  hashtags en 3 rondas** → 1.475 posts → se rankearon los handles → 52 perfiles
  escaneados a fondo.

**Límites que hay que respetar al citar esto:**
- La *mediana* y el *p90* son de la **muestra visible en el grid del perfil**
  (últimos 25-74 posts, incluidos fijados), no del historial completo. Sirven
  para comparar cuentas entre sí, no como "promedio histórico".
- `followerCount` solo se capturó en algunos perfiles (lo trae el blob inicial,
  que a veces no llega). Donde no hay, se marca "n/d" en vez de inventarlo.
- Un `max` gigante muy viejo (2021-2023) suele ser un pico irrepetible: la
  **mediana manda**, no el máximo.

---

## 1 · Tabla maestra (todo verificado vía API de TikTok)

`FOTO` = cuántos de los posts de la muestra son publicaciones de fotos
(carrusel), es decir **formato directamente imitable por nosotros**.

| # | Cuenta | Nicho | n | FOTO | Mediana | p90 | Máx |
|---|---|---|---:|---:|---:|---:|---:|
| 1 | @alex_thevet | mascotas EN | 47 | 2 | 41.300 | 1.100.000 | 2.700.000 |
| 1 | @ipet_place | mascotas ES | 47 | 0 | 6.456 | 225.200 | 1.100.000 |
| 1 | @the_chapaws | mascotas EN | 50 | 0 | 16.600 | 96.700 | 36.400.000 |
| 1 | @animalia.petinsurance | mascotas EN | 27 | 5 | 769 | 48.300 | 102.800 |
| 1 | @pet_id.sv | **competidor directo** ES | 25 | 8 | 1.274 | 6.560 | 864.500 |
| 1 | @busquedademascotas | perdidos ES/PE | 27 | 0 | 610 | 1.014 | 2.569 |
| 1 | @barkerfun | mascotas EN | 26 | 0 | 805 | 675.100 | 979.200 |
| 2 | @charliemidoctor | niños ES | 27 | 0 | **255.900** | 1.100.000 | 4.000.000 |
| 2 | @cathypedrayes | familia EN | 74 | 1 | 13.700 | 269.800 | 36.900.000 |
| 2 | @marlopez_pediatra | niños ES | 26 | **11** | 11.600 | 830.600 | 2.300.000 |
| 2 | @freddybastidass | crianza ES | 47 | 0 | 22.200 | 169.400 | 2.400.000 |
| 2 | @thebodysafetyexpert | protección EN | 72 | 0 | 4.656 | 46.400 | 4.400.000 |
| 2 | @thelifesafetypro | primeros auxilios EN | 48 | 3 | 464 | 26.200 | 623.600 |
| 2 | @karenarias.g | mamá ES/US | 27 | 2 | 6.087 | 585.500 | 1.600.000 |
| 2 | @safetygirl_oficial | seguridad ES | 27 | 6 | 1.965 | 2.500.000 | 7.500.000 |
| 2 | @la_seguraa | mega ES/CO | 32 | 0 | 978.100 | 4.600.000 | 8.500.000 |
| 3 | @protofy_xyz | automatización ES | 50 | 0 | 88.000 | 1.500.000 | 9.200.000 |
| 3 | @giancarlovende | vendedor ES/CO | 47 | 0 | 28.000 | 230.000 | 680.100 |
| 3 | @gbiperu | negocio PE | 50 | 0 | 7.041 | 155.500 | 500.000 |
| 3 | @crmbestie | CRM/ops EN | 48 | 0 | 3.871 | 16.500 | 83.900 |
| 3 | @nexora.iam | automatización ES | 53 | 1 | 1.871 | 21.600 | 243.700 |
| 3 | @automatizateya | automatización ES | 26 | 0 | 624 | 30.900 | 57.700 |
| 4 | @luzzidigital | marketing ES | 26 | 2 | 57.900 | 1.900.000 | 9.900.000 |
| 4 | @kari.tipsdemkt | marketing ES/MX | 71 | 0 | 36.100 | 664.100 | 5.600.000 |
| 4 | @estefaniamarketing | contenido ES | 50 | 0 | 22.900 | 124.600 | 3.300.000 |
| 4 | @bifunnels | marketing ES | 26 | 5 | 1.978 | 36.200 | 312.900 |
| 4 | @markdigital.conandre | infoproductos ES | 39 | 1 | 2.458 | 24.600 | 120.600 |
| 5 | @datero.pe | datos PE (adyacente) | 25 | 0 | **174.100** | 624.700 | 3.100.000 |
| 5 | @feliperamirezjj | SECOP2 CO | 27 | 2 | 3.832 | 126.500 | 283.900 |
| 5 | @jorgehbeltranp | contratación CO | 68 | 0 | 2.998 | 46.800 | 432.500 |
| 5 | @consultoraoriente | normativa EC | 12 | 0 | 9.363 | 60.100 | 372.300 |
| 5 | @colombiacompraeficiente | **agencia oficial** CO | 46 | 0 | 879 | 4.090 | 4.421 |
| 5 | @iec.peru | licitaciones PE | 27 | 2 | 758 | 17.400 | 10.200.000 |
| 5 | @luisalbertoandradepolan | contratación EC | 47 | 9 | 586 | 1.826 | 49.000 |
| 5 | @bial.licitaciones | licitaciones CO | 5 | 0 | **208** | 638 | 638 |
| 6 | @cataveiga_ | formación online ES | 74 | 0 | 41.900 | 268.000 | 6.500.000 |
| 6 | @erikaindigital | productos digitales IT | 74 | 0 | 3.567 | 36.800 | 482.900 |
| 6 | @nike_endars | universidad ID | 48 | 6 | 4.346 | 19.400 | 56.700 |
| 7 | @cleaningwithida | cleantok EN | 48 | 3 | **744.000** | 2.700.000 | 20.500.000 |
| 7 | @ourwintonhome | hogar/DIY EN | 27 | 0 | 67.400 | 2.500.000 | 7.800.000 |
| 7 | @lazblinds | producto único EN | 51 | 0 | 36.600 | 1.100.000 | 10.300.000 |
| 7 | @shop.with.caroline | finds EN | 71 | 0 | 28.900 | 163.900 | 525.900 |
| 7 | @tamarabradshaw_home | hogar/DIY EN | 49 | 0 | 26.500 | 123.100 | 14.400.000 |
| 7 | @mackenzie.nadeau | **Amazon FOTO** EN | 48 | **43** | 11.800 | 100.600 | 258.300 |
| 7 | @scarletts.socials | UGC/freelance EN | 19 | 1 | 2.515 | 6.741 | 233.800 |


---

# NICHO 1 · Mascotas perdidas / seguridad de mascotas → **ComeHomeTag**

## Las cuentas

| Cuenta | Formato | Banda (mediana → p90) | Qué es |
|---|---|---|---|
| **@alex_thevet** | VIDEO (idea transportable) | 41.300 → 1.100.000 | Veterinario UK. El referente absoluto del nicho. |
| **@ipet_place** | VIDEO | 6.456 → 225.200 | Tienda de mascotas ES/CO. El análogo hispano. |
| **@the_chapaws** | VIDEO | 16.600 → 96.700 | Dos huskies escapistas. Entretenimiento con tema fuga. |
| **@pet_id.sv** | **FOTO** (8/25) | 1.274 → 6.560 (máx 864.500) | **Competidor directo**: placas QR de identificación, El Salvador. |
| **@animalia.petinsurance** | VIDEO + 5 FOTO | 769 → 48.300 | Seguro de mascotas. Marca haciendo educación de riesgo. |
| **@busquedademascotas** | VIDEO | 610 → 1.014 | Alertas de perdidos en Perú. **La banda real del "se perdió"**. |

### El hallazgo incómodo del nicho

Las cuentas de **búsqueda de mascotas perdidas** (@busquedademascotas: 27 posts,
mediana 610, máximo 2.569) **no tienen alcance**. El contenido de "SE BUSCA" es
servicio, no distribución. En cambio la **salud y el comportamiento del perro
vivo** (@alex_thevet, mediana 41.300) sí revienta. Conclusión para ComeHomeTag:
el nicho que reparte views no es "perdido", es **"tu perro te está avisando algo
y no lo sabes"**.

Y el dato que más duele: el post más grande del competidor directo
(@pet_id.sv — **864.500 views, 37.500 compartidos**) no es educativo. Es **una
foto del chihuahua sosteniendo su propio carnet** — formato cédula nacional, con
foto, nombre, raza, sexo, fecha de nacimiento y nombre del dueño — y el caption
completo es **"Tan bonito"**. El producto ES el contenido. Sus posts educativos
("No dejes a tu mascota sin identificación", "Identificar a tu mascota es
decirle cuánto lo amas") viven en 1.200-1.600 views.

## Las 10 ideas/temas que funcionan

1. **Ranking de razas por salud real, dicho por un veterinario.**
   *"As a vet, I ranked popular cat breeds by how healthy they actually are"* —
   **2.700.000**. Versión perro: **1.600.000**. Parte 2: 581.200. Parte 3:
   377.700. Todas las partes salen de lo que pidieron en comentarios.
2. **Un signo vital medible en casa que adelanta un diagnóstico.** *"Your dog's
   breathing rate could be flagging heart disease weeks before they seem
   unwell"* — **1.500.000**, 46.900 guardados.
3. **"Tu animal esconde el dolor por instinto".** *"Dogs are wired to hide pain
   […] a dog in real discomfort rarely cries or limps dramatically"* — 165.600.
4. **La causa banal de un problema crónico.** *"Long nails might be the reason
   your dog's slowing down"* — 500.500.
5. **Las cosas de tu gato que casi nadie entiende.** *"Cats are probably the
   animal humans find hardest to read"* — **1.400.000**.
6. **La respuesta honesta a la pregunta polarizada.** *"'Should I neuter my dog?'
   The honest answer frustrates people: it depends"* — 396.900.
7. **Denunciar un formato viral cruel.** *"There's a whole subgenre of viral pet
   content that only works because the pet is actually upset"* — 296.700.
8. **El síntoma asqueroso que sí significa algo.** *"¿Tú ya sabías que el color
   de vómito de tu perro sí tiene significado y puede avisarte sobre alguna
   enfermedad?"* (@ipet_place) — **1.100.000**, 7.589 compartidos.
9. **La pregunta-encuesta de raza.** *"Y tú ¿qué raza de perro no tendrías
   nunca?"* — 288.300.
10. **El objeto de juego que es un arma.** *"Think throwing a stick is the
    ultimate bonding experience with your pup? Think again"* — 102.800.

**Bonus sobre fuga (nuestro tema exacto), verbatim de @the_chapaws:**
*"The cops were called when our door opened while we were out and Bossman ran
out. We were lucky he ran into good Samaritans"* — 292.000. Y la instalación de
la cerca invisible como suspenso (*"will it work?"*) — 36.400.000.
**La fuga funciona como suspenso, no como advertencia.**

## Las 3 mecánicas repetibles

1. **Autoridad + ranking + serie alimentada por comentarios.** "As a vet, I
   ranked X by how healthy they actually are" → partes 2 y 3 construidas
   literalmente con las razas que pidieron en los comentarios de la parte 1. Un
   tema, cinco posts, cada uno con público precalentado.
2. **El síntoma que el dueño puede observar HOY.** Respiración, uñas, color del
   vómito, cómo camina. No es "cuida a tu perro": es "mira esto esta noche". Por
   eso los guardados son enormes (46.900 en un solo post).
3. **El producto fotografiado como objeto deseable, sin explicar nada.** El
   carnet del perro con cara de cédula. Se comparte el objeto, no el argumento.

## Qué de esto NO estamos haciendo (vs. `comehometag/posts/sep.json`)

- **Todo nuestro bloque de mascotas asume la pérdida ya ocurrida o inminente**
  ("Tu afiche de «SE PERDIÓ» no se lee desde un auto", "Encontraste un perro
  suelto, ¿y ahora qué?", "La chapita de tu perro ya no se lee"). Ese es
  exactamente el terreno de @busquedademascotas: **mediana 610**.
- **Cero contenido de perro sano.** No hay un solo post del tipo "esto que hace
  tu perro significa X". Es el 100% del catálogo de @alex_thevet y el 1.100.000
  de @ipet_place.
- **Cero series numeradas con partes pedidas en comentarios.** Nuestros posts
  son unidades sueltas; ellos encadenan 3-5 posts sobre el mismo tema.
- **Cero foto de producto como pieza emocional.** Tenemos láminas explicando la
  placa; no tenemos la foto del perro con SU carnet y un caption de dos palabras
  — lo único que le funcionó al competidor directo (864.500 / 37.500 shares).
- **Cuatro portadas nuestras abren con cifra** ("1 de cada 5 mascotas perdidas se
  fue por un ruido", "La mitad de los perros perdidos no llevaba nada puesto",
  "3 de cada 4 gatos aparecen a menos de 500 metros"). Ninguna cuenta ganadora
  del nicho abre con estadística: abren con **un comportamiento observable**.

---

# NICHO 2 · Seguridad de niños para papás → **ComeHomeTag (bloque niños/abuelos)**

## Las cuentas

| Cuenta | Formato | Banda | Qué es |
|---|---|---|---|
| **@charliemidoctor** | VIDEO | **255.900** → 1.100.000 | Pediatra MX. La mediana más alta del estudio en registro educativo. |
| **@cathypedrayes** | VIDEO | 13.700 → 269.800 | "I help families navigate safety". El modelo de ComeHomeTag en EN. |
| **@marlopez_pediatra** | VIDEO + **11/26 FOTO** | 11.600 → 830.600 | Pediatra ES. **La cuenta más imitable: casi mitad carruseles.** |
| **@freddybastidass** | VIDEO | 22.200 → 169.400 | Crianza y valores. 18.200 compartidos en un post. |
| **@thebodysafetyexpert** | VIDEO | 4.656 → 46.400 | Prevención de abuso infantil, con papers citados. |
| **@thelifesafetypro** | VIDEO | 464 → 26.200 | Bombero/paramédico. Caso de estudio de newsjacking normativo. |
| **@karenarias.g** | VIDEO | 6.087 → 585.500 | Mamá de 4, US. Dueña del formato "kit de emergencia". |

## Las 10 ideas/temas que funcionan

1. **"Enseñamos a los niños a no mentir y olvidamos enseñarles a quién NO le
   deben la verdad".** *"We spend years teaching kids not to lie… and forget to
   teach them who they don't owe the truth to. Kids should know they can lie to
   strangers asking invasive questions"* — 113.200 con **11.200 compartidos**.
   Versión ES: *"Situaciones en las que deberías de mentir"* (@safetygirl_oficial)
   — **2.700.000**, 25.400 compartidos.
2. **El kit de emergencia armado en cámara, por edad.** @karenarias.g: *"quise
   prepararle algo especial […] su primer kit de emergencia para preadolescente"*
   — **1.600.000**. El del hijo de 15: 196.400. El porqué: 585.500. Y
   @la_seguraa: *"Aquí les dejo el KIT DE EMERGENCIA para terremotos que armé en
   mi casa"* — **1.300.000**, 11.800 guardados.
3. **La regla absoluta, sin matices.** *"There is no safe version of leaving a
   child in the car. Shade ❌ Cracked window ❌ It's just a minute ❌"* — 140.000.
4. **"Nunca recibas esto de segunda mano".** *"Never pick up a used car seat. It
   could be expired […] you don't know the history"* — 401.800.
5. **Cambió el protocolo oficial: ¿sabes los pasos NUEVOS?** *"If your child
   started choking tonight… would you know the new steps? The 2025 AHA guidelines
   now recommend repeated cycles of 5 back blows and 5 abdominal thrusts"* —
   **623.600** en una cuenta con **mediana 464**.
6. **El mito de cómo se ve el peligro real.** *"Trafficking doesn't always look
   like what you see in movies or viral posts"* — 456.000.
7. **La estadística que reencuadra quién es el agresor.** *"child on child SA
   makes up at least 30% […] of all CSA cases"* — **4.400.000**, con la fuente
   escrita en el propio caption (Cotter & Beupre, 2013).
8. **Corregir la reacción de pánico del papá.** *"¿Si le pasa esto a tu peque
   tienes que hacer una RCP? ¡Y la respuesta es que no!"* (@marlopez_pediatra) —
   570.700. Y *"PALOMITAS: ALTO RIESGO DE ATRAGANTAMIENTO"* — **2.300.000**,
   19.600 compartidos.
9. **La cosa "protectora" que es peligrosa.** *"Muchos padres colocan una muselina
   sobre el carrito para 'proteger del sol', pero esto puede ser muy peligroso"*
   — 830.600. Y *"STOP Relying on a Window Screen to Protect Your Child"* — 26.200.
10. **La pausa de 9 segundos contra la estafa.** *"Scammers want you to respond
    fast. That's part of their strategy, so taking a 9 second pause might be all
    you need to slow down"* — 269.800.

**Portadas VERBATIM de los carruseles de foto de @marlopez_pediatra** (leídas
bajando `images[0]` con tikwm — es el formato que copiamos tal cual):

- **"MINI GUÍA / BEBÉS EN VERANO"** — 17.400, 10 láminas
- **"HORARIOS / POR EDADES"** — 11.600, 9 láminas
- **"CASOS REALES / ¿SABES QUÉ ES ESTO?"** — 8.556, 8 láminas

Dos palabras enormes + una línea de subtítulo. **Ninguna portada es una frase
larga.** Las nuestras son frases completas de 8-12 palabras.

## Las 3 mecánicas repetibles

1. **Newsjacking de la NORMA, no de la noticia.** @thelifesafetypro tiene mediana
   464. Entre el 10 y el 14 de diciembre de 2025 publicó cinco posts sobre el
   cambio de guías AHA 2025 y sacó **623.600 / 128.600 / 72.500 / 61.000 /
   17.200**. El motor no fue él: fue que **cambió el protocolo**. Misma mecánica
   que @consultoraoriente en el nicho 5.
2. **Personaje fijo + fórmula de apertura idéntica.** @charliemidoctor abre TODOS
   sus posts con *"Hola 👋🏼 Soy Charlie 👨🏽‍⚕️. ¿[la pregunta que el papá se hizo
   anoche]?"*. Con esa fórmula sostiene **mediana 255.900** sobre 27 posts. La
   repetición del formato es el activo, no la variedad.
3. **Objeto físico que se arma en cámara.** El "kit de emergencia" funciona
   porque una lista se convierte en algo que existe. Se guarda porque hay que ir
   a comprarlo. Tres cuentas distintas, mismo formato, las tres por encima del
   millón.

## Qué de esto NO estamos haciendo

- **Nada se arma, todo se explica.** Nuestros 18 posts de niños/abuelos son
  reglas y listas ("3 respuestas que tu hijo tiene que dar hoy", "4 cosas que
  crees que cuidan a tu hijo"). Ningún post produce un **objeto** — y el kit de
  emergencia es la idea más replicada y más grande del nicho (1.6M / 1.3M / 585K).
- **No tenemos personaje ni fórmula de apertura.** Cada portada es una frase
  distinta. @charliemidoctor sostiene 255.900 de mediana con la MISMA primera
  línea siempre.
- **No vigilamos cambios de protocolo.** Ninguna de las 5 marcas tiene la rutina
  de "¿cambió esta semana una norma que afecta a mi audiencia?" — y ese es el
  mecanismo que sacó 623.600 de una cuenta de 464 de mediana.
- **Nuestro post 20 tiene el registro correcto y está solo.** "La palabra secreta
  no va a salvar a tu hijo" es exactamente el tono de Cathy Pedrayes. Es 1 de 30.
- **Cero permiso.** El gancho más compartido del nicho (11.200 shares) le da al
  papá **permiso** para algo prohibido ("tu hijo puede mentir"). Nuestros 18
  posts solo reparten tareas.

---

# NICHO 3 · Ventas por WhatsApp / ordenar tu negocio → **Qolca**

## Las cuentas

| Cuenta | Formato | Banda | Qué es |
|---|---|---|---|
| **@protofy_xyz** | VIDEO | **88.000** → 1.500.000 | Taller de makers en España automatizando su propio taller. |
| **@giancarlovende** | VIDEO | 28.000 → 230.000 | Vendedor de iPhone en Colombia. Negocio real filmado a diario. |
| **@gbiperu** | VIDEO | 7.041 → 155.500 | Importaciones desde China para PYMES peruanas. |
| **@crmbestie** | VIDEO (EN) | 3.871 → 16.500 | Admin de Salesforce. Humor de oficina + IA. |
| **@nexora.iam** | VIDEO | 1.871 → 21.600 | Automatización con IA para YouTube. |
| **@automatizateya** | VIDEO | 624 → 30.900 | n8n / NotebookLM en español. |

### El hallazgo del nicho

**No existe una cuenta grande de "ordena tus ventas por WhatsApp" en español.**
Lo que existe y funciona es una capa arriba: **automatización mostrada como obra
física** (@protofy_xyz, mediana 88.000) y **el negocio real filmado por dentro**
(@giancarlovende, mediana 28.000). Las cuentas que enseñan automatización como
concepto —@automatizateya (mediana 624), @nexora.iam (1.871)— están al fondo.
Es exactamente el hueco de Qolca, pero **no se llena explicando el proceso: se
llena mostrando el proceso arreglado funcionando**.

## Las 10 ideas/temas que funcionan

1. **La serie con día numerado, sin fecha de fin.** *"Día 12 automatizando
   nuestro taller, hoy os presentamos a Protofito"* — **1.700.000**. Día 14:
   1.200.000. Día 16: 492.100. Día 25: 575.200. Día 27: 420.700. **Un solo
   proyecto, 27+ posts, todos por encima de 400K.**
2. **La automatización que impide un error humano concreto.** *"Lucas lleva 23
   días intentando que ningún becario use las herramientas del taller sin cumplir
   las normas de seguridad. Ahora la sierra no funciona con la puerta abierta"* —
   584.300.
3. **La automatización que ya existía pero era tonta.** *"Las plantas ya se
   regaban solas, pero siempre a la misma hora, necesitaran agua o no. Así que
   hemos añadido un sensor"* — 575.200. **Automatizar mal ≠ automatizar.**
4. **El día en la vida del que vende de verdad.** *"Otro día siendo el vendedor
   número 1 de todo Colombia en la venta de iPhone"* — 680.100; y la variante
   repetida ocho veces más, entre 93.900 y 355.200.
5. **"¿Por qué todo el mundo le quiere comprar a X?"** — 219.600. El post que
   explica el diferencial del negocio, contado en tercera persona.
6. **El cliente estafado y cómo se le ayudó.** *"Estafaron con un iPhone a este
   cliente, por favor no caigan en este tipo de estafas"* — 116.900.
7. **El error que te cuesta plata en aduanas/proveedores.** *"DEJA DE PAGAR EL
   TRIPLE por tus MÁQUINAS"* — 173.600. *"Ni tu CASERO del Centro lo sabe"* —
   379.700. *"ADUANAS nos INMOVILIZÓ una importación"* — 82.800.
8. **Empezar chico.** *"IMPORTA desde PEQUEÑAS CANTIDADES"* — 155.500. *"¿No
   tienes DINERO para IMPORTAR?"* — 55.800.
9. **El humor de estar dentro del sistema.** *"Oooohhh you haven't logged into
   Salesforce since 2021? It's ok, I won't tell anyone"* — 83.900. *"If it's not
   in Salesforce, I can't help you pal"* — 34.500.
10. **El script que corre solo y factura.** *"Escribí 50 líneas de Python. Lo
    subo en modo background. Cada día corre solo. […] $200/mes automáticos"* —
    54.700, con **2.245 guardados** sobre 2.537 likes (ratio de guardado ~88%).

## Las 3 mecánicas repetibles

1. **Serie de día numerado sobre UN proyecto largo.** "Día N automatizando el
   taller hasta que sea de la NASA". El espectador vuelve por la continuidad, no
   por el tema. Es la mecánica de mayor mediana de todo el estudio en este nicho.
2. **Mostrar el sistema, no el concepto.** Protofy nunca dice "automatiza tus
   procesos": enseña una sierra que no enciende con la puerta abierta. El
   beneficio se deduce solo.
3. **El negocio propio como telenovela.** @giancarlovende publica el mismo post
   ("otro día siendo el vendedor número 1") una y otra vez y sostiene 28.000 de
   mediana. **La repetición del claim ES el posicionamiento.**

## Qué de esto NO estamos haciendo (vs. `qolca/posts/sep.json`)

- **Nuestros 30 posts son 30 diagnósticos distintos del mismo dolor**, cada uno
  autocontenido ("Tu negocio corre en un cuaderno y en tu memoria", "El que te
  escribió anoche ya escribió a otro", "Dos personas apuntaron la misma hora en
  tu agenda"). Cero continuidad, cero serie. La mecánica #1 del nicho es
  precisamente la continuidad.
- **Nunca enseñamos un sistema funcionando.** Todo es descripción del problema y
  una regla ("Lo que se repite, se automatiza"). Protofy enseña el "después"
  en movimiento; nosotros describimos el "antes" en texto.
- **Cero clientes reales, cero caso.** @gbiperu vive del "a este cliente le pasó
  esto", @giancarlovende del cliente estafado al que ayudó. Nosotros no tenemos
  ni un post con un negocio concreto.
- **Cero "empezar chico".** El nicho premia "hazlo con lo poco que tienes"
  (155.500 y 55.800 en @gbiperu). Todos nuestros posts asumen que primero hay
  que auditar y ordenar todo.
- **El post 05 ("Automatizar no sirve si tu proceso está roto") es el único que
  coincide con el ángulo ganador de Protofy** (automatizar mal ≠ automatizar,
  575.200). Está enterrado entre 29 posts de diagnóstico.

---

# NICHO 4 · Marketing para emprendedores → **Propaga**

## Las cuentas

| Cuenta | Formato | Banda | Qué es |
|---|---|---|---|
| **@luzzidigital** | VIDEO + 2 FOTO | **57.900** → 1.900.000 | La referencia que ya teníamos. Herramientas + IA. |
| **@kari.tipsdemkt** | VIDEO | 36.100 → 664.100 | MX. **La mejor idea repetible de todo el estudio.** |
| **@estefaniamarketing** | VIDEO | 22.900 → 124.600 | ES. Serie semanal de curaduría. Guardados enormes. |
| **@bifunnels** | VIDEO + 5 FOTO | 1.978 → 36.200 | Marketing para emprendedoras. Prompts y estructuras. |
| **@markdigital.conandre** | VIDEO | 2.458 → 24.600 | Trabajo remoto / infoproductos. |

## Las 10 ideas/temas que funcionan

1. **"Súbanle el sueldo al de marketing de [MARCA]".** La serie entera de
   @kari.tipsdemkt: analizar la campaña real de una marca conocida como si fuera
   chisme. GAP × Young Miko — **1.900.000**. Netflix — **1.600.000**. Viva
   Aerobus llevando al abuelito — 854.200. McDonald's con el CEO — 664.100. OXXO
   temporada futbolera — 374.800. Dr. Pepper — 338.800. Miu Miu PR kit — 294.000.
   **Marketing enseñado como noticia de marca, no como consejo.**
2. **"Los mejores HOOKS que he visto esta semana en redes sociales".**
   @estefaniamarketing, semanal: 124.600 / 103.700 / 100.100 / 73.500. Guardados
   de 8.578, 5.091, 5.801, 4.663 — **el ratio guardado/like más alto del estudio**.
3. **"Los 3 mejores contenidos que he visto esta semana y que puedes adaptar a tu
   propia cuenta"** — 503.100.
4. **La herramienta secreta de la plataforma.** *"Creative insights de TikTok 🔎
   La herramienta para encontrar lo que buscan los usuarios"* (@luzzidigital) —
   **9.900.000**, 195.100 guardados. *"Sticker secreto de Instagram 🤫"* —
   **3.400.000**.
5. **Newsjacking de la plataforma.** Portada verbatim de un carrusel de fotos de
   @luzzidigital: **"ACTUALIZACIÓN / Instagram cambia su logotipo y es furor en
   redes sociales"**.
6. **La guía completa de una herramienta nueva, en serie por capítulos.** *"Te
   expliqué Claude desde cero: las 3 formas de usarlo"* — **1.700.000**, 80.900
   guardados. Parte 3 — 64.300.
7. **"Vas a publicar todos los días de este verano con esta estrategia paso a
   paso"** — 538.900, **43.400 guardados**. Estrategia atada a una estación.
8. **Los contenidos de ESTE mes, publicados el día 1.** *"1 de agosto ☀️ Los
   contenidos de este mes"* — 76.700, 5.878 guardados.
9. **Detalle de diseño concreto y copiable.** *"Estas son mis 5 combinaciones de
   tipografías favoritas"* — 346.500, **23.800 guardados**.
10. **La estructura del video que vende, numerada.** *"1️⃣ Hook […] 2️⃣
    Storytelling […]"* (@bifunnels) — 36.200 con 2.099 guardados; y el post de
    prompts literales — 44.500 con 1.410 guardados.

## Las 3 mecánicas repetibles

1. **Curaduría semanal con nombre propio.** "Los mejores hooks de la semana" /
   "Súbanle el sueldo al de marketing de X". Un contenedor fijo que se puede
   llenar infinitamente y que el seguidor espera. Es lo que sostiene medianas de
   22.900 y 36.100 **sin depender de tener una idea nueva cada día**.
2. **Analizar a un tercero grande en vez de aconsejar al seguidor.** Nadie da
   consejo: se comenta lo que hizo GAP, Netflix, OXXO. El emprendedor aprende
   mirando por encima del hombro. Cero olor a venta y techo de views altísimo.
3. **Entregar algo copiable literal.** Prompts escritos completos, combinaciones
   de tipografías, la estructura numerada. Los guardados son la moneda: 43.400,
   23.800, 8.578 en cuentas de 22.900 de mediana.

## Qué de esto NO estamos haciendo (vs. `propaga/posts/sep.json`)

- **Aconsejamos siempre en segunda persona y nunca comentamos a un tercero.**
  Nuestros 30 posts son "4 errores de tu perfil", "4 cierres de caption", "Tu bio
  en 3 líneas". La mecánica de mayor techo del nicho (1.9M) es exactamente la
  contraria: hablar de la campaña de OTRO.
- **Cero contenedor recurrente.** No tenemos ninguna serie con nombre que se
  repita cada semana. Es lo que sostiene a las dos cuentas de mayor mediana.
- **Damos reglas, no material copiable.** "4 primeras líneas que frenan el dedo"
  describe; @estefaniamarketing muestra los cinco hooks reales que vio esa semana
  y se lleva 8.578 guardados.
- **Nuestro bloque de "autogoles" (posts 13-17) es lo más cercano al registro
  ganador**, pero apunta al seguidor ("Contestas rápido y lo pierdes con «al
  privado»") en vez de a una marca observable.
- **Solo 3 de 30 posts están anclados a fecha** (primavera ×2, cierre de mes).
  El nicho ancla constantemente: "todos los días de este verano", "1 de agosto,
  los contenidos de este mes".

---

# NICHO 5 · Licitaciones / venderle al Estado → **Radar Estatal**

## Las cuentas

| Cuenta | Formato | Banda | Qué es |
|---|---|---|---|
| **@datero.pe** | VIDEO | **174.100** → 624.700 | PE. Rankings de datos. **Adyacente, y el que más views mueve.** |
| **@feliperamirezjj** | VIDEO + 2 FOTO | 3.832 → 126.500 | CO. La vida del contratista del Estado, en clave de humor. |
| **@jorgehbeltranp** | VIDEO | 2.998 → 46.800 | CO. Abogado de contratación pública. El experto individual. |
| **@consultoraoriente** | VIDEO | 9.363 → 60.100 | EC. Cambios normativos y tributarios. |
| **@iec.peru** | VIDEO + 2 FOTO | 758 → 17.400 | PE. Academia de licitaciones. |
| **@colombiacompraeficiente** | VIDEO | **879** → 4.090 | **La agencia oficial.** 46 posts, ni uno pasa de 4.421. |
| **@luisalbertoandradepolan** | VIDEO + 9 FOTO | 586 → 1.826 | EC. Abogado. |
| **@bial.licitaciones** | VIDEO | **208** → 638 | CO. Consultora. **El espejo de lo que estamos escribiendo.** |

### Los tres hallazgos del nicho

**a) El nicho es real pero pequeño, y el techo lo ponen las personas, no las
instituciones.** La agencia oficial de compras públicas de Colombia, con toda su
autoridad, tiene **mediana 879 y máximo 4.421 en 46 posts**. El abogado
individual @jorgehbeltranp llega a **432.500**. La marca institucional no compra
alcance.

**b) Lo que revienta no es el procedimiento: es el CAMBIO de norma con fecha.**
Los picos de @jorgehbeltranp son todos ley de garantías electorales:
*"¿Qué debe quedar listo hoy de cara al inicio de las restricciones de la ley de
garantías?"* — 142.800. *"tips para celebrar contratos directos en este mes de
enero 2026"* — 129.800. *"Aquí les compartimos algunos tips para aplicar
adecuadamente la ley de garantías electorales que inicia a partir del próximo 29
de junio"* — 96.900. Partes 2 y 3 de la misma norma: 46.800 y 32.000.
Lo mismo en Ecuador con @consultoraoriente: *"Se elimina el certificado de
cumplimiento de la UAFE para etapa de entrega de ofertas, registro oficial nro
600"* — 43.800; *"Los RIMPE negocio popular no pagan los 60 dólares"* — 372.300.

**c) El contenido genérico de licitaciones tiene una banda conocida: 170-640
views.** @bial.licitaciones publica exactamente lo que publicamos nosotros:
*"3 errores que pueden dejar su propuesta fuera de una licitación pública"* —
179. *"¿Cuánto de lo que ha escuchado sobre las licitaciones es realmente
cierto? Desmentimos los mitos más comunes"* — 220. *"¿Sabía que muchas empresas
pierden licitaciones por errores que pueden evitarse?"* — 208. **Cinco posts,
máximo 638.**

## Las 10 ideas/temas que funcionan

1. **La norma que entra en vigor y la fecha límite para prepararse.** *"¿Qué debe
   quedar listo HOY de cara al inicio de las restricciones?"* — 142.800.
2. **La serie de partes sobre una sola norma, respondiendo dudas del post
   anterior.** *"Aquí les respondo algunas de las inquietudes acerca del video
   anterior sobre ley de garantías y su aplicación a las ESE, las ESAL…"* —
   46.800. Parte 3 — 32.000. Parte 4 — 30.200.
3. **La tabla de honorarios / cuánto se paga.** *"Las tablas de honorarios de
   contratistas del Estado son una de las herramientas que permiten objetivizar
   los valores a pagar"* — 33.200. Y @datero.pe: *"funcionarios públicos mejor
   remunerados del Perú perciben ingresos mensuales que superan los S/ 35 mil"* —
   380.900.
4. **De quién es la culpa cuando algo sale mal.** *"El principio de planeación es
   responsabilidad de la entidad, NO del contratista"* — 36.400.
5. **El dolor cotidiano del oficio.** *"Se aproxima la ley de garantías y ya me
   veo así pidiendo ayuda con SECOP2"* — 159.100. *"La pobreza le está
   respirando en la nuca a los contratistas"* — 126.500. *"Revisen antes de
   enviar que no dejen ChatGPT"* — 23.200. *"La cara cuando te ponen de
   supervisor sin tú saber"* — 18.100.
6. **El montaje jurídico del momento explicado.** *"LA FUGA DE LOS CONTRATOS
   INTERADMINISTRATIVOS DE CARA A LAS ELECCIONES DE 2026. El reciente fallo del
   Consejo de Estado…"* — 26.000.
7. **"No se deje enredar, usted SÍ puede".** *"¡No se deje enredar! Infórmese
   bien para que no le salgan con cuentos. Usted sí puede ser contratado"*
   (@asproint) — 260.800.
8. **El ranking de cifras públicas del país.** @datero.pe: carreras mejor pagadas
   — 624.700; cuánto cobran las orquestas — **3.100.000**; qué país tiene más
   feriados — 314.200; canales de streaming más vistos — 222.200.
9. **La compra que no pasa por licitación.** *"En Perú existen las contrataciones
   directas: el Estado puede comprar sin licitación"* (@iec.peru) — 1.241, y
   *"Contratación en solo 24 HORAS. Procesos menores a 8 UIT que casi nadie ve"*
   — 1.097. **Tema correcto, ejecución con banda de 1K.**
10. **El fraccionamiento y los trucos que sí se usan.** *"El fraccionamiento del
    contrato estatal en régimen público y privado"* — 24.100.

## Las 3 mecánicas repetibles

1. **Calendario normativo, no calendario de efemérides.** El motor es "esta norma
   entra en vigor tal día y esto es lo que tienes que tener listo antes". Sirve
   dos veces: una al anunciarse, otra al entrar en vigor.
2. **Serie de respuestas a las dudas del post anterior.** Un cambio normativo da
   4-5 posts encadenados, cada uno citando el anterior. @jorgehbeltranp lo hizo
   cuatro veces seguidas con la ley de garantías.
3. **Las cifras públicas del Estado convertidas en ranking.** @datero.pe tiene
   mediana 174.100 publicando datos que cualquiera puede consultar. **Radar
   Estatal está sentado sobre esa materia prima (SEACE) y no la usa así.**

## Qué de esto NO estamos haciendo (vs. `radarestatal/posts/sep.json`)

- **Nuestros 30 posts son procedimiento atemporal**, y ese es literalmente el
  contenido de @bial.licitaciones (mediana **208**). Comparar:
  nosotros *"Cuatro datos para descartar una licitación en 3 minutos"* /
  ellos *"3 errores que pueden dejar su propuesta fuera"* (179 views).
- **Solo 2 de 30 tienen ancla temporal** ("Cierre del año fiscal", "Cierre de
  trimestre"). En este nicho el ancla temporal **es** el mecanismo: los cuatro
  picos de @jorgehbeltranp son la misma norma en cuatro fechas.
- **Cero rankings con cifras públicas.** Tenemos el hook correcto en el post 09
  ("El precio con el que ganaron el año pasado es público") pero lo tratamos como
  consejo, no como **ranking publicable**: "las 10 entidades que más compraron
  este año", "lo que pagó el Estado por X". @datero.pe hace exactamente eso con
  mediana 174.100.
- **Cero dolor del oficio.** @feliperamirezjj saca 159.100 y 126.500 con el
  sufrimiento de subir una oferta a SECOP2. Radar Estatal tiene regla de no
  humor — pero el reconocimiento del dolor **no requiere chiste**: se puede hacer
  informativo ("lo que pasa el día que cierra el proceso a las 23:59").
  Nuestro post 27 lo roza y no lo desarrolla.
- **No hay ninguna serie.** Ni una sola de nuestras 30 piezas continúa a otra.

---

# NICHO 6 · Course creators / certificados / edtech B2B → **Diplomy**

## Advertencia honesta sobre este nicho

**El nicho de "certificados verificables / credenciales digitales" en TikTok está
prácticamente vacío**, en inglés y en español. Los hashtags `#certification`,
`#credentials`, `#microcredentials`, `#openbadges`, `#certificado` y `#diploma`
devuelven casi solo cuentas fuera de tema (peluquería, ganadería, música). No
encontré ninguna cuenta que hable de emitir/verificar certificados con números
que valga la pena citar. `@libdo.world`, la única candidata prometedora del
descubrimiento, devolvió 0 posts en dos escaneos (perfil no accesible).

Lo que sí existe y sí funciona es **la capa de al lado: quien VENDE formación**.
Traigo esas cuentas como referencia de mecánica, marcadas como tal.

## Las cuentas (análogas, no del nicho exacto)

| Cuenta | Formato | Banda | Qué es |
|---|---|---|---|
| **@cataveiga_** | VIDEO (ES) | **41.900** → 268.000 | AR. Forma **profesoras** de Heels. La analogía más cercana a Diplomy: su cliente es la academia. |
| **@erikaindigital** | VIDEO (IT) | 3.567 → 36.800 | Productos digitales. Storytelling confesional. |
| **@markdigital.conandre** | VIDEO (ES) | 2.458 → 24.600 | Infoproductos y trabajo remoto. |
| **@crmbestie** | VIDEO (EN) | 3.871 → 16.500 | Única cuenta con contenido real de certificaciones. |
| **@nike_endars** | VIDEO + 6 FOTO (ID) | 4.346 → 19.400 | Guía académica universitaria. Solo por la mecánica. |

## Las 10 ideas/temas que funcionan

1. **"La diferencia entre una profesora y una GRAN profesora".** *"La diferencia
   entre una profesora y una gran profesora está en cómo acompaña el aprendizaje.
   No alcanza con saber hacer un paso. Hay que saber enseñarlo"* — 627.700.
2. **"Las mejores profesoras no son las que muestran lo más difícil, sino las que
   saben enseñarlo con claridad"** — 5.800.000.
3. **"Enseñar más no es enseñar mejor".** *"No siempre enseñar más significa
   enseñar mejor. Cada movimiento complejo necesita un proceso, progresiones y
   herramientas"* — 268.000.
4. **"Una alumna aprende mucho más cuando se siente segura que cuando se siente
   presionada"** — 269.400. **La calidad de la experiencia del alumno como tema.**
5. **Desglosar lo imposible en pasos.** *"Cuando un movimiento se desglosa paso a
   paso, deja de verse imposible"* — 5.800.000. *"No hay movimientos
   imposibles"* — 6.500.000.
6. **El detalle técnico que cambia el resultado.** *"A veces un pequeño detalle
   técnico cambia por completo el resultado. Por eso en mis clases no solo
   enseñamos secuencias, aprendemos el porqué"* — 1.600.000.
7. **"Todas ellas empezaron desde cero"** — 148.500. La prueba social de los
   egresados como pieza.
8. **Certificaciones intermedias para quien no se siente listo.** *"Check out
   these Salesforce Certs if you aren't feeling quite ready for the Admin exam"*
   (@crmbestie) — 16.300, con **565 guardados sobre 640 likes**. El post con
   mejor ratio de guardado de esa cuenta.
9. **"Aprobé la certificación X, aquí está mi guía de estudio"** — 9.114. El
   certificado como logro publicable.
10. **Trabajos que no piden título.** *"5 trabajos online mejor pagados sin
    título"* (@markdigital.conandre) — 120.600 con **7.738 guardados**. El
    contra-argumento del título formal es el post más grande de su cuenta.

## Las 3 mecánicas repetibles

1. **Hablarle al INSTRUCTOR sobre cómo enseñar mejor, no sobre la herramienta.**
   Cata Veiga vende una formación de profesoras y **jamás habla de la
   certificación en el gancho**: habla de qué separa a una buena profesora de una
   mediocre. La certificación aparece al final de la descripción.
2. **El certificado como logro social, no como trámite.** El ángulo que funciona
   es "lo aprobé, aquí va mi guía" y "estas certificaciones intermedias existen
   si no te sientes listo" — la ansiedad del alumno, no la administración de la
   academia.
3. **Confesión personal larga como apertura.** @erikaindigital: *"Durante 37 días
   no le dije a mi marido lo que estaba haciendo realmente. Estábamos en un
   momento complicado, teníamos deudas…"* — 482.900. Storytelling primero, el
   producto digital al final.

## Qué de esto NO estamos haciendo (vs. `diplomy/posts/sep.json`)

- **Nuestros 30 posts le hablan a la academia sobre ADMINISTRACIÓN de
  certificados** ("Give every certificate you issue its own number", "Decide who
  signs the certificates your academy sends", "Run these 4 checks before your
  next batch goes out"). Cata Veiga demuestra que a esa misma persona se le
  entra por **cómo enseñar mejor**, no por cómo emitir mejor.
- **Cero contenido para el ALUMNO.** Todo nuestro catálogo apunta al emisor. Los
  posts que sí funcionan en el nicho adyacente ("aprobé la cert, aquí mi guía",
  "certificaciones intermedias si no te sientes listo") le hablan a quien
  recibe. El alumno es quien presiona a la academia.
- **Cero prueba social de egresados.** "Todas ellas empezaron desde cero" —
  148.500. No tenemos ni un post de resultado de un alumno.
- **Cero historia personal.** Nuestro registro es 100% instructivo; las dos
  cuentas de mayor techo del nicho adyacente abren con confesión.
- **Nota estratégica:** dado que el nicho está vacío, Diplomy no compite por
  atención en "certificados" — tiene que ir a buscar a la academia dentro del
  contenido de "cómo dar mejores clases". Es lane abierto, pero no es el lane que
  estamos escribiendo.

---

# NICHO 7 · Amazon finds / home hacks + freelancer → **CheapFix y ServiceStack**

## Las cuentas

| Cuenta | Formato | Banda | Qué es |
|---|---|---|---|
| **@cleaningwithida** | VIDEO + 3 FOTO | **744.000** → 2.700.000 | Cleantok. 2.3M seguidores. La mediana más alta del estudio. |
| **@ourwintonhome** | VIDEO | 67.400 → 2.500.000 | Hogar/DIY. Maestra del calendario anticipado. |
| **@lazblinds** | VIDEO | 36.600 → 1.100.000 | **Marca de un solo producto.** El caso más replicable para CheapFix. |
| **@shop.with.caroline** | VIDEO | 28.900 → 163.900 | Finds + lifestyle. |
| **@tamarabradshaw_home** | VIDEO | 26.500 → 123.100 | DIY de bajo costo. |
| **@mackenzie.nadeau** | **FOTO (43/48)** | 11.800 → 100.600 | **Amazon en formato carrusel puro. Directamente imitable.** |
| **@scarletts.socials** | VIDEO | 2.515 → 6.741 | UGC/freelance. Referencia para ServiceStack. |

## Las 10 ideas/temas que funcionan

1. **"5 [cosa] que necesitas probar", numerado y corto.** *"5 folding hacks you
   need to try"* — **2.700.000** con **192.700 guardados**. *"5 cleaning hacks
   you NEED to try"* — 1.400.000. *"5 ways to use the pink stuff paste"* —
   2.800.000.
2. **"5 cosas que probablemente olvidas limpiar. Guarda esto para tu próxima
   limpieza profunda"** — 2.500.000. **La instrucción de guardado va dentro del
   caption.**
3. **El ritual anclado al día de la semana.** *"sunday reset with me"* —
   3.200.000. *"monday cleaning motivation for anyone who needs a little push
   today"* — 3.900.000, y otras cuatro variantes entre 1.300.000 y 2.300.000.
   **El mismo post, cada semana, con el nombre del día.**
4. **La cuenta regresiva al feriado, meses antes.** *"12 weeks until my house
   looks like this again 🎄"* publicado **el 15 de agosto** — 295.800. Boo
   baskets de Halloween el 18 de agosto — **1.500.000**. Caldero de bruja DIY el
   22 de agosto — 1.400.000. Centro de mesa de otoño en agosto — 288.200 /
   210.500 / 110.600 / 84.600.
5. **El producto que resuelve el problema del que alquila.** *"No-Drill Cellular
   Shades […] perfect for renters and homeowners, leaving no stain or damage to
   the walls"* — **10.300.000**, 107.900 guardados. La misma frase repetida en 12
   posts, entre 218.400 y 8.400.000.
6. **El best-seller del mes, con la fecha en la portada.** Portada VERBATIM del
   carrusel de @mackenzie.nadeau: **"AMAZON JULY BEST SELLERS / for good
   reason"** — 258.300 con 8.702 guardados.
7. **El gadget de cocina de $10 que ahorra un fastidio.** *"Amazon kitchen must
   have! This corner sink drainer […] keeps the sink clear"* — **4.800.000**.
8. **La transformación de 30 minutos con precio bajo.** *"Wall Makeover. Can you
   believe this only took like 30 to 45 min to complete"* — 2.400.000.
   *"Inexpensive 30 min wall transformation"* — 123.100.
9. **Responder a un comentario como post nuevo.** *"Replying to
   @Happy.LittleFroggie the easiest kitchen towel folding hack"* — 1.600.000 con
   50.600 guardados.
10. **El "top de todos los tiempos" como recopilatorio.** *"My Top Amazon Finds
    Of All Time"* — 68.300; *"Amazon home July Bestsellers"* — 50.300.

## Las 3 mecánicas repetibles

1. **Contenedor fijo + variable rotativa.** "5 X you need to try", "[Día] reset",
   "[Mes] best sellers". La estructura no cambia nunca; solo cambia el relleno.
   Es lo que sostiene medianas de 744.000 y 11.800 respectivamente.
2. **Adelantarse al calendario entre 6 y 12 semanas.** Halloween y Navidad en
   agosto. Cuando el resto publica en octubre, esta cuenta ya capitalizó dos
   olas. Es la mecánica de mayor rendimiento por esfuerzo del nicho.
3. **Un solo producto, un solo beneficio, repetido hasta el cansancio.**
   @lazblinds publica 12 veces las mismas persianas con la misma frase y varía
   solo el color. Mediana 36.600, techo 10.300.000. **Cero variedad temática.**

## Qué de esto NO estamos haciendo

### vs. `cheapfix/posts/sep.json` (20 posts)

- **Ancla temporal: cero.** Ninguno de los 20 posts menciona mes, estación ni
  feriado. La mecánica de mayor palanca del nicho es exactamente esa (295.800 por
  un post de Navidad publicado en agosto).
- **Un producto por post, nunca el mismo dos veces.** @lazblinds hace lo
  contrario y llega a 10.3M. Nosotros tenemos 20 productos distintos en 20 posts.
- **Nuestras portadas son fórmula de utilidad** ("4 things that end shower drain
  hair", "4 rules for an over the door organizer"). Las que ganan son **"5 X you
  need to try"** y **"[MES] BEST SELLERS"** — deseo y recencia, no reglas.
- **Cero instrucción de guardado dentro del caption.** "save this for your next
  deep clean" acompaña al post de 2.500.000.
- **Cero recopilatorio.** No tenemos "lo mejor del mes" ni "top de siempre", que
  son piezas gratis (se arman con lo ya publicado).
- **Cero ángulo de inquilino.** "perfect for renters, leaving no damage to the
  walls" es el beneficio que sostiene la cuenta más grande del formato producto.

### vs. `servicestack/posts/sep.json` (20 posts)

- **Nuestros 20 posts son todos stack y proceso** ("4 tools a one person agency
  opens daily", "4 settings that make a booking page work"). En el nicho, lo que
  reparte views no es el stack: es **el humor de estar dentro del sistema**
  (@crmbestie, 83.900 y 34.500) y **el resultado en dinero** ("$200/mes
  automáticos", 88% de ratio de guardado).
- **Cero cara y cero persona.** @scarletts.socials, con 19 posts y sin nicho
  claro, saca 233.800 solo por presencia. Nuestro contenido es anónimo.
- **Tenemos la idea correcta enterrada:** "3 tools I cancelled and what replaced
  them" y "4 things I automated and then undid" son confesión con número — el
  registro que funciona. Son 2 de 20.

---

# 8 · Las 6 mecánicas transversales (lo que aparece en 4+ nichos)

1. **CONTENEDOR FIJO REPETIDO.** "Súbanle el sueldo al de marketing de X" /
   "Día N automatizando el taller" / "Los mejores hooks de esta semana" /
   "Hola, soy Charlie" / "[Mes] best sellers" / "5 X you need to try". **Todas
   las cuentas de mediana alta del estudio tienen uno.** Ninguna de nuestras 190
   piezas tiene contenedor: cada post es una idea nueva desde cero. Es el hallazgo
   número uno.
2. **SERIE ENCADENADA CON PARTES.** Parte 2 y 3 construidas con lo que pidieron
   en los comentarios de la parte 1 (@alex_thevet: 2.7M → 581K → 377K;
   @jorgehbeltranp: 4 partes sobre la misma ley; @karenarias.g: 3 partes del kit).
   Nosotros publicamos 190 unidades sueltas.
3. **NEWSJACKING DE LA NORMA, NO DE LA NOTICIA.** Cuando cambia un protocolo o
   una ley, una cuenta de mediana 464 saca 623.600 y una de 2.998 saca 142.800.
   Es reproducible en Radar Estatal (SEACE/OECE), ComeHomeTag (protocolos
   pediátricos y de emergencia) y Qolca (cambios tributarios/SUNAT). **Nadie lo
   está vigilando en nuestro sistema.**
4. **ADELANTARSE AL CALENDARIO 6-12 SEMANAS.** Navidad y Halloween publicados en
   agosto (295.800 / 1.500.000). Nuestro CALENDARIO-90 ancla a la fecha; ellos
   anclan a la **anticipación** de la fecha.
5. **HABLAR DE UN TERCERO OBSERVABLE EN VEZ DE ACONSEJAR AL SEGUIDOR.** La marca
   que hizo la campaña, el cliente al que estafaron, la entidad que pagó X, el
   caso real del paciente. Techo altísimo y cero olor a venta. **Nuestros 190
   posts hablan en segunda persona casi sin excepción.**
6. **ENTREGAR ALGO COPIABLE O ARMABLE.** El prompt escrito completo, las 5
   tipografías, el kit de emergencia que se compra, la guía de estudio. Los
   guardados son la moneda del nicho y solo se pagan con material literal, no con
   reglas. Ratios observados: 88% guardado/like (@automatizateya), 43.400
   guardados en un post de 538.900 (@estefaniamarketing), 192.700 en uno de
   2.700.000 (@cleaningwithida).

## 9 · Cinco cosas que nuestros 190 posts hacen y ninguna cuenta ganadora hace

1. Abrir la portada con una **cifra sin fuente** ("1 de cada 5 mascotas
   perdidas…", "La mitad de los perros perdidos…"). Los ganadores abren con un
   comportamiento observable o con una cifra **citada** (Cotter & Beupre, 2013).
2. Escribir portadas de **frase completa de 8-12 palabras**. Las portadas de
   carrusel que ganan son de **2-4 palabras en grande** + subtítulo corto
   ("MINI GUÍA / BEBÉS EN VERANO", "AMAZON JULY BEST SELLERS").
3. **Numerar con 4** casi siempre: **57 de nuestros 190 posts** abren la portada
   con un "4" ("4 cosas…", "4 pasos…", "4 errores…"), frente a 12 con "3", uno
   con "5" y uno con "1". En el estudio el número que aparece en los picos es **5**
   (5 folding hacks, 5 cleaning hacks, 5 trabajos, 5 tipografías) y **3** para lo
   corto.
4. **Diagnosticar el problema sin mostrar el después.** Todo Qolca y todo Radar
   Estatal describen el "antes". Las cuentas grandes muestran el sistema ya
   funcionando.
5. **Cambiar de tema en cada post.** Ninguna de nuestras 5 marcas repite un tema
   dos veces seguidas. Todas las cuentas de mediana alta lo repiten hasta
   agotarlo.

---

## Apéndice · Reproducir esta investigación

```bash
# Escanear un perfil (números reales de TikTok, un handle a la vez:
# el scanner usa UN perfil persistente de Chrome, no admite paralelo)
node tools/tiktok_scan.mjs --out data/x.json <handle>

# Leer un post suelto + bajar las imágenes de un carrusel (User-Agent obligatorio)
curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) \
AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36" \
  "https://www.tikwm.com/api/?url=https://www.tiktok.com/@<handle>/photo/<id>"

# Descubrir handles por hashtag (urlebird sí responde por curl)
curl -s -H "User-Agent: Mozilla/5.0 ..." "https://urlebird.com/hash/<tag>/"
```

**No funcionan:** `tikwm.com/api/user/posts`, `tikwm.com/api/feed/search`
(Cloudflare), `tiktok.com/search?q=` y `tiktok.com/tag/` vía Playwright
(captcha para sesión no logueada).

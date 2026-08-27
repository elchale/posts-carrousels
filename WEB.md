# La app — publicar desde el celular

Una web en Next.js que sirve los mismos 330 carruseles de `brands/<marca>/out/`.
Pensada para el pulgar: eliges un post, guardas las fotos en **Fotos** del iPhone,
copias el caption, y lo marcas como publicado para no repetirlo.

No tiene backend, ni base de datos, ni variables de entorno. El repositorio *es*
el contenido y el navegador guarda el avance.

---

## Correrla en la laptop

```bash
cd carousels
npm install
npm run dev        # http://localhost:3000
```

`npm run dev` y `npm run build` corren primero `scripts/build-index.mjs`, que:

- enlaza (hardlink, no copia) las fotos originales a `public/posts/…` — son las que
  se guardan en el celular, **nunca se re-comprimen**;
- genera vistas previas de 540 px en `public/preview/…` (~18 KB cada una, para que
  el deslizador cargue rápido con datos móviles);
- genera portadas de 300 px en `public/thumb/…` para la grilla;
- escribe `data/index.json` con títulos, captions, ALT y PDF de cada post,
  leyéndolos de `brands/<marca>/posts/<serie>.json`.

`sharp` (el que genera las derivadas) está en `dependencies` y no en
`devDependencies` a propósito: si un build no instalara las de desarrollo, el
script seguiría corriendo pero copiaría los originales como vistas previas, y
cada post pesaría diez veces más sin que nadie se dé cuenta.

Todo eso está en `.gitignore`: se regenera solo. **Después de re-renderizar
láminas con `tools/render.py`, corre `npm run prepare-assets`** (o simplemente
`npm run dev`) para que la app vea los cambios.

---

## Caché: por qué antes había que abrir incógnito

Cada lámina vivía en una URL fija —`/posts/<marca>/<serie>/<slug>/ig/01.jpg`—
servida con `Cache-Control: immutable` a un año. Volver a renderizar una lámina
cambiaba los bytes pero **no la URL**, así que el navegador no tenía ningún
motivo para volver a pedirla: seguía enseñando la vieja hasta 2027. La única
ventana que no tenía esa copia guardada era la de incógnito.

Ahora `build-index.mjs` calcula una **huella del contenido** de cada archivo
fuente y la cuelga de la URL: `…/ig/01.jpg?v=6649e508d0`. Bytes nuevos ⇒ huella
nueva ⇒ URL nueva ⇒ el navegador la pide solo. Y lo que no cambió conserva su
URL, así que se sigue sirviendo de caché y no se re-descarga nada de más. La
huella se cachea por (tamaño, mtime) en `data/.hashes.json`, así que solo la
primera pasada lee los 692 MB (9 s); las siguientes tardan 2 s.

La otra mitad del problema era el HTML —lo que trae la lista de posts nuevos—,
que Safari se guardaba igual, sobre todo con la app añadida a la pantalla de
inicio. `next.config.mjs` ahora sirve todo lo que no sea una lámina o un archivo
de `/_next/static` con `max-age=0, must-revalidate`.

Para comprobarlo desde el celular sin adivinar: **Inicio → ⇄ (Respaldo)** enseña
abajo la **versión** que está sirviendo. Es el mismo código que imprime
`npm run prepare-assets` al terminar. Si no coinciden, el deploy todavía no
llegó (o de verdad hay caché de por medio).

---

## Velocidad: qué se descarga y cuándo

Medido con `npm run measure` (Playwright, iPhone 390x844 @3x, **4G lento**:
1,6 Mbps y 300 ms de latencia, mediana de 3 corridas). Estrangular la red no es
un detalle: en localhost todo entra tan rápido que las diferencias no existen.

| | 1ª imagen | todo a la vista | datos |
|---|---|---|---|
| Inicio | 842 → **828 ms** | 2 332 → 2 434 ms | 296 KB |
| Marca (grilla) | 1 603 → **858 ms** | 4 188 → **3 638 ms** | 540 → **486 KB** |
| Post | 1 047 → 1 051 ms | 2 157 → 2 142 ms | 2 222 → **1 173 KB** |

Tres cosas cambiaron, y conviene saber cuál hizo qué:

**1. El calentamiento de los originales, diferido.** Abrir un post costaba
2 222 KB porque el precalentado arrancaba en el primer render y se llevaba los
**dos** formatos (~900 KB cada uno), compitiendo con las previews. Ahora se
limita al formato activo y espera a `load` + `requestIdleCallback`: **la mitad
de los datos por post**. Sigue siendo indispensable —`navigator.share()` no
admite un `await` delante o Safari se come el gesto, ver `app/lib/save.js`— pero
ya no le quita el ancho de banda a lo que estás mirando. Si tocas *Guardar*
antes de que termine, `saveSlides` los baja en el momento y el botón dice **Toca
de nuevo**: un toque de más en el peor caso.

Ojo con el número: **esto solo baja datos, no baja tiempos.** El post tarda lo
mismo en verse. Lo que se ahorra son ~1 MB de datos móviles por post y una
conexión que dejaba de estar ocupada nueve segundos.

**2. La grilla ya no precarga 40 páginas.** Next precarga por defecto TODO
`<Link>` que entre al viewport, y la grilla tiene 40-60 tarjetas: eran **40
peticiones RSC (74 KB)** de posts que probablemente no ibas a abrir, cada una un
viaje de ida y vuelta que en el celular le quitaba el turno a las miniaturas. Con
`prefetch={false}` la grilla pasó de **82 a 45 peticiones**.

**3. Prioridad a lo que se ve.** Las miniaturas estaban todas en `loading="lazy"`,
así que ninguna arrancaba hasta que el layout se asentaba: la primera portada
tardaba 1,6 s en aparecer. Las seis que caen dentro de la pantalla ahora van
`eager` + `fetchPriority="high"`. **1 603 → 858 ms, casi la mitad.** A cambio el
evento `load` de la grilla llega ~500 ms más tarde, porque ahora esas imágenes
cuentan para él — es un mal negocio en el papel y uno bueno en la pantalla: lo
que mides como "cargó" no es lo que el ojo llama "cargó".

Lo que **no** se movió, y hay que decirlo: el post sigue tardando ~1 s en pintar
la primera lámina y ~1,9 s en el evento `load`. Ahí manda el arranque del propio
Next —162 KB de JS en 10 archivos, cada uno un viaje— y eso no se arregla
moviendo imágenes de sitio.

```bash
npm run measure -- http://127.0.0.1:3000              # tiempos en 4G
npm run measure -- --no-throttle http://...           # datos, sin estrangular
npm run smoke   -- http://127.0.0.1:3000              # que nada se rompió
```

`npm run smoke` es el que importa antes de desplegar: comprueba en un navegador
de verdad que las tres pantallas cargan sin errores, que **toda** imagen pintada
llegó completa (una huella mal puesta se vería como un hueco, no como un error),
que *Guardar N fotos* saca los seis archivos con el nombre limpio, que marcar
como publicado sobrevive a recargar, y que los encabezados de caché son los que
deben ser.

---

## Las imágenes viven en el bucket

Desde el **26-08-2026** las tres carpetas (originales, previews y miniaturas)
se sirven desde `gs://qolca-basic-santiago/carruseles`. El deploy ya no lleva
ni una imagen: `.next` pasó de ~890 MB a **120 MB**.

Y **los renders salieron del repo**: `brands/<marca>/out/` está en `.gitignore`.
Viven en dos sitios, el bucket y esta laptop. En su lugar se **commitea el
manifest** (`data/index.json`, 2 MB), que es lo único que el build necesita.

Cómo funciona el reparto:

- `npm run prepare-assets` **sin** `MEDIA_BASE` → genera `public/{posts,preview,thumb}`
  en la laptop. Es de ahí de donde sube el uploader.
- `npm run upload-media` → rsync de esas tres carpetas al bucket.
- `MEDIA_BASE=… npm run prepare-assets` → escribe el manifest con URLs
  absolutas **y no toca `public/` ni la caché de derivadas**. Sin esa segunda
  parte, `MEDIA_BASE` solo cambiaba las URLs y Vercel seguía empaquetando los
  mismos 770 MB: el traslado no se cobraba.
- En Vercel no hay ni renders ni `public/`, así que `build-index` detecta que no
  hay ninguna carpeta `out/` y **sirve el manifest del repo tal cual**. Si el
  manifest faltara o viniera sin posts, el build ROMPE a propósito: mejor eso
  que desplegar una app vacía.

`MEDIA_BASE` está puesta en Vercel en Production, Preview y Development.

### Una tanda nueva de láminas

```bash
python tools/render.py <marca> <serie> <slug>   # renderiza
npm run prepare-assets                          # SIN MEDIA_BASE: llena public/
npm run upload-media                            # sube lo que cambió al bucket

# y el manifest, que es lo que SÍ va al repo:
MEDIA_BASE=https://storage.googleapis.com/qolca-basic-santiago/carruseles npm run prepare-assets
git add data/index.json && git commit && git push
```

El `rsync` solo sube lo que cambió, así que una tanda nueva cuesta segundos.
**El orden importa**: subir primero, commitear el manifest después. Al revés, el
deploy apuntaría a láminas que todavía no existen en el bucket.

### Las dos trampas, las dos resueltas

- **CORS.** `app/lib/save.js` hace `fetch()` de cada lámina para convertirla en
  `File` y pasársela al menú de compartir de iOS — la única ruta que acaba en
  Fotos y no en Archivos. Con las imágenes en otro origen ese `fetch` necesita
  `Access-Control-Allow-Origin`; sin él el botón muere en TODOS los posts y solo
  se ve un error en consola. Puesto con `node scripts/upload-media.mjs --cors`
  y verificado: el bucket responde `Access-Control-Allow-Origin: *`.
  El smoke lo vigila porque descarga las seis fotos de verdad.
- **La velocidad.** El bucket está en `southamerica-west1` sin CDN delante.
  Medido en 4G lento, contra el mismo build sirviendo desde el deploy:

  | Pantalla | Desde el repo | Desde el bucket |
  |---|---|---|
  | Inicio · 1ª imagen | 828 ms | 1009 ms |
  | Marca · 1ª portada | 858 ms | 961 ms |
  | Marca · todo a la vista | 3638 ms | 3099 ms |
  | Post · 1ª lámina | 1051 ms | 1002 ms |

  La primera portada cuesta ~100 ms más, pero la grilla completa llega antes
  (las imágenes ya no compiten con el HTML y el JS por la misma conexión). Si
  algún día se hunde, la vuelta atrás son 83 MB: quitar `MEDIA_BASE` de
  `preview/` y `thumb/` en `build-index.mjs` y dejar solo los originales fuera.

Como el bucket **no** usa acceso uniforme, cada objeto sube con
`--predefined-acl=publicRead`; sin eso suben bien y la app recibe 403.

Las credenciales son la cuenta de servicio compartida, en `.gcs/key.json`
(gitignorada). Se saca de cualquier app que ya use el bucket:

```bash
node scripts/extract-gcs-key.mjs ../../Apps/Progress/openbadges/.env.prod
```

> El proyecto es `avian-volt-457704-c9` (número `528207057236`) y su facturación
> estuvo **cerrada** hasta el 26-08-2026, con el bucket devolviendo 403 en
> lectura y escritura. Si vuelve a pasar: el listado de carpetas SIGUE
> funcionando aunque esté caído (es metadata y es gratis), así que para saber si
> está vivo hay que probar un `cp` o un GET público, no un `ls`.

## Publicarla en Vercel

1. En [vercel.com/new](https://vercel.com/new) importa el repositorio
   `posts-carrousels`. Vercel detecta Next.js solo.
2. Deja todo por defecto: Root Directory `/`, Build Command `npm run build`,
   Output `.next`. La única variable es `DATABASE_URL`, y es opcional — mira
   *Conectar la base de datos* más abajo.
3. Deploy. Con la caché de derivadas caliente el deploy entero tarda ~5 min;
   el primero, o cualquiera tras cambiar todas las láminas, ~7½. El desglose
   está abajo.

### Cuánto tarda un deploy y por qué

Números reales del log de Vercel (`vercel inspect <url> --logs`), máquina de
2 núcleos, mismo proyecto:

| Fase | 16 ago | 26 ago |
|---|---|---|
| Clonar el repo | **3:08** | **0:28** |
| Instalar | 0:04 | 0:04 |
| `build-index.mjs` | **3:03** | 1:37 en frío · ~0:25 con caché |
| `next build` | 0:12 | 0:14 |
| Empaquetar | 0:14 | 0:12 |
| Subir el resultado | 0:38 | 0:24 |
| Guardar la caché | 0:12 | 0:10 |
| **Total** | **7:32** | **3:03** |

Eran dos problemas distintos con la misma raíz: demasiados bytes.

**El clon (3:08 → 0:28).** `.git` pesaba 4,9 GB para un árbol de 1,5 GB. Cada
re-render de una lámina dejaba el JPEG viejo dentro para siempre, y ha habido
muchas rondas. Vercel clona en superficial, los ~10 últimos commits, y solo
esos traían 1 GB de objetos además del árbol. La historia se aplastó en un
commit (`39470d66`, 25 ago 2026): el árbol quedó idéntico byte por byte, lo que
se fue son las versiones viejas. La historia completa sigue en la laptop en el
tag `historia-completa-2026-08-25`, que no se sube.

Esto hay que repetirlo de vez en cuando: el repo vuelve a engordar ~700 MB con
cada ronda de re-renders. Y GitHub empieza a poner problemas pasando los 5 GB.

```bash
git tag historia-completa-$(date +%F)                 # red de seguridad local
NUEVO=$(git commit-tree "HEAD^{tree}" -m "Raíz nueva")
git reset --hard $NUEVO
git push --force-with-lease origin main               # el remoto ya tiene los
                                                      # blobs: tarda segundos
```

**Las derivadas (3:03 → ~0:25).** `build-index.mjs` rehacía las 4 251 previews
y miniaturas en CADA deploy, porque `public/` está en `.gitignore` y un clon
limpio no trae ninguna. Tampoco valía cachearlas por fecha: un clon estrena
`mtime` en todo, así que la prueba «el destino es más nuevo que la fuente»
siempre daba falso — en los logs viejos se ve `0 ya al día` en todos.

Ahora la clave es la huella del contenido, la misma que ya llevaban las URLs, y
las derivadas viven en `.next/cache/carruseles/<huella>-<ancho>q<calidad>.jpg`,
que es justo la carpeta que Vercel restaura entre deploys. Mismos bytes de
origen, misma derivada, no se regenera. Medido en un clon limpio simulado:
**1:58 → 0:31**. La caché son ~78 MB sobre los 151 MB que ya viajaban.

De paso: 112 láminas de bytes idénticos que se redimensionaban por duplicado
ahora comparten derivada, y la concurrencia dejó de ser 8 fija (en una máquina
de 2 núcleos había 8 tareas peleándose por cuatro veces más hilos de los que
hay).

**Lo que queda, si algún día molesta.** De los 1,5 GB que se clonan, el build
solo necesita 694 MB: lee `brands/<marca>/out/**` y los JSON del copy. Los
otros ~830 MB — `plates/`, `plates_graded/`, `product/` y `eventos/` — son
materia prima del renderizador y Vercel se los traga para nada. Sacarlos a otro
repositorio dejaría el clon en ~0:12, pero son los assets de trabajo: hay que
decidir antes dónde viven y cómo se respaldan.

### Un dominio propio

Project → **Settings → Domains → Add**, escribe el dominio y sigue los registros
DNS que te muestra. La app no tiene ninguna URL escrita a mano ni `basePath`, así
que funciona igual en `algo.vercel.app`, en `carruseles.tudominio.com` o en
`localhost`. No hay que reconstruir al cambiar de dominio.

### Detalles que conviene saber

- **Cuenta personal.** El plan Hobby de Vercel no conecta repositorios de una
  organización de GitHub. `elchale` es una cuenta personal, así que entra sin
  problema — pero si algún día mueves el repo a una org, hay que pasar a Pro.
- **Peso.** El deploy sube ~770 MB de fotos estáticas (692 MB de originales +
  79 MB de previews) mientras los originales sigan en el repo — ver *Sacar los
  originales del repo* más arriba. Eso está bien: el límite de 100 MB de Vercel aplica solo a
  los deploys hechos con `vercel deploy` desde la CLI, no a los que salen de Git.
  Si algún día prefieres la CLI, hay que subir por Git igual.
- **Tráfico.** Ver un post consume ~2,7 MB. Con el límite gratis de 100 GB/mes no
  hay forma de acercarse publicando a mano.
- **Ponla en la pantalla de inicio.** Safari → Compartir → *Añadir a pantalla de
  inicio*. Se abre a pantalla completa y el avance se guarda igual.

---

## Cómo se usa

**Inicio** — dos pestañas sobre el mismo material.

*Posts de hoy* (la que abre) es la tanda del día: un post por cuenta que publique
hoy, con su miniatura y si ya está en IG y en TikTok. Tocas uno, guardas las
fotos, lo marcas, y **Siguiente** te lleva al que sigue sin volver a la lista; la
flecha de atrás sí vuelve a ella. Cuando cierras el día lo dice y te ofrece el
siguiente día programado, por si quieres adelantar.

Lo que decide qué sale ahí es la **fecha** de cada post, que sale del mes de la
serie y del día del slug (`27-cola-del-pozo` → 27 de agosto), leída con el reloj
de ESTE teléfono. Tres casos que no son un error y por eso se dicen con todas sus
letras:

- **Una cuenta sin post hoy** — no todas publican a diario. Aparece abajo:
  «Hoy no toca en Diplomy».
- **Un día sin nada** — «Hoy no toca publicar nada», y debajo el siguiente día
  con tanda.
- **Se pasó la fecha** — sección aparte, con la fecha de cada uno. Se pintan ocho
  y el resto se cuenta: la mayoría van pegados a una fecha concreta y ya no
  sirven fuera de ella, así que la lista larga sería ruido.

*Por cuenta* es la vista de siempre: cuántos llevas de 330 y un acceso directo al
siguiente post de la marca más atrasada, para que las cuentas avancen parejas.

**Marca** — la grilla de portadas. Por defecto muestra **solo pendientes**, así
que lo publicado desaparece y no lo vuelves a descargar por error. Los chips de
arriba filtran por serie; el número del chip es lo que falta de esa serie.

**Post** — el deslizador con las láminas y, abajo, dos columnas:

| | Instagram | TikTok |
|---|---|---|
| **Guardar N fotos** | abre el menú de iOS → *Guardar N imágenes* → van a Fotos | igual, con las láminas 9:16 |
| **Copiar caption** | el texto de IG (Facebook usa las mismas fotos, ver `⋯`) | el texto de TikTok |

Y la fila **Publicado**, con un botón por red más **Las 2** para cerrar las dos
de un toque, que es lo normal. Cuando las dos están marcadas el post queda
sellado y aparece **Siguiente pendiente** (o **Siguiente** de la tanda, si
llegaste desde *Posts de hoy*).

El botón `⋯` guarda el resto: leer los captions completos, copiar el de Facebook,
copiar el texto ALT, abrir el PDF de LinkedIn (Qolca), invertir el orden de
guardado y borrar el estado de ese post.

### Por qué el guardado funciona así

La única forma de que una foto llegue a **Fotos** desde el navegador del iPhone
(y no a *Archivos*) es el menú nativo de compartir. La app precarga las fotos
apenas abres el post, porque Safari exige que el menú se abra en el mismo toque:
si tuviera que descargarlas primero, perdería el gesto. Por eso a veces, con
señal mala, el botón dice **Toca de nuevo** — las fotos ya están listas, solo
falta el segundo toque.

En Android o en la laptop no existe ese menú: ahí las fotos se descargan una por
una y la app lo advierte.

### El orden de las láminas

Se guardan 01 → 07. iOS les pone la hora del momento en que se guardaron, así que
un selector que muestre "las más recientes primero" te va a mostrar la 07 arriba.
Si te pasa, en `⋯` → **Orden al guardar** cámbialo a invertido.

---

## Dónde se guarda el avance

En **dos sitios a la vez**: el navegador y Postgres.

El navegador (`localStorage`, llave `carruseles.v1`) es la copia rápida — marcar
funciona al instante y sin señal. Postgres es la copia que importa: el avance te
sigue entre celular y laptop, y no lo borra nadie.

Hacía falta porque `localStorage` solo no aguanta el uso real:

- **cada URL de deploy de Vercel es un dominio distinto**, con su propio almacén.
  Si entras desde el panel de Vercel en vez del dominio de producción, cada
  visita es un sitio nuevo y vacío;
- en **pestaña privada** de Safari no se puede escribir: el avance vive en memoria
  y muere al recargar;
- Safari **borra el almacenamiento de un sitio a los 7 días** sin abrirlo.

La sincronización es silenciosa: baja al abrir la app y al volver a la pestaña,
sube 1,2 s después de cada cambio. Si el servidor no contesta, lo marcado queda
en el navegador y se reintenta — marcar nunca falla por estar sin señal.

**La fusión es por marca de tiempo más reciente, campo por campo.** Nunca borra:
dos dispositivos que marcaron cosas distintas terminan con la unión de ambas, y
el que estuvo sin señal no pisa lo del otro al reconectar. Es la misma regla que
usa el respaldo de texto.

### Conectar la base de datos

Una sola variable, y es **opcional**: sin ella la app funciona igual, guardando
solo en el navegador (y `/respaldo` te lo dice en pantalla, con un punto gris —
no finge que guardó algo).

1. `.env.prod` en la raíz tiene la línea lista. **No está en el repo** (`.env*`
   está en `.gitignore`): es una credencial.
2. En Vercel: **Settings → Environment Variables**, nombre `DATABASE_URL`, valor
   el de ese archivo. Marca Production, Preview y Development.
3. Vuelve a desplegar.

La tabla `carousel_state` se crea sola la primera vez que la app la usa. No hay
migraciones que correr.

Para probar en la laptop contra la misma base, copia `.env.example` a
`.env.local` y pon el string ahí.

> **Ojo:** la app no tiene contraseña. Cualquiera con el enlace puede ver y
> marcar. Para un dominio propio no es grave (nadie lo va a adivinar), pero si
> quieres cerrarlo: Vercel → Settings → Deployment Protection.

**Inicio → ⇄ (Respaldo)** sigue estando, y sigue siendo útil: copia el avance
como texto para pegarlo en otro navegador, y no depende de que el servidor esté
arriba. Ahí también ves si estás guardando en el servidor o solo aquí.

---

## Estructura

```
app/
  layout.jsx  page.jsx            inicio
  api/state/route.js              leer/fusionar/borrar el avance en Postgres
  lib/db.js                       Neon + la fusión por fecha más reciente
  components/Sync.jsx             baja al abrir, sube al marcar
  [brand]/page.jsx                grilla de la marca
  [brand]/[series]/[slug]/page.jsx  el post
  respaldo/page.jsx               copiar / restaurar el avance
  components/                     HomeScreen (pestañas) · HoyScreen · BrandScreen
                                  PostScreen · Sheet · Toast
  lib/data.js                     lee data/index.json (solo en el servidor)
  lib/agenda.js                   qué toca hoy, qué se pasó de fecha, qué viene
  lib/fecha.js                    el día según el reloj del aparato
  lib/nav.js                      pestaña abierta + «vengo de la lista de hoy»
  lib/store.js                    localStorage: descargado / publicado
  lib/save.js                     compartir a Fotos, copiar al portapapeles
  globals.css                     todo el diseño, sin framework
scripts/build-index.mjs           genera public/ y data/index.json
```

Las 189 páginas se generan estáticas en el build; en producción no se ejecuta
nada del lado del servidor.

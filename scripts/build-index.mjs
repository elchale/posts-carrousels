#!/usr/bin/env node
/**
 * build-index.mjs — turns brands/<marca>/out/** into something the web app can serve.
 *
 * Runs before `next dev` and `next build` (see package.json). Idempotent: re-running
 * only touches files that are missing or stale, so local dev restarts are instant and
 * a Vercel build from a clean checkout does the full pass in ~1-2 min.
 *
 * It produces three things:
 *   public/posts/<brand>/<series>/<slug>/{ig,tt}/NN.jpg   the ORIGINALS, hardlinked
 *                                                          (what actually gets saved
 *                                                           to the phone — never resized)
 *   public/preview/<...>/NN.jpg                            540px deck previews
 *   public/thumb/<brand>/<series>/<slug>.jpg               300px grid covers
 *   data/index.json                                        the manifest the app reads
 *
 * Hardlinks, not copies: the originals are 439 MB and the build container has one
 * filesystem, so linking costs nothing. Falls back to a real copy if the platform
 * refuses (different volume, no permission).
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BRANDS_DIR = path.join(ROOT, 'brands')
const PUBLIC = path.join(ROOT, 'public')
const DATA = path.join(ROOT, 'data')

/* Dónde viven las imágenes. Vacío = el mismo deploy, servidas desde public/.
 * Con MEDIA_BASE apuntando a un bucket, el manifest sale con URLs absolutas y
 * el deploy deja de cargar 770 MB.
 *
 * Va a las TRES carpetas (originales, previews y miniaturas) a propósito: la
 * mitad del tiempo de deploy es clonar y subir bytes que el navegador podría
 * pedirle a otro sitio. El precio es que las portadas de la grilla dejan de
 * salir del CDN de borde de Vercel, así que si el bucket no tiene CDN delante
 * hay que volver a medir en el celular — la grilla enseña la primera portada en
 * 858 ms y esa cifra es lo que hay que defender.
 *
 * Y una trampa que no avisa: con URLs absolutas, "Guardar N fotos" pasa a hacer
 * un fetch de otro origen. Sin CORS en el bucket, el fetch falla y el botón
 * muere en TODOS los posts. El bucket tiene que responder con
 * Access-Control-Allow-Origin — lo pone scripts/upload-media.mjs --cors. */
const MEDIA_BASE = (process.env.MEDIA_BASE || '').replace(/\/+$/, '')

/* --------------------------------------------------------------- huellas */
/* El bug del incógnito: cada lámina vivía en una URL fija
 * (/posts/<marca>/<serie>/<slug>/ig/01.jpg) servida con `immutable` a un año.
 * Re-renderizar una lámina cambiaba los bytes pero NO la URL, así que el
 * navegador seguía mostrando la vieja hasta 2027 — y la única forma de ver la
 * nueva era una ventana sin caché. Ahora cada URL lleva ?v=<huella del
 * contenido>: bytes nuevos ⇒ URL nueva ⇒ el navegador la pide sola, y lo que no
 * cambió se sigue sirviendo de caché.
 *
 * La huella se cachea por (tamaño, mtime) en data/.hashes.json para no releer
 * 817 MB en cada `npm run dev`. */
const HASH_CACHE = path.join(DATA, '.hashes.json')
let hashCache = {}
const hashNext = {}

function fingerprint(src) {
  const rel = path.relative(ROOT, src).split(path.sep).join('/')
  let st
  try {
    st = fs.statSync(src)
  } catch {
    return '0'
  }
  const stamp = `${st.size}:${Math.round(st.mtimeMs)}`
  const hit = hashCache[rel]
  if (hit && hit.stamp === stamp) {
    hashNext[rel] = hit
    return hit.h
  }
  const h = crypto.createHash('sha1').update(fs.readFileSync(src)).digest('hex').slice(0, 10)
  hashNext[rel] = { stamp, h }
  return h
}

/* Chrome accents. Each brand's real palette lives in brands/<b>/brand.json and in
 * COLORES.md, but those are tuned for print-like slides — a few are unreadable as UI
 * accents on a dark chassis (Propaga's crimson #be001a in particular). These are the
 * on-dark members of each brand's own palette, not new colours. */
const BRAND_CHROME = {
  comehometag: { accent: '#8b73ff', accent2: '#ec6aa6', label: 'Protección QR' },
  qolca: { accent: '#5aa7ff', accent2: '#7fd7c4', label: 'Automatización e IA' },
  propaga: { accent: '#ff7a1f', accent2: '#ffc266', label: 'Marketing para negocios' },
  /* Las dos marcas azules comparten familia de color, así que en el chasis se
   * distinguen por la etiqueta, no por el acento (en las láminas las separan el
   * serif de Diplomy y el motivo de las plates — ver brands/diplomy/BRAND.md). */
  radarestatal: { accent: '#5f9ff5', accent2: '#cfe3fa', label: 'Compras del Estado' },
  diplomy: { accent: '#4d94f7', accent2: '#84b8f8', label: 'Certificados verificables' },
  /* Las dos cuentas afiliadas de EE.UU. (affiliate/) — en inglés, y por eso su
   * etiqueta también: es lo único del chasis que dice en qué idioma se publica. */
  servicestack: { accent: '#5be0a5', accent2: '#8a93a0', label: 'AI stack for solos' },
}

/* The best name for a series is the one already written on its covers: every post in
 * a series carries the same kicker ("ANTES / DESPUÉS", "LA VIDA DEL QUE PUBLICA").
 * The folder slug is the fallback — it survives renames but loses the accents, so
 * s6-vision would read "Vision". Two series have no kicker and fall back. */
/* Folder slugs are ASCII, so anything that needs a tilde has to be spelled out here.
 * Only series without a kicker ever reach this list. */
const SLUG_LABELS = { 's6-vision': 'Visión' }

function slugLabel(id) {
  if (SLUG_LABELS[id]) return SLUG_LABELS[id]
  const tema = id.replace(/^s\d+-/, '').replace(/-/g, ' ')
  return tema.charAt(0).toUpperCase() + tema.slice(1)
}

function seriesLabel(id, postsBySlug) {
  const kickers = new Set(Object.values(postsBySlug || {}).map((p) => p.slides?.[0]?.kicker || ''))
  if (kickers.size === 1) {
    const only = [...kickers][0].trim()
    if (only) return only.charAt(0).toUpperCase() + only.slice(1).toLowerCase()
  }
  return slugLabel(id)
}

let sharp = null
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('[build-index] sharp no está instalado — se usarán las imágenes originales\n' +
    '                para las miniaturas (la app funciona igual, pesa más en datos).')
}

const stats = { linked: 0, previews: 0, thumbs: 0, skipped: 0, cached: 0, pruned: 0, cachePruned: 0 }

/* Todo destino que ESTA pasada produce (o confirma fresco). Lo que quede en
 * public/{posts,preview,thumb} fuera de este set es de una versión anterior
 * del contenido y se poda al final. */
const managed = new Set()

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

/** Fresh if the destination exists and is not older than the source. */
function isFresh(src, dest) {
  try {
    const s = fs.statSync(src)
    const d = fs.statSync(dest)
    return d.mtimeMs >= s.mtimeMs
  } catch {
    return false
  }
}

/* Enlace duro, con copia de respaldo si el sistema de archivos se niega (otro
 * volumen, sin permisos). Un enlace no cuesta bytes: es el mismo inodo. */
function hardLink(src, dest) {
  mkdirp(path.dirname(dest))
  try {
    fs.rmSync(dest, { force: true })
    fs.linkSync(src, dest)
  } catch {
    fs.copyFileSync(src, dest)
  }
}

function linkOrCopy(src, dest) {
  managed.add(path.resolve(dest))
  if (isFresh(src, dest)) {
    stats.skipped++
    return
  }
  hardLink(src, dest)
  stats.linked++
}

/* ------------------------------------------------- caché de derivadas */
/* En Vercel cada deploy parte de un clon limpio y `public/` está en .gitignore,
 * así que las 4 251 derivadas se rehacían ENTERAS cada vez: 3 de los 7½ minutos
 * que tardaba el deploy, encima sobre una máquina de 2 núcleos.
 *
 * No se podían cachear por fecha: un clon estrena mtime en todo, así que
 * `isFresh` (destino más nuevo que la fuente) siempre daba falso. La clave
 * tiene que ser el CONTENIDO — y ya lo calculamos para las URLs. El nombre en
 * la caché es <huella>-<ancho>q<calidad>.jpg: mismos bytes de origen ⇒ misma
 * derivada, sin importar cuándo se clonó ni en qué máquina.
 *
 * El almacén vive dentro de `.next/cache` porque es la carpeta que Vercel
 * restaura entre deploys (en el log: "Restored build cache from previous
 * deployment"). Son ~83 MB sobre los 151 MB que ya viajaban. */
/* Con las imágenes ya en el bucket, el deploy no tiene por qué llevarlas: sin
 * esto MEDIA_BASE solo cambiaba las URLs del manifest y Vercel seguía
 * empaquetando y subiendo los mismos 770 MB, que es la mitad del tiempo de
 * deploy. Aquí es donde se cobra el traslado.
 *
 * En la laptop se corre SIN MEDIA_BASE para generar public/ (que es de donde
 * sube upload-media.mjs) y solo se pone la variable al final, para escribir el
 * manifest. La poda de más abajo también se salta: con public/ sin tocar,
 * `managed` sale vacío y se llevaría por delante justo lo que hay que subir. */
const SOLO_MANIFEST = Boolean(MEDIA_BASE)

const CACHE = path.join(ROOT, '.next', 'cache', 'carruseles')
const cacheKeep = new Set()

/* huella+ancho+calidad → destinos. Es un Map y no una lista porque dos láminas
 * de bytes idénticos comparten derivada: se genera una vez y se enlaza dos. */
const resizeJobs = new Map()

function queueResize(src, dest, width, quality, counter) {
  managed.add(path.resolve(dest))
  /* El apunte en cacheKeep va ANTES del atajo de abajo: en local `public/` ya
   * está poblado, así que casi nada llega a la cola — y la poda del final se
   * llevaría por delante justo la caché que sirve para el próximo deploy. */
  const store = path.join(CACHE, `${fingerprint(src)}-${width}q${quality}.jpg`)
  cacheKeep.add(path.resolve(store))
  if (isFresh(src, dest)) {
    stats.skipped++
    return
  }
  if (fs.existsSync(store)) {
    hardLink(store, dest)
    stats.cached++
    stats[counter]++
    return
  }
  const job = resizeJobs.get(store)
  if (job) {
    job.dests.push(dest)
    return
  }
  resizeJobs.set(store, { src, store, dests: [dest], width, quality, counter })
}

async function drainResizeQueue() {
  const jobs = [...resizeJobs.values()]
  if (!jobs.length) return
  /* Una tarea por núcleo, y libvips a un hilo por tarea: con los 8 fijos de
   * antes, en la máquina de 2 núcleos de Vercel había 8 tareas peleándose por
   * cuatro veces más hilos de los que existen. */
  const CONCURRENCY = Math.max(2, Math.min(8, os.cpus().length))
  if (sharp) sharp.concurrency(1)
  let i = 0
  let done = 0
  const total = jobs.length
  async function worker() {
    while (i < jobs.length) {
      const job = jobs[i++]
      if (sharp) {
        mkdirp(path.dirname(job.store))
        await sharp(job.src)
          .resize({ width: job.width, withoutEnlargement: true })
          .jpeg({ quality: job.quality, progressive: true, mozjpeg: true })
          .toFile(job.store)
        for (const dest of job.dests) hardLink(job.store, dest)
      } else {
        for (const dest of job.dests) hardLink(job.src, dest)
      }
      stats[job.counter] += job.dests.length
      done++
      if (done % 200 === 0 || done === total) {
        process.stdout.write(`\r[build-index] derivadas ${done}/${total}   `)
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  process.stdout.write('\n')
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

function listDirs(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
      .map((e) => e.name)
      .sort()
  } catch {
    return []
  }
}

function listSlides(dir) {
  try {
    return fs.readdirSync(dir)
      .filter((f) => /^\d+\.(jpe?g|png)$/i.test(f))
      .sort()
  } catch {
    return []
  }
}

/* ---------------------------------------------------------------- scan */

/* Los renders (brands/<marca>/out/) ya no van al repo: viven en el bucket y en
 * la laptop. Asi que en Vercel no hay nada que escanear — manda el manifest
 * commiteado, que se genero aqui con las URLs del bucket.
 *
 * La comprobacion es "no hay ni una carpeta out/", no "no existe brands/": las
 * marcas siguen en el repo (brand.json, el copy, las plantillas) y solo faltan
 * los renders. Y se exige que el manifest tenga posts: si un dia se borra por
 * error, es mejor romper el build que desplegar una app vacia. */
const hayRenders = listDirs(BRANDS_DIR).some((b) => fs.existsSync(path.join(BRANDS_DIR, b, 'out')))
if (!hayRenders) {
  const m = readJson(path.join(DATA, 'index.json'), null)
  const n = m?.brands?.reduce((t, b) => t + (b.posts?.length || 0), 0) || 0
  if (!n) {
    console.error(`[build-index] no hay renders en brands/<marca>/out/ y data/index.json ${m ? 'no lista ningun post' : 'no existe'}.
En la laptop: corre tools/render.py y luego \`npm run prepare-assets\`.
En un clon: data/index.json tiene que venir en el repo — revisa que no se haya ignorado.`)
    process.exit(1)
  }
  console.log(`[build-index] sin renders locales: sirve el manifest del repo · ${m.brands.length} marcas · ${n} posts · build ${m.buildId}` +
    (m.mediaBase ? ` · imagenes en ${m.mediaBase}` : ''))
  process.exit(0)
}

hashCache = readJson(HASH_CACHE, {}) || {}

const brands = []

for (const brandId of listDirs(BRANDS_DIR)) {
  const brandDir = path.join(BRANDS_DIR, brandId)
  const outDir = path.join(brandDir, 'out')
  if (!fs.existsSync(outDir)) continue

  const conf = readJson(path.join(brandDir, 'brand.json'), {})
  const chrome = BRAND_CHROME[brandId] || { accent: '#8b8b96', accent2: '#c9c9d2', label: '' }

  /* Source-of-truth copy lives in brands/<b>/posts/<series>.json. The out/ folder only
   * has rendered slides + a generated captions.md, so read captions from the JSON —
   * it also fixes the posting ORDER, which alphabetical folder listing would lose. */
  const copyBySeries = {}
  /* Meses en orden cronológico, no alfabético (ago < oct < sep rompería la cola) */
  const MONTH_ORDER = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const seriesFiles = (fs.existsSync(path.join(brandDir, 'posts')) ? fs.readdirSync(path.join(brandDir, 'posts')) : [])
    .sort((a, b) => {
      const ia = MONTH_ORDER.indexOf(a.replace('.json', ''))
      const ib = MONTH_ORDER.indexOf(b.replace('.json', ''))
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b)
    })
  for (const f of seriesFiles) {
    if (!f.endsWith('.json')) continue
    const data = readJson(path.join(brandDir, 'posts', f))
    if (!data?.posts) continue
    const bySlug = {}
    data.posts.forEach((p, order) => { bySlug[p.slug] = { ...p, order } })
    /* Los archivos (`posted-ago.json` = ya publicado, `caducado-ago.json` = la
     * fecha pasó sin publicarlo) declaran `series: "ago"` igual que `ago.json`,
     * así que ASIGNAR aquí lo pisaba entero: agosto se quedaba sin copy y la app
     * respondía "este post no tiene ese texto" al copiar el caption. Se fusiona,
     * y la cola viva siempre gana. Archivo = cualquier nombre que no sea
     * `<serie>.json`, para que un archivo nuevo no tenga que registrarse aquí. */
    const key = data.series || f.replace(/\.json$/, '')
    const prev = copyBySeries[key] || {}
    copyBySeries[key] = f === `${key}.json`
      ? { ...prev, ...bySlug }
      : { ...bySlug, ...prev }
  }

  /* Fecha real de publicación: serie mensual + día del slug ("13-…"). El año no
   * vive en ningún dato, así que es la constante de la ronda. Series no
   * mensuales (s1-…) → null y la UI no muestra fecha. */
  function postDate(seriesId, slug) {
    const month = MONTH_ORDER.indexOf(seriesId) + 1
    const m = slug.match(/^(\d{1,2})-/)
    if (!month || !m) return null
    return `2026-${String(month).padStart(2, '0')}-${m[1].padStart(2, '0')}`
  }

  const brand = {
    id: brandId,
    name: conf.name || brandId,
    tag: conf.tag || '',
    accent: chrome.accent,
    accent2: chrome.accent2,
    label: chrome.label,
    series: [],
    posts: [],
  }

  const orderedSeries = listDirs(outDir).sort((a, b) => {
    const ia = MONTH_ORDER.indexOf(a)
    const ib = MONTH_ORDER.indexOf(b)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b)
  })
  for (const seriesId of orderedSeries) {
    const seriesDir = path.join(outDir, seriesId)
    const slugs = listDirs(seriesDir)
    if (!slugs.length) continue

    const copyBySlug = copyBySeries[seriesId] || {}
    const label = seriesLabel(seriesId, copyBySlug)
    brand.series.push({ id: seriesId, label, count: slugs.length })

    const entries = []

    for (const slug of slugs) {
      const postDir = path.join(seriesDir, slug)
      const copy = copyBySlug[slug] || {}
      const cover = copy.slides?.[0] || {}

      const formats = {}
      for (const [fmt, dirName] of [['ig', 'ig'], ['tt', 'tt']]) {
        const files = listSlides(path.join(postDir, dirName))
        if (!files.length) continue
        formats[fmt] = files.map((file) => {
          const rel = `${brandId}/${seriesId}/${slug}/${dirName}/${file}`
          const src = path.join(postDir, dirName, file)
          const v = fingerprint(src)
          if (!SOLO_MANIFEST) {
            linkOrCopy(src, path.join(PUBLIC, 'posts', rel))
            queueResize(src, path.join(PUBLIC, 'preview', rel), 540, 74, 'previews')
          }
          /* La misma huella para el original y su preview: las dos derivan del
           * mismo archivo fuente, así que una sola lectura sirve para las dos. */
          return { full: `${MEDIA_BASE}/posts/${rel}?v=${v}`, preview: `${MEDIA_BASE}/preview/${rel}?v=${v}` }
        })
      }
      if (!formats.ig && !formats.tt) continue

      const coverSrc = path.join(postDir, formats.ig ? 'ig' : 'tt', listSlides(path.join(postDir, formats.ig ? 'ig' : 'tt'))[0])
      const thumbRel = `${brandId}/${seriesId}/${slug}.jpg`
      const coverV = fingerprint(coverSrc)
      if (!SOLO_MANIFEST) queueResize(coverSrc, path.join(PUBLIC, 'thumb', thumbRel), 300, 68, 'thumbs')

      const pdfSrc = path.join(postDir, 'li.pdf')
      const pdf = fs.existsSync(pdfSrc)
        ? `${MEDIA_BASE}/posts/${brandId}/${seriesId}/${slug}/li.pdf?v=${fingerprint(pdfSrc)}`
        : null
      if (pdf && !SOLO_MANIFEST) linkOrCopy(pdfSrc, path.join(PUBLIC, 'posts', brandId, seriesId, slug, 'li.pdf'))

      entries.push({
        id: `${brandId}/${seriesId}/${slug}`,
        brand: brandId,
        series: seriesId,
        seriesLabel: label,
        slug,
        date: postDate(seriesId, slug),
        order: copy.order ?? 999,
        /* F1: los `*asteriscos*` marcan el tramo de acento para el renderer;
         * en el título de la app se limpian */
        title: (cover.h || slug.replace(/-/g, ' ')).replace(/\*/g, ''),
        sub: (cover.b || cover.sub || '').replace(/\*/g, ''),
        kicker: cover.kicker || '',
        thumb: `${MEDIA_BASE}/thumb/${thumbRel}?v=${coverV}`,
        ig: formats.ig || [],
        tt: formats.tt || [],
        captions: {
          ig: copy.caption?.ig || '',
          tt: copy.caption?.tt || '',
          fb: copy.caption?.fb || '',
        },
        alt: copy.alt || '',
        pdf,
      })
    }

    entries.sort((a, b) => a.order - b.order)
    brand.posts.push(...entries)
  }

  if (brand.posts.length) brands.push(brand)
}

await drainResizeQueue()

/* ---------------------------------------------------------------- prune */
/* El script solo AGREGABA: un post que perdió láminas, se renombró o cuya serie
 * murió dejaba sus archivos viejos en public/ para siempre (643 láminas fantasma
 * el día que se descubrió). El manifest no las lista, así que la app se ve bien,
 * pero cualquier cosa que sirva la carpeta tal cual — o un build que reuse
 * public/ — entrega versiones viejas. Lo que esta pasada no produjo, se va. */
function prune(root) {
  if (!fs.existsSync(root)) return
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        walk(full)
        if (!fs.readdirSync(full).length) fs.rmdirSync(full)
      } else if (!managed.has(path.resolve(full))) {
        fs.rmSync(full, { force: true })
        stats.pruned++
      }
    }
  }
  walk(root)
}
if (!SOLO_MANIFEST) for (const dir of ['posts', 'preview', 'thumb']) prune(path.join(PUBLIC, dir))

/* La caché se poda igual que public/: lo que esta pasada no pidió es de una
 * lámina que se re-renderizó o de un post que ya no existe. Sin esto crecería
 * sin fin y acabaría chocando con el límite de 1 GB de la caché de Vercel. */
if (!SOLO_MANIFEST && fs.existsSync(CACHE)) {
  for (const e of fs.readdirSync(CACHE)) {
    const full = path.join(CACHE, e)
    if (!cacheKeep.has(path.resolve(full))) {
      fs.rmSync(full, { force: true })
      stats.cachePruned++
    }
  }
}

/* ---------------------------------------------------------------- icons */

const ICON_SVG = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="40" fill="#0E0E11"/>
  <rect x="44" y="34" width="92" height="112" rx="10" fill="#2a2a34"/>
  <rect x="36" y="28" width="92" height="112" rx="10" fill="#4a4a5c"/>
  <rect x="28" y="22" width="92" height="112" rx="10" fill="#F2F1EE"/>
  <rect x="42" y="40" width="64" height="9" rx="4.5" fill="#8b73ff"/>
  <rect x="42" y="60" width="50" height="7" rx="3.5" fill="#c9c7d6"/>
  <rect x="42" y="76" width="58" height="7" rx="3.5" fill="#c9c7d6"/>
  <rect x="42" y="92" width="38" height="7" rx="3.5" fill="#c9c7d6"/>
  <circle cx="132" cy="132" r="26" fill="#8b73ff"/>
  <path d="M120 132l8 8 16-17" stroke="#0E0E11" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`

mkdirp(PUBLIC)
fs.writeFileSync(path.join(PUBLIC, 'icon.svg'), ICON_SVG(180))
if (sharp) {
  for (const size of [180, 512]) {
    const dest = path.join(PUBLIC, `icon-${size}.png`)
    if (!fs.existsSync(dest)) {
      await sharp(Buffer.from(ICON_SVG(size))).resize(size, size).png().toFile(dest)
    }
  }
}

/* ---------------------------------------------------------------- manifest */

const totalPosts = brands.reduce((n, b) => n + b.posts.length, 0)
mkdirp(DATA)
fs.writeFileSync(HASH_CACHE, JSON.stringify(hashNext))
/* `buildId` cambia en cada pasada que toca contenido: la app lo enseña en
 * /respaldo para poder confirmar de un vistazo qué versión está sirviendo el
 * celular sin adivinar si la caché mintió. */
const buildId = crypto
  .createHash('sha1')
  .update(JSON.stringify(brands))
  .digest('hex')
  .slice(0, 8)
fs.writeFileSync(
  path.join(DATA, 'index.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), buildId, mediaBase: MEDIA_BASE, totalPosts, brands }, null, 0),
)

console.log(
  `[build-index] ${brands.length} marcas · ${totalPosts} posts · ` +
  `${stats.linked} archivos enlazados · ${stats.previews} previews · ${stats.thumbs} miniaturas · ` +
  `${stats.skipped} ya al día · ${stats.cached} de caché · ${stats.pruned}+${stats.cachePruned} podados · build ${buildId}` +
  (MEDIA_BASE ? ` · originales en ${MEDIA_BASE}` : ''),
)
if (!totalPosts) {
  console.error('[build-index] no se encontró ningún post en brands/<marca>/out/ — ¿corriste tools/render.py?')
  process.exit(1)
}

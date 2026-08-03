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
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BRANDS_DIR = path.join(ROOT, 'brands')
const PUBLIC = path.join(ROOT, 'public')
const DATA = path.join(ROOT, 'data')

/* Chrome accents. Each brand's real palette lives in brands/<b>/brand.json and in
 * COLORES.md, but those are tuned for print-like slides — a few are unreadable as UI
 * accents on a dark chassis (Propaga's crimson #be001a in particular). These are the
 * on-dark members of each brand's own palette, not new colours. */
const BRAND_CHROME = {
  comehometag: { accent: '#8b73ff', accent2: '#ec6aa6', label: 'Protección QR' },
  qolca: { accent: '#5aa7ff', accent2: '#7fd7c4', label: 'Automatización e IA' },
  propaga: { accent: '#ff7a1f', accent2: '#ffc266', label: 'Marketing para negocios' },
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

const stats = { linked: 0, previews: 0, thumbs: 0, skipped: 0 }

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

function linkOrCopy(src, dest) {
  if (isFresh(src, dest)) {
    stats.skipped++
    return
  }
  mkdirp(path.dirname(dest))
  try {
    fs.rmSync(dest, { force: true })
    fs.linkSync(src, dest)
  } catch {
    fs.copyFileSync(src, dest)
  }
  stats.linked++
}

const resizeQueue = []
function queueResize(src, dest, width, quality, counter) {
  if (isFresh(src, dest)) {
    stats.skipped++
    return
  }
  resizeQueue.push({ src, dest, width, quality, counter })
}

async function drainResizeQueue() {
  if (!resizeQueue.length) return
  const CONCURRENCY = 8
  let i = 0
  let done = 0
  const total = resizeQueue.length
  async function worker() {
    while (i < resizeQueue.length) {
      const job = resizeQueue[i++]
      mkdirp(path.dirname(job.dest))
      if (sharp) {
        await sharp(job.src)
          .resize({ width: job.width, withoutEnlargement: true })
          .jpeg({ quality: job.quality, progressive: true, mozjpeg: true })
          .toFile(job.dest)
      } else {
        fs.copyFileSync(job.src, job.dest)
      }
      stats[job.counter]++
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
    copyBySeries[data.series || f.replace(/\.json$/, '')] = bySlug
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

  for (const seriesId of listDirs(outDir)) {
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
          linkOrCopy(src, path.join(PUBLIC, 'posts', rel))
          queueResize(src, path.join(PUBLIC, 'preview', rel), 540, 74, 'previews')
          return { full: `/posts/${rel}`, preview: `/preview/${rel}` }
        })
      }
      if (!formats.ig && !formats.tt) continue

      const coverSrc = path.join(postDir, formats.ig ? 'ig' : 'tt', listSlides(path.join(postDir, formats.ig ? 'ig' : 'tt'))[0])
      const thumbRel = `${brandId}/${seriesId}/${slug}.jpg`
      queueResize(coverSrc, path.join(PUBLIC, 'thumb', thumbRel), 300, 68, 'thumbs')

      const pdf = fs.existsSync(path.join(postDir, 'li.pdf')) ? `/posts/${brandId}/${seriesId}/${slug}/li.pdf` : null
      if (pdf) linkOrCopy(path.join(postDir, 'li.pdf'), path.join(PUBLIC, 'posts', brandId, seriesId, slug, 'li.pdf'))

      entries.push({
        id: `${brandId}/${seriesId}/${slug}`,
        brand: brandId,
        series: seriesId,
        seriesLabel: label,
        slug,
        order: copy.order ?? 999,
        title: cover.h || slug.replace(/-/g, ' '),
        sub: cover.b || '',
        kicker: cover.kicker || '',
        thumb: `/thumb/${thumbRel}`,
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
fs.writeFileSync(
  path.join(DATA, 'index.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), totalPosts, brands }, null, 0),
)

console.log(
  `[build-index] ${brands.length} marcas · ${totalPosts} posts · ` +
  `${stats.linked} archivos enlazados · ${stats.previews} previews · ${stats.thumbs} miniaturas · ` +
  `${stats.skipped} ya al día`,
)
if (!totalPosts) {
  console.error('[build-index] no se encontró ningún post en brands/<marca>/out/ — ¿corriste tools/render.py?')
  process.exit(1)
}

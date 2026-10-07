#!/usr/bin/env node
/**
 * render_futurx.mjs: las laminas de futurX, con el sistema visual de www.futurx.pe.
 *
 * futurX NO usa F1 (foto a sangre + velo negro + mayusculas gigantes). Sus posts
 * son paginas del sitio: fondo claro, texto navy, coral como unico acento, Outfit
 * en los titulares, filetes de 1 px, paneles de papel y el chevron de la X. Todo
 * lo que decide como se ve esta en brands/futurx/BRAND.md; este archivo solo lo
 * ejecuta.
 *
 * COMO: cada lamina es un HTML maquetado a 360 px de ancho (el ancho movil para
 * el que se disena el sitio) con brands/futurx/plantilla/futurx.css, y Chromium
 * lo fotografia a 3x: 360x450 -> ig/ 1080x1350, 360x640 -> tt/ 1080x1920. Asi
 * los px del CSS son los px del sitio y nada se reinterpreta.
 *
 * Esquema de brands/futurx/posts/<serie>.json (mismas claves que F1 donde se
 * puede, para que el skill copy-carruseles y la app sigan sirviendo):
 *
 *   { "brand": "futurX", "series": "<id>", "format": "futurx", "posts": [ {
 *       "slug", "date"?, "caption": {ig, tt}, "alt",
 *       "slides": [
 *         { "role": "cover",  "kicker"?, "h", "nombre"?, "b"?, "hechos"?: [{t, v}], "photo"?, "pie"?, "foco"?, "sinLogo"?, "ciudad"? },
 *         { "role": "value",  "label"?, "h", "b"?, "items"?: [..], "photo"?, "pie"? },
 *         { "role": "value",  "n": 1, "h", "b"?, "items"? }         -> tarjeta de paso
 *         { "role": "value",  "cita": true, "h", "b"? }            -> mensaje clave
 *         { "role": "stat",   "label"?, "cifra", "rotulo", "barra"?: 0..1, "h"?, "b"? },
 *         { "role": "closer", "h", "b"?, "url"? }               -> SIN boton
 *       ] } ] }
 *
 *   - "foco": object-position de la foto ("50% 30%"), para no cortar caras.
 *   - "tono": "banda" | "blanco" fuerza la superficie; si no, portada y cierre van
 *     en blanco y las interiores alternan papel y blanco, como las secciones.
 *   - El cierre NO lleva boton (Carlos, 2026-10-02: "no hacen falta botones en
 *     los posts, es ridiculo": un post no es una pagina y nadie puede tocarlo).
 *     Lleva logo, h, b opcional y la direccion en texto plano. Un campo "cta"
 *     en cualquier lamina CORTA el render. No se vuelve a agregar.
 *   - *asteriscos* NO pintan palabras de coral: el sitio lo prohibe (una palabra
 *     del titular en otro color es el punto 15 de su lista contra el look de IA).
 *     Se quitan y se avisa.
 *
 * Comprobaciones que CORTAN el render (una lamina asi no sale):
 *   - texto que se sale de la lamina o de su zona segura (TikTok incluida)
 *   - guiones o rayas en el copy visible (regla del sitio) y emoji en la lamina
 *   - un campo "cta" (boton) en cualquier lamina
 *
 * Uso:  node tools/render_futurx.mjs <serie> [slug1,slug2]
 *       node tools/render_futurx.mjs <serie> --hoja     ademas, out/<serie>/_hoja.jpg
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BRAND = path.join(ROOT, 'brands', 'futurx')
const FONTS = pathToFileURL(path.resolve(ROOT, '..', 'shared', 'fonts')).href
const FORMATOS = { ig: 450, tt: 640 }
const ESCALA = 3
const TMP = path.join(BRAND, '.lamina.html')

const args = process.argv.slice(2)
const serie = args.find((a) => !a.startsWith('--'))
const soloSlugs = args.filter((a) => !a.startsWith('--'))[1]?.split(',') ?? null
const conHoja = args.includes('--hoja')
if (!serie) {
  console.error('uso: node tools/render_futurx.mjs <serie> [slug1,slug2] [--hoja]')
  process.exit(1)
}

const brand = JSON.parse(fs.readFileSync(path.join(BRAND, 'brand.json'), 'utf8'))
const datos = JSON.parse(fs.readFileSync(path.join(BRAND, 'posts', `${serie}.json`), 'utf8'))
const css = fs.readFileSync(path.join(BRAND, 'plantilla', 'futurx.css'), 'utf8').replaceAll('{{FONTS}}', FONTS)

/* El logo es el mismo SVG que sirve el sitio (web/public/logo.svg). */
const LOGO = fs.readFileSync(path.join(BRAND, brand.logo_svg), 'utf8')
  .replace(/<\?xml[^>]*>/, '')
  .replace(/<title>.*?<\/title>/s, '')
  .replace('<svg ', '<svg class="marca" aria-hidden="true" ')

/* La X abierta, copiada de web/components/ui/chevron-motif.tsx. */
/* Sello de ciudad de la portada del jurado (Carlos, 2026-10-06): el nombre de
 * la ciudad como un logo chico, en Outfit sobre coral, girado a la derecha y
 * con el centro justo en la esquina superior derecha de la foto. La foto se
 * corre 16 px a la izquierda para que la mitad que sobresale no se salga de
 * la lamina. "Nueva York" se parte en dos lineas para que quede compacto. */
const sello = (ciudad, donde) =>
  `<span class="sello" style="position:absolute;top:0;right:0;transform:translate(50%,-50%) rotate(10deg);background:var(--color-fx-coral);color:#fff;border:2px solid #fff;border-radius:10px;padding:7px 10px 8px;font-family:var(--font-display);font-weight:700;font-size:16px;line-height:.95;letter-spacing:-0.02em;text-align:center;white-space:nowrap;box-shadow:0 3px 10px rgba(27,45,81,.25)">${txt(ciudad, donde).replace(' ', '<br>')}</span>`

const MOTIVO = `<svg class="motivo" viewBox="0 0 78 64" aria-hidden="true">
  <polygon fill="var(--color-fx-navy-050)" points="43,2 2,32 43,62 43,45 26,32 43,19"/>
  <polygon fill="none" stroke="var(--color-fx-navy-100)" stroke-width="1.4"
    points="71.8,15.3 49,32 71.8,48.7 71.8,41.4 62.4,32 71.8,22.6"/>
</svg>`

/* ------------------------------------------------------------------ copy */
const GUION = /[-‐-―−]/
const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}]/u
const avisos = []
const errores = []

function limpiar(texto, donde) {
  let t = String(texto ?? '')
  if (/\*[^*]+\*/.test(t)) {
    avisos.push(`${donde}: *acento* quitado (futurX no pinta palabras sueltas de coral)`)
    t = t.replace(/\*([^*]+)\*/g, '$1')
  }
  if (GUION.test(t)) errores.push(`${donde}: lleva guion o raya: «${t}»`)
  if (EMOJI.test(t)) errores.push(`${donde}: lleva emoji: «${t}»`)
  return t
}

function esc(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
}
const txt = (t, donde) => esc(limpiar(t, donde))

function foto(s, donde) {
  if (!s.photo) return ''
  const src = path.join(BRAND, 'photos', s.photo)
  if (!fs.existsSync(src)) {
    errores.push(`${donde}: no existe photos/${s.photo}`)
    return ''
  }
  const pie = s.pie ? `<figcaption class="meta">${txt(s.pie, donde + '.pie')}</figcaption>` : ''
  const foco = s.foco ? ` style="object-position:${esc(String(s.foco))}"` : ''
  const marca = s.ciudad ? sello(s.ciudad, donde + '.ciudad') : ''
  const corrida = s.ciudad ? ';position:relative;margin-right:16px' : ''
  return `<figure class="foto llena" style="margin-top:${s.ciudad ? 30 : 22}px${corrida}"><img src="${pathToFileURL(src).href}" alt=""${foco}>${marca}${pie}</figure>`
}

/* ------------------------------------------------------------- laminas */
function lamina(s, i, total, fmt, donde) {
  const interior = s.role !== 'cover' && s.role !== 'closer'
  const tono = s.tono ?? (interior && i % 2 === 1 ? 'banda' : 'blanco')
  const clases = ['lamina', fmt, tono === 'banda' ? 'banda' : '', `rol-${s.role}`].filter(Boolean).join(' ')
  let cuerpo = ''
  if (s.cta != null) errores.push(`${donde}: lleva "cta": futurX no pone botones en los posts (BRAND.md)`)

  if (s.role === 'cover') {
    const hechos = s.hechos?.length
      ? `<div class="abajo papel" style="margin-top:20px;padding:18px 20px"><ul class="hechos">${s.hechos
          .map((h, k) => `<li><p class="t">${txt(h.t, `${donde}.hechos${k}.t`)}</p><p class="v">${txt(h.v, `${donde}.hechos${k}.v`)}</p></li>`)
          .join('')}</ul></div>`
      : ''
    // sinLogo y nombre: excepcion de Carlos (2026-10-06) para los posts del
    // jurado, que se distinguen del resto y ganan espacio para la foto. El
    // logo sigue en el cierre. Con nombre debajo, el titular baja al d2 del
    // sitio: en d1 ocupa tres lineas y la foto queda aplastada.
    const arriba = s.sinLogo ? '' : `<div class="arriba">${LOGO}</div>`
    const margen = s.sinLogo ? 0 : s.photo || s.hechos?.length ? 32 : 44
    cuerpo = `<div class="rays"></div>${MOTIVO}
      ${arriba}
      <div class="stack" style="margin-top:${margen}px">
        ${s.kicker ? `<p class="meta">${txt(s.kicker, donde + '.kicker')}</p>` : ''}
        <h1 class="${s.nombre ? 'd2' : 'd1'}">${txt(s.h, donde + '.h')}</h1>
        ${s.nombre ? `<p class="h3" style="margin-top:12px">${txt(s.nombre, donde + '.nombre')}</p>` : ''}
        ${s.b ? `<p class="lead">${txt(s.b, donde + '.b')}</p>` : ''}
      </div>
      ${foto(s, donde)}${hechos}`
  } else if (s.role === 'closer') {
    cuerpo = `<div class="arriba">${LOGO}</div>
      <div class="stack" style="margin:auto 0">
        <h2 class="d2">${txt(s.h, donde + '.h')}</h2>
        ${s.b ? `<p class="lead">${txt(s.b, donde + '.b')}</p>` : ''}
        ${s.url && s.url !== brand.tag ? `<p class="meta" style="margin-top:20px">${txt(s.url, donde + '.url')}</p>` : ''}
      </div>
      <div class="pie"><span class="meta">${esc(brand.tag)}</span><span class="meta">${esc(brand.instagram)}</span></div>`
  } else if (s.role === 'stat') {
    const barra = typeof s.barra === 'number'
      ? `<div class="barra" style="margin-top:18px"><i style="width:${Math.round(Math.min(1, Math.max(0, s.barra)) * 100)}%"></i></div>`
      : ''
    cuerpo = `<div style="margin:auto 0">
        ${s.label ? `<p class="meta" style="margin-bottom:14px">${txt(s.label, donde + '.label')}</p>` : ''}
        <div class="cifra-fila"><span class="cifra">${txt(s.cifra, donde + '.cifra')}</span>
          ${s.rotulo ? `<span class="cifra-rotulo">${txt(s.rotulo, donde + '.rotulo')}</span>` : ''}</div>
        ${barra}
        <div class="stack" style="margin-top:28px">
          ${s.h ? `<h2 class="h3">${txt(s.h, donde + '.h')}</h2>` : ''}
          ${s.b ? `<p class="body">${txt(s.b, donde + '.b')}</p>` : ''}
        </div>
      </div>`
  } else if (s.cita) {
    cuerpo = `<div class="cita stack" style="margin:auto 0">
        <h2 class="d2">${txt(s.h, donde + '.h')}</h2>
        ${s.b ? `<p class="lead">${txt(s.b, donde + '.b')}</p>` : ''}
      </div>`
  } else {
    const items = s.items?.length
      ? `<ul class="lista" style="margin-top:22px">${s.items.map((it, k) => `<li>${txt(it, `${donde}.items${k}`)}</li>`).join('')}</ul>`
      : ''
    const bloque = `
        ${s.n != null ? `<p class="paso-n">${txt(String(s.n), donde + '.n')}</p>` : ''}
        ${s.label ? `<p class="meta">${txt(s.label, donde + '.label')}</p>` : ''}
        <h2 class="h2">${txt(s.h, donde + '.h')}</h2>
        ${s.b ? `<p class="lead">${txt(s.b, donde + '.b')}</p>` : ''}
        ${items}`
    const centrado = s.photo ? '' : 'margin:auto 0'
    cuerpo = s.n != null
      ? `<div class="papel stack" style="${centrado}">${bloque}</div>${foto(s, donde)}`
      : `<div class="stack" style="${centrado}">${bloque}</div>${foto(s, donde)}`
  }

  return `<!doctype html><html lang="es-PE"><head><meta charset="utf-8"><style>${css}</style></head>
<body><div class="${clases}">${cuerpo}</div></body></html>`
}

/* Todo lo visible tiene que caber dentro de la zona segura: el recuadro de la
 * lamina menos sus rellenos. Lo decorativo (rayas y motivo) puede salirse. */
async function revisarCaja(page) {
  return page.evaluate(() => {
    const l = document.querySelector('.lamina')
    const cs = getComputedStyle(l)
    const r = l.getBoundingClientRect()
    const zona = {
      top: r.top + parseFloat(cs.paddingTop) - 0.5,
      left: r.left + parseFloat(cs.paddingLeft) - 0.5,
      right: r.right - parseFloat(cs.paddingRight) + 0.5,
      bottom: r.bottom - parseFloat(cs.paddingBottom) + 0.5,
    }
    const fuera = []
    for (const el of l.querySelectorAll('h1,h2,p,li,img,.papel,.barra,.marca,figure')) {
      const b = el.getBoundingClientRect()
      if (b.width === 0 || b.height === 0) continue
      const sale = b.top < zona.top || b.left < zona.left || b.right > zona.right || b.bottom > zona.bottom
      if (sale && el.parentElement?.closest('[data-fuera]')) continue
      if (sale) {
        el.setAttribute('data-fuera', '')
        fuera.push(`${el.tagName.toLowerCase()} «${(el.textContent || '').trim().slice(0, 40)}» (${Math.round(b.bottom - zona.bottom)} px abajo)`)
      }
      if (el.tagName === 'IMG' && b.height < 150) fuera.push(`foto aplastada a ${Math.round(b.height)} px de alto`)
    }
    return fuera
  })
}

/* ---------------------------------------------------------------- main */
const posts = datos.posts.filter((p) => !soloSlugs || soloSlugs.includes(p.slug))
const navegador = await chromium.launch()
const hechos = []

try {
  for (const post of posts) {
    const dir = path.join(BRAND, 'out', serie, post.slug)
    const pendientes = []
    const erroresAntes = errores.length

    for (const [fmt, alto] of Object.entries(FORMATOS)) {
      const page = await navegador.newPage({ viewport: { width: 360, height: alto }, deviceScaleFactor: ESCALA })
      for (const [i, s] of post.slides.entries()) {
        const donde = `${post.slug} lamina ${i + 1}`
        const antes = errores.length
        // Desde un archivo y no con setContent: una pagina about:blank no puede
        // leer file://, y entonces ni las fotos ni Outfit cargan y Chromium
        // pinta con Segoe UI sin avisar.
        fs.writeFileSync(TMP, lamina(s, i, post.slides.length, fmt, donde))
        await page.goto(pathToFileURL(TMP).href, { waitUntil: 'load' })
        // Se piden las dos a mano: Chromium solo baja una fuente cuando algun
        // texto la usa, y una portada sin cuerpo nunca pide Roboto.
        await page.evaluate(() => Promise.all(['700 40px Outfit', '400 16px Roboto'].map((f) => document.fonts.load(f))))
        await page.evaluate(() => document.fonts.ready)
        const sinCargar = await page.evaluate(() => {
          const malas = [...document.images].filter((im) => !im.complete || im.naturalWidth === 0).map((im) => im.src)
          const fuentes = ['700 40px Outfit', '400 16px Roboto'].filter((f) => !document.fonts.check(f))
          return [...malas.map((m) => `foto sin cargar ${m}`), ...fuentes.map((f) => `fuente sin cargar ${f}`)]
        })
        for (const m of sinCargar) errores.push(`${donde} (${fmt}): ${m}`)
        const fuera = await revisarCaja(page)
        for (const f of fuera) errores.push(`${donde} (${fmt}): se sale de la zona segura: ${f}`)
        if (errores.length > antes) continue
        const png = await page.screenshot({ type: 'png' })
        pendientes.push({ fmt, i, png })
      }
      await page.close()
    }

    if (errores.length > erroresAntes) continue
    fs.rmSync(dir, { recursive: true, force: true })
    for (const { fmt, i, png } of pendientes) {
      const destino = path.join(dir, fmt, `${String(i + 1).padStart(2, '0')}.jpg`)
      fs.mkdirSync(path.dirname(destino), { recursive: true })
      // 4:4:4 a proposito: con el submuestreo de siempre, el coral sobre blanco
      // sale con el borde sucio y el filete de 1 px se emborrona.
      await sharp(png).jpeg({ quality: 92, chromaSubsampling: '4:4:4', mozjpeg: true }).toFile(destino)
    }
    const cap = post.caption ?? {}
    fs.writeFileSync(path.join(dir, 'captions.txt'),
      `== IG ==\n${cap.ig ?? ''}\n\n== TT ==\n${cap.tt ?? ''}\n\n== ALT ==\n${post.alt ?? ''}\n`)
    hechos.push(post.slug)
  }
} finally {
  await navegador.close()
  fs.rmSync(TMP, { force: true })
}

for (const a of avisos) console.warn('aviso:', a)
if (errores.length) {
  for (const e of errores) console.error('ERROR:', e)
  console.error(`\n${errores.length} problema(s). No se escribio ningun post con errores.`)
}
console.log(`listo: ${hechos.length} post(s) en brands/futurx/out/${serie}/`)

/* Hoja de contacto para revisar la tanda de una mirada: una fila por post. */
if (conHoja && hechos.length) {
  const filas = []
  for (const slug of hechos) {
    const d = path.join(BRAND, 'out', serie, slug, 'ig')
    const fotos = fs.readdirSync(d).filter((f) => f.endsWith('.jpg')).sort()
    filas.push(fotos.map((f) => path.join(d, f)))
  }
  const W = 360, H = 450, G = 16
  const cols = Math.max(...filas.map((f) => f.length))
  const lienzo = sharp({ create: { width: G + cols * (W + G), height: G + filas.length * (H + G), channels: 3, background: '#d7dbe3' } })
  const capas = []
  for (const [r, fila] of filas.entries()) {
    for (const [c, f] of fila.entries()) {
      capas.push({ input: await sharp(f).resize(W, H).toBuffer(), left: G + c * (W + G), top: G + r * (H + G) })
    }
  }
  await lienzo.composite(capas).jpeg({ quality: 88 }).toFile(path.join(BRAND, 'out', serie, '_hoja.jpg'))
  console.log(`hoja: brands/futurx/out/${serie}/_hoja.jpg`)
}

process.exit(errores.length ? 1 : 0)

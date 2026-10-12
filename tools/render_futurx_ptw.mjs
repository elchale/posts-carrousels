#!/usr/bin/env node
/**
 * render_futurx_ptw.mjs: lamina unica de la charla de Angel Feijoo en la
 * Perú Tech Week 2026 (Carlos, 2026-10-12).
 *
 * Toma el look de los banners de la PTW (ciudad de noche encendida, red de
 * nodos brillantes sobre los edificios, piso en perspectiva) pero con los
 * colores y la tipografia de futurX: navy de fondo, coral como unico acento,
 * Outfit. Todo es SVG y CSS, sin imagenes generadas.
 *
 * Uso: node tools/render_futurx_ptw.mjs <salida.jpg>
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BRAND = path.join(ROOT, 'brands', 'futurx')
const FONTS = pathToFileURL(path.resolve(ROOT, '..', 'shared', 'fonts')).href
const [salida] = process.argv.slice(2)
if (!salida) {
  console.error('uso: node tools/render_futurx_ptw.mjs <salida.jpg>')
  process.exit(1)
}

const W = 360
const H = 450
const url = (f) => pathToFileURL(path.join(BRAND, f)).href
// Logo de futurX en blanco: el navy pasa a blanco, la X sigue coral.
const logo = fs.readFileSync(path.join(BRAND, 'logo.svg'), 'utf8').replace(/#1B2D51/gi, '#FFFFFF')
const logoSrc = 'data:image/svg+xml;base64,' + Buffer.from(logo).toString('base64')

// Ciudad: edificios con alturas fijas (aleatorio con semilla para que no
// cambie entre renders) y una red de nodos que une algunas azoteas.
let semilla = 7
const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647)
let x = -4
const edificios = []
while (x < W + 4) {
  const w = 10 + azar() * 18
  const h = 22 + azar() * 52 + (Math.abs(x - 250) < 40 ? 22 : 0)
  edificios.push({ x, w, h })
  x += w + 1.5
}
const BASE = 392
const ciudad = edificios
  .map((e, k) => {
    const ventanas = []
    for (let vy = BASE - e.h + 6; vy < BASE - 4; vy += 6)
      for (let vx = e.x + 3; vx < e.x + e.w - 3; vx += 4)
        if (azar() > 0.55) ventanas.push(`<rect x="${vx.toFixed(1)}" y="${vy.toFixed(1)}" width="1.6" height="2.2" fill="${azar() > 0.5 ? '#FFB199' : '#FF7A5C'}" opacity="${(0.45 + azar() * 0.55).toFixed(2)}"/>`)
    return `<rect x="${e.x.toFixed(1)}" y="${(BASE - e.h).toFixed(1)}" width="${e.w.toFixed(1)}" height="${e.h.toFixed(1)}" fill="url(#torre)"/>${ventanas.join('')}`
  })
  .join('')
const nodos = edificios.filter((_, k) => k % 3 === 1).map((e) => [e.x + e.w / 2, BASE - e.h - 4 - azar() * 12])
const red = nodos
  .flatMap((a, i) => nodos.slice(i + 1, i + 3).map((b) => `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`))
  .join('')
const puntos = nodos.map(([cx, cy]) => `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.2"/>`).join('')
const estrellas = Array.from({ length: 60 }, () => `<circle cx="${(azar() * W).toFixed(1)}" cy="${(azar() * 260).toFixed(1)}" r="${(0.3 + azar() * 0.7).toFixed(2)}" opacity="${(0.2 + azar() * 0.6).toFixed(2)}"/>`).join('')

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "Outfit"; src: url("${FONTS}/Outfit%5Bwght%5D.ttf") format("truetype"); font-weight: 100 900; }
@font-face { font-family: "Roboto"; src: url("${FONTS}/Roboto%5Bwdth,wght%5D.ttf") format("truetype"); font-weight: 100 900; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; overflow: hidden; background: #0A1428; font-family: "Roboto", sans-serif; color: #fff; }
.lamina { position: relative; width: ${W}px; height: ${H}px; overflow: hidden;
  background: radial-gradient(120% 70% at 70% 100%, #3A2440 0%, #1B2D51 38%, #0A1428 75%); }
.fondo { position: absolute; inset: 0; }
.suelo { position: absolute; left: 0; right: 0; top: ${BASE}px; bottom: 0; overflow: hidden; }
.piso { position: absolute; left: -50%; right: -50%; top: 0; height: 170px; transform-origin: 50% 0;
  transform: perspective(160px) rotateX(62deg);
  background-image: linear-gradient(rgba(234,80,70,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(234,80,70,.55) 1px, transparent 1px);
  background-size: 22px 22px; -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 85%); }
.halo { position: absolute; left: 0; right: 0; top: 270px; height: 130px;
  background: radial-gradient(70% 100% at 65% 100%, rgba(234,80,70,.75), rgba(234,80,70,.15) 55%, transparent 75%); filter: blur(8px); }
.contenido { position: absolute; inset: 0; padding: 28px 28px 0; }
.arriba { display: flex; align-items: center; justify-content: space-between; }
.arriba img.fx { height: 26px; }
.arriba img.ptw { height: 22px; filter: brightness(0) invert(1); }
.kicker { margin-top: 0; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: #FF8A7A; font-weight: 600; }
h1 { margin-top: 40px; font-family: "Outfit", sans-serif; font-weight: 700; font-size: 31px; line-height: 1.06; letter-spacing: -0.025em;
  text-shadow: 0 0 18px rgba(234,80,70,.35); }
.ficha { margin-top: 26px; display: flex; align-items: center; gap: 14px; }
.retrato { width: 92px; height: 92px; border-radius: 50%; flex: none; padding: 3px;
  background: conic-gradient(from 200deg, #EA5046, #FFB199, #EA5046 60%, rgba(234,80,70,.2), #EA5046);
  box-shadow: 0 0 24px rgba(234,80,70,.55); }
.retrato img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; object-position: 50% 30%; display: block; }
.nombre { font-family: "Outfit", sans-serif; font-weight: 700; font-size: 21px; letter-spacing: -0.015em; }
.fecha { margin-top: 3px; font-size: 13.5px; line-height: 1.35; color: #D6DDEB; }
.fecha span { font-size: 10.5px; color: #9FB0CC; white-space: nowrap; }
.datos { margin-top: 8px; display: flex; gap: 12px; font-family: "Outfit", sans-serif; font-weight: 600; font-size: 12.5px; }
.datos p { border-left: 2px solid #EA5046; padding-left: 7px; }
</style></head><body><div class="lamina">
  <svg class="fondo" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <defs>
      <linearGradient id="torre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B3E66"/><stop offset="1" stop-color="#121D36"/></linearGradient>
      <filter id="brillo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <g fill="#fff">${estrellas}</g>
  </svg>
  <div class="halo"></div>
  <div class="suelo"><div class="piso"></div></div>
  <svg class="fondo" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <g>${ciudad}</g>
    <rect x="0" y="${BASE}" width="${W}" height="1" fill="#EA5046" opacity=".8" filter="url(#brillo)"/>
    <g stroke="#EA5046" stroke-width=".7" opacity=".75">${red}</g>
    <g fill="#FFB199" filter="url(#brillo)">${puntos}</g>
  </svg>
  <div class="contenido">
    <div class="arriba"><img class="fx" src="${logoSrc}" alt=""><img class="ptw" src="${url('aliados/peru_tech_week.png')}" alt=""></div>
    <h1>Charla parte de la hackathon futurX</h1>
    <div class="ficha">
      <div class="retrato"><img src="${url('photos/expositor_angel_feijoo_terno.webp')}" alt=""></div>
      <div>
        <p class="nombre">Angel Feijoo</p>
        <p class="fecha">Jueves 15 de octubre, 7:00 p. m. <span>Hora de Perú</span></p>
        <div class="datos"><p>futurX</p><p>MIT EmTech AI</p></div>
      </div>
    </div>
  </div>
</div></body></html>`

const navegador = await chromium.launch()
const pagina = await navegador.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 3 })
// Desde un archivo: con setContent la pagina es about:blank y no carga file://.
const tmp = path.join(os.tmpdir(), 'futurx_ptw.html')
fs.writeFileSync(tmp, html)
await pagina.goto(pathToFileURL(tmp).href, { waitUntil: 'load' })
await pagina.evaluate(() => document.fonts.ready)
fs.mkdirSync(path.dirname(path.resolve(salida)), { recursive: true })
await pagina.screenshot({ path: salida, type: 'jpeg', quality: 92 })
await navegador.close()
console.log('listo:', salida)

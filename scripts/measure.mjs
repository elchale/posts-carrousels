#!/usr/bin/env node
/**
 * measure.mjs — mide la app como la vive el celular, no como la vive la laptop.
 *
 *   node scripts/measure.mjs http://127.0.0.1:3000 "etiqueta"
 *
 * Dos cosas que hay que hacer bien o el número miente:
 *
 * 1. ESTRANGULAR LA RED. En localhost los 1,9 MB de originales que la app se
 *    bajaba de más entraban tan rápido que el evento `load` ni se enteraba.
 *    Con 4G lento (1,6 Mbps / 300 ms) el costo real aparece.
 *
 * 2. CONTAR LOS BYTES DE VERDAD. `content-length` no viene en las respuestas
 *    comprimidas, así que contarlo por ahí dejaba el HTML y los nueve chunks de
 *    JS en 0 KB — justo lo que más pesa al abrir. Los bytes salen de
 *    `Network.loadingFinished.encodedDataLength`, que es lo que de verdad cruzó
 *    el cable.
 *
 * Reporta:
 *   1a lámina   cuándo se ve la primera imagen (lo primero que miras)
 *   todo a la vista  cuándo terminó la última preview/miniatura
 *   load        el evento load de la ventana
 *   KB al load / KB +8s   bytes reales, antes y después del calentamiento
 *
 * Y falla (exit 1) si alguna URL con ?v=<huella> quedó rota.
 */
import { chromium } from 'playwright'

const argv = process.argv.slice(2)
const flags = argv.filter((a) => a.startsWith('--'))
const rest = argv.filter((a) => !a.startsWith('--'))
const BASE = (rest[0] || 'http://127.0.0.1:3000').replace(/\/$/, '')
const LABEL = rest[1] || BASE
/* Sin estrangular, para medir CUÁNTOS bytes cuesta un post de verdad: con 4G el
 * total a los 8 s lo decide el ancho de banda, no la app — las dos versiones dan
 * el mismo número porque las dos llenan el tubo. */
const THROTTLE = !flags.includes('--no-throttle')
const RUNS = Number((flags.find((f) => f.startsWith('--runs=')) || '--runs=3').split('=')[1])

/* iPhone de gama media en 4G con mala señal — el escenario real de "publicar
 * desde el celular", que es para lo que existe esta app. */
const NET = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 300,
}

const PAGES = [
  ['/', 'Inicio'],
  ['/comehometag', 'Marca (grilla)'],
  ['/comehometag/ago/26-cuidar-no-vigilar', 'Post'],
]

const broken = []

async function measure(browser, url, name) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Network.enable')
  if (THROTTLE) await cdp.send('Network.emulateNetworkConditions', NET)

  const t0 = Date.now()
  let bytes = 0
  let firstImage = 0
  let lastVisible = 0
  const kind = new Map()   // requestId -> 'visible' | 'full' | 'otro'

  cdp.on('Network.requestWillBeSent', (e) => {
    const u = e.request.url
    kind.set(e.requestId, /\/(preview|thumb)\//.test(u) ? 'visible' : /\/posts\//.test(u) ? 'full' : 'otro')
  })
  cdp.on('Network.loadingFinished', (e) => {
    bytes += e.encodedDataLength || 0
    if (kind.get(e.requestId) === 'visible') {
      const t = Date.now() - t0
      if (!firstImage) firstImage = t
      lastVisible = t
    }
  })
  page.on('response', (r) => {
    if (r.status() >= 400) broken.push(`${r.status()} ${r.url().replace(BASE, '')}`)
  })

  await page.goto(url, { waitUntil: 'load' })
  const load = Date.now() - t0
  const atLoad = bytes
  /* Sin estrangular todo termina rapidísimo; con 4G hay que darle margen al
   * calentamiento para que el total signifique algo. */
  await page.waitForTimeout(THROTTLE ? 8000 : 6000)

  await ctx.close()
  return { name, firstImage, lastVisible, load, atLoad, total: bytes }
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]

const browser = await chromium.launch()
const rows = []
for (const [p, name] of PAGES) {
  /* Una sola pasada es ruido puro: con 300 ms de latencia por petición, dos
   * corridas idénticas se separan medio segundo. Mediana de RUNS. */
  const runs = []
  for (let k = 0; k < RUNS; k++) runs.push(await measure(browser, BASE + p, name))
  rows.push({
    name,
    firstImage: median(runs.map((r) => r.firstImage)),
    lastVisible: median(runs.map((r) => r.lastVisible)),
    load: median(runs.map((r) => r.load)),
    atLoad: median(runs.map((r) => r.atLoad)),
    total: median(runs.map((r) => r.total)),
  })
}
await browser.close()

console.log(`
  ${LABEL}
  ${THROTTLE ? '4G lento · 1,6 Mbps · 300 ms de latencia' : 'sin estrangular — para contar bytes, no tiempos'} · iPhone 390x844 @3x · mediana de ${RUNS}
`)
console.log(`  pantalla           1a img   a la vista     load   KB al load   ${THROTTLE ? 'KB +8s' : ' KB total'}`)
console.log('  ' + '-'.repeat(70))
for (const r of rows) {
  console.log(
    '  ' + r.name.padEnd(18) +
    `${r.firstImage || 0}ms`.padStart(7) + '  ' + `${r.lastVisible || 0}ms`.padStart(11) + '  ' +
    `${r.load}ms`.padStart(7) + '  ' +
    `${(r.atLoad / 1024).toFixed(0)}`.padStart(11) + '  ' + `${(r.total / 1024).toFixed(0)}`.padStart(7),
  )
}
if (broken.length) {
  console.log(`\n  ✗ ${broken.length} peticiones rotas:`)
  for (const b of [...new Set(broken)].slice(0, 10)) console.log('     ', b)
  process.exitCode = 1
} else {
  console.log('\n  ✓ sin peticiones rotas')
}

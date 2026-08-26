#!/usr/bin/env node
/**
 * smoke.mjs — que lo que se arregló por velocidad no rompió lo que la app hace.
 *
 *   node scripts/smoke.mjs http://127.0.0.1:3000
 *
 * Comprueba de punta a punta, en un navegador de verdad:
 *   1. las tres pantallas cargan sin errores de consola;
 *   2. TODA imagen pintada llegó completa (naturalWidth > 0) — una URL con la
 *      huella mal puesta se vería como un hueco, no como un error;
 *   3. guardar las fotos funciona: en escritorio no hay menú de compartir, así
 *      que cae a descargas y se cuentan los archivos que salen, con el nombre
 *      ya sin el ?v=<huella> pegado;
 *   4. marcar como publicado sobrevive a recargar (localStorage);
 *   5. los encabezados de caché son los correctos: revalidar el HTML,
 *      inmutable las láminas.
 */
import { chromium } from 'playwright'

const BASE = (process.argv[2] || 'http://127.0.0.1:3000').replace(/\/$/, '')
const POST = '/comehometag/ago/26-cuidar-no-vigilar'
const fails = []
const ok = (cond, msg) => { console.log(`  ${cond ? '✓' : '✗'} ${msg}`); if (!cond) fails.push(msg) }

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(String(e)))

console.log('\n  pantallas')
for (const [p, needle] of [['/', 'Avance total'], ['/comehometag', 'ComeHomeTag'], [POST, 'Instagram']]) {
  await page.goto(BASE + p, { waitUntil: 'load' })
  ok((await page.content()).includes(needle), `${p} renderiza («${needle}»)`)
}

console.log('\n  imágenes')
await page.goto(BASE + POST, { waitUntil: 'load' })
await page.waitForTimeout(1500)
const imgs = await page.$$eval('img', (els) => els.map((e) => ({ src: e.getAttribute('src'), w: e.naturalWidth })))
ok(imgs.length > 0, `${imgs.length} imágenes en el post`)
ok(imgs.every((i) => i.w > 0), 'todas cargaron completas')
ok(imgs.every((i) => (i.src || '').includes('?v=')), 'todas llevan la huella ?v=')

console.log('\n  guardar las fotos')
const downloads = []
page.on('download', (d) => downloads.push(d.suggestedFilename()))
await page.waitForTimeout(2500)                       // deja correr el calentamiento diferido
await page.getByRole('button', { name: /Guardar \d+ fotos/ }).first().click()
await page.waitForTimeout(6000)
ok(downloads.length >= 6, `${downloads.length} archivos descargados`)
ok(downloads.every((n) => !n.includes('?') && n.endsWith('.jpg')), `nombres limpios (${downloads[0] || '—'})`)

console.log('\n  marcar como publicado')
await page.getByRole('button', { name: 'Instagram', exact: true }).last().click()
await page.waitForTimeout(400)
await page.reload({ waitUntil: 'load' })
await page.waitForTimeout(800)
const pressed = await page.$$eval('.marks__btn', (els) => els.map((e) => e.getAttribute('aria-pressed')))
ok(pressed.includes('true'), 'la marca sobrevive a recargar')

console.log('\n  encabezados de caché')
/* Con MEDIA_BASE apuntando a un bucket, las láminas llegan con URL absoluta:
 * pegarles BASE delante daría una URL rota y el test pasaría por accidente. */
const head = async (u) => (await ctx.request.head(/^https?:/.test(u) ? u : BASE + u)).headers()['cache-control'] || ''
ok((await head(POST)).includes('must-revalidate'), 'HTML revalida siempre')
/* El nombre del chunk cambia en cada build, así que se saca del HTML en vez de
 * escribirlo a mano — escrito a mano el test pasaría por 404. */
const chunk = (await page.content()).match(/\/_next\/static\/[^"']+\.js/)?.[0]
ok(!!chunk, `hay un chunk que probar (${chunk || '—'})`)
ok((await head(chunk)).includes('immutable'), '/_next/static sigue inmutable')
const thumb = imgs.find((i) => (i.src || '').includes('/preview/'))?.src
ok((await head(thumb)).includes('immutable'), 'láminas inmutables (seguro: la URL lleva huella)')

console.log('\n  consola')
ok(errors.length === 0, errors.length ? `${errors.length} errores: ${errors[0].slice(0, 90)}` : 'sin errores de consola')

/* Las páginas se prerenderizan en Vercel, en UTC, el día del deploy; el celular
 * las abre en otro huso y otro día. Cualquier texto que dependa de `new Date()`
 * durante el render (la insignia "HOY") sale distinto en los dos sitios: React
 * tira el HTML del servidor y avisa con el error #418 — y la insignia se queda
 * congelada en el día del build hasta el siguiente deploy.
 *
 * Estos dos husos están a 25 horas, así que su fecha local nunca coincide entre
 * sí: pase lo que pase, al menos uno cae en un día distinto al del build. */
console.log('\n  fecha del dispositivo')
for (const tz of ['Pacific/Kiritimati', 'Pacific/Midway']) {
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: tz })
  const p2 = await c.newPage()
  const errs = []
  p2.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
  p2.on('pageerror', (e) => errs.push(String(e)))
  for (const ruta of ['/', '/comehometag', POST]) {
    await p2.goto(BASE + ruta, { waitUntil: 'load' })
    await p2.waitForTimeout(700)
  }
  const choque = errs.filter((e) => /418|423|425|[Hh]ydrat/.test(e))
  ok(choque.length === 0, `en ${tz} sin choque de hidratación${choque.length ? `: ${choque[0].slice(0, 70)}` : ''}`)
  await c.close()
}

await browser.close()
console.log(fails.length ? `\n  ✗ ${fails.length} fallos\n` : '\n  ✓ todo bien\n')
process.exitCode = fails.length ? 1 : 0

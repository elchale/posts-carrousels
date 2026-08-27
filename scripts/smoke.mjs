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
const POST = '/comehometag/ago/27-cola-del-pozo'
const fails = []
const ok = (cond, msg) => { console.log(`  ${cond ? '✓' : '✗'} ${msg}`); if (!cond) fails.push(msg) }

const browser = await chromium.launch()

/* Todo contexto sale con /api/state cortado. La prueba MARCA posts como
 * publicados, y sin esto esas marcas viajarían a la base de Neon de verdad:
 * correr el smoke le ensuciaría el avance real a quien publica. Con
 * `configured:false` el componente Sync se apaga solo y todo queda en el
 * localStorage del contexto, que muere con él. */
async function nuevoContexto(opciones = {}) {
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, ...opciones })
  await c.route('**/api/state', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ configured: false, v: 1, posts: {} }),
  }))
  return c
}

const ctx = await nuevoContexto({ acceptDownloads: true })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(String(e)))

console.log('\n  pantallas')
for (const [p, needle] of [['/', 'Posts de hoy'], ['/comehometag', 'ComeHomeTag'], [POST, 'Instagram']]) {
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
/* En `next dev` NINGÚN chunk se sirve inmutable: Turbopack los rehace en cada
 * cambio, así que esta comprobación fallaba siempre contra el servidor de
 * desarrollo — y un ✗ permanente enseña a ignorar la lista entera. Se salta,
 * diciéndolo. La cabecera de verdad hay que probarla contra `npm run build &&
 * npm start`, que es donde importa. */
const html = await page.content()
const enDev = /hmr-client|next-devtools/.test(html)
if (enDev) {
  console.log('  · servidor de desarrollo: /_next/static no se prueba (ahí nada es inmutable)')
} else {
  const chunk = html.match(/\/_next\/static\/[^"']+\.js/)?.[0]
  ok(!!chunk, `hay un chunk que probar (${chunk || '—'})`)
  ok((await head(chunk)).includes('immutable'), '/_next/static sigue inmutable')
}
const thumb = imgs.find((i) => (i.src || '').includes('/preview/'))?.src
ok((await head(thumb)).includes('immutable'), 'láminas inmutables (seguro: la URL lleva huella)')

/* ---------------------------------------------------------- posts de hoy */
/* La pestaña que abre la app. Todo lo que decide sale de la fecha del aparato,
 * así que cada caso se prueba plantando el reloj en un día distinto con
 * clock.setFixedTime (fija Date.now() pero deja correr los temporizadores: con
 * el reloj congelado del todo, React se queda sin planificador).
 *
 * Los días salen del calendario real (data/index.json), no inventados: si
 * mañana se retira una tanda, el smoke falla y alguien se entera. */
console.log('\n  posts de hoy')

const { readFileSync } = await import('node:fs')
const idx = JSON.parse(readFileSync(new URL('../data/index.json', import.meta.url), 'utf8'))
const conFecha = idx.brands.flatMap((b) => b.posts).filter((p) => p.date)
const porDia = {}
for (const p of conFecha) (porDia[p.date] ||= []).push(p)
const dias = Object.keys(porDia).sort()
const DIA_LLENO = dias[0]                              // el primer día programado
const DIA_VACIO = '2026-08-26'                         // retirado a mano: día sin nada
const DIA_TARDE = dias[12] || dias[dias.length - 1]    // ya con atrasados detrás

/** Un navegador nuevo con el reloj plantado en `iso`, a mediodía de Lima. */
async function enElDia(iso) {
  const c = await nuevoContexto({ timezoneId: 'America/Lima' })
  await c.clock.setFixedTime(new Date(`${iso}T17:00:00Z`))
  const pg = await c.newPage()
  const errs = []
  pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
  pg.on('pageerror', (e) => errs.push(String(e)))
  return { c, pg, errs }
}

/* --- un día con tanda: la lista, y subir los cinco de corrido --- */
{
  const { c, pg, errs } = await enElDia(DIA_LLENO)
  await pg.goto(BASE + '/', { waitUntil: 'load' })
  await pg.waitForSelector('.hrow', { timeout: 15000 })
  const esperados = porDia[DIA_LLENO].length
  ok((await pg.$$('.hrow')).length === esperados, `${esperados} filas el ${DIA_LLENO} (una por cuenta que publica)`)
  ok((await pg.textContent('.tabs__n')) === String(esperados), `la pestaña avisa ${esperados} pendientes`)

  await pg.locator('.hrow').first().click()
  await pg.waitForSelector('.post', { timeout: 15000 })
  ok((await pg.getAttribute('.post .iconbtn', 'href')) === '/', 'la flecha de atrás vuelve a la lista de hoy')
  ok(/1\/\d/.test(await pg.textContent('.topbar__title')), 'el título dice en qué punto de la tanda vas')

  let vueltas = 0
  while (vueltas < esperados + 2) {
    vueltas++
    await pg.getByRole('button', { name: /Marcar publicado en las dos redes/ }).click()
    await pg.waitForTimeout(200)
    const siguiente = pg.locator('.btn--next')
    if (!(await siguiente.count())) break
    await siguiente.click()
    await pg.waitForSelector('.post', { timeout: 15000 })
  }
  ok(vueltas === esperados, `la cadena «siguiente» pasa por los ${esperados} y para (${vueltas})`)
  ok((await pg.textContent('.ops')).includes('Listo por hoy'), 'al cerrar el día lo dice')

  await pg.locator('.ops a.btn').last().click()
  await pg.waitForSelector('.aviso--ok', { timeout: 15000 })
  ok(true, 'volver desde el último abre la lista de hoy, ya cerrada')
  ok((await pg.textContent('main')).includes('Lo siguiente'), 'con el día hecho, ofrece adelantar')
  ok(!(await pg.$('.tabs__n')), 'sin pendientes, la pestaña no lleva número')

  const choque = errs.filter((e) => /418|423|425|[Hh]ydrat/.test(e))
  ok(choque.length === 0, `sin choque de hidratación${choque.length ? `: ${choque[0].slice(0, 70)}` : ''}`)
  await c.close()
}

/* --- un día sin tanda: no es un error, y hay que decirlo --- */
{
  const { c, pg } = await enElDia(DIA_VACIO)
  await pg.goto(BASE + '/', { waitUntil: 'load' })
  await pg.waitForSelector('.hero__none', { timeout: 15000 })
  ok((await pg.textContent('.hero__none')).includes('Hoy no toca'), `el ${DIA_VACIO} dice que hoy no toca`)
  ok((await pg.textContent('main')).includes('Lo siguiente'), 'y enseña el siguiente día programado')
  ok(!(await pg.$('.tabs__n')), 'sin nada que subir, no hay número en la pestaña')
  await c.close()
}

/* --- días después: lo vencido sale aparte, y con tope --- */
{
  const { c, pg } = await enElDia(DIA_TARDE)
  await pg.goto(BASE + '/', { waitUntil: 'load' })
  await pg.waitForSelector('.hrow', { timeout: 15000 })
  const texto = await pg.textContent('main')
  const atrasados = conFecha.filter((p) => p.date < DIA_TARDE).length
  ok(texto.includes('Se pasaron de fecha'), `el ${DIA_TARDE} enseña los ${atrasados} atrasados`)
  ok(texto.includes(`Y ${atrasados - 8} más`), 'y no pinta todas las filas: corta en 8 y cuenta el resto')
  ok((await pg.$$('.hrow')).length === porDia[DIA_TARDE].length + 8, 'la lista es la del día + las 8 vencidas')
  await c.close()
}

/* --- recargar a mitad de la tanda: el modo vive en la URL, no solo en memoria --- */
{
  const { c, pg } = await enElDia(DIA_LLENO)
  const primero = porDia[DIA_LLENO][0]
  await pg.goto(`${BASE}/${primero.brand}/${primero.series}/${primero.slug}?d=hoy`, { waitUntil: 'load' })
  await pg.waitForSelector('.post', { timeout: 15000 })
  await pg.waitForTimeout(500)
  ok((await pg.getAttribute('.post .iconbtn', 'href')) === '/', 'con ?d=hoy la flecha de atrás sigue volviendo a hoy')
  ok(!!(await pg.$('.btn--next')), 'y la de siguiente sigue ahí')
  await c.close()
}

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
  const c = await nuevoContexto({ timezoneId: tz })
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

/**
 * El avance (descargado / publicado) en Postgres — Neon.
 *
 * Existe porque `localStorage` no aguanta el uso real: Safari borra el
 * almacenamiento de un sitio a los 7 días sin visitarlo, cada URL de deploy de
 * Vercel es un dominio distinto con su propio almacén, y en pestaña privada no
 * se puede escribir nada. Con 181 posts para semanas, eso es perder el avance.
 *
 * Se DEGRADA a propósito: sin `DATABASE_URL` la app sigue funcionando igual que
 * antes, solo con el navegador. Así el repo se puede desplegar sin credenciales
 * y el celular sirve de caché cuando no hay señal.
 *
 * La fusión es por marca de tiempo más reciente, campo por campo — nunca borra.
 * Dos dispositivos marcando cosas distintas terminan con la unión de las dos,
 * y restaurar un respaldo viejo no despublica nada.
 */
import { neon } from '@neondatabase/serverless'

const FIELDS = ['ig', 'tt', 'dl_ig', 'dl_tt']

/** Los nombres del cliente son camelCase; en SQL van en snake_case. */
const TO_SQL = { ig: 'ig', tt: 'tt', dlIg: 'dl_ig', dlTt: 'dl_tt' }
const TO_JS = { ig: 'ig', tt: 'tt', dl_ig: 'dlIg', dl_tt: 'dlTt' }

let sqlClient = null
let ready = null

export function isConfigured() {
  return !!process.env.DATABASE_URL
}

function sql() {
  if (!isConfigured()) throw new Error('DATABASE_URL no está configurada')
  if (!sqlClient) sqlClient = neon(process.env.DATABASE_URL)
  return sqlClient
}

/** Crea la tabla la primera vez. Una sola promesa por instancia. */
function ensureTable() {
  if (!ready) {
    ready = sql()`
      CREATE TABLE IF NOT EXISTS carousel_state (
        post_id    text PRIMARY KEY,
        ig         bigint,
        tt         bigint,
        dl_ig      bigint,
        dl_tt      bigint,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `.catch((e) => { ready = null; throw e })
  }
  return ready
}

export async function readState() {
  await ensureTable()
  const rows = await sql()`SELECT post_id, ig, tt, dl_ig, dl_tt FROM carousel_state`
  const posts = {}
  for (const row of rows) {
    const entry = {}
    for (const col of FIELDS) {
      // bigint vuelve como STRING desde Postgres, así que "0" es truthy: hay que
      // comparar el número, no el valor tal cual.
      const v = Number(row[col])
      if (Number.isFinite(v) && v > 0) entry[TO_JS[col]] = v
    }
    if (Object.keys(entry).length) posts[row.post_id] = entry
  }
  return { v: 1, posts }
}

/**
 * Mete el estado del cliente y devuelve el fusionado.
 *
 * GREATEST(existente, entrante) por columna: es lo que hace que el servidor sea
 * un punto de encuentro y no un último-en-escribir-gana. Un cliente que envía su
 * estado completo no puede pisar lo que marcó otro dispositivo.
 */
export async function mergeState(posts) {
  await ensureTable()
  const entries = Object.entries(posts || {}).slice(0, 5000)
  for (const [id, mark] of entries) {
    if (typeof id !== 'string' || !id || typeof mark !== 'object' || !mark) continue
    const v = {}
    for (const [k, col] of Object.entries(TO_SQL)) {
      const n = Number(mark[k])
      v[col] = Number.isFinite(n) && n > 0 ? Math.round(n) : null
    }
    await sql()`
      INSERT INTO carousel_state (post_id, ig, tt, dl_ig, dl_tt, updated_at)
      VALUES (${id}, ${v.ig}, ${v.tt}, ${v.dl_ig}, ${v.dl_tt}, now())
      ON CONFLICT (post_id) DO UPDATE SET
        -- NULLIF devuelve la columna a NULL en vez de dejar un 0 sembrado: "sin
        -- marcar" y "marcado en el epoch" no son lo mismo.
        ig    = NULLIF(GREATEST(COALESCE(carousel_state.ig, 0),    COALESCE(EXCLUDED.ig, 0)), 0),
        tt    = NULLIF(GREATEST(COALESCE(carousel_state.tt, 0),    COALESCE(EXCLUDED.tt, 0)), 0),
        dl_ig = NULLIF(GREATEST(COALESCE(carousel_state.dl_ig, 0), COALESCE(EXCLUDED.dl_ig, 0)), 0),
        dl_tt = NULLIF(GREATEST(COALESCE(carousel_state.dl_tt, 0), COALESCE(EXCLUDED.dl_tt, 0)), 0),
        updated_at = now()
    `
  }
  return readState()
}

/** Para el botón "borrar todo el avance" de /respaldo. */
export async function clearState() {
  await ensureTable()
  await sql()`DELETE FROM carousel_state`
  return { v: 1, posts: {} }
}

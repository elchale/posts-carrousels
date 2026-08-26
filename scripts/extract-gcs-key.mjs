#!/usr/bin/env node
/**
 * extract-gcs-key.mjs — saca la cuenta de servicio del bucket compartido de
 * cualquier app que ya lo use, y la deja en .gcs/key.json (gitignorado).
 *
 *   node scripts/extract-gcs-key.mjs ../../Apps/Progress/openbadges/.env.prod
 *
 * Acepta las dos formas en que las apps la guardan: GCS_CREDENTIALS_JSON en
 * base64 (openbadges, jornal) o el JSON crudo (comehome).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = process.argv[2]
if (!src) {
  console.error('Uso: node scripts/extract-gcs-key.mjs <ruta a un .env que tenga GCS_CREDENTIALS_JSON>')
  process.exit(1)
}

const text = fs.readFileSync(src, 'utf8')
const m = text.match(/GCS_CREDENTIALS_JSON\s*=\s*"?([^"\n]+)"?/)
if (!m) {
  console.error(`${src} no tiene GCS_CREDENTIALS_JSON.`)
  process.exit(1)
}

const raw = m[1].trim().startsWith('{') ? m[1] : Buffer.from(m[1], 'base64').toString('utf8')
const key = JSON.parse(raw)          // revienta aquí si no es una llave válida, que es lo que queremos
fs.mkdirSync(path.join(ROOT, '.gcs'), { recursive: true })
fs.writeFileSync(path.join(ROOT, '.gcs', 'key.json'), JSON.stringify(key, null, 2))
console.log(`[extract-gcs-key] .gcs/key.json ← ${key.client_email} (${key.project_id})`)

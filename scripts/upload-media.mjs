#!/usr/bin/env node
/**
 * upload-media.mjs — sube las imágenes al bucket y deja el deploy en un puñado
 * de megas.
 *
 * Suben las TRES carpetas de public/: originales, previews y miniaturas. Es la
 * mitad del tiempo de deploy — clonar y volver a subir 770 MB de JPEG que el
 * navegador podría pedirle a otro sitio.
 *
 * Ojo con una cosa que no avisa: con las imágenes en otro origen, "Guardar N
 * fotos" pasa a hacer un fetch cruzado (app/lib/save.js las convierte en File
 * para el menú de compartir de iOS). Sin CORS en el bucket ese fetch falla y el
 * botón muere en TODOS los posts, sin más síntoma que un error en consola.
 * Por eso `--cors` no es opcional la primera vez.
 *
 * Uso:
 *   node scripts/upload-media.mjs --cors      # una vez por bucket: permite el fetch cruzado
 *   node scripts/upload-media.mjs --dry-run   # dice qué haría, sin tocar nada
 *   node scripts/upload-media.mjs             # sube lo que falte o haya cambiado
 *
 * Después, para que el manifest apunte al bucket:
 *   MEDIA_BASE=https://storage.googleapis.com/<bucket>/carruseles npm run prepare-assets
 *
 * Credenciales: .gcs/key.json (la cuenta de servicio compartida de Qolca, la
 * misma que usan comehome/jornal/openbadges/tiktok-be — las seis apps apuntan al
 * mismo proyecto). Está en .gitignore: es una credencial.
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const KEY = path.join(ROOT, '.gcs', 'key.json')
const BUCKET = process.env.GCS_BUCKET_NAME || 'qolca-basic-santiago'
const PREFIX = process.env.GCS_PREFIX || 'carruseles'
const DRY = process.argv.includes('--dry-run')

if (!fs.existsSync(KEY)) {
  console.error(`Falta ${path.relative(ROOT, KEY)}.
Sácala de cualquier app que ya use el bucket compartido:
  node scripts/extract-gcs-key.mjs ../../Apps/Progress/openbadges/.env.prod`)
  process.exit(1)
}

const account = JSON.parse(fs.readFileSync(KEY, 'utf8')).client_email

/* En Windows gcloud es un .cmd, y desde Node 18.20/20.12/22 spawn se niega a
 * ejecutar .cmd sin `shell: true` (el arreglo de CVE-2024-27980). Sin shell da
 * ENOENT o EINVAL aunque gcloud esté perfectamente en el PATH. Con shell hay que
 * entrecomillar: uno de los argumentos ("public, max-age=…") lleva espacios. */
const WIN = process.platform === 'win32'
const GCLOUD = WIN ? 'gcloud.cmd' : 'gcloud'
const q = (a) => (WIN && /[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a)

function gcloud(args) {
  const full = [...args, `--account=${account}`]
  const r = WIN
    ? spawnSync([GCLOUD, ...full.map(q)].join(' '), { stdio: 'inherit', shell: true })
    : spawnSync(GCLOUD, full, { stdio: 'inherit' })
  if (r.error) {
    console.error(`No se pudo ejecutar ${GCLOUD}: ${r.error.message}`)
    process.exit(1)
  }
  if (r.status !== 0) process.exit(r.status ?? 1)
}

/* activate-service-account no acepta --account, así que va por su cuenta. */
{
  const args = ['auth', 'activate-service-account', `--key-file=${KEY}`]
  const r = WIN
    ? spawnSync([GCLOUD, ...args.map(q)].join(' '), { stdio: 'ignore', shell: true })
    : spawnSync(GCLOUD, args, { stdio: 'ignore' })
  if (r.error || r.status !== 0) {
    console.error('No se pudo activar la cuenta de servicio de .gcs/key.json.')
    process.exit(1)
  }
}

const CORS = process.argv.includes('--cors')

/* El bucket tiene que decirle al navegador que puede leer desde otro origen, o
 * "Guardar N fotos" se queda sin bytes. Se aplica al bucket entero, una vez.
 * `*` porque la app corre en localhost, en posts-carrousels.vercel.app y en el
 * dominio propio, y no hay nada privado aquí: son las mismas láminas que se
 * publican en Instagram. */
if (CORS) {
  const file = path.join(ROOT, '.gcs', 'cors.json')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify([{
    origin: ['*'],
    method: ['GET', 'HEAD'],
    responseHeader: ['Content-Type', 'Content-Length', 'Cache-Control'],
    maxAgeSeconds: 3600,
  }], null, 2))
  console.log(`[upload-media] CORS → gs://${BUCKET}`)
  gcloud(['storage', 'buckets', 'update', `gs://${BUCKET}`, `--cors-file=${file}`])
  if (!process.argv.includes('--and-upload')) process.exit(0)
}

/* rsync y no cp: solo sube lo que cambió, así una tanda nueva de láminas cuesta
 * segundos en vez de volver a subir 770 MB.
 *
 * --predefined-acl=publicRead porque el bucket NO tiene acceso uniforme (UBLA
 * está en false), así que lo público se decide objeto por objeto. Sin esto las
 * láminas suben pero la app recibe 403 al intentar leerlas.
 *
 * Cache-Control inmutable es seguro AQUÍ y solo aquí: las URLs del manifest
 * llevan ?v=<huella del contenido>, así que unos bytes nuevos son una URL nueva.
 * Sin esa huella, este encabezado es exactamente el bug del incógnito. */
for (const carpeta of ['posts', 'preview', 'thumb']) {
  const src = path.join(ROOT, 'public', carpeta)
  if (!fs.existsSync(src)) {
    console.error(`No existe public/${carpeta} — corre primero \`npm run prepare-assets\`.`)
    process.exit(1)
  }
  const dest = `gs://${BUCKET}/${PREFIX}/${carpeta}`
  console.log(`[upload-media] public/${carpeta}  →  ${dest}`)
  gcloud([
    'storage', 'rsync', src, dest,
    '--recursive',
    '--predefined-acl=publicRead',
    '--cache-control=public, max-age=31536000, immutable',
    ...(DRY ? ['--dry-run'] : []),
  ])
}

if (!DRY) {
  console.log(`
[upload-media] listo. Ahora, para que la app las pida al bucket:

  MEDIA_BASE=https://storage.googleapis.com/${BUCKET}/${PREFIX} npm run prepare-assets

y la misma MEDIA_BASE en Vercel → Settings → Environment Variables, para que un
build hecho allá salga igual. Comprueba que "Guardar N fotos" sigue bajando las
seis fotos ANTES de darlo por bueno:

  npm run smoke -- https://posts.testperu.com`)
}

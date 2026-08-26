import fs from 'node:fs'

/* La huella del contenido que generó scripts/build-index.mjs. Se enseña en
 * /respaldo para poder confirmar de un vistazo, desde el celular, QUÉ versión
 * está sirviendo — antes la única forma de saber si un deploy había llegado era
 * abrir una ventana de incógnito y comparar a ojo. */
let buildId = 'dev'
try {
  buildId = JSON.parse(fs.readFileSync(new URL('./data/index.json', import.meta.url), 'utf8')).buildId || 'dev'
} catch { /* sin manifest todavía: `npm run prepare-assets` lo escribe */ }

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_BUILD_ID: buildId },
  // Slides are served straight from public/ as pre-sized derivatives, so the image
  // optimizer would only add a quota and a cache layer we don't need.
  images: { unoptimized: true },
  // No basePath and no absolute URLs anywhere: the app works on localhost, on the
  // vercel.app subdomain and on any custom domain without a rebuild.
  poweredByHeader: false,
  async headers() {
    return [
      {
        /* Las láminas SÍ son inmutables — pero solo desde que cada URL lleva
         * ?v=<huella del contenido> (scripts/build-index.mjs). Antes eran URLs
         * fijas con caché de un año: re-renderizar una lámina cambiaba los bytes
         * sin cambiar la URL, el navegador nunca la volvía a pedir, y la única
         * forma de ver lo nuevo era una ventana de incógnito. Con la huella,
         * bytes nuevos ⇒ URL nueva ⇒ se pide sola. */
        source: '/:kind(posts|preview|thumb)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        /* Todo lo demás (el HTML de cada pantalla, el manifest, los iconos) tiene
         * que revalidarse SIEMPRE. Es la otra mitad del mismo bug: el HTML es lo
         * que trae la lista de posts nuevos, y Safari — sobre todo agregado a la
         * pantalla de inicio — se aferra a la copia vieja si nadie le dice que no.
         * Se excluye /_next/static porque esos archivos ya llevan hash en el
         * nombre y son legítimamente inmutables. */
        source: '/:path((?!_next/static|posts/|preview/|thumb/).*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
    ]
  },
}

export default nextConfig

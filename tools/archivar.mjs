// Mueve de posts/<serie>.json a posts/posted-<serie>.json los posts que Neon
// marca como publicados, y borra su carpeta out/<serie>/<slug>/.
// Uso: node tools/archivar.mjs [--dry]
import fs from 'node:fs'
import path from 'node:path'
import { neon } from '@neondatabase/serverless'

const DRY = process.argv.includes('--dry')
const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const env = fs.readFileSync(path.join(root, '.env.local'), 'utf8')
const sql = neon(env.match(/^DATABASE_URL=(.+)$/m)[1].trim().replace(/^["']|["']$/g, ''))

const rows = await sql`select post_id from carousel_state where ig is not null or tt is not null`
const posted = new Set(rows.map(r => r.post_id))
const stamp = new Date().toISOString().slice(0, 10)

for (const brand of fs.readdirSync(path.join(root, 'brands'))) {
  const dir = path.join(root, 'brands', brand, 'posts')
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json') || f.startsWith('posted-')) continue
    const serie = f.slice(0, -5)
    const file = path.join(dir, f)
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    const keep = [], move = []
    for (const p of data.posts) (posted.has(`${brand}/${serie}/${p.slug}`) ? move : keep).push(p)
    if (!move.length) continue
    console.log(`${brand}/${serie}: archiva ${move.map(p => p.slug).join(', ')}`)
    if (DRY) continue

    const arch = path.join(dir, `posted-${serie}.json`)
    const prev = fs.existsSync(arch) ? JSON.parse(fs.readFileSync(arch, 'utf8')) : { series: serie, brand, posts: [] }
    prev.archivedAt = stamp
    prev.reason = 'publicado (carousel_state en Neon)'
    prev.posts.push(...move)
    fs.writeFileSync(arch, JSON.stringify(prev, null, 2) + '\n')
    data.posts = keep
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
    for (const p of move) {
      const out = path.join(root, 'brands', brand, 'out', serie, p.slug)
      if (fs.existsSync(out)) fs.rmSync(out, { recursive: true, force: true })
    }
  }
}

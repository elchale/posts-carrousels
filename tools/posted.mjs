// Lista los post_id ya publicados (ig o tt con timestamp) desde Neon.
// Uso: node tools/posted.mjs
import fs from 'node:fs'
import { neon } from '@neondatabase/serverless'

const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const m = env.match(/^DATABASE_URL=(.+)$/m)
if (!m) throw new Error('no DATABASE_URL')
const sql = neon(m[1].trim().replace(/^["']|["']$/g, ''))

const rows = await sql`select post_id, ig, tt from carousel_state where ig is not null or tt is not null order by post_id`
for (const r of rows) console.log(`${r.post_id}\tig=${r.ig ? 1 : 0}\ttt=${r.tt ? 1 : 0}`)
console.log(`\n${rows.length} publicados`)

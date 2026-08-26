// Pasada de limpieza sobre los captions pendientes:
//  1. borra el cebo «Comenta DEPENDE» / «Escríbeme DEPENDE por DM» (iba en los
//     61 posts de Qolca de sep+oct: la misma palabra 61 veces es spam, y los 12
//     posts ya publicados sumaron 0 comentarios entre todos).
//  2. normaliza el "mándaselo a X": en TikTok va con " · " y en minúscula, que
//     es como está escrito el resto del caption; en IG va como frase.
// Uso: node tools/fix_captions.mjs
import fs from 'node:fs'
import path from 'node:path'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const BAIT = /\s*(?:Comenta|Escríbeme|Escribe)\s*«[^»]*»(?:\s*por\s*DM)?\.?\s*/gi
const ASK = /\s*[·.]?\s*((?:Mándaselo|Send it)\b[^.#·]*)\.?\s*/
const TAGS = /((?:#[^\s#]+\s*)+)$/

const lower = s => s.charAt(0).toLowerCase() + s.slice(1)

function fix (text, tt) {
  if (!text) return text
  let s = text.replace(BAIT, ' ')
  const m = s.match(ASK)
  if (!m) return s.replace(/\s+/g, ' ').trim()
  const ask = m[1].trim()
  s = (s.slice(0, m.index) + ' ' + s.slice(m.index + m[0].length)).replace(/\s+/g, ' ').trim()
  let tags = ''
  const t = s.match(TAGS)
  if (t) { tags = t[1].trim(); s = s.slice(0, t.index).trim() }
  const joined = tt
    ? `${s} · ${lower(ask)}`
    : `${s}${/[.!?…]$/.test(s) ? '' : '.'} ${ask}.`
  return (joined + (tags ? ' ' + tags : '')).replace(/\s+/g, ' ').trim()
}

let n = 0
for (const brand of ['comehometag', 'qolca', 'propaga', 'radarestatal', 'diplomy']) {
  for (const f of ['ago.json', 'sep.json', 'oct.json']) {
    const file = path.join(root, 'brands', brand, 'posts', f)
    if (!fs.existsSync(file)) continue
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    for (const p of data.posts) {
      if (!p.caption) continue
      p.caption.tt = fix(p.caption.tt, true)
      p.caption.ig = fix(p.caption.ig, false)
      if (p.caption.fb) p.caption.fb = fix(p.caption.fb, false)
      n++
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
  }
}
console.log(`${n} captions normalizados`)

// Añade el "mándaselo a X" a los captions de los posts pendientes.
//
// Por qué: el único post que rompió la banda (comehometag 11-tiembla-sin-ti,
// 27.9K) tiene 289 compartidos; todos los demás tienen entre 0 y 6. El envío
// —no el guardado— es lo que dispara la segunda ola. Solo 13 de 233 posts
// pendientes pedían uno.
//
// La lista de destinatarios es por marca y rota por índice: lo que varía es la
// PERSONA a la que se lo mandas, que es justo lo que hace que se mande.
// Uso: node tools/send_ask.mjs [--dry]
import fs from 'node:fs'
import path from 'node:path'

const DRY = process.argv.includes('--dry')
const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

const ASKS = {
  comehometag: [
    'Mándaselo a quien recoge a tus hijos',
    'Mándaselo a la persona que los cuida cuando tú no estás',
    'Mándaselo a tus hermanos, esto no se decide solo',
    'Mándaselo al grupo del salón',
    'Mándaselo a quien se queda con ellos este fin de semana',
    'Mándaselo a la abuela que los recoge del colegio',
    'Mándaselo al papá que lo va a leer de noche',
    'Mándaselo a quien maneja el carro de la familia',
  ],
  qolca: [
    'Mándaselo al que contesta tu WhatsApp',
    'Mándaselo a tu socio antes del lunes',
    'Mándaselo a tu vendedor y que te diga qué haría',
    'Mándaselo a quien atiende cuando tú no estás',
    'Mándaselo al que se queda a cargo el fin de semana',
    'Mándaselo al del negocio de al lado, le pasa igual',
    'Mándaselo a tu equipo, no a tu bandeja',
  ],
  propaga: [
    'Mándaselo a quien maneja tus redes',
    'Mándaselo al que sube las historias',
    'Mándaselo a tu socio antes del lunes',
    'Mándaselo a la amiga que tiene su emprendimiento',
    'Mándaselo a quien responde tus mensajes',
    'Mándaselo al de la tienda de al lado',
    'Mándaselo a quien toma las fotos',
  ],
  radarestatal: [
    'Mándaselo a quien arma tus propuestas',
    'Mándaselo a tu contador',
    'Mándaselo a tu socio de consorcio',
    'Mándaselo al que dice que el Estado solo le compra a los grandes',
    'Mándaselo a quien maneja tu RNP',
    'Mándaselo a tu proveedor, también le sirve',
  ],
  diplomy: [
    'Send it to whoever issues your certificates',
    'Send it to your program coordinator',
    'Send it to the person who signs them',
    'Send it to your director before the next intake',
    'Send it to whoever answers the verification emails',
    'Send it to the academy owner you know',
  ],
}

const HAS = /mánda|manda|envía|send it|send this|share it|compárte/i
// Corta la cola de hashtags (y el "Comenta «X»" que Qolca traía pegado al final).
const TAIL = /(\s*(?:Comenta\s*«[^»]*»\s*)?(?:#[^\s#]+(?:\s+|$))+\s*(?:Comenta\s*«[^»]*»)?\s*)$/

function withAsk (text, ask) {
  if (!text) return text
  let body = text, tail = ''
  const m = text.match(TAIL)
  if (m) { body = text.slice(0, m.index); tail = m[1] }
  body = body.replace(/\s*Comenta\s*«[^»]*»\s*/gi, ' ').trimEnd()
  const sep = /[.!?…»)]$/.test(body) ? ' ' : '. '
  return (body + sep + ask + '.' + (tail ? ' ' + tail.trim() : '')).trim()
}

let touched = 0
for (const [brand, asks] of Object.entries(ASKS)) {
  const dir = path.join(root, 'brands', brand, 'posts')
  for (const f of ['ago.json', 'sep.json', 'oct.json']) {
    const file = path.join(dir, f)
    if (!fs.existsSync(file)) continue
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    let n = 0
    data.posts.forEach((p, i) => {
      const c = p.caption
      if (!c) return
      const already = HAS.test(c.tt || '') || HAS.test(c.ig || '')
      const ask = asks[(i + f.charCodeAt(0)) % asks.length]
      if (!already) {
        c.tt = withAsk(c.tt, ask)
        c.ig = withAsk(c.ig, ask)
        n++
      } else if (/Comenta\s*«/i.test(c.tt || '')) {
        c.tt = c.tt.replace(/\s*Comenta\s*«[^»]*»\s*/gi, ' ').trim()
        n++
      }
    })
    if (n) { touched += n; console.log(`${brand}/${f}: ${n} captions`) }
    if (!DRY && n) fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
  }
}
console.log(`${touched} captions${DRY ? ' (dry)' : ''}`)

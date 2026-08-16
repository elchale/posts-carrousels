// Arregla los peores posts pendientes según el escaneo del 2026-08-15.
//
// Lo que dicen los números (data/TIKTOK-STATS-2026-08-15.md):
//  · Lo único que rompió la banda en 5 cuentas fue el marco de SEPARACIÓN:
//    "pasa algo y tú no estás con ellos" (27.9K y 1.9K). El hermano del mismo
//    día sobre la mochila de emergencia —preparación, no separación— hizo 317.
//  · Los posts de Qolca anclados a una fiesta de consumo hicieron 168/104/103
//    contra su banda de 550-620. La fecha solo ayuda si ES el dolor de la marca.
//  · Los mejores de Radar son revelaciones ("esto es público"), no instructivos.
// Uso: node tools/fix_worst.mjs
import fs from 'node:fs'
import path from 'node:path'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

// slug -> { cover:{...campos a pisar}, tt, slides:[{after:'slug-de-rol', ...}] }
const FIXES = {
  'comehometag/ago': {
    '16-feliz-dia': {
      cover: { h: '¿Y si hoy lo lleva otro adulto al parque?', emoji: '😰', b: 'lo que se acuerda antes de que salgan' },
      insert: [{ at: 1, slide: {
        role: 'value',
        h: 'Tres preguntas antes de que se lo lleven',
        b: '· ¿A qué hora exacta lo traes?\n· ¿Quién lo tiene de la mano en la multitud?\n· ¿Tienes batería y el sonido activado?',
      } }, { at: 2, slide: {
        role: 'value',
        h: 'El mensaje que le mandas, cópialo',
        b: '«Va con polo rojo y zapatillas blancas. Si se sueltan, quédate donde estás y llámame: no lo busques caminando.»',
        emoji: '📱',
      } }],
      tt: '¿Y si hoy lo lleva otro adulto al parque? 😰 las 3 preguntas antes de que salgan · mándaselo a quien se lo lleva #diadelniño #papas #peru',
    },
    '22-telemaco': { cover: { h: '¿Y si a tu hijo le toca buscarte a ti?' } },
    '28-familias-grandes': { cover: { h: '¿Y si cada uno cree que lo tiene el otro?' } },
  },
  'comehometag/sep': {
    '11-salen-los-papas': { cover: { h: '¿Y si esta noche sales tú y ellos se quedan?' } },
    '13-abuelo-al-paseo': { cover: { h: '¿Y si el abuelo se queda atrás en el paseo?' } },
    '29-tocan-la-puerta': { cover: { h: '¿Y si tocan la puerta y tu hijo está solo?' } },
  },
  // Qolca: fuera la fiesta de consumo, dentro el dolor de siempre.
  'qolca/ago': {
    '16-dia-pico': {
      cover: { kicker: 'DÍA PICO', h: 'El día que te escriben todos a la vez', b: 'no se improvisa, se gana chat por chat' },
      tt: 'El día que te escriben todos a la vez 🚨 el corte de las 9pm decide tu lunes · mándaselo a tu equipo, no a tu bandeja #negociosperu #ventas #whatsapp',
    },
    '28-competencia-descansa': {
      cover: { kicker: 'LA PRUEBA', h: 'Escríbele a 3 negocios de tu rubro y cuenta cuántos responden', b: 'la cancha está más vacía de lo que crees' },
      tt: 'Escríbele a 3 negocios de tu rubro y cuenta cuántos responden 😴 · mándaselo al que se queda a cargo el fin de semana #ventas #negociosperu #whatsapp',
    },
  },
  // Radar: sus tres mejores posts son revelaciones de algo público, no consejos.
  'radarestatal/ago': {
    '21-registrate-participante': { cover: { h: 'Registrarte para ver una licitación no te obliga a postular' } },
    '26-primera-semana': { cover: { h: 'Tu primera licitación ya está publicada' } },
  },
}

for (const [key, fixes] of Object.entries(FIXES)) {
  const [brand, month] = key.split('/')
  const file = path.join(root, 'brands', brand, 'posts', `${month}.json`)
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const [slug, fix] of Object.entries(fixes)) {
    const p = data.posts.find(x => x.slug === slug)
    if (!p) { console.log(`  ! no existe ${key}/${slug}`); continue }
    if (fix.cover) Object.assign(p.slides[0], fix.cover)
    for (const ins of (fix.insert || []).slice().reverse()) p.slides.splice(ins.at, 0, ins.slide)
    if (fix.tt) p.caption.tt = fix.tt
    console.log(`${key}/${slug} → ${p.slides[0].h}`)
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
}

'use client'

/** Formato corto de la fecha de publicación ("mié 13 ago"). `date` viene del
 *  index como ISO (2026-08-13) o null en series no mensuales. */
import { useEffect, useState } from 'react'

const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function fmtFecha(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  return `${DIAS[new Date(y, m - 1, d).getDay()]} ${d} ${MESES[m - 1]}`
}

function isoDeHoy() {
  const t = new Date()
  const dd = String(t.getDate()).padStart(2, '0')
  const mm = String(t.getMonth() + 1).padStart(2, '0')
  return `${t.getFullYear()}-${mm}-${dd}`
}

/**
 * El día de hoy SEGÚN EL RELOJ DEL CELULAR, y solo después de montar.
 *
 * Antes esto era un `esHoy()` que llamaba a `new Date()` durante el render, y
 * eso está roto por partida doble en una app prerenderizada:
 *
 *   1. Las páginas se generan en Vercel, en UTC, el día del deploy. El build del
 *      26 ago salió a las 04:33 UTC — las 23:33 del 25 en Lima. El servidor
 *      marcaba "HOY" un post y el celular marcaba otro, así que React tiraba el
 *      HTML del servidor y rehacía el bloque en el cliente (error #418, cinco
 *      por pantalla).
 *   2. Peor que el error: el HTML es estático. Un post podía quedarse diciendo
 *      "HOY" durante días, hasta el siguiente deploy — justo la etiqueta en la
 *      que confías para saber qué toca publicar.
 *
 * Devolviendo null en el primer render, servidor y cliente pintan lo mismo (la
 * fecha corta) y la insignia aparece al montar, ya con la fecha del aparato. Se
 * recalcula al volver a la pestaña: el día cambia mientras el celular está en
 * el bolsillo.
 */
export function useHoy() {
  const [hoy, setHoy] = useState(null)
  useEffect(() => {
    const calc = () => setHoy(isoDeHoy())
    calc()
    const alVolver = () => { if (!document.hidden) calc() }
    document.addEventListener('visibilitychange', alVolver)
    window.addEventListener('focus', alVolver)
    return () => {
      document.removeEventListener('visibilitychange', alVolver)
      window.removeEventListener('focus', alVolver)
    }
  }, [])
  return hoy
}

/** true si `iso` es el día que `useHoy()` devolvió. Comparación pura: no mira
 *  el reloj, así que da lo mismo en el servidor y en el cliente. */
export function esHoy(iso, hoy) {
  return Boolean(iso && hoy && iso === hoy)
}

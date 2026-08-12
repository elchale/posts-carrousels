/** Formato corto de la fecha de publicación ("mié 13 ago"). `date` viene del
 *  index como ISO (2026-08-13) o null en series no mensuales. */
const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function fmtFecha(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  return `${DIAS[new Date(y, m - 1, d).getDay()]} ${d} ${MESES[m - 1]}`
}

/** true si `iso` es el día de hoy en el reloj del dispositivo. */
export function esHoy(iso) {
  if (!iso) return false
  const t = new Date()
  const [y, m, d] = iso.split('-').map(Number)
  return y === t.getFullYear() && m === t.getMonth() + 1 && d === t.getDate()
}

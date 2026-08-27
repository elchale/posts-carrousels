'use client'

/**
 * Qué toca publicar HOY, a partir del manifest + lo que ya está marcado.
 *
 * Está aquí y no dentro de la pantalla porque es la única parte con reglas: el
 * resto es pintar filas. Todo sale de `date` (ISO, la calcula
 * scripts/build-index.mjs con el mes de la serie y el día del slug) y de las
 * marcas del navegador.
 *
 * Dos cosas que se dan por hechas y no lo son:
 *   - No todas las marcas publican todos los días. Una cuenta sin post hoy no
 *     es un error, así que se DICE («hoy no toca en Diplomy») en vez de dejar un
 *     hueco que parezca que falta algo.
 *   - Hay series sin fecha (las no mensuales). Esas nunca entran aquí: sin fecha
 *     no hay día que reclamarlas.
 *
 * `hoy` llega de useHoy() y es null hasta que el componente monta —
 * prerenderizar en el huso de Vercel daría el día equivocado. Con null se
 * devuelve null: la pantalla enseña que está leyendo la fecha, no una lista
 * falsa.
 */
import { isPublished } from './store'

/** Un atraso de un mes son 150 filas que nadie va a leer. */
export const TOPE_ATRASADOS = 8

export function armarAgenda(brands, marks, hoy) {
  if (!hoy) return null

  const conFecha = []
  for (const b of brands) {
    for (const p of b.posts) if (p.date) conFecha.push({ ...p, brandName: b.name })
  }

  const publicado = (p) => isPublished(marks.posts[p.id])

  /* El orden dentro de un día es el de las marcas en el manifest — el mismo que
   * usa la pantalla del post para saber cuál es «el siguiente de hoy». */
  const deHoy = conFecha.filter((p) => p.date === hoy)
  const hechos = deHoy.filter(publicado).length
  const pendientes = deHoy.length - hechos

  /* Ya venció y sigue sin publicarse. Ordenado por fecha (el sort es estable, así
   * que dentro de un día se mantiene el orden de marcas). */
  const atrasados = conFecha
    .filter((p) => p.date < hoy && !publicado(p))
    .sort((a, b) => a.date.localeCompare(b.date))

  const brandsHoy = new Set(deHoy.map((p) => p.brand))
  const sinPostHoy = brands.filter((b) => !brandsHoy.has(b.id)).map((b) => b.name)

  /* Lo siguiente en el calendario, para cuando hoy ya está hecho (o vacío) y
   * quieras adelantar. Es el PRIMER día futuro con posts, no «mañana»: si el
   * calendario salta un día, mañana no existe. */
  const futuras = conFecha.filter((p) => p.date > hoy).map((p) => p.date).sort()
  const proximaFecha = futuras[0] || null
  const proximos = proximaFecha ? conFecha.filter((p) => p.date === proximaFecha) : []

  return {
    fecha: hoy,
    deHoy,
    hechos,
    pendientes,
    atrasados,
    sinPostHoy,
    proximaFecha,
    proximos,
    /* Ni hoy, ni atrasados, ni futuro: el calendario se acabó. Merece un texto
     * propio, porque «no hay nada» y «ya publicaste todo» se ven igual y no son
     * lo mismo. */
    vacio: !deHoy.length && !atrasados.length && !proximos.length,
  }
}

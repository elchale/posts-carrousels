'use client'

/**
 * Dos migas de pan que no caben en la URL ni en localStorage.
 *
 * 1. `tabInicio` — qué pestaña del inicio estaba abierta. Vive en el módulo, no
 *    en el estado del componente, porque entrar a un post DESMONTA la pantalla
 *    de inicio: sin esto, volver siempre te devolvía a la pestaña por defecto.
 *    Es el mismo truco que `lastFilter` en BrandScreen. Al recargar de cero se
 *    pierde, y eso es lo correcto: abrir la app siempre empieza en «Hoy».
 *
 * 2. `desdeHoy` — el post que se acaba de tocar DESDE la lista de hoy, para que
 *    su flecha de atrás vuelva a esa lista y no a la grilla de la marca. Se
 *    guarda el id del destino, no un simple `true`: así un post abierto luego
 *    desde la grilla de la marca no hereda el modo de hoy.
 *
 *    La otra mitad va en la URL (`?d=hoy`), que es lo único que sobrevive a
 *    recargar la página o a abrir el enlace desde fuera. El módulo se lee de
 *    forma síncrona en el primer render (navegación dentro de la app, que es el
 *    99% de las veces); la URL se lee al montar, un fotograma después, y cubre
 *    el resto.
 */

let tab = 'hoy'
let desdeHoy = null

export function getTabInicio() {
  return tab
}

export function setTabInicio(valor) {
  tab = valor
}

/** La lista de hoy anuncia a dónde manda antes de que el enlace navegue. */
export function marcarSalidaDesdeHoy(postId) {
  desdeHoy = postId
}

/** 'hoy' si ESTE post se abrió desde la lista de hoy, null si no. */
export function origenDe(postId) {
  return desdeHoy && desdeHoy === postId ? 'hoy' : null
}

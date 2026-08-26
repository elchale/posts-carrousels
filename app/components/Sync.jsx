'use client'

/**
 * Mantiene el avance en el servidor sin que se note.
 *
 * Baja al abrir, sube (con espera) cada vez que marcas algo, y vuelve a bajar
 * cuando la pestaña vuelve al frente — que es el momento en que el otro
 * dispositivo pudo haber marcado cosas.
 *
 * El navegador manda mientras usas la app: se sube y se fusiona en el servidor,
 * pero no se sobreescribe lo local con la respuesta salvo que traiga algo más
 * nuevo. Sin `DATABASE_URL` la ruta contesta `configured:false` y esto se apaga
 * solo: la app queda como antes, guardando solo aquí.
 */
import { useEffect, useRef } from 'react'
import { mergeRemote, setSync, snapshot, useMarks } from '../lib/store'

const PUSH_DELAY = 1200

export default function Sync() {
  const marks = useMarks()
  const timer = useRef(null)
  const firstRun = useRef(true)
  const enabled = useRef(true)

  // Bajar al abrir, y otra vez al volver a la pestaña.
  useEffect(() => {
    let cancelled = false

    async function pull() {
      if (!enabled.current) return
      setSync({ status: 'syncing' })
      try {
        const res = await fetch('/api/state', { cache: 'no-store' })
        const data = await res.json()
        if (cancelled) return
        if (data.configured === false) {
          enabled.current = false
          setSync({ status: 'local', configured: false })
          return
        }
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
        mergeRemote(data.posts)
        setSync({ status: 'synced', configured: true, error: null, at: Date.now() })
      } catch (e) {
        if (!cancelled) setSync({ status: 'error', error: e.message })
      }
    }

    pull()
    const onVisible = () => { if (document.visibilityState === 'visible') pull() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  // Subir lo que cambie. El primer render es la carga inicial, no un cambio.
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return }
    if (!enabled.current) return
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      setSync({ status: 'syncing' })
      try {
        const res = await fetch('/api/state', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ posts: snapshot().posts }),
        })
        const data = await res.json()
        if (data.configured === false) {
          enabled.current = false
          setSync({ status: 'local', configured: false })
          return
        }
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
        mergeRemote(data.posts)
        setSync({ status: 'synced', configured: true, error: null, at: Date.now() })
      } catch (e) {
        // Marcar sigue funcionando: quedó guardado en el navegador y el próximo
        // cambio (o la próxima apertura) lo vuelve a intentar.
        setSync({ status: 'error', error: e.message })
      }
    }, PUSH_DELAY)
    return () => clearTimeout(timer.current)
  }, [marks])

  return null
}

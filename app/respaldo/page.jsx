'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Back, Copy } from '../components/Icons'
import { useToast } from '../components/Toast'
import { copyText } from '../lib/save'
import { clearState, exportState, importState, isPublished, useMarks, useSync } from '../lib/store'

const SYNC_TEXT = {
  synced: ['var(--done)', 'Guardado en el servidor', 'Tu avance te sigue entre celular y laptop.'],
  syncing: ['var(--dim)', 'Guardando…', 'Sincronizando con el servidor.'],
  error: ['var(--accent-2)', 'No se pudo guardar en el servidor',
    'Lo marcado quedó en este navegador y se reintenta al próximo cambio.'],
  local: ['var(--dim)', 'Solo en este navegador',
    'No hay base de datos conectada. Safari puede borrarlo a los 7 días sin abrir la app — usa el respaldo de abajo.'],
  idle: ['var(--dim)', 'Comprobando…', ''],
}

export default function Respaldo() {
  const marks = useMarks()
  const sync = useSync()
  const [paste, setPaste] = useState('')
  const [error, setError] = useState(null)
  const [toast, showToast] = useToast()
  const [color, title, detail] = SYNC_TEXT[sync.status] || SYNC_TEXT.idle

  const ids = Object.keys(marks.posts)
  const published = ids.filter((id) => isPublished(marks.posts[id])).length

  const onCopy = async () => {
    showToast(await copyText(exportState()) ? 'Respaldo copiado' : 'No se pudo copiar')
  }

  const onRestore = () => {
    setError(null)
    try {
      const n = importState(paste.trim())
      setPaste('')
      showToast(`${n} posts restaurados`)
    } catch (e) {
      setError(e.message || 'Ese texto no es un respaldo válido.')
    }
  }

  const onClear = async () => {
    if (!window.confirm('Se borra todo lo marcado como descargado y publicado, aquí y en el servidor. ¿Seguro?')) return
    clearState()
    // Sin esto el servidor lo devolvería en la próxima sincronización.
    try {
      await fetch('/api/state', { method: 'DELETE' })
    } catch { /* el borrado local ya se hizo */ }
    showToast('Avance borrado')
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar__row">
          <Link href="/" className="iconbtn" aria-label="Volver al inicio"><Back /></Link>
          <div className="topbar__title">Respaldo</div>
        </div>
      </header>

      <main className="wrap list">
        <section className="section">
          <div className="resume" style={{ alignItems: 'flex-start', gap: 11 }}>
            <span style={{
              width: 9, height: 9, borderRadius: '50%', background: color,
              flex: '0 0 auto', marginTop: 5,
            }} />
            <div className="resume__body">
              <div style={{ fontSize: 14.5, fontWeight: 620 }}>{title}</div>
              {detail && (
                <div style={{ fontSize: 12.5, color: 'var(--dim)', lineHeight: 1.45, marginTop: 3 }}>{detail}</div>
              )}
              {sync.status === 'error' && sync.error && (
                <div className="mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6 }}>{sync.error}</div>
              )}
            </div>
          </div>
          <p style={{ color: 'var(--dim)', fontSize: 14, lineHeight: 1.5, marginTop: 16 }}>
            El respaldo de abajo sirve igual: es texto que puedes pegar en otro navegador, y no depende de que el
            servidor esté arriba.
          </p>

          <div className="resume" style={{ marginTop: 16 }}>
            <div className="resume__body">
              <div className="hero__count">
                <span className="hero__n" style={{ fontSize: 34 }}>{published}</span>
                <span className="hero__of">publicados · {ids.length} con avance</span>
              </div>
            </div>
          </div>

          <button className="btn btn--save" style={{ marginTop: 14 }} onClick={onCopy}>
            <Copy /> Copiar respaldo
          </button>
        </section>

        <div className="divider" />

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 8 }}>Restaurar</div>
          <textarea
            className="sheet__text"
            style={{ width: '100%', minHeight: 110, color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 12 }}
            placeholder="Pega aquí el respaldo copiado del otro celular"
            value={paste}
            onChange={(e) => { setPaste(e.target.value); setError(null) }}
            spellCheck={false}
          />
          {error && <p className="hint hint--warn" style={{ textAlign: 'left' }}>{error}</p>}
          <button className="btn btn--ghost" disabled={!paste.trim()} onClick={onRestore}>
            Restaurar avance
          </button>
          <p className="hint" style={{ textAlign: 'left' }}>
            Se combinan los dos avances: nunca despublica algo que ya marcaste aquí.
          </p>
        </section>

        <div className="divider" />

        <section className="section">
          <button className="btn btn--ghost" style={{ color: 'var(--accent-2)' }} onClick={onClear}>
            Borrar todo el avance
          </button>
        </section>

        <p className="eyebrow mono" style={{ textAlign: 'center', padding: '18px 0 4px', lineHeight: 1.8 }}>
          versión {process.env.NEXT_PUBLIC_BUILD_ID}
          <br />
          <span style={{ fontFamily: 'inherit' }}>
            Si acabas de desplegar y no ves lo nuevo, compara este código con el que
            imprimió <b>npm run prepare-assets</b>.
          </span>
        </p>
      </main>
      {toast}
    </>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Back, Copy } from '../components/Icons'
import { useToast } from '../components/Toast'
import { copyText } from '../lib/save'
import { clearState, exportState, importState, isPublished, useMarks } from '../lib/store'

export default function Respaldo() {
  const marks = useMarks()
  const [paste, setPaste] = useState('')
  const [error, setError] = useState(null)
  const [toast, showToast] = useToast()

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

  const onClear = () => {
    if (!window.confirm('Se borra todo lo marcado como descargado y publicado. ¿Seguro?')) return
    clearState()
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
          <p style={{ color: 'var(--dim)', fontSize: 14, lineHeight: 1.5 }}>
            Lo que marcas como descargado y publicado se guarda <b style={{ color: 'var(--text)' }}>solo en este
            navegador</b>. No hay cuenta ni servidor. Para pasarlo a otro celular, copia el respaldo aquí y pégalo allá.
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
      </main>
      {toast}
    </>
  )
}

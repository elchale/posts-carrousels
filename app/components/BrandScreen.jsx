'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Back } from './Icons'
import { isPublished, isStarted, useMarks } from '../lib/store'

/* Filters survive going into a post and coming back: the component unmounts on
 * navigation, so the choice is parked in the module instead of in component state. */
const lastFilter = new Map()

export default function BrandScreen({ brand, posts }) {
  const saved = lastFilter.get(brand.id) || { series: 'all', pending: true }
  const [series, setSeries] = useState(saved.series)
  const [pending, setPending] = useState(saved.pending)
  const marks = useMarks()

  const remember = (next) => lastFilter.set(brand.id, { series, pending, ...next })

  const done = posts.filter((p) => isPublished(marks.posts[p.id])).length

  const seriesCounts = useMemo(() => {
    const map = {}
    for (const p of posts) {
      map[p.series] = map[p.series] || { total: 0, pending: 0 }
      map[p.series].total++
      if (!isPublished(marks.posts[p.id])) map[p.series].pending++
    }
    return map
  }, [posts, marks])

  const visible = posts.filter((p) => {
    if (series !== 'all' && p.series !== series) return false
    if (pending && isPublished(marks.posts[p.id])) return false
    return true
  })

  return (
    <div data-brand={brand.id}>
      <header className="topbar">
        <div className="topbar__row">
          <Link href="/" className="iconbtn" aria-label="Volver al inicio"><Back /></Link>
          <div className="topbar__title">{brand.name}</div>
          <span className="mono" style={{ fontSize: 12.5, color: 'var(--dim)' }}>
            <b style={{ color: 'var(--text)' }}>{done}</b>/{posts.length}
          </span>
        </div>
        <div className="rail" style={{ borderRadius: 0, height: 2 }} aria-hidden="true">
          <i style={{ width: `${posts.length ? (done / posts.length) * 100 : 0}%` }} />
        </div>
        <div className="filters">
          <button
            className="chip"
            aria-pressed={pending}
            onClick={() => { setPending(!pending); remember({ pending: !pending }) }}
          >
            {pending ? 'Solo pendientes' : 'Todos'}
          </button>
          <span style={{ width: 1, background: 'var(--line)', flex: '0 0 auto', margin: '4px 3px' }} />
          <button
            className="chip"
            aria-pressed={series === 'all'}
            onClick={() => { setSeries('all'); remember({ series: 'all' }) }}
          >
            Todas las series
          </button>
          {brand.series.map((s) => (
            <button
              key={s.id}
              className="chip"
              aria-pressed={series === s.id}
              onClick={() => { setSeries(s.id); remember({ series: s.id }) }}
            >
              {s.label}
              <span className="chip__n">{seriesCounts[s.id]?.pending ?? 0}</span>
            </button>
          ))}
        </div>
      </header>

      {visible.length === 0 ? (
        <div className="empty">
          <b>Nada pendiente por aquí</b>
          {pending ? 'Ya publicaste todo lo de este filtro.' : 'No hay posts en esta serie.'}
          {pending && (
            <div style={{ marginTop: 16 }}>
              <button className="chip" onClick={() => { setPending(false); remember({ pending: false }) }}>
                Ver también los publicados
              </button>
            </div>
          )}
        </div>
      ) : (
        <main className="grid">
          {visible.map((p) => {
            const mark = marks.posts[p.id]
            const published = isPublished(mark)
            const started = !published && isStarted(mark)
            return (
              <Link
                key={p.id}
                className={`card${published ? ' card--done' : ''}`}
                href={`/${p.brand}/${p.series}/${p.slug}`}
              >
                <div className="card__stack">
                  <img className="card__cover" src={p.thumb} alt="" loading="lazy" width={300} height={375} />
                  <span className="card__n mono">{p.slides}</span>
                  {published && <span className="stamp card__stamp">Publicado</span>}
                  {started && (
                    <span className="card__flag">
                      {mark.ig ? 'IG ✓' : mark.tt ? 'TT ✓' : 'Descargado'}
                    </span>
                  )}
                </div>
                <div className="card__title">{p.title}</div>
                <div className="card__meta eyebrow">{p.seriesLabel}</div>
              </Link>
            )
          })}
        </main>
      )}
    </div>
  )
}

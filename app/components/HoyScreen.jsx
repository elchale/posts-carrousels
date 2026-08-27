'use client'

import Link from 'next/link'
import { Check, Forward } from './Icons'
import { TOPE_ATRASADOS } from '../lib/agenda'
import { fmtFecha } from '../lib/fecha'
import { marcarSalidaDesdeHoy } from '../lib/nav'
import { isPublished, isStarted } from '../lib/store'

/* `vencida` en vez de comparar la fecha con hoy dentro de la fila: en «Lo
 * siguiente» el encabezado de la sección ya lleva el día, y repetirlo en las
 * cinco filas es ruido. La fecha en la fila solo aporta cuando cada una es
 * distinta — o sea, en las que se pasaron de fecha. */
function Fila({ p, vencida }) {
  const publicado = isPublished(p.mark)
  const empezado = !publicado && isStarted(p.mark)
  return (
    <Link
      className={`hrow${publicado ? ' hrow--done' : ''}`}
      href={`/${p.brand}/${p.series}/${p.slug}?d=hoy`}
      data-brand={p.brand}
      prefetch={false}
      onClick={() => marcarSalidaDesdeHoy(p.id)}
    >
      <img className="hrow__thumb" src={p.thumb} alt="" width={52} height={65} loading="lazy" decoding="async" />
      <div className="hrow__body">
        <div className="hrow__brand eyebrow">
          {p.brandName}
          {vencida && <span className="hrow__late"> · {fmtFecha(p.date)}</span>}
        </div>
        <div className="hrow__title">{p.title}</div>
        <div className="hrow__tags">
          <span className="tag" data-on={!!p.mark?.ig}>{p.mark?.ig ? <Check size={11} /> : null}IG</span>
          <span className="tag" data-on={!!p.mark?.tt}>{p.mark?.tt ? <Check size={11} /> : null}TikTok</span>
          {empezado && !p.mark?.ig && !p.mark?.tt && <span className="tag tag--soft">descargado</span>}
          <span className="tag tag--soft"><b className="mono">{p.slides}</b> fotos</span>
        </div>
      </div>
      <span className="hrow__go" aria-hidden="true">{publicado ? <Check size={16} /> : <Forward />}</span>
    </Link>
  )
}

export default function HoyScreen({ agenda, marks }) {
  /* Hasta que el componente monta no sabemos qué día es en ESTE teléfono (ver
   * lib/fecha.js). Decirlo es mejor que pintar una lista que va a cambiar. */
  if (!agenda) {
    return (
      <main className="wrap list" role="tabpanel" id="panel-hoy" aria-labelledby="tab-hoy">
        <div className="empty" style={{ padding: '64px 24px' }}>
          <b>Leyendo la fecha…</b>
          Un segundo: la lista de hoy sale del reloj de este teléfono.
        </div>
      </main>
    )
  }

  const { fecha: hoy, deHoy, hechos, pendientes, atrasados, sinPostHoy, proximaFecha, proximos, vacio } = agenda
  const conMarca = (p) => ({ ...p, mark: marks.posts[p.id] })
  const listo = deHoy.length > 0 && pendientes === 0
  const pct = deHoy.length ? Math.round((hechos / deHoy.length) * 100) : 0
  const atrasadosVisibles = atrasados.slice(0, TOPE_ATRASADOS)

  return (
    <main className="wrap list" role="tabpanel" id="panel-hoy" aria-labelledby="tab-hoy">
      <section className="hero">
        <div className="eyebrow">{fmtFecha(hoy)}</div>
        {deHoy.length > 0 ? (
          <>
            <div className="hero__count" style={{ marginTop: 8 }}>
              <span className="hero__n">{hechos}</span>
              <span className="hero__of">
                de <b>{deHoy.length}</b> publicados hoy
              </span>
            </div>
            <div className="rail" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
          </>
        ) : (
          <div className="hero__none">
            {vacio ? 'No queda nada programado.' : 'Hoy no toca publicar nada.'}
          </div>
        )}
      </section>

      {listo && (
        <div className="aviso aviso--ok">
          <Check size={16} />
          Hoy está listo: {deHoy.length} {deHoy.length === 1 ? 'post publicado' : 'posts publicados'}.
        </div>
      )}

      {deHoy.length > 0 && (
        <section className="section">
          <div className="section__head">
            <span className="eyebrow">Para hoy</span>
            <span className="eyebrow">{pendientes ? `${pendientes} por subir` : 'todo subido'}</span>
          </div>
          <div className="stack-gap">
            {deHoy.map((p) => <Fila key={p.id} p={conMarca(p)} />)}
          </div>
        </section>
      )}

      {sinPostHoy.length > 0 && deHoy.length > 0 && (
        <p className="nota">
          Hoy no toca en <b>{sinPostHoy.join(', ')}</b> — esas cuentas no publican todos los días.
        </p>
      )}

      {atrasados.length > 0 && (
        <section className="section">
          <div className="section__head">
            <span className="eyebrow">Se pasaron de fecha</span>
            <span className="eyebrow">{atrasados.length}</span>
          </div>
          <div className="stack-gap">
            {atrasadosVisibles.map((p) => <Fila key={p.id} p={conMarca(p)} vencida />)}
          </div>
          {atrasados.length > atrasadosVisibles.length && (
            <p className="nota">
              Y {atrasados.length - atrasadosVisibles.length} más de días anteriores. Están en su marca,
              con su fecha: muchos van pegados a una fecha concreta y ya no tienen sentido fuera de ella.
            </p>
          )}
        </section>
      )}

      {(deHoy.length === 0 || listo) && proximos.length > 0 && (
        <section className="section">
          <div className="section__head">
            <span className="eyebrow">Lo siguiente · {fmtFecha(proximaFecha)}</span>
            <span className="eyebrow">{proximos.length}</span>
          </div>
          <div className="stack-gap">
            {proximos.map((p) => <Fila key={p.id} p={conMarca(p)} />)}
          </div>
          <p className="nota">Todavía no toca. Ábrelos solo si quieres adelantar.</p>
        </section>
      )}

      {vacio && (
        <div className="empty">
          <b>Nada programado</b>
          No hay posts con fecha de hoy ni de más adelante. Toca escribir la siguiente tanda.
        </div>
      )}
    </main>
  )
}

'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Forward } from './Icons'
import { isPublished, useMarks } from '../lib/store'

function postHref(p) {
  return `/${p.brand}/${p.series}/${p.slug}`
}

export default function HomeScreen({ brands, total, slides }) {
  const marks = useMarks()

  const stats = useMemo(() => {
    const per = brands.map((b) => {
      const done = b.posts.filter((p) => isPublished(marks.posts[p.id])).length
      const nextPost = b.posts.find((p) => !isPublished(marks.posts[p.id])) || null
      return { brand: b, done, nextPost }
    })
    const done = per.reduce((n, s) => n + s.done, 0)
    // Suggest the brand that has fallen behind, so the three feeds stay in step
    // instead of one racing ahead.
    const behind = per
      .filter((s) => s.nextPost)
      .sort((a, b) => a.done - b.done)[0] || null
    return { per, done, behind }
  }, [brands, marks])

  const pct = total ? Math.round((stats.done / total) * 100) : 0

  return (
    <>
      <header className="topbar">
        <div className="topbar__row">
          <div className="topbar__title">Carruseles</div>
          <Link href="/respaldo" className="iconbtn" aria-label="Respaldo del avance">
            <span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>⇄</span>
          </Link>
        </div>
      </header>

      <main className="wrap list">
        <section className="hero">
          <div className="eyebrow">Avance total</div>
          <div className="hero__count" style={{ marginTop: 8 }}>
            <span className="hero__n">{stats.done}</span>
            <span className="hero__of">
              publicados de <b>{total}</b> · {pct}%
            </span>
          </div>
          <div className="rail" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
        </section>

        {stats.behind && (
          <section className="section" data-brand={stats.behind.brand.id}>
            <div className="section__head">
              <span className="eyebrow">Sigue con esto</span>
              <span className="eyebrow">{stats.behind.brand.name}</span>
            </div>
            <Link className="resume" href={postHref(stats.behind.nextPost)}>
              <img
                className="resume__thumb"
                src={stats.behind.nextPost.thumb}
                alt=""
                width={60}
                height={75}
                loading="eager"
              />
              <div className="resume__body">
                <div className="resume__title">{stats.behind.nextPost.title}</div>
                <div className="resume__meta eyebrow">
                  {stats.behind.nextPost.seriesLabel} · {stats.behind.nextPost.slides} láminas
                </div>
              </div>
              <span className="resume__go" aria-hidden="true"><Forward /></span>
            </Link>
          </section>
        )}

        <section className="section">
          <div className="section__head">
            <span className="eyebrow">Marcas</span>
          </div>
          {stats.per.map(({ brand, done }) => (
            <Link key={brand.id} className="brandrow" href={`/${brand.id}`} data-brand={brand.id}>
              <div className="brandrow__top">
                <span className="brandrow__name">{brand.name}</span>
                <span className="brandrow__n"><b>{done}</b>/{brand.posts.length}</span>
              </div>
              <div className="brandrow__label">{brand.label || brand.tag}</div>
              <div className="rail" aria-hidden="true">
                <i style={{ width: `${brand.posts.length ? (done / brand.posts.length) * 100 : 0}%` }} />
              </div>
            </Link>
          ))}
        </section>

        <p className="eyebrow" style={{ textAlign: 'center', padding: '22px 0 4px', lineHeight: 1.8 }}>
          {total} carruseles · {slides} láminas
          <br />
          El avance se guarda en este navegador · <Link href="/respaldo" style={{ borderBottom: '1px solid currentColor' }}>respaldo</Link>
        </p>
      </main>
    </>
  )
}

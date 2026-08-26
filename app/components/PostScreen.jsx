'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Back, Check, Copy, Doc, Dots, Forward, Save } from './Icons'
import Sheet from './Sheet'
import { useToast } from './Toast'
import { esHoy, fmtFecha, useHoy } from '../lib/fecha'
import { canShareFiles, copyText, isIOS, prefetch, saveSlides } from '../lib/save'
import { isPublished, setPref, useActions, useMark, useMarks, usePrefs } from '../lib/store'

const FORMATS = [
  { key: 'ig', name: 'Instagram', ratio: '4:5', also: 'Facebook' },
  { key: 'tt', name: 'TikTok', ratio: '9:16', also: null },
]

export default function PostScreen({ post, brand, siblings }) {
  const [fmt, setFmt] = useState(post.ig.length ? 'ig' : 'tt')
  const [index, setIndex] = useState(0)
  const [busy, setBusy] = useState(null)      // 'ig' | 'tt' while a save is in flight
  const [retry, setRetry] = useState(null)    // format whose files are ready but needs a second tap
  const [sheetOpen, setSheetOpen] = useState(false)
  const hoy = useHoy()
  const [toast, showToast] = useToast()

  const deckRef = useRef(null)
  const rafRef = useRef(0)

  const mark = useMark(post.id)
  const marks = useMarks()
  const prefs = usePrefs()
  const { togglePublished, markDownloaded, resetPost } = useActions()

  const slides = post[fmt] || []
  const published = isPublished(mark)

  const nextPending = siblings.find((s) => s.id !== post.id && !isPublished(marks.posts[s.id])) || null

  /* Pull the full-size files into memory before the tap: navigator.share() has to be
   * reached without an await in front of it or Safari drops the gesture.
   *
   * Pero ESTE calentamiento es lo que hacía que abrir un post costara ~3,5 MB:
   * arrancaba en el primer render y se llevaba los originales de los DOS formatos
   * (~1,8 MB cada uno), compitiendo por el ancho de banda con las previews que son
   * lo único que se ve en pantalla. Ahora:
   *   - solo el formato ACTIVO (el otro se calienta si tocas su pestaña, porque el
   *     efecto vuelve a correr con el nuevo `fmt`);
   *   - solo DESPUÉS de que la ventana terminó de cargar y el hilo está ocioso, así
   *     el deslizador pinta primero;
   *   - y si aun así tocas "Guardar" antes de tiempo, saveSlides los baja en el
   *     momento y devuelve 'retry' → el botón dice "Toca de nuevo". Nada se rompe,
   *     solo cuesta un toque más en el peor caso. */
  useEffect(() => {
    const urls = post[fmt]?.map((s) => s.full) || []
    if (!urls.length) return

    const hasIdle = typeof requestIdleCallback === 'function'
    let cancelled = false
    let handle = 0
    const warm = () => {
      if (cancelled) return
      prefetch(urls).catch(() => { /* a failed warm-up just means the tap does the work */ })
    }
    const schedule = () => {
      if (cancelled) return
      handle = hasIdle ? requestIdleCallback(warm, { timeout: 2000 }) : setTimeout(warm, 600)
    }

    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })

    return () => {
      cancelled = true
      window.removeEventListener('load', schedule)
      if (hasIdle) cancelIdleCallback(handle)
      else clearTimeout(handle)
    }
  }, [fmt, post])

  /* Which sheet is centred in the deck. */
  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const el = deckRef.current
      if (!el) return
      const center = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      for (let i = 0; i < el.children.length; i++) {
        const c = el.children[i]
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center)
        if (dist < bestDist) { bestDist = dist; best = i }
      }
      setIndex(best)
    })
  }, [])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const switchFormat = (key) => {
    setFmt(key)
    setIndex(0)
    setRetry(null)
    deckRef.current?.scrollTo({ left: 0, behavior: 'auto' })
  }

  const goToSlide = (i) => {
    const el = deckRef.current
    const child = el?.children[i]
    if (!el || !child) return
    el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: 'smooth' })
  }

  const handleSave = async (key) => {
    const list = post[key] || []
    if (!list.length || busy) return
    setBusy(key)
    try {
      const result = await saveSlides(list.map((s) => s.full), { reverse: prefs.reverse })
      if (result === 'saved') {
        markDownloaded(post.id, key)
        setRetry(null)
        showToast(`${list.length} fotos guardadas`)
      } else if (result === 'downloaded') {
        markDownloaded(post.id, key)
        setRetry(null)
        showToast(`${list.length} fotos descargadas`)
      } else if (result === 'retry') {
        setRetry(key)
      }
    } catch {
      showToast('No se pudieron leer las fotos. Revisa la conexión.')
    } finally {
      setBusy(null)
    }
  }

  const handleCopy = async (text, label) => {
    if (!text) return showToast('Este post no tiene ese texto.')
    showToast(await copyText(text) ? `Caption de ${label} copiado` : 'No se pudo copiar')
  }

  const activeFmt = FORMATS.find((f) => f.key === fmt)
  const showHint = !mark?.[fmt === 'ig' ? 'dlIg' : 'dlTt']

  return (
    <div className="post" data-brand={brand.id}>
      <header className="post__head">
        <div className="topbar" style={{ position: 'static', backdropFilter: 'none', background: 'transparent', borderBottom: 0 }}>
          <div className="topbar__row">
            <Link href={`/${brand.id}`} className="iconbtn" aria-label={`Volver a ${brand.name}`}><Back /></Link>
            <div className="topbar__title eyebrow" style={{ fontSize: 10.5 }}>
              {brand.name} · {post.seriesLabel}
            </div>
            {published && <span className="stamp">Publicado</span>}
            <button className="iconbtn" onClick={() => setSheetOpen(true)} aria-label="Más opciones">
              <Dots />
            </button>
          </div>
        </div>
        {post.date && (
          <div className="post__date">
            {esHoy(post.date, hoy) ? 'Se publica HOY' : `Se publica el ${fmtFecha(post.date)}`}
          </div>
        )}
        <h1 className="post__title">{post.title}</h1>

        <div className="switch" role="tablist" aria-label="Formato">
          {FORMATS.map((f) => (
            <button
              key={f.key}
              role="tab"
              className="switch__btn"
              aria-selected={fmt === f.key}
              disabled={!post[f.key]?.length}
              onClick={() => switchFormat(f.key)}
            >
              {f.name}
              <span className="switch__ratio">{f.ratio}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="deck" ref={deckRef} onScroll={onScroll} aria-label={`Láminas para ${activeFmt.name}`}>
        {slides.map((s, i) => (
          <div className="deck__sheet" key={s.preview}>
            <img
              src={s.preview}
              alt={i === 0 ? post.alt || post.title : `Lámina ${i + 1}`}
              loading={i < 2 ? 'eager' : 'lazy'}
              /* La lámina 1 es literalmente lo primero que se mira: que no haga
               * cola detrás de los chunks de JS. */
              fetchPriority={i === 0 ? 'high' : 'auto'}
              decoding="async"
            />
            {published && i === 0 && <span className="stamp deck__stamp">Publicado</span>}
          </div>
        ))}
      </div>

      <div className="ticks">
        <div className="ticks__bar">
          {slides.map((s, i) => (
            <button
              key={s.preview}
              className="ticks__t"
              data-on={i <= index}
              onClick={() => goToSlide(i)}
              aria-label={`Ir a la lámina ${i + 1}`}
            />
          ))}
        </div>
        <span className="ticks__n">
          {String(index + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
        </span>
      </div>

      <div className="ops">
        <div className="ops__grid">
          {FORMATS.map((f) => {
            const list = post[f.key] || []
            const downloaded = !!mark?.[f.key === 'ig' ? 'dlIg' : 'dlTt']
            const state = mark?.[f.key] ? 'posted' : downloaded ? 'downloaded' : 'none'
            return (
              <section className="op" key={f.key} data-active={fmt === f.key}>
                <div className="op__head">
                  <span className="eyebrow">{f.name}</span>
                  <span className="op__dot" data-state={state} aria-hidden="true" />
                </div>
                <button
                  className="btn btn--save"
                  disabled={!list.length || busy === f.key}
                  onClick={() => handleSave(f.key)}
                >
                  {busy === f.key ? <span className="spinner" /> : <Save />}
                  {busy === f.key
                    ? 'Preparando…'
                    : retry === f.key
                      ? 'Toca de nuevo'
                      : `Guardar ${list.length} fotos`}
                </button>
                <button className="btn btn--ghost" onClick={() => handleCopy(post.captions[f.key], f.name)}>
                  <Copy /> Copiar caption
                </button>
              </section>
            )
          })}
        </div>

        <div className="marks">
          <span className="marks__label eyebrow">Publicado</span>
          {FORMATS.map((f) => (
            <button
              key={f.key}
              className="marks__btn"
              aria-pressed={!!mark?.[f.key]}
              onClick={() => togglePublished(post.id, f.key)}
            >
              {mark?.[f.key] ? <Check size={14} /> : null}
              {f.name}
            </button>
          ))}
        </div>

        {published && nextPending ? (
          <Link className="btn btn--ghost" href={`/${nextPending.brand}/${nextPending.series}/${nextPending.slug}`}>
            Siguiente pendiente <Forward size={16} />
          </Link>
        ) : showHint ? (
          <p className="hint">
            {canShareFiles()
              ? <>Se abre el menú de {isIOS() ? 'iOS' : 'compartir'} → elige <b>Guardar {slides.length} imágenes</b> para que vayan a Fotos.</>
              : <>Este navegador no puede guardar en Fotos: las {slides.length} fotos se descargan una por una.</>}
          </p>
        ) : null}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} labelledBy="sheet-title">
        <div id="sheet-title" className="eyebrow" style={{ marginBottom: 12 }}>
          {post.seriesLabel} · {post.slug}
        </div>

        {FORMATS.map((f) => post.captions[f.key] ? (
          <div key={f.key}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Caption de {f.name}</div>
            <div className="sheet__text">{post.captions[f.key]}</div>
          </div>
        ) : null)}

        {post.captions.fb && (
          <button className="sheet__item" onClick={() => { handleCopy(post.captions.fb, 'Facebook'); setSheetOpen(false) }}>
            <Copy />
            <span>Copiar caption de Facebook<small>Las mismas fotos de Instagram, sin hashtags</small></span>
          </button>
        )}

        {post.alt && (
          <button className="sheet__item" onClick={() => { handleCopy(post.alt, 'ALT'); setSheetOpen(false) }}>
            <Copy />
            <span>Copiar texto ALT<small>Instagram → Opciones avanzadas, en la lámina 1</small></span>
          </button>
        )}

        {post.pdf && (
          <a className="sheet__item" href={post.pdf} target="_blank" rel="noreferrer">
            <Doc />
            <span>Abrir el PDF de LinkedIn<small>Súbelo como documento, no como imágenes</small></span>
          </a>
        )}

        <button className="sheet__item" onClick={() => setPref('reverse', !prefs.reverse)}>
          <span className="mono" style={{ width: 17, textAlign: 'center' }}>{prefs.reverse ? '↑' : '↓'}</span>
          <span>
            Orden al guardar: <b>{prefs.reverse ? 'invertido (07 → 01)' : 'normal (01 → 07)'}</b>
            <small>Cámbialo si el selector de tu app pone primero la foto más reciente</small>
          </span>
        </button>

        <button
          className="sheet__item"
          style={{ color: 'var(--accent-2)' }}
          onClick={() => { resetPost(post.id); setSheetOpen(false); showToast('Estado de este post borrado') }}
        >
          <span className="mono" style={{ width: 17, textAlign: 'center' }}>×</span>
          <span>Borrar el estado de este post<small>Vuelve a aparecer como pendiente</small></span>
        </button>
      </Sheet>

      {toast}
    </div>
  )
}

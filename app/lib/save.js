'use client'

/**
 * Getting the slides into the iPhone's Photos app.
 *
 * The only route that lands in Photos (and not in Files) is the native share sheet:
 * navigator.share({ files }) -> "Guardar N imágenes". Two things make or break it:
 *
 *   1. Safari demands share() be called with transient user activation. Any await
 *      before the call can spend it, so the files are fetched AHEAD of the tap
 *      (prefetch(), fired when the deck opens) and the handler calls share()
 *      with no await in front of it. If the tap lands first, we still try, and
 *      surface "toca de nuevo" instead of a dead button when Safari refuses.
 *   2. Share the files ALONE. Adding title/text makes iOS treat the payload as a
 *      message and the "save images" action disappears.
 *
 * Everything else (desktop, Android without file share) falls back to sequential
 * downloads, which is honest about where the files go.
 */

/* url-list key -> Promise<File[]>. Capped, and it has to be: each entry holds a
 * whole carousel in memory (~1,2 MB) and every post prefetches two of them. Browsing
 * thirty posts in one sitting would otherwise pile up ~70 MB of blobs and get the tab
 * killed on a phone. Six keeps the current post and the previous one warm. */
const MAX_CACHED = 6
const cache = new Map()

function remember(key, promise) {
  cache.set(key, promise)
  while (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value)
  return promise
}

function touch(key) {
  // Map iterates in insertion order, so re-inserting marks the entry as most recent.
  const value = cache.get(key)
  cache.delete(key)
  cache.set(key, value)
  return value
}

export function canShareFiles() {
  if (typeof navigator === 'undefined' || !navigator.share || !navigator.canShare) return false
  try {
    const probe = new File([new Blob([''], { type: 'image/jpeg' })], 'p.jpg', { type: 'image/jpeg' })
    return navigator.canShare({ files: [probe] })
  } catch {
    return false
  }
}

export function isIOS() {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

/* Derived from the URL rather than passed in, so a file is named the same whether
 * the tap hit a warm cache or fetched on the spot:
 * /posts/<marca>/<serie>/<slug>/ig/03.jpg  ->  <slug>-ig-03.jpg */
function fileName(url, i) {
  const parts = url.split('/')
  const n = (parts.at(-1) || '').replace(/\.[^.]+$/, '') || String(i + 1).padStart(2, '0')
  return `${parts.at(-3) || 'lamina'}-${parts.at(-2) || 'x'}-${n}.jpg`
}

async function toFiles(urls) {
  return Promise.all(
    urls.map(async (url, i) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`No se pudo leer ${url}`)
      const blob = await res.blob()
      return new File([blob], fileName(url, i), { type: blob.type || 'image/jpeg' })
    }),
  )
}

/** Warm the cache so the next tap can call share() synchronously. */
export function prefetch(urls) {
  const key = urls.join('|')
  if (cache.has(key)) return touch(key)
  return remember(key, toFiles(urls).catch((e) => { cache.delete(key); throw e }))
}

export function isReady(urls) {
  return cache.has(urls.join('|'))
}

function downloadSequentially(files) {
  return new Promise((resolve) => {
    let i = 0
    const tick = () => {
      if (i >= files.length) return resolve('downloaded')
      const file = files[i++]
      const href = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = href
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(href), 10000)
      setTimeout(tick, 350)
    }
    tick()
  })
}

/**
 * @returns 'saved' | 'downloaded' | 'cancelled' | 'retry'
 *   'retry' means the files are cached now but Safari rejected the gesture —
 *   the caller should tell the user to tap once more.
 */
export async function saveSlides(urls, { reverse = false } = {}) {
  const key = urls.join('|')
  const wasReady = cache.has(key)
  let files = await prefetch(urls)
  if (reverse) files = [...files].reverse()

  if (canShareFiles() && navigator.canShare({ files })) {
    try {
      await navigator.share({ files })
      return 'saved'
    } catch (err) {
      if (err && err.name === 'AbortError') return 'cancelled'
      if (!wasReady) return 'retry'
      // Some in-app browsers advertise share() and then refuse files — fall through.
      return downloadSequentially(files)
    }
  }
  return downloadSequentially(files)
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older iOS / insecure origin: the selection trick still works inside a gesture.
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      ta.setSelectionRange(0, text.length)
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

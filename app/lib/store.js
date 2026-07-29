'use client'

/**
 * The only state this app keeps: what you already downloaded and what you already
 * published. It lives in localStorage — no backend, no env vars, no account. That
 * means it is per-device, so /respaldo exists to move it to another phone.
 *
 * Shape:  { v: 1, posts: { "<brand>/<series>/<slug>": { ig, tt, dlIg, dlTt } } }
 * Every value is a timestamp (ms) or absent. `ig`/`tt` = published on that network.
 */
import { useCallback, useSyncExternalStore } from 'react'

const KEY = 'carruseles.v1'

let state = null
const listeners = new Set()

function read() {
  if (typeof window === 'undefined') return { v: 1, posts: {} }
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && typeof parsed === 'object' && parsed.posts) return { v: 1, posts: parsed.posts }
  } catch {
    /* corrupt or blocked storage — start clean rather than crash the app */
  }
  return { v: 1, posts: {} }
}

function get() {
  if (!state) state = read()
  return state
}

function commit(next) {
  state = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* private mode / quota: keep the in-memory value so the session still works */
  }
  listeners.forEach((l) => l())
}

function subscribe(listener) {
  listeners.add(listener)
  // Another tab (or the /respaldo screen) wrote to the same key.
  const onStorage = (e) => {
    if (e.key === KEY) {
      state = read()
      listeners.forEach((l) => l())
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

const EMPTY = { v: 1, posts: {} }

export function useMarks() {
  return useSyncExternalStore(subscribe, get, () => EMPTY)
}

export function useMark(id) {
  const marks = useMarks()
  return marks.posts[id] || null
}

function patch(id, fields) {
  const cur = get()
  const entry = { ...(cur.posts[id] || {}), ...fields }
  for (const k of Object.keys(entry)) if (!entry[k]) delete entry[k]
  const posts = { ...cur.posts }
  if (Object.keys(entry).length) posts[id] = entry
  else delete posts[id]
  commit({ v: 1, posts })
}

export function useActions() {
  const togglePublished = useCallback((id, fmt) => {
    const cur = get().posts[id] || {}
    patch(id, { [fmt]: cur[fmt] ? 0 : Date.now() })
  }, [])

  const setPublished = useCallback((id, fmt, on) => {
    patch(id, { [fmt]: on ? Date.now() : 0 })
  }, [])

  const markDownloaded = useCallback((id, fmt) => {
    patch(id, { [fmt === 'ig' ? 'dlIg' : 'dlTt']: Date.now() })
  }, [])

  const resetPost = useCallback((id) => {
    const posts = { ...get().posts }
    delete posts[id]
    commit({ v: 1, posts })
  }, [])

  return { togglePublished, setPublished, markDownloaded, resetPost }
}

export function isPublished(mark) {
  return !!(mark && mark.ig && mark.tt)
}

export function isStarted(mark) {
  return !!(mark && (mark.ig || mark.tt || mark.dlIg || mark.dlTt))
}

/* ---- backup / restore, used by /respaldo ---- */

export function exportState() {
  return JSON.stringify(get(), null, 0)
}

export function importState(text) {
  const parsed = JSON.parse(text)
  if (!parsed || typeof parsed !== 'object' || typeof parsed.posts !== 'object') {
    throw new Error('Ese texto no es un respaldo válido.')
  }
  // Merge, keeping whichever timestamp is newer: restoring an old backup on a phone
  // that is already ahead must not un-publish anything.
  const merged = { ...get().posts }
  for (const [id, entry] of Object.entries(parsed.posts)) {
    const cur = merged[id] || {}
    const next = { ...cur }
    for (const [k, v] of Object.entries(entry)) {
      if (typeof v === 'number' && v > (cur[k] || 0)) next[k] = v
    }
    merged[id] = next
  }
  commit({ v: 1, posts: merged })
  return Object.keys(parsed.posts).length
}

export function clearState() {
  commit({ v: 1, posts: {} })
}

/* ---- preferences ----------------------------------------------------------
 * Only one so far: save order. iOS stamps shared images with the moment they were
 * saved, so an upload picker that lists "más recientes primero" shows slide 07 in
 * the top-left. Flipping the order fixes that picker and breaks the Photos app's
 * own view — which one is right depends on the app he uploads from, so it's a
 * switch with an honest label rather than a guess baked into the save button. */

const PREF_KEY = 'carruseles.prefs.v1'
let prefs = null
const prefListeners = new Set()

function readPrefs() {
  if (typeof window === 'undefined') return { reverse: false }
  try {
    return { reverse: false, ...(JSON.parse(window.localStorage.getItem(PREF_KEY)) || {}) }
  } catch {
    return { reverse: false }
  }
}

function getPrefs() {
  if (!prefs) prefs = readPrefs()
  return prefs
}

const EMPTY_PREFS = { reverse: false }

export function usePrefs() {
  return useSyncExternalStore(
    (l) => { prefListeners.add(l); return () => prefListeners.delete(l) },
    getPrefs,
    () => EMPTY_PREFS,
  )
}

export function setPref(key, value) {
  prefs = { ...getPrefs(), [key]: value }
  try {
    window.localStorage.setItem(PREF_KEY, JSON.stringify(prefs))
  } catch { /* ignore */ }
  prefListeners.forEach((l) => l())
}

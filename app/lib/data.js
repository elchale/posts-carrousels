/**
 * Server-side reader for data/index.json (written by scripts/build-index.mjs).
 * Only ever imported from server components, so the captions payload never ships
 * to the browser except for the one post being viewed.
 */
import fs from 'node:fs'
import path from 'node:path'

let cache = null

function load() {
  if (cache) return cache
  const file = path.join(process.cwd(), 'data', 'index.json')
  try {
    cache = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    throw new Error(
      'Falta data/index.json. Corre `npm run prepare-assets` (o `npm run dev`, que lo hace solo).',
    )
  }
  return cache
}

export function getIndex() {
  return load()
}

export function getBrands() {
  return load().brands
}

export function getBrand(id) {
  return load().brands.find((b) => b.id === id) || null
}

export function getAllPosts() {
  return load().brands.flatMap((b) => b.posts)
}

export function getPost(brandId, series, slug) {
  const brand = getBrand(brandId)
  if (!brand) return null
  const i = brand.posts.findIndex((p) => p.series === series && p.slug === slug)
  if (i < 0) return null
  return {
    post: brand.posts[i],
    brand,
    prev: brand.posts[i - 1] || null,
    next: brand.posts[i + 1] || null,
  }
}

/** Everything the grid and home screens need, minus the captions. */
export function summarize(post) {
  return {
    id: post.id,
    brand: post.brand,
    series: post.series,
    seriesLabel: post.seriesLabel,
    slug: post.slug,
    date: post.date || null,
    title: post.title,
    kicker: post.kicker,
    thumb: post.thumb,
    slides: (post.ig.length || post.tt.length),
  }
}

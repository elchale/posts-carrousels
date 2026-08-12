/**
 * TikTok profile scanner — reads public view/like/comment/save counts for
 * every post on a profile using a real (headless) Chromium via Playwright.
 *
 * Usage:  node tools/tiktok_scan.mjs <handle> [<handle> ...]
 *         node tools/tiktok_scan.mjs --out data/tiktok-stats.json <handles...>
 *
 * Strategy: navigate to tiktok.com/@handle, capture the item-list API
 * responses the page itself makes while we scroll (those carry full stats
 * per item: playCount, diggCount, commentCount, collectCount, shareCount),
 * and also parse the initial __UNIVERSAL_DATA_FOR_REHYDRATION__ blob.
 * Scrolls until no new items appear.
 */
import { chromium } from 'playwright'
import fs from 'node:fs'

const args = process.argv.slice(2)
let outPath = null
const handles = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') outPath = args[++i]
  else handles.push(args[i].replace(/^@/, ''))
}
if (!handles.length) {
  console.error('usage: node tools/tiktok_scan.mjs [--out file.json] <handle...>')
  process.exit(1)
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

function itemRecord(it) {
  const s = it.stats || it.statsV2 || {}
  const n = (v) => (v == null ? null : Number(v))
  return {
    id: it.id,
    desc: (it.desc || '').slice(0, 200),
    createTime: it.createTime ? new Date(it.createTime * 1000).toISOString().slice(0, 10) : null,
    isPhoto: !!it.imagePost,
    views: n(s.playCount),
    likes: n(s.diggCount),
    comments: n(s.commentCount),
    saves: n(s.collectCount),
    shares: n(s.shareCount),
  }
}

async function scanProfile(ctx, handle) {
  const page = await ctx.newPage()
  const items = new Map()

  page.on('response', async (res) => {
    const url = res.url()
    if (!/api\/post\/item_list/.test(url)) return
    try {
      const data = await res.json()
      for (const it of data.itemList || []) items.set(it.id, itemRecord(it))
    } catch {}
  })

  await page.goto(`https://www.tiktok.com/@${handle}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(5000)

  // TikTok sometimes serves the profile with an errored (empty) grid on the
  // first load; a reload or two fixes it. Items may also arrive via the API
  // listener even when the grid is empty.
  for (let attempt = 0; attempt < 3; attempt++) {
    const links = await page.evaluate(
      () => document.querySelectorAll('a[href*="/video/"], a[href*="/photo/"]').length
    )
    if (links > 0 || items.size > 0) break
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(5000)
  }

  // Initial SSR blob (first batch of posts + author stats)
  let author = null
  try {
    const blob = await page.evaluate(() => {
      const el = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__')
      return el ? el.textContent : null
    })
    if (blob) {
      const data = JSON.parse(blob)
      const scope = data.__DEFAULT_SCOPE__ || {}
      const detail = scope['webapp.user-detail']
      if (detail?.userInfo) {
        const u = detail.userInfo
        author = {
          nickname: u.user?.nickname,
          followers: u.stats?.followerCount,
          totalLikes: u.stats?.heartCount,
          videoCount: u.stats?.videoCount,
        }
      }
    }
  } catch {}

  // Scroll until the grid stops growing
  let stale = 0
  let last = -1
  for (let i = 0; i < 60 && stale < 5; i++) {
    await page.mouse.wheel(0, 2500)
    await page.waitForTimeout(1200)
    if (items.size === last) stale++
    else { stale = 0; last = items.size }
  }

  // Fallback: if the API never fired, pull view counts off the DOM grid
  if (items.size === 0) {
    const domItems = await page.evaluate(() => {
      const out = []
      for (const a of document.querySelectorAll('a[href*="/video/"], a[href*="/photo/"]')) {
        const views = a.querySelector('[data-e2e="video-views"]')?.textContent || null
        const m = a.href.match(/\/(video|photo)\/(\d+)/)
        if (m) out.push({ id: m[2], viewsText: views, href: a.href })
      }
      return out
    })
    for (const d of domItems) items.set(d.id, { id: d.id, viewsText: d.viewsText, dom: true })
  }

  await page.close()
  return { handle, author, posts: [...items.values()].sort((a, b) => (b.createTime || '').localeCompare(a.createTime || '')) }
}

// Headless and bundled Chromium both get soft-blocked ("Hubo un problema").
// Real Chrome, headed, with automation flags hidden and a persistent profile
// dir (cookies survive runs → better bot score) loads everything. A Chrome
// window will open while the scan runs — don't interact with it.
const ctx = await chromium.launchPersistentContext('tools/.ttprofile', {
  channel: 'chrome',
  headless: false,
  viewport: { width: 1280, height: 900 },
  locale: 'es-PE',
  args: ['--disable-blink-features=AutomationControlled'],
})
const results = []
for (const h of handles) {
  process.stderr.write(`scanning @${h}...\n`)
  try {
    const r = await scanProfile(ctx, h)
    process.stderr.write(`  ${r.posts.length} posts${r.author ? `, ${r.author.followers} followers` : ''}\n`)
    results.push(r)
  } catch (e) {
    process.stderr.write(`  FAILED: ${e.message}\n`)
    results.push({ handle: h, error: e.message, posts: [] })
  }
}
await ctx.close()

const payload = { scannedAt: new Date().toISOString(), profiles: results }
if (outPath) fs.writeFileSync(outPath, JSON.stringify(payload, null, 2))
else console.log(JSON.stringify(payload, null, 2))

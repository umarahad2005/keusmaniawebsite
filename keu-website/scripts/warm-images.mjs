/* =========================================================
   Karwan e Usmania International — pre-generate photo sizes on Cloudinary

   Owner report (2026-10-12): photos loaded slowly in production. Cloudinary
   creates each resized version the first time anyone asks for it, so the
   first visitor of every size waits for that. (Serving the photos from the
   site itself was tried and measured: Vercel answers Pakistan from Singapore,
   while Cloudinary's CDN answers from nearby, so Cloudinary stays.)

   This script asks Cloudinary once for every photo the site uses, at every
   width and in every format the pages request (f_auto gives AVIF, WebP or
   JPEG depending on the browser), so all of them already exist when real
   visitors arrive. Cloudinary keeps generated versions permanently.

   Run after deploys that change image sizes, and after adding photos in the
   admin:   node scripts/warm-images.mjs
   ========================================================= */

import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE_URL = (process.env.SITE_URL || 'https://usmania.vercel.app').replace(/\/+$/, '')
const BASE = 'https://res.cloudinary.com/dpmnlysdt/image/upload'

/* Every width a page asks for: PageHeader 480/720/960/1280, story 480/720/960,
   gallery 400/600/900/1200, lightbox 768/1200/1600, team 320–960, <Img>
   defaults 480/768/1200/1600/2048. */
const WIDTHS = [320, 400, 480, 600, 640, 720, 768, 900, 960, 1200, 1280, 1600, 2048]
/* Team photos are also requested as the digital card's 320×320 face crop. */
const TEAM_CROPS = ['f_auto,q_auto,w_320,h_320,c_fill,g_face']
/* What different browsers send: f_auto produces one version per format. */
const ACCEPTS = [
  'image/avif,image/webp,image/apng,image/*,*/*;q=0.8', // Chrome, Edge, Android
  'image/webp,image/*,*/*;q=0.8',                       // older Chrome, Samsung
  'image/*,*/*;q=0.8',                                  // fallback (JPEG/PNG)
]

/* Same URL shape as src/lib/images.js cldUrl(). */
function url(src, transform) {
  if (src.includes('res.cloudinary.com') && src.includes('/image/upload/')) {
    const [prefix, rest] = src.split('/image/upload/')
    return `${prefix}/image/upload/${transform}/${rest.replace(/^[a-z]{1,3}_[^/]*\//, '')}`
  }
  return `${BASE}/${transform}/${src}`
}

async function collect() {
  const photos = new Set(['keu/makkah/kaaba', 'keu/madinah/prophets-mosque', 'keu/makkah/masjid-al-haram', 'keu/madinah/madinah-city'])
  const team = new Set()
  const isImg = v => typeof v === 'string' && (/^keu\//.test(v) || v.includes('res.cloudinary.com/dpmnlysdt/image/upload'))
  const walk = (o, key = '') => {
    if (isImg(o)) (key === 'photo' ? team : photos).add(o)
    else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, Array.isArray(o) ? key : k)
  }
  const { SITE } = await import(pathToFileURL(path.join(ROOT, 'src', 'data.js')).href)
  walk(SITE)
  try {
    const res = await fetch(`${SITE_URL}/api/content`)
    if (res.ok) walk(await res.json())
  } catch (e) { console.warn('  ! live content unreachable, using code defaults:', e.message) }
  for (const t of team) photos.add(t)
  return { photos: [...photos], team: [...team] }
}

async function hit(u, accept) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 90_000)
  try {
    const res = await fetch(u, { headers: { Accept: accept }, signal: ctrl.signal })
    await res.arrayBuffer()
    return res.ok ? 'ok' : `HTTP ${res.status}`
  } catch (e) { return e.name === 'AbortError' ? 'timeout' : e.message } finally { clearTimeout(timer) }
}

const { photos, team } = await collect()
const jobs = []
for (const p of photos) for (const w of WIDTHS) for (const a of ACCEPTS) jobs.push([url(p, `f_auto,q_auto,w_${w}`), a])
for (const p of team) for (const t of TEAM_CROPS) for (const a of ACCEPTS) jobs.push([url(p, t), a])
console.log(`${photos.length} photos (${team.length} team) → ${jobs.length} versions\n`)

let done = 0, ok = 0
const failed = []
const CONCURRENCY = 6
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (jobs.length) {
    const [u, a] = jobs.shift()
    const r = await hit(u, a)
    done++
    if (r === 'ok') ok++
    else failed.push(`${r}  ${u}`)
    if (done % 50 === 0) console.log(`  ${done} done`)
  }
}))
console.log(`\n${ok}/${done} versions ready on Cloudinary`)
if (failed.length) { console.log(`${failed.length} failed (re-run to retry):`); failed.slice(0, 15).forEach(f => console.log('  ' + f)) }

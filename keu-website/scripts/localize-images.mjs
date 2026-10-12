/* =========================================================
   Karwan e Usmania International — serve site photos from the site itself

   Owner request (2026-10-12): production photos loaded slowly. Cloudinary
   resizes each image the first time a new size is asked for, and every photo
   needs an extra connection to res.cloudinary.com. This script downloads the
   photos the site uses once, makes WebP copies at the widths the pages ask
   for, and writes:

     public/img/<id>-<width>.webp      served by the host's CDN, same origin
     src/lib/localImages.json          manifest read by <Img> (id → widths, size)
     index.html (between markers)      the header-photo preload, same URLs

   <Img> uses the local copy whenever the manifest has the image; anything not
   in it (e.g. a photo uploaded in the admin later) still comes from Cloudinary.
   Run it again after changing photos in the admin to bring them local too.

     usage:  node scripts/localize-images.mjs
             SITE_URL=https://usmania.vercel.app (default) is read for the
             live list of photos; the code's own defaults are always included.
   ========================================================= */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public', 'img')
const MANIFEST = path.join(ROOT, 'src', 'lib', 'localImages.json')
const INDEX = path.join(ROOT, 'index.html')
const SITE_URL = (process.env.SITE_URL || 'https://usmania.vercel.app').replace(/\/+$/, '')
const CLOUD = 'https://res.cloudinary.com/dpmnlysdt/image/upload'

/* Widths every page asks for (PageHeader 480–1280, gallery up to 1200,
   team 320–960). Larger than the source are skipped. */
const WIDTHS = [320, 480, 640, 720, 960, 1280, 1600]
const QUALITY = 72

/* Page headers (fixed in the page code) and their preload. */
const HEADERS = {
  '/packages': 'keu/makkah/kaaba',
  '/about': 'keu/madinah/prophets-mosque',
  '/gallery': 'keu/makkah/masjid-al-haram',
  '/contact': 'keu/madinah/madinah-city',
}
const HEADER_WIDTHS = [480, 720, 960, 1280]
const HEADER_SIZES = '(max-width: 767px) calc(100vw - 32px), 45vw'

/** Cloudinary public id from a public id or any delivery URL (version, transforms and extension removed). */
export function publicId(src = '') {
  if (!src.includes('res.cloudinary.com')) return src.replace(/\.[a-z0-9]+$/i, '')
  let rest = src.split('/image/upload/')[1] || ''
  rest = rest.split('?')[0]
  const parts = rest.split('/')
  while (parts.length && (/^[a-z]{1,3}_[^/]*$/.test(parts[0]) || /,/.test(parts[0]) || /^v\d+$/.test(parts[0]))) parts.shift()
  return parts.join('/').replace(/\.[a-z0-9]+$/i, '')
}
const slug = id => id.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()

async function collect() {
  const ids = new Set(Object.values(HEADERS))
  const add = v => { if (typeof v === 'string' && (/^keu\//.test(v) || v.includes('res.cloudinary.com/dpmnlysdt/image/upload'))) ids.add(publicId(v)) }
  const walk = o => { if (typeof o === 'string') add(o); else if (o && typeof o === 'object') Object.values(o).forEach(walk) }
  const { SITE } = await import(pathToFileURL(path.join(ROOT, 'src', 'data.js')).href)
  walk(SITE)
  try {
    const res = await fetch(`${SITE_URL}/api/content`)
    if (res.ok) walk(await res.json())
    else console.warn(`  ! live content: HTTP ${res.status} (using code defaults only)`)
  } catch (e) { console.warn('  ! live content unreachable (using code defaults only):', e.message) }
  return [...ids].filter(Boolean).sort()
}

async function localize(id) {
  // Ask Cloudinary for a large, high-quality JPEG once; resize locally.
  const res = await fetch(`${CLOUD}/c_limit,w_2000,q_95,f_jpg/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const meta = await sharp(buf).metadata()
  // Every standard width up to the source, plus the source's own width when it
  // falls between two steps (a 470 px photo gets 320 and 470).
  const widths = WIDTHS.filter(w => w <= meta.width)
  if (meta.width < WIDTHS[WIDTHS.length - 1] && !widths.includes(meta.width)) widths.push(meta.width)
  let bytes = 0
  for (const w of widths) {
    const out = await sharp(buf).resize({ width: w }).webp({ quality: QUALITY, effort: 5 }).toBuffer()
    await fs.writeFile(path.join(OUT, `${slug(id)}-${w}.webp`), out)
    bytes += out.length
  }
  return { file: slug(id), widths, w: meta.width, h: meta.height, bytes }
}

function headerPreloadBlock(manifest) {
  const map = {}
  for (const [route, id] of Object.entries(HEADERS)) {
    const m = manifest[id]
    if (!m) continue
    const ws = HEADER_WIDTHS.filter(w => m.widths.includes(w))
    if (!ws.length) continue
    map[route] = { srcset: ws.map(w => `/img/${m.file}-${w}.webp ${w}w`).join(', '), href: `/img/${m.file}-${ws[ws.length - 1]}.webp` }
  }
  return `  <!-- keu-header-preload:start (generated by scripts/localize-images.mjs) -->
  <script>
    (function () {
      var map = ${JSON.stringify(map)}
      var p = map[location.pathname.replace(/\\/+$/, '')]
      if (!p) return
      var l = document.createElement('link')
      l.rel = 'preload'; l.as = 'image'; l.setAttribute('fetchpriority', 'high')
      l.setAttribute('imagesrcset', p.srcset)
      l.setAttribute('imagesizes', '${HEADER_SIZES}')
      l.href = p.href
      document.head.appendChild(l)
    })()
  </script>
  <!-- keu-header-preload:end -->`
}

await fs.mkdir(OUT, { recursive: true })
const ids = await collect()
console.log(`${ids.length} photos\n`)
const manifest = {}
let total = 0
for (const id of ids) {
  try {
    const m = await localize(id)
    manifest[id] = { file: m.file, widths: m.widths, w: m.w, h: m.h }
    total += m.bytes
    console.log(`  ✓ ${id.padEnd(40)} ${m.w}×${m.h}  ${m.widths.join('/')}  ${(m.bytes / 1024).toFixed(0)} KB`)
  } catch (e) {
    console.warn(`  ! ${id}: ${e.message} (stays on Cloudinary)`)
  }
}
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`\n${Object.keys(manifest).length} localized, ${(total / 1024 / 1024).toFixed(1)} MB in public/img`)

// Replace the header-photo preload in index.html (first run replaces the old Cloudinary version).
let html = await fs.readFile(INDEX, 'utf8')
const block = headerPreloadBlock(manifest)
const marked = /[ \t]*<!-- keu-header-preload:start[\s\S]*?keu-header-preload:end -->/
const legacy = /[ \t]*<!-- Inner pages: start the header photo[\s\S]*?<\/script>\r?\n/
if (marked.test(html)) html = html.replace(marked, block)
else if (legacy.test(html)) html = html.replace(legacy, block + '\n')
else throw new Error('index.html: header preload block not found')
await fs.writeFile(INDEX, html)
console.log('index.html header preload updated')

/* =========================================================
   Karwan e Usmania International — browser tab / app icons

   Builds the icon set from the KU mark traced from newlogo.png in Phase 0
   (src/assets/brand/ku-mark.svg): a vector, so every size is sharp. The
   wordmark is never used at icon sizes (unreadable below ~64 px).

   Writes to public/:
     favicon.svg                 the mark itself (modern browsers)
     favicon.ico                 16, 32, 48 (PNG payloads)
     favicon-16/32/48.png
     apple-touch-icon.png        180, on a paper plate (iOS ignores alpha)
     icon-192.png, icon-512.png  web manifest, on a paper plate
     icon-maskable-512.png       safe zone for Android masks
     brand/keui-logo-512.png     transparent mark for structured data
     site.webmanifest

     usage:  node scripts/generate-icons.js
   ========================================================= */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const MARK = path.join(ROOT, 'src/assets/brand/ku-mark.svg')

const PAPER = { r: 252, g: 251, b: 248, alpha: 1 }     // --paper #fcfbf8
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 }

const svg = await fs.readFile(MARK, 'utf8')

/** The mark rendered to a square PNG, optionally on a plate with padding. */
async function render(size, { plate = CLEAR, pad = 0.04 } = {}) {
  const inner = Math.round(size * (1 - pad * 2))
  const mark = await sharp(Buffer.from(svg), { density: Math.max(72, Math.ceil((inner / 1000) * 72 * 4)) })
    .resize(inner, inner, { fit: 'contain', background: CLEAR })
    .png()
    .toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: plate } })
    .composite([{ input: mark, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/* Minimal ICO writer: since Vista an .ico may hold PNG payloads directly. */
function buildIco(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  let offset = 6 + pngs.length * 16
  const entries = []
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt8(0, 2)
    e.writeUInt8(0, 3)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(data.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += data.length
    entries.push(e)
  }
  return Buffer.concat([header, ...entries, ...pngs.map(p => p.data)])
}

const out = async (name, buf) => {
  const file = path.join(PUBLIC, name)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, buf)
  console.log(`  ✓ ${name.padEnd(26)} ${(buf.length / 1024).toFixed(1)} KB`)
}

await out('favicon.svg', Buffer.from(svg.replace(/<title>[^<]*<\/title>/, '<title>Karwan e Usmania International</title>')))

/* Tabs: transparent at 16 and 32 so the mark sits on the browser's own chrome. */
for (const size of [16, 32, 48]) await out(`favicon-${size}.png`, await render(size, { pad: 0.02 }))
const ico = []
for (const size of [16, 32, 48]) ico.push({ size, data: await render(size, { pad: 0.02 }) })
await out('favicon.ico', buildIco(ico))

await out('apple-touch-icon.png', await render(180, { plate: PAPER, pad: 0.12 }))
await out('icon-192.png', await render(192, { plate: PAPER, pad: 0.1 }))
await out('icon-512.png', await render(512, { plate: PAPER, pad: 0.1 }))
await out('icon-maskable-512.png', await render(512, { plate: PAPER, pad: 0.2 }))
await out('brand/keui-logo-512.png', await render(512, { pad: 0.02 }))

const manifest = {
  name: 'Karwan e Usmania International',
  short_name: 'Karwan e Usmania',
  description: 'Umrah packages from Lahore, Pakistan, since 2005',
  start_url: '/',
  display: 'standalone',
  background_color: '#fcfbf8',
  theme_color: '#004828',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}
await out('site.webmanifest', Buffer.from(JSON.stringify(manifest, null, 2) + '\n'))

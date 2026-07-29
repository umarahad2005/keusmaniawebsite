/* =========================================================
   Karwan-e-Usmania — browser tab / app icons

   Builds the favicon set from public/logo.png. The full logo is a tall
   portrait lockup whose "KARWAN-E-USMANIA" wordmark is unreadable below
   ~64px, so only the emblem (minaret, dome, Kaaba, gold swoosh) is used.

     usage:  node scripts/generate-icons.js
   ========================================================= */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.join(__dirname, '..', 'public')
const SRC = path.join(PUBLIC, 'logo.png')

/* Region of logo.png holding the emblem, above the wordmark. Trimmed after
   cropping, so these bounds only need to be roughly right. */
const EMBLEM = { left: 0, top: 380, width: 1080, height: 415 }

/* Tabs render the icon on both light and dark chrome; the logo's navy and green
   need a light plate behind them to stay legible either way. */
const PLATE = { r: 255, g: 255, b: 255, alpha: 1 }
/* The emblem is ~1.3:1, so fitting it into a square already letterboxes it top
   and bottom. Keep side padding minimal or the artwork ends up a thin band. */
const PAD = 0.03

async function buildEmblem() {
  const cropped = await sharp(SRC).extract(EMBLEM).png().toBuffer()
  return sharp(cropped).trim({ threshold: 10 }).png().toBuffer()
}

/** Emblem centred on a square plate at the given size. */
async function square(emblem, size) {
  const inner = Math.round(size * (1 - PAD * 2))
  const fitted = await sharp(emblem)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  return sharp({
    create: { width: size, height: size, channels: 4, background: PLATE },
  })
    .composite([{ input: fitted, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/* Minimal ICO writer. Since Vista an .ico may hold PNG payloads directly, which
   every browser in use understands — so no BMP encoding needed. */
function buildIco(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)            // reserved
  header.writeUInt16LE(1, 2)            // type: icon
  header.writeUInt16LE(pngs.length, 4)  // image count

  let offset = 6 + pngs.length * 16
  const entries = []
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)  // 0 encodes 256
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt8(0, 2)                       // palette count
    e.writeUInt8(0, 3)                       // reserved
    e.writeUInt16LE(1, 4)                    // colour planes
    e.writeUInt16LE(32, 6)                   // bits per pixel
    e.writeUInt32LE(data.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += data.length
    entries.push(e)
  }

  return Buffer.concat([header, ...entries, ...pngs.map(p => p.data)])
}

const emblem = await buildEmblem()
const meta = await sharp(emblem).metadata()
console.log(`emblem: ${meta.width}×${meta.height}\n`)

const ICO_SIZES = [16, 32, 48]
const PNG_FILES = [
  ['favicon-16.png', 16],
  ['favicon-32.png', 32],
  ['favicon-48.png', 48],
  ['apple-touch-icon.png', 180],
]

for (const [name, size] of PNG_FILES) {
  await fs.writeFile(path.join(PUBLIC, name), await square(emblem, size))
  console.log(`  ✓ ${name.padEnd(22)} ${size}×${size}`)
}

const icoParts = []
for (const size of ICO_SIZES) icoParts.push({ size, data: await square(emblem, size) })
await fs.writeFile(path.join(PUBLIC, 'favicon.ico'), buildIco(icoParts))
console.log(`  ✓ ${'favicon.ico'.padEnd(22)} ${ICO_SIZES.join(', ')}`)

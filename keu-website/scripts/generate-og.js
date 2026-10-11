/* =========================================================
   Karwan e Usmania International — share cards (Open Graph)

   1200×630 paper cards, one per public page, in the letterhead grammar:
   the full lockup (outlined wordmark, so no font is needed), the gold
   ribbon sweep, and the page's still in a framed plate on the right. No type
   is set on the image. Link previews show the page title beside the card.

   Writes public/og/{home,packages,about,gallery,contact}.jpg (JPEG keeps each
   card well under the ~300 KB that WhatsApp previews allow)

     usage:  node scripts/generate-og.js
   ========================================================= */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BRAND = path.join(ROOT, 'src/assets/brand')
const MEDIA = path.join(ROOT, 'src/assets/media')
const OUT = path.join(ROOT, 'public/og')

const W = 1200, H = 630
const PAPER = '#fcfbf8'

const CARDS = {
  home:     'hero-poster-1920.webp',
  packages: 'makkah-kaaba-kiswa-1600.webp',
  about:    'madinah-poster.webp',
  gallery:  'hero-poster-1920.webp',
  contact:  'madinah-poster.webp',
}

/* The wordmark's colours are CSS variables on the site; resolve them here. */
const wordmark = (await fs.readFile(path.join(BRAND, 'wordmark.svg'), 'utf8'))
  .replace('fill:currentColor', 'fill:#004828')
  .replace('fill:var(--lockup-2,#005830)', 'fill:#005830')
  .replace('fill:var(--lockup-rule,#d9ae54)', 'fill:#d9ae54')
  .replace('fill:var(--lockup-3,#0b0b0b)', 'fill:#0b0b0b')
const mark = await fs.readFile(path.join(BRAND, 'ku-mark.svg'), 'utf8')

const png = (svg, width) => sharp(Buffer.from(svg), { density: 300 }).resize({ width }).png().toBuffer()

/* Plate geometry: right side, framed, with the 20 px inset hairline. */
const PLATE = { left: 700, top: 0, width: 500, height: H }

const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="rib" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#e3c38a"/><stop offset=".5" stop-color="#e8cd94"/><stop offset="1" stop-color="#fae0a1"/>
    </linearGradient>
  </defs>
  <!-- inset frame on the plate -->
  <rect x="${PLATE.left + 20.5}" y="20.5" width="${PLATE.width - 41}" height="${H - 41}" fill="none" stroke="#f4f1ea" stroke-opacity=".8" stroke-width="1"/>
  <!-- letterhead sweep along the foot of the paper, ribbon drawn -->
  <path d="M0 630V560C180 610 380 590 560 600S760 570 700 600V630Z" fill="#004828"/>
  <path d="M0 552C180 604 380 584 560 594S740 566 700 592" fill="none" stroke="url(#rib)" stroke-width="3"/>
  <!-- the margin rule -->
  <rect x="80" y="96" width="1" height="380" fill="#d9ae54"/>
</svg>`

await fs.mkdir(OUT, { recursive: true })
const markPng = await png(mark, 132)
const wordPng = await png(wordmark, 470)
const overlayPng = await sharp(Buffer.from(overlay)).png().toBuffer()

for (const [key, file] of Object.entries(CARDS)) {
  const still = await sharp(path.join(MEDIA, file))
    .resize(PLATE.width, PLATE.height, { fit: 'cover', position: 'attention' })
    .png()
    .toBuffer()
  const buf = await sharp({ create: { width: W, height: H, channels: 4, background: PAPER } })
    .composite([
      { input: still, left: PLATE.left, top: PLATE.top },
      { input: overlayPng, left: 0, top: 0 },
      { input: markPng, left: 112, top: 150 },
      { input: wordPng, left: 112, top: 318 },
    ])
    .flatten({ background: PAPER })
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer()
  await fs.writeFile(path.join(OUT, `${key}.jpg`), buf)
  console.log(`  ✓ og/${key}.jpg ${(buf.length / 1024).toFixed(0)} KB`)
}

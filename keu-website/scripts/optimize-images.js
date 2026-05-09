/* =========================================================
   Karwan-e-Usmania — Image optimizer
   Walks public/images/, generates 400w / 800w / 1200w WebP
   variants alongside the originals (suffix: -400.webp etc.).
   Source files stay untouched.

     usage:  node scripts/optimize-images.js
   ========================================================= */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const ROOT       = path.resolve(__dirname, '..')

const SRC_DIR = path.join(ROOT, 'public', 'images')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'optimized')
const SIZES   = [400, 800, 1200]
const EXT_OK  = new Set(['.jpg', '.jpeg', '.png'])

async function walk(dir) {
  let entries
  try { entries = await fs.readdir(dir, { withFileTypes: true }) }
  catch { return [] }
  const out = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...await walk(full))
    else if (EXT_OK.has(path.extname(e.name).toLowerCase())) out.push(full)
  }
  return out
}

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }) }

async function processOne(file) {
  const rel  = path.relative(SRC_DIR, file)
  const sub  = path.dirname(rel)
  const base = path.basename(rel, path.extname(rel))
  const dest = path.join(OUT_DIR, sub)
  await ensureDir(dest)

  for (const w of SIZES) {
    const out = path.join(dest, `${base}-${w}.webp`)
    await sharp(file)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out)
    process.stdout.write(`  ✓ ${path.relative(ROOT, out)}\n`)
  }
}

async function main() {
  const files = await walk(SRC_DIR)
  if (!files.length) {
    console.log('No source images found in', SRC_DIR)
    return
  }
  await ensureDir(OUT_DIR)
  console.log(`Optimizing ${files.length} images → ${path.relative(ROOT, OUT_DIR)}`)
  for (const f of files) await processOne(f)
  console.log('Done.')
}

main().catch(err => { console.error(err); process.exit(1) })

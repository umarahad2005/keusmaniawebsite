/* =========================================================
   Karwan-e-Usmania — one-off migration of public/images/
   into Cloudinary.

   Each file keeps its path as its public_id, so
   public/images/makkah/kaaba.jpg  ->  keu/makkah/kaaba

   Idempotent: re-running overwrites the same public_ids
   rather than creating duplicates.

     usage:  node scripts/migrate-images-to-cloudinary.js
             node scripts/migrate-images-to-cloudinary.js --dry
   ========================================================= */

import 'dotenv/config'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC_DIR = path.join(__dirname, '..', 'public', 'images')
const PREFIX  = 'keu'
const DRY     = process.argv.includes('--dry')

const cloud  = process.env.CLOUDINARY_CLOUD_NAME?.trim()
const key    = process.env.CLOUDINARY_API_KEY?.trim()
const secret = process.env.CLOUDINARY_API_SECRET?.trim()
if (!cloud || !key || !secret) {
  console.error('✗ CLOUDINARY_CLOUD_NAME / _API_KEY / _API_SECRET missing from .env')
  process.exit(1)
}
cloudinary.config({ cloud_name: cloud, api_key: key, api_secret: secret })

async function walk(dir) {
  const out = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...await walk(full))
    else if (/\.(jpe?g|png|webp|avif)$/i.test(entry.name)) out.push(full)
  }
  return out
}

const files = (await walk(SRC_DIR)).sort()
console.log(`${files.length} image(s) under public/images → cloud "${cloud}"\n`)

const mapping = {}
for (const file of files) {
  const rel = path.relative(SRC_DIR, file).replace(/\\/g, '/')
  const publicId = `${PREFIX}/${rel.replace(/\.[^.]+$/, '')}`

  if (DRY) {
    console.log(`  (dry) /images/${rel}  →  ${publicId}`)
    mapping[`/images/${rel}`] = publicId
    continue
  }

  const res = await cloudinary.uploader.upload(file, {
    public_id: publicId,
    overwrite: true,
    invalidate: true,
    resource_type: 'image',
  })
  mapping[`/images/${rel}`] = publicId
  console.log(`  ✓ ${rel.padEnd(38)} → ${publicId}  (${(res.bytes / 1024) | 0} KB, ${res.width}×${res.height})`)
}

console.log('\nMapping (old path → public_id):')
console.log(JSON.stringify(mapping, null, 2))

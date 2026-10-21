/* =========================================================
   Karwan e Usmania International — owner FAQ corrections (2026-10-21)

   Owner decisions (social launch review):
     - only the polio vaccination certificate is required (meningitis removed)
     - the documents answer no longer asks for an air-ticket copy (KEUI books flights too)
     - the Umrah season runs from Muharram to Shawwal (replaces the
       "November to February" sentence)

   Updates ONLY these three FAQ answers, matched by question, with $set on the
   `site` row and on a `faqs` row if one exists (rows are never deleted or replaced).

     usage:  node scripts/apply-owner-faq-2026-10-21.mjs           (preview only)
             node scripts/apply-owner-faq-2026-10-21.mjs --apply   (backup, then write)

   Backups go to docs/rebrand/backups/<type>-before-owner-faq-<timestamp>.json.
   Needs MONGODB_URI in .env. Rollback: write the backup's `data` back.
   ========================================================= */
import dns from 'node:dns'
import 'dotenv/config'
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mongoose from 'mongoose'

dns.setServers(['1.1.1.1', '8.8.8.8'])

const APPLY = process.argv.includes('--apply')
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BACKUPS = path.resolve(ROOT, '../docs/rebrand/backups')

const ANSWERS = [
  [/^Which documents do I need/i,
    'You will need: a passport valid for at least six months from your travel date; recent passport-size photographs with a white background; and your polio vaccination certificate. Our team handles the rest of the visa process for you and will confirm the current list when you book.'],
  [/^When is the best time for Umrah/i,
    'Umrah can be performed at any time of year except during the Hajj season: the Umrah season runs from Muharram to Shawwal. The last 10 nights of Ramadan are the most sought-after time, so ask us early about Ramadan dates.'],
  [/^Which vaccinations are required/i,
    'Pakistani travellers need a polio vaccination certificate for Umrah. We will tell you the current health requirements when you book.'],
]

await mongoose.connect(process.env.MONGODB_URI)
const col = mongoose.connection.db.collection('contents')

const plans = []
for (const type of ['site', 'faqs']) {
  const doc = await col.findOne({ type })
  if (!doc) { console.log(`(no ${type} row)`); continue }
  const list = type === 'site' ? doc.data?.faqs : doc.data
  const prefix = type === 'site' ? 'data.faqs' : 'data'
  if (!Array.isArray(list)) { console.log(`(${type} row has no FAQ list)`); continue }
  const set = {}, show = []
  list.forEach((f, i) => {
    const hit = ANSWERS.find(([re]) => re.test(f.q || ''))
    if (hit && f.a !== hit[1]) { set[`${prefix}.${i}.a`] = hit[1]; show.push([f.q, f.a, hit[1]]) }
  })
  if (show.length) plans.push({ doc, set, show })
}

for (const { doc, show } of plans) {
  console.log(`\n== ${doc.type} ==`)
  for (const [q, from, to] of show) console.log(`- ${q}\n    from: ${from}\n    to:   ${to}`)
}
if (!plans.length) console.log('Nothing to change.')

if (APPLY && plans.length) {
  mkdirSync(BACKUPS, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  for (const { doc, set } of plans) {
    const file = path.join(BACKUPS, `${doc.type}-before-owner-faq-${stamp}.json`)
    writeFileSync(file, JSON.stringify(doc, null, 2))
    console.log(`\nBackup: ${file}`)
    const r = await col.updateOne({ _id: doc._id }, { $set: { ...set, updatedAt: new Date() } })
    console.log(`${doc.type}: matched ${r.matchedCount}, modified ${r.modifiedCount}`)
  }
} else if (plans.length) {
  console.log('\nPreview only. Run with --apply to write.')
}
await mongoose.disconnect()

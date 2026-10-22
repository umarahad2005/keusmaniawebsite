/* =========================================================
   Karwan e Usmania International — Instagram handle change (owner, 2026-10-22)

   instagram.com/keusmania  ->  instagram.com/keusmania_international
   Updates ONLY the Instagram entry of `site.company.socials`, with $set (the row is never replaced).

     usage:  node scripts/apply-instagram-2026-10-22.mjs           (preview only)
             node scripts/apply-instagram-2026-10-22.mjs --apply   (backup, then write)

   Backups go to docs/rebrand/backups/site-before-instagram-<timestamp>.json.
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
const URL = 'https://www.instagram.com/keusmania_international'

await mongoose.connect(process.env.MONGODB_URI)
const col = mongoose.connection.db.collection('contents')
const doc = await col.findOne({ type: 'site' })
if (!doc) throw new Error('No site row found; nothing changed.')

const set = {}
;(doc.data?.company?.socials || []).forEach((s, i) => {
  if (/instagram/i.test(`${s.name} ${s.icon}`) && s.url !== URL) {
    set[`data.company.socials.${i}.url`] = URL
    console.log(`- company.socials.${i}.url\n    from: ${s.url}\n    to:   ${URL}`)
  }
})
if (!Object.keys(set).length) console.log('Nothing to change (no Instagram entry in the site row, or already updated).')

if (APPLY && Object.keys(set).length) {
  mkdirSync(BACKUPS, { recursive: true })
  const file = path.join(BACKUPS, `site-before-instagram-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(file, JSON.stringify(doc, null, 2))
  console.log(`\nBackup: ${file}`)
  const r = await col.updateOne({ _id: doc._id }, { $set: { ...set, updatedAt: new Date() } })
  console.log(`site: matched ${r.matchedCount}, modified ${r.modifiedCount}`)
} else if (Object.keys(set).length) {
  console.log('\nPreview only. Run with --apply to write.')
}
await mongoose.disconnect()

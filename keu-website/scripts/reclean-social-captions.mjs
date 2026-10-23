/* =========================================================
   Re-run cleanCaption() (api/_lib/social.js) over the posts already stored,
   after the cleanup rules change. The sync stops at the first post it already
   has, so stored posts keep the text they were saved with until this runs.

   Only `text` changes; the raw `caption`, images and flags are untouched.
   Manual posts are skipped: their text was typed in the admin.

     usage:  node scripts/reclean-social-captions.mjs           (preview only)
             node scripts/reclean-social-captions.mjs --apply   (write)

   Needs MONGODB_URI in .env. The next build (or any admin save) puts the new
   text on /updates.
   ========================================================= */
import dns from 'node:dns'
import 'dotenv/config'
import mongoose from 'mongoose'
import { cleanCaption } from '../api/_lib/social.js'

dns.setServers(['1.1.1.1', '8.8.8.8'])

const APPLY = process.argv.includes('--apply')

await mongoose.connect(process.env.MONGODB_URI)
const col = mongoose.connection.db.collection('socialposts')

const rows = await col.find({ source: { $ne: 'manual' }, caption: { $type: 'string' } }).toArray()
const changes = rows
  .map(r => ({ r, text: cleanCaption(r.caption) }))
  .filter(({ r, text }) => text !== (r.text || ''))

for (const { r, text } of changes) {
  console.log(`- ${r.source} ${r.igId || r.externalId || r._id}: ${String(r.text || '').length} → ${text.length} chars`)
}
console.log(`${changes.length} of ${rows.length} posts would change.`)

if (APPLY && changes.length) {
  const res = await col.bulkWrite(changes.map(({ r, text }) => ({
    updateOne: { filter: { _id: r._id }, update: { $set: { text, updatedAt: new Date() } } },
  })))
  console.log(`Updated ${res.modifiedCount}.`)
} else if (!APPLY) {
  console.log('Preview only. Run with --apply to write.')
}

await mongoose.disconnect()

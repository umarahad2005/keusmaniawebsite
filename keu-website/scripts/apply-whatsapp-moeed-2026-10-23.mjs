/* =========================================================
   Owner, 2026-10-23: the website's WhatsApp line is Moeed Usmani's
   +92 331 4950665 (923314950665) instead of +92 333 4883578.

   Updates ONLY, with $set on the `site` row:
     company.whatsapp            → '923314950665'
     faqs[*].a                   "+92 333 4883578" → "+92 331 4950665"
   The team members' own card numbers are left as they are.

     usage:  node scripts/apply-whatsapp-moeed-2026-10-23.mjs           (preview)
             node scripts/apply-whatsapp-moeed-2026-10-23.mjs --apply   (backup, then write)

   Backup: docs/rebrand/backups/site-before-whatsapp-moeed-<timestamp>.json
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
const OLD = /\+?92[\s-]?333[\s-]?488[\s-]?3578/g
const NEW_DISPLAY = '+92 331 4950665'
const NEW_DIGITS = '923314950665'

await mongoose.connect(process.env.MONGODB_URI)
const col = mongoose.connection.db.collection('contents')
const doc = await col.findOne({ type: 'site' })
if (!doc) throw new Error('No site row found; nothing changed.')
const d = doc.data, set = {}, show = []
const change = (key, from, to) => {
  if (from === to) return
  set[`data.${key}`] = to; show.push([key, from, to])
}

change('company.whatsapp', d.company?.whatsapp, NEW_DIGITS)
;(d.faqs || []).forEach((f, i) => change(`faqs.${i}.a`, f.a, String(f.a || '').replace(OLD, NEW_DISPLAY)))

for (const [k, from, to] of show) console.log(`- ${k}\n    from: ${JSON.stringify(from).slice(0, 160)}\n    to:   ${JSON.stringify(to).slice(0, 160)}`)
if (!show.length) console.log('Nothing to change.')

if (APPLY && show.length) {
  mkdirSync(BACKUPS, { recursive: true })
  const file = path.join(BACKUPS, `site-before-whatsapp-moeed-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(file, JSON.stringify(doc, null, 2))
  console.log(`Backup: ${file}`)
  const res = await col.updateOne({ _id: doc._id }, { $set: set })
  console.log(`site: matched ${res.matchedCount}, modified ${res.modifiedCount}`)
} else if (!APPLY) {
  console.log('\nPreview only. Run with --apply to write.')
}

await mongoose.disconnect()

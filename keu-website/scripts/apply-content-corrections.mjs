/* =========================================================
   Karwan e Usmania International — launch content corrections
   (DESIGN-LANGUAGE Phase 7 steps 1–2; text from docs/rebrand/content-corrections.md)

   Updates ONLY these fields of the live `site` row, with $set (the row is
   never deleted or replaced, so team, gallery, Qafila and every other edit
   stay as they are):
     company: name, tagline, founded, whatsapp, address.street,
              address.postalCode (cleared), landline, hours, Facebook and
              Instagram links (tracking parameters removed)
     testimonials: "Vick Pandaa - Waqas Saleem " → "Waqas Saleem";
              Zahid Rauf initials AK → ZR, location trimmed
     faqs:    replaced with the 9 corrected answers (same as src/data.js)
     team:    card details from the owner's printed cards merged in (photos
              kept, members without a card untouched, new members added)

     usage:  node scripts/apply-content-corrections.mjs           (preview only)
             node scripts/apply-content-corrections.mjs --apply   (backup, then write)
             add --only=team (or company, testimonials, faqs) to limit the run

   The backup goes to docs/rebrand/backups/site-before-launch-<timestamp>.json.
   Needs MONGODB_URI in .env. Rollback: write the backup's `data` back.
   ========================================================= */
import dns from 'node:dns'
import 'dotenv/config'
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import mongoose from 'mongoose'

// Some networks refuse the SRV lookup mongodb+srv needs; public resolvers work.
dns.setServers(['1.1.1.1', '8.8.8.8'])

const APPLY = process.argv.includes('--apply')
// --only=team,faqs,company,testimonials limits the run to those groups.
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean)
const wanted = group => !ONLY.length || ONLY.includes(group)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const { SITE } = await import(pathToFileURL(path.join(ROOT, 'src/data.js')).href)

await mongoose.connect(process.env.MONGODB_URI)
const col = mongoose.connection.db.collection('contents')
const doc = await col.findOne({ type: 'site' })
if (!doc) throw new Error('No site row found; nothing changed.')
const d = doc.data

const set = {}
const show = []
const change = (key, from, to) => {
  if (!wanted(key.split('.')[0])) return
  if (JSON.stringify(from) === JSON.stringify(to)) return
  set[`data.${key}`] = to
  show.push([key, from, to])
}

// ---- company ----
const c = d.company || {}
change('company.name', c.name, 'Karwan e Usmania International')
change('company.tagline', c.tagline, 'Your Journey to the Holy Land, Our Priority')
change('company.founded', c.founded, 2005)   // owner 2026-10-12 (was 2008)
change('company.whatsapp', c.whatsapp, '923334883578')
change('company.address.street', c.address?.street, 'Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town')
change('company.address.postalCode', c.address?.postalCode, '')
change('company.landline', c.landline, '+924235136177')
change('company.hours', c.hours, [
  { days: 'Mon – Fri', time: '11:00 am – 7:00 pm' },
  { days: 'Saturday', time: '11:00 am – 5:00 pm' },
])
if (Array.isArray(c.socials)) {
  const socials = c.socials.map(s => {
    if (/facebook/i.test(s.name || s.icon || '')) return { ...s, url: 'https://www.facebook.com/profile.php?id=61552498595314' }
    if (/instagram/i.test(s.name || s.icon || '')) return { ...s, url: 'https://www.instagram.com/keusmania' }
    return s
  })
  change('company.socials', c.socials, socials)
}

// ---- testimonials (labels only; quotes untouched) ----
;(d.testimonials || []).forEach((t, i) => {
  const name = String(t.name || '')
  if (/waqas saleem/i.test(name) && name.trim() !== 'Waqas Saleem') change(`testimonials.${i}.name`, t.name, 'Waqas Saleem')
  if (/zahid rauf/i.test(name)) {
    if (t.initials !== 'ZR') change(`testimonials.${i}.initials`, t.initials, 'ZR')
    if (t.location && t.location !== t.location.trim()) change(`testimonials.${i}.location`, t.location, t.location.trim())
  }
})

// ---- FAQs ----
change('faqs', d.faqs, SITE.faqs)

// ---- Team (owner's printed cards, 2026-10-11) ----
// Members with card details in src/data.js are matched to the live list by a
// distinctive word of their name; their card fields are filled in and the live
// photo is kept. Unmatched card members are added at the end. Live members
// without a card (e.g. Logistics, Graphics) stay exactly as they are.
const CARD_KEYS = ['name', 'role', 'nameAr', 'roleAr', 'phone', 'whatsapp', 'email']
const words = n => String(n || '').toLowerCase().replace(/ahmad/g, 'ahmed').split(/[^a-z]+/).filter(w => w.length > 3 && !['usmani', 'ahmed', 'muhammad'].includes(w))
if (Array.isArray(d.team)) {
  const merged = d.team.map(m => ({ ...m }))
  for (const card of (SITE.team || []).filter(m => m.phone)) {
    const keys = words(card.name)
    const i = merged.findIndex(m => words(m.name).some(w => keys.includes(w)))
    const fields = Object.fromEntries(CARD_KEYS.map(k => [k, card[k] || '']))
    if (i >= 0) merged[i] = { ...merged[i], ...fields, photo: merged[i].photo || card.photo || '' }
    else merged.push({ ...fields, photo: card.photo || '' })
  }
  change('team', d.team, merged)
}

// ---- report ----
const full = process.argv.includes('--full')
const brief = v => full ? JSON.stringify(v, null, 1) : (typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v)?.slice(0, 160) + (JSON.stringify(v)?.length > 160 ? '…' : ''))
console.log(show.length ? `${show.length} field(s) to change:\n` : 'Nothing to change; the live content already matches.')
show.forEach(([k, a, b]) => console.log(`• ${k}\n    now: ${brief(a)}\n    new: ${brief(b)}\n`))

if (!APPLY) {
  console.log('Preview only. Run again with --apply to back up and write these changes.')
} else if (show.length) {
  const dir = path.join(ROOT, '..', 'docs', 'rebrand', 'backups')
  mkdirSync(dir, { recursive: true })
  const file = path.join(dir, `site-before-launch-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(file, JSON.stringify(doc, null, 2))
  console.log('Backup written:', path.relative(process.cwd(), file))
  const r = await col.updateOne({ _id: doc._id }, { $set: set })
  console.log(`Updated: ${r.modifiedCount} row (fields: ${Object.keys(set).length}).`)
}
await mongoose.disconnect()

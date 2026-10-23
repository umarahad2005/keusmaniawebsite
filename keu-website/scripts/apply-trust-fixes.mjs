/* =========================================================
   Karwan e Usmania International — trust fixes from the 13 Oct SEO/AEO/GEO report
   (docs/seo/SEO-AEO-GEO-REPORT-2026-10-13.md §4.3)

   Updates ONLY these fields, with $set (rows are never deleted or replaced):
     site:     about.story[0] "Hajj and Umrah" → "Umrah"
               videoReviews: Ms. Fareeha's caption was a copy of Mr. Haseeb's →
                 a neutral description (not a made-up quote) until the owner
                 supplies her own words
               testimonials: the "VIP package" one is removed (written quotes
                 are only the fallback while video reviews are shown)
               stats: "100% Visa Success Rate" → "24/7 On-ground Support"
               services[0].sublabel "100% approval rate" → "Handled end to end"
               FAQ "visa processing" drops the 100% claim; FAQ "distance" no longer says the
                 distance is on the card
     packages: numeric prices match the labels, the landline "Call/WhatsApp …
               Website …" line is removed, "BUGDET PACKAGE" → "Budget Package",
               a bare "86000" price label → "PKR 86,000" (nights untouched)

     usage:  node scripts/apply-trust-fixes.mjs           (preview only)
             node scripts/apply-trust-fixes.mjs --apply   (backup, then write)

   Backups go to docs/rebrand/backups/<type>-before-trust-fixes-<timestamp>.json.
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

await mongoose.connect(process.env.MONGODB_URI)
const col = mongoose.connection.db.collection('contents')

const plans = []
const plan = (doc, set, show) => { if (Object.keys(set).length) plans.push({ doc, set, show }) }

// ---------- site ----------
{
  const doc = await col.findOne({ type: 'site' })
  if (!doc) throw new Error('No site row found; nothing changed.')
  const d = doc.data, set = {}, show = []
  const change = (key, from, to) => {
    if (JSON.stringify(from) === JSON.stringify(to)) return
    set[`data.${key}`] = to; show.push([key, from, to])
  }

  const story = d.about?.story || []
  if (story[0]) change('about.story.0', story[0], story[0].replace(/Hajj and Umrah/g, 'Umrah'))

  ;(d.videoReviews || []).forEach((v, i) => {
    const dup = (d.videoReviews || []).findIndex(w => w.caption && w.caption === v.caption)
    if (dup !== -1 && dup !== i && /fareeha/i.test(v.name || '')) {
      change(`videoReviews.${i}.caption`, v.caption,
        'Ms. Fareeha from Karachi shares her Umrah experience with Karwan e Usmania (in Urdu).')
    }
  })

  const tests = d.testimonials || []
  const kept = tests.filter(t => !/\bVIP\b/i.test(`${t.quote} ${t.trip}`))
  if (kept.length !== tests.length) change('testimonials', tests, kept)

  ;(d.stats || []).forEach((s, i) => {
    if (Number(s.value) === 100 && s.suffix === '%') {
      change(`stats.${i}`, s, { value: 24, suffix: '/7', label: 'On-ground Support', icon: s.icon || 'check' })
    }
  })

  ;(d.services || []).forEach((s, i) => {
    if (/100%/.test(s.sublabel || '')) change(`services.${i}.sublabel`, s.sublabel, 'Handled end to end')
  })

  ;(d.faqs || []).forEach((f, i) => {
    let a = f.a
    if (/100% approval/i.test(a)) a = a.replace(/,? and we have a 100% approval rate/i, '')
    // The documents answer is left alone: the owner set it to polio only (no
    // meningitis) on 2026-10-21, which this script's old checklist would undo.
    if (/listed on each package card/i.test(a)) {
      a = a.replace(/The distance depends on the package and is listed on each package card\./i,
        'The distance depends on the package; ask us on WhatsApp and we will tell you the walking distance for each hotel.')
    }
    change(`faqs.${i}.a`, f.a, a)
  })

  plan(doc, set, show)
}

// ---------- packages ----------
{
  const doc = await col.findOne({ type: 'packages' })
  const list = Array.isArray(doc?.data) ? doc.data : null
  if (list) {
    const set = {}, show = []
    list.forEach((p, i) => {
      const change = (key, from, to) => {
        if (JSON.stringify(from) === JSON.stringify(to)) return
        set[`data.${i}.${key}`] = to; show.push([`${p.name} · ${key}`, from, to])
      }
      const s = p.summary || ''
      change('summary', s, s.replace(/\s*Book Your Journey:\s*Call\/WhatsApp:\s*\+?\d+\s*Website:\s*\S+\s*/i, '  ').replace(/\s{3,}/g, '  ').trim())
      // Nights are left as entered: the owner confirmed 21 for the Rabi ul Awal
      // package (2026-10-23), although its summary lists 14 + 6.
      if (/^bugdet package$/i.test(String(p.name || '').trim())) change('name', p.name, 'Budget Package')
      if (/^\d+$/.test(String(p.priceLabel || '').trim())) {
        change('priceLabel', p.priceLabel, `PKR ${Number(p.priceLabel).toLocaleString('en-US')}`)
      }
      const label = Number(String(p.priceLabel || '').replace(/[^\d]/g, ''))
      if (label >= 1000) change('price', p.price, label)
    })
    plan(doc, set, show)
  }
}

for (const { doc, show } of plans) {
  console.log(`\n== ${doc.type} ==`)
  for (const [k, from, to] of show) {
    console.log(`- ${k}\n    from: ${JSON.stringify(from).slice(0, 220)}\n    to:   ${JSON.stringify(to).slice(0, 220)}`)
  }
}
if (!plans.length) console.log('Nothing to change.')

if (APPLY && plans.length) {
  mkdirSync(BACKUPS, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  for (const { doc, set } of plans) {
    const file = path.join(BACKUPS, `${doc.type}-before-trust-fixes-${stamp}.json`)
    writeFileSync(file, JSON.stringify(doc, null, 2))
    console.log(`\nBackup: ${file}`)
    const r = await col.updateOne({ _id: doc._id }, { $set: { ...set, updatedAt: new Date() } })
    console.log(`${doc.type}: matched ${r.matchedCount}, modified ${r.modifiedCount}`)
  }
} else if (plans.length) {
  console.log('\nPreview only. Run with --apply to write.')
}
await mongoose.disconnect()

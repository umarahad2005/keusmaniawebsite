/* =========================================================
   Karwan e Usmania International — import the designed social posts into the
   /updates feed as manual posts, each appearing on the day it is scheduled.

   Reads the two approved batches in ../social:
     2026-10-21-launch        schedule.md (dates, files), captions.md (§1–3) and
                              each carousel's caption.md (English + Urdu, alt text)
     2026-10-28-urdu-30-days  schedule.md (dates, times, export/day-NN.png),
                              _build/captions.json (caption per content-plan day,
                              the same text as captions.md) and _build/plan.json
                              (theme and photo, for the alt text)
   For each post: uploads its PNG(s) to Cloudinary as keu/social/<key>[-n]
   (never overwriting), cleans the caption the way the Instagram sync does (no
   contact footer, no hashtags) and inserts a SocialPost with publishAt = the
   scheduled time in Pakistan (UTC+5), so it only shows on/after that time.
   Re-running is safe: a post whose importKey exists is skipped.

     usage:  node scripts/import-social-exports.mjs              dry run: prints the plan, touches nothing
             node scripts/import-social-exports.mjs --apply      uploads and inserts (needs .env:
                                                                 MONGODB_URI, CLOUDINARY_*)
             --only=launch | --only=urdu30                       one batch
             --dir=<path to the social folder>                   default ../social

   When a post is later synced from Instagram too, hide one of the two copies in
   admin → Social feed (the sync cannot tell they are the same post).
   ========================================================= */
import 'dotenv/config'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cleanCaption } from '../api/_lib/social.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const arg = (name) => process.argv.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')
const APPLY = process.argv.includes('--apply')
const ONLY = arg('only')
const SOCIAL = path.resolve(arg('dir') || path.join(ROOT, '..', 'social'))

const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 }

/* "Thu 22 Oct" + "8:00 pm" (Pakistan time) → Date. */
function pkt(year, dayText, timeText) {
  const d = String(dayText).match(/(\d{1,2})\s+([A-Za-z]{3})/)
  const t = String(timeText).match(/(\d{1,2}):(\d{2})\s*(am|pm)/i)
  if (!d || !t) throw new Error(`cannot read the date "${dayText}" / "${timeText}"`)
  let h = Number(t[1]) % 12
  if (/pm/i.test(t[3])) h += 12
  return new Date(Date.UTC(year, MONTHS[d[2].toLowerCase()], Number(d[1]), h - 5, Number(t[2])))
}

const read = (...p) => readFileSync(path.join(...p), 'utf8').replace(/\r\n?/g, '\n')
const cells = (line) => line.split('|').slice(1, -1).map(c => c.trim())
const tableRows = (md) => md.split('\n').filter(l => /^\|\s*\d+\s*\|/.test(l)).map(cells)
const ticks = (s) => [...String(s).matchAll(/`([^`]+)`/g)].map(m => m[1])

/* The lines under a "## <heading>" until the next "## ". */
function section(md, heading) {
  const lines = md.split('\n')
  const i = lines.findIndex(l => l.startsWith('## ') && l.toLowerCase().includes(heading.toLowerCase()))
  if (i < 0) return ''
  const end = lines.findIndex((l, n) => n > i && l.startsWith('## '))
  return lines.slice(i + 1, end < 0 ? undefined : end).join('\n').trim()
}

/* "1. text\n2. text" → ['text', 'text']. */
const numbered = (s) => String(s).split('\n').map(l => l.match(/^\d+\.\s+(.*)$/)?.[1]).filter(Boolean)

/* ---------- Launch batch ---------- */

function launchPosts() {
  const dir = path.join(SOCIAL, '2026-10-21-launch')
  const year = 2026
  const singles = read(dir, 'captions.md')
  const posts = []
  for (const [n, when, title, , , files, captionRef] of tableRows(read(dir, 'schedule.md'))) {
    const [day, time] = when.split(',')
    const feedFiles = ticks(files).filter(f => !/9x16/i.test(f)) // the story copy is not a feed post
    let images = []
    for (const f of feedFiles) {
      // "04-guide-first-umrah/export/slide-01…07.png": every slide in that folder, in order.
      if (/…|\.\.\./.test(f)) {
        const folder = path.join(dir, path.dirname(f))
        images.push(...readdirSync(folder).filter(x => /^slide-\d+\.png$/.test(x)).sort().map(x => path.join(folder, x)))
      } else images.push(path.join(dir, f))
    }

    let text = '', alts = []
    const ref = ticks(captionRef)[0] || ''
    if (ref === 'captions.md') {
      const num = captionRef.match(/§\s*(\d+)/)?.[1]
      const block = section(singles, `${num} ·`)
      text = block.match(/\*\*English\*\*\n([\s\S]*?)(?:\n\*\*|$)/)?.[1] || ''
      alts = [block.match(/\*\*Alt text\*\*\s*(.*)/)?.[1] || '']
    } else {
      const md = read(dir, ref)
      text = [section(md, 'Caption — English'), section(md, 'Caption — Urdu')].filter(Boolean).join('\n\n')
      alts = numbered(section(md, 'Alt text'))
    }
    const slug = feedFiles[0].split('/')[0] // e.g. 01-introduction
    posts.push({
      importKey: `launch-2026-10-21/${slug}`,
      name: `launch-${slug}`,
      title,
      files: images,
      alts: images.map((_, i) => alts[i] || ''),
      caption: text,
      publishAt: pkt(year, day, time),
      order: Number(n),
    })
  }
  return posts
}

/* ---------- 30-day Urdu series ---------- */

function urduPosts() {
  const dir = path.join(SOCIAL, '2026-10-28-urdu-30-days')
  const year = 2026
  const captions = JSON.parse(read(dir, '_build', 'captions.json'))
  const plan = JSON.parse(read(dir, '_build', 'plan.json'))
  const posts = []
  for (const [n, date, image, title, time] of tableRows(read(dir, 'schedule.md'))) {
    const file = ticks(image)[0]
    const day = Number(file.match(/day-(\d+)/)?.[1])
    const p = plan.find(x => x.day === day) || {}
    const photo = String(p.image || '').replace(/,\s*(wide|close|tight).*$/i, '')
    const alt = [`${p.type || 'Post'}: ${p.theme || title}`, 'Arabic text with Urdu and English translation', photo && `over a photo of ${photo.charAt(0).toLowerCase()}${photo.slice(1)}`]
      .filter(Boolean).join(', ') + '.'
    posts.push({
      importKey: `urdu-30-2026/day-${String(day).padStart(2, '0')}`,
      name: `urdu30-day-${String(day).padStart(2, '0')}`,
      title,
      files: [path.join(dir, file)],
      alts: [alt],
      caption: captions[String(day)] || '',
      publishAt: pkt(year, date, time),
      order: Number(n),
    })
  }
  return posts
}

/* ---------- Run ---------- */

const posts = [
  ...(!ONLY || ONLY === 'launch' ? launchPosts() : []),
  ...(!ONLY || ONLY === 'urdu30' ? urduPosts() : []),
].sort((a, b) => a.publishAt - b.publishAt)

const missing = posts.flatMap(p => p.files.filter(f => !existsSync(f)))
if (missing.length) {
  console.error(`✗ missing files:\n  ${missing.join('\n  ')}`)
  process.exit(1)
}

const PK = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Karachi' })
console.log(`${posts.length} post(s) from ${SOCIAL}${APPLY ? '' : '  (dry run: nothing is uploaded or saved; add --apply)'}\n`)
for (const p of posts) {
  const text = cleanCaption(p.caption)
  console.log(`  ${PK.format(p.publishAt).padEnd(24)} ${p.importKey.padEnd(40)} ${String(p.files.length).padStart(2)} img  ${text.split('\n')[0].slice(0, 60)}`)
  if (!text) console.log('      ! no caption text')
  if (p.alts.some(a => !a)) console.log('      ! an image has no alt text')
}

if (!APPLY) process.exit(0)

const { connectDB, SocialPost } = await import('../api/_lib/db.js')
const { mirrorImage } = await import('../api/_lib/social.js')
const mongoose = (await import('mongoose')).default
await connectDB()
let added = 0, skipped = 0
for (const p of posts) {
  if (await SocialPost.exists({ importKey: p.importKey })) { skipped++; continue }
  const images = []
  for (let i = 0; i < p.files.length; i++) {
    images.push({ ...(await mirrorImage(p.files[i], i ? `${p.name}-${i + 1}` : p.name)), alt: p.alts[i] || '' })
  }
  await SocialPost.create({
    source: 'manual',
    importKey: p.importKey,
    mediaType: images.length > 1 ? 'CAROUSEL_ALBUM' : 'IMAGE',
    images,
    caption: p.caption,
    text: cleanCaption(p.caption),
    postedAt: p.publishAt,
    publishAt: p.publishAt,
  })
  added++
  console.log(`  ✓ ${p.importKey}`)
}
await mongoose.disconnect()
console.log(`\n✓ ${added} added, ${skipped} already there. Posts appear on /updates from their scheduled time; the daily sync rebuilds the page as they come due.`)

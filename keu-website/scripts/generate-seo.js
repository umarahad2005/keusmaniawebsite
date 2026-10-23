/* =========================================================
   Karwan e Usmania International — SEO file generator (post-build)
   Writes dist/sitemap.xml, dist/robots.txt, dist/llms.txt, dist/llms-full.txt
   from the live /api/content when reachable (team, company facts, Qafila,
   FAQs), else from the src/data.js defaults.
   Run via npm scripts as a postbuild step.
   ========================================================= */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const ROOT       = path.resolve(__dirname, '..')
const DIST       = path.join(ROOT, 'dist')

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://usmania.vercel.app').replace(/\/+$/, '')
const TODAY    = new Date().toISOString().split('T')[0]

// Code defaults from src/data.js; the live content overrides them key by key,
// the same merge SiteContext does in the browser.
const dataMod  = await import(pathToFileURL(path.join(ROOT, 'src/data.js')).href)
const DEFAULTS = dataMod.SITE     || {}
const GUIDES   = dataMod.GUIDES   || []

// The admin edits content in the database, so read it with a read-only GET;
// fall back to the data.js defaults when the API is unreachable (offline
// build, first deploy). The X-Content-Updated header ("site=<ISO>, packages=<ISO>",
// api/content) dates the sitemap entries; without it they carry the build date.
const parseUpdated = (h) => Object.fromEntries(String(h || '').split(',')
  .map(kv => kv.trim().split('='))
  .filter(([k, v]) => k && v && !Number.isNaN(Date.parse(v)))
  .map(([k, v]) => [k, new Date(v).toISOString().split('T')[0]]))

async function loadSite() {
  try {
    // Cache-busted: the API is edge-cached (s-maxage=60, stale-while-revalidate=600), so a build
    // right after an admin edit could otherwise bake in stale content.
    const res = await fetch(`${SITE_URL}/api/content?build=${Date.now()}`, { signal: AbortSignal.timeout(8000), headers: { 'Cache-Control': 'no-cache' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const updated = parseUpdated(res.headers.get('x-content-updated'))
    const live = (await res.json())?.site
    if (live && typeof live === 'object') return { site: { ...DEFAULTS, ...live }, from: 'live API', updated }
    throw new Error('no site in response')
  } catch (err) {
    console.warn(`! content from data.js defaults (${err.message})`)
    return { site: DEFAULTS, from: 'data.js', updated: {} }
  }
}
const { site: SITE, from: siteFrom, updated: UPDATED } = await loadSite()

// /updates goes in sitemap.xml and llms.txt only once it has posts (the
// pre-render marks an empty feed noindex). Read-only GET of the public feed:
// ?limit=1 returns the pinned posts plus the newest one, so the newest date
// among them is the page's lastmod. null when there are none or it fails.
async function loadUpdatesDay() {
  try {
    const res = await fetch(`${SITE_URL}/api/social?limit=1&build=${Date.now()}`, { signal: AbortSignal.timeout(8000), headers: { 'Cache-Control': 'no-cache' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const posts = (await res.json())?.posts
    if (!Array.isArray(posts) || !posts.length) return null
    return posts.map(p => String(p.date || '').split('T')[0]).filter(Boolean).sort().pop() || TODAY
  } catch (err) {
    console.warn(`! /updates left out of sitemap.xml and llms.txt (social feed: ${err.message})`)
    return null
  }
}
const UPDATES_DAY = await loadUpdatesDay()

// lastmod: pages built from the site content use its updatedAt, Home and
// /packages the newer of the packages and site rows, guides their "Last
// reviewed" date. Dates are YYYY-MM-DD, so the string sort is the date sort.
const newest = (...d) => d.filter(Boolean).sort().pop() || TODAY
const SITE_DAY = newest(UPDATED.site)
const PACKAGES_DAY = newest(UPDATED.packages, UPDATED.site)

// Same rule as slugify/memberSlug in src/lib/team.js (copied: that module
// pulls in browser-only imports).
const slugify = (s = '') => String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'member'
const memberSlug = (m) => slugify(m?.slug || m?.name)

// ---------- sitemap.xml ----------
const STATIC_ROUTES = [
  { path: '/',         priority: '1.0', changefreq: 'weekly',  lastmod: PACKAGES_DAY },
  { path: '/packages', priority: '0.9', changefreq: 'weekly',  lastmod: PACKAGES_DAY },
  { path: '/faq',      priority: '0.8', changefreq: 'monthly', lastmod: SITE_DAY },
  { path: '/guides',   priority: '0.7', changefreq: 'monthly', lastmod: newest(...GUIDES.map(g => g.reviewed)) },
  ...GUIDES.map(g => ({ path: `/guides/${g.slug}`, priority: '0.7', changefreq: 'monthly', lastmod: g.reviewed || TODAY })),
  { path: '/about',    priority: '0.7', changefreq: 'monthly', lastmod: SITE_DAY },
  { path: '/gallery',  priority: '0.6', changefreq: 'monthly', lastmod: SITE_DAY },
  { path: '/contact',  priority: '0.7', changefreq: 'monthly', lastmod: SITE_DAY },
  ...(UPDATES_DAY ? [{ path: '/updates', priority: '0.5', changefreq: 'weekly', lastmod: UPDATES_DAY }] : []),
]

const team = Array.isArray(SITE.team) && SITE.team.length ? SITE.team : (DEFAULTS.team || [])
const TEAM_ROUTES = [...new Set(team.filter(m => m && m.name).map(memberSlug))]
  .map(slug => ({ path: `/team/${slug}`, priority: '0.4', changefreq: 'monthly', lastmod: SITE_DAY }))
const ROUTES = [...STATIC_ROUTES, ...TEAM_ROUTES]

const urlEntries = ROUTES.map(r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${r.lastmod || TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')

// Package anchors (/packages#id) are not listed: fragments are not indexed as
// separate pages, and the live package ids live in the database, not data.js.

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

// ---------- robots.txt ----------
// A crawler obeys only the most specific group naming it, so every named group
// repeats the Disallow rules; AI crawlers are named to make the allow explicit.
const DISALLOW = ['/admin', '/api']
const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended',
]
const group = (agent) => [`User-agent: ${agent}`, 'Allow: /', ...DISALLOW.map(d => `Disallow: ${d}`)].join('\n')

const robots = `# Karwan e Usmania International — robots.txt
${group('*')}

# AI / LLM crawlers — explicitly allowed (with rate guidance via llms.txt)
${AI_AGENTS.map(group).join('\n\n')}

Sitemap: ${SITE_URL}/sitemap.xml
`

// ---------- llms.txt ----------
// Emerging convention (https://llmstxt.org): a markdown summary for AI
// crawlers. Facts only from the owner's data (DESIGN-LANGUAGE §6): no prices
// (they change in the admin), no reply-time promise, Umrah only. Years come
// from company.founded and the pilgrim count from the stats row, so llms.txt
// moves with the site instead of hard-coding numbers.
const c = SITE.company || {}
const founded = Number(c.founded) || 2005
const years = new Date().getFullYear() - founded
const pilgrims = (SITE.stats || []).find(s => /pilgrim/i.test(String(s?.label || '')))
const pilgrimsText = pilgrims ? ` and ${Number(pilgrims.value).toLocaleString('en-US')}${pilgrims.suffix || ''} pilgrims served` : ''
const q = SITE.qafila || {}
const leader = [q.leader || 'Pirzada Burhan uddin Ahmed Usmani Sahib', q.leaderTitle ? `(${q.leaderTitle})` : ''].filter(Boolean).join(' ')
const hours = (c.hours || []).map(h => `${h.days} ${h.time}`).join(' · ')
const address = [c.address?.street, c.address?.city || 'Lahore', c.address?.country || 'Pakistan'].filter(Boolean).join(', ')
// Digits only, then one '+' for display: the admin may store '+923334883578'
// or '923334883578' (the old `+${c.whatsapp}` printed '++92…'), and wa.me
// wants the digits with no '+'.
const digits = (n) => String(n || '').replace(/\D/g, '')
const waDigits = digits(c.whatsapp || c.phone) || '923334883578'
const landline = digits(c.landline) || '924235136177'

const llms = `# Karwan e Usmania International · Travel & Tours

> Umrah travel operator based in Johar Town, Lahore, Pakistan, serving pilgrims since ${founded}. Every cost is explained in writing before you commit; visa processing is handled by the team; trusted partners in Makkah and Madinah handle hotels, transport and ziyarah. WhatsApp-first booking.

## About

Karwan e Usmania International is a Lahore-based Umrah operator founded in ${founded}, with ${years}+ years of experience${pilgrimsText}. It works with established Saudi partners on the ground in Makkah and Madinah. It currently offers Umrah only.

- Office: ${address}
- Landline: +${landline}
- WhatsApp: +${waDigits}
- Email: ${c.email || ''}
- Hours (Pakistan time): ${hours}${/sun/i.test(hours) ? '' : ' · Sunday closed'}

## Services

Visa processing, flights, hotels near the Haram, transport, Urdu-speaking guides, food and ziyarah, with support throughout the journey. What each package includes is listed on its card.

## Packages

Current Umrah packages and their prices: ${SITE_URL}/packages

## Qafila e Shoq

A spiritual journey programme led by ${leader}. Built on four pillars: Ibadah (worship), Riyazat (spiritual discipline), Tarbiyat (development) and Siyahat (sacred travel). Limited seats, by application only.

## Booking

The main booking channel is WhatsApp: https://wa.me/${waDigits}. Phone, email and a contact form (${SITE_URL}/contact) are also available.

## Questions and guides

- All questions and answers, by topic: ${SITE_URL}/faq
${UPDATES_DAY ? `- Latest posts (Quran verses and hadith with Urdu translation, Umrah guidance): ${SITE_URL}/updates\n` : ''}${GUIDES.map(g => `- ${g.title}: ${SITE_URL}/guides/${g.slug}`).join('\n')}

## Sources

- Site: ${SITE_URL}
- Sitemap: ${SITE_URL}/sitemap.xml
- Full text with FAQs and guides: ${SITE_URL}/llms-full.txt
`

// ---------- llms-full.txt ----------
// The same summary plus the owner-approved FAQ answers and the guides, in full.
// A guide's live blocks (packages table, office) are pointed to, not copied:
// prices change in the admin.
// Answers with a claim the site must not make ("100% approval rate") are left
// out until the owner fixes them in admin → FAQs (same rule as faqPageSchema).
const faqs = (SITE.faqs || []).filter(f => f && f.q && f.a && !/100\s*%/.test(`${f.q} ${f.a}`))
const guideText = (g) => [
  `### ${g.title}`,
  `${SITE_URL}/guides/${g.slug} · ${g.approved ? 'Last reviewed' : 'Updated'} ${g.reviewed}`,
  g.answer,
  ...g.sections.map(s => [
    `#### ${s.h}`,
    ...(s.p || []),
    (s.list || []).map(li => `- ${li}`).join('\n'),
    s.block === 'packages-table' ? `Current packages and prices: ${SITE_URL}/packages` : '',
    s.block === 'office' ? `Office: ${address}. Hours (Pakistan time): ${hours}.` : '',
  ].filter(Boolean).join('\n\n')),
].join('\n\n')
const llmsFull = [
  llms,
  faqs.length ? `## Frequently asked questions\n\n${faqs.map(f => `### ${String(f.q).trim()}\n\n${String(f.a).trim()}\n`).join('\n')}` : '',
  GUIDES.length ? `## Guides\n\n${GUIDES.map(guideText).join('\n\n')}\n` : '',
].filter(Boolean).join('\n')

// ---------- Write ----------
async function write() {
  await fs.mkdir(DIST, { recursive: true })
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8')
  await fs.writeFile(path.join(DIST, 'robots.txt'),  robots,  'utf8')
  await fs.writeFile(path.join(DIST, 'llms.txt'),    llms,    'utf8')
  await fs.writeFile(path.join(DIST, 'llms-full.txt'), llmsFull, 'utf8')
  console.log(`✓ sitemap.xml (${ROUTES.length} URLs, ${TEAM_ROUTES.length} team cards; content from ${siteFrom})`)
  console.log(`✓ robots.txt`)
  console.log(`✓ llms.txt   (${llms.split('\n').length} lines)`)
  console.log(`✓ llms-full.txt (${faqs.length} FAQs, ${GUIDES.length} guides)`)
}

write().catch(err => { console.error(err); process.exit(1) })

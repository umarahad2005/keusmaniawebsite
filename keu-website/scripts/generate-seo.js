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

// The admin edits content in the database, so read it with a read-only GET;
// fall back to the data.js defaults when the API is unreachable (offline
// build, first deploy).
async function loadSite() {
  try {
    // Cache-busted: the API is edge-cached (s-maxage=60, stale-while-revalidate=600), so a build
    // right after an admin edit could otherwise bake in stale content.
    const res = await fetch(`${SITE_URL}/api/content?build=${Date.now()}`, { signal: AbortSignal.timeout(8000), headers: { 'Cache-Control': 'no-cache' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const live = (await res.json())?.site
    if (live && typeof live === 'object') return { site: { ...DEFAULTS, ...live }, from: 'live API' }
    throw new Error('no site in response')
  } catch (err) {
    console.warn(`! content from data.js defaults (${err.message})`)
    return { site: DEFAULTS, from: 'data.js' }
  }
}
const { site: SITE, from: siteFrom } = await loadSite()

// Same rule as slugify/memberSlug in src/lib/team.js (copied: that module
// pulls in browser-only imports).
const slugify = (s = '') => String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'member'
const memberSlug = (m) => slugify(m?.slug || m?.name)

// ---------- sitemap.xml ----------
const STATIC_ROUTES = [
  { path: '/',         priority: '1.0', changefreq: 'weekly'  },
  { path: '/packages', priority: '0.9', changefreq: 'weekly'  },
  { path: '/about',    priority: '0.7', changefreq: 'monthly' },
  { path: '/gallery',  priority: '0.6', changefreq: 'monthly' },
  { path: '/contact',  priority: '0.7', changefreq: 'monthly' },
]

const team = Array.isArray(SITE.team) && SITE.team.length ? SITE.team : (DEFAULTS.team || [])
const TEAM_ROUTES = [...new Set(team.filter(m => m && m.name).map(memberSlug))]
  .map(slug => ({ path: `/team/${slug}`, priority: '0.4', changefreq: 'monthly' }))
const ROUTES = [...STATIC_ROUTES, ...TEAM_ROUTES]

const urlEntries = ROUTES.map(r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${TODAY}</lastmod>
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

const llms = `# Karwan e Usmania International · Travel & Tours

> Umrah travel operator based in Johar Town, Lahore, Pakistan, serving pilgrims since ${founded}. Every cost is explained in writing before you commit; visa processing is handled by the team; trusted partners in Makkah and Madinah handle hotels, transport and ziyarah. WhatsApp-first booking.

## About

Karwan e Usmania International is a Lahore-based Umrah operator founded in ${founded}, with ${years}+ years of experience${pilgrimsText}. It works with established Saudi partners on the ground in Makkah and Madinah. It currently offers Umrah only.

- Office: ${address}
- Landline: ${c.landline || '+924235136177'}
- WhatsApp: +${c.whatsapp || ''}
- Email: ${c.email || ''}
- Hours (Pakistan time): ${hours}${/sun/i.test(hours) ? '' : ' · Sunday closed'}

## Services

Visa processing, flights, hotels near the Haram, transport, Urdu-speaking guides, food and ziyarah, with support throughout the journey. What each package includes is listed on its card.

## Packages

Current Umrah packages and their prices: ${SITE_URL}/packages

## Qafila e Shoq

A spiritual journey programme led by ${leader}. Built on four pillars: Ibadah (worship), Riyazat (spiritual discipline), Tarbiyat (development) and Siyahat (sacred travel). Limited seats, by application only.

## Booking

The main booking channel is WhatsApp: https://wa.me/${c.whatsapp || ''}. Phone, email and a contact form (${SITE_URL}/contact) are also available.

## Sources

- Site: ${SITE_URL}
- Sitemap: ${SITE_URL}/sitemap.xml
- Full text with FAQs: ${SITE_URL}/llms-full.txt
`

// ---------- llms-full.txt ----------
// The same summary plus the owner-approved FAQ answers, in full.
const faqs = (SITE.faqs || []).filter(f => f && f.q && f.a)
const llmsFull = faqs.length
  ? `${llms}\n## Frequently asked questions\n\n${faqs.map(f => `### ${String(f.q).trim()}\n\n${String(f.a).trim()}\n`).join('\n')}`
  : llms

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
  console.log(`✓ llms-full.txt (${faqs.length} FAQs)`)
}

write().catch(err => { console.error(err); process.exit(1) })

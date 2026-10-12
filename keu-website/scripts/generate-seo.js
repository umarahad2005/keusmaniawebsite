/* =========================================================
   Karwan e Usmania International — SEO file generator (post-build)
   Writes dist/sitemap.xml, dist/robots.txt, dist/llms.txt
   from src/data.js. Run via npm scripts as a postbuild step.
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

// Company facts come from the code defaults in src/data.js.
const dataMod  = await import(pathToFileURL(path.join(ROOT, 'src/data.js')).href)
const SITE     = dataMod.SITE     || {}

// ---------- sitemap.xml ----------
const STATIC_ROUTES = [
  { path: '/',         priority: '1.0', changefreq: 'weekly'  },
  { path: '/packages', priority: '0.9', changefreq: 'weekly'  },
  { path: '/about',    priority: '0.7', changefreq: 'monthly' },
  { path: '/gallery',  priority: '0.6', changefreq: 'monthly' },
  { path: '/contact',  priority: '0.7', changefreq: 'monthly' },
]

const urlEntries = STATIC_ROUTES.map(r => `  <url>
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
const robots = `# Karwan e Usmania International — robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# AI / LLM crawlers — explicitly allowed (with rate guidance via llms.txt)
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

// ---------- llms.txt ----------
// Emerging convention (https://llmstxt.org): a markdown summary for AI
// crawlers. Facts only from the owner's data (DESIGN-LANGUAGE §6): no prices
// (they change in the admin), no reply-time promise, Umrah only.
const c = SITE.company || {}
const hours = (c.hours || []).map(h => `${h.days} ${h.time}`).join(' · ')
const address = [c.address?.street, c.address?.city || 'Lahore', c.address?.country || 'Pakistan'].filter(Boolean).join(', ')

const llms = `# Karwan e Usmania International · Travel & Tours

> Umrah travel operator based in Johar Town, Lahore, Pakistan, serving pilgrims since 2005. Every cost is explained in writing before you commit; visa processing is handled by the team; trusted partners in Makkah and Madinah handle hotels, transport and ziyarah. WhatsApp-first booking.

## About

Karwan e Usmania International is a Lahore-based Umrah operator founded in 2005, with 21+ years of experience and 25,000+ pilgrims served. It works with established Saudi partners on the ground in Makkah and Madinah. It currently offers Umrah only.

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

A spiritual journey programme led by Pirzada Burhan uddin Ahmed Usmani Sahib (Islamic Scholar). Built on four pillars: Ibadah (worship), Riyazat (spiritual discipline), Tarbiyat (development) and Siyahat (sacred travel). Limited seats, by application only.

## Booking

The main booking channel is WhatsApp: https://wa.me/${c.whatsapp || ''}. Phone, email and a contact form (${SITE_URL}/contact) are also available.

## Sources

- Site: ${SITE_URL}
- Sitemap: ${SITE_URL}/sitemap.xml
`

// ---------- Write ----------
async function write() {
  await fs.mkdir(DIST, { recursive: true })
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8')
  await fs.writeFile(path.join(DIST, 'robots.txt'),  robots,  'utf8')
  await fs.writeFile(path.join(DIST, 'llms.txt'),    llms,    'utf8')
  console.log(`✓ sitemap.xml (${STATIC_ROUTES.length} URLs)`)
  console.log(`✓ robots.txt`)
  console.log(`✓ llms.txt   (${llms.split('\n').length} lines)`)
}

write().catch(err => { console.error(err); process.exit(1) })

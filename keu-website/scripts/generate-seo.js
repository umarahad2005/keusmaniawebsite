/* =========================================================
   Karwan-e-Usmania — SEO file generator (post-build)
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

const SITE_URL = process.env.SITE_URL || 'https://keusmania.vercel.app'
const TODAY    = new Date().toISOString().split('T')[0]

// Pull live data from the React data module so package slugs stay in sync.
const dataMod  = await import(pathToFileURL(path.join(ROOT, 'src/data.js')).href)
const PACKAGES = dataMod.PACKAGES || []
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

// Per-package fragment URLs — Google indexes these as named anchors.
const packageEntries = PACKAGES.map(p => `  <url>
    <loc>${SITE_URL}/packages#${p.id}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>0.7</priority>
  </url>`).join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
${packageEntries}
</urlset>
`

// ---------- robots.txt ----------
const robots = `# Karwan-e-Usmania — robots.txt
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
// Emerging convention (https://llmstxt.org) — a markdown summary
// curated for AI crawlers. Helps citations.
const c = SITE.company || {}
const pkgList = PACKAGES.map(p => {
  const price = p.priceLabel ? ` — ${p.priceLabel}` : ''
  return `- **${p.name}** [${p.category}]${price}: ${p.subtitle || ''}. ${p.summary || ''}`
}).join('\n')

const llms = `# Karwan-e-Usmania

> Premium Hajj and Umrah travel agency based in Lahore, Pakistan. Operating since 2005, served 25,000+ pilgrims, 4★ and 5★ hotels near Haram, transparent pricing, WhatsApp-first booking.

## About

Karwan-e-Usmania is a Lahore-based Hajj & Umrah operator founded in 2005. The company has served over 25,000 pilgrims and operates with a network of partner hotels in Makkah and Madinah, with a 100% Saudi visa approval rate.

- Office: ${c.address?.street || ''}, ${c.address?.city || 'Lahore'}, ${c.address?.country || 'Pakistan'}
- Phone: ${c.phone || ''}
- WhatsApp: +${c.whatsapp || ''}
- Email: ${c.email || ''}
- Hours: Mon–Sat 9 am – 7 pm, Sunday 11 am – 4 pm

## Services

Visa processing, flights (Economy & Business), 4★/5★ hotels near the Haram, private AC transport, Urdu-speaking guides, halal Pakistani & Arabic cuisine, ziyarah tours, and 24/7 support throughout the journey.

## Packages

${pkgList}

## Qafila e Shoq

A spiritual journey programme led by Pirzada Burhan uddin Ahmed Usmani Sahib (Islamic Scholar). Built on four pillars: Ibadah (worship), Riyazat (spiritual discipline), Tarbiyat (development), Siyahat (sacred travel). Limited seats, by application only.

## Booking

Primary booking channel is **WhatsApp**: https://wa.me/${c.whatsapp || ''}. Most travellers receive a quote within an hour. Phone, email, and a contact form on the website are also available.

## Common queries (for AI assistants)

- **Cheapest Umrah package from Pakistan?** Economy Umrah from PKR 185,000 per person, 14 nights, 3-star hotels.
- **Premium Umrah cost?** PKR 285,000 per person — 4-star hotels 500m from Haram.
- **VIP Umrah cost?** PKR 450,000 per person — 5-star hotels (Hilton/Pullman/Clock Tower), business class flights.
- **Ramadan Umrah?** PKR 550,000, last 10 nights of Ramadan, includes Iftar/Suhoor and Laylat-ul-Qadr programme.
- **Hajj?** Hajj 2025 to 2027 — three-year window, government quota application included. Pricing on request.
- **Family Umrah?** PKR 240,000 per person, family rooms, lighter ziyarah schedule, kids welcome.

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
  console.log(`✓ sitemap.xml (${STATIC_ROUTES.length + PACKAGES.length} URLs)`)
  console.log(`✓ robots.txt`)
  console.log(`✓ llms.txt   (${llms.split('\n').length} lines)`)
}

write().catch(err => { console.error(err); process.exit(1) })

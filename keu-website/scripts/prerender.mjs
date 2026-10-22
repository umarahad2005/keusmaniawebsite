/* =========================================================
   Karwan e Usmania International — build-time pre-render

   Runs after `vite build` and `vite build --ssr src/entry-server.jsx`.
   Renders every public route (src/entry-server.jsx) with the live content and
   writes real HTML per page, so crawlers that never run JavaScript (ChatGPT,
   Claude, Perplexity, WhatsApp/Facebook previews, Bing's first pass) get the
   page's own text, title, canonical, social card and structured data.

     dist/index.html, packages.html, about.html, gallery.html, contact.html,
     dist/team/<slug>.html     served at clean URLs ("cleanUrls" in vercel.json)
     dist/404.html             Vercel serves it with a real 404 status
     dist/app.html             the empty shell, for /admin (never pre-rendered)

   Each page also carries the content it was built with (window.__KEU_CONTENT__)
   so the browser's first render matches it; the app then re-reads /api/content
   and shows anything edited since. Admin saves trigger a rebuild through
   VERCEL_DEPLOY_HOOK_URL (api/content) so the static pages catch up.

   Content: a read-only GET of ${SITE_URL}/api/content; if that fails the
   bundled defaults (src/data.js) are used and the build still succeeds.
   ========================================================= */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

process.env.NODE_ENV = 'production'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const SSR_DIR = path.join(ROOT, 'dist-ssr')
const SITE_URL = (process.env.SITE_URL || 'https://usmania.vercel.app').replace(/\/+$/, '')

const { render, publicRoutes } = await import(pathToFileURL(path.join(SSR_DIR, 'entry-server.js')).href)

async function loadContent() {
  try {
    // Cache-busted: the API is edge-cached (s-maxage=60, stale-while-revalidate=600), so a build
    // right after an admin edit could otherwise bake in stale content.
    const res = await fetch(`${SITE_URL}/api/content?build=${Date.now()}`, { signal: AbortSignal.timeout(10000), headers: { 'Cache-Control': 'no-cache' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn(`! prerender: live content unavailable (${e.message}); using bundled defaults`)
    return null
  }
}

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// JSON inside <script>: never let the text close the tag.
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029)
const safeJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c').split(LS).join('\\u2028').split(PS).join('\\u2029')

/* Set a <meta>/<link> attribute in the template, or add the tag if it's missing. */
function setTag(html, { match, tag }) {
  return match.test(html) ? html.replace(match, tag) : html.replace('</head>', `  ${tag}\n</head>`)
}

function applyHead(html, head) {
  if (!head) return html
  const t = (re, tag) => { html = setTag(html, { match: re, tag }) }
  if (head.title) {
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(head.title)}</title>`)
    t(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(head.title)}" />`)
    t(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(head.title)}" />`)
  }
  if (head.description) {
    t(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(head.description)}" />`)
    t(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(head.description)}" />`)
    t(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(head.description)}" />`)
  }
  if (head.canonical) {
    t(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(head.canonical)}" />`)
    t(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${esc(head.canonical)}" />`)
  }
  if (head.keywords) t(/<meta name="keywords"[^>]*>/, `<meta name="keywords" content="${esc(head.keywords)}" />`)
  if (head.ogImage) {
    t(/<meta property="og:image" [^>]*>/, `<meta property="og:image" content="${esc(head.ogImage)}" />`)
    t(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${esc(head.ogImage)}" />`)
  }
  if (head.ogType) t(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${esc(head.ogType)}" />`)
  if (head.noindex) html = html.replace('</head>', '  <meta name="robots" content="noindex" />\n</head>')
  return html
}

/* JSON-LD: a block whose @id matches the static data-ld-id tag replaces its
   text (one node per @id, as JsonLd.jsx does in the browser); the rest are
   added, marked data-prerender so main.jsx removes them before the app adds
   its own live copies. */
function applyLd(html, items) {
  const extra = []
  for (const item of items) {
    const id = item && item['@id']
    const re = id && new RegExp(`(<script type="application/ld\\+json" data-ld-id="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">)[\\s\\S]*?(</script>)`)
    if (re && re.test(html)) html = html.replace(re, (_, open, close) => `${open}${safeJson(item)}${close}`)
    else extra.push(`  <script type="application/ld+json" data-prerender>${safeJson(item)}</script>`)
  }
  return extra.length ? html.replace('</head>', `${extra.join('\n')}\n</head>`) : html
}

function page(template, url, content) {
  const { html: body, head, ld } = render(url, content)
  let html = applyHead(template, head)
  html = applyLd(html, ld)
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  if (content) {
    html = html.replace(/(<script type="module")/, `<script>window.__KEU_CONTENT__=${safeJson(content)}</script>\n  $1`)
  }
  return html
}

const fileFor = (url) => url === '/' ? 'index.html' : `${url.replace(/^\/+/, '')}.html`

const template = readFileSync(path.join(DIST, 'index.html'), 'utf8')
writeFileSync(path.join(DIST, 'app.html'), template)

const content = await loadContent()
const routes = publicRoutes(content)
for (const url of routes) {
  const file = path.join(DIST, fileFor(url))
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, page(template, url, content))
}
writeFileSync(path.join(DIST, '404.html'), page(template, '/404', content))

rmSync(SSR_DIR, { recursive: true, force: true })
console.log(`✓ prerender: ${routes.length} pages + 404.html + app.html (${content ? 'live content' : 'bundled defaults'})`)

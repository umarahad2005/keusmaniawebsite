/* =========================================================
   Karwan e Usmania International — IndexNow ping (last build step)

   Tells Bing, Yandex and the other IndexNow engines (https://www.indexnow.org)
   that the pages in dist/sitemap.xml that are new or have a new lastmod since
   the live sitemap may have changed, so they recrawl soon
   instead of on their own schedule. Runs at the end of `npm run build`: Vercel
   puts the deployment live as soon as the build finishes, and the engines
   queue the URLs and fetch them later, so in practice they read the new build.

   Only on production deploys (VERCEL_ENV=production), which includes the
   rebuild an admin save starts through the deploy hook; local builds and
   preview deploys never ping. It fails soft: any error is logged and the build
   still succeeds.

   The key is public by design: the engines verify it by fetching
   /<KEY>.txt (public/), which must contain the key itself.
   ========================================================= */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://usmania.vercel.app').replace(/\/+$/, '')
export const KEY = 'ec5d6a865f01cb8f05b9f4fca6022912'

/* sitemap.xml → Map of <loc> → <lastmod> ('' when it has none). */
const entries = (xml) => new Map(String(xml).split('<url>').slice(1)
  .map(u => [u.match(/<loc>([^<]+)<\/loc>/)?.[1].trim(), u.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1].trim() || ''])
  .filter(([loc]) => loc))

/* The sitemap the live site serves now, or null (read-only GET). */
async function liveSitemap() {
  try {
    const res = await fetch(`${SITE_URL}/sitemap.xml?build=${Date.now()}`, { signal: AbortSignal.timeout(8000), headers: { 'Cache-Control': 'no-cache' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return entries(await res.text())
  } catch (err) {
    console.warn(`! indexnow: live sitemap unavailable (${err.message}); submitting every URL`)
    return null
  }
}

async function ping() {
  if (process.env.VERCEL_ENV !== 'production') {
    console.log(`- indexnow: skipped (VERCEL_ENV=${process.env.VERCEL_ENV || 'unset'})`)
    return
  }
  const built = entries(readFileSync(path.join(ROOT, 'dist', 'sitemap.xml'), 'utf8'))
  if (!built.size) { console.warn('! indexnow: no URLs in sitemap.xml'); return }
  // Only the URLs that are new or whose lastmod moved since the live sitemap
  // (still the previous deploy while this build runs), so the rebuilds that
  // admin saves start do not resubmit the same list each time. When the live
  // sitemap cannot be read, everything is submitted.
  const live = await liveSitemap()
  const urlList = [...built].filter(([loc, lastmod]) => !live || live.get(loc) !== lastmod).map(([loc]) => loc)
  if (!urlList.length) { console.log('- indexnow: skipped (no URL is new or has a new lastmod)'); return }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE_URL).host, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList }),
    signal: AbortSignal.timeout(8000),
  })
  // 200 OK and 202 Accepted (key not yet verified) are both fine.
  if (res.ok) console.log(`✓ indexnow: ${urlList.length} URLs submitted (HTTP ${res.status})`)
  else console.warn(`! indexnow: HTTP ${res.status} ${(await res.text().catch(() => '')).slice(0, 200)}`)
}

ping().catch(err => console.warn(`! indexnow: ${err?.message || err} (build continues)`))

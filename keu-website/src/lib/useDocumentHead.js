import { useEffect } from 'react'
import { cldUrl } from './images.js'
import { SITE_URL } from './brand.js'
import { IS_SSR, collector } from './ssr.js'

// Social crawlers want a fixed 1.91:1 card, hence the explicit crop.
function absoluteOg(ogImage) {
  const resolved = cldUrl(ogImage, { w: 1200, h: 630 })
  return resolved.startsWith('http') ? resolved : SITE_URL + resolved
}

/**
 * Per-route SEO + social meta updater. Updates <title>, description,
 * canonical, OG (title/description/image/type/url), Twitter card,
 * and keywords on route change. `noindex` adds <meta name="robots"
 * content="noindex">; every other page removes it again (each public page
 * calls this hook, so leaving the 404 always clears it).
 *
 * At build time (scripts/prerender.mjs) the same values are recorded and
 * written into each page's static HTML, so crawlers that don't run JS
 * (AI assistants, WhatsApp/Facebook previews) see the right head too.
 * The last call during a render wins, as it does in the browser.
 */
export function useDocumentHead({
  title,
  description,
  canonical,
  keywords,
  ogImage,
  ogType = 'website',
  noindex = false,
}) {
  if (IS_SSR && collector()) {
    collector().head = {
      title, description, canonical, keywords, ogType, noindex,
      ogImage: ogImage ? absoluteOg(ogImage) : null,
    }
  }

  useEffect(() => {
    if (title) document.title = title

    const setMeta = (selector, attr, value) => {
      const el = document.querySelector(selector)
      if (el && value != null) el.setAttribute(attr, value)
    }

    const ensureMeta = (attrName, attrValue) => {
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrValue)
        document.head.appendChild(el)
      }
      return el
    }

    if (description) {
      setMeta('meta[name="description"]', 'content', description)
      setMeta('meta[property="og:description"]', 'content', description)
      ensureMeta('name', 'twitter:description').setAttribute('content', description)
    }
    if (title) {
      setMeta('meta[property="og:title"]', 'content', title)
      ensureMeta('name', 'twitter:title').setAttribute('content', title)
    }
    if (canonical) {
      setMeta('link[rel="canonical"]', 'href', canonical)
      setMeta('meta[property="og:url"]', 'content', canonical)
    }
    if (keywords) {
      ensureMeta('name', 'keywords').setAttribute('content', keywords)
    }
    if (ogImage) {
      /* ogImage may be a Cloudinary public_id, a full URL, or a /public path.
         cldUrl resolves the first two; the third still needs the origin prefix. */
      const absolute = absoluteOg(ogImage)
      setMeta('meta[property="og:image"]', 'content', absolute)
      ensureMeta('name', 'twitter:image').setAttribute('content', absolute)
    }
    setMeta('meta[property="og:type"]', 'content', ogType)
    if (noindex) ensureMeta('name', 'robots').setAttribute('content', 'noindex')
    else document.querySelector('meta[name="robots"]')?.remove()
  }, [title, description, canonical, keywords, ogImage, ogType, noindex])
}

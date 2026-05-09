import { useEffect } from 'react'

const SITE_URL = 'https://keusmania.vercel.app'

/**
 * Per-route SEO + social meta updater. Updates <title>, description,
 * canonical, OG (title/description/image/type/url), Twitter card,
 * and keywords on route change.
 *
 * Note: SPAs only update <head> client-side. Google + Bing render JS
 * so this works for them. For Twitter/Facebook crawlers (which don't
 * run JS), the static defaults in index.html are what they see.
 * Pre-rendering (react-snap or Vercel's static optimization) is a
 * future option if first-paint social cards become important.
 */
export function useDocumentHead({
  title,
  description,
  canonical,
  keywords,
  ogImage,
  ogType = 'website',
}) {
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
      const absolute = ogImage.startsWith('http') ? ogImage : SITE_URL + ogImage
      setMeta('meta[property="og:image"]', 'content', absolute)
      ensureMeta('name', 'twitter:image').setAttribute('content', absolute)
    }
    setMeta('meta[property="og:type"]', 'content', ogType)
  }, [title, description, canonical, keywords, ogImage, ogType])
}

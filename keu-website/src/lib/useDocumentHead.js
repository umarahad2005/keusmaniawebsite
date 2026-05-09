import { useEffect } from 'react'

/**
 * Lightweight per-page SEO meta updater (no react-helmet dependency).
 * Updates <title>, <meta name="description">, OG title/description,
 * and <link rel="canonical"> when route changes.
 */
export function useDocumentHead({ title, description, canonical }) {
  useEffect(() => {
    if (title) document.title = title

    const set = (selector, attr, value) => {
      const el = document.querySelector(selector)
      if (el && value != null) el.setAttribute(attr, value)
    }

    if (description) {
      set('meta[name="description"]', 'content', description)
      set('meta[property="og:description"]', 'content', description)
    }
    if (title) set('meta[property="og:title"]', 'content', title)
    if (canonical) set('link[rel="canonical"]', 'href', canonical)
  }, [title, description, canonical])
}

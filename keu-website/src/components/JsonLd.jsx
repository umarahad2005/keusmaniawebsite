import { useEffect, useId } from 'react'

/**
 * Inject a JSON-LD structured-data block into <head> on mount,
 * remove on unmount. Accepts a single object or an array of objects
 * (each rendered in its own script tag).
 *
 * Usage:
 *   <JsonLd data={{ "@context":"https://schema.org", "@type":"FAQPage", ... }} />
 */
export default function JsonLd({ data }) {
  const id = useId().replace(/:/g, '_')

  useEffect(() => {
    const items = Array.isArray(data) ? data : [data]
    const nodes = items.map((item, i) => {
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.dataset.jsonld = `${id}_${i}`
      el.textContent = JSON.stringify(item)
      document.head.appendChild(el)
      return el
    })
    return () => nodes.forEach(n => n.remove())
  }, [data, id])

  return null
}

/* Inject JSON-LD structured-data blocks into <head> on mount, remove them on
   unmount. Accepts a single object or an array (one script tag each).

   One node per @id: index.html ships a static block for crawlers that never run
   JS, marked data-ld-id="<its @id>" (the organization). When an item carries the
   same @id, that static block is rewritten in place with the live data instead
   of adding a second node, and its original text is put back on unmount. So a
   page always has exactly one node with that @id, with or without JS.

   Usage:
     <JsonLd data={{ "@context":"https://schema.org", "@type":"FAQPage", ... }} /> */
import { useEffect, useId } from 'react'

const staticFor = (ldId) =>
  ldId ? [...document.querySelectorAll('script[type="application/ld+json"][data-ld-id]')].find(s => s.dataset.ldId === ldId) : null

export default function JsonLd({ data }) {
  const id = useId().replace(/:/g, '_')

  useEffect(() => {
    const items = Array.isArray(data) ? data : [data]
    const undo = items.map((item, i) => {
      const text = JSON.stringify(item)
      const host = staticFor(item && item['@id'])
      if (host) {
        const before = host.textContent
        host.textContent = text
        return () => { host.textContent = before }
      }
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.dataset.jsonld = `${id}_${i}`
      el.textContent = text
      document.head.appendChild(el)
      return () => el.remove()
    })
    return () => undo.forEach(fn => fn())
  }, [data, id])

  return null
}

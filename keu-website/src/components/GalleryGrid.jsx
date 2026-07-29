import { useState, useEffect } from 'react'
import { useSite } from '../lib/SiteContext.jsx'
import Img from './Img.jsx'

export default function GalleryGrid() {
  const { site } = useSite()
  const [open, setOpen] = useState(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', !!open)
  }, [open])

  return (
    <>
      <div className="gallery-grid">
        {site.gallery.map((img, i) => {
          const cls = img.size === 'tall' ? 'gallery-item gallery-item--tall'
                    : img.size === 'wide' ? 'gallery-item gallery-item--wide'
                    : 'gallery-item'
          return (
            <figure
              key={i}
              className={cls}
              onClick={() => setOpen(img)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setOpen(img) }}
            >
              <Img
                src={img.src}
                alt={img.alt}
                widths={[400, 600, 900, 1200]}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="gallery-item__caption">{img.alt}</figcaption>
            </figure>
          )
        })}
      </div>

      {open && (
        <div className="modal-overlay" data-open="true" onClick={() => setOpen(null)}>
          <div
            className="modal"
            style={{ maxWidth: 'min(960px,95vw)', padding: 0, background: 'transparent', boxShadow: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal__close"
              aria-label="Close"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', width: 44, height: 44 }}
              onClick={() => setOpen(null)}
            >×</button>
            <Img
              src={open.src}
              alt={open.alt}
              widths={[768, 1200, 1600]}
              sizes="min(960px, 95vw)"
              style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
            />
            <p style={{ textAlign: 'center', color: 'white', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
              {open.alt}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

/* Gallery masonry and lightbox (DESIGN-LANGUAGE §4 Gallery and lightbox).
   Masonry on a 12-column grid: `wide` spans 8, `tall` spans two rows; two
   columns on phones. Each image sits in a hairline frame with its alt text as
   the caption. The first six open with T3, the rest with Block.
   Lightbox: green-950 at .96, 350 ms crossfades, arrows, 48 px close, swipe,
   Esc and a focus trap; focus returns to the opening tile. */
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSite } from '../lib/SiteContext.jsx'
import { Icon } from '../icons.jsx'
import Img from './Img.jsx'

function Lightbox({ items, index, onIndex, onClose }) {
  const box = useRef(null)
  const closeBtn = useRef(null)
  const touch = useRef(null)
  const item = items[index]
  const count = items.length
  const go = useCallback((d) => onIndex((index + d + count) % count), [index, count, onIndex])

  useEffect(() => {
    const prev = document.activeElement
    closeBtn.current?.focus()
    // Rendered in a portal on <body>, so the whole page behind it can be inert.
    const outside = [document.getElementById('main-content'), document.getElementById('site-footer'), document.querySelector('.site-nav')].filter(Boolean)
    outside.forEach(el => { el.inert = true })
    window.__lenis?.stop()
    document.documentElement.classList.add('no-scroll')
    return () => {
      outside.forEach(el => { el.inert = false })
      window.__lenis?.start()
      document.documentElement.classList.remove('no-scroll')
      prev?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key === 'ArrowRight') { go(1); return }
      if (e.key === 'ArrowLeft') { go(-1); return }
      if (e.key !== 'Tab') return
      const items = box.current.querySelectorAll('button')
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go, onClose])

  const onTouchStart = (e) => { touch.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touch.current == null) return
    const dx = e.changedTouches[0].clientX - touch.current
    touch.current = null
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1)
  }

  return createPortal(
    <div
      className="glight"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      ref={box}
      onClick={(e) => { if (e.target === box.current) onClose() }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button className="glight__close" type="button" onClick={onClose} ref={closeBtn} aria-label="Close photo viewer">
        <Icon name="close" className="k-ico" />
      </button>
      <figure className="glight__figure" key={index}>
        <Img src={item.src} alt={item.alt || ''} widths={[768, 1200, 1600]} sizes="min(1200px, 92vw)" decoding="async" />
        <figcaption className="glight__caption">
          <span>{item.alt}</span>
          <span className="glight__count" aria-live="polite">{index + 1} / {count}</span>
        </figcaption>
      </figure>
      {count > 1 && (
        <>
          <button className="glight__nav glight__nav--prev" type="button" onClick={() => go(-1)} aria-label="Previous photo">
            <Icon name="arrowRight" className="k-ico" />
          </button>
          <button className="glight__nav glight__nav--next" type="button" onClick={() => go(1)} aria-label="Next photo">
            <Icon name="arrowRight" className="k-ico" />
          </button>
        </>
      )}
    </div>,
    document.body,
  )
}

export default function GalleryGrid() {
  const { site } = useSite()
  const items = (site.gallery || []).filter(g => g && g.src)
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <>
      <ul className="gallery" role="list">
        {items.map((img, i) => (
          <li key={i} className={`gallery__item${img.size === 'wide' ? ' gallery__item--wide' : ''}${img.size === 'tall' ? ' gallery__item--tall' : ''}`}>
            <figure className="gallery__figure">
              <button
                type="button"
                className="gallery__frame"
                data-reveal={i < 6 ? 't3' : 'block'}
                onClick={() => setOpen(i)}
                aria-label={`Open photo: ${img.alt || `photo ${i + 1}`}`}
              >
                <Img
                  src={img.src}
                  alt=""
                  widths={[400, 600, 900, 1200]}
                  sizes={img.size === 'wide' ? '(max-width: 767px) 100vw, 66vw' : '(max-width: 767px) 50vw, 33vw'}
                  loading="lazy"
                  decoding="async"
                />
              </button>
              {img.alt && <figcaption className="gallery__caption">{img.alt}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
      {open != null && items[open] && <Lightbox items={items} index={open} onIndex={setOpen} onClose={close} />}
    </>
  )
}

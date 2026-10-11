/* Video reviews from pilgrims (DESIGN-LANGUAGE §9), uploaded in
   /admin/video-reviews. Only reviews with consent and "Show on website" appear.
   Poster cards (3 on desktop, 2 on phones, then "Show more"); nothing downloads
   until a visitor taps play. The player is a green lightbox with native
   controls; sound is allowed because playback is user-initiated. */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSite } from '../lib/SiteContext.jsx'
import { reviewPosterUrl, reviewVideoUrl, formatDuration } from '../lib/videos.js'

const LANG = { ur: 'Urdu', pa: 'Punjabi', en: 'English', ar: 'Arabic', other: '' }

function Player({ review, onClose }) {
  const dialog = useRef(null)
  const closeBtn = useRef(null)
  const [src, setSrc] = useState(reviewVideoUrl(review.publicId) || review.src)

  useEffect(() => {
    const prev = document.activeElement
    closeBtn.current?.focus()
    // Rendered in a portal on <body>, so the whole page behind it can be inert.
    const others = [document.getElementById('main-content'), document.getElementById('site-footer'), document.querySelector('.site-nav')].filter(Boolean)
    others.forEach(el => { el.inert = true })
    window.__lenis?.stop()
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const items = dialog.current.querySelectorAll('button, video, a[href]')
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      others.forEach(el => { el.inert = false })
      window.__lenis?.start()
      prev?.focus?.()
    }
  }, [onClose])

  return createPortal(
    <div className="reviews__lightbox" role="dialog" aria-modal="true" aria-label={`Video review from ${review.name || 'a pilgrim'}`} ref={dialog} onClick={(e) => { if (e.target === dialog.current) onClose() }}>
      <div className="reviews__player">
        <button className="reviews__close" type="button" onClick={onClose} ref={closeBtn} aria-label="Close video">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <video
          key={src}
          src={src}
          poster={reviewPosterUrl(review.publicId)}
          controls
          autoPlay
          playsInline
          onError={() => { if (src !== review.src && review.src) setSrc(review.src) }}
          onPlay={() => window.dispatchEvent(new CustomEvent('keu:media-play'))}
          onPause={() => window.dispatchEvent(new CustomEvent('keu:media-end'))}
          style={review.width && review.height ? { aspectRatio: `${review.width} / ${review.height}` } : undefined}
        />
        <div className="reviews__caption">
          <p className="reviews__name">{review.name}{review.location ? `, ${review.location}` : ''}</p>
          {review.caption && <p className="reviews__text">{review.caption}</p>}
          <p className="reviews__meta">{[review.trip, LANG[review.language]].filter(Boolean).join(' · ')}</p>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function VideoReviews() {
  const { site } = useSite()
  const list = (site.videoReviews || []).filter(v => v && v.show && v.consent && (v.publicId || v.src))
  const [open, setOpen] = useState(null)
  const [all, setAll] = useState(false)
  if (!list.length) return null

  return (
    <div className="reviews" aria-labelledby="reviews-title">
      <h3 className="reviews__title" id="reviews-title">Video reviews</h3>
      <ul className={`reviews__grid${all ? ' is-all' : ''}`} role="list">
        {list.map((v, i) => (
          <li key={v.id || i} className={`reviews__item${i >= 3 ? ' reviews__item--extra' : ''}${i >= 2 ? ' reviews__item--extra-phone' : ''}`} data-reveal="t2">
            <button className="reviews__card" type="button" onClick={() => setOpen(v)} aria-label={`Play video review from ${v.name || 'a pilgrim'}${v.duration ? `, ${formatDuration(v.duration)}` : ''}`}>
              <span className="reviews__poster">
                <img src={reviewPosterUrl(v.publicId)} alt="" loading="lazy" decoding="async" />
                <span className="reviews__play" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3v10l8-5z" /></svg>
                </span>
                {v.duration > 0 && <span className="reviews__duration">{formatDuration(v.duration)}</span>}
              </span>
              <span className="reviews__info">
                <span className="reviews__name">{v.name}</span>
                <span className="reviews__meta">{[v.location, v.trip].filter(Boolean).join(' · ')}</span>
                {LANG[v.language] && <span className="reviews__lang">{LANG[v.language]}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {list.length > 2 && !all && (
        <button className={`k-link reviews__more${list.length > 3 ? '' : ' reviews__more--phone'}`} type="button" onClick={() => setAll(true)}>
          Show more videos <span aria-hidden="true">↓</span>
        </button>
      )}
      {open && <Player review={open} onClose={() => setOpen(null)} />}
    </div>
  )
}

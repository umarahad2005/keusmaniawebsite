/* Video reviews from pilgrims (DESIGN-LANGUAGE §9), uploaded in
   /admin/video-reviews. Only reviews with consent and "Show on website" appear.

   Owner request (2026-10-11): these replace the written testimonials and play
   right on the page. Each card shows its poster until tapped, then plays in
   place with native controls and sound (the visitor started it). Only one
   plays at a time; starting one pauses the background sound
   ('keu:media-play'). Nothing downloads until a visitor taps play.
   Cards keep the clip's own shape (phone videos are usually portrait). */
import { useEffect, useRef, useState } from 'react'
import { useSite } from '../lib/SiteContext.jsx'
import { reviewPosterUrl, reviewVideoUrl, formatDuration } from '../lib/videos.js'

const LANG = { ur: 'Urdu', pa: 'Punjabi', en: 'English', ar: 'Arabic', other: '' }

export function useVideoReviews() {
  const { site } = useSite()
  return (site.videoReviews || []).filter(v => v && v.show && v.consent && (v.publicId || v.src))
}

function ReviewCard({ v, active, onPlay, onStop, extraClass }) {
  const video = useRef(null)
  const [src, setSrc] = useState(() => reviewVideoUrl(v.publicId) || v.src)
  const ratio = v.width && v.height ? `${v.width} / ${v.height}` : '9 / 16'
  const label = `video review from ${v.name || 'a pilgrim'}${v.duration ? `, ${formatDuration(v.duration)}` : ''}`

  // Another card started: stop this one.
  useEffect(() => { if (!active) video.current?.pause() }, [active])

  return (
    <li className={`reviews__item${extraClass}`} data-reveal="t2">
      <figure className="reviews__card">
        <div className="reviews__poster" style={{ aspectRatio: ratio }}>
          {active ? (
            <video
              ref={video}
              key={src}
              src={src}
              poster={reviewPosterUrl(v.publicId)}
              controls
              autoPlay
              playsInline
              preload="auto"
              aria-label={`Playing ${label}`}
              onError={() => { if (src !== v.src && v.src) setSrc(v.src) }}
              onPlay={() => window.dispatchEvent(new CustomEvent('keu:media-play'))}
              onPause={() => window.dispatchEvent(new CustomEvent('keu:media-end'))}
              onEnded={onStop}
            />
          ) : (
            <button className="reviews__start" type="button" onClick={onPlay} aria-label={`Play ${label}`}>
              {v.publicId
                ? <img src={reviewPosterUrl(v.publicId)} alt="" loading="lazy" decoding="async" />
                : <video src={`${v.src}#t=1`} preload="metadata" muted playsInline aria-hidden="true" tabIndex={-1} />}
              <span className="reviews__play" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3v10l8-5z" /></svg>
              </span>
              {v.duration > 0 && <span className="reviews__duration">{formatDuration(v.duration)}</span>}
            </button>
          )}
        </div>
        <figcaption className="reviews__info">
          <span className="reviews__name">{v.name}</span>
          <span className="reviews__meta">{[v.location, v.trip].filter(Boolean).join(' · ')}</span>
          {v.caption && <span className="reviews__caption-text">{v.caption}</span>}
          {LANG[v.language] && <span className="reviews__lang">{LANG[v.language]}</span>}
        </figcaption>
      </figure>
    </li>
  )
}

export default function VideoReviews({ title = null }) {
  const list = useVideoReviews()
  const [playing, setPlaying] = useState(null)
  const [all, setAll] = useState(false)
  if (!list.length) return null

  return (
    <div className="reviews">
      {title && <h3 className="reviews__title">{title}</h3>}
      <ul className={`reviews__grid${all ? ' is-all' : ''}`} role="list">
        {list.map((v, i) => {
          const id = v.id || v.publicId || i
          return (
            <ReviewCard
              key={id}
              v={v}
              active={playing === id}
              onPlay={() => setPlaying(id)}
              onStop={() => setPlaying(p => (p === id ? null : p))}
              extraClass={`${i >= 8 ? ' reviews__item--extra' : ''}${i >= 4 ? ' reviews__item--extra-phone' : ''}`}
            />
          )
        })}
      </ul>
      {list.length > 4 && !all && (
        <button className={`k-link reviews__more${list.length > 8 ? '' : ' reviews__more--phone'}`} type="button" onClick={() => setAll(true)}>
          Show more videos <span aria-hidden="true">↓</span>
        </button>
      )}
    </div>
  )
}

/* Voices from our pilgrims (DESIGN-LANGUAGE §4 Testimonials, §9 video reviews).

   Owner request (2026-10-11): video reviews uploaded in the admin replace the
   written testimonials and play right on the page. The written quotes are a
   fallback, shown only while no video review is published (consent + "Show on
   website"), so the section is never empty.

   Written fallback: static ruled columns, 3 across for three, a 2×2 grid for
   four, otherwise 3 with the rest behind "Show more"; 2 on phones. */
import { useState } from 'react'
import { useSite } from '../lib/SiteContext.jsx'
import SectionHeading from './SectionHeading.jsx'
import VideoReviews, { useVideoReviews } from './VideoReviews.jsx'

function WrittenVoices({ list }) {
  const [all, setAll] = useState(false)
  const layout = list.length === 4 ? 'quad' : 'cols'
  const limit = list.length === 4 ? 4 : 3
  const hasMore = list.length > limit
  return (
    <>
      <div className={`voices__grid voices__grid--${layout}${all ? ' is-all' : ''}`}>
        {list.map((t, i) => (
          <figure key={i} className={`voice${i >= limit ? ' voice--extra' : ''}${i >= 2 ? ' voice--extra-phone' : ''}`} data-reveal="block">
            <span className="voice__mark" aria-hidden="true">“</span>
            <blockquote className="voice__quote">{t.quote}</blockquote>
            <span className="voice__rule" aria-hidden="true" />
            <figcaption className="voice__by">
              <span className="voice__name">{String(t.name || '').trim()}</span>
              <span className="voice__meta">{[String(t.location || '').trim(), t.trip].filter(Boolean).join(' · ')}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      {(hasMore || list.length > 2) && !all && (
        <button className={`k-link voices__more${hasMore ? '' : ' voices__more--phone'}`} type="button" onClick={() => setAll(true)}>
          Show more <span aria-hidden="true">↓</span>
        </button>
      )}
    </>
  )
}

export default function TestimonialsSection({ num = '09' }) {
  const { site } = useSite()
  const videos = useVideoReviews()
  const written = (site.testimonials || []).filter(t => t && t.quote)
  if (!videos.length && !written.length) return null

  return (
    <section id="testimonials" className="k-section voices" data-surface="ivory" aria-labelledby="voices-title">
      <div className="k-container">
        <SectionHeading
          num={num}
          eyebrow="Voices from our pilgrims"
          id="voices-title"
          title="Voices from Our Pilgrims"
          lead={videos.length ? 'Pilgrims share their journey in their own words. Tap a video to play it.' : undefined}
        />
        {videos.length ? <VideoReviews /> : <WrittenVoices list={written} />}
      </div>
    </section>
  )
}

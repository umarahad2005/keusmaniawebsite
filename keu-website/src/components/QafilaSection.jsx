/* Qafila e Shoq chapter (DESIGN-LANGUAGE §4 Qafila chapter). Keeps #qafila.
   The bg-stage fades paper to green and back. A 20 px inset gold frame draws
   on all four sides over 1200 ms. Urdu is set in Nastaliq (this route only),
   with px line-heights and reserved heights so the late font swap cannot shift
   the layout. The seal and the leader photo appear only once supplied (the
   seal retrace is pending), so neither is rendered here. */
import { useEffect, useRef, useState } from 'react'
import { useSite } from '../lib/SiteContext.jsx'
import { useWaLink } from '../lib/whatsapp.js'
import { gsap } from '../lib/motion.js'
import { motionEnv } from '../lib/motionEnv.js'
import { afterIdle } from '../lib/idle.js'
import { Icon } from '../icons.jsx'
import SectionHeading from './SectionHeading.jsx'

/* "Ibadah — Acts of Worship" → ["Ibadah", "Acts of Worship"] */
function splitTitle(t = '') {
  const [a, ...b] = String(t).split(/\s+[—–-]\s+/)
  return [a, b.join(' — ')]
}

export default function QafilaSection({ num = '02' }) {
  const { site } = useSite()
  const wa = useWaLink()
  const frame = useRef(null)
  const section = useRef(null)
  const q = site.qafila
  // Nastaliq is applied only as the chapter approaches (600 px ahead), so the
  // 115 KB font is not fetched during the page's first load. Until then the
  // Urdu shows in the Arabic face inside the same reserved line boxes.
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = section.current
    if (!el || near) return
    if (!('IntersectionObserver' in window)) { setNear(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: '600px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [near])
  const ur = near ? ' nastaliq' : ''

  useEffect(() => {
    const el = frame.current
    if (!el || motionEnv().reduce) return
    let ctx
    const cancel = afterIdle(() => { ctx = gsap.context(() => {
      const [top, right, bottom, left] = el.children
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 75%', once: true }, defaults: { ease: 'power2.inOut', duration: 0.6 } })
        .from(top, { scaleX: 0, transformOrigin: 'left center' }, 0)
        .from(right, { scaleY: 0, transformOrigin: 'center top' }, 0.3)
        .from(bottom, { scaleX: 0, transformOrigin: 'right center' }, 0.6)
        .from(left, { scaleY: 0, transformOrigin: 'center bottom' }, 0.6)
    }) })
    return () => { cancel(); ctx?.revert() }
  }, [])

  if (!q) return null

  return (
    <section id="qafila" ref={section} className="k-section qafila" data-surface="green" aria-labelledby="qafila-title">
      <div className="qafila__frame" ref={frame} aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="k-container">
        <div className="qafila__head">
          <p className="qafila__endorse" data-reveal="t1">A spiritual journey by Karwan e Usmania International</p>
          <p className={`qafila__urdu${ur}`} lang="ur" dir="rtl">{q.urduTagline}</p>
          <SectionHeading num={num} eyebrow="Qafila e Shoq" id="qafila-title" title={q.name} tone="dark" align="center" />
          {q.tagline && <p className="qafila__tagline" data-reveal="t1">{q.tagline}</p>}
          {q.leader && (
            <p className="qafila__leader" data-reveal="t1">
              Led by <strong>{q.leader}</strong>{q.leaderTitle ? ` (${q.leaderTitle})` : ''}
            </p>
          )}
        </div>

        <div className="qafila__text" data-reveal="block">
          {q.intro && <p className="qafila__intro">{q.intro}</p>}
          {q.body && <p className="qafila__body">{q.body}</p>}
        </div>

        <ul className="qafila__pillars" role="list">
          {(q.pillars || []).map(p => {
            const [name, gloss] = splitTitle(p.title)
            return (
              <li key={p.title} className="qafila__pillar" data-reveal="t2">
                {p.urdu && <span className={`qafila__pillar-urdu${ur}`} lang="ur" dir="rtl">{p.urdu}</span>}
                <h3 className="qafila__pillar-title">{name}{gloss && <span>{gloss}</span>}</h3>
                <p className="qafila__pillar-body">{p.body}</p>
              </li>
            )
          })}
        </ul>

        <div className="qafila__foot" data-reveal="t1">
          <a className="k-btn k-btn--wa k-btn--lg" href={wa('qafila')} target="_blank" rel="noopener">
            <Icon name="whatsapp" className="k-ico" /> Apply via WhatsApp
          </a>
          <p className="qafila__note">Limited seats · By application only</p>
        </div>
      </div>
    </section>
  )
}

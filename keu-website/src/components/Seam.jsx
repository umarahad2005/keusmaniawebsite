/* The letterhead seam between the film and the paper (DESIGN-LANGUAGE §5.1 #2).
   A flipped letterhead sweep carries the dark hero into the page; its champagne
   ribbon draws once. On the paper: the "one Karwan" line from the About story
   (desktop) and the motto between hairlines, its only appearance on Home. */
import { useEffect, useRef } from 'react'
import { useSite } from '../lib/SiteContext.jsx'
import { gsap } from '../lib/motion.js'
import { motionEnv } from '../lib/motionEnv.js'
import { afterIdle } from '../lib/idle.js'

export default function Seam() {
  const { site } = useSite()
  const ribbon = useRef(null)
  const line = site.about?.story?.[2]

  useEffect(() => {
    const el = ribbon.current
    if (!el || motionEnv().reduce) return
    let ctx
    const cancel = afterIdle(() => { ctx = gsap.context(() => {
      gsap.fromTo(el, { drawSVG: '0%' }, {
        drawSVG: '100%', duration: 1.2, ease: 'power2.inOut',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    }) })
    return () => { cancel(); ctx?.revert() }
  }, [])

  return (
    <section className="seam" data-surface="paper" aria-label="Faith, journey, together">
      <svg className="seam__sweep" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
        <path className="seam__dark" d="M0 0H1440V90C1200 60 1000 140 760 120S260 150 0 40Z" />
        <path className="seam__ribbon" ref={ribbon} d="M0 38C260 148 520 98 760 118S1200 58 1440 88" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="seam__body">
        {line && <blockquote className="seam__quote" data-reveal="block">{line}</blockquote>}
        <p className="seam__motto" data-reveal="t1">Faith <span aria-hidden="true">×</span><span className="sr-only">,</span> Journey <span aria-hidden="true">×</span><span className="sr-only">,</span> Together</p>
      </div>
    </section>
  )
}

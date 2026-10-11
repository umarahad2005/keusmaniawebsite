/* Our services (DESIGN-LANGUAGE §4 ServicesStrip).
   Heading with the swoosh on the left; a 3×2 hairline lattice on the right
   (2×3 on phones). The swoosh draws once and the aircraft lands. Sublabels are
   plain text (no HTML from the admin). */
import { useEffect, useRef } from 'react'
import { useSite } from '../lib/SiteContext.jsx'
import { useWaLink } from '../lib/whatsapp.js'
import { gsap } from '../lib/motion.js'
import { motionEnv } from '../lib/motionEnv.js'
import { afterIdle } from '../lib/idle.js'
import { Icon } from '../icons.jsx'
import SectionHeading from './SectionHeading.jsx'

const SWOOSH = 'M323.6 534.3C58.9 841.8 782.8 526.8 810 407.9'
const PLANE = 'M934.6 281.9C928.7 283.3 922.6 285.5 917.5 288.1C912.7 290.5 913 290.2 897.6 301.8C891.4 306.5 885.6 310.8 884.8 311.4C883.9 312 881.8 313.5 880.1 314.8L876.9 317.1L840.1 317.1L803.3 317.1L797.7 320.9C791.3 325.1 790.4 327.3 795 327.7C797.4 328 803.5 329.5 820.7 334.4C824.8 335.6 830.5 337.1 833.2 337.9C845.5 341.3 847.5 342.8 843.4 345.9C842.1 346.9 835.8 352.5 829.3 358.5C815.7 370.9 818.1 370.1 801.8 368.2C790.9 366.9 790.8 367 785.1 372C780.8 375.7 781.2 376.3 791.2 379.9C801 383.5 801 383.5 803.3 387.9C806.8 394.9 808.7 395 816.9 388.7C824.9 382.5 854.5 361.6 859.6 358.6C862.2 357 862.6 357.9 863.9 367.8C864.6 372.7 865.2 376.9 865.3 377.1C866 378.2 869.4 408.3 869 410C867.9 415.5 872.3 415.1 878.5 409.3C880.9 407.1 881.3 406.3 881.7 402.5C882 400.1 882.6 397 882.9 395.5C883.6 392.9 884.8 385.7 888.9 360.1C889.9 354.1 890.9 348.9 891 348.6C891.2 348.4 891.7 345.3 892.2 341.7C893.3 332.9 892.5 333.8 913.9 318.7C931.3 306.5 944.6 295.2 947.8 289.9C952.4 282.3 946.8 278.9 934.6 281.9Z'

const strip = (html = '') => String(html).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')

export default function ServicesStrip() {
  const { site } = useSite()
  const wa = useWaLink()
  const svg = useRef(null)

  useEffect(() => {
    const el = svg.current
    if (!el || motionEnv().reduce) return
    let ctx
    const cancel = afterIdle(() => { ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
      tl.fromTo(el.querySelector('.services__swoosh'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, ease: 'power2.inOut' })
        .fromTo(el.querySelector('.services__plane'), { autoAlpha: 0, x: -18, y: 18, rotation: -8, transformOrigin: '50% 50%' },
          { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 0.35, ease: 'power3.out' }, '-=0.15')
    }) })
    return () => { cancel(); ctx?.revert() }
  }, [])

  return (
    <section id="services" className="k-section services" data-surface="paper" aria-labelledby="services-title">
      <div className="k-container services__grid">
        <div className="services__head">
          <SectionHeading
            num="06"
            eyebrow="Our services"
            id="services-title"
            title="Our Services"
            lead="Everything you need for a spiritually fulfilling and comfortable pilgrimage."
          />
          <svg ref={svg} className="services__art" viewBox="120 260 860 420" aria-hidden="true">
            <path className="services__swoosh" d={SWOOSH} />
            <path className="services__plane" d={PLANE} />
          </svg>
          <a className="k-link" href={wa('general')} target="_blank" rel="noopener">Ask what’s included <span aria-hidden="true">→</span></a>
        </div>
        <ul className="services__lattice" role="list">
          {(site.services || []).map(s => (
            <li key={s.label} className="services__cell" data-reveal="t2">
              <span className="halo" aria-hidden="true"><Icon name={s.icon} className="k-ico" /></span>
              <span className="services__label">{s.label}</span>
              <span className="services__sub">{strip(s.sublabel)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

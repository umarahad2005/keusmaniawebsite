/* Background stage (DESIGN-LANGUAGE §4 TransitionRoutes, PageCurtain, BgStage).

   A fixed layer behind the page with one field per surface. Sections declare
   data-surface="paper|ivory|green|dark" and keep a transparent background; as
   each one enters, the stage cross-fades from the previous surface to its own.

   The fade is scrubbed over the incoming section's top padding only
   ('top bottom' → 'top 75%'), so no text ever sits on the half-way colour, where
   every text colour fails contrast. Under reduced motion the switch is instant.
   Without JS the sections keep their own solid colours (CSS in chrome.css). */
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../../lib/motion.js'
import { motionEnv } from '../../lib/motionEnv.js'

const SURFACES = ['paper', 'ivory', 'green', 'dark']

export default function BgStage({ routeKey }) {
  useEffect(() => {
    const stage = document.querySelector('.bg-stage')
    if (!stage) return
    const layer = s => stage.querySelector(`[data-layer="${s}"]`)
    let ctx

    const build = () => {
      ctx?.revert()
      const sections = Array.from(document.querySelectorAll('#main-content [data-surface]'))
      document.documentElement.classList.toggle('has-bg-stage', sections.length > 0)
      SURFACES.forEach(s => gsap.set(layer(s), { opacity: 0 }))
      if (!sections.length) { gsap.set(layer('paper'), { opacity: 1 }); return }

      const first = sections[0].dataset.surface
      gsap.set(layer(SURFACES.includes(first) ? first : 'paper'), { opacity: 1 })
      const reduce = motionEnv().reduce

      ctx = gsap.context(() => {
        sections.forEach((sec, i) => {
          if (i === 0) return
          const prev = sections[i - 1].dataset.surface
          const cur = sec.dataset.surface
          if (prev === cur || !SURFACES.includes(cur) || !SURFACES.includes(prev)) return
          if (reduce) {
            ScrollTrigger.create({
              trigger: sec,
              start: 'top 75%',
              onEnter: () => { gsap.set(layer(prev), { opacity: 0 }); gsap.set(layer(cur), { opacity: 1 }) },
              onLeaveBack: () => { gsap.set(layer(cur), { opacity: 0 }); gsap.set(layer(prev), { opacity: 1 }) },
            })
            return
          }
          gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 75%', scrub: true } })
            .fromTo(layer(prev), { opacity: 1 }, { opacity: 0, ease: 'none', immediateRender: false }, 0)
            .fromTo(layer(cur), { opacity: 0 }, { opacity: 1, ease: 'none', immediateRender: false }, 0)
        })
      })
    }

    const raf = requestAnimationFrame(build)
    window.addEventListener('keu:content', build)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keu:content', build)
      ctx?.revert()
    }
  }, [routeKey])

  return (
    <div className="bg-stage" aria-hidden="true">
      {SURFACES.map(s => <i key={s} data-layer={s} />)}
    </div>
  )
}

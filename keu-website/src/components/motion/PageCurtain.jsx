/* Route curtain (DESIGN-LANGUAGE §3.5): two green-950 bands with gold inner
   edges close over the page, hold on the KU mark and the destination name,
   then open on the new page. Sits under the nav (z 90 vs 100) and the WhatsApp
   button (z 110), so both stay usable mid-transition.

   Modes
     bands    600 ms cover · 700 ms reveal (expo.inOut)
     pop      450 ms each way (back / forward)
     fade     paper crossfade: 250 / 350 ms on low-end devices, 200 / 200 ms under reduced motion
     instant  no animation (Save-Data) */
import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { gsap, EASE } from '../../lib/motion.js'
import BrandMark from '../brand/BrandMark.jsx'

const TIMING = {
  bands: { cover: 0.6, reveal: 0.7, ease: EASE.curtain },
  pop: { cover: 0.45, reveal: 0.45, ease: EASE.curtain },
  fadeLow: { cover: 0.25, reveal: 0.35 },
  fadeReduce: { cover: 0.2, reveal: 0.2 },
}

const PageCurtain = forwardRef(function PageCurtain(_, ref) {
  const root = useRef(null)
  const top = useRef(null)
  const bottom = useRef(null)
  const center = useRef(null)
  const veil = useRef(null)
  const [caption, setCaption] = useState('')

  // Park the bands off-screen. Done here, not in CSS, so GSAP owns the transform.
  useLayoutEffect(() => {
    gsap.set(top.current, { y: 0, yPercent: -101 })
    gsap.set(bottom.current, { y: 0, yPercent: 101 })
  }, [])

  const play = (tl) => new Promise(resolve => tl.eventCallback('onComplete', resolve))

  useImperativeHandle(ref, () => ({
    cover(mode, label) {
      setCaption(label || '')
      gsap.killTweensOf([top.current, bottom.current, center.current, veil.current])
      if (mode === 'instant') return Promise.resolve()
      gsap.set(root.current, { autoAlpha: 1 })
      if (mode === 'fade' || mode === 'fade-reduce') {
        const t = mode === 'fade' ? TIMING.fadeLow : TIMING.fadeReduce
        gsap.set([top.current, bottom.current, center.current], { autoAlpha: 0 })
        return play(gsap.timeline().fromTo(veil.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: t.cover, ease: 'power1.out' }))
      }
      const t = TIMING[mode] || TIMING.bands
      gsap.set(veil.current, { autoAlpha: 0 })
      gsap.set([top.current, bottom.current], { autoAlpha: 1 })
      const tl = gsap.timeline()
      tl.fromTo(top.current, { yPercent: -101 }, { yPercent: 0, duration: t.cover, ease: t.ease }, 0)
        .fromTo(bottom.current, { yPercent: 101 }, { yPercent: 0, duration: t.cover, ease: t.ease }, 0)
        .fromTo(center.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'power1.out' }, t.cover * 0.7)
      return play(tl)
    },
    reveal(mode) {
      if (mode === 'instant') {
        gsap.set(root.current, { autoAlpha: 0 })
        return Promise.resolve()
      }
      let tl
      if (mode === 'fade' || mode === 'fade-reduce') {
        const t = mode === 'fade' ? TIMING.fadeLow : TIMING.fadeReduce
        tl = gsap.timeline().to(veil.current, { autoAlpha: 0, duration: t.reveal, ease: 'power1.out' })
      } else {
        const t = TIMING[mode] || TIMING.bands
        tl = gsap.timeline()
          .to(center.current, { autoAlpha: 0, duration: 0.15, ease: 'power1.in' }, 0)
          .to(top.current, { yPercent: -101, duration: t.reveal, ease: t.ease }, 0)
          .to(bottom.current, { yPercent: 101, duration: t.reveal, ease: t.ease }, 0)
      }
      tl.set(root.current, { autoAlpha: 0 })
      return play(tl)
    },
  }), [])

  return (
    <div className="page-curtain" ref={root} aria-hidden="true">
      <div className="page-curtain__veil" ref={veil} />
      <div className="page-curtain__band page-curtain__band--top" ref={top} />
      <div className="page-curtain__band page-curtain__band--bottom" ref={bottom} />
      <div className="page-curtain__center" ref={center}>
        <BrandMark variant="reversed" size={32} />
        <span className="page-curtain__caption">{caption}</span>
      </div>
    </div>
  )
})

export default PageCurtain

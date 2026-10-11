/* Makkah becomes Madinah (DESIGN-LANGUAGE §4 SanctuaryChapter): the site's one pin.

   ≥1024 px with motion allowed: pinned for +=150%. Inside a dome arch, the Kaaba
   still gives way to the silent Green Dome loop while the text swaps behind masks.
     0 – .40   Makkah holds
     .40 – .62 Madinah rises inside the arch; Makkah's text exits, Madinah's enters
     .62 – 1   Madinah holds
   <1024 px (the phone signature moment): no pin. Makkah text, one arch, Madinah
   text; the arch's wipe is scrubbed to its own passage through the viewport.
   Reduced motion: stacked and static. Both text blocks stay in the DOM and the
   tab order (no inert, no aria-hidden); the inactive one is hidden with
   clip and opacity only, and focusing it scrolls to its hold point. */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../lib/SiteContext.jsx'
import { useWaLink } from '../lib/whatsapp.js'
import { gsap, ScrollTrigger } from '../lib/motion.js'
import { motionEnv } from '../lib/motionEnv.js'
import { afterIdle } from '../lib/idle.js'
import makkahStill from '../assets/media/makkah-kaaba-kiswa-1600.webp'
import madinahLoop from '../assets/media/madinah-720.mp4'
import madinahPoster from '../assets/media/madinah-poster.webp'

const CITY_AR = ['مكة المكرمة', 'المدينة المنورة']

/* Chosen on the first render too, so the section never re-lays itself out. */
function pickMode() {
  if (typeof window === 'undefined') return 'stack'
  const env = motionEnv()
  if (env.reduce) return 'stack'
  return window.innerWidth >= 1024 && !env.saveData && !env.slowNet ? 'pin' : 'flow'
}

export default function SanctuaryChapter() {
  const { site } = useSite()
  const wa = useWaLink()
  const [makkah, madinah] = site.sanctuaries || []
  const section = useRef(null)
  const sticky = useRef(null)
  const blockA = useRef(null)
  const blockB = useRef(null)
  const layerB = useRef(null)
  const video = useRef(null)
  const progress = useRef(null)
  const [mode, setMode] = useState(pickMode)   // 'pin' | 'flow' | 'stack'
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)

  useEffect(() => {
    const update = () => setMode(pickMode())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (mode === 'stack') return
    const env = motionEnv()
    let ctx
    // Built once the page is idle; CSS holds the same starting states until then.
    const cancel = afterIdle(() => { section.current?.classList.add('is-armed'); ctx = gsap.context(() => {
      const inner = layerB.current.firstElementChild
      if (mode === 'pin') {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: '+=150%',
            pin: sticky.current,
            scrub: 0.6,
            onEnter: () => playVideo(),
            onEnterBack: () => playVideo(),
            onLeave: () => video.current?.pause(),
            onLeaveBack: () => video.current?.pause(),
          },
        })
        tl.fromTo(progress.current, { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 1 }, 0)
          .fromTo(layerB.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 0.22 }, 0.40)
          .fromTo(inner, { scale: 1.12 }, { scale: 1, ease: 'power2.inOut', duration: 0.22 }, 0.40)
          .to(blockA.current.querySelectorAll('[data-mask]'), { yPercent: -110, ease: 'power2.in', duration: 0.11, stagger: 0.01 }, 0.40)
          .to(blockA.current.querySelectorAll('[data-fade]'), { autoAlpha: 0, duration: 0.08 }, 0.40)
          .fromTo(blockB.current.querySelectorAll('[data-mask]'), { yPercent: 110 }, { yPercent: 0, ease: 'power2.out', duration: 0.11, stagger: 0.01 }, 0.51)
          .fromTo(blockB.current.querySelectorAll('[data-fade]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.53)
          .set(blockA.current, { className: 'chapter__block chapter__block--a is-inactive' }, 0.5)
          .set(blockB.current, { className: 'chapter__block chapter__block--b' }, 0.5)
          .to({}, { duration: 0.38 }, 0.62)
      } else {
        // Phones and tablets: wipe scrubbed to the arch passing through the viewport.
        gsap.timeline({ scrollTrigger: { trigger: layerB.current.parentElement, start: 'top 70%', end: 'bottom 30%', scrub: 0.6 } })
          .fromTo(layerB.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut' }, 0)
          .fromTo(inner, { scale: 1.12 }, { scale: 1, ease: 'power2.inOut' }, 0)
      }
      ScrollTrigger.refresh()
    }, section) })

    function playVideo() {
      const v = video.current
      if (!v || pausedRef.current || motionEnv().saveData || motionEnv().lowEnd) return
      if (!v.src) v.src = madinahLoop
      v.play().catch(() => {})
    }

    return () => { cancel(); ctx?.revert(); section.current?.classList.remove('is-armed') }
  }, [mode])

  // Keyboard users: focusing a block scrolls the pin to that block's hold point.
  const onFocusBlock = (which) => () => {
    if (mode !== 'pin') return
    const st = ScrollTrigger.getAll().find(t => t.pin === sticky.current)
    if (!st) return
    const y = st.start + (st.end - st.start) * (which === 'a' ? 0.2 : 0.8)
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true })
    else window.scrollTo({ top: y, behavior: 'instant' })
  }

  const togglePause = () => {
    const v = video.current
    if (!v) return
    if (v.paused) { pausedRef.current = false; setPaused(false); if (!v.src) v.src = madinahLoop; v.play().catch(() => {}) }
    else { pausedRef.current = true; setPaused(true); v.pause() }
  }

  if (!makkah || !madinah) return null

  const block = (s, i, ref, key) => (
    <div className={`chapter__block chapter__block--${key}${mode === 'pin' && key === 'b' ? ' is-inactive' : ''}`} ref={ref} onFocus={onFocusBlock(key)}>
      <p className="runhead" data-fade>
        <span className="runhead__num">07</span>
        <span className="runhead__rule" aria-hidden="true" />
        <span className="runhead__label">{s.title}</span>
      </p>
      <p className="chapter__arabic" lang="ar" dir="rtl" data-fade>{CITY_AR[i]}</p>
      <h2 className="chapter__title"><span className="chapter__mask"><span data-mask>{s.subtitle}</span></span></h2>
      <p className="chapter__body" data-fade>{s.body}</p>
      <p data-fade>
        {i === 0
          ? <Link className="k-link" to="/packages">See Umrah packages <span aria-hidden="true">→</span></Link>
          : <a className="k-link" href={wa('umrah', 'Assalamu Alaikum! I would like to ask about ziyarah in Madinah.')} target="_blank" rel="noopener">Ask about ziyarah <span aria-hidden="true">→</span></a>}
      </p>
    </div>
  )

  return (
    <section id="sanctuaries" ref={section} className={`chapter chapter--${mode}`} data-surface="ivory" aria-label="Makkah and Madinah">
      <div className="chapter__sticky" ref={sticky}>
        <div className="k-container chapter__grid">
          <div className="chapter__texts">
            {block(makkah, 0, blockA, 'a')}
            {block(madinah, 1, blockB, 'b')}
          </div>
          <div className="chapter__progress" aria-hidden="true"><i ref={progress} /></div>
          <div className="chapter__arch">
            <div className="chapter__layer">
              <img src={makkahStill} alt={makkah.alt || 'The Kaaba and its kiswa'} loading="lazy" decoding="async" width="1600" height="900" />
            </div>
            <div className="chapter__layer chapter__layer--b" ref={layerB}>
              {mode === 'pin'
                ? <video ref={video} muted playsInline loop preload="none" poster={madinahPoster} aria-label={madinah.alt || 'The Green Dome of Masjid an-Nabawi'} />
                : <img src={madinahPoster} alt={madinah.alt || 'The Green Dome of Masjid an-Nabawi'} loading="lazy" decoding="async" />}
            </div>
            {mode === 'pin' && (
              <button className="chapter__toggle" type="button" onClick={togglePause} aria-label={paused ? 'Play Madinah film' : 'Pause Madinah film'}>
                {paused
                  ? <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" /></svg>
                  : <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" /></svg>}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

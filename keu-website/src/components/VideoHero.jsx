/* Home hero: the Haram from above (DESIGN-LANGUAGE §3.4, §4 VideoHero).

   Layouts
     film    ≥1024 px where the copy column fits (hero-safe.css --hero-plate: 0):
             the loop fills the screen, copy sits in the left column, clear of the
             Kaaba (K1) and the Maqam Ibrahim (K2) by at least 32 px.
     plate   768–1023 px, portrait, or a column under 520 px: a 16:9 film plate
             above the copy on green-950.
     phone   <768 px: the 3:4 poster plate (never video; owner decision), copy on
             solid green below.
   The H1 is painted at full opacity from the first frame (it is the LCP element
   at ≥1024); only the HUD, eyebrow, Arabic line and buttons animate in.
   Keeps #hero and .hero__title (speakable structured data). */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap, EASE, DUR } from '../lib/motion.js'
import { motionEnv } from '../lib/motionEnv.js'
import { useWaLink } from '../lib/whatsapp.js'
import { Icon } from '../icons.jsx'
import { introActive } from './motion/Preloader.jsx'
import { markHeroRevealed } from '../lib/analytics.js'
import { afterIdle } from '../lib/idle.js'
import hero1080 from '../assets/media/hero-1080.mp4'
import hero720 from '../assets/media/hero-720.mp4'

const POSTER_WIDE = '/hero/poster-1920.webp'
const POSTER_PHONE = '/hero/poster-mobile-3x4.webp'

/* matchMedia instead of innerWidth: it answers without forcing a layout of the
   whole page during the first commit (Lighthouse traced 200 ms to it). */
function readLayout(el) {
  if (typeof window === 'undefined') return 'film'
  const mq = q => window.matchMedia(q).matches
  if (mq('(max-width: 767px)')) return 'phone'
  if (mq('(max-width: 1023px)') || mq('(orientation: portrait)')) return 'plate'
  const plate = el ? getComputedStyle(el).getPropertyValue('--hero-plate').trim() : '0'
  return plate === '1' ? 'plate' : 'film'
}

function videoAllowed() {
  const env = motionEnv()
  return window.innerWidth >= 768 && !env.saveData && !env.slowNet && !env.lowEnd
}

function pickSource() {
  return window.innerWidth >= 1024 && window.innerWidth * (window.devicePixelRatio || 1) > 1280 ? hero1080 : hero720
}

function whenIdleAfterLoad(fn) {
  const go = () => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 600))
  if (document.readyState === 'complete') go()
  else window.addEventListener('load', go, { once: true })
}

export default function VideoHero() {
  const wa = useWaLink()
  const hero = useRef(null)
  const media = useRef(null)
  const video = useRef(null)
  const copy = useRef(null)
  const darken = useRef(null)
  // The first render already uses the viewport's layout (no film → phone jump,
  // which Lighthouse measured as a 0.5 layout shift); the layout effect then
  // refines it with the generated safe-zone variable before the first paint.
  const [layout, setLayout] = useState(() => readLayout(null))
  const [canVideo, setCanVideo] = useState(false)
  // The settle and the entrance are CSS animations (no JavaScript work during
  // the first render); they start when the hero is revealed.
  const [anim] = useState(() => typeof window !== 'undefined' && !motionEnv().reduce)
  const [revealed, setRevealed] = useState(false)

  // Layout follows the viewport and the generated safe-zone variables.
  useLayoutEffect(() => {
    const update = () => setLayout(readLayout(hero.current))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Decide whether the film may load at all: never on phones, Save-Data, slow or
  // low-end devices, or with reduced motion. It plays by default with no control
  // (owner, 2026-10-11); reduced motion keeps the still poster instead.
  useEffect(() => {
    setCanVideo(layout !== 'phone' && videoAllowed() && !motionEnv().reduce)
  }, [layout])

  // Attach the film after load and idle, once the <video> element exists.
  useEffect(() => {
    const v = video.current
    if (!canVideo || !v) return
    let cancelled = false
    whenIdleAfterLoad(() => {
      if (cancelled || v.src) return
      v.src = pickSource()
      const p = v.play()
      p?.catch?.(() => {})                      // iOS Low Power Mode: keep the poster
    })
    return () => { cancelled = true }
  }, [canVideo])

  // Fade the film in once real frames are flowing.
  useEffect(() => {
    const v = video.current
    if (!v) return
    const onPlaying = () => {
      const show = () => gsap.to(v, { autoAlpha: 1, duration: DUR.d750, ease: EASE.quiet })
      if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(show)
      else show()
    }
    v.addEventListener('playing', onPlaying)
    return () => v.removeEventListener('playing', onPlaying)
  }, [canVideo])

  // Pause off-screen and when the tab is hidden; resume unless the visitor paused it.
  useEffect(() => {
    const v = video.current
    if (!v || !canVideo) return
    const io = new IntersectionObserver(([e]) => {
      if (!v.src) return
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.05 })
    io.observe(hero.current)
    const onVis = () => { if (document.hidden) v.pause(); else if (v.src) v.play().catch(() => {}) }
    document.addEventListener('visibilitychange', onVis)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis) }
  }, [canVideo])

  // Reveal (CSS settle + entrance), then the scrubbed exit once the page is idle.
  useEffect(() => {
    const env = motionEnv()
    let ctx
    let cancelIdle = () => {}
    const start = () => {
      markHeroRevealed()   // no-op if the Preloader already marked it
      setRevealed(true)
      if (env.reduce || layout !== 'film') return
      cancelIdle = afterIdle(() => {
        ctx = gsap.context(() => {
          const st = { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: 0.6 }
          if (env.lowEnd || env.saveData || env.slowNet) {
            gsap.to(darken.current, { opacity: 0.85, ease: 'none', scrollTrigger: st })
            return
          }
          gsap.timeline({ scrollTrigger: st })
            .to(media.current, { yPercent: 15, ease: 'none' }, 0)
            .to(darken.current, { opacity: 0.85, ease: 'none' }, 0)
            .to(copy.current, { yPercent: -30, autoAlpha: 0, ease: 'none', duration: 0.7 }, 0)
        }, hero)
      })
    }
    if (introActive() && !window.__keuIntroDone) {
      window.addEventListener('keu:intro-reveal', start, { once: true })
      return () => { window.removeEventListener('keu:intro-reveal', start); cancelIdle(); ctx?.revert() }
    }
    start()
    return () => { cancelIdle(); ctx?.revert() }
  }, [layout])

  return (
    <section
      id="hero"
      ref={hero}
      className={`hero vhero vhero--${layout}${anim ? ' vhero--anim' : ''}${anim && layout === 'phone' && motionEnv().lowEnd ? ' vhero--still' : ''}${revealed ? ' is-revealed' : ''}`}
      data-surface="dark"
      aria-labelledby="hero-title"
    >
      <div className="vhero__frame">
        <div className="vhero__media" ref={media}>
          <picture>
            <source media="(max-width: 767px)" srcSet={POSTER_PHONE} width="720" height="960" />
            <img
              className="vhero__poster"
              src={POSTER_WIDE}
              width="1920"
              height="1080"
              alt=""
              fetchpriority="high"
              decoding="async"
            />
          </picture>
          {canVideo && (
            <video
              ref={video}
              className="vhero__video"
              muted
              playsInline
              loop
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
              disablePictureInPicture
              disableRemotePlayback
            />
          )}
        </div>
        <div className="vhero__scrim" aria-hidden="true" />
        <div className="vhero__navband" aria-hidden="true" />
        <div className="vhero__darken" ref={darken} aria-hidden="true" />
      </div>
      <div className="vhero__rule" aria-hidden="true" />

      <div className="vhero__copy" ref={copy}>
        <p className="vhero__hud" data-hero-t1 style={{ "--i": 0 }}>Masjid al-Haram · Makkah</p>
        <p className="vhero__eyebrow" data-hero-t1 style={{ "--i": 1 }}>Karwan e Usmania International · Since 2008</p>
        <h1 id="hero-title" className="hero__title vhero__title">
          <span>Your Journey</span> <span>to the Holy Land,</span> <span>Our Priority</span>
        </h1>
        <p className="vhero__arabic" lang="ar" dir="rtl" data-hero-t1 style={{ "--i": 2 }}>خدمات ضيوف الرحمن</p>
        <div className="vhero__ctas" data-hero-ctas data-hero-t1 style={{ "--i": 3 }}>
          <a className="k-btn k-btn--wa k-btn--lg" href={wa('umrah')} target="_blank" rel="noopener">
            <Icon name="whatsapp" className="k-ico" /> Chat on WhatsApp
          </a>
          <Link className="k-btn k-btn--ghost-dark k-btn--lg" to="/packages">View packages</Link>
        </div>
      </div>
    </section>
  )
}

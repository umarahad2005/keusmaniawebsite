/* Handshake, React phase (DESIGN-LANGUAGE §3.3).

   index.html paints the intro before React loads (self-drawing mark, counter,
   WhatsApp link and Skip). This component adopts that node:
     gate  G = max(1200 ms, mark drawn, fonts ready), capped at 2200 ms
           (low-end devices: no counter, cap 1200 ms)
     G     counter shows 100, the bands open over 800 ms (power2.inOut) with gold edges
     G+200 the mark glides into the nav logo over 800 ms (power3.inOut), same pixels
     G+300 the page becomes interactive and the hero starts ('keu:intro-reveal')
   Skip, Esc, wheel, touch-move or a paging key opens the bands in 400 ms instead.
   Runs once per session (sessionStorage 'keuIntro'), only on a first Home visit,
   never with reduced motion or Save-Data. Idempotent under StrictMode. */
import { useEffect } from 'react'
import { markHeroRevealed } from '../../lib/analytics.js'
import { gsap, EASE } from '../../lib/motion.js'
import { motionEnv } from '../../lib/motionEnv.js'

let started = false

export function introActive() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('intro-on')
}

function finishIntro() {
  window.__keuIntroDone = true
  window.dispatchEvent(new CustomEvent('keu:intro-reveal'))
  markHeroRevealed()
}

const wait = ms => new Promise(r => setTimeout(r, ms))

export default function Preloader() {
  useEffect(() => {
    if (started) return
    started = true

    const html = document.documentElement
    const intro = document.getElementById('keu-intro')
    if (!html.classList.contains('intro-on') || !intro) {
      intro?.remove()
      finishIntro()
      return
    }
    window.__keuIntroAdopted = true

    const root = document.getElementById('root')
    const env = motionEnv()
    const t0 = window.__keuIntroStart || performance.now()
    const cap = env.lowEnd ? 1200 : 2200
    const count = document.getElementById('ki-count')
    const markwrap = document.getElementById('ki-markwrap')
    const top = intro.querySelector('.ki-band--top')
    const bottom = intro.querySelector('.ki-band--bottom')
    const center = intro.querySelector('.ki-center')
    const hud = intro.querySelector('.ki-hud')
    if (env.lowEnd && count) count.style.visibility = 'hidden'

    let done = false
    let opening = false
    const pauseLenis = () => window.__lenis?.stop()
    requestAnimationFrame(pauseLenis)

    const release = () => {
      root.inert = false
      html.classList.remove('intro-on')
      window.__lenis?.start()
      try { sessionStorage.setItem('keuIntro', '1') } catch {}
    }
    const cleanup = () => {
      done = true
      removeListeners()
      intro.remove()
    }

    const open = (fast) => {
      if (opening) return
      opening = true
      window.__keuIntroGate = true
      if (count) count.textContent = '100'
      intro.classList.add('is-open')
      const dur = fast ? 0.4 : 0.8
      const tl = gsap.timeline({ onComplete: cleanup })
      tl.to(top, { yPercent: -101, duration: dur, ease: EASE.band }, 0)
        .to(bottom, { yPercent: 101, duration: dur, ease: EASE.band }, 0)
        .to([hud, count], { autoAlpha: 0, duration: 0.25 }, 0)
        .add(() => { release(); finishIntro() }, fast ? 0.1 : 0.3)

      const navLogo = document.querySelector('.nav__logo-img')
      if (fast || !navLogo || !markwrap) {
        tl.to(center, { autoAlpha: 0, duration: 0.3 }, 0)
        return
      }
      // Glide the mark onto the nav logo's exact pixels, then swap in one frame.
      const a = markwrap.getBoundingClientRect()
      const b = navLogo.getBoundingClientRect()
      tl.to(center.querySelectorAll('.ki-rules, .ki-count'), { autoAlpha: 0, duration: 0.2 }, 0)
        .to(markwrap, {
          x: b.left - a.left,
          y: b.top - a.top,
          scale: b.width / a.width,
          duration: 0.8,
          ease: EASE.glide,
        }, 0.2)
        .add(() => { navLogo.style.opacity = '1' }, 1.0)
        .set(markwrap, { autoAlpha: 0 }, 1.0)
    }

    // Skip paths: button, Esc, wheel, touch-move, paging keys.
    const skipKeys = new Set(['Escape', ' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'])
    const onSkip = () => open(true)
    const onKey = (e) => { if (skipKeys.has(e.key)) onSkip() }
    const removeListeners = () => {
      window.removeEventListener('keu:intro-skip', onSkip)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onSkip)
      window.removeEventListener('touchmove', onSkip)
    }
    window.addEventListener('keu:intro-skip', onSkip)
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onSkip, { passive: true })
    window.addEventListener('touchmove', onSkip, { passive: true })

    // Gate: at least 1200 ms (the mark finishes drawing), fonts ready, capped.
    const fonts = document.fonts
      ? Promise.all([
          document.fonts.load('400 16px Manrope'),
          document.fonts.load('500 32px "Cormorant Garamond"'),
          document.fonts.load('500 24px "KEU Arabic"', 'خدمات'),
        ]).catch(() => {})
      : Promise.resolve()
    const elapsed = () => performance.now() - t0
    Promise.race([
      Promise.all([fonts, wait(Math.max(0, 1200 - elapsed()))]),
      wait(Math.max(0, cap - elapsed())),
    ]).then(() => { if (!done) open(false) })

    return () => {}
  }, [])

  return null
}

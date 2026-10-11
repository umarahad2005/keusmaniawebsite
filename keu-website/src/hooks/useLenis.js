import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/motion.js'
import { motionOff } from '../lib/motionEnv.js'

const NAV_OFFSET = -64

/**
 * Smooth scrolling for the public site, driven by GSAP's ticker so Lenis and
 * ScrollTrigger share one clock (DESIGN-LANGUAGE §3, risk R-M1). Before this,
 * Lenis ran its own requestAnimationFrame loop and ScrollTrigger listened to
 * native scroll events from another, so scrubbed effects trailed by a frame.
 *
 * Call this ONCE, high in the tree, and gate it with `enabled` (off in /admin).
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled || motionOff()) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: true,
    })

    // One clock: Lenis advances on GSAP's ticker and tells ScrollTrigger to update.
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.config({ ignoreMobileResize: true })

    window.__lenis = lenis
    // The handshake keeps the page still until it opens (Preloader starts Lenis).
    if (document.documentElement.classList.contains('intro-on')) lenis.stop()

    // Anchor links → smooth scroll (same-page hashes only).
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (id.length <= 1) return
      const target = document.getElementById(decodeURIComponent(id.slice(1)))
      if (target) {
        e.preventDefault()
        lenis.scrollTo(target, { offset: NAV_OFFSET })
      }
    }
    document.addEventListener('click', onClick)

    // Trigger positions go stale when late content changes the page height.
    // load, fonts and live content often land together: refresh once for all.
    let refreshTimer = 0
    const refresh = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120) }
    window.addEventListener('keu:content', refresh)
    window.addEventListener('load', refresh, { once: true })
    document.fonts?.ready?.then(refresh)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      document.removeEventListener('click', onClick)
      window.removeEventListener('keu:content', refresh)
      window.removeEventListener('load', refresh)
      delete window.__lenis
    }
  }, [enabled])
}

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Smooth scrolling for the public site.
 *
 * Call this ONCE, high in the tree, and gate it with `enabled` — mounting it per
 * route tore the instance down and rebuilt it on every navigation, which fought
 * the scroll-to-top reset and re-registered the anchor listener each time.
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: true,
    })

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Expose for components that need it (e.g. anchor scrolling)
    window.__lenis = lenis

    // Anchor links → smooth scroll
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (id.length <= 1) return
      const target = document.querySelector(id)
      if (target) {
        e.preventDefault()
        lenis.scrollTo(target, { offset: -64 })
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      document.removeEventListener('click', onClick)
      delete window.__lenis
    }
  }, [enabled])
}

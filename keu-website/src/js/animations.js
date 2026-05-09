/* =========================================================
   Karwan-e-Usmania — GSAP + ScrollTrigger + Lenis
   Owns: smooth scroll, hero entrance, scroll-driven scatter,
   section reveals, card stagger, services strip, stats counter,
   testimonials, CTA, parallax, footer reveal.
   ========================================================= */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

export function getLenis() { return lenisInstance }

export function initAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ─── Lenis smooth scroll ────────────────────────────
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    smoothWheel: true,
  })
  lenisInstance.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenisInstance.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // Anchor links → Lenis
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href')
    if (id.length <= 1) return
    const target = document.querySelector(id)
    if (target) {
      e.preventDefault()
      lenisInstance.scrollTo(target, { offset: -64 })
    }
  })

  // ─── Nav transparent → solid on scroll ──────────────
  const nav = document.querySelector('.nav')
  if (nav) {
    nav.classList.add('nav--transparent')
    ScrollTrigger.create({
      start: 'top -80px',
      onEnter: () => {
        nav.classList.add('nav--solid')
        nav.classList.remove('nav--transparent')
      },
      onLeaveBack: () => {
        nav.classList.remove('nav--solid')
        nav.classList.add('nav--transparent')
      },
    })
  }

  if (reduceMotion) {
    // Show everything immediately
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'))
    return
  }

  // ─── Hero entrance ──────────────────────────────────
  const heroBismillah = document.querySelector('.hero__bismillah')
  if (heroBismillah) {
    const tl = gsap.timeline({ delay: 0.4 })
    tl.from('.hero__bismillah', { opacity: 0, y: 24, duration: 0.9, ease: 'power2.out' })
      .from('.hero__pill',      { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .from('.hero__title',     { opacity: 0, y: 50, duration: 1.1, ease: 'power3.out' }, '-=0.4')
      .from('.hero__subtitle',  { opacity: 0, y: 24, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .from('.hero__ctas > *',  { opacity: 0, y: 16, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.4')
      .from('.hero__scroll-cue', { opacity: 0, duration: 0.5 }, '-=0.2')
  }

  // ─── Scroll-driven hero particle scatter ────────────
  if (window._sceneObjects?.particles) {
    const { particles } = window._sceneObjects
    gsap.to(particles.material, {
      opacity: 0.15,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
    gsap.to(particles.scale, {
      x: 1.4, y: 1.4, z: 1.4,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    })
  }

  // ─── Generic [data-reveal] ──────────────────────────
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => el.classList.add('is-visible'),
    })
  })

  // ─── Section heading slide-up ───────────────────────
  gsap.utils.toArray('.section-heading').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
    })
  })

  // ─── Cards stagger ──────────────────────────────────
  gsap.utils.toArray('.package-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      ease: 'power2.out',
      delay: (i % 3) * 0.1,
      scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none reverse' },
    })
  })

  // ─── Services strip — left to right ─────────────────
  if (document.querySelector('.services-strip')) {
    gsap.from('.service-card', {
      opacity: 0,
      x: -30,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.services-strip', start: 'top 85%' },
    })
  }

  // ─── Stat counters ──────────────────────────────────
  document.querySelectorAll('[data-count]').forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-count'))
    const suffix = counter.getAttribute('data-suffix') || ''
    const prefix = counter.getAttribute('data-prefix') || ''
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: target,
          duration: 2.4,
          ease: 'power1.out',
          onUpdate() {
            const v = Math.round(proxy.val)
            counter.textContent = `${prefix}${v.toLocaleString('en-US')}${suffix}`
          },
        })
      },
    })
  })

  // ─── Testimonials ───────────────────────────────────
  if (document.querySelector('#testimonials')) {
    gsap.from('.testimonial-card', {
      opacity: 0,
      scale: 0.96,
      stagger: 0.15,
      duration: 0.8,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '#testimonials', start: 'top 80%' },
    })
  }

  // ─── CTA banner ─────────────────────────────────────
  gsap.from('.cta-banner', {
    opacity: 0,
    scale: 0.96,
    duration: 0.9,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.cta-banner', start: 'top 85%' },
  })

  // ─── Parallax images ────────────────────────────────
  gsap.utils.toArray('.parallax-img').forEach(img => {
    gsap.to(img, {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: img.closest('section'), scrub: true },
    })
  })

  // ─── Footer reveal ──────────────────────────────────
  const footer = document.querySelector('.footer')
  if (footer) {
    gsap.from(footer, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      scrollTrigger: { trigger: footer, start: 'top 95%' },
    })
  }

  // ─── Refresh after fonts load (avoids layout-shift triggers) ─
  if (document.fonts) {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }
}

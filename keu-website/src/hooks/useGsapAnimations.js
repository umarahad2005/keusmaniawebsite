import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Wires the page-level GSAP animations: hero entrance, scroll scatter,
 * section heading reveals, card stagger, services strip, testimonials,
 * CTA, parallax, footer reveal.
 *
 * Pass a dependency that changes per page render (e.g. pathname) so
 * triggers re-attach to the freshly-mounted DOM.
 */
export function useGsapAnimations(deps = []) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      // Hero entrance
      const heroBismillah = document.querySelector('.hero__bismillah')
      if (heroBismillah && !reduceMotion) {
        const tl = gsap.timeline({ delay: 0.4 })
        tl.from('.hero__bismillah', { opacity: 0, y: 24, duration: 0.9, ease: 'power2.out' })
          .from('.hero__pill',      { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, '-=0.5')
          .from('.hero__title',     { opacity: 0, y: 50, duration: 1.1, ease: 'power3.out' }, '-=0.4')
          .from('.hero__subtitle',  { opacity: 0, y: 24, duration: 0.8, ease: 'power2.out' }, '-=0.6')
          .from('.hero__ctas > *',  { opacity: 0, y: 16, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.4')
          .from('.hero__scroll-cue', { opacity: 0, duration: 0.5 }, '-=0.2')
      }

      // Scroll-driven hero particle scatter (reads window._sceneObjects)
      if (window._sceneObjects?.particles && !reduceMotion) {
        const { particles } = window._sceneObjects
        gsap.to(particles.material, {
          opacity: 0.15,
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
        })
        gsap.to(particles.scale, {
          x: 1.4, y: 1.4, z: 1.4,
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
        })
      }

      if (reduceMotion) return

      // Section headings
      gsap.utils.toArray('.section-heading').forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
      })

      // Cards stagger
      gsap.utils.toArray('.package-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 60, duration: 0.8, ease: 'power2.out', delay: (i % 3) * 0.1,
          scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none reverse' },
        })
      })

      // Services strip
      if (document.querySelector('.services-strip')) {
        gsap.from('.service-card', {
          opacity: 0, x: -30, stagger: 0.08, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: '.services-strip', start: 'top 85%' },
        })
      }

      // Sanctuary cards
      gsap.utils.toArray('.sanctuary-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', delay: i * 0.15,
          scrollTrigger: { trigger: card, start: 'top 88%' },
        })
      })

      // Stat counters
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
                counter.textContent = `${prefix}${Math.round(proxy.val).toLocaleString('en-US')}${suffix}`
              },
            })
          },
        })
      })

      // Testimonials
      if (document.querySelector('#testimonials')) {
        gsap.from('.testimonial-card', {
          opacity: 0, scale: 0.96, stagger: 0.15, duration: 0.8, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '#testimonials', start: 'top 80%' },
        })
      }

      // CTA banner
      gsap.from('.cta-banner', {
        opacity: 0, scale: 0.96, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: '.cta-banner', start: 'top 85%' },
      })

      // Parallax images
      gsap.utils.toArray('.parallax-img').forEach(img => {
        gsap.to(img, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: img.closest('section'), scrub: true },
        })
      })

      // Footer reveal
      const footer = document.querySelector('.footer')
      if (footer) {
        gsap.from(footer, {
          opacity: 0, y: 40, duration: 0.8,
          scrollTrigger: { trigger: footer, start: 'top 95%' },
        })
      }
    })

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

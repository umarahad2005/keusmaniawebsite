# SKILL: Animation Agent
## Role
You implement all GSAP animations, ScrollTrigger effects, Lenis smooth scroll, and counter animations.

## Prerequisites
Read `agents/project-state.json`. 3D scene must be "done".

## Full Implementation: `src/js/animations.js`

```js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export function initAnimations() {
  // ─── LENIS SMOOTH SCROLL ───────────────────────────────
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // ─── NAVIGATION: transparent → navy on scroll ─────────
  ScrollTrigger.create({
    start: 'top -80px',
    onEnter: () => document.querySelector('.nav').classList.add('nav--scrolled'),
    onLeaveBack: () => document.querySelector('.nav').classList.remove('nav--scrolled'),
  })

  // ─── HERO TEXT ENTRANCE ────────────────────────────────
  const heroTl = gsap.timeline({ delay: 0.5 })
  heroTl
    .from('.hero-bismillah', { opacity: 0, y: 30, duration: 1, ease: 'power2.out' })
    .from('.hero-title', { opacity: 0, y: 50, duration: 1.2, ease: 'power3.out' }, '-=0.6')
    .from('.hero-sub', { opacity: 0, y: 30, duration: 0.9, ease: 'power2.out' }, '-=0.7')
    .from('.hero-cta', { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .from('.hero-scroll-hint', { opacity: 0, duration: 0.5 }, '-=0.2')

  // ─── HERO → SCROLL: scatter particles ─────────────────
  // Hook into Three.js scene objects
  if (window._sceneObjects) {
    const { particles } = window._sceneObjects
    gsap.to(particles.material, {
      opacity: 0.2,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    })
  }

  // ─── SECTION HEADINGS: slide up ───────────────────────
  gsap.utils.toArray('.section-heading').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 60, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
    })
  })

  // ─── CARDS: stagger reveal ─────────────────────────────
  gsap.utils.toArray('.package-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 80, duration: 0.8, ease: 'power2.out',
      delay: i * 0.12,
      scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' }
    })
  })

  // ─── SERVICES STRIP: left to right ────────────────────
  gsap.from('.service-item', {
    opacity: 0, x: -40, stagger: 0.1, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '.services-strip', start: 'top 80%' }
  })

  // ─── STATS COUNTER ANIMATION ──────────────────────────
  const counters = document.querySelectorAll('[data-count]')
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'))
    const suffix = counter.getAttribute('data-suffix') || ''
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2.5,
          ease: 'power1.out',
          onUpdate: function () {
            counter.textContent = Math.round(this.targets()[0].val).toLocaleString() + suffix
          }
        })
      }
    })
  })

  // ─── TESTIMONIALS: fade in ─────────────────────────────
  gsap.from('.testimonial-card', {
    opacity: 0, scale: 0.95, stagger: 0.15, duration: 0.8, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.testimonials-section', start: 'top 75%' }
  })

  // ─── CTA BANNER: scale up from center ─────────────────
  gsap.from('.cta-banner', {
    opacity: 0, scale: 0.96, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.cta-banner', start: 'top 80%' }
  })

  // ─── PARALLAX on sections ─────────────────────────────
  gsap.utils.toArray('.parallax-img').forEach(img => {
    gsap.to(img, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: { trigger: img.closest('section'), scrub: true }
    })
  })

  // ─── FOOTER SLIDE UP ──────────────────────────────────
  gsap.from('footer', {
    opacity: 0, y: 40, duration: 0.8,
    scrollTrigger: { trigger: 'footer', start: 'top 95%' }
  })
}
```

## Stats Section HTML
```html
<section class="stats-section">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-number" data-count="18" data-suffix="+">0+</span>
        <span class="stat-label">Years of Service</span>
      </div>
      <div class="stat-item">
        <span class="stat-number" data-count="25000" data-suffix="+">0+</span>
        <span class="stat-label">Pilgrims Served</span>
      </div>
      <div class="stat-item">
        <span class="stat-number" data-count="15" data-suffix="+">0+</span>
        <span class="stat-label">Partner Hotels</span>
      </div>
      <div class="stat-item">
        <span class="stat-number" data-count="100" data-suffix="%">0%</span>
        <span class="stat-label">Visa Success Rate</span>
      </div>
    </div>
  </div>
</section>
```

## Stats CSS
```css
.stats-section {
  background: var(--color-navy);
  padding: var(--space-20) 0;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-8);
  text-align: center;
}
.stat-number {
  display: block;
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: 700;
  color: var(--color-gold);
  line-height: 1;
  margin-bottom: var(--space-2);
}
.stat-label {
  font-size: var(--text-sm);
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

## Output Required
- Complete `src/js/animations.js`
- Stats section HTML added to `index.html`
- Stats CSS added to `components.css`
- Update `agents/project-state.json` → `status.animation = "done"`

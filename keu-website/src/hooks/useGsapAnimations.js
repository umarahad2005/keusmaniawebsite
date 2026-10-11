import { useEffect } from 'react'
import { gsap, EASE, DUR, STAGGER, TIER } from '../lib/motion.js'
import { motionEnv } from '../lib/motionEnv.js'
import { splitLines } from '../lib/splitText.js'
import { afterIdle } from '../lib/idle.js'

/* =========================================================
   Reveal-tier registry (DESIGN-LANGUAGE §3.2).

   Components opt in with data attributes:
     data-reveal="t0"       hairlines and rules: scaleX 0 → 1 (origin flips in RTL)
     data-reveal="t1"       eyebrows, meta, buttons: fade + rise 12 px
     data-reveal="t2"       grid children: fade + rise 24 px, staggered per row
     data-reveal="block"    text + media modules: fade + rise 32 px over 750 ms
     data-reveal="heading"  English headings: line mask (never Arabic or Urdu)
     data-reveal="t3"       framed images: curtain from the bottom + inner scale
     data-count="5000"      stat figures (data-prefix / data-suffix optional)
   A few classes are mapped by selector in LEGACY with the same tiers.

   Phase 6 (performance): one IntersectionObserver drives every reveal instead
   of a ScrollTrigger per element. Arming only writes styles (no layout reads),
   headings are split into lines only when they arrive, and live content from
   /api/content arms just the new elements instead of rebuilding everything.
   Lighthouse measured the old registry as most of the main-thread blocking.

   Everything plays once. Hidden states are set only here, so content stays
   visible without JS and under prefers-reduced-motion (the registry does
   nothing then). Elements already scrolled past when armed (deep links,
   restored scroll) are shown at once, without animating.

   Pass a dependency that changes per page (e.g. the pathname) so the registry
   re-arms on the freshly mounted DOM.
   ========================================================= */

const LEGACY = [
  ['.section-heading__title', 'heading'],
  ['.package-card', 't2'],
  ['.team-card', 't2'],
]
const SELECTOR = ['[data-reveal]', '[data-count]', ...LEGACY.map(([s]) => s)].join(', ')
const MEDIA = 'img, video, picture'

/* Trigger line ≈ 12 % above the bottom of the viewport (TIER starts are 80–90 %). */
const ROOT_MARGIN = '0px 0px -12% 0px'

function tierOf(el) {
  if (el.hasAttribute('data-count')) return 'count'
  const t = el.getAttribute('data-reveal')
  if (t) return t
  const hit = LEGACY.find(([sel]) => el.matches(sel))
  return hit ? hit[1] : null
}

function createRegistry(root, env) {
  const stagger = env.lowEnd ? STAGGER.lowEnd : STAGGER.normal
  const armed = new Map()          // element → tier (or 'done')
  const splits = []
  const io = new IntersectionObserver(onEntries, { rootMargin: ROOT_MARGIN })

  /* Hidden states are plain style writes: gsap.set would read each element's
     computed transform right after the previous write, forcing ~100 style
     recalculations at startup. GSAP parses these values when a reveal starts. */
  function hide(el, tier) {
    const st = el.style
    switch (tier) {
      case 't0':
        st.transformOrigin = el.closest('[dir="rtl"]') ? 'right center' : 'left center'
        st.transform = 'scaleX(0)'
        break
      case 't1': case 't2': case 'block':
        st.opacity = '0'
        st.visibility = 'hidden'
        st.transform = `translate(0px, ${TIER[tier].y}px)`
        break
      case 'heading':
        st.opacity = '0'
        st.visibility = 'hidden'
        break
      case 't3': {
        if (env.lowEnd) { st.opacity = '0'; st.visibility = 'hidden'; st.transform = `translate(0px, ${TIER.block.y}px)`; break }
        st.clipPath = 'inset(100% 0% 0% 0%)'
        const inner = el.querySelector(MEDIA)
        if (inner) inner.style.transform = 'scale(1.12)'
        break
      }
      default: break
    }
  }

  function clear(el) {
    ;['opacity', 'visibility', 'transform', 'clip-path', 'transform-origin', 'translate', 'rotate', 'scale'].forEach(p => el.style.removeProperty(p))
  }

  function show(el, tier, animate) {
    if (!animate) {
      clear(el)
      const inner = tier === 't3' && el.querySelector(MEDIA)
      if (inner) clear(inner)
      return
    }
    switch (tier) {
      case 't0': gsap.to(el, { scaleX: 1, duration: TIER.t0.dur, ease: TIER.t0.ease }); break
      case 't1': gsap.to(el, { autoAlpha: 1, y: 0, duration: TIER.t1.dur, ease: TIER.t1.ease }); break
      case 'block': gsap.to(el, { autoAlpha: 1, y: 0, duration: TIER.block.dur, ease: TIER.block.ease }); break
      case 'heading': {
        if (env.lowEnd) { gsap.to(el, { autoAlpha: 1, duration: DUR.d600, ease: EASE.quiet }); break }
        const split = splitLines(el)
        gsap.set(el, { autoAlpha: 1 })
        if (!split) { gsap.from(el, { y: TIER.t1.y, autoAlpha: 0, duration: DUR.d600, ease: EASE.quiet }); break }
        splits.push(split)
        gsap.from(split.lines, { yPercent: 110, duration: TIER.heading.dur, ease: TIER.heading.ease, stagger })
        break
      }
      case 't3': {
        if (env.lowEnd) { gsap.to(el, { autoAlpha: 1, y: 0, duration: DUR.d600, ease: EASE.quiet }); break }
        const inner = el.querySelector(MEDIA)
        gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: TIER.t3.dur, ease: TIER.t3.ease })
        if (inner) gsap.to(inner, { scale: 1, duration: TIER.t3.dur, ease: TIER.t3.ease })
        break
      }
      case 'count': {
        const target = parseFloat(el.getAttribute('data-count'))
        if (!Number.isFinite(target)) break
        const prefix = el.getAttribute('data-prefix') || ''
        const suffix = el.getAttribute('data-suffix') || ''
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: target,
          duration: DUR.count,
          ease: EASE.quiet,
          onUpdate() { el.textContent = `${prefix}${Math.round(proxy.val).toLocaleString('en-US')}${suffix}` },
        })
        break
      }
      default: break
    }
  }

  function onEntries(entries) {
    const row = []
    entries.forEach(e => {
      const el = e.target
      const tier = armed.get(el)
      if (!tier || tier === 'done') return
      const passed = !e.isIntersecting && e.boundingClientRect.bottom < 0
      if (!e.isIntersecting && !passed) return
      io.unobserve(el)
      armed.set(el, 'done')
      if (passed) show(el, tier, false)
      else if (tier === 't2') row.push(el)
      else show(el, tier, true)
    })
    // Grid children that arrive together play as one row, in document order.
    if (row.length) {
      row.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      gsap.to(row, { autoAlpha: 1, y: 0, duration: TIER.t2.dur, ease: TIER.t2.ease, stagger, overwrite: true })
    }
  }

  /* skipVisible (first page load): elements already on screen stay as they
     are, so nothing visible flickers when the registry arms after idle. Reads
     all positions first, then writes, so layout is computed once. */
  function scan({ skipVisible = false } = {}) {
    const fresh = Array.from(root.querySelectorAll(SELECTOR)).filter(el => !armed.has(el) && tierOf(el))
    const vh = window.innerHeight
    const onScreen = skipVisible ? fresh.map(el => el.getBoundingClientRect().top < vh) : []
    fresh.forEach((el, i) => {
      if (onScreen[i]) { armed.set(el, 'done'); return }
      const tier = tierOf(el)
      armed.set(el, tier)
      hide(el, tier)
      io.observe(el)
    })
  }

  function destroy() {
    io.disconnect()
    splits.forEach(s => s.revert())
    armed.forEach((_, el) => {
      gsap.killTweensOf(el)
      clear(el)
      const inner = el.getAttribute('data-reveal') === 't3' && el.querySelector(MEDIA)
      if (inner) { gsap.killTweensOf(inner); clear(inner) }
    })
    armed.clear()
  }

  return { scan, destroy }
}

let firstLoad = true

export function useGsapAnimations(deps = []) {
  useEffect(() => {
    const env = motionEnv()
    if (env.reduce || typeof IntersectionObserver === 'undefined') return

    const root = document.getElementById('main-content') || document.body
    const registry = createRegistry(root, env)
    // First page load: arm after idle so the first render is not delayed.
    // Later route changes: arm at once, behind the closed curtain.
    let cancelIdle = () => {}
    if (firstLoad) { firstLoad = false; cancelIdle = afterIdle(() => registry.scan({ skipVisible: true })) }
    else registry.scan()

    // Live content (packages, team…) adds nodes: arm only the new ones.
    // (useLenis re-measures the ScrollTriggers once for the same event.)
    let raf = 0
    const onContent = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => registry.scan())
    }
    window.addEventListener('keu:content', onContent)

    return () => {
      cancelIdle()
      cancelAnimationFrame(raf)
      window.removeEventListener('keu:content', onContent)
      registry.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

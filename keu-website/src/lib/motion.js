/* =========================================================
   KEUI motion tokens and the single GSAP entry point.
   Mirrors the --ease-* / --dur-* CSS custom properties in tokens.css.
   Source: docs/rebrand/DESIGN-LANGUAGE.md §3.

   Import gsap and its plugins from here, never from 'gsap' directly, so every
   plugin is registered exactly once (StrictMode mounts effects twice in dev).
   ========================================================= */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, DrawSVGPlugin, CustomEase)

/* The hero settle curve has no named GSAP equivalent. */
CustomEase.create('keu-settle', '0.19,1,0.22,1')

/** Eases: GSAP names that match the CSS cubic-beziers in tokens.css. */
export const EASE = {
  quiet: 'power3.out',     // reveals, hovers (Rialto's easeOutQuart)
  reveal: 'power4.out',    // heading line masks
  cinema: 'expo.out',      // image curtains
  settle: 'keu-settle',    // hero scale settle
  band: 'power2.inOut',    // preloader bands, hairlines, chapter wipe (Edolus)
  curtain: 'expo.inOut',   // route transition bands
  glide: 'power3.inOut',   // logo FLIP, reorders
  none: 'none',            // scrubs
}

/** Durations in seconds. */
export const DUR = {
  d120: 0.12, d250: 0.25, d350: 0.35, d500: 0.5,
  d600: 0.6, d750: 0.75, d900: 0.9, d1200: 1.2,
  settle: 2.0, count: 1.6,
}

export const STAGGER = { normal: 0.08, lowEnd: 0.04, words: 0.04 }

/** Reveal tiers (§3.2). Each is a from-state, a duration, an ease and a ScrollTrigger start. */
export const TIER = {
  t0:      { start: 'top 90%', dur: 0.8, ease: EASE.band },               // 800 ms hairline / rule draws
  t1:      { start: 'top 88%', dur: DUR.d500, ease: EASE.quiet, y: 12 },  // eyebrows, meta, buttons
  t2:      { start: 'top 85%', dur: DUR.d600, ease: EASE.quiet, y: 24 },  // grids, lattices (batched)
  block:   { start: 'top 80%', dur: DUR.d750, ease: EASE.quiet, y: 32 },  // text + media (Rialto)
  heading: { start: 'top 85%', dur: DUR.d900, ease: EASE.reveal },        // SplitText line mask
  t3:      { start: 'top 80%', dur: DUR.d1200, ease: EASE.cinema },       // framed images
}

export { gsap, ScrollTrigger, SplitText, Flip, DrawSVGPlugin, CustomEase }

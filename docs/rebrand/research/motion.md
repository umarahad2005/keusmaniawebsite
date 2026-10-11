# MOTION SPEC — Karwan e Usmania International (KEUI) rebrand

Researcher: motion-grammar sweep · 2026-10-10
Inputs read in full: `ref/edolus-__loading__.js` (1373 lines), `ref/rialto-theme.css`, `ref/rialto-theme.js`, `ref/rialto-plugins.js` (it's only the object-fit-images polyfill, no motion), `ref/rialto.html` (I grepped it for hero, video, fade-in, swiper and landing_animation), and the repo hooks `keu-website/src/hooks/{useGsapAnimations,useThreeScene,useLenis,useScrollRestoration}.js`, plus `src/App.jsx`, `src/main.jsx`, `src/styles/tokens.css` (motion tokens) and `node_modules` versions.
I modified nothing in the repo.

---

## 0. Ground facts I verified (some of these correct or extend the BRIEF)

| Fact | Evidence |
|---|---|
| **Installed GSAP is 3.15.0**, not 3.12. `package.json` declares `"gsap": "^3.12.5"`, which resolved to 3.15.0. | `keu-website/node_modules/gsap/package.json` → `"version": "3.15.0"` |
| SplitText, Flip, ScrollSmoother, DrawSVGPlugin and MorphSVGPlugin **already ship in the installed `gsap` npm package**. Their headers say "Standard 'no charge' license". | `node_modules/gsap/{SplitText,Flip,ScrollSmoother,DrawSVGPlugin,MorphSVGPlugin}.js`; `package.json` `"license": "Standard 'no charge' license: https://gsap.com/standard-license."` |
| All bonus plugins became free with **GSAP 3.13**. The official 3.13 post says "GSAP is now 100% FREE including ALL of the bonus plugins like SplitText, MorphSVG, and all the others…". The same release rewrote SplitText: 50% smaller, with `mask`, `autoSplit` + `onSplit()`, `aria-label` on the parent, and `aria-hidden` on the split children. | https://gsap.com/blog/3-13/ (fetched). The page names only SplitText and MorphSVG. Flip, ScrollSmoother and DrawSVG are covered by "ALL", and their files are physically present in the installed package. |
| **Minimum version needed: `gsap@3.13.0`.** Recommendation: change `package.json` to `"gsap": "^3.13.0"` so a fresh install can never resolve to a 3.12.x build that lacks the free plugins and the new SplitText API. The lockfile already gives 3.15.0. | — |
| **Installed Lenis is 1.3.23** (declared `^1.1.13`). The official README for this version gives the GSAP wiring: `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`. It also offers `autoRaf`, `anchors`, `stopInertiaOnNavigate`, `prevent`, and `data-lenis-prevent`. | `node_modules/lenis/package.json`, `node_modules/lenis/README.md` lines 141-156, 169, 185-207 |
| React Router is **6.30.3** with `<BrowserRouter>`, not a data router, so **`useBlocker` / `unstable_useViewTransitionState` are not available**. Page transitions must use the "deferred displayLocation" pattern (§7). | `src/main.jsx:3,13`, `src/App.jsx` |
| `PublicShell` (Nav + main + Footer + WhatsAppFAB) is rendered **inside each route element**, so Nav remounts on every navigation. | `src/App.jsx` lines 28-37, 54-58 |
| `useScrollRestoration` reads the *real* `useLocation()` and jumps immediately. Under a page transition this would jump the old page before the curtain covers it. | `src/hooks/useScrollRestoration.js` |
| `useLenis` runs its **own rAF loop** and has **no ScrollTrigger sync**. ScrollTrigger currently reads native scroll events, which works only because Lenis writes native scroll. Scrubbed tweens can lag a frame. | `src/hooks/useLenis.js` |
| The nav logo is a raster `/logo.png` at 48×48. `newlogo.png` is a 4096px raster. **No vector KU logo exists in the repo.** The stroke self-draw needs one (see §2.6). | `src/components/Nav.jsx:39`, `keu-website/public/` |
| Current CSS motion tokens: `--ease-out: cubic-bezier(0.16,1,0.3,1)` (≈ expo.out), `--ease-in-out: cubic-bezier(0.65,0,0.35,1)`, `--ease-spring: cubic-bezier(0.34,1.56,0.64,1)`, durations 150/250/450/800 ms, all zeroed under reduced motion. | `src/styles/tokens.css:139-145,180-185` |

---

## 1. Reference deconstruction (exact numbers)

### 1.1 edolus.com loading screen (`ref/edolus-__loading__.js`)

**Constants**

| Name | Value | Meaning |
|---|---|---|
| `REVEAL_MIN_MS` | 3000 (0 on replay) | minimum full-black time |
| `FAKE_FILL_MS` | 3500 | time-based floor for the % so it never stalls |
| `ASSET_SHARE` | 0.80 | % = 0.8·assets + 0.2·warm-up |
| `HOLD_BEFORE_OPEN` | 0.99 | counter parks at 99 until truly ready |
| `EASE_PER_FRAME` | 0.10 | frame-rate-independent lerp: `display += (target-display) * (1 - (1-0.10)^(dt/16.667))` |
| `REVEAL_SETTLE_MS` | 800 | delay after gate before bands open (lets main-thread microfreeze pass) |
| `BAND_OPEN_MS` | 1600 | curtain open duration |
| `SPLASH_LOGO_WIDTH` | 430px (max 85vw; ≤768px: 366px / 72.25vw) | centred splash logo |
| `PROGRESS_GAP_PX` | 20 | % readout sits 20px under the logo's live box |
| Overlay (header) logo | 156px @ top 40px; mobile 108px @ top 20px; breakpoint 768; overlay fade 1.2s | dock target |
| `DRAW_MS` / `STAGGER_MS` / `EDGE_FEATHER` | 1100 / 220 / 14 viewBox units | per-glyph soft wipe left→right, `easeInOutCubic`, glyphs sorted by bbox x |
| `ROLL_MS` / `ROLL_HOLD_MS` | 200 / 70 | per-digit odometer step (easeOutCubic) + rest on each landed number |
| Logo watchdogs | worker fallback at `(n-1)·220+1100+600` ms; gate ignores logo after 8000 ms; warm-up stop-loss 25000 ms; 1000 ms probe for "no warm-up" | anti-deadlock |

**Ordering (best case, warm cache).** I computed the times from the constants. The worker draws 6 glyphs, so the logo finishes at 5·220+1100 = 2200 ms.

| t (ms) | Event | Motion |
|---|---|---|
| 0 | Wrapper `#000`, z 1000, `.preanim` kills all transitions for 2 rAFs (Safari first-paint flash guard) | — |
| 0 → 2200 | Logo draws on an **OffscreenCanvas in a Web Worker** (keeps animating while the main thread is busy loading). Each glyph is a feathered L→R wipe clipped to the glyph, 1100 ms easeInOutCubic, 220 ms stagger | worker canvas |
| 0 → ~3000 | % odometer counts (JetBrains Mono 0.75rem, letter-spacing .15em, opacity .7, `#fff`), one masked 1ch column per digit; only the digits that change roll | 200 ms easeOutCubic + 70 ms hold |
| 2200 | Worker posts `done`. SVG fills switch on and the canvas is removed next frame (pixel-identical swap, so the vector can scale crisply later) | — |
| 3000 (= gate) | Gate = `loadingComplete && (logoDone ‖ >8s) && elapsed ≥ 3000`. % forced to 100 and rolls in | 200 ms |
| +400 | % `display:none`, a hard cut with no fade | — |
| +800 | `.bands-open`: top band `translateY(-100%)`, bottom band `translateY(100%)`. The logo stays above the bands (z 4 over z 3) | **1600 ms `cubic-bezier(0.65,0,0.35,1)`** (easeInOutCubic) |
| +2500 (bands +1700) | `.loaded`: **logo FLIP to header**. Final layout applied instantly, inverted with one composited `translate()+scale()`, then played back | **transform 1000 ms `cubic-bezier(0.25,0.1,0.25,1)`** (CSS `ease`) |
| +2500 | Title group opacity 0→1 | 3 s `ease`, delay 0.3 s |
| +2700 → | Title letters in **random order**: opacity 0→1 + `blur(12px)`→0 | 1.2 s `expo.out`, delay 0.5 s + i·0.06 s |
| +3400 | CTA "construct-in": 1px line → full height, label scrambles at 50% height | 0.18 s `power3.out` |
| CTA hover | corner squares slide in 4→ touching, label double-blink | 0.3 s ease; 0.10 s `steps(1)` |
| CTA click | 50% black `::after` dim fades out (1.2 s `cubic-bezier(0.4,0,0.2,1)`). Title/CTA fade **and blur to 14px** (1.4 s same curve). Overlay manager fades in underneath with its logo on the same pixels, then the splash is removed in one frame | removal at `max(1200,1500)+200 = 1700 ms` |
| Replay | `sessionStorage.edolusReplay==='1'`: no counter, no min hold. The logo draw still gates. The flag is read and cleared | — |

The worst-case first visit takes about 6.5 s before the CTA appears. **That is too long for a conversion site.** We keep the grammar and compress it (§2).

### 1.2 rialto.com.au

- **Fade grammar** (`rialto-theme.css`): `.fade-in{opacity:var(--opacity); transform:translateX(var(--translate-x)) translateY(var(--translate-y)); transition: opacity, transform var(--fade-duration,.75s) var(--fade-delay,0s) cubic-bezier(.165,.84,.44,1)}`. `.fade-bottom` sets `--translate-y: min(25%, 10rem)`, which is a **large** travel (up to 160px). `.animated` resets it to 0.
- Trigger (`rialto-theme.js`): an IntersectionObserver with **`threshold: .25`**, unobserved after the first intersection (plays once, never reverses). Per-element `data-fade-settings='{"delay": 200, "duration": 750}'`. The hero copy uses delay 200 and the second image delay 300.
- Classes carrying `fade-in fade-bottom` (counts from `rialto.html`): module__head 6, module__body 4, module__media 4, module__image 4, module__nav 4, carousels 2, header__inner 1, footer parts. Whole blocks fade, never words or letters.
- **Hairline borders draw in**: `.borders [class^=border-]` uses `clip-path: inset(0 var(--clip-size) 0 0)` (horizontal) and `inset(0 0 var(--clip-size) 0)` (vertical) with `--clip-size:100%`, then `.is-visible{--clip-size:0}` with `transition: clip-path .6s linear`, then `.animated{clip-path:none}`. This is directly transferable to our **gold hairlines**.
- **Hero**: `section.module--hero > .module__background > .component--video > <media-player>` (Vidstack) with `src=…/2026/04/hero1-1.mp4`, `load="visible"`, `poster-load="lazy"`, `autoplay muted playsinline loop`, `aspect-ratio 16/9`, and config `{"autoplay":true,"load_strategy":"visible"}`. The headline "CELEBRATING 40 YEARS" uses fade-bottom 200/750.
- **Landing animation** (`.module--landing_animation`, cookie `efr-landing-animation=shown`, so it shows once ever). Three vertical bars (the Rialto mark) step through 3 states chained on `transitionend`: step-1 bars travel `0.6s cubic-bezier(0,0,0.2,1)`; step-2 bars exit to 50svh while the panel fills with colour (`background-color .5s ease-in-out, delay .3s`); step-3 `opacity 0` (.3s, delay .5s), and the node is removed 800 ms later. The default transform is `0.8s cubic-bezier(0.25,0.1,0.25,1)` with delay 0.3s. The page has `overflow:hidden` while it is present.
- **Swiper** carousels: `speed` 300 / 600, effects present in the CSS (fade, cube, cards, creative, coverflow, flip), `slidesPerView 1.6 → 4` by breakpoint, progressbar pagination, `autoplay.delay 3e3` (disabled by default). Rialto uses no GSAP and no Lenis.

**Takeaway.** Rialto's calm comes from one curve (easeOutQuart), one duration (750 ms), block-level reveals that never reverse, a hairline draw, and a muted looping video. Edolus contributes ceremony: logo self-draw, odometer, two-band curtain, logo FLIP to header, and a seamless handoff.

---

## 2. Tokens

### 2.1 Easing tokens

GSAP power names map to Penner curves like this: power1=Quad, power2=Cubic, power3=Quart, power4=Quint.

| Token | GSAP | CSS equivalent | Use |
|---|---|---|---|
| `--ease-quiet` (Rialto) | `power3.out` | `cubic-bezier(.165,.84,.44,1)` *(exact Rialto curve)* | default reveal, hovers, underline draw, card lift |
| `--ease-reveal` | `power4.out` | `cubic-bezier(.23,1,.32,1)` | masked headline lines |
| `--ease-cinema` | `expo.out` | `cubic-bezier(.16,1,.3,1)` *(= existing `--ease-out`)* | image curtain reveals, logo docking end |
| `--ease-curtain` | `expo.inOut` | `cubic-bezier(.87,0,.13,1)` | page-transition bands |
| `--ease-band` (Edolus) | `power2.inOut` | `cubic-bezier(.65,0,.35,1)` *(= existing `--ease-in-out`)* | preloader band open, stroke draw |
| `--ease-glide` | `power3.inOut` | `cubic-bezier(.76,0,.24,1)` | logo FLIP to nav, bg crossfades |
| `--ease-drift` | `sine.inOut` | `cubic-bezier(.37,0,.63,1)` | Ken Burns, marquee easing back |
| `--ease-linear` | `none` | `linear` | scroll scrub, marquee, hairline draw (Rialto uses linear) |
| `--ease-tick` | `power1.out` | `cubic-bezier(.5,1,.89,1)` | stat counters, tiny fades |

**Banned**: `back.*`, `elastic.*`, `bounce`, and `--ease-spring` on anything public-facing. The current `testimonial-card` uses `back.out(1.4)` and should change. Overshoot reads as playful, not composed ("Avoid: cheap visuals + fast animations").

### 2.2 Duration tokens

| Token | ms | Use |
|---|---|---|
| `--dur-instant` | 120 | press feedback, focus ring |
| `--dur-fast` | 250 | card lift, underline, colour swaps |
| `--dur-base` | 350 | Tier 1 fade-up |
| `--dur-medium` | 500 | Tier 2 stagger items, crossfades |
| `--dur-slow` | 750 | Rialto block fade, page crossfade-in, curtain band (each half) |
| `--dur-reveal` | 1100 | headline line mask, logo stroke draw |
| `--dur-cinema` | 1200 | image curtain (clip-path) reveal |
| `--dur-hold` | 1600 | preloader minimum hold |
| `--dur-drift` | 20000 | Ken Burns cycle (one direction) |
| Stagger | 0.06 (letters, never used for Arabic) / 0.08 (lines, words, cards) / 0.12 (sections of a hero) | — |

Mirror these as JS constants in `src/lib/motion.js` (`export const EASE = {quiet:'power3.out', …}; export const DUR = {base:.35, …}`) so CSS and GSAP never drift apart.

---

## 3. PRELOADER: the "KU orbit" sequence

### 3.1 Rules

1. **First visit per session only.** Gate with `sessionStorage.keuIntro`. A same-session reload or an internal navigation **never** shows it. A replay (like Edolus's `IS_REPLAY`) skips the counter and min hold and runs only a 900 ms mark + band open. Never block deep links such as `/packages#economy-umrah`: on non-home first entries, run the short replay variant.
2. **Paint it before React.** Put the markup (black field, inline SVG, bands) and critical CSS **inline in `index.html`** so it paints with first HTML. Without that, the bundle downloads behind a white screen. GSAP takes over once the bundle runs, and the inline CSS animation (stroke draw) can start without JS. This is our equivalent of Edolus's Web Worker: animation that survives a busy main thread. CSS `stroke-dashoffset` animations are not guaranteed to be compositor-only, so test it on a mid-tier Android.
3. **The gate is honest.** `gate = max(minHold 1600ms, logoDrawn, document.fonts.ready, heroPoster.decode())`, with a **4000 ms** safety cap. Do **not** wait for the video. It fades in later over the poster (§4).
4. **Ground colour** is the darkest logo green **`#003018`**, not pure black. Strokes and counter are gold **`#e0a028`**, and the counter is set in tabular numerals.

### 3.2 Timeline (first visit, best case; G = gate time ≈ 1600 ms)

| t (ms) | Element | Property | Duration | Ease |
|---|---|---|---|---|
| 0 | `#keu-intro` field `#003018`, `.preanim` guard (2 rAFs) | — | — | — |
| 80 → 1280 | **Gold orbit ring** (circle path, starts at ~225°, lower-left, where the swoosh begins) | `strokeDashoffset` len→0 (DrawSVG `0% → 100%`) | 1200 | `power2.inOut` |
| 380 → 1480 | **Swoosh path**, lower-left round to top-right | DrawSVG `0% 0% → 0% 100%` | 1100 | `power3.inOut` |
| 1300 → 1600 | **Aircraft** glyph at the swoosh end | opacity 0→1, `x:-6 → 0`, `rotate:-8 → 0` | 300 | `power3.out` |
| 700 → 1500 | **KU monogram + Kaaba + dome** (fills, green/black/gold). Edolus-style left→right wipe | `clipPath inset(0 100% 0 0) → inset(0 0% 0 0)` | 800 | `power2.inOut` |
| 1400 → 1600 | Crescent sparkle: gold crescent opacity .4→1 once (not a loop) | opacity | 200 | `power1.out` |
| 200 → G | **% counter** 20px under the logo, gold, 12px, letter-spacing .15em, opacity .7. Per-digit odometer like Edolus: 200 ms `easeOutCubic` steps + 70 ms holds. Lerp `0.10/frame` toward `max(realProgress, elapsed/1800)`, parked at 99 until the gate | — | — |
| G | Counter rolls to 100 | — | 200 | `power3.out` |
| G+250 | Counter disappears | opacity → 0 (or Edolus's hard cut) | 150 | `none` |
| G+300 → G+1300 | **Two bands** open: top `yPercent -100`, bottom `yPercent 100`. Each band's inner edge carries a **1px gold hairline** (`#e0a028`), which echoes the letterhead sweep edge. Behind them, the hero poster (+ video if playing) is already there | transform | 1000 | `power2.inOut` (Edolus curve, 1600→1000 ms) |
| G+500 → G+1400 | **Logo FLIP into nav**: `Flip.fit(introLogo, '.nav__logo-img', {scale:true})` translate + scale on one transform. The monogram goes to 48px, and the ring/aircraft strokes go to the same box | transform | 900 | `power3.inOut` |
| G+1400 | Handoff: nav logo `autoAlpha 1` set instantly (same pixels), then on the next rAF remove `#keu-intro`. No fade on the swap (Edolus §4) | — | 0 | — |
| G+800 → | **Hero headline** lines start (§5): eyebrow → H1 lines → Arabic line → CTAs | — | see §5 | — |
| G+1400 | `lenis.start()`, `document.documentElement.classList.remove('is-intro')`, `ScrollTrigger.refresh()` | — | — | — |

**Totals**: about 3.0 s to an interactive hero on first visit (Edolus: ≥ 5.5 s). The replay variant takes about 1.0 s. With reduced motion there is no preloader at all: a static logo for at most 300 ms, then a 200 ms opacity fade, only if the poster isn't ready yet.

### 3.3 Nav during the intro

While `html.is-intro` is set, hide `.nav__logo-img` (`visibility:hidden`, which keeps its layout box for the FLIP target). Fade the nav links in at G+1100 with Tier 2 (y 12, 500 ms, stagger 0.05). The nav **must not move** while the logo docks.

### 3.4 Code sketch: preloader timeline

```js
// src/motion/intro.js  (GSAP >= 3.13)
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(DrawSVGPlugin, Flip, ScrollTrigger)

const MIN_HOLD = 1.6, CAP = 4

export function runIntro({ heroPoster, replay = false }) {
  const root   = document.getElementById('keu-intro')         // inlined in index.html
  if (!root) return Promise.resolve()
  const q      = gsap.utils.selector(root)
  const lenis  = window.__lenis
  lenis?.stop()

  // ---- 1. draw phase ---------------------------------------------------
  const draw = gsap.timeline({ defaults: { overwrite: 'auto' } })
    .fromTo(q('.ku-ring'),    { drawSVG: '0%' },     { drawSVG: '100%', duration: 1.2, ease: 'power2.inOut' }, 0.08)
    .fromTo(q('.ku-swoosh'),  { drawSVG: '0% 0%' },  { drawSVG: '0% 100%', duration: 1.1, ease: 'power3.inOut' }, 0.38)
    .fromTo(q('.ku-mark'),    { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power2.inOut' }, 0.7)
    .fromTo(q('.ku-plane'),   { autoAlpha: 0, x: -6, rotate: -8 }, { autoAlpha: 1, x: 0, rotate: 0, duration: 0.3, ease: 'power3.out' }, 1.3)

  // ---- 2. honest counter (skip on replay) ------------------------------
  const counter = q('.ku-count')[0]
  const state = { shown: 0 }, t0 = performance.now()
  let real = 0                                     // feed from fonts/poster promises
  const tick = () => {
    const elapsed = (performance.now() - t0) / 1000
    const target  = Math.min(0.99, Math.max(real, elapsed / 1.8))
    state.shown  += (target - state.shown) * (1 - Math.pow(0.9, gsap.ticker.deltaRatio()))
    renderOdometer(counter, Math.round(state.shown * 100))   // per-digit roll, 200ms + 70ms hold
  }
  if (!replay) gsap.ticker.add(tick)

  const ready = Promise.all([
    document.fonts.ready.then(() => (real += 0.4)),
    heroPoster.decode().catch(() => {}).then(() => (real += 0.6)),
    new Promise(r => draw.eventCallback('onComplete', r)),
    new Promise(r => setTimeout(r, replay ? 0 : MIN_HOLD * 1000)),
  ])
  const capped = Promise.race([ready, new Promise(r => setTimeout(r, CAP * 1000))])

  // ---- 3. reveal phase --------------------------------------------------
  return capped.then(() => new Promise(resolve => {
    gsap.ticker.remove(tick)
    const navLogo = document.querySelector('.nav__logo-img')
    const tl = gsap.timeline({ onComplete: () => {
      gsap.set(navLogo, { visibility: 'visible' })            // same pixels, instant
      requestAnimationFrame(() => { root.remove(); document.documentElement.classList.remove('is-intro')
        lenis?.start(); ScrollTrigger.refresh(); sessionStorage.setItem('keuIntro', '1'); resolve() })
    }})
    if (!replay) tl.add(() => renderOdometer(counter, 100))
                   .to(counter, { autoAlpha: 0, duration: 0.15, ease: 'none' }, 0.25)
    tl.to(q('.ku-band--top'),    { yPercent: -100, duration: 1.0, ease: 'power2.inOut' }, 0.3)
      .to(q('.ku-band--bottom'), { yPercent:  100, duration: 1.0, ease: 'power2.inOut' }, 0.3)
      .add(Flip.fit(q('.ku-logo')[0], navLogo, { duration: 0.9, ease: 'power3.inOut', scale: true }), 0.5)
      .add(() => window.dispatchEvent(new CustomEvent('keu:intro-reveal')), 0.8)   // hero headline listens
  }))
}
```

`Flip.fit()` is part of the Flip plugin API. I checked that `Flip.js` exists in the installed gsap. I did not run the snippet in the repo.

### 3.5 Asset prerequisite (blocking)

`newlogo.png` is raster. The self-draw needs **a hand-traced SVG** with separate groups: `.ku-ring` (one closed path, stroke only, gold→green gradient through `<linearGradient>`; stroke-draw works with gradients), `.ku-swoosh` (one open path, start point lower-left, stroke-width tapered by drawing a filled shape as a stroked centreline plus a mask), `.ku-plane`, and `.ku-mark` (K, U, Kaaba, dome, crescent as fills). Until that SVG exists, the fallback is a radial `mask-image` sweep (conic-gradient mask, `--angle 0→360deg` over 1200 ms) over the PNG.

---

## 4. VIDEO HERO

### 4.1 Layers (bottom→top)
`<section class="hero" data-theme="dark">` → `.hero__media` (overflow hidden, `inset:0`, `height:100svh`) → `.hero__media-scrub` (receives scroll yPercent) → `.hero__media-kb` (receives Ken Burns scale) → `<img class="hero__poster">` + `<video class="hero__video">` → `.hero__scrim` (gradient overlay, receives darken) → `.hero__content` (headline, receives parallax).
Separate wrappers stop the scroll tween, the Ken Burns tween and the fade from fighting over one `transform`.

### 4.2 Behaviours

| Behaviour | Spec |
|---|---|
| Poster | `<img fetchpriority="high" decoding="async">` from Cloudinary using the **first frame of the clip** (`so_0` transformation), `f_auto,q_auto,w_1920` / `w_828` mobile. This is the LCP element. |
| Video element | `muted playsinline loop autoplay preload="metadata" disablepictureinpicture aria-hidden="true"`. Sources: mobile ≤ 767px a portrait 720×1280 cut (Pexels "Breathtaking View of Kaaba", vertical 1080×1920), desktop 1920×1080 H.264 ≤ ~4 MB (BRIEF §5 guidance), optional AV1/WebM first. Attach `src` only after the intro gate or `requestIdleCallback` so the video doesn't compete with the poster or fonts. Rialto does the same with `load="visible"`. |
| Poster → video | Wait for the `playing` event, then one `requestVideoFrameCallback` (or 2 rAFs) so a real frame is on screen. Then `gsap.to(video, {autoAlpha:1, duration:0.6, ease:'power1.out'})`. Never crossfade on `canplay`, which can still show black on iOS. |
| Ken Burns | `.hero__media-kb`: `scale 1 → 1.08`, **20 s**, `sine.inOut`, `repeat:-1, yoyo:true`, `transformOrigin:'50% 40%'` (biased toward the Kaaba). Pause it with the video when off-screen. |
| Scroll scrub | Trigger `.hero`, `start:'top top'`, `end:'bottom top'`, `scrub:0.6` (0.6 s catch-up smooths over Lenis). See the sketch for tweens. |
| Media parallax | The task brief asks for `yPercent: -15` on the video. Physically, a background that should feel *deeper* must move **slower** than the page, so it needs **`yPercent: +15`** (drifts down relative to its section while the section scrolls up). `-15` makes it race ahead, which flattens depth. **Recommendation: `yPercent: 15`** on `.hero__media-scrub`, with `.hero__media` overscanned by `top:-8%; height:116%` so no edge shows. If design insists on the brief's value, use `-15` with the same overscan. Flagged as a deliberate deviation. |
| Overlay darken | `.hero__scrim` base `linear-gradient(180deg, rgba(0,24,12,.55) 0%, rgba(0,24,12,.15) 45%, rgba(0,24,12,.70) 100%)` (green-black, from `#003018`). Scrubbed **opacity 0.55 → 0.92** on a solid `#001a0c` layer above it. Animate opacity only, never the gradient. |
| Headline parallax | `.hero__content`: `yPercent: -30`, `autoAlpha: 1 → 0` reached at 70% of the scroll range. The headline exits faster than the media, which gives depth. |
| Pause rules | IntersectionObserver on `.hero` (threshold 0): pause the video and the Ken Burns tween when out of view. Also pause on `visibilitychange` hidden. |
| **Pin?** | **No.** (a) A pin adds ~100-150vh of dead scroll before Packages and WhatsApp, the conversion path. (b) Pins on iOS fight the address-bar resize. (c) It spends one of the 1-2 pins per page we would rather use for the dark→light chapter (§6) or a Sanctuaries chapter. Rialto doesn't pin either. *Optional* desktop-only enhancement (≥1024px, motion-OK, not Save-Data): `pin:true, end:'+=40%'` with `pinSpacing:true`, only if user testing shows the hero needs more dwell time. |
| Mute/sound | No sound, and no unmute button. Pilgrimage footage with music raises licensing and respect issues. Out of scope. |

### 4.3 Code sketch: hero scrub

```js
// inside Hero component effect; gsap >= 3.13
useLayoutEffect(() => {
  const mm = gsap.matchMedia()
  const ctx = gsap.context(() => {
    mm.add({
      motion:  '(prefers-reduced-motion: no-preference)',
      reduce:  '(prefers-reduced-motion: reduce)',
    }, ({ conditions }) => {
      if (conditions.reduce || isSaveData()) return            // static poster, no tweens

      const kb = gsap.to('.hero__media-kb', {
        scale: 1.08, duration: 20, ease: 'sine.inOut', repeat: -1, yoyo: true,
        transformOrigin: '50% 40%',
      })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6,
          onToggle: ({ isActive }) => {                       // pause work off-screen
            const v = videoRef.current
            if (isActive) { v?.play().catch(() => {}); kb.resume() } else { v?.pause(); kb.pause() }
          },
        },
      })
      tl.to('.hero__media-scrub', { yPercent: 15 }, 0)          // see §4.2 note re: -15
        .to('.hero__darken',      { opacity: 0.92 }, 0)          // from 0.55 (CSS)
        .to('.hero__content',     { yPercent: -30 }, 0)
        .to('.hero__content',     { autoAlpha: 0, duration: 0.7 }, 0)  // 70% of range
    })
  }, heroRef)
  return () => { ctx.revert(); mm.revert() }
}, [])
```

`onToggle` handles the case where the hero is scrolled past. The IntersectionObserver is still needed for the initial off-screen state on deep-link entries.

---

## 5. Headline reveal

- **Plugin:** `SplitText` (gsap ≥ 3.13), `type:'lines'`, `mask:'lines'`, `autoSplit:true`, `linesClass:'line'`, with the tween returned from `onSplit` so it re-splits cleanly on resize or font swap. The 3.13 release adds `aria-label` to the parent and `aria-hidden` to the pieces automatically.
- **Motion:** `yPercent: 110 → 0`, **1.1 s, `power4.out`, stagger 0.08**. The eyebrow does a Tier-1 fade 0.35 s; the subtitle does `autoAlpha 0→1, y 12→0`, 0.75 s `power3.out`, starting 0.3 s after the last line begins; the CTAs get Tier-2 stagger 0.08.
- **Mask padding:** line masks clip descenders and diacritics. Give the line wrapper `padding-block: .12em; margin-block: -.12em` (Latin) and **.3em / -.3em for Arabic/Urdu**.
- **Ordering in the hero** (relative to `keu:intro-reveal`, or 0.4 s after mount on subsequent visits): eyebrow at 0 → H1 lines at 0.12 → **Arabic line at 0.45** → subtitle at 0.6 → CTAs at 0.8 → scroll cue at 1.2.

### Arabic / Urdu rules (خدمات ضيف الرحمن)
1. Markup: `<p class="hero__arabic" lang="ar" dir="rtl">`. Urdu uses `lang="ur"`. Keep `letter-spacing: 0`; tracking breaks cursive joins.
2. **Never split characters.** Per-letter spans break contextual shaping (initial, medial and final forms) and kashida in most engines. `SplitText` with `type:'chars'` is forbidden on Arabic-script nodes. Add a `data-split="words"` guard in the split utility that throws in dev if chars are requested on `:lang(ar), :lang(ur)`.
3. **Words only, or the whole line.** Prefer a **single-line block reveal**: `autoAlpha 0→1, y 14→0, 0.9 s power3.out`, with no mask, so diacritics and the tall Amiri ascenders are never clipped. If a word stagger is wanted: `SplitText(el, {type:'words'})`, stagger 0.08 in **DOM order**. DOM order already equals RTL reading order, so the stagger runs right→left visually with no extra logic.
4. Direction-aware motion: any horizontal travel flips under `[dir=rtl]` (`x: isRTL ? -16 : 16`). The nav underline origin flips too (§8).
5. `autoSplit` re-splits on font load. Amiri loads late, so the split *must* wait for `document.fonts.ready` or use `autoSplit`.

```js
SplitText.create('.hero__title', {
  type: 'lines', mask: 'lines', autoSplit: true,
  onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.08 }),
})
gsap.from('.hero__arabic', { autoAlpha: 0, y: 14, duration: 0.9, ease: 'power3.out', delay: 0.45 })
```

---

## 6. Scroll reveal grammar (3 tiers + hairline)

All reveals play **once** (`once:true`), never reverse, like Rialto (`unobserve` after first intersection). The current hook uses `toggleActions:'play none none reverse'`, which re-hides content when you scroll back up. That looks restless; remove it.

| Tier | Applies to | From → To | Dur | Ease | Trigger |
|---|---|---|---|---|---|
| **T0 hairline** (Rialto borders) | gold 1px rules, section dividers, card top borders | `scaleX 0→1` (origin left; right in RTL). Vertical rules: `scaleY` | 0.8 s | `power2.inOut` (Rialto used .6s `linear` clip-path; transform is cheaper) | `start:'top 90%'` |
| **T1 fade-up** | eyebrows, small text, meta, single paragraphs, buttons | `autoAlpha 0, y 12` → `1, 0` | **0.35 s** | `power3.out` | `start:'top 90%'` |
| **T2 stagger** | card grids (packages, services, why-us, team), FAQ items, stat tiles, footer columns | `autoAlpha 0, y 24` → `1, 0`, stagger **0.08**, at most 8 children per batch | **0.5 s** | `power3.out` | `ScrollTrigger.batch(sel, {start:'top 85%', once:true, onEnter: b => gsap.to(b, …)})` |
| **T3 curtain image** | sanctuary photos, about imagery, gallery feature tiles, CTA banner image | wrapper `clipPath: 'inset(100% 0% 0% 0%)' → 'inset(0% 0% 0% 0%)'` (rises from the bottom); inner img `scale 1.15 → 1` over the same span | **1.2 s** | `expo.out` | `start:'top 80%'` |
| **Section heading** | `.section-heading` H2 | SplitText lines mask, `yPercent 110→0`, 0.9 s `power4.out`, stagger 0.06. Eyebrow T1 first; the hairline under the heading T0 at +0.2 s | — | — | `start:'top 85%'` |
| Block fade (Rialto homage) | large text-and-media modules where splitting would be noisy | `autoAlpha 0, y 40` (we cap Rialto's `min(25%,10rem)` at 40px) | **0.75 s** | `power3.out` (Rialto's exact curve) | `start:'top 80%'` (≈ Rialto threshold .25) |

Notes
- Elements already in the viewport on load are handled automatically: ScrollTrigger fires `onEnter` at creation.
- Stat counters: keep the existing `[data-count]` logic, but use 1.6 s `power3.out` (currently 2.4 s `power1.out`) and `font-variant-numeric: tabular-nums` so widths don't jitter. Optionally reuse the Edolus per-digit odometer for "25,000+".
- Hide only when JS is running: initial hidden states are set by GSAP (`gsap.set` / `from`), never by CSS. If JS fails, content stays visible.

---

## 7. Section transitions

### 7.1 Dark → light surface (hero chapter → paper)
- The site has two surfaces: **deep green** (`#003018` / `#083820` family; hero, Qafila, footer) and **paper** (`#f8f8f8`, letterhead field).
- **Mechanism:** one `position:fixed; inset:0; z-index:-1` **`.bg-stage`** containing two full-viewport layers, `.bg-stage__dark` and `.bg-stage__paper`. Each section declares `data-surface="dark|paper"`. A ScrollTrigger per boundary scrubs the **opacity** of `.bg-stage__paper` 0→1 across `start:'top 75%' → end:'top 25%'` of the first paper section, with `scrub:true` and `ease:'none'`. Text colour on that section flips via a class toggled at the midpoint (`onUpdate` at progress ≥ .5 → `section.classList.add('is-ink')`, colours transition 250 ms).
- Sections in the crossfade zone have `background: transparent` so the stage shows through.
- **Why not tween `background-color` on a pin?** `background-color` repaints every frame. Crossfading two opacity layers is compositor-only. It also costs **zero pins**. The fixed stage looks pinned without a ScrollTrigger pin.
- Paper → dark (into Qafila / footer) uses the same mechanism reversed.
- If one pin is spent anywhere, spend it on **Sanctuaries** (Makkah ↔ Madinah chapter): pinned 150% with a Flip or curtain swap between the two images. That is optional and the only extra pin.

### 7.2 Marquees
| Marquee | Content | Speed | Behaviour |
|---|---|---|---|
| Motto band | `FAITH × JOURNEY × TOGETHER` (letterspaced, gold on green) | **40 px/s** desktop, **28 px/s** mobile | `gsap.to(track, {xPercent:-50, repeat:-1, ease:'none', duration: trackWidth/2/speed})` over a duplicated track |
| Partners / services ticker (paper) | icons + labels | 32 px/s | same |
| Arabic phrases (if used) | خدمات ضيف الرحمن · لبيك اللهم لبيك | 28 px/s, **direction reversed** (moves left→right, the RTL reading flow) | `dir="rtl"` on the track |
- **Scroll-velocity coupling:** `ScrollTrigger.create({onUpdate: s => boost = clamp(1, 2.5, 1 + Math.abs(s.getVelocity())/1500)})`, `gsap.to(marqueeTl, {timeScale: boost, duration: 0.2})`, then ease back to 1 over 0.6 s `sine.inOut`. Do not flip direction with scroll direction; it reads as twitchy.
- Pause when off-screen (`ScrollTrigger` `onToggle`). Pause on hover only if items are links.
- Reduced motion: no animation. Render a static centred line.

---

## 8. PAGE TRANSITIONS (React Router 6, `<BrowserRouter>`)

### 8.1 Choice
- **Route change between top-level pages** (Home ↔ Packages ↔ About ↔ Gallery ↔ Contact): **two-band curtain wipe**. It reuses the preloader bands (green `#003018` + gold hairline edge), so the system is consistent.
  - Cover: bands `yPercent ±100 → 0`, **700 ms `expo.inOut`**.
  - Covered hold: swap route, scroll to top, refresh. Min 120 ms, max 400 ms (wait 2 rAFs + `document.fonts.ready` + first above-fold image decode, capped).
  - Reveal: bands `0 → ∓100`, **700 ms `expo.inOut`**. The new page's hero/PageHeader headline starts at 40% of the reveal.
  - A small static KU mark (32px) fades in on the closed bands at 60% of cover (150 ms) and out at reveal start.
  - Total: about 1.5-1.8 s.
- **Back/forward (popstate):** same curtain at **500 ms `expo.inOut`** each way, so history browsing feels faster.
- **Same-page hash links** (`/packages#economy-umrah` from `/packages`): **no curtain**. `lenis.scrollTo(el, {offset:-64, duration:1.2})`.
- **Cross-page hash links** (`/#faq` from `/about`): curtain, then jump under cover to the anchor (`useScrollRestoration` already does hash logic).
- **Fallback / reduced motion:** **crossfade**. Old `main` `autoAlpha 1→0` 250 ms `power1.out`, swap, new `main` `autoAlpha 0→1` 350 ms `power1.out`, no y movement. With Save-Data: instant swap.
- `/admin/*` is **never** involved. The transition wrapper only wraps the public routes, and admin `Route`s keep rendering on the live location.

### 8.2 Mechanism (no data router)
```jsx
// src/components/TransitionRoutes.jsx (sketch)
export default function TransitionRoutes({ children }) {
  const location = useLocation()
  const [display, setDisplay] = useState(location)
  const curtain = useRef(null)
  const busy = useRef(false)

  useLayoutEffect(() => {
    if (location.key === display.key) return
    const samePath = location.pathname === display.pathname
    if (samePath || location.pathname.startsWith('/admin') || prefersReduced()) {  // hash-only or admin
      setDisplay(location); return
    }
    if (busy.current) { setDisplay(location); return }   // rapid double-click: jump straight there
    busy.current = true
    const pop = navigationType === 'POP'
    const d = pop ? 0.5 : 0.7
    const lenis = window.__lenis
    lenis?.stop()
    gsap.timeline({ onComplete: () => (busy.current = false) })
      .set(curtain.current, { autoAlpha: 1 })
      .fromTo('.pt-band--top',    { yPercent: -100 }, { yPercent: 0, duration: d, ease: 'expo.inOut' }, 0)
      .fromTo('.pt-band--bottom', { yPercent:  100 }, { yPercent: 0, duration: d, ease: 'expo.inOut' }, 0)
      .add(() => flushSync(() => setDisplay(location)))       // old page unmounts → its gsap.context reverts
      .add(() => waitCovered().then(() => {                    // 2 rAF + fonts + hero img, ≤ 400ms
          restoreScroll(location)                              // jumpTo(0 | hash) with immediate:true, force:true
          ScrollTrigger.refresh()
          lenis?.start()
          window.dispatchEvent(new CustomEvent('keu:page-reveal'))
        }))
      .to('.pt-band--top',    { yPercent: -100, duration: d, ease: 'expo.inOut' }, '>+0.12')
      .to('.pt-band--bottom', { yPercent:  100, duration: d, ease: 'expo.inOut' }, '<')
      .set(curtain.current, { autoAlpha: 0 })
  }, [location])

  return (<>
    <Routes location={display}>{children}</Routes>
    <div ref={curtain} className="pt-curtain" aria-hidden="true"><div className="pt-band--top"/><div className="pt-band--bottom"/></div>
  </>)
}
```
The sketch is illustrative: `.add(promise)` doesn't pause a timeline, so the real code needs to split the timeline into cover and reveal, or call `tl.pause()` and `tl.resume()`.

### 8.3 Coordination rules
1. **`useScrollRestoration` must key off the *displayed* location, not the URL.** Today it runs in `App` on `useLocation()` and would jump the old page while it is still visible. Change it to accept a location (`useScrollRestoration(displayLocation)`) or export `restoreScroll(loc)` and call it inside the covered phase as above. Keep the existing `jumpTo` (Lenis `immediate:true, force:true`) because it is correct.
2. **Lenis:** `stop()` at cover start, so no inertia carries into the new page (Lenis 1.3's `stopInertiaOnNavigate` helps but is not enough). Then `scrollTo(…, {immediate:true, force:true})` under cover, then `start()` after `ScrollTrigger.refresh()`.
3. **ScrollTrigger:** each page's `gsap.context().revert()` runs on unmount and kills its triggers. Call `ScrollTrigger.refresh()` once after the new DOM is in place and **again when `/api/content` resolves** (SiteContext replaces default data, which changes heights).
4. **Persistent chrome:** move `PublicShell` to a **layout route** (`<Route element={<PublicShell/>}>` + `<Outlet/>`) so Nav, Footer and WhatsApp FAB don't remount per route. Stack the curtain **under the Nav** (Nav z 100, curtain z 90). The nav stays put while content wipes, which keeps the logo continuous. (`App.jsx` routing is public-site code; admin routes are unaffected.)
5. Focus management: after reveal, move focus to `#main-content` (`tabindex="-1"`) and announce the page title via an `aria-live="polite"` region. Without this the curtain hides the context change from screen-reader users.
6. Optional: native **View Transitions API** (`document.startViewTransition`) as a progressive enhancement for the crossfade path. Not required.

---

## 9. Micro-interactions

| Element | Spec |
|---|---|
| **Magnetic WhatsApp FAB** | Only `(hover:hover) and (pointer:fine)`. Within a **90px** radius of its centre, the button follows the pointer: `x,y = delta * 0.35`, clamped to **±12px**, via `gsap.quickTo(el,'x',{duration:0.45, ease:'power3.out'})` (same for y). The inner icon moves `delta * 0.15` extra for parallax. On leave it returns to 0 over 0.6 s `power3.out` (no elastic). Hover: background `#25D366`→ slightly deeper, plus a 1px gold ring scale 1→1.15 / opacity .6→0 (one shot, 600 ms `power2.out`). Entrance: after the intro or first page reveal, `autoAlpha 0, scale .8 → 1`, 0.5 s `power3.out`, delay 1.2 s. **No idle pulse loop.** Touch devices: static, press `scale .96` 120 ms. |
| **Nav link underline** | `::after` 1px `#e0a028`, `bottom:-4px`, `transform: scaleX(0)`, `transform-origin: right` → hover `scaleX(1)` with `origin: left`, `transition: transform 300ms cubic-bezier(.165,.84,.44,1)`. On leave it draws through: origin stays right as it collapses. Swap left and right under `[dir=rtl]`. Active route keeps `scaleX(1)`. Focus-visible looks the same as hover. |
| **Card hover lift** (package, sanctuary, team) | `transform: translateY(-4px)`, **250 ms `cubic-bezier(.165,.84,.44,1)`**. Shadow lives on `::after` (pre-rendered `0 18px 40px -18px rgba(0,48,24,.35)`) with `opacity 0→1`, never animated `box-shadow`. Card image `scale 1 → 1.04`, 600 ms same curve, inside `overflow:hidden`. Gold top hairline `scaleX .3 → 1`, 400 ms. Only under `(hover:hover)`. |
| Buttons (primary gold / ghost) | Press `scale .98`, 120 ms. Hover: background fills from left via `::before scaleX 0→1`, 350 ms `power3.out`; text colour swaps at 50%. Arrow icon `x: 0→4px`, 250 ms (flipped in RTL). |
| Package filter chips | Active indicator slides between chips with `Flip.from(state, {duration:.45, ease:'power3.inOut'})`. Grid re-order: `Flip` with `absolute:true`, items fade 250 ms. |
| FAQ accordion | Height via `gsap.to(panel,{height:'auto', duration:.45, ease:'power3.inOut'})`, chevron rotate 180°, 300 ms. |
| Nav on scroll | After 80px: nav background `#003018` at 0→0.92 opacity (layer opacity), height 88→64px **via `scaleY` of a background layer** not `height`. 350 ms `power3.out`. Hide on fast scroll-down (velocity > 1200 px/s): `yPercent -100`, 400 ms `power3.inOut`. Show on any scroll-up. |
| Cursor | No custom cursor. Off-brand and an accessibility cost. |

---

## 10. Reduced-motion · low-end · Save-Data matrix

Detection (one module, `src/lib/motionEnv.js`):
- `reduce = matchMedia('(prefers-reduced-motion: reduce)').matches` (listen for changes via `gsap.matchMedia`)
- `saveData = navigator.connection?.saveData === true || /(^|-)2g|3g/.test(navigator.connection?.effectiveType || '')`
- `lowEnd = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || isLowEndGPU()` (reuse the existing `useThreeScene.isLowEndGPU`)
- `touch = matchMedia('(hover: none)').matches`

| Feature | Full | Low-end | Save-Data / slow net | Reduced motion |
|---|---|---|---|---|
| Preloader | full sequence (§3) | no counter, short variant (≈1.2 s) | **none.** Inline logo for ≤ 300 ms only if needed | **none.** Static logo then 200 ms fade |
| Hero video | 1080p / 720p portrait | 720p only | **poster only** (never set `src`) | **poster only** + optional visible "Play film" button (user-initiated) |
| Ken Burns | 20 s yoyo | on | n/a (poster: off) | off |
| Hero scrub (parallax, darken) | on | darken only, no parallax | darken only | off (static scrim at 0.7) |
| Headline lines mask | 1.1 s lines | words → single block fade 0.6 s | block fade 0.6 s | **opacity 0→1, 200 ms**, no y |
| T1/T2 reveals | on | T1 on, T2 stagger 0.04 | on | opacity only, 200 ms, no stagger |
| T3 curtain images | clip-path 1.2 s | opacity 0.6 s | opacity 0.6 s | none (visible immediately) |
| Hairline draw | on | on | on | static |
| Dark→light crossfade | scrubbed | scrubbed | scrubbed | **hard switch** at the boundary (class toggle, 0 ms) |
| Marquees | 40/28 px/s + velocity | no velocity boost | on | **static** |
| Page transitions | curtain 700 ms | crossfade 250/350 | instant | crossfade **opacity only, 200 ms** (or instant) |
| Magnetic FAB / card lift | on | lift on, magnetic off | on | lift → **colour/shadow only**, no movement |
| Lenis | on | on | on | **off** (native scroll, already done in `useLenis`) |
| Three.js particles | **retire** (see note) | off | off | off |

Note on Three: the video hero replaces the gold particle dome. Running WebGL particles on top of a decoded video doubles GPU cost on the hero, and `useThreeScene` hard-codes navy `#0d1b35`. Recommendation: remove it from the hero. If kept, use a desktop-only, high-end-only, ≤1500-particle gold-dust layer at 0.3 opacity.

The existing CSS approach (zeroing `--duration-*` under reduced motion in `tokens.css`) stays for CSS transitions. GSAP paths must branch through `gsap.matchMedia()`, because a CSS token can't stop a JS tween.

---

## 11. Performance rules

1. **Animate only `transform` and `opacity`** (plus `clip-path` for T3 and the intro mark wipe, which are paint-only and short). Never animate `width/height/top/left/box-shadow/filter/background-color` on scroll. Edolus moved its logo dock from `width` to a FLIP transform for exactly this reason (mobile lag, see their comment in `dockLogo`).
2. **`will-change` budget: ≤ 4 elements at a time.** Set it in `onEnter` / `onStart` and clear it with `clearProps:'willChange'` in `onComplete`. The permanent exceptions are the hero media wrapper and the fixed `.bg-stage` layers. Never put a blanket `will-change` in CSS on card grids.
3. **Pins: maximum 1 per page, 2 in the absolute worst case.** Home planned: 0 pins (hero not pinned), plus optionally 1 for Sanctuaries.
4. **Lenis ↔ GSAP wiring.** Replace the private rAF loop in `useLenis` with:
   ```js
   const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, touchMultiplier: 1.5, anchors: false })
   lenis.on('scroll', ScrollTrigger.update)
   const raf = (time) => lenis.raf(time * 1000)
   gsap.ticker.add(raf)
   gsap.ticker.lagSmoothing(0)
   // cleanup: gsap.ticker.remove(raf); lenis.destroy()
   ```
   That is the README pattern for lenis 1.3.23 (lines 141-156). One clock drives everything, and scrubbed tweens and Lenis stay in the same frame. Keep the existing custom anchor handler (it applies the -64 offset), or switch to `anchors:{offset:-64}`. Also add `import 'lenis/dist/lenis.css'` (README line 128), which provides `html.lenis` and `[data-lenis-prevent]` rules. Mark the mobile menu and any modals `data-lenis-prevent`.
5. **`ScrollTrigger.refresh()` triggers:** after `document.fonts.ready`; after the hero video `loadedmetadata` **only if** hero height depends on aspect ratio (it shouldn't: use `100svh`); after `/api/content` resolves in SiteContext; after Gallery images load (debounced 200 ms via `ScrollTrigger.refresh` on `load` events of above-fold images); after a page transition's covered phase. Also set `ScrollTrigger.config({ ignoreMobileResize: true })` to stop refresh storms from the iOS URL bar.
6. **React hygiene:** every animation lives in `gsap.context(…, scopeRef)` inside `useLayoutEffect` (or `@gsap/react`'s `useGSAP`, an optional extra dependency) and reverts on unmount. StrictMode double-invokes effects in dev; `context.revert()` makes that safe. Remove global `document.querySelector` targeting in `useGsapAnimations` in favour of scoped selectors.
7. **Video budget:** hero file ≤ 4 MB desktop, ≤ 2 MB mobile, 8-15 s loop, no audio track (strip it, which saves bytes and avoids the autoplay policy). One video decoder at a time: any later section video (Rialto has vid3, vid5) loads only on `IntersectionObserver` enter and pauses on exit.
8. **Fonts:** splitting must happen after fonts load (`autoSplit` handles it), otherwise lines re-break when Playfair/Amiri swap in.
9. **Main-thread safety during intro:** keep the intro's per-frame JS tiny (one odometer tick). Defer non-critical work (analytics, Cloudinary prefetch, the Three import) to after `keu:intro-reveal` via `requestIdleCallback`.
10. **Measure:** Lighthouse mobile with the intro on and off. LCP must stay under 2.5 s on 4G. See the unverified note on whether an opaque overlay affects LCP.

---

## 12. Changes required in the existing hooks (for the implementation phase; nothing changed now)

| File | Change |
|---|---|
| `src/hooks/useLenis.js` | Drive it from `gsap.ticker` + `lenis.on('scroll', ScrollTrigger.update)` + `lagSmoothing(0)`. Import `lenis/dist/lenis.css`. Expose `window.__lenis` as today. |
| `src/hooks/useScrollRestoration.js` | Accept a location argument, or export `restoreScroll(loc)` for `TransitionRoutes` to call under cover. Keep `jumpTo`. |
| `src/hooks/useGsapAnimations.js` | Rewrite to the tier grammar (§6). Use `once:true`, scoped `gsap.context(…, ref)`, `ScrollTrigger.batch`, `gsap.matchMedia()` for reduced motion. Drop `back.out` and the particle scrub. Move the hero timeline into the Hero component, triggered by `keu:intro-reveal` / `keu:page-reveal`. |
| `src/hooks/useThreeScene.js` | Retire from the hero (or recolour to the gold-on-green palette and gate to high-end desktop). |
| `src/App.jsx` | `PublicShell` becomes a layout route. Public routes are wrapped in `TransitionRoutes`. Admin routes untouched. |
| `index.html` | Inline intro markup and critical CSS (§3.1). |
| `package.json` | `"gsap": "^3.13.0"`. Optionally update `"lenis"` to `"^1.3.0"` to match what's installed. |

---

## 13. Unverified / open items
- I did **not** run any of the code sketches in the repo (read-only task). The Flip, SplitText and DrawSVG API names match the 3.13+ docs and the installed files, but integration is untested.
- The official 3.13 blog post names only SplitText and MorphSVG explicitly. Flip, ScrollSmoother and DrawSVG are inferred from "ALL of the bonus plugins" and from their presence under the no-charge license in the installed 3.15.0 package.
- Whether a full-screen opaque preloader delays or affects **LCP** measurement (Chrome's LCP doesn't account for occlusion as far as I know) is **unverified**. Measure with Lighthouse / Web Vitals before shipping.
- That CSS `stroke-dashoffset` animation keeps running smoothly while the main thread is busy is **not guaranteed**. Edolus uses a Worker + OffscreenCanvas because of this. Test on a mid-tier Android, and consider a worker canvas port if it janks.
- Per-character splitting breaking Arabic shaping is a well-known engine behaviour, but I did not test it in this project's fonts (Amiri). The rule "no char split for Arabic" stands regardless.
- The exact first-frame poster offset and the trimmed loop for the chosen Pexels/Pixabay clip are not selected yet. Licence per clip still needs checking (BRIEF §5).
- A traced SVG of the KU logo (ring, swoosh, aircraft, monogram) **does not exist**. It is a blocking asset for the stroke self-draw (§3.5).
- I couldn't observe Rialto's and Edolus's live runtime (no browser session). Every value here comes from their shipped source files, not from frame-timing captures.

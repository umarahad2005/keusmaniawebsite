# 21st.dev component sweep for the KEUI rebrand

Researcher: 21st.dev sweep · Date: 2026-10-10 · Read with `research/BRIEF.md`.
Raw evidence in `scratchpad/research/21st/`: category listings `cat-*.md`, metadata dumps `meta.txt`, and Hyperiux source files `hyperiux-src/*.tsx`.

---

## 0. How this was verified, and its limits

- **Metadata source.** Every component page has a markdown twin (`https://21st.dev/@<author>/components/<slug>.md`). Each twin lists the description, author, **License**, Tags and **npm dependencies**. I fetched about 175 of these with curl and read the fields verbatim. All license and dependency claims below come from those pages.
- **Component source is gated.** The registry endpoint `https://21st.dev/r/<author>/<slug>` returns `403 {"error":"Authentication required"}` without a 21st API key. Installing goes through `npx shadcn@latest add ...?api_key=$API_KEY_21ST`, and free accounts have a daily install limit. As a result, **I could not read the source of most 21st components**. Where this file gives exact durations, eases or clip-paths for those components, the values are **my proposals** and are labelled "proposed".
- **One exception: Hyperiux Vault.** Its source is public at https://github.com/Hyperiux-Immersion-Labs/hyperiux-components (`registry/effects/**/index.tsx`). I downloaded 7 of its components, and every Hyperiux number in this file is quoted from that code.
- **Licence meanings used here:**
  - `mit`, `MIT` or `MIT-0`: usable.
  - `unknown`: **not usable commercially until the author confirms a licence.**
  - `no-license`: all rights reserved by default, so **not usable**. Reimplement the idea from scratch.
  - `MIT + Commons Clause`: usable in a site, but must not be resold as a component. Flagged.
- **Hyperiux licence caveat.** 21st.dev labels Hyperiux components "mit". The GitHub repo, however, says the CLI is MIT and the **effects** fall under `LICENSE_EFFECTS` ("Hyperiux Effects License v1.0"). That licence allows use and modification in unlimited commercial projects with no attribution required (§2). It forbids redistributing an effect as a standalone snippet, template or library, and forbids removing the embedded copyright notice (§3). **Shipping it inside keusmania.vercel.app is allowed.** Keep the header notice in any file derived from it.
- **Stack facts checked in the repo (read-only):**
  - `keu-website/package.json` declares `"gsap": "^3.12.5"`, `"lenis": "^1.1.13"` and `"three": "^0.160.0"`. There is no Tailwind and no framer-motion or motion.
  - The **installed** GSAP is **3.15.0** (`node_modules/gsap/package.json`), and `node_modules/gsap/dist/` includes `SplitText.js` and `CustomEase.js`. GSAP made its formerly paid plugins free from 3.13 onward. **SplitText is therefore available to us today**, but the caret range still allows 3.12. Recommendation: bump the range to `^3.13.0` or higher so SplitText is guaranteed.
  - **Lenis and ScrollTrigger are not synced.** `src/hooks/useLenis.js` drives Lenis with its own `requestAnimationFrame` loop. It never calls `lenis.on('scroll', ScrollTrigger.update)` and never uses `gsap.ticker`. Every pinned or scrubbed component recommended below needs this fixed first, or pins will jitter and lag:
    ```js
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
    ```
    These lines replace the manual rAF loop. Keep `window.__lenis` and the reduced-motion early return.

**Universal porting rule.** Every 21st component is a React + **Tailwind** (shadcn-registry) file, and most use `motion` or `framer-motion`. None of them can be installed into our tree as-is. Treat each one as a **choreography reference** and port it like this:
1. Turn Tailwind classes into BEM-ish classes in `components.css`, using `tokens.css` custom properties (letterhead green and gold).
2. Turn `motion` springs and `whileInView` into `gsap.to/fromTo` with ScrollTrigger, or into `gsap.quickTo` for pointer-driven springs.
3. Turn `useScroll`/`useTransform` into a ScrollTrigger `scrub`.
4. Wrap each component's tweens in `gsap.context(() => {...}, ref)` inside `useLayoutEffect` and call `ctx.revert()` on cleanup. `@gsap/react`'s `useGSAP` is optional and would be a new dependency.
5. Use `gsap.matchMedia()` with `(prefers-reduced-motion: reduce)` for the static fallback.

---

## 1. Fullscreen video hero with scroll pin / reveal

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Hero Scroll Video Pin Reveal** | Ajith k v | https://21st.dev/@ajith66310/components/hero-scroll-video-pin-reveal | gsap | **MIT** | **High.** GSAP-only. Combines a SplitText word reveal, clip-path badges and a pinned video that expands to full screen. That is the same toolset we have. Source not readable (403), so the port is a reimplementation from the description. |
| Scroll Animated Video | scott clayton | https://21st.dev/@lovesickfromthe6ix/components/scroll-animated-video | GSAP ScrollTrigger + optional Lenis (no npm list) | **unknown** | Best functional match: sticky expanding media with depth darkening, a caption/heading overlay revealed on scroll, a "film-roll" headline exit, and Lenis teardown. **Do not copy without a licence.** |
| Hero Scrub | Jean Duthil | https://21st.dev/@jean.duthil13/components/hero-scrub | gsap | **unknown** | Draws an image sequence on canvas; a card scales from thumbnail to full cover and back. Respects reduced motion. Heavy on frames. Not usable without a licence. |
| Animated Video on Scroll | YoucefBnm (Systaliko UI) | https://21st.dev/@youcefbnm/components/animated-video-on-scroll | motion | MIT | Medium. Rewrite `useScroll` as a ScrollTrigger scrub. |
| Video Scroll Hero | Isaiah | https://21st.dev/@isaiahbjork/components/video-scroll-hero | framer-motion | **unknown** | Scales video from 25% to 100% while pinned. Simple to rebuild from scratch. |
| Airlock Spaceship Hero | Yura Oak | https://21st.dev/@yura/components/airlock-spaceship-hero | (none listed) | MIT | Scroll-locked video scrub. Off-brand theme; reference only. |
| Music Video Pin Stack | DesignLayer | https://21st.dev/@httpsdesign-layercomja/components/music-video-pin-stack | gsap | MIT | Pinned thumbnails rise while titles swap. Possible fit for a "Packages" or "Sanctuaries" chapter. |
| Cinematic landing Hero | Hossain Jahed | https://21st.dev/@jahed/components/cinematic-landing-hero | gsap | **unknown** | No description. Skip. |

**Top pick: Ajith "Hero Scroll Video Pin Reveal" (MIT, gsap) as the pattern, reimplemented.** It is the only MIT, GSAP-only option, and it maps onto the rialto feel: fullscreen muted loop and quiet copy.

**Port plan (all values proposed).**
- **Markup.** `section.hero` (100svh) → `.hero__media` holding `<video muted playsinline loop autoplay preload="metadata" poster>` → `.hero__scrim` (green-to-black gradient) → `.hero__copy`.
- **Load-in timeline.**
  - Eyebrow "خدمات ضيف الرحمن" fades in first.
  - Then the H1 "Your Journey to the Holy Land" comes in line by line: SplitText `type:'lines,words'` with `mask:'lines'` (SplitText 3.13+), `yPercent:110 → 0`, 0.9s, `power4.out`, stagger 0.06.
  - Then the CTAs fade up 16px in 0.75s with rialto's `cubic-bezier(.165,.84,.44,1)` (that curve is from the brief).
- **Scroll stage.**
  - Pin the hero with `start:'top top', end:'+=120%', scrub:1, pin:true`.
  - The video goes from full bleed to an inset card, `clip-path: inset(0 0 0 0 round 0)` → `inset(8% 6% 8% 6% round 24px)`, while the copy fades to 0. This reverses Ajith's "expand" so the next section has a framed Kaaba image to hand off from.
  - Alternative: start inset and expand to full, as Ajith does.
- **Reduced motion.** No pin and no scrub; show the poster image and the static copy.
- **Mobile.** Pin only at `min-width: 768px` via `gsap.matchMedia`.

## 2. Split-text / word / line reveal

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Rectangular Text Reveal** | Hyperiux Vault | https://21st.dev/@hyperiux/components/rectangular-text-reveal | gsap (SplitText, CustomEase, ScrollTrigger) | MIT on 21st / Hyperiux Effects License | **Very high, source read.** Per line, a solid block covers then uncovers the line. Verified values: `DEFAULT_STAGGER 0.2`, `COVER_DURATION 0.34`, `REVEAL_DURATION 0.42`, `OVERLAY_ENTER 0.24`, `OVERLAY_EXIT 0.28`, inset `0.08em`, `CustomEase.create("hyperEase","0.4,0,0.2,1")`, `start:"top bottom"`, `toggleActions:"play none none reset"`. Reduced motion: y 32 → 0, 0.9s, `power3.out`, stagger 0.12. Default colours #ea580c / #fff need replacing with gold / paper. |
| **Horizontal Feature Reveal** (line-mask part) | Hyperiux Vault | https://21st.dev/@hyperiux/components/horizontal-feature-reveal | gsap | MIT / HEL | **Source read.** Titles and copy use SplitText lines with `yPercent:100 → 0`, `stagger:0.08`, `duration:0.7`, `ease:"power2.out"`. The heading uses chars with `stagger 0.1`, `ease:"back.out"`, scrubbed from `top top` to `20% top`. |
| Text Animation | Ajith k v | https://21st.dev/@ajith66310/components/text-animation | gsap, @gsap/react | MIT | High: an editorial block-wipe line reveal with SplitText. Source not readable. |
| Text Reveal Block | soralabs | https://21st.dev/@soralabs/components/text-reveal-block | gsap, @gsap/react | **no-license** | Not usable. Same idea as the Hyperiux one. |
| Text Block Animation | daiv09 | https://21st.dev/@daiwiikharihar/components/text-block-animation | gsap, @gsap/react | **unknown** | Not usable. |
| Reveal Text | Pace UI | https://21st.dev/@paceui/components/reveal-text | gsap, @gsap/react | **no-license** | Not usable. |
| Vertical Cut Reveal | Daniel Petho (Fancy Components) | https://21st.dev/@danielpetho/components/vertical-cut-reveal | framer-motion | MIT | Medium. Its documented approach is solid: outer span `overflow:hidden`, inner span y 100 → 0, word boundaries kept in char mode, `staggerFrom` first/last/center/random. Translates directly to SplitText `mask` plus `stagger:{from:'center'}`. |
| Word Pull Up | Dillion Verma (Magic UI) | https://21st.dev/@dillionverma/components/word-pull-up | framer-motion | MIT | Trivial in GSAP. |
| Blur Fade | Magic UI | https://21st.dev/@dillionverma/components/blur-fade | framer-motion | MIT | Trivial: `filter: blur(6px) → 0` with opacity. Use sparingly; blur is costly on video. |
| Text Reveal (Mask) / Dual Wipe Reveal | soralabs | https://21st.dev/@soralabs/components/text-reveal-mask · /dual-wipe-reveal | motion | no-license / MIT | Dual Wipe Reveal is MIT: two coloured curtain blocks sweep off a heading. Good concept for a gold-and-green double wipe. |

**Top pick: the Hyperiux line-mask reveal as the house default** (`yPercent 100 → 0`, 0.7s, `power2.out`, stagger 0.08). It is quiet and matches the letterhead's composure. Reserve **Rectangular Text Reveal** (gold block, `CustomEase 0.4,0,0.2,1`) for one or two display moments per page, such as the "Qafila e Shoq" title.

**Port.** This is already GSAP. Remove Tailwind, call `SplitText.create(el,{type:'lines',mask:'lines'})`, and re-split on resize with SplitText's `autoSplit:true` and `onSplit`. Two caveats:
- **Arabic and Urdu lines: do not split into chars**, because it breaks letter joining. Split by lines or words only, or skip the split and fade.
- Call `ScrollTrigger.refresh()` after `document.fonts.ready`.

## 3. Preloader / loading counter

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Block Transition** (as curtain mechanics) | Hyperiux Vault | https://21st.dev/@hyperiux/components/block-transition | gsap | MIT / HEL | **Source read.** Verified values: `ROWS 5`, `STAGGER_DELAY 0.12`, `COVER_DURATION 0.72`, `REVEAL_DURATION 0.68`, `ease "power3.inOut"`, `BLOCK_OFFSET_PERCENT 101`. Each row has two halves at `w-[51%]` (left and right) to avoid a seam. Content shift: scale 0.98 out and 1.02 in, blur 4px, 0.7s / 0.8s. Uses a fixed overlay at `z-999`. |
| **Stack Loader** | Hyperiux Vault | https://21st.dev/@hyperiux/components/stack-loader | gsap (SplitText) | MIT / HEL | **Source read.** Stacked images spread apart, with SplitText words. Verified values: `INTRO_EASE "cubic-bezier(0.25,1,0.5,1)"`, defaults `power2.inOut`, image stagger `{each:0.06, from:"center"}`, exit stagger `{each:0.04, from:"edges"}`, `fadeOutDuration 0.8`, text rotateX 90 → 0 with perspective 1000, text stagger 0.08. Image-heavy: it is an intro loader, not a % counter. |
| Swiss Poster Counter Preloader | Kedhareswer Naidu | https://21st.dev/@kedhareswer/components/slat-count-preloader | none (React only) | MIT | Counts 0 to 100 with sliding slats, then **splits into 8 blinds that slide off left and right**. Has a gate mode and reduced-motion support. Closest 21st match to edolus's counter plus curtain, but the vermilion Swiss style is off-brand. |
| Laser Text Writing Preloader | Kedhareswer Naidu | https://21st.dev/@kedhareswer/components/spotlight-laser-preloader | none | MIT | Writes the name stroke by stroke. The "draws itself" idea matches edolus's logo self-draw, but the neon theme is off-brand. |
| Loading Overlay | Ali Imam | https://21st.dev/@designali-in/components/loading-overlay | (none listed) | **unknown** | Counts 0% to 100% over 2s, then clips the overlay out. Exactly the mechanic we want, but **no licence**. |
| Arc Preloader Hero | Ruixen | https://21st.dev/@ruixen.ui/components/arc-preloader-hero | motion | **unknown** | A curved curtain rises in a single smooth arc. Beautiful idea (an arch); unusable without a licence. |
| Greeting Preloader | odysseyui | https://21st.dev/@odysseyui/components/components-preloaders-greetings | gsap, framer-motion | **no-license** | Not usable. A multilingual greeting cycle; we could do "Assalamu Alaikum / Welcome / خوش آمدید" ourselves. |
| Preloader | gaxocif204 | https://21st.dev/@gaxocif204/components/preloader | gsap | **unknown** | Slide-up exit. Not usable. |
| counter loader | Md afsar mahmud | https://21st.dev/@mdafsarx/components/counter-loader | styled-components | **unknown** | No. |

**Top pick: build it ourselves, using edolus's documented sequence (BRIEF §4) and Hyperiux Block Transition's curtain mechanics (MIT/HEL).** No 21st component combines logo self-draw, a % counter and a two-band curtain.

**Port spec.** The 101% offset, 51% halves and `power3.inOut` are verified from Block Transition; the rest is proposed.
1. Black (or deep green #003018) full-screen gate. The KU mark's outline draws via SVG `stroke-dasharray/dashoffset`, 1.6s, `power2.inOut`.
2. A % counter sits 20px below. Tween `{p:0}` to 100 with eased fill, hold at 99 until `document.fonts.ready` plus the hero video's `canplaythrough`, with a minimum hold of about 1.8s. Edolus uses 3000ms, which is long for a commerce site.
3. At 100 the counter fades in 0.2s. **Two bands** (top and bottom, each 50.5vh) slide `yPercent: ∓101`, 0.9s, `power3.inOut`, revealing the playing hero video.
4. The logo FLIPs to the nav slot (GSAP Flip plugin, which is in GSAP 3.13+ free).
5. A sessionStorage flag skips the preloader on repeat visits.
6. Reduced motion: a 300ms fade only.

## 4. Marquee / ticker

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Marquee** | Dillion Verma (Magic UI) | https://21st.dev/@dillionverma/components/marquee | none beyond Tailwind config | MIT | **Trivial, pure CSS.** Verified from the page: `@keyframes marquee { from {transform:translateX(0)} to {transform:translateX(calc(-100% - var(--gap)))} }` with `animation: marquee var(--duration) linear infinite`, plus a vertical variant. Duplicate the content 2–4×, `pause-on-hover`, `[reverse]` modifier. |
| Infinite Slider | Julien Thibeaut (Motion Primitives) | https://21st.dev/@ibelick/components/infinite-slider | framer-motion, react-use-measure | MIT | Medium. Adds speed-on-hover. Replicate with `gsap.to(track,{xPercent:-50, repeat:-1, ease:'none'})` and `tween.timeScale()` on hover. |
| Scroll Based Velocity | Magic UI | https://21st.dev/@dillionverma/components/scroll-based-velocity | framer-motion | MIT | Medium. Port with `ScrollTrigger.create({onUpdate: self => quickTimeScale(1 + Math.abs(self.getVelocity())/800)})`. |
| Scroll Velocity Text | Cnippet | https://21st.dev/@cnippet-dev/components/scroll-velocity-text | motion | MIT | Same as above. |
| Marquee Along SVG Path | Daniel Petho | https://21st.dev/@danielpetho/components/marquee-along-svg-path | motion | MIT | Text on a curved path, e.g. an orbit around the logo ring. Porting is high effort (MotionPath plugin). Nice for one moment only. |
| Marquee (Kibo UI) | Hayden Bleasel | https://21st.dev/@haydenbleasel/components/marquee | (none listed) | MIT | Fine alternative. |
| Text Marque / Infinite Ribbon | ui layout / Edwin Vakayil | (see meta.txt) | motion | **unknown** | Not usable. |

**Top pick: the Magic UI Marquee CSS keyframes.** Zero JS, one CSS block. Use it for the motto ticker "FAITH × JOURNEY × TOGETHER · خدمات ضيف الرحمن · 25,000+ PILGRIMS · SINCE 2005" (the copy comes from the brief) at a slow `--duration: 40s` or more. Do not add velocity skew: it reads as playful, and PRODUCT.md asks for composure. Respect `prefers-reduced-motion` with `animation-play-state: paused`.

## 5. Bento / feature grid

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Feature Overview Bento** | Mohammad Shehadeh (Hirael) | https://21st.dev/@mohammadshehadeh/components/feature-10 | lucide-react | MIT | **High (static).** Mixed cells: a quote with attribution, two metric tiles, a "latest drop" card and a 3-item list, all **on one hairline lattice**. The hairline lattice matches the letterhead's gold hairlines. |
| Feature Section with Bento Grid | Tommy Jepsen | https://21st.dev/@tommyjepsen/components/feature-section-with-bento-grid | lucide-react | MIT | High (static). |
| Bento Feature Grid | LN (lndev-ui) | https://21st.dev/@ln-dev7/components/bento-01 | lucide-react | **no-license** | Not usable. |
| Bento | KinfeMichael Tariku (Farm UI) | https://21st.dev/@kinfe123/components/bento | clsx, framer-motion | **unknown** | Not usable. |
| Bento Grid (casestudy-5) | Shadcnblocks.com | https://21st.dev/@shadcnblockscom/components/casestudy-5 | lucide-react | **unknown** | Not usable. |
| Stagger Reveal Grid | pulkitxm | https://21st.dev/@pulkitxm/components/stagger-reveal-grid | gsap | **no-license** | Not usable; we already have a card stagger. |
| Animated Features Bento with Live Diagrams | Kedhareswer Naidu | https://21st.dev/@kedhareswer/components/ink-orbit-features | (none) | (not fetched) | SaaS diagrams; off-brand. |

**Top pick: the Shehadeh Feature Overview Bento layout (MIT).** Use it for "Why Choose Us":
- quote tile: a pilgrim testimonial;
- metric tiles: 25,000+ pilgrims and 100% visa success;
- featured card: Qafila e Shoq;
- list: Saudi partners / guided ziyarat / 24-7 support.

**Port.** CSS Grid with `grid-template-areas`, 1px `--gold-hairline` borders via `gap:1px` on a gold background, and lucide icons swapped for `src/icons.jsx`. Motion is the brief's existing standard stagger (y 24, 0.5s, stagger 0.08).

## 6. Pricing / package cards

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Pricing Section** (Launch UI) | Mikolaj Dobrucki | https://21st.dev/@mikolajdobrucki/components/pricing | lucide-react | MIT | **High.** Plan cards with feature lists, a highlighted tier and glass effects. Static Tailwind markup. |
| Two-Plan Pricing Cards | LN (lndev-ui) | https://21st.dev/@ln-dev7/components/pricing-16 | lucide-react | MIT | High. A two-up card with a recommended highlight; useful for the Hajj vs Qafila comparison. |
| Pricing Section with Glowing Plan Card | Kedhareswer Naidu | https://21st.dev/@kedhareswer/components/afterglow-pricing | none | MIT | Canvas-painted glow and grain behind the featured card. Too showy for "quiet luxury"; at most take the idea of a soft inner glow on the VIP card. |
| Toggle Pricing Cards | Diar Muradi | https://21st.dev/@diarmuradi/components/pricing-7 | motion, lucide-react | **no-license** | Not usable. A tier toggle is not needed. |
| Pricing Card / Bento Pricing | Efferd | https://21st.dev/@efferd/components/pricing-card · /bento-pricing | (lucide) | **unknown** | Not usable. |
| Pricing Cards (Dali Agents) | Liana Pepanyan | https://21st.dev/@lyanchouss/components/pricing-cards/pricing-interaction | lucide-react | **unknown** | Not usable. |

**Top pick: the Launch UI Pricing Section (MIT) structure, without the billing toggle.**
- Card anatomy: Cloudinary image header (Makkah or Madinah) → tier eyebrow (ECONOMY / PREMIUM / VIP) → serif title → "from PKR …" or "Price on request" for Hajj → hairline divider → check list (`icons.jsx` check) → WhatsApp CTA.
- Highlighted tier: green field with gold hairline, inverted text.
- Hover (proposed): lift `y:-6`, image `scale 1.04`, 0.5s, `power3.out`. Implement in CSS (`transition: transform .5s cubic-bezier(.165,.84,.44,1)`); no GSAP needed.
- **Must keep** `PackageCard.jsx`'s data contract (`/api/content`, live package data) untouched. Restyle only.

## 7. Testimonial carousel

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Testimonials Columns** | Efferd | https://21st.dev/@efferd/components/testimonials-columns-1 | motion | MIT | **High.** Vertically auto-scrolling columns are the same mechanic as the Magic UI vertical marquee, so the port is pure CSS `translateY` keyframes with columns at different `--duration`s. |
| Circular Testimonials | Maxim Bortnikov | https://21st.dev/@maxim.bort.devel/components/circular-testimonials | react-icons, framer-motion | MIT | Medium. The page links a **vanilla HTML/CSS/JS version** (https://codepen.io/Northstrix/pen/QwWoYzZ), which is easier to port than the motion version. Image-led, which suits pilgrim photos. Check the CodePen's own licence and credit note before reuse (not verified). |
| Testimonial (draggable swap) | Anurag Mishra | https://21st.dev/@anurag-mishra22/components/testimonial | framer-motion | MIT | Medium. Drag-to-swap card stack. Port with GSAP Draggable (free in 3.13+) or plain pointer events. |
| Glass Testimonial swiper | Hossain Jahed | https://21st.dev/@jahed/components/glass-testimonial-swiper | (none listed) | **unknown** | Not usable. |
| Design Testimonial / Editorial Testimonial | Jatin Yadav | https://21st.dev/@jatin-yadav05/components/design-testimonial · /editorial-testimonial | framer-motion / next | **unknown** | The editorial typographic layout (rotated label, progress bar) is the most "Aman" of the set, but it has **no licence**. |
| Stacked Card Testimonials | Prashant Som | https://21st.dev/@prashantsom75/components/stacked-card-testimonials | next, lucide, framer-motion | **unknown** | Not usable. |
| Centered Testimonial | Efferd | https://21st.dev/@efferd/components/testimonials-1 | — | **no-license** | Not usable. |

**Top pick: two modes.**
- **(a) Single editorial quote** (my recommendation; built in-house, inspired by the unlicensed Jatin Yadav layout, concept only). One large serif quote at a time, an Arabic or Urdu phrase where authentic, and name/city/year with a 2px gold progress bar. Autoplay every 7s. Crossfade with the line-mask reveal from §2 (0.7s, `power2.out`). Prev/next buttons, `aria-live="polite"`, and pause on hover or focus.
- **(b) Efferd Testimonials Columns (MIT)** as a dense "wall of du'as / reviews" on the About page. Pure CSS.

## 8. FAQ accordion

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Accessible Accordion** | a11ypros | https://21st.dev/@a11ypros/components/a11y-accordion/with-default-open | none | MIT | **Very high.** Built on native `<details>/<summary>`, with single or multi-expand, focus-visible outlines and reduced-motion support (credit: Ryan Mack / a11ypros.com, per the page). |
| FAQ Section with About Stats | Kedhareswer Naidu (Ink Orbit) | https://21st.dev/@kedhareswer/components/ink-orbit-faq | none ("zero dependencies") | MIT | **Very high.** The accordion opens on a smooth **grid-row transition**, beside an about panel whose numbers **count up on scroll**. That combines our FAQ and Stats in one section. |
| Accordion Active Background | uiable | https://21st.dev/@uiable/components/accordion-active-bg | none | MIT | High. The open item gets a highlighted border and tint. Good visual cue on paper white. |
| Accordion with Plus/Minus | Cnippet | https://21st.dev/@cnippet-dev/components/v-accordion-5 | lucide-react (Base UI) | MIT | Medium (Base UI dependency). Take the plus-to-minus icon morph only. |
| FAQ Accordion | scrollxui | https://21st.dev/@scrollxui/components/frequently-asked-questions-with-accordion | motion | MIT | Word-by-word blur-in headline plus staggered items. Port the stagger only. |

**Top pick: the a11ypros Accessible Accordion (native details/summary), styled after uiable's active state.**
- **Height animation (proposed).** Wrap the answer in `.faq__panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.165,.84,.44,1)}`, with `[open] .faq__panel{grid-template-rows:1fr}` and an inner `overflow:hidden`. This is the same grid-row technique as Ink Orbit. Closing a `<details>` needs a small JS shim to delay removing `open`, or use the `::details-content` pseudo-element where supported.
- **Icon.** The gold "+" rotates 45° on open.
- **SEO.** Keep the existing `JsonLd.jsx` FAQ schema.
- **Ink Orbit** is the reference if we merge Stats with FAQ.

## 9. Fullscreen nav overlay / mega menu

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Immersive Full Screen Navigation** | Hyperiux Vault | https://21st.dev/@hyperiux/components/immersive-full-screen-nav | gsap | MIT / HEL | **Very high, source read.** The overlay opens with a clip-path polygon wipe. Verified values: `clipOrigin` default `"bottom"`, closedInitial `polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)` → open `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)` → closedFinal `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)`, so it exits through the top. Top, left and right origins also exist. `openDuration 1.2`, `closeDuration 1.2`, `ease "power4.inOut"`. Header and links run y → 0 at 0.6s `power2.out`, links stagger with `power2.out`, images use `power3.out`, and socials use `power2.out`. Big links at `text-[6vw]`, an image strip at `h-[18vw] w-[25vw]`, a hover underline at 1.5px. It handles reduced motion and the Escape key and tracks animation state. |
| Directional Menu | Hyperiux Vault | https://21st.dev/@hyperiux/components/directional-menu | gsap | MIT / HEL | **Source read.** A mega-menu dropdown whose content slides in from the direction of travel. Default `duration 0.26`, `ease "power2.out"`. Panel `rounded-[0.5vw]`, `shadow 0 20px 60px rgba(0,0,0,.08)`. A desktop mega-menu à la Aman. |
| Flipped Menu | Khoa Phan | https://21st.dev/@phandangkhoa96/components/flipped-menu | gsap, @gsap/react | MIT | A 3D card-flip menu. Too playful for this brand. |
| Fullscreen Navigation Menu | Ifedapo Oderinde | https://21st.dev/@xapski2671/components/fullscreen-navigation-menu | gsap | **unknown** | Not usable. |
| Motion Menu | Satyam Mishra | https://21st.dev/@satyam-mishra-dev/components/motion-menu | gsap | **unknown** | Not usable. |
| Navbar Menu | Manu Arora (Aceternity) | https://21st.dev/@manuarora700/components/navbar-menu | framer-motion | MIT | A hover "bignav" dropdown. The concept is portable. |
| Mega Menu | LN | https://21st.dev/@ln-dev7/components/mega-menu | lucide, framer-motion | **unknown** | Not usable. |
| Page Transition | Subhan Uddin | https://21st.dev/@su2491251/components/page-transition | framer-motion | MIT | Stair, wave or fade route overlays. Hyperiux Block Transition is the GSAP equivalent. |

**Top pick: Hyperiux Immersive Full Screen Navigation** for mobile and the "Menu" button, with **Directional Menu** optional for a desktop Packages mega-menu.
- **Port.** Strip Tailwind, keep the polygon set and the timeline. Change the overlay background from `#000` to deep green `#003018` with a gold hairline at the leading edge, and the link colour from white to paper `#f8f8f8`.
- **Image strip.** Use Cloudinary thumbnails (Kaaba, Prophet's Mosque) that crossfade per hovered link.
- **Durations.** 1.2s `power4.inOut` is cinematic, but proposed: **0.9s** for open, so the menu stays responsive.
- **Route changes.** Reuse the same polygon wipe as the page transition. BRIEF §6 suggests 500–800ms `expo.inOut`, so use 0.7s for routes.
- **Keep** `Nav.jsx` routes and focus trap; add `inert` on `<main>` while the menu is open.

## 10. Image reveal / clip-path / curtain

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Sticky Content Wrapper** (image wipe part) | Hyperiux Vault | https://21st.dev/@hyperiux/components/sticky-content-wrapper | gsap (also imports `lenis/react`) | MIT / HEL | **Source read.** Images stack and wipe away with `clipPath: "inset(0% 0% 0% 0%)" → "inset(0% 0% 100% 0%)"` on a scrubbed timeline (`start:"top top"`, `end:"bottom bottom"`, `scrub:1`) with snapping (`duration {min:0.2,max:0.5}`, `power2.inOut`). Content yPercent swaps run `power2.inOut`. Reduced motion crossfades with `autoAlpha` instead of the wipe. It uses `useLenis()` from `lenis/react`; we would use `window.__lenis` instead. |
| SVG Clip Mask | Edu Calvo (SmoothUI) | https://21st.dev/@educalvolpz/components/svg-clip-mask | motion | MIT | Medium. Reveals content through an SVG shape (**arch**, blob, diamond, wave or custom path) that can morph on scroll. An **arch-shaped image frame** echoes the dome and arch in the logo. Port with CSS `clip-path: path()` or an SVG `<clipPath>`, scrubbed with GSAP (scale an arch `<path>` from 0.6 to 1.2). |
| Inversion Circle Scroll Animation | Ajith k v | https://21st.dev/@ajith66310/components/inversion-circle-scroll-animation | (none listed) | MIT | High. A circle rises and expands to fill the viewport, with text revealed through clip-path as a colour inversion. Could carry the hero → "Qafila e Shoq" chapter change (green circle expanding). |
| ImgText Reveal Scroll Animation | Ajith k v | https://21st.dev/@ajith66310/components/imgtext-reveal-scroll-animation | gsap | MIT | High. Inline images reveal inside a headline on scroll, plus a magnetic hover preview. |
| Split Reveal Image Carousel / Shutter Blinds Image Carousel | Kedhareswer Naidu | https://21st.dev/@kedhareswer/components/split-pane-carousel · /shutter-blinds-carousel | none | MIT | Door-split and blinds image transitions. The door split ties in nicely with edolus's two-band curtain for a Gallery hero slider. |
| Image Masking | ui layout | https://21st.dev/@uilayout.contact/components/image-masking | — | **unknown** | Not usable. |
| Frosted Image Reveal / Ink Reveal | Dhileep Kumar GM / AAYUSH duhan | (see meta.txt) | — | **unknown** | Not usable. |
| Ghost Reveal | Arlan | https://21st.dev/@arlanoska/components/ghosty-reveal | — | MIT (per a search snippet) | **Page returned "Not found" on fetch. Unverified.** |

**Top pick: a GSAP `inset()` curtain** (Hyperiux Sticky Content Wrapper values) as the default image entrance, plus **one arch mask** moment (concept from Edu Calvo's SVG Clip Mask).
- **Default entrance (proposed).** `clip-path: inset(100% 0 0 0)` → `inset(0)` over 1.1s with `expo.out`, while the inner `<img>` scales 1.15 → 1 over the same duration. Trigger at `start:'top 80%'`, once.
- **Units.** Per the GSAP forum, give every clip-path coordinate units (`0%`, not `0`) in both CSS and JS, and never put CSS transitions on tweened properties.

## 11. Custom cursor / magnetic button

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Magnetic Button** | Mohammad Shehadeh (Hirael) | https://21st.dev/@mohammadshehadeh/components/magnetic-button | motion, @radix-ui/react-slot | MIT | **High.** Pulls toward the cursor and springs back on leave. Adjustable strength, `asChild` to wrap a link, respects reduced motion. |
| Magnetic | Julien Thibeaut (Motion Primitives) | https://21st.dev/@ibelick/components/magnetic | motion | MIT | High; same idea, with a nested variant. |
| Magnetic Button | Bundui | https://21st.dev/@bundui/components/magnetic-button | framer-motion | MIT | High. |
| Magnetize Button | Kokonut UI | https://21st.dev/@kokonutd/components/magnetize-button | lucide, framer-motion | MIT | Particles; too playful. |
| Fluid Magnetic Cursor | Hossain Jahed | https://21st.dev/@jahed/components/magnetic-cursor | gsap, vecteur | **unknown** | GSAP spring cursor with a contrast filter. Not usable. |
| Cursor | Julien Thibeaut | https://21st.dev/@ibelick/components/cursor | framer-motion | MIT | Custom cursor with spring; global or scoped. |
| Custom Cursor | lukacho/ui | https://21st.dev/@lukacho/components/custom-cursor | framer-motion | MIT | — |
| Custom Cursor | soralabs | https://21st.dev/@soralabs/components/custom-cursor | motion, cva | **no-license** | Not usable. |
| Smooth Cursor | Magic UI | https://21st.dev/@dillionverma/components/smooth-cursor | motion | **unknown** (listed as unknown on 21st) | Not usable. |

**Top pick: a magnetic effect on primary CTAs only (Shehadeh pattern, MIT). Skip the custom cursor.** The skip is my recommendation: the audience includes older pilgrims and is mostly on mobile, and a replaced cursor costs clarity for little brand value.
- **Port (proposed).**
  ```js
  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
  // on pointermove: xTo((e.clientX - cx) * 0.3); yTo((e.clientY - cy) * 0.3)
  // on pointerleave: xTo(0); yTo(0), with ease 'elastic.out(1,0.4)' at 0.8s
  ```
- Enable only under `@media (hover:hover) and (pointer:fine)` and without reduced motion.
- Apply it to the WhatsApp CTA and "Apply for Qafila".

## 12. Sticky scroll storytelling / horizontal scroll

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Horizontal Feature Reveal** | Hyperiux Vault | https://21st.dev/@hyperiux/components/horizontal-feature-reveal | gsap | MIT / HEL | **Very high, source read.** Vertical scroll drives the track: `gsap.to(".industry-container",{xPercent:-79, ease:"none", scrollTrigger:{start:"top top", end:"bottom bottom", scrub:true}})` (sticky parent). Per panel: number, title and copy reveal through SplitText line masks (0.7s, `power2.out`, stagger 0.08), and images parallax with `ease:"none"`. Mobile fallback stack; reduced motion skips the reveals and refreshes. |
| **Scroll Gallery** | soralabs | https://21st.dev/@soralabs/components/scroll-gallery | gsap, @gsap/react | MIT | **High.** A full-viewport sticky slider that pins and **wipes between full-bleed images with an animated title swap**. Source not readable. A strong fit for "Sanctuaries": Masjid al-Haram → Masjid an-Nabawi → Mina/Arafat. |
| Sticky Content Wrapper | Hyperiux Vault | https://21st.dev/@hyperiux/components/sticky-content-wrapper | gsap | MIT / HEL | Split screen: text steps through headings on one side while the image wipes on the other (values in §10). Fits "Why Choose Us" or "How your Umrah works". |
| Product Timeline | Hyperiux Vault | https://21st.dev/@hyperiux/components/timeline | gsap | MIT / HEL | A horizontal scroll timeline with Lenis smoothing, GSAP milestone reveals and reduced-motion support. A natural fit for a **"Your journey, step by step"** timeline (visa → flight → Makkah → Madinah → return) or the Hajj days. Source not downloaded; values unverified. |
| Alice Scroll Story | Kedhareswer Naidu | https://21st.dev/@kedhareswer/components/alice-scroll-story | gsap | MIT | Layered parallax storytelling with text reveals; a reference for the "chapters" pattern (BRIEF §6). |
| Full Screen Scroll FX | scott clayton | https://21st.dev/@lovesickfromthe6ix/components/full-screen-scroll-fx | gsap | **unknown** | Not usable. |
| Sticky Scroll Reveal | Manu Arora (Aceternity) | https://21st.dev/@manuarora700/components/sticky-scroll-reveal | framer-motion | MIT | Concept only; the Hyperiux version is already GSAP. |
| Scroll Horizontal Gallery | Motion | https://21st.dev/@motiondotdev/components/motion-scroll-horizontal | motion | MIT | Sticky plus scroll-linked x. The same thing in GSAP is 6 lines. |
| Horizontal Scroll | ui layout | https://21st.dev/@uilayout.contact/components/horizontal-scroll | next, lenis, motion | **no-license** | Not usable. |
| Horizontal Scroll Gallery | pulkitxm | https://21st.dev/@pulkitxm/components/horizontal-scroll-gallery | — | **no-license** | Not usable. |
| Parallax Scrolling | osmosupply (Osmo) | https://21st.dev/@osmosupply/components/parallax-scrolling | gsap, @studio-freight/lenis | **unknown** | Not usable. |

**Top pick:**
- **Scroll Gallery (soralabs, MIT)** pattern for Sanctuaries.
- **Hyperiux Horizontal Feature Reveal** for a packages or journey track on desktop.

Pin at most 1–2 sections per page (BRIEF §6), counting the hero. On Home that means the hero plus *one* of these.

**Port.** `position: sticky` wrapper with a height of N×100vh, and `xPercent` set to `-(100 - 100/N)` (Hyperiux's −79 is tuned for its own panel widths; compute ours). Hand off to a vertical stack below 1024px via `gsap.matchMedia`. Call `ScrollTrigger.refresh()` after Cloudinary images load.

## 13. Stats count-up

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| Number Ticker | Magic UI | https://21st.dev/@dillionverma/components/number-ticker | framer-motion | MIT | Trivial in GSAP. |
| Number Ticker | Daniel Petho (Fancy) | https://21st.dev/@danielpetho/components/basic-number-ticker | motion | MIT | Ref-controlled start. Trivial. |
| **Number Flow** | Maxwell Barvian | https://21st.dev/@barvian/components/number-flow | (page lists none; describes itself as "Dependency-free") | MIT | Odometer-style digit roll with localisation and formatting; accessible. Would be a **new dependency** (`@number-flow/react`; package name from my own knowledge, not verified on the page). |
| Count Up | unlumen | https://21st.dev/@unlumen/components/count-up | motion, react-use-measure | MIT | Spring-to-target on viewport entry, with per-digit slide, fade or blur. |
| FAQ Section with About Stats | Kedhareswer Naidu | https://21st.dev/@kedhareswer/components/ink-orbit-faq | none | MIT | Count-up on scroll, zero dependencies (see §8). |
| Gooey Counter | Hyperiux Vault | https://21st.dev/@hyperiux/components/gooey-counter | (none listed) | MIT / HEL | A gooey-filter counter; too playful. |
| Counting Number | Cnippet | https://21st.dev/@cnippet-dev/components/counting-number | motion | **no-license** | Not usable. |
| Numbers Stats Grid | shadcnui-blocks | https://21st.dev/@shadcnui-blocks/components/stats-06 | lucide-react | MIT | Layout reference: a grid of metrics with icons. |

**Top pick: keep our existing GSAP counter** (`StatsSection.jsx` / `useGsapAnimations.js` already count up, per the brief) and restyle it in the Magic UI / Petho manner.
- **Count (proposed).** `gsap.to(obj,{val:target, duration:2, ease:'power3.out', snap:{val:1}, onUpdate: () => el.textContent = nf.format(obj.val)})`, with `nf = new Intl.NumberFormat('en-PK')`. Trigger at `start:'top 85%'`, once.
- **Suffix.** "+" and "%" sit in gold, set apart.
- **Accessibility.** Put the final value in `aria-label` so screen readers do not read the ticking.
- **Odometer alternative.** If the owner wants an odometer look, Number Flow (MIT) is the only polished, accessible option, at the cost of one dependency.

## 14. Footer with big wordmark

| Component | Author | URL | Deps | License | Port feasibility |
|---|---|---|---|---|---|
| **Newsletter Signup Footer with Giant Wordmark** | Kedhareswer Naidu | https://21st.dev/@kedhareswer/components/billboard-signup-footer | none | MIT | **High.** The brand is **cut out of a paper panel** like a billboard, above an email pill, socials, link columns and a **scrolling slogan marquee**. Rebranded through props. "Paper panel" plus marquee maps directly onto the letterhead (paper field, motto). |
| Giant Wordmark Footer | Kedhareswer Naidu | https://21st.dev/@kedhareswer/components/kiln-wordmark-footer | none | MIT | High. Two-line motto, back-to-top key, address, nav and social columns, a huge brand name and a legal bar. Procedural SVG alphabet; we would use the Trajan-like brand font instead. |
| Light Beam Footer with Giant Wordmark | Kedhareswer Naidu | https://21st.dev/@kedhareswer/components/beam-wordmark-footer | none | MIT | Wordmark cropped by the bottom edge with a slow light shaft. Its midnight-navy palette is the look we are leaving; a **slow gold light shaft on green** could work. |
| Large Name Footer | Arihant jain (Spectrum UI) | https://21st.dev/@arihantcodes_1f7b8c4d/components/large-name-footer | (none listed) | MIT | Simple large logo footer. |
| Motion Footer | Hossain Jahed | https://21st.dev/@jahed/components/motion-footer | gsap | **unknown** | Best mechanic (a GSAP ScrollTrigger **curtain-reveal parallax** footer, giant masked type, diagonal marquee, magnetic pills) but **no licence**. Concept only. |
| Animated Footer | Taher Hathi | https://21st.dev/@tahermaxse/components/animated-footer | — | **unknown** | Explicitly a Cluely clone. Avoid. |
| Mega Sitemap Footer | Oliver (7Ovr) | https://21st.dev/@olewandowski1/components/footer-4 | next-themes | MIT-0 | Structural reference only. |
| Hover Footer / Sticky Footer | Md afsar mahmud / Efferd | (see meta.txt) | motion | **unknown** | Not usable. |

**Top pick: a Kedhareswer "Billboard" composition (MIT) in letterhead colours, with a curtain reveal we build ourselves.** The reveal is generic CSS, so there is no need for Jahed's unlicensed code.
- Green footer (#083820 / #003018), which satisfies PRODUCT.md's "green footer".
- Gold hairline top edge.
- Contact row from the letterhead: Johar Town address, +92 42 35136177, WhatsApp +92 333 4883578, keusmania@gmail.com.
- Motto marquee "FAITH × JOURNEY × TOGETHER" using the §4 CSS.
- Giant wordmark "KARWAN E USMANIA" at `font-size: clamp(64px, 15vw, 260px)`, `letter-spacing: .02em`, gold-to-green gradient text, **cropped by the bottom edge** (`margin-bottom: -0.18em; overflow: hidden`).
- **Curtain reveal.** `footer{position:sticky;bottom:0;z-index:0}` and `main{position:relative;z-index:1;background:var(--paper)}`. The page lifts off the footer like a curtain, with no JS. Optionally add a GSAP `yPercent:-30 → 0` parallax on the wordmark, scrubbed while the footer enters.
- Respect "do NOT invent a domain": print keusmania.vercel.app only if it is shown at all.

---

## Cross-cutting recommendations

1. **Library to mine first: Hyperiux Vault** (https://21st.dev/@hyperiux, source at https://github.com/Hyperiux-Immersion-Labs/hyperiux-components). It is GSAP-native, its source is readable, it handles reduced motion, and its licence allows commercial use inside our site. Pull these 5 effects into plain-CSS ports: Immersive Full Screen Navigation, Rectangular Text Reveal, Horizontal Feature Reveal, Sticky Content Wrapper and Block Transition. Keep each file's copyright header (HEL §3d).
2. **Second source: Kedhareswer Naidu's MIT, zero-dependency set**: Billboard and Giant Wordmark footers, Ink Orbit FAQ with stats, Swiss counter preloader (mechanics only), and the split and blinds carousels. Each is self-contained React with inline styles, so it ports without Tailwind.
3. **Fix Lenis ↔ ScrollTrigger sync before any pin work** (code in §0).
4. **Pin `gsap` to `^3.13.0` or higher** so SplitText, Flip, CustomEase and Draggable (all free since 3.13) are guaranteed. 3.15.0 is already installed.
5. **One motion vocabulary**, so 21st pieces don't feel like a collage:
   - **Entrances:** rialto `cubic-bezier(.165,.84,.44,1)`, 0.75s.
   - **Text lines:** `yPercent 100 → 0`, 0.7s, `power2.out`, stagger 0.08 (Hyperiux).
   - **Overlays and curtains:** `power3.inOut` or `power4.inOut`, 0.7–0.9s.
   - **Accent block-wipe:** `CustomEase "0.4,0,0.2,1"`.
   - **Pointer springs:** `quickTo` 0.5s `power3.out`.
6. **Never port** components marked unknown or no-license: Scroll Animated Video, Hero Scrub, Video Scroll Hero, Text Reveal Block, Pace Reveal Text, Loading Overlay, Arc Preloader, Greeting Preloader, Motion Footer, Fluid Magnetic Cursor, Jatin Yadav testimonials, Efferd pricing, ui-layout horizontal scroll, Osmo components. Reimplement the idea from first principles instead.
7. **Do not install via `npx shadcn add`.** It would introduce Tailwind config, `components.json`, `cn()`/clsx and `motion` into a plain-CSS repo, and could touch files near the admin CMS. Port by hand into `src/components/` and `components.css`.

## Unverified / could not check

- Source and exact animation values of every non-Hyperiux 21st component. The registry returns 403 without an API key, so all values for those components are proposals.
- The Hyperiux Product Timeline, Stack Loader exit timing beyond the constants above, and Directional Menu internals beyond its defaults were only partly read.
- Ajith's Hero Scroll Video Pin Reveal: actual pin length, clip-path shapes and video handling are unknown.
- Ghost Reveal (@arlanoska): the page returned "Not found"; its MIT licence comes only from a search snippet.
- Kedhareswer "Animated Features Bento" licence was not fetched.
- The Circular Testimonials CodePen's own licence and credit terms were not checked.
- Whether `@number-flow/react` is the npm name behind Barvian's Number Flow (my knowledge, not on the page).
- I loaded no live previews visually; feel judgements are based on descriptions, plus source for Hyperiux.

## Sources

- 21st.dev index: https://21st.dev/llms.txt. Category listings: https://21st.dev/community/components/s/{hero,text-animation,marquee,pricing-section,testimonials,accordion,navigation,footer,features,loader,cursor,scroll,counter,...}.md
- Component pages: every URL in the tables above, with `.md` appended for metadata.
- Hyperiux source and licence: https://github.com/Hyperiux-Immersion-Labs/hyperiux-components (`LICENSE`, `LICENSE_EFFECTS`, `registry/effects/{navigation/immersive-full-screen-nav,navigation/directional-menu,text/rectangular-text-reveal,scroll/horizontal-feature-reveal,scroll/sticky-content-wrapper,transitions/block-transition,loaders/stack-loader}/index.tsx`)
- GSAP clip-path units tip: https://gsap.com/community/forums/topic/30924-scrolltrigger-with-clippath-not-working/
- Repo, read only: `keu-website/package.json`, `keu-website/node_modules/gsap/package.json` (3.15.0), `keu-website/src/hooks/useLenis.js`, `keu-website/src/hooks/useGsapAnimations.js`

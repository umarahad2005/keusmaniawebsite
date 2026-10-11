# Awwwards sweep — fullscreen-video heroes & cinematic transitions in travel / hospitality / destination / heritage (2024–2026)

Researcher: awwwards sweep agent · 2026-10-08 · for the Karwan e Usmania International (KEUI) rebrand.
Brief: `../research/BRIEF.md` (ground truth). Raw evidence saved under
`C:/Users/umara/AppData/Local/Temp/claude/D--personal-projects-keusmaniawebsite/a77583f5-a258-400b-beb0-5ae18b2f4766/scratchpad/ref-awwwards/`
(`<site>.html` = live page source via curl, `css/` = linked stylesheets, `js/` = custom scripts, `aw/` = awwwards site/element pages).

Method: awwwards category listings (luxury, travel, restaurant-hotel, culture-education, sites_of_the_day, tag probes) → each site's awwwards page (award, date, jury scores, tags, palette) → raw HTML/CSS/JS of the live site grepped for `<video>` attributes, fonts, libraries, `cubic-bezier`, durations, preloader/mask/marquee/cursor markup. WebFetch only returns rendered text, so every "hero/typography/easing" claim below comes from the downloaded source unless marked **(unverified)**.

Verdict in one line: the award-winning grammar for this sector in 2026 is **"serif display + grotesk body, paper-and-one-deep-colour palette, a muted ≤12 s video loop under a 35–40 % scrim with a 2 s scale-settle, 0.75–1.4 s expo/quart-out reveals, one curtain-style page transition, and a logo preloader that hands off to the nav"** — i.e. exactly the "letterhead composure" the owner asked for, and no winner in 2024–2026 is a Hajj/Umrah operator, so the category is open.

---

## 0. Headline facts

| # | Fact | Evidence |
|---|---|---|
| 1 | **EDOLUS (owner's reference #2) is an awwwards Site of the Day, Oct 4 2026** — SOTD 7.20, Developer Award 7.82, Animations/Transitions 8.80, tags WebGL · GSAP · GLSL, palette #000000, by Yann Trevelot / Vertex3D. | `aw/` + https://www.awwwards.com/sites/edolus |
| 2 | **Rialto (owner's reference #1) is an awwwards Nominee, not a winner** — tags animation · architecture · real-estate · scrolling · storytelling · typography · wordpress; elements submitted: loading animation, divider-lines scroll animation, animated logo carousel. | https://www.awwwards.com/sites/rialto (date shown "Oct 8, 2026" = today, so submission date **unverified**) |
| 3 | **No Hajj / Umrah / mosque site has any awwwards recognition 2024–2026.** Tag probes: `/websites/mosque/` → 0 sites; `/websites/pilgrimage/` → 1 (Shikoku Pilgrimage, HM Mar 13 2019); `/websites/islamic/` → 2 (Louvre Islamic Arts SOTD Mar 17 2013; "Islamic Pacifism"); `/websites/saudi-arabia/` → 5, the only destination one being *Reviving Saudi History* (DARAH, Bold Experiences, Nominee, Jan 5 2024, 3D/WebGL storytelling). | `aw/tag-*.html` |
| 4 | **Serif display + sans body wins**: 9 of the 12 primary sites pair a serif/editorial display face with a grotesk body (Cardinal Classic + Inter Tight, PP Fragment + Inter, PP Editorial New + GT Ultra, Bon Vivant + Ronzino, Canela + Instrument Sans, Saphion + Inter, Caslon + Helvetica, SangBleu + Shapiro, Joane + Raleway). Two use Cinzel/Cormorant — the same Trajan-like family as our letterhead. | CSS greps below |
| 5 | **Video hero spec that wins**: `<video autoplay loop muted playsinline preload="metadata">`, desktop 1080p + mobile 540p (Tengile) or `-movil` (Spain Collection) variant, poster for `preload="none"` cases (Reverie, Velaa, Son Brull), a dark scrim at opacity .4 (Tengile) or a dedicated overlay div (White Desert), and an `<img data-video-fallback>` shown when `video.play()` rejects (Jägerhof). | source greps |
| 6 | **The three easing curves that recur**: `cubic-bezier(.165,.84,.44,1)` easeOutQuart (Rialto AND Tengile), `cubic-bezier(.16,1,.3,1)` / `(.19,1,.22,1)` easeOutExpo (White Desert, Odyssée, Tengile, Travel Next Level), `cubic-bezier(.76,0,.24,1)` easeInOutQuart for curtains/page transitions (White Desert, Son Daven). | CSS greps |
| 7 | **Durations that recur**: hover/opacity 0.3–0.45 s; content reveal 0.75 s (Rialto) · 1.2 s (Jägerhof) · 1.4 s (White Desert); page curtain 0.75–0.8 s; hero settle 2 s (Tengile scale 1.1→1); image mask reveal 1.5 s (Reverie). | source greps |
| 8 | **Jägerhof's entire motion system is 13 small vanilla-GSAP modules served from `jagerhof.pages.dev/*.js`** (parallax, split headings, hero hover swap, curtain page transition, nav menu, title marquee, video fallback) — the most directly portable code found; all gated by `prefers-reduced-motion`. | `js/jagerhof-*.js` |
| 9 | **Logo preloader → curtain → logo-to-nav handoff** appears in 6 of the studied sites (Edolus, Son Daven, Jägerhof, Depo Luxe, Tandjung Sari, Odyssée) and is listed as an awwwards element for Tengile, Son Daven and Jägerhof. | element pages |
| 10 | **WhatsApp as primary CTA on an awwwards site**: Tandjung Sari (HM Aug 5 2026) wires "BOOK TABLE" to `wa.me` and a floating "Whatsapp" to `api.whatsapp.com` — precedent for KEUI's conversion path. | `tandjung.html` |

---

## 1. Site-by-site deconstruction (primary set, 12 sites)

Order = relevance to a "clean and premium, letterhead composure" Hajj & Umrah operator. Jury scores are awwwards SOTD scores (Design 40 / Usability 30 / Creativity 20 / Content 10).

### 1.1 Tengile MalaMala Collection — luxury safari lodges, South Africa
- **URL / award**: https://tengilemalamala.com/ · **Site of the Day Oct 3 2026 (7.22) + Developer Award (7.48)** · by DashDigital + Ingamana · awwwards page https://www.awwwards.com/sites/tengile-malamala-collection · tags Hotel/Restaurant, Luxury, Big Background Images, Menu-Horizontal, Storytelling, Photo & Video, Microinteractions · tech React (Next.js), Sanity, AWS.
- **Hero**: fullscreen `<video loop muted autoPlay playsInline preload="metadata" src="https://d1z1bhj01il1nu.cloudfront.net/tmmc-home-hero-preview_1080p.mp4">` (mobile `tmmc-home-hero-preview-mobile_540p.mp4`), wrapped in `.HeroCover…__media` that is **200 % tall with a `position:sticky; top:0; height:50%` inner** (CSS-only parallax) and a `:before{opacity:.4;background:#000}` scrim. Cover enters with `.appear-scale-in{transform:scale(1.1)} → scale(1)` over **`2s cubic-bezier(.19,1,.22,1)`** (easeOutExpo). A "Watch video / Play Video" button opens the full film `tmmc-home-hero-full_1080p.mp4` (540p mobile) in a plyr player (`--plyr-color-main:#fbf8f6`). Headline `UNMATCHED / ABUNDANCE` (literal uppercase in the CMS), sub "A rare opportunity for you to experience and protect one of Africa's most iconic wildernesses."
- **Preloader**: awwwards lists a "Preloader" element (https://www.awwwards.com/inspiration/preloader-tengile-malamala-collection, tags loading · preloader) but no loader module exists in the server-rendered HTML/CSS → mechanics **unverified** (client-side chunk).
- **Nav**: top bar = "Enquire" (→ /booking) · logo · "Menu / Close" toggle; primary About · Accommodation · Experiences · Conservation · Partner Hub; secondary Stories · Wildlife Journals · Gallery · FAQ · Contact · Plan Your Stay.
- **Typography**: **PP Fragment Glare** (variable serif, `PPFragment-GlareVariable.woff`) display + **Inter** (regular/medium) body. Display sizes `16rem`, `12rem`, `clamp(3rem,12.5vw,5.2rem)`; letter-spacing `0 / -.01em / -.02em`; 40 `text-transform:uppercase` rules (eyebrows, buttons).
- **Scroll grammar**: images marquee (`@keyframes …marquee{to{transform:translate3d(calc(-100% + var(--offset)),0,0)}}`), `parallax-target` on every Sanity media block, testimonial slider "1 / 6", map with `pinPointIddler` keyframe, timeline on /about.
- **Easing set** (CSS): `(.25,.46,.45,.94)` ×15, `(.165,.84,.44,1)` ×14, `(.19,1,.22,1)` ×13, `(.4,0,.2,1)`, `(.215,.61,.355,1)`, `(.77,0,.175,1)`.
- **Libraries**: Next.js, Lenis, Three.js (3 refs), plyr.
- **Colour world**: paper `#FBF8F6`, olive `#5C6E21`, ink `#242D23`.
- **Cursor / transitions**: no custom cursor markup; page transitions not detectable server-side.
- **Steal for KEUI**: the **two-tier video** (≤12 s muted preview loop + "Watch the film" full-length) and the **0.4 scrim + 2 s scale-settle**. A 10-s tawaf aerial loop over `#0a4a2a` at 35–40 % reads as composure, not spectacle.

### 1.2 White Desert — luxury Antarctic expeditions
- **URL / award**: https://white-desert.com/ · **SOTD Sep 11 2026 (7.31) + Developer Award (7.61; WPO 8.0)** · by Malvah (+ Geoff Dawes, Usudo) · https://www.awwwards.com/sites/white-desert · tags Hotel/Restaurant, Luxury, Gallery, Photo & Video · tech Next.js, Contentful, GSAP, Vercel.
- **Hero**: `.hero-banner_bg > <video autoPlay loop muted playsInline preload="metadata" class="hero-banner_video"><source src="https://customer-0f1muz5hahtwutl3.cloudflarestream.com/…/downloads/default.mp4">` (+ HLS `manifest/video.m3u8` renditions) + `.hero-banner_overlay`. Copy block has `data-reveal="true"` and `data-scroll-speed="-60svh"` (copy drifts up faster than the video). A **"Mist transition"** `cloud-gradient.png` sits between hero and first section; the H1 "Antarctica" has "Clouds overlay" PNGs layered over it. Hero line is **sentence-case italic serif**: `.t-title-italic{font:500 1.125em/1.2 var(--font-display); font-style:italic}` → "Luxury and adventure in the most remote place on Earth." Secondary "Watch Film" button with image preview.
- **Page transitions**: **native View Transitions API, no library** — `::view-transition-old(root){animation:.8s cubic-bezier(.25,1,.5,1) forwards page-exit}` (brightness → .25) and `::view-transition-new(root){animation:.8s cubic-bezier(.76,0,.24,1) forwards page-enter}` where `page-enter` is a clip-path polygon wipe from the bottom edge to full.
- **Reveal**: `[data-reveal]{animation:1.4s both reveal-opacity, 1.4s cubic-bezier(.16,1,.3,1) both reveal-transform}` (translateY(20rem)→0). Tokens: `--transition-wd: all .45s cubic-bezier(.76,0,.24,1)`, `--transition-ease-out: all .3s cubic-bezier(.5,1,.89,1)`.
- **Nav**: Experience · Operation · About + Rates · Enquire + Menu/Close; awwwards "Menu" element = tiered hover menu.
- **Typography**: `--font-display:"Cardinal Classic Long"` (serif, Medium/Italic/SemiBold/Bold), `--font-sans:"Inter Tight"` (variable), `--font-condensed:"Oswald"`; letter-spacing `.1em` / `.175em` on caps.
- **Scroll grammar**: `horizontal-scroll_clip-wrap` with an **SVG `clip-path:url(#…)`** over panel images, `globe-sticky_*` pinned section with floating video card, `data-scroll-scrub`, card grid with **`data-cursor-text="Learn More"`** custom cursor; CSS has 7 clip-path, 6 mask, 5 mix-blend, 12 backdrop-filter uses.
- **Colour world**: `--wd_dark-blue #1F2A44`, `--wd_deep-blue #0E1118`, `--wd_ash-blue #2C374B`, `--wd_beige #DCD8CC`, `--wd-grey #323640`, awwwards palette #1F2A44 / #E9E7E1.
- **Steal for KEUI**: the **gradient seam** between video hero and first paper section (ours = the letterhead green sweep band + gold hairline sliding over the video) and the **View Transitions API** route change — zero extra JS in a Vite/React SPA (`document.startViewTransition` around `navigate()`), CSS fallback elsewhere.

### 1.3 Son Daven — design resort hotel, Carpathians
- **URL / award**: https://sondaven.com/en · **SOTD Jun 5 2026 (7.62) + Developer Award (8.09; Animations 8.2) · Site of the Month Jun 2026 · Business & Services Honors May 2026** · by The First The Last (+ Maksym Stepenko, Ivan Chopei) · https://www.awwwards.com/sites/son-daven · tags Hotel/Restaurant, Animation, Scrolling, Storytelling, Microinteractions · tech Webflow, GSAP, WebGL.
- **Preloader (awwwards element "Preloader")**: `.preloader.theme_on-dark` → `.preloader_bg_scene` plays a looping **`preloader_sheep.mp4`** (`preload="auto" fetchpriority="high"`, avif poster) under a **percent counter `[data-preloader-percent]` "0%" + "loaded"**, then `.preloader_logo` → `.hero-s_content_logo` (logo handoff to hero), `[data-master-preloader]`. Timings live in client JS not served statically → **unverified**.
- **Page transition**: **barba.js 2.10.3** (`data-barba="container" data-barba-namespace="home"`) with a `.transition_cell` grid of cells (multi-cell curtain). Lenis 1.3.15, GSAP 3.13 + ScrollTrigger + CustomEase + SplitText + **Flip 3.14.1**, Swiper 11, plus a custom **`ActiveFrame.js` (WebCodecs frame decoder) for scroll-scrubbed video** (`data-scroll-video-container` / `data-scroll-video`, asset `son-daven_short.mp4`).
- **Scroll grammar**: 141 `data-scroll-reveal` attributes (`line`, `ctn`, `h`), `data-highlight-text`, title marquee (`fin-s_title_marquee`), map pins, `footer clip`.
- **Motion tokens (CSS)**: `--dur-s: .4s; --dur-m: .6s; --dur-l: 1.2s; --ease: cubic-bezier(.25,.1,.25,1); --ease-out: (.25,1,.5,1); --ease-in: (.5,0,.75,0); --ease-in-out: (.76,0,.24,1); --ease-write: (.333,0,.667,1)` — every component transition references them (`--btn-dur: var(--dur-m); --btn-ease: var(--ease-out)`).
- **Typography**: **KTF Metro Roman + KTF Metro Blueline** (grotesk, no serif); letter-spacing `.08em` caps / `-.064em` display; display `calc(66.46rem / var(--_special-units---scale-ratio))`.
- **Colour world**: sand-gold `#A89474` + near-black `#2C2824` (two-colour system with 10/50/100 alpha tiers).
- **Steal for KEUI**: the **token system** (3 durations × 5 eases) and the **percent-counter preloader with logo handoff** — our version: KU monogram on paper, gold hairline progress, "loading" in small caps, then the logo FLIPs to the nav (GSAP Flip is already an easy add to our GSAP 3.12).

### 1.4 Hotel Jägerhof — family hotel, South Tyrol (the hero video→image reference)
- **URL / award**: https://www.jagerhof.net/en · **Honorable Mention Dec 26 2025** · by upgreight + Jordan Gilroy + Federico · https://www.awwwards.com/sites/hotel-jagerhof · tags Hotel/Restaurant, Animation, Parallax, Storytelling, Microinteractions, GSAP, Webflow · palette #2E4F3E / #C66A3C.
- **Hero** (awwwards element **"Interactive Hero Header – Video-to-Image Transition"**, https://www.awwwards.com/inspiration/interactive-hero-header-video-to-image-transition-hotel-jagerhof, tags hero header · hero animation · video to image transition · mouse interaction · hover interaction): `.hero_home_visual` has `data-parallax="trigger" data-parallax-start="0" data-parallax-end="40" data-parallax-scroll-start="top top"` and contains `<video src="https://jagerhof.b-cdn.net/jagerhof_home_hero.mp4" autoplay loop muted playsinline data-video="background">` + `<img data-video-fallback class="hero_home_img">` (`visibility:hidden; z-index:2`). Mechanism decoded from `js/jagerhof-video-fallback.js` and `js/jagerhof-home-hero-hover.js`:
  - `video.play().catch(() => fallback.style.visibility='visible')` — image replaces video only when autoplay is refused.
  - On `(hover:hover) and (pointer:fine)`: hovering the headline links `[data-hero-hover]` ("In Nature. / At The Table. / In Our Rooms. / With Us.") fades the matching `[data-hero-bg]` still **in over the video** `autoAlpha:1, 0.8s, power2.out`; others out `0.4s`; mouseleave out `0.6s power2.out`. The "video-to-image transition" is a hover crossfade from loop to still.
  - Hero exits with `yPercent 0 → 40` scrubbed (`scrub:true`, `clamp("top top")`).
- **Preloader / page transition** (awwwards element "Minimal Brand Page Loader"): `js/jagerhof-page-transition.js` — on load `.transition_wrap` `clipPath: inset(0 0 0 0) → inset(0 0 100% 0)` **0.75 s power2.out after 0.5 s delay** while `.transition_logo` fades 0.4 s; on internal link click the reverse `inset(100% 0 0 0) → inset(0 0 0 0)` 0.75 s, logo in 0.4 s at `<+25%`, then `window.location.href`. `onpageshow` reload guard for bfcache.
- **Content reveal**: `[data-fade-in=true]` `opacity 0, y 40 → 1.2s power2.out` at `start:'top 80%'`; **headings** `[data-split-heading=true]` SplitText words+chars, `scaleY 0→1, transformOrigin 50% 100%, 0.5s power2.out, stagger 0.02`.
- **Parallax** (`global-parallax.js`): `[data-parallax="trigger"]`, default `yPercent 20 → -20`, `scrub:true`, `start/end` wrapped in `clamp()`, `gsap.matchMedia` breakpoints with `data-parallax-disable="mobile|tablet"`.
- **Title marquee** (`title-marquee.js`): two rows `xPercent 80 → -5` and `-80 → 5`, `scrub: 2`, each row interleaves words with 3:2 images at `height:1em` (`title_marquee_visual`).
- **Intro hover** (`intro-animation.js`, element "Reveal Image on Mouse Hover"): words in a paragraph (`data-intro-hover="us"`) reveal a floating image `autoAlpha 0→1, scale .8→1, 0.6s power2.out`, drifting `x = (mouseX − linkCenter) × 0.075` over `1s`.
- **Grow card**: `scale .5→1, borderRadius 2rem→0`, image `1.5→1`, scrubbed `top bottom → top top`.
- **Nav menu** (`nav-menu.js`): overlay `opacity 0.3s`, background `scaleY 0→1 0.75s expo.out`, items `y 20, stagger .05, 0.6s expo.out` at `<+20%`; reduced-motion branch uses opacity only.
- **CSS transitions**: buttons `transform 0.525s cubic-bezier(0.625,0.05,0,1)`, `0.735s` same curve; sliders `--slide-duration: .6s`.
- **Typography**: `--_typography---font--primary-family: Ronzino` (grotesk 400/500/700/oblique) · `--secondary-family: "Bon Vivant Serif"` (display); display `clamp(4rem → 12.571rem)` fluid; letter-spacing tokens tight `-.02em`/medium/normal.
- **Colour world**: `--swatch--pine #2F4F3E`, `--swatch--moss #6C8A5E`, `--swatch--clay #C66A3C`, `--swatch--off-white #E9E1D6`, `--swatch--white #FAF8F4`, `--swatch--charcoal #3B3B3B`, `--_theme---background-2 #1A3B29` (card/dark theme) — the closest existing winner to our emerald/paper world.
- **Libraries**: GSAP + ScrollTrigger + SplitText, Lenis 1.2.3, Alpine, Webflow; custom modules at `https://jagerhof.pages.dev/{content-animation,global-parallax,grow-card,heading-animation,hero-main-scroll,home-hero-hover,intro-animation,nav-menu,page-transition,slider,sticky-cta-hide,title-marquee,video-fallback}.js` (all saved in `js/`).
- **Steal for KEUI**: **everything here ports to our React + GSAP + Lenis stack almost verbatim** (data-attribute driven, reduced-motion gated). The hero hover swap becomes: tawaf loop → hovering "Umrah / Hajj / Qafila e Shoq" fades in Madinah / Mina / Arafat stills.

### 1.5 Reverie Safaris — editorial luxury safari planner
- **URL / award**: https://reveriesafaris.com/ · **Honorable Mention May 4 2026** · by hansarnesen · https://www.awwwards.com/sites/reverie-safaris · tags Hotel/Restaurant, Photography, Luxury, **Fullscreen, Video**, Gallery, Storytelling · tech Framer, Contentful, Figma · palette #1E392B / #FBF9F3.
- **Hero**: `<video src="https://framerusercontent.com/assets/prpGSrgDPlcQeVtykERPE9sziPM.mp4" loop preload="none" poster="…png?width=1920&height=1012" muted playsinline style="object-fit:cover">` on a `#1E392B` background; a second vertical clip (`poster …?width=608&height=1080`) for mobile. H1 title-case: "Luxury African Safaris, Planned From Firsthand Experience"; eyebrow "Orange County, California · Featured in National Geographic"; CTA "Begin the Conversation".
- **Image reveal**: `mask-image:linear-gradient(#000 0 0); mask-position:bottom; mask-size:100% 100%; transition: mask-size 1500ms cubic-bezier(.4,0,.2,1)` — **bottom-anchored mask wipe, 1.5 s**.
- **Hover easing**: `opacity 0.4s cubic-bezier(.4,1,.75,.9)` (×244), `0.45s cubic-bezier(.6,.1,.4,1)`, `background-color 0.25s`.
- **Typography**: **GT Ultra Light / Regular** (sans) + **PP Editorial New Ultralight (+ Italic)** (hairline serif) + Inter.
- **Colour world**: deep green `#1E392B`, paper `#FBF9F3`, bark `#58503C`, `#2B523E`, `#DAD7CE`, `#CFD3CB`, `#F5F3ED`, `#A49B85`.
- **Nav**: Gallery · Inquire · Private Villas · Client Stories · About / Services (awwwards "Menu" element); footer-heavy IA.
- **Steal for KEUI**: this is the **palette proof** — deep green + warm paper + hairline serif is already an awwwards-recognised "quiet luxury" world; plus the 1.5 s bottom mask reveal for gallery/package images.

### 1.6 KUBE Saint-Tropez — 5-star hotel
- **URL / award**: https://www.kubehotel-saint-tropez.com/fr · **Honorable Mention Aug 27 2026** · by Digidop (+ Pierre Soares, Lucas Clairet) · https://www.awwwards.com/sites/kube-saint-tropez · tags Luxury, Hotel/Restaurant, Gallery, Content architecture, Photo & Video, Big Background Images, **Transitions**, Webflow · palette #DAF092 / #000000.
- **Hero**: still AVIF photography (aurelienstudio), no `<video>`; headline sentence case "Le Golfe pour seul horizon"; eyebrow "Wellness - Pool - Rooftop"; `.intro_*` grid `grid-column: 5 / 11`.
- **Nav/menu**: `@keyframes menuOpen / menuOpenInner / menuOpenMobile (0.6s) / menuClose / menuCloseMobile`; tokens `--nav--menu-open-duration: .6s`, `--nav--menu-close-duration: .3s`, `--nav--dropdown-open-duration: .4s`; `data-scrolltrigger-start="2"` on nav theme switch; link underline `animation: line-hover 1s ease-in-out forwards`; bounce `cubic-bezier(.175,.885,.32,1.275)`.
- **Multi-target CTA**: "Réserver" splits into *Une chambre* (Mews) / *Une table* (Zenchef) / *Le spa myBlend* (Planity).
- **Typography**: `--secondary-family: Saphion` (serif display, Light) + `--primary-family: "Inter Variable"` (200–500); display `clamp(5rem → 8rem)`.
- **Libraries**: GSAP + ScrollTrigger, Lenis, Swiper 8, Vue; CSS uses clip-path ×4, mask ×10, backdrop ×4.
- **Colour world**: `--swatch--brand #DAF092` (lime), `--swatch--beige #FDF9F4`, `--swatch--beige-2 #F3F0E8`, greys `#E1DCD9 / #C6C6C6 / #7C7C7C / #484847`, black.
- **Steal for KEUI**: the **split primary CTA** → "WhatsApp us" opens *Umrah / Hajj / Qafila e Shoq* with pre-filled messages. Avoid the lime accent.

### 1.7 Tandjung Sari — heritage boutique hotel, Bali
- **URL / award**: https://www.tandjungsarihotel.com/ · **Honorable Mention Aug 5 2026** · by Fleava · https://www.awwwards.com/sites/tandjung-sari · tags Architecture, **Culture & Education**, Hotel/Restaurant, **Horizontal Layout**, Typography, Transitions, Menu-Horizontal, Storytelling · palette #A62A23 / #F1ECDE.
- **Preloader**: `.preloader > .tandjung.title "tandjung" + .sari.title "sari" + <svg class="logo">` (logo path draws) — wordmark-then-logo splash.
- **Hero / layout**: `.horizontal-intro` (height 100dvh, width `calc(881.69/var(--vh)*100dvh)`) → **horizontal scroll chapters** `.horizontal-split-image-text-1/2`, `.horizontal-split-narrative-1`; stacked lowercase title "tandjung / sari / cape of / flowers". Trailer: `<video autoplay loop muted preload="metadata" playsinline>` (S3 mp4) with custom PAUSE / MUTE / range controls.
- **Text reveal**: `.masking-text{overflow:hidden} .masking-text .line{transform:translateY(110%)}` (line-mask), `.char{will-change:opacity}`.
- **Cursor**: `.base-cursor` fixed, z-index 99999, labels **discover / drag / explore / pause / play** in a `backdrop-filter:blur(10px)` pill; hidden `<600px`.
- **Easing**: `transition: transform .8s cubic-bezier(.24,.43,.15,.97)`, `opacity .8s` same curve.
- **Typography**: **Adobe Caslon Pro** (serif) + Helvetica + Optima + Overlock; letter-spacing `.1em` caps.
- **Colour world**: cream `#F1ECDE`, wine `#7A1D31`, red `#A62A23`, `#756F5F`, `#93836C`, `#FFFBF2`.
- **CTA**: "BOOK ROOM" (booking panel) · **"BOOK TABLE" → `wa.me`** · floating "Whatsapp" → `api.whatsapp.com`.
- **Libraries**: Nuxt, Lenis, Swiper, Three.js.
- **Steal for KEUI**: **WhatsApp-first CTA precedent** and the line-mask text reveal; the preloader "wordmark then mark" sequence suits "KARWAN E USMANIA" → KU monogram.

### 1.8 The Explora Journal — luxury cruise magazine
- **URL / award**: https://explorajourneys.com/int/en/explora-journal · **Honorable Mention Sep 12 2026** · by Skywire (+ team) · https://www.awwwards.com/sites/the-explora-journal · tags Magazine, Luxury, Storytelling, Photo & Video, Photographic · palette #E7E1DA / #F4F2EF.
- **Hero video** (elements "Hero Video", "Hero Card with Video", "Grids Transition"): `<video data-desktop-res="767" data-poster-dk="…EXIII_01_Clean?wid=1920&hei=1080&fmt=webp" data-poster-mb="…EXIII-Mob-1?wid=474…" data-multires-config='…'>` — **responsive poster + multi-rendition config**, mp4s under `/content/dam/explora/dm/…/Hero-video.mp4`, `Cover-video.mp4`.
- **Intro animation**: `.overlappingImage__intro.explora-animation--fadeRtL.starting.delayed--1x` with `@keyframes explorafadeRtL / explorafadeDown`; `data-speed-factor` parallax.
- **Typography**: **SangBleu Republic** (serif Regular/Bold/Italics) + **Shapiro** (sans) + WT Monarch Nova + Helvetica Neue; **50 uppercase rules with letter-spacing `.1em` (×37), `.14em` (×17), `.17em` (×14)**.
- **Libraries**: AEM clientlibs, Swiper (87 refs), barba (1).
- **Colour world**: `#E7E1DA`, `#F4F2EF`, navy `#0C2340`, `#222222`.
- **Steal for KEUI**: the **letterspaced-caps eyebrow system** (.14em) and the responsive-poster video attribute pattern (Cloudinary can serve `w_1920` / `w_768` posters and `q_auto` mp4 renditions).

### 1.9 Vander Hotel (Vander Urbani Resort) — boutique hotel, Ljubljana
- **URL / award**: https://www.vanderhotel.com · **Honorable Mention Aug 29 2026** · by .RAW · https://www.awwwards.com/sites/vander-hotel · tags Hotel/Restaurant, Luxury, Typography, Clean, **Parallax**, Photographic · tech Webflow · palette #F4F2F1 / #353230.
- **Hero** (element "Hero reveal": animation · typography · photographic · reveal · composition): no video — four stacked absolutely-positioned AVIFs `.hero-image-absolute.is-1…is-4` (Restaurant / Hero / Room / Hotel) revealed in composition; lowercase headline "where comfort / meets culture", numbered chapters **01 / 02 / 03**.
- **Typography**: **Söhne Buch** (`TestSohne-Buch.otf`) single grotesk; sizes 2.5 / 3 / 4rem; 17 uppercase rules, `letter-spacing:-1px` display.
- **Colour world**: `--_primitives---colors--brown #967850`, `--dark #353230`, `--white #F4F2F1`, `#F3F5FB`.
- **Libraries**: GSAP + ScrollTrigger (9/6 refs), Splide; 16 Webflow `data-w-id` interactions.
- **Steal for KEUI**: a **no-video hero reveal** (stacked stills composing in) as the reduced-motion / slow-network fallback, and numbered chapters.

### 1.10 Velaa Private Island — Maldives resort
- **URL / award**: https://www.velaaprivateisland.com/ · listed in Luxury + Restaurant-Hotel categories as a **Nominee (no award badge)** · by STRV · tags big-background-images, clean, minimal, photo-video, storytelling · tech Framer.
- **Hero**: 9 `<video>` tags — Vimeo progressive `rendition/2160p` and `1080p` mp4s with Framer posters (`…jpg?width=3840&height=2160`), `loop preload="none" muted playsinline`; **"SOUND ON"** toggle; sentence-case H1 "Velaa is a world of its own." with per-span `opacity:0.001; transform:translateX…` entrance (Framer text reveal).
- **Nav**: **numbered 01 Villas … 11 Sustainability**; CTAs "BOOK YOUR STAY" / "BOOK NOW".
- **Typography**: **Canela Text LC Web Thin** (serif) + **Instrument Sans** + **Fustat** (Google font with Arabic script support — `fonts.gstatic.com/s/fustat/v4/…woff2`) + Inter.
- **Colour world**: `#4B4335` umber, `#E8E6DF` paper, `#D9D8D4`.
- **Libraries**: Framer, Lenis.
- **Steal for KEUI**: numbered menu, and **Fustat** as a candidate for our Arabic line `خدمات ضيف الرحمن` beside a Latin serif.

### 1.11 Depo Luxe — luxury film production (cinematic reference)
- **URL / award**: https://depoluxe.xyz/ · **SOTD Jul 7 2026 (7.62) + Developer Award (7.53; Animations 8.4)** · by Cuchillo · https://www.awwwards.com/sites/depo-luxe · tags Film & TV, Luxury, Animation, Clean, Navigation Menu, Photo & Video · tech 11ty · palette #FFF / #000.
- **Preloader**: `#Preloader > .preloader__logo > figure.__logo > <svg viewBox="0 0 400 400">` (logo path) + a hidden `<video class="video-preloader" muted loop playsinline preload="none">` that takes over — **logo → video handoff, Edolus-style**.
- **Hero / archive**: 17 `<video muted autoplay loop playsinline webkit-playsinline>` (Vimeo progressive 1080p), `figure.__target[data-scroll-displace]` (scroll displacement), roman-numeral project counter `I / II / III`.
- **Typography**: **EB Garamond** regular + italic only; tokens `--primary-bg #000 / #fff`, `--secondary-color #8E8E93`, `#AEAEB2`, `#7D7D7D`.
- **Steal for KEUI**: restraint — one serif, two colours, one logo-draw preloader; proves "clean" can win SOTD.

### 1.12 EDOLUS and Rialto (owner references, for calibration)
- **EDOLUS** https://edolus.com/ — SOTD Oct 4 2026, 7.20; Dev 7.82 (Animations 8.80, WPO 7.80, Accessibility 7.20); tags Technology, Experimental, Animation, Storytelling, 3D, Interaction Design, WebGL, GSAP, GLSL; palette #000000; PlayCanvas scene (see BRIEF §4 for the loader deconstruction). Jury spread 6.2–9.4 — polarising, as WebGL sites usually are.
- **Rialto** https://rialto.com.au/ — awwwards Nominee (no award); tags animation, architecture, real-estate, scrolling, storytelling, typography, wordpress; elements: "Loading animation", "Divider lines scroll animation", "Animated logo carousel", "Carousel", "Footer". Its grammar (BRIEF §4: video hero + 750 ms easeOutQuart fade-ups + uppercase condensed grotesk) is what the owner likes; the awwwards-winning version of it is Tengile (same easeOutQuart curve, serif display instead of condensed grotesk).

---

## 2. Secondary evidence (2025 coverage, heritage-adjacent, and the brief's early leads)

| Site | Award / date | What it adds | Source |
|---|---|---|---|
| **Grand Hotel Central**, Barcelona — https://www.grandhotelcentral.com/en/ | HM Dec 16 2025 (emascaro) · tags clean, gsap, hotel-restaurant, minimal, photographic, storytelling, swiper, **video** | Heritage 1920s building; fonts **Joane** (serif) + **Raleway**; H1 uppercase "A LUXURY HOTEL STEEPED IN HISTORY…"; 45 uppercase rules; palette `#33312F / #F4F4F3 / #C94E23`; `m-ventajas-marquee`. No `<video>` in server HTML despite the tag (**unverified** — likely injected). | `grandcentral.html` |
| **Spain Collection Travel** — https://spaincollection.com/ | HM Oct 26 2025 (Dgrees) · tags gsap, luxury, minimal, photo-video, **transitions**, webgl, wordpress | 9 `<video preload="metadata" loop playsinline muted>` incl. `spain.mp4`, `portugal.mp4` and a **`portugal-movil.mp4` mobile variant**; `.loader`, `.mask`, custom cursor `.cursor-drag / .cursor-follow / .cursor-play`; Lenis; palette `#18191C`. Fonts in external CSS (**not fetched**). | `spaincollection.html` |
| **Lasala Plaza Hotel**, San Sebastián — https://www.lasalaplazahotel.com/ | HM Jun 12 2026 (emexs) · tags parallax, interaction-design | GSAP ScrollTrigger + SplitText + Swiper; **pinned sections `.b-pin`** (`d-carousel-rooms`, `d-location`, `d-webcam`, `d-info-list`, `d-featured-blog`), `.text-reveal`, `.img-div-parallax`. | `lasala.html` |
| **Here & Away** — https://www.here-away.com/ | HM May 8 2026 (Duo Studio) | Next.js + **barba** + Lenis + Alpine; **PP Neue Montreal**; `--ease-primary: cubic-bezier(.215,.61,.355,1)`, clip-path transitions `duration-500`, `clip-hide` curtain; `PageLoading…dot` loader; palette `--color-rich-black #00151A`, `--color-isabelline #F0EFED`, `--color-khaki #BCAD96`, `--color-ash-gray #B6C8C8`. | `hereaway.html`, `css/hereaway-*` |
| **Khufu's**, Giza — https://khufus.com/ | HM May 7 2026 (monarqeg) · "elevated Egyptian dining at the Pyramids" | Heritage-adjacent background video `Lander-Video-Pyramids-Camel-Compressed.mp4` (`autoplay muted playsinline loop`, Elementor); fonts **IvyOra Display** (serif) + Bricolage Grotesque + GoldenHopes (script); 30 uppercase rules; palette `#6A4C36 / #3F2C1F / #FFCD57`; eases `(.22,1,.36,1)`, `(.77,0,.18,1) .85s`. **Cautionary**: script font + gold-on-brown = costume-world risk. | `khufus.html` |
| **Lingers**, South Tyrol — https://www.lingers.it/en | HM Aug 31 2026 (Brandnamic, TYPO3) | Fonts **Cinzel + Cormorant Garamond** (the Trajan-like family of our letterhead); ease `cubic-bezier(0,0,0.25,1)` ×44, `(.23,1,.32,1)`; `DNA-loader` spinner; palette `#777162 / #E6E6E6 / #C4BFB6`. Sibling Schlosshotel Kitzbühel (no award) uses `dashiell-text` + Assistant, `JS-parallax` with `data-parallax-orientation/scale/delay`. | `lingers.html`, `schloss.html` |
| **Odyssée** (clinic, not travel) — https://www.odysseeclinic.com.au/ | SOTD Oct 8 2026 (NIGHTJAR) | Quiet-luxury chrome: Mux videos with `thumbnail.webp` posters, `preload="auto"`; `.z-preloader fixed inset-0` with logo `opacity:0; translateY(20px)` + `text-small-caps-sans`; custom `#cursor` + `lg:cursor-none`; `--ease-expo-out: cubic-bezier(.16,1,.3,1)`; fonts **Basel Grotesk + PS Times**; paper `#FFFCF8`. | `odyssee.html`, `css/odyssee-*` |
| **Travel Next Level** — https://travelnextlvl.de/en | SOTD + Dev Dec 27 2024 (Artemii Lebedev) 7.36 / 7.04 | Webflow + GSAP + Lenis + split-type + Lottie; lazy videos `data-src="…-transcode.mp4" poster=""`; `.split-lines.color-inversion-target` (text colour inverts as sections change); ease `cubic-bezier(0.19,1,0.22,1)`; palette `#F1F1F1 / #010101`. | `travelnext.html` |
| **Son Brull Rural Sanctuary**, Mallorca — https://sonbrull.com/en/ | Nominee; element "Header Videos" (https://www.awwwards.com/inspiration/header-videos-son-brull-rural-sanctuary, tags motion · video · luxury · hotel · spa) | `<video preload="none" loop muted playsinline uk-video="autoplay: inview" src=…/home2026.mp4>` (UIkit in-view autoplay); `preloader.svg` logo splash; Typekit **soleil** + **NewYork** serif; mix-blend-mode ×15; H1 "The place where time stops". | `sonbrull.html` |
| **Hotel & Spa Resort Kaskady** — https://www.resortkaskady.com/ | HM Sep 1 2023 | Elements: hero header, hero images, **fullscreen interactive menu**, content sections, footer. (Older than window; brief lead confirmed.) | `aw/guess_hotel-spa-resort-kaskady.html` |
| **The Real Hotels** — https://www.therealhotels.com | HM Nov 12 2024 (Webflow) | Elements: hero animation (series-list hover), interactive map, menu interaction. Entertainment showcase, not a travel operator. | `aw/guess_the-real-hotels.html` |
| **Shikoku Pilgrimage** | HM Mar 13 2019 · tags fullscreen, big-background-images, storytelling, photo-video, culture-education, film-tv | The only "pilgrimage"-tagged awwwards site: an 88-temple route told as a fullscreen photo/video story. Live page not analysed (outside window). | `aw/sites_shikoku-pilgrimage.html` |
| **Reviving Saudi History** (DARAH) | Nominee, Jan 5 2024 · 3D, culture-education, storytelling, unusual-navigation, WebGL | Bold Experiences; the only Saudi destination/heritage entry 2024–2026. | `aw/sites_reviving-saudi-history.html` |

Not found on awwwards (searched): Nusuk, Visit Saudi, Diriyah, AlUla, Red Sea Global, Aman, Six Senses, One&Only — none has an SOTD/HM/Nominee page in the index (web search + tag probes). Treat the craft bar in PRODUCT.md as outside the awwwards universe.

---

## 3. Awwwards inspiration elements for hero video → image transitions

| Element page | Site / author | Tags | What the source shows |
|---|---|---|---|
| https://www.awwwards.com/inspiration/interactive-hero-header-video-to-image-transition-hotel-jagerhof | Hotel Jägerhof / upgreight | hero header, hero animation, video to image transition, mouse interaction, hover interaction, motion design | Hover crossfade loop→stills (0.8 s in / 0.6 s out, power2.out) + `play().catch()` image fallback. Decoded in §1.4. |
| https://www.awwwards.com/inspiration/hero-image-video-transition-poeza | Poeza / benpixel1 — https://poezabride.com | animation, video, transition, big text | Nuxt page; fullscreen `<video webkit-playsinline autoplay muted loop playsinline preload="auto" poster="/videos/shadow_poster.png" class="absolute … h-screen w-screen object-cover">` with `shadow.webm#t=0.001` / `shadow.mp4#t=0.001` sources, and an inline `data-video-wrapper` `aspect-video` slot **inside the H2** ("A new chapter [video] begins") sized `md:h-screen w-auto aspect-[572/720] overflow-clip` — i.e. the video is docked in the headline then grows to full bleed (**mechanism inferred from markup, not observed**). Font NeueHaasDisplay-Roman; ease `cubic-bezier(.4,0,.2,1)`. |
| https://www.awwwards.com/inspiration/hero-video-the-explora-journal and …/hero-card-the-explora-journal | Explora Journal / Skywire | hero-video, cruise, luxury, travel | Responsive-poster `<video data-poster-dk data-poster-mb data-multires-config>` (§1.8). |
| https://www.awwwards.com/inspiration/grids-the-explora-journal | Explora Journal | transitions, masonry grids, modular grids | Grid-to-grid page transition (`barba` present). |
| https://www.awwwards.com/inspiration/header-videos-son-brull-rural-sanctuary | Son Brull / staycreative | motion, video, luxury, hotel, spa | In-view autoplay header videos with `preload="none"`. |
| https://www.awwwards.com/inspiration/hero-animation-vander-hotel ("Hero reveal") | Vander Hotel / .RAW | animation, typography, photographic, reveal, composition | Stacked-still composition reveal (no video). |
| https://www.awwwards.com/inspiration/homepage-hero-video-david-alaba | David Alaba / HOLOGRAPHIK | interactive, hero video, on-scroll | Hero video reacts on scroll (**not fetched**). |
| https://www.awwwards.com/inspiration/transition-volt ("Video to Cards Flipping Transition") | Volt / Nika Agency | GSAP | Video → card grid flip (**not fetched**). |
| https://www.awwwards.com/inspiration/hero-transition-joonas-sandell-portfolio | Joonas Sandell | hero, mask, animation, page transition | Mask wipe on scroll (**not fetched**). |
| Preloaders: https://www.awwwards.com/inspiration/preloader-tengile-malamala-collection · …/preloader-son-daven · …/minimal-brand-page-loader-hotel-jagerhof | — | loading, preloader, brand loader, full-screen loader | Son Daven = video + % counter + logo handoff; Jägerhof = logo + clip-path curtain lift 0.75 s. |

Search results for the *search_inspiration/hero video* listing on awwwards are dominated by AI-tool landing pages (31 results, none hospitality), so the element pages above are the useful set.

---

## 4. Cross-site tables

### 4.1 Video hero attribute matrix
| Site | Autoplay/loop/muted/playsinline | preload | poster | mobile variant | overlay | CDN |
|---|---|---|---|---|---|---|
| Tengile | yes (camelCase React attrs) | metadata | none (scrim .4 black) | `…-mobile_540p.mp4` | `:before` opacity .4 | CloudFront |
| White Desert | yes | metadata | none | HLS renditions | `.hero-banner_overlay` + mist PNG | Cloudflare Stream |
| Jägerhof | yes + `data-video="background"` | default | `poster=""` + `<img data-video-fallback>` | none | `u-overlay` number="20" on stills | Bunny (`b-cdn.net`) |
| Reverie | loop muted playsinline, **no autoplay attr** (Framer plays via JS) | none | png 1920×1012 | vertical 608×1080 clip | bg `#1E392B` | framerusercontent |
| Velaa | loop muted playsinline | none | jpg 3840×2160 | none | — | Vimeo progressive 2160p/1080p |
| Son Brull | loop muted playsinline + `uk-video="autoplay: inview"` | none | none | none | — | self-hosted |
| Spain Collection | loop playsinline muted | metadata | — | `portugal-movil.mp4` | `.mask` | WordPress uploads |
| Explora | data-driven | — | `data-poster-dk/mb` webp | multires config | — | AEM DAM / Scene7 |
| Tandjung | autoplay loop muted playsinline | metadata | — | — | custom controls PAUSE/MUTE | S3 |
| Khufu's | autoplay muted playsinline loop | — | — | — | Elementor overlay | WordPress |

### 4.2 Typography matrix
| Site | Display | Body | Case of hero line | Eyebrow tracking |
|---|---|---|---|---|
| Tengile | PP Fragment Glare (serif) | Inter | UPPERCASE | 0 / -.01em (tight) |
| White Desert | Cardinal Classic Long (serif, italic hero) | Inter Tight + Oswald | Sentence | .1em / .175em |
| Son Daven | KTF Metro (grotesk) | KTF Metro | lowercase/sentence | .08em caps, -.064em display |
| Jägerhof | Bon Vivant Serif | Ronzino | Sentence ("Your Home,") | tight -.02em |
| Reverie | PP Editorial New Ultralight (serif) | GT Ultra | Title Case | — |
| KUBE | Saphion Light (serif) | Inter Variable | Sentence | tokens |
| Tandjung | Adobe Caslon Pro | Helvetica / Optima | lowercase stacked | .1em |
| Explora | SangBleu Republic | Shapiro | Sentence | .1 / .14 / .17em |
| Vander | Söhne Buch | Söhne | lowercase | -1px |
| Velaa | Canela Thin | Instrument Sans (+ Fustat) | Sentence | — |
| Depo Luxe | EB Garamond | EB Garamond | Sentence | — |
| Lingers | Cinzel | Cormorant Garamond | — | — |
| Grand Hotel Central | Joane | Raleway | UPPERCASE | — |

### 4.3 Colour worlds (all two-tone: one deep colour + one paper)
Tengile `#5C6E21`/`#FBF8F6` · White Desert `#1F2A44`/`#E9E7E1` · Son Daven `#2C2824`/`#A89474` · Jägerhof `#2F4F3E`/`#FAF8F4` (+clay `#C66A3C`) · Reverie `#1E392B`/`#FBF9F3` · KUBE `#000`/`#FDF9F4` (+lime `#DAF092`) · Tandjung `#A62A23`/`#F1ECDE` · Explora `#0C2340`/`#F4F2EF` · Vander `#353230`/`#F4F2F1` (+`#967850`) · Velaa `#4B4335`/`#E8E6DF` · Depo Luxe `#000`/`#FFF` · Here&Away `#00151A`/`#F0EFED` (+khaki `#BCAD96`). **Our letterhead pair `#0a4a2a`-family green / `#f8f8f8` paper with gold `#e0a028` hairlines sits squarely inside this winning convention — Reverie and Jägerhof are near-neighbours.**

### 4.4 Easing / duration library observed
| Purpose | Curve | ms | Seen at |
|---|---|---|---|
| Content fade-up | easeOutQuart `cubic-bezier(.165,.84,.44,1)` | 750 | Rialto (brief), Tengile |
| Content fade-up | `power2.out` y40 | 1200 | Jägerhof |
| Content reveal | easeOutExpo `cubic-bezier(.16,1,.3,1)` translateY(20rem) | 1400 | White Desert |
| Hero settle | `cubic-bezier(.19,1,.22,1)` scale 1.1→1 | 2000 | Tengile |
| Image mask wipe | `cubic-bezier(.4,0,.2,1)` mask-size | 1500 | Reverie |
| Curtain / page | `power2.out` clip-path inset | 750 (+500 delay on load) | Jägerhof |
| Page enter / exit | `cubic-bezier(.76,0,.24,1)` / `(.25,1,.5,1)` | 800 | White Desert (View Transitions) |
| Generic component | `--dur-s .4s / --dur-m .6s / --dur-l 1.2s` × `--ease-out (.25,1,.5,1)` | 400/600/1200 | Son Daven |
| Hover | `cubic-bezier(.4,1,.75,.9)` opacity | 400 | Reverie |
| Button transform | `cubic-bezier(.625,.05,0,1)` | 525 / 735 | Jägerhof |
| Menu open | bg `scaleY` expo.out, items stagger .05 | 750 / 600 | Jägerhof; KUBE 600 open / 300 close |
| Heading chars | `power2.out` scaleY, stagger .02 | 500 | Jägerhof |
| Marquee | scrub 2 (scroll-driven), xPercent ±80 | — | Jägerhof |

---

## 5. Ranked PATTERN CATALOGUE for KEUI

Ranking = (fit with "clean & premium, letterhead composure, no costume worlds") × (impact) ÷ (cost + risk). Repo context from BRIEF: React 18 + Vite, plain CSS tokens (`src/styles/tokens.css`), GSAP 3.12 + ScrollTrigger (`src/hooks/useGsapAnimations.js`), Lenis 1.1 (`src/hooks/useLenis.js`, `window.__lenis`), Three 0.160 (`src/hooks/useThreeScene.js`), Cloudinary (`src/components/Img.jsx`, `src/lib/images.js`), admin at /admin untouched.

| Rank | Pattern | Who uses it | Translation to Makkah / Madinah | Cost · Risk |
|---|---|---|---|---|
| 1 | **Scrim + settle video hero** — muted ≤12 s loop, 1080p/540p variants, 35–40 % scrim, 2 s scale 1.08→1 easeOutExpo, copy fade-up 750 ms easeOutQuart | Tengile, White Desert, Jägerhof, Rialto, Spain Collection | Aerial tawaf loop (Pexels 31208756 / Pixabay 272914) under a `#0a4a2a` scrim at 35 %; H1 "Your Journey to the Holy Land" serif sentence-case; Arabic line `خدمات ضيف الرحمن` under it; eyebrow "KARWAN E USMANIA · SINCE 2005" in .14em caps | Low · Low (poster + reduced-motion still; keep ≤4 MB, `preload="metadata"`, Cloudinary `q_auto,vc_auto`) |
| 2 | **Video → image fallback + hover still-swap** | Jägerhof (`video-fallback.js`, `home-hero-hover.js`) | `video.play().catch(showPoster)`; hovering "Umrah / Hajj / Qafila e Shoq" in the hero fades Madinah / Mina / Arafat stills over the loop (0.8 s in, 0.6 s out, power2.out), desktop only via `matchMedia('(hover:hover)')` | Low · Low |
| 3 | **Logo preloader → curtain → logo-to-nav handoff** (once per session) | Edolus (brief), Son Daven, Jägerhof, Depo Luxe, Tandjung, Odyssée | KU monogram: gold swoosh draws (SVG `stroke-dashoffset`), hairline gold progress, "loading" small caps; curtain = green `.transition_wrap` `clipPath inset(0 0 0 0)→inset(0 0 100% 0)` 0.75 s power2.out after ≤0.5 s; logo FLIPs to header (GSAP Flip); `sessionStorage` skip on repeat | Medium · Medium (LCP: cap total ≤1.5 s, never block when video poster is ready) |
| 4 | **Curtain page transition on route change** | Jägerhof (clip-path), White Desert (View Transitions API), Son Daven (barba cells), Here & Away (clip-hide 500 ms) | React Router: fixed green panel with gold hairline, `inset(100% 0 0 0)→0` 0.75 s on exit, lift on enter; or `document.startViewTransition` with CSS `::view-transition-*` 0.8 s `(.76,0,.24,1)` and plain fade fallback | Low–Medium · Low |
| 5 | **Gradient / band seam between video and paper** | White Desert mist PNG | Letterhead green sweep band + gold hairline overlapping the hero bottom edge (the exact letterhead motif), paper `#f8f8f8` section follows | Trivial · None |
| 6 | **Fade-up on scroll with one shared curve** | Rialto 750 ms quart-out; Jägerhof 1.2 s; White Desert 1.4 s | Replace current section fades with `y 32px, 0.9 s, cubic-bezier(.165,.84,.44,1)`, stagger .08, ≤8 children; same curve in GSAP as `power4.out` | Trivial · None |
| 7 | **Line-mask heading reveals** | Tandjung `.masking-text .line translateY(110%)`, Jägerhof SplitText scaleY, Travel Next Level split-lines | English headings line-by-line 0.9 s expo.out stagger .08; **Arabic/Urdu lines reveal as whole lines only** (char splitting breaks glyph shaping) | Low · Low |
| 8 | **Duration/ease token system** | Son Daven, White Desert, Here & Away, Odyssée | Add to `tokens.css`: `--dur-s:.4s; --dur-m:.6s; --dur-l:1.2s; --ease-out:cubic-bezier(.16,1,.3,1); --ease-quart:cubic-bezier(.165,.84,.44,1); --ease-in-out:cubic-bezier(.76,0,.24,1)`; mirror in a GSAP `defaults` | Trivial · None |
| 9 | **Letterspaced small-caps eyebrow system** | Explora .14em, Tengile, Rialto, Grand Hotel Central | Eyebrows in Cinzel/Josefin small caps `.14em` gold `#d89820` on paper / `#f0b030` on green; display serif at `-.01em`; never full-uppercase body or H1 | Trivial · None |
| 10 | **Data-attribute parallax (yPercent ±20, scrub, clamp, per-breakpoint disable)** | Jägerhof, Tengile sticky-200 %, Lasala, Schlosshotel | Sanctuaries cards and package imagery; hero video `yPercent 0→40` on exit | Low · Low (disable `<768px`) |
| 11 | **Multi-target primary CTA** | KUBE (room/table/spa), Tandjung (BOOK TABLE → wa.me) | "WhatsApp us" → Umrah / Hajj 2026 / Qafila e Shoq with pre-filled `https://wa.me/923334883578?text=…`; floating WhatsApp pill | Trivial · None (highest conversion value) |
| 12 | **Short preview loop → "Watch the film"** | Tengile, White Desert "Watch Film", Tandjung trailer | 10 s muted loop in hero, "Watch our film" opens 60–90 s KEUI film (native `<video controls>` in a modal) | Medium (needs a film) · Low |
| 13 | **Bottom-anchored mask image reveal (1.5 s)** | Reverie, Explora fadeRtL | Gallery and package cards unveil from the bottom; use `mask-size` transition or GSAP `clipPath inset(100% 0 0 0)→0` | Low · Low |
| 14 | **Numbered nav / chapters** | Velaa 01–11, Vander 01/02/03, Depo Luxe I/II/III | 01 Umrah · 02 Hajj · 03 Qafila e Shoq · 04 About · 05 Contact; chapter numbers on home sections | Trivial · None |
| 15 | **Fullscreen menu: overlay → panel scaleY expo.out → items stagger** | Jägerhof (0.3/0.75/0.6 s), KUBE (0.6/0.3 s), White Desert tiered, Kaskady | Green panel, gold hairline rules between items, English + Arabic subtitle per item, contact row from letterhead at the bottom | Low · Low |
| 16 | **Hover image reveal inside a paragraph** | Jägerhof intro (scale .8→1 0.6 s, mouse-x drift ×0.075) | About paragraph: "25,000+ pilgrims", "Saudi partners on the ground", "Pirzada Burhan uddin Ahmed Usmani Sahib" each reveal a floating photo on hover | Low · Low (desktop only) |
| 17 | **Pinned chapter (1–2 per page)** | Lasala `.b-pin`, White Desert globe-sticky, Tengile sticky media, ui-ux-pro preset | "The Journey": Makkah → Madinah → Mina pinned with image crossfade and a gold progress hairline; `start:'top top', end:'+=150%', scrub:1, pin:true`; off under 768 px and reduced-motion | Medium · Medium |
| 18 | **Scroll-driven title marquee with inline images** | Jägerhof (xPercent ±80, scrub 2), Tengile, Grand Hotel Central | Motto "FAITH × JOURNEY × TOGETHER" two counter-rows with 3:2 thumbnails of Haram / Nabawi at `height:1em`; scroll-scrubbed, never auto-spinning | Low · Medium (cheap if it autoplays fast) |
| 19 | **Custom cursor pill (gallery/sliders only)** | Tandjung (blur pill), White Desert `data-cursor-text`, Odyssée, Spain Collection | Small green "View" / "Drag" pill on the gallery; hidden on touch | Low · Medium (gimmick if global) |
| 20 | **No-video hero reveal (stacked stills)** | Vander | Reduced-motion / Save-Data fallback: three Haram stills compose in | Low · None |
| 21 | **Scroll-scrubbed video (WebCodecs)** / whole-site WebGL | Son Daven ActiveFrame, Edolus PlayCanvas, Tuscan Journey (MONOGRID) | Not recommended: weight, accessibility (Edolus Accessibility 7.2, Tuscan Dev 6.67), and it drifts toward "costume world". Keep the existing Three gold-particle dome as the only WebGL | High · High |

Explicitly avoid (seen in the sweep): saturated accent colours (KUBE lime `#DAF092`), script fonts and gold-on-brown (Khufu's), 17 autoplaying videos (Depo Luxe), full-uppercase H1s (Grand Hotel Central, 45 rules), auto-looping marquees, cursor effects on every element.

---

## 6. Recommended "award-grammar" spec for the design-language artifact

- **Hero**: Makkah aerial tawaf loop, `autoplay muted loop playsinline preload="metadata"`, Cloudinary mp4 at `w_1920,q_auto:eco` (≤4 MB) + `w_720` mobile, webp poster; scrim `linear-gradient(180deg, rgba(0,32,16,.35), rgba(0,32,16,.55))`; cover scale 1.08→1 over 2000 ms `cubic-bezier(.19,1,.22,1)`; copy fade-up 750 ms `cubic-bezier(.165,.84,.44,1)` staggered 80 ms (eyebrow → H1 → Arabic → CTA); `<img data-video-fallback>` + `prefers-reduced-motion` still.
- **Preloader** (first visit only): paper `#f8f8f8` field, KU monogram draws in 900 ms, gold hairline progress, "KARWAN E USMANIA" Cinzel small caps; curtain lift 750 ms `power2.out`; logo Flip to header 600 ms.
- **Route transition**: green panel `#0a4a2a` with 1 px gold `#e0a028` hairline, 750 ms in / 750 ms out, or View Transitions API 800 ms.
- **Type**: Cinzel (wordmark/eyebrows only) · Cormorant Garamond or Playfair (display, sentence case, -.01em) · Inter / Instrument Sans (UI) · Amiri or Fustat (Arabic); eyebrows `.14em` tracking.
- **Motion tokens**: `--dur-s .4s / --dur-m .6s / --dur-l 1.2s`, `--ease-out (.16,1,.3,1)`, `--ease-quart (.165,.84,.44,1)`, `--ease-in-out (.76,0,.24,1)`; menu 0.75 s expo.out; parallax ±20 % scrub; ≤2 pins per page; everything behind `matchMedia('(prefers-reduced-motion: reduce)')`.
- **Palette**: green `#004828 / #0a4a2a` · paper `#f8f8f8` · gold `#e0a028` hairlines (`#d89820` on paper) · ink `#181818`; dark sections `#003018`.
- **Conversion**: WhatsApp split CTA (Umrah / Hajj / Qafila), floating pill, letterhead contact row in footer and menu.

---

## 7. Unverified / not verified
- Tengile "Preloader" element mechanics and timings (client chunk, not in SSR HTML).
- Son Daven preloader timings and barba transition durations (logic not in the static scripts fetched; only CSS tokens recovered).
- Poeza "video docks inside the headline then expands" — inferred from markup, not observed in a browser.
- Rialto awwwards nominee *date* (page prints today's date); Grand Hotel Central's video (tagged on awwwards, absent from server HTML).
- Spain Collection Travel fonts (external CSS not fetched); feel good Resort (awwwards 404 at guessed slug) and R-Hotels (URL unknown) not analysed.
- David Alaba / Volt / Joonas Sandell element pages were not fetched (listed from search only).
- Jury scores for HM sites are community votes, not jury panels.
- No browser rendering was done; all timings are from CSS/JS source, so JS-driven overrides could differ at runtime.

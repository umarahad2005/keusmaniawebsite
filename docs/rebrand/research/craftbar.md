# Craft-bar study — Nusuk · Visit Saudi · Aman · Rialto · Edolus → KEUI positioning

Researcher: craft-bar agent · 2026-10-08 · Input: `research/BRIEF.md` (ground truth, not re-derived) + `ref/` files + live fetches.
Repo not modified. All downloaded site files live in `../craftbar-dl/` (untrusted data, isolated folder).

## 0. Method and verification legend

| Tag | Meaning |
|---|---|
| **[CSS]** | Read directly from a stylesheet/HTML downloaded 2026-10-08 with a browser User-Agent (`curl`). The plain WebFetch of nusuk.sa returned HTTP 406; the 406 was an `Accept`/UA issue — with browser headers nusuk.sa (560 KB), hajj.nusuk.sa (68 KB), visitsaudi.com/en (156 KB) and aman.com (208 KB) all returned 200. Files: `craftbar-dl/www.nusuk.sa_.html`, `nusuk-styles.css` (styles-OALAJ43E.css, 172 KB), `hajj.nusuk.sa_.html`, `hajj-styles.css` (668 KB), `www.visitsaudi.com_en.html`, `visitsaudi-site.css` (site-260e7e9b.css, 178 KB), `www.aman.com_.html`, `aman-all.css` (two Drupal aggregates, 285 KB). |
| **[REF]** | Read from the orchestrator's saved reference files in `../ref/` (rialto.html, rialto-theme.css/js, edolus-__loading__.js etc.). |
| **[WEB]** | Secondary web source (named inline). Treat as reported, not measured. |
| **[UNVERIFIED]** | Could not be confirmed; listed again in §9. |

Contrast ratios in §8 were computed (WCAG 2.x relative-luminance formula) from the sampled hex values in the brief; see §8.3.

---

## 1. Nusuk — nusuk.sa (platform home, Arabic default) and hajj.nusuk.sa (Nusuk Hajj)

### 1.1 Facts
- Operated by the Saudi Ministry of Hajj and Umrah; launched 26 Sep 2022 as the unified gateway to Makkah and Madinah; 25 languages; ">51 million users worldwide" stated Mar 2026; Nusuk Umrah (Aug 2025) in seven languages. **[WEB: en.wikipedia.org/wiki/Nusuk]**
- The Wikipedia image caption describes the logo as a "gold geometric icon" beside نسك / Nusuk. No official brand-guideline PDF, Behance or Dribbble case study for the Nusuk *brand* was found (six searches; results drowned by "NUS" Singapore). **[WEB / UNVERIFIED palette source]**
- AKQA's case study for the Nusuk *app* redesign (akqa.com/work/nusuk/a-spiritual-companion) **[WEB]**: organising concept = **light** ("The concept of light informed the UX and UI redesign"); a **compass "inspired by the sacred fabric and prayers that adorn" the Kaaba, which "illuminates upon alignment"**; permit graphics drawn from the ornamental patterns on the gates of the holy sites; photography of pilgrims in white ihram shot from behind, sunlight through patterned canopies; tone lines "Your guiding light", "Spiritual and seamless", the app "doesn't distract from your spiritual journey but stands ready to guide you". No hex values on the page.
- Both sites are built on the Saudi **DGA (Digital Government Authority) design system**: every button is `dga-btn`, body carries `data-theme="DGA-theme"`, the token prefix is `--dga-*`. **[CSS]** No official public DGA token sheet was found online **[UNVERIFIED]**, so the values below come from the shipped CSS.

### 1.2 Palette **[CSS]**
nusuk.sa `styles-OALAJ43E.css` (the token names are telling — the green scale is literally named "sa-flag"):

| Role | Token | Hex |
|---|---|---|
| Primary green scale `--colors-primary-sa-flag-*` | 25 / 50 / 100 / 200 / 300 / 400 | #f7fdf9 / #f3fcf6 / #dff6e7 / #b8eacb / #88d8ad / #54c08a |
| | 500 / **600-primary** / 700 / 800 / 900 / **950** | #25935f / **#1b8354** / #166a45 / #14573a / #104631 / **#092a1e** |
| Button primary | `--button-background-primary-default/hovered/pressed/selected` | sa-flag-600 #1b8354 / 700 #166a45 / 900 #104631 / 800 #14573a |
| Links, borders-primary, stepper done | `--color-link-primary`, `--color-border-primary` | #1b8354 |
| Secondary gold scale `--colors-secondary-gold-*` | 500 / **600-primary** / 700 / 800 | #f5bd02 / **#dba102** / #b87b02 / #945c01 (bright saffron; exists in tokens, barely used on the page — 1–2 occurrences each) |
| Brand bronze (the "Nusuk gold") | `--color-primary` / `--color-accent` / `--color-icon-highlight` / `<meta theme-color>` | **#806b4b** / **#846d4a** / #846d4a / #806B4B |
| Paper surfaces | `--color-bg` "spring-wood" / `--color-light` / body bg / cards | **#f7f6f0** / #eeebe1 / #f9fafb / #ffffff |
| Ink | `--color-dark` "rangoon-green" / `--color-text-default` / display / paragraph | **#1a1a18** / #161616 / #1f2a37 / #384250 |
| Neutral scale `--colors-neutral-*` | 25…950 | #fcfcfd #f9fafb #f3f4f6 #e5e7eb #d2d6db #9da4ae #6c727e #4d5761 #384250 #1f2a37 #111927 #0c111b (cool grey-blue, Untitled-UI-like) |
| Hero scrim | `.hero-base .hero-overlay{background:#092a1ecc}` | sa-flag-950 at 80 % alpha |
| Flag green in inline SVG (DGA badge / flag strip) | — | #006c35 appears 11× in the HTML markup, not in the token scale |

hajj.nusuk.sa `styles.min.css` ships **four themes** (`[data-theme=dga-theme]`, `nusuk-theme`, `nusuk-theme-dark`, `tasheer-theme`) **[CSS]**:
- DGA default primary = the same green (500 #25935F, 600 #1B8354, 950 #092A1E); secondary = the same saffron (#F5BD02 / #DBA102); success #17B26A; info #2E90FA; lavender #80519F; error #F04438.
- **`nusuk-theme` primary = bronze**: 500 **#B49164**, 600 **#9A7A52**, 700 #7C6242, 900 #4B3B28, 950 #2B2116; tints 800 #d7b37c, 900 #e6cba5, 950 #f3e3cf (dark theme inverts the scale). This bronze scale is the clearest statement of the Nusuk brand colour we can measure: a muted, warm, desaturated gold — never a yellow.
- `tasheer-theme` primary = blue (#15468c) — irrelevant, vendor theme.
- Light body: bg `--dga-neutral-color-50`, text `--dga-black-color` #161616. Dark body: #121212 / #ffffff.
- Hero: `.dga-hero-section{--dga-hero-bg-color:var(--dga-primary-color-950)}` with `::before{background:var(--dga-hero-bg-color);opacity:.8}` — again a 950-level scrim at 80 %.

### 1.3 Type system **[CSS]**
- One family on both sites: **IBM Plex Sans Arabic** (self-hosted woff2, weights 300/400/500/600/700, `font-display:swap`, unicode-range covers Arabic + Basic Latin). `--font-family-display` and `--font-family-text` are the *same* font. hajj.nusuk.sa aliases weights as families (`IBM-Regular`, `IBM-Medium`, `IBM-SemiBold`, `IBM-Bold`).
- Scale (nusuk.sa Angular component CSS, `font: weight size/line-height`): display-2xl 600 72/90 · display-xl 600 60/72 · display-lg 600 48/60 · display-md 600 36/44 · display-sm 600 30/38 · display-xs 600 24/32 · text-xl 600 20/30 · text-lg 600 18/28 · text-md 500 16/24 · text-sm 500 14/20 · text-xs 500 12/18 · text-2xs 500 10/14. Menu items `font:500 16px/24px`. `.hero-title` forced to display-sm 30/38 with `letter-spacing:-.6px`. Page-header variant `.header_content h1{font-size:64px;font-weight:var(--font-medium)}` → 48px on mobile, sub-copy 24px, search box `border-radius:20px; background:var(--color-spring-wood)`, 32px input.
- hajj.nusuk.sa rem scale: display-xl 3.75rem (60) · lg 3rem · md 2.25rem · sm 1.875rem · xs 1.5rem; text-xl 1.25 · lg 1.125 · md 1 · sm .875 · xs .75rem. Hero uses `h1.dga-display-xl.dga-font-semibold` + `h2.dga-display-md.dga-font-medium` + `p.dga-text-lg`.
- Buttons: `.dga-btn--lg{font:500 16px/24px; height:40px}`; `.dga-btn{transition: background-color .2s ease-in-out, color .2s, border-color .2s, box-shadow .2s; border-radius:var(--dga-border-radius-default)}`; outline variant `outline:1px solid; background:transparent; mix-blend-mode:multiply`, on-colour variant `outline-color:#fff6` (white 40 %).

### 1.4 Nav pattern **[CSS + WEB]**
- nusuk.sa (Angular, RTL default): (a) utility strip with Saudi flag + "registered with the Digital Government Authority" stamp + "How to verify?"; (b) main bar: logo, six `header-menu__item`s (16px/500) with chevrons, actions `header-action` (search, language EN + 7, login); (c) a **second nav** carrying a live prayer-time ticker — extracted label: "مكة | الصلاة التالية: العصر" ("Makkah | next prayer: Asr"); (d) accessibility toolbar (contrast toggle, text size ±, voice). Menu bg `--color-bg-menu:#fff`.
- hajj.nusuk.sa (Bootstrap 5.3.8 + DGA): site-info bar `dga-bg-neutral-100 border-bottom border-neutral-200`, then `navbar dga-main-navbar top-nav dga-bg-white` — **opaque white, not transparent over the hero**. Items: Home · The Journey · Serviced Countries · Packages · Service Providers · Hajj Guidelines · Search · EN · Login. Hamburger spans animate `.25s ease-in-out`.

### 1.5 Hero pattern **[CSS]**
- nusuk.sa: `hero-slide > hero-slide-image` (AVIF from media.nusuk.sa/cms/uploads/…avif) + `hero-overlay` (#092a1ecc) + centred `hero-content`: h1 "نسك بوابتك لرحلة إيمانية ميسّرة" (*Nusuk — your gateway to an eased journey of faith*), one paragraph ("the official platform under the supervision of the Ministry of Hajj and Umrah… the Muslim's first companion… all day, all year"), one CTA `hero-cta-btn` "حج الداخل" (*Domestic Hajj*). Centre-aligned, calm, one button.
- hajj.nusuk.sa: `<section class="dga-hero-section">` height **550px** (auto on mobile), `padding-block: var(--dga-spacing-5xl)`; `<video preload="none" autoplay playsinline muted loop poster="…/hero-section-bg.png">` → `https://cdn.tasheer.com/cdn/videos/hero-bg.mp4`, poster `<link rel=preload as=image fetchpriority=high>` for LCP; `video{position:absolute;inset:0;object-fit:cover;z-index:0}`; `::before` scrim primary-950 @ .8; content **bottom-left** (`.dga-hero-content{justify-content:end}` inside `col-12 col-xl-6`): h1 "Nusuk Hajj" · h2 "Your Gateway to a Journey of a Lifetime" · p (one sentence) · two CTAs "Start Registration" (primary) + "Registration Assistance" (secondary-outline). This is the closest *official* precedent for our video hero.

### 1.6 Section rhythm **[CSS]**
- nusuk.sa home (h2 order, translated): Your journey with Nusuk (Hajj / Umrah / Al-Rawdah cards) → Everything the Guest of Allah needs in one place → Every Hajj begins with intention → Explore our services (Hajj permit / Umrah permit / Rawdah permit) → Discover the beauty of the Two Holy Mosques → 100+ services for your journey of faith → Your gateway to pray in Al-Rawdah → Explore 140+ places in Makkah and Madinah → Achievements of Nusuk. Spacing tokens 4px base: `--spacing-1:4px … --spacing-16:64px, -20:80px, -24:96px, -32:128px, -40:160px` (section pads use 5xl). Radii `--radius-xs:2 sm:4 md:8 lg:16 xl:24 full:9999`; `--components-card-radius: var(--spacing-4)` = 16px; most-used literals 8px (8×), 20px (8×), 12px (5×).
- hajj.nusuk.sa: hero → "global packages banner" card (`dga-card dga-p-5xl`) → Services (All Inclusive / Shifting / Non-Shifting) → "HAJJ IN A GLIMPSE" (4 `<video preload="metadata" controls>` with posters) → "10 steps closer to 1447 Hajj" numbered 01–10 grid → FAQ accordion → footer (About / Support / social).

### 1.7 Motion cues **[CSS]**
- Deliberately minimal. nusuk.sa: `transition: opacity .2s linear` (3×), `all .3s ease-in-out`, `transform .25s cubic-bezier(0,0,.25,1)`, Material standard curve `cubic-bezier(.4,0,.2,1)`; skeleton shimmer `1.5s ease-in-out infinite`. hajj: `all .2s ease-in-out` (27×), colour/transform `.35s ease-in-out` (10×), Embla carousel. **No scroll-reveal classes, no parallax, no pinned sections found in either stylesheet** (JS-driven motion not ruled out).

### 1.8 What makes it feel official / premium
- Government chrome you cannot fake: DGA registration stamp, flag strip, accessibility toolbar, prayer-time ticker.
- One typeface at two weights (500/600), cool grey-blue neutral scale, one green (named after the flag) used for *actions only*, bronze reserved for icon highlights and the app brand.
- Paper, not white: `#f7f6f0` / `#eeebe1` surfaces; charcoal-green ink `#1a1a18`.
- Hero copy is one headline, one sentence, one or two buttons; nothing animates for its own sake.

### 1.9 What a cheap copy would look like
- Reproducing the DGA stamp / flag strip / "official platform" wording (this is impersonation of a government body — never).
- Using the saffron `#f5bd02` scale at any size; green card grids; the 80 % scrim on *video* (it turns footage into a tinted slab — Nusuk can afford it because its hero is a still).
- Bootstrap-blue focus rings, Embla dots, 20px radii everywhere.

---

## 2. Visit Saudi — visitsaudi.com/en

### 2.1 Stack and facts **[CSS]**
- React components mounted via `data-component="…" data-props='{…}'`; content paths contain `/content/sauditourism/en/jcr:content/…` (Adobe Experience Manager); media also served from an Oracle object-storage bucket named `VSW-Wagtail-Prod-ObjectStorage`. Tailwind utility CSS (`!h-auto`, `h-[650px]`, `md:h-screen`). Swiper for carousels.
- Fonts self-hosted as **variable fonts**: `SaudiSans-VF.woff2` (primary: Regular / 500 "SemiBold" / 700 Bold) and `SaudiSerif-VF.woff2` (secondary), plus `Gotham` (tertiary) and a `Saudi-Riyal` symbol-font fallback on every stack. **[CSS]** Whether "Saudi Sans/Serif" is the Ministry of Culture "Saudi Typeface" launched 16 Apr 2025 (saudipedia.com/en/saudi-typeface) is plausible but **[UNVERIFIED]** — the Saudipedia article names no styles.

### 2.2 Palette **[CSS]**
- Measured in `site-260e7e9b.css` (Tailwind `rgb(r g b / var(--tw-*-opacity))` counts): white 21×, black 9×, **text #4b4b4b** (rgb 75 75 75, 4×), greys #f8f8f8 / #f2f2f2 / #ededed / #e0e0e0 / #ddd8d8 / #d2d2d2 / #b5b5b5 / #aaaaaa, dark #2d2d2d / #1d1d1d / #1f2937, **plum #78006e** (rgb 120 0 110, 2×) and magenta #be008d / #c30086, gradient pairs `#fa783c → #ff4664` (orange → coral) and `#64a0dc → #46c8a0` (blue → teal), success #51c041, Swiper default #007aff left untouched.
- Brandfetch's auto-profile (visitsaudi.com: Concrete #f2f2f2, Alabaster #f8f8f8, Cardinal Pink #78006e) **[WEB]** matches the CSS — but Brandfetch returned 403 to direct fetch; values seen only via search snippet.
- Net: a **white/grey chrome with photography as the colour**, and campaign gradients for promos. There is no "Saudi green" on this site.

### 2.3 Type system **[CSS]**
- `--font-primary: SaudiSans-Regular` (UI/body), `--font-secondary: SaudiSerif-Regular/SemiBold/Bold` (editorial headings), `--font-tertiary: Gotham`. Reset h1 `2em/35px`, h2 `1.5em/27px`; component overrides `h1 30px/44px` (mobile) → `48px/71px` (desktop, `text-5xl`). Tailwind `.uppercase` + tracking utilities present.

### 2.4 Nav pattern **[CSS]**
- `<header id="main-header"><div data-component="MainMenu" data-props-id="global-nav-props">` — fully client-rendered; props include both `"isTransparent": true` and `false` (page-dependent). On the homepage the hero container is `h-[650px] md:h-screen -mt-16 lg:-mt-20`, i.e. the hero is pulled up under a **64px (mobile) / 80px (desktop) transparent nav**. Mega-menu entry "Destinations" visible in props; a "Skip to main content" link precedes it.

### 2.5 Hero pattern **[CSS]**
- `data-component="BannerSlider"` full-viewport slider; card 1 "AFC Asian Cup Saudi 2027™" uses a still (`asian-cup_crop-1920x1080…fill-1920x1080.png`, preloaded `fetchpriority="high"`, mobile crop 800×1078); another card carries `"videoFileReference": ".../videos/scth/aquarabia-rides.mp4"`. Destination tabs: Riyadh · AlUla · Jeddah · Eastern Province · Hail · Diriyah, plus "About Saudi Arabia" / "Travel Guide". So: **image-first hero with video as a slide asset, poster always preloaded**.

### 2.6 Section rhythm **[CSS]**
Hero slider → "Your Next Destination Awaits" (OffersAndDeals) → "What's On" (events, small scrollable cards, filter this-month) → "Discover the Latest Offers" → "Things To Do" (5 large scrollable cards) → "Stories and Insights" → "Know the Destinations" (Google map, `showMapBorder`) → "Book your next adventure" → MetricsCards (with `metric-cards-colored-ornament.svg` / colorless variant) → "Impact of Digital Transformation" (SVG pattern background). Radii measured: 1rem (4×), .5rem, 10px, 14px, 16px, 20px, 32px — rounded cards and pill chips.

### 2.7 Motion cues **[CSS]**
`cubic-bezier(.4,0,.2,1)` 8×, `cubic-bezier(0,0,.2,1)` 3×, `transition .2s–.3s`, `opacity .3s`; Swiper fades. No scroll choreography found in CSS.

### 2.8 Official / premium: the national type pair (sans for UI, serif for editorial), edge-to-edge destination photography, restrained grey chrome, geometric "ornament" SVGs used as light decoration on stat cards, a real map module, eight languages.
### 2.9 Cheap copy: orange/pink/teal gradients on a pilgrimage brand; 32px pills on everything; Swiper default dots; ornament patterns at full opacity behind text.

---

## 3. Aman — aman.com

### 3.1 Stack and facts **[CSS]**
Drupal (`/sites/default/files/css/…`, `paragraph--type--*`, slick + blazy lazy-load). `<meta name="theme-color" content="#f3eee7">`. 36 resorts in 21 countries (meta description). A reverse-engineered DESIGN.md exists at shadcn.io/design/aman **[WEB]**; its numbers below were checked against the live CSS where possible.

### 3.2 Palette **[CSS: occurrence counts in aman-all.css]**
- **Ink #313131** (52×) — charcoal, never pure black; mid #404040 (28×), soft #585858 (20×), sage-grey **#82847f** (19×), faint #aaa6a3 (9×), #625f5f.
- **Linen #f3eee7** (47×) — the brand field (header bg, theme-color, button label on ink); hairline **#dad9d7** (30×), #e6e2db (13×), #d5d1c8, #ebe8e5, #d8d4cf, #dcd7d3; mega-menu featured panel #fdf9f5.
- Accents barely exist: muted **gold #b38b5b** (5×), #caa48d (4×), terracotta #f9c9bf, sand #f4daa6, sage #c9e1bd, #a9b7b3; error #bb1616.
- Shape: `border-radius:0` (6×) and `50%`/`100%` for circles only; 2px once. **No shadows, no radius, no accent** is a measured fact, not a slogan.

### 3.3 Type system **[CSS]**
- `:root{font-size:14px}`; `body{font-size:1rem;line-height:1.45;color:#313131;letter-spacing:0.0571rem (0.8px)}`.
- Families self-hosted: **Lyon Text Web Regular** (+ an "Aman" cut `LyonText-Aman-Regular`, italic), **Lyon Display Web Light**, **WhitneySSm 300/400**, Whitney Book (Light 200 / Medium 300), Calligraph810 (script, campaign), NotoSerif JP/SC (locales), Janu Sans (sister brand), plus Spectral / Source Sans 3 / Source Code Pro (Drupal admin, ignore).
- Sizes: `h1,.h1 / h2,.h2 {font-size:2.22rem}` = **31.08px** → `1.722rem` (24.1px) on small screens; `h3.subheader 1.2rem uppercase letter-spacing .2857rem (4px)`; `.subtitle / .cta_wayfinder / card .subtitle {font-size:.722rem (10.1px); uppercase; letter-spacing:.1429rem (2px)}`; `h1.subtitle` set in WhitneySSm .722rem; `.global-featured__head 10px uppercase`; `.booking-bar label 10px letter-spacing 2px`; nav sub-labels `.7rem uppercase` WhitneySSm. The shadcn spec's claim "all weights 400, hierarchy by size + tracking" is consistent with the @font-face inventory (no bold Lyon or Whitney loaded).

### 3.4 Nav pattern **[CSS]**
`header.main-header > .header__top` (hamburger "Menu" with thin→thick icon swap on focus, thin-stroke search icon, centred wordmark, "Reserve", language). `.sticky-whole-header--enabled .header__top{background:#f3eee7}`; on `page-theme--transparent-header:not(.scrolled)` the bar is `rgba(0,0,0,0)` with `transition: background-color 300ms`, fills linen on hover, and `.scrolled` shrinks the grid `min-height` to **4rem** with `transition: min-height .35s ease-in-out`. Mega-menu: `.global-navigation__list` entries `animation: slide-fade-in-left 400ms both`, children `slide-in-right`; featured panel (`.global-featured`, bg #fdf9f5, `animation: fade-in 1s`) shows "New & Noteworthy" (10px uppercase) + one card (Amanvari, Mexico · "Now open." · "Discover more") and "Discover Aman in…" region buttons.

### 3.5 Hero pattern **[CSS, 2026-10-08 homepage]**
First block inside `<main>` is `paragraph--type--video … bc-player--intro block--video`: a **full-width Vimeo oembed iframe** (`vimeo.com/1233451161`, "Aman Festive Campaign 2026", `loading="eager"`, `aspect-ratio:426/240`, `allow="autoplay…"`), followed — *below* the video, not overlaid — by `<header class="hgroup hgroup--limited hgroup--plain">`: `<p class="subtitle">festive with aman</p>` (10px tracked uppercase) + `<h2 class="heading-h">Rituals of Joy</h2>` + one link. Note: the WebFetch text summary mistook the mega-menu's "New & Noteworthy / Amanvari" panel for the hero; the DOM order above is what ships.

### 3.6 Section rhythm **[CSS]**
video intro → `slider-cards` ("Explore the World of Aman", eyebrow "HOTELS & RESORTS") → reuse-paragraph → `text-and-carousel-of-cards` ("Seasonal Experiences": Grand Ski Adventures · In the City · A Novak Djokovic Programme · Aman Villas · Aman Japan Journey · To the Wilds) → basic → `carousel-of-cards` ("Aman Residences / Own a Private Piece of Aman") → `highlighted bg-sand-grey slider-cards` ("The World of Aman": capsule collection, gift cards, Aman at Sea) → sign-up → footer. Every block = eyebrow + serif heading + ≤1 link. Section padding 65px (shadcn spec; `container--spacer` in CSS) **[WEB-checked]**.

### 3.7 Motion cues **[CSS]**
`transition: border-color .4s, color .4s, box-shadow .1s, background-color .4s` (20×); `opacity 200ms` (4×), `transform .3s`, `all .35s ease-in-out`; header shrink .35s; nav 400ms slide-fade; featured 1s fade; lazy images fade via blazy. Zero parallax, zero scroll-scrub, no hover zoom on cards.

### 3.8 Official / premium: charcoal on linen; one serif at ~31px max on the whole site; eyebrows at 10px with 2px tracking carry the hierarchy; hairlines `#dad9d7`; edge-to-edge photography with no radius; a transparent header that becomes linen at 4rem; 400ms colour transitions, nothing faster than 200ms.
### 3.9 Cheap copy: Playfair Bold at 60px standing in for Lyon; gold headline text; drop shadows and 16px radii; three buttons per block; a hero headline *over* the video shouting in uppercase.

---

## 4. Rialto — rialto.com.au (owner's reference for the video hero)

### 4.1 Stack **[REF]**
WordPress theme `rialto-2026`, jQuery, Vidstack `<media-player>` for video, Swiper, IntersectionObserver fades. No GSAP, no Lenis.

### 4.2 Palette **[REF: rialto-theme.css :root]**
`--color-body-bg:#080808`, `--color-body-color:#fff`, `--color-accent:#004bff` (electric blue; `.module--blue{background:#004bff}`), `--color-gray-300:#d1d4d6`, `-700:#3d3d3b`, `-800:#231f20`, `-900:#080808`, `--color-pink-400:#ffc8ff`, `--color-white-thin: rgba(255,255,255,.5)`, `--color-current-thin: color-mix(currentColor 50%)`. Header gradient `linear-gradient(180deg, color-mix(in srgb, var(--color-secondary) 75%, transparent) 0%, transparent 100%)` + `backdrop-filter: blur(10px)`.

### 4.3 Type system **[REF]**
`html{font-size:62.5%}` so 1rem = 10px. `body{font-family: Gotham; font-size:2.4rem (24px); font-weight:300; line-height:1.125}` → 18px ≤1023, 16px ≤767. `h1{font-family:"Sharp Grotesk"; font-weight:700; font-size:20rem (200px); letter-spacing:.015em; line-height:.84; translate:0 .06em}` → 15rem at a mid breakpoint → 14rem ≤1023 → 13rem/.8 ≤767. `h2` 10rem → 8rem → 7rem. `h3` Gotham 2.4rem/2rem, `h4` 1.4rem, `h5` 1.2rem, `.text-sm` 1.2rem. Buttons: Gotham 500, **1rem (10px)**, `letter-spacing:.185em`, uppercase, 1px border, padding `0.8rem 2rem`, hover → gray-700 fill; `--t-duration:.3s`. Uppercase eyebrows with `.2em` tracking (3×).

### 4.4 Nav pattern **[REF]**
`header.header.borders` fixed, `padding-block:1.5rem`, z-index 10; `.header__inner.fade-in.fade-bottom` with `data-fade-settings='{"delay":200,"duration":750}'`; split menu `nav` left (Discover / What's On / Experience) · centred SVG logo · right (Leasing / About / Contact) · `btn` "PORTAL LOGIN"; `btn-menu` 3-span burger → rotates 90° on open; `.menu-bg` reveals via `clip-path .3s`. Two `.header` states exist: `--bg-size:100%` + blur (gradient visible) and `--bg-size:0%` + `backdrop-filter:none` (transparent) — the selector/media-query wrapping the second state was not captured.

### 4.5 Hero pattern **[REF]**
Module order starts `module--landing_animation` (a landing/intro module) then `module--hero spacing-top-none spacing-bottom-xs` containing `component--video` → Vidstack `<media-player>` with `https://rialto.com.au/wp-content/uploads/2026/04/hero1-1.mp4` (further `vid3.mp4`, `vid5.mp4` in `full_width_media` modules). Video/img `object-fit` fills the module; copy over it: eyebrow "CELEBRATING 40 YEARS" / "A MELBOURNE ICON", h1 "AMBITION LIVES HERE". The body also has `body:not(:has(.module--header,.module--hero)){padding-block-start:var(--header-height)}` — only hero pages let content run under the fixed header.

### 4.6 Section rhythm **[REF: 20 modules on home]**
landing_animation → hero → image_text → tiles_carousel → full_width_media → heading → slider → full_width_media → heading → tiles_carousel → image_text → features_grid → full_width_media → image_text → heading → slider → full_width_media → image_text → heading → form. Spacing via `spacing-top/bottom-{none,xs,sm,md}` classes; `--shell-max-width:250rem (2500px)`, `--shell-gutter:2rem`. A "heading" module sits before almost every content module — oversized title, then media.

### 4.7 Motion cues **[REF]**
`.fade-in{opacity:0; transform: translate(var(--translate-x), var(--translate-y)); transition: opacity, transform var(--fade-duration,.75s) var(--fade-delay,0s) cubic-bezier(.165,.84,.44,1)}` (easeOutQuart); directions `fade-bottom{--translate-y:min(25%,10rem)}` etc.; `.animated` resets to 0; 44 `.fade-in` elements on the home page; IntersectionObserver `threshold:.25`, unobserve after first hit. Border lines draw in: `.borders [class^=border-]{transition: clip-path .6s linear}` on `is-visible`. Swiper effects: `swiper-cube` 18×, `swiper-fade` 2×, `swiper-creative` 2×. Hover transitions `.3s`.

### 4.8 Premium: one accent on a #080808 field; 300-weight body at 24px; condensed uppercase display at 200px with .84 leading; hairline borders that *draw*; patient 750ms easeOutQuart; a fixed header that fades in after the page.
### 4.9 Cheap copy: that exact black field + condensed uppercase + gold on a Hajj site reads as a nightclub or crypto brand; cube swipers; 200px headlines in a serif.

---

## 5. Edolus — edolus.com (owner's reference for transitions/backdrop)

### 5.1 Stack **[REF]**
A PlayCanvas WebGL application (`playcanvas-stable.min.js`, scene `2509662.json`, WebGL2/1, `powerPreference:"high-performance"`), `html,body{background:#1d292c; overflow:hidden}`, Helvetica fallback. The DOM site is only the splash (`__loading__.js`, 1 300+ lines, commented).

### 5.2 Splash tokens **[REF: edolus-__loading__.js line refs]**
- Field `#000000` (L903, L971); type **General Sans** (Fontshare 200–700, L68) — one family.
- Logo: white SVG (`.st0{fill:#FFFFFF}`), `SPLASH_LOGO_WIDTH = 430px` (max 85vw, L50); each glyph draws via a canvas worker with `easeInOutCubic` (L338) and `fill-opacity 0.9s ease` staggered `i*0.15s` (L395).
- Progress readout `PROGRESS_GAP_PX = 20` below the logo (L51), `0.75rem; letter-spacing:.15em` (L1005–1006), digits roll in discrete steps `easeOutCubic` with `ROLL_HOLD_MS = 70` (L297), `EASE_PER_FRAME = 0.10` (L36), `HOLD_BEFORE_OPEN = 0.99` (L35).
- Timing: `REVEAL_MIN_MS = 3000` (0 on replay via `sessionStorage 'edolusReplay'`, L23–27), `FAKE_FILL_MS = 3500` (L28), `REVEAL_SETTLE_MS = 800` (L41), **`BAND_OPEN_MS = 1600`** with `transition: transform 1600ms cubic-bezier(0.65, 0, 0.35, 1)` on `#custom-band-top/bottom` (L47, L983–987), `onRevealComplete` at +100ms (L742), title at +200ms (`opacity 3s ease .3s`, L757/L1071), CTA at +900ms (L758) built from a 1px line → height expands → text scramble at 50 % height (L855), `padding .3s ease`; **logo glide to header** `transform 1s cubic-bezier(0.25,0.1,0.25,1)` with an inverted-FLIP pose (L653–658); overlay fade `opacity 1.2s cubic-bezier(.4,0,.2,1)` (L926); cards `opacity 1.4s` (L1275); stop-loss `25000ms` (L1356).
- Type: title weight 300 uppercase `.01em`, white; subtitle 400 uppercase `.12em` **#C4C7C7**; CTA white fill, black text, `0.75rem .1em` weight 500 (L1084–1172).

### 5.3 Premium: three seconds of pure black with a self-drawing mark; everything small, tracked and white; the reveal is a *curtain* not a fade; the logo lands exactly on the header's pixels; the CTA constructs itself. One font, two colours.
### 5.4 Cheap copy: a % counter on every visit (they skip it on replay — a conversion site must skip it after first visit); WebGL for a brochure; 3s hold before a WhatsApp CTA; copying the scramble effect on body text.

---

## 6. Side-by-side

| | Nusuk | Visit Saudi | Aman | Rialto | Edolus |
|---|---|---|---|---|---|
| Field | paper #f7f6f0 / #f9fafb | white / #f8f8f8 | linen #f3eee7 | #080808 | #000 → #1d292c |
| Ink | #161616 / #1a1a18 | #4b4b4b | #313131 | #fff | #fff / #C4C7C7 |
| Action colour | green #1b8354 (flag-named) | plum #78006e + gradients | none (ink fill) | blue #004bff | white |
| "Gold" | bronze #806b4b / #9a7a52; saffron #dba102 in tokens only | — | #b38b5b, 5 uses | — | — |
| Display face | IBM Plex Sans Arabic 600, 30–72px | Saudi Serif VF 48px | Lyon Text 400, 31px | Sharp Grotesk 700, 200px | General Sans 300 |
| Nav | opaque white + utility strip | transparent 80px over hero | transparent → linen 4rem on scroll | fixed, blur gradient | none (3D) |
| Hero | still/video + 80 % green-950 scrim, centred/bottom-left | full-vh slider, poster-first | video *above* eyebrow + serif title | full video, uppercase h1 over it | curtain reveal into 3D scene |
| Reveal easing | .2–.3s ease-in-out | cubic-bezier(.4,0,.2,1) | .4s colour, 200ms opacity | **750ms cubic-bezier(.165,.84,.44,1)** | 1600ms cubic-bezier(.65,0,.35,1); 1s (.25,.1,.25,1) |
| Radius | 8–16px cards | 8–32px | 0 | 1px borders, radius var | 0 |

---

## 7. KEUI positioning statement

**Karwan e Usmania sits two-thirds of the way toward Nusuk/Aman and one-third toward Rialto/Edolus:** *Nusuk's composure and Aman's paper, with one Rialto moment per page and an Edolus handshake on first visit.*

- **Field = paper, not black.** The letterhead is a `#f8f8f8` sheet with green sweeps and gold hairlines (BRIEF §2); Aman proves a luxury site needs no dark field (`#f3eee7` + `#313131`), and Nusuk proves an official pilgrimage site is light (`#f7f6f0` + `#161616`). Rialto's `#080808` and Edolus's `#1d292c` are *moments* for us, not the ground. The only full-bleed dark surfaces are: the hero (video under a green scrim), the footer (letterhead green band), and at most one "Qafila e Shoq" chapter.
- **Ink = letterhead green, in the role Aman gives charcoal.** Headings and body on paper are set in the letterhead/logo green family (`#104028` / `#004020`, 11.1:1 and 11.3:1 on `#f8f8f8`), not in black. Nusuk's green is an *action* colour; ours is the *voice*. Fills in green are limited to the hero scrim, the footer, the sweep band and the single primary button.
- **Gold = hairline, eyebrow, icon.** Both measured craft-bar "golds" are muted bronzes used a handful of times (Nusuk `#846d4a`, `#9a7a52`; Aman `#b38b5b` 5×). Our logo gold `#e0a028` is brighter than either and fails text contrast on paper (2.14:1), so it lives as 1px rules, the crescent/swoosh in the mark, and uppercase eyebrows **on green** (`#e0a028` on `#004020` = 5.26:1; `#f0b030` on `#083820` = 6.86:1). Gold *text on paper* uses the logo's bronze shadows (`#906000` 5.12:1, `#885800` 5.74:1).
- **Motion = Rialto's one curve, Aman's patience, Edolus's one handshake.** Scroll reveals use a single easing (`cubic-bezier(.165,.84,.44,1)`, 750ms) like Rialto's 44 `.fade-in`s; colour/hover transitions are 300–400ms like Aman; the Edolus curtain + logo-to-nav FLIP runs once per session (≤1.6s total) and never again. No cube carousels, no scramble text, no WebGL scene — the Three.js dome particles we already ship (`src/hooks/useThreeScene.js`) are the one ambient element and stay under the hero only.
- **Chrome = Aman's header on Nusuk's grid.** Transparent over the hero, becomes paper with a gold hairline after scroll (Aman: `transition: background-color 300ms`, shrink to 4rem in .35s), with a WhatsApp button as the only filled control (BRIEF: WhatsApp is the conversion path). Nusuk's 4px spacing scale and 8/16px radii; Aman's 0 radius on images.
- **Voice/props = official without impersonation.** We borrow Nusuk's *structure* (one headline, one sentence, two buttons; numbered steps; FAQ) and *never* its government signals (flag strip, DGA stamp, "official platform" copy). Trust comes from our own verifiable facts (founded 2005, 25,000+ pilgrims, Saudi ground partners — BRIEF §2).

### 7.1 Spectrum
```
official · light · calm                                     cinematic · dark · immersive
Nusuk ───── Visit Saudi ───── Aman ───●─ KEUI ─────────── Rialto ───── Edolus
```

### 7.2 Type direction implied by the bar (for the design-language author to adopt or reject)
- Wordmark/eyebrows: a Trajan-like small-caps serif to match the letterhead lockup (BRIEF §6 lists Cinzel as closest) — eyebrow size 11–12px, tracking .18–.2em (Rialto buttons `.185em`, Aman 2px@10px).
- Display: a serif at weight ≤500 and ≤56px on paper (Aman caps at 31px; Nusuk at 48–60px); current Playfair 400 is acceptable, Cormorant 500 is the "luxury" alternative in the ui-ux-pro-max output.
- Body/UI: Inter 400 at 16–18px / 1.6. Arabic: Amiri for the tagline line (`خدمات ضيف الرحمن`), IBM Plex Sans Arabic for any Arabic *UI* strings (Nusuk precedent, Google-Fonts available).

---

## 8. Ten house rules (clean + premium, while delivering the video hero and cinematic transitions)

1. **One video hero per page, and only the Home hero is full-viewport.** Inner pages (`PageHeader`) use a Cloudinary still at ≤60vh. Hero loop: ≤12s, ≤4MB (BRIEF §5 tip), 1920×1080 H.264 + poster JPEG preloaded with `fetchpriority="high"`, `<video autoplay muted loop playsinline preload="metadata" poster>` exactly as hajj.nusuk.sa ships it; `prefers-reduced-motion` → poster only; mobile ≤768px → poster only unless on Wi-Fi (`navigator.connection.saveData` check). Candidate footage: BRIEF §5 Pexels/Pixabay Tawaf clips (licence to be verified per clip).
2. **Paper is the ground; dark is an event.** Body `#f8f8f8`/`#ffffff`; dark surfaces = hero, footer, ≤1 chapter. Never two dark sections adjacent; never a dark card grid.
3. **Gold is a hairline, never a fill.** Allowed: 1px rules (`rgba(224,160,40,.35)` on paper, `#e0a028` on green), eyebrow text on green, icon strokes, the mark. Forbidden: gold backgrounds taller than 48px, gold buttons, gold gradients/foil textures, gold text on paper lighter than `#906000`. Contrast floor: 4.5:1 for text, 3:1 for hairlines/icons (computed: `#e0a028` on paper 2.14:1 — fails; `#906000` 5.12:1 — passes; `#e0a028` on `#004020` 5.26:1 — passes).
4. **Green is the ink, not the wallpaper.** Headings `#104028`/`#004020` on paper; green fills only for hero scrim, footer band, the top sweep, and the single primary button (`#004828`, white text 11.5:1-class). Cards are white on paper with `rgba(16,64,40,.12)` hairlines, radius ≤8px (Nusuk `--radius-md`), images radius 0 (Aman).
5. **Scrim discipline.** Hero scrim = green-950-class (`#083820`) at **45–60 %** plus a bottom-up gradient to 80 % under the copy — never Nusuk's flat 80 % (it hides footage). Text on the hero is white or paper; eyebrows gold; max 2 CTAs; headline ≤ 2 lines at ≤ 64px desktop / 36px mobile.
6. **Motion = one idea per section, never three.** Section reveal: opacity 0→1 + translateY 16–24px, **750ms `cubic-bezier(.165,.84,.44,1)`**, stagger 80ms, ≤8 children, IntersectionObserver/ScrollTrigger `once:true` at 25 % visibility (Rialto). Budget per page: 1 pinned scrub (hero → first chapter, `scrub:1`, `end:'+=150%'`), 1 counter block, 0 parallax on cards, hover scale ≤1.03, hover transitions 300–400ms (Aman). Reduced motion disables scrub and pins (keep DOM order readable).
7. **Hierarchy by size and tracking, not weight.** Display ≤500 weight; body 400; eyebrows 11–12px uppercase `.18–.2em`; no more than two Latin families + one Arabic; Arabic set 1.15× the Latin size on the same line.
8. **Chrome rules.** Nav transparent over the hero → paper with a 1px gold hairline after 80px scroll, `background-color 300ms`, height 80 → 64px (`.35s ease-in-out`); logo mark 40px; menu items 14–15px, tracking .04em; WhatsApp is the only filled control in the nav (`#25d366` stays as the WhatsApp colour, never used elsewhere). Footer = letterhead green band with paper text and gold hairline top edge.
9. **Surfaces and shadows.** Shadows ≤ `0 4px 24px rgba(8,56,32,.08)`; no glassmorphism except the nav blur over the hero (`backdrop-filter: blur(10px)` à la Rialto, removed once solid); pattern/ornament overlays ≤6 % opacity and never behind body text.
10. **The handshake runs once.** First visit only: paper curtain with the mark drawing itself (≤900ms, `easeInOutCubic`, glyph stagger 150ms as Edolus) → two-band curtain opens in **700–900ms `cubic-bezier(.65,0,.35,1)`** → mark FLIPs to the nav slot in 600ms `cubic-bezier(.25,.1,.25,1)` → hero copy fades up. Total ≤1.6s, `sessionStorage` skip on every later route; never a percentage counter; route transitions 500–700ms `expo.inOut` crossfade/curtain (GSAP Flip is already installed) with content fade-up after, Lenis scroll restored to top.

Two photography addenda (not counted): real Haram/Madinah footage and Cloudinary stills only (no mosque clip-art, no AI "golden Kaaba"); people in frame are pilgrims from behind or at distance (AKQA Nusuk direction), never posed stock models.

---

## 9. Unverified / not found (explicit)
1. Official Nusuk brand guidelines, logo colour spec, or the agency behind the 2022 identity — not found; the "gold geometric icon" description is a Wikipedia caption; palette comes from shipped CSS tokens, which may differ from print brand standards.
2. Whether Visit Saudi's `SaudiSans-VF` / `SaudiSerif-VF` are the Ministry of Culture "Saudi Typeface" (launched 16 Apr 2025) — plausible, unconfirmed. Brandfetch profiles (nusuk.sa, visitsaudi.com) returned 403; the visitsaudi values were seen only in a search snippet.
3. Visit Saudi nav labels beyond "Destinations" and the exact transparent/solid rule set — the menu is client-rendered; only `isTransparent` props were seen.
4. An official public DGA design-system token sheet (to confirm `#1b8354`/`#25935f`/`#092a1e` as DGA rather than Nusuk choices) — not found; community packages exist but were not inspected.
5. Aman: section padding 65px and the 88px transparent nav height are from the shadcn.io reverse-engineered spec; I confirmed 4rem scrolled height and the `#f3eee7`/`#313131`/Lyon/Whitney facts in CSS, not those two numbers. No Aman motion tokens beyond the transitions listed.
6. Rialto: the breakpoint for `h1 15rem`, the selector wrapping the `--bg-size:0%` header state, the `--border-radius-lg` value, and what `module--landing_animation` renders were not captured in the saved files.
7. Edolus: in-scene camera motion lives in PlayCanvas scripts (not saved); only the splash is measured.
8. No screenshots were taken (no browser session); every visual claim is derived from markup/CSS, not pixels.
9. Footage licences in BRIEF §5 must be verified per clip before use.

## 10. Sources
- Local: `research/BRIEF.md`; `ref/rialto.html`, `ref/rialto-theme.css`, `ref/rialto-theme.js`, `ref/edolus-__loading__.js`, `ref/edolus-__settings__.js`, `ref/edolus-styles.css`; `craftbar-dl/*` (downloads listed in §0); repo read-only: `D:/personal/projects/keusmaniawebsite/keu-website/src/styles/tokens.css` (current navy `#1a2e5e`, gold `#c9a84c`, cream `#f8f5ef`, `--section-y: clamp(4rem,10vw,8rem)`, radii 4–32px — the values the rebrand replaces), hooks `src/hooks/useGsapAnimations.js`, `useLenis.js`, `useThreeScene.js` (per BRIEF §3).
- Web: https://www.nusuk.sa/ (+ `/styles-OALAJ43E.css`), https://hajj.nusuk.sa/ (+ `/assets/scss/styles.min.css`, hero video https://cdn.tasheer.com/cdn/videos/hero-bg.mp4), https://www.visitsaudi.com/en (+ `/static/frontend/css/site-260e7e9b.css`), https://www.aman.com/ (+ Drupal CSS aggregates), https://akqa.com/work/nusuk/a-spiritual-companion, https://en.wikipedia.org/wiki/Nusuk, https://www.shadcn.io/design/aman/raw, https://saudipedia.com/en/saudi-typeface, https://brandfetch.com/visitsaudi.com (snippet only), https://rialto.com.au/, https://edolus.com/.

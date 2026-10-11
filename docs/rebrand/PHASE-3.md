# Phase 3 — Home (2026-10-11)

Home is rebuilt to DESIGN-LANGUAGE §3.3–3.4, §4 and the §5.1 storyboard. Build passes; tested in Chrome at 1280×632 (desktop film layout) and 375×812 / 375×620 (phone, through an iframe because the automation window cannot be resized).

## What shipped

| Area | Files |
|---|---|
| Preloader | `scripts/build-intro.js` → inline intro in `index.html` (between `keu-intro:start/end`); `src/components/motion/Preloader.jsx`, mounted once in the public shell (`App.jsx`) |
| Hero | `src/components/VideoHero.jsx` (film / plate / phone layouts; video only ≥768 and never on Save-Data, 2g/3g, low-end or reduced motion); `src/styles/hero-safe.css` (generated) imported **after** `home.css` so its per-aspect variables win |
| Home sections | `Seam.jsx`, `StatsSection.jsx` (ledger), `PackagesGrid.jsx` + `PackageCard.jsx`, `BookingSteps.jsx`, `ServicesStrip.jsx`, `SanctuaryChapter.jsx` (the one pin), `WhyChooseUs.jsx`, `TestimonialsSection.jsx` + new `VideoReviews.jsx`, `FAQSection.jsx`, `CTABanner.jsx` |
| Composition | `src/pages/Home.jsx`: hero → seam → ledger + packages pair (ledger moves below packages on phones) → steps → services → chapter → why → voices → FAQ → closing letter. Head: Umrah only, new name, since 2008, canonical `https://usmania.vercel.app/` |
| Styles | new `src/styles/sections.css` (primitives `.k-section`, `.k-container`, `.runhead`, `.k-link`, `.filter-chip`, `.halo`; ledger, package card with container queries, steps, services, why, voices, video reviews + lightbox, FAQ, CTA) and `src/styles/home.css` (hero, seam, pair, chapter) |
| Content default | `src/data.js` FAQ defaults replaced with the approved text from `content-corrections.md` §2 (no Hajj, no "within an hour", correct numbers and hours) |

## Removed

- `Hero.jsx`, `useThreeScene.js`, `three` + `@types/three`, `SanctuariesSection.jsx`.
- From `components.css`: old section heading, package/stat/service/testimonial cards, FAQ, HERO, services strip, CTA section, why/stat card, avatar initials, sanctuary card, and the **legacy `[data-reveal]` CSS rule** (it hid every `data-reveal` element with `opacity:0; translateY(24px)` and broke the GSAP reveals and the no-JS fallback).
- From the reveal registry's LEGACY map: `.service-card`, `.testimonial-card`, `.why-card`, `.sanctuary-card`, `.cta-banner` (now driven by `data-reveal`, so no double animation).

## Checks

| Check | Result |
|---|---|
| Production build | passes; CSS 79.0 KB (15.5 KB gzip), app JS 166 KB (48 KB gzip), three.js gone |
| Desktop film layout, 1280×632 | copy column clear of the Kaaba; `hero-1080.mp4` attached after load and playing; Pause control present |
| Reveals | all tiers fire on scroll; nothing stays hidden after the fix above |
| Sanctuary pin | Makkah holds, Madinah rises inside the arch at mid-pin; runheads/Arabic/titles swap; Madinah loop plays in pin, toggle works |
| Phone, 375×812 | poster plate only, **no `<video>` element**; first `priceLabel` top at **1610 px** (gate ≤1624); ledger below packages; no horizontal overflow; vertical step rail; chapter wipe in flow |
| Reduced motion (`?motion=reduce`) | no pin (stacked chapter), no hidden `data-reveal` elements, no video |
| Preloader | runs on a fresh session; root un-inerted, logo restored, `sessionStorage.keuIntro` set, intro node removed |
| Console | no errors on Home, reduced-motion Home or `/admin/login` |
| Admin | `/admin/login` renders as before |

Note: this machine's Chrome reports `effectiveType: '3g'`, so the intro (correctly) skips there. The inline decision script now honours the existing QA override `?motion=full`, as `motionEnv.js` already did.

## Not yet verified

- **Video reviews row and lightbox**: no review is uploaded yet, so they render nothing locally. Verify on a preview deploy after uploading one through `/admin/video-reviews` (Phase 6).
- Frame timing / smoothness: the automation tab is throttled, so it cannot be measured here (Phase 6, real devices).
- Contrast sampling over the brightest film frame and axe runs (Phase 6).

## Left for later phases

- Live content still carries old identity text the code can't fix: e.g. why-us "Since 2005", testimonial labels, FAQ wording in the live DB. The owner re-saves these in the admin at launch (content-corrections §1–4; Phase 7). Code defaults for name, tagline, `founded: 2005` and the About story are in the Phase 5 identity sweep.
- Inner pages (Packages, Qafila chapter, split PageHeader, About, Gallery, Contact) still use the legacy styles: Phase 4.

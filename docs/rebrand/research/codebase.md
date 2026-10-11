# Codebase audit — redesign seams for the KEUI rebrand

Audited 2026-10-08 against `D:/personal/projects/keusmaniawebsite/keu-website` (branch `main`, HEAD `ce56553`). Every claim below was read from the files cited; items I could not verify are listed in section 8. No repo file was modified.

Installed versions (read from `node_modules/*/package.json`, not package.json ranges): react 18.3.1 · react-dom 18.3.1 · react-router-dom 6.30.3 · vite 5.4.21 · @vitejs/plugin-react 4.7.0 · **gsap 3.15.0** · **lenis 1.3.23** (package.json says `^1.1.13`; the lockfile resolved 1.3.23) · three 0.160.0.

GSAP 3.15.0 ships, under its "Standard 'no charge' license", the plugin files `SplitText.js`, `Flip.js`, `ScrollSmoother.js`, `Observer.js`, `CustomEase.js`, `ScrollTrigger.js` in `node_modules/gsap/` — so SplitText and Flip need no purchase and no extra install.

---

## 1. Architecture map

### 1.1 Boot and routing
- `index.html` → `<script type="module" src="/src/main.jsx">`. `src/main.jsx` imports `styles/tokens.css`, `styles/global.css`, `styles/components.css` (in that order; `global.css` also `@import`s tokens.css again at line 6), then renders `<StrictMode><BrowserRouter><App/></BrowserRouter></StrictMode>` (main.jsx:11–17).
- `src/App.jsx`: `isAdmin = pathname.startsWith('/admin')`; calls `useLenis(!isAdmin)` then `useScrollRestoration()` at the App level (App.jsx:46–47; the comment at 43–45 explains the ordering dependency through `window.__lenis`). Tree: `AuthProvider > SiteProvider > Routes`.
- Public routes wrap pages in `PublicShell` = `<Nav/> <main id="main-content">{children}</main> <Footer/> <WhatsAppFAB/>` (App.jsx:28–37): `/` Home, `/packages`, `/about`, `/gallery`, `/contact`. Wildcard `*` renders Home inside PublicShell **without redirecting** (App.jsx:75) — no 404 page; an unknown URL serves Home content under a wrong canonical.
- Admin: `/admin/login` (no shell) and `/admin` → `AdminLayout` (sidebar + `<Outlet/>`, auth gate via `useAuth`) with nested `index|inbox`, `company`, `packages`, `testimonials`, `team`, `gallery`, `sanctuaries`, `why`, `faqs` (App.jsx:61–73). All admin pages are statically imported — **no `React.lazy` anywhere in `src/`** (grep confirmed), so admin code, Three.js and GSAP are all in the eager public bundle.

### 1.2 Content data flow (SiteContext → /api/content → data.js fallback)
- `src/lib/SiteContext.jsx`: state initialised to `DEFAULT_SITE` / `DEFAULT_PACKAGES` from `src/data.js` (lines 20–21). `reload()` does `api.get('/api/content')`, then `setSite({ ...DEFAULT_SITE, ...content.site })` — a **shallow, top-level merge** — and `setPackages(Array.isArray(content.packages) ? content.packages : DEFAULT_PACKAGES)` (lines 24–38). Any error is swallowed; defaults stay. Exposes `{ site, packages, loaded, reload }`; `loaded` is not consumed by any public component (grep: no hits outside admin).
- `api/content/index.js`: `GET` returns `{ [doc.type]: doc.data }` for every row in the Mongo `Content` collection; `PUT` (admin JWT required) upserts `{ type, data }`. Model: `contentSchema { type: String unique, data: Mixed }` (`api/_lib/db.js:49–52`).
- **Every admin editor writes the WHOLE site object back** under `type:'site'`: `EditCompany.jsx:40` `{ type:'site', data: { ...site, company: c } }`, `EditGallery.jsx:18`, `EditGeneric.jsx:24`, `EditTeam.jsx:20`, `EditTestimonials.jsx:18`; packages go under `type:'packages'` (`EditPackages.jsx:36`). Consequence: once an admin has saved anything, ALL top-level `site` keys (company, services, whyChooseUs, stats, sanctuaries, testimonials, team, faqs, qafila, about, gallery, heroImages) come from the DB and `data.js` is shadowed at runtime. See risk R1.
- `src/lib/api.js`: fetch wrapper, `credentials:'include'`, JSON in/out, throws `Error` with `.status/.body` on non-2xx.
- `src/lib/whatsapp.js`: `useWaLink()` builds `https://wa.me/${site.company.whatsapp}?text=…`; message lookup order `key → p.id → p.tier → p.category → 'general'` derived from live packages (`buildMessages`, lines 11–20). `waLink()` static fallback uses data.js. Consumers: Nav, Hero, Footer, CTABanner, PackageCard, QafilaSection, ContactInfo, ContactForm, WhatsAppFAB.

### 1.3 Cloudinary image pipeline
- `src/lib/images.js`: `CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpmnlysdt'`; `BASE = https://res.cloudinary.com/${CLOUD}/image/upload`. `transform()` always emits `f_auto,q_auto`, adds `w_/h_`, and `c_fill,g_auto` only when both w and h are given (lines 20–27). `cldUrl(src)` accepts a public_id (`keu/makkah/kaaba`), re-transforms an existing `res.cloudinary.com/…/image/upload/…` secure_url (strips one leading transform segment), and passes through anything starting with `/` or `http` untouched (lines 30–45). `cldSrcSet()` returns `undefined` for local/third-party URLs.
- `src/components/Img.jsx`: default widths `[480, 768, 1200, 1600, 2048]`, default `sizes="100vw"`, srcSet suppressed when `h` is passed; `src` resolves to the largest width (lines 5–29).
- Admin upload: `src/components/admin/CloudinaryUpload.jsx` → `GET /api/upload-signature?folder=…` (admin-only; `api/upload-signature.js` signs `{timestamp, folder}`) → `POST https://api.cloudinary.com/v1_1/{cloud}/image/upload`. **Image only**: the URL builder keys on `/image/upload/` (images.js:18) and the uploader hits the `image/upload` endpoint — there is no video path anywhere.
- Public ids in use (data.js + pages): `keu/makkah/kaaba`, `keu/makkah/masjid-al-haram`, `keu/makkah/haram-exterior`, `keu/makkah/makkah-city`, `keu/makkah/haram-reference`, `keu/madinah/prophets-mosque`, `keu/madinah/madinah-city`, `keu/madinah/masjid-nabawi-exterior`, `keu/team/{burhan,muaz,umar,usman}`. `scripts/migrate-images-to-cloudinary.js` maps `public/images/<path>` → `keu/<path>` (public/images no longer exists in the repo).

### 1.4 SEO
- Static head in `index.html:6–63`: theme-color `#0d1b35`, title/description/author, OG (title, description, image = Cloudinary `keu/makkah/kaaba` 1200×630, url, locale `en_PK`), twitter card, canonical `https://keusmania.vercel.app/`, favicon set (generated from `public/logo.png` by `scripts/generate-icons.js`), Google Fonts link (Playfair Display, Inter, Amiri), `dns-prefetch wa.me`, **`<link rel="preload" href="/logo.png" as="image">`** (line 34), and an inline JSON-LD `TravelAgency` block (lines 36–63) with the OLD address. This is what non-JS crawlers (Facebook/Twitter) see.
- `src/lib/useDocumentHead.js`: per-route effect sets `document.title`, `meta[name=description]`, `og:description/title/url/type`, canonical, keywords, and `og:image`/`twitter:image` via `cldUrl(ogImage, {w:1200,h:630})` (lines 25–69). `SITE_URL` hard-coded `https://keusmania.vercel.app` (line 4).
- `src/components/JsonLd.jsx`: appends `<script type="application/ld+json">` nodes to `<head>` on mount, removes on unmount.
- `src/lib/schemas.js`: `organizationSchema(site)` (reads `site.company.*`; hard-codes `alternateName:'Karwan e Usmania'`, description, `logo: ${SITE_URL}/logo.png`, priceRange, opening hours), `websiteSchema()` (hard-coded name), `breadcrumbSchema`, `packageSchema` (TouristTrip + Offer, `/packages#${id}`), `packageListSchema`, `aboutPageSchema`, `imageGallerySchema`, `speakableSchema` with `cssSelector: ['.section-heading__title', '.hero__title', '.faq-item__q']` (line 168 — **class names are an SEO contract**).
- `FAQSection.jsx` emits a `FAQPage` JSON-LD plus microdata attributes on `<details>`.
- `scripts/generate-seo.js` runs post-build (`npm run build` = `vite build && node scripts/generate-seo.js`): imports `src/data.js` at build time and writes `dist/sitemap.xml` (5 routes + `/packages#id` per package), `dist/robots.txt` (allows GPTBot/ClaudeBot etc., disallows `/admin/`, `/api/`), `dist/llms.txt` (company block from `SITE.company`, hard-coded prose with the old name). Because it reads `data.js`, not the DB, **identity must be right in `data.js`** even if the DB overrides the live site.

### 1.5 Build / deploy / dev
- `vite.config.js`: terser with `drop_console`, `manualChunks` react/three/gsap/lenis; dev proxy `/api` → `http://localhost:3001` (`scripts/dev-api.js`, Express, walks `api/`).
- Existing `dist/` baseline (date of build unknown; minified, pre-gzip): `three` 447,438 B · `react` 162,203 B · `index` 141,551 B · `gsap` 69,829 B · css 50,982 B · `lenis` 18,733 B.
- `vercel.json`: SPA rewrite `/((?!api/).*)` → `/index.html`; immutable cache headers for `/assets/*` and `/patterns/*` only. No rule for video files.
- Auth: `src/lib/AuthContext.jsx` ↔ `/api/auth/{me,login,logout}`; cookie `keu_admin`, JWT 7-day TTL with `credentialVersion` (api/_lib/auth.js:6–28).
- `.env` holds MONGODB_URI, JWT_SECRET, ADMIN_EMAIL/PASSWORD, SMTP_*, MAIL_FROM/TO, CLOUDINARY_*, VITE_CLOUDINARY_* (key names only inspected; values not read). `.env.example` is 0 bytes.

---

## 2. Component inventory (what it renders → owning CSS)

CSS line ranges are in `src/styles/components.css` unless marked `global.css`. The file's section headers: BUTTONS 6–118 · BADGES & PILLS 119–154 · SECTION HEADING 155–208 · CARDS 209–524 · NAVIGATION 525–615 · FAQ 616–675 · PAGE HEADER 676–745 · QAFILA 746–893 · ADMIN DASHBOARD 894–1191 (also holds wa-greeting 1071–1096 and nav cta/burger/drawer 1097–1190) · HERO 1192–1381 · SERVICES STRIP 1382–1398 · FORMS 1399–1497 · MODAL 1498–1549 · ADMIN PACKAGE EDITOR 1550–1682 · FAB 1683–1713 · FOOTER 1714–1811 · DIVIDERS 1812–1833 · STAGGERED REVEAL 1834–1850 · CTA SECTION 1851–1878 · ICONS grab-bag 1879–2028 · SANCTUARY CARD 2029–2096 · ABOUT STORY 2097–2143 · TEAM CARD 2144–2186 · NAV LOGO IMAGE 2187–2218 · GALLERY GRID 2219–2264.

| Component (`src/components/`) | Renders | Data source | Owning CSS |
|---|---|---|---|
| `Nav.jsx` | fixed `<nav>`: `/logo.png` 48px round + text "Karwan-e-Usmania", 5 NavLinks (≥1024px), WhatsApp CTA (≥768px) with Urdu "بک کریں", burger → right drawer + overlay; `nav--solid` after `window.scrollY > 80` | `LINKS` const; `useWaLink` | 529–614 (`.nav*`), 1097–1190 (`.nav__cta`, `.nav__burger*`, `.nav-drawer*`), 2190–2208 (`.nav__logo-img/-text`) |
| `Footer.jsx` | 4-col grid: brand (logo + name + Arabic dua + blurb), Explore links, Packages (first 5 live packages → `/packages#id`), Get in Touch (city, phone, WhatsApp, email); bottom © line | `site.company`, `packages` | 1718–1811, 2211–2217, 2013–2024 (`.footer__contact-line`), 1889 |
| `WhatsAppFAB.jsx` | fixed pill "Book Now" + one-per-session greeting bubble after 6000 ms (sessionStorage `keu_wa_greeted`, auto-hides after 8000 ms); hidden on `/contact` and `/admin*` | `useWaLink` | 1687–1713 (`.fab-whatsapp`, `@keyframes fab-pulse`), 1071–1096 (`.wa-greeting`, `wa-greet-in`) |
| `Hero.jsx` | `section#hero.hero`: `.hero__photo` (Img `keu/makkah/kaaba`, CSS opacity **0.30**), `canvas#hero-canvas` (Three), `.hero__overlay`, content: bismillah (ar) · pill "Lahore · Since 2005" · `h1.hero__title.hero__title--arabic` "خدمات ضیوف الرحمن" (lang=ur) · accent-sub "Services for the Guests of the Most Merciful" · subtitle "Premium Hajj & Umrah services from Lahore…" · CTAs (View Packages / 💬 Book on WhatsApp). No scroll cue element is rendered. | `useThreeScene`, `useWaLink` | 1196–1380 (`.hero*`, `#hero-canvas`, `scroll-pulse`) |
| `SectionHeading.jsx` | bismillah span (ar) · `h2.section-heading__title` · gold divider · subtext; `align="left"` variant | props | 159–207 |
| `ServicesStrip.jsx` | SectionHeading (bismillah "خدمات ضیوف الرحمن") + 6 `.service-card` (icon/label/sublabel via **`dangerouslySetInnerHTML`**, ServicesStrip.jsx:20) | `site.services` | 1386–1398, 428–465, 1896–1910 |
| `SanctuariesSection.jsx` | SectionHeading + 2 `.sanctuary-card` (image + title/subtitle/body) in `.grid-2` | `site.sanctuaries` | 2032–2096 |
| `WhyChooseUs.jsx` (+ `WhyCard`) | section `#why.section--cream.section--pattern` + 4 `.card.why-card`; `wrapped={false}` returns only the grid (used by About) | `site.whyChooseUs` | 1911–1948, `.card` 213–229, `.section--pattern` global.css 263–278 |
| `PackagesGrid.jsx` | optional `.chip-group` filters (all/umrah/hajj/ramadan_umrah/family) + `.packages-grid` of `PackageCard`; `featured`/`ids`/`limit` props | `packages` | 1466–1497 (chips), 357–403 (grid + breakpoints 640/1024/1440 + `:has()` single-card rule) |
| `PackageCard.jsx` | `article.package-card#{id}` badge · title · subtitle · price/`/ person` · summary · divider · inclusions · WhatsApp CTA (`wa(pkg.id)`). **Also rendered inside the admin preview stage** (components.css 1657) | `pkg` | 231–356 |
| `StatsSection.jsx` | `section#stats.section--dark[data-theme=dark]` with 4 `.stat-card` (`data-count`/`data-suffix` counters) | `site.stats` | 404–427, 1949–1965, `.section--dark` global.css 245–257, `[data-theme=dark]` tokens.css 170–175 |
| `TestimonialsSection.jsx` | SectionHeading + 3 `.testimonial-card` (quote mark, ★ string, quote, initials avatar) | `site.testimonials` | 466–524, 1966–1976 |
| `FAQSection.jsx` | `section#faq.section--cream`, native `<details>` list, first open, FAQPage JSON-LD + microdata | `site.faqs` | 619–675 |
| `CTABanner.jsx` | `section#cta.cta-section[data-theme=dark]` bg Img `keu/madinah/prophets-mosque.parallax-img` + overlay; eyebrow/h2/p/2 CTAs. **No `.cta-banner` CSS rule exists** (GSAP target only) | `useWaLink` | 1854–1877 |
| `PageHeader.jsx` | `header.page-header` bg Img (eager, `fetchpriority=high`, `.parallax-img`) + overlay; eyebrow/h1/subtitle | props | 679–744 |
| `QafilaSection.jsx` | `section#qafila` card: `/qafila-logo.png` (985 KB, 1563²), Urdu tagline, title, badge, leader line, intro/body, 4 `.qafila-pillar`, WhatsApp CTA | `site.qafila` | 749–893 |
| `GalleryGrid.jsx` | `.gallery-grid` of `figure.gallery-item[--tall|--wide]` + click/Enter lightbox (`.modal-overlay` + `.modal`), Esc closes, `body.no-scroll` | `site.gallery` | 2223–2264, 1502–1549 |
| `TeamGrid.jsx` | `.grid-4` of `.team-card` (photo/name/role) | `site.team` | 2147–2186 |
| `ContactInfo.jsx` | 5 `.card.contact-card` (address, WhatsApp, phone, email, hours) | `site.company` | 1977–2001 |
| `ContactForm.jsx` | form (honeypot `website`, name, phone, email, package select, prefer select, message) → `POST /api/contact` then always `window.open(wa('general', composedText))` | `api`, `useWaLink` | 1403–1465 (`.field*`) |
| `Img.jsx`, `JsonLd.jsx` | utilities | — | none |

Pages (`src/pages/`): `Home.jsx` (section order Hero → ServicesStrip → Sanctuaries → WhyChooseUs → inline `#packages-preview` with `PackagesGrid featured limit=3` → Stats → Testimonials → FAQ → CTABanner; `useGsapAnimations(['home'])`), `Packages.jsx` (PageHeader → `PackagesGrid showFilters` → Qafila → FAQ; extra hash `scrollIntoView` after 200 ms at lines 27–32), `About.jsx` (PageHeader → `.about-story` 2100–2143 → WhyChooseUs unwrapped → TeamGrid), `Gallery.jsx`, `Contact.jsx` (PageHeader → **inline `gridTemplateColumns:'1fr 1fr'` with no breakpoint** at line 45 → Google Maps iframe for "Mansoora Homes Multan Road" at line 66).

Global primitives (`global.css`): reset 15–101, fixed `body::before` khatam texture `/patterns/geometric.svg` at 0.05 (52–62), `:focus-visible` gold ring, headings Playfair/navy (120–158), `.eyebrow`, `:where([lang=ar],[lang=ur])` → Amiri RTL 1.08em (187–197), `.gold-text`, `.container` 1200px, `.section` padding `clamp(4rem,10vw,8rem)`, `.section--dark/--cream/--pattern`, `.stack/.cluster/.grid-2/3/4`, utilities, Lenis compatibility 343–351.

**Dead CSS (no JSX consumer; safe to delete during the restyle):** `[data-reveal]` 1838–1849 (no JS drives it), `.hero__scroll-cue` 1355–1380 (not rendered, but `useGsapAnimations.js:28` still tweens it → dev warning "target not found"), `.nav__logo-mark` 566–573, `.divider-crescent` 1816–1833, `.cert-card__icon` 2002, `.badge--navy/--green/--outline/--soft` 137–140, `.pill` 142, `.btn--icon` 108, `.hero__canvas` 1207, `.field__error` 1454, `.container-wide` global 234, `.full-bleed` global 336. `.field__hint` is admin-only.
**Dead/duplicate assets:** `public/patterns/islamic-pattern.webp` (726,592 B, actually JPEG bytes per `file`, referenced nowhere); `src/assets/patterns/geometric.svg` byte-identical to `public/patterns/geometric.svg` (CSS references `/patterns/geometric.svg` only).

Icon keys that content refers to (`src/icons.jsx`, must survive): visa plane hotel bus guide food award certificate shield support calendar users building check pin phone whatsapp mail clock facebook instagram youtube tiktok star crescent kaaba menu close.

---

## 3. Existing motion inventory and risks

### 3.1 `src/hooks/useGsapAnimations.js` (137 lines, `gsap.registerPlugin(ScrollTrigger)`)
Runs once per page mount inside `gsap.context`, reverted on unmount (`ctx.revert()` line 135). Deps are constant arrays (`['home']` etc.), so it does **not** re-run when `/api/content` data arrives.
- Hero entrance (only if `.hero__bismillah` exists and no reduced motion): timeline `delay 0.4` → bismillah `y:24 0.9s power2.out` → pill `y:20 0.7s` at `-=0.5` → title `y:50 1.1s power3.out` at `-=0.4` → subtitle `y:24 0.8s` at `-=0.6` → `.hero__ctas > *` `y:16 0.6s stagger 0.1` at `-=0.4` → `.hero__scroll-cue` opacity (missing target).
- Particle scatter: `window._sceneObjects.particles` material opacity → 0.15 and scale → 1.4, `scrollTrigger {trigger:'#hero', start:'top top', end:'bottom top', scrub:1.5}`.
- `if (reduceMotion) return` (line 44) — everything below is skipped under reduced motion, and because `gsap.from` never runs the content stays visible. Correct pattern; new components should copy it.
- Section headings `y:40 0.9s power3.out`, start `top 88%`, `toggleActions 'play none none reverse'`. Package cards `y:60 0.8s power2.out`, delay `(i%3)*0.1`, start `top 92%`, reverse. Service cards `x:-30 stagger 0.08 0.7s`. Sanctuary cards `y:40 0.9s power3.out delay i*0.15`. Counters: `ScrollTrigger.create once` → proxy tween `2.4s power1.out`, `toLocaleString('en-US')`. Testimonials `scale 0.96 stagger 0.15 back.out(1.4)`. CTA banner `scale 0.96 0.9s`. `.parallax-img` `yPercent:-18 scrub:true` on closest `<section>`. Footer `y:40 0.8s` start `top 95%`. 11 ScrollTrigger usages, **no `pin`** anywhere.

### 3.2 `src/hooks/useLenis.js` (55 lines)
`new Lenis({ duration:1.2, easing: t => Math.min(1, 1.001 - 2^(-10t)) (expo-out), wheelMultiplier:1, touchMultiplier:1.5, smoothWheel:true })`; own `requestAnimationFrame` loop; `window.__lenis = lenis`; document-level click handler for `a[href^="#"]` → `lenis.scrollTo(target, {offset:-64})`; cleanup cancels rAF, `destroy()`, removes listener, deletes global. Skipped entirely under reduced motion and when `enabled=false` (admin).

### 3.3 `src/hooks/useScrollRestoration.js` (55 lines)
Sets `history.scrollRestoration = 'manual'` at module load. On `[pathname, hash]` change: hash → `getElementById` → `lenis.scrollTo(el, {offset:-64, immediate:true, force:true})`, else `scrollTo(0)`; native `behavior:'instant'` fallback when Lenis is absent.

### 3.4 `src/hooks/useThreeScene.js` (184 lines)
`WebGLRenderer({antialias, alpha, powerPreference:'high-performance'})`, DPR ≤ 2, clear colour `0x0d1b35` α0, `FogExp2(0x0d1b35, 0.04)`, camera z=4; 4000-point Fibonacci sphere (gold vertex colours derived from `#c9a84c`, additive blending, size 0.012), inner glow sphere (`0xc9a84c` α0.05), torus "equator" ring, 2000 stars; mouse/touch parallax; resize; IntersectionObserver gates `renderer.render` (the rAF loop keeps ticking while off-screen — cheap but non-zero); exposes `window._sceneObjects`; low-end-GPU regex (`Mali-4|Adreno 3xx`) and reduced motion → `canvas.style.display='none'`. Cleanup disposes geometries/materials and `renderer.dispose()` but does **not** call `renderer.forceContextLoss()` or `setAnimationLoop(null)`.

### 3.5 Verified risks
- **R-M1 Lenis ↔ ScrollTrigger are NOT synced.** Grep of `src/` for `ScrollTrigger.update`, `ScrollTrigger.refresh`, `scrollerProxy`, `lenis.on(`, `gsap.ticker`, `lagSmoothing` returns nothing (only `window.__lenis` plumbing). Lenis 1.3.23 writes native scroll from its own rAF; ScrollTrigger listens to native `scroll` events from a second rAF, so `scrub` tweens (particles, `.parallax-img`) can trail by a frame and `scrollTo(..., immediate)` on route change never triggers `ScrollTrigger.refresh()`. Lenis 1.3.23 exposes `on('scroll', cb)` and `autoRaf` (`node_modules/lenis/dist/lenis.d.ts:371, 229`), so the canonical fix is available: `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)` and drop the hand-rolled rAF.
- **R-M2 Effect order.** React runs child effects before parent effects, so each page's `useGsapAnimations` creates its ScrollTriggers **before** `App`'s `useLenis` instantiates Lenis. Harmless today (ScrollTrigger uses the window scroller), but any move to `ScrollSmoother`/`scrollerProxy` or a transform-based wrapper would break this ordering and also break `Nav.jsx`'s `window.scrollY` listener.
- **R-M3 StrictMode double mount (dev only).** `main.jsx` wraps in `<StrictMode>`, so every effect mounts → cleans → mounts. `useThreeScene` therefore creates two WebGL contexts per hero mount in dev; `renderer.dispose()` without `forceContextLoss()` leaves the first context alive until GC, and with Vite HMR this can hit the browser's ~16-context cap ("Too many active WebGL contexts"). Lenis, gsap.context and JsonLd clean up fully. Preloader/curtain logic that uses `sessionStorage` or one-shot timers must be idempotent across the double mount.
- **R-M4 Content-load layout shift.** `/api/content` resolves after mount and can change the number of packages/FAQs/testimonials; ScrollTrigger start positions go stale and no `ScrollTrigger.refresh()` runs on `loaded` or on `document.fonts.ready`.
- **R-M5** `useGsapAnimations.js:28` tweens `.hero__scroll-cue`, which `Hero.jsx` never renders → GSAP "target not found" warning in dev.
- **R-M6** Three.js chunk (447 KB minified) is downloaded on every route, including `/admin`, and `powerPreference:'high-performance'` is requested on mobile; today the WebGL dome carries the hero look because the Kaaba photo sits at 30 % opacity.
- **R-M7** `Packages.jsx:27–32` duplicates hash handling (`scrollIntoView smooth` 200 ms after `useScrollRestoration` already jumped via Lenis) → visible double scroll on `/packages#id` links.
- **R-M8** `html { scroll-behavior:smooth }` (global.css:27) is neutralised for Lenis by `.lenis.lenis-smooth { scroll-behavior:auto !important }` (global.css:348); keep that block if Lenis stays.

---

## 4. What must NOT change

- **Admin**: `src/pages/admin/*` (AdminLayout, Login, Inbox, EditCompany, EditPackages, EditTestimonials, EditTeam, EditGallery, EditGeneric), `src/components/admin/CloudinaryUpload.jsx`, admin CSS blocks components.css 894–1070 and 1550–1682 (may be moved to a new `admin.css` but selectors and the `.btn`, `.field*`, `.card`, `.grid`, `.stack`, `.cluster`, `.muted`, `.mt-*` utilities they depend on must keep working; `PackageCard` renders inside `.pkg-editor__preview-stage` at 1657).
- **api/** (all files), `scripts/dev-api.js`, `scripts/seed-admin.js`, `.env*`, `vercel.json` rewrite `/((?!api/).*)`, Mongo models, JWT cookie `keu_admin`.
- **Auth**: `src/lib/AuthContext.jsx`, `src/lib/api.js`.
- **Content schema** (round-tripped whole by the admin; `EditGeneric` edits raw JSON): `site.company { name, tagline, founded, phone, whatsapp (digits), email, address { street, city, country, postalCode }, hours[{days,time}], socials[{name,url,icon}] }`, `site.services[{icon,label,sublabel}]`, `whyChooseUs[{icon,title,body}]`, `stats[{value,suffix,label,icon}]`, `sanctuaries[{title,subtitle,body,image,alt}]`, `testimonials[{quote,name,location,trip,rating,initials}]`, `team[{name,role,photo}]`, `faqs[{q,a}]`, `qafila{…}`, `about{story[],storyImage,storyImageAlt}`, `gallery[{src,alt,size}]`, `heroImages{primary,fallback}`; `packages[{id,name,category,tier,icon,price,priceLabel,perPerson,nights,subtitle,summary,badge,featured,inclusions[],waMessage}]`. New UI may **add optional keys** (e.g. `heroVideo`) with code-side defaults, but must not rename/remove/re-type existing ones.
- **WhatsApp**: `src/lib/whatsapp.js` (API `useWaLink()(key, customText)` / `waLink`, key fallback order), `ContactForm` payload `{name, phone, email, package, prefer, message, website}` ↔ `api/contact.js` validation.
- **SEO plumbing**: `useDocumentHead` signature, `JsonLd`, `schemas.js` builder shapes (change strings only), `generate-seo.js` outputs, FAQ microdata, canonical `https://keusmania.vercel.app` (do not invent a domain), route paths, sitemap entries, `id` anchors (`#packages-preview`, `#qafila`, `#faq`, `#contact-map`, per-package ids), `data-count/data-suffix/data-prefix` contract, `#main-content`. If class names in `speakableSchema` (`.section-heading__title`, `.hero__title`, `.faq-item__q`) change, update that list in the same commit.
- Icon keys in `src/icons.jsx` (stored in DB content by name).
- Reduced-motion behaviour (every hook already gates on `prefers-reduced-motion`).

---

## 5. Identity drift list (file:line)

Target identity (BRIEF/PRODUCT.md): **Karwan e Usmania International · Travel & Tours** · "Your Journey to the Holy Land Our Priority" · **خدمات ضيف الرحمن** · Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town, Lahore · +92 42 35136177 · WhatsApp +92 333 4883578 (`923334883578`) · keusmania@gmail.com. Grep for `keusmania@gmail`, `Usman Plaza`, `Johar Town`, `35136177` returns **zero hits** in the repo — the new identity exists nowhere yet.

### 5.1 Old name "Karwan-e-Usmania" (and "Karwan e Usmania")
- `src/data.js:10` (`company.name`), `:2` (comment), `:27` (Facebook URL slug — unverified, keep), `:92` (testimonial quote), `:127, 131, 134, 143, 146, 150, 151, 154, 162` (FAQ copy), `:207` (about story).
- `src/components/Nav.jsx:39` (alt), `:40` (logo text). `src/components/Footer.jsx:19` (alt), `:20`, `:70` (©).
- `src/lib/schemas.js:14` (`alternateName 'Karwan e Usmania'`), `:60` (WebSite name), `:129` (AboutPage name), `:151` (ImageGallery name).
- `src/pages/Home.jsx:23–25`, `Packages.jsx:18`, `About.jsx:17–19`, `Contact.jsx:15–17, 70`, `Gallery.jsx:14, 16` (titles/descriptions/keywords).
- `index.html:8, 9, 10, 13, 40, 41, 58`.
- `scripts/generate-seo.js:2, 55, 87, 93` (robots/llms.txt prose).
- Comments/headers only: `src/icons.jsx:2`, `src/styles/{components,global,tokens}.css:2`, `scripts/generate-icons.js:2,5`, `scripts/migrate-images-to-cloudinary.js:2`, `scripts/optimize-images.js:2`, `src/assets/patterns/geometric.svg:4`.
- Out of scope (read-only/API or docs): `api/_lib/email.js:24, 29, 48`; `package.json:6`; `README.md:1, 3`; `DEPLOYMENT.md:1, 78`.

### 5.2 Old tagline "Premium Hajj & Umrah from Lahore"
`src/data.js:11` (`company.tagline`), `src/components/Hero.jsx:30` (subtitle), `src/pages/Home.jsx:23`, `index.html:8, 13`; descriptions "Premium Hajj and Umrah…" at `index.html:9, 14`, `src/lib/schemas.js:15, 61`, `scripts/generate-seo.js:89`; docs `package.json:6`, `README.md:3`.

### 5.3 Old address "Mansoorah/Mansoora Homes, Multan Road"
`src/data.js:17` (`address.street`), `:155` (FAQ answer), `src/pages/Contact.jsx:16, 17` (meta), `:66` (**Google Maps iframe query** `Mansoora+Homes+Multan+Road+Lahore`), `index.html:49` (JSON-LD streetAddress), `DEPLOYMENT.md:205`. Postal code `54600` at `data.js:20`, `data.js:155`, `index.html:52` is not on the letterhead (unverified — see §8).

### 5.4 Old email `info@keusmania.com`
`src/data.js:15` (`company.email`), `:163` (FAQ answer), `DEPLOYMENT.md:70`.

### 5.5 Old WhatsApp `923314211935` / `+92-331-4211935`
`src/data.js:14` (`company.whatsapp` — **the number every wa.me link uses**), `:155`, `:163` (FAQ answers), `src/pages/Contact.jsx:16` (meta). Note `data.js:13` phone `+92-333-4883578` and `index.html:46` already match the letterhead mobile; `EditCompany.jsx:63` placeholder already suggests `923334883578`.

### 5.6 Arabic line drift
Letterhead: `خدمات ضيف الرحمن`. Site uses the Urdu-spelled plural `خدمات ضیوف الرحمن` at `src/components/Hero.jsx:24` (as the `h1`, `lang="ur"`) and `src/components/ServicesStrip.jsx:11`; English gloss "Services for the Guests of the Most Merciful" at `Hero.jsx:27`. Other hard-coded copy to review: `Hero.jsx:22` pill "Lahore · Since 2005", `Footer.jsx:23` and `:71` "Mehmaan-e-Khuda", `Footer.jsx:22` dua.

### 5.7 Navy theme colour `#0d1b35` (and derived rgba(13,27,53,…))
- `index.html:6` `<meta name="theme-color" content="#0d1b35">`.
- `src/styles/tokens.css:8–10` (`--color-navy*`), `:25, 29, 34` (text-dark, text-on-gold, surface-dark), `:38, 40` (borders), `:123–127` (shadows), `:132, 135, 136` (gradients), `:170–175` (`[data-theme=dark]` override), plus gold `#c9a84c` family at `:12–14, 39, 44, 128, 133`.
- `src/styles/components.css` hard-coded `rgba(13,27,53,…)` at lines **549, 713, 806, 1179, 1242, 1250, 1251, 1505, 1875, 2058** and hard-coded gold `rgba(201,168,76,…)` at **81, 140, 275, 440, 634, 714, 944, 1046, 1319, 1446, 1876, 1933, 1961, 1962, 1987**; `var(--color-navy*)` ×34, `var(--gradient-navy)` ×4, `var(--color-gold*)` ×41 (token-driven, will follow tokens.css). Only one other hex literal in components.css (`#1faa55`). `global.css` references navy via tokens at 113, 126 and `--gradient-navy` at 246.
- `src/hooks/useThreeScene.js:4–5` `HERO_BG = 0x0d1b35`, `GOLD = 0xc9a84c` (particle colours derived from it at lines 64–66).
- `api/_lib/email.js:44–45` (`#f8f5ef`, `#c9a84c`, `#0d1b35`, Playfair) — read-only, note only.

### 5.8 Old logo `/public/logo.png` (1080×1355 portrait lockup, 329 KB)
`index.html:21` (comment), `:34` (**preload**), `:44` (JSON-LD logo URL); `src/components/Nav.jsx:39`, `Footer.jsx:19`, `src/lib/schemas.js:17`; admin (leave): `src/pages/admin/AdminLayout.jsx:38`, `Login.jsx:34`; `scripts/generate-icons.js:4, 18, 20–22` (favicon generator reads `public/logo.png` and crops emblem region `{left:0, top:380, width:1080, height:415}` tuned to the OLD artwork — all of `public/favicon-16/32/48.png`, `favicon.ico`, `apple-touch-icon.png` derive from it); `README.md:33`. New mark: `D:/personal/projects/keusmaniawebsite/newlogo.png` (4096×4096 RGBA, 3,060,065 B — must be downscaled, never shipped raw). Letterhead: `letter_head.pdf` at repo root and `keu-website/letter_head.pdf` (byte-identical), preview `keu-website/letterhead-preview-0.png` (2000×3000).

### 5.9 Fonts (Playfair Display / Inter / Amiri)
`index.html:27–32` (Google Fonts link), `src/styles/tokens.css:49–52` (`--font-heading/body/arabic/mono`). No font-family literals exist in components.css/global.css outside the tokens (grep confirmed), so the swap is a two-file change.

### 5.10 Runtime override risk (not a file:line)
If a `Content{type:'site'}` row exists in Mongo (written by any admin save), its `company` object (old name/address/email/WhatsApp) **overrides** `data.js` on the live site. Fixing `data.js` alone will not fix production. Could not verify from the repo whether such a row exists (see §8).

---

## 6. Redesign seam plan

### 6.1 Per page / component: replace, restyle, keep

| Surface | Verdict | Notes |
|---|---|---|
| `index.html` | **restyle** (strings + head) | theme-color → letterhead green; title/description/OG/JSON-LD to new identity; fonts link → new pairing; replace `/logo.png` preload with the new mark (or drop preload if the nav logo is inline SVG); add `<link rel="preload" as="video">` **only** if the hero poster strategy needs it (prefer poster image preload instead). |
| `tokens.css` | **replace** | Keep every variable NAME that components.css consumes (`--color-navy*` etc. may stay as aliases for one release) and add new semantic tokens; see 6.3. |
| `global.css` | restyle | Headings colour/family via tokens; body texture `body::before` (geometric.svg 0.05) — keep or swap for a letterhead-paper field `#f8f8f8`; keep Lenis block 343–351 and reduced-motion block. |
| `components.css` | restyle in place, split | Re-tokenise the 25 hard-coded rgba literals (§5.7); delete dead blocks (§2); move 894–1070 + 1550–1682 to `src/styles/admin.css` imported only by `AdminLayout.jsx`/`Login.jsx` (optional, safe). |
| `Nav.jsx` | **restyle** | New mark + wordmark lockup (SVG or ≤256 px PNG from newlogo.png), letterhead small-caps serif wordmark, transparent-over-video → paper/green solid state; keep LINKS, drawer, WhatsApp CTA, `aria-*`. Becomes the FLIP target for the preloader logo (Edolus handoff). |
| `Hero.jsx` + `useThreeScene.js` | **replace** with `VideoHero` | Retire the Three.js dome (removes the 447 KB chunk and R-M3/R-M6). Keep `section#hero` id (ScrollTrigger + anchor), `.hero__title` class (speakable schema), `useWaLink` CTAs. |
| `SectionHeading.jsx` | restyle | Same markup/class names (speakable). Bismillah eyebrow → letterhead-style letterspaced eyebrow with gold rules; optional SplitText reveal. |
| `ServicesStrip.jsx` | restyle | Keep `dangerouslySetInnerHTML` (admin content) but consider escaping in a later hardening pass. |
| `SanctuariesSection.jsx` | restyle | Candidate for image-led full-bleed "chapters" (Aman/Rialto module rhythm). |
| `WhyChooseUs.jsx` | restyle | keep `wrapped` prop (About uses it). |
| `PackagesGrid.jsx` / `PackageCard.jsx` | restyle | Card must still look right inside the admin preview stage. Keep chips, ids, `data-category/tier`. |
| `StatsSection.jsx` | restyle (green band) | keep `data-count` contract; counters become part of the Stats "chapter". |
| `TestimonialsSection.jsx` | restyle | Optionally a Marquee strip of quotes. |
| `FAQSection.jsx` | keep (restyle chrome) | Schema/microdata untouched. |
| `CTABanner.jsx` | restyle | Add a `.cta-banner` rule (currently none). |
| `PageHeader.jsx` | restyle | Lighter, letterhead-style header (paper field + green sweep) or short video/photo band; keep `fetchpriority=high`. |
| `QafilaSection.jsx` | restyle | Logo `qafila-logo.png` 985 KB → add width/height and consider a Cloudinary copy. |
| `GalleryGrid.jsx` | restyle | keep lightbox behaviour. |
| `TeamGrid.jsx`, `ContactInfo.jsx`, `ContactForm.jsx` | restyle | Fix Contact.jsx inline 2-col grid with a breakpoint. Update map query to the Johar Town address string. |
| `Footer.jsx` | **restyle** to "green footer" | Letterhead footer composition; motto "FAITH × JOURNEY × TOGETHER"; new name/contact from `site.company`. |
| `WhatsAppFAB.jsx` | keep (restyle colours) | |
| `useGsapAnimations.js` | **replace** | Split into per-section hooks or a registry; wire Lenis↔ScrollTrigger (R-M1); remove `.hero__scroll-cue`/particle code; add `ScrollTrigger.refresh()` on `loaded` and `document.fonts.ready`. |
| `useLenis.js` | restyle | Switch to `gsap.ticker` driving `lenis.raf`, `lenis.on('scroll', ScrollTrigger.update)`, `lagSmoothing(0)`; keep `window.__lenis` for `useScrollRestoration`. |
| `useScrollRestoration.js` | keep | Coordinate with PageTransition: jump to top while the curtain covers the viewport. |
| `data.js`, `schemas.js`, `generate-seo.js`, pages' `useDocumentHead` | strings only | identity + copy; no shape changes. |
| Admin, api/, auth, whatsapp.js | **keep** | untouched. |

### 6.2 New components (all under `src/components/motion/` unless noted; plain CSS, no Tailwind)

1. **`Preloader.jsx`** (Edolus pattern, mount once in `PublicShell`/`App`): full-field panel (green `#104028`-family or black), the KU mark self-draws (SVG stroke `stroke-dashoffset` via GSAP `DrawSVG`-free technique using `getTotalLength()`), percentage counter 20 px below, min hold ≈3000 ms, hold at 99 % until `document.fonts.ready` + hero poster/video `canplay` + `loaded` from SiteContext; then two-band curtain opens; logo FLIPs to the nav slot with `gsap/Flip` (`Flip.fit` or `Flip.from(state)`), 500–800 ms `expo.inOut`. `sessionStorage` flag `keu_preloaded` skips the counter on replays; must be StrictMode-idempotent (guard against double timers). Reduced motion: instant reveal, no counter.
2. **`VideoHero.jsx`** (`src/components/`): `<video autoplay muted loop playsinline preload="metadata" poster>` with `<source>` for mobile/desktop renditions, poster = Cloudinary still (`keu/makkah/kaaba` at 1600 w), `prefers-reduced-motion` and `Save-Data`/`connection.saveData` → poster only; `IntersectionObserver` pauses when off-screen; copy stack: eyebrow (letterspaced, gold rules), `h1.hero__title` SplitText word/line reveal, Arabic line (Amiri or replacement), CTAs. Optional scroll-scrub `scale 1→1.08` + overlay darken over `#hero top top → bottom top`.
3. **`Curtain.jsx`** / **`PageTransition.jsx`**: two fixed bands (top/bottom) in letterhead green; on route change (listen to `useLocation`), close (≈450 ms `power3.in`) → `useScrollRestoration` jump → open (≈650 ms `expo.out`). Reuse the same bands for the preloader reveal. Keep `aria-hidden`, `pointer-events:none` when open.
4. **`lib/splitText.js`** util: thin wrapper around `gsap/SplitText` (`type:'lines,words'`, `mask:'lines'`), auto-`revert()` on cleanup, skips `[lang=ar]/[lang=ur]` nodes (SplitText breaks Arabic shaping — split by lines only, never chars) and skips under reduced motion.
5. **`Marquee.jsx`**: CSS `@keyframes` translateX loop (duplicated track, `animation-play-state` paused on hover and under reduced motion); content = motto / sanctuaries / testimonial snippets. No JS needed; GSAP optional for speed scrub.
6. **`Cursor.jsx`** (optional, desktop only, `pointer:fine`): small gold dot + ring, `gsap.quickTo`; disabled on touch and reduced motion. Low priority; skip if it fights the "quiet luxury" bar.
7. **`Reveal.jsx`** (replacement for the blanket hook): `data-reveal="up|fade|lines"` attribute + one ScrollTrigger batch (`ScrollTrigger.batch`) with Rialto's timing (750 ms, `cubic-bezier(.165,.84,.44,1)` ≈ `power4.out`/`expo.out`), 8–24 px travel, ≤ 8 children per stagger.
8. **`BrandMark.jsx`**: inline SVG of the KU mark (trace from newlogo.png; verify fidelity visually) used by Nav, Footer, Preloader, favicon source.

### 6.3 Where the new `tokens.css` goes
Keep the file at `src/styles/tokens.css` (imported first by `main.jsx:5` and again by `global.css:6`). Rewrite its contents; do not add a second token file (duplicate `:root` cascades are hard to reason about). Suggested structure: `/* brand */ --green-900 #083820, --green-800 #104028, --green-700 #185030, --green-600 #004828 (logo sample), --gold-500 #e0a028, --gold-600 #d89820, --gold-700 #a06800, --bronze #885800, --paper #f8f8f8, --ink #181818` → `/* semantic */ --color-primary, --color-accent, --color-surface, --color-surface-paper, --color-surface-dark, --color-text-*, --color-border*, --shadow-* (re-derive from green rgba), --gradient-*` and **temporary aliases** `--color-navy: var(--color-primary)` etc. so components.css keeps rendering during the migration; delete aliases once the 34 `var(--color-navy*)` usages are rewritten. Add motion tokens matching the references: `--ease-out-quart: cubic-bezier(.165,.84,.44,1)`, `--ease-expo-inout: cubic-bezier(.87,0,.13,1)`, `--dur-reveal: 750ms`, `--dur-route: 650ms`, `--dur-curtain: 450ms`. Keep the `[data-theme="dark"]` override and the reduced-motion block (durations → 0).

### 6.4 Video asset pipeline
- **Do not commit MP4s to `public/`** (git bloat; `vercel.json` has no cache rule for them). Preferred: Cloudinary **video** delivery from the same cloud — URL shape `https://res.cloudinary.com/{cloud}/video/upload/q_auto,vc_auto/{public_id}.mp4` (plus `w_1280` mobile rendition and `.webm`), poster via `/video/upload/so_0,f_auto,q_auto,w_1600/{public_id}.jpg`. Add `cldVideoUrl(publicId, {w, format})` and `cldVideoPoster()` to `src/lib/images.js` (the existing builder only knows `/image/upload/`). Upload once with the Cloudinary console or extend `scripts/migrate-images-to-cloudinary.js` with `resource_type:'video'` — this is a one-off script change, not an api/ change.
- Expose the public id through content: add optional `site.heroVideo = { publicId, poster, credit }` to `data.js` with a code default so an empty DB row still works; the admin needs no new editor (EditGeneric can edit JSON later).
- Source clips (brief §5): Pexels 31208756 (aerial tawaf), Pexels 35155732 (vertical 1080×1920 — suits the mobile rendition), Pixabay 272914 / 98682. Licence must be re-checked per clip at download; keep a `CREDITS.md`.
- Targets (brief guidance): loop ≤ ~4 MB, 1920×1080 ≤ 24 fps, 8–12 s, no audio track, `muted playsinline autoplay loop preload="metadata"`, poster always present, reduced-motion/Save-Data → poster only.
- Fallback chain in `VideoHero`: poster `<img>` paints first (LCP candidate) → video fades in on `canplay`; if `play()` rejects (iOS Low Power Mode) keep the poster.

### 6.5 Suggested execution order
1. Identity strings + tokens (data.js, index.html, schemas.js, generate-seo.js, pages' heads, Nav/Footer copy, Contact map query, generate-icons crop for newlogo.png) — ship as its own PR; verify the DB `site` row (R1).
2. Motion plumbing: Lenis↔ScrollTrigger sync, `ScrollTrigger.refresh()` hooks, delete dead CSS, split admin.css.
3. VideoHero + Cloudinary video helpers (Three.js removed; drop the `three` manualChunk and dependency).
4. Preloader + Curtain/PageTransition + Flip handoff.
5. Section restyles (Sanctuaries chapters, Stats band, Footer), Reveal/SplitText, Marquee.
6. Optional Cursor; Lighthouse + reduced-motion + iOS pass.

---

## 7. Risk register

| # | Risk | Likelihood / impact | Mitigation |
|---|---|---|---|
| R1 | A Mongo `Content{type:'site'}` row overrides `data.js` with the OLD company identity on production, so the rebrand looks done locally but not live. | High / High | Before launch: hit `GET /api/content` on prod and inspect `site.company`; re-save Company in `/admin/company` with the new values (or delete the `site` row so defaults apply). Add a one-time console warning in `SiteContext` if `site.company.name !== DEFAULT_SITE.company.name`. |
| R2 | `generate-seo.js` and `index.html` are build-time and read `data.js`, not the DB → sitemap/llms.txt/OG can disagree with the live site. | Medium / Medium | Keep `data.js` as the identity source of truth (PRODUCT.md rule); rebuild after every identity change. |
| R3 | Lenis/ScrollTrigger desync causes jitter in scrubbed video/parallax (R-M1). | High / Medium | Wire `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker` + `lagSmoothing(0)`; call `ScrollTrigger.refresh()` on `loaded`, `fonts.ready`, video `loadedmetadata`, and after route transitions. |
| R4 | StrictMode double mount breaks one-shot preloader/curtain/FLIP timers or leaks WebGL contexts in dev (R-M3). | High (dev) / Low (prod) | Make effects idempotent (refs + cleanup kill timelines); remove Three.js; if any WebGL stays, call `renderer.forceContextLoss()` in cleanup. |
| R5 | Hero video hurts LCP/CLS and mobile data; autoplay blocked on iOS Low Power Mode. | High / High | Poster-first LCP, `preload="metadata"`, ≤4 MB loop, mobile rendition, `play()` promise fallback, Save-Data/reduced-motion → poster, pause off-screen. Measure with Lighthouse on a throttled profile. |
| R6 | SplitText on Arabic/Urdu breaks glyph shaping (ligatures) and RTL order. | High / High | Never split `[lang=ar]/[lang=ur]` by chars/words; animate those lines as whole blocks (mask + translateY). |
| R7 | Renaming classes silently breaks `speakableSchema` selectors, GSAP selectors, admin preview, and `#` anchors. | Medium / Medium | Keep `section-heading__title`, `hero__title`, `faq-item__q`, `package-card`, section ids; grep before deleting any selector. |
| R8 | Preloader delays first interaction on every visit and on route changes (owner wants it, Edolus-style). | Medium / Medium | Session flag skips the counter after first visit; cap hold at ~3 s; never block on `/api/content`; keyboard/screen-reader users get `aria-busy` + skip. |
| R9 | PageTransition curtain fights `useScrollRestoration` (jump visible) or traps focus. | Medium / Low | Sequence: close → `jumpTo` → open; keep bands `aria-hidden`; move focus to `#main-content` after open. |
| R10 | Favicons/apple-touch-icon regenerated from the wrong crop of `newlogo.png` (generator is tuned to the old 1080×1355 lockup). | High / Low | Update `EMBLEM` bounds in `scripts/generate-icons.js` for the 4096² square mark (or feed it a pre-cropped emblem); re-check at 16 px. |
| R11 | `dangerouslySetInnerHTML` for admin-authored `services[].sublabel` (ServicesStrip.jsx:20) remains an XSS vector for a compromised admin. | Low / Medium | Out of rebrand scope; note for hardening (render text or sanitise). |
| R12 | Cloudinary free-tier bandwidth consumed by a looping hero video. | Medium / Medium | Keep ≤4 MB, serve `vc_auto`/`q_auto`, long cache; monitor usage; fallback to a Vercel-hosted file only if small. |
| R13 | Removing Three.js changes the hero on `/` only but `three` is in `manualChunks`; stale chunk config warns at build. | Low / Low | Remove the `three` entry from `vite.config.js` and the dependency together. |
| R14 | Contact page inline `1fr 1fr` grid (Contact.jsx:45) is unresponsive today; restyle must add a breakpoint. | High / Low | Move to a `.contact-grid` class with `@media (max-width:900px)`. |

---

## 8. Could not verify

- Whether a `Content{type:'site'}` row currently exists in MongoDB (no DB access from this audit).
- That the Cloudinary cloud `dpmnlysdt` has video delivery enabled / enough credits, and that the listed public ids exist (URL shapes were read from code, not fetched).
- Build date of the `dist/` baseline sizes (directory exists; no timestamp captured).
- The exact green/gold hex values are the brief's samples (`#004020`, `#104028`, `#e0a028`, …); I did not re-sample `newlogo.png`/`letter_head.pdf` pixels.
- Postal code `54600`, office hours, and social URLs (`facebook.com/p/Karwan-e-Usmania-61552498595314/`, `@karwaneusmania` handles) are not on the letterhead; keep until the owner confirms.
- Whether the Facebook/Instagram/YouTube/TikTok accounts will be renamed with the rebrand.
- Runtime behaviour (jitter, LCP numbers) was inferred from code, not measured in a browser.

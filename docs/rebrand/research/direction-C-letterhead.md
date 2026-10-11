# Direction C: Letterhead Editorial

Built on RESEARCH.md (binding), VISUAL-NOTES.md, brand.md, motion.md, gap-1.md and craftbar.md. All tokens, eases and durations come from dossier §2 and §7. No facts are invented. Anything the owner must provide is marked **[owner to supply]**.

## 1. Thesis

The website is the letterhead, carried onto a screen. Someone who reads a KEUI letter and then opens the site should feel they have turned a page, not that they have arrived at another company. The ground is paper `#fcfbf8`. Gold appears only as 1 px rules that draw themselves. Green carries the voice: the Cinzel lockup, the Cormorant headings, the primary button and the footer sweep. The ghosted KU mark sits bottom-right at 6 %, as it does on the stationery. The layout takes Rialto's editorial grid, with visible gold hairline column rules (`rialto-03-whats-on-cards.jpg`, `rialto-07-shared-vision.jpg`), so every section reads like a typeset page with a running head. There is one loud moment, the Makkah video hero (`rialto-02-hero-video.jpg`). There is one ceremony, the Edolus handshake on first visit (`edolus-02-logo-counter.jpg` → `edolus-04-hero-cta.jpg`). Everything after that is quiet luxury in the manner of Nusuk and Aman. Hierarchy comes from size and tracking, not colour blocks. Photographs sit framed and inset like plates in a book. Motion is limited to fades, hairline draws and image curtains. The feeling to aim for is trust: a family in Lahore should see a firm that keeps records and answers its letters.

## 2. Grid and surfaces (global)

- **Grid at 1440:** 12 columns, 80 px outer margin, 24 px gutter. Column rules are 1 px gold-hairline `#d9ae54` at 40 %, and appear only where a section declares them (`data-rules`). They are never a constant background.
- **Grid at 375:** 4 columns with a 16 px gutter and no vertical rules.
- **Section dividers:** a full-width hairline drawn as T0 (`scaleX 0→1`, 800 ms `power2.inOut`, `top 90%`).
- **Running head:** each section opens with `01 ——— EYEBROW`: a section number (Manrope 500 12 px `tnum`, gold-800), a hairline, then the eyebrow. This is the letterhead's "Ref: KEUI/2026/…" line used as structure.
- **Surfaces:** paper by default, with ivory `#f6f2ea` as the alternate field. Home has only two dark surfaces, the hero at the top and the green footer band at the bottom, so house rule 2 holds with room to spare.
- **Padding:** 160 px vertical at 1440 and 96 px at 375. The whitespace is the Aman signal.

## 3. HOME storyboard

### 3.0 Hero: the Haram from above (`#hero`)
- **Purpose:** the Rialto moment. It creates awe and offers two exits.
- **Surface:** green-950, carrying the Pexels 35110835 loop (0.5x, 14 s, `-an`) with poster `keu/hero/poster` and the §7.3 scrim plus side gradient.
- **1440:** 100svh, full-bleed. This is the only full-bleed image on the site. The Kaaba sits at 30–45 % of frame width, and nothing overlaps it. Copy fills columns 8–12, left-aligned, starting about 62 % down. One gold column rule runs the full hero height at the left edge of column 8. It is the only rule laid over video, and it hands the grid to the page below. The pause toggle (WCAG 2.2.2) sits bottom-left: 40 px, gold-300 ring, label "Pause film". A 48 px gold hairline scroll cue draws once and stays; it does not loop.
- **375:** a 9:16 crop (4G, after LCP) or the poster. The Kaaba sits in the upper 55 %, the copy is bottom-stacked with 16 px gutters, and there is no column rule.
- **Copy:**
  - Eyebrow `KARWAN E USMANIA INTERNATIONAL · SINCE 2005` (Manrope 500 11 px, .28 em, gold-200).
  - H1 `.hero__title`: **Your Journey to the Holy Land, Our Priority** (Cormorant 500, 64 / 36 px, on-dark; the LCP element, painted at opacity 1).
  - Arabic line **خدمات ضيف الرحمن** (`lang="ar"`, Plex 500 22 px, gold-200; spelling Q3).
  - Sentence: "Hajj and Umrah from Lahore since 2005, with partners on the ground in Makkah and Madinah." (built from `founded` and `whyChooseUs[1]`).
- **CTAs:** **Plan on WhatsApp** (`#25d366`, green-950 label, `wa('general')`) and **View packages** (ghost button with a gold-300 hairline).
- **Motion, one idea (the settle):** after the bands open, the media scales 1.06→1 over 2000 ms `cubic-bezier(.19,1,.22,1)`. The eyebrow, Arabic line, sentence and CTAs arrive as T1 (y 12, 500 ms `power3.out`, stagger 0.08, from G+300 ms). The scroll scrub is the same settle carried on: media `yPercent 0→15`, darken 0→.85, content out by 70 %.

### 3.1 The letterhead seam: "Faith × Journey × Together"
- **Purpose:** the hinge from video to paper, and the place that carries the motto.
- **Surface:** paper. The top-left letterhead sweep (`M0 0H270C180 12 60 62 0 137Z` plus the offset champagne ribbon, 22 vw max) marks where the paper begins. There is no crossfade and no pin. The idea comes from White Desert's seam, catalogue #4.
- **1440 (about 360 px tall), centred on one axis exactly as on the letterhead:**
  - KU mark at 120 px, then a 1 px champagne divider 96 px tall.
  - The lockup stack: Cinzel wordmark SVG (cap 44, green-800), then `INTERNATIONAL` (cap 23, .45 em, green-700) between gold rules 3.8× cap long, then `TRAVEL & TOURS` (cap 16, .35 em, ink).
  - A second divider, then the tagline in three lines: "Your Journey / to the Holy Land / Our Priority" (Cormorant 24, ink), with the Arabic line under it.
  - 48 px below everything, `FAITH × JOURNEY × TOGETHER` (Manrope 500 12 px, .3 em, gold-800) between hairlines.
- **375:** a centred vertical stack, mark at 72 px, no dividers. The motto breaks "FAITH × JOURNEY ×" / "TOGETHER" as the letterhead does. The sweep stays, at 120×64.
- **Motion, one idea:** the dividers and the INTERNATIONAL rules draw as T0, 80 ms apart. Everything else is still. This is Rialto's hairline draw in the dossier's band ease.
- **CTA:** none; this section is a breath. I decline the motto marquee (catalogue #14). The letterhead sets the motto still and small.

### 3.2 Services ledger (`ServicesStrip`)
- **Purpose:** what we handle, without six coloured icon tiles.
- **Surface:** paper, `data-rules="6"`.
- **1440:** one row of six two-column cells between hairlines. Each cell has a gold-500 1.5 px line icon (`visa`, `plane`, `hotel`, `bus`, `guide`, `food`) inside a 36 px orbit ring (`dasharray 44 21 272 23`), then the label (Cormorant 500 22, green-800), then the sublabel (Manrope 13, muted). Copy is verbatim: Visa Processing / 100% approval rate; Flights / Economy & Business; Hotels / 4★ & 5★ near Haram; Transport / Private AC coaches; Local Guide / Urdu-speaking; Food / Halal Pak & Arabic.
- **375:** a 2×3 ledger with `gap:1px` on gold-hairline (catalogue #11), no ring.
- **Motion:** T2 batch (y 24, 600 ms `power3.out`, 0.08).
- **CTA:** none.

### 3.3 Sanctuaries: two plates (`SanctuariesSection`)
- **Purpose:** the spiritual centre, with photography framed and inset.
- **Surface:** ivory. The watermark (6 %) bleeds off the bottom-right and never sits behind text.
- **Head:** `02 ——— THE SANCTUARIES`.
- **1440:** a zigzag in two rows.
  - Row 1: `keu/makkah/masjid-al-haram` in columns 1–6, 4:5, about 560 px tall, in the **dome-arch mask** with a 1 px gold-hairline outline offset 6 px. Text in columns 8–12: "Makkah al-Mukarramah" (Cormorant 40, green-800), "Where the journey of every Muslim heart begins" (Cormorant italic 22), then the body verbatim (Manrope 16/1.7, 56-character measure).
  - Row 2 mirrors it: `keu/madinah/prophets-mosque` with "Madinah al-Munawwarah" and "The radiant city of the Prophet ﷺ".
  - A vertical gold rule between columns 7 and 8 runs the full section, like a book's gutter.
- **375:** image (arch, 4:5), then text; the subtitle drops to 18 px.
- **Motion, one idea:** a T3 curtain, `inset(100% 0 0 0)→inset(0)` with inner scale 1.12→1, 1200 ms `expo.out`. Text follows as Block (y 32, 750 ms `power3.out`). Image hover is 1.03 over 600 ms. **No pin.**
- **CTA:** text link "Read our story →" to `/about`, with a gold underline `scaleX` over 300 ms.

### 3.4 Packages preview (`#packages-preview`)
- **Purpose:** the commercial heart, showing the live products.
- **Surface:** paper, `data-rules="3"` (the rules sit in the card gutters).
- **Head:** `03 ——— PACKAGES`, then the `bismillah` slot "اَلْحَمْدُ لِلَّهِ" (Plex 18, gold-800). Title "Packages Crafted for Every Family". Subtext "Economy comfort to VIP indulgence — every package is built around the Haram experience." (both from Home.jsx).
- **1440:** `PackagesGrid featured limit={3}`. The two live packages centre as 2×380 px through `:has()`. Under the grid, a trust line between hairlines: "Prices per person · confirmed in writing before you pay". The slot "DTS licence No. [owner to supply] · IATA [owner to supply]" renders only when the data exists.
- **375:** one column. A card is ≤560 px collapsed, so the next card's edge shows.
- **Motion:** T2 batch. Hover lifts −4 px over 250 ms, with the shadow on `::after` (opacity only, ≤ `0 4px 24px rgba(0,36,15,.08)`).
- **CTA:** "See all packages" (secondary button) to `/packages`.

### 3.5 The ledger of record (`WhyChooseUs` merged with `StatsSection`)
- **Purpose:** trust, set as typography. Merging the two sections removes the "counter strip" cliché and one section.
- **Surface:** paper, a 4-column hairline lattice (`gap:1px` on gold-hairline).
- **Head:** `04 ——— WHY KARWAN E USMANIA`, title "A karwan never travels alone." (from `whyChooseUs[1].body`).
- **1440:**
  - **Top row**, the `stats[]`: figures in Cormorant 500 72 px `tnum` green-800, with gold-600 suffixes (display size on paper, so allowed). Labels in Manrope 500 11 px, .22 em, gold-800: 18+ YEARS OF SERVICE · 25,000+ PILGRIMS SERVED · 15+ PARTNER HOTELS · 100% VISA SUCCESS RATE.
  - **Bottom row**, the `whyChooseUs[]` titles (Cormorant 24, green-800), each with a 20 px gold-500 icon (`award`, `kaaba`, `shield`, `support`) and its body verbatim.
  - Each stat stands over the reason it supports, so "18+" sits above "18+ Years of Experience".
- **375:** a 2×2 stat lattice, then the reasons in a single column, divided by hairlines.
- **Motion, one idea:** the counters (`data-count`, 1.6 s `power3.out`, `tnum`). The cells fade as plain Block reveals.
- **Owner flag:** "18+ years" since 2005 is 21 in 2026. Keep the data as it is and ask the owner **[owner to supply]**.
- **CTA:** none.

### 3.6 Testimonials, one letter at a time
- **Surface:** ivory, the second and last watermark (5 %).
- **1440:** one quote, centred in columns 3–10.
  - The quote in Cormorant italic 36/1.35 text-body, opened by a 64 px gold-600 hanging quote mark.
  - Then a 64 px hairline, the name (Manrope 500 13 px, .18 em, ink), and "location · trip" in muted.
  - Controls are 40 px square outlined arrows with radius 0, plus a gold progress hairline (`rialto-05-dining-carousel.jpg`).
  - No stars and no initials avatars: the live "AK" for Zahid Rauf proves initials go stale.
- **375:** the same at 24 px, swipeable.
- **Content:** renders whatever `testimonials[]` holds at runtime (4 entries live). We never write quotes.
- **Motion, one idea:** a crossfade over 500 ms `power3.out` (y ±8). No autoplay.

### 3.7 FAQ (`#faq`)
- **Surface:** paper.
- **1440:** a split. Columns 1–4 hold the head and the title "Questions pilgrims ask", sticky with CSS at `top:120px` (no GSAP pin). Under the title: "Not answered here? WhatsApp us — most travellers receive a quote within an hour." (from `faqs[9]`). Columns 6–12 hold native accordions: `.faq-item__q` in Cormorant 22 green-800 and a hairline per row. The plus rotates 45° over 250 ms, and the answer opens on grid-row 0fr→1fr over 450 ms `power3.out`.
- **375:** a single column.
- **Content:** the live FAQ copy contradicts the packages (gap-1 §1.1). The owner must correct it **[owner to supply]**.
- **CTA:** WhatsApp link.

### 3.8 Closing letter (`CTABanner`)
- **Purpose:** the final ask, as a letter's signature block. It must be paper, because the green footer follows.
- **Frame:** columns 3–10, between double hairlines (1 px, 4 px gap, 1 px).
- **Copy:**
  - Eyebrow `BEGIN YOUR JOURNEY`.
  - Title "Your Journey to the Holy Land, Our Priority" (Cormorant 56 / 34, green-800).
  - "Speak with our Lahore office today."
  - **Plan on WhatsApp** and **Call +92 42 35136177** (secondary button).
  - "Mon – Sat 9:00 am – 7:00 pm · Sunday 11:00 am – 4:00 pm" (muted).
- **Motion:** the double rules draw (T0), then the block fades (750 ms `power3.out`).

### 3.9 Footer: the letterhead sweep (§5.3)

## 4. Inner pages

Every inner page opens with a PageHeader still (≤60 vh), never a video.

**Packages**
1. PageHeader "Umrah & Hajj Packages".
2. A sticky filter row of the existing `FILTERS` as text tabs. A gold underline moves between them with Flip (500 ms `power3.inOut`). No pills.
3. A 3-column grid with gold rules in the gutters, plus the trust line.
4. **Qafila e Shoq (`#qafila`), the site's one dark chapter.** Green-950 with a gold-300 hairline frame inset 20 px: Rialto's inset frame (`rialto-04-aerial-video-chapter.jpg`), applied to a still.
   - "A spiritual journey by Karwan e Usmania International".
   - "Qafila e Shoq", "A Sacred Caravan of Devotion", and "قافلہ شوق" in lazy Nastaliq (line-height 2.1).
   - "Led by Pirzada Burhan uddin Ahmed Usmani Sahib · Islamic Scholar", with the intro verbatim.
   - The four pillars in a gold-300 lattice, each topped by its Urdu word (عبادت ریاضت تربیت سیاحت).
   - The seal appears only after retrace and consent (Q5). Dates and places: **[owner to supply]**.
   - CTA "Apply via WhatsApp" (`wa('qafila')`).
5. FAQ subset, then the closing letter. Paper on both sides of Qafila.

**About**
1. PageHeader "Our Story".
2. `about.story[]` in two editorial columns with a gutter rule and a four-line Cormorant drop cap. The line "We do not see our pilgrims as customers — we see them as Mehmaan-e-Khuda, the guests of Allah." is pulled out in italic 32 px between hairlines.
3. The arch-masked story image.
4. `TeamGrid` from live data (7 people): 4:5 portraits, radius 0, hairline frame offset 6 px. A Cinzel-initials name plate stands in for any missing photo.
5. The ledger, then the closing letter.

**Gallery**
1. An editorial masonry that honours `size` (`wide`/`tall`). Plates have hairline frames, with each `alt` repeated as a 12 px caption.
2. The lightbox sits on paper at 96 %, not black. It cross-fades over 350 ms and supports arrows, Esc and a focus trap.
3. T3 curtains on the first six images only; after that, Block fades.

**Contact**
1. The letterhead footer, enlarged, in three columns with gold dividers:
   - "Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town, Lahore, Pakistan" (postcode **[owner to supply]**).
   - Landline +92 42 35136177 and Mobile +92 333 4883578 (WhatsApp line per Q1).
   - keusmania@gmail.com and the hours.
   - The motto beneath.
2. The form takes 7 columns and the hairline-framed map 5 (repinned to Johar Town). This fixes `Contact.jsx:45`. On mobile they stack, form first.
3. Three WhatsApp text rows, "Umrah", "Hajj" and "Qafila e Shoq", each on its own `useWaLink` key (catalogue #6).

## 5. Global components

**5.1 Nav**
- **Over the hero:** transparent, 80 px. The 40 px KU mark, the on-dark Cinzel wordmark and `INTERNATIONAL` sit left. Centred links: Home, Packages, About, Gallery, Contact (Manrope 500 13 px, .12 em). The WhatsApp button and the `بک کریں` toggle sit right (set in Plex, so Nastaliq never loads at first paint). A 12 px blur is allowed here only.
- **After 80 px:** paper at .96 with a gold-hairline bottom edge. The bar shrinks 80→64 through a `scaleY` background over 350 ms `power3.out`, and the wordmark turns green-800.
- **Links:** underlines are a gold-500 `scaleX` over 300 ms, and the active underline stays drawn.
- **Never hides:** the nav never hides on scroll.

**5.2 Mobile menu**
- A **paper** fullscreen panel, not green-950: dark is already spent at the top, and paper keeps the menu inside the letterhead world. A polygon wipe opens it over 900 ms `power4.inOut`.
- The sweep corner device sits in the corner. Links are Cormorant 40 green-800, numbered 01–05 in gold-800, divided by hairlines, and stagger in as T1.
- The foot holds +92 333 4883578, keusmania@gmail.com and a full-width WhatsApp button.
- `inert` on main, a focus trap, and Esc closes.

**5.3 Footer**
- **Top edge:** the brand.md sweep SVG (`0 0 1440 180`, `preserveAspectRatio="none"`) filled `#164a31 → #083820`, with the 2 px champagne ribbon on its edge (the only metallic gradient outside the logo) and `geometric.svg` at 4 %.
- **1440:**
  - The letterhead arrangement: mark | champagne divider | stack, with the wordmark in **solid gold-300**.
  - A 4-column row with gold dividers: address · phones · email and `usmania.vercel.app` (Q2) · `FAITH × JOURNEY × TOGETHER`.
  - Links, `company.socials` and live package links.
  - "© Karwan e Usmania International" with a computed year.
- **375:** a centred stack with the columns as hairline rows, and a 72 px sweep.
- **Motion:** a sticky curtain reveal (catalogue #15); normal flow under reduced motion.

**5.4 WhatsApp FAB**
- A 56 px `#25d366` button with a green-950 glyph, bottom-right at 24 px (16 px plus the safe area on mobile).
- It appears (T1) once the hero CTAs leave the viewport, so it never duplicates them.
- Magnetic on `pointer:fine` only (±12 px, `quickTo` .45 s `power3.out`), with no idle pulse.
- On desktop, hover reveals Umrah / Hajj / Qafila. On mobile, a tap goes straight to `wa('general')`.
- It is hidden while the menu is open.

**5.5 PageHeader**
- **1440:** 56 vh, split. The still sits in columns 6–12, inset 20 px with a hairline frame. Paper text in columns 1–5: a running head (`PAGE · PACKAGES`), the title in Cormorant 72 green-800, an optional Arabic or Urdu line, and breadcrumbs. The corner sweep device sits top-left.
- **375:** the image on top at 4:3, then the text. The device is hidden below 480 px.
- **Motion:** a T3 curtain on the image, and a GSAP opacity plus y12 fade on the title over 500 ms (safe for LCP).

**5.6 PackageCard** (gap-1 §4, existing fields only)
- **Frame:** a white card with a 1 px gold-hairline border, 4 px radius and 24 / 20 px padding. No top bar, no pattern, no gradient.
- **Contents, in order:**
  1. Eyebrow `ECONOMY · UMRAH` (`tier` · `category`; Manrope 500 11 px, .14 em, gold-800), with `badge.trim()` right-aligned as an outlined hairline tag, typed exactly as the owner typed it.
  2. `name` (Cormorant 500 28 / 24, green-800, two lines max).
  3. `nights` ("21 nights", hidden if null or 0) · `subtitle` (Manrope 14), so the "Package Without Air Ticket" disclosure sits under the title.
  4. `priceLabel` verbatim (Cormorant 36 / 30, ink, `tnum`). Under it, "per person" when `perPerson !== false && !isOnRequest`. **`price` is never read.** When on request: "Price on request" in 24 px, plus the quota line for Hajj.
  5. A hairline.
  6. Inclusions with keyword→icon mapping onto `src/icons.jsx` (16 px, gold-500): 6 on desktop and 4 on mobile, then "+N more".
  7. `summary`, clamped to 4 / 3 lines, then a native `<details>` "Full package details" (`pre-line`).
  8. CTA "Book on WhatsApp", or "Enquire on WhatsApp" when on request: 48 px, full width, `wa(pkg.id)`, `margin-top:auto`.
- **VIP variant** (`tier==='vip'`, never `featured`): green-950 field, gold-300 hairline, on-dark text.
- **Admin preview:** the card must work at the admin preview's 360 px width.

**5.7 SectionHeading**
- **Order:** running head, then the optional `bismillah` (Plex, gold-800, no tracking), then `.section-heading__title`, then the subtext.
- **Title:** Cormorant 500, 56 / 32, green-800, `text-wrap:balance`.
- **Subtext:** Manrope 18/1.6, 60-character measure.
- **Alignment:** left by default. Centre is for the packages and closing headings only.
- **Motion:** a SplitText line reveal (`yPercent 110→0`, 900 ms `power4.out`, 0.08), below the fold only. Arabic and Urdu reveal as whole lines.

**5.8 Buttons**
- **Primary:** green-800 with a white label, Manrope 600 13 px, .14 em, 48 px tall, radius 2. Hover goes to green-900 over 250 ms.
- **Secondary:** a 1 px green-800 outline, with a fill sweeping up on hover over 350 ms.
- **On dark:** an on-dark `#f4f1ea` fill with a green-950 label, or a gold-300 ghost.
- **WhatsApp:** the only colour-filled CTA.
- **Text link:** green-800 with a gold underline `scaleX`.
- No gold buttons anywhere.

**5.9 Forms**
- **Fields:** underline only, in the Aman manner: a 1 px muted border that turns green-800 on focus, and a 2 px gold-500 focus-visible ring for keyboard users.
- **Labels:** 12 px eyebrows above each field, never placeholders.
- **Errors:** inline text tied with `aria-describedby`.
- **Success:** an inline hairline card reading "Thank you. Our Lahore office will reply shortly." It promises no time we cannot keep.

## 6. Preloader and route transition

**Preloader** (first visit per session, inlined in `index.html`):
1. **0 ms:** green-950 and a single gold point (`edolus-01-black-logo-draw.jpg`).
2. **The draw:** the ring draws over 80→1080 ms (DrawSVG, `power2.inOut`). The swoosh follows at 300→1100 ms, the KU fill-wipe at 500→1100 ms, and the aircraft arrives at 1000→1200 ms (`power3.out`, no back ease).
3. **My addition, the lockup rule:** at 900→1200 ms, two 1 px gold rules draw outward from beneath the mark, echoing the INTERNATIONAL rules. The ceremony ends on a letterhead gesture without any text above 24 px.
4. **Counter:** 12 px `tnum`, gold-300 at .7, an honest odometer that parks at 99 and is skipped on low-end devices.
5. **Gate:** `max(1200, logoDrawn, fontGate)`, capped at 2200 ms.
6. **Reveal:** bands at `yPercent ∓100` over 800 ms `power2.inOut`, with gold hairline edges. From +200 ms, `Flip.fit` moves the mark into `.nav__logo-img` over 800 ms `power3.inOut` (`edolus-04-hero-cta.jpg`). The H1 is already painted underneath. Typical total: 2.0 s.

**Route transition:**
- **Cover:** two green-950 bands close over 600 ms `expo.inOut` and meet on a gold hairline carrying the 32 px static KU mark.
- **Hold:** 120–400 ms, while `lenis.stop()` → `jumpTo(0)` → `ScrollTrigger.refresh()` → `lenis.start()` runs.
- **Reveal:** the bands open over 700 ms `expo.inOut`, and the PageHeader curtain starts at 60 % of the open. The Nav stays above (z 100 vs 90) and switches to paper under cover.
- **Variants:** back and forward take 450 ms each way. Same-page hash links get no curtain. Reduced motion gets a 200 ms crossfade, and Save-Data is instant. `/admin` is never wrapped.

## 7. What I deliberately do NOT do

- **No second video.** Rialto's inset aerial chapter appears only as a framed still (Qafila). One film per site keeps it special.
- **No templated furniture:** no marquee, autoplay carousel, star ratings, initials avatars or separate counter strip.
- **No pins on Home**, including the optional Sanctuaries pin.
- **No decorative excess:** no gold fills, gold buttons, gradient text, glass cards or shadows beyond the token cap.
- **No full-bleed photography below the hero.** Every image is a framed plate.
- **No Edolus sci-fi texture:** no WebGL, no Three.js, no cursor follower, no scramble text (never near Arabic), no RGB split or grain (`edolus-06-orbital-intelligence.jpg`). From Edolus we borrow timing, not texture.
- **No overshoot:** no back, elastic or bounce eases, and no letter staggers on Arabic or Urdu.
- **No invented trust:** no licence numbers, dates, seats, prices or quotes beyond the data.
- **No dark menu or nav bar over paper, and no nav hiding on scroll.**

## 8. Risks

1. **Quiet can read as empty.** After the video, everything is paper and hairlines. One timid step in spacing or type, and the result looks like an unfilled template, not Aman. Comps must be judged at 1:1 with real Cormorant and the real sweep SVG, and the 72/56/40/28 scale must hold.
2. **The owner asked for Edolus-style animation.** This direction keeps it to the preloader and the curtains. If that under-delivers, escalate in order: line-mask headings, then the hero hover still-swap (catalogue #17), before anything louder.
3. **Hairline fragility.** A 40 % gold hairline on `#fcfbf8` can vanish on budget Android panels or blur at fractional DPR. Snap rules to device pixels and test at full opacity on a real phone. Rules carry no meaning, but they carry the character of the design.
4. **The seam costs scroll.** At about 360 px, the seam pushes the first package card to roughly 3.5 mobile screens. If analytics show drop-off, slim the seam to a motto-only band.
5. **Blocking assets.** The KU SVG trace, the Cinzel outline and the sweep path feed the watermark, preloader, nav, seam and footer. Without the trace there is no Direction C.
6. **Live copy gets magnified.** "Bumber Offer", "Star Package yaya" and 488-character summaries look worse in a quiet editorial frame. The admin re-save (gap-1 §1.2) is a launch prerequisite.
7. **Cormorant thins at small sizes on Windows.** It is restricted to ≥22 px. Body and UI text is always Manrope.
8. **The tagline appears three times** (hero, seam, closing letter). That is a deliberate letterhead echo, but the owner may find it repetitive. The fallback closing title is "Begin your journey with Karwan e Usmania International".

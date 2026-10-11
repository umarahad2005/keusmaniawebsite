# Direction A: Pilgrim-First

Design panel, KEUI rebrand. Binding inputs: `research/RESEARCH.md` (DECISIONS and house rules), `VISUAL-NOTES.md`, `gap-1.md`, `brand.md`, `motion.md`. Copy comes only from `src/data.js`, the live DB as recorded in gap-1, or the letterhead. Anything else is marked **[owner to supply]**.

---

## 1. Thesis

The person deciding is usually not the person who books. A son in Lahore or Dubai forwards a link to the family WhatsApp group. His father opens it on a three-year-old Android over 4G, holding the phone at arm's length, and the decision gets made in a voice note. So this direction gives the Rialto film and the Edolus handshake exactly two jobs, both on first contact: to say "this house is serious" and to say "this is Makkah". After that, every surface answers the three questions families actually ask, in this order: *what does it cost*, *can we trust them*, *how do we talk to them*. Packages move up to the second screen. A WhatsApp-and-Call bar is under the thumb from the moment the hero CTAs scroll away. Body text is 17 px and nothing hides behind hover. Arabic and Urdu are set as text to be read, never as decoration that moves. The look stays letterhead: paper, green voice, gold hairlines. The pace is Nusuk's: one idea per screen, numbered, legible at arm's length.

---

## 2. Home storyboard

Grid: 1440 px canvas, 1200 px container, 12 columns, 24 px gutters. 375 px canvas: 16 px gutter, one column, 343 px content. Vertical rhythm: 128 px between sections on desktop, 80 px on mobile. All reveals play once and never reverse (RESEARCH §7.4).

### 2.1 Hero (`#hero`): green-950 film

- **Purpose:** identity and place in under 3 s, plus a WhatsApp tap available at once.
- **1440:** a 100svh full-bleed muted loop of Pexels 35110835, under the DECISION scrim (top .50 → .15 at 40 % → .78 at the foot, plus a .45 side gradient behind the copy). The copy column sits in the right 45 %, left-aligned, its baseline at 72 % of the viewport height. The Kaaba stays at 30–45 % of frame width with nothing over it (house rule 9). The pause toggle (44 px, gold-300 hairline ring, label "Pause film") sits bottom-left at 32 px inset. That keeps it away from the FAB on the bottom-right. (From `rialto-02-hero-video.jpg`: lower-third headline, never video-dependent.)
- **375:** the 9:16 crop, with the Kaaba in the upper 55 %. The copy stacks over the foot gradient, starting at about 58 % of the height. Both CTAs are full width and stacked, each 52 px tall. The pause toggle moves top-right, under the nav.
- **Copy (exact):**
  - Eyebrow (Manrope 500, 11 px, .28 em, gold-200): `KARWAN E USMANIA INTERNATIONAL · SINCE 2005`
  - H1 (Cormorant 500, 64 / 36 px, on-dark): **Your Journey to the Holy Land, Our Priority**
  - Arabic (Plex Sans Arabic 500, 28 / 22 px, gold-200, `lang="ar" dir="rtl"`, line-height 1.3): **خدمات ضيف الرحمن** (spelling pending Q3)
  - Sentence (Manrope 17 px, on-dark-muted, max 44 ch): "Hajj and Umrah from Lahore since 2005, with our own Saudi partners on the ground in Makkah and Madinah." (Every fact here is in `data.js` `whyChooseUs`.)
  - CTA 1: WhatsApp-filled `#25d366` with a green-950 label, "Plan on WhatsApp" + icon → `wa('general')`. CTA 2: ghost with a gold-300 hairline, "View packages" → `/packages`.
- **Motion (the one idea):** the settle. After the bands open, the media scales 1.06 → 1 over 2000 ms on ease-settle `cubic-bezier(.19,1,.22,1)`. The H1 is already painted (it is the LCP element). The eyebrow, Arabic, sentence and CTAs then fade in as T1: 500 ms `power3.out`, y 12, stagger 0.08, starting at G+300 ms. The Arabic line fades as a whole line. The scroll scrub (media yPercent +15, darken to .85) stays, because it is part of the settle and not a second idea.
- **Gates:** Save-Data, 2g/3g and reduced motion get the poster (≤70 KB mobile / ≤160 KB desktop). See Risk 2 for the low-end exception.

### 2.2 Trust ledger: paper, directly under the film

- **Purpose:** answer "can we trust them" before any scrolling, at the exact point where the letterhead sweep meets the paper.
- **1440:** the letterhead sweep (the White Desert seam idea, pattern 4) is a 120 px green-to-paper SVG edge with the champagne ribbon. Below it sits one row of four figures between gold hairlines, separated by 1 px vertical gold-hairline rules (the Rialto column grid, `rialto-03-whats-on-cards.jpg`). Each figure is a Cormorant 500 48 px numeral in green-800 with a `tnum` suffix, over a Manrope 500 12 px .18 em label in gold-800. Under the row, centred, one 14 px text-muted line holds the licence slot. It renders only when the numbers exist.
- **375:** a 2×2 grid with a 1 px hairline cross, numerals at 36 px. The licence line wraps to two lines.
- **Copy:** `18+` Years of Service · `25,000+` Pilgrims Served · `15+` Partner Hotels · `100%` Visa Success Rate (from `stats`). Licence line: "DTS Licence No. [owner to supply] · IATA [owner to supply] · MoRA [owner to supply]". It is hidden until supplied. Note for the owner: since 2005 is 21 years in 2026, so "18+" understates it. Update the stat only if the owner says so.
- **Motion:** counters run 0 → value over 1600 ms `power3.out` at `top 85%`. The hairlines draw as T0 (scaleX, 800 ms `power2.inOut`).
- **CTA:** none.

### 2.3 Packages preview (`#packages-preview`): paper

- **Purpose:** prices on the second screen. This is the main change from the current order, where Packages sit fifth.
- **1440:** SectionHeading on the left (eyebrow `PACKAGES`, H2 "Umrah & Hajj Packages"). On the right, on the same baseline, sits a text link "All packages and Qafila e Shoq →". Below that, `featured` packages render as cards in the existing `:has()` grid. Live data has 2 cards, so the grid centres 2 × 380 px. Under the grid is the trust footnote (gap-1 §4.5), 13 px text-muted, centred: "Prices are per person as listed · confirmed in writing before you pay · [price basis, e.g. quad sharing: owner to supply]". The middle clause restates `whyChooseUs[2]` ("every cost is explained upfront, in writing").
- **375:** cards stack at full width. Collapsed height ≤560 px, so one card plus the next card's top edge fit in an 812 px viewport (gap-1 §4.2).
- **Motion:** T2 card batch, y 24, 600 ms `power3.out`, stagger 0.08, `top 85%`.
- **CTA:** the per-card WhatsApp button (see §4 PackageCard), plus the "All packages" link.

### 2.4 How booking works: ivory `#f6f2ea`

- **Purpose:** take the fear out of the first message, especially for older pilgrims and overseas sons booking for parents. This is Nusuk's numbered steps pattern (RESEARCH §4).
- **1440:** four columns, each with an orbit-ring numeral (the 1.5 px ring motif, `stroke-dasharray="44 21 272 23"`, 48 px, with a gold-800 Manrope 500 numeral inside), a 20 px Cormorant title and a 16 px body. One continuous gold hairline connects the rings.
- **375:** a vertical list. The rings sit on the left on a vertical hairline. Text is on the right.
- **Copy:** this step copy restates existing facts and is **[owner to approve wording]**:
  1. "Message us on WhatsApp": "Tell us your dates and who is travelling. You can message us anytime, even from the Haram itself." (`whyChooseUs[3]`)
  2. "Choose your package": "Every cost is explained upfront, in writing, before you commit." (`whyChooseUs[2]`)
  3. "Visa and documents": "Visa processing is handled by our team." (`services[0]`) Do not state 5–7 days: the live FAQ copy is unreliable (gap-1 §1.1).
  4. "Travel with support": "Our partners in Makkah and Madinah handle hotels, transport and ziyarah." (`whyChooseUs[1]`)
- **Motion:** the connecting hairline draws as T0 (800 ms `power2.inOut`, origin left, flipped in RTL). The rings sit static. Nothing else moves.
- **CTA:** "Start step 1 on WhatsApp" as a primary green-800 button → `wa('general')`.

### 2.5 Services strip: paper

- **Purpose:** a scannable answer to "what is included".
- **1440:** six items in a single row of a hairline lattice (Shehadeh `gap:1px` on gold-hairline, pattern 11). Each cell has a 28 px green-800 icon from `icons.jsx`, a 16 px label and a 13 px gold-800 sublabel.
- **375:** a 2×3 lattice. Never a horizontal scroller: older users do not discover sideways swipes.
- **Copy:** Visa Processing / 100% approval rate · Flights / Economy & Business · Hotels / 4★ & 5★ near Haram · Transport / Private AC coaches · Local Guide / Urdu-speaking · Food / Halal Pak & Arabic (`services`).
- **Motion:** T2 batch, 600 ms `power3.out`, stagger 0.08.
- **CTA:** none.

### 2.6 Sanctuaries: paper

- **1440:** two columns. Each image sits in a dome-arch mask (`border-radius:50% 50% 0 0/36% 36% 0 0`, with a gold-hairline outline offset 6 px), 4:5. Below it: title (Cormorant 32 px), subtitle (16 px italic) and body (17 px, max 60 ch).
- **375:** stacked, with images at 4:5 and full width.
- **Copy:** "Makkah al-Mukarramah" / "Where the journey of every Muslim heart begins" / body; "Madinah al-Munawwarah" / "The radiant city of the Prophet ﷺ" / body (`sanctuaries`, verbatim).
- **Motion:** T3 image curtain, `inset(100% 0 0 0) → inset(0)` plus inner scale 1.12 → 1, 1200 ms `expo.out`. **No pin** (the optional pin is declined; see §6).
- **CTA:** none.

### 2.7 Why choose us: paper

- **1440:** a 2×2 hairline lattice. Each cell has a 32 px icon, a 24 px Cormorant title and a 16 px body.
- **375:** one column, hairlines between cells.
- **Copy:** the four `whyChooseUs` items, verbatim. One amendment: change "18+ Years of Experience" only if the owner updates the stat.
- **Motion:** the heading line mask (SplitText lines, yPercent 110 → 0, 900 ms `power4.out`). Low-end devices get the 600 ms block fade.

### 2.8 Testimonials: ivory

- **Purpose:** social proof in family voices.
- **1440:** three static quote columns (no carousel). The quote is Cormorant 22 px italic in ink. Below it: name, location and trip in Manrope 13 px, with the 5-star rating in gold-500 at 14 px.
- **375:** stacked, full width. The first two show and a "Show more" button reveals the rest.
- **Copy:** use the live DB testimonials only (gap-1: 4 items). Two items need owner attention before launch. "Vick Pandaa - Waqas Saleem" looks like an edit, and Zahid Rauf shows "AK" initials. Drop the initials avatars; names are enough.
- **Motion:** Block reveal, y 32, 750 ms `power3.out` (the Rialto homage), on the section.

### 2.9 FAQ (`#faq`): paper

- **1440:** an 8-column centred native accordion. Questions are Manrope 600 18 px. Plus/minus is drawn in gold-500 hairline.
- **375:** full width, with tap rows of at least 56 px.
- **Copy:** `faqs` from the DB, **after** the owner corrects the pricing contradictions and typos (gap-1 §1.1). Hide FAQ #1 (price range) until then.
- **Motion:** grid-row 0fr → 1fr, 450 ms `power3.out`. There is no reveal on scroll, because the questions must be visible immediately.

### 2.10 Closing contact band: paper with an ivory card

- **Purpose:** the last chance before the footer. It must not be dark, because the footer is dark (house rule 2).
- **1440:** a centred card, max-width 880 px, white, 1 px gold-hairline border, 8 px radius, with the KU watermark at 6 % bottom-right. Inside: eyebrow `FAITH × JOURNEY × TOGETHER` (gold-800, .3 em), H2 "Speak to us today", then three equal tap targets in a row: WhatsApp (filled), "Call the office" (ghost, `tel:+924235136177`), "Visit in Johar Town" (ghost → `/contact`). Hours line: "Mon – Sat 9:00 am – 7:00 pm · Sunday 11:00 am – 4:00 pm (Pakistan time, PKT)".
- **375:** the buttons stack, each 52 px.
- **Motion:** Block, 750 ms `power3.out`.

---

## 3. Inner pages

**Packages (`/packages`)**
1. A short PageHeader: 36vh desktop, 220 px mobile, so the first card's top shows above the fold at 375. H1 "Packages". Lead: "Umrah, Ramadan, Family and Hajj, with every cost explained upfront."
2. Filter chips from the existing `FILTERS` (All / Umrah / Hajj / Ramadan / Family). They become sticky under the nav on scroll, and each is 44 px tall. Chips that would return zero live packages are hidden.
3. Trust footnote and licence slot (same as Home 2.3).
4. The grid.
5. **Qafila e Shoq**, the one green-950 chapter. It is flanked by paper on both sides. The retraced seal goes on the left. On the right: Nastaliq "قافلہ شوق" (lazy font, line-height 2.1), the name, the tagline "A Sacred Caravan of Devotion", the endorsement line "A spiritual journey by Karwan e Usmania International", `intro`, then four pillars as a 2×2 grid, each with its Urdu word above the English title. CTA "Apply via WhatsApp" → `wa('qafila')`. Dates and seats: **[owner to supply]**. Motion: the bands-free T3 curtain on the seal only.
6. FAQ.

**About:** PageHeader → `about.story` (17 px, 62 ch, dome-arch image) → stats ledger → the 7-person live DB team (verbatim, 1:1 photos, chairman first) → closing band.

**Gallery:** PageHeader → masonry from `size` (wide/tall) → tap opens a full-screen swipe viewer (48 px close, `alt` as caption). T3 curtains on the first 6 images, T1 after lazy load for the rest.

**Contact (`/contact`):** PageHeader → three contact cards in a row (WhatsApp / Call / Email), each one fully tappable, showing the number in large `tnum` → the form with the map side by side on desktop and stacked on mobile (this fixes the inline grid at `Contact.jsx:45`) → address card. Use the letterhead address, which is **[owner to confirm against the DB]**. Omit the unverified 54600 postcode → hours in PKT.

---

## 4. Global components

**Nav.** Transparent over the hero; after 80 px it turns paper `#fcfbf8` at .96 with a 1 px gold-hairline bottom edge, and the height goes 80 → 64 px through background `scaleY` over 350 ms `power3.out`. Left: BrandMark (40 px) and the wordmark SVG. Centre: Home · Packages · About · Gallery · Contact (15 px, .04 em) with a 1 px gold-500 underline scaling in over 300 ms. Right: the only filled control, the WhatsApp button "بک کریں · Book" (the Urdu set in the Arabic face so Nastaliq never loads at first paint). The nav never hides on scroll. At 375 px it shows the BrandMark (32 px), the WhatsApp icon button (44 px) and the menu button (44 px), nothing else.

**Mobile menu.** A green-950 full-screen panel, opened with the polygon wipe over 900 ms `power4.inOut` (pattern 8), with `inert` set on main. Links are Cormorant 36 px, one per line, revealed as T1. At the foot: WhatsApp and Call, both full-width 52 px buttons, plus the hours. Close is in the same position as the menu button.

**Thumb bar (replaces the FAB below 768 px).** This is the signature of this direction. It is a 64 px bar fixed to the bottom with `padding-bottom: env(safe-area-inset-bottom)`, paper .98 with a gold-hairline top edge. It holds two buttons: "WhatsApp" (2/3 width, `#25d366`, green-950 label) and "Call" (1/3 width, green-800 hairline ghost, `tel:+923334883578`, which is the letterhead mobile, **[owner to confirm the conversion line, Q1]**). It slides in (y 100 % → 0, 350 ms `power3.out`) when the hero CTAs leave the viewport, so it never duplicates them. It hides while the mobile menu is open and while focus is inside a form field (the keyboard is up). The footer gets 64 px of extra bottom padding so the bar never covers the last row.

**WhatsApp FAB (≥768 px).** 56 px, bottom-right at 24 px. Magnetic on pointer:fine only (±12 px, `quickTo` 450 ms `power3.out`). It enters after the intro: autoAlpha and scale .8 → 1 over 500 ms. No idle pulse. A tooltip label "Chat on WhatsApp" shows on hover and on focus.

**WhatsApp number in code.** Strip non-digits from `company.whatsapp` before building `wa.me` (gap-1 §1.2). Add a `qafila` key in `buildMessages`.

**Footer (letterhead sweep).** The top edge is the `footer__sweep` SVG (green-band → band-deep gradient, a 2 px champagne ribbon with `vector-effect`). Below it is the green band, with `geometric.svg` at 4 %. Desktop has three zones. Left: the lockup at footer size (mark | 64 px gold divider | wordmark, INTERNATIONAL with rules, TRAVEL & TOURS). Middle: the contact rows with green-500 icon rings, each row a tap target: address, landline +92 42 35136177, mobile +92 333 4883578, keusmania@gmail.com, and hours. Right: page links and socials. Bottom row: `FAITH × JOURNEY × TOGETHER` (gold-300, .3 em) centred, then "© Karwan e Usmania International". The year is computed. On mobile everything is stacked and centred, with the mark at 64 px. The footer wordmark is solid gold-300; there is no gradient text.

**PageHeader.** A Cloudinary still under the scrim, ≤60vh (36vh is the default here). The H1 is Cormorant 56 / 34 px with an eyebrow above it. The top-left corner device (320×140 sweep plus ribbon) appears from 480 px up. A breadcrumb in 13 px on-dark-muted helps visitors arriving from shared deep links.

**PackageCard (gap-1 §4, existing fields only).**
1. Eyebrow row: `TIER · CATEGORY` (12 px, .12 em, gold-800), with `badge.trim()` as an outline pill on the right.
2. `name`: Cormorant 500, 24 / 28 px, green-800, at most 2 lines.
3. Meta: "`nights` nights" · `subtitle`, 14 px text-body. This line is the disclosure, e.g. "Package Without Air Ticket".
4. Price: `priceLabel` only, Cormorant 32 / 36 px in ink. Below it, "per person" at 13 px when `perPerson !== false && !isOnRequest`. Never `price`.
5. A gold hairline.
6. Inclusions, trimmed, with icons from the keyword map: 4 on mobile and 6 on desktop, then "+N more".
7. `summary` clamped to 3 / 4 lines, then a native `<details>` "Full package details" with `white-space: pre-line`.
8. CTA "Book on WhatsApp" (Hajj/on-request: "Enquire on WhatsApp"), full width, 52 px → `wa(pkg.id)`.

White card, 1 px gold-hairline border, 8 px radius, no image. VIP (`tier==='vip'`) is green-950 with gold-300 text. Hover: lift −4 px, 250 ms. On request: "Price on request" (24 px) plus "Government quota · seats confirmed on application". Must hold at 360 px in the admin preview.

**SectionHeading.** Eyebrow (Manrope 500, 12 px, .22 em, gold-800 on paper / gold-300 on dark), H2 Cormorant 500 at 48 / 32 px in green-800, and an optional 17 px lead (max 56 ch). It keeps the `.section-heading__title` speakable class. An optional Arabic or Urdu line goes *under* the English heading, never letter-split and never animated separately.

**Buttons.** All 52 px tall on mobile and 48 px on desktop, with a 24 px horizontal pad, 4 px radius, and labels in Manrope 600 15 px at .02 em. Sentence case: older readers struggle with tracked 10 px caps, so Rialto's `.185em` micro-labels are not used on buttons. The types: Primary (green-800, white label), Ghost (green-800 hairline; gold-300 on dark), WhatsApp (`#25d366`, green-950 label, icon left), Link (green-600, underline offset 4 px). Focus ring: 2 px gold-500 with a 2 px offset. Hover changes colour over 250 ms `power3.out`.

**Forms.** The field order is the existing one (Full Name, Phone, Email optional, Package Interest, Preferred Contact, Message). Labels are always visible above fields at 15 px, never placeholder-only. Inputs are 52 px tall, font-size 17 px (which also stops iOS zoom), with a 1 px `#c9c3b5` border that turns into a 2 px green-800 focus ring. Phone uses `type="tel" inputmode="tel"` with the hint "Include country code if outside Pakistan, e.g. +971…". Errors appear inline in plain English under the field. On success: "JazakAllah Khair, we will reply soon. For a faster answer, message us on WhatsApp," with the WhatsApp button.

**OG / link preview.** Families judge the shared WhatsApp link card, so each page gets a 1200×630 paper card with the lockup, page title and tagline, on the canonical domain **[owner to decide, Q2]**.

---

## 5. Preloader and route transition

**Preloader (first visit per session, Home only).** Inline in `index.html`, painting before React, on a green-950 ground.
- 0–80 ms: ground only.
- 80–1080 ms: the gold orbit ring draws (DrawSVG, `power2.inOut`).
- 300–1100 ms: the swoosh draws.
- 500–1100 ms: the KU fill wipes in.
- 1000–1200 ms: the aircraft settles (x −6 → 0, rotate −8 → 0, `power3.out`).
- The counter (12 px Manrope `tnum`, gold-300 at .7) sits 20 px below, honest, and parks at 99. Borrowed from `edolus-01-black-logo-draw.jpg` and `edolus-02-logo-counter.jpg`.
- **Pilgrim-first addition:** the bottom of the preloader carries a 14 px gold-300 line, "WhatsApp +92 333 4883578", as a real link (number pending Q1), and "Skip" at 44 px. It stays under 24 px so it cannot steal LCP, and WhatsApp stays reachable even during the ceremony (house rule 10).
- The gate is `max(1200, logoDrawn, fontGate)`, capped at 2200 ms.
- Then the two bands open, `yPercent ∓100` over 800 ms `power2.inOut`, each with a 1 px gold-500 inner edge. The logo FLIPs to `.nav__logo-img` over 800 ms `power3.inOut`, starting 200 ms into the bands (`edolus-03-reveal-glimpse.jpg` → `edolus-04-hero-cta.jpg`). The H1 is already painted underneath.
- Low-end: no counter, minHold 600, cap 1200. Save-Data and reduced motion: no preloader.

**Deep links shared on WhatsApp** (`/packages`, `/contact`): the bands are already closed at first paint with the 32 px static mark. They open over 600 ms `expo.inOut` once fonts are ready (cap 900 ms). There is no draw and no counter, because the recipient came for a price, not a ceremony.

**Route transition.** This reuses the bands, under the persistent nav (z 90 under 100): cover over 600 ms `expo.inOut`, hold capped at **250 ms** (tighter than the dossier's 400 ms ceiling, for impatient thumbs), reveal over 700 ms `expo.inOut`. A 32 px static KU mark shows on the closed bands. Back/forward: 450 ms each way. `wa.me` and `tel:` links are never curtained. Reduced motion: a 200 ms crossfade. Save-Data: instant.

---

## 6. What I deliberately do not do

- **No pin anywhere,** including the optional Sanctuaries pin. Dead scroll costs the family member who is scrolling for the price.
- **No motto marquee.** `FAITH × JOURNEY × TOGETHER` is set still, as on the letterhead. Moving text is hard to read at arm's length.
- **No carousels** for testimonials, packages or services. Everything stacks or sits in a lattice.
- **No information on hover only.** Inclusions, prices and badges are always visible.
- **No letter or word splitting of Arabic or Urdu,** and no scramble text anywhere.
- **No tracked micro-caps on buttons,** and nothing under 13 px except the preloader counter.
- **No Three.js, WebGL, custom cursor or second Home video.**
- **No invented trust:** licence numbers, departure dates, seat counts, prices beyond `priceLabel`, and testimonials not in the DB are all left out until supplied.
- **No `price` field shown or used in logic.**
- **No Nastaliq on Home at first paint.**

---

## 7. Risks of this direction

1. **It may feel less cinematic than the owner imagines.** Moving Packages to the second screen and adding a thumb bar makes the page read as a booking site sooner. Mitigation: the hero, the handshake and the sweep seam still deliver the Rialto/Edolus moment. Show the owner a phone recording, not a desktop one.
2. **Proposed exception to the low-end matrix.** RESEARCH §7.7 serves 720p video on low-end devices. I propose poster-only on mobile when `deviceMemory ≤ 4` *or* `hardwareConcurrency ≤ 4`, because a decoding video plus scroll scrub on budget Android is the dossier's own dominant GPU risk (§7.7 Three.js rationale), and prepaid data is real money for the families this direction serves. Evidence is inferential: measure p75 frame time on a real mid-range device before deciding. It also ties into Q4.
3. **Thumb bar versus content.** A fixed 64 px bar takes about 8 % of an 812 px viewport, and can collide with the Android gesture bar and in-app browsers (the WhatsApp in-app webview). It needs device testing with safe-area insets.
4. **Unconfirmed conversion number.** The thumb bar, preloader line and footer all print a number, and three candidates exist (Q1). Shipping the wrong one everywhere would hurt more than in the current design. This is a launch blocker.
5. **Step copy and trust footnote** paraphrase existing claims. The owner must approve them; if the live FAQ stays uncorrected, the steps and the FAQ could contradict each other.
6. **Tighter route hold (250 ms)** may expose unfinished renders on slow devices. Fall back to 400 ms if flashes appear in testing.

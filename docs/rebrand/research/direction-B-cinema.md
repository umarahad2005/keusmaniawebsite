# Direction B: Cinematic Chapters

Panel member: Direction B · 2026-10-10 · Binding inputs: `research/RESEARCH.md` (DECISIONs, house rules, motion tokens §7.1, tiers §7.4), `VISUAL-NOTES.md`, `brand.md`, `motion.md`, `gap-1.md`. Content comes only from `src/data.js`, the live DB facts in gap-1 and the letterhead. Anything else is marked **[owner to supply]**.

---

## 1. Thesis

The Home page is a film in four chapters (**I Departure, II Makkah, III Madinah, IV Return**), and the rest of the site uses the same grammar more quietly. Rialto gives us patience: one muted Haram loop, one 750 ms `power3.out` block reveal and gold hairlines that draw. Edolus gives us ceremony: the KU mark draws itself on green-950, two bands open on the film and the mark glides into the nav. Between them sits the letterhead. Paper is the stage, gold is only ever a line, and green is the voice. "Cinematic" here means *edited*, not *loud*. Every chapter has a title card (a numeral, an eyebrow and a line-masked heading), a single motion idea, and a mini CTA that opens WhatsApp or a package. The one allowed pin goes to the hinge of the story, the move from Makkah to Madinah. Dark appears three times on the whole site (hero, Qafila chapter, footer). That restraint is what lets the motion feel expensive rather than busy.

---

## 2. Home storyboard (in scroll order)

Grid: 1440 px uses 12 columns, 1264 px content (88 px side margins), 24 px gutters. 375 px uses 4 columns with a 16 px gutter. Surfaces sit on the fixed `.bg-stage` (motion.md §7.1). Sections in a crossfade zone are `background: transparent`, and each declares `data-surface`.

### 2.0 Preloader (first visit per session). See §5.

### 2.1 Prologue: Haram video hero (`#hero`), surface green-950 + video

- **Purpose:** the Rialto moment. A calm, huge, silent statement, with WhatsApp one tap away.
- **1440:** a 100svh video plate (Pexels 35110835, 0.5x retime, 14 s loop, overscan `top:-8%; height:116%`) under the §7.3 scrim plus a side gradient behind the right column. The Kaaba sits at 30–45 % of frame width, and **nothing overlaps it**. The copy column spans columns 7–12, left-aligned, with its baseline at 72 % of viewport height:
  - Eyebrow `KARWAN E USMANIA INTERNATIONAL · SINCE 2005` (Manrope 500, 11 px, .28 em, gold-200)
  - **H1** `Your Journey to the Holy Land, Our Priority` (Cormorant Garamond 500, 64 px / 1.05, on-dark `#f4f1ea`, max 11 ch per line, so it sets in 3 lines)
  - Arabic `خدمات ضيف الرحمن` (`lang="ar"`, IBM Plex Sans Arabic 500, 22 px, gold-200, line-height 1.3) **[owner to confirm spelling, Q3]**
  - Sentence `Since 2005, we have served over 25,000 pilgrims with care, integrity, and attention to every detail of the sacred journey.` (Manrope 16 px, on-dark-muted, max 44 ch; source `whyChooseUs[0].body`)
  - Buttons: **WhatsApp** (filled `#25d366`, green-950 label "Chat on WhatsApp") + ghost "View packages" (1 px gold-300 hairline, on-dark label, tracked .185em, 12 px uppercase; Rialto's button, `rialto-07-shared-vision.jpg`).
  - Bottom-left at 32 px inset: a **chapter index** in Edolus HUD style (`edolus-06-orbital-intelligence.jpg`), `I DEPARTURE · II MAKKAH · III MADINAH · IV RETURN`, Manrope 11 px, .24 em, on-dark-muted, each an anchor link. Bottom-centre: `SCROLL TO BEGIN ↓`, 11 px. Bottom-right: a 40 px circular pause/play toggle with a 1 px gold-300 ring (WCAG 2.2.2).
- **375:** a 9:16 crop (720×1280), gated to 4G after LCP; otherwise the poster. The Kaaba sits in the upper 55 %. The copy stacks bottom-up over the foot gradient: eyebrow (10 px, wraps to 2 lines), H1 36 px / 1.08, Arabic 18 px, sentence 15 px, then the buttons stacked full width (48 px tall, 12 px gap). The chapter index is hidden. The scroll cue is replaced by the pause toggle, top-right under the nav.
- **Motion (one idea): the settle.** After the bands open: scale 1.06→1 over 2000 ms, `cubic-bezier(.19,1,.22,1)` (ease-settle). The H1 is already painted and never animates on first entry. Eyebrow, Arabic, sentence and CTAs run T1 (`y 12`, 500 ms `power3.out`, stagger .08 from G+300). The scroll scrub (media `yPercent 0→15`, darken 0→.85, content `yPercent −30` and fade by 70 %) belongs to the hero exit and counts as the seam, not as a second idea.
- **CTA:** WhatsApp (`wa('general')`), "View packages" → `/packages`.

### 2.2 Seam: the letterhead sweep, dark → paper

The White Desert seam (pattern 4): a 180 px SVG band (96 px at 375) at the hero's foot, using the `brand.md` §2.5 bottom-sweep path in green-950 with the 2 px champagne ribbon on its edge. The `.bg-stage__paper` opacity scrubs 0→1 from `top 75%` to `top 25%` of the next section, and the ribbon draws once (DrawSVG, 1200 ms `power2.inOut`). Reduced motion: hard switch, static ribbon. A transition, not a section, so it has no CTA.

### 2.3 Chapter I, Departure: "From your first call" (services), surface paper

- **Purpose:** turn the six services into the first leg of the journey and introduce the chapter grammar.
- **Title card (shared by every chapter):** a numeral `I` in Cormorant 300 at 160 px, set as an outline with a 1 px gold-hairline `-webkit-text-stroke` and `aria-hidden`. Eyebrow `CHAPTER I · DEPARTURE · LAHORE` (gold-800, 11 px, .24 em). H2 `From your first call to your safe return.` (Cormorant 500, 48 px, green-800; source `whyChooseUs[3].body`). Lead `From the moment you call us, to the day you return home with a heart full of duas.` (adapted from `about.story[1]`, Manrope 18 px, text-body).
- **1440:** the title card spans columns 1–5. Columns 6–12 hold a 3×2 **hairline lattice** (pattern 11: `gap:1px` over gold-hairline, cells on white, 32 px padding). Each cell has a 24 px gold-500 line icon inside a 40 px orbit-ring motif, the label (Manrope 600, 16 px, ink) and the sublabel (14 px, text-muted). Data is `services[]`: Visa Processing / 100% approval rate, Flights / Economy & Business, Hotels / 4★ & 5★ near Haram, Transport / Private AC coaches, Local Guide / Urdu-speaking, Food / Halal Pak & Arabic. Above the lattice, across columns 1–12, runs **the swoosh**: one open SVG path, 1.5 px gold-500, rising left to right.
- **375:** the numeral drops to 96 px and the title card is full width. The lattice becomes 2×3 (cells 171 px). The swoosh sits under the heading at 343 px wide.
- **Motion (one idea): the swoosh flight.** DrawSVG 0→100 % scrubbed from `top 80%` to `bottom 60%` (`scrub:0.6`). The KU aircraft rides it on MotionPath with `autoRotate`, so the plane leaves Lahore as you scroll. Reduced motion: drawn and static, with the plane at the end. The lattice itself uses T2 (600 ms `power3.out`, stagger .08), which is the grid's default and needs no choreography.
- **Mini CTA (bottom of columns 1–5 / full width at 375):** WhatsApp text button `Start with a message →` (`wa('general')`) and the caption `Visa, flights, hotels and transport, arranged by one team.` (12 px, text-muted).

### 2.4 Chapter I, continued: packages preview (`#packages-preview`), surface paper

- **Purpose:** conversion. Departure is where you choose how you travel.
- **Heading:** SectionHeading, left-aligned. Eyebrow `CHOOSE YOUR KARWAN`, H2 `Packages Crafted for Every Family`, subtext `Economy comfort to VIP indulgence — every package is built around the Haram experience.` (existing Home copy). I drop the current `اَلْحَمْدُ لِلَّهِ` kicker here, because it is decorative piety above a price grid.
- **1440:** `PackagesGrid featured limit={3}` from live data (production has only 2, so the `:has()` collapse centres 2 × 380 px). Cards follow §4.6. Below them sits the grid-level trust line: `Prices per person · confirmed in writing before you pay` (from `whyChooseUs[2]`: "every cost is explained upfront, in writing"), plus the licence slot `DTS Licence No. [owner to supply] · IATA [owner to supply]`, which renders **only** when the fields exist.
- **375:** one column. Cards are 343 px wide, with the next card's edge visible.
- **Motion (one idea):** T2 batch, `y 24`, 600 ms `power3.out`, stagger .08, `top 85%`.
- **Mini CTA:** primary green-800 `See all packages` → `/packages` + WhatsApp ghost `Ask which package fits`.

### 2.5 Chapters II and III, Makkah → Madinah (the one pin), surface ivory `#f6f2ea`

- **Purpose:** the emotional centre. The page holds still while the city changes.
- **Surface:** paper → ivory scrubbed crossfade (`top 75%`→`top 40%`). A light-to-light shift only, so rule 2 holds.
- **1440 (pinned, `end:'+=150%'`, desktop ≥1024 px, motion-OK, not Save-Data; pattern 9, soralabs reimplemented):** a 100vh stage.
  - **Left, columns 1–5:** a chapter title card that swaps:
    - `II` / eyebrow `CHAPTER II · MAKKAH AL-MUKARRAMAH` / Arabic `مكة المكرمة` (Plex 500, 24 px, green-700, `lang="ar"`) / H2 `Where the journey of every Muslim heart begins` / body from `sanctuaries[0].body`.
    - then `III` / `CHAPTER III · MADINAH AL-MUNAWWARAH` / `المدينة المنورة` / H2 `The radiant city of the Prophet ﷺ` / `sanctuaries[1].body`.
  - **Right, columns 6–12:** a 620×720 image in the **dome-arch mask** (`border-radius:50% 50% 0 0/36% 36% 0 0`) with the 1 px gold-hairline outline offset 6 px. Makkah is `keu/makkah/masjid-al-haram`, Madinah is `keu/madinah/prophets-mosque`. No type touches either image. A vertical 1 px gold hairline at the far left edge acts as chapter progress.
- **375 (no pin):** two stacked blocks, each with title card, then a 343×400 dome-arch image, then body and mini CTA.
- **Motion (one idea): the image wipe.** Progress 0–.40 holds Makkah. From .40 to .62 the Madinah image rises inside the arch (`clipPath inset(100% 0 0 0)→inset(0)`, inner scale 1.12→1). The timeline segment uses `power2.inOut` (ease-band) under the scrub. Makkah's text exits `yPercent −110` behind its line masks while Madinah's enters `110→0`. Arabic lines move as whole lines and are never split. The numeral crossfades `II`→`III`. From .62 to 1 Madinah holds. On mobile each image uses the T3 curtain (1200 ms `expo.out`). Reduced motion: no pin, the stacked mobile layout, visible immediately.
- **Mini CTAs (one per chapter):** Makkah, `See Umrah packages →` (`/packages`, umrah filter). Madinah, `Ask about ziyarah on WhatsApp →` (`wa('general')`). Inside the pin only the active chapter's CTA is focusable, and the other gets `inert`.

### 2.6 Chapter IV, Return: "Home, with a heart full of duas", surface paper

- **Purpose:** proof. You come back, and others came back before you.
- **Title card:** `IV` / `CHAPTER IV · RETURN` / H2 `Home, with a heart full of duas.` (phrase from `about.story[1]`) / lead `We do not see our pilgrims as customers — we see them as Mehmaan-e-Khuda, the guests of Allah.` (`about.story[3]`).
- **1440:** columns 1–4 hold the title card. Columns 5–12 hold a 4-cell hairline row of stats from `stats[]`: `18+ Years of Service` **[owner to confirm: 2005→2026 is 21]**, `25,000+ Pilgrims Served`, `15+ Partner Hotels`, `100% Visa Success Rate`. Numerals are Cormorant 500 at 64 px, green-800, `tnum`, with labels at 12 px tracked. Below sit testimonials in three columns separated by 1 px gold-hairline verticals (`rialto-07-shared-vision.jpg` rhythm). Each has the quote in Cormorant italic 22 px, then name · location · trip in 12 px gold-800. **Render `site.testimonials` from the DB as-is. The design never types a name.**
- **375:** stats in a 2×2 grid. Testimonials become a horizontal scroll-snap row (85 % card width), no autoplay.
- **Motion (one idea): counters.** 1.6 s `power3.out`, `tnum`, run once at `top 80%`. Testimonials use the plain block reveal (750 ms `power3.out`, y 32), the Rialto homage, which needs no extra choreography.
- **Mini CTA:** `Speak to the team on WhatsApp →`.

### 2.7 FAQ (`#faq`), surface ivory

- **1440:** columns 1–4 hold SectionHeading (`QUESTIONS` / H2 `Before you travel`). Columns 5–12 hold the native `<details>` accordion with 1 px gold-hairline separators, question in Manrope 600 18 px and a `+` that rotates 45°. **The live FAQ copy contradicts the packages (gap-1 §1.1). The owner must re-save the copy before launch.**
- **375:** heading on top, accordion full width.
- **Motion:** grid-row 0fr→1fr, 450 ms `power3.out`. Only the answer moves.
- **Mini CTA:** `Didn't find your answer? Ask on WhatsApp →`.

### 2.8 Epilogue: closing card, surface paper (lifts off the footer)

- **1440:** centred, 64 vh. The motto `Faith × Journey × Together` in Cormorant 500 at 72 px, green-800, with each `×` in gold-600 (display ≥24 px, so allowed). Under it, the orbit-ring divider (`stroke-dasharray="44 21 272 23"`, 1.5 px). Then the multi-target WhatsApp row (pattern 6): three equal outlined chips `Umrah`, `Hajj`, `Qafila e Shoq`, which map to `wa('umrah')`, `wa('hajj')` and a new `wa('qafila')` key. A single filled WhatsApp button `Chat on WhatsApp` sits below them.
- **375:** motto at 40 px across 3 lines, chips stacked full width.
- **Motion (one idea): the curtain lift.** This section is the sticky "billboard" lid (pattern 15). Its bottom edge carries the sweep, and as you scroll it slides up to reveal the fixed footer underneath. The ring divider draws once (T0, 800 ms `power2.inOut`).

### 2.9 Footer. See §4.3.

**Surface sequence:** dark (hero) → paper → paper → ivory (pin) → paper → ivory → paper → green band. No two dark surfaces touch.

---

## 3. Inner pages (shorter)

Each inner page opens on the **PageHeader** (§4.5). A route enters through the bands, never through a second video.

**Packages (`/packages`)**
1. PageHeader: eyebrow `OUR PACKAGES`, H1 `Hajj & Umrah, the way it should be.`, sub `Filter by category — every package is fully transparent and inclusive.` Image `keu/makkah/kaaba`, framed and never overlaid.
2. Filter chips (All / Umrah / Hajj / Ramadan / Family, from `FILTERS`). The active chip is green-800 filled at 36 px. The grid reorders with GSAP Flip, 600 ms `power3.inOut` (ease-glide).
3. Grid (§4.6) + trust line + licence slot **[owner to supply]**. The grid-level footnote `Prices per person` sits under it.
4. **Qafila e Shoq, the site's one dark chapter.** The bg-stage crossfades paper → green-950. Seal retraced on dark (pending the owner's consent, Q5). Endorsement line `A spiritual journey by Karwan e Usmania International`. Then `قافلہ شوق` in Noto Nastaliq (lazy, line-height 2.1) and `A Sacred Caravan of Devotion`. Leader: `Pirzada Burhan uddin Ahmed Usmani Sahib · Islamic Scholar`, with a dome-arch photo **[owner to supply, or name plate only]**. The four pillars sit in a hairline lattice on dark (gold-500 lines), with the Urdu word above each English title. Motion: pillar headings use line masks (900 ms `power4.out`). CTA `Apply via WhatsApp` (`wa('qafila')`), plus the caption `Seats are limited and by application only.` (from the FAQ).
5. FAQ on paper. 6. Footer.

**About (`/about`)**
PageHeader (`ABOUT US` / `A Karwan rooted in service.` / Madinah image) → Our Story: four `about.story` paragraphs in columns 1–6 with block reveals; columns 8–12 hold the story image in a dome arch with a T3 curtain → Why Choose Us: the 4-cell hairline bento from `whyChooseUs[]` → Team: render `site.team` from the DB (7 people live). The chairman gets a large dome-arch portrait and the others sit in a 3-up grid with name + role. → closing CTA `Speak to the team on WhatsApp`.

**Gallery (`/gallery`)**
PageHeader (`GALLERY` / `Glimpses from the Haramain.`). I drop the subtitle "shared by our pilgrims" until the owner confirms where the photos come from **[owner to supply]**. Masonry of `gallery[]` honouring `size: wide|tall`: 12-col spans at 1440, 2 columns at 375. Motion: T3 curtains via `ScrollTrigger.batch`, stagger .08. A lightbox crossfades 350 ms `power3.out` on a green-950 overlay (an overlay, not a section). Captions come from `alt`. Mini CTA: `Plan your own journey →` WhatsApp.

**Contact (`/contact`)**
PageHeader (`CONTACT` / `We are here to help`, followed by `السلام علیکم` set separately with `lang="ur"` and loaded in the Arabic face) → two columns at 1440 (5/7), stacked at 375. This replaces the unresponsive inline grid at `Contact.jsx:45`.
- **Left: contact card.** WhatsApp primary at the top: **number [owner to confirm, Q1]**. Then landline `+92 42 35136177`, mobile `+92 333 4883578`, email `keusmania@gmail.com`, address `Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town, Lahore`, postcode **[owner to supply]**, hours `Mon – Sat 9:00 am – 7:00 pm · Sunday 11:00 am – 4:00 pm`.
- **Right: form** (§4.8).
- Map iframe repointed to Johar Town, full width, image radius 0, with a 1 px hairline frame.

---

## 4. Global components

**4.1 Nav.** It sits transparent over the hero: lockup SVG (KU mark 40 px + Cinzel wordmark in on-dark), links centred (Home, Packages, About, Gallery, Contact; Manrope 500 13 px, .08 em), and on the right the WhatsApp button with the inline `بک کریں` in the Arabic face. After 80 px a background layer fades to paper at .96 with a 1 px gold-hairline bottom edge, and the bar shrinks 80→64 px through `scaleY` over 350 ms `power3.out`. The text flips to green-800. Link hover is a 1 px gold-500 underline `scaleX` over 300 ms. It never hides on scroll. The blur (`backdrop-filter: blur(12px)`) applies only while over the hero, which is the one allowed glass.

**4.2 Mobile menu.** A fullscreen green-950 panel opened with a polygon wipe from the top-right (pattern 8), 900 ms `power4.inOut`. Links are Cormorant 40 px on-dark, each with a numeral (`01`–`05`, Manrope 11 px gold-300). They arrive with T1 stagger .08 after 450 ms. The bottom of the panel holds the WhatsApp full-width button, the phone and the motto. `main` gets `inert`, focus is trapped, and Esc closes it. Reduced motion: an opacity crossfade of 200 ms.

**4.3 Footer (letterhead sweep).** A green band (`#164a31 → #083820` gradient, geometric pattern at 4 % white). The top edge is the sweep SVG with the champagne ribbon, which draws once at 1200 ms `power2.inOut`. Fixed under the epilogue lid (§2.8), it is revealed by scroll. At 1440, four columns:
- the lockup in solid gold-300, the Arabic line, and the motto `FAITH × JOURNEY × TOGETHER` (11 px, .3 em)
- links
- contact (as Contact page, numbers per Q1)
- socials (Facebook, Instagram, YouTube, TikTok; handles per the live DB)
At 375 the columns stack, with a 56 px tap-height row per link. The KU watermark sits at 6 % bottom-right. The bottom bar reads `© 2026 Karwan e Usmania International · Travel & Tours`, with the domain per Q2.

**4.4 WhatsApp FAB.** A 56 px circle, `#25d366` with a green-950 glyph, bottom-right at 24 px (16 px at 375), above the safe area. It is hidden while the hero CTA is in view, then fades in with T1. It is magnetic on `pointer:fine` (`quickTo` .45 s `power3.out`, ±12 px, no elastic) and has no idle pulse. Long-press or hover shows a label `Chat on WhatsApp`. It stays above the route bands (z 110), so WhatsApp is reachable even mid-transition.

**4.5 PageHeader.** 60vh max, paper, and **no type over the image**, because footage etiquette forbids text on the Kaaba and Green Dome. At 1440: columns 1–6 hold the eyebrow, H1 (Cormorant 500, 56 px) and subtitle. Columns 7–12 hold the image in a 20 px-inset frame (Rialto inset, `rialto-04-aerial-video-chapter.jpg`) with a 1 px hairline. The top-left carries the letterhead corner device (green quarter-ellipse + ribbon, max 22 vw, hidden below 480 px). At 375 the text comes first, then the image at 16:10 full width. Motion: the image T3 curtain (1200 ms `expo.out`) begins as the route bands finish revealing, while the H1 uses the 500 ms GSAP opacity + y12 entry.

**4.6 PackageCard anatomy** (gap-1 §4, existing fields only, identical in the 360 px admin preview). White card, 1 px gold-hairline border, radius 8 px, padding 24 px (20 px at 375), no gold top bar and no pattern.
1. Eyebrow row: `{TIER} · {CATEGORY}` (gold-800, 11 px, .18 em). On the right, the `badge.trim()` pill (1 px gold-hairline, 11 px, not absolutely positioned).
2. `name`: Cormorant 500, 28 px (24 at 375), green-800, max 2 lines.
3. Meta: `{nights} nights · {subtitle}` (nights only if > 0). 14 px text-body, 1 line at 375.
4. Price: `priceLabel` in Cormorant 500, 36 px (30 at 375), ink, `tnum`. Under it, `per person` only if `perPerson !== false && !isOnRequest`. On request (`!/\d/.test(priceLabel)`) the price becomes `Price on request` at 24 px, with `Government quota · seats confirmed on application` for Hajj. `price` is never read.
5. 1 px hairline.
6. Inclusions: trimmed, keyword→icon from `icons.jsx` (fallback `check`). Show 6 at desktop and 4 at 375, then `+N more`.
7. Summary: line-clamped to 4 lines (3 at 375), then native `<details>` `Full package details` with `white-space: pre-line`.
8. CTA: `Book on WhatsApp` (`Enquire on WhatsApp` when on request), full width, 48 px, WhatsApp-filled, `href = wa(pkg.id)`. `margin-top:auto` gives equal heights.
- `tier === 'vip'` gets the dark variant (green-950 field, gold-500 hairline, on-dark text, gold-200 eyebrow). The `featured` flag is never used for emphasis.
- Hover: lift −4 px over 250 ms `power3.out`, shadow on `::after` (opacity only), border → gold-500. No image, so nothing scales.
- Never build anchors from `id`; slugify in code.

**4.7 SectionHeading.** Eyebrow (gold-800 on paper / gold-300 on dark, 11–12 px, .24 em) → H2 (Cormorant 500, 48 px / 32 px at 375, green-800, `.section-heading__title` kept for speakable) → optional subtext (Manrope 18 px, max 56 ch). Optional Arabic/Urdu kicker *above* the eyebrow, appearing only where the copy is sourced. The H2 reveal is a SplitText lines mask, `yPercent 110→0`, 900 ms `power4.out`, stagger .08, never applied to `:lang(ar|ur)`. Under it, a 48 px gold hairline that draws (T0).

**4.8 Buttons and forms.**
- **Buttons.** Primary: green-800, white label. Ghost on paper: 1 px green-800. On dark: filled `#f4f1ea` with a green-950 label, or a gold-300 ghost. WhatsApp: `#25d366` with a green-950 label. Text: green-600 with a `→` that nudges 4 px. All are 48 px tall, radius 2 px, labels Manrope 600 12 px uppercase .185em. Hover takes 250 ms. Primary CTAs are magnetic on `pointer:fine` only. No gold buttons.
- **Forms.** Fields are Full Name, Phone, Email, Package Interest, Preferred Contact and Message, plus the honeypot, unchanged. Labels sit above in 12 px .12 em text-muted. Inputs are 52 px on white, with a 1 px `#d9d4c8` border that turns into a green-800 1.5 px bottom rule on focus over 250 ms, plus a 2 px focus ring offset. Errors show in green-950 text with an icon (never red-on-gold). Submit is primary green. The success state draws the orbit ring once and says `JazakAllah Khair, we will reply on your preferred channel.`. Package options are generated from live `packages`, not the hard-coded list, which still shows "Hajj 2025–2027".

---

## 5. Preloader and route transition, as staged

**Preloader (inlined in `index.html`, `sessionStorage.keuIntro`):**
| t (ms) | Beat | Spec |
|---|---|---|
| 0 | Green-950 field, KU mark at 96 px centred, invisible | Paints before React |
| 80→1080 | Orbit ring draws in gold-500 | DrawSVG, `power2.inOut` |
| 300→1100 | Swoosh draws | same |
| 500→1100 | K, U, Kaaba fill wipe | `clip-path inset`, `power2.inOut` |
| 1000→1200 | Aircraft arrives | `autoAlpha`, x −6→0, rotate −8→0, `power3.out` |
| 0→gate | Counter `00→99`, 12 px Manrope `tnum`, gold-300 at .7, 28 px under the mark | Edolus odometer (`edolus-02-logo-counter.jpg`), fed by fonts + draw, parks at 99 |
| gate = max(1200, drawn, fonts), cap 2200 | Counter hits 100, then a 120 ms held beat | the Edolus "breath" |
| G→G+800 | Two bands split at the mark's midline, top `yPercent −100` and bottom `+100`, each inner edge with a 1 px gold-500 hairline | `power2.inOut` |
| G+200→G+1000 | KU mark FLIPs to `.nav__logo-img` | `Flip.fit`, `power3.inOut`, same-pixel swap |
| G+300→ | Hero settle + T1 copy | §2.1 |

The H1 is painted under the bands the whole time, which keeps LCP honest. Low-end: no counter, cap 1200. Save-Data and reduced motion: no preloader. Non-home deep link: the ≤900 ms replay (mark only, then bands).

**Route transition (deferred `displayLocation`):**
- **Cover** (600 ms `expo.inOut`): two green-950 bands close from top and bottom, each leading edge carrying a 1 px gold-500 hairline that meets at the midline.
- **Covered hold** (120–400 ms): the static 32 px KU mark at centre, with the **destination name** under it (`PACKAGES`, Manrope 11 px .28 em, gold-300). This is the Edolus HUD caption. Under cover: `lenis.stop()` → `jumpTo(0)` → swap → `ScrollTrigger.refresh()` → `lenis.start()`.
- **Reveal** (700 ms `expo.inOut`): the bands part. The PageHeader image curtain starts at 60 % of the reveal, so the two movements overlap and read as one cut.
- Nav persists above (z 100 vs 90). Back/forward: 450 ms each way. Same-page hash: none. Reduced motion: a 200 ms crossfade. Focus moves to `#main-content`, with the title announced through `aria-live`.

---

## 6. What I deliberately do NOT do

- No second video anywhere. Makkah and Madinah are stills inside the pin. One film per site keeps it precious (and keeps the 3.7 MB budget).
- No pin on the hero, and no second pin. The Makkah→Madinah hinge is the only one, desktop only.
- No text over the Kaaba or the Green Dome, including PageHeaders. That is why PageHeaders are split rather than overlaid.
- No scramble or decrypt text, no chromatic aberration, no grain, no WebGL, no custom cursor, even though Edolus does all of them (`edolus-04-hero-cta.jpg`). The HUD *typography* is borrowed, not the glitch.
- No character splitting of Arabic or Urdu, and no tracking on them.
- No gold fills, gold buttons or gradient text. The numerals are outlined in gold hairline, not filled.
- No dark chapter on Home besides the hero. The "chapters" are cinematic through editing, not through darkness.
- No autoplaying carousels or marquees. The motto is set still and large.
- No invented facts: licence numbers, postcode, Qafila dates, the WhatsApp number and the leader photo are slots marked [owner to supply].
- No Ken Burns, zoom-punches or reversed crowd clips on worship footage.

---

## 7. Risks of this direction

1. **Chapter framing can read as long.** Four title cards plus the pin add about 150vh. Mitigation: packages sit inside Chapter I (the 2nd scroll screen), the chapter index in the hero lets people jump, and the nav WhatsApp and FAB are always visible. The ship gate is that time-to-first-package-card at p50 scroll must not exceed the current site's.
2. **The pin is fragile.** iOS address-bar resize, Lenis/ScrollTrigger sync, and late-loading Cloudinary images shifting start/end. Mitigation: desktop only, `ignoreMobileResize`, `refresh()` on image load, and a fixed-aspect image box.
3. **Outlined numerals** at a 1 px stroke may shimmer on low-DPI Windows screens. The fallback is solid gold-600 at 160 px (allowed as display ≥24 px).
4. **The motion budget stacks:** preloader + bands + FLIP + settle is 2.0–3.0 s to an interactive hero. If p75 `keu:hero-revealed` exceeds 3.0 s on mobile, cut the counter first, then the FLIP.
5. **Dependence on blocking assets:** the 4-layer KU SVG trace (preloader, nav, swoosh flight, ring), the Qafila retrace and the 1920 px poster. Without the SVG the whole Edolus layer degrades to the conic-mask fallback.
6. **Arabic/Urdu city names and the tagline spelling** need owner review (Q3). The sanctuary Arabic is standard but still unconfirmed by the owner.
7. **Live content can undercut the film.** The stale DB name and tagline, the contradictory FAQ, the "Bumber Offer" badge and the 488-char summaries will sit inside a premium frame. The design clamps and contains them, but the owner must re-save `/admin/company` and the FAQ before launch.

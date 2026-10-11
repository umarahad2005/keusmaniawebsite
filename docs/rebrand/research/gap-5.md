# Gap fill 5: Qafila e Shoq sub-brand and the dark chapter

Researcher: gap-5 · 2026-10-10. I read `BRIEF.md`, `brand.md` §1.2–1.6, §3.4, §4, `motion.md` §0, §7, §11, `craftbar.md` §7–8, `codebase.md` (Qafila rows, §5.5), and the repo files listed in §2. **I modified nothing in the repo.** My scripts and test renders are in `scratchpad/tools/gap5/`: `sample.cjs`, `fam.cjs`, `de.cjs`, `knock.cjs`, `rows.cjs`, and the PNGs `qafila-on-white.png`, `qafila-on-green950.png`, `knock-on-green950.png`, `crop-center.png` and `crop-urdu.png`. They use sharp 0.33.5 from `keu-website/node_modules/sharp`.

---

## 0. Headline findings

1. **The Qafila logo is not transparent.** `public/qafila-logo.png` has an alpha channel, but every pixel is alpha 255. It has a solid white field: 68.2 % of pixels are exactly `#ffffff`, the corners are `[255,255,255,255]`, and sharp `stats().isOpaque = true`. On any dark chapter it renders as a **white square tile** (see `tools/gap5/qafila-on-green950.png`). It looks fine today only because the current card is white.
2. **Two colours clash with KEUI, and one disappears.**
   - The logo gold `#f8c347` is a lighter, yellower gold than the KEUI primary `#e0a028` (ΔE2000 9.3, a visible difference side by side). Its nearest token is gold-300 `#e9c266` (ΔE 4.8).
   - The Green Dome `#0c8544` is a bright kelly green, ΔE 20.5 from green-800 `#004828`. On green-800 it reaches only 2.28 : 1.
   - The Kaaba ink `#151714` is invisible on green-950 (1.08 : 1).
3. **The logo is a soft, upscaled-looking raster.** It has blurred edges, blobby dots, a baked-in grey drop shadow (6.4 % of pixels are neutral grey) and 123,854 distinct colours. The 984,943-byte file is displayed at 120 px. A 480 px WebP is **16.4 KB** (a 98 % saving). A transparent knock-out at 480 px is **34.0 KB**.
4. **The logo's own Urdu lettering is not Nastaliq.** "قافلہ شوق" is set in heavy, upright, flat-baseline display calligraphy with a long swash on the ق of شوق. The site then repeats the same words directly underneath in **Amiri (Naskh)**. That gives two different non-Nastaliq renderings of one name, stacked. Urdu readers expect Nastaliq for the live title, and brand.md §3.4 already picks **Gulzar**.
5. **The CTA does not use a "qafila" WhatsApp key.** `QafilaSection.jsx:43` calls `wa('general', q.waMessage)`. The custom text wins, so the key is ignored. `buildMessages()` in `src/lib/whatsapp.js` never creates a `qafila` key. The button label is "Enquire on WhatsApp", which reads as an enquiry, not an application.
6. **No date, place-count or how-to-apply fields exist.** The data has no dates, number of places, departure city, duration or status. The only scarcity signal is the hard-coded string `Limited seats · By application only` (`QafilaSection.jsx:47`).
7. **The admin has no editor for `site.qafila`.** `App.jsx:70–72` routes `AdminGeneric` only for sanctuaries, whyChooseUs and faqs. Because every admin editor writes back `{ ...site, X }` (codebase.md line 22), **new optional fields added to `site.qafila` survive admin saves**. They can be added in `data.js` without touching the admin, as long as the component renders nothing when a field is absent.

---

## 1. The logo, sampled (`public/qafila-logo.png`)

### 1.1 File facts

| Property | Value | Evidence |
|---|---|---|
| Dimensions | 1563 × 1563 px, sRGB, 8-bit, 4 channels, density metadata 300 dpi | `sharp().metadata()` |
| Size on disk | 984,943 bytes | `ls -la` |
| Transparency | **None in practice.** Alpha min = max = 255. 0.0 % transparent, 0.00 % semi-transparent | `stats()`, raw scan |
| Background | `#ffffff` (68.2 % of all pixels), plus 2.4 % near-white anti-alias halo | `fam.cjs` |
| Artwork bounding box | x 49–1468, y 6–1562. **The wordmark swash touches the bottom edge** (zero bottom clear space) and nearly touches the left edge (49 px) | `fam.cjs` |
| Emblem / wordmark separation | **No blank row** between the frame and the lettering: the frame's bottom tip drops into the text band. A clean rectangular crop to "emblem only" is impossible without masking or retracing | `rows.cjs` (only blank run: rows 0–7) |
| Distinct colours | 123,854 (photographic, not flat vector) | `fam.cjs` |

### 1.2 Composition and typography (observed in `qafila-on-white.png` and the crops)

- **Frame:** an interlaced gold square-in-diamond star (an 8-point khatam-like knot) with four crossed bars protruding at the diagonals. Small slot cut-outs sit along each bar. It reads as a flat gold ribbon with a soft grey drop shadow.
- **Centre window:** a white square inside the frame holding a small illustration: a white minaret on the left, **the Green Dome** (Masjid an-Nabawi) in front, and **the Kaaba** (black, with a gold band and orange-gold kiswah highlights) behind it on the right. Edges are smeared, consistent with AI or bicubic upscaling. Calling it "upscaled" is my inference; I cannot verify its origin.
- **Wordmark:** "قافلہ شوق" in gold beneath the frame, about 17.5 % of the logo height (rows ≈ 1290–1563). The letterforms are heavy, low-contrast and upright on a flat horizontal baseline. The words are not cascaded diagonally, so this is **not Nastaliq**. It is closer to a Naskh/Thuluth-derived display hand, though I cannot name the face. The tail of the final ق in شوق runs left along the baseline as a long swash to x ≈ 50. The dots are blobby, and the letters carry the same grey drop shadow.
- **No Latin text** appears in the logo. **No KEUI mark or name** appears either: it has no endorsement.

### 1.3 Dominant colours (opaque pixels; 5-bit bins, then per-family medians)

| Family | Share of pixels | Median | p10 / p90 | LCH |
|---|---|---|---|---|
| White field | 71.7 % | `#ffffff` | — | — |
| Gold (frame + lettering) | 17.4 % | **`#f8c347`** | `#f0be41` / `#fed25e` | L82 C67 h84 |
| Grey (drop shadow, minaret shading) | 6.4 % | `#a0a0a0`–`#e8e8e8` ramp | — | neutral |
| Ink (Kaaba) | 2.1 % | **`#151714`** | `#0a0b0a` / `#28251e` | L7 C2 |
| Green (dome) | 1.7 % | **`#0c8544`** | `#078040` / `#0e8847` | L49 C53 h150 |
| Orange/red (kiswah highlights, dome finial) | ≈ 0.7 % | ≈ `#f0a030`–`#e08020` (bins, not medianed) | — | — |

### 1.4 Clash check against KEUI tokens (brand.md §1.2–1.3)

ΔE2000 and WCAG contrast were computed in `de.cjs`.

| Qafila colour | vs KEUI token | ΔE2000 | Verdict |
|---|---|---|---|
| Gold `#f8c347` | **gold-500 `#e0a028`** (primary) | **9.3** | **Clash.** Clearly lighter and more lemon (L82 vs L70, hue 84° vs 78°). Next to gold-500 hairlines or buttons it reads as a second, cheaper gold. |
| Gold `#f8c347` | gold-400 `#f0b030` | 5.2 | Close. Acceptable when not adjacent. |
| Gold `#f8c347` | gold-300 `#e9c266` | **4.8** | Nearest token. On a dark chapter, use gold-300 for neighbouring eyebrows and rules so the logo sits in one gold family. |
| Gold `#f8c347` | **gold-800 `#885800`** | **35.2** | Unrelated (different lightness world). Never place the logo next to gold-800 text on paper. Gold on paper is 1.57 : 1 anyway. |
| Green `#0c8544` | **green-800 `#004828`** | **20.5** | **Clash.** Kelly green against deep emerald. Contrast is 2.28 : 1 on green-800 and 3.54 : 1 on green-950, so the dome reads as a bright, foreign green on our dark surface. |
| Green `#0c8544` | green-500 `#20784d` | 6.2 | Nearest token. |
| Ink `#151714` | green-950 `#00240f` | — | **Disappears** (1.08 : 1). It is only visible because it sits inside the white window. |
| Gold `#f8c347` | green-950 / green-800 | — | 10.23 / 6.58 : 1. The gold itself is fine on dark. |

**Conclusion:** gold-500 and green-800 are where the clash sits. On a dark chapter, the gold frame and lettering work (10.2 : 1 on green-950). The white window has to stay, or the Kaaba and dome vanish, and the dome stays a brighter green than the brand.

### 1.5 Knock-out test

`knock.cjs` flood-fills the white from the canvas edges (threshold 60, soft alpha ramp). It removes **63.8 %** of the canvas and **keeps the white centre window**, because the frame encloses it.

On green-950 (`knock-on-green950.png`) the result is usable as an interim asset. The frame and lettering float in gold, and the illustration sits in a lit white window. Faint grey drop-shadow halos remain around the gold, so a proper fix is a retrace (§4.6). The 480 px WebP with alpha is 34,032 B.

---

## 2. Current implementation inventory

### 2.1 `src/components/QafilaSection.jsx` (52 lines)

Render order (all from `site.qafila` via `useSite()`; returns `null` if absent):

| # | Element | Class | Field |
|---|---|---|---|
| 1 | `<section id="qafila">` | `section qafila-section` | — (anchor `#qafila` must be kept) |
| 2 | `<img>` logo, `loading="lazy" decoding="async"`, **no width/height attributes** | `.qafila-card__logo` | `q.logo` (alt = `q.name`) |
| 3 | Urdu tagline, `lang="ur"` (no `dir` attribute; CSS sets `direction: rtl`) | `.qafila-card__urdu` | `q.urduTagline` |
| 4 | `<h2>` | `.qafila-card__title` | `q.name` |
| 5 | Gold badge | `.badge.badge--gold` | `q.tagline` |
| 6 | Leader line: `<strong>` name + muted " · title" | `.qafila-card__leader` | `q.leader`, `q.leaderTitle` |
| 7 | Lead paragraph | `.lead` | `q.intro` |
| 8 | Muted paragraph | `.muted` | `q.body` |
| 9 | 4 × `<article>`: icon (`aria-hidden`), Urdu word, `<h3>`, body | `.qafila-pillar*` | `p.icon`, `p.urdu`, `p.title`, `p.body` |
| 10 | CTA `<a class="btn btn--whatsapp btn--lg" target="_blank" rel="noopener">` **"Enquire on WhatsApp"** | `.qafila-card__footer` | `wa('general', q.waMessage)` |
| 11 | Microcopy, inline `style={{fontSize:'var(--text-sm)'}}`: "Limited seats · By application only" | — | hard-coded |

### 2.2 `src/data.js` 168–208: the `qafila` object

| Field | Value |
|---|---|
| `name` | `Qafila e Shoq` |
| `tagline` | `A Sacred Caravan of Devotion` |
| `urduTagline` | `قافلہ شوق` |
| `logo` | `/qafila-logo.png` |
| `leader` | `Pirzada Burhan uddin Ahmed Usmani Sahib` |
| `leaderTitle` | `Islamic Scholar` |
| `intro` | "Led under the guidance of Pirzada Burhan uddin Ahmed Usmani Sahib (Islamic Scholar), Qafila e Shoq is your path to spiritual growth, meaningful companionship, and unforgettable connection with the sacred." (Note: it repeats the leader line directly above it.) |
| `body` | "…more than a travel group — a transformative spiritual journey for seekers of closeness to Allah ﷻ… structured around four sacred pillars:" |
| `pillars[0]` | icon `crescent`, urdu `عبادت`, "Ibadah — Acts of Worship", body about collective prayers, tahajjud, dhikr circles |
| `pillars[1]` | icon `shield`, urdu `ریاضت`, "Riyazat — Spiritual Discipline", body about self-purification, routine, reflection |
| `pillars[2]` | icon `guide`, urdu `تربیت`, "Tarbiyat — Personal & Spiritual Development", body about daily sessions, lectures, mentorship |
| `pillars[3]` | icon `kaaba`, urdu `سیاحت`, "Siyahat — Sacred Travel & Reflection", body "not tourism — sacred exploration" |
| `waMessage` | "Assalamu Alaikum! I would like to know more about the Qafila e Shoq spiritual journey programme led by Pirzada Burhan uddin Ahmed Usmani Sahib." |

**Missing:** dates, departure city, duration, Makkah/Madinah split, number of places, status (open/waitlist/closed), application steps, leader photo, leader name in Urdu, and an `id`/key for WhatsApp.

### 2.3 WhatsApp wiring (`src/lib/whatsapp.js`)

- `useWaLink()` returns `(key='general', customText) => https://wa.me/${site.company.whatsapp}?text=…`. **`customText ?? messages[key] ?? messages.general`**.
- Message keys are built only from packages (`id`, `tier`, `category`). **No `qafila` key exists.** The current call `wa('general', q.waMessage)` works only because `customText` is supplied.
- The number comes from `site.company.whatsapp`, which in `data.js:14` is `'923314211935'`. That is the OLD number already flagged in codebase.md §5.5; the letterhead number is +92 333 4883578. Qafila applications inherit whatever that field holds.

### 2.4 `src/styles/components.css` 746–893

- `.qafila-section`: `--gradient-cream` background plus a `/patterns/geometric.svg` overlay at opacity .04, 320 px.
- `.qafila-card`: white, gold border `rgba(201,168,76,.2)`, radius `--radius-2xl`, padding 48/40, `--shadow-xl`. It has a **6 px gold gradient top bar** (`::before`) and a **blurred gold glow** behind it (`::after`, `blur(40px)`, opacity .18).
- `.qafila-card__logo`: 120 × 120 (96 × 96 at ≤640 px), `object-fit:contain`, navy drop-shadow `rgba(13,27,53,.15)`.
- `.qafila-card__urdu`: `--font-arabic` (**Amiri**), `--text-3xl`, `--color-gold-dark #a8872e`, `line-height:1`. **A line-height of 1 clips Nastaliq**, so it must change when the font switches.
- `.qafila-card__title`: Playfair, clamp(2rem, 4vw, 3rem), bold, navy-dark.
- `.qafila-pillars`: `auto-fit minmax(220px,1fr)`. `.qafila-pillar` has a cream gradient, gold border, radius-lg, and a hover lift of `translateY(-4px)` plus a gold shadow.
- `.qafila-pillar__icon`: a 56 px **gold gradient filled circle** with a navy icon. This breaks the craftbar rule "gold is a hairline, never a fill".
- `.qafila-pillar__urdu`: Amiri `--text-xl`, gold-dark.
- Dashed gold dividers above the body and above the footer.

All of this is navy, cream and gold, with heavy glow. None of it survives the rebrand.

---

## 3. Reference scan: scholar-led Umrah group pages

I fetched three UK pages, listed below. **I could not find any Pakistani operator web page for a named scholar-led group**: two searches returned only regulation news and generic package aggregators. My working assumption is that such groups in Pakistan circulate on Facebook, WhatsApp flyers and posters, but **I did not verify that**. One North American form came up in search; I read only the search summary, not the form itself.

| | Green Lane Masjid "Seerah Umrah Tour" (Birmingham) | BMC Umrah Caravan (Bradford Muslim College, Ticket Tailor) | BMHC "Heritage Umrah 2026" (Manchester) |
|---|---|---|---|
| URL | https://greenlanemasjid.org/seerah-umrah-tour | https://www.tickettailor.com/events/bradfordmuslimcollege/2265619 | https://bmhc.org.uk/heritage-umrah-2026/ |
| Limited places | An exact number in the FAQ: **"There are 38 places available. Once all places have been booked, registrations will close."** No counter. | "**Limited Seats**", "First come, first served" in the hero, and a closing callout "Limited seats available" | Banner "**LIMITED PLACES REMAINING!**" and "LIMITED PLACES – FIRST COME FIRST SERVED" |
| Application / booking | "**Book Now →**" repeated after almost every section, leading to the shop to choose a room type. A separate "Apply for Sponsorship →" form. | "Register", "**Secure Your Place**", "Ask a Question" (email), "Book Now". Three equal instalments due 1 Jul / 1 Sep / 1 Nov 2026 | A single "Book now:" Eventbrite link, plus phone and email |
| Dates | "19–29 November 2026", "10 Days". Timeline chips stacked as "THU / 19 / NOV". Hotels as "Check in 19/11 · Check out 24/11" | "Mon 30 Nov – Sat 12 Dec 2026", "12 Days" | "Departure: Fri 23rd Oct 2026", "Return: Sun 1st Nov 2026" |
| Leader | **A photo slot** above the name. Title "Religious Guide". Honorific "**Shaykh**" (used inconsistently, with "Sheikh" in the bio). A separate "Group Lead" with a photo, no honorific, first-person bio | **No photos, no bios.** "Led by **Shaykh** Sa'ad Al Attas and **Shaykh** Abdul Rahim Reasat, joined by **Hafiz** Ehsan Tahir and Ismail Hussain" | **No photo.** "Guided by **Ustadh** Shafiq Siddiq", in the highlights list |
| Itinerary | A five-stop timeline: Departure → Makkah → Travel to Madinah → Madinah → Return (not every day). Hotels in a separate block | No day-by-day. "6 days Makkah / 6 days Madinah", Jumu'ah in both | A bulleted list: "5 Nights Madinah – Al Manakha Rotana", "4 Nights Makkah – Hilton Suites", Haramain train, pre-Umrah seminar |
| Price | Per person by room, descending: £1,845 double, £1,625 triple, £1,500 quad | Per person by room: £1,750 quad, £1,875 triple, £2,125 double | "From ONLY £1,760 per person" |
| Section order | Hero → summary/inclusions → prices → slogan + CTA → timeline → flights → hotels → **Meet the Team** → icon grid → FAQ → contact (incl. WhatsApp) → sponsorship → footer | Title/dates/Register → description + CTAs → image → highlights (12 Days · 5★ · Limited Seats) → overview → inclusions → prices/plan → notes (refunds, mahram) → FAQ → limited callout + Book Now | Headline + limited banner → intro → highlights → photos → dates → price → limited warning → book link → closing dua-like line |

Also from search only (not fetched): a Madania Umrah Nov 2026 Google Form (North America) listing several "Sheikh/Mufti" scholars, tentative dates 14–28 Nov 2026, and a quad price. It is a true *application form* asking for passport details. Source: https://docs.google.com/forms/d/e/1FAIpQLSdmWnVpyGf1x8C5SLOYwdZ5uhNJR_RDuDjdFyA720cAzP2yGQ/viewform

**Patterns to take:**
- **Honorific before the name, title after it**, written in the community's own spelling ("Shaykh", "Ustadh", "Hafiz"). For KEUI the owner's string is "Pirzada … Sahib", with "Sahib" as a trailing honorific. Render it exactly as supplied. **Do not add** "Hazrat", "Dr." or "Mufti" unless the owner confirms.
- **Photos are optional.** One of the three uses a portrait; two use name only. Default to a name plate and allow an optional `leaderPhoto`.
- **State scarcity as a fact, not a countdown.** Green Lane's exact "38 places … registrations will close" is the most dignified wording. Never write "only 3 left!" unless it is true and kept up to date.
- **Show dates as a departure/return pair plus duration**, and show the itinerary as a city split (Makkah n nights / Madinah n nights) rather than a day-by-day plan.
- **Repeat one CTA**, with one secondary "ask a question" path.

---

## 4. Proposal

### 4.1 Endorsed sub-brand, not a separate identity

**Decision: an endorsed sub-brand.** The name is "**Qafila e Shoq**", with the line "**A spiritual journey by Karwan e Usmania International**" beneath it.

Why:
1. **Trust transfer.** Buyers are paying a Lahore operator for a scholar-led trip. KEUI's verifiable facts (since 2005, 25,000+ pilgrims, 100 % visa success) are the guarantee, and the logo carries no KEUI mark.
2. **Its own logo is visually incompatible**: it uses lemon gold, kelly green and a white tile. A separate identity would need its own palette, type and pages, which this site has no room for.
3. The brief lists Qafila as a core offer *of KEUI*, sold through the same WhatsApp.

The sub-brand gets **three private assets**, and nothing else changes:
- its seal (the Qafila logo);
- a Nastaliq display title;
- the one dark chapter.

Everything else (Manrope body, Cormorant display, gold-hairline rules, buttons, spacing) is the house system.

### 4.2 Surface: dark, and it is the site's one dark chapter

- **Where:** `/packages`, `section#qafila`. The Packages order is PageHeader (still image) → grid (paper) → **Qafila (dark)** → FAQ (paper) → footer (green band). The dark chapter never touches the footer or another dark band, which satisfies craftbar rule 2: "never two dark sections adjacent".
- **Home:** if Qafila appears on Home (a hero hover word or a teaser), it is a **paper** card linking to `/packages#qafila`. It is not a second dark chapter.
- **Tokens:** wrap the section in `data-theme="dark"` (brand.md §1.5 block).

| Role | Value | Contrast |
|---|---|---|
| Surface | green-950 `#00240f` | — |
| Gradient | to green-900 `#003820` at the bottom: `linear-gradient(180deg,#00240f 0%,#00240f 60%,#003820 100%)` | — |
| Pattern | the khatam pattern `/patterns/geometric.svg` at `--watermark-opacity:.05`, 320 px, never behind body text (masked to the outer 20 % with `mask-image: radial-gradient(closest-side, transparent 60%, #000)`) | — |
| Body text | on-dark `#f4f1ea` | 14.78 : 1 |
| Muted text | `#b9c7bf` | 9.52 : 1 |
| Eyebrows / rules | gold-300 `#e9c266`; hairlines `rgba(233,194,102,.70)` | — |
| Display Urdu | gold-200 `#f5d795` | 11.94 : 1 |
| Pillar tiles | `rgba(255,255,255,.04)`, 1 px border `rgba(244,241,234,.12)`, radius 8 px, no shadow, no glow | — |

  Using gold-300 also puts the logo's gold (ΔE 4.8 to gold-300) inside one family.
- **Remove:** the 6 px gold top bar, the blurred gold glow, the dashed dividers and the gold filled icon circles. Icons become 28 px line icons in gold-300 inside a 1 px gold-hairline ring: the "orbit ring" motif from brand.md §2.1.
- **Surface change:** use motion.md §7.1's `.bg-stage` crossfade (paper → dark at `top 75% → top 25%`, opacity scrub, 0 pins), then reverse it into the FAQ. The section background must be transparent inside the crossfade zone.
- **Layout:** contained, no card-in-card. The section *is* the chapter. Content max-width 1100 px; the text column is 64 ch. Padding is clamp(96 px, 12vw, 160 px) top and bottom, 16 px side gutter on mobile.

### 4.3 Nastaliq title treatment

The lockup, top to bottom, centred:

1. **Seal**: the Qafila logo (§4.6), 112 px desktop / 96 px mobile.
2. **Eyebrow**: `A SPIRITUAL JOURNEY BY KARWAN E USMANIA INTERNATIONAL`. Manrope 500, 11–12 px, `letter-spacing:.28em`, gold-300. Below 640 px it shortens to `BY KARWAN E USMANIA`.
3. **Display Urdu**: `قافلہ شوق`, the real `<h2>` content's lead line.

```css
.qafila__ur {
  font-family: 'Gulzar', 'Noto Nastaliq Urdu', serif;
  font-weight: 400;
  font-size: clamp(2.75rem, 6.5vw, 4.75rem);  /* 44 → 76 px */
  line-height: 1.9;          /* Nastaliq needs ≥ 1.8; current 1 clips */
  padding-block: .3em;       /* room for the cascade and dots */
  color: var(--gold-200);    /* 11.94:1 on green-950 */
  letter-spacing: 0;         /* never track Urdu */
  font-feature-settings: normal;
}
```

   Markup: `<span lang="ur" dir="rtl">`, with `text-wrap: nowrap` (it is two words).
4. **Latin name**: `Qafila e Shoq`, Cormorant Garamond 500, clamp(2rem, 4vw, 3rem), `letter-spacing:-.01em`, on-dark `#f4f1ea`. It sits in the same `<h2>` as the Urdu line, separated by a line break, so the heading's accessible name reads "قافلہ شوق Qafila e Shoq".
5. **Tagline**: `A Sacred Caravan of Devotion`, Cormorant italic 400, 20 px, on-dark-muted. It replaces the gold badge pill. No pill, no fill.
6. A **1 px gold-hairline rule**, 64 px wide, centred, 32 px below.

Pillar Urdu words (عبادت ریاضت تربیت سیاحت): Gulzar at 28 px (≥ 28 px per brand.md), `line-height:2`, gold-300. For any Urdu running text ≤ 24 px, use Noto Nastaliq Urdu at `line-height:2.2–2.6`.

Font loading: load Gulzar only through an `@font-face` with `unicode-range: U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF`, so it downloads only where Urdu renders. I did **not** measure Gulzar's file size; check it before shipping. Call `ScrollTrigger.refresh()` after `document.fonts.ready`, because Nastaliq line height shifts the layout.

**Why Gulzar is fine next to a non-Nastaliq logo:** at 112 px the logo's lettering band is about 20 px tall, so it reads as a seal, not as a competing headline. The live Nastaliq title is the "voice". If the owner wants the two to match, the fix is the retrace in §4.6, not swapping Gulzar for a Naskh face.

### 4.4 The one signature motion moment

Motion budget per craftbar rule 6 and motion.md §11: one idea per section, 0 pins here, ≤ 4 `will-change` elements.

**"The name is written": a right-to-left clip-path wipe on the Urdu title line, once.**

```js
// inside gsap.matchMedia('(prefers-reduced-motion: no-preference)')
gsap.fromTo('.qafila__ur',
  { clipPath: 'inset(-0.6em 0 -0.6em 100%)' },        // hidden; reveal starts at the RIGHT edge (RTL reading direction)
  { clipPath: 'inset(-0.6em 0 -0.6em 0%)', duration: 1.2,
    ease: 'cubic-bezier(.65,0,.35,1)',                    // CustomEase / 'power2.inOut' ≈ same; the house curtain curve
    scrollTrigger: { trigger: '#qafila', start: 'top 60%', once: true } })
```

- **Negative vertical insets** (`-0.6em`) keep the Nastaliq cascade and dots from being clipped. This is the whole line, not a character split, as motion.md requires ("no char split for Arabic").
- **Choreography:**
  - t = 0: the seal fades in, `autoAlpha 0→1`, `scale .96→1`, 600 ms, `cubic-bezier(.165,.84,.44,1)`.
  - t = 200 ms: the Urdu wipe starts (1200 ms).
  - t = 900 ms: the Latin name, tagline and rule do the house fade-up (`y 16→0`, 750 ms, `cubic-bezier(.165,.84,.44,1)`, stagger 80 ms).
  - Total ≈ 1.75 s, played once.
- **Everything else in the section is house default:**
  - Leader block and intro: the standard fade-up.
  - Pillars: the standard stagger (4 children, 80 ms).
  - Dates/places row: the standard fade-up.
  - The CTA does not move except on hover (fill `#25d366 → #1ebe5b`, 300 ms).
  - Pillar hover: border colour → `rgba(233,194,102,.45)` in 300 ms. **No lift and no shadow** on dark.
- **Reduced motion:** no wipe, no scale, no stage crossfade. The section is simply dark, with everything visible.
- **Rejected, and why:**
  - *Stroke-drawing the khatam frame.* It needs an SVG we don't have, and it duplicates the site preloader's self-draw.
  - *A pinned four-pillar "stations" scroll.* It spends the page's only pin, and craftbar suggests Sanctuaries for that pin.

### 4.5 Information order and conversion

The section reads like an invitation, not a price card. It has no price, consistent with "application only".

| # | Block | Content and rules |
|---|---|---|
| 1 | **Lockup** (§4.3) | Seal, endorsement eyebrow, قافلہ شوق, Qafila e Shoq, tagline. |
| 2 | **Leader** | Label `LED BY` (Manrope 11 px, .28em, gold-300). The name in Cormorant 500 at 28 px: `Pirzada Burhan uddin Ahmed Usmani Sahib`, exactly as in data, honorific included. Title `Islamic Scholar` in Manrope 14 px, on-dark-muted. **Default: no photo.** The plate uses a 1 px gold-hairline frame. The optional `leaderPhoto` (Cloudinary id) renders as a 96 px **arch-top mask** (brand.md §2.3 dome motif), not a circle, and only if the owner supplies a photo and the Sahib consents. An optional `leaderUrdu` (Urdu spelling of the name) renders in Gulzar 24 px under the Latin name. **Never machine-transliterate the name.** Then `intro`, ≤ 60 ch, but rewritten so it does not repeat the name already shown (the current `intro` duplicates the leader line). |
| 3 | **Four pillars** | A 2 × 2 grid ≥ 900 px, 1 column below 640 px (the current `auto-fit 220px` gives an awkward 3 + 1 at mid widths). Each tile: ring icon → Urdu word (Gulzar 28 px) → `Ibadah`, with the English gloss on its own line ("Acts of Worship") instead of an em-dash title → body ≤ 3 lines on desktop. Order unchanged: Ibadah, Riyazat, Tarbiyat, Siyahat. |
| 4 | **Journey facts row** (new optional fields; render each only if present) | `Next departure`: "Fri 23 Oct – Sun 1 Nov 2026" style, **departure and return pair** (BMHC/BMC precedent). `Duration` "10 days". `Cities` "Madinah 5 nights · Makkah 4 nights". `Places` "**40 places**" (exact number, Green Lane precedent). `Status` chip: `Applications open` / `Waitlist` / `Closed`. If no dates exist, show one line: "**Next caravan dates are shared on WhatsApp.**" **Do not invent numbers.** All values come from the owner. Typography: Manrope 600 tabular-nums, 18 px values, 11 px gold-300 labels, separated by 1 px vertical gold hairlines (the letterhead divider motif). |
| 5 | **How to apply** (3 numbered steps; wording to be confirmed by the owner) | `01 Message us on WhatsApp`, then `02 A short conversation with our team about your intention and travel dates`, then `03 Confirmation and pre-journey preparation`. Numerals in Cormorant 500 at 32 px, gold-300. These steps make "by application only" concrete without a form, which keeps WhatsApp as the only conversion path. |
| 6 | **CTA** | One primary button: **"Apply via WhatsApp"**. Fill `#25d366`, label and icon green-950 `#00240f` (8.41 : 1), `btn--lg`, min height 52 px, full width below 480 px. It links to `wa('qafila', q.waMessage)`. Below it, the microcopy "**Limited places · By application only**" in Manrope 13 px, on-dark-muted. Choose "places" over "seats", following the UK pages and the fact that this is a pilgrimage, not ticketed. A secondary text link, "Ask a question first", is optional and uses the same WhatsApp link with the general message. No countdowns and no "only N left" unless the owner keeps it accurate. |

**Proposed prefilled message.** It stays in the existing `waMessage` field, so the admin is unaffected:

> Assalamu Alaikum. I would like to apply for the next Qafila e Shoq journey led by Pirzada Burhan uddin Ahmed Usmani Sahib. My name: … / City: … / Number of travellers: …

**Key wiring for the implementation phase** (nothing is changed now):
- Option A, minimal: change the call to `wa('qafila', q.waMessage)`. It behaves the same, but documents the intent.
- Option B, better: in `buildMessages`, add `if (site.qafila?.waMessage) m.qafila = site.qafila.waMessage`, so the WhatsApp split CTA (awwwards.md item 11) and the FAB can call `wa('qafila')` without the component.
- Either way the number comes from `site.company.whatsapp`, which must be corrected to `923334883578` (codebase.md §5.5) before Qafila applications go live.

**Schema additions.** All are optional, so absent fields render nothing and existing content and the admin's whole-object writes keep working:

`qafila.endorsement`, `qafila.leaderPhoto`, `qafila.leaderUrdu`, `qafila.departure` (ISO date), `qafila.return` (ISO date), `qafila.durationDays`, `qafila.cities: [{name, nights}]`, `qafila.places`, `qafila.status: 'open'|'waitlist'|'closed'`, `qafila.steps: [string]`.

When `status: 'closed'`, the CTA label becomes "Join the waitlist on WhatsApp".

### 4.6 Logo usage rules (Qafila seal)

1. **Never use the current PNG as is on dark.** It is an opaque white square. Interim fix: **re-export a knocked-out version** (flood-fill from the edges, as in `tools/gap5/knock.cjs`). Keep the white centre window, because without it the Kaaba (1.08 : 1) and dome (3.54 : 1) vanish on green-950.
2. **Re-export sizes.** Do this through Cloudinary (`keu/brand/qafila-seal`, `f_auto,q_auto,w_240` / `w_480`) or as static files `public/brand/qafila-seal-240.webp` and `-480.webp`, with a PNG fallback. Measured: 240 px WebP 7.2 KB, 480 px WebP 16.4 KB (opaque), knock-out 480 px WebP 34.0 KB, AVIF 480 px 12.2 KB (opaque). This replaces the 984,943-byte original. Always set `width`/`height` (`112`/`112` or `96`/`96`) to stop layout shift, and keep `loading="lazy" decoding="async"`. Alt text: "Qafila e Shoq seal".
3. **Size.** Display 112 px desktop / 96 px mobile in the chapter, 64 px in a Home teaser card, and 48 px absolute minimum. Below 48 px the wordmark (≈ 17.5 % of height) falls under 9 px and smears; in that case use the name in Gulzar text instead of the seal. Never show it larger than 160 px: the raster is soft, and its flaws show above about 2× its display size.
4. **Clear space.** Use 0.25 × the seal width on all sides (28 px at 112). The artwork has **no bottom margin in the file** (the swash touches row 1562), so add padding in CSS. Do not rely on the image box.
5. **Retint?** **Do not retint the raster.** Hue-shifting a photographic upscale muddies the illustration. **Commission an SVG retrace** (the same vector job brand.md §4 already needs for the KU mark). In the retrace:
   - Frame + lettering → gold-400 `#f0b030`, with an optional gold-300 `#e9c266` highlight (ΔE 5.2 / 4.8 from the current gold, so it stays recognisable while joining the KEUI family).
   - Kaaba → ink `#0b0b0b` with a gold-500 band.
   - Dome → keep a representational Nabawi green, snapped to green-500 `#20784d` (ΔE 6.2).
   - Remove the grey drop shadows, redraw the dots, and add bottom clear space.
   - Produce an emblem-only variant with the Urdu lettering as a separate layer (today the frame tip overlaps the text band, so no crop works).
   - Recolouring is an owner and Pirzada Sahib decision, because it is their sub-brand mark. Keep the original as the archived master.
6. **Never** place it next to the KU mark at equal size. Endorsement is in text, not a double logo. Also never: put it on paper with a gold-800 text neighbour, put it inside a circle or plate, add a drop shadow (the current `drop-shadow(... rgba(13,27,53,.15))` is navy and goes), rotate it, or animate it beyond the single fade/scale in §4.4.

---

## 5. Unverified or open items

- **No Pakistani operator page for a scholar-led Umrah group was found** in two searches. The Pakistani presentation conventions (Facebook/WhatsApp flyers, honorific usage such as "Hazrat … Sahib") are **not verified**. Only the three UK pages were fetched.
- The Madania Umrah form was summarised from search results only. I did not open it.
- Whether Pirzada Burhan uddin Ahmed Usmani Sahib **has a usable photo or consents to one** is unknown. The proposal defaults to no photo.
- The **Urdu spelling of the leader's name**, the real **dates, places count, cities/nights and application steps** do not exist anywhere in the repo. Every value in §4.5 is a placeholder format, not a fact.
- That the logo is an upscaled raster is an inference from its smeared edges and colour count. Its origin is unknown.
- I cannot name the logo's lettering style precisely: "upright Naskh/Thuluth-derived display, not Nastaliq" is my visual judgement.
- **Gulzar's woff2 size** and its rendering quality at 44–76 px in Chrome/Safari on Windows/iOS were not measured here. brand.md also marks its "Lahori style" characterisation as unmeasured.
- The knock-out test leaves faint grey shadow halos. I did not tune it further, since the retrace is the real fix.
- I did not check whether `/api/content` in production currently contains a `qafila` object that differs from `data.js` (it would override the defaults through SiteContext).

## Sources
- https://greenlanemasjid.org/seerah-umrah-tour
- https://www.tickettailor.com/events/bradfordmuslimcollege/2265619
- https://bmhc.org.uk/heritage-umrah-2026/
- https://docs.google.com/forms/d/e/1FAIpQLSdmWnVpyGf1x8C5SLOYwdZ5uhNJR_RDuDjdFyA720cAzP2yGQ/viewform (search summary only)
- Repo: `keu-website/src/components/QafilaSection.jsx`, `src/data.js` 168–208, `src/styles/components.css` 746–893, `src/lib/whatsapp.js`, `src/App.jsx` 70–72, `src/pages/admin/EditGeneric.jsx`, `src/pages/Packages.jsx` 59, `scripts/generate-seo.js` 109–111, `public/qafila-logo.png`

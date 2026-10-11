# Gap fill 1: live production content and the package card hierarchy

Researcher: gap-1 · 2026-10-10 · Builds on BRIEF.md, codebase.md (section 1.2, risk R1) and 21st-components.md section 6. No repo files were modified.

Saved artifacts (scratchpad):
- `research/live-content.json`: the full `GET /api/content` response from **usmania.vercel.app**, 13,643 bytes. `research/usmania-content.json` is the same file.
- `research/dl/gap1/keusmania-bundle.js`: the JS bundle served by keusmania.vercel.app (255,350 bytes).
- `research/dl/gap1/cats.html`: hajj.nusuk.sa/PackagesCategories (140,753 bytes).

---

## 0. A finding that changes the brief: keusmania.vercel.app does NOT run this repo

| Probe (2026-10-10) | Result |
|---|---|
| `curl https://keusmania.vercel.app/api/content` | **404** `NOT_FOUND`, text/plain (Vercel id `bom1::2g7th-…`) |
| `…keusmania.vercel.app/api/contact`, `/api/auth/me`, `/api/inquiries` | all **404** |
| `keusmania.vercel.app/` `<title>` | `Karwan e Usmania - Hajj & Umrah Services \| Premium Islamic Travel`, bundle `/assets/index-FDuF3Vh1.js`, minimal index.html with no meta, OG or canonical |
| repo `keu-website/index.html` `<title>` | `Karwan-e-Usmania — Premium Hajj &amp; Umrah from Lahore` |
| `https://usmania.vercel.app/` | **200**, title identical to the repo index.html, `theme-color #0d1b35`, Cloudinary OG image `keu/makkah/kaaba`, bundle `/assets/index-B-ZyXzj9.js` |
| `https://usmania.vercel.app/api/content` | **200** application/json. This is the deployment of this repo, with the API and the Mongo DB. |

- keusmania.vercel.app serves a **different, older SPA** with no serverless API. Its bundle contains `+92 330 421 1900`, `+92 331 421 1935`, `+92 333 473 9757`, `+92 333 488 3578` and "Karwan E Usmania. All rights reserved. | Trust". It is probably a previous Vercel project that still holds the subdomain. I could not see which Vercel project owns which domain because no `.vercel/project.json` exists in the repo.
- The production deployment of this repo is **usmania.vercel.app**, which matches the URL printed on the letterhead (www.Usmania.vercel.app). The repo's `index.html` still declares `canonical` and `og:url` = `https://keusmania.vercel.app/`, so it points search engines at the *other* site.
- **Action for the rebrand plan:** decide which domain is canonical before launch. Either point keusmania.vercel.app at this project or change canonical/og:url, `schemas.js` and `generate-seo.js` to usmania.vercel.app. The brief's line "live site is keusmania.vercel.app" should be corrected: that domain is live but serves the old site, not this codebase. Do not invent a new domain.

All findings below come from **usmania.vercel.app/api/content**.

---

## 1. Live DB content (usmania.vercel.app/api/content)

Top-level keys: `packages`, `site`. Both Mongo rows exist (`Content{type:'packages'}` and `Content{type:'site'}`).

### 1.1 `site` row: exists, all 12 keys saved
`company, services, whyChooseUs, stats, sanctuaries, testimonials, team, faqs, qafila, about, gallery, heroImages`, which is every key in `data.js` `SITE`. Because `SiteContext` does a shallow merge `{...DEFAULT_SITE, ...content.site}`, **every** top-level key in `data.js` is shadowed at runtime. Edits to `data.js` change nothing on production unless the DB rows are re-saved or deleted.

`site.company` (verbatim):

| Field | Live DB value | data.js default | Letterhead (brand truth) |
|---|---|---|---|
| name | `"Karwan-e-Usmania  Travel's & Tours"` (double space, stray apostrophe) | `Karwan-e-Usmania` | **Karwan e Usmania International** · Travel & Tours |
| tagline | `"Premium Hajj & Umrah from Paksitan"` (typo "Paksitan") | `Premium Hajj & Umrah from Lahore` | Your Journey to the Holy Land Our Priority |
| founded | 2005 | 2005 | 2005 (brief) |
| phone | `+92-333-4883578` | `+92-333-4883578` | Landline **+92 42 35136177**; Mobile **+92 333 4883578** |
| whatsapp | `"+923304211900"` | `923314211935` | **+92 333 4883578** |
| email | `keusmania@gmail.com` | same | keusmania@gmail.com |
| address.street | `"Office# 2 , 1st Floor Usman Plaza, Opposite Butt Sweat, near Lamb House G1 Market, Johar Town "` (typo "Sweat", trailing space) | `Mansoorah Homes, Multan Road` | Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town, Lahore |
| address.city / country | Lahore / Pakistan | same | same |
| address.postalCode | `54600` | `54600` | not printed on the letterhead. 54600 is carried over from the Mansoorah-era default. I did not verify Johar Town's postcode. |
| hours | Mon–Sat 9:00 am – 7:00 pm; Sunday 11:00 am – 4:00 pm | same | not on the letterhead |
| socials | Facebook `…/p/Karwan-e-Usmania-61552498595314/`, Instagram `instagram.com/keusmania?utm_source=…`, YouTube `@karwaneusmania`, TikTok `@keusmania` | Instagram/TikTok handles differ (`karwaneusmania`) | n/a |

- **`qafila`: present.** Values: name "Qafila e Shoq", tagline "A Sacred Caravan of Devotion", urduTagline "قافلہ شوق", logo `/qafila-logo.png`, leader "Pirzada Burhan uddin Ahmed Usmani Sahib", leaderTitle "Islamic Scholar", intro, body, and four pillars (Ibadah/Riyazat/Tarbiyat/…).
- **`heroImages`: present.** `{primary:"keu/makkah/kaaba", fallback:"keu/makkah/masjid-al-haram"}`, the same as the defaults.
- **`testimonials`: present, 4 items.** Each has quote/name/location/trip/rating 5/initials. Two are real-looking edits: "Vick Pandaa - Waqas Saleem " (trip "Premium Umrah · 2026") and "Zahid Rauf" (initials still "AK" from the old Ayesha Khan entry). Two are defaults (Imran Sheikh, Muhammad Hassan).
- **`team`: 7 real people with Cloudinary photos.** These replace the 4 placeholder defaults. Chairman: Pirzada Burhan Ud Din Ahmad Usmani. Directors: Moeed, Muaz, Usman Aman Uddin Ahmed, Muhammad Mawiz Usmani. Umer Ahad Ud Din Ahmed Usmani is Logistics Manager and Abubakar Moeen Ud Din Ahmed Usmani is Graphics Manager.
- **`faqs`: customised and contradicts the packages.** FAQ #1 says "from PKR 275,000 (Economy, 14 nights, 20 nights, 3-star…) up to PKR 600,000 (VIP…)" and contains the off-brand line "It's like the shop where the cost goes up as you need more and more service." FAQ #3 promises "return flights… Urdu-speaking guide, and ziyarah", but the live economy package is "Without Air Ticket". FAQ #5 begins "Yes.100% we deal wit…" (typos).
- services, whyChooseUs, stats (18+ / 25,000+ / 15+ / 100%), sanctuaries, about and gallery match the defaults.

### 1.2 R1 verdict

**R1 = YES, the risk is real, but the stale values are not the ones codebase.md predicted.**
- The OLD identity named in R1 is **not** live. There is no `923314211935` and no Mansoorah address in the DB. Those two stale values exist only in `data.js`, and the DB shadows `data.js` on production.
- The DB `site.company` row **does** override the new brand with stale or non-letterhead values. The exact fields:
  1. `company.name` = "Karwan-e-Usmania  Travel's & Tours". It should be "Karwan e Usmania International" (descriptor "Travel & Tours").
  2. `company.tagline` = "Premium Hajj & Umrah from Paksitan". It should be "Your Journey to the Holy Land Our Priority".
  3. `company.whatsapp` = "+923304211900". The letterhead number is +92 333 4883578. **This is THE conversion path, so it needs owner confirmation.** It may be a deliberate sales line, since the package summaries list a third number (+924235136177, the landline) for "Call/WhatsApp". Also, `useWaLink` builds `https://wa.me/+923304211900?...`. wa.me answers 302 → `api.whatsapp.com/send/?phone=%2B923304211900`, so it redirects. WhatsApp's own guidance is to omit "+", and I did not verify the result on a device. Strip non-digits in code.
  4. `company.address.street` has typos ("Butt Sweat") and no "436-G1".
  5. `company.address.postalCode` = 54600 is inherited from the Mansoorah-era default and is unverified for Johar Town.
  6. `company.phone` lacks the landline +92 42 35136177. There is no landline field in the schema, but the number appears inside package summaries.
- Non-company stale content that renders on the rebrand: the FAQ copy and its PKR range (section 1.1), and testimonial initials "AK" for Zahid Rauf.
- **Fix path (admin untouched):** re-save `/admin/company` with the letterhead values after the owner confirms the WhatsApp number. Optionally add the console warning that R1 already proposes. Do **not** delete the `site` row. It holds the real team, testimonials and Qafila edits, and deleting it would lose them.

### 1.3 Live packages (only 2; the 6 data.js defaults are not shown on production)

| # | id (verbatim) | tier | category | price | priceLabel | perPerson | nights | badge | featured | inclusions | name len | subtitle len | summary len |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `"Rab Ul Awal Umrah "` | economy | umrah | 78498 | `"PKR  78,500/-"` | true | 21 | `"limited time offer "` | true | 4: `visa `, `transport`, `documentation`, `Hotels` | 8 (`"21 days "`) | 26 (`Package Without Air Ticket`) | **488** |
| 2 | `"Star Package yaya "` | premium | umrah | **1** | `"PKR 375000"` | true | 14 | `"Bumber Offer"` | true | 6: `Star Hotels`, `visa`, `Private transport`, `Documentation`, `Air Ticket`, `Gifted Historical Tour of Both Holy Cities ` (43 chars) | 12 (`Star Package`) | 16 (`Shuttle Package `) | 398 |

Both have icon `🕋` and their own `waMessage`.

Longest live strings: name 12, subtitle 26, summary **488**, badge 19, inclusion 43, inclusions max 6.
data.js defaults for comparison: name 17 (`Hajj 2025 to 2027`), subtitle 52, summary 52, badge 14, inclusion 42, inclusions max 7 (Hajj).

What the real data tells the card design:
- **There is no Hajj package live.** "Price on request" exists only in `data.js` (`hajj-2025`: `price:null`, `priceLabel:'On Request'`, `nights:null`). The Hajj design must therefore be defensive.
- **The summary is where the owner puts the real product.** It holds the Makkah/Madinah split, hotel names, shuttle and transport, "Excluding Airline Ticket", and a repeated contact/sign-off block. Live text: "Makkah (14 Nights): Mayar Maisar Hotel (Includes complimentary Haram shuttle) Madinah (6 Nights): Rabwa Safa 7…" and "5 Star Le Méridien Makkah and 4 Star Al Ansar Golden Tulip with 3-Sector Private Luxury Transport and One Sector Med - Mak HHR Train." At 488 chars and 14px it renders roughly 11–12 lines in the card at 375px (estimate: about 295px text width, about 42 chars/line). The admin hint asks for "2–3 lines". **The card must clamp the summary, and the full text must stay reachable.**
- **`price` is not trustworthy.** It is 1 on package 2, and 78498 vs a label of 78,500 on package 1. Never display it, never sort by it, and never use its truthiness for logic. `priceLabel` is the only display price, and it is free text ("PKR  78,500/-", "PKR 375000", "On Request").
- **`id` contains spaces and trailing spaces.** It is used as the HTML `id`, as the WhatsApp message key and as the React key. Don't build CSS selectors or `#anchors` from it. If anchors are needed, slugify in code.
- **Both packages are `featured:true`,** so `featured` cannot double as a "highlight one card" flag. On home it only selects which cards appear.
- **Admin quirk relevant to Hajj:** in `EditPackages.jsx` the `set()` helper turns a cleared number field into `Number('') = 0`, and `blank()` starts with `price: 0`. An owner-created Hajj card will therefore have `price: 0`, not `null`. The current `PackageCard` line `{pkg.price && <span>/ person</span>}` would then render a literal **"0"** (React prints `0`). The redesign must key "per person" off `perPerson`, and detect "on request" from the label, never from `price`.
- **Fields in the schema but unused by the current card:** `icon`, `nights`, `perPerson`, `tier` (data attribute only), `category` (data attribute and filter only), `featured` (home selection only).

---

## 2. Current card (code facts)

`src/components/PackageCard.jsx` render order:
1. badge (absolute top-right `.badge--gold`)
2. h3 name
3. subtitle (14px uppercase, tracking-wide, muted)
4. price row: `priceLabel` (Playfair 36px bold gold-dark), then "/ person" if `price` is truthy
5. `<p class="package-card__nights">{summary}</p>` (the class name says nights but it renders the summary, 14px muted, unclamped)
6. divider
7. inclusions `✓` list (`flex:1`)
8. "Book on WhatsApp" `btn--primary btn--full`, `href = wa(pkg.id)`

`components.css`:
- 231–356: card styles. Cream gradient, 1px gold border, 16px radius, padding 32/24/24, a 4px gold top bar `::before`, a geometric pattern `::after` at 4% opacity, and hover `translateY(-8px)` with a gold shadow.
- 358–403: grid. 1 column below 640px, 2 columns from 640px, 3 from 1024px, 4 from 1440px. Cards are capped at `max-width:380px` and `height:100%`, and `:has()` collapses the track count when there are fewer cards.
- 1657: `.pkg-editor__preview-stage .package-card { max-width:360px }`. **The admin preview renders the very same component at 360px max, so every change also appears in the admin.**

Admin editor (`src/pages/admin/EditPackages.jsx`): fields are id, name, subtitle, priceLabel, price, nights, badge, category (umrah|hajj|ramadan_umrah|family), tier (economy|premium|vip), summary, featured, inclusions[], waMessage. `perPerson` and `icon` have no inputs: they keep the `blank()` defaults `true` / `🕋`. The editor initialises with `useState(pkg)` and spreads `{...p, [k]: v}`, so **unknown extra keys on a package survive an admin save.** New optional keys are therefore safe: they can be seeded in data.js or the DB and the admin will not strip them. The admin also cannot edit them, so every new key needs a code default and must never be required.

---

## 3. Competitor and official card anatomy (fetched 2026-10-10)

| Source | Fields on the card | Not on the card | Trust markers |
|---|---|---|---|
| **trips.pk, Lahore page** (https://www.trips.pk/umrah/umrah-packages-lahore/), Pakistani aggregator/operator | Tier label (Economy / 3★ / 4★ / 5★ / "Shuttle"), **Makkah hotel name + metres to Haram + "Shuttle" + street/area**, **Madinah hotel + metres + area**, inclusions line "Flight, Visa, Hotel, Private Transport", price "Rs. 285,500", "Details" link, WhatsApp "Call / Chat" button. Duration is set by **tabs** (7/10/15/21 days), not on the card. The price-basis footnote "per person, based on a group of 4" applies to the whole grid. A rate-list PDF download is offered per duration. | airline, nights split, dates, sharing (quad appears only in the page text) | Banner "GOVERNMENT-LICENSED · D-U-N-S REGISTERED"; names "Department of Tourist Services, Punjab"; the author is "IATA certified". **No licence number shown.** |
| **Hafiz G Travel & Tours, Shahdara, Lahore** (https://hafizg.169.58.145.166.sslip.io/; the host is odd, an sslip.io IP alias) | image, duration "21 nights", title ("21 Days Umrah Package from Lahore \| Saudi Airlines", so the airline lives in the title), **split "12 nights Makkah, 8 nights Madinah"**, "From PKR 260,000", "Details" | hotels, stars, distance, visa, transport, sharing, dates | none (no DTS, IATA or MoRA). Copy: "Fares and room rates are confirmed at the time of booking." |
| **Pakistan Observer Ramadan 2026 tables** (https://pakobserver.net/ramadan-2026-umrah-packages-from-pakistan-7-day-10-day-21-day-umrah/), local-agent rate tables | type (Economy / 3-4★ / Near Haram / Family / VIP / Luxury), Makkah + Madinah hotel names with **distance in brackets** ("Hibba Al-Hijrah (600m)", "Shaza Al Hijra (1000m – Shuttle)"), "Flight, Visa, Transport, Hotel", price | operator, split, airline, sharing, dates | none |
| Supplementary Pakistani price lists (search snippets, not opened): pakobserver Oct–Nov 2025; Jannat Travels Karachi (odoo page now 404) | **sharing-basis ladder**: Sharing 250,000 / Quad 265,000 / Triple 275,000 / Double 285,000. Another 3-week list: 12N Makkah + 8N Madinah, Quad 265k / Triple 290k / Double 345k. | — | Jannat: "DTS Licence No. 5991" (snippet only, unverified on page) |
| Al Mahad Travels (https://almahadtravels.com/group-packages), **Hyderabad, India, not Pakistan**, included only as the clearest *group-departure* pattern | "Group 1 · 15 Days", **dates + airline** "27 OCT'26 - 10 NOV'26 (SAUDI AIRLINES)", Makkah and Madinah hotel "OR SIMILAR" with photos, airline logo, "₹ 1,15,000pp", "QUAD SHARING", **scarcity "12 Seats Left"** / "BOOKINGS STARTED", tag "SHUTTLE SERVICE" | stars, distance, split | "IATA Certified Travel Agency" badge; Ministry of Hajj & Umrah agency ID AC165 badge |
| **Nusuk Hajj** (https://hajj.nusuk.sa/PackagesCategories; `/packages` redirects to `/account/authorize`, login required) | `preferred-card preferred-card-{luxury\|premium\|standard}` (+ `shifting`). Each card has: category name, "Shifting" tag, a one-line promise, Makkah accommodation class ("5-Star Hotels"), shifting accommodation, Madinah accommodation, **minimum duration** ("10 Days (Min)" / "14 Days (Min)"), Mina camp ("Majar Al-Kabsh or Al-Muaisim"). The page also defines comparison axes: **Makkah zones A/B/C/M** (A = overlooks the Haram yards, B = walkable plus shuttle, C = not walkable with shuttle, M = near the Mashair), **room type** ("A Bed in a Shared Double/Triple/Quadruple Room"), inter-city transport (bus, Haramain HSR, airplane, private car), and the "All Inclusive" service list (Flights, Accommodations, Catering, Transportation, Mashair, Tour guide, Visa Issuance). | No price on the categories page. Prices sit behind login. | "Government website registered with the Digital Government Authority with number: 20260826091", "How to verify?" |
| umrah.nusuk.sa/available-packages/… | filter-only page: Service Provider, Package nights, Makkah and Madinah Accommodation Rating (3/4/5★), Package Price (Lower/Higher), availability dates, Category | — | — |

Regulatory context (from search, mora.gov.pk attestation form 2026 PDF; I read only the snippet): MoRA attestation of Umrah operators requires a **valid DTS licence (≥6 months validity) and current-year IATA membership**. Pakistani guidance (trips.pk) tells pilgrims to verify DTS and IATA. KEUI's own DTS, IATA or MoRA numbers are **not in the repo, the DB or the letterhead**, so none can be shown until the owner supplies them. Do not invent them.

**Pattern summary.** Pakistani cards lead with **tier → Makkah hotel + distance → Madinah hotel + distance → inclusions line → price (per person, quad basis) → WhatsApp**. Duration is usually a tab or a filter. The nights split is the usual way to describe a package. Licence numbers are rarely displayed, so showing real ones would be a differentiator.

---

## 4. Recommended card hierarchy (existing schema only; new keys optional)

### 4.1 Field mapping rules (code, not schema)
- **Eyebrow** = `tier` mapped to a label (economy → "Economy", premium → "Premium", vip → "VIP"), plus the category label from the existing `FILTERS` map (umrah → "Umrah", hajj → "Hajj", ramadan_umrah → "Ramadan", family → "Family"). Rendered as `ECONOMY · UMRAH`, letterspaced uppercase, gold-bronze.
- **Badge** = `badge.trim()`. Shown as a pill in the eyebrow row, right-aligned, not absolutely positioned (that avoids collisions with long titles and the 19-char "limited time offer"). Render as written. Do not text-transform the owner's casing beyond the CSS uppercase used for the eyebrow style.
- **Duration** = `nights` when it is a number > 0 → "21 nights". If null or 0, hide it.
- **On request** = `isOnRequest = !/\d/.test(priceLabel) || category === 'hajj' && !price`. This works for "On Request", for an empty label, and for the admin `price:0` case. **Per person** = `perPerson !== false && !isOnRequest`, which replaces `pkg.price &&`.
- **Inclusions**: `filter(s => s && s.trim())`, trim each. Optional keyword→icon map in code (visa→`visa`, transport/shuttle→`bus`, hotel→`hotel`, air/flight/ticket→`plane`, tour/ziyar→`guide`, documentation→`certificate`) using the existing `src/icons.jsx`. Fallback icon `check`.
- **Summary**: CSS `-webkit-line-clamp: 3` (mobile) / 4 (desktop) with `overflow:hidden`, followed by a native `<details><summary>Full package details</summary>…</details>` holding the full text with preserved line breaks (`white-space: pre-line`). No JS, accessible, and it also works in the admin preview. Optionally strip a trailing "Book Your Journey: … Website: … Spiritual Journeys." block in display code: it repeats the CTA and a third phone number. This is a judgement call to put to the owner, so do not do it silently.
- **Optional new keys** (all default to absent and render nothing). Seed them in data.js or the DB. The admin preserves but cannot edit them:
  - `makkahNights` (number), `madinahNights` (number). When both are present they replace the plain duration with "14 Makkah · 6 Madinah".
  - `makkahHotel` / `madinahHotel` ({name, stars?, distance?}), rendering "Mayar Maisar · Shuttle".
  - `airline` (string) and `sharing` ("quad" | "triple" | "double" | "sharing") for the price basis "per person · quad".
  - `departures` (string[]).
  Without them, the card is still complete from the existing fields. **Recommendation:** ship v1 with no new keys, because the owner already writes this information into `summary`. Propose an admin field addition later as a separate, explicitly approved change.

### 4.2 Mobile, 375px (single column, card ≈ 343px wide with a 16px page gutter, padding 20px)
1. **Eyebrow row**: `TIER · CATEGORY` left, `badge` pill right. 11–12px, tracking 0.12em.
2. **Title** `name`: serif, 24px/1.2, max 2 lines (live max 12 chars, default max 17).
3. **Meta line**: `nights` ("21 nights") · `subtitle`. 14px, 1 line with ellipsis on mobile (the 52-char Hajj subtitle wraps to 2 lines, which is allowed). Puts "Package Without Air Ticket" right under the title, where it belongs, as a disclosure.
4. **Price block**: `priceLabel` in serif 30–32px (down from 36px, so "PKR  78,500/-" fits on one line at 303px). Under it, 13px muted "per person" (from `perPerson`). On request: see 4.4.
5. **Inclusions**: up to 4 rows with icons, then "+N more", which is plain text that expands the same `<details>`. 14px, 8px row gap.
6. **Summary**: clamped to 3 lines, then the "Full package details" disclosure.
7. **CTA**: "Book on WhatsApp", full width, min-height 48px, WhatsApp icon, `href = wa(pkg.id)` unchanged. Optional secondary text link "Ask a question" → `wa('general')`.
- The hairline divider goes between 4 and 5 only (1px gold-hairline).
- Target collapsed height ≤ about 560px, so one card plus the next card's edge fit in an 812px viewport.

### 4.3 Desktop (≥1024px: 3 columns, card max 380px; admin preview 360px)
Same order, so the hierarchy is identical in the admin preview. Differences:
- Title 26–28px; price 36px; summary clamp 4 lines; all inclusions shown up to 6, then "+N more".
- Equal heights across a row (keep `height:100%`). The CTA is pinned to the bottom with `margin-top:auto` (already present), and the inclusions list keeps `flex:1`.
- **Emphasis variant:** a green field with a gold hairline and inverted text (21st-components.md proposal), triggered by `tier === 'vip'`, **not** by `featured` (live data has every package featured). An optional future key `highlight:true` can override.
- Hover: lift `translateY(-6px)`, 500ms `cubic-bezier(.165,.84,.44,1)` (Rialto's easeOutQuart), border to gold. Remove it under `prefers-reduced-motion`. No card-level GSAP is needed. The existing scroll reveal (y 60 → 0, 0.8s power2.out) can stay.
- With only 2 live packages, the `:has()` collapse already centres 2 × 380px cards.

### 4.4 "Price on request" (Hajj) card
- Price block: replace the big figure with serif 24px **"Price on request"** (not the raw "On Request") plus a 13px line "Government quota · seats confirmed on application". The quota fact comes from the brief and data.js subtitle. **Never print "per person"** and never print `price` (guards against the admin's `price:0`).
- Meta line: hide duration when `nights` is null or 0. Show the subtitle ("Three-year window · Government Quota · Economy & VIP").
- Eyebrow: `HAJJ · PREMIUM`. Badge "Hajj 2025–2027". That label is stale for an October 2026 audience (Hajj 2025 has passed), so flag it to the owner. It is in data.js only, not live.
- CTA wording changes to "Enquire on WhatsApp", because nothing can be "booked". `href` stays `wa(pkg.id)`, which uses the Hajj `waMessage`.
- Visual: same card frame, with no gold price numerals, so the Hajj card reads as a consultation rather than a product. Optionally put an `--ivory` field in place of the paper field.
- The inclusions list is the main content (7 items in the default). Show all 7 on desktop and 4 + "+3 more" on mobile.

### 4.5 Trust strip (outside the card, once per grid)
Use competitor practice, without inventing facts: a single line above or below the grid: "Prices per person · confirmed in writing before you pay · Saudi visa processing included" (adapt to the owner's terms). Add a **slot** for "DTS licence No. ___ · IATA ___ · MoRA verified" that renders **only** when the owner provides the numbers. They are not in the repo, the DB or the letterhead. The trips.pk and Pakistan Observer tables put the price basis (group of 4, quad) in one grid-level footnote rather than on every card, and we should do the same.

---

## 5. Unverified / open
- Which Vercel project owns keusmania.vercel.app versus usmania.vercel.app. I inferred it from the HTML and bundle contents, not from the Vercel dashboard.
- Whether `+923304211900` (live WhatsApp) is intentional. The letterhead says +92 333 4883578, and the package summaries say +924235136177.
- Whether `wa.me/+92…` (with "+") opens a chat on all devices. The server redirect was observed, the device behaviour was not.
- Johar Town postcode (54600 is inherited from the old default).
- Jannat Travels "DTS Licence No. 5991" and its price ladder come from a search snippet; the page now returns 404.
- The Hafiz G site is served from an sslip.io IP alias, so its authenticity as an operator site is uncertain.
- KEUI's DTS, IATA and MoRA registration numbers are unknown.
- Nusuk Hajj package cards with prices sit behind login (`/packages` → `/account/authorize`). Only the categories page was read.
- Line counts for the summary are estimates from font size and width, not rendered measurements.

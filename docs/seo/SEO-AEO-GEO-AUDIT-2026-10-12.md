# Karwan e Usmania International: SEO, AEO and GEO audit report

**Site:** https://usmania.vercel.app · **Date:** 12 October 2026 · **Audits:** seo-audit, ai-seo, content-strategy, core-web-vitals (every finding below was checked a second time)

## 1. Executive summary

The site is fast, looks professional, and has strong content underneath: 39 owner-approved FAQs, real pilgrim video reviews, the Qafila e Shoq programme, and detailed business data for Google. The problem is how that content reaches search engines and AI assistants. The site is built so that the page is put together in the visitor's browser. Google does this extra step and can see the real pages. Most AI assistants (ChatGPT, Claude, Perplexity), WhatsApp and Facebook link previews, and Bing's first pass do not. They see the same empty page on every link. Outside the website, a search for "Karwan e Usmania" found nothing about the business: no Google Business Profile linked, no directory listings, and no licence number shown. Some content on the site also weakens trust: two different pilgrims carry the same review text, the landline is labelled as WhatsApp, a test name ("yaya") appears in a package link, and there is an unproven "100% visa success" claim.

**In plain words:**
- **SEO** (ranking in Google) needs work. It is fixable mostly by the developer.
- **AEO** (being the direct answer to a question) needs work. It is mostly a content job for the owner.
- **GEO** (being named and cited by AI assistants) is weak. It needs both the developer's pre-rendering fix and the owner building a presence outside the site.

## 2. Scorecard

| Area | Current state | Single biggest issue | Single biggest fix |
|---|---|---|---|
| **SEO** | Needs work | No pre-rendering. Every URL serves the same empty page, with the home title, the home share card and a home canonical. Unknown URLs also return the homepage (soft 404). | Pre-render every public route into real HTML at build time. |
| **AEO** | Needs work | The FAQ answers the main questions vaguely ("prices depend…", "only your passport"). Nothing is dated, and some answers contradict each other. | Rewrite the top FAQs to start with one concrete, checkable fact. Make sure the FAQs are in the pre-rendered HTML. |
| **GEO** | Weak | AI crawlers get an empty page, and the brand has no footprint off the site: no linked Google Business Profile, no licence, no citations. | Pre-render, then set up an owned domain, a Google Business Profile and the licence number, and give the brand name one spelling everywhere. |
| **Speed** | Good (Home 94), needs work on Packages (82) | The main image only appears after the JavaScript runs (1.9 s render delay on Packages, LCP 4.1 s). The 5 old default packages also show briefly before the 2 live ones load. | The same pre-rendering fix, plus caching `/api/content` at the CDN. |

## 3. What each skill found

Several skills reuse the same IDs (for example, more than one has a "CON-1"), so this report adds a prefix to every ID: **S** = seo-audit, **A** = ai-seo, **C** = content-strategy, **W** = core-web-vitals.

The "Who" column uses three values:
- **Dev**: the developer.
- **Owner-admin**: the owner, inside the site's admin panel.
- **Owner-ext**: the owner, outside the website (Google, domain, licence paperwork).

### 3.1 seo-audit

**Summary.** Once Google runs the JavaScript, it can index the main content. The rendered pages have unique titles, descriptions and canonicals, one H1 each, and plenty of structured data. Anything that does not run JavaScript sees the same empty page on every URL: social and WhatsApp previews, Bing's first pass and most AI crawlers. Unknown URLs return the homepage with a 200 status. Admin package IDs leak into links. The biggest gap for a religious-travel business is trust and local signals: a duplicated testimonial, the landline labelled as WhatsApp, no licence, no privacy policy, and no Google Business Profile link. The free vercel.app address also puts any ranking built now at risk.

| ID | Issue | Severity | Verdict | Fix | Effort | Who |
|---|---|---|---|---|---|---|
| S:SEO-1 | Every route serves an identical empty page (34,210 bytes) with the home title, canonical and share card | Critical | Confirmed | Pre-render routes at build time (Puppeteer/Playwright post-build script or vite-react-ssg). Fetch `/api/content` at build. Rebuild through a Vercel Deploy Hook when the admin saves. | M | Dev |
| S:SEO-2 | Unknown URLs return 200 with the homepage (soft 404). `App.jsx:77` | High | Confirmed | Add a NotFound page with noindex. After pre-rendering, add a `404.html` so Vercel returns a real 404. | S | Dev |
| S:CON-1 | Two different pilgrims (Mr. Haseeb, Ms. Fareeha) show identical review text | High | Confirmed | Give each video the pilgrim's real words, or no caption at all | S | Owner-admin |
| S:LOC-1 | Package text says "Call/WhatsApp: +924235136177", which is the landline | High | Confirmed | Remove the contact boilerplate from package descriptions, or correct it | S | Owner-admin |
| S:LOC-2 | Map is a plain address search. No Google Business Profile link, reviews link or directions link | High | Partly (whether a listing exists is unknown) | Claim or verify the GBP, then embed the place map, add Directions and "Review us" links, and add the Maps URL to `sameAs`/`hasMap` | M | Owner-ext + Dev |
| S:CON-2 | No licence or registration, privacy policy or terms, although the business takes a 50% deposit | High | Confirmed | Owner supplies the real licence numbers. Add `/privacy` and `/terms` (deposit, cancellation, refund) and link them in the footer. | M | Owner-admin + Dev |
| S:SEO-3 | Package IDs such as "Star Package yaya " leak into footer links and JSON-LD `@id` | Medium | Confirmed | Slugify IDs on save, migrate the 2 existing IDs, and use `encodeURIComponent` in `schemas.js:119` | S | Dev + Owner-admin |
| S:SEO-4 | Site lives on a free vercel.app subdomain | Medium | Confirmed | Register an owned domain before doing GBP and citation work, then 308-redirect vercel.app to it | S | Owner-ext |
| S:SEO-6 | WhatsApp and social previews always show the home card | Medium | Confirmed | Fixed by pre-rendering (S:SEO-1) | S | Dev |
| S:SEO-8 | 12 of 14 gallery images have empty alt text (`GalleryGrid.jsx:117`) | Medium | Confirmed | Use `alt={img.alt}`, require alt text in the admin, add a short gallery intro | S | Dev |
| S:SEO-9 | Two conflicting organization nodes per page. The About page creates a third Organization. No postal code or geo. | Medium | Confirmed | One org node only, About `mainEntity` → `/#organization`, add `addressRegion`/`postalCode` (owner to confirm)/`geo` | S | Dev |
| S:CON-3 | Only 2 packages on one URL, and no topic pages (visa, Ramadan, Qafila) | Medium | Confirmed | Evergreen topic pages and per-package URLs (see AEO/GEO below) | L | Owner + Dev |
| S:SEO-5 | H1s do not include "Umrah" or "Lahore" | Low | Partly (weak signal) | Add the query to the H1, e.g. "Umrah packages from Lahore" | S | Dev |
| S:SEO-7 | The same 39 FAQs are on 2 URLs, each marked up twice (microdata plus JSON-LD) | Low | Partly | Drop the microdata in `FAQSection.jsx:49-64` | S | Dev |
| S:CON-4 | "100% visa success rate" claims | Low | Confirmed | Back the claim with records or soften it | S | Owner-admin |
| S:SEO-10 | `robots.txt` doesn't block `/admin`, and the AI-bot groups drop the Disallow rules | Low | Confirmed | `Disallow: /admin` and `/api` in every group (`generate-seo.js`), plus an `X-Robots-Tag` noindex header for `/admin` in `vercel.json` | S | Dev |
| S:SEO-11 | `/packages/` returns 200 instead of redirecting | Low | Confirmed | `"trailingSlash": false` in `vercel.json` | S | Dev |
| S:SEO-12 | Team pages are orphaned and not in the sitemap. Footer column titles are H2s. | Low | Confirmed | Link team cards (or noindex them), change footer titles in `Footer.jsx:97,108,119` to non-headings | S | Dev |
| S:SEO-13 | No Urdu locale, so hreflang is not needed yet | Low | Confirmed (no defect) | Keep as is. Add hreflang only when real Urdu pages exist. | S | Dev |

**Strengths:** unique rendered titles, descriptions and canonicals; one H1 per page; correct `lang`/`dir` on Arabic and Urdu text; rich JSON-LD (TravelAgency, BreadcrumbList, TouristTrip, Person); consistent name, address and phone everywhere except the package text; HTTPS, a clean sitemap, `robots.txt` and `llms.txt`; fast pages (Home 94, CLS 0); strong FAQ content and real video reviews.

### 3.2 ai-seo

**Summary.** Googlebot and Bingbot run JavaScript and see a good site. GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot do not: all routes return the same file (same md5) with an empty `#root`. Their only facts come from one JSON-LD block and `llms.txt`. Off the site, the brand barely exists: WebSearch found nothing for any spelling of the name or for the office address, and "Umrah packages Lahore" results are dominated by trips.pk, apricottours.pk and OLX. Entity signals contradict each other: About says "Hajj and Umrah", the brand and chairman names are spelled several ways, the "registered company" answer has no licence number, and package data includes a test ID and an offer that looks expired. ChatGPT, Perplexity and AI Overviews were not queried directly.

| ID | Issue | Severity | Verdict | Fix | Effort | Who |
|---|---|---|---|---|---|---|
| A:GEO-1 | AI crawlers get the empty shell with the Home canonical on every route | Critical | Confirmed | Static HTML per route (head plus plain semantic body), keep `createRoot`. Replace the static JSON-LD, don't add to it. Afterwards curl each route as GPTBot to check it. | L | Dev |
| A:GEO-2 | No off-site footprint: brand absent from every search tried | High | Confirmed (index status uncertain) | Domain first, then GBP, directories and social links. Submit to Google Search Console and Bing Webmaster Tools after pre-rendering ships. | L | Owner-ext |
| A:GEO-3 | No licence or MoRA verification shown. Press reports (July 2026) say only MoRA-verified companies may provide Umrah. | High | Confirmed (whether the business is on the list is unknown) | Enter the real number in the admin. Add it to the schema as `identifier` only once it exists. Claim nothing until then. | M | Owner-ext + Dev |
| A:CON-1 | Live packages: test ID "yaya", landline labelled as WhatsApp, "Shuttle" vs "Private transport", stale Rabi ul Awal offer, numeric price 1 | Medium | Confirmed | Owner cleans up both packages. Dev reuses `slugify()` from `src/lib/team.js` for package IDs, with an optional `validThrough` date. | S | Owner-admin + Dev |
| A:GEO-4 | Inconsistent brand, chairman and service descriptions ("Hajj and Umrah" in the About story) | Medium | Confirmed | Pick one spelling of each name, change the About story to say Umrah, add the variants to `alternateName` (`schemas.js:66`) | S | Owner-admin + Dev |
| A:AEO-1 | The cost question is deflected. Many answers are 9–17 words. | Medium | Confirmed | Lead sentence and comparison table built from live package data, with a flights column (one package includes the air ticket, the other doesn't) | M | Dev |
| A:AEO-2 | No dates on facts. Sitemap `lastmod` is just the build date. | Medium | Confirmed | Admin stamps `updatedAt`. Show "Prices updated…" and "Answers reviewed…". Take `lastmod` from those dates. | S | Dev |
| A:AEO-3 | "100% approval rate" and an undated 25,000+ | Medium | Confirmed | State the basis or drop it. Add "since 2005, as of 2026". | S | Owner-admin |
| A:GEO-5 | `llms.txt` is built from static defaults and hard-codes facts. No `llms-full.txt`. | Medium | Confirmed | Build both from `/api/content` in the pre-render step. Compute years from `company.founded`. | M | Dev |
| A:GEO-6 | Two organization nodes with the same `@id` but different `sameAs` (4 vs 2 profiles) | Medium | Partly (YouTube/TikTok are not dropped; the nodes conflict) | One org node. Owner adds the YouTube/TikTok URLs in the admin and gives the Facebook page a username. | S | Owner-admin + Dev |
| A:LOC-1 | No Urdu or Roman Urdu answers | Medium | Confirmed | Urdu versions of the top 10–15 FAQs, natural Roman Urdu headings, `q_ur`/`a_ur` fields in the admin | M | Owner-admin + Dev |
| A:AEO-4 | FAQPage marked up twice and duplicated on 2 URLs | Low | Confirmed | Remove the microdata. Make one URL the FAQ home. | S | Dev |
| A:SEO-1 | Soft 404 (also on unknown `/team/` slugs) | Low | Confirmed | Same as S:SEO-2 | S | Dev |
| A:GEO-7 | `robots.txt` AI groups lose the Disallow rules. Newer agents are not named. | Low | Confirmed | Same as S:SEO-10 | S | Dev |
| A:SEO-2 | vercel.app is a weak home to build the brand on | Medium | Confirmed | Same as S:SEO-4 | S | Owner-ext |
| A:CON-2 | Testimonial initials don't match the names (not shown publicly). Team pages missing from the sitemap. | Low | Partly | Add team URLs to the sitemap at build. Initials cleanup is optional. | S | Dev |
| A:AEO-5 | No AI-visibility tracking | Low | Confirmed | Monthly question set (Section 6) | S | Owner-ext |

**Strengths:** `robots.txt` allows every major AI crawler, and there is no WAF blocking; `llms.txt` is accurate and has no hard-coded prices; rich FAQ with all 39 questions in the DOM; strong rendered schema; prices taken from the admin labels; consistent NAP; fast edge-cached HTML.

### 3.3 content-strategy

**Summary.** The site gives the right facts for booking, with honest copy and a clear WhatsApp call to action, but it covers only booking logistics. The topics pilgrims research before they choose an agency have no page: cost breakdown, Nusuk and visa rules, documents, how to perform Umrah, best time, Ramadan, women and elderly travel, hotels near the Haram. There are 5 URLs, no guides, no Urdu body copy, and all text is added by JavaScript. Some live copy damages trust: a duplicated caption, "Hajj" and "VIP" mentions, the unqualified 100% claim, and an empty licence slot. Plan: fix trust first, then a small guides hub, then package and Qafila pages, then Urdu.

| ID | Issue | Severity | Verdict | Fix | Effort | Who |
|---|---|---|---|---|---|---|
| C:CON-3 | All content is client-rendered, so AI crawlers get an empty page | Critical | Confirmed | Pre-render. As an interim step, `llms-full.txt` built from `/api/content`. | L | Dev |
| C:CON-1 | Same English caption under two Urdu video reviews | High | Partly (the written testimonial isn't shown live; no Review schema) | True summary or translation per video, labelled "Translated from Urdu". Admin warns about duplicate captions. | S | Owner-admin |
| C:CON-2 | No guides for the questions pilgrims research before booking | High | Confirmed | A `/guides` hub after pre-rendering. Start with 3: cost explainer, visa and documents, how to perform Umrah. | L | Dev + Owner |
| C:CON-6 | No MoRA attestation or licence shown | High | Confirmed (regulatory detail to verify) | Owner enters the real registrations. Show them in the footer, FAQ 33, `llms.txt` and the schema. | S | Owner-admin + Dev |
| C:CON-7 | FAQ 7 "Only your passport and photographs" contradicts FAQ 15 and FAQ 17. Health and visa rules are undated. | High | Confirmed | Rewrite FAQ 7 as a checklist. Check FAQ 6 and 15 against Saudi MoH / Nusuk and add "Rules checked: <month year>". | M | Owner-admin + Dev |
| C:CON-4 | Copy mentions Hajj and a "VIP" package; the agency is Umrah-only | Medium | Partly | Fix `about.story[0]`, the `Home.jsx:53` lead, the `Packages.jsx:25` keywords, and the VIP fallback in `src/data.js:422-441` | S | Owner-admin + Dev |
| C:CON-5 | 100% visa claim appears in 3 places | Medium | Partly (2005/25,000+ are owner corrections, not inflation) | Soften or source the stat, `services[0].sublabel` and FAQ 6. Keep the same figures on all external profiles. | S | Owner-admin |
| C:CON-8 | Package text: 21 nights shown but 14+6=20 in the text; landline labelled as WhatsApp; price 1 | Medium | Confirmed | Fix nights and price, remove the contact footer. Structured fields later (Makkah nights, Madinah nights, hotel, distance). | S | Owner-admin |
| C:CON-9 | No individual package pages | Medium | Confirmed | `/packages/<slug>` built from the database, added to the sitemap | M | Dev |
| C:CON-10 | Qafila e Shoq has no page of its own | Medium | Confirmed | `/qafila-e-shoq` page. Event schema only once real dates and seats exist. | M | Owner + Dev |
| C:CON-11 | No Urdu or Roman Urdu content | Medium | Partly (roleAr already has `lang="ar"`) | Urdu content in phase 3 plus Urdu video transcripts. Check whether `nameAr` (`TeamDigitalCard.jsx:69`) holds Urdu or Arabic script. | L | Dev + Owner |
| C:CON-12 | FAQ answers deflect ("it depends", "ask us"). FAQ 20 says distance is shown on the card, but it isn't. | Medium | Confirmed | Give each answer one concrete fact first: airports LHE/ISB/KHI, room types, walking minutes, live "starting from" price templated by code | M | Owner-admin + Dev |
| C:CON-13 | About page lacks experience and credentials. Team bios are empty. | Medium | Partly (Person schema already exists) | Timeline, chairman's background, office photo, licence. Fill `bio` in the admin. | M | Owner-admin |
| C:CON-14 | No seasonal or freshness plan | Low | Confirmed | Seasonal refresh calendar. Admin records `updatedAt`. | S | Owner + Dev |

**Strengths:** 39 FAQs that answer real booking objections; no hard-coded prices; consistent NAP and booking message; the scholar-led Qafila e Shoq is a real differentiator; real Urdu video reviews with consent flags; `llms.txt` and AI crawlers allowed.

### 3.4 core-web-vitals

**Summary.** The site is fast in every way except one. The main image only appears after about 177 KB (brotli) of JavaScript has downloaded and run. The image itself is found early, because the preloads work. That is the 1.9 s render delay behind the 4.1 s LCP on Packages and the 2.9 s on Home. The second problem is data: every page first shows 5 old default packages and then swaps to the 2 live ones from an uncached API in the US (about 800 ms from Pakistan). CLS (0) and TBT (20 ms) are good. There is no real-user field data, because Speed Insights is switched off.

| ID | Issue | Severity | Verdict | Fix | Effort | Who |
|---|---|---|---|---|---|---|
| W:CWV-1 | LCP waits for JS: 1.9 s render delay on Packages, Home LCP 2.9 s | Critical | Confirmed | Pre-render. Never start the LCP image at opacity 0 (`PageHeader.jsx:44` `data-reveal`). Check `/packages` without the trailing slash after deploy. | L | Dev |
| W:CWV-2 | 5 default packages (Economy, VIP…) render first, then swap to the 2 live ones | High | Confirmed | Build-time content snapshot (or `window.__KEU_CONTENT__`) as the initial state in `SiteContext.jsx:21-22`. Neutral placeholders in `src/data.js`. A skeleton until `loaded`. | M | Dev |
| W:CWV-3 | `/api/content` uncached, runs in iad1 (US East), about 800 ms TTFB from Pakistan | High | Confirmed | `Cache-Control: s-maxage=60, stale-while-revalidate` on GET in `api/content/index.js` (no Set-Cookie). Admin re-fetches with `?t=`. Move the region only after confirming where the Atlas cluster is. | S | Dev |
| W:CWV-4 | All GSAP plugins, Lenis and every page load before first render. `admin.css` is in the public CSS. | Medium | Partly | Move `admin.css` into `AdminLayout.jsx` first. Lazy-load gsap where the intro doesn't run. | M | Dev |
| W:CWV-5 | Every public pageview calls `/api/auth/me` | Medium | Confirmed | Wrap only the `/admin` routes in `<AuthProvider>` (`App.jsx:85`) | S | Dev |
| W:CWV-7 | Home intro covers the page for 1.2–2.2 s plus 0.8 s on first visit | Medium | Confirmed (exact LCP effect uncertain) | Owner and design decision: cap at 1.2 s on phones, or skip for visitors arriving from search | S | Owner decision + Dev |
| W:CWV-6 | 3 font preloads (80 KB) on every route. The Arabic font is wasted on phones. | Low | Partly | `media="(min-width: 768px)"` on the keu-arabic preload | S | Dev |
| W:CWV-8 | Intro SVG and CSS (about 25 KB raw) shipped on every route | Low | Confirmed | Inject the intro block only into Home's pre-rendered HTML (`scripts/build-intro.js`) | S | Dev |
| W:CWV-9 | No field data: Speed Insights is coded but off | Low | Confirmed | Turn it on in Vercel, set `VITE_ANALYTICS=vercel`, redeploy | S | Dev |

**Strengths:** edge-cached HTML (about 220 ms); immutable caching on hashed assets; early LCP image preloads with a matching srcset; Cloudinary `f_auto,q_auto`; CLS 0 from metric-matched fallback fonts and aspect-ratio boxes; animation set-up deferred to idle time; reduced-motion, Save-Data and slow-connection support; the admin is code-split.

## 4. Final report by area

### 4.1 SEO (Google ranking, including speed)

**What is working:** once rendered, every page has a unique title, description, canonical and a single H1; the structured data is rich; name, address and phone are consistent; HTTPS, the sitemap and `robots.txt` are in place; pages are fast (Home 94, desktop 99, CLS 0).

**What is broken:** the raw HTML is identical on every URL, with the home title, canonical and share card; unknown URLs show the homepage; test text and spaces appear in package links; trust and local signals are missing (licence, privacy policy, terms, Google Business Profile); the site sits on a free subdomain.

**Prioritised fixes:**

1. **Pre-render all public routes.** IDs: S:SEO-1, S:SEO-6, A:GEO-1, C:CON-3, W:CWV-1, W:CWV-2, W:CWV-8.
   - Write a post-build script that fetches `/api/content` and writes `dist/<route>/index.html` for `/`, `/packages`, `/about`, `/gallery`, `/contact` and every `/team/<slug>`. Each file gets its own title, description, canonical, og:url, og:image, JSON-LD and a plain-HTML body.
   - Keep `createRoot` in `src/main.jsx`. Avoid hydration and vite-plugin-prerender.
   - Use the same build snapshot as the initial state in `SiteContext.jsx`, so the 5 default packages never flash.
   - Replace the static JSON-LD in `index.html` instead of adding to it.
   - Add a Vercel Deploy Hook that fires on admin save.
   - Afterwards, curl each route as GPTBot to check it.
   - Effort L. Who: Dev.
2. **Real 404s.** IDs: S:SEO-2, A:SEO-1. Add a NotFound route in place of `<Route path="*" element={<Home/>}/>` (`App.jsx:77`) and for unknown team slugs (`TeamMember.jsx:19`), with noindex. After step 1, add `dist/404.html` and limit the `vercel.json` rewrite to the known routes. Effort S. Who: Dev.
3. **Fix package data and IDs.** IDs: S:SEO-3, S:LOC-1, A:CON-1, C:CON-8.
   - Owner, in the admin: rename "Star Package yaya" and fix the landline-as-WhatsApp line (or confirm the landline really has WhatsApp), the 21 vs 20 nights, "Shuttle" vs "Private transport", the price of 1, and the expired Rabi ul Awal offer.
   - Dev: slugify IDs on save in `api/content/index.js`, reuse `slugify()` from `src/lib/team.js`, and add `encodeURIComponent` in `schemas.js:119`.
   - Effort S. Who: Owner-admin + Dev.
4. **Trust pages and licence.** IDs: S:CON-2, A:GEO-3, C:CON-6. The owner supplies only the registrations actually held: MoRA Umrah operator, DTS, SECP/NTN. The developer shows them in the footer, About, FAQ 33 and `organizationSchema` (`identifier`), and adds `/privacy` and `/terms` (deposit, cancellation, refund). Effort M. Who: Owner-ext + Dev.
5. **Google Business Profile and domain.** IDs: S:LOC-2, S:SEO-4, A:SEO-2.
   - First, decide and register an owned domain (.pk or .com).
   - Then claim or verify the GBP: category "Travel agency", the exact NAP, hours Mon–Fri 11–7 and Sat 11–5, office and group photos. Ask past pilgrims for reviews on WhatsApp.
   - Dev: set `SITE_URL`/`VITE_SITE_URL` (`src/lib/brand.js`), 308-redirect vercel.app to the new domain, swap in the place map embed, and add Directions and "Review us" links and `hasMap`.
   - Effort M. Who: Owner-ext + Dev.
6. **Speed beyond pre-rendering.** IDs: W:CWV-3, W:CWV-5, W:CWV-4, W:CWV-6, W:CWV-9. Cache GET `/api/content` at the CDN. Move `<AuthProvider>` to the admin routes only. Move `admin.css` into `AdminLayout.jsx`. Add `media` to the Arabic font preload. Turn on Speed Insights. Effort S–M. Who: Dev.
7. **Structured data cleanup.** IDs: S:SEO-9, A:GEO-6. Keep one organization node per page. Set the About `mainEntity` to `{ "@id": SITE_URL + "/#organization" }`. Add `addressRegion` "Punjab", the postal code (owner to confirm; 54782 is a guess), and `geo` from the GBP pin. The owner adds the real YouTube and TikTok URLs in Admin > Company. Effort S. Who: Dev + Owner-admin.
8. **Small technical fixes.** Each is effort S, Dev.
   - `robots.txt` (S:SEO-10, A:GEO-7): `Disallow: /admin` and `/api` repeated in every AI group in `scripts/generate-seo.js`, plus an `X-Robots-Tag` noindex header for `/admin` in `vercel.json`.
   - Trailing slash (S:SEO-11): `"trailingSlash": false`.
   - Gallery alt text (S:SEO-8): `alt={img.alt}` in `GalleryGrid.jsx:117`.
   - Footer headings (S:SEO-12): change the H2s in `Footer.jsx` to non-headings.
   - Team URLs (S:SEO-12, A:CON-2): add them to the sitemap, or noindex them if they are only QR business cards (owner's choice).
   - H1 wording (S:SEO-5): include "Umrah packages from Lahore".
9. **Testimonial captions.** IDs: S:CON-1, C:CON-1. Each video gets that pilgrim's real words, labelled "Translated from Urdu", or no caption. Effort S. Who: Owner-admin.

### 4.2 AEO (being the direct answer)

**What is working:** 39 owner-approved, natural-language FAQs on deposits, instalments, mahram, Ramadan and visa timing, all in FAQPage JSON-LD and all kept in the page even when collapsed; prices come from the live admin labels and are never typed into copy.

**What is broken:** the key answers deflect instead of answering; FAQ 7 contradicts FAQs 15 and 17; FAQ 20 says the distance to the Haram is on the card, but it isn't; no answer is dated; "100%" claims are unproven; the FAQ is marked up twice and repeated on two URLs; there are no guide pages and no Urdu answers.

**Prioritised fixes:**

1. **Answer first, then invite contact.** IDs: A:AEO-1, C:CON-12. Each is effort M.
   - FAQ 1 (cost): name the cost drivers. Add "our current packages start from {lowest live price}", filled in by code from `/api/content` with a placeholder token rendered by `FAQSection.jsx`.
   - A packages comparison table built from live data, with a flights column.
   - FAQ 16: name LHE, ISB and KHI.
   - FAQ 22: list the room types (quad, triple, double).
   - FAQ 20: add walking minutes once the package has a distance field.
   - Who: Owner-admin for the wording, Dev for the template and table.
2. **Fix the documents and health answers.** ID: C:CON-7. Rewrite FAQ 7 as a checklist: passport valid 6+ months, photos, CNIC, vaccination certificates, air-ticket copy for land-only packages, and family documents if asked. Check FAQs 6 and 15 against the current Saudi MoH / Nusuk rules (the biometrics and meningitis rules are uncertain) and add "Rules checked: <month year>". Effort M. Who: Owner-admin.
3. **Make the claims honest.** IDs: S:CON-4, A:AEO-3, C:CON-5. The "100%" appears in `site.stats`, `services[0].sublabel` and FAQ 6. Either back it with records (for example, "every visa we filed since X was approved", only if literally true) or drop it. Add "as of 2026" to 25,000+. Keep the figures the owner corrected (2005, 25,000+) identical on Facebook and the GBP. Effort S. Who: Owner-admin.
4. **Dates and freshness.** IDs: A:AEO-2, C:CON-14. The admin stamps `updatedAt` on packages, FAQs and company. Show "Prices updated…" and "Answers reviewed…". Take the sitemap `lastmod` from those dates in `generate-seo.js` instead of the build date (lines 17 and 34). Effort S. Who: Dev.
5. **One clean FAQ.** IDs: S:SEO-7, A:AEO-4. Remove the microdata from `FAQSection.jsx:49-64` and keep the JSON-LD. Make one URL the full FAQ (`/packages` or a new `/faq`) and show 6–8 questions with a link on the other page. Keep all answers in the pre-rendered HTML. Effort S. Who: Dev.
6. **Guides hub, starting with 3 pages.** IDs: C:CON-2, S:CON-3. The cost explainer, the Umrah visa and documents guide from Pakistan, and how to perform Umrah. Add each route to `STATIC_ROUTES` in `generate-seo.js`. Do this after pre-rendering. Effort L. Who: Owner writes, Dev builds.
7. **Urdu answers.** IDs: A:LOC-1, C:CON-11, S:SEO-13. Urdu versions of the top 10–15 FAQs (`lang="ur" dir="rtl"`), with `q_ur`/`a_ur` fields in the admin. A few natural Roman Urdu question headings (for example, "Lahore se Umrah package kitne ka hai?"). Urdu transcripts for the video reviews. Add hreflang only if a real `/ur` page is built. Effort M–L. Who: Owner-admin + Dev.

### 4.3 GEO (being named and cited by AI assistants)

**What is working:** `robots.txt` invites GPTBot, ClaudeBot, PerplexityBot and Google-Extended, and no firewall blocks them; `llms.txt` exists and is accurate; Qafila e Shoq is a unique story no generic agency can copy.

**What is broken:** AI crawlers get an empty page on every URL; the brand was not found in any search tried; there is no licence or MoRA verification in a market where, according to press reports, verification is now the test of trust; the brand and chairman names are spelled several ways and the About story says "Hajj and Umrah"; `llms.txt` is built from old defaults; the two organization nodes conflict.

**Prioritised fixes:**

1. **Pre-render** (same as SEO fix 1). IDs: A:GEO-1, C:CON-3. Without it, nothing else in GEO reaches ChatGPT, Claude or Perplexity. Effort L. Who: Dev.
2. **Build the off-site footprint, in this order.** IDs: A:GEO-2, S:LOC-2, S:SEO-4. Effort L. Who: Owner-ext.
   1. Owned domain.
   2. Google Business Profile with reviews.
   3. Consistent profiles on Facebook (with a username instead of `profile.php?id=…`), Instagram, YouTube and TikTok, each linking to the site.
   4. Pakistani travel directories and local listings.
   5. Submit to Google Search Console and Bing Webmaster Tools after pre-rendering ships.
3. **Licence and verification.** IDs: A:GEO-3, C:CON-6. Check whether the business is on the Ministry of Religious Affairs verified Umrah-operator list. If it is, show the number on the site and in the schema. Claim nothing until it is confirmed. Effort M. Who: Owner-ext.
4. **One consistent identity.** IDs: A:GEO-4, C:CON-4.
   - Pick one brand spelling, "Karwan e Usmania International", and list the variants (Karwan-e-Usmania, the Urdu form) in `alternateName` (`schemas.js:66`).
   - Pick one chairman spelling and use it in the team data, the Qafila section, FAQs 38/39, `llms.txt` and the `About.jsx:27` keywords.
   - Change `about.story[0]` to say Umrah only.
   - Remove the "VIP" references (`Home.jsx:53`, `Packages.jsx:25`, and the fallback in `src/data.js:422-441`).
   - Effort S. Who: Owner-admin + Dev.
5. **`llms.txt` and `llms-full.txt` from live data.** ID: A:GEO-5. Build both in the pre-render step from `/api/content`: company facts, the FAQ text, a package snapshot, and a llmstxt.org link list. Compute years from `company.founded` instead of the hard-coded "21+ years" (`generate-seo.js:82,86`). Effort M. Who: Dev.
6. **One organization node, matching `sameAs`.** IDs: A:GEO-6, S:SEO-9. Same as SEO fix 7. Effort S. Who: Dev + Owner-admin.
7. **A Qafila e Shoq page.** ID: C:CON-10. Build `/qafila-e-shoq` from `site.qafila`, with the leader as a Person. Add Event schema only once real dates and seats exist. Effort M. Who: Owner content + Dev.
8. **Per-package pages.** ID: C:CON-9. Build `/packages/<slug>` once IDs are slugified. Effort M. Who: Dev.
9. **`robots.txt` AI groups** (same as SEO fix 8). ID: A:GEO-7.

## 5. Action plan

### Do now (this week)

**Developer:**
1. Replace the catch-all `<Route path="*" element={<Home/>}/>` with a noindex NotFound page (`App.jsx:77`, `TeamMember.jsx`).
2. Fix `robots.txt` in `scripts/generate-seo.js` (`Disallow: /admin` and `/api` in every group). Add an `X-Robots-Tag` noindex header for `/admin` and `"trailingSlash": false` in `vercel.json`.
3. Add CDN caching to GET `/api/content` (`api/content/index.js`, `s-maxage` + `stale-while-revalidate`, no Set-Cookie). The admin re-fetches with a cache-buster.
4. Move `<AuthProvider>` to the admin routes only (`App.jsx:85`). Move the `admin.css` import from `main.jsx:14` into `AdminLayout.jsx`.
5. Remove the FAQ microdata (`FAQSection.jsx:49-64`). Use `alt={img.alt}` in `GalleryGrid.jsx:117`. Add `encodeURIComponent` on package IDs in `schemas.js:119`. Change the footer H2s to non-headings.
6. Turn on Vercel Speed Insights (`VITE_ANALYTICS=vercel`) to get a "before" baseline for pre-rendering.
7. Start the pre-render script (fix 1 in Section 4.1).

**Owner (in the admin):**
1. Video reviews: give each pilgrim their own caption, or remove the duplicate text.
2. Packages: rename "Star Package yaya" and remove the "Call/WhatsApp: +924235136177 / Website" lines (or confirm the landline really takes WhatsApp). Fix 21 vs 20 nights, "Shuttle" vs "Private transport" and the price of 1. Remove or renew the Rabi ul Awal "Limited time offer".
3. About story: change "Hajj and Umrah" to "Umrah".
4. Back up or soften "100% visa success" in three places: stats, the services line, and FAQ 6.
5. Rewrite FAQ 7 (documents) as a checklist.

**Owner (outside the site):**
1. Decide on and register a domain.
2. Check whether a Google Business Profile already exists for the office.
3. Collect the licence and registration numbers the business actually holds, and check the MoRA verified list.

### Next (this month)

**Developer:**
1. Finish and ship pre-rendering: every route plus `/team/<slug>`, `404.html`, the build-time content snapshot as initial state, a single JSON-LD organization node, a Deploy Hook on admin save, and a GPTBot curl check of each route.
2. Generate `llms.txt` and `llms-full.txt`, and team URLs in the sitemap, from `/api/content` at build. Compute years from `founded`.
3. Slugify package IDs on save and migrate the two existing ones.
4. Stamp `updatedAt` in the admin. Show "Prices updated" and "Answers reviewed". Take `lastmod` from real dates.
5. Add `/privacy` and `/terms` and link them in the footer. Show the licence in the footer, About, FAQ 33 and the schema once the owner provides it.
6. Live-price token for FAQ 1, and a packages comparison table with a flights column.
7. Schema: About `mainEntity` → `/#organization`, `addressRegion`, `postalCode` (once confirmed), `geo` and `hasMap`.
8. Switch to the new domain: `SITE_URL`, a 308 from vercel.app, then submit to Google Search Console and Bing Webmaster Tools.

**Owner:**
1. Set up or verify the Google Business Profile with the exact NAP, hours, photos and the new domain. Start asking pilgrims for Google reviews on WhatsApp.
2. Enter the licence numbers in the admin and write the deposit, cancellation and refund terms.
3. Rewrite FAQs 1, 16, 18, 20 and 22 to lead with a fact. Check FAQs 6 and 15 against current Saudi rules and date them.
4. Pick one spelling each for the brand and the chairman. Add the real YouTube and TikTok links in Admin > Company. Give the Facebook page a username.
5. Write Urdu versions of the top 10–15 FAQs.

### Later (next 2–3 months)

**Developer:**
1. A `/guides` hub with 3 pages (cost, visa and documents, how to perform Umrah).
2. `/packages/<slug>` pages and a `/qafila-e-shoq` page.
3. Structured package fields: Makkah and Madinah nights, hotel, distance to the Haram, and an optional `validThrough` date.
4. Lazy-load gsap where the intro doesn't run. Emit the intro markup and Arabic font preload only where they are needed.

**Owner:**
1. Pakistani directory and citation listings that use the same NAP.
2. Team bios, a company timeline and an office photo on About.
3. Qafila e Shoq departure dates and seats.
4. A seasonal refresh calendar (Ramadan, school holidays).
5. Decide on the Home intro length (W:CWV-7).

## 6. Monthly tracking

**AI-search questions.** Run each one 3 times in ChatGPT (search on), Perplexity, Gemini and Google (note whether an AI Overview appears). Record: brand mentioned yes/no, which URL was cited, and which competitors were named (trips.pk, Tawaf Global, Shamco, Apricot).

*English:*
1. Best Umrah travel agency in Lahore
2. Umrah packages from Lahore price 2026
3. Cheapest Umrah package from Lahore
4. Umrah package without air ticket from Pakistan
5. Ramadan Umrah package Lahore last 10 nights
6. Family Umrah package from Lahore
7. 5-star VIP Umrah package Lahore
8. Umrah travel agency in Johar Town Lahore
9. Is Karwan e Usmania International legit / MoRA verified?
10. Karwan e Usmania International reviews
11. How long does an Umrah visa take from Pakistan?
12. Can a woman go for Umrah without a mahram from Pakistan?
13. Umrah group with an Islamic scholar from Lahore (Qafila e Shoq)

*Roman Urdu:*
14. Lahore se Umrah package kitne ka hai?
15. Sasta Umrah package Lahore 2026
16. Lahore mein Umrah ke liye sab se achi travel agency kaun si hai?
17. Umrah visa Pakistan se kitne din mein lagta hai?
18. Bina mahram aurat Umrah ja sakti hai?
19. Ramzan Umrah package 2027 Lahore
20. Umrah ke liye kaun se documents chahiye?

**Numbers to watch:**
1. **AI mention rate:** how many of the 20 questions name the brand, in each engine. Today it is about 0 (estimated from WebSearch).
2. **Indexed pages and branded impressions** in Google Search Console and Bing Webmaster Tools, after setup.
3. **Google Business Profile:** number of reviews, average rating, calls, and direction requests.
4. **Real-user mobile LCP at the 75th percentile** per route, from Speed Insights. Target under 2.5 s on Packages.
5. **WhatsApp booking clicks from search visitors**, if the analytics events are enabled. Not verified in this audit.

## 7. What was not checked

**Search and AI data:**
- Google Search Console and Bing Webmaster Tools (index coverage, queries, FAQ reports): no access.
- Live answers in ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews: approximated with a US-based WebSearch. Pakistani and Urdu results may differ.
- Whether a Google Business Profile exists, and its NAP and categories.
- Live "Umrah packages Lahore" results and map pack from a Pakistani location.
- Backlinks and citations (no Ahrefs/Semrush); keyword volumes for English, Urdu and Roman Urdu.

**Owner facts:**
- Whether the business is on the MoRA verified Umrah-operator list, and which licences it holds.
- Whether the 100% visa approval, 25,000+ pilgrims and 80+ hotels figures are backed by records.
- The postal code for 436-G1 Johar Town (54782 is a guess).
- Whether the landline can receive WhatsApp.
- Whether the gallery photos are stock (some file names suggest it).
- Whether the TikTok profile exists.
- The contents of the social profiles.
- What the Urdu video reviewers actually say (videos not watched).
- Whether current Saudi rules require meningitis vaccination and in-person biometrics for Pakistani applicants in 1448 AH.
- Exact Rabi al-Awwal 1448 dates (they depend on moon sighting).

**Speed:**
- Real-user field data. CrUX could not be checked because the PSI quota was exhausted.
- INP: no interaction trace was recorded.
- Fresh Lighthouse runs on Home and Packages. The audits relied on the known PSI numbers; local Lighthouse on /about is indicative only.
- The MongoDB Atlas region.
- Whether `/packages` without a trailing slash serves the pre-rendered file. This needs a test deploy.

**Refuted findings:** none were fully refuted. Some details within findings were corrected during verification, and this report already reflects the corrections:
- **Written testimonials:** they are not shown on the live site (videos replace them), so the "Waqas Saleem / VP" mismatch and the VIP testimonial are not visible to visitors (C:CON-1, C:CON-4, A:CON-2).
- **YouTube and TikTok links:** they are not dropped after JavaScript runs. The page carries two conflicting organization nodes with the same `@id` (A:GEO-6).
- **Team roles:** the role line (`roleAr`) is already marked `lang="ar"`. Only `nameAr` (line 69) needs checking (C:CON-11).
- **Team schema:** Person schema with `worksFor` already exists on team pages. Only the bio data is missing (C:CON-13).
- **H1 wording:** downgraded to low, because titles already target the query (S:SEO-5).
- **FAQ duplication:** low impact, because FAQ rich results are now limited to government and health sites (S:SEO-7).
- **Founding year and pilgrim count:** 2005 and 25,000+ are documented owner corrections from 12 October 2026, not inflated claims (C:CON-5).
- **Lazy-loading GSAP:** it helps inner pages and repeat visits only, because the Home intro needs GSAP straight away (W:CWV-4).
- **Arabic font preload:** on desktop the Arabic nav label is visible on every route, so only the phone preload is wasted (W:CWV-6).
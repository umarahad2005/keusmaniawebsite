# Karwan e Usmania International: SEO, AEO and GEO report (updated)

**Site:** https://usmania.vercel.app · **Date:** 13 October 2026 · **Replaces:** the 12 October audit (`SEO-AEO-GEO-AUDIT-2026-10-12.md`, kept for history)

**How this was checked:**
- **Four skills:** seo-audit, ai-seo, content-strategy and core-web-vitals each re-tested the site after the quick fixes, in a headless browser on a production build.
- **Fixes to the re-test findings:** what the re-tests found was fixed, and the site was built again.
- **Live site:** after the deploy (commit `5d20a66`), the live site was checked with real requests.
- **Owner content:** the live admin content was read as it stands today.

---

## 1. Summary

The site was fast, and it is now technically clean for Google:
- a real "page not found" page
- correct crawler rules
- a full sitemap
- one organization record
- FAQ marked up once
- content served from Vercel's cache in Asia instead of the US

Two problems are left, and they are what hold the grades down:

1. **AI assistants still see an empty page.** The site is still put together in the visitor's browser. Google does that step and sees the real pages. ChatGPT, Claude and Perplexity don't, and neither do WhatsApp and Facebook link previews. They get the same empty page with the Home title on every link. The fix is **pre-rendering**: build real HTML for each page when the site is built. This is the next developer job.
2. **Owner content still weakens trust.** Visitors see what the admin holds:
   - the About story says "Hajj and Umrah"
   - both video reviews have the same caption
   - there is a "VIP package" testimonial
   - "100% visa success" appears with nothing to back it up
   - FAQ 7 contradicts other answers
   - there is no licence number

   Only the owner can fix these.

## 2. Scorecard

| Area | 12 Oct | 13 Oct (now) | What would move it next |
|---|---|---|---|
| **SEO** (Google ranking) | Needs work | **Fair**: the technical basics are fixed | Pre-rendering, an owned domain, Google Search Console |
| **AEO** (being the direct answer) | Needs work | **Needs work**: the markup is fixed, but the answers are still vague or contradictory | Owner rewrites of FAQs 1, 7 and 20, plus dates on facts |
| **GEO** (named by AI assistants) | Weak | **Weak**: crawler access is fixed, but crawlers still get an empty page | Pre-rendering, Google Business Profile, licence number |
| **Speed** | Good (Home 94, Packages 82) | **Good**, same lab score | Pre-rendering (Packages LCP is about 4 s, target 2.5 s) |

## 3. What changed since 12 October (all live)

| Fix | Result on the live site |
|---|---|
| "Page not found" page | Unknown addresses and unknown team pages show a proper 404 page that tells Google not to index it, instead of a copy of Home |
| `robots.txt` | `/admin` and `/api` are blocked for every crawler, and 11 AI crawlers are named, including OAI-SearchBot, Claude-SearchBot and Perplexity-User |
| Sitemap | 13 addresses, including the 8 team pages |
| `llms.txt` and `llms-full.txt` | Built from live content: years, pilgrim count and Qafila leader. The full version has all 39 FAQs. |
| Trailing slash | `/packages/` redirects permanently (308) to `/packages` |
| `/admin` and `/api` | Send `X-Robots-Tag: noindex` |
| Content API | Served from Vercel's cache (checked: `X-Vercel-Cache: HIT`). The admin always reads fresh. Visitors see admin edits within about a minute. |
| Public pages lighter | The admin login check and admin styles no longer load for visitors |
| Structured data | One organization record on every page. FAQ in one format only. Package links use clean names (`#star-package`). |
| Images and headings | Gallery photos have descriptive alt text. Footer column titles are no longer headings. The page header image shows without a fade-in. |
| Umrah-only wording in code | No "Hajj" or "VIP" in the built-in text. Placeholder packages show no fake prices. Search keywords match the real packages. |
| Package card links | Opening `/packages#star-package` in a new tab scrolls to the card |

## 4. What each skill reports now

### 4.1 seo-audit

**Fixed (10):**
- soft 404 (client side)
- FAQ marked up twice
- gallery alt text
- robots groups
- trailing slash
- footer headings
- team pages in the sitemap
- single organization record
- clean package IDs
- one H1 and its own canonical on every page

**Still open:**

| Issue | Who |
|---|---|
| Every page is sent as the same HTML file with the Home title and canonical, so non-JS crawlers and link previews see Home | Dev (pre-rendering) |
| Unknown addresses still return HTTP status 200. A true 404 needs pre-rendering. | Dev (pre-rendering) |
| The About page still adds a third, anonymous organization record | Dev (small) |
| Team pages are linked only from inside a popup. Each team card needs a normal link. | Dev (small) |
| The same 39 FAQs appear on both Home and Packages. Pick one page to carry them. | Dev (small) |
| The About, Gallery and Contact headings don't mention Umrah or Lahore | Dev + owner |
| Still on `vercel.app`, with no domain of your own | Owner |
| No Google Business Profile, Directions or Reviews link | Owner |

### 4.2 ai-seo

**Fixed (7):**
- AI crawler rules
- one organization record
- FAQ marked up once
- soft 404
- team sitemap
- Umrah-only wording in the code
- `llms.txt` built from live content, plus `llms-full.txt`

**Still open:**

| Issue | Who |
|---|---|
| GPTBot, ClaudeBot and PerplexityBot still get an empty page on every route. This is the main GEO blocker. | Dev (pre-rendering) |
| The live About story still says "Hajj and Umrah" and overrides the corrected code | Owner (admin) |
| The chairman's name is spelled two ways ("Burhan ud Din" vs "Burhan uddin") | Owner (pick one) |
| The YouTube and TikTok links are empty. Facebook is a `profile.php?id=` link with no username. | Owner (admin) |
| No licence or MoRA verification. Reports say only MoRA-verified companies may provide Umrah. | Owner |
| The brand doesn't appear in search results off the site (no Google Business Profile, directories or Search Console) | Owner |
| The cost answer avoids a figure; there's no comparison table | Dev + owner |
| No dates on facts ("Prices updated…", "Answers reviewed…") | Dev |
| No Urdu answers | Owner + dev (later) |

### 4.3 content-strategy

**Fixed (6):**
- Hajj and VIP removed from the code
- neutral placeholder packages
- gallery alt text
- FAQ marked up once
- a helpful 404 page
- `llms.txt` says "Umrah only"

**Still open (live admin content, checked today):**

| What visitors see now | Fix | Who |
|---|---|---|
| About story: "…the sacred journey of Hajj and Umrah…" | Change it to Umrah | Owner (admin) |
| Mr. Haseeb and Ms. Fareeha video reviews have the **same** caption | Give each review its own caption or translation | Owner (admin) |
| Testimonial "VIP package was worth every rupee" / "VIP Umrah · 2023" | Edit it or remove it | Owner (admin) |
| "100% Visa Success Rate" in the stats, the services line and FAQ 6 | Back the claim up or soften it | Owner (admin) |
| FAQ 7: "Only your passport and photographs", which contradicts the vaccination answers | Rewrite it as a checklist | Owner (admin) |
| FAQ 20 says distance "is listed on each package card", but it isn't | Add the distance to the packages, or change the answer | Owner (admin) |
| Rabi ul Awal package: the text says 14 + 6 = 20 nights, but the card says 21 | Fix the nights | Owner (admin) |
| Both packages end with "Call/WhatsApp: +924235136177", the landline labelled as WhatsApp | Remove that line | Owner (admin) |
| "Limited time offer" on the Rabi ul Awal package, after Rabi ul Awal has ended | Remove it or renew it | Owner (admin) |
| No licence number, no privacy or terms pages | Provide the numbers and the text | Owner |
| Team bios are empty; no company timeline or office photo | Write them | Owner (admin) |
| No guide pages (cost, visa and documents, how to perform Umrah), no page for each package, no Qafila e Shoq page | Build them after pre-rendering | Dev + owner (later) |

Already done by the owner: the package name "Star Package yaya" was renamed to "Star Package", and the price is now PKR 375,000. The package's internal ID still contains "yaya", but it's no longer shown publicly.

### 4.4 core-web-vitals

**Fixed (6):**
- Content API cached (live HIT)
- Admin login check removed from public pages: `/api/auth/me` calls on public pages went from 1 to 0
- Admin CSS moved out of the public CSS (5.5 KB less)
- Page header image no longer starts invisible
- Neutral placeholders: layout shift on Packages dropped from 0.021 to 0.001
- No increase in bundle size

**Still open:**

| Issue | Who |
|---|---|
| The main image still waits for about 500 KB of JavaScript before it shows (Packages LCP about 4 s) | Dev (pre-rendering) |
| Content still arrives after the first paint. It needs a content snapshot built into each page. | Dev (pre-rendering) |
| GSAP and Lenis load on every page before the first paint | Dev (later) |
| The Arabic font preloads on phones, where it isn't needed | Dev (small) |
| No real-visitor speed data, because Speed Insights is off | Dev + you (switch it on in Vercel) |
| Length of the Home intro animation | Owner decision |

## 5. Action plan from today

### Developer: next
1. **Pre-render every page.** This is the single biggest fix for SEO, GEO and speed:
   - real HTML for every page and team page
   - a true 404
   - a content snapshot built into each page
   - an automatic rebuild when the admin saves
   - each page checked as GPTBot sees it
2. Small clean-ups:
   - About page uses the main organization record
   - a normal link on each team card
   - FAQ on one page only
   - no Arabic font preload on phones
3. Dates on facts ("Prices updated…", "Answers reviewed…"), and sitemap dates taken from real edit dates.
4. `/privacy` and `/terms` pages, and the licence number in the footer, About, FAQ and structured data, once the owner provides them.
5. Switch on Speed Insights (Vercel setting plus `VITE_ANALYTICS=vercel`).

### Owner: in the admin (about 1 hour)
1. About story: change "Hajj and Umrah" to "Umrah".
2. Video reviews: give each review its own caption.
3. Testimonials: edit or remove the "VIP" one.
4. Packages:
   - fix 20 vs 21 nights
   - remove the landline "Call/WhatsApp" line
   - remove or renew "Limited time offer"
5. Back up or soften "100% visa success" (stats, services, FAQ 6).
6. Rewrite FAQ 7 as a checklist. Fix FAQ 20 (distance). Make FAQ 1 open with a starting price.
7. Add the YouTube and TikTok links. Give the Facebook page a username.
8. Pick one spelling of the chairman's name.

### Owner: outside the site
1. Register a domain of your own.
2. Create or claim the Google Business Profile, using the exact address, phone and hours.
3. Provide the licence and MoRA registration numbers.
4. Provide the deposit, cancellation and refund terms, and the privacy text.

## 6. Not checked in this update
- **Live speed scores:** Lighthouse wasn't re-run on the live site. The PageSpeed API quota is used up, and lab numbers from this machine are unreliable. Re-run pagespeed.web.dev on `/` and `/packages`.
- **What AI assistants actually say:** ChatGPT, Perplexity and AI Overviews weren't asked directly.
- **Google's index status:** this needs Google Search Console, which isn't set up.

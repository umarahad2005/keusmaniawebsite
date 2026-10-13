# Karwan e Usmania International: SEO, AEO and GEO implementation plan

**Starts:** 13 October 2026 · **Based on:** `SEO-AEO-GEO-REPORT-2026-10-13.md` · **Who:** Dev = developer, Owner = the business

**The three goals, in plain words:**
- **SEO:** Google shows us for "Umrah package Lahore" and similar searches.
- **AEO:** when someone asks a question ("How much is Umrah from Pakistan?"), our answer is the one shown: Google's answer box, People Also Ask, voice assistants.
- **GEO:** ChatGPT, Perplexity, Claude and Google's AI Overviews name and recommend Karwan e Usmania International.

All three rest on the same three foundations:
1. Crawlers can read every page.
2. The facts are clear, consistent and dated.
3. Other sites confirm we exist (Google Business Profile, directories, reviews).

The plan below builds those foundations in order.

---

## Phase 0: done (12–13 October)

| Done | Helps |
|---|---|
| **Pre-rendering:** every page and team page is real HTML with its own title, canonical, social card and structured data. Unknown addresses return a true 404. | SEO, AEO, GEO, speed |
| Content snapshot in each page, so the old default packages no longer flash first | Speed, trust |
| Admin save triggers a rebuild (needs the Deploy Hook set up in Vercel, see Phase 1) | Freshness |
| `robots.txt`, sitemap with team pages, `llms.txt` and `llms-full.txt` built from live content | GEO |
| One organization record, FAQ marked up on Home only, clean package links | SEO, AEO |
| Content API cached in Asia; admin code no longer loaded for visitors | Speed |
| Defaults in code: no "Hajj", "VIP" or "100%"; FAQ 7 as a checklist; FAQ 20 no longer claims distances are on the cards | Trust |
| A trust-fix script for the live content is ready (`scripts/apply-trust-fixes.mjs`). It needs your approval to run, see Phase 1. | Trust, AEO |

---

## Phase 1: this week (trust and access)

| # | Task | Who | Time | Done when |
|---|---|---|---|---|
| 1.1 | Run the trust-fix script: About story says Umrah, Ms. Fareeha's duplicate caption replaced, VIP testimonial removed, "100%" changed to "24/7 On-ground Support", FAQ 6/7/20 fixed, nights 20, landline "Call/WhatsApp" line removed, prices match the labels | Dev (with your OK) | 5 min | The live site shows the new text |
| 1.2 | Write Ms. Fareeha's real caption: what she says in the video, translated | Owner | 10 min | Caption is in the admin |
| 1.3 | Remove or renew the "Limited time offer" on the Rabi ul Awal package (Rabi ul Awal has ended) | Owner | 2 min | |
| 1.4 | **Licence:** send the travel agency licence number, DTS or Ministry of Tourism registration, and **MoRA** Umrah authorisation (or tell us it's in process) | Owner | — | Dev shows it in the footer, About, FAQ "registered company" and structured data |
| 1.5 | Create a **Vercel Deploy Hook** (Project → Settings → Git → Deploy Hooks, branch `main`) and add its URL as the env var `VERCEL_DEPLOY_HOOK_URL` | You | 5 min | An admin save starts a deploy |
| 1.6 | Switch on **Speed Insights** in Vercel and set `VITE_ANALYTICS=vercel` | You | 5 min | Real-visitor speed data appears |
| 1.7 | **Google Search Console** and **Bing Webmaster Tools:** verify the site and submit `sitemap.xml` | You + Dev | 20 min | Both show "Sitemap: success" |

## Phase 2: weeks 2–4 (identity outside the site)

AI assistants recommend businesses that other sources confirm. This phase is mostly the owner's.

| # | Task | Who | Done when |
|---|---|---|---|
| 2.1 | **Own a domain** (for example `karwaneusmania.com` or `.pk`). Dev points it at Vercel, redirects `usmania.vercel.app` to it with a 308, and updates `SITE_URL`. | Owner buys, Dev sets up | The new domain serves the site |
| 2.2 | **Google Business Profile:** category "Travel agency" (and "Hajj and Umrah agency" if offered). Use the exact name, address, phone and hours from the site, plus photos of the office and team. | Owner | The profile is verified |
| 2.3 | Ask every returning pilgrim for a **Google review** (a short WhatsApp message with the review link). Target: 20 reviews in 60 days. | Owner | 20+ reviews |
| 2.4 | **One spelling** for the brand ("Karwan e Usmania International") and the chairman ("Pirzada Burhan ud Din Ahmed Usmani" or "…uddin…", pick one). Use it everywhere: site, Google Business Profile, Facebook, Instagram. | Owner decides, Dev applies | |
| 2.5 | **Social profiles:** give the Facebook page a username (not `profile.php?id=`) and add the YouTube and TikTok links in Admin → Company | Owner | Links appear in the footer and schema |
| 2.6 | **Listings** with the same name, address and phone: Google Maps, Bing Places, Apple Business Connect, plus Pakistani directories and travel forums | Owner | 5+ listings |
| 2.7 | `/privacy` and `/terms` pages: deposit (50%), cancellation and refund rules. Owner provides the rules, Dev builds the pages. | Owner + Dev | Linked in the footer |

## Phase 3: month 2 (become the answer: AEO)

| # | Task | Who | Done when |
|---|---|---|---|
| 3.1 | **Answer first:** rewrite FAQs 1 (cost), 16 (hotels), 18 (rooms), 22 (transport) so the first sentence is a fact, e.g. "Umrah from Lahore starts at PKR 78,500 per person without flights…". Dev fills the starting price from the live packages, so it is never out of date. | Owner + Dev | Each answer starts with a fact |
| 3.2 | **Dates on facts:** show "Prices updated <date>" on packages and "Answers reviewed <month year>" on the FAQ. The sitemap takes its dates from real edit dates. | Dev | Visible on the pages |
| 3.3 | **Package comparison table** on `/packages`: nights in Makkah and Madinah, hotel and star rating, distance to the Haram, flights yes/no, transport, price | Dev (admin fields) + Owner (data) | Table is live |
| 3.4 | **Own page for each package:** `/packages/<name>`, with the full itinerary, the inclusions, and `TouristTrip` + `Offer` structured data | Dev | In the sitemap |
| 3.5 | **A dedicated FAQ page** (`/faq`) grouped by topic (booking, visa and documents, travel, hotels, Qafila). Home shows the top 8 and links to it. | Dev | `/faq` carries the FAQ structured data |
| 3.6 | Check the visa and vaccination answers against current Saudi and Nusuk rules every quarter, and add "Rules checked: <month year>" | Owner | Dated |

## Phase 4: months 2–3 (topic authority: SEO + GEO)

Pilgrims research before they pick an agency, and AI assistants quote the pages that explain things clearly.

| # | Page | What it covers |
|---|---|---|
| 4.1 | `/guides/umrah-cost-from-pakistan` | What makes up the price (visa, flights, hotels, transport), a sample breakdown, how to compare packages |
| 4.2 | `/guides/umrah-visa-and-documents` | Nusuk and e-visa steps, the document checklist, vaccination certificates, processing time |
| 4.3 | `/guides/how-to-perform-umrah` | Step by step: ihram, tawaf, sa'i, halq, with the duas. Reviewed by the chairman, an Islamic scholar. |
| 4.4 | `/qafila-e-shoq` | The scholar-led programme: who it's for, the itinerary, how to apply, past groups. `Event` structured data once real dates and seats exist. |
| 4.5 | `/guides/ramadan-umrah` and `/guides/umrah-for-women-and-elderly` | When to book, rules, practical tips |

For each guide:
- One clear author: the chairman, with his credentials.
- A "Last reviewed" date.
- A short summary at the top that answers the main question in 2–3 sentences (this is what AI assistants quote).
- Links to the matching package.

**Urdu:** after the English guides, add Urdu versions of the top 10–15 FAQs and the cost and visa guides. Use Roman Urdu headings where people search that way ("Umrah package price Lahore"), and add `hreflang` once both languages exist.

## Phase 5: every month (measure)

| Check | Tool | Target by month 3 |
|---|---|---|
| Brand search ("Karwan e Usmania") shows our site and Google Business Profile | Google | First result |
| Impressions and clicks for "Umrah package Lahore", "Umrah from Lahore" | Search Console | Rising each month |
| Pages indexed | Search Console | All sitemap URLs |
| Ask ChatGPT, Perplexity, Gemini and Google (AI Overview) the same 10 questions (list in the 12 October audit, Section 6) | Manual, recorded in a sheet | Named in at least 3 of 10 |
| Core Web Vitals from real visitors (LCP, INP, CLS) | Vercel Speed Insights | All "Good" |
| Google reviews | Google Business Profile | 20+, average 4.5+ |

---

## Your next three actions
1. Reply "**run the trust fixes**". I can't write to the live database without your OK, and the permission system blocked my attempt. Or run it yourself: `! cd keu-website && node scripts/apply-trust-fixes.mjs --apply` (it saves a backup first).
2. Send the **licence and MoRA numbers**, and **Ms. Fareeha's caption**.
3. In Vercel: create the **Deploy Hook**, set `VERCEL_DEPLOY_HOOK_URL`, and switch on **Speed Insights**.

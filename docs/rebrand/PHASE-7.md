# Phase 7 — Launch (LIVE 2026-10-11)

**The new site is live at https://usmania.vercel.app** (branch `rebrand/keui` fast-forwarded into `main`; Vercel deploys `main` to production). The original runbook is kept below.

## Launch log (2026-10-11)

1. Pushed `rebrand/keui` → Vercel preview built (previews are behind Vercel login, so public checks ran on production).
2. Applied the 13 content fixes (`apply-content-corrections.mjs --apply`, backup `backups/site-before-launch-2026-10-11T16-40-54-048Z.json`): name, tagline, 2008, **WhatsApp 923334883578**, address, postcode cleared, landline, hours, social links, testimonial labels, FAQs. Team applied earlier (`--only=team`).
3. Merged to `main` → production. Verified live: every `wa.me` link → 923334883578; hours, 5,000+, 8 team members, corrected FAQs; no console errors.
4. Post-launch fixes deployed: motion set-up deferred until idle (the live site measured ~2.2 s of start-up blocking), analytics made opt-in (fixes a console error), header-photo preload, chapter heading level, hero dark ground.

## Phase 6 results on the live site (Google PageSpeed Insights, pagespeed.web.dev)

| Page | Device | Perf | A11y | Best pr. | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Home | mobile | **94** | 100 | 100 | 100 | 2.9 s | 20 ms | 0 |
| Home | desktop | **99** | 100 | 100 | 100 | 0.6 s | 10 ms | 0 |
| Packages | mobile | **82** | 100 | 100 | 100 | 4.1 s | 50 ms | 0.017 |
| Packages | desktop | **99** | 100 | 100 | 100 | 0.8 s | 40 ms | 0.021 |

Gate (mobile Perf ≥ 90, LCP ≤ 2.5 s, TBT ≤ 200 ms, CLS ≤ 0.05): **Home passes except LCP (2.9 s); Packages passes TBT/CLS but not Perf/LCP.** PSI's LCP breakdown for Packages: the photo now loads in 0.45 s, but 1.9 s is "element render delay" — the page is drawn by JavaScript. The remaining fix is pre-rendering pages at build time (HTML arrives ready); recommended as a follow-up rather than a launch blocker. Desktop passes everywhere.

**Google Rich Results test**: Packages — 3 valid items (Breadcrumbs, Local business, Organization); Home — 2 valid (Local business, Organization). Non-critical warnings only. (Google no longer shows FAQ rich results for ordinary businesses, so FAQ markup is not listed as eligible.)

**Share card**: `og:image` = `/og/home.jpg` (1200×630, 90 KB) served publicly with title and description.

## Follow-ups (2026-10-12)

- **Team grid** shows the Arabic designation under the English one (from the printed cards).
- **Photo speed.** The About header photo loaded slowly because Cloudinary creates each resized version the first time it is requested. Serving the photos from the site itself was built and measured, then reverted: Vercel answers Pakistan from **Singapore (sin1)**, while Cloudinary's CDN (Fastly) answers from nearby (~56 ms) and serves smaller AVIF. Photos stay on Cloudinary, and `npm run warm:images` (`scripts/warm-images.mjs`) now pre-generates every photo at every width and format the pages request, so no visitor waits for a first-time resize. **Run it again after adding photos in the admin.** The Home hero poster is now preloaded on Home only.
- **Local development:** `npm run dev` (web + API). `scripts/dev-api.js` uses public DNS for the MongoDB lookup (this machine's DNS refuses it). Note: the local API uses the production database, so saving in the local admin changes the live site.
- **Admin login:** no default password exists in the code. It is whatever `ADMIN_EMAIL` / `ADMIN_PASSWORD` are set to — in `keu-website/.env` locally and in the Vercel project's environment variables for the live site. To change it, edit the Vercel variables and redeploy (old sessions are signed out automatically).
- **FAQ questionnaire** for the client: `docs/rebrand/KEUI-FAQ-Questionnaire.pdf` (rebuild with `node docs/rebrand/faq-questionnaire/build.mjs`). Part A: the 9 live answers to confirm or correct; Part B: 36 new questions by topic; Part C: their own questions.

## Phase 8 — owner questions

All twelve answers in DESIGN-LANGUAGE §8.1 are applied on the live site (18+ years with founding year 2008; licences/postcode hidden until supplied; Umrah only; corrected FAQ and testimonial labels; approved artwork, hero framing, Madinah loop and booking steps; new hours; "Waqas Saleem"; new social links; host-agnostic build with Cloudinary + MongoDB). Still open, waiting on material from the owner: licence numbers and postcode (slots hidden), the Qafila seal retrace and the leader photo (not shown), and the client's FAQ answers (questionnaire above).

## Still to do by the owner (needs the admin login or a phone)

- Vercel project → switch on **Web Analytics** and **Speed Insights**, then add the environment variable `VITE_ANALYTICS=vercel` and redeploy (until then tracking stays off by design).
- Upload video reviews in **/admin/video-reviews** (tick consent + "Show on website"); they then replace the written testimonials and play on the page.
- Optional: upload a background track in **/admin/sound**; Abdul Rahman Khan's photo in **/admin/team**.
- Paste the site link in WhatsApp to see the share card; tap the WhatsApp buttons on a phone (incl. inside WhatsApp's own browser); send one test enquiry through the contact form.
- Two-week check: Vercel Speed Insights (real visitors) and WhatsApp-click counts.

**Rollback**: Vercel → Deployments → promote the previous production deployment. Content: restore `data` from the backup file.

---


## Done in code

| Item | Detail |
|---|---|
| Measurement (step 5) | `src/lib/analytics.js`: Vercel **Speed Insights** (real-visitor Core Web Vitals) and **Web Analytics**, a **"WhatsApp click"** event on every `wa.me` link (with the section and page, no message text or numbers) and a **"Hero revealed"** event carrying its time (for the p75 ≤ 3.0 s field gate). Loads only on a Vercel host (`*.vercel.app`, or `VITE_ANALYTICS=vercel` for a custom domain on Vercel); `VITE_ANALYTICS=off` disables it, so another server is unaffected. Custom events need Vercel Pro (or Analytics Plus); Speed Insights and Web Analytics must be switched on in the Vercel project settings |
| Hosting headers | `vercel.json`: long-term caching for `/assets` and `/fonts`; a day (plus stale-while-revalidate) for posters, share cards, icons and the manifest; `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` on every response |
| Content fixes ready (steps 1–2) | `scripts/apply-content-corrections.mjs` applies the approved text from `content-corrections.md` to the live `site` row with `$set` only (the row is never deleted or replaced). Preview: `node scripts/apply-content-corrections.mjs`; apply: add `--apply` (it backs up the row to `docs/rebrand/backups/` first). Current preview: **13 fields** — name, tagline, founded 2008, **WhatsApp +923304211900 → 923334883578**, street, postcode cleared, landline, hours, Facebook/Instagram links, two testimonial labels, the 9 FAQs |
| TikTok link | code defaults and `index.html` now use the live `https://www.tiktok.com/@keusmania` |
| Repository hygiene | root `.gitignore` keeps out the 20 MB design-tool folder, database backups (production data), source media duplicates and stray letterhead copies |

## ⚠ Launch blocker

The live database still holds the **old WhatsApp number (+92 330 4211900)**. The new site reads the number from the database, so until the content fixes are applied (or the owner re-saves `/admin/company`), **every booking button would open a chat with the old number.** Apply the fixes before, or at the same moment as, the new design goes live. (The current live site already reads the same field, so applying them early also fixes today's site.)

## Runbook

1. **Owner confirms hosting**: Vercel Pro on `usmania.vercel.app` (or the other server). Vercel project root = `keu-website`, build `npm run build`, output `dist`. Environment variables unchanged (MongoDB, Cloudinary, auth, SMTP); optional `SITE_URL`/`VITE_SITE_URL` if the address changes.
2. **Preview deploy**: push `rebrand/keui` → Vercel builds a preview URL (does not touch production).
3. **On the preview** (the rest of Phase 6):
   - PageSpeed Insights mobile for `/` and `/packages` (gate: Perf ≥ 90, LCP ≤ 2.5 s, CLS ≤ 0.05, TBT ≤ 200 ms).
   - Google Rich Results test; paste the URL in WhatsApp and check the share card.
   - Log in to `/admin`: open every editor and save once (unknown keys must survive); upload one video review and one background track; fill one team member's digital card details.
   - Send one test enquiry through the contact form.
   - Phones: a budget Android in Chrome **and inside WhatsApp's in-app browser**, an iPhone; tap every WhatsApp button (nav, hero, cards, CTA chips, FAB topics, thumb bar, Qafila, team card) and check the number and message.
4. **Content fixes**: `node scripts/apply-content-corrections.mjs --apply` (or the owner re-saves company, FAQs and testimonials in the admin).
5. **Go live**: merge `rebrand/keui` into `main` (or promote the preview to production in Vercel).
6. **Switch on** Speed Insights and Web Analytics in the Vercel project.
7. **Two-week gate**: time to the first package card (p50) no worse than the old site; check WhatsApp-click counts by section.

**Rollback**: in Vercel, promote the previous production deployment (one click). Content: write the backup's `data` back to the `site` row.

## Team applied (2026-10-11)

From the owner's printed cards (folder `card/`): the live team now has the six card members with designation, Arabic name and title, mobile/WhatsApp and email (existing photos kept), Abdul Rahman Khan added (photo still to come), and the two members without a card (Logistics, Graphics) unchanged. Applied with `--only=team` after a backup (`backups/site-before-launch-2026-10-11T16-30-48-500Z.json`). The other 13 content fixes (including the WhatsApp number) are still pending.

## Still waiting on the owner

- Hosting decision (Vercel Pro or own server).
- Abdul Rahman Khan's photo (admin → Team), optional short bios, and whether Umer Ahad and Abubakar Moeen stay on the team.
- A background track (instrument-free nasheed or Haram ambience is recommended) — uploaded in `/admin/sound`.
- Optional: licence numbers, postcode, Qafila seal retrace, leader photo (all hidden until supplied).

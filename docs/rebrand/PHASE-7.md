# Phase 7 — Launch (prepared 2026-10-11)

All code is on the git branch **`rebrand/keui`** (not pushed, not deployed). This page is the launch runbook.

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

## Still waiting on the owner

- Hosting decision (Vercel Pro or own server).
- The updated team list with designations and card details (mobile, WhatsApp, email, short bio, social links, photo).
- A background track (instrument-free nasheed or Haram ambience is recommended) — uploaded in `/admin/sound`.
- Optional: licence numbers, postcode, Qafila seal retrace, leader photo (all hidden until supplied).

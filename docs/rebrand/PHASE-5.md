# Phase 5 — Identity sweep, SEO, favicons (2026-10-11)

The old name, tagline, founding year, address, domain, Hajj wording and navy palette are gone from the code. Build passes; checked in Chrome (structured data, head tags, icons, admin login).

## Changes

| Area | What changed |
|---|---|
| Brand constants | New `src/lib/brand.js`: `SITE_URL` (`https://usmania.vercel.app`, overridable with `VITE_SITE_URL` since hosting is undecided), `BRAND`, `BRAND_FULL`, `TAGLINE`, `DESCRIPTION`, `LOGO_PATH`, `ogCard()` |
| Structured data | `schemas.js`: name "Karwan e Usmania International", Umrah-only description, `foundingDate` from data (2008), logo `/brand/keui-logo-512.png`, image = share card, postcode only when supplied, landline as telephone + WhatsApp contact point. **Opening hours are now parsed from the admin's hours rows** (was hard-coded Mon–Sat 9–7 / Sun 11–4). **`priceRange` is derived from the live `priceLabel`s** (was a fixed "PKR 185,000 – 550,000"). Package offers take their price from the label, never the untrusted numeric `price`; `touristType` is always Umrah. Gallery/team image URLs now resolve Cloudinary ids correctly |
| Page heads | All five pages use `SITE_URL` canonicals and their own share card (`/og/<page>.jpg`); `organizationSchema` gets the live packages |
| `index.html` | New title, description, author, `og:site_name`, `og:image` (+ size and alt), `twitter:image`, canonical; static JSON-LD rewritten (new name and address, no postcode, no fixed price range, contact point, TikTok added to `sameAs`); `favicon.svg` and `site.webmanifest` linked |
| SEO files | `generate-seo.js`: new domain (overridable with `SITE_URL`), new robots header, sitemap without package fragment URLs (fragments are not indexed separately and the live ids are in the database), `llms.txt` rewritten from the owner's facts only: Umrah only, since 2008, letterhead address and numbers, hours from data, no prices, no reply-time promise |
| Code defaults (`data.js`) | name, tagline "Your Journey to the Holy Land, Our Priority", `founded: 2008`, why-us "Since 2008", About story[0] now says "Umrah" and uses the new name. Testimonial quotes stay word for word (one quote mentions the old spelling; it is the pilgrim's own words) |
| Icons | `generate-icons.js` rewritten to render the vector KU mark traced from `newlogo.png` (`src/assets/brand/ku-mark.svg`): `favicon.svg`, `favicon.ico` (16/32/48), PNGs, `apple-touch-icon` and 192/512/maskable icons on a paper plate, `brand/keui-logo-512.png`, and `site.webmanifest` (theme `#004828`) |
| Share cards | New `scripts/generate-og.js` (`npm run generate:og`): 1200×630 paper cards — full lockup, margin rule, ribbon sweep, the page's still in a framed plate. JPEG, 71–90 KB each (well under WhatsApp's limit). `public/og/{home,packages,about,gallery,contact}.jpg` |
| Legacy palette | The legacy tokens the admin uses are remapped from navy to the KEUI greens and golds (names kept), so the admin now follows the brand. Admin logo switched to the new mark |
| Elsewhere | Email sender name and notification text (`api/_lib/email.js`), `package.json` description, script and file headers |

## Acceptance

| Check | Result |
|---|---|
| Grep `src`, `index.html`, `scripts` (excluding admin and comments) for `keusmania.vercel`, `923314211935`, `0d1b35`, `Mansoor`, `info@keusmania`, `ضیوف`, `/logo.png` | **nothing found** |
| JSON-LD parses on every page | yes (0 parse errors); hours, price range and offers verified on `/packages` |
| Rich Results test | **not run yet**: needs a public URL (Phase 6, on the preview deploy) |
| WhatsApp link preview shows the card | **not run yet**: needs the deployed URL (Phase 6/7) |
| Console | no errors |

## Notes

- Hajj appears only in two defensive category maps (`PackageCard`, `PackagesGrid`), which stay hidden unless a Hajj package is ever added in the admin.
- `public/logo.png` is now unused by the code; it is left in place in case anything external links to it.
- Social crawlers do not run JavaScript, so link previews for any URL show the `index.html` defaults (the home card). Per-page cards work for search engines; per-page previews would need pre-rendering (a later option).

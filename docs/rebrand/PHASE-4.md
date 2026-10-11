# Phase 4 — Inner pages (2026-10-11)

Packages, About, Gallery and Contact are rebuilt to DESIGN-LANGUAGE §4 and §5.2. Build passes; tested in Chrome at 1280 px wide and at 375 px (through an iframe).

## What shipped

| Area | Files |
|---|---|
| Split PageHeader | `PageHeader.jsx`: breadcrumb, running head, H1, optional Urdu line, lead; the still in a 20 px inset frame with the letterhead corner device. No type on images. `data-page-header` keeps the FAB/thumb-bar sentinel working |
| Packages | `pages/Packages.jsx`: "Umrah, the way it should be."; sticky 44 px chips (`PackagesGrid sticky`), Flip reorder over 600 ms, `aria-live` count, focus stays on the chip; trust line and licence slot; Qafila chapter → FAQ (03) → closing letter (04). Removed the duplicate hash scroll (`useScrollRestoration` already handles `/packages#id`). Adds `html.route-packages` (scroll-padding for the sticky chips) and preloads Nastaliq on this route only |
| Qafila e Shoq | `QafilaSection.jsx`: green chapter, inset gold frame that draws on all four sides, endorsement line, `قافلہ شوق` in Nastaliq with px line-heights and reserved heights, tagline, leader line, intro, body, four pillars in a gold lattice with their Urdu words, "Apply via WhatsApp" → `wa('qafila')`. The old logo image is no longer shown (the seal appears only after the approved retrace is done) |
| About | `pages/About.jsx`: story beside an arch image, story[3] pulled out between hairlines, ledger (ivory), why us as one row, team, closing letter. `TeamGrid.jsx`: chairman/founder in a large 4:5 frame, the rest 3-up (2-up on phones), initials plate in Cormorant caps when a photo is missing |
| Gallery | `GalleryGrid.jsx`: 12-column masonry (`wide` 8 columns, `tall` 2 rows; 2 columns on phones), hairline frames, alt text as captions, first 6 T3 then Block. New lightbox: green-950 at .96, crossfade, arrows (keys too), swipe, 48 px close, Esc, focus trap, focus returns to the tile; portalled to `<body>` so the nav, main and footer are inert behind it. "Plan your own journey →" |
| Contact | `pages/Contact.jsx` + `ContactInfo.jsx`: "We are here to help" with `السلام علیکم` on its own line (Urdu in the Arabic face, `<bdi>`); the letterhead block (full lockup, green-divided columns: office · phones · email · hours); WhatsApp rows for Umrah / Qafila e Shoq / Something else; form (7 cols) beside the map (5 cols) repinned to the letterhead address in Johar Town. Phone order: contact, WhatsApp rows, form, map |
| Form | `ContactForm.jsx`: package options from the live packages + Qafila e Shoq + General enquiry; visible labels; 52 px inputs with a text-muted border and 2 px green focus ring; phone hint; inline errors with icon, `aria-invalid` + `aria-describedby`; focus moves to the first invalid field; success state with the orbit ring, focus on "JazakAllah Khair.", a WhatsApp button carrying the message; failure state offers WhatsApp with the details filled in |
| Shared | `lib/phone.js` (number formatting, used by footer and Contact); the video-review player is portalled the same way as the gallery lightbox |
| Styles | new `src/styles/pages.css`. Removed from `components.css`: old page header, Qafila card, dividers, about story, gallery grid. `.team-card` stays (the admin team preview uses it) and is reset inside the new team layout. Removed the dead parallax code from the reveal registry |
| Defaults | `data.js` company address and email now match the letterhead (`content-corrections.md` §1); postcode empty |

## Behaviour change to note

The form used to open WhatsApp in a new tab automatically after submitting. It now saves the message and shows a success state with a "Continue on WhatsApp" button (the design spec's success state), so no tab opens unexpectedly. If saving fails, it shows a "Send on WhatsApp" button with the details filled in.

## Checks

| Check | Result |
|---|---|
| Build | passes; CSS 89 KB (17 KB gzip), app JS 175 KB (50 KB gzip) |
| No text on sanctuary images | holds on all four headers |
| Nastaliq only on `/packages` | loaded on `/packages`; `unloaded` on Gallery (and not referenced on Home, About, Contact) |
| Filters | Ramadan chip → 1 card, live region "1 package", `aria-pressed` correct |
| Lightbox | opens on `<body>`, focus on Close, ArrowRight advances (3 / 8), page inert behind it, Esc closes and returns focus to the tile |
| Form | empty submit → focus on Full name; name/phone/message marked invalid and linked to their error text; options come from live packages |
| Phone, 375 px | Contact order correct, no horizontal overflow |
| Console | no errors |

## Not yet verified

- The form's success state end-to-end (needs the `/api/contact` serverless function, which the local Vite server does not run). Test on a preview deploy (Phase 6).
- Contrast of the success/error states and the full axe pass (Phase 6).

## Left for Phase 5 (identity sweep)

Code defaults still say "Karwan-e-Usmania", "Premium Hajj & Umrah from Lahore" and `founded: 2005`, and `about.story[0]` mentions Hajj; `schemas.js`, `index.html` and `generate-seo.js` still carry old names, Hajj wording and the old domain.

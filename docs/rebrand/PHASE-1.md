# Phase 1 report: plumbing

Completed 2026-10-10. `npm run build` is green. The pages look the same as before except for the new typefaces; restyling starts in Phase 2.

## What changed

| File | Change |
|---|---|
| `src/styles/fonts.css` (new) | Self-hosted @font-face rules from `public/fonts/manifest.json`, plus metric-matched fallbacks (Arial, Times New Roman, Tahoma) measured with fonttools |
| `src/styles/tokens.css` | KEUI token layer added (colour, type scale, space, radius, shadow, motion, z-index). Legacy colour tokens kept for the admin and unrestyled components; legacy font tokens now point to the new faces |
| `src/styles/global.css` | `:lang(ar)`, `:lang(ur)` and `.ar-face` use KEU Arabic; `.nastaliq` opts into Urdu Nastaliq; faux bold disabled |
| `src/styles/components.css` | Qafila Urdu set in Nastaliq with a 2.1 line height (it was clipping at 1) |
| `index.html` | Google Fonts removed; three first-paint fonts preloaded; old 330 KB logo preload removed; `theme-color #004828`; Cloudinary preconnect |
| `src/main.jsx` | imports `fonts.css` first |
| `src/lib/motion.js` (new) | Single GSAP entry: ScrollTrigger, SplitText, Flip, DrawSVG, CustomEase; eases, durations, staggers, reveal tiers |
| `src/lib/motionEnv.js` (new) | Reduced motion, Save-Data, slow network, low-end, pointer and width detection with live updates; `?motion=` emulation |
| `src/lib/splitText.js` (new) | Line-mask splitting that refuses Arabic and Urdu |
| `src/hooks/useLenis.js` | Lenis on GSAP's ticker, `ScrollTrigger.update` on scroll, `lagSmoothing(0)`, refresh on fonts, load and new content |
| `src/hooks/useGsapAnimations.js` | Rewritten as the reveal-tier registry; legacy components mapped by selector; no overshoot eases |
| `src/lib/SiteContext.jsx` | Fires `keu:content` after live content renders |
| `src/lib/whatsapp.js` | `waNumber()` digits-only; `umrah` and `qafila` keys; Umrah-only greeting |
| `vite.config.js` | GSAP plugins moved into the `gsap` chunk |
| `package.json` | `gsap ^3.13.0`, `lenis ^1.3.0` (installed 3.15.0 and 1.3.23), `hero:safe` script |

**Video reviews (owner request), admin side:**

| File | Change |
|---|---|
| `api/upload-signature.js` | `?resource=video` also signs an async eager job: 720p MP4 and a poster |
| `src/components/admin/CloudinaryUpload.jsx` | `resourceType="video"`: chunked 20 MB uploads with progress, 500 MB cap |
| `src/pages/admin/EditVideoReviews.jsx` (new) | Upload, preview, name, city, trip, caption, language, consent, show, reorder, remove; saves `site.videoReviews` |
| `src/App.jsx`, `src/pages/admin/AdminLayout.jsx` | Route `/admin/video-reviews` and sidebar entry |
| `src/lib/videos.js` (new) | Delivery and poster URLs matching the eager job |
| `src/data.js` | `videoReviews: []` default |

## Acceptance checks

| Gate | Result |
|---|---|
| Build green | Pass |
| First-paint fonts ≤ 90 KB | 80.2 KB preloaded; Nastaliq not requested on Home |
| Nastaliq only on `/packages` | Pass: loads on Packages and renders the Qafila Urdu |
| Lenis and ScrollTrigger in sync | Pass: one ticker; `ScrollTrigger.update` on every Lenis scroll |
| Environment emulation | `?motion=reduce`: no Lenis, no split headings, nothing hidden |
| No console errors | Pass on Home and Packages (Chrome, dev server) |
| Admin unchanged | Existing screens and their colours unchanged; one new screen added |

## Not tested here

- **The video upload screen in a browser.** The local API cannot reach MongoDB from this machine (DNS refuses the SRV lookup), so the admin can't sign in locally. It built cleanly; test it on a preview deploy by uploading one short video.
- **Phone-sized screens.** Covered in Phase 6.

## Chunk sizes (gzip)

| Chunk | Size |
|---|---|
| app | 32.3 KB |
| gsap + plugins | 60.4 KB |
| react | 52.7 KB |
| lenis | 5.3 KB |
| three (removed in Phase 3) | 109.2 KB |

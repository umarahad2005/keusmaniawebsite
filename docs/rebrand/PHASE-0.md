# Phase 0 report: owner decisions and assets

Completed 2026-10-10. No application code changed. `npm run build` is green.

## Owner decisions recorded

- WhatsApp `923334883578`, canonical `https://usmania.vercel.app`, Arabic tagline `خدمات ضيوف الرحمن`, poster-only hero on phones.
- Keep **18+ years**; founding year becomes **2008**.
- Approved: copy clean-up, KU trace and wordmark, Qafila seal retrace, hero framing, Madinah loop, booking steps.
- Recorded in `DESIGN-LANGUAGE.md` §8.1 and `PRODUCT.md`.

## Files added to the repo

| Path | What |
|---|---|
| `keu-website/src/assets/media/hero-1080.mp4` | Home hero loop, 1920×1080, 14 s, 30 fps, no audio, 3,342,672 B |
| `keu-website/src/assets/media/hero-720.mp4` | 1280×720 rendition, 1,699,412 B |
| `keu-website/src/assets/media/hero-poster-1920.webp` | first frame, 137,624 B |
| `keu-website/src/assets/media/madinah-720.mp4`, `madinah-poster.webp` | Green Dome arch loop (720×1280, 1,216,289 B, no people, no audio) and poster |
| `keu-website/src/assets/media/makkah-kaaba-kiswa-1600.webp` | Makkah plate for the chapter arch |
| `keu-website/public/hero/poster-1920.webp`, `poster-mobile-3x4.webp` | fixed-path posters for the inline LCP preload (mobile 61,342 B) |
| `keu-website/src/assets/brand/ku-mark.svg`, `ku-mark-reversed.svg` | traced KU mark, full colour and reversed |
| `keu-website/src/assets/brand/ku-ring.svg`, `ku-swoosh.svg` | stroke versions for draw animations |
| `keu-website/src/assets/brand/wordmark.svg` | outlined three-line lockup (Cinzel 500 + Manrope 500), 16.7 KB, colours via CSS vars |
| `keu-website/src/assets/brand/wordmark-line.svg` | one-line nav wordmark, `currentColor`, 10.3 KB |
| `keu-website/public/fonts/*.woff2` + `manifest.json` | self-hosted fonts with unicode ranges for Phase 1 `fonts.css` |
| `keu-website/scripts/hero-safe-zones.js` (`npm run hero:safe`) | computes per-aspect hero framing and keep-out boxes |
| `keu-website/src/styles/hero-safe.css` | generated CSS vars (not imported yet; Phase 3 wires it) |
| `docs/rebrand/content-corrections.md` | staged corrections for the admin re-save and the Phase 5 sweep |

## Acceptance checks

| Gate | Result | Status |
|---|---|---|
| Kaaba and Maqam inside their boxes on an 8-frame contact sheet; no calligraphy roundel | Kiswa measured on all 28 half-second frames at x 50.2–86.7 %, inside K1 49–89 %. Maqam inside K2 on every frame. Roundels out of frame after the recrop. | Pass |
| Loop seam SSIM ≥ 0.95 | 1080p: **0.951** (ordinary neighbouring frames: 0.966). Lossless seam: 0.983. | Pass |
| | 720p: **0.913** at its 1.9 MB budget. Hitting 0.95 needs about 4.7 MB. It is served only below about 1280 effective px. | Below gate, flagged |
| 1080 ≤ 3.7 MB | 3.34 MB | Pass |
| 720 ≤ 1.9 MB | 1.70 MB | Pass |
| Posters ≤ 160 KB / ≤ 70 KB | 137.6 KB / 61.3 KB | Pass |
| Each SVG < 60 KB, crisp at 32 px | 0.7–20 KB; mark renders legibly at 32 px | Pass |
| First-paint fonts ≤ 90 KB | Manrope latin 24.8 + Cormorant 500 latin 23.3 + KEU Arabic 500 32.1 = **80.2 KB** | Pass |
| Arabic subset covers every string | tagline, بک کریں, السلام علیکم, city names, ﷺ ﷻ, Qafila words: all glyphs present | Pass |
| Build stays green | `npm run build` passes | Pass |

## Hero framing (from `npm run hero:safe`)

| Screen shape | Film position | Copy over film from | Below that |
|---|---|---|---|
| 16:9 and wider | 36 % | 1264 px wide | plate layout |
| 16:10 | 60 % | 1440 px wide | plate layout |
| 4:3 and 5:4 | 76 % | effectively never | plate layout |
| Phones < 768 px | — | — | poster plate (owner decision) |

The whole Kaaba stays in frame at rest. During the 2 s settle zoom (1.06 → 1) its right edge may be briefly cropped. Copy clearance uses the worse of the two frames.

## Notes for Phase 1

- Encoder recipe for future loops: 0.5× retime, `trim 1.1:15` body with `trim 0:1.1` head, 1 s `xfade` ending 3 frames before the loop point, two-pass x264 with `zones=380,419,b=3.0` so the crossfade isn't starved.
- The Arabic and Urdu fonts were subset with fonttools to `U+0600-06FF, U+200C-200F, U+FDF2, U+FDFA-FDFB`.
- Phase 1 builds `src/styles/fonts.css` from `public/fonts/manifest.json`, with metric-matched fallbacks.

## Owner answers after Phase 0 (2026-10-10)

- **Hours:** Monday–Friday 11 am – 7 pm, Saturday 11 am – 5 pm, Sunday closed.
- **Testimonial name:** Waqas Saleem.
- **Hajj:** Umrah only for now; every Hajj offer is removed from the site (content-corrections.md §7).
- **Hosting:** Vercel Pro or the owner's own server, decided after the code is ready. Cloudinary and MongoDB stay as storage. The build stays host-agnostic.

## Still open

- **Package typos.** Confirm the optional live-package tidy-ups in content-corrections.md §5 (for example "Bumber Offer" to "Bumper offer").

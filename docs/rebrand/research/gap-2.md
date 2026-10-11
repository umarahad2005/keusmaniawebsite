# Gap fill 2: performance baseline, preloader LCP behaviour, Pakistani mobile audience

Researcher: gap-2 · 2026-10-10 · extends `motion.md` §3, §10, §12 and §13 and `footage.md` §5. Nothing in the repo was modified. The repo build was copied to `scratchpad/repobuild/`, with a junction to the repo's node_modules.

Raw evidence (all in the scratchpad):
- `psi/psi-mobile.json`, `psi/psi-desktop.json`: PSI API 429 error bodies
- `psi/lh-mobile.json`, `psi/lh-desktop.json`: Lighthouse on the **live** site
- `psi/lh-repo-mobile.json`, `psi/lh-repo-desktop.json`: Lighthouse on a **local production build of repo HEAD ce56553**
- `lcptest/*.html` + `lhtool/lcp.js`: controlled LCP experiments in Chrome 154
- `lhtool/sum.js`, `lhtool/serve.js`: summariser and gzip static server

---

## 0. TL;DR, the decisions

1. **The planned 100svh poster will never be the LCP element.** Since Chrome 88, LCP ignores full-viewport images. Measured: the repo's current full-bleed Kaaba photo is skipped, and the **Urdu H1 is the LCP element**. A full-viewport `<video poster>` is skipped as well (test K). `motion.md` §4 ("Poster … This is the LCP element") and `footage.md` §5.3 ("treat the poster as the LCP element") are **wrong for a 100svh hero**. The LCP element will be the **hero headline text**.
2. **An opaque fixed preloader does not hide content from LCP.** Chrome ignores occlusion. Anything painted underneath with opacity > 0 counts at its own paint time, even while the overlay covers it (tests C, F, H). So the preloader length only affects LCP when the hero content is **hidden** (opacity 0, visibility:hidden, clip-path fully closed, CSS line mask) until the reveal. The planned spec does exactly that: H1 lines start at G+800. That puts **LCP at about G+800 ms plus JS boot**.
3. **The way the headline is revealed changes LCP by over a second** (Chrome 154, same 2500 ms trigger):
   - GSAP / rAF opacity or fade-up: LCP is the **first non-zero frame** (2564–2576 ms).
   - CSS `transition: opacity 1.1s`: LCP is the **end** of the transition (3636–3656 ms).
   - clip-path wipe: LCP at the start of the wipe (2564 ms).
   - Line mask (`overflow:hidden` + translateY 105%): with CSS there is **no LCP entry at all**. With rAF it records a **154 px² sliver of line 1**, so the H1 effectively drops out of LCP.
4. **The preloader's own counter text can become the LCP candidate. Its SVG cannot.** With the hero hidden, LCP was the `42%` counter `<div>` (392 px², 72 ms), then the H1 when it was revealed. Inline `<svg>` was never reported. A **large wordmark in the preloader** (64px text) became LCP at 128 ms. It **stayed LCP after the overlay was removed** and no hero element beat it. That gives an artificially good number.
5. **Audience** (StatCounter, Sep 2026, Pakistan):
   - Platform: desktop 50.61 % / mobile 48.42 % / tablet 0.97 %.
   - Mobile OS: **Android 89.77 %** / iOS 10.18 %.
   - Mobile browser: **Chrome 83.38 %**, so Chromium LCP rules describe about 90 % of mobile visits.
   - Top vendors: Samsung 17.35, **Infinix 15.04**, Vivo 11.9, Xiaomi 10.64, Apple 10.17, Oppo 10.14.
   - Top viewport: **360×800 (18.77 %)**.
   - Ookla median mobile download for Pakistan: **24.72 Mbps (Oct 2025**, via StatRanker citing Ookla). No 2026 figure could be verified.
6. **Limits** (details in §5):
   - First-visit preloader: **hard cap of 2.2 s** from navigation to bands opening, typically 1.2–1.6 s. The hero H1 is painted (opacity 1) **under** the overlay, so the band opening is the reveal.
   - Mobile hero: **9:16 crop at 720×1280, ≤ 1.5 MB**, loaded only after LCP and idle, and only on `4g` without Save-Data. Poster otherwise.
   - Desktop: 1080p ≤ 3.7 MB (measured), with a 720p fallback ≤ 1.8 MB.
   - Posters: ≤ 70 KB mobile, ≤ 160 KB desktop.
   - Critical path for LCP: **≤ 380 KB** on Lighthouse's slow-4G profile.

---

## 1. Performance baseline

### 1.1 PageSpeed Insights API: failed
Both `strategy=mobile` and `strategy=desktop` returned **HTTP 429**: `"Quota exceeded for quota metric 'Queries' … 'Queries per day' … quota_limit_value: 0"`. Anonymous (keyless) PSI calls get a quota of 0 from this environment. **No CrUX field data was retrieved**, and nothing about `loadingExperience` / `originLoadingExperience` is verified. My guess is that a low-traffic origin like keusmania.vercel.app has no CrUX data at all, but I have **not verified** that. Next step: re-run with `&key=<API key>`, or use the CrUX API.

**Substitute:** Lighthouse **12.6.1** CLI run locally on Chrome **154.0.8037.98** headless. This is the same engine as PSI with the same default settings. Mobile uses simulated throttling at 150 ms RTT, 1,638.4 Kbps throughput, 4× CPU slowdown, and a 412×823 @1.75 Moto-G-Power screen. Desktop uses 40 ms RTT, 10,240 Kbps and 1× CPU. These are single runs, so expect ±10–20 % variance.

### 1.2 Important: the live URL is NOT the repo
`https://keusmania.vercel.app/` serves a 514-byte `index.html` titled "Karwan e Usmania - Hajj & Umrah Services | Premium Islamic Travel". It loads `/assets/index-FDuF3Vh1.js` and `index-oyCIEUxZ.css`, and its markup uses **Tailwind classes** (`min-h-screen`, `opacity-30`). The repo's `keu-website/index.html` is the plain-CSS/GSAP/Three app, titled "Karwan-e-Usmania — Premium Hajj & Umrah from Lahore", with Cloudinary, JSON-LD and Google Fonts. **The current production deploy is an older or different codebase.** I report both, and the repo build is the one that matters for the rebrand.

### 1.3 Live site (keusmania.vercel.app)

| Metric | Mobile | Desktop |
|---|---|---|
| Perf score | 70 | 95 |
| FCP | 1.7 s | 0.5 s |
| **LCP** | **6.6 s** | 1.3 s |
| TBT | 190 ms | 60 ms |
| CLS | 0 | 0 |
| Speed Index | 5.0 s | 1.5 s |
| Total transfer | **3,803 KiB (3,894,134 B)**, 14 requests | same |

- **LCP element:** `div#root > div.min-h-screen > section#home > div.absolute`, a CSS background-image `/assets/masjid-al-haram-CsHNKrw_.jpg` at **opacity-30**. It is 412×616, not full-viewport, so it counts, and it counts at 30 % opacity.
- **Mobile LCP phases:** TTFB 909 ms / load delay 722 / load time 1,243 / **render delay 3,735 ms (57 %)**.
- **Largest requests:**

| Asset | Size |
|---|---|
| qafila-logo-C0koUoID.png | 985,669 B |
| islamic-pattern-BYU8JoGY.webp | 727,247 B |
| masjid-al-haram jpg (the LCP) | 664,759 B |
| haram-exterior jpg | 378,430 B |
| karwan-logo png | 329,701 B |
| masjid-nabawi-exterior jpg | 200,312 B |
| four team portraits | 113–141 KB each |
| JS | 71,841 B gz |
| CSS | 24,126 B gz |

- **Lighthouse savings estimates:** responsive images 2,058 KiB; next-gen formats 1,979 KiB; image delivery 3,133 KiB.

### 1.4 Repo HEAD ce56553, production build (served locally with gzip)
The build is `vite build`, with `/api/content` returning 404 so the `src/data.js` defaults are used. Chunks (gz):

| Chunk | Size |
|---|---|
| react | 52.7 KB |
| index | 47.5 KB |
| **three** | **109.2 KB** |
| gsap | 27.2 KB |
| lenis | 5.3 KB |
| CSS | 9.3 KB |

| Metric | Mobile | Desktop |
|---|---|---|
| Perf score | 62 | 94 |
| **FCP** | **4.7 s** | 0.8 s |
| **LCP** | **7.1 s** | 1.4 s |
| TBT | 60 ms | 80 ms |
| CLS | 0 | 0.005 |
| Speed Index | 5.8 s | 1.2 s |
| TTI | 7.2 s | 1.4 s |
| Main-thread work | 3.8 s | 1.2 s |
| JS boot-up | 1.1 s | 0.6 s |
| Transfer | **1,266 KiB**, 23 requests | 1,499 KiB |

- **LCP element (both form factors):** `main#main-content > section#hero > div.hero__content > h1.hero__title` = "خدمات ضیوف الرحمن" (Urdu). LCP phases on mobile: TTFB 456 ms (simulated) / **render delay 6,657 ms (94 %)**. The H1 is hidden by the GSAP hero timeline (bismillah → pill → title) and needs JS, so its time is all render delay.
- **Why it isn't the Kaaba photo:** `.hero__photo img` (`keu/makkah/kaaba`, `fetchpriority="high"`, 102,617 B at w_768 on mobile, 341,422 B at w_1600 on desktop) is `inset:0` inside `min-height:100dvh`, which makes it **full-viewport**. Full-viewport images are excluded (§2). The expensive high-priority image buys **no** LCP credit.
- **Render-blocking (mobile, est. savings 2,300 ms):**
  - the Google Fonts CSS request (Playfair 0,400…900 + italics, Inter 300–800, Amiri 4 styles): 1,171 ms
  - `index.css`: 456 ms
- **Fonts actually downloaded on the home page:** Amiri 108,665 + 100,196 + 20,410 + 19,699 B; Inter 48,983; Playfair 39,024 + 38,596. That is **≈ 375 KB of fonts on the critical path**, more than all the JS.
- **The largest single request is `/logo.png` at 329,540 B.** It is preloaded with `<link rel="preload" as="image">` in `index.html`, but Chrome fetched it at Low priority.
- **Lighthouse estimates:** unused JS 66 KiB; image delivery 574 KiB.

**What it means:** on slow 4G the repo misses LCP ≤ 2.5 s by about 4.6 s, before any video or preloader is added. The causes, in order:
- render-blocking fonts plus a JS-gated, opacity-0 H1 (render delay 94 %)
- Three.js (109 KB gz, plus WebGL boot) on the hero
- a 330 KB PNG logo

The bytes are not the main problem. The **render delay** is.

---

## 2. LCP rules: citations plus a controlled experiment

### 2.1 What the docs say
- web.dev/articles/lcp lists Chromium's exclusions: *"Elements with an opacity of 0, that are invisible to the user"*, *"Elements that cover the full viewport, that are likely considered as background rather than content"*, and *"Placeholder images or other images with a low entropy"*. Also: *"`<svg>` elements are not considered LCP candidates at this time"*, though `<image>` inside `<svg>` is. Video counts by *"the poster image load time or [first frame] … whichever is earlier"*. Size is *"the size that's visible to the user within the viewport"*. *"Changes to an element's size or position don't generate new LCP candidates."* Reporting stops on the first tap, scroll or keypress. Good is ≤ 2.5 s at the **75th percentile**, and poor is > 4.0 s. **The article does not mention occlusion or overlays.**
- The Chromium LCP changelog (chromium.googlesource.com/chromium/src/+/main/docs/speed/metrics_changelog/lcp.md):
  - Chrome 86: "ignores paints with opacity 0"
  - Chrome 88: "ignores full viewport images"
  - Chrome 88: "ignores removed content by default"
  - Chrome 112: "ignores low-entropy images"
  - Chrome 116: video/animated image changes
  - Chrome 130: "Exclude transparent text from being LCP eligible"
  - Chrome 144: document opacity 0→non-zero fix
  - Chrome 151: video LCP entry emission
  - It has **no entries about visibility, SVG or occlusion**.

### 2.2 Experiment (`scratchpad/lcptest/`, Chrome 154 headless, 412×823 @1.75, unthrottled, buffered `largest-contentful-paint` observer, read 4.5 s after load)
Hero = `<img hero.jpg>` (121 KB) plus H1 "Your Journey to the Holy Land Our Priority" (40px serif). The overlay is `position:fixed; inset:0; background:#003018; z-index:9` with an inline SVG mark and a 12px `42%` counter.

| Test | Setup | LCP entries (time · element · px²) |
|---|---|---|
| A | img at **100vh** full-viewport, H1 visible | 136 ms · **H1** · 43,757 (img excluded) |
| B | img at 90vh | 64 · IMG · 305,163 |
| **C** | B + **opaque fixed overlay** removed at 2500 | **60 · IMG** (covered, still counted at paint) |
| C2 | C, overlay with 30px wordmark | 164 · H1 → 180 · IMG (the hero, under the overlay) |
| **D** | hero **opacity:0** until 2500 | 108 · P (body copy) → **2592 · IMG** |
| **E** | hero **visibility:hidden** until 2500 | 52 · P → **2568 · IMG** |
| F | two 50vh bands over the hero, opened at 2500 | **68 · IMG** (covered) |
| **G** | full-viewport img, H1 opacity 0 + overlay | **72 · `div.c` "42%" · 392** → 2540 · H1 |
| H | full-viewport img, H1 visible + overlay | 76 · H1 (covered) |
| I | hero **opacity:0.01** until 2500 | 76 · IMG (counted; this is gaming, do not do it) |
| J | `<video poster>` at 90vh | 120 · VIDEO (poster) |
| **K** | `<video poster>` at **100vh** | 204 · **H1** (full-viewport video excluded) |
| L | H1 **CSS line mask** (overflow hidden, translateY 105%, 1.1 s) from 2500 | **no LCP entry at all** |
| M | H1 clip-path `inset(0 100% 0 0)` → 0 from 2500 | 2564 · H1 · 43,366 |
| N | H1 **CSS opacity transition** 1.1 s from 2500 | **3636–3656** · H1 (end of transition) |
| O | H1 **rAF (GSAP-like) opacity** 1.1 s from 2500 | **2576** · H1 (first frame) |
| P | H1 **rAF line mask** from 2500 | 2560 · **SPAN "Your Journey to" · 154 px²** |
| Q | H1 rAF fade-up y24 350 ms from 2500 | 2564 · H1 |
| R | full-viewport img, small H1 opacity 0, **64px wordmark in overlay**, overlay removed at 2500 | **128 · DIV wordmark · 116,184**. No later entry, so the removed overlay text stays LCP |

### 2.3 Answers to the three questions
1. **Are opacity:0 / visibility:hidden elements excluded?** Yes. They are not candidates while hidden. They become candidates when first painted visibly, and LCP is the reveal time (D 2592, E 2568). Sources: web.dev ("Elements with an opacity of 0"), Chromium changelog M86 and M130. The docs do not mention visibility:hidden, but it is empirically excluded because nothing is painted. Opacity 0.01 **does** count (I). The timing also depends on the mechanism: a CSS opacity transition reported at its end (N), while a main-thread tween reported at its first frame (O).
2. **Does an element covered by an opaque fixed overlay still count?** **Yes. Occlusion is ignored** (C, F, H). There is no occlusion entry in the changelog or on web.dev, so this rests on the experiment in Chrome 154. In practice, lab and field LCP will report the hero as "painted" while the user still sees only the preloader. LCP therefore **under-reports** the perceived wait whenever the hero is painted under the curtain. This resolves `motion.md` §13's open item. **We need our own metric for the real reveal**: `performance.mark('keu:hero-revealed')` when the bands finish, reported through `PerformanceObserver` / web-vitals attribution or analytics.
3. **Would the preloader's own SVG or counter text become the LCP candidate?**
   - **SVG: no.** web.dev says inline `<svg>` is not a candidate, and none was reported in C, G or H. A raster `<image>` inside the SVG **would** be eligible, so draw the KU mark with vector paths only.
   - **Counter text: yes, if nothing larger is painted** (G: the `42%` div at 392 px²). It is replaced as soon as the H1 or another larger element paints.
   - **A large preloader wordmark becomes LCP and stays there** after removal, unless a larger element paints later (R). That contradicts the reading of web.dev's "remains the largest unless a larger element is rendered" as a way to game it, but it agrees with that sentence literally. The changelog's M88 "ignores removed content" did not apply here. Keep preloader text **smaller than the hero H1** so the metric stays honest.

### 2.4 Consequences for the spec
- The LCP element for the new hero is **the English H1** ("Your Journey to the Holy Land Our Priority"), or the Arabic line if that is larger. It is not the poster. Prioritise the **display font** and the **HTML that renders the H1**, not only the poster.
- Do **not** use a CSS line mask on the H1. Either it disappears from LCP (L), or the metric records a sliver (P). If the line mask is kept for craft, apply it only to the **eyebrow and Arabic line**, and reveal the H1 by **band opening over an already-painted H1**, or with a GSAP opacity/y fade (O/Q). Never use a CSS opacity transition on the H1 (N adds the full duration to LCP).
- The `% counter` must stay small (12px, as specced). Do not put "KARWAN E USMANIA" in large type inside the preloader. If the wordmark appears (awwwards.md §11), keep it under about 24px, letterspaced.

---

## 3. Audience profile (Pakistan)

| Item | Value | Source |
|---|---|---|
| Platform split, Sep 2026 | Desktop **50.61 %**, Mobile **48.42 %**, Tablet 0.97 % | gs.statcounter.com/platform-market-share/desktop-mobile-tablet/pakistan (scraped table, 2026-10-10). The June 2026 snapshot was mobile 51.67 / desktop 47.77 (search result), so the split hovers around 50/50 month to month. |
| Mobile OS, Sep 2026 | **Android 89.77 %**, iOS 10.18 %, KaiOS 0.02 % | gs.statcounter.com/os-market-share/mobile/pakistan |
| Mobile browser, Sep 2026 | **Chrome 83.38 %**, Safari 8.28, UC 3.27, Samsung Internet 2.78, Opera 1.84 | gs.statcounter.com/browser-market-share/mobile/pakistan |
| Mobile vendor, Sep 2026 | Samsung 17.35, **Infinix 15.04**, Vivo 11.9, Xiaomi 10.64, Apple 10.17, Oppo 10.14 | gs.statcounter.com/vendor-market-share/mobile/pakistan |
| Mobile viewport, Sep 2026 | **360×800 18.77 %**, 360×820 7.17, 385×854 6.67, 360×806 5.89, 412×915 5.64, 414×896 5.34 | gs.statcounter.com/screen-resolution-stats/mobile/pakistan |
| Median mobile download | **24.72 Mbps, Oct 2025** (rank 97). Older: 20.61 Mbps, Oct 2024 (Dawn, rank 100/111) | statranker.org (citing Ookla); dawn.com/news/1877689. **The latest-month Ookla figure was not verified.** speedtest.net/global-index/pakistan returned 403 to curl and was blocked for WebFetch. Ookla's H2-2025 Connectivity Report gives Jazz (fastest operator) a 24.13 Mbps median and Rawalpindi 18.11 Mbps (propakistani.pk, search snippet). |

Notes:
- StatCounter measures **page views on its network**, not device ownership. It skews toward people who browse. A pilgrim audience (older, often reached by WhatsApp links) is probably **more** mobile and more Android-heavy than the 48 % national figure. That is **not verified**, because the site has no analytics I could read.
- About half the mobile market is budget/mid Android (Infinix, Vivo, Xiaomi, Oppo, Tecno). That matches Lighthouse's Moto G Power / 4× CPU profile, so the **lab mobile numbers above are representative, not pessimistic**.
- Ookla medians come from people who run speed tests, usually on good signal. The p75 *slowest* experience, which is what CWV grades, is well below 24.7 Mbps. Lighthouse's 1.6 Mbps profile is a sensible floor for planning.
- I could not verify mobile data prices or the share of prepaid/metered users, so I make no claim about either. Treat "metered data" as a design assumption.

---

## 4. Byte arithmetic

Transfer time = bytes × 8 / throughput (connection setup and RTTs excluded).

| Asset | Bytes | @ Lighthouse slow-4G 1.6 Mbps | @ PK median 24.7 Mbps |
|---|---|---|---|
| Hero 1080p 16:9, 14 s @ 2.1 Mbps (footage.md, measured) | 3,706,931 | **18.5 s** | 1.2 s |
| Hero 720p 16:9 (footage.md estimate) | ≈ 1.8 MB | 9.0 s | 0.58 s |
| Vertical 1080×1920 (footage.md budget) | ≤ 3.5 MB | 17.5 s | 1.13 s |
| **Vertical 720×1280, 10–12 s @ ≤ 1.0–1.2 Mbps** | **≤ 1.5 MB** | 7.5 s | 0.49 s |
| Rialto hero, 4K, 11.6 s (footage.md) | 1,630,167 | 8.2 s | 0.53 s |
| Repo critical path today: fonts ≈ 375 KB + JS ≈ 242 KB gz + CSS 9 KB | ≈ 626 KB | 3.1 s | 0.2 s |

- **The 2.5 s LCP budget on slow 4G** allows about 2.5 s − (DNS/TLS/HTML ≈ 3–4 RTT × 150 ms ≈ 0.6 s) ≈ 1.9 s × 200 KB/s ≈ **380 KB** of bytes on the critical path to H1 paint. Today's 626 KB is over that. Font subsetting (Amiri alone is 248 KB across 4 files) and moving Three off the hero (109 KB gz) bring it under.
- **A 16:9 clip on a 360×800 portrait screen** with `object-fit:cover` scales to 1422×800, so only 360/1422 = **25 % of the decoded width is visible**. About 75 % of a landscape clip's bytes and decode work are wasted on the dominant viewport. A 9:16 crop shows the full frame.
- **720×1280 vs 1080×1920 on a 360-px-wide CSS viewport:** at DPR 2, 720 px is 1:1. At DPR 3, 720 is upscaled 1.5× under a 35–40 % scrim (awwwards.md). That is acceptable for a moving background, and 1080×1920 costs 2.25× the pixels.

---

## 5. Concrete limits (these settle the conflicting specs)

### 5.1 Preloader
Conflicts:
- `motion.md` §3.2: about 3.0 s to an interactive hero, G ≈ 1600 ms, 4000 ms cap, H1 starting at G+800.
- `awwwards.md`: "cap total ≤ 1.5 s".
- Edolus: ≥ 5.5 s.

**Decision:**
1. **The hero H1 is painted under the overlay.** It is rendered at opacity 1, either static in `index.html` or by React before the gate. The **band opening is its reveal**. LCP then equals the H1's paint time (JS/HTML-bound), **independent of preloader length** (tests C/F/H).
2. **Gate:** `max(minHold, logoDrawn, fonts.ready)` with **minHold 1200 ms** (down from 1600) and a **hard cap of 2200 ms** (down from 4000). **Do not wait for `heroPoster.decode()` on mobile.** The poster is not LCP and the bands can open over the green ground with a 400 ms poster fade. Reasoning: if a future change hides the H1 again, LCP ≈ gate + about 300 ms. A 2200 ms cap keeps LCP ≤ 2.5 s, the p75 "good" threshold, even in that failure mode.
3. **Bands:** 800 ms `power2.inOut` (down from 1000). Logo FLIP: 800 ms overlapping. **Worst case from navigation to fully open hero: 2.2 + 0.8 = 3.0 s. Typical: 1.2 + 0.8 = 2.0 s.**
4. **Hero sequence after the bands:** only the **non-LCP** pieces animate (eyebrow, Arabic line, CTAs, line masks allowed on these), plus the nav links.
5. **Variants:**
   - Replay: ≤ 900 ms (as specced).
   - Low-end (`deviceMemory ≤ 4` or `hardwareConcurrency ≤ 4`, which covers much of the Infinix/Vivo/Tecno base): no counter, minHold 600 ms, cap 1200 ms.
   - Save-Data / `2g`/`3g` / reduced motion: **no preloader** (as specced).
6. **Instrument it:**
   - `performance.mark('keu:intro-start')` inline in `<head>`
   - `performance.mark('keu:hero-revealed')` at band-open end
   - Log `hero-revealed − navigationStart` along with web-vitals LCP. **Ship gate: p75 hero-revealed ≤ 3.0 s on mobile.** LCP alone cannot catch a slow preloader (occlusion is ignored).
7. The preloader must contain **only inline SVG paths (not a raster `<image>`) and small text** (counter 12px, any wordmark ≤ 24px). Otherwise it becomes the LCP and reports a misleadingly early number (tests G, R).

### 5.2 Mobile hero policy
Options were: poster only / 720p landscape / 9:16 crop. **Decision: 9:16 crop at 720×1280, gated.** Landscape 720p wastes 75 % of its pixels on 360×800 (§4) and frames the Kaaba off-centre.
- **Source:** `footage.md` §3 crop of clip #1 (`crop=1215:2160:1350:0`, shift about 100 px left), scaled to **720×1280**, H.264 High, **2-pass at ≤ 1.0 Mbps (maxrate 1.3 M), 10–12 s, no audio**. **Budget ≤ 1.5 MB.** This replaces footage.md's "vertical 1080×1920 ≤ 3.5 MB". Not measured yet: encode it and check.
- **When to play:** only when **all** of these hold:
  - `matchMedia('(prefers-reduced-motion: reduce)')` is false
  - `navigator.connection?.saveData !== true`
  - `effectiveType === '4g'`, or the API is absent (iOS Safari, about 10 %)
  - after the LCP candidate has painted
  - after `window.load` + `requestIdleCallback` (timeout 2000 ms)

  Otherwise **poster only**, plus an optional user-initiated "Play film" button.
- **Why not poster-only for everyone on mobile:** the median 24.7 Mbps fetches 1.5 MB in about 0.5 s, and because the clip loads after LCP and idle it costs no CWV. Save-Data / 3G users never request it. The remaining cost is about 1.5 MB of metered data per first visit for the median user. If the owner prefers zero video data on mobile, poster-only is the safe fallback, and the spec needs no other change.
- Low-end Android (`deviceMemory ≤ 4`) still plays the 720×1280 clip, which is a single decoder. Three.js must not run (already in motion.md §10).

### 5.3 Per-rendition byte budgets

| Rendition | Dimensions | Bitrate / settings | Budget | Status |
|---|---|---|---|---|
| Desktop hero | 1920×1080, 12–14 s | 2-pass 2.1 Mbps, maxrate 2.6 M | **≤ 3.7 MB** (hard 4 MB) | measured 3,706,931 B (footage.md) |
| Desktop fallback (viewport < 1280 CSS px × DPR, or lowEnd) | 1280×720 | ≈ 1.0–1.2 Mbps | **≤ 1.8 MB** | estimate (footage.md) |
| **Mobile hero** | **720×1280 (9:16 crop)**, 10–12 s | ≤ 1.0 Mbps, maxrate 1.3 M | **≤ 1.5 MB** | **to be encoded and measured** |
| Mobile 1080×1920 | — | — | **dropped** | — |
| Chapter clips (lazy, IO) | 1280×720 / 720×1280 | ≈ 1.0 Mbps | ≤ 1.5 MB each, one decoder at a time | target |
| Desktop poster | 1920×1080, `f_auto,q_auto:eco` | — | **≤ 160 KB** (today's `w_1600` kaaba is 341 KB, so too heavy) | target |
| Mobile poster | 720×1280, `f_auto,q_auto:eco` | — | **≤ 70 KB** (today's `w_768` is 102 KB) | target |
| Critical path to H1 paint (HTML + CSS + JS needed for the hero + display font) | — | — | **≤ 380 KB** | today ≈ 626 KB |
| Fonts | self-host, subset Latin + Arabic, 2 weights per family, `font-display:swap`, preload the one H1 face | — | **≤ 150 KB** total on first view | today ≈ 375 KB |
| Logo | SVG for the nav and preloader, with `newlogo.png` 4096 px only as the source | — | **≤ 20 KB** | today `/logo.png` 330 KB |
| Total home page, first view, mobile, without video | — | — | **≤ 1.2 MB** | today 1,266 KiB (repo) / 3,803 KiB (live) |

### 5.4 Other measured fixes, in order of LCP impact
1. Remove Google Fonts render-blocking (est. 1,171 ms on mobile). Self-host, use `<link rel="preload" as="font" crossorigin>` for the single H1 face, and cut the Playfair 0,400…900 + italics and Amiri ×4 request.
2. Get the H1 painted without waiting for the GSAP timeline (render delay 94 % today).
3. Remove Three.js from the hero path (109 KB gz + WebGL init). motion.md already recommends this.
4. Replace the 330 KB `logo.png` preload with an inline SVG.

---

## 6. Unverified / open
- **PSI API and CrUX field data:** not retrieved (429, quota 0 without a key). It is unknown whether the origin has CrUX data. All numbers are lab Lighthouse 12.6.1 runs, single, local, not PSI's servers.
- The repo build was measured on `localhost` with my gzip server. TTFB is simulated, not Vercel's. Vercel adds real TTFB (the live doc had 60–73 ms server response in Lighthouse).
- The LCP experiments ran in **unthrottled headless Chrome 154** on desktop hardware. The behaviour (occlusion ignored, full-viewport exclusion, opacity handling) is engine logic and should hold on Android Chrome, but I did not test on a real device. The CSS-transition-reports-at-end result (N) may depend on compositor scheduling and could differ by version.
- Not tested: how font swap (`display=swap`) affects text LCP, i.e. whether the swap repaint creates a new entry.
- Ookla's latest-month (Aug/Sep 2026) Pakistan median was not verified. The figures used are Oct 2025 (24.72 Mbps, secondary source) and Oct 2024 (20.61 Mbps, Dawn).
- The pilgrim audience's real device mix and age profile are unknown. No site analytics were accessible.
- The 720×1280 ≤ 1.5 MB rendition is a target and has not been encoded. Run footage.md's pipeline with `-b:v 1000k -maxrate 1300k -bufsize 2600k` and measure.
- Mobile data pricing and the prepaid share in Pakistan were not checked.

# KEUI Design Language v1.0: "The Letter and the Film"

This is the binding source of truth for the build (2026-10-10). It takes its **spine** from Direction B, Cinematic Chapters (tied with C at 18.5; the owner scored B highest), its **grammar** from C (running heads, rules, lockup) and its **floor** from A (thumb bar, preloader WhatsApp, type floor, deep links).

- Every judge `must_fix` is resolved.
- Amendments to RESEARCH.md are marked **AMENDED**.
- Facts come only from `src/data.js`, the live DB (gap-1), the letterhead and the RESEARCH §10 owner decisions. Anything else is **[owner to supply]**, and its slot renders nothing until it is filled.

---

## 1. Design thesis and positioning

The site is a KEUI letter that opens as a film. Paper is the ground, green speaks, and gold appears only as a line.

The page opens on one cinematic event. The Edolus handshake leads into the Haram loop, under a headline larger and calmer than any Umrah template. After that the page moves as one continuous scene. Surfaces cross-fade on a fixed stage, headings rise behind masks, and at the hinge the page holds while Makkah becomes Madinah inside a dome arch.

All the while it answers the family's three questions:
- What does it cost? The price is on screen 2.
- Can we trust them? A ledger of record.
- How do we reach them? WhatsApp, one tap away at every moment.

The page gets louder through scale and choreography, never through overshoot, glitch or gold paint. The mix is two-thirds Nusuk and Aman, one-third Rialto and Edolus.

### 1.1 House rules (final)

1. **AMENDED.** Full-viewport video appears only in the Home hero, and only at ≥768 px; mobile shows the poster only, as the owner decided. One inset loop is allowed: the Madinah arch, at ≥1024, gated, lazy and ≤1.3 MB. PageHeaders use stills at ≤60vh.
2. Paper is the ground. Dark surfaces are limited to the hero, the footer, the Qafila chapter and overlays, and no two dark sections touch.
3. Gold is a hairline. No gold fill taller than 48 px, no gold buttons and no gradient text. Small gold text on paper uses gold-800.
4. Green is the display voice. Green fills appear only in the scrim, footer, sweep, overlays and the primary button.
5. **AMENDED.** Hierarchy comes from size and tracking, at weight ≤500. Tracked 12 px caps are reserved for eyebrows, running heads and HUD captions, **never buttons or labels**. Never track Arabic. Cormorant only at ≥28 px.
6. **AMENDED.** One motion idea per section, and everything plays once. Only three things scrub: the hero exit, the bg-stage cross-fades and the Sanctuary wipe. The site has a single pin: Sanctuary, on desktop.
7. No back, elastic, bounce or spring easing. Hovers take 250–400 ms, and image scale stays ≤1.03.
8. Shadows ≤ `0 4px 24px rgba(0,36,15,.08)`. Radii: card 4, button 2, image 0. Glass only on the nav over the hero.
9. **AMENDED.** Use wide, architectural footage, with no close-ups of women's faces and no private devotion. **Nothing goes over the Kaaba, the Maqam Ibrahim, the Green Dome or any calligraphy roundel.** Never reverse or mirror crowd footage. Boomerang loops only on footage with no people. No audio, no AI renders.
10. The handshake runs once per session and can be skipped. WhatsApp is always reachable: in the preloader, mid-curtain (FAB at z 110) and under the thumb.

### 1.2 Exceptions to the dossier, with evidence

| Change | Evidence |
|---|---|
| Hero H1 is `clamp(44px, min(5.2vw, 7.2svh), 104px)` on desktop (height-aware so the column fits at 1280×720 and 1366×768) and 44 px on mobile, up from ≤64 / 36 | The owner asked for "scale", and Rialto's cap height is about 180 px. The Kaaba keep-out zone (§2.5) still bounds it. |
| Hero copy sits on the left, with a left-anchored re-crop | Measured on `hero-poster-1920.webp`: the Kaaba spans **40–68 %** of the width, not 30–45 %. After the re-crop it sits at 50–88 %, and the الله roundels fall out of frame. |
| Mobile hero is a plate with copy on solid ground | On the 9:16 poster the Kaaba fills 2–92 % of the width, leaving no clear area for copy over the image. |
| Buttons use sentence case | Pilgrim judge's legibility finding. |
| No sticky footer lid | WCAG 2.4.11. |
| Column rules at full opacity | Craft judge's budget-panel finding. |

---

## 2. Foundations

### 2.1 Colour tokens (`src/styles/tokens.css`)

| Token | Hex | Usage | Contrast |
|---|---|---|---|
| `--green-950` | `#00240f` | dark ground, overlays, scrim | on-dark 14.78 |
| `--green-900` | `#003820` | pressed primary | — |
| `--green-800` | `#004828` | headings, primary, focus and state icons on light | white 10.73 |
| `--green-700` | `#005830` | Arabic city names, INTERNATIONAL | ≈8.3 |
| `--green-600` / `-500` | `#0b6239` / `#20784d` | links / success | 7.20 |
| `--band` → `--band-deep` | `#164a31` → `#083820` | footer | — |
| `--gold-200` | `#f5d795` | gold text over video and dark | ≥4.5 on ≥.72 scrim |
| `--gold-300` | `#e9c266` | hairlines, ghosts, focus on dark | ≈10 |
| `--gold-500` | `#e0a028` | hairlines and icons **on dark only** | 7.33 (≈2.2 on paper) |
| `--gold-600` | `#c08010` | display suffixes ≥28 px, **on paper and card only** (on ivory use gold-800) | 3.20 on paper (2.97 on ivory: banned) |
| `--gold-800` | `#885800` | the only small gold on paper | 5.89 |
| `--gold-hairline` | `#d9ae54` | decorative 1 px rules, 100 % | — |
| `--paper` `--ivory` `--card` | `#fcfbf8` `#f6f2ea` `#ffffff` | ground, alt field, cards | — |
| `--ink` `--text-body` `--text-muted` | `#0b0b0b` `#2c3a33` `#5f6f67` | numerals, body, secondary + **input border** | 19.0 / 11.5 / 5.1 |
| `--on-dark` `--on-dark-muted` | `#f4f1ea` `#b9c7bf` | on green-950 (muted never over video) | 14.78 / 9.52 |
| `--wa` / `--wa-label` | `#25d366` / `#00240f` | WhatsApp | 8.41 |
| `--error` | `#9b1c1c` [designed] | errors | verify ≥4.5 |

- **Focus:** a 2 px ring with a 2 px offset, in green-800 on light surfaces and gold-300 on solid dark. **Over the film** (hero, nav over hero) the ring is on-dark `#f4f1ea` with a 1 px green-950 outer halo, because gold-300 can fall to ≈2:1 over bright marble.
- **Legacy names:** old token names stay as aliases for one release, because the admin CSS still uses them.

### 2.2 Type

| Face | Role | Loading |
|---|---|---|
| Wordmark SVG (Cinzel 500 outlined, `aria-label`) | lockup | inline |
| Cormorant Garamond var. 500 (italic lazy) | display ≥28 px | self-hosted, preload |
| Manrope var. | body, UI, eyebrows, `tnum` | self-hosted, preload |
| IBM Plex Sans Arabic 500 "KEU Arabic" | all Arabic, nav بک کریں, ﷺ ﷻ | `:lang(ar)` / `.ar-face`; the subset is the **full U+0600–06FF block** (covers the harakat 064B–0652, 0670 and the Urdu letters ک 06A9, ی 06CC, ں 06BA, ہ 06C1, ھ 06BE, ے 06D2) **plus U+200C–200F, U+FDF2 and U+FDFA–FDFB**. Re-measure against the ≤90 KB gate. No Latin glyphs are relied on |
| Noto Nastaliq Urdu 400 "KEU Urdu" | Urdu display, `/packages` only | `:lang(ur)`, lazy |

| Token | Face | Desktop | Mobile | LH | Tracking |
|---|---|---|---|---|---|
| `hero` | Cormorant 500 | clamp(44px, min(5.2vw, 7.2svh), 104px) (height-aware) | 44 | .98 | −.01em |
| `d1` PageHeader | Cormorant 500 | 64 | 40 | 1.02 | 0 |
| `d2` H2 | Cormorant 500 | 52 | 34 | 1.05 | 0 |
| `d3` stat, H3 | Cormorant 500 | 56 | 40 | 1 | 0 |
| `d4` price | Cormorant 500 `tnum` | 36 | 32 | 1.1 | 0 |
| `d5` card name, quote | Cormorant 500 / italic | 28 | 28 | 1.2 / 1.35 | 0 |
| `lead` · `body` · `small` | Manrope 400 | 19 · 17 · 15 | 18 · 17 · 15 | 1.6 | 0 |
| `meta` · `caption` (floor) | Manrope | 14 · 13 | 14 · 13 | 1.5 | 0 |
| `button` · `label` | Manrope 600, sentence case | 16 | 16 | 1 | .01em |
| `nav` | Manrope 500 | 15 | — | 1 | .02em |
| `eyebrow` · `runhead` · `hud` | Manrope 500, caps | 12 | 12 | 1.2 | .24em |
| `stat-label` · `hud-control` | Manrope 500, sentence case | 14 | 14 | 1.4 | .01em |
| `ar-display` | Plex Arabic 500 | 28 | 24 | 1.3 (1.75 vocalised) | none |
| `ur-display` | Nastaliq 400 | 32 | 28 | 2.1 (2.2 multi-line) | none |

**Arabic and Urdu**
- Always set `lang` and `dir="rtl"`.
- Never split, track, stagger, scramble or animate Arabic or Urdu apart from its line. `lib/splitText.js` throws in dev when `el.matches(':lang(ar),:lang(ur)') || el.querySelector(':lang(ar),:lang(ur),.ar-face')`, so Arabic descendants are caught too.
- Set ﷺ in the Arabic face, never in Nastaliq.
- Urdu that must not load Nastaliq uses `lang="ur" class="ar-face"`. CSS order: declare `:lang(ur).ar-face, .ar-face { font-family: 'KEU Arabic' }` **after** the `:lang(ur)` rule, so the higher-specificity selector wins regardless of source order. QA asserts no KEU Urdu request on Home, About or Contact.
- Mixed-direction labels isolate the RTL run and keep Latin out of the Arabic face, e.g. the nav button: `<span lang="ur" dir="rtl" class="ar-face"><bdi>بک کریں</bdi></span><span aria-hidden="true"> · </span>Book`.
- The font gate loads only Manrope 400, Cormorant 500 and KEU Arabic 500, ≤90 KB at first paint.
- **font-display and fallbacks:** `font-display: swap` for Manrope, Cormorant and KEU Arabic, each with a metric-matched fallback `@font-face` (`size-adjust`, `ascent-override`, `descent-override`): Cormorant → 'Times New Roman', Manrope → Arial, KEU Arabic → Tahoma / Segoe UI. Measure the values with a fallback-metrics tool and commit them. KEU Urdu is preloaded on `/packages` route entry; Qafila Urdu elements use a px line-height and a `min-height` so the late swap reserves its box (CLS gate ≤0.05).

### 2.3 Spacing, grid, radius, z-index

**Spacing**
- Scale: `4 8 12 16 24 32 48 64 96 128 160`.
- Section padding: `clamp(80px,9vw,136px)`.
- Heading to content: 48 / 32.
- Card padding: 24 / 20.
- Tap targets ≥44. Primary buttons 52 on mobile, 48 on desktop.

**Focus not obscured (2.4.11)**
- `html { scroll-padding-top: calc(var(--nav-h) + 16px) }`; on `/packages`, `calc(var(--nav-h) + 44px + 16px)` for the sticky chips. Below 768, `scroll-padding-bottom` also reserves the ThumbBar.
- Lenis ignores CSS scroll-padding, so every `lenis.scrollTo` passes `offset: -` that same value.
- `#main-content` has `tabindex="-1"` so it can take focus after a route change.

**Grid**
- ≥1024: 12 columns, max width 1280, margin `clamp(24px,5.5vw,80px)`, gutter 24.
- 768–1023: 8 columns, gutter 20.
- <768: 4 columns, 16 px margin and gutter.

**Rules**
- **Margin rule (desktop):** a 1 px gold-hairline line at the left edge of column 1. It is the only rule allowed over video: it starts on the hero film, crosses the seam and anchors every running head, handing the grid from film to paper.
- **Column rules:** opt in per section with `data-rules="3|4|6"`. They are drawn as `border-inline-start` on grid children, so they stay pixel-snapped. Desktop only, at most one ruled section per screen.
- **Dividers:** hairlines that draw on reveal (T0).

**Shape and stacking**
- Radius: 2 for buttons, chips and inputs; 4 for cards; 0 for images.
- Shadow: on `::after`, animating opacity only.
- z-index: bg-stage −1 · thumb bar 80 · curtain 90 · nav 100 · FAB 110 · menu 115 · lightbox 118 · preloader 120.

### 2.4 Iconography

- Keep the `src/icons.jsx` keys.
- Icons are 1.5 px line icons on a 24 grid.
- On paper, use gold-800 or green-800. Gold-500 is for dark backgrounds only.
- Service and step icons sit inside an orbit halo.
- State icons are green-800 on paper and gold-300 on dark.
- No emoji. The package `icon` field is never rendered.

### 2.5 Imagery and footage etiquette

**Hero keep-out boxes.** Source coordinates are in the re-encoded film and must be verified on every contact-sheet frame:
- **K1, the Kaaba:** film x 49–89 %, y 25–88 %.
- **K2, the Maqam Ibrahim:** film x 30–52 %, y 64–90 %.

**AMENDED: layout uses viewport boxes, not film boxes.** The film renders `object-fit: cover` inside the `top:-8%; height:116%` overscan, with the 1.06 settle. Layout clearances are measured against the **worst-case transformed box** (overscan 116 %, scale 1.06, scrub yPercent 0, object-position fixed per aspect):
- Map: cover-scale the film into the media box, apply `object-position`, then scale 1.06 about the box centre, then offset by the −8 % top.
- At 16:9 with `object-position: 50% 50%` this gives roughly **K1 ≈ x 49–98 %, y 19–97 %** and **K2 ≈ x 25–53 %, y 67–99 %** of the viewport.
- At 16:10 a centred crop clips K1's right edge, so `object-position` x is chosen **per aspect** (16:9, 16:10, and 4:3 / 5:4 at ≥1024) as the value that keeps all of K1 plus 32 px in frame while leaving the widest copy column. A Phase 0 script computes the per-aspect `object-position` and boxes and emits them as CSS vars (`--k1-left`, `--k1-top`, `--k2-left`, `--k2-top`). If the resulting copy column is under 520 px, that aspect uses the 768–1023 plate layout.
- The `?safe` overlay draws the boxes **as children of the media wrapper**, so they inherit the same transforms.

Copy, rules, the HUD and the toggle all stay at least 32 px clear of both transformed boxes.

**Mobile plate.** The whole Kaaba sits inside the plate with at least 4 % margin, and no copy overlaps it. On Home <768 the nav sits on a solid green-950 bar and the plate starts below it (`margin-top: var(--nav-h)`), so the nav never covers the Kaaba. `?safe` also checks the mobile poster at 360, 375 and 414 widths.

**Stills.** Stills are framed plates (an inset hairline or a dome arch). The hero is the only full-bleed image. No text ever sits on a sanctuary image, which is why PageHeaders are split. No filters.

### 2.6 Motif library

**Orbit ring** (`ku-ring.svg`)
- Circle `r47`, stroke 1.5, `pathLength="360"`, `stroke-dasharray="44 21 272 23"`, `stroke-dashoffset="-13"`, rotated −90.
- For DrawSVG, use the arcs `M60.57 4.20 A47 47 0 0 1 89.42 24.40` and `M95.97 40.23 A47 47 0 1 1 41.84 3.71`.
- Uses: halos, step numerals, the preloader and the success state.

**Swoosh and aircraft** (`ku-swoosh.svg`: `M323.6 534.3C58.9 841.8 782.8 526.8 810 407.9`)
- Appears only in the preloader and the Services heading.
- Plays once, never scrubbed, no autoRotate.

**Dome arch**
- `aspect-ratio:6/7; border-radius:50% 50% 0 0/36% 36% 0 0; outline:1px solid var(--gold-hairline); outline-offset:6px`.
- Never a full semicircle.

**Sweep and ribbon** (`viewBox 0 0 1440 180`, `preserveAspectRatio="none"`)
- Fill: `M0 180V40C260 150 520 100 760 120S1200 60 1440 90V180Z`.
- Ribbon: `M0 38C260 148 520 98 760 118S1200 58 1440 88`, stroke 2, gradient token `--ribbon` (`#e3c38a → #e8cd94 → #fae0a1`), non-scaling.
- In the seam it is flipped, on green-950. In the footer it sits on `--band`.
- The letterhead ribbon gradient `--ribbon` (footer sweep, seam, PageHeader corner) is the only metallic gradient outside the logo.

**Corner device** (PageHeader, ≥480)
- `M0 0H270C180 12 60 62 0 137Z` plus the ribbon `M333 0C232 14 96 72 0 164`, stroked with the same `--ribbon` token (brand.md's separate `#e6cd94 → #fad78b` is folded into it).
- 320×140, max 22vw.

**Running head**
- The letterhead "Ref:" line, e.g. `04 ——— CHOOSE YOUR KARWAN`. Numbers follow the §5.1 storyboard order; each section's runhead is listed in the §6 runhead table.
- Manrope 500, 12 px, .24em, `tnum`. gold-800 on paper, gold-300 on dark.
- The 64 px rule draws on reveal (T0), flipped in RTL.

**Watermark**
- `ku-mark.svg` at 6 % with `multiply`, bottom-right, bleeding off the edge.
- Never behind text. No parallax.

**Lockup** (nav, footer and Contact only)
- Mark | divider | stack, at ratios wordmark 1 : INTERNATIONAL .52 (.45em, gold rules 3.8× cap) : TRAVEL & TOURS .37 (.35em).
- Header dividers are gold. **Footer contact dividers are green**, as on the letterhead.
- All three lines live in `wordmark.svg`, outlined, with `role="img" aria-label="Karwan e Usmania International, Travel & Tours"`.
- **Nav** renders only the mark and "KARWAN e USMANIA" (at a 40 px mark the lower lines would fall to ≈5–7 px). The full three-line lockup is for the footer and Contact, sized so TRAVEL & TOURS renders at ≥11 px.

---

## 3. Motion system

### 3.1 Tokens (`src/lib/motion.js`, mirrored as CSS vars)

| Token | GSAP | CSS | Use |
|---|---|---|---|
| quiet | `power3.out` | `cubic-bezier(.165,.84,.44,1)` | reveals, hovers |
| reveal | `power4.out` | `cubic-bezier(.23,1,.32,1)` | line masks |
| cinema | `expo.out` | `cubic-bezier(.16,1,.3,1)` | image curtains |
| settle | CustomEase | `cubic-bezier(.19,1,.22,1)` | hero settle |
| band | `power2.inOut` | `cubic-bezier(.65,0,.35,1)` | bands, hairlines, chapter wipe |
| curtain | `expo.inOut` | `cubic-bezier(.87,0,.13,1)` | route bands |
| glide | `power3.inOut` | `cubic-bezier(.76,0,.24,1)` | FLIP, reorders |

- **Durations:** 120 / 250 / 350 / 500 / 600 / 750 / 900 / 1200 ms.
- **Stagger:** .08 (.04 on low-end).
- **Behaviour:** play-once is the default, and GSAP alone sets the hidden states. Only the three rule-6 cases scrub. The only things that loop are the two films: no marquee, pulse or Ken Burns.

### 3.2 Reveal tiers

| Tier | Target | Motion | Trigger |
|---|---|---|---|
| T0 | hairlines, runhead rules, ribbon | scaleX / DrawSVG, 800 ms band (ribbon 1200) | `top 90%` |
| T1 | eyebrows, meta, buttons | opacity, y 12, 500 ms quiet | `top 88%` |
| T2 | grids, lattices | y 24, 600 ms quiet, stagger .08, batched | `top 85%` |
| Block | text + media | y 32, **750 ms quiet** (Rialto) | `top 80%` |
| Heading | **every** below-fold `.section-heading__title` | SplitText line mask 110→0, 900 ms reveal, stagger .08; H2s ≤6 words add a .04 word stagger (Rialto) | `top 85%` |
| T3 | framed images | `inset(100% 0 0 0)→inset(0)`, inner scale 1.12→1, 1200 ms cinema | `top 80%` |
| Count | stat figures | 1600 ms quiet, `tnum`, once | `top 80%` |

### 3.3 Preloader (first Home visit per session, `sessionStorage.keuIntro`)

The preloader runs in two phases:
- **Inline phase**, in `index.html`. CSS `stroke-dashoffset` keyframes only, with no GSAP and nothing render-blocking.
  - The markup ships **hidden by default** (`.keu-intro{display:none}`). A synchronous `<head>` script adds `html.intro-on` only when the sessionStorage flag is unset, `prefers-reduced-motion` is not `reduce` and Save-Data is off; only then does it set `inert` on `#root`. With JS off nothing shows.
  - **Failsafe owned by the inline script:** `setTimeout(4000)` checks `window.__keuIntroAdopted`; if unset (bundle failed or slow, e.g. the iOS WhatsApp in-app browser, where `navigator.connection` is absent), it removes `inert` and fades the node out with a CSS class.
- **React phase**, in `Preloader.jsx`. It sets `window.__keuIntroAdopted = true`, adopts the inline node and runs the bands and the FLIP once the Nav logo ref exists.

| t (ms) | Beat |
|---|---|
| 0 | Green-950 field, mark at 96 px, foot HUD visible. The inline script sets `inert` on `#root` (only under `html.intro-on`) |
| 80→1080 | Orbit ring draws (band) |
| 300→1100 | Swoosh draws |
| 500→1100 | K, U and Kaaba fill wipe (`clip-path`) |
| 900→1200 | **Lockup rules**: two 48 px gold-500 rules draw outward under the mark |
| 1000→1200 | Aircraft: opacity, x −6→0, rotate −8→0 (quiet) |
| 0→G | Counter 00→99. Manrope 12 `tnum`, gold-300 at .7, `aria-hidden`, driven by the gate |
| G = max(1200, drawn, fonts), **cap 2200** | Counter parks at 99 (RESEARCH §7.2). Never waits for video |
| G→G+800 | Bands `yPercent ∓100`, gold-500 inner edges, 800 ms band |
| G+200→G+1000 | Mark FLIPs into `.nav__logo-img` with a same-pixel swap, 800 ms glide. If the Nav is not mounted by the cap, it crossfades over 350 ms instead |
| G+300 | Hero settle and T1 begin. `inert` is removed. Mark `keu:hero-revealed` |

**Foot HUD**
- Content: "WhatsApp +92 333 4883578", a link to `wa.me/923334883578`, beside a "Skip intro" button.
- Style: `hud-control` (Manrope 500, 14 px, sentence case), gold-300, with 44 px targets. These are controls, so rule 5 keeps them out of tracked caps. Text stays under 24 px so it can never be the LCP element.
- These are the first focusables on the page.
- Esc, Skip, wheel, touchmove, or keydown Space / PageDown / PageUp / arrow keys / Home / End opens the bands in 400 ms and skips the FLIP. The skip path removes `inert` synchronously.

**Variants**
- **Low-end:** no counter, cap 1200.
- **Save-Data, reduced motion or no JS:** no preloader (the markup stays `display:none`).
- **Deep-link first visit:** the bands are closed at first paint, showing the 32 px mark and the destination caption. They open over 600 ms once fonts are ready (cap 900), with no draw and no counter.
- **Internal navigation:** never shows it.

**Budget:** 2.0 s typical. Worst case: bands open at 3.0 s (cap 2200 + 800), FLIP ends at 3.2 s. Gate: p75 `keu:hero-revealed` ≤3.0 s on mobile.

**Implementation:** only the visual layer is `aria-hidden`. It must stay idempotent under StrictMode, so guard it with both a sessionStorage flag and a module flag.

### 3.4 Hero

**Scrims**
- Vertical: `linear-gradient(180deg, rgba(0,36,15,.50) 0, rgba(0,36,15,.15) 40%, rgba(0,36,15,.78) 100%)`.
- **AMENDED** (RESEARCH §7.3 specified a flat `rgba(0,36,15,.45)` side gradient; that cannot hold AA over white ihram). Side, desktop, tied to the copy column's right edge `--col-end` (which is `--k1-left − 32px`): `linear-gradient(90deg, rgba(0,36,15,.82) 0, rgba(0,36,15,.74) calc(var(--col-end) + 24px), rgba(0,36,15,.30) calc(var(--col-end) + 10%), transparent calc(var(--col-end) + 18%))`. Fixed-percentage stops are not allowed, because the column can reach ≈47 % where a 40 % stop has already decayed to ≈.44.
- **Nav band** (Home, over the film): `linear-gradient(180deg, rgba(0,36,15,.72) 0, rgba(0,36,15,.72) 88px, rgba(0,36,15,0) 160px)`, so nav links, the WhatsApp button and the focus ring sit on ≥.72 (on-dark ≈6.0:1, gold-300 ≈4.0:1). A backdrop blur adds no contrast.
- All text and controls sit on a composite (side + vertical + nav band) scrim of ≥.72.
- Over pure-white ihram the computed contrast is ≈6.0:1 for on-dark and ≈4.8:1 for gold-200. On-dark-muted (≈3.9) is banned over video.
- QA script: on the brightest contact-sheet frame, sample the composite alpha at the bounding boxes of the eyebrow, H1 (including its right edge), Arabic line, CTAs, nav links and focus ring, and assert ≥.72.

**Motion**
- Media overscan: `top:-8%; height:116%`.
- Settle: scale 1.06→1 over 2000 ms. The poster settles too.
- Exit, scrubbed .6 from `top top` to `bottom top`:
  - media yPercent 0→15
  - darken layer 0→.85
  - content yPercent −30, faded out by 70 %

**H1**
- Painted at opacity 1 under the curtain, which makes it the LCP element **at ≥1024**.
- **<1024 the poster plate is the LCP element** (a ≈375×499 plate outweighs the H1). Preload it inline in `index.html`: `<link rel="preload" as="image" href="/hero/poster-mobile-3x4.webp" fetchpriority="high" media="(max-width:1023px)">` (and the 16:9 tablet poster under its own media query). Use a fixed `public/` path (or a Vite-injected hashed URL), never Cloudinary `f_auto`, so the preload URL matches. Render `<img fetchpriority="high" width="720" height="960" alt="">`, never lazy-loaded, ≤70 KB. The preloader's opaque layer must not delay the request.
- Only the eyebrow, Arabic, CTAs and HUD run T1, from G+420.
- On later route entries the H1 fades in over 500 ms through GSAP.

**Video gate (≥768)**
- Poster only for reduced motion, Save-Data, 2g/3g and low-end devices (≤4 GB or ≤4 cores). **AMENDED:** previously 720p.
- `preload="none"` until attach. Set `src` in JS (no `<source media>`) once, after LCP, load and idle, per footage.md: `innerWidth >= 1024 && innerWidth * devicePixelRatio > 1280` → 1080, else 720. A 1920×1080 DPR-1 desktop and a 1280 px DPR-2 laptop both get 1080.
- Fade in over 750 ms on `playing` plus `requestVideoFrameCallback`, with `play().catch(keepPoster)`.
- Pause when off-screen or when the tab is hidden.
- Below 768, never request video.

### 3.5 Route transition (`TransitionRoutes` + `PageCurtain`)

1. **Cover:** green-950 bands close in 600 ms (curtain ease), meeting on their gold-500 edges.
2. **Hold:** 120–400 ms, showing the 32 px mark and the destination caption (`PACKAGES`, 12 px, .28em, gold-300). Under cover: `lenis.stop()` → `flushSync` swap → `jumpTo` → nav state → `ScrollTrigger.refresh()` → `lenis.start()`.
3. **Reveal:** 700 ms. The PageHeader T3 starts at 60 % of the reveal, so it reads as one cut. After `jumpTo`, focus moves to `#main-content` (`tabindex="-1"`, `focus({preventScroll:true})`), and `aria-live` announces the page title.

- During cover and hold, `#main-content` and the footer are `inert` (the nav and FAB stay live). A navigation requested mid-transition is queued; only the last one runs.

**Exceptions**
- Back/forward: 450 ms each way.
- Same-page hash links, `wa.me` and `tel:`: no curtain.
- Low-end: 250/350 ms crossfade. Reduced motion: 200 ms crossfade. Save-Data: instant.
- `/admin`: never wrapped.

### 3.6 Nav and micro-interactions

**Nav**
- Home, `scrollY < 80`, ≥768: transparent with a 12 px blur, over the §3.4 nav band.
- Home, `scrollY ≥ 80`, and all inner routes: paper at .96 with a hairline edge and green-800 text. Inner routes set this state while the curtain is closed.
- Home <768: solid green-950 bar (no glass) above the poster plate (§2.5).
- `aria-current` is shown by weight 600 plus the underline (and on-dark colour over the film), never by a gold-500 underline alone.
- The bar shrinks 80→64 px through scaleY over 350 ms.
- It never hides.

**Micro-interactions**
- Link underline: scaleX over 300 ms, gold-500 over the film and green-800 on paper.
- Buttons: colour change over 250 ms. Text-link arrows nudge 4 px.
- Cards: lift −4 px over 250 ms.
- Images: scale 1.03 over 600 ms (pointer:fine only).
- Magnetic pull (±12 px, pointer:fine): the hero WhatsApp button and the FAB only.
- FAQ rows and `<details>` (progressive enhancement, no JS intercept): `:root{interpolate-size:allow-keywords}` and, under `@supports selector(::details-content)`, `details::details-content{block-size:0;overflow:hidden;transition:block-size .45s var(--ease-quiet),content-visibility .45s allow-discrete} details[open]::details-content{block-size:auto}`. Other browsers toggle instantly; reduced motion is always instant.
- Chips: Flip over 600 ms.

### 3.7 Capability matrix

| Feature | Full | Low-end | Save-Data / 2g–3g | Reduced motion |
|---|---|---|---|---|
| Preloader | cap 2.2 s | no counter, 1.2 s | none | none |
| Hero ≥768 | 1080/720 loop | poster | poster | poster + "Play film" |
| Hero <768 | poster plate | poster plate | poster plate | poster plate |
| Settle / exit | on | darken only | darken only | static |
| bg-stage | scrubbed | scrubbed | scrubbed | hard switch |
| Sanctuary | pin ≥1024 / in-flow wipe | in-flow wipe | in-flow wipe | stacked |
| Madinah loop | ≥1024 | poster | poster | poster |
| T1 / T2 / Block | on | stagger .04 | on | opacity 200 ms |
| Heading / T3 | on | fade 600 ms | fade 600 ms | visible |
| Route | bands | crossfade | instant | crossfade 200 ms |
| Lenis | on | on | on | off |
| T0 draws (hairlines, runhead rules, ribbon, swoosh + aircraft, Qafila frame, steps rail) | on | on | on | final state, no draw |
| Count | 1600 ms | 1600 ms | on | final value |
| MobileMenu wipe | 900 ms polygon | 350 ms fade | on | 200 ms fade |
| Lightbox | 350 ms crossfade | on | on | 200 ms fade |
| FAQ / `<details>` | `::details-content` 450 ms | on | on | instant |
| Chips Flip | 600 ms | instant | on | instant |
| Card lift, image scale, magnetic pull | on (pointer:fine) | colour only | on | colour only |
| ThumbBar | slide in | slide in | on | appears, no slide |
| Mobile poster settle | on | off | off | off |

**Counters:** animate an `aria-hidden` span beside a visually hidden final value, so screen readers never read intermediate numbers.

**motionEnv:** an unknown API (`deviceMemory`, `hardwareConcurrency`, `navigator.connection` are missing in Safari / Firefox) counts as "not low-end, not Save-Data". Subscribe to `matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change')` so the mode switches live.

### 3.8 WCAG 2.2.2 pause control

- **Hero (≥768):** a 44 px circle **inside the copy column, after the CTAs** (bottom-right sat inside transformed K1), with an on-dark ring. It is a plain `<button>` whose visible label swaps between "Pause film" and "Play film" (no `aria-pressed`). The FAB is hidden while the hero CTAs are on screen, so the two never collide.
- **Madinah arch:** a 44 px control at bottom-left, inside the frame and clear of the dome.
- Both start paused under reduced motion, and the chosen state persists for the session.

---

## 4. Components

Each spec covers anatomy, states, motion and a11y. Tokens are named as in §2.

**Nav** (`Nav.jsx`)
- Layout: BrandMark (40 px, 32 on mobile) and the one-line Wordmark (§2.6 Lockup), five links, then the WhatsApp button "بک کریں · Book" (markup in §2.2: only the Urdu run is in `.ar-face`).
- Mobile: the mark, a 44 px WhatsApp icon and a 44 px menu button. On Home it is a solid green-950 bar (§2.5).
- States: over-film, paper and menu-open (§3.6).
- a11y: "Skip to content" follows the preloader links. The current page link has `aria-current`.

**MobileMenu** (new)
- A full-screen green-950 panel, the same treatment as every other overlay.
- Links in Cormorant 40, each with a gold-300 `01–05` runhead.
- Foot: WhatsApp and Call at 52 px, plus the hours in PKT.
- Motion: a polygon wipe over 900 ms (`power4.inOut`), then the links run T1.
- a11y: `main` is inert, focus is trapped, Esc closes and focus returns to the trigger.

**VideoHero** (replaces `Hero.jsx` and `useThreeScene.js`; keeps `#hero` and `.hero__title`)
- ≥1024: the margin rule, then a copy column running from column 1 to `--col-end` (`--k1-left − 32px`, transformed box, §2.5). In order: eyebrow, H1 as three spans, Arabic line, CTAs, pause toggle. It is a flex stack with 16 / 24 px gaps (not the 48 / 32 section rhythm). The column starts at 20 % of the hero's height and its bottom edge sits at least 32 px above `--k2-top` (H1 is height-aware, §2.2). The HUD reads only "MASJID AL-HARAM · MAKKAH" and sits bottom-left, ending at least 32 px before `--k2-left`; if it cannot, it stacks in the copy column above the eyebrow.
- 768–1023, portrait, and any aspect whose computed column is <520 px: a 16:9 film plate above the copy, set on green-950.
- <768: the solid green-950 nav, then a 3:4 poster plate at `min(62svh,133vw)` (the LCP element, §3.4), then the foot gradient, eyebrow, H1 (44 px), Arabic (24 px), and two stacked 52 px CTAs (no sentence; see §5.1 time to price).
- a11y: the video is `aria-hidden`, muted and `playsinline`. The poster has empty alt.

**TransitionRoutes, PageCurtain, BgStage** (new)
- `PublicShell` becomes a layout route, so the chrome persists across pages.
- BgStage is fixed at z −1 and holds dark, paper, ivory and green layers. Only their opacity changes.
- Each section declares `data-surface`. Sections inside a fade zone have transparent backgrounds.
- **Crossfades complete in text-free space.** At the midpoint the stage is ≈#7e8f84, where every text colour fails AA, and the scrub is user-controlled. So the fade range is the incoming section's top padding only (e.g. `start:'top bottom', end:'top 75%'`, with content starting after padding ≥ `clamp(80px,9vw,136px)`), and no text box may intersect the viewport band while stage opacity is .25–.75. The text colour switches only once the fade is complete. A Playwright check scrolls each fade to its midpoint and runs axe colour-contrast.
- Without JS, every section keeps its solid colour.

**SectionHeading and Eyebrow**
- Order: runhead, then `h2.section-heading__title` (d2, green-800, balanced), then a lead of 58 characters or fewer.
- The `bismillah` kicker prop is removed. Arabic appears only where §6's Arabic table lists it; the hard-coded kickers are not "source copy" (§6 Removed).
- Never place a decorative religious kicker above commerce.
- Eyebrow: 12 px caps at .24 em, at most 48 characters. gold-800 on paper, gold-200 on video, gold-300 on dark.

**Buttons** (all 48 px tall, 52 on mobile; radius 2; sentence case at 16/600; 20 px leading icon)
- **Primary:** green-800, white label, green-900 on hover.
- **Ghost:** 1 px green-800 outline.
- **On-dark:** `#f4f1ea` fill, green-950 label.
- **Ghost on dark:** 1 px gold-300 outline ("View packages").
- **WhatsApp:** `--wa` fill, green-950 label and glyph, used for every WhatsApp CTA.
- **Text:** green-600 with `→`.

**PackageCard** (`PackageCard.jsx`; identical in the 360 px admin preview)

White flex column, 1 px gold-hairline border, radius 4. `.package-card { container-type: inline-size }`: every size variant switches on `@container (max-width: 400px)`, never on the viewport, so the 360 px admin stage renders the narrow variant on a desktop screen. Top to bottom:
1. `TIER · CATEGORY` eyebrow, with the `badge.trim()` tag inline.
2. `name` (d5, green-800, 2 lines max).
3. `subtitle`; prefixed by `{nights} nights ·` only when `nights > 0` and `subtitle` does not match `/\bnights?\b/i` (data.js subtitles already say "14 Nights · 3-Star Hotels").
4. `priceLabel` verbatim (d4, `tnum`), then "per person" when `perPerson !== false && !isOnRequest`.
   - `isOnRequest = !/\d/.test(priceLabel)` (Umrah only; no Hajj category is offered).
   - **`price` is never shown or sorted.**
5. A hairline.
6. Inclusions, each with the same generic `aria-hidden` check icon from `icons.jsx` (the data has no icon key). All are in the DOM; CSS shows 6 (4 in the narrow container) and "+N more" is computed from the data.
7. `summary` clamped to 4 lines (3 narrow) and marked `aria-hidden="true"`, then `<details>` "Full package details" holding the full text with `white-space:pre-line`, so screen readers read it once.
8. "Book on WhatsApp" (or "Enquire on WhatsApp"), linking to `wa(pkg.id)`, pinned with `margin-top:auto`.

Variants and rules:
- **VIP** (`tier==='vip'`, never `featured`): green-950 field, gold-300 hairline, on-dark text.
- **On request (defensive, any package whose `priceLabel` has no figure):** ivory field. The price slot shows "Price on request" and the package `subtitle` verbatim (e.g. "Government Quota" comes from data). No other claim is added.
- Anchors keep the **raw `id`** (`#${pkg.id}`). It is a link contract shared with `schemas.js:85,96,105`, `scripts/generate-seo.js:42` (sitemap) and `Footer.jsx:50`, and shared links already use it.
- Markup: an `<article>` with an `h3`.
- Motion: T2.

**ServicesStrip**
- Columns 1–5: the heading, with the swoosh.
- Columns 6–12: a 3×2 lattice (`gap:1px` on gold-hairline). It becomes 2×3 on mobile.
- Each cell: an orbit-halo icon in gold-800, the label (16/600) and the sublabel (14).
- Remove `dangerouslySetInnerHTML`.
- Motion: the swoosh draws once over 1200 ms, then the aircraft fades in. The lattice is T2.

**BookingSteps** (new)
- An `<ol>` of four 48 px orbit numerals joined by one hairline. On mobile the hairline becomes a vertical rail.
- CTA: "Start step 1 on WhatsApp".
- Motion: the rail draws (T0).

**SanctuaryChapter** (replaces `SanctuariesSection.jsx`; the one pin)

≥1024 (motion OK, not Save-Data): pinned for `+=150%` on ivory.
- Columns 1–5: runhead (`07 · MAKKAH AL-MUKARRAMAH` → `07 · MADINAH AL-MUNAWWARAH`; one chapter, one number), Arabic city name, H3 (d3), body and mini CTA.
- Column 6: a progress rule.
- Columns 7–12: a 560×653 arch. Makkah shows `makkah-kaaba-kiswa`; Madinah shows `madinah-720.mp4`, poster first, attached on pin enter and paused on leave.

Pin timeline (scroll progress):

| Progress | What happens |
|---|---|
| 0–.40 | Makkah holds |
| .40–.62 | Madinah rises inside the arch (inset 100→0, scale 1.12→1, band). Makkah text exits to −110 behind masks while Madinah's enters. The Arabic line crossfades whole |
| .62–1 | Madinah holds |

<1024 (the mobile signature moment): no pin, no sticky. The order is Makkah text, then one 343×400 arch, then Madinah text. The arch's wipe is scrubbed to its own passage through the viewport (`top 70%` → `bottom 30%`), so the city turns as you read past it. Poster only.

a11y:
- Both blocks stay in the DOM, the accessibility tree and the tab order. **No `inert`, no `aria-hidden`.**
- The inactive block is hidden with clip and opacity only.
- `focusin` scrolls to that block's hold point.
- Reduced motion: stacked and static.

**WhyUs bento** (`WhyChooseUs.jsx`)
- A 2×2 hairline lattice (one row of 4 on About).
- Each cell: a gold-800 icon, the title (18/600, green-800) and the body verbatim.
- Motion: Block.

**Stats ledger** (`StatsSection.jsx`)
- One ruled row of 4; a 2×2 cross on mobile.
- Figures in d3 green-800 with gold-600 suffixes on paper (gold-800 suffixes on ivory, e.g. About); labels in `stat-label` (Manrope 500, 14 px, sentence case, text-muted), per rule 5.
- The licence slot appears only when its data exists.
- Keep `data-count` and `data-suffix`. The final values are real text (Count a11y in §3.7).

**Testimonials**
- Static columns divided by hairlines: 3 columns for N=3; **a 2×2 hairline grid for N=4** (the live row has 4); for N≥5, 3 columns with the rest behind "Show more". Nothing is silently dropped.
- Each: a gold-600 quote mark (ivory surface: gold-800), the quote in d5 italic, a 48 px rule, the name (15/600) and `location · trip` (14).
- Mobile: 2 visible, then "Show more".
- **No stars, initials or carousel.**
- Markup: `figure`, `blockquote`, `figcaption`.

**Qafila chapter** (`QafilaSection.jsx`; keeps `#qafila`)
- The bg-stage fades paper to green and back. A 20 px inset gold-300 frame draws on all four sides over 1200 ms.
- Content, in order:
  - the endorsement "A spiritual journey by Karwan e Usmania International"
  - `قافلہ شوق` in Nastaliq
  - "Qafila e Shoq" (d2)
  - tagline, leader line, intro and body
  - four pillars in a gold-500 lattice, each with its Urdu word
- The seal appears only after retrace and consent; the photo only if supplied.
- CTA: "Apply via WhatsApp" → `wa('qafila')`.

**FAQ** (`FAQSection.jsx`; keeps `#faq`, `.faq-item__q` and microdata)
- Columns 1–4: CSS-sticky heading.
- Columns 6–12: native `<details>` rows, at least 56 px tall, `.faq-item__q` on the `<summary>`; animation per §3.6.
- State icon in green-800. The first row starts open.

**CTA band** (`CTABanner.jsx`)
- On paper, between double hairlines, columns 3–10.
- Contents: eyebrow, H2, chips (Umrah / Qafila e Shoq / General → `wa('umrah'|'qafila'|'general')`), a WhatsApp button, a Call ghost (`tel:+923334883578`) and the hours.

**Footer** (`Footer.jsx`)
- The sweep sits on the band gradient, with `geometric.svg` at 4 %.
- Lockup with a solid gold-300 wordmark.
- A contact row with green dividers: address · landline + mobile · email + `usmania.vercel.app` · hours.
- Landline source: a new optional key `company.landline`, code default `'+924235136177'` (the schema has no landline field and `company.phone` holds the mobile; the admin preserves unknown keys).
- Links, live packages and socials.
- Credit line: "© {year} Karwan e Usmania International · Travel & Tours".
- No motto here. Normal flow, with mobile padding for the thumb bar.

**WhatsApp FAB** (≥768)
- A 56 px `--wa` disc at z 110.
- It appears once the hero CTAs leave the viewport.
- A disclosure button (`aria-expanded`, `aria-controls`) over a list of `wa.me` links: Umrah / Qafila e Shoq / General. Click, Enter or Space opens it and moves focus to the first link; Esc closes it and returns focus to the FAB. Nothing is hover-only. Not `role="menu"`.
- Hidden on `/contact` and while the menu is open. No pulse, no greeting bubble.

**ThumbBar** (<768, new)
- 64 px plus the safe-area inset, on paper at .98.
- WhatsApp takes 2/3 of the width; Call (`tel:+923334883578`) takes 1/3.
- It slides in after the hero CTAs leave the viewport.
- It hides when the menu is open, when a field has focus, and over the CTA band.
- `scroll-padding-bottom` reserves its height (scroll-padding-top and Lenis offsets in §2.3).

**PageHeader** (split; on every inner page)
- ≤56vh, on paper.
- Columns 1–6: breadcrumb, runhead, H1 (d1), lead.
- Columns 7–12: the still in a 20 px inset frame, with the corner device.
- **No type on the image.**
- Its T3 starts at 60 % of the route reveal.

**Gallery and lightbox** (`GalleryGrid.jsx`)
- Masonry: `wide` spans 8 columns, `tall` spans 2 rows; 2 columns on mobile.
- Each image has a hairline frame and its `alt` text as the caption.
- The first 6 use T3; the rest use Block.
- Lightbox: green-950 at .96, 350 ms crossfades, arrows, 48 px close, swipe, Esc and a focus trap.

**Contact form** (`ContactForm.jsx`)
- Same fields as today.
- Labels always visible (16/600). Inputs 52 px tall with 17 px text.
- **Border: 1 px text-muted** (≥3:1). Focus: a 2 px green-800 ring.
- Phone: `type="tel"`, hint "Include country code if outside Pakistan, e.g. +971…".
- Package options come from the live packages, plus "General enquiry".
- Errors are inline, with an icon, `aria-describedby` and `aria-invalid`.
- Success: the orbit ring draws, then "JazakAllah Khair. Our Lahore office will reply on your preferred channel." with a WhatsApp button. No reply time is promised. Focus moves to the success heading (`tabindex="-1"`), and the message is also in a `role="status"` region.

---

## 5. Page storyboards

### 5.1 Home

Surfaces run hero (dark) → paper → ivory (steps) → paper → ivory (chapter) → paper → ivory (testimonials) → paper → green footer. Light-to-light changes cross-fade on the bg-stage.

| # | Section | 1440 | 375 | One motion idea | CTA |
|---|---|---|---|---|---|
| 0 | Preloader | §3.3 | 80 px mark | handshake | WhatsApp, Skip |
| 1 | `#hero` | left column, H1 height-aware ≈52–104, HUD, toggle | plate + ground, H1 44 | settle | Chat on WhatsApp · View packages |
| 2 | Seam (200 / 140 px) | flipped sweep + ribbon; on paper: about.story[2] in Cormorant italic 28 (desktop), then the motto between hairlines (its only appearance) | 72 px sweep + motto | scrubbed paper cross-fade; ribbon draws once | — |
| 3 | Ledger | 4 ruled figures + licence slot | 2×2, **moved below #4 on mobile** | counters | — |
| 4 | `#packages-preview` | runhead, H2, lead, live cards, trust line, "All packages and Qafila e Shoq →" | 1 column (directly after the seam) | T2 | card WhatsApp, See all packages |
| 5 | Booking steps | 4 columns + rail | vertical rail | rail draw | Start step 1 on WhatsApp |
| 6 | Services | heading + swoosh, lattice | 2×3 | swoosh, once | Ask what's included → |
| 7 | Sanctuary chapter | pin + Madinah loop | in-flow arch wipe | chapter wipe | See Umrah packages → · Ask about ziyarah → |
| 8 | Why us | bento | stacked | Block | — |
| 9 | Testimonials | 3 ruled columns | 2 + Show more | Block | — |
| 10 | `#faq` | sticky head + accordion | stacked | accordion | Ask on WhatsApp → |
| 11 | CTA band | double-ruled letter | chips stacked | rules draw | chips, WhatsApp, Call |
| 12 | Footer | §4 | §4 | ribbon | contact rows |

Time to price at 375×812, estimated from the mobile specs:
- Hero: nav 64 + plate 499 + eyebrow 16 + H1 3×43 ≈ 130 + Arabic 31 + sentence 4×27 ≈ 108 + two CTAs 116 + gaps ≈ 120 + padding 48 ≈ **1130 px**. Seam 140. Ledger 2×2 with section padding ≈ **380 px**. Packages heading block ≈ 280 px, then ≈ 150 px to the first `priceLabel`.
- In the §5.1 order the first price lands near 2080 px, on screen 3, so "the price is on screen 2" fails as drawn.
- **AMENDED for <768:** the ledger moves below Packages, and the mobile hero drops the sentence (it stays in Why us). That gives ≈ 1020 + 140 + 280 + 150 ≈ **1590 px**, inside screen 2 (≤1624).
- Phase 3 acceptance measures it: first `priceLabel` top ≤1624 px at 375×812.

### 5.2 Inner pages

**Packages**
- PageHeader: "Umrah, the way it should be." with the Kaaba still, framed.
- Sticky 44 px chips from `FILTERS`. Hide any chip with no packages. Each chip is a `<button aria-pressed>`; selected = green-800 fill with a white label (not a gold-hairline border, which is 2.0:1). A filter change announces "{n} packages" in an `aria-live="polite"` region, and the Flip reorder never moves focus.
- Ruled 3-column grid, then the trust line and the licence slot.
- Qafila chapter → FAQ → CTA band.
- Delete `Packages.jsx:27-32`.

**About**
- PageHeader: "A Karwan rooted in service."
- `about.story` (Block) beside an arch image (T3). story[3] is pulled out between hairlines.
- Ledger → Why us.
- Team: the 7 live people, under "Meet the Karwan". The chairman gets a large 4:5 frame, the rest sit 3-up. Show an initials plate in Cormorant Garamond 500 caps (already loaded; Cinzel ships only as outlined wordmark paths) when a photo is missing.
- CTA band.

**Gallery**
- PageHeader: "Glimpses from the Haramain." Drop "shared by our pilgrims".
- Masonry → lightbox → "Plan your own journey →".

**Contact**
- PageHeader: "We are here to help", with `السلام علیکم` on its own line.
- The letterhead footer, enlarged: lockup plus green-divided columns for address · phones · email + hours.
- Umrah / Qafila e Shoq / General WhatsApp rows.
- Form (7 columns) and map (5 columns, repinned to Johar Town). This fixes `Contact.jsx:45,66`.
- Mobile order: contact, WhatsApp rows, form, map.

---

## 6. Content and voice

**Rules**
- Plain, warm, unhurried English.
- No superlatives beyond the data.
- Never paraphrase upward: "trusted partners" never becomes "our own".
- No response-time promises.
- No religious phrase used as decoration above prices.
- Hours in PKT.
- The name is always "Karwan e Usmania International".

| Slot | Copy (source) |
|---|---|
| Hero eyebrow | KARWAN E USMANIA INTERNATIONAL · SINCE 2008 |
| Hero H1 | Your Journey / to the Holy Land, / Our Priority (letterhead) |
| Hero Arabic | خدمات ضيوف الرحمن (owner decision) |
| Hero sentence | Not shown in the hero (dropped on mobile for time to price, §5.1). `whyChooseUs[0]` stays in Why us |
| HUD | MASJID AL-HARAM · MAKKAH (shortened to stay clear of transformed K2, §4 VideoHero) |
| Seam | Our team in Lahore and our partners in Makkah and Madinah work as one Karwan, walking with you through every stage of your spiritual journey. (`about.story[2]`) · FAITH × JOURNEY × TOGETHER |
| Ledger | `stats` as written. Licence: "DTS Licence No. [owner to supply] · IATA [owner to supply]" (hidden) |
| Packages | "Choose your karwan" · "Packages Crafted for Every Family" · "Economy comfort to VIP indulgence — every package is built around the Haram experience." |
| Trust line | Prices per person · every cost explained in writing before you commit (`whyChooseUs[2]`, not paraphrased upward) |
| Steps | H2 "From your first call to your safe return." (`whyChooseUs[3]`). Steps: 1 Message us on WhatsApp: "Tell us your dates and who is travelling. WhatsApp us anytime, even from the Haram itself." · 2 Choose your package: "Every cost is explained upfront, in writing, before you commit." · 3 Visa and documents: "Visa processing is handled by our team." · 4 Travel with support: "Our trusted partners in Makkah and Madinah handle hotels, transport and ziyarah." [owner to approve] |
| Services · Chapter · Why us | "Our Services" + existing subtext; `sanctuaries[]`; "Why Pilgrims Choose Us". All as written. Drop the "18 years…" subtext (Q1) |
| Testimonials · FAQ | "Voices from Our Pilgrims" · "Frequently Asked Questions", with the "within an hour" promise removed |
| CTA band | "Ready to begin?" · "Let us plan your sacred journey." · hours "(Pakistan time)" |
| Footer | Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town, Lahore · +92 42 35136177 · +92 333 4883578 · keusmania@gmail.com |

| Arabic / Urdu | Settings | Where |
|---|---|---|
| خدمات ضيوف الرحمن | `ar` rtl, Plex, 1.3 | hero, footer |
| مكة المكرمة · المدينة المنورة | `ar` rtl, Plex | chapter |
| بک کریں · السلام علیکم | `ur` rtl, `.ar-face`, `<bdi>`-isolated | nav, Contact |
| قافلہ شوق · عبادت ریاضت تربیت سیاحت | `ur` rtl, Nastaliq 2.1 | Qafila only |
| ﷺ ﷻ | `.ar-face` span | wherever the data has them |

| Runhead | Section (§5.1 #) |
|---|---|
| `04 ——— CHOOSE YOUR KARWAN` | Packages preview |
| `05 ——— BOOKING STEPS` | Booking steps |
| `06 ——— OUR SERVICES` | Services |
| `07 · MAKKAH AL-MUKARRAMAH` → `07 · MADINAH AL-MUNAWWARAH` | Sanctuary chapter |
| `08 ——— WHY PILGRIMS CHOOSE US` | Why us |
| `09 ——— VOICES FROM OUR PILGRIMS` | Testimonials |
| `10 ——— QUESTIONS` | FAQ |
| `11 ——— READY TO BEGIN` | CTA band |

Inner pages number their own sections from 01.

- **Removed: every hard-coded Arabic kicker** (the `bismillah` prop): اَلْحَمْدُ لِلَّهِ (`Home.jsx:42`, Packages), جَزَاكَ اللهُ خَيْرًا (`TestimonialsSection.jsx:9`), بِسْمِ اللَّهِ (`About.jsx:46`), سَوَالاَت (`FAQSection.jsx:28`), اَلْحَرَمَيْنِ الشَّرِيفَيْنِ (`SanctuariesSection.jsx:11`), اَلسَّلَامُ عَلَيْكُمْ (`WhyChooseUs.jsx:27`), اَلْكَرْوَانُ (`About.jsx:68`), and the full basmala in `Hero.jsx:21` (deleted with Hero.jsx). The Services kicker خدمات ضیوف الرحمن (`ServicesStrip.jsx:11`, Persian ye) is removed there; the owner-approved tagline خدمات ضيوف الرحمن appears only in the hero and footer.
- **Placeholders, rendering nothing until supplied:** licences, postcode, Qafila dates and seats, leader photo, seal, price basis.

---

## 7. The build workflow

- d = engineer-days.
- ∥ = lanes that agents can run in parallel.
- Every phase ends with a green `npm run build` and a preview deploy.

| Phase | Effort | Parallel lanes |
|---|---|---|
| 0 Owner decisions + assets | 2–3 d | encode ∥ SVG ∥ fonts |
| 1 Plumbing | 3 d | tokens+fonts ∥ motion+env ∥ Lenis+cleanup |
| 2 Global chrome | 4 d | Nav+Menu ∥ Footer+Lockup ∥ FAB+ThumbBar ∥ Transitions+BgStage |
| 3 Home | 6 d | Preloader+Hero+Seam ∥ Card+Grid+Ledger ∥ Chapter ∥ other sections |
| 4 Inner pages | 4 d | one lane per page |
| 5 Identity, SEO, icons | 2 d | sweep ∥ OG cards |
| 6 QA | 3 d | audits ∥ |
| 7 Launch | 1 d + 2 weeks | — |

Total: about 25 d, or 13–15 calendar days.

### Phase 0: Owner decisions and assets

**Files**
- `src/assets/media/hero-1080.mp4`, `hero-720.mp4`, `hero-poster-1920.webp`. Re-encode from the 4K Pexels source 35110835 (download it again; it is not kept in the repo) with `crop=3072:1728:0:320,scale=1920:1080`. Keep the 0.5× retime, the 1 s xfade seam, `-an` and 2-pass. **Done:** the encoded 1080p loop (3.58 MB, 14 s) and its poster are in `docs/rebrand/assets/media/`.
- `hero-poster-mobile-3x4.webp`: `crop=1380:1840:1383:320,scale=720:960` (done, 61 KB, in `docs/rebrand/assets/media/`).
- `madinah-720.mp4` (720×1280, 1,216,289 B), `madinah-poster.webp` and the kiswa still (done; in `docs/rebrand/assets/media/` and `docs/rebrand/assets/media/stills/`). Phase 0 copies them, the encoded hero files and the brand SVGs (`docs/rebrand/assets/brand/`) from `docs/rebrand/assets/` into `src/assets/media/` and `src/assets/brand/`.
- Phase 0 script: computes the per-aspect `object-position` and transformed K1/K2 boxes (§2.5) and writes them as CSS vars.
- `src/assets/brand/` `ku-mark.svg`, `ku-mark-reversed.svg`, `ku-ring.svg`, `ku-swoosh.svg`, plus the new `wordmark.svg`.
- `public/fonts/*.woff2`.

**Deliverables:** §8 answers, Vercel Pro, and staged corrected content.

**Accept when**
- An 8-frame contact sheet shows K1 and K2 inside their boxes and no roundel.
- The seam scores SSIM ≥0.95.
- Size budgets hold: 1080 ≤3.7 MB, 720 ≤1.9 MB, posters ≤160 KB and ≤70 KB.
- Each SVG is <60 KB and stays crisp at 32 px.

### Phase 1: Plumbing

**Files**
- `package.json`: gsap ^3.13 and lenis ^1.3. **`three` and `@types/three` stay until Phase 3**, because `Hero.jsx:9` still calls `useThreeScene` until VideoHero replaces it.
- `src/styles/tokens.css`: replace it, keeping aliases.
- `src/styles/fonts.css`: new.
- `src/styles/global.css`: `:lang` rules replace 187–197; keep Lenis 343–351.
- `index.html`: drop Google Fonts 27–32 and the logo preload at :34; set `theme-color #004828`.
- New: `src/lib/motion.js`, `motionEnv.js`, `splitText.js`.
- `src/hooks/useLenis.js`: ticker sync, `ScrollTrigger.update`, `lagSmoothing(0)`.
- `useScrollRestoration.js`: use the displayed location.
- `useGsapAnimations.js`: becomes the tier registry.
- `useThreeScene.js` is **not** deleted here (see Phase 3).
- `src/lib/SiteContext.jsx`: dispatch `keu:content` and refresh.
- `src/lib/whatsapp.js`: add a `qafila` key and strip digits. The API is unchanged.

**Accept when**
- `npm run build` is green with Hero.jsx unchanged.
- Fonts are ≤90 KB.
- Scrubs stay in sync with Lenis.
- Env emulation passes.
- Admin is unchanged.

### Phase 2: Global chrome

**Files**
- `src/App.jsx`: layout route, with admin outside it.
- New: `src/components/motion/TransitionRoutes.jsx`, `PageCurtain.jsx`, `BgStage.jsx`.
- Components: `Nav.jsx`, `MobileMenu.jsx`, `BrandMark.jsx`, `Wordmark.jsx`, `Lockup.jsx`, `Footer.jsx`, `WhatsAppFAB.jsx`, `ThumbBar.jsx`.
- `src/data.js`: add optional `company.landline` with code default `'+924235136177'` (read by Footer, CTA band and Contact; no admin change, unknown keys survive a save).
- `src/styles/components.css`: restyle 6–118, 525–615, 1683–1713 and 1714–1811, plus the Nav rules at 1097–1190 (`.nav__cta`, `.nav__burger*`, `.nav-drawer*`, which sit inside the ADMIN DASHBOARD header block) and 2187–2218 (NAV LOGO IMAGE). Delete the FAB greeting bubble at 1070–1096 (`.wa-greeting`). Move the admin blocks 894–1069 and 1550–1682 to `admin.css` unchanged.

**Accept when**
- The curtain runs 600 / ≤400 / 700 ms with its caption.
- The FAB stays clickable mid-curtain.
- Focus moves and the page is announced.
- The nav is in paper state on inner routes.
- The menu traps focus.
- Admin is never curtained.

### Phase 3: Home

**Files**
- `index.html`: inline preloader.
- Remove Three in the same change that deletes `Hero.jsx`: delete `src/hooks/useThreeScene.js`, remove `three` and `@types/three` from `package.json`, and remove the `three: ['three']` entry from `manualChunks` in `vite.config.js:45-50` (codebase.md R13).
- New: `motion/Preloader.jsx`, `VideoHero.jsx` (delete `Hero.jsx`), `Seam.jsx`, `BookingSteps.jsx`, `SanctuaryChapter.jsx` (delete `SanctuariesSection.jsx`).
- Updated: `StatsSection.jsx`, `PackagesGrid.jsx`, `PackageCard.jsx`, `ServicesStrip.jsx`, `WhyChooseUs.jsx`, `TestimonialsSection.jsx`, `FAQSection.jsx`, `CTABanner.jsx`, `SectionHeading.jsx`, `src/pages/Home.jsx`.
- CSS: rewrite 209–524, 1192–1381 and 2029–2096, and remove the dead CSS listed in codebase.md §2.

**Accept when**
- Preloader beats land within ±50 ms and its links are tabbed first.
- There is no Three chunk.
- LCP ≤2.5 s (lab, mobile). LCP element = the hero poster below 1024, `.hero__title` at ≥1024.
- `?safe` is clear at 1280×720, 1280×800, 1366×768, 1440×900, 1536 and 1920, with the copy column's bottom edge ≥32 px above transformed K2's top, and on the mobile poster at 360, 375 and 414.
- First `priceLabel` top ≤1624 px at 375×812.
- No video loads below 768 or under Save-Data.
- Tabbing to Madinah scrolls the pin to it.
- The mobile wipe is scrubbed.
- The admin 360 px preview still renders.

### Phase 4: Inner pages

**Files**
- `PageHeader.jsx`
- `src/pages/Packages.jsx`
- `QafilaSection.jsx`
- `src/pages/About.jsx`, `TeamGrid.jsx`
- `src/pages/Gallery.jsx`, `GalleryGrid.jsx`
- `src/pages/Contact.jsx`, `ContactInfo.jsx`
- `ContactForm.jsx`: live options replace `PACKAGE_OPTIONS` (lines 5–13).

**Accept when**
- No text sits on a sanctuary image.
- Nastaliq loads only on `/packages`.
- The form passes 1.4.11, keyboard use and error announcement.
- The lightbox traps focus and closes on Esc.

### Phase 5: Identity sweep, SEO, favicons

| Drift | Locations |
|---|---|
| Name | `data.js:10`, `Nav.jsx:39-40`, `Footer.jsx:19-20,70`, `schemas.js:14,60,129,151`, `index.html:8-13,40-41`, `generate-seo.js:2,55,87,93`, page heads `Home.jsx:23-24`, `Packages.jsx:18`, `About.jsx:17-18`, `Contact.jsx:15-16,70`, `Gallery.jsx:14`. |
| Tagline, page titles and descriptions | `data.js:11`, `index.html:8-14`, `schemas.js:15,61`, `Home.jsx:23-25`, `Packages.jsx:18-20` (prints the non-live data.js prices PKR 185,000 / 285,000 / 450,000 / 550,000 and "Hajj 2025–2027"), `About.jsx:17-19` ("18 Years"), `Contact.jsx:15-17` (old address and WhatsApp), `Gallery.jsx:14,16` |
| Address, email | `data.js:15,17,155,163`, `Contact.jsx:16-17,66`, `index.html:49` |
| WhatsApp → `923334883578` | `data.js:14,155,163`, `Contact.jsx:16` |
| Arabic, navy, logo | `ServicesStrip.jsx:11`; `index.html:6`, components.css literals; `index.html:34,44`, `schemas.js:17` |
| Canonical → `https://usmania.vercel.app` | `index.html:16,20,43-44`, `useDocumentHead.js:4`, `schemas.js:5`, `generate-seo.js:16`, and the hard-coded per-page canonicals `Home.jsx:26`, `Packages.jsx:21`, `About.jsx:20`, `Contact.jsx:18`, `Gallery.jsx:17` |
| Placeholders / stale facts | `index.html:52` and `data.js:20` postcode `54600` (unverified: render nothing until the owner supplies it, Q2); `index.html:55` `priceRange` "PKR 185,000 - PKR 550,000" (derive from live packages or remove) |
| Remove Hajj (Umrah only, owner 2026-10-10) | `data.js` `hajj-2025` + lines 142–143, `ContactForm.jsx:11`, `PackagesGrid.jsx:8`, `whatsapp.js:5`, `schemas.js:15,61,88`, Hajj wording in `index.html`, `generate-seo.js` and every page head (full list in `content-corrections.md` §7) |

Also:
- Repoint `scripts/generate-icons.js` at the `newlogo.png` crops.
- Add `public/favicon.svg`.
- Add `public/og/*.png`: 1200×630 paper cards.
- Keep `speakableSchema` in sync.
- Package anchors stay on the raw `id` (§4 PackageCard), so `schemas.js`, `generate-seo.js` and `Footer.jsx` need no anchor change.

**Accept when**
- Grepping `src`, `index.html` and `scripts`, **excluding `src/pages/admin/**` and comment lines**, for `keusmania.vercel|923314211935|0d1b35|Mansoor|info@keusmania|ضیوف|(^|[^-])/logo\.png` finds nothing. `public/logo.png` stays for the admin (AdminLayout, Login), which is exempt; `/qafila-logo.png` is not a match.
- The Rich Results test passes.
- The WhatsApp link preview shows the OG card.

### Phase 6: QA

| Gate | Check |
|---|---|
| Lighthouse mobile (Home, Packages) | Perf ≥90 · LCP ≤2.5 s · CLS ≤0.05 · TBT ≤200 ms · critical path ≤380 KB · initial JS ≤170 KB gz |
| Field | p75 `keu:hero-revealed` ≤3.0 s |
| Hero contrast | on the brightest frame: on-dark and gold-200 ≥4.5:1 across the full copy column (including its right edge), nav links and WhatsApp button; focus rings over the film ≥3:1; composite scrim ≥.72 per the §3.4 QA script |
| Fade zones | Playwright scrolls each bg-stage fade to its midpoint and axe colour-contrast passes (§4 BgStage) |
| a11y | axe reports 0 serious · keyboard through preloader, pin, menu and FAB menu · NVDA and VoiceOver iOS · 2.4.11 with scroll-padding · 2.2.2 · rings ≥3:1 |
| Matrix | every row of §3.7 |
| Devices | budget Android in Chrome **and the WhatsApp in-app browser** · iPhone SE and 13 · Windows 1366 low-DPI · Mac 1440 · 1920 |
| Admin | every editor · 360 px preview · unknown keys survive a save · no motion chunks on `/admin` |

### Phase 7: Launch

1. The owner re-saves `/admin/company` (name, tagline, WhatsApp `923334883578`, street, email). **Never delete the `site` row.**
2. Re-save the FAQ, testimonials and company hours from `content-corrections.md`.
3. Confirm Vercel Pro and `usmania.vercel.app`.
4. Deploy, then test every `wa.me` key on a phone.
5. Enable Speed Insights, the custom marks and WhatsApp click events.
6. Two-week gate: p50 time to the first package card is no worse than on the old site.

Rollback = promote the previous deployment.

---

## 8. Open questions for the owner

1. **Years of service.** The stats and About say 18+ ("Eighteen years"), but 2005 to 2026 is 21 years. Should we keep 18+ or change it to 21+?
2. **Licences and postcode.** Should the DTS / IATA / MoRA numbers be shown? If so, please send them along with the Johar Town postcode. Until then they stay hidden.
3. **Hajj.** Is there a Hajj offering this season? "Hajj 2025 to 2027" is out of date in the package name, badge, WhatsApp message and FAQ. What should it say instead?
4. **Copy clean-up.** Please approve the corrected FAQ (the current one contradicts the packages and lists old phone numbers) and the clean-up of the "Vick Pandaa - Waqas Saleem" and "AK" testimonials.
5. **Artwork.** Please approve the KU SVG trace and the wordmark. Do you and Pirzada Sahib consent to retracing the Qafila seal? Do you have a photo of the leader?
6. **Hero framing.** Do you approve the recropped desktop film (Kaaba right of centre, headline on the left) and the phone layout (Haram image above, headline on green below)?
7. **Madinah moment.** May the desktop chapter play the silent Green Dome loop (no people, about 1.2 MB, desktop only) inside the arch?
8. **Booking steps.** Please approve the four step texts in §6. They restate your existing copy.

### 8.1 Owner answers (2026-10-10, binding)

1. **Years of service:** keep **18+**, and the founding year becomes **2008** (was 2005). Every "since 2005" / `founded: 2005` / `foundingDate: '2005'` changes to 2008 in the Phase 5 sweep (see `docs/rebrand/content-corrections.md`).
2. **Licences and postcode:** not supplied. The slots stay hidden and the postcode is removed.
3. **Hajj:** the karwan currently offers **Umrah only**. All Hajj offers, packages, chips and enquiry options are removed from the public site (content-corrections.md §7).
4. **Copy clean-up:** approved.
5. **Artwork:** KU SVG trace and wordmark approved; Qafila seal retrace approved. No leader photo supplied, so the name plate is used.
6. **Hero framing:** approved (desktop recrop, phone plate).
7. **Madinah moment:** approved (silent Green Dome loop inside the arch, desktop only).
8. **Booking steps:** approved as written in §6.
9. **Hours** (2026-10-10): Monday–Friday 11 am – 7 pm, Saturday 11 am – 5 pm, Sunday closed (Pakistan time). The footer, CTA band, mobile menu and Contact show these hours.
10. **Testimonial name:** "Waqas Saleem".
12. **Socials** (2026-10-10): Facebook `https://www.facebook.com/profile.php?id=61552498595314`, Instagram `https://www.instagram.com/keusmania` (tracking parameters removed). YouTube and TikTok unchanged.
11. **Hosting:** Vercel Pro or the owner's own server, decided once the code is ready. Storage stays on Cloudinary (images) and MongoDB (content). Keep the build host-agnostic: the hero films ship as Vite-hashed static assets, so they work on either host. Do not move the films to Cloudinary (video bandwidth costs, RESEARCH §6).

---

## 9. Addendum: video reviews (owner request, 2026-10-10)

The owner has many pilgrim video reviews and uploads them from the admin.

**Admin (built in Phase 1)**
- New screen `/admin/video-reviews` (`src/pages/admin/EditVideoReviews.jsx`), listed in the admin sidebar after Testimonials.
- Videos upload straight to Cloudinary (`keu/reviews`) in 20 MB chunks with a progress readout, up to 500 MB per file (the Cloudinary plan may set a lower limit; its error is shown).
- The signature (`api/upload-signature.js?resource=video`) also signs an eager, asynchronous transformation, so Cloudinary prepares a 720p MP4 (`c_limit,h_720,q_auto`) and a poster (`so_2,c_limit,w_960,q_auto`) in the background. `src/lib/videos.js` builds the matching delivery URLs.
- Each review stores `{ id, publicId, src, duration, width, height, name, location, trip, caption, language, consent, show, uploadedAt }` in `site.videoReviews`, saved like the testimonials. A review is shown only when **consent is ticked and Show on website is on**; saving forces `show` off without consent.

**Public display (Phase 3, Testimonials section)**
- A "Video reviews" row under the written testimonials: up to 3 poster cards on desktop (2 on phones) with name, city, trip, duration and a 48 px play button; "Show more" reveals the rest. No carousel, no autoplay.
- Posters use the derived JPG; nothing downloads until a visitor taps play, so Cloudinary bandwidth stays low.
- Tapping opens a green-950 lightbox with `<video controls playsinline>` on the derived 720p MP4, falling back to the original upload if the derived file is not ready yet. Sound is allowed because playback is user-initiated. Esc, close button and a focus trap, as in the gallery lightbox.
- The caption is set under the player in `small`; the spoken language shows as a small tag ("Urdu").
- Reduced motion: no transitions, the lightbox appears instantly. Save-Data: posters still load (small), videos only on tap.
- Etiquette: upload only with the pilgrim's permission; never place text over a sanctuary in a poster.

## 10. Phase 1 implementation notes (2026-10-10)

- **Tokens.** `tokens.css` now holds two layers: the KEUI tokens (used by every new or restyled component) and the legacy tokens with their old colour values, so the admin and not-yet-restyled components look unchanged. Only the legacy font tokens were remapped to the new faces, because the Google Fonts link is gone.
- **Urdu fonts.** Every `lang="ar"` and `lang="ur"` element uses the KEU Arabic face. Nastaliq is opt-in with `.nastaliq` (and the two Qafila Urdu classes), so it loads only on `/packages`. This keeps nav and hero Urdu runs from pulling 118 KB at first paint.
- **Motion.** `src/lib/motion.js` is the single GSAP entry point (ScrollTrigger, SplitText, Flip, DrawSVG, CustomEase registered once). `src/lib/motionEnv.js` detects reduced motion, Save-Data, slow networks and low-end devices; emulate with `?motion=reduce|lowend|savedata|full`. `src/lib/splitText.js` refuses to split Arabic or Urdu (throws in dev).
- **Scroll.** Lenis runs on GSAP's ticker and drives `ScrollTrigger.update`; triggers refresh on fonts, `load` and the new `keu:content` event that `SiteContext` fires when live content arrives.
- **Reveals.** `useGsapAnimations` is now the tier registry (`data-reveal="t0|t1|t2|block|heading|t3"`, `data-count`), with a selector map for legacy components. The bouncy testimonial ease is gone.
- **WhatsApp.** `waNumber()` strips the number to digits; new `umrah` and `qafila` message keys; the general greeting is Umrah only.

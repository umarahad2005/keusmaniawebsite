# KEUI rebrand — brand extraction & motif library

Researcher: brand/motif agent · 2026-10-08 · for the orchestrator's design-language artifact.
Inputs: `BRIEF.md` (ground truth), `D:/personal/projects/keusmaniawebsite/newlogo.png` (4096×4096 RGBA PNG, 72 dpi), `D:/personal/projects/keusmaniawebsite/keu-website/letterhead-preview-0.png` (2000×3000 RGB PNG, A4 raster of `letter_head.pdf`), repo `keu-website/` (read-only; nothing modified).
Method: both images viewed, then sampled pixel-exactly with `sharp` (`node_modules/sharp`, scripts + raw outputs kept in `scratchpad/research/tools/`: `sample.js`, `sample2.js`, `textmetrics.js`, `contrast.js` and their `*-output.txt`). Every hex marked **sampled** is a median of a classified pixel region; every hex marked *designed* is my interpolation and is labelled as such. All WCAG ratios below were computed, not estimated.

Coordinate conventions: logo coordinates are in the 4096 px canvas; letterhead coordinates are in the 2000×3000 raster (1 px ≈ 0.105 mm on A4; page width = 2000 px = 100%).

---

## 0. Headline findings

1. The logo's working green is **#004828** (10.1 % of all opaque logo pixels — the single most common colour after black); its lights/shadows are **#005830 / #003820**. The ring's right half is a darker **#013419**. The letterhead's bands are a touch greyer: **#164a31–#185034** body, **#083820** at the page edge. The brief's "≈ #0a4a2a" is confirmed as the family centre.
2. The logo gold is a metallic *gradient*, not one colour: highlight **#f0b030 → body #e0a028 → #c08010 → bronze #a06800 → #885800** (bronze #885800 is actually the most frequent gold shade, 0.90 %). The crescent and aircraft sit in the bronze end (#9b6503, #865703). The letterhead gold is paler champagne: rules **#d9ae54**, dividers **#d4a43e–#e0be76**, ribbons **#e2bf76 → #fae0a1 → #f5d795**.
3. The ink is neutral black, not green: tagline **#090909**, address **#151515**, motto **#1c1c1c**, the U and Kaaba **#080808–#181818**. Paper in the preview is **#fdfdfe–#ffffff** (the brief's #f8f8f8 does not appear in the raster; see §6).
4. Gold text on paper fails WCAG everywhere above gold-600: **#e0a028 on #fcfbf8 = 2.20 : 1 (fail)**, hairline #d9ae54 = 2.00 (fail), #c08010 = 3.20 (large text only), **#a06800 = 4.54 (AA, barely)**, **#885800 = 5.89 (AA)**. Gold on green passes: #e0a028 on #004828 = 4.71 (AA), #f5d795 on #004828 = 7.68 (AAA).
5. **White on WhatsApp green #25D366 = 1.98 : 1 (fail).** Keep #25D366 as the fill, set the label/icon in green-950 #00240f (8.41 : 1).
6. The ring is an **open circle, diameter ≈ 3404 px (83 % of the canvas), stroke tapering from 75 px at 9 o'clock (2.2 % of diameter) to ~36 px at 3 o'clock to 0 at 6 o'clock, with two openings: 12 o'clock (23° wide, the minaret passes through, crescent sits above) and 1 o'clock (21° wide, the aircraft crosses)**. Gold from 9 → 12:30, deep green from 1:30 → 7:30.
7. The wordmark is **all caps with a small-cap "e"** ("KARWAN ᴇ USMANIA": K/U cap height 60–62 px, the "e" 51 px = 85 %). Typing `KARWAN e USMANIA` in **Cinzel** reproduces it exactly, because Cinzel's lowercase are small caps (see §6 for verification status). The two secondary lines are a *light sans*, not the serif: INTERNATIONAL cap 31 px in green, TRAVEL & TOURS cap 22 px in ink, both letterspaced ≈ 0.45 em / 0.35 em.
8. The ghosted watermark on the letterhead is the full-colour mark at **≈ 11–12 % opacity** (green parts #e2eae7, black parts #e3e2e3, gold parts #f6f0e4), 41 % of page width, bottom-right. On screen I recommend 5–7 % (§2.6).
9. **There is no vector source of the new mark anywhere** (repo has only `public/logo.png` 1080×1355 — the OLD lockup — and `qafila-logo.png`). The self-draw preloader, the dark-video variant, the monochrome gold variant and crisp favicons all need an SVG trace of `newlogo.png` (4 colour layers). This is the first production task.

---

## 1. Colour system

### 1.1 Sampled anchors

| Where | Region (px) | Median | Note |
|---|---|---|---|
| Logo K stem | 963–1270 × 1434–2048 | **#014e2c** | green |
| Logo K lower leg | 1065–1311 × 2867–3277 | **#004123** | darker green |
| Logo dome | 1843–2355 × 1311–1556 | **#015430** | lighter green |
| Logo U bottom curve | 2253–2662 × 3174–3441 | **#015430** | |
| Logo minaret | 1843–2007 × 614–860 | #014425 | |
| Logo ring, right half (mid-stroke, 30–75°) | — | **#013419** | darkest green |
| Logo histogram (quantised /8) | whole | #004828 10.1 %, #005030 6.9 %, #004020 5.9 %, #005830 5.5 %, #003820 3.3 %, #003018 1.4 % | |
| Logo swoosh body | 1085–1434 × 2253–2580 | #bd8215 | gold mid |
| Logo swoosh under U | 1843–2355 × 3482–3686 | **#e5a427** | gold |
| Logo swoosh tail (over Kaaba) | 2458–2744 × 1843–2007 | **#f5b740** | gold highlight |
| Logo ring top-right (11–12:30) | 2662–3072 × 512–819 | **#f7ba3e** / #febf3a | brightest gold |
| Logo ring 9 o'clock | — | #9b6703 / #9b6802 | bronze |
| Logo ring 10:30 | — | **#f0b034** | |
| Logo swoosh lower edge | 1147–1556 × 2560–2683 | #a36d07 | bronze shade |
| Logo aircraft | 3154–3604 × 1188–1556 | #895a02 (bronze) / #905e03 | dark gold |
| Logo crescent | 1843–2068 × 164–348 | #9b6503 | dark gold |
| Logo Kaaba band | — | #ce911b, door #fac14f | |
| Logo gold histogram | whole | #885800 0.90 %, #906000 0.78 %, #986808, **#e0a028 0.57 %**, #a06808, #d89820, #e8a830, #c08010, #f8c048 | |
| Logo U / Kaaba | 2662–2929 × 2150–3072 | **#090909**, #070706 | black |
| Letterhead top sweep | 0–180 × 180–630 | **#004828** / #00502e | green |
| Letterhead bottom band body | 0–450 × 2850–3000 | **#0e3f28**, right side #185034 | green |
| Letterhead bottom band edge (y = 2995) | full row | **#083820** | darkest |
| Letterhead wordmark fill | — | **#00492c** (stroke centres #1f5f45 → #0c5236) | green |
| Letterhead INTERNATIONAL | — | green, thin strokes (median #336d55, centres #0c5236) | |
| Letterhead gold rules | 636–752 / 1336–1453 × 360–362 | **#d9ae54** / #e4c686 | champagne |
| Letterhead vertical dividers | x 576–578, 1582–1585 | #d4a43e → **#e0be76** | champagne |
| Letterhead bottom ribbon | — | #e3c38a (left) → #e2bf76 → #e8cd94 → **#fae0a1** (right), region median #f5d795 | pale gold |
| Letterhead top ribbon | — | #e6cd94 / #dfc07c / #fad78b | pale gold |
| Letterhead tagline / address / motto | — | **#090909 / #151515 / #1c1c1c** | ink |
| Letterhead paper | 900–1200 × 1200–1500 | **#ffffff**, corners #fdfdfe | |
| Letterhead footer icons | — | #064528 / #0a482c | green |
| Letterhead watermark | 1130–1960 × 1620–2450 | cool #e2eae7, neutral #e3e2e3, warm #f6f0e4; darkest px #e0dfe0 | ≈ 11–12 % opacity |

### 1.2 Green scale (anchored on the logo; luminance verified monotonic)

| Token | Hex | Source | Use |
|---|---|---|---|
| green-50 | #eef6f1 | designed | tinted surfaces, selected rows |
| green-100 | #d7ebdf | designed | chips, table stripes |
| green-200 | #b2d5c1 | designed | borders on dark, muted icons on dark (8.31 : 1 on green-900) |
| green-300 | #82b79a | designed | secondary text on dark (7.30 : 1 on green-950) |
| green-400 | #4d9370 | designed | decorative only on paper (3.55 : 1) |
| green-500 | #20784d | designed | success, filled icon buttons (white on it 5.45 : 1) |
| green-600 | #0b6239 | designed | links, hover (7.20 : 1 on paper) |
| green-700 | #005830 | **sampled** (dome / highlights) | secondary brand text, INTERNATIONAL line |
| green-800 | **#004828** | **sampled** (dominant) | PRIMARY brand green: wordmark, buttons, bands |
| green-900 | #003820 | **sampled** (shadow) | pressed states, deep band |
| green-950 | #00240f | designed (darkest in-ring sample #002710) | dark sections, video overlays, preloader |
| green-ring | #013419 | **sampled** | the ring's green half |
| green-band | #164a31 | **sampled** (letterhead) | footer band body |
| green-band-deep | #083820 | **sampled** (letterhead) | footer band bottom edge / gradient end |

### 1.3 Gold scale (anchored on the logo; letterhead champagne as aliases)

| Token | Hex | Source | Use |
|---|---|---|---|
| gold-50 | #fdf7e6 | designed | gold-tinted surface |
| gold-100 | #faebc4 | designed | |
| gold-200 | #f5d795 | **sampled** (bottom ribbon) | small gold text ON DARK (7.68 : 1 on green-800, 11.94 on green-950) |
| gold-300 | #e9c266 | designed (between #e0be76 and #e8cd94) | hairlines/eyebrows on dark (6.32 on green-800, 7.80 on green-900) |
| gold-400 | #f0b030 | **sampled** (ring/swoosh highlight) | gradient highlight stop |
| gold-500 | **#e0a028** | **sampled** | PRIMARY gold: icons, hairlines, large display on dark (4.71 on green-800) |
| gold-600 | #c08010 | **sampled** | gradient mid, large text on paper only (3.20) |
| gold-700 | #a06800 | **sampled** (bronze) | gradient shadow; small text on paper = 4.54 (borderline) |
| gold-800 | **#885800** | **sampled** (most frequent gold) | SMALL GOLD TEXT ON PAPER (5.89 : 1 AA; 5.46 on ivory) |
| gold-900 | #6a4400 | designed | AAA gold text on paper (8.32) |
| gold-950 | #3d2600 | designed | |
| gold-hairline | #d9ae54 | **sampled** (rules) | 1 px rules/dividers on paper (decorative only, 2.00 : 1) |
| gold-champagne | #e0be76 | **sampled** (dividers) | letterhead-style vertical dividers, ribbon start |
| gold-ribbon-end | #fae0a1 | **sampled** | ribbon gradient end |

Metallic gradient (matches the ring/swoosh sheen): `linear-gradient(100deg, #885800 0%, #c08010 22%, #e0a028 45%, #f0b030 58%, #f7ba3e 66%, #e0a028 80%, #a06800 100%)`.

### 1.4 Neutrals

| Token | Hex | Source |
|---|---|---|
| ink | #0b0b0b | **sampled** (tagline #090909, U #090909) |
| ink-soft | #181818 | **sampled** (U/Kaaba highlights, TRAVEL & TOURS) |
| white | #ffffff | **sampled** (letterhead field) |
| paper | #fcfbf8 | *designed*: 1 step warm so gold hairlines don't read yellow-on-white on an emissive screen; the letterhead itself is #ffffff |
| ivory | #f6f2ea | *designed*: alternating section field (replaces current `--color-cream #f8f5ef`) |
| text-body | #2c3a33 | *designed*: green-tinted charcoal, 11.53 : 1 on paper |
| text-muted | #5f6f67 | *designed*: 5.13 : 1 on paper, 4.75 on ivory |
| on-dark | #f4f1ea | *designed*: 14.78 : 1 on green-950 |
| on-dark-muted | #b9c7bf | *designed*: 9.52 : 1 on green-950, 7.55 on green-900 |
| whatsapp | #25d366 | kept (brand) |
| whatsapp-deep | #075e54 | official dark teal; white on it 7.67 : 1 |

### 1.5 Semantic tokens (drop-in block for `src/styles/tokens.css`; new names, old navy tokens can alias to these during migration)

```css
:root {
  /* brand scales — see §1.2 / §1.3 for provenance */
  --green-50:#eef6f1; --green-100:#d7ebdf; --green-200:#b2d5c1; --green-300:#82b79a;
  --green-400:#4d9370; --green-500:#20784d; --green-600:#0b6239; --green-700:#005830;
  --green-800:#004828; --green-900:#003820; --green-950:#00240f;
  --green-ring:#013419; --green-band:#164a31; --green-band-deep:#083820;
  --gold-50:#fdf7e6; --gold-100:#faebc4; --gold-200:#f5d795; --gold-300:#e9c266;
  --gold-400:#f0b030; --gold-500:#e0a028; --gold-600:#c08010; --gold-700:#a06800;
  --gold-800:#885800; --gold-900:#6a4400; --gold-950:#3d2600;
  --gold-hairline:#d9ae54; --gold-champagne:#e0be76; --gold-ribbon-end:#fae0a1;
  --ink:#0b0b0b; --ink-soft:#181818; --white:#fff; --paper:#fcfbf8; --ivory:#f6f2ea;
  --whatsapp:#25d366; --whatsapp-deep:#075e54;
  --gradient-gold:linear-gradient(100deg,#885800 0%,#c08010 22%,#e0a028 45%,#f0b030 58%,#f7ba3e 66%,#e0a028 80%,#a06800 100%);
  --gradient-ribbon:linear-gradient(90deg,#e3c38a 0%,#e2bf76 35%,#e8cd94 70%,#fae0a1 100%);
  --gradient-band:linear-gradient(180deg,#164a31 0%,#083820 100%);
  --overlay-video:linear-gradient(180deg,rgba(0,36,15,.18) 0%,rgba(0,36,15,.42) 55%,rgba(0,36,15,.88) 100%);

  /* semantic — paper (default) */
  --surface:var(--paper); --surface-alt:var(--ivory); --surface-card:var(--white);
  --surface-brand:var(--green-800); --surface-deep:var(--green-950); --surface-band:var(--green-band);
  --text:var(--ink); --text-body:#2c3a33; --text-muted:#5f6f67; --text-brand:var(--green-800);
  --text-brand-soft:var(--green-700); --text-gold:var(--gold-800);          /* ONLY gold allowed for small text on paper */
  --text-gold-display:var(--gold-600);                                        /* >= 24px / 18.66px bold only (3.20:1) */
  --link:var(--green-600); --link-hover:var(--green-800);
  --border:rgba(0,72,40,.10); --border-strong:rgba(0,72,40,.18); --border-input:var(--green-700);
  --hairline-gold:var(--gold-hairline); --hairline-gold-soft:rgba(217,174,84,.55);
  --focus-ring:0 0 0 3px rgba(11,98,57,.35);
  --cta-wa-bg:var(--whatsapp); --cta-wa-fg:var(--green-950);                  /* 8.41:1 */
  --cta-primary-bg:var(--green-800); --cta-primary-fg:var(--white);          /* 10.73:1 */
  --cta-gold-bg:var(--gold-500); --cta-gold-fg:var(--green-950);             /* ink on gold 8.65:1 */
  --watermark-opacity:.06;
  --shadow-sm:0 2px 6px rgba(0,36,15,.08); --shadow-md:0 8px 20px rgba(0,36,15,.10);
  --shadow-lg:0 16px 40px rgba(0,36,15,.14); --shadow-gold:0 14px 30px rgba(224,160,40,.22);
}

/* dark sections: hero over video, preloader, Qafila, CTA banner, footer */
[data-theme="dark"], .section--deep {
  --surface:var(--green-950); --surface-alt:var(--green-900); --surface-card:rgba(255,255,255,.04);
  --text:#fff; --text-body:#f4f1ea; --text-muted:#b9c7bf; --text-brand:var(--gold-200);
  --text-brand-soft:var(--gold-300); --text-gold:var(--gold-300); --text-gold-display:var(--gold-400);
  --link:var(--gold-200); --link-hover:#fff;
  --border:rgba(244,241,234,.12); --border-strong:rgba(244,241,234,.22); --border-input:rgba(244,241,234,.35);
  --hairline-gold:rgba(233,194,102,.70); --hairline-gold-soft:rgba(233,194,102,.35);
  --focus-ring:0 0 0 3px rgba(245,215,149,.45);
  --cta-primary-bg:var(--gold-500); --cta-primary-fg:var(--green-950);
  --watermark-opacity:.05;
}
/* footer / page-header band = letterhead green */
.section--band { --surface:var(--green-band); --text-body:#f4f1ea; --text-muted:#cdd8d1; --hairline-gold:var(--gold-300); }
```

### 1.6 WCAG 2.x contrast (computed with the relative-luminance formula; AA = 4.5 normal, 3.0 large/UI)

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| white | green-800 #004828 | 10.73 | AAA |
| white | green-700 #005830 | 8.61 | AAA |
| white | green-600 #0b6239 | 7.45 | AAA |
| white | green-500 #20784d | 5.45 | AA |
| white | green-band #164a31 | 10.20 | AAA |
| on-dark #f4f1ea | green-950 / green-900 | 14.78 / 11.73 | AAA |
| on-dark-muted #b9c7bf | green-950 / green-900 | 9.52 / 7.55 | AAA |
| green-800 | paper #fcfbf8 | 10.37 | AAA |
| green-700 | paper | 8.32 | AAA |
| green-600 | paper | 7.20 | AAA (links) |
| green-500 | paper | 5.26 | AA |
| green-400 | paper | 3.55 | large/UI only |
| ink | paper / ivory | 19.02 / 17.63 | AAA |
| text-body #2c3a33 | paper | 11.53 | AAA |
| text-muted #5f6f67 | paper / ivory | 5.13 / 4.75 | AA |
| **gold-500 #e0a028** | **paper / white** | **2.20 / 2.28** | **FAIL** |
| **gold-400 #f0b030** | **paper** | **1.85** | **FAIL** |
| **gold-hairline #d9ae54** | **paper** | **2.00** | **FAIL (decorative only)** |
| gold-600 #c08010 | paper | 3.20 | large text (≥ 24 px / 18.66 px bold) only |
| gold-700 #a06800 | paper / ivory | 4.54 / 4.20 | AA on paper only, fails on ivory |
| **gold-800 #885800** | **paper / ivory** | **5.89 / 5.46** | **AA — the small gold text colour** |
| gold-900 #6a4400 | paper | 8.32 | AAA |
| gold-500 | green-800 / 900 / 950 | 4.71 / 5.82 / 7.33 | AA / AA / AAA |
| gold-400 | green-800 / 900 | 5.60 / 6.91 | AA |
| gold-300 | green-800 / 900 / band | 6.32 / 7.80 / 6.01 | AA / AAA / AA |
| gold-200 | green-800 / 950 / band | 7.68 / 11.94 / 7.31 | AAA |
| gold-600 | green-800 | 3.24 | large only |
| gold-hairline #d9ae54 | green-800 / 950 | 5.18 / 8.05 | AA / AAA |
| ink | gold-500 / gold-400 | 8.65 / 10.27 | AAA (gold buttons take ink/green-950 labels) |
| green-900 | gold-500 / gold-300 | 5.82 / 7.80 | AA / AAA |
| white | gold-700 / gold-800 / gold-600 | 4.69 / 6.10 / 3.31 | AA / AA / large only |
| **white** | **whatsapp #25d366** | **1.98** | **FAIL** |
| ink / green-950 | whatsapp #25d366 | 9.92 / 8.41 | AAA |
| white | whatsapp-deep #075e54 | 7.67 | AAA |
| white | #128c7e (WA teal) | 4.14 | large only |
| whatsapp #25d366 | green-950 / green-900 | 8.41 / 6.67 | AAA / AA (use as icon/text colour on dark) |
| **whatsapp #25d366** | **paper** | **1.92** | **FAIL (never as text/icon on paper)** |

**Rules that fall out of the table**

- Gold on paper is for **hairlines, rules, icons ≥ 24 px, and display type ≥ 32 px** (use gold-600 #c08010 or the metallic gradient for display; a 1 px gold-hairline rule is exempt from text contrast but still fails the 3 : 1 UI-component rule, so **input borders and focus rings are green, never gold**). Any gold *reading* text on paper (eyebrows, prices, labels, links) is **gold-800 #885800** (AA) or gold-900 for AAA.
- On dark/green surfaces gold is free: body-size gold text uses gold-200/300; gold-500 is fine for ≥ 16 px (4.71 on green-800) and everything on green-950.
- WhatsApp CTA: fill #25d366, label + icon in green-950 #00240f (8.41 : 1), hover fill #1ebe5b; on dark sections you may invert: text/icon #25d366 on green-950 (8.41 : 1). Never white on #25d366.
- Gold buttons: fill gold-500, label green-950 (or ink). Primary buttons: green-800 with white.

---

## 2. Motif library (from the logo + letterhead geometry)

Logo geometry summary (4096 canvas): alpha bbox 406,180 → 3736,3810. Fitted ring: centre (2093, 2111), outer radius 1702 → diameter 3404 (83 % of canvas; rms fit error 6.7 px). Crescent bbox 1924–2129 × 179–419 (205×240). Minaret+dome green bbox 1750–2749 × 397–1599 (dome ≈ 1000 px wide = 29 % of ring diameter; dome fill #015430). Kaaba black bbox 1536–2619 × 1451–2478 (1083×1027, i.e. square). K spans ≈ x 880–1900, y 1150–3450. U black bbox ≈ 2600–3074 × 1800–3400 with a green lower curve to ≈ 3450. Swoosh gold bbox 1065–2799 × 1750–3799 (it merges into the ring at 6 o'clock). Aircraft bbox 3114–3699 × 1050–1699 (585×650), heading up-right ≈ 35°, in bronze #865703.

### 2.1 Orbit ring (open circle, hairline) → section dividers, loaders, focus/hover halos

Measured: stroke 75 px at 9 o'clock (= 2.2 % of diameter), 72 px at 8 o'clock, 44 px at 11, 24 px just below the top gap, 36–47 px at 3 o'clock, thinning to ≈ 6 px and breaking at 6 o'clock. Openings (degrees clockwise from 3 o'clock, 1° walk): **gap 260°–283°** (top, 23°, centred on 12 o'clock; the minaret passes through it and the crescent sits above the ring at y 179–419) and **gap 327°–348°** (1 o'clock, 21°; the aircraft crosses here). Colour by angle: 9 → 12:30 gold (#9b6703 bronze at 9, #f0b034 at 10:30, #f4af1f at 11:30, #febf3a at 12:30); 1:30 → 7:30 deep green #013419; 7:30 → 9 bronze→green blend (#665902 at 8:30). The 6 o'clock join is where the gold swoosh becomes the ring.

Web form (1.5 px hairline; gaps reproduced with `pathLength=360`):

```html
<svg viewBox="0 0 100 100" width="48" height="48" aria-hidden="true" class="orbit">
  <defs>
    <linearGradient id="orbit-g" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0"   stop-color="#9b6703"/>
      <stop offset=".35" stop-color="#f0b034"/>
      <stop offset=".60" stop-color="#febf3a"/>
      <stop offset="1"   stop-color="#013419"/>
    </linearGradient>
  </defs>
  <!-- 0° = 12 o'clock after the rotate; dashes: ring 13→57°, gap 57→78° (aircraft), ring 78→350°, gap 350→13° (minaret) -->
  <circle cx="50" cy="50" r="47" fill="none" stroke="url(#orbit-g)" stroke-width="1.5"
          stroke-linecap="round" pathLength="360"
          stroke-dasharray="44 21 272 23" stroke-dashoffset="-13"
          transform="rotate(-90 50 50)" vector-effect="non-scaling-stroke"/>
</svg>
```

Equivalent explicit arcs (for DrawSVG self-draw; r = 47, centre 50,50, angles clockwise from 12 o'clock):
`M60.57 4.20 A47 47 0 0 1 89.42 24.40` (13° → 57°) and `M95.97 40.23 A47 47 0 1 1 41.84 3.71` (78° → 350°).

Tapered (filled) version for hero/preloader sizes ≥ 96 px — generate once in JS and paste the `d`:

```js
// outer radius R=50, stroke t(θ): 2.2 at 9 o'clock → 1.1 at 3 o'clock → 0 at 6 o'clock (cosine falloff)
function taperedRing(R=50, cx=50, cy=50, a0=78, a1=350){ // degrees clockwise from 12 o'clock
  const P=(a,r)=>[cx+r*Math.sin(a*Math.PI/180), cy-r*Math.cos(a*Math.PI/180)];
  const t=a=>{const k=Math.cos((a-270)*Math.PI/180); return 1.1+1.1*k;} // 2.2 at 270° (9 o'clock), 0 at 90° (6 o'clock)
  let d='M'+P(a0,R).map(v=>v.toFixed(2)).join(' ');
  for(let a=a0+1;a<=a1;a++) d+=' L'+P(a,R).map(v=>v.toFixed(2)).join(' ');
  for(let a=a1;a>=a0;a--) d+=' L'+P(a,R-t(a)).map(v=>v.toFixed(2)).join(' ');
  return d+'Z';
}
```

Uses: (a) **section divider** = 1 px `--hairline-gold` line with a 24 px orbit centred on it (`.divider--orbit`); (b) **preloader**: DrawSVG the two arcs 9 o'clock → clockwise, 1100 ms `power2.inOut`, then the gold fill fades; (c) **CTA hover halo**: the orbit scales 0.92 → 1 and rotates −8° over 450 ms; (d) **route transition**: the ring as a clip-path circle that opens from the centre (`clip-path: circle(0% at 50% 50%)` → `circle(142%)`, 700 ms `expo.inOut`).

### 2.2 Swoosh / aircraft arc → scroll-progress hairline, path-drawn section intros

Measured: a crescent-shaped gold sweep starting thick (≈ 300 px) at lower-left (x ≈ 1065, y ≈ 2600), sweeping under the K's leg, across the Kaaba's lower third, under the U and into the ring at 6 o'clock; the aircraft is the "released" end at top-right (bbox 3114–3699 × 1050–1699), nose at ≈ 35° above horizontal. Gradient along it: #a36d07 (lower edge) → #bd8215 → #e5a427 → #f5b740 (over the Kaaba). Only ever **one** swoosh per composition.

```html
<svg class="progress" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
  <path id="swoosh" d="M-20 118 C 300 20, 900 0, 1460 70" fill="none"
        stroke="url(#gold-metal)" stroke-width="1.5" pathLength="1"
        style="stroke-dasharray:1;stroke-dashoffset:1" vector-effect="non-scaling-stroke"/>
</svg>
<svg class="plane" viewBox="0 0 24 24" width="14" height="14"><!-- aircraft glyph from src/icons.jsx 'plane', fill #e0a028 --></svg>
```

```js
// GSAP 3.15.0 is installed with ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, Flip, SplitText present in node_modules/gsap
gsap.to('#swoosh', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.6 } });
gsap.to('.plane', { ease: 'none', motionPath: { path: '#swoosh', align: '#swoosh', alignOrigin: [0.5, 0.5], autoRotate: true },
  scrollTrigger: { start: 0, end: 'max', scrub: 0.6 } });
```

Also: section intro = the same path drawn under the heading once (`drawSVG: '0% 100%'`, 900 ms `power3.out`, the aircraft glyph pops at the end: scale 0.6 → 1, 300 ms `back.out(1.4)`). Reduced motion: show fully drawn, no plane.

### 2.3 Dome + crescent silhouette → eyebrow icon, arch-top image masks

Measured: dome ≈ 1000 px wide hemisphere (#015430) on a minaret (397 → 1150), crescent 205×240 gold tilted to the upper right, sitting just above the ring's top gap (ring top y ≈ 410). Dome width = 29 % of ring diameter.

- 24 px mono icon (currentColor dome, gold crescent): `<svg viewBox="0 0 24 24"><path d="M4 22v-9a8 8 0 0 1 16 0v9Z" fill="currentColor"/><path d="M12 5V1.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14.1 1.1a2.4 2.4 0 1 0 1.3 3.1 1.7 1.7 0 1 1-1.3-3.1Z" fill="#e0a028"/></svg>` (crescent path is an approximation; retrace from the SVG master once it exists).
- Arch-top media (Nusuk/Aman-style): `.arch{aspect-ratio:3/4;border-radius:50% 50% 0 0/36% 36% 0 0;overflow:hidden}` — the elliptical arch echoes the dome; add a 1 px gold-hairline `outline-offset:6px` outline on paper. Use for Sanctuaries cards and package hero images; never stretch to a full semicircle (looks like a tombstone).
- Keep crescent + dome **unrotated**; the crescent always opens up-right as in the mark.

### 2.4 Kaaba cube with gold band → favicon / mark / bullet

Measured: isometric cube, front-left face + right face, square bbox 1083×1027, fill #070706 with #181818 highlights; gold band (#ce911b–#f5b740) crosses the upper part of the cube (visually the upper quarter to third, sloping with the perspective), gold door (#fac14f) on the right face.

SVG favicon (crisp at 16 px; paper plate so it survives dark tab chrome, matching the approach in `scripts/generate-icons.js`):

```html
<!-- /public/favicon.svg ; link rel="icon" type="image/svg+xml" -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#fcfbf8"/>
  <path d="M6 10.5 17 6.5l9 4v13l-9 4-11-4Z" fill="#0b0b0b"/>
  <path d="M6 10.5 17 6.5v17l-11-4Z" fill="#181818"/>
  <path d="M6 13.8 17 9.8l9 4v2.6l-9-4-11 4Z" fill="#e0a028"/>
  <path d="M19.6 15.3 22 14.3v5.8l-2.4 1Z" fill="#e0a028"/>
</svg>
```

Raster crops from `newlogo.png` (for `generate-icons.js`, which today crops the OLD `public/logo.png` at `{left:0, top:380, width:1080, height:415}` — must be repointed):
- **favicon 16/32/48**: Kaaba only → `extract({ left: 1500, top: 1420, width: 1160, height: 1090 })`, trim, 8 % pad, plate #fcfbf8.
- **apple-touch 180 / 192 / 512**: dome + Kaaba → `extract({ left: 1480, top: 1140, width: 1300, height: 1320 })` (green dome arch filling the top, cube below), plate #fcfbf8. The minaret + crescent (y 179–1140) make the crop 0.56 : 1 and vanish at icon sizes, so they are excluded.
- Mask-icon / Safari pinned: the Kaaba SVG above in a single colour.

### 2.5 Letterhead green sweep + gold ribbon → footer and page-header shapes

Measured (2000 × 3000):
- **Top-left**: convex green band (#004828 / #00502e) hugging the corner: 269 px along the top edge (13.5 % of width) and 137 px down the left edge (4.6 % of height). Outside it, a 20–35 px pale transition (#dfe4e1), then a **champagne ribbon 40–45 px wide** (#e6cd94 → #dfc07c, tip #fad78b) that tapers to a point on the top edge at x ≈ 333 (16.7 % of width). The ribbon does **not** touch the green here.
- **Bottom**: a double-curve green band (#164a31 body with a faint tone-on-tone pattern #104028 ↔ #185038, edge #083820): 305 px tall at the left edge (10 % of page height), ≈ 60 px at x = 1400 (70 % width), 167 px at the right edge. The gold ribbon rides **directly on the green edge** (no gap) and widens left → right: 20 px at x = 10, 22 px at x = 600, 41 px at x = 1400, 45 px at x = 1990; colour #e3c38a → #e2bf76 → #e8cd94 → #fae0a1.
- Footer content sits above the band (text rows y 2636–2701; band edge at y ≥ 2673 only at the far left).

Web form (footer top edge; `vector-effect` keeps the hairline 2 px when the SVG is stretched):

```html
<svg class="footer__sweep" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
  <defs><linearGradient id="ribbon" x1="0" x2="1"><stop offset="0" stop-color="#e3c38a"/><stop offset=".6" stop-color="#e8cd94"/><stop offset="1" stop-color="#fae0a1"/></linearGradient></defs>
  <path d="M0 180V40C260 150 520 100 760 120S1200 60 1440 90V180Z" fill="#164a31"/>
  <path d="M0 38C260 148 520 98 760 118S1200 58 1440 88" fill="none" stroke="url(#ribbon)" stroke-width="2" vector-effect="non-scaling-stroke"/>
</svg>
```

Page-header corner device (PageHeader on Packages/About/Gallery/Contact): a 320 × 140 version of the top-left sweep, green quarter-ellipse `M0 0H270C180 12 60 62 0 137Z` + offset ribbon `M333 0C232 14 96 72 0 164` (stroke 2, gradient #e6cd94 → #fad78b), opacity 1 on paper, max-width 22 % of the viewport, hidden below 480 px. Footer band fill: `--gradient-band` (#164a31 → #083820) plus the existing `public/patterns/geometric.svg` at 4 % white as the tone-on-tone texture.

### 2.6 Ghosted watermark → section backgrounds

Measured: full-colour mark at **≈ 11–12 % opacity** on white (cool #e2eae7, neutral #e3e2e3, warm #f6f0e4, darkest #e0dfe0), 810 px wide = 40.5 % of page width, bottom-right, right edge ≈ 35 px from the page edge, bottom ≈ 100 px above the footer text. On an emissive screen at viewport scale 11 % is heavy; use 5–7 %.

```css
.watermark{position:absolute;right:-6%;bottom:-4%;width:min(60vmin,720px);aspect-ratio:1;
  background:url(/brand/mark-full.svg) center/contain no-repeat;opacity:var(--watermark-opacity);
  mix-blend-mode:multiply;pointer-events:none}
.section--deep .watermark{background-image:url(/brand/mark-mono-gold.svg);mix-blend-mode:normal} /* 5 % */
```
Parallax it at 0.15 × scroll (ScrollTrigger scrub) and never let it sit behind body text columns.

### 2.7 Letterspaced small-caps lockup → nav, footer, preloader, section eyebrows

Measured on the letterhead (2000 px page): wordmark "KARWAN ᴇ USMANIA" 852 px wide (42.6 % of width), K/U cap 60–62 px, small-cap e 51 px (85 %), centre x ≈ 1052; INTERNATIONAL cap 31 px, 534 px wide, 13 glyphs, inter-letter gap 20–27 px (avg 24) → letter-spacing ≈ **0.45 em** (derived: em ≈ cap / 0.7, gap minus ≈ 4 px sidebearings); gold rules 117–118 px long × 3 px, centred on the cap middle, 23–27 px from the text; TRAVEL & TOURS cap 22 px, 425 px wide, letter gap 14–19 px, word gap 39–40 px → **≈ 0.35 em**, word-space ≈ 2.5 × letter gap; motto "FAITH X JOURNEY X / TOGETHER" cap 23 px, letter gap 6–9 px, word gap 20 px → ≈ 0.3 em. Vertical rhythm: wordmark baseline → INTERNATIONAL cap-top 43 px (0.7 × wordmark cap); INTERNATIONAL baseline → TRAVEL cap-top 32 px (1.45 × TRAVEL cap). Everything centre-aligned on one axis (centres 1052 / 1042 / 1041 / rules 1044). Mark : wordmark cap = 7.7 : 1; mark : three-line stack = 2.46 : 1. Vertical dividers 3–4 px × 292 px gold-champagne, 92 px right of the mark and 54 px left of the wordmark.

Ratios to carry: **wordmark cap 1 : INTERNATIONAL 0.52 : TRAVEL & TOURS 0.37**; rule length = 22 % of the INTERNATIONAL width (≈ 3.8 × its cap height); rule thickness = 0.1 × cap (min 1 px); rule-to-text gap = 0.75 × cap.

```html
<div class="lockup" data-size="footer">
  <span class="lockup__name">Karwan e Usmania</span>           <!-- Cinzel: caps + small-cap e -->
  <span class="lockup__intl">International</span>              <!-- Manrope 500, uppercase, gold rules -->
  <span class="lockup__sub">Travel &amp; Tours</span>
</div>
```
```css
.lockup{display:grid;justify-items:center;text-align:center;font-size:var(--lk,26px)}
/* NO text-transform here: type "Karwan e Usmania" — Cinzel sets K/U as caps and the lowercase as small caps, so only the "e" drops to 85 % (as on the letterhead) */
.lockup__name{font:500 1em/1 Cinzel,serif;letter-spacing:.06em;color:var(--text-brand);font-variant-caps:normal}
.lockup__intl{display:flex;align-items:center;gap:.75em;margin-top:.7em;font:500 .52em/1 Manrope,sans-serif;
  letter-spacing:.45em;text-indent:.45em;text-transform:uppercase;color:var(--text-brand-soft)}
.lockup__intl::before,.lockup__intl::after{content:"";width:3.8em;height:max(1px,.1em);background:var(--hairline-gold)}
.lockup__sub{margin-top:1.45em;font:500 .37em/1 Manrope,sans-serif;letter-spacing:.35em;text-indent:.35em;word-spacing:.6em;text-transform:uppercase;color:var(--text-body)}
.lockup[data-size="nav"]{--lk:16px}.lockup[data-size="footer"]{--lk:26px}.lockup[data-size="preloader"]{--lk:22px}
```
Note: if the wordmark is ever set in a face with real lowercase (Marcellus, Cormorant), add `text-transform:uppercase` plus a `<span class="sc">e</span>` at `font-size:.85em` to keep the small-cap e. Eyebrows elsewhere on the site reuse `.lockup__intl` styling at 11–12 px (gold-800 on paper, gold-300 on dark).

---

## 3. Typography mapping

### 3.1 What the letterhead actually uses (measured, faces not embedded in the PNG)
- Wordmark: Trajan-class inscriptional serif, all caps + small-cap e, green #00492c, cap 60 px = 3.0 % of page width.
- INTERNATIONAL / TRAVEL & TOURS / motto: a light geometric-grotesk sans, letterspaced (see §2.7), green / ink / ink.
- Tagline "Your Journey / to the Holy Land / Our Priority": a semibold humanist sans, ink, 3 lines with 45 px line pitch (row heights 36–40 px); Arabic "خدمات ضيف الرحمن": a bold modern Arabic sans, 38 px band. Faces not identified (§6).
- Footer address: regular sans ≈ 20 px cap, 36 px line pitch.

### 3.2 Display / brand serif (Google Fonts; availability + weights from the ui-ux-pro-max `google-fonts.csv`, all OFL)

| Face | Weights | Character | Verdict |
|---|---|---|---|
| **Cinzel** | 400–900 variable, Latin/Latin-ext, no italic | Direct Trajan descendant; caps-only design whose lowercase are small caps → reproduces "KARWAN ᴇ USMANIA" by typing a lowercase e | **Recommended for the lockup, eyebrows, section numerals, package tier names.** Weights 500 (lockup on paper), 600 (nav/compact, on video) |
| Marcellus / Marcellus SC | 400 only | Trajan-flavoured but softer, has real lowercase; SC variant gives small caps | Alternative if the owner finds Cinzel too "movie poster"; single weight limits hierarchy |
| **Cormorant Garamond** | 300–700 + italics, variable | Elegant Garamond with tall ascenders and a beautiful italic; superb at 40–96 px, weak below 18 px | **Recommended for H1/H2 display copy** ("Your Journey to the Holy Land, Our Priority", section titles) at 500, italic 400 for Arabic transliterations / pull-quotes. This is the "quiet luxury" register of Aman/Nusuk without copying them |
| Cormorant SC | 300–700 | Small-caps cut of Cormorant | Alternative to Cinzel for a lighter, Garamond-like lockup — but it is not Trajan-like, so it drifts from the letterhead; not recommended for the wordmark |
| Cormorant (plain) | 300–700 + italics | Slightly sharper than Garamond cut | Interchangeable with Cormorant Garamond; pick one (Garamond has the better italic for pull-quotes) |
| Fraunces | 100–900 variable (opsz 9–144, SOFT, WONK) | Soft, "wonky" old-style; editorial/food-brand feel | Rejected: too playful for an official pilgrimage house |

Recommendation: **Cinzel 500/600 (brand, ≤ 32 px)** + **Cormorant Garamond 500 / 400 italic (display, ≥ 28 px)**. Keep Cinzel out of running headlines (it has no lowercase and reads shouty above ~12 words). Letter-spacing: Cinzel 0.04–0.08 em; Cormorant display −0.01 em, line-height 1.05–1.1.

### 3.3 Body sans

| Face | Weights | Notes | Verdict |
|---|---|---|---|
| Inter | 100–900 variable + italics | Current body face; the most legible UI sans, tabular numerals; ubiquitous "SaaS" feel | Keep as fallback; no visible rebrand signal |
| Montserrat | 100–900 + italics | Closest free analogue to Rialto's Gotham Light; wide, large x-height; also the default of most navy-gold Umrah templates the owner wants to escape | Only if the owner specifically wants the Rialto Gotham look (use 300/400) |
| **Manrope** | 200–800 variable | Geometric-grotesk hybrid, narrower and calmer than Montserrat, crisp numerals, Latin/Cyrillic/Greek/Vietnamese; reads "international, quiet" next to Cormorant | **Recommended**: 400 body (16–18 px / 1.6), 500 labels & lockup lines, 600 buttons, 700 stat numerals (`font-variant-numeric: tabular-nums`) |
| DM Sans | 100–900 variable + italics, opsz | Geometric, rounded terminals, friendly | Slightly too soft/"startup" for the official tone; second choice |

Stack: `--font-body: 'Manrope', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif`. Letterspaced caps lines: 11–13 px, 0.28–0.45 em, never below 9 px.

### 3.4 Arabic and Urdu

| Script | Face | Weights | Notes | Verdict |
|---|---|---|---|---|
| Arabic | **Amiri** | 400/700 + italics | Classic Naskh by Khaled Hosny, calligraphic, already loaded on the site; needs ≥ 22 px to shine | **Display Arabic**: tagline خدمات ضيف الرحمن, bismillah, duas (Amiri Quran for verses with full marks) |
| Arabic | **Noto Naskh Arabic** | 400–700 variable | Cleaner, more legible at 14–18 px; pairs with Manrope | **UI/body Arabic** (nav labels, form hints, package Arabic names) |
| Arabic | Scheherazade New | 400–700 | SIL scholarly Naskh, thin strokes, huge repertoire | Not recommended for brand use (academic register) |
| Urdu | **Gulzar** | 400 | Lahori-style Nastaliq (Izadpanah/Ross/Savoie/Cozens, 2022); closest to Pakistani print tradition | **Display Urdu** (Qafila e Shoq title/quotes ≥ 28 px). Note: `.qafila-card__urdu` currently uses Amiri — a Naskh — which Urdu readers find wrong; switch to Nastaliq |
| Urdu | **Noto Nastaliq Urdu** | 400–700 variable | Google Nastaliq, multiple weights | **Running Urdu** ≤ 24 px if any; needs `line-height: 2.2–2.6` and `padding-block: .25em` or descenders clip |

Set `lang="ar"`/`lang="ur"` + `dir="rtl"` on every RTL element; `font-feature-settings` default; no letter-spacing on Arabic/Urdu (it breaks joining).

### 3.5 Loading
Google Fonts request (weights only as listed; swap):
`https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Naskh+Arabic:wght@400;500&family=Gulzar&family=Noto+Nastaliq+Urdu:wght@400;600&display=swap`
Better: self-host woff2 (Fontsource or downloaded) so the preloader can `<link rel="preload">` Cinzel 600 + Manrope 400 and the FLIP hand-off never reflows; keep Arabic/Urdu in separate `@font-face` blocks with `unicode-range` so they load only when used. Replace the Playfair/Inter/Amiri link in `index.html` lines 29–32 and `--font-heading/--font-body/--font-arabic` in `tokens.css`; add `--font-brand: 'Cinzel'`, `--font-urdu: 'Gulzar'`.

### 3.6 Lockup placement rules

| Context | Mark | Wordmark line | Second line | Third line | Notes |
|---|---|---|---|---|---|
| Nav, desktop (72 px bar) | 44 px, left | "Karwan e Usmania" Cinzel 600 16 px, 0.06 em | "INTERNATIONAL · TRAVEL & TOURS" Manrope 500 9.5 px, 0.3 em, green-700 (gold-200 on video) | — | gap mark→text 12 px; vertical centre on the mark's ring centre |
| Nav, ≤ 640 px | 40 px | Cinzel 600 14 px, one line | — | — | ≤ 380 px: mark only (as the current `.nav__logo-text{display:none}`) |
| Footer (≥ 900 px) | 80 px | 26 px | 13.5 px with rules 50 px × 1 px | 9.6 px | letterhead arrangement: mark | 1 px gold-champagne divider 64 px tall | stack; margins 24 / 16 px |
| Footer (< 900 px) | 64 px centred | 22 px | 11.5 px | 9 px (min) | stacked, centred |
| Preloader | 144 px desktop / 112 px mobile, self-drawn | 22 px fades in 20 px below | 11.5 px | omit | counter: Manrope 500 12 px tabular, gold-300, 20 px below the lockup (edolus pattern); then FLIP to nav 44 px (scale 0.31) |
| Minimum sizes | full mark with ring ≥ 48 px on 1× screens (ring = 1.06 px), ≥ 40 px on 2×; below 32 px use the Kaaba crop | Cinzel ≥ 13 px (small-cap e ≈ 7.5 px) | letterspaced lines ≥ 9 px | | |
| Clear space | The brief says "clear space = ring thickness". Measured ring thickness is 2.2 % of the mark's diameter — 1 px at nav size — so it cannot act as an exclusion zone. Use **X = width of the ring's top opening = 0.20 × mark diameter** (chord of the 23° gap: 2·1702·sin 11.5° = 679 px / 3404 px), min 8 px. At 48 px → 10 px; at 144 px → 29 px. | | | | |

---

## 4. Logo usage rules

**Asset reality**: `newlogo.png` is a 4096 px raster on transparency, drawn for light backgrounds (U and Kaaba are #080808; they vanish on dark video). The current site's `public/logo.png` (1080×1355) is the OLD portrait lockup and is rendered inside a 48 px white circle (`.nav__logo-img{border-radius:50%;background:#fff;padding:4px}` in `components.css` 2190–2197; footer 56 px, 2211–2217). Step one of the rebrand is an SVG master traced from `newlogo.png` in four layers: `green` (K, minaret, dome, U-bottom, ring right half), `black` (U, Kaaba), `gold` (ring left half, swoosh, band, door, crescent, aircraft), and the gradient defs. Everything below assumes that master.

1. **On dark video / green-950 (hero, preloader, transparent nav)**: use the *reversed* mark — green layer → #f4f1ea (paper) or keep green-700 with a 1 px paper outline, black layer → #f4f1ea with the Kaaba kept black-on-gold band (Kaaba stays #0b0b0b because the gold band + paper outline carry it), gold layer unchanged (gradient gold-300 → gold-600). Wordmark white (#fff on green-950 = 16.68 : 1), INTERNATIONAL gold-200, TRAVEL & TOURS on-dark-muted, rules gold-300 at 70 %. Never the white disc behind the mark; if the video is bright, add `filter: drop-shadow(0 2px 12px rgba(0,36,15,.6))` and the `--overlay-video` gradient under the hero copy.
2. **On paper / ivory**: full-colour mark exactly as supplied; wordmark green-800, INTERNATIONAL green-700, TRAVEL & TOURS ink, rules gold-hairline #d9ae54. No plate, no circle crop, no shadow.
3. **Monochrome gold (preloader self-draw, dark CTA banner, embossed footer)**: all layers as strokes in the metallic gradient (gold-300 → gold-600), 1.5–2 px at 144 px; draw order ring (9 o'clock clockwise, 1100 ms) → swoosh (800 ms, overlap −400) → K + U outlines (600 ms) → minaret/dome/crescent (500 ms) → Kaaba + band (400 ms) → fills fade in 400 ms → aircraft pops (scale 0.6 → 1, 300 ms `back.out(1.4)`). Backdrop green-950 (brand) rather than edolus's black. Hold ≥ 1400 ms after 100 %, then the two-band curtain.
4. **Monochrome white** (over photography, stamps, print on green): every layer #f4f1ea; only the Kaaba band may stay gold-300.
5. **Monochrome green** (invoices, ivory sections): every layer green-800.
6. **Favicon / app icons**: crops in §2.4 (Kaaba 16–48 px; dome + Kaaba 180 px+; SVG cube as `favicon.svg`), paper plate #fcfbf8 with 7 px radius at 32; `theme-color` → #004828 (currently #0d1b35 in `index.html` line 6).
7. **Don'ts**: no rotation (the aircraft heading is part of the mark), no stretching the ring, no recolouring gold to the old #c9a84c, no Playfair/lowercase wordmark, no two swooshes, no gold reading text on paper lighter than gold-800, no mark smaller than 32 px, no mark over busy imagery without the overlay gradient, no circle-cropping (the ring already is the circle).

---

## 5. Other observations for the orchestrator (not asked, but affects the rebrand)
- `scripts/generate-icons.js` crops the OLD logo; repoint to `newlogo.png` with the §2.4 extracts before `vite build`.
- `index.html` JSON-LD address is "Mansoorah Homes, Multan Road, 54600" while the letterhead says "Office No. 2, 1st Floor, Usman Plaza, 436-G1, Opposite Butt Sweets, Johar Town, Lahore" — reconcile with the owner before shipping; also the letterhead prints `www.Usmania.vercel.app` vs live `keusmania.vercel.app`.
- Current `--color-gold #c9a84c` is a cooler, greyer gold than the logo's #e0a028; `--color-green #1a6b3c` is lighter and bluer than #004828. Both must change, not just navy.
- GSAP 3.15.0 ships DrawSVGPlugin, MotionPathPlugin, Flip and SplitText in `node_modules/gsap` (all free since GSAP 3.13), so the self-draw preloader, path-following aircraft and the logo-to-nav FLIP need no new dependencies. Lenis is 1.3.23, Three 0.160.0.
- `public/patterns/geometric.svg` already exists and can be the tone-on-tone footer-band texture (§2.5) at 4 % white.

---

## 6. Unverified / open items (stated explicitly)
- Measurements come from the 2000×3000 preview PNG, not from rasterising `letter_head.pdf` myself; the PDF may carry different colour management (the brief's paper "#f8f8f8" does not occur in the preview, which samples #fdfdfe–#ffffff).
- The letterhead's secondary sans, tagline sans and Arabic face were not identified (fonts are not embedded in a PNG).
- "Cinzel renders lowercase as small caps" is from my knowledge of the typeface, not verified in a browser this session; verify by typing `Karwan e Usmania` in the Google Fonts specimen before committing the lockup CSS.
- Font availability/weights/licences are from the ui-ux-pro-max skill's `google-fonts.csv` / `google-font-licenses.json` (last-modified dates 2025-09 to 2026-05), not fetched live from Google Fonts.
- Noto Nastaliq Urdu's line-height requirement and Gulzar's "Lahori style" characterisation are from experience, not measured here.
- The faint geometric pattern inside the letterhead's bottom band is visible in the preview and in the histogram (#104028 ↔ #185038) but its geometry was not extracted.
- The ring taper function in §2.1 is a smooth approximation of the measured thicknesses (75 / 72 / 44 / 36 / 6 / 0 px); the original stroke is hand-drawn, not analytic.
- The 24 px dome/crescent icon and the Kaaba favicon SVG paths are hand-approximated placeholders until the vector trace exists.
- Montserrat ≈ Gotham (Rialto's body face) is general type knowledge; no metric comparison was done.

# Gap fill 4: type stack, payload, Cinzel small caps, Arabic and Urdu faces

Measured 2026-10-10. Nothing in the repo was modified. Scratch work is in `scratchpad/gap4/`:
- `css/*.css`: Google CSS2 responses, fetched with a Chrome 126 UA.
- `sizes.json`: every @font-face with its URL and HEAD Content-Length.
- `dl/*.ttf`: TTFs from github.com/google/fonts `main`.
- `served/*.woff2`: the actual gstatic files.
- `analyze.txt`: HarfBuzz ink and metric measurements.
- `sheet.png`, `fustat.png`: rendered specimens.
- `sub/`: self-hosted subset experiments and `wordmark.svg`.

Tools: fontTools 4.66.1, uharfbuzz 0.56.3 and freetype-py, all in an isolated venv. Python ran with `-I`.

This file extends `brand.md` §2.7 and §3, `craftbar.md` §5, `awwwards.md` (Velaa/Fustat) and `motion.md` §3 and §6. It does not repeat them.

---

## 0. Verdict

| Role | Face | Delivery | Bytes (woff2) | When |
|---|---|---|---|---|
| Wordmark "KARWAN ᴇ USMANIA" | **Cinzel 500, outlined to SVG** | Inline SVG, `fill: currentColor` | 0 font bytes. The SVG is 8,797 B raw / **3,782 B gzip** | First paint (in the HTML) |
| Latin display (H1–H3, ≥ 28 px) | **Cormorant Garamond** variable 300–700, upright | Self-host the gstatic latin file | **37,640** | First paint, preload |
| Latin display italic (pull-quotes, transliterations) | Cormorant Garamond 400 italic | Self-host | 23,660 | Lazy (no preload) |
| Latin body, UI, eyebrows, letterspaced lines, stat numerals | **Manrope** variable 200–800 | Self-host the gstatic latin file | **24,836** | First paint, preload |
| Arabic (tagline خدمات ضيف الرحمن, bismillah, duas, ﷺ/ﷻ, Arabic eyebrows) | **IBM Plex Sans Arabic 500** (one static weight) | Self-host a pyftsubset core subset | **23,320** (gstatic arabic file: 45,296) | First paint. The footer dua is on every page |
| Urdu (قافلہ شوق, pillar words) | **Noto Nastaliq Urdu 400**, static instance | Self-host an instanced + Urdu-alphabet subset | **114,480** (gstatic variable arabic file: 239,060) | Lazy. Only the Packages page uses it, and nothing preloads it |

That is 2 Latin webfont families + 1 Arabic + 1 Urdu, which meets the cap. Cinzel ships as artwork, not as a webfont.

- **First-paint fonts: 37,640 + 24,836 + 23,320 = 85,796 B ≈ 83.8 KB**, plus the 3.8 KB gzip wordmark SVG inside the HTML/JS. If the Google files are used unmodified instead of the Plex subset: 107,772 B ≈ 105 KB.
- **Lazy fonts: 23,660 (italic) + 114,480 (Urdu) = 138,140 B ≈ 135 KB**, plus latin-ext files only when CMS text contains such characters (Manrope 15,120, Cormorant 33,736).
- **The current site, for comparison:** the Playfair, Inter and Amiri link in `index.html:29-32` requests 627,648 B of unique latin + arabic files. Home first paint needs Inter 48,256 + Playfair 38,404 + Amiri 400 arabic 108,560 (hero bismillah) + Amiri 700 arabic 99,968 (the hero H1 is `lang="ur"` Amiri at `--weight-black`) = **295,188 B ≈ 288 KB**. The recommended stack is **about 3.4× lighter** at first paint.

---

## 1. Measured payload per candidate (Google Fonts CSS2, Chrome 126 UA, `curl -sI` Content-Length)

Google serves one variable file for every requested weight of a variable family, so several weights cost the same as one. Only the subset files that the page's characters actually hit get downloaded (via `unicode-range`). The "realistic" column assumes latin for Latin faces and arabic for Arabic-script faces.

| Family (weights requested) | Variable? | latin | latin-ext | arabic | Realistic per page | Notes |
|---|---|---:|---:|---:|---:|---|
| Cinzel 500/600 | yes, wght 400–900 | 25,904 | 14,540 | — | **25,904** | The served file's GSUB has only `locl`. Google strips `ss01/ss02/dlig/onum`, which exist in the GitHub TTF |
| Cormorant Garamond 400/500 | yes, wght 300–700 | 37,640 | 33,736 | — | **37,640** | Also cyrillic(-ext) and vietnamese, which are never hit. **No `smcp`** in GSUB |
| Cormorant Garamond 400 italic | no (static) | 23,660 | 20,284 | — | 23,660 | |
| Playfair Display 400 | no (static when one weight is requested) | 21,856 | 12,336 | — | 21,856 | No `smcp` |
| Manrope 400/500/600/700 | yes, wght 200–800 | 24,836 | 15,120 | — | **24,836** | Has `tnum` (stat counters) |
| Inter 400/500/600 | yes, wght 100–900 | 48,256 | 85,068 | — | 48,256 | Twice the size of Manrope |
| Amiri 400 | no | 19,544 | 10,444 | 108,560 | 108,560 | |
| Amiri 700 | no | 20,300 | 10,860 | 99,968 | +99,968 | 400 + 700 arabic = 208,528 |
| Noto Naskh Arabic 400/500 | yes, wght 400–700 | 19,696 | 10,392 | 94,032 | 94,032 | Also math 14,284 and symbols 9,408 subsets |
| IBM Plex Sans Arabic 400 | no | 19,164 | 6,656 | 42,848 | 42,848 | |
| IBM Plex Sans Arabic 500 | no | 20,088 | 6,540 | 45,296 | **45,296** | 400 + 500 = 88,144 |
| Fustat 400/500 | yes, wght 200–800 | 24,544 | 12,924 | 32,508 | 32,508 | **Missing ﷺ U+FDFA and ﷻ U+FDFB** (§3) |
| Gulzar 400 | no | 25,188 | 8,568 | 208,800 | 208,800 | |
| Noto Nastaliq Urdu 400/600 | yes, wght 400–700 | 20,492 | 11,268 | 239,060 | 239,060 | Largest file measured |

### 1.1 Shrinking the script faces (measured)

| Experiment | Bytes | Verdict |
|---|---:|---|
| Google `&text=` subset, Gulzar, all Urdu strings on the site | 115,424 | `text=` subsets are fragile when the CMS can change strings: a missing letter falls back to another font mid-word and breaks joining. Do not use |
| Google `&text=` subset, Noto Nastaliq Urdu 400, same strings | 66,456 | Same objection |
| Google `&text=` subset, Amiri, tagline + bismillah | 25,508 | Same objection |
| Google `&text=` subset, Cinzel 600, "Karwan e Usmania" | 2,180 | Fine for a fixed wordmark, but the SVG is better (§2.3) |
| pyftsubset Gulzar to the Urdu alphabet, all layout features | 201,016 | Almost no saving. Nastaliq contextual forms dominate the file |
| pyftsubset Noto Nastaliq Urdu variable to the Urdu alphabet | 177,436 | |
| **Noto Nastaliq Urdu, instanced to wght 400, then Urdu alphabet** | **114,480** | Recommended Urdu file |
| Same at wght 600 | 117,556 | Only add this if a bold Urdu weight is ever needed |
| **IBM Plex Sans Arabic 500 core subset** (Arabic letters + harakat + Urdu letters + Arabic-Indic and Urdu digits + ﷺ ﷻ + ZWNJ/ZWJ/LRM/RLM + ASCII punctuation) | **23,320** from `IBMPlexSansArabic-Medium.ttf` (22,116 from Regular) | Recommended Arabic file. The unicode list is in §4.3 |

---

## 2. Cinzel small caps: verified, but brand.md's lockup CSS is wrong

### 2.1 Measurement
Shaped with HarfBuzz from `ofl/cinzel/Cinzel[wght].ttf` (GitHub main) and cross-checked against the gstatic woff2 actually served. Values are ink bounding-box heights in font units (upm 1000, OS/2 capHeight 700).

| wght | E | e | e/E | K | k | k/K | H/h | U/u | O/o (with overshoot) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 400 | 718 | 616 | 0.858 | 700 | 600 | 0.857 | 0.857 | 0.860 | 0.863 |
| 500 | 718 | 616 | 0.858 | 700 | 600 | 0.857 | 0.857 | 0.860 | 0.863 |
| 600 | 718 | 616 | 0.858 | 700 | 600 | 0.857 | 0.857 | 0.859 | 0.860 |

- Lowercase glyphs are true small caps, with a flat-letter ratio of **600/700 = 0.857**. The letterhead measures 51/60 = 0.85, so this is a match. The served woff2 gives the same 718/616. `sheet.png` row 1 shows it rendered.
- **Do not trust Cinzel's OS/2 sxHeight (500).** The real lowercase height is 600. `font-size-adjust: ex-height` or `cap-height` maths based on it would be off.
- Lowercase advances are narrower (e 552 vs E 595 at wght 500). Small caps are not uppercase scaled down.

### 2.2 The bug in `brand.md` §2.7
brand.md line 370 says: *"type 'Karwan e Usmania' … only the 'e' drops to 85 %"*. **That is false.** In Cinzel **every** lowercase letter is a small cap. Typing `Karwan e Usmania` renders as K + small-caps ARWAN, small-cap E, and U + small-caps SMANIA, which is `sheet.png` row 1. The letterhead is full caps with only the "e" small.

- The DOM text must be `KARWAN e USMANIA`. That is row 2 with a lowercase e.
- `text-transform: uppercase` cannot be used, because it would capitalise the e as well.
- With live text, add `aria-label="Karwan e Usmania"` so screen readers do not read shouted caps.

### 2.3 Recommendation: ship the wordmark as SVG, not as a font
`sub/wordmark.svg` is generated from Cinzel at wght 500 via HarfBuzz shaping and fontTools SVGPathPen:
- Advance width 10,404 units, viewBox `0 -730 10404 750`.
- 8,797 B raw, **3,782 B gzip**.
- `fill="currentColor"`, `role="img"`, `aria-label="Karwan e Usmania"`.

Why the SVG is better:
1. The preloader self-draw and the logo-to-nav FLIP (motion.md §3) no longer depend on a webfont, so the gate has one less wait.
2. It can never reflow on font swap.
3. It frees a Latin slot so the stack fits the 2-family cap.
4. Strokes can be drawn with `stroke-dasharray` like the mark.

Generate a second SVG at wght 600 for the compact nav and the on-video state (brand.md §3.6) if the weight difference matters at 14–16 px. INTERNATIONAL, TRAVEL & TOURS, eyebrows and tier names move to **Manrope 500 letterspaced caps**. That is what the letterhead uses anyway: brand.md §3.1 notes a light geometric sans for those lines.

**Fallback (option B):** if the team wants live Cinzel text for eyebrows or tier names, use Cinzel as the second Latin family (25,904 B) and drop Cormorant. Headlines would then become Manrope or Cinzel caps. I do not recommend this. brand.md §3.2 already warns that Cinzel reads shouty in running headlines.

---

## 3. Arabic and Urdu: coverage and safe line-heights

All strings were shaped with HarfBuzz using the right script and language (`ur` for the Nastaliq faces). There were **zero `.notdef` glyphs except where marked**. Ink extents are in em.

**Minimum line-height formula.** The value is the smallest unitless `line-height` at which the ink stays inside the line box with CSS half-leading:

`L ≥ max(2·inkTop − A + D, 2·|inkBottom| + A − D)`

- A and D are the hhea ascent and descent. All six fonts set USE_TYPO_METRICS and have typo = hhea, so A and D should be the same in every engine. Win metrics differ but are ignored when USE_TYPO_METRICS is set.
- This is the threshold for `overflow:hidden` line masks (SplitText `mask:'lines'`) and `background-clip:text`. Below it the ink is clipped.

### 3.1 Font metrics

| Font | upm | hhea ascent / descent | `line-height: normal` (A+D) |
|---|---:|---|---:|
| Gulzar | 1000 | 1500 / 1200 | **2.70** |
| Noto Nastaliq Urdu | 1000 | 1904 / 596 | **2.50** |
| Amiri | 1000 | 1124 / 634 | 1.76 |
| Noto Naskh Arabic | 1000 | 1069 / 634 | 1.70 |
| IBM Plex Sans Arabic | 1000 | 1085 / 415 | 1.50 |
| Fustat | 1000 | 1000 / 420 | 1.42 |

Never leave Nastaliq on `line-height: normal`. Each line would take 2.5–2.7 em.

### 3.2 Minimum no-clip line-height per string

| String | Gulzar | Nastaliq 400 | Nastaliq 600 | Amiri | Naskh 400 | Plex 400 | Fustat 400 |
|---|---:|---:|---:|---:|---:|---:|---:|
| قافلہ شوق (ink top / bottom) | 1.76 (1.03 / −0.36) | **1.99** (1.08 / −0.34) | 2.03 | 1.06 | 0.96 | 1.15 | 1.04 |
| عبادت | 1.12 | 1.85 | 1.86 | 0.97 | 0.91 | 1.07 | 0.96 |
| ریاضت | 1.53 | **2.03** | 2.06 | 1.02 | 0.91 | 1.15 | 0.98 |
| تربیت | 1.34 | 1.41 | 1.46 | 0.97 | 0.85 | 1.15 | 0.98 |
| سیاحت | 1.12 | 1.87 | 1.88 | 0.96 | 0.91 | 1.07 | 0.96 |
| بک کریں (nav) | 2.29 | 1.99 | 2.10 | 1.19 | 0.96 | 1.15 | 1.04 |
| خدمات ضيف الرحمن (letterhead) | 1.74 | 1.99 | 2.03 | 1.17 | 0.96 | **1.15** | 1.04 |
| خدمات ضیوف الرحمن (current hero) | 1.84 | 1.99 | 2.03 | 1.17 | 0.96 | 1.15 | 1.04 |
| بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ | 2.25 | 2.66 | 2.68 | 2.01 | 1.51 | **1.62** | 1.63 |
| footer dua (full harakat + shadda/alif khanjariya) | 3.13 | 2.87 | 3.05 | 2.14 | 1.68 | **1.69** | 1.85 |
| ﷺ U+FDFA | 2.10 | 4.07 | 4.25 | 1.16 | 1.33 | 1.16 | **missing** |
| ﷻ U+FDFB | 1.46 | 2.46 | 2.59 | 1.11 | 1.20 | 1.15 | **missing** |
| Urdu-only letters ٹڈڑںےۓہھۂ | ok | ok | ok | ok | ok | ok | ok |
| Urdu and Arabic-Indic digits | ok | ok | ok | ok | ok | ok | ok |

### 3.3 Settings to use

- **Noto Nastaliq Urdu 400:**
  - Single-line display words: `line-height: 2.1`.
  - If a line mask is used: `line-height: 2.1` plus `padding-block: .3em; margin-block: -.3em`, which matches motion.md §6.
  - Multi-line Urdu: `line-height: 2.2`.
  - Never put ﷺ inside Nastaliq text: its ink reaches −1.38 em. Set honorifics in the Arabic face.
- **IBM Plex Sans Arabic 500:**
  - Unvocalised tagline or eyebrows: `line-height: 1.3`.
  - Vocalised bismillah or duas: `line-height: 1.75`.
- If Gulzar is chosen instead (§4.4), use `line-height: 1.9` for display words and 2.35 when بک کریں-style tall ک strokes occur.

### 3.4 Coverage verdict for "خدمات ضيف الرحمن" and the site's other Arabic-script strings
- **Amiri, Noto Naskh Arabic, IBM Plex Sans Arabic, Gulzar and Noto Nastaliq Urdu cover everything.** That includes ﷺ and ﷻ (used in English sentences in `src/data.js` lines 83, 175, 181, 199) and the Urdu letters.
- **Fustat fails ﷺ and ﷻ.** They shape to `.notdef` in the TTF. Its gstatic `unicode-range` claims FB50–FDFF but the glyphs are absent, so the browser falls back per glyph. Fustat is out unless honorifics are written out in full (صلى الله عليه وسلم).

### 3.5 Style match with the letterhead
The letterhead crop (`gap4/lh-arabic.png`, from `keu-website/letterhead-preview-0.png` x 1100–2000, y 330–520) shows خدمات ضيف الرحمن in a **low-contrast modern Arabic sans**, not a calligraphic Naskh. `sheet.png` rows 3–6 compare the candidates:
- Amiri and Noto Naskh are contrasted Naskh forms and do not match.
- IBM Plex Sans Arabic and Fustat do match.
- Plex is also the face Nusuk uses (craftbar.md §2).

So **Plex Sans Arabic 500** is the closest available match and the only sans candidate that passes coverage.

Amiri at 108 KB per weight should be dropped. If the owner wants a calligraphic bismillah, render it once as SVG or image artwork. Do not spend a webfont on it.

---

## 4. The :lang()-based @font-face plan

### 4.1 Why `unicode-range` cannot separate Arabic and Urdu
brand.md §3.5 suggests separating them with `unicode-range`. That cannot work:
- Urdu and Arabic share U+0600–06FF.
- Urdu-only letters sit in the same block: ٹ U+0679, ڈ U+0688, ڑ U+0691, ک U+06A9, گ U+06AF, ں U+06BA, ھ U+06BE, ہ U+06C1, ی U+06CC, ے U+06D2.
- Ordinary Urdu words such as عبادت use plain Arabic letters only.

Use **two differently named families, selected with `:lang()`**. `unicode-range` is still useful for one thing: it keeps an Arabic-script family from downloading for pages or elements that contain no Arabic-script characters.

### 4.2 Loading behaviour that matters for the preloader gate
A browser fetches a @font-face only when two things are true: some laid-out text uses that family, and the text contains a character in the face's range. This happens **whether or not the text is in the viewport.** Off-screen DOM content still triggers the download, and **`document.fonts.ready` then waits for it.** Today:

- `Nav.jsx:60` puts `<span lang="ur">بک کریں</span>` in the nav on **every page**. If `:lang(ur)` maps to Nastaliq, every page downloads 114–239 KB of Urdu at first paint, and `document.fonts.ready` waits for it. **Fix:** set this inline label in the Arabic UI face. Plex covers ک ی ں, verified with no notdef. Alternatively drop the Urdu from the button.
- `Footer.jsx:22` has a dua with `lang="ar"` on every page, so the Arabic face loads on every page. That is acceptable at 23 KB, and it is why Plex counts as first-paint.
- `Hero.jsx:23` currently marks the Arabic tagline `lang="ur"`, spelled ضیوف with Farsi yeh U+06CC. The letterhead spells it ضيف with Arabic yeh U+064A. In the rebrand it should be `lang="ar"` with the letterhead spelling. Otherwise the Urdu face would load on Home, and Nastaliq would render an Arabic phrase. **This copy change needs owner sign-off.**
- **The preloader gate (motion.md §3) should not use bare `document.fonts.ready`.** Use an explicit, bounded list:

```js
const fontGate = Promise.all([
  document.fonts.load('400 16px Manrope'),
  document.fonts.load('500 48px "Cormorant Garamond"'),
  document.fonts.load('500 24px "KEU Arabic"', 'خدمات'),
]);
// gate = max(minHold, logoDrawn, fontGate, poster.decode()), with the 4000 ms cap from motion.md
```

  Later lazy loads (Urdu, italic) then cannot hold the curtain. Keep `ScrollTrigger.refresh()` on `document.fonts.ready` for layout correctness. That is a separate concern from the gate.

### 4.3 CSS (target: a new `src/styles/fonts.css` replacing the `<link>` at `index.html:29-32`; files in `public/fonts/`)

```css
/* Latin: the gstatic latin files, downloaded and self-hosted (OFL) */
@font-face{font-family:"Manrope";src:url(/fonts/manrope-latin-var.woff2) format("woff2");
  font-weight:200 800;font-style:normal;font-display:swap;
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Cormorant Garamond";src:url(/fonts/cormorant-garamond-latin-var.woff2) format("woff2");
  font-weight:300 700;font-style:normal;font-display:swap;unicode-range:/* same latin range */ U+0000-00FF,U+2000-206F}
@font-face{font-family:"Cormorant Garamond";src:url(/fonts/cormorant-garamond-latin-400i.woff2) format("woff2");
  font-weight:400;font-style:italic;font-display:swap;unicode-range:U+0000-00FF,U+2000-206F}
/* add the latin-ext files with Google's latin-ext range only if CMS copy needs them; they cost nothing until hit */

/* Arabic: ONE family, used for every lang="ar" and for stray Arabic-script glyphs (ﷺ ﷻ) in Latin text */
@font-face{font-family:"KEU Arabic";src:url(/fonts/plex-sans-arabic-500-core.woff2) format("woff2");
  font-weight:400 600; /* one static 500 file answers 400–600 requests; no faux-bold */
  font-style:normal;font-display:swap;
  unicode-range:U+060C,U+061B,U+061F,U+0621-0652,U+0660-0670,U+0679,U+067E,U+0686,U+0688,U+0691,U+0698,U+06A9,U+06AF,U+06BA,U+06BE,U+06C1,U+06CC,U+06D2,U+06F0-06F9,U+FDFA-FDFB,U+200C-200F}

/* Urdu: a separate family name, so it only loads where :lang(ur) text exists */
@font-face{font-family:"KEU Urdu";src:url(/fonts/noto-nastaliq-urdu-400-urdu.woff2) format("woff2");
  font-weight:400;font-style:normal;font-display:swap;
  unicode-range:U+060C,U+061B,U+061F,U+0621-063A,U+0641-0652,U+0654,U+0670,U+0679,U+067E,U+0686,U+0688,U+0691,U+0698,U+06A9,U+06AF,U+06BA,U+06BE,U+06C0-06C3,U+06CC,U+06D2-06D4,U+06F0-06F9,U+200C-200D}

:root{
  --font-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
  --font-body:Manrope,"KEU Arabic",system-ui,-apple-system,"Segoe UI",sans-serif; /* KEU Arabic catches ﷺ ﷻ inside English sentences */
  --font-arabic:"KEU Arabic","Segoe UI","Noto Sans Arabic",Tahoma,sans-serif;
  --font-urdu:"KEU Urdu","KEU Arabic","Jameel Noori Nastaleeq","Urdu Typesetting",serif;
}
:lang(ar){font-family:var(--font-arabic);letter-spacing:0;line-height:1.3}
:lang(ar).is-vocalised,.bismillah:lang(ar){line-height:1.75}
:lang(ur){font-family:var(--font-urdu);letter-spacing:0;line-height:2.1}
/* inline Urdu inside Latin UI (nav button): use the Arabic UI face, so Nastaliq never loads at first paint */
.nav__cta :lang(ur),.arabic--inline:lang(ur){font-family:var(--font-arabic);line-height:1}
```

**Pyftsubset unicode lists** (as used to produce the measured files):
- Plex core: `U+0020-002F,U+060C,U+061B,U+061F,U+0621-0652,U+0660-0670,U+0679,U+067E,U+0686,U+0688,U+0691,U+0698,U+06A9,U+06AF,U+06BA,U+06BE,U+06C1,U+06CC,U+06D2,U+06F0-06F9,U+FDFA,U+FDFB,U+200C-200F` with `--layout-features='*' --flavor=woff2`.
- Urdu: run `fonttools varLib.instancer NotoNastaliqUrdu[wght].ttf wght=400`, then pyftsubset with the Urdu range above and `--layout-features='*'`.
- The 0021–002F punctuation is in the Urdu subset so that Urdu runs keep their own punctuation. It is left out of the Urdu `unicode-range`, so Latin punctuation never triggers the Urdu file.

**Caution on the Plex core subset.** It is a fixed alphabet. A CMS editor pasting Persian-only letters (e.g. ژ U+0698 is included, but ۀ U+06C0 is not in the Plex list) or Quranic annotation marks (U+06D6–06ED) would fall back to the system font. Two options:
- Use the gstatic arabic file instead (45,296 B, full Arabic block).
- Widen the list to `U+0600-06FF` and re-measure.

**Inline Nastaliq inflating line boxes.** An inline Nastaliq span inside a Latin paragraph with unitless `line-height` places its half-leading around its own 2.5 em content area, which makes that line taller. Two fixes:
- Set the inline span to `line-height: 1` or `0`.
- Add `ascent-override: 120%; descent-override: 50%` to the "KEU Urdu" @font-face. I did not test these values or Safari support for the descriptors.

### 4.4 Urdu face: Nastaliq vs Gulzar
| | Noto Nastaliq Urdu 400 | Gulzar 400 |
|---|---|---|
| Self-hosted subset | **114,480 B** | 201,016 B |
| Google file | 239,060 B (variable) | 208,800 B |
| Safe display line-height | 2.1 | 1.9 |
| Style | Traditional Nastaliq, weight axis available | Lahori-style (brand.md §3.4), denser, more "Pakistani print". Shown in `sheet.png` rows 7–8 |

I recommend Nastaliq for bytes: −87 KB on the Packages page, and the file is lazy anyway. Gulzar is a reasonable swap if the owner prefers its look. That changes only the file and the line-height. In both cases, stop using Amiri (a Naskh) for `.qafila-card__urdu` and `.qafila-pillar__urdu`.

### 4.5 Preload list (index.html head, `crossorigin` is mandatory on font preloads)
```html
<link rel="preload" href="/fonts/manrope-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/cormorant-garamond-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/plex-sans-arabic-500-core.woff2" as="font" type="font/woff2" crossorigin>
```
- **Do not preload** the Cormorant italic, the Urdu file or any latin-ext file.
- Remove the `fonts.googleapis.com` and `fonts.gstatic.com` preconnects once fonts are self-hosted.
- If the rebranded hero shows no Arabic line above the fold, drop the third preload. The footer dua still loads Plex shortly after.
- Set a long cache on `/fonts/*` in `vercel.json` (`Cache-Control: public, max-age=31536000, immutable`). I have not checked whether `vercel.json` already sets headers.

---

## 5. Latin decisions (resolving the conflicts between files)
- **Display: Cormorant Garamond, not Playfair.**
  - Playfair is the current navy template's face, and craftbar.md §3.9 lists "Playfair Bold at 60px" as cheap copy.
  - Cormorant's variable upright file (37,640 B) covers 300–700. Playfair 400 static is 21,856 B, so Cormorant costs +15.8 KB for the quiet-luxury register brand.md §3.2 argues for.
  - Neither served file has `smcp`, so never use `font-variant-caps: small-caps` on them. The browser would synthesise fake small caps.
  - Cormorant only at ≥ 28 px (brand.md §3.2).
- **Body: Manrope, not Inter or Montserrat.**
  - Manrope's latin variable file is 24,836 B against Inter's 48,256 B, so half the size. It has `tnum` for counters.
  - Montserrat was not in the candidate list and was not measured. brand.md §3.3 already rejects it as the template default.
- **Wordmark: Cinzel as SVG** (§2.3).

---

## 6. Unverified
- I did not measure size savings from serving fonts with Brotli over HTTP. woff2 is already Brotli-compressed internally, and gstatic sent no `Content-Encoding`.
- Browser behaviour was reasoned from the CSS Fonts spec, not observed in DevTools. That covers off-screen text triggering font loads and `document.fonts.ready` waiting for them. Confirm in Chrome's Network panel after implementation.
- Plex core subsets were built from both GitHub TTFs: Medium (500) = 23,320 B, Regular (400) = 22,116 B. Plex line-heights were measured on the 400 file only. The 500 figures should be near-identical (same hhea), but I did not measure them.
- I did not check whether the GitHub `main` TTFs match the gstatic versions exactly (Cinzel v26, Gulzar v14, Noto Nastaliq Urdu v23, Plex v15). The Cinzel e/E ratio was re-measured on the served woff2 and matches.
- Rendered specimens use FreeType without hinting, and HarfBuzz shaping, not a browser. Rendering in Chrome, Safari and Firefox, especially Nastaliq kerning and cascade, is not verified.
- Support and values for `ascent-override`/`descent-override` (§4.3) were not tested.
- The letterhead Arabic face is identified as "modern Arabic sans, closest to Plex/Fustat" by eye. The exact face is unknown.
- `ImageFont`/raqm was not used. A Fustat render artefact in the first `sheet.png` (row 6, apparently clipped at the baseline) came from my renderer. The re-render in `fustat.png` is correct.

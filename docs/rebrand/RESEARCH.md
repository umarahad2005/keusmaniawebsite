# KEUI rebrand: consolidated research dossier

Synthesised 2026-10-10 from `BRIEF.md`, `VISUAL-NOTES.md`, `brand.md`, `craftbar.md`, `motion.md`, `codebase.md`, `footage.md`, `awwwards.md`, `21st-components.md` and `gap-1` to `gap-5`. Every critic-flagged contradiction is settled below and marked **DECISION**, with the reason. While synthesising I re-checked two facts: `node_modules/gsap/DrawSVGPlugin.js` exists (v3.15.0), and the full Hyperiux `LICENSE_EFFECTS` text was fetched from GitHub.

---

## 1. Executive summary

1. **The owner loves timing and scale, not colour.** From Rialto (https://rialto.com.au/) that means one muted full-bleed video, a single 750 ms easeOutQuart fade grammar and hairlines that draw. From Edolus (https://edolus.com/) it means a logo self-draw, a two-band curtain and a logo-to-nav FLIP. All of it works in GSAP + CSS. None of it needs WebGL.
2. **Position:** two-thirds Nusuk/Aman, one-third Rialto/Edolus. Paper is the ground and dark is an event (the hero, one Qafila chapter, the green footer). Gold is a hairline, never a fill.
3. **Palette** (sampled from `newlogo.png` and the letterhead): green-800 `#004828` is primary, green-950 `#00240f` is the dark ground, gold-500 `#e0a028` is for hairlines and gold on dark, gold-800 `#885800` is the only gold allowed for small text on paper, and paper is `#fcfbf8`.
4. **Type** (measured payload): the wordmark is Cinzel 500 outlined to SVG (3.8 KB gzip). Display is Cormorant Garamond, body is Manrope, Arabic is IBM Plex Sans Arabic 500 and Urdu is Noto Nastaliq Urdu (lazy). That is about 84 KB of fonts at first paint, against about 288 KB today.
5. **Hero clip:** Pexels 35110835 (static camera, tiny faces), retimed to 0.5x for true 30 fps slow motion. 1080p measures 3.71 MB. Mobile gets a 9:16 crop at 720×1280 (≤1.5 MB), played only on 4G after LCP. Host the files on Vercel Pro as Vite-hashed assets.
6. **LCP truth (tested in Chrome 154):** a 100svh poster or video is *never* the LCP element, and the hero H1 is. An opaque preloader does not hide content from LCP. So the H1 is painted under the curtain and the bands opening are its reveal. No CSS line mask on the H1.
7. **Preloader:** first visit per session only. Green-950 ground, the gold KU mark draws itself, a small honest counter, minHold 1200 ms, hard cap 2200 ms, then 800 ms bands and an 800 ms FLIP. Typical 2.0 s to an open hero, worst case 3.0 s.
8. **Codebase:** the work splits into replace (tokens, Hero/Three, motion hooks), restyle (everything public) and keep (admin, api, auth, whatsapp, SEO contracts). Three.js is retired (109 KB gz). Lenis and ScrollTrigger must be synced first.
9. **Production is not what the brief assumed.** This repo deploys to **usmania.vercel.app**, while keusmania.vercel.app serves an older Tailwind SPA. The live Mongo `site` row overrides `data.js` with a misspelled name and tagline and a different WhatsApp number (`+923304211900`).
10. **Blocking assets:** a 4-layer SVG trace of the KU mark (none exists), a knock-out or retrace of the Qafila seal (an opaque white 985 KB PNG), and a first-frame poster exported at 1920 px (the Cloudinary `keu/makkah/kaaba` original is only 1200×900).

---

## 2. Brand truth (final decisions)

### 2.1 Colour tokens

Sources: `brand.md` §1 (pixel-sampled with sharp; WCAG ratios computed against `#fcfbf8`) and the letterhead raster `keu-website/letterhead-preview-0.png`.

| Token | Hex | Provenance / use |
|---|---|---|
| green-700 | `#005830` | sampled (logo highlight). INTERNATIONAL line, secondary brand text |
| **green-800** | **`#004828`** | sampled (10.1 % of logo pixels). Wordmark, headings on paper, primary button (white on it 10.73:1) |
| green-900 | `#003820` | sampled (shadow). Pressed states, the end of the Qafila gradient |
| **green-950** | **`#00240f`** | designed (darkest in-ring sample `#002710`). Dark ground for the preloader, curtains, the Qafila chapter and the scrim base |
| green-band → band-deep | `#164a31` → `#083820` | sampled (letterhead bottom band). Footer gradient |
| green-600 / 500 | `#0b6239` / `#20784d` | designed. Links (7.20:1) / success |
| gold-200 / 300 | `#f5d795` / `#e9c266` | sampled / designed. Gold text and eyebrows on dark |
| **gold-500** | **`#e0a028`** | sampled. Hairlines, icons, gold on dark (4.71:1 on green-800, 7.33 on green-950) |
| gold-600 | `#c08010` | sampled. Gold display type ≥24 px on paper only (3.20:1) |
| **gold-800** | **`#885800`** | sampled (most frequent gold). **The only gold allowed for small text on paper** (5.89:1) |
| gold-hairline | `#d9ae54` | sampled (letterhead rules). 1 px rules on paper, decorative only |
| **paper** | **`#fcfbf8`** | page ground. Cards `#ffffff`, alternate field ivory `#f6f2ea` |
| ink / text-body / text-muted | `#0b0b0b` / `#2c3a33` / `#5f6f67` | sampled / designed (19.0 / 11.5 / 5.1:1) |
| on-dark / on-dark-muted | `#f4f1ea` / `#b9c7bf` | 14.78 / 9.52:1 on green-950 |
| whatsapp | `#25d366`, label `#00240f` | white on WhatsApp green is 1.98:1 and fails, so the label is green-950 (8.41:1) |

**DECISIONS on the flagged colour conflicts**
- **Paper is `#fcfbf8`, not `#f8f8f8`.** The letterhead raster samples as `#ffffff`, and `#f8f8f8` occurs nowhere in it. Both candidates are designed approximations. `#fcfbf8` is closer to the measured white, warm enough that gold hairlines do not read as yellow-on-white on a screen, and it is the paper every brand.md contrast ratio was computed against. Anything written against `#f8f8f8` (craftbar, motion, awwwards) maps to `--paper` unchanged.
- **Green names follow brand.md's sampled scale.** codebase.md §6.3 (`--green-800 #104028`, `--green-600 #004828`) used the brief's samples without re-sampling. The dark ground has three candidates: `#003018` in motion/awwwards/21st, `#083820` in craftbar and `#00240f` in brand. All of these collapse to **green-950 `#00240f`**, because it is the only one with computed contrast pairs. `#083820` stays as the footer gradient end, where the letterhead puts it.
- **Text on paper is split the way the letterhead splits it.** The letterhead sets its brand voice in green and its reading text in neutral black (`#090909`–`#1c1c1c`, measured). So the wordmark, H1–H3 and green eyebrows use green-800. Body copy uses text-body `#2c3a33`, and numerals and high-emphasis small text use ink. craftbar's "green is the ink" is kept for display type only.
- **Small gold text on paper is gold-800 `#885800`, the one token.** It meets craftbar's floor (`#906000`) with margin. awwwards' `#d89820` eyebrows on paper fail at about 2.3:1 and are rejected. codebase's `--gold-600 #d89820` is replaced by brand's gold-600 `#c08010`.
- **No gold fills, gold buttons or gold gradients in UI** (craftbar rule 3 wins). The candidates were `--cta-gold-bg`, the dark-theme gold primary, motion's "primary gold" button, `--gradient-gold` and 21st's gold-to-green gradient wordmark. Each reads as the navy-gold Umrah template the owner rejected (PRODUCT.md), and gold fails contrast on paper. What replaces them: the primary button is green-800 with a white label on paper. On dark, the primary button is filled on-dark `#f4f1ea` with a green-950 label, or is a ghost with a gold-300 hairline. WhatsApp is the only colour-filled CTA. The metallic gradient survives **only inside the logo SVG artwork** and as the 1–2 px letterhead ribbon on the footer sweep. The footer wordmark is solid gold-300 on green, with no gradient text.

### 2.2 Motifs (from the logo and letterhead geometry, brand.md §2)
- **Orbit ring**: an open circle with gaps at 12 o'clock (23°) and 1 o'clock (21°). The stroke tapers from 2.2 % of the diameter to 0, and the colour runs gold from 9 to 12:30 and green from 1:30 to 7:30. As a 1.5 px hairline with `pathLength=360` and `stroke-dasharray="44 21 272 23"`, it serves as section divider, icon ring and preloader stroke.
- **Swoosh → aircraft**: one per composition. Uses: a scroll-progress hairline (DrawSVG plus MotionPath plane) and the preloader stroke.
- **Dome arch**: image mask `border-radius:50% 50% 0 0/36% 36% 0 0`, with a 1 px gold-hairline outline offset 6 px. Uses: Sanctuaries cards and the leader photo.
- **Kaaba cube**: favicon SVG on a paper plate. Repoint `scripts/generate-icons.js` to the `newlogo.png` crops (`extract {left:1500, top:1420, width:1160, height:1090}`). `theme-color` becomes `#004828`.
- **Letterhead sweep + champagne ribbon**: the footer top edge and the PageHeader corner device.
- **Watermark**: the full mark at 5–7 % (11–12 % on the letterhead), bottom-right, never behind body text.
- **Lockup ratio**: wordmark cap 1 : INTERNATIONAL 0.52 : TRAVEL & TOURS 0.37, tracking 0.45 em / 0.35 em, gold rules 3.8× cap.

### 2.3 Type (DECISION: gap-4's measured stack)
| Role | Face | Bytes |
|---|---|---|
| Wordmark "KARWAN ᴇ USMANIA" | Cinzel 500 outlined to inline SVG, `fill:currentColor`, `aria-label` | 3,782 B gzip |
| Display ≥28 px | Cormorant Garamond variable (italic lazy) | 37,640 |
| Body, UI, eyebrows, numerals (`tnum`) | Manrope variable | 24,836 |
| Arabic (tagline, duas, ﷺ ﷻ) | IBM Plex Sans Arabic 500, pyftsubset core | 23,320 |
| Urdu (قافلہ شوق, pillars) | Noto Nastaliq Urdu 400, instanced + subset, lazy, `line-height:2.1` | 114,480 |

Why these: **Playfair** is the current template's face and craftbar lists it as "cheap copy". **Inter** is twice Manrope's size and gives no rebrand signal. **Montserrat** (the ui-ux-pro-max output) is the navy-gold template default and was rejected by brand.md. **Amiri and Noto Naskh** are contrasted Naskh forms, while the letterhead Arabic is a low-contrast modern sans; Amiri also costs 108 KB per weight. **Fustat** is missing ﷺ and ﷻ, which `data.js` uses. **Gulzar** is a valid look but costs 201 KB against 114 KB; it stays as an owner option. **brand.md's lockup CSS has a bug.** Every Cinzel lowercase letter is a small cap (ratio 0.857, verified), so the DOM text must be `KARWAN e USMANIA`, or better, the SVG. Use `:lang(ar)` and `:lang(ur)` to select two separately named families, because `unicode-range` cannot separate the two scripts. Set the nav's inline `بک کریں` in the Arabic face so Nastaliq never loads at first paint. Gate the preloader on `document.fonts.load()` for three named faces, not on bare `document.fonts.ready`.

---

## 3. What the owner loves in Rialto and Edolus, translated

**Rialto** (`ref/rialto-theme.css`; awwwards Nominee):
- Hero: `https://rialto.com.au/wp-content/uploads/2026/04/hero1-1.mp4`, H.264 4K at 29.97 fps, 11.61 s, **1.63 MB, no audio**. It plays muted, inline and looped with `load="visible"`. The headline is never dependent on the video (the fallback is a plain `#141414` slab).
- Fade grammar: `.fade-in` uses `0.75s cubic-bezier(.165,.84,.44,1)` (**easeOutQuart = GSAP `power3.out`**) with travel `min(25%,10rem)`. IntersectionObserver at `threshold .25`, plays once and never reverses. 44 blocks, all block-level.
- Hairlines draw: `clip-path: inset(0 100% 0 0) → 0`, `.6s linear`.
- One accent, used for display, hairlines and outlined buttons. Its 10 px button text is tracked `.185em`.

**Translation:** one muted Haram loop, block fade-ups at 750 ms `power3.out` with travel capped at 32 px, gold hairlines that draw with `scaleX`, and gold as the only accent.

**Edolus** (`ref/edolus-__loading__.js`; awwwards SOTD 4 Oct 2026):
- Black hold `REVEAL_MIN_MS 3000` and fake fill 3500 ms. The logo self-draws per glyph over 1100 ms (easeInOutCubic, 220 ms stagger) on an OffscreenCanvas in a Worker. The odometer runs 200 ms steps with 70 ms holds, and the counter parks at 99.
- Bands `BAND_OPEN_MS 1600`, `cubic-bezier(.65,0,.35,1)`. The logo then FLIPs to the header over 1 s with `cubic-bezier(.25,.1,.25,1)` and swaps in place with no blink. Replay skips the counter through `sessionStorage`.

**Translation:** keep the ceremony and compress it about 2.5× (§7.2). Run it once per session. Drop the scramble text, WebGL and the 3 s hold before the WhatsApp path.

---

## 4. Craft bar, positioning and house rules

**Measured craft bar** (craftbar.md, from shipped CSS):
- Nusuk: paper `#f7f6f0`, ink `#1a1a18`, green `#1b8354` for actions only, bronze `#806b4b`, IBM Plex Sans Arabic. The hero is a still under an 80 % green-950 scrim.
- hajj.nusuk.sa: a 550 px video hero with copy bottom-left.
- Aman: linen `#f3eee7`, ink `#313131`, one serif at about 31 px, 10 px eyebrows tracked 2 px, radius 0, no shadows. The header goes transparent → linen at 4 rem over .35 s.
- No awwwards winner from 2024–2026 is a Hajj/Umrah site, so the category is open. Reverie (`#1E392B` / `#FBF9F3`) and Jägerhof (`#2F4F3E` / `#FAF8F4`) prove that deep green on warm paper is a winning convention.

**Positioning:** *Nusuk's composure and Aman's paper, with one Rialto moment per page and an Edolus handshake on first visit.* Borrow Nusuk's structure (one headline, one sentence, two buttons, numbered steps, FAQ). Never borrow its government signals (DGA stamp, flag strip, "official platform").

**House rules (final)**
1. Only the Home hero is full-viewport video. Inner PageHeaders are stills at ≤60vh.
2. Paper is the ground. Dark surfaces are the hero, the footer and at most one chapter (Qafila on `/packages`). Never two dark sections adjacent.
3. Gold is a hairline: no gold fills taller than 48 px, no gold buttons, no gradient text. Gold text on paper is gold-800.
4. Green is the display voice. Green fills appear only in the scrim, the footer band, the sweep and the primary button.
5. Hierarchy comes from size and tracking. Display weight ≤500, eyebrows 11–12 px tracked .18–.28 em. No tracking on Arabic or Urdu.
6. One motion idea per section. 0 pins on Home (one optional pin, on Sanctuaries). Hover transitions 250–400 ms, image hover scale ≤1.03.
7. Banned eases: `back.*`, `elastic.*`, `bounce`, `--ease-spring`. That includes brand.md's aircraft `back.out(1.4)`, 21st's `elastic.out(1,0.4)` magnetic leave and its `back.out` heading, and the current testimonial `back.out(1.4)`. **DECISION reason:** overshoot reads as playful; the bar is composure.
8. Shadows ≤ `0 4px 24px rgba(0,36,15,.08)`. Card radius ≤8 px, image radius 0. No glass except the nav blur over the hero.
9. Footage etiquette: wide and architectural shots. No women's faces up close. No close-ups of private devotion. No text, logo or CTA over the Kaaba or the Green Dome. Never reverse a crowd clip (tawaf direction is fixed). No audio. No AI or 3D renders of the Haramain.
10. The handshake runs once per session. WhatsApp stays reachable at every moment.

---

## 5. Pattern catalogue (awwwards + 21st.dev, ranked)

All 21st pieces are Tailwind with motion/framer components: **port by hand, never `npx shadcn add`**. Never port components marked `unknown` or `no-license`.

| # | Pattern | Source | Port note |
|---|---|---|---|
| 1 | Scrim + settle video hero with `play().catch(showPoster)` | Tengile https://tengilemalamala.com/ (SOTD Oct 3 2026, 2 s scale 1.1→1, `.4` scrim); Jägerhof https://www.jagerhof.net/en | Spec in §7.3 |
| 2 | Logo preloader → curtain → logo-to-nav FLIP | Edolus; Son Daven https://sondaven.com/en; Depo Luxe https://depoluxe.xyz/; Tandjung Sari https://www.tandjungsarihotel.com/ | GSAP DrawSVG + Flip (both installed). §7.2 |
| 3 | Two-band route curtain | Edolus bands; Hyperiux Block Transition https://21st.dev/@hyperiux/components/block-transition (101 % offset, 51 % halves, `power3.inOut`) | §7.5 |
| 4 | Letterhead sweep band as the video → paper seam | White Desert's mist seam https://white-desert.com/ | SVG plus the `.bg-stage` opacity crossfade, zero pins |
| 5 | Line-mask heading reveal (below the fold only) | Hyperiux Horizontal Feature Reveal https://21st.dev/@hyperiux/components/horizontal-feature-reveal | SplitText `mask:'lines'`. Arabic and Urdu reveal whole-line only |
| 6 | Multi-target WhatsApp CTA (Umrah / Hajj / Qafila) | KUBE https://www.kubehotel-saint-tropez.com/fr; Tandjung `wa.me` | Uses `useWaLink` keys. Add a `qafila` key in `buildMessages` |
| 7 | Letterspaced-caps eyebrow system | Explora https://explorajourneys.com/int/en/explora-journal (.14 em) | Manrope 500, gold-800 on paper / gold-300 on dark |
| 8 | Fullscreen menu, polygon wipe | Hyperiux Immersive Full Screen Nav https://21st.dev/@hyperiux/components/immersive-full-screen-nav | Open in 0.9 s (down from 1.2) `power4.inOut`. Green-950 panel, `inert` on main |
| 9 | Pinned image-wipe Sanctuaries (the one optional pin) | soralabs Scroll Gallery https://21st.dev/@soralabs/components/scroll-gallery (MIT) | Reimplement. `+=150%`, desktop only |
| 10 | Bottom-anchored image curtain | Reverie https://reveriesafaris.com/ (1.5 s mask); Hyperiux Sticky Content Wrapper | T3 tier |
| 11 | Hairline-lattice bento for "Why us" | Shehadeh https://21st.dev/@mohammadshehadeh/components/feature-10 (MIT) | `gap:1px` on gold-hairline |
| 12 | Package card structure | Launch UI https://21st.dev/@mikolajdobrucki/components/pricing (MIT) | Hierarchy from gap-1 §4. VIP gets the dark variant (`tier==='vip'`, not `featured`) |
| 13 | Native accordion | a11ypros https://21st.dev/@a11ypros/components/a11y-accordion/with-default-open | Grid-row 0fr→1fr, 450 ms `power3.out` |
| 14 | Motto marquee | Magic UI https://21st.dev/@dillionverma/components/marquee | CSS keyframes at ≥40 s per cycle. No velocity skew. Static under reduced motion |
| 15 | Billboard footer | Kedhareswer https://21st.dev/@kedhareswer/components/billboard-signup-footer (MIT) | Green band, sticky curtain reveal, solid gold-300 wordmark |
| 16 | Magnetic CTA on pointer:fine only | Shehadeh https://21st.dev/@mohammadshehadeh/components/magnetic-button | `quickTo` 0.45 s `power3.out`, clamp ±12 px, return with power3.out (not elastic) |
| 17 | Hover still-swap in the hero | Jägerhof `home-hero-hover.js` | Optional: hovering "Umrah / Hajj / Qafila" fades a Madinah still in over 0.8 s |

Rejected: custom cursor, scroll-scrubbed video (WebCodecs), whole-site WebGL, auto-spinning marquees, View Transitions as the main transition, Number Flow (adds a dependency).

**Hyperiux licence (verified 2026-10-10).** The full `LICENSE_EFFECTS` text (https://github.com/Hyperiux-Immersion-Labs/hyperiux-components) grants use and modification in unlimited commercial projects with no attribution (§2). It forbids distributing an effect standalone (§3a), forbids publishing it to a public registry or code-sharing site "in a way that exposes the Effect's source on its own" (§3b), and forbids removing the embedded notice (§3d). Two points the 21st summary missed: (1) effects come in **Free and Pro tiers**, and Pro effects need an active subscription, so confirm each of the 5 targeted effects is Free; (2) if the site repo is public on GitHub, keep each ported effect inside app code with its header notice intact, never as a separate reusable file.

---

## 6. Footage shortlist and delivery plan (final picks)

Licences: the Pexels License (https://www.pexels.com/license/) allows commercial use with no attribution, but bans implying endorsement and bans use in a trademark. The Pixabay Content License bans commercial use of any clip with a recognisable trademark.

| Use | Pick | Facts |
|---|---|---|
| **Desktop hero** | **Pexels 35110835** https://www.pexels.com/video/aerial-view-of-kaaba-during-hajj-pilgrimage-35110835/ | 4K at 59.94 fps, 7.54 s, static camera. 0.5x retime gives 15 s of true 30 fps. Measured 1080p 2-pass 2.1 Mbps, 14 s = **3,706,931 B** |
| Mobile hero | 9:16 crop of 35110835 (`crop=1215:2160:1350:0`, shift about 100 px left) → **720×1280, ≤1.0 Mbps, ≤1.5 MB** | Not yet encoded |
| Alternate / Makkah chapter | 35110822 https://www.pexels.com/video/aerial-view-of-kaaba-at-mecca-s-grand-mosque-35110822/ | Sky band in the top 35 %. Compresses about 35 % smaller |
| Night variant | 35743721 https://www.pexels.com/video/nighttime-view-of-grand-mosque-in-mecca-35743721/ | Check the window-reflection ring |
| Madinah | 3687764 https://www.pexels.com/video/people-walking-around-the-prophet-s-mosque-3687764/ (strip audio, first third). Mobile: 35940331 https://www.pexels.com/video/iconic-green-dome-and-minarets-of-medina-mosque-35940331/ (no people, boomerang OK) | |
| Tawaf one-shot | 38255869 https://www.pexels.com/video/pilgrims-performing-tawaf-at-masjid-al-haram-38255869/ | Not a loop |
| Journey | 11737964 https://www.pexels.com/video/view-of-airplane-wing-and-clouds-11737964/ | Livery check required, or crop to clouds only |

**DECISION: hero clip and encode.** Rejected:
- 31208756: the brief's "aerial" label is wrong. It shows women at mid-distance in the foreground and is 228 MB, over Cloudinary's 100 MB upload cap.
- 35155732 for mobile: men's faces in the bottom 15 % at the end, handheld drift.
- 34444589: close-ups of women and of private devotion.
- Pixabay 272914 / 98682: no frames reviewed, plus the trademark clause.

The encode is 30 fps, because a 0.5x retime of 59.94 fps gives true slow motion and dropping to ≤24 fps would discard real frames. The loop is 12–14 s with a 1 s crossfade seam (`xfade`, not yet run). Under 12 s is allowed but not required, because 14 s already fits the measured budget. Always pass `-an`.

**Delivery**
- Pre-encode offline with ffmpeg. The 4K originals exceed Cloudinary Free's 40 MB on-the-fly cap.
- **Host the MP4s on Vercel Pro** as Vite imports (`/assets/hero-1080-[hash].mp4`). They are covered by the existing immutable `/assets/(.*)` header and cost $0 extra up to about 527k views a month on the included 1 TB.
- Cloudinary Free would exhaust its 25 credits at about 13,200 home views a month, and the next plan, Plus, costs $89–99/mo.
- The site sells packages, so the Vercel Hobby terms ("personal or non-commercial use", https://vercel.com/legal/terms §4) already require Pro. If the owner stays on Hobby, host the video on Bunny CDN for about $1–3/mo.
- **Poster:** export the first frame locally at ≥1920 px and upload it to Cloudinary as `keu/hero/poster` at `f_auto,q_auto:eco`. Budgets: ≤160 KB desktop, ≤70 KB mobile.
- **Gates (poster only):** reduced motion; `saveData`; `effectiveType` of 2g or 3g. Mobile additionally plays only after LCP and `load` + `requestIdleCallback`.
- **Fallbacks:** `play().catch(keepPoster)`. Fade the video in over 750 ms `power3.out` after `playing` + `requestVideoFrameCallback`. Pause off-screen and on `visibilitychange`.
- **DECISION: WCAG 2.2.2.** The hero gets a visible pause/play toggle in its corner, because the loop auto-plays motion for more than 5 s. motion.md omitted it. Under reduced motion the toggle becomes a "Play film" button.
- **DECISION: mobile hero.** The candidates were craftbar's poster-only, motion's 35155732 portrait cut, footage's 9:16 crop and awwwards' 540p landscape. The gated 9:16 crop wins. A 16:9 clip on a 360×800 screen wastes 75 % of its decoded width, 35155732 fails etiquette, and gating after LCP costs no Core Web Vitals. Poster-only stays the fallback if the owner prefers zero mobile video data (Q4).

---

## 7. Motion spec summary

### 7.1 Tokens (mirror them in `src/lib/motion.js`)
| Token | GSAP | CSS | Use |
|---|---|---|---|
| ease-quiet | `power3.out` | `cubic-bezier(.165,.84,.44,1)` (Rialto exact) | reveals, hovers, underline |
| ease-reveal | `power4.out` | `cubic-bezier(.23,1,.32,1)` | heading line masks |
| ease-cinema | `expo.out` | `cubic-bezier(.16,1,.3,1)` | image curtains |
| ease-settle | (CustomEase) | `cubic-bezier(.19,1,.22,1)` | hero scale settle |
| ease-band | `power2.inOut` | `cubic-bezier(.65,0,.35,1)` (Edolus) | preloader bands, hairline draw |
| ease-curtain | `expo.inOut` | `cubic-bezier(.87,0,.13,1)` | route bands |
| ease-glide | `power3.inOut` | `cubic-bezier(.76,0,.24,1)` | logo FLIP, Flip chips |

Durations: 120 / 250 / 350 / 500 / 600 / 750 / 900 / 1200 ms. Staggers: 0.08 for lines, words and cards (≤8 children). Letter staggers are never applied to Arabic.

**DECISION: curve naming.** Rialto's `(.165,.84,.44,1)` is easeOutQuart, which is GSAP **`power3.out`** (power1 = Quad, power2 = Cubic, power3 = Quart). motion.md has this right. awwwards' "power4.out" and codebase's "≈ power4/expo" are wrong.

### 7.2 Preloader (DECISION, built on gap-2's LCP experiments)
- **Shows:** first visit per session only (`sessionStorage.keuIntro`). It is inlined in `index.html` so it paints before React. Non-home deep links get the ≤900 ms replay. Internal navigation never shows it.
- **Ground:** green-950 `#00240f` with gold strokes. Not paper, because the bands open onto a dark video and a paper curtain would flash light → dark. Edolus is dark.
- **Draw:** ring 80→1080 ms (DrawSVG, `power2.inOut`), swoosh 300→1100, KU fill wipe 500→1100 (`clip-path inset`), aircraft 1000→1200 (`autoAlpha`, x −6→0, rotate −8→0, `power3.out`; no back ease).
- **Counter:** 12 px Manrope `tnum`, gold-300 at opacity .7, Edolus odometer, parks at 99. Honest: it is fed by the font loads and the logo draw, never on replay, and never on low-end devices. **DECISION reason:** the owner cites Edolus, and the counter is the most recognisable part of it. craftbar's "never a % counter" was about it running on every visit, which the session gate prevents. Preloader text stays under 24 px so it cannot capture LCP.
- **Gate:** `max(minHold 1200, logoDrawn, fontGate)`, hard cap **2200 ms**. Never waits for the video or the poster decode.
- **Reveal:** two bands `yPercent ∓100` over **800 ms `power2.inOut`**, each inner edge with a 1 px gold-500 hairline. **FLIP** `Flip.fit(introLogo, '.nav__logo-img')` over 800 ms `power3.inOut`, starting 200 ms into the bands. Swap on the same pixels, then remove the node.
- **Totals:** typical 2.0 s, worst case 3.0 s. Low-end: no counter, minHold 600, cap 1200. Save-Data and reduced motion: no preloader.
- **Metrics:** marks `keu:intro-start` and `keu:hero-revealed`. Ship gate: p75 hero-revealed ≤3.0 s on mobile.
- **Rejected durations:** motion's 3.0 s / 4 s cap, brand's 3 s draw plus 1.4 s hold, codebase's 3000 ms, and 21st's 1.6 s draw plus 1.8 s hold. Each pushes the WhatsApp path past 3 s. The Edolus two bands win over Jägerhof's clip-path lift because they are the owner's reference.

### 7.3 Hero
- **Layers:** media (overscan `top:-8%; height:116%`) → scrub wrapper → poster/video → scrim → darken layer → content.
- **Settle (DECISION):** after the bands open, one 2000 ms scale 1.06→1 with `cubic-bezier(.19,1,.22,1)`. No 20 s Ken Burns yoyo: the tawaf flow already moves, the etiquette rules ban zoom-punches on worship footage, and a perpetual scale adds GPU work.
- **Scroll:** `start:'top top', end:'bottom top', scrub:0.6`. Media `yPercent 0→+15` (motion.md's physics: a deeper background moves slower; the brief's −15 is reversed on purpose). The darken layer goes from opacity 0 to 0.85. Content gets `yPercent −30` and `autoAlpha→0` by 70 % of the range.
- **Scrim (DECISION):** `linear-gradient(180deg, rgba(0,36,15,.50) 0%, rgba(0,36,15,.15) 40%, rgba(0,36,15,.78) 100%)`, plus a side gradient of `rgba(0,36,15,.45)` behind the copy column. The average at rest is about 35–45 %. Never a flat ≥60 %: Nusuk's 80 % works on a still and turns video into a slab. This sits between awwwards (.35/.55) and craftbar (45–60 % with an 80 % foot).
- **Pin (DECISION): none.** A pin adds 100–150vh of dead scroll before Packages and WhatsApp, fights the iOS address bar, and spends the page's only pin. Rialto does not pin. The 21st (+120 %) and ui-ux-pro-max/craftbar (+150 %) presets are rejected for this hero.
- **Copy layout (DECISION, footage §6.6):**
  - Desktop: copy column in the right 45 %, left-aligned, lower-middle. The Kaaba sits at 30–45 % of frame width.
  - Mobile: bottom stack over the foot gradient, Kaaba in the upper 55 %.
  - Order: eyebrow `KARWAN E USMANIA INTERNATIONAL · SINCE 2005` (Manrope 500, 11 px, .28 em, gold-200) → **H1** "Your Journey to the Holy Land, Our Priority" (Cormorant 500, ≤64 px desktop / 36 px mobile, `lang="en"`) → Arabic line (Plex 500, `lang="ar"`, `line-height 1.3`) → one sentence → WhatsApp + "View packages".
  - The Arabic line follows the H1, as on the letterhead. 21st's Arabic-first eyebrow is rejected because the H1 must lead and be the LCP element.
- **Reveal:** the H1 is painted at opacity 1 under the curtain. After the bands, only the eyebrow, Arabic line, sentence and CTAs animate (T1, staggered 0.08 from G+300 ms). On later route entries the H1 uses a GSAP opacity + y12 fade over 500 ms, which reports LCP at its first frame. No CSS line mask and no CSS opacity transition on the H1 (both break LCP; gap-2 tests L/N).

### 7.4 Reveal tiers (DECISION; all play once, never reverse)
| Tier | Target | Motion |
|---|---|---|
| T0 hairline | gold rules | `scaleX 0→1` (origin flips in RTL), 800 ms `power2.inOut`, `top 90%` |
| T1 | eyebrows, meta, buttons | `autoAlpha 0, y 12`, 500 ms `power3.out` |
| T2 | card grids, FAQ, stats | `y 24`, 600 ms `power3.out`, stagger 0.08, `ScrollTrigger.batch`, `top 85%` |
| Block (Rialto homage) | text + media modules | `y 32`, **750 ms `power3.out`**, `top 80%` |
| Heading | `.section-heading__title` | SplitText lines mask `yPercent 110→0`, 900 ms `power4.out`, stagger 0.08 |
| T3 image | sanctuaries, gallery, CTA | `clipPath inset(100% 0% 0% 0%)→inset(0%)` + inner scale 1.12→1, 1200 ms `expo.out` |

Reason: craftbar's single 750 ms for everything is too slow for small UI pieces. motion's 350 ms T1 loses Rialto's patience, and 21st's 0.7 s `power2.out` is a third curve. The 750 ms `power3.out` stays as the signature block reveal. Hidden states are set only by GSAP, so content stays visible without JS. Counters run 1.6 s `power3.out` with `tnum`.

### 7.5 Route transition (DECISION)
- Two green-950 bands with gold hairlines, reusing the preloader bands. Cover over **600 ms `expo.inOut`**, covered hold 120–400 ms, reveal over **700 ms `expo.inOut`**: about 1.4–1.7 s in total.
- Back/forward: 450 ms each way. Same-page hash: no curtain. Reduced motion: 200 ms opacity crossfade. Save-Data: instant.
- A 32 px static KU mark shows on the closed bands.
- Rejected: brand's circle clip, which would be a second grammar; awwwards' View Transitions, because `<BrowserRouter>` without a data router gives uneven support; codebase's asymmetric 450/650 ms.
- **Mechanics:** the deferred `displayLocation` pattern. `PublicShell` becomes a layout route so the Nav persists, and the curtain sits under the Nav (z 90 vs 100). `useScrollRestoration` keys off the displayed location. Sequence under cover: `lenis.stop()` → `jumpTo` → `ScrollTrigger.refresh()` → `lenis.start()`. Focus moves to `#main-content` with an `aria-live` title. `/admin` is never wrapped.

### 7.6 Nav and micro-interactions
- **Nav (DECISION: craftbar's version):** transparent over the hero. After 80 px it becomes paper `#fcfbf8` at .96 with a 1 px gold-hairline bottom edge, and shrinks 80→64 px through a background layer's `scaleY` over 350 ms `power3.out`. The nav is **not** hidden on fast scroll, so the WhatsApp CTA stays reachable. motion's dark-green `.92` bar is rejected: it would put a dark slab over paper sections, which breaks rule 2.
- **Cards:** lift −4 px over 250 ms `power3.out`. The shadow lives on `::after` and only its opacity animates. The image scales to **1.03** (craftbar cap) over 600 ms.
- **Nav underline:** a 1 px gold-500 `scaleX` over 300 ms. Its origin flips in RTL.
- **FAB:** magnetic on pointer:fine only, no idle pulse.

### 7.7 Reduced-motion / low-end / Save-Data matrix
| Feature | Full | Low-end (≤4 GB / ≤4 cores) | Save-Data / 2g–3g | Reduced motion |
|---|---|---|---|---|
| Preloader | full, ≤2.2 s cap | no counter, cap 1.2 s | none | none |
| Hero video | 1080p / 720×1280 | 720p | poster | poster + "Play film" |
| Settle / scrub | on | darken only | darken only | static scrim |
| T1/T2/Block | on | stagger 0.04 | on | opacity 200 ms, no y |
| Heading masks / T3 | on | block fade 600 ms | block fade 600 ms | visible immediately |
| Hairline draw | on | on | on | static |
| Surface crossfade | scrubbed | scrubbed | scrubbed | hard switch |
| Marquee | 40 s cycle | on | on | static |
| Route transition | bands | crossfade 250/350 | instant | crossfade 200 ms |
| Magnetic / lift | on | lift only | on | colour only |
| Lenis | on | on | on | off |
| Three.js | **retired** | — | — | — |

**DECISION: Three.js retired** on every breakpoint. Running particles over a decoding video doubles GPU cost on the dominant budget Android base. The chunk is 109 KB gz and loads on every route, including `/admin`. It hard-codes navy `#0d1b35` and leaks WebGL contexts under StrictMode. awwwards' and craftbar's "keep it as the one ambient element" was written before the video hero was settled.

---

## 8. Codebase seams, identity drift and risks

**Verified stack:** react 18.3.1, react-router-dom 6.30.3 (`<BrowserRouter>`), vite 5.4.21, **gsap 3.15.0**, **lenis 1.3.23**, three 0.160.0.

**DECISION: plugins.** `node_modules/gsap/` contains `DrawSVGPlugin.js` (header "3.15.0", verified this session), `Flip.js`, `SplitText.js`, `MotionPathPlugin.js`, `MorphSVGPlugin.js` and `CustomEase.js`, all under the no-charge licence since 3.13 (https://gsap.com/blog/3-13/). So use DrawSVG, not codebase's `getTotalLength()` workaround. The BRIEF and awwwards say "GSAP 3.12 / Lenis 1.1" and "Flip is an easy add"; that is stale. Bump `package.json` to `"gsap": "^3.13.0"` and `"lenis": "^1.3.0"`.

**Seams**
- **Replace:** `tokens.css` (keep consumed variable names as aliases for one release), `Hero.jsx` + `useThreeScene.js` → `VideoHero`, `useGsapAnimations.js` → tier registry.
- **Restyle:** Nav, Footer, SectionHeading, all sections, PackageCard. The card also renders in the admin preview at 360 px.
- **New:** `Preloader`, `TransitionRoutes`, `BrandMark` (SVG), `lib/splitText.js` (throws in dev on char splits of `:lang(ar|ur)`), `lib/motion.js`, `lib/motionEnv.js`, `fonts.css`.
- **Keep untouched:** `src/pages/admin/*`, `api/*`, auth, `whatsapp.js` API, the content schema (optional keys may be added; they survive admin whole-object saves), speakable selectors (`.section-heading__title`, `.hero__title`, `.faq-item__q`), ids (`#hero`, `#qafila`, `#faq`, `#packages-preview`, `#main-content`), `data-count`, icon keys.
- **Plumbing first:** Lenis driven by `gsap.ticker` with `lenis.on('scroll', ScrollTrigger.update)` and `lagSmoothing(0)` (R-M1). Call `ScrollTrigger.refresh()` on fonts, `/api/content`, route reveals and gallery loads. `ignoreMobileResize:true`.

**Identity drift (file:line)**
- **Name** "Karwan-e-Usmania": `data.js:10`, `Nav.jsx:39-40`, `Footer.jsx:19-20,70`, `schemas.js:14,60,129,151`, `index.html:8-13,40-41,58`, `generate-seo.js:2,55,87,93`, page heads.
- **Tagline** "Premium Hajj & Umrah from Lahore": `data.js:11`, `Hero.jsx:30`, `Home.jsx:23`, `index.html:8-14`, `schemas.js:15,61`.
- **Address** Mansoorah/Multan Road: `data.js:17,155`, `Contact.jsx:16-17,66` (maps iframe), `index.html:49`.
- **Email** `info@keusmania.com`: `data.js:15,163`.
- **WhatsApp** `923314211935`: `data.js:14,155,163`, `Contact.jsx:16`.
- **Arabic line** `ضیوف` with `lang="ur"`: `Hero.jsx:24`, `ServicesStrip.jsx:11`.
- **Navy** `#0d1b35`: `index.html:6`, `tokens.css:8-44,123-175`, components.css literal rgba at 10 lines plus 15 gold literals, `useThreeScene.js:4-5`.
- **Old logo** `/logo.png` (330 KB, preloaded): `index.html:34,44`, `Nav.jsx:39`, `Footer.jsx:19`, `schemas.js:17`, `generate-icons.js` crop.
- **Fonts:** `index.html:27-32`, `tokens.css:49-52`.
- **Canonical** `https://keusmania.vercel.app`: `index.html`, `useDocumentHead.js:4`, `schemas.js`, `generate-seo.js`.
- **Live DB** (usmania.vercel.app/api/content):
  - `company.name` "Karwan-e-Usmania  Travel's & Tours" and `tagline` "Premium Hajj & Umrah from Paksitan".
  - `company.whatsapp` `+923304211900`.
  - Street typos ("Butt Sweat", no 436-G1); postcode 54600 is unverified.
  - FAQ copy contradicts the packages.
  - Package `price` values are untrustworthy (1, 78498), so display `priceLabel` only and key "per person" off `perPerson`.
  - Package ids contain spaces.
  - Fix by re-saving `/admin/company` after the owner confirms. **Never delete the `site` row**: it holds the real team (7 people), the testimonials and the Qafila edits.
- **Qafila:** an opaque white 1563² PNG. Gold `#f8c347` is ΔE 9.3 from gold-500 and the dome `#0c8544` is ΔE 20.5 from green-800, so use gold-300 neighbours on dark. The Urdu is set in Amiri and should be Nastaliq. It calls `wa('general', …)` and should use a `qafila` key. CTA "Apply via WhatsApp". It lives on `/packages` as the one dark chapter, as an endorsed sub-brand ("A spiritual journey by Karwan e Usmania International").

**DECISION: Arabic spelling.** Set the letterhead form **خدمات ضيف الرحمن** with Arabic yeh U+064A and `lang="ar"`, because the letterhead is the brand truth (BRIEF §2). Replace the Urdu-plural `ضیوف` with `lang="ur"` in both files; it would also pull Nastaliq onto Home. ضيف is singular, though, and the widely used phrase is ضيوف الرحمن, so the owner must confirm the spelling before launch (Q3).

**Top risks**
- **R1 DB override.** Confirmed live, but the stale values differ from what codebase.md predicted.
- **LCP.** The repo today scores mobile LCP 7.1 s: 94 % render delay, about 375 KB of render-blocking Google Fonts, a JS-gated H1, Three.js, and the 330 KB logo. The critical path must fall to ≤380 KB.
- **Hosting.** Vercel Hobby breaches the terms for a commercial site.
- **Arabic splitting.** SplitText on Arabic breaks shaping.
- **StrictMode.** One-shot timers must be idempotent.
- **Hyperiux tier and public-repo terms** (§5).
- **Contact grid.** `Contact.jsx:45` is an unresponsive inline grid.
- **Stale labels.** "Hajj 2025–2027" is out of date for an October 2026 audience.

---

## 9. Open questions for the owner

1. **WhatsApp number:** the letterhead says +92 333 4883578 (`923334883578`), the live DB says `+923304211900`, and the package summaries list the landline +92 42 35136177. Which is the conversion line?
2. **Domain and plan:** this repo deploys to usmania.vercel.app (printed on the letterhead), while keusmania.vercel.app serves an old site. Which domain is canonical? Will you move to Vercel Pro ($20/mo, required for commercial use; it also hosts the video at no extra cost)?
3. **Arabic tagline:** confirm خدمات ضيف الرحمن (letterhead, singular) or خدمات ضيوف الرحمن (plural, the common phrase).
4. **Mobile video:** play the 9:16 hero clip on 4G (about 1.5 MB per first visit), or show the poster only on phones?
5. **Artwork:** approve an SVG trace of the KU mark (blocking for the preloader, favicon and nav). Do you and Pirzada Sahib consent to retracing and retinting the Qafila seal (gold-400, green-500, no white tile)? Is there a leader photo, or should we use the name plate only?
6. **Facts to supply (never invented):** the DTS/IATA/MoRA licence numbers for the trust strip, Johar Town postcode, next Qafila dates, places count and status, whether the current Hajj package label still applies, and the corrected FAQ pricing copy.

---

## 10. OWNER DECISIONS (2026-10-10, binding, supersede the questions above)

- **WhatsApp conversion line: `923334883578` (+92 333 4883578)**, the letterhead mobile. Use it for every wa.me link, the FAB, CTAs, contact page and JSON-LD. The live DB value `+923304211900` and the old `923314211935` are wrong and must be replaced (re-save `/admin/company`).
- **Canonical domain: `https://usmania.vercel.app`** (as printed on the letterhead). Use it for canonical URLs, Open Graph, JSON-LD, sitemap/robots/llms.txt (`index.html`, `src/lib/useDocumentHead.js`, `src/lib/schemas.js`, `scripts/generate-seo.js`). `keusmania.vercel.app` is no longer canonical.
- **Arabic tagline: plural `خدمات ضيوف الرحمن`** (Arabic yeh U+064A and waw: ض ي و ف), set with `lang="ar" dir="rtl"` in the Arabic face (IBM Plex Sans Arabic). This overrides the letterhead's singular ضيف and the §8 DECISION. Do NOT use the Urdu-yeh form `ضیوف` with `lang="ur"` (it pulls Nastaliq onto Home). Fix `src/components/Hero.jsx:24` and `src/components/ServicesStrip.jsx:11` accordingly.
- **Mobile hero: POSTER ONLY.** On viewports < 768 px (and on any touch/coarse-pointer phone in portrait) never request a video; show the mobile poster (≤70 KB) with the scrim and copy. The 9:16 mobile clip is dropped from the build. Desktop/tablet ≥ 768 px keep the gated 1080p/720p loop. The settle (scale 1.06→1) may run on the poster.

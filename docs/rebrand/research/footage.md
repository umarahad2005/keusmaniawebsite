# Makkah / Madinah footage: sourcing and delivery plan

Researcher: footage sweep · Compiled 2026-10-10 · Repo not modified.

## 0. How this was verified (read first)

- **Clip metadata** (title, author, resolution, duration, fps, description, license label) comes from WebFetch of each clip page on 2026-10-10.
- **File facts** (real file URL, bytes, codec, exact duration, whether there is an audio track) come from resolving `https://www.pexels.com/download/video/<id>/` (302 to `videos.pexels.com/video-files/...`) and running `ffprobe` on the remote file. Nothing was downloaded into the repo.
- **Visual review.** I pulled 4-frame contact sheets (t = 0, 1/3, 2/3, end) with ffmpeg for 20 clips and looked at every one. The sheets are in `scratchpad/research/frames/<id>.jpg`. Camera motion, faces and brand logos below are judged from those sheets. I did **not** watch every clip end to end, so treat loop-seam notes as "likely" until someone plays the clip.
- **Test encodes** of the two hero candidates are in `scratchpad/research/frames/test*.mp4`. Real byte sizes are in section 4.
- **Rialto benchmark** (from ffprobe on the live file): `https://rialto.com.au/wp-content/uploads/2026/04/hero1-1.mp4` is H.264, 3840x2160, 29.97 fps, **11.61 s**, **1.12 Mbps**, **1,630,167 bytes (1.63 MB)**, with **no audio stream**. It is delivered through a Vidstack `<media-player>` with `autoplay muted playsinline loop`, `load="visible"`, `poster-load="lazy"` and `aspect-ratio="16/9"`. Its other clips are vid3.mp4 at 966,412 B and vid5.mp4 at 15,082,621 B (the last one is lazy, below the fold). The Rialto hero is far smaller than our 4 MB budget because its scene is low-entropy. Dense pilgrim crowds compress much worse (see section 4).

## 1. Licenses (quoted)

### Pexels License (https://www.pexels.com/license/, fetched 2026-10-10)
- "All photos and videos on Pexels are free to use." "Attribution is not required." "You can modify the photos and videos from Pexels." Ads, banners, marketing and e-commerce are listed as allowed uses, so **commercial website use is allowed and needs no attribution**.
- Not allowed: "Identifiable people may not appear in a bad light or in a way that is offensive." "Don't sell unaltered copies…" "Don't imply endorsement of your product by people or brands on the imagery." "Don't redistribute or sell the photos and videos on other stock photo or wallpaper platforms." "Don't use the photos or videos as part of your trade-mark, design-mark, trade-name, business name or service mark."
- What this means for us: background hero use is fine. **Never put footage inside the logo or lockup.** Avoid clips with readable airline or hotel branding, because that can imply endorsement.

### Pixabay Content License (https://pixabay.com/service/license-summary/)
- "Use Content for free". "Modify or adapt Content into new works". "Use Content without having to attribute the author". So **commercial use is allowed and needs no attribution**.
- Not allowed: "You cannot sell or distribute Content … on a Standalone basis." "You cannot use Content in any immoral or illegal way, especially Content which features recognisable people." "**If Content contains any recognisable trademarks, logos or brands, you cannot use that Content for commercial purposes**". "You cannot use Content in a misleading or deceptive way."
- What this means for us: Pixabay is stricter than Pexels about brands. Wide Makkah shots often show hotel signage (the Abraj Al-Bait / Clock Tower complex hotels and others), so check any Pixabay Makkah skyline clip frame by frame. That is why the picks below are Pexels.

### Other libraries in the brief
- **Mixkit**: the only Mecca result is "3D Islamists crowd walking inside Mecca" (https://mixkit.co/free-stock-video/3d-islamists-crowd-walking-inside-mecca-33927/). It is a 3D animation, not real footage. **Rejected** (it reads as a costume world and does not match the Nusuk / Aman craft bar).
- **Coverr**: the "mecca" search (https://coverr.co/s?q=mecca) returned only generic mosques. One is labelled AI-generated, and none is identifiable as Makkah or Madinah. **Nothing usable.**
- **Videvo**: `videvo.net/search/kaaba/` now returns a **301 to https://www.freepik.com/videos**. Videvo has been folded into Freepik. I did not verify Freepik's free-tier terms for video (the free tier has historically required attribution). **Not used.**
- **Wikimedia Commons**: WebFetch failed with `getaddrinfo ENOTFOUND commons.wikimedia.org` from this environment. **Unverified.** Note that most Commons media is CC BY-SA, which requires attribution and share-alike, so it is a worse fit than Pexels anyway.

## 2. Shortlist (15 clips, all Pexels License unless marked)

Key: **Loop** = how cleanly it can loop. **Etq** = Islamic-etiquette check (faces, women, devotion close-ups). "Static" = locked-off or near-static camera, judged from frames.

| # | Clip | Author | Res · dur · fps · orient · file | Scene (verified from frames) | Loop | Etq |
|---|---|---|---|---|---|---|
| 1 | **Aerial View of Kaaba during Hajj Pilgrimage** · https://www.pexels.com/video/aerial-view-of-kaaba-during-hajj-pilgrimage-35110835/ | Earth Photart | 3840x2160 · 7.54 s · 59.94 · landscape · 42.4 MB, no audio | Elevated upper-floor view of the Kaaba (gold kiswa band crisp at 4K), with the mataf crowd in ihram flowing around it and the white arcade behind. Near-static. Not a drone shot despite the title. | **Excellent.** Static camera with continuous tawaf flow. At 0.5x it becomes a 15 s, 30 fps slow-motion clip. Use a 1 s crossfade seam. | Faces tiny even in a 4K crop. Safe. |
| 2 | **Aerial View of Kaaba at Mecca's Grand Mosque** · https://www.pexels.com/video/aerial-view-of-kaaba-at-mecca-s-grand-mosque-35110822/ | Earth Photart | 3840x2160 · 12.26 s · 59.94 · landscape · 43.4 MB, no audio | Shot from the rooftop through a marble and glass balustrade: Kaaba and crowd in the lower half, minarets, hotels and a pale dusk sky in the top 35%. Static. | **Excellent.** Static, soft light, at 0.5x it gives 24 s. | Faces not resolvable. Safe. The hotels on the skyline show no readable brand in the frames I checked. |
| 3 | **Nighttime View of Grand Mosque in Mecca** · https://www.pexels.com/video/nighttime-view-of-grand-mosque-in-mecca-35743721/ | Mohammad Kheir | 1920x1080 · 26.37 s · 30 · landscape · 8.2 MB, no audio | Wide high night view of the Haram: lit minarets and the King Fahd gate block, most of the frame near-black. Static. | **Good** (static). Two problems: shot through glass, with a faint circular **window reflection** visible when brightened, and low-light noise. | Safe (architectural). |
| 4 | **Pilgrims Gather for Tawaf at Kaaba in Mecca** · https://www.pexels.com/video/pilgrims-gather-for-tawaf-at-kaaba-in-mecca-31208756/ | Yusuf Khan Afridi | 3840x2160 · 55.97 s · 59.94 · landscape · 228 MB, no audio | **Not aerial** (the brief's label is wrong). Ground-level framing through the old Ottoman colonnade: Kaaba centred, dense crowd in the foreground. Near-static. | Good: long, so there are many seam candidates. | **Caution.** Women and men are visible at mid-distance in the foreground. Crop to the top 60% or skip. |
| 5 | **Aerial View of Pilgrims at the Grand Mosque** · https://www.pexels.com/video/aerial-view-of-pilgrims-at-the-grand-mosque-35110888/ | Earth Photart | 3840x2160 · 6.67 s · 59.94 · landscape · 31.3 MB, no audio | High view down onto the white marble plaza outside the Haram: green canopies, people walking, building facade. Static. | Good. | Safe (tiny figures). Less iconic, so best as B-roll. |
| 6 | **Pilgrims Performing Tawaf at Masjid Al Haram** · https://www.pexels.com/video/pilgrims-performing-tawaf-at-masjid-al-haram-38255869/ | Yusuf Khan Afridi | 3840x2160 · 7.51 s · 59.94 · landscape · 33.3 MB, no audio | Handheld POV walking in tawaf: bare feet on marble, then the backs of men in ihram with the Kaaba ahead. | **Poor** for looping (moving camera, the opening frames are of feet). Better as a one-shot chapter clip. | Mostly backs of men. One woman in black is seen from behind in the first frames. OK. |
| 7 | **Breathtaking View of Kaaba in Mecca** · https://www.pexels.com/video/breathtaking-view-of-kaaba-in-mecca-35155732/ | Earth Photart | 1080x1920 · 13.23 s · 30 · **portrait** · 8.2 MB, no audio | Handheld walk past the Kaaba corner. The camera tilts up to the Clock Tower and minaret, with gold lamps and blue sky. | Fair. Handheld drift, so use a crossfade or boomerang. | Men's heads and partial faces in the bottom 15% at the end. Crop or mask the bottom. |
| 8 | **Nighttime View of Masjid al-Haram Mecca** · https://www.pexels.com/video/nighttime-view-of-masjid-al-haram-mecca-35155756/ | Earth Photart | 1080x1920 · 9.70 s · 30 · portrait · 5.3 MB, no audio | Night: a lit minaret against black sky, hotel towers behind, pilgrims walking in the bottom 25%. Slight handheld. | Fair. | Men's faces at the bottom. Crop the bottom. |
| 9 | **Pilgrims at Night Around Kaaba in Mecca** · https://www.pexels.com/video/pilgrims-at-night-around-kaaba-in-mecca-34444589/ | Aamir Nazir Lone | 2160x3840 · 15.83 s · 30 · portrait · 45.2 MB, no audio | Night, ground level in the mataf: close crowd, raised hands in dua, women's faces visible in close-up. | n/a | **REJECT.** Close-ups of women's faces and private devotion. |
| 10 | **Iconic Green Dome and Minarets of Medina Mosque** · https://www.pexels.com/video/iconic-green-dome-and-minarets-of-medina-mosque-35940331/ | Asad Ansari | 2160x3840 · 8.04 s · 29.97 · **portrait** · 14.7 MB, no audio | Pure architecture: the Green Dome with two minarets with gold crescent finials against clean blue sky. A slow zoom in, then out. **No people.** | **Excellent with boomerang** (forward plus reverse hides the zoom). | Perfect. |
| 11 | **People Walking Around the Prophet's Mosque** · https://www.pexels.com/video/people-walking-around-the-prophet-s-mosque-3687764/ | Md Amir Umar | 1920x1080 · 28.97 s · 29.97 · landscape · 21.3 MB, **has AAC audio (strip)** | Golden-hour wide of Masjid an-Nabawi: Green Dome, minarets and a brass lamp column, with the marble plaza in the foreground. Slow lateral camera move, people walking. | Fair. Moving camera, so use a 1 s crossfade or pick a 10–12 s stretch. | People at mid-distance. One section has a man walking close past the lens. Pick a stretch without him (the first third looked cleanest). |
| 12 | **Masjid Al Nabvi Madinah** (umbrellas) · https://www.pexels.com/video/masjid-al-nabvi-madinah-25913120/ | Aamir Somewhere | 3840x2160 · 5.11 s · 59.94 · landscape · 24.7 MB, no audio | Under the giant umbrellas: the soft-pink canopy fills the top half, carved columns and arches, seated and walking men. Near-static. | Good at 0.5x (10 s), and boomerang-friendly. | Men only, mid-distance. OK. |
| 13 | **Panning Shot of An-Nabawi Grand Mosque** · https://www.pexels.com/video/panning-shot-of-an-nabawi-grand-mosque-5798362/ | Ali Karim | 1920x1080 · 25.22 s · 29.97 · landscape · 18.5 MB, **has audio (strip)** | Night under the lit umbrellas: a wide pan across reflective marble, with people strolling. | Fair (a pan). Use a stretch. | Women in abaya at mid-distance, faces not resolvable. Acceptable. Avoid the close passers-by. |
| 14 | **Mosque in Medina** · https://www.pexels.com/video/mosque-in-medina-11647598/ | Shoot With Riyas | 1920x1080 · 10.73 s · 59.94 · landscape · 8.3 MB, **has audio (strip)** | Midday, almost empty plaza: the Green Dome and white dome, an umbrella folding, a golf cart. Moving camera. | Fair. | Safe (nearly empty). Harsh noon light. |
| 15 | **View of Airplane Wing and Clouds** · https://www.pexels.com/video/view-of-airplane-wing-and-clouds-11737964/ | Pablo May | 1920x1080 · 11.2 s · 60 · landscape · 8.6 MB, **has audio (strip)** | Window view: wing with a red winglet over cumulus and green land. Gentle drift. | Good at 0.5x (22 s). | No people. The red winglet has **no readable text** in the frames I sampled, but the livery may still be recognisable. Low risk under Pexels, but check every frame. |

**Pixabay alternates** (Pixabay Content License. I had no frames for these, so they are visually unverified):
- "Tawaf, Kaaba, Mecca" by One_Nug, https://pixabay.com/videos/tawaf-kaaba-mecca-makkah-islam-272914/ · 1920x1080 · 30 fps · published 2025-04-21 · "Tawaf at Al Haram Mosque Rooftop at Hajj Season 2024." Duration was not listed on the page.
- "The Pilgrim's Guide, Tawaf, Kaaba" by rejisor, https://pixabay.com/videos/the-pilgrims-guide-tawaf-kaaba-98682/ · 3840x2160 · published 2021-11-24 · fps and duration not listed.
- "Madina, saudia, arabia" by muhammadarhamamin77800, https://pixabay.com/videos/madina-saudia-arabia-masjid-198163/ · 1920x1080 · 25 fps · 0:25 per the search grid · tags include Gunbad, Top View, Night.
- "Mecca, Madina, Saudia Arabia" by the same uploader, https://pixabay.com/videos/mecca-madina-saudia-arabia-haram-198048/ · 1920x1080 · 25 fps · 0:30 per the grid.
- "Madinah Outside, medina, umrah" by DesignwithRiyas, https://pixabay.com/videos/madinah-outside-medina-umrah-madina-112360/ · 1920x1080 · 59 fps · 0:11 per the grid.

**Rejected after looking at the frames:**
- Plane-wing clips 30512228, 35079544 and 30570933 show a readable **easyJet** winglet, and are also graded grayscale.
- 6472910 shows **AVIANCA** on the wing.
- 32487761, "Airplane takeoff at sunset", shows **JAL** livery.
- 34444589: see row 9.

All of these break the "don't imply brand endorsement" rule, or the etiquette rule for 34444589.

**Not found:** I found no free clip of **Mina tents** or **Arafat / Jabal al-Rahmah**. The Pexels "arafat" search returns unrelated desert portraits, apart from "Panoramic View of Makkah at Dusk" (34728592, Md Amir Umar, 2160x3840, 17 s, portrait, a hilltop view of the Makkah cityscape at sunset). I also found no free **airport departure hall** clip that looks like Pakistan, or that is free of airline branding. I did not fully search Pexels "airport terminal".

## 3. Recommendations

### Hero loop (desktop, landscape): **#1 Aerial View of Kaaba during Hajj Pilgrimage (35110835)**
- The Kaaba is the subject, the gold band reads at 1080p, and the camera is static, so the loop is invisible. The source is 59.94 fps, so a 0.5x retime gives true 30 fps slow motion (no frame interpolation) over **15 s**, which suits the "slow, cinematic, Aman-quiet" brief. No faces are resolvable.
- **Text-safe area.** The Kaaba sits at about 30–45% of frame width, centre-left. Put the headline block in the **right 45%** or the **bottom-left over a gradient**. The arcade at the top is busy, so add a brand-green scrim (suggestion: `linear-gradient(180deg, rgba(0,24,12,.55) 0%, rgba(0,24,12,.10) 45%, rgba(0,24,12,.70) 100%)`, built from the logo green #003018).
- **Runner-up / alternate: #2 (35110822).** It has a natural **sky band in the top ~35%**, which is the cleanest headline zone of any clip, and dusk light that suits gold. Its foreground glass balustrade is the only drawback. It also compresses about 35% smaller (see section 4).
- **Night variant** (Ramadan or evening theme): #3 (35743721). The dark frame gives maximum text contrast, but check for the window-reflection ring before using it.

### Vertical / mobile pick
- **Primary:** a **9:16 crop of the same hero clip (#1)**, so desktop and mobile tell the same story. Verified: `crop=1215:2160:1350:0` on the 4K source keeps the whole Kaaba with crowd and arcade (frame in `frames/vcrop.jpg`; shift x by about 100 px left of my 1450 test so the right edge breathes). Output 1080x1920.
- **Native vertical alternative:** #10, the Green Dome (35940331). It has no people, the brand-green dome echoes the logo, and it gives a clean boomerang loop. Use it if the mobile hero should open on Madinah, or use it as the mobile Madinah chapter.

### Chapter clips (secondary, lazy-loaded)
1. **Makkah:** #2 (35110822), rooftop dusk view with sky band. Or #3 night if the chapter is dark-themed.
2. **Madinah:** #11 (3687764), golden-hour Green Dome wide in landscape (strip the audio, pick a 10–12 s stretch with no close passer-by). On mobile use #10. The umbrellas detail #12 (25913120) works as a secondary or inset.
3. **Tawaf:** #6 (38255869), the walking-in-ihram POV, as a short one-shot reveal (it ends on the Kaaba ahead). If it must loop, use #5 or #4 cropped to the top 60%.
4. **Journey:** #15 (11737964), wing over clouds at 0.5x. Run the brand check first. If the red winglet is judged recognisable, crop the wing out (frame the clouds only) or grade it to the warm palette.

## 4. Measured encode sizes (my test encodes, H.264 High, 0.5x retime, 30 fps, no audio, faststart)

| Source | Rendition | Settings | Duration | Bytes |
|---|---|---|---|---|
| #1 35110835 | 1080p | CRF 27, preset slow | 14.0 s | 7,395,332 (**too big**) |
| #1 35110835 | 720p | CRF 28 | 14.0 s | 3,659,218 |
| #1 35110835 | **1080p** | **2-pass, `-b:v 2100k -maxrate 2600k -bufsize 4200k`** | 14.0 s | **3,706,931 ✓ under 4 MB** (crowd slightly soft, Kaaba and kiswa crisp: `frames/q2p.jpg`) |
| #2 35110822 | 1080p | CRF 27 | 14.0 s | 4,779,074 |
| #2 35110822 | 720p | CRF 28 | 14.0 s | 2,380,708 |

**Takeaway:** dense white-clad crowds are high-entropy. CRF alone overshoots the budget, so cap the bitrate. **1080p ≈ 2.0–2.2 Mbps** and **720p ≈ 1.0–1.2 Mbps** for a 12–15 s loop gives **about 3.7 MB at 1080p and about 1.8 MB at 720p**. The Rialto hero needs only 1.12 Mbps because its scene is simple. Ours will not get there without visible smearing.

## 5. Delivery plan for our stack

### 5.1 Pre-process offline (ffmpeg). Do not rely on on-the-fly transforms of 40–230 MB 4K originals.
```bash
# Hero: trim, slow to 0.5x (true 30fps from 59.94), scale, no audio, then 1 s crossfade seam
ffmpeg -i 35110835_4k.mp4 -an -filter_complex "\
 [0:v]setpts=2.0*PTS,fps=30,scale=-2:1080:flags=lanczos,format=yuv420p,trim=0:15,setpts=PTS-STARTPTS,split[a][b];\
 [a]trim=1:15,setpts=PTS-STARTPTS[body];[b]trim=0:1,setpts=PTS-STARTPTS[head];\
 [body][head]xfade=transition=fade:duration=1:offset=13[v]" -map "[v]" \
 -c:v libx264 -preset slow -b:v 2100k -maxrate 2600k -bufsize 4200k -profile:v high -movflags +faststart hero-kaaba-1080.mp4
# (run as 2-pass for best size; repeat with scale=-2:720 and -b:v 1100k for the 720p rendition)
# Mobile: crop=1215:2160:1350:0 before scaling, then scale=1080:1920
# Boomerang (Green Dome): [0:v]split[f][r];[r]reverse[rv];[f][rv]concat=n=2:v=1[v]
```
- The `xfade` command above is a sketch. I tested the retime, scale and bitrate settings, but **not this exact seam graph**. Check that the output is 14 s and the seam is invisible.
- Always pass `-an`. Several sources carry AAC tracks (#11, #13, #14, #15). **No audio, ever.**

### 5.2 Cloudinary (cloud `dpmnlysdt`, which `src/lib/images.js` already uses as its fallback)
- Upload the **pre-encoded** loops as video assets under a new folder, e.g. `keu/video/hero-kaaba`, `keu/video/hero-kaaba-v` (vertical), `keu/video/makkah`, `keu/video/madinah`, `keu/video/madinah-v`, `keu/video/tawaf`, `keu/video/journey`.
- Delivery URLs (base `https://res.cloudinary.com/dpmnlysdt/video/upload/`):
  - 1080p: `…/f_auto,q_auto,ac_none,h_1080,c_limit/keu/video/hero-kaaba.mp4`
  - 720p: `…/f_auto,q_auto,ac_none,h_720,c_limit/keu/video/hero-kaaba.mp4`
  - Poster (first frame as JPG): `…/so_0,q_auto,w_1920/keu/video/hero-kaaba.jpg`, plus `w_1080` and `w_750` variants for a srcset or media query. A frame like `so_2.0` may be more representative than frame 0 after a crossfade seam.
  - Notes: `f_auto` lets Cloudinary choose the codec and container per browser (it may serve VP9 or AV1, and is often smaller than our H.264). `q_auto` may re-encode above or below our cap, so **compare the delivered `Content-Length` against the 4 MB budget** and fall back to `q_auto:eco` or `q_auto:low` if needed. `ac_none` strips audio defensively.
- Suggested helper (do not add until implementation): a `src/lib/videos.js` mirroring `cldUrl()` in `src/lib/images.js`, using `/video/upload/` and the transform `f_auto,q_auto,ac_none,h_${h},c_limit`, plus `cldPoster(id, w)` returning `so_0,q_auto,w_${w}` with a `.jpg` extension.

### 5.3 `<HeroVideo>` behaviour (front end)
```html
<div class="hero__media">
  <img class="hero__poster" src="…so_0,q_auto,w_1920/keu/video/hero-kaaba.jpg" alt="" fetchpriority="high">
  <video class="hero__video" muted playsinline loop autoplay preload="metadata"
         poster="…so_0,q_auto,w_1920/keu/video/hero-kaaba.jpg"
         aria-hidden="true" tabindex="-1" disablepictureinpicture disableremoteplayback></video>
</div>
```
- **Pick the source in JS before setting `src`:**
  - Viewport ≥ 1024 px and DPR-adjusted width > 1280 gives 1080p. Otherwise 720p.
  - Portrait (`matchMedia('(orientation: portrait)')` and width < 768) gives the vertical asset.
  - Set `video.src`, then call `video.play().catch(() => keepPoster())`. iOS Low Power Mode blocks even muted autoplay, so the promise rejects and the poster must stay visible.
- **Gates (poster only, never request the video):**
  - `matchMedia('(prefers-reduced-motion: reduce)').matches`
  - `navigator.connection?.saveData === true`
  - `['slow-2g','2g','3g'].includes(navigator.connection?.effectiveType)`. The Network Information API is Chromium-only, so Safari and Firefox fall through to playing, which is acceptable.
  - Optional: `matchMedia('(prefers-reduced-data: reduce)')`. This media query is experimental and **not shipped by default in any browser as far as I know (unverified)**.
- **Fade-in:** keep the `<img>` poster on top until the video's `playing` event, then cross-fade the video in over **750 ms `cubic-bezier(.165,.84,.44,1)`**, which matches Rialto's fade grammar in BRIEF.md section 4.
- **Below-fold chapter clips:** `preload="none"` with no `src` until an `IntersectionObserver` (`rootMargin: '200px 0px'`) fires. Then set `src` and `play()`. **Pause when the clip leaves the viewport** to save battery and CPU, and resume on re-entry. The same reduced-motion and Save-Data gates apply.
- **Do not** scrub `currentTime` from GSAP or Lenis on these clips. It is heavy and stutters on seeks. Animate the overlay or a clip-path around the video instead, and keep the video on plain autoplay.
- The existing Three.js gold-particle dome (`src/hooks/useThreeScene.js`) should not run on top of a playing hero video on mobile. Pick one per breakpoint.
- **LCP:** treat the poster `<img fetchpriority="high">` as the LCP element and preload it (`<link rel="preload" as="image">`). Video frames may or may not be counted as LCP depending on the browser version, so the poster is the safe target.
- **Accessibility:** the video is decorative (`aria-hidden`). If any clip plays longer than 5 s with visible motion, WCAG 2.2.2 expects a pause control. Add a small pause/play toggle in the hero corner. Rialto has a play-button overlay pattern for this.

### 5.4 Budgets
| Asset | Target |
|---|---|
| Hero loop 1080p | ≤ 4 MB (measured 3.71 MB) |
| Hero loop 720p / vertical 1080x1920 | ≤ 2 MB / ≤ 3.5 MB |
| Chapter clips | ≤ 2.5 MB each at 720p, lazy |
| Poster JPGs | ≤ 150 KB at w_1920 with q_auto (not measured) |

## 6. Islamic-etiquette rules for footage
1. **Prefer wide, aerial and architectural shots.** Strong choices are the Kaaba from the upper floors, the Green Dome against sky, umbrellas, minarets, and the plaza from above.
2. **No close-ups of women pilgrims' faces**, and no women as the subject at mid-range. Crop the bottom band where needed (#4, #7, #8). Reject #9.
3. **No close-ups of private devotion** (dua with raised hands, tears, sujood framed on an individual). Pilgrims are not props.
4. Back views of men in ihram walking in tawaf (#6) are generally acceptable and widely used. Avoid exposed-shoulder close-ups as hero material.
5. **No audio**, so no recitation or adhan playing automatically under marketing copy.
6. **No text over the Kaaba itself.** Keep headlines in the sky band or side zones, and never overlay a logo or CTA on the Kaaba or the Green Dome.
7. **No speed ramps, glitches, zoom-punches or reversed footage of worship.** The one exception is a boomerang on **pure architecture** (Green Dome #10), where reversal is imperceptible. Do not boomerang crowds in tawaf, because tawaf direction is fixed (counter-clockwise) and reversing it is visibly wrong. Use crossfade seams for crowd clips.
8. **No airline or hotel branding** visible (licensing, and the brand voice). Do not imply Saudi partner endorsements that do not exist.
9. Do not use 3D or AI-generated renders of the Haramain. They fail the "no costume worlds" and authenticity bar.

## 7. Open items / unverified
- Full playback of each clip was not done. Loop-seam quality is inferred from 4-frame sheets.
- The `xfade` seam command has not been run. The retime, scale and bitrate pipeline has (section 4).
- The Cloudinary `f_auto` codec for each browser, the actual byte size after `q_auto`, and Cloudinary's free-plan limits for video size and on-the-fly transformation were not checked against current docs. Pre-encoding locally avoids depending on them.
- Wikimedia Commons could not be reached (DNS failure). Videvo now redirects to Freepik, and Freepik video terms were not checked.
- Pixabay alternates: no frames reviewed, durations partly unlisted, and hotel trademarks not checked.
- No free Mina, Arafat or airport-departure clip was found.
- Whether the red winglet on #15 is a recognisable livery has not been checked.

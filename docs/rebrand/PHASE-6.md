# Phase 6 — QA, plus owner changes (2026-10-11)

## Owner changes made first

| Request | What was done |
|---|---|
| "Change 25,000+ pilgrims to 5,000+" | Code defaults (`data.js` stat 5000, why-us text), `llms.txt` generator, `content-corrections.md`. **Live database updated** (after a backup to `backups/site-2026-10-11.json`): `stats[1].value` 25000 → 5000 and `whyChooseUs[0].body` → "Since 2008, we have served over 5,000 pilgrims…" (it also still said 2005). Only those two fields were touched |
| Background music | New admin screen **/admin/sound** (upload one track to Cloudinary `keu/sound`, title, credit, volume, on/off; stored as `site.ambience`). Public: a "Sound on/off" button in the nav (`chrome/SoundToggle.jsx`) with animated bars. It never plays on its own (browsers block it, and WCAG 1.4.2 needs a control); after a visitor switches it on, the choice is remembered and resumes on their next tap. Fades in/out, loops, keeps playing across pages, pauses when the tab is hidden or a video review plays. Hidden until a track is uploaded and switched on. Signer/uploader accept `resource=audio` (≤20 MB) |
| Hero film plays by default, no play/pause button | Toggle removed. The film still never loads on phones (owner decision), Save-Data, slow connections or low-end devices, and **not for visitors with "reduce motion" switched on** (they see the still poster) — this keeps the site within WCAG 2.2.2 without a visible pause control |
| WhatsApp logo looked reversed | The shared icon's speech-bubble tail was drawn at the top-right; redrawn with the tail at the bottom-left like WhatsApp's mark. Fixes every WhatsApp button |
| Team digital cards | Clicking a member on About opens their **digital card** (popup, focus-trapped, Esc to close, focus returns). Each member also has a shareable page **/team/&lt;name&gt;** (e.g. `/team/burhan-usmani`) with Person structured data. The card: letterhead band and mark, photo, name, designation, bio, WhatsApp / Call / Email buttons, mobile, email, office line and address, optional LinkedIn/Facebook/Instagram, **Save contact** (vCard for the phone's contacts) and **Share card** (native share or copy link). Admin team editor gained "Digital card details": mobile, WhatsApp, email, bio, social links, optional card address. Waiting for the owner's updated team list and details |

## QA run locally

Local production build served with `vite preview` (no `/api`, so pages use the code defaults). Lighthouse 12.2.1, mobile.

### Performance

| | Before Phase 6 | After |
|---|---|---|
| Home CLS | **0.517** | **0** |
| Home TBT | 970–1,540 ms | 850–1,120 ms (noisy) |
| Packages LCP | 7.5 s | 5.0–5.7 s |
| Initial JS (gzip) | 170 KB | **166 KB** (react 52.8 + app 47.7 + gsap 60.4 + lenis 5.3) |

Fixes: hero picks its layout on the first render (the film→phone jump was the 0.5 shift) and uses `matchMedia` instead of forcing a layout; the chapter picks its mode on the first render; the reveal registry was rewritten around one `IntersectionObserver` with style-only hidden states (no ScrollTrigger per element, no read-after-write thrash, headings split only on arrival, live content arms only new elements); duplicate `ScrollTrigger.refresh()` calls merged into one debounced refresh; Nastaliq (115 KB) is applied only as the Qafila chapter approaches; header images request smaller files on phones; **the admin is code-split** (visitors no longer download it).

**Not yet at the gate (Perf ≥90, LCP ≤2.5 s, TBT ≤200 ms).** The remaining cost is the first full-page layout plus React/GSAP start-up on Lighthouse's simulated slow phone. The local numbers swing by ±300 ms between identical runs (headless Chrome on this machine), so the gate must be measured on the deployed site with PageSpeed Insights. If it is still short there, the next step is pre-rendering the pages at build time (HTML arrives ready, images start loading before JavaScript), which is the main remaining lever.

### Accessibility

| Check | Result |
|---|---|
| axe (serious/critical/moderate) on Home, Packages, About, Gallery, Contact (motion reduced so nothing is caught mid-fade) | **0 violations** on every page |
| Lighthouse accessibility | 95–100. Fixed: the nav "Book" link had no name on phones. The remaining contrast flags were elements caught mid-animation (pass when settled) |
| Background fade zones (no text in the half-faded band) | Home: all 7 fades text-free. Packages: paper→green (Qafila) and back text-free (2 hits are text inside closed "Full package details" panels, on the card's own background) |
| Keyboard: menu, gallery lightbox, video player, team card, form errors | focus trapped, Esc closes, focus returns (checked in Phases 2–4 and for the new card) |

### Capability matrix (`?motion=` overrides)

| Mode | Intro | Hero | Chapter | Madinah loop |
|---|---|---|---|---|
| Full | runs | 1080p film autoplays, no button | pinned | plays in pin |
| Low-end | — | poster | in-flow wipe | poster |
| Save-Data / slow | none | poster | in-flow wipe | poster |
| Reduced motion | none | poster | stacked | poster |

No console errors in any mode. Admin login renders with the green palette.

## Still needs a deployed preview (cannot be done locally)

- PageSpeed Insights / Lighthouse on the real host (the performance gate).
- Google Rich Results test; WhatsApp link preview of the share card.
- Upload a real video review and a background track through the admin, then check playback, the lightbox and the sound button.
- Contact form end-to-end (`/api/contact`).
- Real devices: budget Android in Chrome **and inside WhatsApp's in-app browser**, iPhone SE / 13, Windows 1366, Mac 1440, 1920.
- Screen readers (NVDA, VoiceOver iOS).
- Admin: every editor, unknown keys survive a save, the new sound and team-card fields.

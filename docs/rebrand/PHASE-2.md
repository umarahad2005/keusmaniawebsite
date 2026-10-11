# Phase 2 report: global chrome

Completed 2026-10-10. `npm run build` is green.

## What changed

| File | Change |
|---|---|
| `src/App.jsx` | Admin routes stay outside; every public route renders inside one persistent shell (`PublicApp`), so the nav, footer and smooth scroll survive route changes. Lenis now mounts only for the public site |
| `src/components/motion/TransitionRoutes.jsx` (new) | Deferred display location: cover → swap (flushSync) → scroll reset → refresh → focus `#main-content` + announce the title → reveal. Same-page hash changes skip the curtain; navigations mid-transition are queued |
| `src/components/motion/PageCurtain.jsx` (new) | Two green-950 bands with gold edges, the KU mark and destination caption. Bands 600 / 700 ms; back/forward 450 ms; paper crossfade on low-end (250 / 350) and reduced motion (200 / 200); instant on Save-Data |
| `src/components/motion/BgStage.jsx` (new) | Fixed surface layers; sections opt in with `data-surface`; cross-fade scrubbed over the incoming section's top padding only; hard switch under reduced motion |
| `src/components/chrome/ChromeContext.jsx` (new) | Displayed location, menu state, and `useHeroGone` (when the hero buttons or page header leave the viewport) |
| `src/hooks/useScrollRestoration.js` | Keyed to the displayed location and run as a layout effect, so the jump happens under the curtain |
| `src/components/Nav.jsx` | Rebuilt: film / paper / solid states, mark + outlined one-line wordmark, five links with drawn underlines, `بک کریں · Book` WhatsApp button, 80 → 64 px on scroll, never hides, skip link |
| `src/components/MobileMenu.jsx` (new) | Full-screen green-950 dialog, polygon wipe, numbered Cormorant links, WhatsApp and Call, hours; inert page, focus trap, Esc |
| `src/components/Footer.jsx` | Rebuilt like the letterhead: contact row on paper with green dividers, sweep and ribbon, green band with the gold lockup, Arabic tagline, links, live packages, socials, credit line |
| `src/components/WhatsAppFAB.jsx` | 56 px disc from 768 px up, appears once the hero buttons scroll away, topic list (Umrah, Qafila e Shoq, General), magnetic pull on precise pointers, hidden on Contact and while the menu is open. Greeting bubble removed |
| `src/components/ThumbBar.jsx` (new) | Phones: WhatsApp and Call under the thumb; hides with the menu, on field focus and over the CTA band |
| `src/components/brand/BrandMark.jsx`, `Wordmark.jsx`, `Lockup.jsx` (new) | The traced mark, the outlined wordmark (`currentColor`), and the letterhead lockup |
| `src/lib/hours.js` (new) | Hours rows; adds "Sunday: Closed" only when Sunday is not already listed |
| `src/styles/chrome.css` (new) | Buttons, nav, menu, footer, FAB, thumb bar, curtain, stage, brand |
| `src/styles/admin.css` (new) | Admin styles moved verbatim out of `components.css` |
| `src/styles/components.css` | Old nav, drawer, footer, FAB and greeting styles removed |
| `src/data.js` | WhatsApp `923334883578`; hours Mon–Fri 11–7, Sat 11–5, Sun closed; `landline`; Facebook and Instagram links; Hajj package default removed |
| `index.html` | Structured data: Facebook and Instagram links, opening hours |

## Acceptance checks

| Gate | Result |
|---|---|
| Curtain timings and caption | Implemented as 600 / ≥120 ms hold / 700 ms with the destination caption. Frame-level timing could not be measured: Chrome throttles the automation tab to one frame per second. The bands were seen closed with the caption, then open on the new page |
| FAB usable mid-curtain | z-index 110 over the curtain's 90; pointer events stay on |
| Focus moves and the page is announced | Pass: focus lands on `#main-content`, the live region reads the new title |
| Nav in paper state on inner routes | Pass |
| Menu traps focus | Pass: dialog, inert page, Tab wraps, Esc closes |
| Admin never curtained | Pass: no nav, curtain, FAB or Lenis on `/admin` |
| No console errors | Pass on Home, Packages, About, Gallery, Contact, admin login |

## Known and deferred

- **Hajj filter chip and FAQ.** The Packages page still shows a "Hajj" filter chip and old FAQ text. Phase 4 rebuilds the filters (empty chips hidden) and Phase 5 swaps in the corrected FAQ.
- **The live database still overrides these defaults.** Until the Company and FAQ screens are re-saved (Phase 7), production shows the old WhatsApp number, hours and socials.
- **Phone-width visuals weren't screenshotted.** The window could not be resized in this session. Covered in the Phase 6 device pass.

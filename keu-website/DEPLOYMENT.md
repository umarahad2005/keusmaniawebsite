# Deployment — Karwan-e-Usmania

This site is a multi-page Vite + Vanilla JS app, ready for Vercel.

## 1. Install dependencies (first time)

```powershell
cd D:\personal\projects\keusmaniawebsite\keu-website
npm install
```

Three.js, GSAP, Lenis, Sharp, Vite and Terser are pinned in `package.json`.

## 2. Run locally

```powershell
npm run dev          # http://localhost:5173
```

The first paint shows the 3D hero on capable GPUs and a CSS gradient fallback on Mali-4xx / Adreno 3xx phones (handled in `src/js/scene.js`).

## 3. Production build

```powershell
npm run build        # outputs to dist/
npm run preview      # serve the built bundle
```

Vite produces five entrypoint HTMLs (`index`, `packages`, `about`, `gallery`, `contact`), with Three.js / GSAP / Lenis split into their own chunks (`vite.config.js → manualChunks`). Terser drops `console.*` and `debugger`.

## 4. Deploy to Vercel

```powershell
npm install -g vercel
vercel              # first run links a project
vercel --prod       # ship
```

No `vercel.json` is needed — Vercel auto-detects Vite. Build command: `npm run build`, output dir: `dist`.

After the first deploy, update `agents/project-state.json` with the live URL.

## 5. Bundled assets

These are already in place (sourced from the `umarahad2005/Karwan_e_usmania` reference repo and Vite-served from `public/`):

| Path                                           | What it is                              |
| ---------------------------------------------- | --------------------------------------- |
| `public/logo.png`                              | Brand logo — Kaaba + green dome + plane |
| `public/favicon.svg`                           | Brand favicon (gold-on-navy)            |
| `public/images/makkah/*.jpg`                   | Kaaba, Masjid al-Haram, city skyline    |
| `public/images/madinah/*.jpg`                  | Prophet's Mosque, city, exterior        |
| `public/images/team/*.jpg`                     | Burhan, Muaz, Umar, Usman               |
| `public/patterns/geometric.svg`                | Khatam tessellation pattern             |
| `public/patterns/islamic-pattern.webp`         | Decorative arabesque texture            |

Still optional to add:

| Path                  | What it is                                  |
| --------------------- | ------------------------------------------- |
| `public/og-image.jpg` | Social-share preview (1200×630). The site falls back gracefully if absent. |

Run the optimizer to produce 400/800/1200 WebP variants if you want even faster loads:

```powershell
npm run optimize:images
```

## 6. Real contact details to substitute

Edit `src/data/site.json` and replace the placeholders:

- `company.phone`   →  e.g. `+92-300-1234567`
- `company.whatsapp`→  digits only, e.g. `923001234567`
- `company.email`
- `company.address.*`
- `company.socials[*].url`

Every package-specific WhatsApp message lives in `src/data/packages.json` under `waMessage` per package. Edit there if you want different copy per tier.

## 7. Optional — connect a custom domain

```powershell
vercel domains add keusmania.com
```

Update the `<link rel="canonical">` and `og:url` values in each HTML head, plus the `url` field in the JSON-LD on `index.html`.

## 8. QA checklist (passed at handover)

- [x] Five HTML pages with proper SEO meta + canonical + OG tags
- [x] JSON-LD `TravelAgency` on `index.html`
- [x] Nav transparent → solid on scroll, mobile drawer, ESC + outside-click close
- [x] 3D hero scene with Fibonacci particle dome, glow, ring, starfield, mouse parallax
- [x] Low-end GPU detection → CSS gradient fallback
- [x] `prefers-reduced-motion` honoured everywhere
- [x] GSAP timelines: hero entrance, scroll scatter, section heading, card stagger, services, counters, testimonials, CTA, parallax, footer
- [x] Lenis smooth scroll with ScrollTrigger sync
- [x] WhatsApp CTAs everywhere — pre-filled message per package
- [x] WhatsApp float button with delayed greeting bubble
- [x] Contact form validates name/phone/message → opens WhatsApp
- [x] Gallery lightbox (Esc + backdrop close)
- [x] Package filter chips (All / Umrah / Hajj / Ramadan / Family)
- [x] Tokens-based design system, gold-on-navy palette, Islamic geometric pattern
- [x] Vite multi-page build, Terser minify, manual chunks for three/gsap/lenis
- [x] Image optimizer script using sharp

## 9. Lighthouse expectations

After deploy + real images optimized:

| Category       | Target |
| -------------- | ------ |
| Performance    | 90+    |
| Accessibility  | 95+    |
| Best Practices | 95+    |
| SEO            | 100    |

The biggest single perf risk is hero canvas on low-end Android — already mitigated by GPU detection.

# SKILL: WhatsApp Integration Agent
## Role
You make WhatsApp the primary booking channel with smart pre-filled messages per package.

## Implementation: `src/js/whatsapp.js`

```js
const WA_NUMBER = '923XXXXXXXXX' // Replace with real number

export function initWhatsApp() {
  // Float button pulse animation
  const floatBtn = document.querySelector('.whatsapp-float')
  if (floatBtn) {
    setTimeout(() => floatBtn.classList.add('pulse'), 3000)
  }

  // Smart package CTAs: pre-fill message per package
  document.querySelectorAll('[data-wa-package]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const pkg = btn.getAttribute('data-wa-package')
      const messages = {
        economy: 'Assalamu Alaikum! I am interested in the Economy Umrah package (PKR 185,000). Please share details.',
        premium: 'Assalamu Alaikum! I am interested in the Premium Umrah package (PKR 285,000). Please share details.',
        vip: 'Assalamu Alaikum! I am interested in the VIP Umrah package (PKR 450,000). Please share details.',
        ramadan: 'Assalamu Alaikum! I am interested in the Ramadan Umrah package. Please share 2025 dates and pricing.',
        hajj: 'Assalamu Alaikum! I would like information about Hajj 2025 packages and government quota.',
      }
      const msg = encodeURIComponent(messages[pkg] || 'Assalamu Alaikum! I would like to enquire about your packages.')
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
    })
  })
}
```

## WhatsApp Float CSS
```css
.whatsapp-float {
  position: fixed; bottom: 28px; right: 28px; z-index: 200;
  display: flex; align-items: center; gap: 10px;
  background: #25d366; color: white;
  padding: 14px 20px; border-radius: 999px;
  text-decoration: none; font-weight: 600; font-size: 15px;
  box-shadow: 0 8px 32px rgba(37,211,102,0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}
.whatsapp-float:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 12px 40px rgba(37,211,102,0.5); }
.whatsapp-float.pulse { animation: waPulse 2s ease-in-out 3; }
@keyframes waPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
@media (max-width: 640px) { .wa-label { display: none; } .whatsapp-float { padding: 14px; } }
```

## Output Required
- Complete `src/js/whatsapp.js`
- WhatsApp float button CSS in `components.css`
- Replace all placeholder WA numbers in all HTML files
- Update `agents/project-state.json` → `status.whatsapp = "done"`

---
---

# SKILL: Performance Agent
## Role
Optimize the site for Pakistani users on 4G. Target Lighthouse > 90 all metrics.

## Tasks

### Images
```bash
# Install sharp for image processing
npm install -D sharp
```
Create `scripts/optimize-images.js`:
```js
import sharp from 'sharp'
import { readdirSync } from 'fs'
// Convert all images to WebP, generate 400w/800w/1200w sizes
// Output to public/images/optimized/
```

### Lazy Loading
Add to ALL `<img>` tags:
```html
<img src="..." loading="lazy" decoding="async" alt="...">
```

### Critical CSS
In `<head>` of all pages, inline the above-the-fold critical CSS (nav + hero styles) as `<style>`. Load the rest via `<link rel="stylesheet">`.

### Resource Hints
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://wa.me">
<link rel="preload" href="/logo.png" as="image">
```

### Three.js — Low-End Device Fallback
```js
// In scene.js — detect GPU tier
const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl')
const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info')
const renderer = gl?.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL)
if (renderer?.includes('Mali-4') || renderer?.includes('Adreno 3')) {
  // Low-end: replace with CSS animated gradient background
  document.getElementById('hero-canvas').style.display = 'none'
  document.getElementById('hero').style.background = 'linear-gradient(135deg, #0d1b35 0%, #1a2e5e 50%, #0d1b35 100%)'
}
```

### Vite Build Optimizations
```js
// vite.config.js additions
build: {
  minify: 'terser',
  terserOptions: { compress: { drop_console: true } },
  chunkSizeWarningLimit: 600,
  rollupOptions: {
    output: {
      manualChunks: { three: ['three'], gsap: ['gsap'] }
    }
  }
}
```

## Output Required
- Image optimization script
- All lazy loading added
- Vite config optimized
- Low-end device fallback for Three.js
- Update `agents/project-state.json` → `status.performance = "done"`

---
---

# SKILL: QA Agent
## Role
Final review pass. Check everything before deployment.

## QA Checklist

### Functional
- [ ] Navigation works on all 5 pages
- [ ] Mobile hamburger menu opens/closes
- [ ] All WhatsApp buttons open correct chat with pre-filled message
- [ ] Package filter buttons work (all/hajj/umrah/ramadan)
- [ ] Contact form validates required fields
- [ ] Stats counter animates on scroll
- [ ] GSAP animations fire correctly on all sections
- [ ] Three.js scene loads and animates
- [ ] Smooth scroll (Lenis) works throughout

### Visual
- [ ] Nav goes transparent→navy on scroll
- [ ] Cards have hover lift effect
- [ ] Gold accents consistent throughout
- [ ] Bismillah renders in Arabic font correctly
- [ ] Logo is sharp at all sizes (use SVG or 2x PNG)
- [ ] Geometric pattern SVG visible but subtle (5-10% opacity)

### Responsive
- [ ] Test at 375px (iPhone SE)
- [ ] Test at 768px (tablet)
- [ ] Test at 1440px (desktop)
- [ ] WhatsApp float button doesn't cover content on mobile
- [ ] Hero text readable on mobile
- [ ] Package cards stack to single column on mobile

### Performance
- [ ] Run `npm run build` — no errors
- [ ] Check bundle size: Three.js chunk < 600kb
- [ ] All images have alt text
- [ ] Lighthouse score > 90 (Performance, Accessibility, SEO)

### Fix & Report
For each issue found, fix it directly in the relevant file. Do not just list issues — resolve them.

## Deployment Command
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd keu-website
npm run build
vercel --prod
```

## Output Required
- All QA issues resolved
- `DEPLOYMENT.md` file with live URL and Vercel project name
- Update `agents/project-state.json` → `status.qa = "done"`
- Final summary: "Website is production-ready. All agents complete."

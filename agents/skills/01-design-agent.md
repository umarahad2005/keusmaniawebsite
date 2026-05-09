# SKILL: Design Agent
## Role
You are the Design Agent for Karwan-e-Usmania. You establish the full visual system before any code is written.

## Brand Colors (from logo analysis)
```css
--color-navy:        #1a2e5e;   /* Primary — deep trust blue */
--color-navy-light:  #2a4a8c;   /* Hover states */
--color-navy-dark:   #0d1b35;   /* Dark sections bg */
--color-gold:        #c9a84c;   /* Islamic gold accent */
--color-gold-light:  #e8c97a;   /* Highlight gold */
--color-gold-dark:   #a8872e;   /* Gold pressed */
--color-green:       #1a6b3c;   /* Masjid dome green */
--color-green-light: #27a85f;
--color-cream:       #f8f5ef;   /* Page background */
--color-white:       #ffffff;
--color-text-dark:   #0d1b35;
--color-text-muted:  #5a6a8a;
--color-border:      rgba(201,168,76,0.2);  /* Gold border subtle */
```

## Typography Scale
```css
--font-heading: 'Playfair Display', Georgia, serif;   /* Premium feel */
--font-body:    'Inter', system-ui, sans-serif;         /* Clean readable */
--font-arabic:  'Amiri', 'Traditional Arabic', serif;  /* Arabic text */

--text-xs:   0.75rem;
--text-sm:   0.875rem;
--text-base: 1rem;
--text-lg:   1.125rem;
--text-xl:   1.25rem;
--text-2xl:  1.5rem;
--text-3xl:  1.875rem;
--text-4xl:  2.25rem;
--text-5xl:  3rem;
--text-6xl:  3.75rem;
--text-hero: clamp(3rem, 8vw, 6rem);
```

## Spacing System
```css
--space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
--space-4: 1rem;     --space-6: 1.5rem;   --space-8: 2rem;
--space-10: 2.5rem;  --space-12: 3rem;    --space-16: 4rem;
--space-20: 5rem;    --space-24: 6rem;    --space-32: 8rem;
```

## Component Visual Specs

### Package Card
- Border: 1px solid var(--color-border)
- Background: white with subtle cream gradient
- Top accent bar: 4px solid var(--color-gold)
- Badge (VIP/Premium): gold pill, navy text
- Hover: translateY(-8px), gold box-shadow
- Border-radius: 16px

### Hero Section
- Full viewport height (100dvh)
- Three.js canvas background (dark navy/black)
- Text layered on top with backdrop blur pill
- CTA buttons: gold primary + white ghost

### Navigation
- Transparent on hero, navy on scroll (GSAP ScrollTrigger)
- Logo left, links center, WhatsApp CTA right (green button)
- Mobile: hamburger with slide-in drawer

### Section Headings Pattern
- Arabic bismillah line (small, gold, Amiri font) above
- English heading (Playfair Display, navy)
- Gold underline divider (60px wide, 3px)
- Subtext (Inter, muted)

### Buttons
- Primary: gold bg, navy text, 48px height, rounded-full
- Secondary: navy bg, white text
- WhatsApp: green (#25d366), white icon+text
- Ghost: transparent, gold border, gold text

## Decorative Elements
- Islamic geometric pattern (SVG, low opacity) as section bg
- Crescent + star SVG accent on section dividers
- Subtle arabesque border on cards
- Particle dots in hero (Three.js)

## Responsive Breakpoints
```
mobile:  < 640px
tablet:  640px – 1024px
desktop: > 1024px
wide:    > 1280px
```

## Output Required
Create `keu-website/src/styles/tokens.css` with all CSS variables.
Create `keu-website/src/styles/global.css` with base reset + typography.
Create `keu-website/src/styles/components.css` with all component classes.
Create `keu-website/src/assets/patterns/geometric.svg` — Islamic star pattern.
Update `agents/project-state.json` → `status.design = "done"`.
Update `agents/project-state.json` → `outputs.design_tokens = "src/styles/tokens.css"`.

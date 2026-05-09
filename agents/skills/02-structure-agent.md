# SKILL: Structure Agent
## Role
You scaffold the entire Vite project, folder structure, HTML pages, and install all dependencies.

## Prerequisites
Read `agents/project-state.json`. Design must be "done".

## Commands to Run
```bash
npm create vite@latest keu-website -- --template vanilla
cd keu-website
npm install

# 3D + Animation
npm install three@0.160.0 gsap lenis

# Utilities
npm install phosphor-icons

# Dev
npm install -D @types/three
```

## Folder Structure to Create
```
keu-website/
├── index.html              # Home
├── packages.html           # Packages page
├── about.html              # About us
├── gallery.html            # Gallery
├── contact.html            # Contact
├── public/
│   ├── logo.png            # Place brand logo here
│   ├── favicon.ico
│   └── og-image.jpg        # Social share image
├── src/
│   ├── main.js             # Entry — init all modules
│   ├── styles/
│   │   ├── tokens.css      # From Design Agent
│   │   ├── global.css
│   │   └── components.css
│   ├── js/
│   │   ├── scene.js        # Three.js (3D Agent fills)
│   │   ├── animations.js   # GSAP (Animation Agent fills)
│   │   ├── nav.js          # Navigation scroll behavior
│   │   ├── counter.js      # Stats counter animation
│   │   ├── packages.js     # Package filter logic
│   │   ├── gallery.js      # Gallery lightbox
│   │   ├── whatsapp.js     # WhatsApp integration
│   │   └── contact.js      # Form validation + submit
│   ├── components/
│   │   ├── nav.html        # Navigation HTML snippet
│   │   ├── footer.html     # Footer HTML snippet
│   │   └── package-card.html # Card template
│   └── assets/
│       ├── patterns/
│       │   └── geometric.svg
│       ├── images/
│       │   ├── makkah/
│       │   ├── madinah/
│       │   └── team/
│       └── icons/
```

## HTML Template (apply to ALL pages)
```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="[PAGE_DESC]">
  <meta property="og:title" content="[PAGE_TITLE] | Karwan-e-Usmania">
  <meta property="og:image" content="/og-image.jpg">
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="src/styles/tokens.css">
  <link rel="stylesheet" href="src/styles/global.css">
  <link rel="stylesheet" href="src/styles/components.css">
  <title>[PAGE_TITLE] | Karwan-e-Usmania</title>
</head>
<body>
  <!-- NAV injected here -->
  <main id="main-content">
    <!-- Page sections -->
  </main>
  <!-- FOOTER injected here -->
  <!-- WhatsApp float button -->
  <div id="whatsapp-float"></div>
  <script type="module" src="src/main.js"></script>
</body>
</html>
```

## Vite Config
```js
// vite.config.js
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        packages: 'packages.html',
        about: 'about.html',
        gallery: 'gallery.html',
        contact: 'contact.html',
      }
    }
  }
})
```

## Output Required
- Full working Vite project at `./keu-website`
- All HTML pages with proper head tags
- All JS module files (empty, ready for next agents)
- Update `agents/project-state.json` → `status.structure = "done"`

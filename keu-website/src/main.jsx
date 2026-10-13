import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import './styles/chrome.css'
import './styles/sections.css'
import './styles/home.css'
import './styles/hero-safe.css'   // after home.css: its per-aspect vars override the defaults
import './styles/pages.css'

import App from './App.jsx'

/* Pre-rendered pages (scripts/prerender.mjs) ship static HTML and JSON-LD for
   crawlers that don't run JS. The app renders fresh over the HTML, and its
   JsonLd components add live copies of the blocks, so drop the static ones. */
document.querySelectorAll('script[type="application/ld+json"][data-prerender]').forEach(s => s.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

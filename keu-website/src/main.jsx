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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

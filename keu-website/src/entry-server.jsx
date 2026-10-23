/* Build-time renderer used by scripts/prerender.mjs (built with vite build --ssr).
   Renders one public route to static HTML with the given content snapshot and
   returns what the page's hooks would have put in <head>: the title, meta and
   canonical from useDocumentHead, and every JsonLd block. */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

import App from './App.jsx'
import { startCollect } from './lib/ssr.js'

export function render(url, content) {
  const collected = startCollect()
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App initialContent={content} />
      </StaticRouter>
    </StrictMode>,
  )
  return { html, head: collected.head, ld: collected.ld }
}

/* Every public URL the build writes as static HTML: the five pages, the FAQ,
   the guides (src/data.js GUIDES), the social feed (/updates, rendered with
   the posts handed to primeSocial) and one card page per team member (same
   slugs as the site's own links). */
export { mergeContent } from './lib/SiteContext.jsx'
import { memberSlug } from './lib/team.js'
import { mergeContent as merge } from './lib/SiteContext.jsx'
import { GUIDES } from './data.js'
export { GUIDES }
export { primeSocial } from './lib/social.js'

export function publicRoutes(content) {
  const { site } = merge(content)
  const team = [...new Set((site.team || []).filter(m => m && m.name).map(m => `/team/${memberSlug(m)}`))]
  const guides = GUIDES.map(g => `/guides/${g.slug}`)
  return ['/', '/packages', '/about', '/gallery', '/contact', '/faq', '/guides', ...guides, '/updates', ...team]
}

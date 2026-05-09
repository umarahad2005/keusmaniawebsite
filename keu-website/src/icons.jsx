/* =========================================================
   Karwan-e-Usmania — Icon library (React)
   24×24 viewBox · 1.6 stroke · currentColor.
   Usage: <Icon name="visa" /> or <Icon name="plane" className="..." />
   ========================================================= */

const SVG = (path, opts = {}) =>
  `<svg viewBox="0 0 24 24" fill="${opts.fill ?? 'none'}" stroke="currentColor" stroke-width="${opts.stroke ?? 1.6}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`

export const ICONS = {
  visa: SVG(`
    <rect x="4" y="3" width="16" height="18" rx="2"/>
    <circle cx="12" cy="10" r="2.5"/>
    <path d="M8.5 16c.8-1.6 2-2.5 3.5-2.5s2.7.9 3.5 2.5"/>
    <path d="M15.5 6.5h2"/>
    <circle cx="6.5" cy="6.5" r="0.5" fill="currentColor"/>
  `),
  plane: SVG(`
    <path d="M21 12.5c0-.3-.2-.6-.5-.7l-7-2.5V4a1.5 1.5 0 0 0-3 0v5.3l-7 2.5c-.3.1-.5.4-.5.7v.7c0 .4.4.7.8.6L10.5 12v4l-2 1.2c-.3.2-.5.5-.5.8v.6c0 .4.4.7.8.6L12 18l3.2 1.2c.4.1.8-.2.8-.6v-.6c0-.3-.2-.6-.5-.8L13.5 16v-4l6.7 1.8c.4.1.8-.2.8-.6Z" fill="currentColor" stroke="none"/>
  `),
  hotel: SVG(`
    <path d="M3 21V8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v13"/>
    <path d="M11 21V11a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v10"/>
    <path d="M3 21h18"/>
    <path d="M6 11h2M6 14h2M6 17h2"/>
    <path d="M14 14h4M14 17h4"/>
    <path d="M16 7l1-2 1 2"/>
  `),
  bus: SVG(`
    <rect x="3" y="5" width="18" height="12" rx="2"/>
    <path d="M3 11h18"/>
    <path d="M7 17v2M17 17v2"/>
    <circle cx="7.5" cy="14" r="1" fill="currentColor"/>
    <circle cx="16.5" cy="14" r="1" fill="currentColor"/>
    <path d="M6 8h5M13 8h5"/>
  `),
  guide: SVG(`
    <circle cx="12" cy="7" r="3"/>
    <path d="M5 21c0-3.5 3-6 7-6s7 2.5 7 6"/>
    <path d="M17 4l1.5 1.5L17 7"/>
    <path d="M19 5.5h-3"/>
  `),
  food: SVG(`
    <path d="M5 3v8a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3"/>
    <path d="M7 13v8"/>
    <path d="M14 21V3c-1.7 0-3 1.3-3 3v6c0 1.7 1.3 3 3 3"/>
    <path d="M19 3v18"/>
  `),
  award: SVG(`
    <circle cx="12" cy="9" r="6"/>
    <path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5"/>
    <circle cx="12" cy="9" r="2.5"/>
  `),
  certificate: SVG(`
    <rect x="3" y="4" width="18" height="13" rx="2"/>
    <path d="M8 9h8M8 12h5"/>
    <circle cx="12" cy="18" r="3"/>
    <path d="M10 19.5L9 22l3-1.5L15 22l-1-2.5"/>
  `),
  shield: SVG(`
    <path d="M12 2.5l8 3v6c0 4.5-3.5 8.5-8 10-4.5-1.5-8-5.5-8-10v-6l8-3Z"/>
    <path d="M9 12l2 2 4-4"/>
  `),
  support: SVG(`
    <path d="M12 2a10 10 0 0 1 10 10v3a3 3 0 0 1-3 3h-1v-7h4"/>
    <path d="M2 15v-3A10 10 0 0 1 12 2"/>
    <path d="M2 15a3 3 0 0 0 3 3h1v-7H2"/>
    <path d="M21 18a3 3 0 0 1-3 3h-3"/>
  `),
  calendar: SVG(`
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M3 10h18"/>
    <path d="M8 3v4M16 3v4"/>
  `),
  users: SVG(`
    <circle cx="9" cy="8" r="3.5"/>
    <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/>
    <circle cx="17" cy="9" r="2.5"/>
    <path d="M21.5 17c0-2.5-2-4-4.5-4"/>
  `),
  building: SVG(`
    <rect x="4" y="3" width="16" height="18" rx="1.5"/>
    <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2"/>
    <path d="M10 21v-3h4v3"/>
  `),
  check: SVG(`
    <circle cx="12" cy="12" r="9"/>
    <path d="M8.5 12.5l2.5 2.5 5-5"/>
  `),
  pin: SVG(`
    <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z"/>
    <circle cx="12" cy="9" r="2.5"/>
  `),
  phone: SVG(`
    <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5V18a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z"/>
  `),
  whatsapp: SVG(`
    <path d="M20 12a8 8 0 1 1-3.4-6.5L20 4l-1.5 3.5A8 8 0 0 1 20 12Z"/>
    <path d="M9 9.5c0-.5.4-.9.9-.9h.6l1 2-.7.8a4 4 0 0 0 2.8 2.8l.8-.7 2 1v.6c0 .5-.4.9-.9.9A6 6 0 0 1 9 9.5Z" fill="currentColor" stroke="none"/>
  `),
  mail: SVG(`
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <path d="M3 7l9 6 9-6"/>
  `),
  clock: SVG(`
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3 2"/>
  `),
  facebook: SVG(`
    <path d="M14 8h2V5h-2.5A3.5 3.5 0 0 0 10 8.5V11H8v3h2v7h3v-7h2.5l.5-3H13V9c0-.6.4-1 1-1Z" fill="currentColor" stroke="none"/>
  `),
  instagram: SVG(`
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/>
    <circle cx="12" cy="12" r="3.5"/>
    <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor"/>
  `),
  youtube: SVG(`
    <rect x="2.5" y="6" width="19" height="12" rx="3"/>
    <path d="M10 9.5l5 2.5-5 2.5Z" fill="currentColor"/>
  `),
  tiktok: SVG(`
    <path d="M14 3v9.5a3.5 3.5 0 1 1-3.5-3.5"/>
    <path d="M14 3a4 4 0 0 0 4 4"/>
  `),
  star: SVG(`<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z" fill="currentColor" stroke="none"/>`),
  crescent: SVG(`<path d="M16 3a9 9 0 1 0 5 16.5A7 7 0 0 1 16 3Z" fill="currentColor" stroke="none"/>`),
  kaaba: SVG(`
    <rect x="5" y="9" width="14" height="11" rx="0.5"/>
    <path d="M5 12h14"/>
    <path d="M9 9V7a3 3 0 0 1 6 0v2"/>
    <path d="M5 9l7-4 7 4"/>
  `),
  arrowRight: SVG(`<path d="M5 12h14M13 6l6 6-6 6"/>`),
  menu: SVG(`<path d="M4 6h16M4 12h16M4 18h16"/>`),
  close: SVG(`<path d="M6 6l12 12M18 6L6 18"/>`),
}

export function Icon({ name, className, style }) {
  const html = ICONS[name] || ''
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', width: '100%', height: '100%', ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default Icon

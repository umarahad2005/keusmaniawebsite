/* Brand constants (DESIGN-LANGUAGE §6: the name is always
   "Karwan e Usmania International"). One place for the site URL and the names
   used in titles, structured data and share cards. Hosting is undecided, so
   VITE_SITE_URL can point the canonical elsewhere without code changes. */

export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://usmania.vercel.app').replace(/\/+$/, '')
export const BRAND = 'Karwan e Usmania International'
export const BRAND_FULL = 'Karwan e Usmania International · Travel & Tours'
export const TAGLINE = 'Your Journey to the Holy Land, Our Priority'
export const DESCRIPTION = 'Umrah packages from Lahore, Pakistan, since 2008'
export const LOGO_PATH = '/brand/keui-logo-512.png'

/** Absolute share-card URL for a page key (public/og/<key>.jpg, 1200×630). */
export const ogCard = (key = 'home') => `${SITE_URL}/og/${key}.jpg`

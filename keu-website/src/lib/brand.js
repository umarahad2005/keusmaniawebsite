/* Brand constants (DESIGN-LANGUAGE §6: the name is always
   "Karwan e Usmania International"). One place for the site URL and the names
   used in titles, structured data and share cards. Hosting is undecided, so
   VITE_SITE_URL can point the canonical elsewhere without code changes. */

export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://usmania.vercel.app').replace(/\/+$/, '')
export const BRAND = 'Karwan e Usmania International'
export const BRAND_FULL = 'Karwan e Usmania International · Travel & Tours'
export const TAGLINE = 'Your Journey to the Holy Land, Our Priority'
/* Structured-data description (schemas.js, index.html): who, where, since when
   and what the house does, in one sentence. Facts only from src/data.js. */
export const DESCRIPTION = 'Umrah travel operator in Johar Town, Lahore, serving pilgrims from Pakistan since 2005: Umrah packages with Saudi visa processing, hotels near the Haram in Makkah and Madinah, transport, ziyarah and air tickets.'
/* Other spellings people search for (structured data alternateName). */
export const ALT_NAMES = ['Karwan e Usmania', 'Karwan-e-Usmania', 'Karwan e Usmania International Travel & Tours', 'Karwan E Usmania Travel & Tours', 'Keusmania']
/* What the house knows (structured data knowsAbout): Umrah only. */
export const KNOWS_ABOUT = ['Umrah', 'Umrah packages from Pakistan', 'Saudi Umrah visa processing', 'Hotels in Makkah and Madinah', 'Ziyarah in Makkah and Madinah', 'Air tickets to Saudi Arabia', 'Umrah transport and airport transfers']
export const LOGO_PATH = '/brand/keui-logo-512.png'

/** Absolute share-card URL for a page key (public/og/<key>.jpg, 1200×630). */
export const ogCard = (key = 'home') => `${SITE_URL}/og/${key}.jpg`

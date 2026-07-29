/* Admin credentials, read from the environment on every request.

   Env is the source of truth: edit ADMIN_EMAIL / ADMIN_PASSWORD in Vercel,
   redeploy, and the new pair takes effect immediately. The Admin collection is
   kept in sync behind it so the app still works if the vars are ever removed. */

import crypto from 'node:crypto'

/** Returns { email, password } from env, or null when either var is unset. */
export function envAdmin() {
  /* Trimmed for the same reason the Cloudinary vars are: Vercel stores dashboard
     values verbatim, so a pasted trailing newline would otherwise mean the
     password silently never matches. */
  const email    = (process.env.ADMIN_EMAIL    || '').toLowerCase().trim()
  const password = (process.env.ADMIN_PASSWORD || '').trim()
  if (!email || !password) return null
  return { email, password }
}

/**
 * Short fingerprint of the current credentials, embedded in each token.
 *
 * Without it, rotating the password in Vercel would leave every already-issued
 * session valid — the JWT only proves it was signed, not that the credentials
 * behind it still exist. Changing either var changes this value, so old
 * cookies stop verifying on the next request.
 */
export function credentialVersion() {
  const creds = envAdmin()
  if (!creds) return 'db'   // no env credentials — DB is authoritative, nothing to pin
  return crypto
    .createHash('sha256')
    .update(`${creds.email}:${creds.password}`)
    .digest('hex')
    .slice(0, 16)
}

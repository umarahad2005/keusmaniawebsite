/* Tiny helpers for serverless functions. */

export async function readJSON(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body) } catch { return {} }
  }
  // Fallback: stream body
  const chunks = []
  for await (const c of req) chunks.push(c)
  if (!chunks.length) return {}
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return {} }
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '))
  return res.status(405).json({ error: 'Method Not Allowed' })
}

/* ---------- Public caching ---------- */

/* Anonymous reads are cached at the Vercel CDN for 60 s and served stale for
   up to 10 min while they revalidate (api/content, api/social). */
export const PUBLIC_CACHE = 'public, s-maxage=60, stale-while-revalidate=600'
export const NO_STORE     = 'no-store'

/* True when this read must not be shared: the admin cookie is present, or the
   caller asked for a fresh copy with ?t=. Cookie presence is enough here — the
   body is identical either way; this only decides whether the CDN may keep it. */
export function isPrivateRead(req) {
  if (/(?:^|;\s*)keu_admin=/.test(req.headers.cookie || '')) return true
  const q = req.query || {}
  if (q.t !== undefined) return true
  return /[?&]t=/.test(req.url || '')
}

/* ---------- Rebuild ---------- */

/* Pages are pre-rendered at build time (scripts/prerender.mjs), so a save asks
   Vercel for a fresh build through a Deploy Hook (Vercel → Settings → Git →
   Deploy Hooks; the URL goes in VERCEL_DEPLOY_HOOK_URL). Until it finishes the
   static HTML is a little behind, but visitors' browsers still load the live
   content. Without the variable, or if the call fails, the save still succeeds;
   either way it is logged (Vercel → Logs), so a missing or broken hook shows up
   instead of the live pages silently staying on the last build.
   `what` names the change in the log line ("content saved", "social feed changed"). */
export async function triggerRebuild(what = 'content saved') {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL
  if (!hook) {
    console.warn(`${what}; VERCEL_DEPLOY_HOOK_URL is not set, so the pre-rendered pages wait for the next deploy`)
    return
  }
  try {
    const r = await fetch(hook, { method: 'POST', signal: AbortSignal.timeout(4000) })
    if (!r.ok) console.error(`${what}; deploy hook answered HTTP ${r.status}: ${(await r.text().catch(() => '')).slice(0, 200)}`)
  } catch (err) {
    // The save already succeeded; only the rebuild request failed.
    console.error(`${what}; deploy hook request failed: ${err?.message || err}`)
  }
}

/* ---------- Error handling ---------- */

const DEV = process.env.NODE_ENV !== 'production'

/* Map a thrown error onto a client-safe response. Connection strings, hostnames
   and stack traces stay server-side — the client gets a stable `code` instead. */
function classify(err) {
  const name = err?.name || ''
  const msg  = err?.message || ''

  if (/ is not set$/.test(msg)) {
    return { status: 503, code: 'CONFIG_MISSING', error: 'Server is misconfigured' }
  }
  if (name === 'MongooseServerSelectionError' || name === 'MongoServerSelectionError') {
    return { status: 503, code: 'DB_UNREACHABLE', error: 'Database unavailable — check the Atlas IP access list' }
  }
  if (err?.codeName === 'AuthenticationFailed' || /bad auth/i.test(msg)) {
    return { status: 503, code: 'DB_AUTH_FAILED', error: 'Database rejected the credentials' }
  }
  if (name === 'ValidationError') return { status: 400, code: 'VALIDATION_ERROR', error: 'Invalid input' }
  if (name === 'CastError')       return { status: 400, code: 'BAD_ID',           error: 'Invalid identifier' }

  return { status: 500, code: 'INTERNAL_ERROR', error: 'Internal server error' }
}

/* Wrap a handler so a thrown error becomes a readable JSON body instead of the
   blank 500 that Vercel returns for an unhandled rejection. */
export function withErrors(handler) {
  return async function wrapped(req, res) {
    try {
      return await handler(req, res)
    } catch (err) {
      const { status, code, error } = classify(err)
      console.error(`[api] ${req.method} ${req.url} — ${code}:`, err)
      if (res.headersSent) return
      const body = { error, code }
      if (DEV) body.detail = err?.message
      return res.status(status).json(body)
    }
  }
}

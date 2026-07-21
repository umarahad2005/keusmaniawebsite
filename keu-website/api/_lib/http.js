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

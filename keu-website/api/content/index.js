/* GET /api/content       → returns ALL content keyed by type
   PUT /api/content       → admin-only, body: { type, data }

   Caching: an anonymous GET is cached at the Vercel CDN for 60 s and served
   stale for up to 10 min while it revalidates, so visitors far from the
   function region skip the database round trip. The admin reads with a
   ?t=<timestamp> cache-buster (see SiteContext), and any request carrying the
   admin cookie or that buster is answered no-store, so editors never see a
   cached copy and their responses never fill the shared cache. */
import { connectDB, Content } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'
import { readJSON, methodNotAllowed, withErrors } from '../_lib/http.js'

const PUBLIC_CACHE = 'public, s-maxage=60, stale-while-revalidate=600'
const NO_STORE     = 'no-store'

/* True when this read must not be shared: the admin cookie is present, or the
   caller asked for a fresh copy with ?t=. Cookie presence is enough here — the
   body is identical either way; this only decides whether the CDN may keep it. */
function isPrivateRead(req) {
  if (/(?:^|;\s*)keu_admin=/.test(req.headers.cookie || '')) return true
  const q = req.query || {}
  if (q.t !== undefined) return true
  return /[?&]t=/.test(req.url || '')
}

async function handler(req, res) {
  if (req.method === 'GET') {
    // no-store until the read succeeds, so a 503 from a DB hiccup is never cached.
    res.setHeader('Cache-Control', NO_STORE)
    await connectDB()
    const docs = await Content.find({}).lean()
    const map = {}
    docs.forEach(d => { map[d.type] = d.data })
    if (!isPrivateRead(req)) {
      res.setHeader('Cache-Control', PUBLIC_CACHE)
      res.removeHeader('Set-Cookie')
    }
    return res.status(200).json(map)
  }

  if (req.method === 'PUT') {
    res.setHeader('Cache-Control', NO_STORE)
    if (!requireAdmin(req, res)) return
    const { type, data } = await readJSON(req)
    if (!type || data === undefined) return res.status(400).json({ error: 'type + data required' })
    await connectDB()
    const doc = await Content.findOneAndUpdate(
      { type },
      { type, data },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean()
    return res.status(200).json({ ok: true, content: doc })
  }

  res.setHeader('Cache-Control', NO_STORE)
  return methodNotAllowed(res, ['GET', 'PUT'])
}

export default withErrors(handler)

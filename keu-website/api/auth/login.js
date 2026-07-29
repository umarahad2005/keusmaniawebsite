import bcrypt from 'bcryptjs'
import { connectDB, Admin } from '../_lib/db.js'
import { ensureAdmin } from '../_lib/ensureAdmin.js'
import { envAdmin } from '../_lib/adminCreds.js'
import { signToken, setAuthCookie } from '../_lib/auth.js'
import { readJSON, methodNotAllowed, withErrors } from '../_lib/http.js'

async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  const body = await readJSON(req)
  if (!body?.email || !body?.password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  const email = String(body.email).toLowerCase().trim()
  const password = String(body.password)
  const env = envAdmin()

  /* Env is authoritative when ADMIN_EMAIL + ADMIN_PASSWORD are set.
     The DB is deliberately NOT consulted as a fallback in that case — otherwise
     a password rotated in Vercel would leave the old one working against the
     stale hash still sitting in Mongo. */
  if (env) {
    if (email !== env.email || password !== env.password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Best-effort: keep the Admin row aligned with env so the collection stays
    // usable if the vars are later removed. A DB hiccup must not block login.
    let sub = email
    try {
      const synced = await ensureAdmin()
      if (synced.id) sub = synced.id
    } catch { /* login proceeds on env alone */ }

    const token = signToken({ sub, email, role: 'admin' })
    setAuthCookie(res, token)
    return res.status(200).json({ ok: true, admin: { email, name: 'Karwan Admin' } })
  }

  /* No env credentials configured — fall back to the Admin collection. */
  await connectDB()

  const count = await Admin.estimatedDocumentCount()
  if (count === 0) await ensureAdmin()

  const admin = await Admin.findOne({ email })
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, admin.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  const token = signToken({ sub: admin._id.toString(), email: admin.email, role: 'admin' })
  setAuthCookie(res, token)
  res.status(200).json({ ok: true, admin: { email: admin.email, name: admin.name } })
}

export default withErrors(handler)

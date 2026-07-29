import bcrypt from 'bcryptjs'
import { connectDB, Admin } from '../_lib/db.js'
import { ensureAdmin } from '../_lib/ensureAdmin.js'
import { signToken, setAuthCookie } from '../_lib/auth.js'
import { readJSON, methodNotAllowed, withErrors } from '../_lib/http.js'

async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  const { email, password } = await readJSON(req)
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  await connectDB()

  // Lazy auto-seed: if no admin row exists yet but ADMIN_EMAIL/PASSWORD are set,
  // seed on first login attempt. Idempotent and rate-limited by Mongo's findOne.
  const count = await Admin.estimatedDocumentCount()
  if (count === 0) await ensureAdmin()

  const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() })
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, admin.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  const token = signToken({ sub: admin._id.toString(), email: admin.email, role: 'admin' })
  setAuthCookie(res, token)
  res.status(200).json({ ok: true, admin: { email: admin.email, name: admin.name } })
}

export default withErrors(handler)

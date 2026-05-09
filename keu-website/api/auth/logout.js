import { clearAuthCookie } from '../_lib/auth.js'
import { methodNotAllowed } from '../_lib/http.js'

export default function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  clearAuthCookie(res)
  res.status(200).json({ ok: true })
}

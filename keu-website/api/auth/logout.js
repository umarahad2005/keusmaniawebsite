import { clearAuthCookie } from '../_lib/auth.js'
import { methodNotAllowed, withErrors } from '../_lib/http.js'

function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  clearAuthCookie(res)
  res.status(200).json({ ok: true })
}

export default withErrors(handler)

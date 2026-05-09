import { readToken, verifyToken } from '../_lib/auth.js'
import { methodNotAllowed } from '../_lib/http.js'

export default function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  const payload = verifyToken(readToken(req))
  if (!payload) return res.status(200).json({ admin: null })
  res.status(200).json({ admin: { email: payload.email, role: payload.role } })
}

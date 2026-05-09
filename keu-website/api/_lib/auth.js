/* JWT cookie auth helpers. */
import jwt from 'jsonwebtoken'
import { parse, serialize } from 'cookie'

const COOKIE = 'keu_admin'
const SECRET = process.env.JWT_SECRET
const TTL    = 60 * 60 * 24 * 7 // 7 days

export function signToken(payload) {
  if (!SECRET) throw new Error('JWT_SECRET is not set')
  return jwt.sign(payload, SECRET, { expiresIn: TTL })
}

export function verifyToken(token) {
  if (!SECRET || !token) return null
  try { return jwt.verify(token, SECRET) }
  catch { return null }
}

export function setAuthCookie(res, token) {
  const cookie = serialize(COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TTL,
  })
  res.setHeader('Set-Cookie', cookie)
}

export function clearAuthCookie(res) {
  const cookie = serialize(COOKIE, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  res.setHeader('Set-Cookie', cookie)
}

export function readToken(req) {
  const header = req.headers.cookie || ''
  const cookies = parse(header)
  return cookies[COOKIE] || null
}

/** Middleware-style guard. Returns admin payload on success, sends 401 and returns null otherwise. */
export function requireAdmin(req, res) {
  const tok = readToken(req)
  const payload = verifyToken(tok)
  if (!payload || payload.role !== 'admin') {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }
  return payload
}

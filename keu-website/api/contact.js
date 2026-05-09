/* POST /api/contact — public; saves an inquiry, fires a notification email. */
import { connectDB, Inquiry } from './_lib/db.js'
import { sendInquiryEmail }   from './_lib/email.js'
import { readJSON, methodNotAllowed } from './_lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  const body = await readJSON(req)
  const { name, phone, email, package: pkg, prefer, message } = body || {}

  if (typeof name !== 'string') return res.status(400).json({ error: 'name must be a string' })
  if (typeof phone !== 'string') return res.status(400).json({ error: 'phone must be a string' })
  if (typeof message !== 'string') return res.status(400).json({ error: 'message must be a string' })

  const nameT = name.trim()
  const phoneT = phone.trim()
  const messageT = message.trim()
  if (!nameT || !phoneT || !messageT) {
    return res.status(400).json({ error: 'name, phone and message are required' })
  }

  if (email != null && email !== '' && typeof email !== 'string') {
    return res.status(400).json({ error: 'email must be a string' })
  }
  if (pkg != null && pkg !== '' && typeof pkg !== 'string') {
    return res.status(400).json({ error: 'package must be a string' })
  }
  if (prefer != null && prefer !== '' && typeof prefer !== 'string') {
    return res.status(400).json({ error: 'prefer must be a string' })
  }

  const emailT = typeof email === 'string' && email.trim() ? email.trim() : undefined
  const pkgT = typeof pkg === 'string' && pkg.trim() ? pkg.trim() : undefined
  const preferT = typeof prefer === 'string' && prefer.trim() ? prefer.trim() : 'whatsapp'

  // Bot honeypot — if hidden field is filled, silently accept (so bots don't retry)
  if (body.website) return res.status(200).json({ ok: true })

  // Light rate-limit signal — drop overly long messages
  if (messageT.length > 4000) return res.status(413).json({ error: 'Message too long' })

  await connectDB()

  const ip = (req.headers['x-forwarded-for'] || '').toString().split(',')[0] || req.socket?.remoteAddress
  const inquiry = await Inquiry.create({
    name: nameT,
    phone: phoneT,
    email: emailT,
    package: pkgT,
    prefer: preferT,
    message: messageT,
    ip,
    userAgent: req.headers['user-agent'],
  })

  // Fire notification email — but don't fail the request if SMTP is misconfigured.
  try {
    await sendInquiryEmail(inquiry)
  } catch (e) {
    console.error('[contact] email send failed:', e?.message)
  }

  res.status(200).json({ ok: true, id: inquiry._id })
}

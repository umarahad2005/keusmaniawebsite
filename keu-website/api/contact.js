/* POST /api/contact — public; saves an inquiry, fires a notification email. */
import { connectDB, Inquiry } from './_lib/db.js'
import { sendInquiryEmail }   from './_lib/email.js'
import { readJSON, methodNotAllowed } from './_lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  const body = await readJSON(req)
  const { name, phone, email, package: pkg, prefer, message } = body || {}

  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'name, phone and message are required' })
  }

  // Bot honeypot — if hidden field is filled, silently accept (so bots don't retry)
  if (body.website) return res.status(200).json({ ok: true })

  // Light rate-limit signal — drop overly long messages
  if (message.length > 4000) return res.status(413).json({ error: 'Message too long' })

  await connectDB()

  const ip = (req.headers['x-forwarded-for'] || '').toString().split(',')[0] || req.socket?.remoteAddress
  const inquiry = await Inquiry.create({
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim() || undefined,
    package: pkg?.trim() || undefined,
    prefer: prefer || 'whatsapp',
    message: message.trim(),
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

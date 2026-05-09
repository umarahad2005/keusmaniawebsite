/* Nodemailer transport — SMTP (Brevo / SendGrid / Gmail). */
import nodemailer from 'nodemailer'

let transporter = null

export function getTransport() {
  if (transporter) return transporter
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP_HOST / SMTP_USER / SMTP_PASS are required')
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  return transporter
}

/** Send the contact-form lead notification to MAIL_TO. */
export async function sendInquiryEmail(inquiry) {
  const t = getTransport()
  const from = process.env.MAIL_FROM || `"Karwan-e-Usmania" <${process.env.SMTP_USER}>`
  const to   = process.env.MAIL_TO   || process.env.ADMIN_EMAIL

  const subject = `New ${inquiry.package || 'general'} inquiry — ${inquiry.name}`
  const text = [
    `New inquiry from the Karwan-e-Usmania website.`,
    ``,
    `Name:    ${inquiry.name}`,
    `Phone:   ${inquiry.phone}`,
    inquiry.email ? `Email:   ${inquiry.email}` : null,
    inquiry.package ? `Package: ${inquiry.package}` : null,
    `Prefers: ${inquiry.prefer || 'whatsapp'}`,
    ``,
    `Message:`,
    inquiry.message,
    ``,
    `— sent ${new Date().toISOString()}`,
  ].filter(Boolean).join('\n')

  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;background:#f8f5ef;padding:24px;border-radius:12px;border-top:4px solid #c9a84c">
      <h2 style="font-family:'Playfair Display',Georgia,serif;color:#0d1b35;margin:0 0 12px">
        New inquiry — ${escape(inquiry.name)}
      </h2>
      <p style="color:#5a6a8a;margin:0 0 18px">A new lead just came in from <strong>karwan-e-usmania</strong>.</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;color:#1f2a44">
        <tbody>
          <tr><td style="padding:8px 0;width:120px;color:#5a6a8a">Name</td><td><strong>${escape(inquiry.name)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#5a6a8a">Phone</td><td><a href="tel:${escape(inquiry.phone)}">${escape(inquiry.phone)}</a></td></tr>
          ${inquiry.email ? `<tr><td style="padding:8px 0;color:#5a6a8a">Email</td><td><a href="mailto:${escape(inquiry.email)}">${escape(inquiry.email)}</a></td></tr>` : ''}
          ${inquiry.package ? `<tr><td style="padding:8px 0;color:#5a6a8a">Package</td><td>${escape(inquiry.package)}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#5a6a8a">Prefers</td><td>${escape(inquiry.prefer || 'whatsapp')}</td></tr>
        </tbody>
      </table>
      <div style="margin-top:18px;padding:14px;background:#fff;border-radius:8px;border:1px solid rgba(201,168,76,0.2);white-space:pre-wrap">
        ${escape(inquiry.message)}
      </div>
      <p style="margin-top:18px;font-size:12px;color:#5a6a8a">View this lead in the Karwan dashboard → /admin/inbox</p>
    </div>
  `

  return t.sendMail({ from, to, subject, text, html, replyTo: inquiry.email || undefined })
}

function escape(s = '') {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

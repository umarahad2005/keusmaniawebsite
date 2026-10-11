/* A team member's digital business card (owner request, 2026-10-11), in the
   letterhead grammar: the green band with the mark and the name of the karwan,
   the member's photo, name and designation, a short bio, then one-tap actions
   (WhatsApp, Call, Email), "Save contact" (a vCard for the phone's contacts)
   and Share. Empty fields are simply left out.

   Used in the popup on the About page and on the shareable /team/:slug page. */
import { useState } from 'react'
import { useSite } from '../lib/SiteContext.jsx'
import { waNumber } from '../lib/whatsapp.js'
import { formatPk, telHref } from '../lib/phone.js'
import { memberUrl, downloadVCard } from '../lib/team.js'
import { BRAND } from '../lib/brand.js'
import { Icon } from '../icons.jsx'
import BrandMark from './brand/BrandMark.jsx'
import Img from './Img.jsx'

const initials = (name = '') =>
  String(name).trim().split(/\s+/).filter(w => /^[A-Za-z]/.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('')

const SOCIALS = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'facebook', label: 'Facebook', icon: 'facebook' },
  { key: 'instagram', label: 'Instagram', icon: 'instagram' },
]

export default function TeamDigitalCard({ member: m, headingId, headingRef, level = 'h2' }) {
  const Heading = level
  const { site } = useSite()
  const c = site.company || {}
  const [shared, setShared] = useState('')
  const wa = m.whatsapp || m.phone
  const waHref = wa ? `https://wa.me/${waNumber(wa)}?text=${encodeURIComponent(`Assalamu Alaikum ${m.name.split(' ')[0]}, I found your card on the Karwan e Usmania International website.`)}` : null
  const url = memberUrl(m)

  const share = async () => {
    const data = { title: `${m.name} · ${BRAND}`, text: [m.name, m.role, BRAND].filter(Boolean).join(' · '), url }
    try {
      if (navigator.share) { await navigator.share(data); return }
      await navigator.clipboard.writeText(url)
      setShared('Link copied')
    } catch (e) {
      if (e?.name !== 'AbortError') setShared(url)
    }
    setTimeout(() => setShared(''), 2500)
  }

  return (
    <article className="dcard" aria-labelledby={headingId}>
      <header className="dcard__band">
        <BrandMark variant="reversed" size={40} />
        <span className="dcard__org">
          <span>Karwan e Usmania</span>
          <span className="dcard__org-sub">International · Travel &amp; Tours</span>
        </span>
        <svg className="dcard__ribbon" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40V22C90 40 200 30 260 34S360 24 400 28V40Z" className="dcard__ribbon-paper" />
          <path d="M0 20C90 38 200 28 260 32S360 22 400 26" className="dcard__ribbon-line" vectorEffect="non-scaling-stroke" />
        </svg>
      </header>

      <div className="dcard__body">
        <div className="dcard__photo">
          {m.photo
            ? <Img src={m.photo} alt="" w={320} h={320} crop="fill" gravity="face" decoding="async" />
            : <span className="dcard__initials" aria-hidden="true">{initials(m.name)}</span>}
        </div>
        <Heading className="dcard__name" id={headingId} ref={headingRef} tabIndex={headingRef ? -1 : undefined}>{m.name}</Heading>
        {m.nameAr && <p className="dcard__name-ar" lang="ur" dir="rtl"><span className="ar-face"><bdi>{m.nameAr}</bdi></span></p>}
        {m.role && <p className="dcard__role">{m.role}</p>}
        {m.roleAr && <p className="dcard__role-ar" lang="ar" dir="rtl">{m.roleAr}</p>}
        {m.bio && <p className="dcard__bio">{m.bio}</p>}

        <ul className="dcard__actions" role="list">
          {waHref && (
            <li><a className="k-btn k-btn--wa dcard__btn" href={waHref} target="_blank" rel="noopener"><Icon name="whatsapp" className="k-ico" /> WhatsApp</a></li>
          )}
          {m.phone && (
            <li><a className="k-btn k-btn--ghost dcard__btn" href={telHref(m.phone)}><Icon name="phone" className="k-ico" /> Call</a></li>
          )}
          {m.email && (
            <li><a className="k-btn k-btn--ghost dcard__btn" href={`mailto:${m.email}`}><Icon name="mail" className="k-ico" /> Email</a></li>
          )}
        </ul>

        <dl className="dcard__details">
          {m.phone && <div><dt>Mobile</dt><dd><a href={telHref(m.phone)}>{formatPk(m.phone)}</a></dd></div>}
          {m.email && <div><dt>Email</dt><dd><a href={`mailto:${m.email}`}>{m.email}</a></dd></div>}
          <div><dt>Office</dt><dd><a href={telHref(c.landline || '+924235136177')}>{formatPk(c.landline || '+924235136177')}</a></dd></div>
          {c.address?.street && <div><dt>Address</dt><dd>{c.address.street}, {c.address.city}</dd></div>}
        </dl>

        {SOCIALS.some(s => m[s.key]) && (
          <ul className="dcard__socials" role="list">
            {SOCIALS.filter(s => m[s.key]).map(s => (
              <li key={s.key}><a href={m[s.key]} target="_blank" rel="noopener">{s.icon ? <Icon name={s.icon} className="k-ico" /> : null}{s.label}</a></li>
            ))}
          </ul>
        )}

        <div className="dcard__foot">
          <button type="button" className="k-btn k-btn--primary dcard__btn" onClick={() => downloadVCard(m, c)}>
            <Icon name="users" className="k-ico" /> Save contact
          </button>
          <button type="button" className="k-btn k-btn--ghost dcard__btn" onClick={share}>Share card</button>
        </div>
        <p className="dcard__status" role="status" aria-live="polite">{shared}</p>
      </div>
    </article>
  )
}

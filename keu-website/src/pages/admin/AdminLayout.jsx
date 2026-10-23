/* Admin shell: sidebar navigation and the signed-in outlet. The head is set
   to noindex with a self canonical, so no admin URL ever claims the home page. */
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext.jsx'
import { Icon } from '../../icons.jsx'
import { useDocumentHead } from '../../lib/useDocumentHead.js'
import { SITE_URL } from '../../lib/brand.js'
/* Admin styles live in the lazy admin chunk, not the public CSS. */
import '../../styles/admin.css'

const NAV = [
  { to: '/admin/inbox',        label: 'Inbox',        icon: 'mail'        },
  { to: '/admin/company',      label: 'Company',      icon: 'building'    },
  { to: '/admin/packages',     label: 'Packages',     icon: 'kaaba'       },
  { to: '/admin/testimonials', label: 'Testimonials', icon: 'star'        },
  { to: '/admin/video-reviews', label: 'Video reviews', icon: 'users'      },
  { to: '/admin/sound',        label: 'Background sound', icon: 'support' },
  { to: '/admin/team',         label: 'Team',         icon: 'users'       },
  { to: '/admin/gallery',      label: 'Gallery',      icon: 'building'    },
  { to: '/admin/social',       label: 'Social feed',  icon: 'instagram'   },
  { to: '/admin/sanctuaries',  label: 'Sanctuaries',  icon: 'crescent'    },
  { to: '/admin/why',          label: 'Why Choose Us', icon: 'shield'     },
  { to: '/admin/faqs',         label: 'FAQs',          icon: 'support'    },
]

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth()
  const nav = useNavigate()

  useDocumentHead({ title: 'Karwan Dashboard', canonical: `${SITE_URL}/admin`, noindex: true })

  if (loading) {
    return <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', color: 'var(--color-text-muted)' }}>Loading…</div>
  }
  if (!admin) return <Navigate to="/admin/login" replace />

  const onLogout = async () => {
    await logout()
    nav('/admin/login', { replace: true })
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img src="/brand/keui-logo-512.png" alt="" width="40" height="40" />
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-white)' }}>Karwan</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>Dashboard</div>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => 'admin-sidebar__link' + (isActive ? ' is-active' : '')}
              end={n.to === '/admin'}
            >
              <span className="admin-sidebar__icon"><Icon name={n.icon} /></span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>Signed in as</div>
            <div style={{ color: 'var(--color-white)', fontSize: 'var(--text-sm)' }}>{admin.email}</div>
          </div>
          <button className="btn btn--ghost-light btn--sm btn--full mt-2" onClick={onLogout}>
            Sign out
          </button>
          <a className="muted" href="/" style={{ display: 'block', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
            ← Back to site
          </a>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

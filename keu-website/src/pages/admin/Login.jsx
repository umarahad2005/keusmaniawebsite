/* Admin sign-in. noindex with a self canonical (the path is also disallowed in
   robots.txt and sent with X-Robots-Tag), never the home page's canonical. */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext.jsx'
import { useDocumentHead } from '../../lib/useDocumentHead.js'
import { SITE_URL } from '../../lib/brand.js'
/* Admin styles live in the lazy admin chunk, not the public CSS. */
import '../../styles/admin.css'

export default function AdminLogin() {
  const { login, admin, loading } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useDocumentHead({ title: 'Sign in | Karwan Dashboard', canonical: `${SITE_URL}/admin/login`, noindex: true })

  useEffect(() => {
    if (!loading && admin) nav('/admin', { replace: true })
  }, [admin, loading, nav])

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(email, password)
      nav('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <img src="/brand/keui-logo-512.png" alt="" width="64" height="64" style={{ margin: '0 auto 1rem', display: 'block', borderRadius: '50%', background: 'white', padding: 8 }} />
        <h1 className="admin-login__title">Karwan Dashboard</h1>
        <p className="admin-login__subtitle">Sign in to manage content &amp; inquiries.</p>
        <form onSubmit={onSubmit} className="stack mt-8">
          <div className="field">
            <label className="field__label" htmlFor="login-email">Email</label>
            <input className="field__input" id="login-email" type="email" required autoFocus
                   value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="login-pass">Password</label>
            <input className="field__input" id="login-pass" type="password" required
                   value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="muted" style={{ color: 'var(--color-error)' }}>{error}</p>}
          <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

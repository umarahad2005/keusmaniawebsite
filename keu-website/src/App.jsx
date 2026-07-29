import { Routes, Route, useLocation } from 'react-router-dom'

import Nav         from './components/Nav.jsx'
import Footer      from './components/Footer.jsx'
import WhatsAppFAB from './components/WhatsAppFAB.jsx'

import Home     from './pages/Home.jsx'
import Packages from './pages/Packages.jsx'
import About    from './pages/About.jsx'
import Gallery  from './pages/Gallery.jsx'
import Contact  from './pages/Contact.jsx'

import AdminLogin       from './pages/admin/Login.jsx'
import AdminLayout      from './pages/admin/AdminLayout.jsx'
import AdminInbox       from './pages/admin/Inbox.jsx'
import AdminCompany     from './pages/admin/EditCompany.jsx'
import AdminPackages    from './pages/admin/EditPackages.jsx'
import AdminTestimonials from './pages/admin/EditTestimonials.jsx'
import AdminTeam        from './pages/admin/EditTeam.jsx'
import AdminGallery     from './pages/admin/EditGallery.jsx'
import AdminGeneric     from './pages/admin/EditGeneric.jsx'

import { SiteProvider } from './lib/SiteContext.jsx'
import { AuthProvider } from './lib/AuthContext.jsx'
import { useLenis }     from './hooks/useLenis.js'
import { useScrollRestoration } from './hooks/useScrollRestoration.js'

function PublicShell({ children }) {
  return (
    <>
      <Nav />
      <main id="main-content">{children}</main>
      <Footer />
      <WhatsAppFAB />
    </>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  /* Order matters: useLenis creates window.__lenis, and useScrollRestoration
     reads it. Effects in a component run in declaration order, so the instance
     is always live by the time the scroll reset fires. */
  useLenis(!isAdmin)
  useScrollRestoration()

  return (
    <AuthProvider>
      <SiteProvider>
        <Routes>
          {/* Public site */}
          <Route path="/"         element={<PublicShell><Home /></PublicShell>} />
          <Route path="/packages" element={<PublicShell><Packages /></PublicShell>} />
          <Route path="/about"    element={<PublicShell><About /></PublicShell>} />
          <Route path="/gallery"  element={<PublicShell><Gallery /></PublicShell>} />
          <Route path="/contact"  element={<PublicShell><Contact /></PublicShell>} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin"       element={<AdminLayout />}>
            <Route index               element={<AdminInbox />} />
            <Route path="inbox"        element={<AdminInbox />} />
            <Route path="company"      element={<AdminCompany />} />
            <Route path="packages"     element={<AdminPackages />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="team"         element={<AdminTeam />} />
            <Route path="gallery"      element={<AdminGallery />} />
            <Route path="sanctuaries"  element={<AdminGeneric type="sanctuaries" title="Sanctuaries" />} />
            <Route path="why"          element={<AdminGeneric type="whyChooseUs" title="Why Choose Us" />} />
            <Route path="faqs"         element={<AdminGeneric type="faqs" title="FAQs" />} />
          </Route>

          <Route path="*" element={<PublicShell><Home /></PublicShell>} />
        </Routes>
      </SiteProvider>
    </AuthProvider>
  )
}

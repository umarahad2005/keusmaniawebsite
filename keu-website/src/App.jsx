import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'

import Nav         from './components/Nav.jsx'
import Footer      from './components/Footer.jsx'
import WhatsAppFAB from './components/WhatsAppFAB.jsx'
import ThumbBar    from './components/ThumbBar.jsx'
import BgStage     from './components/motion/BgStage.jsx'
import Preloader   from './components/motion/Preloader.jsx'
import TransitionRoutes from './components/motion/TransitionRoutes.jsx'
import { MenuProvider, useDisplayLocation } from './components/chrome/ChromeContext.jsx'

import Home     from './pages/Home.jsx'
import Packages from './pages/Packages.jsx'
import About    from './pages/About.jsx'
import Gallery  from './pages/Gallery.jsx'
import Contact  from './pages/Contact.jsx'
import TeamMember from './pages/TeamMember.jsx'
import NotFound from './pages/NotFound.jsx'

/* The admin is code-split: visitors never download it, and it never pulls in
   the motion chunks (DESIGN-LANGUAGE Phase 6: "no motion chunks on /admin"). */
const AdminLogin        = lazy(() => import('./pages/admin/Login.jsx'))
const AdminLayout       = lazy(() => import('./pages/admin/AdminLayout.jsx'))
const AdminInbox        = lazy(() => import('./pages/admin/Inbox.jsx'))
const AdminCompany      = lazy(() => import('./pages/admin/EditCompany.jsx'))
const AdminPackages     = lazy(() => import('./pages/admin/EditPackages.jsx'))
const AdminTestimonials = lazy(() => import('./pages/admin/EditTestimonials.jsx'))
const AdminTeam         = lazy(() => import('./pages/admin/EditTeam.jsx'))
const AdminGallery      = lazy(() => import('./pages/admin/EditGallery.jsx'))
const AdminGeneric      = lazy(() => import('./pages/admin/EditGeneric.jsx'))
const AdminVideoReviews = lazy(() => import('./pages/admin/EditVideoReviews.jsx'))
const AdminSound        = lazy(() => import('./pages/admin/EditSound.jsx'))

import { SiteProvider } from './lib/SiteContext.jsx'
import { AuthProvider } from './lib/AuthContext.jsx'
import { useLenis }     from './hooks/useLenis.js'
import { initAnalytics } from './lib/analytics.js'

/* Chrome that follows the page on screen (it lags the URL while the curtain is closed). */
function ShellChrome() {
  const display = useDisplayLocation()
  return (
    <>
      <BgStage routeKey={display?.key} />
      <WhatsAppFAB />
      <ThumbBar />
    </>
  )
}

/* The public site: one persistent shell, so the nav, footer and smooth scroll
   survive route changes and the curtain can cover the swap. The admin never
   mounts this, so it is never curtained and never smooth-scrolled. */
function PublicApp() {
  useLenis(true)
  useEffect(() => { initAnalytics() }, [])

  return (
    <MenuProvider>
      <TransitionRoutes
        shell={(page) => (
          <>
            <Nav />
            <main id="main-content" tabIndex={-1}>{page}</main>
            <Footer />
            <ShellChrome />
            <Preloader />
          </>
        )}
      >
        <Route path="/"         element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/about"    element={<About />} />
        <Route path="/gallery"  element={<Gallery />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/team/:slug" element={<TeamMember />} />
        <Route path="*"         element={<NotFound />} />
      </TransitionRoutes>
    </MenuProvider>
  )
}

/* Auth wraps only the admin screens, so a public pageview never calls
   /api/auth/me. One pathless parent keeps the session across login → /admin. */
function AdminAuth() {
  return <AuthProvider><Outlet /></AuthProvider>
}

export default function App() {
  return (
    <SiteProvider>
      {/* Only the lazy admin screens ever suspend here. */}
      <Suspense fallback={<div className="admin-loading" role="status">Loading…</div>}>
        <Routes>
          <Route element={<AdminAuth />}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin"       element={<AdminLayout />}>
              <Route index               element={<AdminInbox />} />
              <Route path="inbox"        element={<AdminInbox />} />
              <Route path="company"      element={<AdminCompany />} />
              <Route path="packages"     element={<AdminPackages />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="video-reviews" element={<AdminVideoReviews />} />
              <Route path="sound"        element={<AdminSound />} />
              <Route path="team"         element={<AdminTeam />} />
              <Route path="gallery"      element={<AdminGallery />} />
              <Route path="sanctuaries"  element={<AdminGeneric type="sanctuaries" title="Sanctuaries" />} />
              <Route path="why"          element={<AdminGeneric type="whyChooseUs" title="Why Choose Us" />} />
              <Route path="faqs"         element={<AdminGeneric type="faqs" title="FAQs" />} />
            </Route>
          </Route>

          <Route path="*" element={<PublicApp />} />
        </Routes>
      </Suspense>
    </SiteProvider>
  )
}

import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from './CartDrawer'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 })
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
    let raf = 0
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  useEffect(() => {
    const l = (window as unknown as { __lenis?: Lenis }).__lenis
    if (l) l.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="grain">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-gold focus:text-ink focus:px-4 focus:py-2">Skip to content</a>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

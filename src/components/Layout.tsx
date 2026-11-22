import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import Lenis from 'lenis'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from './CartDrawer'

export default function Layout() {
  const { pathname, key } = useLocation()
  const navType = useNavigationType()
  const reduce = useReducedMotion()
  const positions = useRef(new Map<string, number>())
  const keyRef = useRef(key)
  keyRef.current = key

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
    const save = () => positions.current.set(keyRef.current, window.scrollY)
    window.addEventListener('scroll', save, { passive: true })
    return () => window.removeEventListener('scroll', save)
  }, [])

  useEffect(() => {
    // Back/forward restores where you were; new navigations start at the top.
    const y = navType === 'POP' ? positions.current.get(key) ?? 0 : 0
    const l = (window as unknown as { __lenis?: Lenis }).__lenis
    const go = () => { if (l) l.scrollTo(y, { immediate: true }); else window.scrollTo(0, y) }
    go(); const t = setTimeout(go, 120)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className="grain">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-gold focus:text-ink focus:px-4 focus:py-2">Skip to content</a>
      <Header />
      <motion.main id="main" key={pathname} initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><Outlet /></motion.main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

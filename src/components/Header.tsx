import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useTransform } from 'motion/react'
import { useScrollVelocity } from '../lib/useVelocity'
import { useStore } from '../lib/store'
import { EASE } from '../lib/motion'

const links = [
  { to: '/shop', label: 'Collection' },
  { to: '/maison', label: 'Story' },
  { to: '/ateliers', label: 'Pop-ups' },
  { to: '/faq', label: 'Care' },
]

export default function Header() {
  const { count, wish, setDrawer } = useStore()
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { pathname } = useLocation()
  const vel = useScrollVelocity()
  const logoRot = useTransform(vel, [-1, 1], [-20, 20])
  useEffect(() => { setMenu(false) }, [pathname])
  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY
      setSolid(y > 40)
      if (Math.abs(y - last) > 8) { const h = y > last && y > 240; setHidden(h); document.documentElement.style.setProperty('--hdr', h ? '0px' : '72px'); last = y }
    }
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${hidden && !menu ? '-translate-y-full' : 'translate-y-0'} ${solid || menu ? 'bg-ink/80 backdrop-blur-xl border-b border-line' : 'border-b border-transparent'}`}>
      <div className="wrap grid h-[72px] grid-cols-[1fr_auto_1fr] items-center">
        <nav aria-label="Primary" className="hidden md:flex gap-10">
          {links.slice(0, 3).map((l) => <NavItem key={l.to} {...l} />)}
        </nav>
        <button className="md:hidden eyebrow !text-ivory justify-self-start py-4 pr-6" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu((m) => !m)}>
          {menu ? 'Close' : 'Menu'}
        </button>
        <Link to="/" aria-label="Pragmatic Hippy — home" className="flex items-center gap-3" data-cursor="Home"><span className="relative h-11 w-11"><span aria-hidden className="spin-60 absolute inset-[-3px] rounded-full" style={{ background: 'repeating-conic-gradient(rgb(212 166 74 / .5) 0 2deg, transparent 2deg 18deg)', maskImage: 'radial-gradient(circle, transparent 60%, black 62%, black 68%, transparent 70%)' }} /><motion.img src="/brand/logo-dark.webp" alt="" width="44" height="44" className="relative h-11 w-11 object-contain" style={{ rotate: logoRot }} /></span><span className="font-display text-[20px] tracking-[0.2em] uppercase hidden sm:inline">Pragmatic Hippy</span></Link>
        <div className="flex items-center justify-end gap-10">
          <nav aria-label="Secondary" className="hidden md:flex">
            {links.slice(3).map((l) => <NavItem key={l.to} {...l} />)}
          </nav>
          <Link to="/wishlist" className="eyebrow !text-ivory hidden sm:block py-4" aria-label={`Wishlist, ${wish.length} saved`}>Saved{wish.length ? ` (${wish.length})` : ''}</Link>
          <button className="eyebrow !text-ivory py-4 pl-3" onClick={() => setDrawer(true)} aria-label={`Open bag, ${count} items`}>
            Bag <span className="text-gold inline-flex overflow-hidden align-bottom">(<AnimatePresence mode="popLayout" initial={false}><motion.span key={count} className="inline-block" initial={{ y: '-100%', rotateX: 90 }} animate={{ y: 0, rotateX: 0 }} exit={{ y: '100%', opacity: 0 }} transition={{ duration: 0.24, ease: [0.34, 1.56, 0.64, 1] }}>{count}</motion.span></AnimatePresence>)</span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.nav id="mobile-menu" aria-label="Mobile" className="md:hidden overflow-hidden border-t border-line bg-ink"
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <div className="wrap py-8 flex flex-col gap-6">
              {[...links, { to: '/wishlist', label: 'Saved' }].map((l) => (
                <NavLink key={l.to} to={l.to} className="display text-4xl">{l.label}</NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} className={({ isActive }) => `link-u nav-u ${isActive ? 'text-gold' : ''}`}>{label}</NavLink>
  )
}

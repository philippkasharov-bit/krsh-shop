import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../lib/store'
import { EASE } from '../lib/motion'

const links = [
  { to: '/shop', label: 'Collection' },
  { to: '/maison', label: 'Maison' },
  { to: '/ateliers', label: 'Ateliers' },
  { to: '/faq', label: 'Care' },
]

export default function Header() {
  const { count, wish, setDrawer } = useStore()
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setMenu(false) }, [pathname])
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${solid || menu ? 'bg-ink/80 backdrop-blur-xl border-b border-line' : 'border-b border-transparent'}`}>
      <div className="wrap grid h-[72px] grid-cols-[1fr_auto_1fr] items-center">
        <nav aria-label="Primary" className="hidden md:flex gap-10">
          {links.slice(0, 3).map((l) => <NavItem key={l.to} {...l} />)}
        </nav>
        <button className="md:hidden eyebrow !text-ivory justify-self-start" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu((m) => !m)}>
          {menu ? 'Close' : 'Menu'}
        </button>
        <Link to="/" aria-label="KRSH — home" className="font-display text-[28px] tracking-[0.42em] pl-[0.42em]">KRSH</Link>
        <div className="flex items-center justify-end gap-10">
          <nav aria-label="Secondary" className="hidden md:flex">
            {links.slice(3).map((l) => <NavItem key={l.to} {...l} />)}
          </nav>
          <Link to="/wishlist" className="eyebrow !text-ivory hidden sm:block" aria-label={`Wishlist, ${wish.length} saved`}>Saved{wish.length ? ` (${wish.length})` : ''}</Link>
          <button className="eyebrow !text-ivory" onClick={() => setDrawer(true)} aria-label={`Open bag, ${count} items`}>
            Bag <span className="text-gold">({count})</span>
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

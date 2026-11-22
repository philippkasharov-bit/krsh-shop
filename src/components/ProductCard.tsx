import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { money, slugOf, type Product } from '../lib/products'
import { useStore } from '../lib/store'
import { EASE } from '../lib/motion'

export default function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const { wish, toggleWish } = useStore()
  const saved = wish.includes(p.id)
  return (
    <motion.article className="group relative" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }} transition={{ duration: 0.9, ease: EASE, delay: (index % 3) * 0.08 }}>
      <Link to={`/shop/${slugOf(p)}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-ink-2">
          <img src={`/${p.img}`} alt={`${p.name} in ${p.color}`} loading="lazy" width={800} height={800}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover:scale-[1.06]" />
          {p.badge && <span className="absolute left-4 top-4 eyebrow !text-ivory bg-ink px-3 py-1.5">{p.badge === 'new' ? 'New' : 'Limited'}</span>}
          <span className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[var(--ease-lux)] bg-ivory text-ink text-center py-4 text-[11px] tracking-[0.22em] uppercase">
            View details
          </span>
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h3 className="display t-4">{p.name.replace('KRSH ', '')}</h3>
          <span className="font-mono text-sm text-ivory-dim">{money(p.price)}</span>
        </div>
        <p className="eyebrow mt-1">{p.color}</p>
      </Link>
      <button onClick={() => toggleWish(p.id)} aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${p.name} ${saved ? 'from' : 'to'} wishlist`}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center bg-ink transition-colors hover:bg-ink-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? '#c9a96a' : 'none'} stroke={saved ? '#c9a96a' : '#f3eee6'} strokeWidth="1.5" aria-hidden>
          <path d="M12 21s-7-4.6-9.3-9.1C1.1 8.5 3 5 6.4 5c2 0 3.5 1.1 5.6 3.4C14.1 6.1 15.6 5 17.6 5 21 5 22.9 8.5 21.3 11.9 19 16.4 12 21 12 21z" />
        </svg>
      </button>
    </motion.article>
  )
}

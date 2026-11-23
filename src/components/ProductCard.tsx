import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { ACCENT_HEX, edition, lineLabel, money, slugOf, type Product } from '../lib/products'
import { useStore } from '../lib/store'
import { EASE_OUT, EASE_SNAP } from '../lib/motion'
import Wristband from './hud/Wristband'

/** Ticket-stub product card: tilts toward the cursor, accent stripe sweeps on hover, perforated stub (MOTION-SPEC "Ticket card"). */
export default function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const { wish, toggleWish } = useStore()
  const saved = wish.includes(p.id)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const hex = ACCENT_HEX[p.accent]
  const move = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12)
  }
  const reset = () => { rx.set(0); ry.set(0) }
  return (
    <motion.article className="group relative [perspective:1000px]" initial={{ opacity: 0, y: reduce ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }} transition={{ duration: 0.8, ease: EASE_OUT, delay: (index % 4) * 0.08 }}
      layout exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.24 } }}>
      <Link to={`/shop/${slugOf(p)}`} className="block" data-cursor="Open">
        <motion.div ref={ref} onPointerMove={move} onPointerLeave={reset} style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
          className="relative border border-line bg-ink-2">
          <div className="relative aspect-square overflow-hidden">
            <img src={`/${p.img}`} alt={`${p.name}, ${p.color}`} loading="lazy" width={800} height={800}
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-[1.05]" />
            <span aria-hidden className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 opacity-0 transition-all duration-[480ms] ease-[var(--ease-out)] group-hover:left-[110%] group-hover:opacity-30"
              style={{ background: `linear-gradient(90deg, transparent, ${hex}, transparent)` }} />
            <span className="absolute left-3 top-3"><Wristband color={hex}>{lineLabel[p.line]}{p.badge ? ` · ${p.badge === 'new' ? 'New' : 'Limited'}` : ''}</Wristband></span>
          </div>
          {/* perforated stub */}
          <div aria-hidden className="relative h-0 border-t border-dashed border-ivory/20">
            <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-ink" />
            <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-ink" />
          </div>
          <div className="flex items-baseline justify-between gap-4 px-4 pt-4 pb-1 transition-transform duration-300 group-hover:translate-x-0.5">
            <h3 className="display t-4">{p.name}</h3>
            <span className="relative h-5 overflow-hidden font-mono text-sm">
              <span className="block text-ivory-dim transition-transform duration-300 group-hover:-translate-y-full">{money(p.price)}</span>
              <span className="block text-gold transition-transform duration-300 group-hover:-translate-y-full">{money(p.price)}</span>
            </span>
          </div>
          <p className="eyebrow flex justify-between gap-4 px-4 pb-4"><span>{p.color}</span><span className="text-gold">{edition(p) ?? p.sku}</span></p>
        </motion.div>
      </Link>
      <button onClick={() => toggleWish(p.id)} aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${p.name} ${saved ? 'from' : 'to'} wishlist`}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center bg-black/70 transition-colors hover:bg-ink-3" data-cursor={saved ? 'Unsave' : 'Save'}>
        <motion.svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? hex : 'none'} stroke={saved ? hex : '#f3eee6'} strokeWidth="1.5" aria-hidden
          key={String(saved)} initial={{ scale: saved ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ duration: 0.4, ease: EASE_SNAP }}>
          <path d="M12 21s-7-4.6-9.3-9.1C1.1 8.5 3 5 6.4 5c2 0 3.5 1.1 5.6 3.4C14.1 6.1 15.6 5 17.6 5 21 5 22.9 8.5 21.3 11.9 19 16.4 12 21 12 21z" />
        </motion.svg>
      </button>
    </motion.article>
  )
}

import { useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../lib/store'
import { FREE_SHIPPING_AT, edition, money, slugOf } from '../lib/products'
import { EASE, EASE_OUT, Roll } from '../lib/motion'
import { useDialog } from '../lib/useDialog'

const STEPPED = "polygon(6% 0, 100% 0, 100% 100%, 6% 100%, 6% 75%, 0 75%, 0 50%, 6% 50%, 6% 25%, 0 25%)"
const STRAIGHT = "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 75%, 0 75%, 0 50%, 0 50%, 0 25%, 0 25%)"

export default function CartDrawer() {
  const { drawer, setDrawer, lines, subtotal, setQty, remove, count } = useStore()
  const panel = useRef<HTMLElement>(null)
  const close = useCallback(() => setDrawer(false), [setDrawer])
  useDialog(drawer, close, panel)
  const left = Math.max(0, FREE_SHIPPING_AT - subtotal)

  return (
    <AnimatePresence>
      {drawer && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-black/60" onClick={() => setDrawer(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside ref={panel} role="dialog" aria-modal="true" aria-label="Shopping bag"
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-[480px] flex-col bg-ink-2 border-l border-line"
            initial={{ x: '100%', clipPath: STEPPED }} animate={{ x: 0, clipPath: STRAIGHT }} exit={{ x: '100%', clipPath: STEPPED }} transition={{ duration: 0.6, ease: EASE }}>
            <div className="flex items-center justify-between px-8 h-[72px] border-b border-line">
              <h2 className="display text-3xl">Bag <span className="text-gold">(<Roll value={count} />)</span></h2>
              <button className="eyebrow !text-ivory py-3 pl-4" onClick={close}>Close</button>
            </div>
            {lines.length === 0 ? (
              <div className="flex-1 grid place-content-center text-center px-8">
                <p className="display text-4xl">Your bag is empty.</p>
                <p className="mt-4 text-ivory-dim">Begin with something made to last.</p>
                <Link to="/shop" onClick={() => setDrawer(false)} className="btn mt-10">Browse the collection</Link>
              </div>
            ) : (
              <>
                <div className="px-8 pt-6">
                  <p className="text-sm text-ivory-dim">{left > 0 ? <>You are <span className="text-ivory">{money(left)}</span> from complimentary shipping.</> : 'Complimentary shipping applied.'}</p>
                  <div className="mt-3 h-px bg-line"><div className="h-px bg-gold transition-all duration-700" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100)}%` }} /></div>
                </div>
                <ul className="flex-1 overflow-y-auto px-8 py-4 divide-y divide-line">
                  <AnimatePresence initial={true}>
                  {lines.map(({ product: p, size, qty }, i) => (
                    <motion.li key={`${p.id}-${size}`} className="flex gap-5 overflow-hidden py-6" layout
                      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.25 + i * 0.06, duration: 0.48, ease: EASE_OUT } }}
                      exit={{ opacity: 0, x: 60, height: 0, paddingTop: 0, paddingBottom: 0, transition: { duration: 0.4, ease: EASE_OUT } }}>
                      <Link to={`/shop/${slugOf(p)}`} onClick={() => setDrawer(false)} className="shrink-0">
                        <img src={`/${p.img}`} alt="" className="h-28 w-28 object-cover bg-ink-3" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-3"><h3 className="display text-xl">{p.name}</h3><Roll className="font-mono text-sm" value={money(p.price * qty)} /></div>
                        <p className="eyebrow mt-1">{p.color} · {size}</p>
                        {edition(p) && <p className="eyebrow mt-1 text-gold">{edition(p)}</p>}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border border-line" role="group" aria-label={`Quantity for ${p.name}`}>
                            <button className="h-9 w-9" aria-label="Decrease quantity" onClick={() => setQty(p.id, size, qty - 1)} disabled={qty <= 1}>−</button>
                            <span className="w-8 text-center font-mono text-sm" aria-live="polite"><Roll value={qty} /></span>
                            <button className="h-9 w-9" aria-label="Increase quantity" onClick={() => setQty(p.id, size, qty + 1)} disabled={qty >= 9}>+</button>
                          </div>
                          <button className="link-u" onClick={() => remove(p.id, size)}>Remove</button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-line p-8">
                  <div className="flex justify-between"><span className="eyebrow">Subtotal</span><Roll className="font-mono" value={money(subtotal)} /></div>
                  <p className="mt-2 text-xs text-ivory-dim">Shipping and duties are shown at checkout. Demo only.</p>
                  <Link to="/checkout" onClick={() => setDrawer(false)} className="btn btn-gold w-full mt-6">Checkout</Link>
                  <button className="link-u mt-5 mx-auto block" onClick={() => setDrawer(false)}>Continue shopping</button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

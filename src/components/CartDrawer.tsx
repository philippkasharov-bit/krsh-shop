import { useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../lib/store'
import { FREE_SHIPPING_AT, edition, money, slugOf } from '../lib/products'
import { EASE } from '../lib/motion'
import { useDialog } from '../lib/useDialog'

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
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.7, ease: EASE }}>
            <div className="flex items-center justify-between px-8 h-[72px] border-b border-line">
              <h2 className="display text-3xl">Bag <span className="text-gold">({count})</span></h2>
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
                  {lines.map(({ product: p, size, qty }) => (
                    <li key={`${p.id}-${size}`} className="flex gap-5 py-6">
                      <Link to={`/shop/${slugOf(p)}`} onClick={() => setDrawer(false)} className="shrink-0">
                        <img src={`/${p.img}`} alt="" className="h-28 w-28 object-cover bg-ink-3" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-3"><h3 className="display text-xl">{p.name}</h3><span className="font-mono text-sm">{money(p.price * qty)}</span></div>
                        <p className="eyebrow mt-1">{p.color} · US {size}</p>
                        {edition(p) && <p className="eyebrow mt-1 text-gold">{edition(p)}</p>}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border border-line" role="group" aria-label={`Quantity for ${p.name}`}>
                            <button className="h-9 w-9" aria-label="Decrease quantity" onClick={() => setQty(p.id, size, qty - 1)} disabled={qty <= 1}>−</button>
                            <span className="w-8 text-center font-mono text-sm" aria-live="polite">{qty}</span>
                            <button className="h-9 w-9" aria-label="Increase quantity" onClick={() => setQty(p.id, size, qty + 1)} disabled={qty >= 9}>+</button>
                          </div>
                          <button className="link-u" onClick={() => remove(p.id, size)}>Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-line p-8">
                  <div className="flex justify-between"><span className="eyebrow">Subtotal</span><span className="font-mono">{money(subtotal)}</span></div>
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

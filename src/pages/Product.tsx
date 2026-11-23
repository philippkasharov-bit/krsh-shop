import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { sizesFor, bySlug, lineLabel, edition, money, products, soldOut, FREE_SHIPPING_AT } from '../lib/products'
import { useStore } from '../lib/store'
import ProductCard from '../components/ProductCard'
import SizeGuide from '../components/SizeGuide'
import { AccordionItem } from '../components/Accordion'
import { Fade } from '../lib/motion'
import { useTitle } from '../lib/seo'
import NotFound from './NotFound'

export default function Product() {
  const { slug = '' } = useParams()
  const p = bySlug(slug)
  useTitle(p?.name)
  const { add, wish, toggleWish } = useStore()
  const [size, setSize] = useState<string | null>(null)
  const [err, setErr] = useState(false)
  const [guide, setGuide] = useState(false)
  const sizeRef = useRef<HTMLFieldSetElement>(null)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  if (!p) return <NotFound />

  const saved = wish.includes(p.id)
  const related = products.filter((x) => x.line === p.line && x.id !== p.id).concat(products.filter((x) => x.line !== p.line)).slice(0, 3)
  const chosen = p.kind === 'onesize' ? 'One size' : size
  const sizes = sizesFor(p)
  const submit = () => {
    if (chosen === null) { setErr(true); return }
    add(p.id, chosen)
  }
  return (
    <>
      <div className="wrap pt-28 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 self-start">
          <nav aria-label="Breadcrumb" className="eyebrow mb-6 flex flex-wrap gap-x-2"><Link to="/shop" className="link-u nav-u">Collection</Link>/<Link to={`/shop?line=${p.line}`} className="link-u nav-u">{lineLabel[p.line]}</Link>/<span aria-current="page" className="text-ivory">{p.name}</span></nav>
          <div className="relative aspect-square lg:aspect-[5/6] bg-ink-2 overflow-hidden">
            <motion.div key="photo" className="h-full w-full cursor-zoom-in overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
                  onPointerMove={(e) => { if (e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) }}
                  onPointerLeave={() => setZoom(null)}>
                  <img src={`/${p.img}`} alt={`${p.name} in ${p.color}`} className="h-full w-full object-cover transition-transform duration-300 ease-out"
                    style={zoom ? { transform: 'scale(2.2)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
                </motion.div>
          </div>
        </div>

        {/* Buy box — sticky */}
        <div>
          {p.badge && <p className="eyebrow text-gold mb-4 flex justify-between"><span>{p.badge === 'new' ? 'New arrival' : `Limited · ${p.stock} remaining`}</span>{edition(p) && <span>{edition(p)}</span>}</p>}
          <h1 className="display t-1">{p.name}</h1>
          <div className="mt-6 flex items-center justify-between">
            <p className="font-mono text-2xl">{money(p.price)}</p>
          </div>
          <p className="mt-6 text-ivory-dim leading-relaxed">{p.desc}</p>
          <p className="eyebrow mt-6">{p.color} · {p.sku}</p>

          {p.kind !== 'onesize' && <fieldset ref={sizeRef} className="mt-10 scroll-mt-28">
            <legend className="flex w-full justify-between eyebrow mb-4"><span>Select size{p.kind === 'shoe' ? ' (EU)' : ''}</span><button type="button" className="link-u !text-[10px]" onClick={() => setGuide(true)}>Size guide</button></legend>
            <div className={`grid ${p.kind === 'apparel' ? 'grid-cols-5' : 'grid-cols-4'} gap-px bg-line border border-line`}>
              {sizes.map((s) => {
                const out = soldOut(p, s)
                return (
                  <button key={s} disabled={out} aria-pressed={size === s} onClick={() => { setSize(s); setErr(false) }}
                    className={`h-14 font-mono text-sm transition-colors ${size === s ? 'bg-ivory text-ink' : 'bg-ink hover:bg-ink-3'} ${out ? 'line-through text-ivory-dim/40 !bg-ink' : ''}`}
                    aria-label={`Size ${s}${out ? ', sold out' : ''}`}>{s}</button>
                )
              })}
            </div>
            <p role="alert" className="mt-3 h-5 text-sm text-[#e58a80]">{err ? 'Please select a size.' : ''}</p>
          </fieldset>}

          <div className="mt-4 flex gap-3">
            <button className="btn btn-gold flex-1" onClick={submit}>Add to bag — {money(p.price)}</button>
            <button className="btn !px-5" aria-pressed={saved} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} onClick={() => toggleWish(p.id)}>{saved ? '♥' : '♡'}</button>
          </div>
          <p className="mt-4 text-xs text-ivory-dim">Complimentary shipping over ${FREE_SHIPPING_AT} · 14-day returns · Demo store, nothing ships.</p>

          <div className="mt-10 border-t border-line">
            <AccordionItem title="Materials & construction" defaultOpen><ul className="list-disc pl-5 space-y-1">{p.materials.map((m) => <li key={m}>{m}</li>)}</ul></AccordionItem>
            <AccordionItem title="Shipping & returns"><p>Complimentary standard shipping over ${FREE_SHIPPING_AT} (3–5 business days). Express is $15. Returns within 14 days if unworn, tags on.</p></AccordionItem>
            <AccordionItem title="Care"><p>Wash cold, inside out. Hang dry. Keep reflective and metallic finishes away from heat and the dryer.</p></AccordionItem>
          </div>
        </div>
      </div>

      {/* Complete the look */}
      <section className="wrap mt-section">
        <Fade><h2 className="display t-2 mb-14">You may also <em>like.</em></h2></Fade>
        <div className="grid gap-8 sm:grid-cols-3">{related.map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}</div>
      </section>

      <div className="h-24 lg:hidden" aria-hidden />
      <SizeGuide kind={p.kind} open={guide} onClose={() => setGuide(false)} />

      {/* Sticky mobile buy bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-line bg-ink/90 backdrop-blur-xl p-4">
        <div className="flex-1 min-w-0"><p className="display text-lg truncate">{p.name}</p><p className="font-mono text-sm text-ivory-dim">{chosen ? chosen : 'Select size above'}</p></div>
        <button className="btn btn-gold !px-6 !py-4" onClick={() => { if (chosen === null) { setErr(true); sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) } else add(p.id, chosen) }}>Add · {money(p.price)}</button>
      </div>
    </>
  )
}

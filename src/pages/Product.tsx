import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { SIZES, bySlug, categoryLabel, edition, money, products, soldOut, FREE_SHIPPING_AT } from '../lib/products'
import { useStore } from '../lib/store'
import ModelViewer from '../components/ModelViewer'
import ProductCard from '../components/ProductCard'
import SizeGuide from '../components/SizeGuide'
import { AccordionItem } from '../components/Accordion'
import { Fade } from '../lib/motion'
import { useTitle } from '../lib/seo'
import NotFound from './NotFound'

export default function Product() {
  const { slug = '' } = useParams()
  const p = bySlug(slug)
  useTitle(p?.name.replace('KRSH ', ''))
  const { add, wish, toggleWish } = useStore()
  const [size, setSize] = useState<number | null>(null)
  const [err, setErr] = useState(false)
  const [view, setView] = useState<'photo' | '3d'>('photo')
  const [guide, setGuide] = useState(false)
  const sizeRef = useRef<HTMLFieldSetElement>(null)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  if (!p) return <NotFound />

  const saved = wish.includes(p.id)
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).concat(products.filter((x) => x.category !== p.category)).slice(0, 3)
  const submit = () => {
    if (size === null) { setErr(true); return }
    add(p.id, size)
  }
  return (
    <>
      <div className="wrap pt-28 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 self-start">
          <nav aria-label="Breadcrumb" className="eyebrow mb-6 flex flex-wrap gap-x-2"><Link to="/shop" className="link-u nav-u">Collection</Link>/<Link to={`/shop?cat=${p.category}`} className="link-u nav-u">{categoryLabel[p.category]}</Link>/<span aria-current="page" className="text-ivory">{p.name.replace('KRSH ', '')}</span></nav>
          <div className="relative aspect-square lg:aspect-[5/6] bg-ink-2 overflow-hidden">
            <AnimatePresence mode="wait">
              {view === 'photo' || !p.model ? (
                <motion.div key="photo" className="h-full w-full cursor-zoom-in overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
                  onPointerMove={(e) => { if (e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) }}
                  onPointerLeave={() => setZoom(null)}>
                  <img src={`/${p.img}`} alt={`${p.name} in ${p.color}`} className="h-full w-full object-cover transition-transform duration-300 ease-out"
                    style={zoom ? { transform: 'scale(2.2)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
                </motion.div>
              ) : (
                <motion.div key="3d" className="h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ModelViewer src={`/${p.model}`} poster={`/${p.img}`} alt={`Interactive 3D model of the ${p.name}`} className="h-full w-full" />
                </motion.div>
              )}
            </AnimatePresence>
            {p.model && (
              <div className="absolute bottom-4 left-4 flex gap-px bg-line" role="group" aria-label="Gallery view">
                {(['photo', '3d'] as const).map((v) => (
                  <button key={v} aria-pressed={view === v} onClick={() => setView(v)}
                    className={`px-5 py-3 text-[11px] tracking-[0.2em] uppercase ${view === v ? 'bg-ivory text-ink' : 'bg-ink/80 backdrop-blur'}`}>{v === 'photo' ? 'Photo' : '3D view'}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buy box — sticky */}
        <div>
          {p.badge && <p className="eyebrow text-gold mb-4 flex justify-between"><span>{p.badge === 'new' ? 'New arrival' : `Limited · ${p.stock} remaining`}</span>{edition(p) && <span>{edition(p)}</span>}</p>}
          <h1 className="display t-1">{p.name.replace('KRSH ', '')}</h1>
          <div className="mt-6 flex items-center justify-between">
            <p className="font-mono text-2xl">{money(p.price)}</p>
            <a href="#reviews" className="eyebrow hover:text-gold py-3" aria-label={`${p.rating} out of 5 from ${p.reviewCount} reviews`}>★ {p.rating} · {p.reviewCount} reviews</a>
          </div>
          <p className="mt-6 text-ivory-dim leading-relaxed">{p.desc}</p>
          <p className="eyebrow mt-6">{p.color} · {p.sku}</p>

          <fieldset ref={sizeRef} className="mt-10 scroll-mt-28">
            <legend className="flex w-full justify-between eyebrow mb-4"><span>Select size (US)</span><button type="button" className="link-u !text-[10px]" onClick={() => setGuide(true)}>Size guide</button></legend>
            <div className="grid grid-cols-4 gap-px bg-line border border-line">
              {SIZES.map((s) => {
                const out = soldOut(p, s)
                return (
                  <button key={s} disabled={out} aria-pressed={size === s} onClick={() => { setSize(s); setErr(false) }}
                    className={`h-14 font-mono text-sm transition-colors ${size === s ? 'bg-ivory text-ink' : 'bg-ink hover:bg-ink-3'} ${out ? 'line-through text-ivory-dim/40 !bg-ink' : ''}`}
                    aria-label={`US ${s}${out ? ', sold out' : ''}`}>{s}</button>
                )
              })}
            </div>
            <p role="alert" className="mt-3 h-5 text-sm text-[#e58a80]">{err ? 'Please select a size.' : ''}</p>
          </fieldset>

          <div className="mt-4 flex gap-3">
            <button className="btn btn-gold flex-1" onClick={submit}>Add to bag — {money(p.price)}</button>
            <button className="btn !px-5" aria-pressed={saved} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} onClick={() => toggleWish(p.id)}>{saved ? '♥' : '♡'}</button>
          </div>
          <p className="mt-4 text-xs text-ivory-dim">Complimentary shipping over ${FREE_SHIPPING_AT} · 14-day returns · Demo store, nothing ships.</p>

          <div className="mt-10 border-t border-line">
            <AccordionItem title="Materials & construction" defaultOpen><ul className="list-disc pl-5 space-y-1">{p.materials.map((m) => <li key={m}>{m}</li>)}</ul></AccordionItem>
            <AccordionItem title="Shipping & returns"><p>Complimentary standard shipping over ${FREE_SHIPPING_AT} (3–5 business days). Express is $15. Returns within 14 days if unworn and in the original box.</p></AccordionItem>
            <AccordionItem title="Care"><p>Brush after wear, condition leather monthly, and use cedar shoe trees. We resole every pair, for life.</p></AccordionItem>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section id="reviews" className="wrap mt-section scroll-mt-28">
        <p className="eyebrow mb-4">Reviews</p>
        <h2 className="display t-2">{p.rating} <span className="text-gold">/ 5</span></h2>
        <p className="eyebrow mt-4">Demo reviews, written for this portfolio</p>
        <div className="mt-14 grid gap-px bg-line md:grid-cols-3 border border-line">
          {p.reviews.slice(0, 3).map((r) => (
            <blockquote key={r.author} className="bg-ink p-8">
              <p className="text-gold tracking-widest" aria-label={`${r.stars} out of 5 stars`}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</p>
              <p className="mt-5 leading-relaxed">“{r.text}”</p>
              <footer className="eyebrow mt-6">{r.author} · {r.date}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Complete the look */}
      <section className="wrap mt-section">
        <Fade><h2 className="display t-2 mb-14">You may also <em>like.</em></h2></Fade>
        <div className="grid gap-8 sm:grid-cols-3">{related.map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}</div>
      </section>

      <div className="h-24 lg:hidden" aria-hidden />
      <SizeGuide open={guide} onClose={() => setGuide(false)} />

      {/* Sticky mobile buy bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-line bg-ink/90 backdrop-blur-xl p-4">
        <div className="flex-1 min-w-0"><p className="display text-lg truncate">{p.name}</p><p className="font-mono text-sm text-ivory-dim">{size ? `US ${size}` : 'Select size above'}</p></div>
        <button className="btn btn-gold !px-6 !py-4" onClick={() => { if (size === null) { setErr(true); sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) } else add(p.id, size) }}>Add · {money(p.price)}</button>
      </div>
    </>
  )
}

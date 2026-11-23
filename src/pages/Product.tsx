import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useTransform } from 'motion/react'
import { sizesFor, bySlug, lineLabel, edition, money, products, soldOut, FREE_SHIPPING_AT, ACCENT_HEX } from '../lib/products'
import { useStore } from '../lib/store'
import ProductCard from '../components/ProductCard'
import SizeGuide from '../components/SizeGuide'
import { AccordionItem } from '../components/Accordion'
import { EASE_OUT, Fade } from '../lib/motion'
import { useBeat } from '../lib/beat'
import { flyToBag } from '../lib/flyToBag'
import { useTitle } from '../lib/seo'
import NotFound from './NotFound'

/** Where each logo sits on the packshot, for the push-in hotspot (percent of the image). */
const LOGO_AT: Record<string, { x: number; y: number }> = {
  'strobe-jacket': { x: 50, y: 45 }, 'laser-corset-top': { x: 70, y: 76 }, 'glow-cargo': { x: 33, y: 44 }, 'chain-mail-tank': { x: 50, y: 19 },
  'warehouse-hoodie': { x: 50, y: 43 }, 'flyer-tee': { x: 50, y: 38 }, 'utility-pant': { x: 62, y: 40 }, 'night-shell': { x: 50, y: 34 },
  'baby-tee-2000': { x: 60, y: 40 }, 'low-rise-flare': { x: 61.5, y: 16 }, 'chrome-puffer': { x: 50, y: 46 }, 'velour-set': { x: 50, y: 17 },
  'strobe-sneaker': { x: 80, y: 38 }, 'court-hi': { x: 82, y: 38 }, 'mini-shoulder-bag': { x: 50, y: 62 }, 'visor': { x: 78, y: 47 },
}

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
  const [locked, setLocked] = useState(false)
  const [adding, setAdding] = useState<'idle' | 'progress' | 'done'>('idle')
  const [shake, setShake] = useState(0)
  const imgRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const beat = useBeat()
  const hotScale = useTransform(beat, [0, 1], [1, 1.5])
  const reduce = useReducedMotion()
  if (!p) return <NotFound />
  const spot = LOGO_AT[slug] ?? { x: 50, y: 45 }
  const fail = () => { setErr(true); setShake((n) => n + 1) }
  const doAdd = (s: string) => {
    if (adding !== 'idle') return
    if (reduce) { add(p.id, s); return }
    setAdding('progress')
    flyToBag(imgRef.current, `/${p.img}`)
    setTimeout(() => setAdding('done'), 400)
    setTimeout(() => { add(p.id, s); setAdding('idle') }, 1100)
  }

  const saved = wish.includes(p.id)
  const related = products.filter((x) => x.line === p.line && x.id !== p.id).concat(products.filter((x) => x.line !== p.line)).slice(0, 6)
  const chosen = p.kind === 'onesize' ? 'One size' : size
  const sizes = sizesFor(p)
  const submit = () => {
    if (chosen === null) { fail(); return }
    doAdd(chosen)
  }
  return (
    <>
      <div className="wrap pt-28 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 self-start">
          <nav aria-label="Breadcrumb" className="eyebrow mb-6 flex flex-wrap gap-x-2"><Link to="/shop" className="link-u nav-u">Collection</Link>/<Link to={`/shop?line=${p.line}`} className="link-u nav-u">{lineLabel[p.line]}</Link>/<span aria-current="page" className="text-ivory">{p.name}</span></nav>
          <div ref={imgRef} className="relative aspect-square lg:aspect-[5/6] bg-ink-2 overflow-hidden">
            <motion.div key="photo" className="h-full w-full cursor-zoom-in overflow-hidden" data-cursor="Zoom"
              initial={{ clipPath: reduce ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }} animate={{ clipPath: 'inset(0% 0% 0% 0%)' }} transition={{ duration: 0.8, ease: EASE_OUT }}
              onPointerMove={(e) => { if (locked || e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) }}
              onPointerLeave={() => { if (!locked) setZoom(null) }}>
              <img src={`/${p.img}`} alt={`${p.name}, ${p.color}`} className={`h-full w-full object-cover ${locked ? 'transition-transform duration-[800ms] ease-[var(--ease-out)]' : 'transition-transform duration-300 ease-out'}`}
                style={zoom ? { transform: `scale(${locked ? 2.6 : 2.2})`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
            </motion.div>
            {/* Logo-spot hotspot: click pushes in to the print ("details matter", ref R3) */}
            <button type="button" onClick={() => { if (locked) { setLocked(false); setZoom(null) } else { setLocked(true); setZoom(spot) } }}
              className="absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center" style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={locked ? 'Zoom out' : 'Zoom in on the logo'} aria-pressed={locked} data-cursor={locked ? 'Back' : 'Logo'}>
              <motion.span className="block h-3 w-3 rounded-full border border-ink" style={{ background: ACCENT_HEX[p.accent], scale: locked ? 0 : hotScale }} />
            </button>
            <AnimatePresence>{locked && (
              <motion.p className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory bg-black/70 px-3 py-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                Mark · {p.logo.replace('-', ' ')} · printed in {p.color.split(' / ')[1]}
              </motion.p>
            )}</AnimatePresence>
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
            <motion.div key={shake} animate={shake && !reduce ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.22 }}
              className={`grid ${p.kind === 'apparel' ? 'grid-cols-5' : 'grid-cols-4'} gap-px bg-line border border-line`}>
              {sizes.map((s) => {
                const out = soldOut(p, s)
                const on = size === s
                return (
                  <button key={s} disabled={out} aria-pressed={on} onClick={() => { setSize(s); setErr(false) }}
                    className={`relative h-14 bg-ink font-mono text-sm transition-[background-size,color,transform] duration-[240ms] ease-[var(--ease-out)] active:scale-[.96] hover:bg-ink-3 ${on ? 'text-ink' : ''} ${out ? 'text-ivory-dim/40' : ''}`}
                    style={{ backgroundImage: 'linear-gradient(var(--color-ivory), var(--color-ivory))', backgroundRepeat: 'no-repeat', backgroundPosition: 'left', backgroundSize: on ? '100% 100%' : '0% 100%' }}
                    aria-label={`Size ${s}${out ? ', sold out' : ''}`}>
                    {s}
                    {out && <motion.span aria-hidden className="absolute left-1/4 right-1/4 top-1/2 h-px bg-ivory-dim/50 origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.24 }} />}
                  </button>
                )
              })}
            </motion.div>
            <p role="alert" className="mt-3 h-5 text-sm text-[#e58a80]">{err ? 'Please select a size.' : ''}</p>
          </fieldset>}

          <div className="mt-4 flex gap-3">
            <button className="btn btn-gold relative flex-1 overflow-hidden" onClick={submit} data-cursor="Add" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                {adding === 'idle' && <motion.span key="t" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.24 }}>Add to bag — {money(p.price)}</motion.span>}
                {adding === 'progress' && <motion.span key="p" className="absolute inset-x-8 top-1/2 h-px bg-ink origin-left" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE_OUT }} aria-label="Adding" />}
                {adding === 'done' && (
                  <motion.svg key="d" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="Added" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.path d="M4 12.5l5 5L20 6.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.24 }} />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>
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
        <div ref={railRef} className="overflow-hidden" data-cursor="Drag">
          <motion.div className="flex w-max gap-8" drag={reduce ? false : 'x'} dragConstraints={railRef} dragElastic={0.08} dragTransition={{ power: 0.3, timeConstant: 300 }}>
            {related.map((r, i) => <div key={r.id} className="w-[78vw] sm:w-[40vw] lg:w-[28vw]"><ProductCard p={r} index={i} /></div>)}
          </motion.div>
        </div>
      </section>

      <div className="h-24 lg:hidden" aria-hidden />
      <SizeGuide kind={p.kind} open={guide} onClose={() => setGuide(false)} />

      {/* Sticky mobile buy bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-line bg-ink/90 backdrop-blur-xl p-4">
        <div className="flex-1 min-w-0"><p className="display text-lg truncate">{p.name}</p><p className="font-mono text-sm text-ivory-dim">{chosen ? chosen : 'Select size above'}</p></div>
        <button className="btn btn-gold !px-6 !py-4" onClick={() => { if (chosen === null) { fail(); sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) } else doAdd(chosen) }}>Add · {money(p.price)}</button>
      </div>
    </>
  )
}

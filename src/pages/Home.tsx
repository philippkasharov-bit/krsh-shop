import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { products, money, slugOf, lineLabel, LINES } from '../lib/products'
import { Fade, SplitReveal } from '../lib/motion'
import ModelViewer from '../components/ModelViewer'
import Marquee from '../components/Marquee'
import ProductCard from '../components/ProductCard'
import { useTitle } from '../lib/seo'

const featured = products.filter((p) => p.badge !== null).slice(0, 6)
const cats = LINES

export default function Home() {
  useTitle()
  const hero = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const dune = products.find((p) => p.name === "Chrome Puffer")!
  const nums = [['2019', 'Founded in a garage'], ['200', 'Pairs per numbered release'], ['14', 'Days to return, no questions']]

  return (
    <>
      {/* HERO — pinned type + 3D shoe (Spline-style interactive scene via model-viewer) */}
      <section ref={hero} className="relative min-h-[100svh] overflow-hidden pt-[72px]">
        <motion.img src="/images/hero-bg.webp" alt="" aria-hidden style={{ y }} className="absolute inset-0 h-[115%] w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />
        <motion.div style={{ opacity: fade }} className="wrap relative grid min-h-[calc(100svh-72px)] items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="pt-16 lg:pt-0">
            <p className="eyebrow mb-8">Spring / Summer 2026 · Numbered releases</p>
            <SplitReveal className="display t-1" text="Made to be worn slowly." />
            <Fade delay={0.9}>
              <p className="mt-10 max-w-md text-lg text-ivory-dim leading-relaxed">Full-grain leather, hand-finished soles and a quiet kind of confidence. Footwear from a house that started in a garage and never rushed since.</p>
              <div className="mt-10 flex flex-wrap items-center gap-8">
                <Link to="/shop" className="btn btn-gold">Explore the collection</Link>
                <Link to="/maison" className="link-u">The Maison</Link>
              </div>
            </Fade>
          </div>
          <div className="relative h-[52vh] lg:h-[78vh]">
            <div className="absolute left-1/2 top-1/2 h-[70%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-line" aria-hidden />
            <ModelViewer src="/media/sneaker.glb" poster="/images/krsh-venom.webp" alt="Rotating 3D view of a KRSH sneaker" className="relative z-10 h-full w-full" />
            <p className="eyebrow absolute bottom-0 inset-x-0 text-center">Drag to rotate</p>
          </div>
        </motion.div>
      </section>

      <Marquee items={['Hand-numbered', 'Full-grain leather', 'Resoleable', 'Made in small runs']} />

      {/* NEW & LIMITED */}
      <section className="wrap mt-section">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <div>
            <p className="eyebrow mb-4">01 — The edit</p>
            <SplitReveal as="h2" className="display t-2" text="New & limited." />
          </div>
          <Link to="/shop" className="link-u">View all {products.length} pieces</Link>
        </div>
        <div className="grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      </section>

      {/* STATEMENT / NUMBERS */}
      <section className="wrap mt-section grid gap-16 lg:grid-cols-[1fr_1.2fr] items-center">
        <Fade><img src="/images/about-story.webp" alt="The KRSH workshop" loading="lazy" className="aspect-[4/5] w-full object-cover" /></Fade>
        <div>
          <p className="eyebrow mb-6">02 — The Maison</p>
          <SplitReveal as="h2" className="display t-2" text="Not louder. Better made." />
          <Fade><p className="mt-8 max-w-lg text-ivory-dim leading-relaxed text-lg">We cut fewer styles, in smaller runs, and finish each pair by hand. The result is footwear that gets better the longer you own it.</p></Fade>
          <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {nums.map(([n, l]) => (
              <div key={n}><dt className="display text-5xl text-gold">{n}</dt><dd className="eyebrow mt-3 leading-relaxed">{l}</dd></div>
            ))}
          </dl>
          <Link to="/maison" className="link-u mt-12 inline-block">Read our story</Link>
        </div>
      </section>

      {/* SHOP BY SILHOUETTE */}
      <section className="wrap mt-section">
        <p className="eyebrow mb-4">03 — Lines</p>
        <SplitReveal as="h2" className="display t-2 mb-16" text="Pick your line." />
        <ul className="border-t border-line">
          {cats.map((c) => {
            const sample = products.find((p) => p.line === c)!
            const n = products.filter((p) => p.line === c).length
            return (
              <li key={c} className="border-b border-line">
                <Link to={`/shop?line=${c}`} className="group flex items-center justify-between gap-6 py-8 md:py-10">
                  <span className="display t-2 transition-all duration-700 group-hover:pl-6 group-hover:text-gold">{lineLabel[c]}</span>
                  <span className="flex items-center gap-8">
                    <img src={`/${sample.img}`} alt="" loading="lazy" className="hidden md:block h-24 w-24 object-cover opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700" />
                    <span className="eyebrow w-20 text-right">{n} pieces</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* LOOKBOOK */}
      <section className="wrap mt-section">
        <p className="eyebrow mb-4">04 — Lookbook</p>
        <SplitReveal as="h2" className="display t-2 mb-16" text="Seen in the city." />
        <div className="grid gap-6 md:grid-cols-3">
          {[['lookbook-1', 'Lookbook: KRSH on the roof'], ['lookbook-2', 'Lookbook: detail of a leather upper'], ['lookbook-3', 'Lookbook: pair at dusk']].map(([f, alt], i) => (
            <Fade key={f} delay={i * 0.08}><img src={`/images/${f}.webp`} alt={alt} loading="lazy" className="aspect-[4/5] w-full object-cover" /></Fade>
          ))}
        </div>
        <Fade className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8">
          <p className="display t-3 max-w-2xl">“{dune.name}” — {money(dune.price)}. Mirror finish, cropped for the floor.</p>
          <Link to={`/shop/${slugOf(dune)}`} className="link-u">Shop the look</Link>
        </Fade>
      </section>

      {/* SERVICE STRIP */}
      <section className="wrap mt-section grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4 border border-line">
        {[['Free shipping', 'On orders over $250'], ['14-day returns', 'Unworn, in the box'], ['Lifetime resoling', 'Send them back, we rebuild'], ['Numbered & signed', 'An authenticity card in every box']].map(([t, d]) => (
          <div key={t} className="bg-ink p-8"><h3 className="display t-4">{t}</h3><p className="mt-2 text-sm text-ivory-dim">{d}</p></div>
        ))}
      </section>
    </>
  )
}

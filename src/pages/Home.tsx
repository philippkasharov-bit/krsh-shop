import { Link } from 'react-router-dom'
import { products, money, slugOf, lineLabel, LINES, ACCENT_HEX } from '../lib/products'
import { CountUp, Fade, SplitReveal, TypeIn } from '../lib/motion'
import Journey from '../components/Journey'
import Marquee from '../components/Marquee'
import ProductCard from '../components/ProductCard'
import HudGrid from '../components/hud/HudGrid'
import CutFrame from '../components/hud/CutFrame'
import Stamp from '../components/hud/Stamp'
import Wristband from '../components/hud/Wristband'
import { useTitle } from '../lib/seo'

const featured = products.filter((p) => p.badge !== null).slice(0, 6)

export default function Home() {
  useTitle()
  const look = products.find((p) => p.name === 'Chrome Puffer')!
  const nums = [['16', 'Pieces this season'], ['200', 'Per numbered drop'], ['14', 'Days to return, tags on']]

  return (
    <>
      {/* FESTIVAL JOURNEY — 5 scroll scenes (docs/MOTION-SPEC.md) */}
      <Journey />

      <Marquee items={['Flash', 'Street', 'Y2K', 'Gear', 'Numbered drops', 'Made after dark']} />

      {/* THE EDIT — staggered, not a uniform row */}
      <section className="relative mt-section">
        <HudGrid label="01 · THE EDIT" />
        <div className="wrap relative">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <TypeIn text="01 — The edit" className="eyebrow mb-4" />
              <SplitReveal as="h2" className="display t-2" text="New & limited." />
            </div>
            <Link to="/shop" className="link-u">View all {products.length} pieces</Link>
          </div>
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <div key={p.id} className={i % 3 === 1 ? 'lg:translate-y-24' : i % 3 === 2 ? 'lg:translate-y-10' : ''}>
                <ProductCard p={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE STORY — arch frame, stamp, counting numbers */}
      <section className="wrap mt-section grid items-center gap-16 pt-24 lg:grid-cols-[1fr_1.2fr]">
        <div className="relative">
          <CutFrame src="/media/journey/tent.webp" alt="The Pragmatic Hippy tent at night" shape="arch" />
          <Stamp className="absolute -right-6 -bottom-8 md:-right-10" />
        </div>
        <div>
          <TypeIn text="02 — The story" className="eyebrow mb-6" />
          <SplitReveal as="h2" className="display t-2" text="Sun up, moon down." />
          <Fade><p className="mt-8 max-w-lg text-lg leading-relaxed text-ivory-dim">Half of us lives for the night, half for the morning after. Small numbered drops: dark pieces with one bright accent, built to last a whole night and still look right on the walk home.</p></Fade>
          <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {nums.map(([n, l]) => (
              <div key={n}><dt className="display text-5xl text-gold"><CountUp value={n} /></dt><dd className="eyebrow mt-3 leading-relaxed">{l}</dd></div>
            ))}
          </dl>
          <Link to="/maison" className="link-u mt-12 inline-block">Read our story</Link>
        </div>
      </section>

      {/* LINES — HUD list */}
      <section className="relative mt-section py-10">
        <HudGrid label="03 · LINES" />
        <div className="wrap relative">
          <TypeIn text="03 — Lines" className="eyebrow mb-4" />
          <SplitReveal as="h2" className="display t-2 mb-16" text="Pick your line." />
          <ul className="border-t border-line">
            {LINES.map((c, idx) => {
              const sample = products.find((p) => p.line === c)!
              const n = products.filter((p) => p.line === c).length
              return (
                <li key={c} className="border-b border-line">
                  <Link to={`/shop?line=${c}`} className="group grid grid-cols-[48px_1fr_auto] items-center gap-6 py-8 md:py-10" data-cursor="Shop">
                    <span className="font-mono text-[11px] text-gold">0{idx + 1}</span>
                    <span className="display t-2 transition-all duration-700 ease-[var(--ease-out)] group-hover:pl-6 group-hover:text-gold">{lineLabel[c]}</span>
                    <span className="flex items-center gap-8">
                      <img src={`/${sample.img}`} alt="" loading="lazy" className="hidden h-24 w-24 scale-90 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100 group-hover:-rotate-3 md:block" />
                      <Wristband color={ACCENT_HEX[sample.accent]}>{n} pieces</Wristband>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* LOOKBOOK — overlapping cut frames */}
      <section className="wrap mt-section">
        <TypeIn text="04 — Lookbook" className="eyebrow mb-4" />
        <SplitReveal as="h2" className="display t-2 mb-16" text="Seen after dark." />
        <div className="relative grid gap-6 md:grid-cols-12">
          <CutFrame className="md:col-span-7" ratio="aspect-[16/10]" shape="step" src="/media/journey/stage.webp" alt="Main stage, crowd under purple lasers" />
          <CutFrame className="md:col-span-5 md:mt-40 md:-ml-16 relative z-10" ratio="aspect-[4/5]" shape="arch" src="/media/journey/detail.webp" alt="Back of the Strobe Jacket with the red Pragmatic Hippy print" />
          <CutFrame className="md:col-span-8 md:col-start-3 md:-mt-24" ratio="aspect-[2/1]" shape="diag" src="/media/journey/market.webp" alt="Market path at dawn" />
        </div>
        <Fade className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8">
          <p className="display t-3 max-w-2xl">“{look.name}” — {money(look.price)}. Matte black, red lining, cropped for the floor.</p>
          <Link to={`/shop/${slugOf(look)}`} className="link-u">Shop the look</Link>
        </Fade>
      </section>

      {/* SERVICE — ticket stubs */}
      <section className="wrap mt-section grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[['Free shipping', 'On orders over $250'], ['14-day returns', 'Unworn, tags on'], ['Small drops', 'Made in runs of 200'], ['Numbered', 'A drop card in every order']].map(([t, d], i) => (
          <Fade key={t} delay={i * 0.06}>
            <div className="relative border border-line bg-ink-2 p-8 transition-transform duration-300 hover:-translate-y-1">
              <span aria-hidden className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ink" />
              <span aria-hidden className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-ink" />
              <p className="font-mono text-[10px] text-gold">No. 0{i + 1}</p>
              <h3 className="display t-4 mt-2">{t}</h3><p className="mt-2 text-sm text-ivory-dim">{d}</p>
            </div>
          </Fade>
        ))}
      </section>
    </>
  )
}

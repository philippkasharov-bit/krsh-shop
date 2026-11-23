import { Link } from 'react-router-dom'
import { SplitReveal } from '../lib/motion'
import { useTitle } from '../lib/seo'
import CutFrame from '../components/hud/CutFrame'
import Stamp from '../components/hud/Stamp'
import { CountUp, TypeIn } from '../lib/motion'
import { useRef, type ReactNode } from 'react'
import { motion, useScroll } from 'motion/react'

const steps = [
  ['Sketch', 'Every piece starts as a flyer-style sketch, made on the night it was imagined.'],
  ['Source', 'Reflective, metallic and holographic fabrics are tested under strobe and blacklight before we commit.'],
  ['Sew', 'Seams that take movement are double-stitched; straps and zips are chosen to survive a long night.'],
  ['Drop', 'Each run is numbered, photographed and released in one drop. When it is gone, it is gone.'],
]

export default function Maison() {
  useTitle('Our story')
  return (
    <>
      <section className="wrap pt-40">
        <TypeIn text="Our story" className="eyebrow mb-4" />
        <SplitReveal className="display t-1" text="Half sun. Half moon." />
      </section>
      <section className="wrap mt-24 grid gap-16 lg:grid-cols-2 items-start">
        <div className="relative"><CutFrame src="/media/journey/market.webp" alt="The market path at dawn" shape="arch" /><Stamp className="absolute -bottom-8 -right-4" /></div>
        <div className="lg:pt-24 space-y-8 text-lg text-ivory-dim leading-relaxed max-w-xl">
          <p className="display t-3 text-ivory">Pragmatic Hippy started on the dance floor: clothes that could take a whole night and still look right on the walk home.</p>
          <p>Half of us lives for the night, half for the morning after. We make small, numbered drops: some loud enough for the strobe, some quiet enough for the street.</p>
          <p>This is a fictional house, built as a front-end portfolio piece. The craft you see here is the interface; the clothing, people and places are invented.</p>
        </div>
      </section>
      <section className="wrap mt-section">
        <p className="eyebrow mb-4">Process</p>
        <SplitReveal as="h2" className="display t-2 mb-16" text="From flyer to floor." />
        <StepsLine>
          {steps.map(([t, d], i) => (
            <li key={t} className="grid gap-4 border-b border-line py-10 md:grid-cols-[120px_1fr_1.4fr] items-baseline">
              <span className="font-mono text-gold">0<CountUp value={String(i + 1)} /></span><h3 className="display t-3">{t}</h3><p className="text-ivory-dim leading-relaxed">{d}</p>
            </li>
          ))}
        </StepsLine>
      </section>
      <section className="wrap mt-section text-center">
        <SplitReveal as="h2" className="display t-2" text="See the result." />
        <Link to="/shop" className="btn btn-gold mt-10">The collection</Link>
      </section>
    </>
  )
}

/** Steps hang off a gold line that draws down as you scroll (MOTION-SPEC 'Story'). */
function StepsLine({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  return (
    <ol ref={ref} className="relative border-t border-line md:pl-10">
      <motion.span aria-hidden className="absolute left-0 top-0 hidden h-full w-px origin-top bg-gold md:block" style={{ scaleY: scrollYProgress }} />
      {children}
    </ol>
  )
}

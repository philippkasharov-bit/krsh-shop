import { Link } from 'react-router-dom'
import { Fade, SplitReveal } from '../lib/motion'
import { useTitle } from '../lib/seo'

const steps = [
  ['Last', 'Every silhouette starts on a hand-carved wooden last, tuned over dozens of fittings.'],
  ['Cut', 'Full-grain hides are cut one panel at a time to avoid flaws and keep grain direction consistent.'],
  ['Stitch', 'Uppers are closed with waxed thread and double-stitched at stress points.'],
  ['Finish', 'Edges are burnished, soles are bonded and each pair is numbered and signed before the box.'],
]

export default function Maison() {
  useTitle('The Maison')
  return (
    <>
      <section className="wrap pt-40">
        <p className="eyebrow mb-4">The Maison</p>
        <SplitReveal className="display t-1" text="A garage. A last. A promise." />
      </section>
      <section className="wrap mt-24 grid gap-16 lg:grid-cols-2 items-start">
        <Fade><img src="/images/about-story.webp" alt="Workbench with leather and tools" className="aspect-[4/5] w-full object-cover" /></Fade>
        <div className="lg:pt-24 space-y-8 text-lg text-ivory-dim leading-relaxed max-w-xl">
          <p className="display t-3 text-ivory">KRSH began in 2019, in a garage, with one pair we couldn’t find anywhere else.</p>
          <p>We make fewer styles, in smaller runs, because quiet things last longer than loud ones. Each release is numbered. Each pair can be resoled, for life.</p>
          <p>This is a fictional house, built as a front-end portfolio piece. The craft you see here is the interface; the footwear, people and workshops are invented.</p>
        </div>
      </section>
      <section className="wrap mt-section">
        <p className="eyebrow mb-4">Process</p>
        <SplitReveal as="h2" className="display t-2 mb-16" text="Four hands, one pair." />
        <ol className="border-t border-line">
          {steps.map(([t, d], i) => (
            <li key={t} className="grid gap-4 border-b border-line py-10 md:grid-cols-[120px_1fr_1.4fr] items-baseline">
              <span className="font-mono text-gold">0{i + 1}</span><h3 className="display t-3">{t}</h3><p className="text-ivory-dim leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="wrap mt-section text-center">
        <SplitReveal as="h2" className="display t-2" text="See the result." />
        <Link to="/shop" className="btn btn-gold mt-10">The collection</Link>
      </section>
    </>
  )
}

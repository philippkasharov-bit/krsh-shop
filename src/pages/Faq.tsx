import { AccordionItem } from '../components/Accordion'
import { SplitReveal } from '../lib/motion'
import { useTitle } from '../lib/seo'

const groups: [string, [string, string][]][] = [
  ['Orders & shipping', [
    ['How long does shipping take?', 'Standard delivery takes 3–5 business days. Express takes 1–2 business days for $15. Orders over $250 ship standard for free.'],
    ['Can I track my order?', 'Yes. A tracking link is emailed when your pair leaves the atelier.'],
  ]],
  ['Returns', [
    ['What is the return policy?', 'Return any pair within 14 days if it is unworn and in the original box.'],
    ['Are limited releases returnable?', 'Numbered releases can be exchanged for size, but not refunded, once the run has closed.'],
  ]],
  ['Sizing', [
    ['How do KRSH sizes run?', 'True to size in US men’s sizing. If you are between sizes, go up half a size. Boots run slightly narrow.'],
    ['What if my size is sold out?', 'Sold-out sizes are struck through. Join the letters list and we will tell you when a run is restocked.'],
  ]],
  ['Care & resoling', [
    ['How do I care for leather?', 'Brush after wear, condition monthly, and rest pairs for a day between wears with cedar trees.'],
    ['Do you resole?', 'Every pair can be resoled by the atelier. This is a fictional promise made for a demo.'],
  ]],
]

export default function Faq() {
  useTitle('Care & FAQ')
  return (
    <div className="wrap pt-40">
      <p className="eyebrow mb-4">Care & FAQ</p>
      <SplitReveal className="display text-[clamp(48px,8vw,120px)]" text="Good questions." />
      <div className="mt-24 space-y-24">
        {groups.map(([g, items]) => (
          <section key={g} className="grid gap-8 lg:grid-cols-[1fr_2fr]" aria-labelledby={g}>
            <h2 id={g} className="eyebrow !text-gold lg:pt-8">{g}</h2>
            <div className="border-t border-line">{items.map(([q, a], i) => <AccordionItem key={q} title={q} defaultOpen={i === 0 && g === groups[0][0]}><p>{a}</p></AccordionItem>)}</div>
          </section>
        ))}
      </div>
    </div>
  )
}

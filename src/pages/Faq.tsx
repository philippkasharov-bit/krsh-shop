import { AccordionItem } from '../components/Accordion'
import { SplitReveal } from '../lib/motion'
import { useTitle } from '../lib/seo'

const groups: [string, [string, string][]][] = [
  ['Orders & shipping', [
    ['How long does shipping take?', 'Standard delivery takes 3–5 business days. Express takes 1–2 business days for $15. Orders over $250 ship standard for free.'],
    ['Can I track my order?', 'Yes. A tracking link is emailed when your order leaves the studio.'],
  ]],
  ['Returns', [
    ['What is the return policy?', 'Return any piece within 14 days if it is unworn with tags on.'],
    ['Are numbered drops returnable?', 'Numbered drops can be exchanged for size, but not refunded, once the drop has closed.'],
  ]],
  ['Sizing', [
    ['How do Pragmatic Hippy sizes run?', 'Clothing runs XS–XL and most pieces are cut boxy: size down for a closer fit. Shoes are EU sizes; between sizes, go up one.'],
    ['What if my size is sold out?', 'Sold-out sizes are struck through. Join the list and we will tell you if a drop comes back.'],
  ]],
  ['Care', [
    ['How do I wash reflective and metallic pieces?', 'Cold, inside out, gentle cycle. Hang dry. No dryer, no iron: heat ruins reflective and foil finishes.'],
    ['Will UV-reactive prints fade?', 'They soften slowly with washing. Wash less, air more. This is a fictional promise made for a demo.'],
  ]],
]

export default function Faq() {
  useTitle('Care & FAQ')
  return (
    <div className="wrap pt-40">
      <p className="eyebrow mb-4">Care & FAQ</p>
      <SplitReveal className="display t-1" text="Good questions." />
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

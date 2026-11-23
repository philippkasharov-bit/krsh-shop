import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useTransform } from 'motion/react'
import { EASE_SNAP, Fade, SplitReveal } from '../lib/motion'
import { useBeat } from '../lib/beat'
import { useTitle } from '../lib/seo'

const stores = [
  { n: 'Berlin', a: 'Friedrichshain warehouse pop-up', h: 'Fri–Sat 22–06', x: 52, y: 26 },
  { n: 'London', a: 'Hackney Wick arches pop-up', h: 'Fri–Sat 21–05', x: 44, y: 24 },
  { n: 'New York', a: 'Bushwick loft pop-up', h: 'Sat 22–06', x: 18, y: 38 },
  { n: 'Tokyo', a: 'Shibuya basement pop-up', h: 'Fri–Sat 23–05', x: 86, y: 42 },
  { n: 'Ibiza', a: 'Sant Antoni sunset pop-up', h: 'Summer, daily 18–02', x: 46, y: 40 },
]

/** Stylised SVG map (no tile server) — pin pattern inspired by mapcn marker UI. */
export default function Ateliers() {
  useTitle('Pop-ups')
  const [sel, setSel] = useState(0)
  const beat = useBeat()
  const ripple = useTransform(beat, [0, 1], [3.2, 1])
  const rippleO = useTransform(beat, [0, 1], [0, 0.9])
  const [sent, setSent] = useState(false)
  const [e, setE] = useState('')
  const submit = (ev: FormEvent) => { ev.preventDefault(); if (/^\S+@\S+\.\S+$/.test(e)) setSent(true) }
  return (
    <div className="wrap pt-40">
      <p className="eyebrow mb-4">Pop-ups</p>
      <SplitReveal className="display t-1" text="Find us after dark." />
      <div className="mt-20 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-stretch">
        <Fade>
          <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[420px] border border-line bg-ink-2 overflow-hidden">
            <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
              {Array.from({ length: 11 }).map((_, i) => <line key={'v' + i} x1={i * 10} x2={i * 10} y1="0" y2="62" stroke="#f3eee6" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
              {Array.from({ length: 7 }).map((_, i) => <line key={'h' + i} y1={i * 10} y2={i * 10} x1="0" x2="100" stroke="#f3eee6" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}

            </svg>
            {stores.map((s, i) => (
              <motion.button key={s.n} onClick={() => setSel(i)} aria-label={`${s.n} pop-up`} aria-pressed={sel === i} data-cursor="Pin"
                initial={{ y: -40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.48, ease: EASE_SNAP, delay: i * 0.08 }}
                className="absolute -ml-5 -mt-5 grid h-10 w-10 place-items-center" style={{ left: `${s.x}%`, top: `${s.y * 1.6}%` }}>
                {sel === i && <motion.span aria-hidden className="absolute h-4 w-4 rounded-full border border-gold" style={{ scale: ripple, opacity: rippleO }} />}
                <span className={`block rounded-full transition-all duration-500 ${sel === i ? 'h-4 w-4 bg-gold shadow-[0_0_0_8px_rgb(212_166_74/0.2)]' : 'h-2.5 w-2.5 bg-ivory/70'}`} />
              </motion.button>
            ))}
            <AnimatePresence mode="wait"><motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }} className="absolute bottom-0 left-0 bg-ink/90 backdrop-blur p-6 max-w-xs">
              <p className="display text-3xl">{stores[sel].n}</p>
              <p className="text-sm text-ivory-dim mt-2">{stores[sel].a}</p><p className="eyebrow mt-3">{stores[sel].h}</p>
            </motion.div></AnimatePresence>
          </div>
        </Fade>
        <ul className="border-t border-line flex flex-col">
          {stores.map((s, i) => (
            <li key={s.n} className="border-b border-line flex-1">
              <button onClick={() => setSel(i)} className={`flex h-full w-full items-center justify-between py-5 text-left transition-colors ${sel === i ? 'text-gold' : ''}`}>
                <span className="display t-3">{s.n}</span><span className="eyebrow">{s.h}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="eyebrow mt-4">Fictional locations · Illustrative map</p>

      <section className="mt-section grid gap-16 lg:grid-cols-2">
        <div><h2 className="display t-2">Write to <em>us.</em></h2><p className="mt-6 text-ivory-dim max-w-sm">Questions about sizing, care or a drop? Demo form: nothing is sent.</p></div>
        <form onSubmit={submit} noValidate className="space-y-6">
          <div><label className="eyebrow" htmlFor="cn">Name</label><input id="cn" className="field" autoComplete="name" /></div>
          <div><label className="eyebrow" htmlFor="ce">Email</label><input id="ce" className="field" type="email" value={e} onChange={(x) => setE(x.target.value)} autoComplete="email" /></div>
          <div><label className="eyebrow" htmlFor="cm">Message</label><textarea id="cm" rows={4} className="field resize-none" /></div>
          <button className="btn btn-gold">Send message</button>
          <p role="status" className="text-sm text-ivory-dim">{sent ? 'Thank you. This is a demo, so no message was sent.' : ''}</p>
        </form>
      </section>
    </div>
  )
}

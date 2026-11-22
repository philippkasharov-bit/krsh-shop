import { useState, type FormEvent } from 'react'
import { Fade, SplitReveal } from '../lib/motion'
import { useTitle } from '../lib/seo'

const stores = [
  { n: 'Paris', a: '14 Rue du Faubourg', h: 'Tue–Sat 11–19', x: 49, y: 33 },
  { n: 'London', a: '8 Mount Street', h: 'Mon–Sat 10–18', x: 44, y: 24 },
  { n: 'New York', a: '62 Greene Street', h: 'Daily 11–19', x: 18, y: 38 },
  { n: 'Tokyo', a: '3-12 Jingumae', h: 'Daily 11–20', x: 86, y: 42 },
  { n: 'Dubai', a: 'Alserkal Avenue', h: 'Sat–Thu 12–20', x: 62, y: 55 },
]

/** Stylised SVG map (no tile server) — pin pattern inspired by mapcn marker UI. */
export default function Ateliers() {
  useTitle('Ateliers')
  const [sel, setSel] = useState(0)
  const [sent, setSent] = useState(false)
  const [e, setE] = useState('')
  const submit = (ev: FormEvent) => { ev.preventDefault(); if (/^\S+@\S+\.\S+$/.test(e)) setSent(true) }
  return (
    <div className="wrap pt-40">
      <p className="eyebrow mb-4">Ateliers</p>
      <SplitReveal className="display t-1" text="Visit the houses." />
      <div className="mt-20 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <Fade>
          <div className="relative aspect-[16/10] border border-line bg-ink-2 overflow-hidden">
            <svg viewBox="0 0 100 62" className="absolute inset-0 h-full w-full opacity-25" aria-hidden>
              {Array.from({ length: 11 }).map((_, i) => <line key={'v' + i} x1={i * 10} x2={i * 10} y1="0" y2="62" stroke="#f3eee6" strokeWidth=".1" />)}
              {Array.from({ length: 7 }).map((_, i) => <line key={'h' + i} y1={i * 10} y2={i * 10} x1="0" x2="100" stroke="#f3eee6" strokeWidth=".1" />)}
              <path d="M8 22c6-8 18-10 26-6 6 3 8 9 4 15-5 7-10 10-16 8-8-3-18-5-14-17zM42 14c8-4 16-2 20 3 5 6 2 12 4 20 1 7-4 14-10 16-7 2-9-6-10-12-1-8-8-8-8-16 0-5 0-8 4-11zM66 18c8-4 22-4 28 4 4 6 1 14-6 17-9 3-12-2-18-4-6-3-10-12-4-17z" fill="none" stroke="#f3eee6" strokeWidth=".25" />
            </svg>
            {stores.map((s, i) => (
              <button key={s.n} onClick={() => setSel(i)} aria-label={`${s.n} atelier`} aria-pressed={sel === i}
                className="absolute -translate-x-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center" style={{ left: `${s.x}%`, top: `${s.y * 1.6}%` }}>
                <span className={`block rounded-full transition-all duration-500 ${sel === i ? 'h-4 w-4 bg-gold shadow-[0_0_0_8px_rgb(201_169_106/0.2)]' : 'h-2.5 w-2.5 bg-ivory/70'}`} />
              </button>
            ))}
            <div className="absolute bottom-0 left-0 bg-ink/90 backdrop-blur p-6 max-w-xs">
              <p className="display text-3xl">{stores[sel].n}</p>
              <p className="text-sm text-ivory-dim mt-2">{stores[sel].a}</p><p className="eyebrow mt-3">{stores[sel].h}</p>
            </div>
          </div>
        </Fade>
        <ul className="border-t border-line self-start">
          {stores.map((s, i) => (
            <li key={s.n} className="border-b border-line">
              <button onClick={() => setSel(i)} className={`flex w-full items-baseline justify-between py-5 text-left transition-colors ${sel === i ? 'text-gold' : ''}`}>
                <span className="display text-3xl">{s.n}</span><span className="eyebrow">{s.h}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="eyebrow mt-4">Fictional locations · Illustrative map</p>

      <section className="mt-section grid gap-16 lg:grid-cols-2">
        <div><h2 className="display t-2">Write to <em>us.</em></h2><p className="mt-6 text-ivory-dim max-w-sm">Questions about sizing, care or a release? Demo form: nothing is sent.</p></div>
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

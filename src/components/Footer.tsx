import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'ok'>('idle')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setState(/^\S+@\S+\.\S+$/.test(email) ? 'ok' : 'error')
  }
  return (
    <footer className="border-t border-line mt-section">
      <div className="wrap py-24 grid gap-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="eyebrow mb-6">Newsletter</p>
          <p className="display t-3 max-w-md">Letters from <em>the atelier.</em></p>
          <form onSubmit={submit} noValidate className="mt-10 max-w-md">
            <label htmlFor="nl" className="eyebrow">Email address</label>
            <div className="flex items-end gap-4">
              <input id="nl" type="email" autoComplete="email" className="field" value={email}
                aria-invalid={state === 'error'} aria-describedby="nl-msg" onChange={(e) => { setEmail(e.target.value); setState('idle') }} />
              <button className="link-u mb-4 shrink-0" type="submit">Subscribe</button>
            </div>
            <p id="nl-msg" role="status" className={`mt-3 text-sm ${state === 'error' ? 'text-[#e58a80]' : 'text-ivory-dim'}`}>
              {state === 'ok' ? 'Thank you. This is a demo, so nothing was sent.' : state === 'error' ? 'Please enter a valid email address.' : 'Two letters a year. No hype.'}
            </p>
          </form>
        </div>
        <FooterCol title="Collection" items={[['/shop', 'All pieces'], ['/shop?line=flash', 'Flash'], ['/shop?line=street', 'Street'], ['/shop?line=y2k', 'Y2K'], ['/shop?line=gear', 'Gear']]} />
        <FooterCol title="House" items={[['/maison', 'Maison KRSH'], ['/ateliers', 'Ateliers'], ['/faq', 'Care & FAQ'], ['/wishlist', 'Saved pairs']]} />
        <div>
          <p className="eyebrow mb-6">About this site</p>
          <p className="text-sm text-ivory-dim leading-relaxed">KRSH is a fictional brand and a front-end portfolio build. Products, reviews and stores are invented. There is no backend, payment or shipping.</p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="wrap py-6 flex flex-wrap justify-between gap-4 eyebrow">
          <span>© 2026 KRSH Maison — Demo</span>
          <span>Fictional brand</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <p className="eyebrow mb-6">{title}</p>
      <ul className="text-[15px]">
        {items.map(([to, l]) => <li key={to}><Link to={to} className="inline-block py-2.5 hover:text-gold transition-colors">{l}</Link></li>)}
      </ul>
    </div>
  )
}

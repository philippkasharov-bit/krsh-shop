import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { FREE_SHIPPING_AT, money } from '../lib/products'
import { useTitle } from '../lib/seo'

type F = Record<string, string>
const rules: Record<string, [RegExp, string]> = {
  email: [/^\S+@\S+\.\S+$/, 'Enter a valid email address.'],
  name: [/\S+\s+\S+/, 'Enter first and last name.'],
  address: [/\S{3,}/, 'Enter your street address.'],
  city: [/\S{2,}/, 'Enter your city.'],
  zip: [/^[A-Za-z0-9 -]{3,10}$/, 'Enter a valid postal code.'],
  card: [/^(\d[ -]?){13,19}$/, 'Enter a valid card number (demo: any 16 digits).'],
  exp: [/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/, 'Use MM / YY.'],
  cvc: [/^\d{3,4}$/, '3 or 4 digits.'],
}

export default function Checkout() {
  useTitle('Checkout')
  const { lines, subtotal, clear } = useStore()
  const [f, setF] = useState<F>({ ship: 'standard' })
  const [errs, setErrs] = useState<F>({})
  const [order, setOrder] = useState<string | null>(null)
  const express = f.ship === 'express' ? 15 : 0
  const total = subtotal + express

  useEffect(() => { if (order) (window as unknown as { __lenis?: { scrollTo: (n: number, o: object) => void } }).__lenis?.scrollTo(0, { immediate: true }) ?? window.scrollTo(0, 0) }, [order])

  const check = (k: string, v: string) => (rules[k][0].test(v.trim()) ? '' : rules[k][1])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: F = {}
    Object.keys(rules).forEach((k) => { const m = check(k, f[k] ?? ''); if (m) next[k] = m })
    setErrs(next)
    if (Object.keys(next).length) { document.getElementById(Object.keys(next)[0])?.focus(); return }
    setOrder('KR-' + Math.random().toString(36).slice(2, 8).toUpperCase())
    clear()
  }

  if (order) return (
    <div className="wrap pt-44 text-center max-w-2xl">
      <p className="eyebrow text-gold">Order {order}</p>
      <h1 className="display t-1 mt-4">Thank <em>you.</em></h1>
      <p className="mt-6 text-ivory-dim leading-relaxed">This was a demonstration. No payment was taken and nothing will ship, but this is the confirmation a real order would receive.</p>
      <Link to="/shop" className="btn btn-gold mt-10">Continue browsing</Link>
    </div>
  )
  if (lines.length === 0) return (
    <div className="wrap pt-44 text-center">
      <h1 className="display t-1">Your bag is empty.</h1>
      <Link to="/shop" className="btn btn-gold mt-10">Browse the collection</Link>
    </div>
  )

  const input = (k: string, label: string, props: Record<string, string> = {}) => (
    <div className={props.span === '2' ? 'sm:col-span-2' : ''}>
      <label htmlFor={k} className="eyebrow">{label}</label>
      <input id={k} className="field" value={f[k] ?? ''} aria-invalid={!!errs[k]} aria-describedby={errs[k] ? `${k}-e` : undefined}
        onChange={(e) => { setF({ ...f, [k]: e.target.value }); if (errs[k]) setErrs({ ...errs, [k]: '' }) }}
        onBlur={() => f[k] !== undefined && setErrs({ ...errs, [k]: check(k, f[k]) })}
        autoComplete={props.ac} inputMode={props.mode as 'numeric' | undefined} placeholder={props.ph} />
      <p id={`${k}-e`} className="mt-1 h-5 text-sm text-[#e58a80]" role="alert">{errs[k]}</p>
    </div>
  )

  return (
    <div className="wrap pt-36 grid gap-16 lg:grid-cols-[1.3fr_1fr]">
      <form onSubmit={submit} noValidate>
        <Link to="/shop" className="link-u nav-u">← Continue shopping</Link>
        <h1 className="display t-1 mt-8">Checkout</h1>
        <p className="mt-4 border border-gold/40 bg-gold/5 p-4 text-sm text-ivory-dim">Demo store. Please do not enter real payment details. Any 16-digit number works.</p>

        <fieldset className="mt-14 grid gap-x-8 sm:grid-cols-2">
          <legend className="display text-3xl mb-6"><span className="text-gold mr-3">01</span>Contact</legend>
          {input('email', 'Email', { ac: 'email', span: '2' })}
        </fieldset>
        <fieldset className="mt-8 grid gap-x-8 sm:grid-cols-2">
          <legend className="display text-3xl mb-6"><span className="text-gold mr-3">02</span>Delivery</legend>
          {input('name', 'Full name', { ac: 'name', span: '2' })}
          {input('address', 'Address', { ac: 'street-address', span: '2' })}
          {input('city', 'City', { ac: 'address-level2' })}
          {input('zip', 'Postal code', { ac: 'postal-code' })}
          <div className="sm:col-span-2 grid gap-px bg-line border border-line mt-2" role="radiogroup" aria-label="Shipping method">
            {[['standard', 'Standard · 3–5 days', subtotal >= FREE_SHIPPING_AT ? 'Free' : 'Free (demo)'], ['express', 'Express · 1–2 days', '$15']].map(([v, l, pr]) => (
              <label key={v} className={`flex cursor-pointer items-center justify-between p-5 ${f.ship === v ? 'bg-ink-3' : 'bg-ink'}`}>
                <span className="flex items-center gap-4"><input type="radio" name="ship" checked={f.ship === v} onChange={() => setF({ ...f, ship: v })} className="accent-[#c9a96a]" />{l}</span><span className="font-mono text-sm">{pr}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-14 grid gap-x-8 sm:grid-cols-2">
          <legend className="display text-3xl mb-6"><span className="text-gold mr-3">03</span>Payment</legend>
          {input('card', 'Card number', { ac: 'cc-number', mode: 'numeric', ph: '0000 0000 0000 0000', span: '2' })}
          {input('exp', 'Expiry', { ac: 'cc-exp', ph: 'MM / YY' })}
          {input('cvc', 'CVC', { ac: 'cc-csc', mode: 'numeric' })}
        </fieldset>
        <button className="btn btn-gold w-full mt-10" type="submit">Place order — {money(total)}</button>
      </form>

      <aside className="lg:sticky lg:top-28 self-start border border-line p-8" aria-label="Order summary">
        <h2 className="display text-3xl">Summary</h2>
        <ul className="mt-6 divide-y divide-line">
          {lines.map(({ product: p, size, qty }) => (
            <li key={`${p.id}-${size}`} className="flex gap-4 py-4">
              <img src={`/${p.img}`} alt="" className="h-20 w-20 object-cover" />
              <div className="flex-1"><p className="display text-lg">{p.name}</p><p className="eyebrow">US {size} · Qty {qty}</p></div>
              <p className="font-mono text-sm">{money(p.price * qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
          <div className="flex justify-between"><dt className="text-ivory-dim">Subtotal</dt><dd className="font-mono">{money(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ivory-dim">Shipping</dt><dd className="font-mono">{express ? money(express) : 'Free'}</dd></div>
          <div className="flex justify-between border-t border-line pt-4 text-base"><dt>Total</dt><dd className="font-mono text-gold">{money(total)}</dd></div>
        </dl>
      </aside>
    </div>
  )
}

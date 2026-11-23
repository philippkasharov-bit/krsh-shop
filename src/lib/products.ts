import raw from '../data/products.json'

export type Line = 'flash' | 'street' | 'y2k' | 'gear'
export type Kind = 'apparel' | 'shoe' | 'onesize'
export type Accent = 'red' | 'orange' | 'acid' | 'blue' | 'pink'
export type LogoSpot = 'back' | 'chest' | 'lower-back' | 'thigh' | 'heel' | 'front' | 'temple'
export const ACCENT_HEX: Record<Accent, string> = {
  red: '#e0352b', orange: '#ff7a1a', acid: '#d7ff3a', blue: '#2f6bff', pink: '#ff3d9a',
}
export interface Product {
  id: number; name: string; price: number; line: Line; kind: Kind
  badge: 'new' | 'limited' | null; img: string
  color: string; sku: string; stock: number; desc: string
  materials: string[]; fit?: string
  base: string; accent: Accent; logo: LogoSpot
}

export const products = raw as unknown as Product[]
export const bySlug = (slug: string) => products.find((p) => slugOf(p) === slug)
export const slugOf = (p: Product) => p.name.toLowerCase().replace(/\s+/g, '-')
export const LINES: Line[] = ['flash', 'street', 'y2k', 'gear']
export const lineLabel: Record<Line, string> = {
  flash: 'Flash', street: 'Street', y2k: 'Y2K', gear: 'Gear',
}
export const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL']
export const SHOE_SIZES = Array.from({ length: 11 }, (_, i) => String(36 + i))
export const sizesFor = (p: Product): string[] =>
  p.kind === 'apparel' ? APPAREL_SIZES : p.kind === 'shoe' ? SHOE_SIZES : ['One size']
/** Deterministic "sold out" sizes so the UI can demonstrate that state. */
export const soldOut = (p: Product, size: string) =>
  p.kind !== 'onesize' && (p.id * 7 + sizesFor(p).indexOf(size) * 3) % 11 === 0
export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
export const FREE_SHIPPING_AT = 250

/** Drop mark for limited releases. */
export const edition = (p: Product) => (p.badge === 'limited' ? 'Drop of 200' : null)

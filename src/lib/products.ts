import raw from '../data/products.json'

export type Category = 'low' | 'high' | 'boot' | 'runner'
export interface Review { author: string; stars: number; text: string; date: string }
export interface Product {
  id: number; name: string; price: number; category: Category
  badge: 'new' | 'limited' | null; img: string; model?: string
  new: boolean; color: string; sku: string; stock: number; desc: string
  materials: string[]; rating: number; reviewCount: number; reviews: Review[]
}

export const products = raw as unknown as Product[]
export const bySlug = (slug: string) => products.find((p) => slugOf(p) === slug)
export const slugOf = (p: Product) => p.name.toLowerCase().replace(/\s+/g, '-')
export const categoryLabel: Record<Category, string> = {
  low: 'Low tops', high: 'High tops', boot: 'Boots', runner: 'Runners',
}
export const SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13]
/** Deterministic "sold out" sizes so the UI can demonstrate that state. */
export const soldOut = (p: Product, size: number) => (p.id * 7 + size * 3) % 11 === 0
export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
export const FREE_SHIPPING_AT = 250

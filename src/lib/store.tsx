import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { products, sizesFor, type Product } from "./products"

export interface CartLine { id: number; size: string; qty: number }
interface Ctx {
  lines: { product: Product; size: string; qty: number }[]
  count: number; subtotal: number
  add: (id: number, size: string) => void
  setQty: (id: number, size: string, qty: number) => void
  remove: (id: number, size: string) => void
  clear: () => void
  wish: number[]; toggleWish: (id: number) => void
  drawer: boolean; setDrawer: (v: boolean) => void
}
/** Drop cart lines whose product or size no longer exists (old catalog, tampered storage). */
export function sanitizeCart(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((l): l is CartLine => {
    if (!l || typeof l !== "object") return false
    const p = products.find((x) => x.id === (l as CartLine).id)
    return !!p && sizesFor(p).includes((l as CartLine).size) && Number.isInteger((l as CartLine).qty)
  }).map(({ id, size, qty }) => ({ id, size, qty: Math.max(1, Math.min(9, qty)) }))
}
export function sanitizeWish(raw: unknown): number[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((id): id is number => products.some((p) => p.id === id))
}
const StoreCtx = createContext<Ctx | null>(null)

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback } catch { return fallback }
}
function save(key: string, v: unknown) { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage unavailable */ } }

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => sanitizeCart(load<unknown>("ph-cart", [])))
  const [wish, setWish] = useState<number[]>(() => sanitizeWish(load<unknown>("ph-wish", [])))
  const [drawer, setDrawer] = useState(false)
  useEffect(() => save('ph-cart', cart), [cart])
  useEffect(() => save('ph-wish', wish), [wish])

  const add = useCallback((id: number, size: string) => {
    setCart((c) => {
      const i = c.findIndex((l) => l.id === id && l.size === size)
      if (i >= 0) return c.map((l, j) => (j === i ? { ...l, qty: Math.min(l.qty + 1, 9) } : l))
      return [...c, { id, size, qty: 1 }]
    })
    setDrawer(true)
  }, [])
  const setQty = useCallback((id: number, size: string, qty: number) =>
    setCart((c) => c.map((l) => (l.id === id && l.size === size ? { ...l, qty: Math.max(1, Math.min(9, qty)) } : l))), [])
  const remove = useCallback((id: number, size: string) =>
    setCart((c) => c.filter((l) => !(l.id === id && l.size === size))), [])
  const clear = useCallback(() => setCart([]), [])
  const toggleWish = useCallback((id: number) =>
    setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])), [])

  const value = useMemo<Ctx>(() => {
    const lines = cart.flatMap((l) => {
      const product = products.find((p) => p.id === l.id)
      return product ? [{ product, size: l.size, qty: l.qty }] : []
    })
    return {
      lines, count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.product.price, 0),
      add, setQty, remove, clear, wish, toggleWish, drawer, setDrawer,
    }
  }, [cart, wish, drawer, add, setQty, remove, clear, toggleWish])

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}
export const useStore = () => {
  const c = useContext(StoreCtx)
  if (!c) throw new Error('StoreProvider missing')
  return c
}

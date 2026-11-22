import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { products, categoryLabel, type Category } from '../lib/products'
import ProductCard from '../components/ProductCard'
import { SplitReveal } from '../lib/motion'
import { useTitle } from '../lib/seo'

const SORTS = { featured: 'Featured', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low', new: 'Newest' } as const
type Sort = keyof typeof SORTS
const cats: ('all' | Category)[] = ['all', 'low', 'high', 'boot', 'runner']

export default function Shop() {
  useTitle('Collection')
  const [params, setParams] = useSearchParams()
  const cat = (params.get('cat') as Category | null) ?? 'all'
  const sort = (params.get('sort') as Sort | null) ?? 'featured'
  const [q, setQ] = useState('')
  const [dense, setDense] = useState(false)

  const set = (k: string, v: string) => {
    const n = new URLSearchParams(params)
    if (v === 'all' || v === 'featured') n.delete(k); else n.set(k, v)
    setParams(n, { replace: true })
  }

  const list = useMemo(() => {
    let l = products.filter((p) => (cat === 'all' || p.category === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase()))
    if (sort === 'price-asc') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'new') l = [...l].sort((a, b) => Number(b.new) - Number(a.new))
    return l
  }, [cat, sort, q])

  return (
    <div className="wrap pt-40">
      <p className="eyebrow mb-4">The collection</p>
      <SplitReveal className="display t-1" text="All footwear." />

      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-y border-line py-5 sticky top-[72px] z-30 bg-ink/85 backdrop-blur-xl">
        <div className="flex flex-wrap gap-x-8 gap-y-2" role="group" aria-label="Filter by silhouette">
          {cats.map((c) => (
            <button key={c} aria-pressed={cat === c} onClick={() => set('cat', c)}
              className={`link-u ${cat === c ? 'text-gold' : 'text-ivory-dim'}`}>{c === 'all' ? 'All' : categoryLabel[c]}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <label className="sr-only" htmlFor="q">Search</label>
          <input id="q" className="field !w-40 !py-1 !text-sm" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          <label className="sr-only" htmlFor="sort">Sort</label>
          <select id="sort" value={sort} onChange={(e) => set('sort', e.target.value)} className="bg-transparent text-[12px] tracking-[0.18em] uppercase outline-none">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k} className="bg-ink">{v}</option>)}
          </select>
          <button className="link-u hidden sm:block" aria-pressed={dense} onClick={() => setDense(!dense)}>{dense ? '3 up' : '4 up'}</button>
        </div>
      </div>

      <p className="eyebrow mt-6" role="status">{list.length} {list.length === 1 ? 'pair' : 'pairs'}</p>

      {list.length === 0 ? (
        <div className="py-32 text-center">
          <p className="display text-4xl">Nothing matches.</p>
          <button className="btn mt-8" onClick={() => { setQ(''); set('cat', 'all') }}>Clear filters</button>
        </div>
      ) : (
        <motion.div layout className={`mt-10 grid gap-x-8 gap-y-20 sm:grid-cols-2 ${dense ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => <ProductCard key={p.id} p={p} index={i} tall={!dense} />)}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

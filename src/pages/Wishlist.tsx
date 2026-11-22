import { Link } from 'react-router-dom'
import { products } from '../lib/products'
import { useStore } from '../lib/store'
import ProductCard from '../components/ProductCard'
import { useTitle } from '../lib/seo'

export default function Wishlist() {
  useTitle('Saved pairs')
  const { wish } = useStore()
  const list = products.filter((p) => wish.includes(p.id))
  return (
    <div className="wrap pt-40">
      <p className="eyebrow mb-4">Saved</p>
      <h1 className="display t-1">Your <em>shortlist.</em></h1>
      {list.length === 0 ? (
        <div className="py-28">
          <p className="display text-4xl">Nothing saved yet.</p>
          <p className="mt-4 text-ivory-dim">Tap the heart on any pair to keep it here.</p>
          <Link to="/shop" className="btn btn-gold mt-10">Browse the collection</Link>
        </div>
      ) : (
        <div className="mt-16 grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">{list.map((p, i) => <ProductCard key={p.id} p={p} index={i} tall />)}</div>
      )}
    </div>
  )
}

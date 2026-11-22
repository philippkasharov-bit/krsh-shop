import { Link } from 'react-router-dom'
import { useTitle } from '../lib/seo'
export default function NotFound() {
  useTitle('Not found')
  return (
    <div className="wrap min-h-[100svh] grid place-content-center text-center pt-24">
      <p className="eyebrow">Error 404</p>
      <h1 className="display text-[clamp(64px,14vw,200px)] mt-4">Off <em>the path.</em></h1>
      <p className="mt-6 text-ivory-dim">That page has walked away. The collection hasn’t.</p>
      <Link to="/shop" className="btn btn-gold mt-10 mx-auto">Back to the collection</Link>
    </div>
  )
}

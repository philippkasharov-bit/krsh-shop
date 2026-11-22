import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import NotFound from './pages/NotFound'

const Product = lazy(() => import('./pages/Product'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Maison = lazy(() => import('./pages/Maison'))
const Ateliers = lazy(() => import('./pages/Ateliers'))
const Faq = lazy(() => import('./pages/Faq'))

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-[100svh]" />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="shop/:slug" element={<Product />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="maison" element={<Maison />} />
              <Route path="ateliers" element={<Ateliers />} />
              <Route path="faq" element={<Faq />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </StoreProvider>
  )
}

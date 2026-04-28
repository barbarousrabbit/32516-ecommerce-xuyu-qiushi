// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { useState, useMemo } from 'react'
import { useSearch } from '../hooks/useSearch'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name',       label: 'Name: A–Z' },
]

function Footer() {
  return (
    <footer className="bg-surface-container-low w-full h-[48px] border-t border-surface-variant mt-auto">
      <div className="flex flex-row justify-center items-center gap-8 px-4 w-full h-full">
        <span className="font-heading font-bold text-primary">ShopCart</span>
        <span className="font-body text-sm text-on-surface-variant">© 2026 ShopCart. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default function HomePage() {
  const { query, setQuery, products, loading, error } = useSearch()
  const [sortBy, setSortBy] = useState('featured')

  const displayed = useMemo(() => {
    const arr = [...products]
    if (sortBy === 'price_asc')  arr.sort((a, b) => Number(a.price) - Number(b.price))
    if (sortBy === 'price_desc') arr.sort((a, b) => Number(b.price) - Number(a.price))
    if (sortBy === 'name')       arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [products, sortBy])

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-container mx-auto w-full px-gutter py-[48px]">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-[40px] gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="font-heading font-bold text-[28px] text-on-background tracking-tight">Products</h1>
            <span className="font-body text-body-md text-on-surface-variant">
              ({displayed.length} {query ? `result${displayed.length !== 1 ? 's' : ''} for "${query}"` : 'items'})
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Mobile search */}
            <input
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search products"
              className="md:hidden flex-1 input-base"
            />
            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="font-body text-body-sm font-medium text-on-surface bg-surface-container-highest border border-outline-variant px-3 py-1.5 rounded-full hover:bg-surface-variant focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-error font-body text-body-md mb-6">{error}</p>}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-surface-container rounded-[16px] aspect-square animate-pulse" />
            ))}
          </div>
        )}

        {!loading && (
          displayed.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-heading text-h3 text-on-surface-variant mb-2">No products found.</p>
              <p className="font-body text-body-md text-on-surface-variant">Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {displayed.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  )
}

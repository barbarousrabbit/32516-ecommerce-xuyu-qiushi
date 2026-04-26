// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { ShoppingCart, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { addToCart } from '../services/cartService'
import { useSearch } from '../hooks/useSearch'
import Navbar from '../components/Navbar'

function ProductCard({ product }) {
  const { user } = useAuth()
  const inStock = product.stock > 0

  async function handleAdd() {
    if (!user) {
      alert('Please login to add items to cart')
      return
    }
    try {
      await addToCart(product.id)
    } catch (err) {
      alert(err.message)
    }
  }

  if (!inStock) {
    return (
      <div className="bg-surface-container-lowest rounded-[16px] shadow-amber border border-outline-variant/10 overflow-hidden flex flex-col opacity-75">
        <div className="relative aspect-square overflow-hidden bg-surface-variant">
          {product.image_url
            ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover grayscale" />
            : <div className="w-full h-full bg-surface-container-high" />
          }
          <div className="absolute inset-0 bg-surface-container-lowest/30 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-full text-[12px] font-heading font-bold uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          </div>
        </div>
        <div className="p-lg flex flex-col flex-grow">
          <h3 className="font-heading font-semibold text-[18px] text-on-surface-variant leading-tight mb-2">{product.name}</h3>
          <p className="font-body text-body-lg text-on-surface-variant font-bold mb-4">${product.price}</p>
          <div className="mt-auto">
            <button disabled className="w-full bg-surface-container-highest text-on-surface-variant font-heading text-button py-3 rounded-lg cursor-not-allowed">
              Unavailable
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="product-card group">
      <div className="relative aspect-square overflow-hidden bg-surface-variant">
        {product.image_url
          ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full bg-surface-container-high" />
        }
      </div>
      <div className="p-lg flex flex-col flex-grow">
        <h3 className="font-heading font-semibold text-[18px] text-on-surface leading-tight mb-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-4">
          <p className="font-body text-body-lg text-primary font-bold">${product.price}</p>
          <span className="font-body text-body-sm text-on-surface-variant">• {product.stock} in stock</span>
        </div>
        <div className="mt-auto">
          <button
            onClick={handleAdd}
            className="w-full bg-primary text-on-primary font-heading text-button py-3 rounded-lg shadow-sm border-t border-white/20 hover:bg-surface-tint active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-[#FDFBF7] w-full h-[48px] border-t border-surface-variant mt-auto">
      <div className="flex flex-row justify-center items-center gap-8 px-4 w-full h-full">
        <span className="font-heading font-bold text-primary">ShopCart</span>
        <span className="font-body text-sm text-on-surface-variant">© 2026 ShopCart. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default function HomePage() {
  const { query, setQuery, products, loading, error } = useSearch()

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-container mx-auto w-full px-gutter py-[48px]">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-[40px] gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="font-heading font-bold text-[28px] text-on-background tracking-tight">Products</h1>
            <span className="font-body text-body-md text-on-surface-variant">
              ({products.length} {query ? `result${products.length !== 1 ? 's' : ''} for "${query}"` : 'items'})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-body text-body-sm text-on-surface-variant">Sort:</span>
            <button className="flex items-center gap-1 font-body text-body-sm font-medium text-on-surface bg-surface-container-highest px-3 py-1.5 rounded-full hover:bg-surface-variant transition-colors cursor-pointer">
              Featured
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* Search bar (mobile — shown below toolbar on small screens) */}
        <div className="md:hidden mb-6">
          <input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input-base"
          />
        </div>

        {/* Hidden desktop search in toolbar synced with navbar */}
        {/* (Navbar has its own search on desktop) */}

        {/* States */}
        {error && (
          <p className="text-error font-body text-body-md mb-6">{error}</p>
        )}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-surface-container rounded-[16px] aspect-square animate-pulse" />
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-heading text-h3 text-on-surface-variant mb-2">No products found.</p>
                <p className="font-body text-body-md text-on-surface-variant">Try a different search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

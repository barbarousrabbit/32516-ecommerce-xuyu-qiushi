// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { addToCart } from '../services/cartService'

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const [feedback, setFeedback] = useState('')
  const inStock = product.stock > 0

  async function handleAdd() {
    if (!user) {
      setFeedback('Please login to add items.')
      setTimeout(() => setFeedback(''), 2500)
      return
    }
    try {
      await addToCart(product.id)
      setFeedback('Added!')
      setTimeout(() => setFeedback(''), 2000)
    } catch (err) {
      setFeedback(err.message || 'Failed to add.')
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  if (!inStock) {
    return (
      <div className="bg-surface-container-lowest rounded-[16px] shadow-amber border border-outline-variant/10 overflow-hidden flex flex-col opacity-75">
        <div className="relative aspect-square overflow-hidden bg-surface-variant">
          {product.image_url
            ? <img src={product.image_url} alt={product.name} loading="lazy" width="400" height="400" className="w-full h-full object-cover grayscale" />
            : <div className="w-full h-full bg-surface-container-high" />
          }
          <div className="absolute inset-0 bg-surface-container-lowest/30 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-full text-[12px] font-heading font-bold uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          </div>
        </div>
        <div className="p-lg flex flex-col flex-grow">
          <h3 className="font-heading font-semibold text-[18px] text-on-surface-variant leading-tight mb-2">
            {product.name}
          </h3>
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
          ? <img src={product.image_url} alt={product.name} loading="lazy" width="400" height="400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full bg-surface-container-high" />
        }
      </div>
      <div className="p-lg flex flex-col flex-grow">
        <h3 className="font-heading font-semibold text-[18px] text-on-surface leading-tight mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <p className="font-body text-body-lg text-primary font-bold">${product.price}</p>
          <span className="font-body text-body-sm text-on-surface-variant">• {product.stock} in stock</span>
        </div>
        <div className="mt-auto space-y-1">
          <button
            onClick={handleAdd}
            className="w-full bg-primary text-on-primary font-heading text-button py-3 rounded-lg shadow-sm border-t border-white/20 hover:bg-surface-tint active:scale-[0.98] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {feedback === 'Added!' ? 'Added ✓' : 'Add to Cart'}
          </button>
          {feedback && feedback !== 'Added!' && (
            <p className="text-body-sm font-body text-error text-center">{feedback}</p>
          )}
        </div>
      </div>
    </div>
  )
}

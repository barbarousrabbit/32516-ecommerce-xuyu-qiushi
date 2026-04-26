// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668900)
// TODO: Replace with Stitch-generated design once cart HTML is obtained
import { useState, useEffect } from 'react'
import { Trash2, Minus, Plus, ShoppingBag, Lock } from 'lucide-react'
import { getMyCart, updateCartItem, removeCartItem } from '../services/cartService'
import Navbar from '../components/Navbar'

function Footer() {
  return (
    <footer className="bg-[#FDFBF7] w-full h-[48px] border-t border-surface-variant mt-auto">
      <div className="flex justify-center items-center h-full">
        <span className="font-body text-sm text-on-surface-variant">© 2026 ShopCart. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default function CartPage() {
  const [cart, setCart]     = useState(null)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setCart(await getMyCart())
    } catch (err) {
      setError(err.message || 'Failed to load cart.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleUpdate(itemId, qty) {
    try { setCart(await updateCartItem(itemId, qty)) }
    catch (err) { setError(err.message) }
  }

  async function handleRemove(itemId) {
    try { await removeCartItem(itemId); load() }
    catch (err) { setError(err.message) }
  }

  const subtotal = cart?.items?.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0) ?? 0
  const tax      = subtotal * 0.08
  const total    = subtotal + tax

  return (
    <div className="bg-background min-h-screen flex flex-col font-body text-on-surface">
      <Navbar />

      <main className="flex-grow max-w-container mx-auto w-full px-gutter py-[48px]">
        {/* Breadcrumb */}
        <p className="font-body text-body-sm text-on-surface-variant mb-4">Home / Shopping Cart</p>

        <h1 className="font-heading font-bold text-[32px] text-on-surface mb-6">
          My Cart
          {cart?.items?.length > 0 && (
            <span className="font-body text-body-md text-on-surface-variant font-normal ml-3">
              ({cart.items.length} item{cart.items.length !== 1 ? 's' : ''})
            </span>
          )}
        </h1>

        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg mb-6 font-body text-body-sm">
            {error}
          </div>
        )}

        {loading && <p className="font-body text-body-md text-on-surface-variant">Loading cart…</p>}

        {!loading && cart?.items?.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="text-on-surface-variant/40 mx-auto mb-4" />
            <h2 className="font-heading text-h3 text-on-surface-variant mb-2">Your cart is empty</h2>
            <p className="font-body text-body-md text-on-surface-variant mb-6">Add some items to get started.</p>
            <a href="/" className="btn-primary inline-block">Continue Shopping</a>
          </div>
        )}

        {!loading && cart?.items?.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Items */}
            <div className="flex-1 bg-surface-container-lowest rounded-2xl shadow-amber overflow-hidden">
              {cart.items.map((item, idx) => (
                <div key={item.id} className={`flex items-center gap-4 p-6 ${idx < cart.items.length - 1 ? 'border-b border-surface-container' : ''}`}>
                  {/* Image */}
                  <div className="w-[72px] h-[72px] rounded-lg overflow-hidden bg-surface-variant flex-shrink-0">
                    {item.product.image_url
                      ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-surface-container-high" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-heading font-semibold text-on-surface">{item.product.name}</p>
                    <p className="font-body text-body-sm text-on-surface-variant">@ ${item.product.price} each</p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdate(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-heading font-semibold text-on-surface">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdate(item.id, item.quantity + 1)}
                      className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Line total */}
                  <p className="font-heading font-bold text-[18px] text-primary w-24 text-right">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-error-container/20 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Right: Summary */}
            <div className="w-full lg:w-[340px]">
              <div className="bg-surface-container-lowest rounded-2xl shadow-amber p-6 sticky top-24">
                <h2 className="font-heading font-semibold text-[20px] text-on-surface mb-4 pb-4 border-b border-surface-container">
                  Order Summary
                </h2>
                <div className="space-y-3 font-body text-body-md">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Subtotal ({cart.items.length} items)</span>
                    <span className="text-on-surface">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Tax (8%)</span>
                    <span className="text-on-surface">${tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-surface-container-highest mt-4 pt-4 flex justify-between font-heading font-bold text-[22px]">
                  <span>Total</span>
                  <span className="text-on-surface">${total.toFixed(2)}</span>
                </div>
                <button className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                  Proceed to Checkout
                </button>
                <div className="flex items-center justify-center gap-2 mt-3 text-on-surface-variant">
                  <Lock size={14} />
                  <span className="font-body text-body-sm">Secure, encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

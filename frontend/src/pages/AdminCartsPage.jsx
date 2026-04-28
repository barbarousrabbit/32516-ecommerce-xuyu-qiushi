// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react'
import { getAllCarts } from '../services/cartService'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminCartsPage() {
  const [carts, setCarts]       = useState([])
  const [error, setError]       = useState('')
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    getAllCarts()
      .then(setCarts)
      .catch(() => setError('Failed to load carts.'))
  }, [])

  const totalItems    = carts.reduce((s, c) => s + (c.cart?.items?.length ?? 0), 0)
  const combinedValue = carts.reduce((s, c) => {
    const t = c.cart?.items?.reduce((cs, i) => cs + Number(i.product.price) * i.quantity, 0) ?? 0
    return s + t
  }, 0)

  return (
    <div className="flex min-h-screen bg-admin-bg font-body text-admin-text">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto overflow-x-auto min-w-0">
        <h1 className="font-heading font-bold text-2xl text-admin-text mb-6">All Carts</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            ['Total Carts',    carts.length,                   'text-admin-primary'],
            ['Total Items',    totalItems,                      'text-sky-600'],
            ['Combined Value', `$${combinedValue.toFixed(2)}`, 'text-primary'],
          ].map(([label, value, color]) => (
            <div key={label} className="bg-white rounded-xl shadow-admin p-5">
              <p className="font-body text-body-sm text-admin-muted mb-1">{label}</p>
              <p className={`font-heading font-bold text-2xl ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <div className="space-y-3">
          {carts.map(({ user_id, username, cart }) => {
            const items     = cart?.items ?? []
            const cartTotal = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0)
            const isOpen    = expanded[user_id]

            return (
              <div key={user_id} className="bg-white rounded-xl shadow-admin overflow-hidden">
                <div
                  role={items.length > 0 ? 'button' : undefined}
                  tabIndex={items.length > 0 ? 0 : undefined}
                  aria-expanded={items.length > 0 ? isOpen : undefined}
                  aria-label={items.length > 0 ? `${username}'s cart — ${items.length} items` : undefined}
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-admin-bg/30 transition-colors border-b border-admin-border/50"
                  onClick={() => items.length > 0 && setExpanded(p => ({ ...p, [user_id]: !p[user_id] }))}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && items.length > 0 && setExpanded(p => ({ ...p, [user_id]: !p[user_id] }))}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-heading font-bold">
                      {username?.[0]?.toUpperCase()}
                    </div>
                    <p className="font-heading font-semibold text-admin-text">{username}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-admin-badge-blue-bg text-admin-badge-blue-text text-xs font-heading font-bold px-2.5 py-1 rounded-full">
                      {items.length} item{items.length !== 1 ? 's' : ''}
                    </span>
                    <span className="font-heading font-bold text-[18px] text-admin-primary">${cartTotal.toFixed(2)}</span>
                    {items.length > 0 && (
                      isOpen ? <ChevronUp size={18} className="text-admin-muted" /> : <ChevronDown size={18} className="text-admin-muted" />
                    )}
                  </div>
                </div>

                {isOpen && items.length > 0 && (
                  <div className="bg-admin-bg/40 divide-y divide-admin-border/30">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 px-6 py-3">
                        <div className="w-9 h-9 rounded bg-white flex-shrink-0 overflow-hidden">
                          {item.product.image_url
                            ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                            : <ShoppingCart size={20} className="text-admin-muted m-auto mt-1.5" />
                          }
                        </div>
                        <span className="flex-1 font-body text-body-sm text-admin-text font-medium">{item.product.name}</span>
                        <span className="font-body text-body-sm text-admin-muted">@ ${item.product.price}</span>
                        <span className="font-body text-body-sm text-admin-primary">×{item.quantity}</span>
                        <span className="font-heading font-semibold text-sm text-admin-primary w-20 text-right">
                          ${(Number(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="px-6 py-3 text-right">
                      <span className="font-heading font-semibold text-sm text-admin-primary">
                        Cart Total: ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {items.length === 0 && (
                  <p className="px-6 py-4 font-body text-body-sm text-admin-muted italic">
                    This user has no items in their cart.
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {carts.length === 0 && !error && (
          <div className="text-center py-12 text-admin-muted">No carts found.</div>
        )}
      </main>
    </div>
  )
}

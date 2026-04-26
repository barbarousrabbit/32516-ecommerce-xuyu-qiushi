// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
// TODO: Replace with Stitch-generated design (Prompt B — Admin Products screen)
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Package, CheckCircle, XCircle } from 'lucide-react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'

function Sidebar({ active }) {
  const items = [
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Users',    href: '/admin/users',    icon: null },
    { label: 'All Carts',href: '/admin/carts',   icon: null },
  ]
  return (
    <aside className="w-[240px] bg-admin-sidebar min-h-screen flex flex-col flex-shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-white font-heading font-bold text-xl">ShopCart</span>
        <span className="ml-2 px-2 py-0.5 bg-admin-accent text-white font-heading text-[10px] font-bold uppercase rounded">ADMIN</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ label, href }) => (
          <a key={label} href={href}
            className={active === label ? 'sidebar-item-active' : 'sidebar-item'}>
            {label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [error, setError]       = useState('')
  const [showAdd, setShowAdd]   = useState(false)
  const [newP, setNewP]         = useState({ name: '', description: '', price: '', stock: 0, image_url: '' })

  async function load() {
    try { setProducts(await getProducts()) } catch { setError('Failed to load products.') }
  }
  useEffect(() => { load() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    try {
      await createProduct({ ...newP, price: parseFloat(newP.price), stock: parseInt(newP.stock) })
      setShowAdd(false)
      setNewP({ name: '', description: '', price: '', stock: 0, image_url: '' })
      load()
    } catch (err) { setError(err.message) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    try { await deleteProduct(id); load() } catch (err) { setError(err.message) }
  }

  return (
    <div className="flex min-h-screen bg-admin-bg font-body text-admin-text">
      <Sidebar active="Products" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-bold text-2xl text-admin-text">Products</h1>
            <p className="font-body text-body-sm text-admin-muted">({products.length} items)</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-admin-primary text-white font-heading font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-admin-primary-hover transition-colors cursor-pointer">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-admin overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-admin-table-header border-b border-admin-border">
                {['Product', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 font-heading text-xs uppercase tracking-widest text-admin-muted font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-admin-border/50 hover:bg-admin-bg/50 transition-colors">
                  <td className="px-6 py-4 font-body text-body-sm font-medium text-admin-text">{p.name}</td>
                  <td className="px-6 py-4 font-body text-body-sm">${p.price}</td>
                  <td className="px-6 py-4 font-body text-body-sm">{p.stock}</td>
                  <td className="px-6 py-4">
                    {p.stock > 0
                      ? <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-heading font-bold px-2.5 py-1 rounded-full"><CheckCircle size={12} />In Stock</span>
                      : <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-heading font-bold px-2.5 py-1 rounded-full"><XCircle size={12} />Out of Stock</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-admin-primary border border-admin-primary px-3 py-1.5 rounded text-xs font-heading font-semibold hover:bg-blue-50 cursor-pointer transition-colors">
                        <Pencil size={12} className="inline mr-1" />Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 border border-red-300 px-3 py-1.5 rounded text-xs font-heading font-semibold hover:bg-red-50 cursor-pointer transition-colors">
                        <Trash2 size={12} className="inline mr-1" />Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-admin-muted font-body text-body-sm">No products yet.</div>
          )}
        </div>
      </main>

      {/* Add panel */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-[380px] bg-white h-full shadow-xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading font-semibold text-xl text-admin-text">Add Product</h2>
              <button onClick={() => setShowAdd(false)} className="text-admin-muted hover:text-admin-text cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreate} className="flex-1 flex flex-col gap-4">
              {[['name','Name','text'],['description','Description','text'],['price','Price','number'],['stock','Stock','number'],['image_url','Image URL','text']].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block font-body text-sm font-medium text-admin-text mb-1">{label}</label>
                  <input type={type} value={newP[key]} onChange={e => setNewP({ ...newP, [key]: e.target.value })}
                    className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-admin-primary transition-colors"
                  />
                </div>
              ))}
              <div className="mt-auto pt-4 border-t border-admin-border">
                <button type="submit" className="w-full bg-admin-primary text-white font-heading font-semibold py-2.5 rounded-lg hover:bg-admin-primary-hover transition-colors cursor-pointer">
                  Save Product
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="w-full mt-2 text-admin-muted font-body text-sm hover:text-admin-text transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

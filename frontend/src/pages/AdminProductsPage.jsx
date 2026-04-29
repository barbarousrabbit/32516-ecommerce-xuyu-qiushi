// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, X, CheckCircle, XCircle } from 'lucide-react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [error, setError]       = useState('')
  const [showAdd, setShowAdd]   = useState(false)
  const [newP, setNewP]         = useState({ name: '', description: '', price: '', stock: 0, image_url: '' })
  const [editId, setEditId]         = useState(null)
  const [editData, setEditData]     = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [addError, setAddError]         = useState('')
  const [search, setSearch]             = useState('')
  const [stockFilter, setStockFilter]   = useState('all')

  async function load() {
    try { setProducts(await getProducts()) } catch { setError('Failed to load products.') }
  }
  useEffect(() => { load() }, [])

  const displayed = products.filter(p => {
    const matchName  = p.name.toLowerCase().includes(search.toLowerCase())
    const matchStock = stockFilter === 'all' ? true
                     : stockFilter === 'in'  ? p.stock > 0
                     :                         p.stock === 0
    return matchName && matchStock
  })

  useEffect(() => { if (!showAdd) setAddError('') }, [showAdd])

  useEffect(() => {
    if (!showAdd && !deleteTarget) return
    const handler = (e) => {
      if (e.key !== 'Escape') return
      setShowAdd(false)
      setDeleteTarget(null)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [showAdd, deleteTarget])

  async function handleCreate(e) {
    e.preventDefault()
    setAddError('')
    const price = parseFloat(newP.price)
    const stock = parseInt(newP.stock, 10)
    if (!newP.name.trim())       return setAddError('Name is required.')
    if (isNaN(price) || price <= 0) return setAddError('Price must be a positive number.')
    if (isNaN(stock) || stock < 0)  return setAddError('Stock must be 0 or greater.')
    try {
      await createProduct({ ...newP, price, stock })
      setShowAdd(false)
      setAddError('')
      setNewP({ name: '', description: '', price: '', stock: 0, image_url: '' })
      load()
    } catch (err) { setAddError(err.message) }
  }

  function startEdit(p) {
    setEditId(p.id)
    setEditData({ name: p.name, description: p.description ?? '', price: p.price, stock: p.stock, image_url: p.image_url ?? '' })
  }

  async function handleSave(id) {
    const price = parseFloat(editData.price)
    const stock = parseInt(editData.stock, 10)
    if (!editData.name?.trim())      return setError('Name cannot be empty.')
    if (isNaN(price) || price <= 0)  return setError('Price must be a positive number.')
    if (isNaN(stock) || stock < 0)   return setError('Stock must be 0 or greater.')
    try {
      await updateProduct(id, { ...editData, price, stock })
      setEditId(null)
      setError('')
      load()
    } catch (err) { setError(err.message) }
  }

  async function doDelete() {
    try { await deleteProduct(deleteTarget.id); setDeleteTarget(null); load() }
    catch (err) { setError(err.message); setDeleteTarget(null) }
  }

  return (
    <div className="flex min-h-screen bg-admin-bg font-body text-admin-text">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading font-bold text-2xl text-admin-text">Products</h1>
            <p className="font-body text-body-sm text-admin-muted">
              {displayed.length === products.length
                ? `${products.length} items`
                : `${displayed.length} of ${products.length} items`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-admin-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-admin-primary transition-colors w-48"
            />
            {['all','in','out'].map(f => (
              <button
                key={f}
                onClick={() => setStockFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-heading font-semibold transition-colors cursor-pointer border ${
                  stockFilter === f
                    ? 'bg-admin-primary text-white border-admin-primary'
                    : 'bg-white text-admin-muted border-admin-border hover:border-admin-primary'
                }`}
              >
                {f === 'all' ? 'All' : f === 'in' ? 'In Stock' : 'Out of Stock'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-admin-primary text-white font-heading font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-admin-primary-hover transition-colors cursor-pointer"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

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
              {displayed.map(p => {
                const isEditing = editId === p.id
                return (
                  <tr key={p.id} className="border-b border-admin-border/50 hover:bg-admin-bg/50 transition-colors">
                    <td className="px-6 py-3">
                      {isEditing
                        ? <input aria-label="Product name" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })}
                            className="border border-admin-border rounded px-2 py-1 text-sm w-full focus:outline-none focus:border-admin-primary focus-visible:ring-1 focus-visible:ring-admin-primary/50" />
                        : <span className="font-body text-body-sm font-medium">{p.name}</span>
                      }
                    </td>
                    <td className="px-6 py-3">
                      {isEditing
                        ? <input type="number" step="0.01" aria-label="Product price" value={editData.price} onChange={e => setEditData({ ...editData, price: e.target.value })}
                            className="border border-admin-border rounded px-2 py-1 text-sm w-24 focus:outline-none focus:border-admin-primary focus-visible:ring-1 focus-visible:ring-admin-primary/50" />
                        : <span className="font-body text-body-sm">${p.price}</span>
                      }
                    </td>
                    <td className="px-6 py-3">
                      {isEditing
                        ? <input type="number" aria-label="Product stock quantity" value={editData.stock} onChange={e => setEditData({ ...editData, stock: e.target.value })}
                            className="border border-admin-border rounded px-2 py-1 text-sm w-20 focus:outline-none focus:border-admin-primary focus-visible:ring-1 focus-visible:ring-admin-primary/50" />
                        : <span className="font-body text-body-sm">{p.stock}</span>
                      }
                    </td>
                    <td className="px-6 py-3">
                      {(isEditing ? parseInt(editData.stock) > 0 : p.stock > 0)
                        ? <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-heading font-bold px-2.5 py-1 rounded-full"><CheckCircle size={12} />In Stock</span>
                        : <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-heading font-bold px-2.5 py-1 rounded-full"><XCircle size={12} />Out of Stock</span>
                      }
                    </td>
                    <td className="px-6 py-3">
                      {isEditing
                        ? <div className="flex gap-2">
                            <button onClick={() => handleSave(p.id)} className="flex items-center gap-1 bg-admin-primary text-white px-3 py-1.5 rounded text-xs font-heading font-semibold hover:bg-admin-primary-hover cursor-pointer transition-colors">
                              <Check size={12} />Save
                            </button>
                            <button onClick={() => setEditId(null)} className="flex items-center gap-1 text-admin-muted border border-admin-border px-3 py-1.5 rounded text-xs font-heading font-semibold hover:bg-admin-bg cursor-pointer transition-colors">
                              <X size={12} />Cancel
                            </button>
                          </div>
                        : <div className="flex gap-2">
                            <button onClick={() => startEdit(p)} className="flex items-center gap-1 text-admin-primary border border-admin-primary px-3 py-1.5 rounded text-xs font-heading font-semibold hover:bg-blue-50 cursor-pointer transition-colors">
                              <Pencil size={12} />Edit
                            </button>
                            <button onClick={() => setDeleteTarget(p)} className="flex items-center gap-1 text-red-600 border border-red-300 px-3 py-1.5 rounded text-xs font-heading font-semibold hover:bg-red-50 cursor-pointer transition-colors">
                              <Trash2 size={12} />Delete
                            </button>
                          </div>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {displayed.length === 0 && (
            <div className="text-center py-12 text-admin-muted font-body text-body-sm">
              {products.length === 0 ? 'No products yet.' : 'No products match the current filter.'}
            </div>
          )}
        </div>
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setShowAdd(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="add-product-title"
               className="w-[380px] bg-white h-full shadow-xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 id="add-product-title" className="font-heading font-semibold text-xl text-admin-text">Add Product</h2>
              <button onClick={() => setShowAdd(false)} aria-label="Close" className="text-admin-muted hover:text-admin-text cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex-1 flex flex-col gap-4">
              {[
                ['name',        'Name *',       'text',   { required: true, placeholder: 'e.g. Wireless Mouse' }],
                ['description', 'Description',  'text',   { placeholder: 'Optional' }],
                ['price',       'Price ($) *',  'number', { required: true, min: '0.01', step: '0.01', placeholder: '0.00' }],
                ['stock',       'Stock *',      'number', { required: true, min: '0',    step: '1' }],
                ['image_url',   'Image URL',    'text',   { placeholder: 'https://...' }],
              ].map(([key, label, type, attrs]) => (
                <div key={key}>
                  <label htmlFor={`ap-${key}`} className="block font-body text-sm font-medium text-admin-text mb-1">{label}</label>
                  <input
                    id={`ap-${key}`}
                    type={type}
                    value={newP[key]}
                    onChange={e => setNewP({ ...newP, [key]: e.target.value })}
                    className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-admin-primary transition-colors"
                    {...attrs}
                  />
                </div>
              ))}
              {addError && (
                <p className="text-red-600 text-sm font-body bg-red-50 rounded-lg px-3 py-2">{addError}</p>
              )}
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

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="delete-product-title"
               className="bg-white rounded-2xl shadow-xl p-10 w-[440px] text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full border-2 border-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h2 id="delete-product-title" className="font-heading font-bold text-xl text-admin-text mb-3">Delete Product?</h2>
            <p className="font-body text-body-sm text-admin-muted mb-8">
              Permanently delete <strong>{deleteTarget.name}</strong>.<br />
              This cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteTarget(null)} className="w-[140px] border border-admin-border py-2.5 rounded-lg font-heading font-semibold text-sm text-admin-muted hover:text-admin-text transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={doDelete} className="w-[140px] bg-red-600 text-white py-2.5 rounded-lg font-heading font-semibold text-sm hover:bg-red-700 transition-colors cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

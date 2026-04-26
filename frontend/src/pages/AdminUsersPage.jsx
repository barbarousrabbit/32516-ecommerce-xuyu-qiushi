// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
// TODO: Replace with Stitch-generated design (Prompt B — Admin Users screen)
import { useState, useEffect } from 'react'
import { Trash2, Shield, User } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Sidebar({ active }) {
  const items = ['Products', 'Users', 'All Carts']
  const hrefs = ['/admin/products', '/admin/users', '/admin/carts']
  return (
    <aside className="w-[240px] bg-admin-sidebar min-h-screen flex flex-col flex-shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-white font-heading font-bold text-xl">ShopCart</span>
        <span className="ml-2 px-2 py-0.5 bg-admin-accent text-white font-heading text-[10px] font-bold uppercase rounded">ADMIN</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((label, i) => (
          <a key={label} href={hrefs[i]} className={active === label ? 'sidebar-item-active' : 'sidebar-item'}>{label}</a>
        ))}
      </nav>
    </aside>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers]   = useState([])
  const [error, setError]   = useState('')
  const [modal, setModal]   = useState(null)
  const { user: me }        = useAuth()

  async function load() {
    try { setUsers(await api.get('/users')) } catch { setError('Failed to load users.') }
  }
  useEffect(() => { load() }, [])

  async function handleDelete() {
    try { await api.delete(`/users/${modal.id}`); setModal(null); load() }
    catch (err) { setError(err.message); setModal(null) }
  }

  return (
    <div className="flex min-h-screen bg-admin-bg font-body text-admin-text">
      <Sidebar active="Users" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="font-heading font-bold text-2xl text-admin-text mb-1">Users</h1>
        <p className="font-body text-body-sm text-admin-muted mb-6">({users.length} registered)</p>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <div className="bg-white rounded-xl shadow-admin overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-admin-table-header border-b border-admin-border">
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 font-heading text-xs uppercase tracking-widest text-admin-muted font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isMe    = u.id === me?.id
                const isAdmin = u.role === 'admin'
                const canDel  = !isMe && !isAdmin
                return (
                  <tr key={u.id} className="border-b border-admin-border/50 hover:bg-admin-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-heading font-bold text-sm">
                          {u.username?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-body text-body-sm font-medium">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-body-sm text-admin-muted">{u.email}</td>
                    <td className="px-6 py-4">
                      {u.role === 'admin'
                        ? <span className="inline-flex items-center gap-1 bg-admin-badge-blue-bg text-admin-badge-blue-text text-xs font-heading font-bold px-2.5 py-1 rounded-full"><Shield size={11} />Admin</span>
                        : <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-heading font-bold px-2.5 py-1 rounded-full"><User size={11} />User</span>
                      }
                    </td>
                    <td className="px-6 py-4 font-body text-body-sm text-admin-muted">—</td>
                    <td className="px-6 py-4">
                      <button
                        disabled={!canDel}
                        onClick={() => canDel && setModal(u)}
                        title={isMe ? 'Cannot delete yourself' : isAdmin ? 'Admin protected' : 'Delete user'}
                        className={`flex items-center gap-1 border px-3 py-1.5 rounded text-xs font-heading font-semibold transition-colors ${
                          canDel
                            ? 'text-red-600 border-red-300 hover:bg-red-50 cursor-pointer'
                            : 'text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <Trash2 size={12} />Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Delete modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-10 w-[440px] text-center">
            <div className="w-14 h-14 rounded-full border-2 border-red-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 font-bold text-2xl">!</span>
            </div>
            <h2 className="font-heading font-bold text-xl text-admin-text mb-3">Delete User?</h2>
            <p className="font-body text-body-sm text-admin-muted mb-8">
              You are about to permanently delete <strong>{modal.username}</strong> ({modal.email}).<br />This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setModal(null)} className="w-[140px] border border-admin-border py-2.5 rounded-lg font-heading font-semibold text-sm text-admin-muted hover:text-admin-text transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} className="w-[140px] bg-red-600 text-white py-2.5 rounded-lg font-heading font-semibold text-sm hover:bg-red-700 transition-colors cursor-pointer">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

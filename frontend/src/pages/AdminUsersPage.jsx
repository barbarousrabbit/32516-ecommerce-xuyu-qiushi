// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { useState, useEffect } from 'react'
import { Trash2, Shield, User, Plus, Check, X, Pencil } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AdminSidebar from '../components/AdminSidebar'

const EMPTY_NEW = { username: '', email: '', password: '', role: 'user' }

export default function AdminUsersPage() {
  const [users, setUsers]     = useState([])
  const [error, setError]     = useState('')
  const [modal, setModal]     = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newU, setNewU]       = useState(EMPTY_NEW)
  const [editId, setEditId]   = useState(null)
  const [editData, setEditData] = useState({})
  const { user: me }          = useAuth()

  async function load() {
    try { setUsers(await api.get('/users')) } catch { setError('Failed to load users.') }
  }
  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!showAdd && !modal) return
    const handler = (e) => {
      if (e.key !== 'Escape') return
      setShowAdd(false)
      setModal(null)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [showAdd, modal])

  async function handleCreate(e) {
    e.preventDefault()
    try {
      await api.post('/users', newU)
      setShowAdd(false)
      setNewU(EMPTY_NEW)
      load()
    } catch (err) { setError(err.message) }
  }

  function startEdit(u) {
    setEditId(u.id)
    setEditData({ username: u.username, email: u.email, role: u.role })
  }

  async function handleSave(id) {
    try {
      await api.put(`/users/${id}`, editData)
      setEditId(null)
      load()
    } catch (err) { setError(err.message) }
  }

  async function handleDelete() {
    try { await api.delete(`/users/${modal.id}`); setModal(null); load() }
    catch (err) { setError(err.message); setModal(null) }
  }

  return (
    <div className="flex min-h-screen bg-admin-bg font-body text-admin-text">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto overflow-x-auto">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            ['Total Users',  users.length,                                        'text-admin-primary'],
            ['Admins',       users.filter(u => u.role === 'admin').length,        'text-blue-600'],
            ['Regular Users',users.filter(u => u.role === 'user').length,         'text-gray-600'],
          ].map(([label, value, color]) => (
            <div key={label} className="bg-white rounded-xl shadow-admin p-5">
              <p className="font-body text-body-sm text-admin-muted mb-1">{label}</p>
              <p className={`font-heading font-bold text-2xl ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-bold text-2xl text-admin-text">Users</h1>
            <p className="font-body text-body-sm text-admin-muted">({users.length} registered)</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-admin-primary text-white font-heading font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-admin-primary-hover transition-colors cursor-pointer"
          >
            <Plus size={16} /> Add User
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <div className="bg-white rounded-xl shadow-admin overflow-hidden min-w-[640px]">
          <table className="w-full">
            <thead>
              <tr className="bg-admin-table-header border-b border-admin-border">
                {['User', 'Email', 'Role', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 font-heading text-xs uppercase tracking-widest text-admin-muted font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isMe     = u.id === me?.id
                const isEditing = editId === u.id
                return (
                  <tr key={u.id} className="border-b border-admin-border/50 hover:bg-admin-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      {isEditing
                        ? <input aria-label="Username" value={editData.username} onChange={e => setEditData({ ...editData, username: e.target.value })}
                            className="border border-admin-border rounded px-2 py-1 text-sm w-full focus:outline-none focus:border-admin-primary focus-visible:ring-1 focus-visible:ring-admin-primary/50" />
                        : <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-heading font-bold text-sm flex-shrink-0">
                              {u.username?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-body text-body-sm font-medium">{u.username}</span>
                          </div>
                      }
                    </td>
                    <td className="px-6 py-4">
                      {isEditing
                        ? <input type="email" aria-label="Email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })}
                            className="border border-admin-border rounded px-2 py-1 text-sm w-full focus:outline-none focus:border-admin-primary focus-visible:ring-1 focus-visible:ring-admin-primary/50" />
                        : <span className="font-body text-body-sm text-admin-muted">{u.email}</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      {isEditing
                        ? <select
                            aria-label="Role"
                            disabled={isMe}
                            value={editData.role}
                            onChange={e => setEditData({ ...editData, role: e.target.value })}
                            title={isMe ? 'Cannot change your own role' : undefined}
                            className={`border border-admin-border rounded px-2 py-1 text-sm focus:outline-none focus:border-admin-primary focus-visible:ring-1 focus-visible:ring-admin-primary/50 ${isMe ? 'cursor-not-allowed opacity-60' : ''}`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        : u.role === 'admin'
                          ? <span className="inline-flex items-center gap-1 bg-admin-badge-blue-bg text-admin-badge-blue-text text-xs font-heading font-bold px-2.5 py-1 rounded-full"><Shield size={11} />Admin</span>
                          : <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-heading font-bold px-2.5 py-1 rounded-full"><User size={11} />User</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      {isEditing
                        ? <div className="flex gap-2">
                            <button onClick={() => handleSave(u.id)} className="flex items-center gap-1 bg-admin-primary text-white px-3 py-1.5 rounded text-xs font-heading font-semibold hover:bg-admin-primary-hover cursor-pointer transition-colors">
                              <Check size={12} />Save
                            </button>
                            <button onClick={() => setEditId(null)} className="flex items-center gap-1 text-admin-muted border border-admin-border px-3 py-1.5 rounded text-xs font-heading font-semibold hover:bg-admin-bg cursor-pointer transition-colors">
                              <X size={12} />Cancel
                            </button>
                          </div>
                        : <div className="flex gap-2">
                            <button onClick={() => startEdit(u)} className="flex items-center gap-1 text-admin-primary border border-admin-primary px-3 py-1.5 rounded text-xs font-heading font-semibold hover:bg-blue-50 cursor-pointer transition-colors">
                              <Pencil size={12} />Edit
                            </button>
                            <button
                              disabled={isMe}
                              onClick={() => !isMe && setModal(u)}
                              title={isMe ? 'Cannot delete yourself' : 'Delete user'}
                              className={`flex items-center gap-1 border px-3 py-1.5 rounded text-xs font-heading font-semibold transition-colors ${
                                isMe ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-red-600 border-red-300 hover:bg-red-50 cursor-pointer'
                              }`}
                            >
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
          {users.length === 0 && (
            <div className="text-center py-12 text-admin-muted font-body text-body-sm">No users yet.</div>
          )}
        </div>
      </main>

      {/* Add User panel */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setShowAdd(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="add-user-title"
               className="w-[380px] bg-white h-full shadow-xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 id="add-user-title" className="font-heading font-semibold text-xl text-admin-text">Add User</h2>
              <button onClick={() => setShowAdd(false)} aria-label="Close" className="text-admin-muted hover:text-admin-text cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex-1 flex flex-col gap-4">
              {[
                ['username', 'Username',  'text'],
                ['email',    'Email',     'email'],
                ['password', 'Password',  'password'],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label htmlFor={`new-user-${key}`} className="block font-body text-sm font-medium text-admin-text mb-1">{label}</label>
                  <input id={`new-user-${key}`} type={type} value={newU[key]} onChange={e => setNewU({ ...newU, [key]: e.target.value })} required
                    className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-admin-primary transition-colors" />
                </div>
              ))}
              <div>
                <label htmlFor="new-user-role" className="block font-body text-sm font-medium text-admin-text mb-1">Role</label>
                <select id="new-user-role" value={newU.role} onChange={e => setNewU({ ...newU, role: e.target.value })}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-admin-primary transition-colors">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mt-auto pt-4 border-t border-admin-border">
                <button type="submit" className="w-full bg-admin-primary text-white font-heading font-semibold py-2.5 rounded-lg hover:bg-admin-primary-hover transition-colors cursor-pointer">
                  Create User
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="w-full mt-2 text-admin-muted font-body text-sm hover:text-admin-text transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="delete-user-title"
               className="bg-white rounded-2xl shadow-xl p-10 w-[440px] text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full border-2 border-red-500 flex items-center justify-center mx-auto mb-4">
              <X size={24} className="text-red-500" />
            </div>
            <h2 id="delete-user-title" className="font-heading font-bold text-xl text-admin-text mb-3">Delete User?</h2>
            <p className="font-body text-body-sm text-admin-muted mb-8">
              Permanently delete <strong>{modal.username}</strong> ({modal.email}).<br />
              This cannot be undone.
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

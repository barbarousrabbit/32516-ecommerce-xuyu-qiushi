// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { updateMyProfile } from '../services/userService'
import Navbar from '../components/Navbar'

export default function ProfilePage() {
  const { user, login: setAuth } = useAuth()
  const [form, setForm]       = useState({ username: user?.username ?? '', email: user?.email ?? '' })
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    try {
      const updated = await updateMyProfile(form)
      setAuth(updated, localStorage.getItem('token'))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="bg-background min-h-screen flex flex-col font-body text-on-surface">
      <Navbar />
      <main className="flex-grow flex items-start justify-center px-gutter py-[48px]">
        <div className="w-full max-w-[640px] bg-surface-container-lowest rounded-2xl shadow-amber p-xl">

          <div className="flex items-center gap-6 pb-8 border-b border-surface-container">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-on-primary font-heading font-bold text-3xl flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <h1 className="font-heading font-bold text-[24px] text-on-surface">{user?.username}</h1>
              <p className="font-body text-body-md text-on-surface-variant">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[12px] font-heading font-bold uppercase tracking-wide bg-surface-container text-on-surface-variant">
                {user?.role ?? 'Member'}
              </span>
            </div>
          </div>

          <div className="pt-8">
            <h2 className="font-heading font-semibold text-[18px] text-on-surface mb-5">Account Information</h2>

            {success && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 font-body text-body-sm">
                <CheckCircle2 size={18} />
                Profile updated successfully!
              </div>
            )}
            {error && (
              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg mb-6 font-body text-body-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="username" className="block font-body text-body-sm font-medium text-on-surface mb-1">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className="input-base"
                  minLength={3}
                  maxLength={50}
                />
                <p className="font-body text-body-sm text-on-surface-variant mt-1">3–50 characters</p>
              </div>
              <div>
                <label htmlFor="email" className="block font-body text-body-sm font-medium text-on-surface mb-1">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-base"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setForm({ username: user?.username, email: user?.email })}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

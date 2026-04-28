// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Store, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/authService'
import Navbar from '../components/Navbar'

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { login: setAuth } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(form)
      setAuth(data.user, data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen flex flex-col font-body text-on-surface antialiased">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-[480px]">

          {/* Login Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-amber p-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container mb-4">
                <Store size={28} className="text-primary" />
              </div>
              <h1 className="font-heading text-[28px] font-bold text-on-surface mb-2">Welcome back</h1>
              <p className="font-body text-body-md text-on-surface-variant">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error banner */}
              {error && (
                <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg flex items-start gap-3">
                  <AlertCircle size={20} className="text-error mt-0.5 flex-shrink-0" />
                  <p className="text-body-sm font-body">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className={`block font-heading text-label-caps uppercase mb-2 ${error ? 'text-error' : 'text-on-surface-variant'}`}
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    className={`input-base ${error ? 'input-error' : ''}`}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className={`block font-heading text-label-caps uppercase mb-2 ${error ? 'text-error' : 'text-on-surface-variant'}`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                      className={`input-base pr-12 ${error ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    >
                      {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-grow h-px bg-surface-container-highest" />
              <span className="text-body-sm font-body text-on-surface-variant">or</span>
              <div className="flex-grow h-px bg-surface-container-highest" />
            </div>

            {/* Register link */}
            <div className="mt-8 text-center">
              <Link
                to="/register"
                className="text-body-md font-body text-on-surface-variant hover:text-primary transition-colors group"
              >
                No account?{' '}
                <span className="font-medium text-primary group-hover:text-surface-tint transition-colors">
                  Register →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

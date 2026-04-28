// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2, XCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { register } from '../services/authService'
import Navbar from '../components/Navbar'

export default function RegisterPage() {
  const [form, setForm]       = useState({ username: '', email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { login: setAuth } = useAuth()
  const navigate = useNavigate()

  const usernameValid = form.username.length >= 3 && form.username.length <= 50
  const passwordValid = form.password.length >= 6

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await register(form)
      setAuth(data.user, data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen flex flex-col font-body text-on-surface antialiased">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-gutter">
        <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl shadow-amber p-xl border border-surface-variant relative overflow-hidden">

          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container" />

          {/* Header */}
          <div className="text-center mb-xl">
            <ShoppingBag size={36} className="text-primary mx-auto mb-sm" />
            <h1 className="font-heading text-h2 text-on-surface">Create your account</h1>
            <p className="font-body text-body-md text-on-surface-variant mt-1">
              Join ShopCart to start shopping
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg">
            {/* Error */}
            {error && (
              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg text-body-sm font-body">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="block font-body text-body-sm font-medium text-on-surface mb-xs">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="yourname"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                  className={`input-base pr-10 ${form.username && (usernameValid ? 'border-green-500 focus:border-green-500' : 'border-error')}`}
                />
                {form.username && (
                  usernameValid
                    ? <CheckCircle2 size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600" />
                    : <XCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-error" />
                )}
              </div>
              <p className="text-body-sm font-body text-on-surface-variant mt-xs">3 to 50 characters</p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-body text-body-sm font-medium text-on-surface mb-xs">
                Email
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
                className="input-base"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block font-body text-body-sm font-medium text-on-surface mb-xs">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className={`input-base pr-10 ${form.password && !passwordValid ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {form.password && !passwordValid && (
                <div className="flex items-center gap-1 mt-xs text-error">
                  <XCircle size={14} />
                  <p className="text-body-sm font-body">Too short — minimum 6 characters</p>
                </div>
              )}
              {!form.password && (
                <p className="text-body-sm font-body text-on-surface-variant mt-xs">Minimum 6 characters</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-lg text-center">
            <Link
              to="/login"
              className="font-body text-body-md text-primary hover:text-surface-tint font-medium transition-colors inline-flex items-center gap-1"
            >
              Already have an account? Sign in
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

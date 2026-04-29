// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Search, LayoutGrid, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LogoMark from './LogoMark'

export default function Navbar() {
  const { user, logout }                  = useAuth()
  const navigate                          = useNavigate()
  const location                          = useLocation()
  const [searchParams, setSearchParams]   = useSearchParams()
  const navQuery                          = searchParams.get('q') || ''

  function handleLogoClick(e) {
    if (location.pathname === '/') {
      e.preventDefault()
      window.location.reload()
    }
    // other pages: normal Link navigation to /
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleSearch(e) {
    const val = e.target.value
    if (location.pathname === '/') {
      // Already on home — update URL in place; useSearch reacts automatically
      if (val) {
        setSearchParams({ q: val }, { replace: true })
      } else {
        setSearchParams({}, { replace: true })
      }
    } else {
      navigate(val ? `/?q=${encodeURIComponent(val)}` : '/')
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 h-[68px] z-50 border-b border-surface-variant shadow-amber w-full">
      <div className="flex justify-between items-center px-6 max-w-container mx-auto w-full h-full">

        {/* Left: Logo + admin link */}
        <div className="flex items-center gap-8 h-full">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group self-stretch px-2 -mx-2"
            aria-label="ShopCart home"
          >
            <div className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <LogoMark size={28} />
            </div>
            <span className="font-heading font-bold text-[22px] tracking-tight leading-none">
              <span className="text-on-surface group-hover:text-primary transition-colors duration-200">Shop</span>
              <span className="text-primary">Cart</span>
            </span>
          </Link>

          {user?.role === 'admin' && (
            <nav className="hidden md:flex h-full items-center">
              <Link
                to="/admin/products"
                className="flex items-center gap-1.5 text-admin-primary font-medium font-heading text-sm hover:text-admin-primary-hover transition-colors duration-200"
              >
                <LayoutGrid size={16} />
                Admin Panel →
              </Link>
            </nav>
          )}
        </div>

        {/* Center: Search — connected to URL, syncs with useSearch on HomePage */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="search"
              placeholder="Search products..."
              value={navQuery}
              onChange={handleSearch}
              aria-label="Search products"
              className="w-full pl-10 pr-4 py-2 bg-surface-container-highest border border-outline-variant rounded-full text-body-sm font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-[border-color,box-shadow] duration-200 text-on-surface placeholder:text-on-surface-variant"
            />
          </div>
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-3">
          {/* Cart — always visible; pure CSS :hover on .cart-nav-btn */}
          <button
            onClick={() => navigate(user ? '/cart' : '/')}
            aria-label="Shopping cart"
            className="cart-nav-btn"
          >
            <ShoppingCart size={22} />
          </button>

          {user ? (
            <>
              {/* Avatar → Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm font-heading">
                  {user.username?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="hidden md:block font-heading font-medium text-on-surface text-sm">
                  {user.username}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="text-on-surface-variant hover:text-error transition-colors p-1.5 rounded-lg hover:bg-error-container/30 cursor-pointer"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-heading font-medium text-primary hover:text-surface-tint transition-colors duration-200 text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="font-heading font-semibold bg-primary text-on-primary px-4 py-2 rounded-full text-sm hover:bg-surface-tint active:scale-95 transition-colors duration-200 shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

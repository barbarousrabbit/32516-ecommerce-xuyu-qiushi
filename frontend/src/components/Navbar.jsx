// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, UserCircle, LayoutGrid } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 h-[68px] z-50 border-b border-surface-variant shadow-amber w-full">
      <div className="flex justify-between items-center px-6 max-w-container mx-auto w-full h-full">

        {/* Left: Logo */}
        <div className="flex items-center gap-8 h-full">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-primary hover:text-surface-tint transition-colors duration-200 font-heading"
          >
            ShopCart
          </Link>

          {/* Admin link — only shown to admins while browsing user area */}
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

        {/* Center: Search (hidden on small screens) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-highest border border-outline-variant rounded-full text-body-sm font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface placeholder:text-on-surface-variant"
            />
          </div>
        </div>

        {/* Right: Auth actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Cart */}
              <Link to="/cart" className="relative text-on-surface-variant hover:text-primary transition-colors duration-200 active:scale-95 cursor-pointer">
                <ShoppingCart size={24} />
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* Avatar + Username */}
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogout}>
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm font-heading">
                  {user.username?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="hidden md:block font-heading font-medium text-on-surface text-sm">
                  {user.username}
                </span>
              </div>
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
                className="font-heading font-semibold bg-primary text-on-primary px-4 py-2 rounded-full text-sm hover:bg-surface-tint active:scale-95 transition-all duration-200 shadow-sm"
              >
                Register
              </Link>
              <Link to="/cart" className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container">
                <ShoppingCart size={22} />
              </Link>
              <Link to="/profile" className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container">
                <UserCircle size={22} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

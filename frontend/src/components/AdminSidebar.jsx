// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { Link, useLocation } from 'react-router-dom'
import { Package, Users, ShoppingCart } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Products',  href: '/admin/products', icon: Package },
  { label: 'Users',     href: '/admin/users',    icon: Users },
  { label: 'All Carts', href: '/admin/carts',    icon: ShoppingCart },
]

export default function AdminSidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="w-[240px] bg-admin-sidebar min-h-screen flex flex-col flex-shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-white font-heading font-bold text-xl">ShopCart</span>
        <span className="ml-2 px-2 py-0.5 bg-admin-accent text-white font-heading text-[10px] font-bold uppercase rounded">
          ADMIN
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            to={href}
            className={pathname === href ? 'sidebar-item-active' : 'sidebar-item'}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

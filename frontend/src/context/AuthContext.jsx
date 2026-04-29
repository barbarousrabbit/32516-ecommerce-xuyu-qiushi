// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { addToCart } from '../services/cartService'
import { getGuestCart, clearGuestCart } from '../services/guestCart'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  async function login(userData, token) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)

    // Merge any guest cart items into the account cart
    const guestItems = getGuestCart()
    if (guestItems.length > 0) {
      for (const item of guestItems) {
        try {
          await addToCart(item.product_id, item.quantity)
        } catch {
          // Silently ignore — out of stock or duplicate; account cart is unaffected
        }
      }
      clearGuestCart()
    }
  }

  // Auto-logout when any API call receives 401 (expired/invalid token)
  useEffect(() => {
    window.addEventListener('auth:expired', logout)
    return () => window.removeEventListener('auth:expired', logout)
  }, [logout])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

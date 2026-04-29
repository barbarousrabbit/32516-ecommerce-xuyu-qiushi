// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
const KEY = 'guestCart'

export function getGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addToGuestCart(productId, quantity = 1) {
  const cart = getGuestCart()
  const existing = cart.find(i => i.product_id === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({ product_id: productId, quantity })
  }
  localStorage.setItem(KEY, JSON.stringify(cart))
}

export function clearGuestCart() {
  localStorage.removeItem(KEY)
}

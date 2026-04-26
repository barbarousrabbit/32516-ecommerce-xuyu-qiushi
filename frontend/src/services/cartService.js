// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { api } from './api'
export const getMyCart      = ()                        => api.get('/cart/me')
export const addToCart      = (productId, quantity = 1) => api.post('/cart/items', { product_id: productId, quantity })
export const updateCartItem = (itemId, quantity)        => api.put(`/cart/items/${itemId}`, { quantity })
export const removeCartItem = (itemId)                  => api.delete(`/cart/items/${itemId}`)
export const getAllCarts     = ()                        => api.get('/cart/all')

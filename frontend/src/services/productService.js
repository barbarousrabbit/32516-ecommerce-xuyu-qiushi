// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { api } from './api'
export const getProducts    = (q = '')         => api.get(`/products${q ? `?q=${encodeURIComponent(q)}` : ''}`)
export const createProduct  = (data)           => api.post('/products', data)
export const updateProduct  = (id, data)       => api.put(`/products/${id}`, data)
export const deleteProduct  = (id)             => api.delete(`/products/${id}`)

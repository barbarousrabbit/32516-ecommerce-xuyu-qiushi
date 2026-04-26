// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { api } from './api'
export const register = (data) => api.post('/auth/register', data)
export const login    = (data) => api.post('/auth/login',    data)

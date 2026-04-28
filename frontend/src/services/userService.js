// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { api } from './api'
export const getMyProfile    = ()     => api.get('/users/me')
export const updateMyProfile = (data) => api.put('/users/me', data)

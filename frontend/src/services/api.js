// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(method, path, body = null) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    })
  } catch {
    // Network error (offline, CORS, server down)
    throw new Error('Cannot reach the server. Please check your connection.')
  }

  if (res.status === 204) return null

  // Guard against non-JSON responses (HTML 500 pages, nginx errors)
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    if (!res.ok) throw new Error(`Server error (${res.status})`)
    return null
  }

  const data = await res.json()

  if (!res.ok) {
    if (res.status === 401) {
      // Notify AuthContext so it can clear the expired session automatically
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }
    // FastAPI 422 validation errors return detail as an array of objects
    const detail = data.detail
    if (Array.isArray(detail)) {
      const msg = detail
        .map(e => `${e.loc?.at(-1) ?? 'field'}: ${e.msg}`)
        .join('; ')
      throw new Error(msg)
    }
    throw new Error(typeof detail === 'string' ? detail : 'Request failed')
  }

  return data
}

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  delete: (path)        => request('DELETE', path),
}

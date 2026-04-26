// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { useState, useEffect } from 'react'
import { getProducts } from '../services/productService'

export function useSearch() {
  const [query, setQuery]       = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    // 300ms debounce — avoids request on every keystroke
    const timer = setTimeout(async () => {
      try {
        const data = await getProducts(query)
        setProducts(data)
      } catch {
        setError('Failed to load products. Please try again.')
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return { query, setQuery, products, loading, error }
}

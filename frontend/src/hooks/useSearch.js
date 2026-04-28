// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../services/productService'

export function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  // Derive query directly from URL so Navbar search stays in sync
  const query = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  function setQuery(val) {
    if (val) {
      setSearchParams({ q: val }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  useEffect(() => {
    setLoading(true)
    setError('')
    const timer = setTimeout(async () => {
      try {
        setProducts(await getProducts(query))
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

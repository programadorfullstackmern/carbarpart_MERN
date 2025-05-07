import { useState } from 'react'

const useSearch = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters)
  const [isSearching, setIsSearching] = useState(false)

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
  }

  const buildQueryParams = () => {
    const params = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params[key] = value
      }
    })
    return params
  }

  return {
    filters,
    isSearching,
    handleFilterChange,
    handleResetFilters,
    buildQueryParams,
    setIsSearching
  }
}

export default useSearch
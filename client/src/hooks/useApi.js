import { useState } from 'react'
import api from '../services/api'

const useApi = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async (apiCall, params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall(params)
      setData(response.data)
      return response.data
    } catch (err) {
      setError(err.message || 'Error en la solicitud')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const create = async (endpoint, itemData) => {
    return fetchData(api.post, { url: endpoint, data: itemData })
  }

  const update = async (endpoint, id, itemData) => {
    return fetchData(api.put, { url: `${endpoint}/${id}`, data: itemData })
  }

  const remove = async (endpoint, id) => {
    return fetchData(api.delete, { url: `${endpoint}/${id}` })
  }

  return {
    data,
    loading,
    error,
    fetchData,
    create,
    update,
    remove
  }
}

export default useApi
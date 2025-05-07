import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { AutoContext } from './AutoContext'
import * as autoApi from '../api/autoApi'

export const AutoProvider = ({ children }) => {
  const [autos, setAutos] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [currentAuto, setCurrentAuto] = useState({
    marca: '',
    modelo: '',
    anio: '',
    precio: '',
    imagen: '',
    kilometraje: '',
    color: '',
    transmision: '',
    combustible: '',
    disponible: true,
    caracteristicas: [],
    opcionales: [],
    ubicacion: {
      ciudad: '',
      estado: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const clearError = useCallback(() => setError(null), [])
  const clearSearch = useCallback(() => {
    setSearchResults([])
    setError(null)
  }, [])

  const fetchAutos = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await autoApi.getAutos(params)
      setAutos(data || [])
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener autos')
      setAutos([])
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAutoById = useCallback(async (id) => {
    setLoading(true)
    try {
      const { data } = await autoApi.getAutoById(id)
      setCurrentAuto(data || {
        marca: '',
        modelo: '',
        anio: '',
        precio: '',
        imagen: '',
        kilometraje: '',
        color: '',
        transmision: '',
        combustible: '',
        disponible: true,
        caracteristicas: [],
        opcionales: [],
        ubicacion: {
          ciudad: '',
          estado: ''
        }
      })
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.error || 'Error al obtener el auto')
      setCurrentAuto({
        marca: '',
        modelo: '',
        anio: '',
        precio: '',
        imagen: '',
        kilometraje: '',
        color: '',
        transmision: '',
        combustible: '',
        disponible: true,
        caracteristicas: [],
        opcionales: [],
        ubicacion: {
          ciudad: '',
          estado: ''
        }
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createAuto = useCallback(async (autoData) => {
    setLoading(true)
    try {
      const { data } = await autoApi.createAuto(autoData)
      setAutos(prev => [...prev, data])
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.error || 'Error al crear el auto')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAuto = useCallback(async (id, autoData) => {
    setLoading(true)
    try {
      const { data } = await autoApi.updateAuto(id, autoData)
      setAutos(prev => prev.map(auto => auto._id === id ? data : auto))
      setCurrentAuto(data || {
        marca: '',
        modelo: '',
        anio: '',
        precio: '',
        imagen: '',
        kilometraje: '',
        color: '',
        transmision: '',
        combustible: '',
        disponible: true,
        caracteristicas: [],
        opcionales: [],
        ubicacion: {
          ciudad: '',
          estado: ''
        }
      })
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.error || 'Error al actualizar el auto')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteAuto = useCallback(async (id) => {
    setLoading(true)
    try {
      await autoApi.deleteAuto(id)
      setAutos(prev => prev.filter(auto => auto._id !== id))
      setError(null)
    } catch (err) {
      setError(err.response?.error || 'Error al eliminar el auto')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const searchAutos = useCallback(async (searchParams) => {
    setLoading(true)
    try {
      const { data } = await autoApi.searchAutos(searchParams)
      setSearchResults(data || [])
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.error || 'Error en la búsqueda de autos')
      setSearchResults([])
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadAutoImage = useCallback(async (id, file) => {
    setLoading(true)
    try {
      const { data } = await autoApi.uploadAutoImage(id, file)
      setAutos(prev => prev.map(auto => auto._id === id ? data : auto))
      if (currentAuto && currentAuto._id === id) {
        setCurrentAuto(data)
      }
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.error || 'Error al subir la imagen')
      throw err
    } finally {
      setLoading(false)
    }
  }, [currentAuto])

  useEffect(() => {
    fetchAutos().catch(err => {
      console.error('Error al cargar autos iniciales:', err)
      setLoading(false)
    })
  }, [fetchAutos])

  const value = useMemo(() => ({
    autos,
    searchResults,
    currentAuto,
    loadingAutos: loading,
    errorAutos: error,
    getAutos: fetchAutos,
    getAutoById: fetchAutoById,
    createAuto,
    updateAuto,
    deleteAuto,
    searchAutos,
    uploadAutoImage,
    clearError,
    clearSearch
  }), [
    autos,
    searchResults,
    currentAuto,
    loading,
    error,
    fetchAutos,
    fetchAutoById,
    createAuto,
    updateAuto,
    deleteAuto,
    searchAutos,
    uploadAutoImage,
    clearError,
    clearSearch
  ])

  return (
    <AutoContext.Provider value={value}>
      {children}
    </AutoContext.Provider>
  )
}
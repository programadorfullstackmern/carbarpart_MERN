import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { PiezaContext } from './PiezaContext'
import * as piezaApi from '../api/piezaApi'

export const PiezaProvider = ({ children }) => {
  const [piezas, setPiezas] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [currentPieza, setCurrentPieza] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    stock: 0,
    imagen: '',
    marcaCompatibilidad: [],
    modeloCompatibilidad: [],
    anioMin: '',
    anioMax: '',
    caracteristicas: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const clearError = useCallback(() => setError(null), [])
  const clearSearch = useCallback(() => {
    setSearchResults([])
    setError(null)
  }, [])

  const fetchPiezas = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await piezaApi.getPiezas(params)
      setPiezas(data || [])
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.error || 'Error al obtener piezas')
      setPiezas([])
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPiezaById = useCallback(async (id) => {
    setLoading(true)
    try {
      const { data } = await piezaApi.getPiezaById(id)
      setCurrentPieza(data || {
        nombre: '',
        descripcion: '',
        categoria: '',
        precio: '',
        stock: 0,
        imagen: '',
        marcaCompatibilidad: [],
        modeloCompatibilidad: [],
        anioMin: '',
        anioMax: '',
        caracteristicas: []
      })
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.error || 'Error al obtener la pieza')
      setCurrentPieza({
        nombre: '',
        descripcion: '',
        categoria: '',
        precio: '',
        stock: 0,
        imagen: '',
        marcaCompatibilidad: [],
        modeloCompatibilidad: [],
        anioMin: '',
        anioMax: '',
        caracteristicas: []
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createPieza = useCallback(async (piezaData) => {
    setLoading(true)
    try {
      const { data } = await piezaApi.createPieza(piezaData)
      setPiezas(prev => [...prev, data])
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.error || 'Error al crear la pieza')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePieza = useCallback(async (id, piezaData) => {
    setLoading(true)
    try {
      const { data } = await piezaApi.updatePieza(id, piezaData)
      setPiezas(prev => prev.map(pieza => pieza._id === id ? data : pieza))
      setCurrentPieza(data || {
        nombre: '',
        descripcion: '',
        categoria: '',
        precio: '',
        stock: 0,
        imagen: '',
        marcaCompatibilidad: [],
        modeloCompatibilidad: [],
        anioMin: '',
        anioMax: '',
        caracteristicas: []
      })
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.error || 'Error al actualizar la pieza')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePieza = useCallback(async (id) => {
    setLoading(true)
    try {
      await piezaApi.deletePieza(id)
      setPiezas(prev => prev.filter(pieza => pieza._id !== id))
      setError(null)
    } catch (err) {
      setError(err.response?.error || 'Error al eliminar la pieza')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const searchPiezas = useCallback(async (searchParams) => {
    setLoading(true)
    try {
      const { data } = await piezaApi.searchPiezas(searchParams)
      setSearchResults(data || [])
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.error || 'Error en la búsqueda de piezas')
      setSearchResults([])
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadPiezaImage = useCallback(async (id, file) => {
    setLoading(true)
    try {
      const { data } = await piezaApi.uploadPiezaImage(id, file)
      setPiezas(prev => prev.map(pieza => pieza._id === id ? data : pieza))
      if (currentPieza && currentPieza._id === id) {
        setCurrentPieza(data)
      }
      setError(null)
      return data
    } catch (err) {
      setError(err.response?.error || 'Error al subir la imagen')
      throw err
    } finally {
      setLoading(false)
    }
  }, [currentPieza])

  // Carga inicial de piezas
  useEffect(() => {
    fetchPiezas().catch(err => {
      console.error('Error al cargar piezas iniciales:', err)
      setLoading(false)
    })
  }, [fetchPiezas])

  const value = useMemo(() => ({
    piezas,
    searchResults,
    currentPieza,
    loadingPiezas: loading,
    errorPiezas: error,
    getPiezas: fetchPiezas,
    getPiezaById: fetchPiezaById,
    createPieza,
    updatePieza,
    deletePieza,
    searchPiezas,
    uploadPiezaImage,
    clearError,
    clearSearch
  }), [
    piezas,
    searchResults,
    currentPieza,
    loading,
    error,
    fetchPiezas,
    fetchPiezaById,
    createPieza,
    updatePieza,
    deletePieza,
    searchPiezas,
    uploadPiezaImage,
    clearError,
    clearSearch
  ])

  return (
    <PiezaContext.Provider value={value}>
      {children}
    </PiezaContext.Provider>
  )
}
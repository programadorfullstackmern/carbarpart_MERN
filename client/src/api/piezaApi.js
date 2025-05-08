import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://carbarpart-mern.onrender.com/api'

// Configuración base sin headers para permitir sobreescritura
const piezaApi = axios.create({
  baseURL: `${API_URL}/piezas`
})

export const getPiezas = async (params = {}) => {
  try {
    const response = await piezaApi.get('/', { 
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const getPiezaById = async (id) => {
  try {
    const response = await piezaApi.get(`/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const createPieza = async (piezaData) => {
  try {
    // Determinar el tipo de contenido basado en los datos
    const isFormData = piezaData instanceof FormData
    const config = {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
      }
    }

    const response = await piezaApi.post('/', piezaData, config)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const updatePieza = async (id, piezaData) => {
  try {
    // Determinar el tipo de contenido basado en los datos
    const isFormData = piezaData instanceof FormData
    const config = {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
      }
    }

    const response = await piezaApi.put(`/${id}`, piezaData, config)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const deletePieza = async (id) => {
  try {
    const response = await piezaApi.delete(`/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const searchPiezas = async (searchParams) => {
  try {
    const response = await piezaApi.get('/buscar', { 
      params: searchParams,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const uploadPiezaImage = async (id, file) => {
  try {
    const formData = new FormData()
    formData.append('imagen', file)
    
    const response = await piezaApi.post(`/${id}/imagen`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}
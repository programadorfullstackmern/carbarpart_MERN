import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Configuración base sin headers para permitir sobreescritura
const autoApi = axios.create({
  baseURL: `${API_URL}/autos`
})

export const getAutos = async (params = {}) => {
  try {
    const response = await autoApi.get('/', { 
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const getAutoById = async (id) => {
  try {
    const response = await autoApi.get(`/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const createAuto = async (autoData) => {
  try {
    // Determinar el tipo de contenido basado en los datos
    const isFormData = autoData instanceof FormData
    const config = {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
      }
    }

    const response = await autoApi.post('/', autoData, config)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const updateAuto = async (id, autoData) => {
  try {
    // Determinar el tipo de contenido basado en los datos
    const isFormData = autoData instanceof FormData
    const config = {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
      }
    }

    const response = await autoApi.put(`/${id}`, autoData, config)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const deleteAuto = async (id) => {
  try {
    const response = await autoApi.delete(`/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const searchAutos = async (searchParams) => {
  try {
    const response = await autoApi.get('/buscar', { 
      params: searchParams,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const uploadAutoImage = async (id, file) => {
  try {
    const formData = new FormData()
    formData.append('imagen', file)
    
    const response = await autoApi.post(`/${id}/imagen`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error.response.data
  }
}
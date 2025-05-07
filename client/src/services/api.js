import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptores para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Errores de la API
      console.error('Error de API:', error.response.data)
      return Promise.reject(error.response.data)
    } else if (error.request) {
      // Error de conexión
      console.error('Error de conexión:', error.request)
      return Promise.reject({ message: 'Error de conexión con el servidor' })
    } else {
      // Otros errores
      console.error('Error:', error.message)
      return Promise.reject(error)
    }
  }
)

export const getAutos = (params = {}) => api.get('/autos', { params })
export const getAutoById = (id) => api.get(`/autos/${id}`)
export const createAuto = (autoData) => api.post('/autos', autoData)
export const updateAuto = (id, autoData) => api.put(`/autos/${id}`, autoData)
export const deleteAuto = (id) => api.delete(`/autos/${id}`)

export const getPiezas = (params = {}) => api.get('/piezas', { params })
export const getPiezaById = (id) => api.get(`/piezas/${id}`)
export const createPieza = (piezaData) => api.post('/piezas', piezaData)
export const updatePieza = (id, piezaData) => api.put(`/piezas/${id}`, piezaData)
export const deletePieza = (id) => api.delete(`/piezas/${id}`)

export default api
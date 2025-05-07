import { createContext } from 'react'

export const AutoContext = createContext({
  autos: [], // Lista completa de autos
  searchResults: [], // Resultados de búsqueda
  currentAuto: null,
  loadingAutos: false,
  errorAutos: null,
  getAutos: () => {},
  getAutoById: () => {},
  createAuto: () => {},
  updateAuto: () => {},
  deleteAuto: () => {},
  searchAutos: () => {},
  uploadAutoImage: () => {},
  clearError: () => {},
  clearSearch: () => {} // Nueva función para limpiar búsqueda
})
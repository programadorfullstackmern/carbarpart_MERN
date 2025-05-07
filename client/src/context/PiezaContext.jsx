import { createContext } from 'react'

export const PiezaContext = createContext({
  piezas: [], // Lista completa de piezas
  searchResults: [], // Resultados de búsqueda
  currentPieza: null,
  loadingPiezas: false,
  errorPiezas: null,
  getPiezas: () => {},
  getPiezaById: () => {},
  createPieza: () => {},
  updatePieza: () => {},
  deletePieza: () => {},
  searchPiezas: () => {},
  uploadPiezaImage: () => {},
  clearError: () => {},
  clearSearch: () => {} // Nueva función para limpiar búsqueda
})
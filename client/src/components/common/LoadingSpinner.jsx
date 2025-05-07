import React from 'react'
import { Spinner } from 'react-bootstrap'

const LoadingSpinner = ({ size = 'lg', variant = 'primary', className = '' }) => {
  return (
    <div className={`d-flex justify-content-center align-items-center ${className}`} style={{ minHeight: '100px' }}>
      <Spinner animation="border" role="status" size={size} variant={variant}>
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    </div>
  )
}

export default LoadingSpinner
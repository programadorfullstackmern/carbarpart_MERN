import React from 'react'
import { Alert } from 'react-bootstrap'

const ErrorAlert = ({ error, onClose, className = '' }) => {
  if (!error) return null

  return (
    <Alert variant="danger" onClose={onClose} dismissible className={className}>
      {typeof error === 'string' ? error : 'Ocurrió un error inesperado'}
    </Alert>
  )
}

export default ErrorAlert
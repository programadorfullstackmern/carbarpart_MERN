import { Spinner } from 'react-bootstrap'

const LoadingSpinner = ({ size = 'md', message = 'Cargando...' }) => {
  const spinnerSize = {
    sm: 'sm',
    md: '',
    lg: 'lg'
  }[size]

  return (
    <div className="text-center my-4 d-flex flex-column align-items-center">
      <Spinner 
        animation="border" 
        role="status"
        size={spinnerSize}
        aria-hidden="true"
      >
        <span className="visually-hidden">{message}</span>
      </Spinner>
      {message && <p className="mt-2 mb-0 text-muted">{message}</p>}
    </div>
  )
}

export default LoadingSpinner
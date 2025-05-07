// client/src/pages/ErrorPage.jsx
import { useRouteError } from 'react-router-dom'
import { Alert, Button, Container } from 'react-bootstrap'
import { HouseDoor } from 'react-bootstrap-icons'

export default function ErrorPage() {
  const error = useRouteError()
  
  return (
    <Container className="my-5 text-center">
      <Alert variant="danger" className="my-4">
        <h1>¡Oops!</h1>
        <p>Lo sentimos, ha ocurrido un error inesperado.</p>
        <p className="text-muted">
          <i>{error.statusText || error.message}</i>
        </p>
      </Alert>
      <Button href="/" variant="primary" className="d-flex align-items-center mx-auto">
        <HouseDoor className="me-2" /> Volver al inicio
      </Button>
    </Container>
  )
}
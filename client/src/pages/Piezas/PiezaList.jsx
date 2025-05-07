import { useContext, useEffect } from 'react'
import { Row, Col, Button, Spinner, Alert, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { PiezaContext } from '../../context/PiezaContext'
import PiezaCard from '../../components/ui/PiezaCard'

const PiezaList = () => {
  const { 
    piezas, 
    loadingPiezas, 
    errorPiezas, 
    getPiezas,
    clearSearch 
  } = useContext(PiezaContext)

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    const loadData = async () => {
      try {
        clearSearch()
        await getPiezas({ signal: controller.signal })
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error("Error loading piezas:", err)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [getPiezas, clearSearch])

  if (loadingPiezas) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando piezas...</span>
        </Spinner>
      </div>
    )
  }

  if (errorPiezas) {
    return <Alert variant="danger">{errorPiezas}</Alert>
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Lista de Piezas</h1>
        <div className="d-flex gap-2">
          <Button
            as={Link}
            to="/piezas/nueva"
            variant="primary"
            aria-label="Crear nueva pieza"
          >
            Agregar
          </Button>
          <Button
            as={Link}
            to="/buscar/piezas"
            variant="primary"
            aria-label="Buscar pieza existente"
          >
            Buscar
          </Button>
        </div>
      </div>

      {piezas.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <Card.Text>No hay piezas registradas</Card.Text>
            <Button as={Link} to="/piezas/nueva" variant="primary">
              Agregar primera pieza
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {piezas.map(pieza => (
            <Col key={pieza._id}>
              <PiezaCard pieza={pieza} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default PiezaList
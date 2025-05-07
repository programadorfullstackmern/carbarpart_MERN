import { useEffect, useContext } from "react"
import { Row, Col, Button, Spinner, Alert, Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import { AutoContext } from "../../context/AutoContext"
import AutoCard from "../../components/ui/AutoCard"

const AutoList = () => {
  const { 
    autos, 
    loadingAutos, 
    errorAutos, 
    getAutos,
    clearSearch 
  } = useContext(AutoContext)

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    const loadData = async () => {
      try {
        clearSearch()
        await getAutos({ signal: controller.signal })
      } catch (err) {
        if (err.name !== "AbortError" && isMounted) {
          console.error("Error loading autos:", err)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [getAutos, clearSearch])

  if (loadingAutos) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando autos...</span>
        </Spinner>
      </div>
    )
  }

  if (errorAutos) {
    return <Alert variant="danger">{errorAutos}</Alert>
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Lista de Autos</h1>
        <div className="d-flex gap-2">
          <Button
            as={Link}
            to="/autos/nuevo"
            variant="primary"
            aria-label="Crear nuevo auto"
          >
            Agregar
          </Button>
          <Button
            as={Link}
            to="/buscar/autos"
            variant="primary"
            aria-label="Buscar auto existente"
          >
            Buscar
          </Button>
        </div>
      </div>

      {autos.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <Card.Text>No hay autos registrados</Card.Text>
            <Button as={Link} to="/autos/nuevo" variant="primary">
              Agregar primer auto
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {autos.map((auto) => (
            <Col key={auto._id}>
              <AutoCard auto={auto} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default AutoList
import React, { useState, useContext } from 'react'
import { Form, Button, Row, Col, Card, Spinner, Badge, Alert } from 'react-bootstrap'
import { PiezaContext } from '../../context/PiezaContext'
import { Link } from 'react-router-dom'

const PiezaSearch = () => {
  const API_URL_IMAGE = import.meta.env.VITE_API_URL_IMAGE

  const { 
    searchResults: piezas, 
    loadingPiezas, 
    errorPiezas, 
    searchPiezas, 
    clearError,
    clearSearch
  } = useContext(PiezaContext)

  const [searchParams, setSearchParams] = useState({
    texto: '',
    nombre: '',
    categorias: '',
    minPrecio: '',
    maxPrecio: '',
    minStock: '',
    disponible: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchParams(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    try {
      // Filtrar solo los parámetros con valor
      const paramsToSend = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      )
      await searchPiezas(paramsToSend)
    } catch (error) {
      console.error('Error en la búsqueda:', error)
    }
  }

  const handleReset = () => {
    setSearchParams({
      texto: '',
      nombre: '',
      categorias: '',
      minPrecio: '',
      maxPrecio: '',
      minStock: '',
      disponible: ''
    })
    clearError()
    clearSearch()
  }

  return (
    <div className="mt-4">
      <Card className="mb-4">
        <Card.Body>
          <h3>Buscar Piezas</h3>
          {errorPiezas && <Alert variant="danger" className="mt-3">{errorPiezas}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Búsqueda por texto</Form.Label>
                  <Form.Control
                    type="text"
                    name="texto"
                    value={searchParams.texto}
                    onChange={handleChange}
                    placeholder="Nombre, descripción, características..."
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre exacto</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={searchParams.nombre}
                    onChange={handleChange}
                    placeholder="Nombre de la pieza"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    name="categorias"
                    value={searchParams.categorias}
                    onChange={handleChange}
                  >
                    <option value="">Todas las categorías</option>
                    <option value="motor">Motor</option>
                    <option value="suspension">Suspensión</option>
                    <option value="frenos">Frenos</option>
                    <option value="electrico">Eléctrico</option>
                    <option value="carroceria">Carrocería</option>
                    <option value="interior">Interior</option>
                    <option value="exterior">Exterior</option>
                    <option value="otros">Otros</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio mínimo</Form.Label>
                  <Form.Control
                    type="number"
                    name="minPrecio"
                    value={searchParams.minPrecio}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio máximo</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxPrecio"
                    value={searchParams.maxPrecio}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock mínimo</Form.Label>
                  <Form.Control
                    type="number"
                    name="minStock"
                    value={searchParams.minStock}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Disponibilidad</Form.Label>
                  <Form.Select
                    name="disponible"
                    value={searchParams.disponible}
                    onChange={handleChange}
                  >
                    <option value="">Todas</option>
                    <option value="true">Disponible</option>
                    <option value="false">No disponible</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={handleReset}>
                Limpiar
              </Button>
              <Button variant="primary" type="submit" disabled={loadingPiezas}>
                {loadingPiezas ? <Spinner animation="border" size="sm" /> : 'Buscar'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      {piezas.length > 0 && (
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Resultados de la búsqueda ({piezas.length})</h4>
              <Badge bg="info">Búsqueda avanzada</Badge>
            </div>
            
            <Row>
              {piezas.map(pieza => (
                <Col key={pieza._id} md={4} className="mb-4">
                  <Card className="h-100">
                    <Card.Img 
                      variant="top" 
                      src={`${API_URL_IMAGE}/piezas/${pieza.imagen}` || `${API_URL_IMAGE}/no-image.png`} 
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${API_URL_IMAGE}/no-image.png`;
                      }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{pieza.nombre}</Card.Title>
                      <Badge bg="info" className="mb-2">{pieza.categoria}</Badge>
                      <Card.Text>
                        <strong>Precio:</strong> ${pieza.precio.toLocaleString()}<br />
                        <strong>Stock:</strong> {pieza.stock}<br />
                        <strong>Disponible:</strong> 
                        <Badge bg={pieza.disponible ? 'success' : 'danger'} className="ms-2">
                          {pieza.disponible ? 'Sí' : 'No'}
                        </Badge>
                      </Card.Text>
                      <Button 
                        as={Link} 
                        to={`/piezas/${pieza._id}`} 
                        variant="outline-primary" 
                        className="mt-auto"
                      >
                        Ver detalles
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}

export default PiezaSearch
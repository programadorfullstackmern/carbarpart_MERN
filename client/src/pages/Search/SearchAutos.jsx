import React, { useState, useContext } from 'react'
import { Form, Button, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap'
import { AutoContext } from '../../context/AutoContext'
import { Link } from 'react-router-dom'

const AutoSearch = () => {
  const API_URL_IMAGE = import.meta.env.VITE_API_URL_IMAGE || "https://carbarpart-server.onrender.com/uploads"

  const { 
    searchResults: autos, 
    loadingAutos, 
    errorAutos, 
    searchAutos, 
    clearError,
    clearSearch
  } = useContext(AutoContext)

  const [searchParams, setSearchParams] = useState({
    texto: '',
    fraseExacta: '',
    marcas: '',
    modelos: '',
    minYear: '',
    maxYear: '',
    minPrecio: '',
    maxPrecio: '',
    minKm: '',
    maxKm: '',
    colores: '',
    transmisiones: '',
    combustibles: '',
    opcionales: '',
    disponible: '',
    pieza: '',
    ciudad: '',
    estado: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchParams(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    try {
      const paramsToSend = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      )
      await searchAutos(paramsToSend)
    } catch (err) {
      console.error('Error en la búsqueda:', err)
    }
  }

  const handleReset = () => {
    setSearchParams({
      texto: '',
      fraseExacta: '',
      marcas: '',
      modelos: '',
      minYear: '',
      maxYear: '',
      minPrecio: '',
      maxPrecio: '',
      minKm: '',
      maxKm: '',
      colores: '',
      transmisiones: '',
      combustibles: '',
      opcionales: '',
      disponible: '',
      pieza: '',
      ciudad: '',
      estado: ''
    })
    clearError()
    clearSearch()
  }

  return (
    <div className="mt-4">
      <Card className="mb-4">
        <Card.Body>
          <h3>Búsqueda Avanzada de Autos</h3>
          {errorAutos && <Alert variant="danger" className="mt-3">{errorAutos}</Alert>}
          
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
                    placeholder="Marca, modelo, color..."
                  />
                  <Form.Text className="text-muted">
                    Busca en marca, modelo, color y ubicación
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Frase exacta</Form.Label>
                  <Form.Control
                    type="text"
                    name="fraseExacta"
                    value={searchParams.fraseExacta}
                    onChange={handleChange}
                    placeholder="Frase exacta a buscar"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marcas (separar por comas)</Form.Label>
                  <Form.Control
                    type="text"
                    name="marcas"
                    value={searchParams.marcas}
                    onChange={handleChange}
                    placeholder="Ej: Toyota,Ford,Chevrolet"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Modelos (separar por comas)</Form.Label>
                  <Form.Control
                    type="text"
                    name="modelos"
                    value={searchParams.modelos}
                    onChange={handleChange}
                    placeholder="Ej: Corolla,Fiesta,Cruze"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Año mínimo</Form.Label>
                  <Form.Control
                    type="number"
                    name="minYear"
                    value={searchParams.minYear}
                    onChange={handleChange}
                    min="1900"
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Año máximo</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxYear"
                    value={searchParams.maxYear}
                    onChange={handleChange}
                    min="1900"
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio mínimo</Form.Label>
                  <Form.Control
                    type="number"
                    name="minPrecio"
                    value={searchParams.minPrecio}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio máximo</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxPrecio"
                    value={searchParams.maxPrecio}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Kilometraje mínimo</Form.Label>
                  <Form.Control
                    type="number"
                    name="minKm"
                    value={searchParams.minKm}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Kilometraje máximo</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxKm"
                    value={searchParams.maxKm}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Colores (separar por comas)</Form.Label>
                  <Form.Control
                    type="text"
                    name="colores"
                    value={searchParams.colores}
                    onChange={handleChange}
                    placeholder="Ej: Rojo,Azul,Negro"
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Disponibilidad</Form.Label>
                  <Form.Select
                    name="disponible"
                    value={searchParams.disponible}
                    onChange={handleChange}
                  >
                    <option value="">Todos</option>
                    <option value="true">Disponibles</option>
                    <option value="false">No disponibles</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Transmisión (separar por comas)</Form.Label>
                  <Form.Control
                    type="text"
                    name="transmisiones"
                    value={searchParams.transmisiones}
                    onChange={handleChange}
                    placeholder="Ej: manual,automatica"
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Combustible (separar por comas)</Form.Label>
                  <Form.Control
                    type="text"
                    name="combustibles"
                    value={searchParams.combustibles}
                    onChange={handleChange}
                    placeholder="Ej: gasolina,diesel"
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Opcionales (separar por comas)</Form.Label>
                  <Form.Control
                    type="text"
                    name="opcionales"
                    value={searchParams.opcionales}
                    onChange={handleChange}
                    placeholder="Ej: aire,bluetooth"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    name="ciudad"
                    value={searchParams.ciudad}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    type="text"
                    name="estado"
                    value={searchParams.estado}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={handleReset}>
                Limpiar
              </Button>
              <Button variant="primary" type="submit" disabled={loadingAutos}>
                {loadingAutos ? <Spinner animation="border" size="sm" /> : 'Buscar'}
              </Button>
            </div>
          </Form>

        </Card.Body>
      </Card>
      
      {autos.length > 0 && (
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Resultados de la búsqueda ({autos.length})</h4>
              <Badge bg="info">Búsqueda avanzada</Badge>
            </div>
            
            <Row>
              {autos.map(auto => (
                <Col key={auto._id} md={4} className="mb-4">
                  <Card className="h-100">
                    <Card.Img 
                      variant="top" 
                      src={`${API_URL_IMAGE}/autos/${auto.imagen}` || `${API_URL_IMAGE}/no-image.png`} 
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${API_URL_IMAGE}/no-image.png`;
                      }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{auto.marca} {auto.modelo} ({auto.año})</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {auto.ubicacion?.ciudad}, {auto.ubicacion?.estado}
                      </Card.Subtitle>
                      <Card.Text>
                        <strong>Precio:</strong> ${auto.precio.toLocaleString()}<br />
                        <strong>Color:</strong> {auto.color || 'N/A'}<br />
                        <strong>Disponible:</strong> 
                        <Badge bg={auto.disponible ? 'success' : 'danger'} className="ms-2">
                          {auto.disponible ? 'Sí' : 'No'}
                        </Badge>
                      </Card.Text>
                      <Button 
                        as={Link} 
                        to={`/autos/${auto._id}`} 
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

export default AutoSearch
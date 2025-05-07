import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Form, Button, Alert, Spinner, Row, Col, ListGroup, Badge } from 'react-bootstrap'
import { AutoContext } from '../../context/AutoContext'
import ImageUploader from '../../components/common/ImageUploader'

const AutoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    currentAuto, 
    createAuto, 
    updateAuto, 
    getAutoById, 
    loading, 
    error,
    clearError
  } = useContext(AutoContext)
  
  const [autoData, setAutoData] = useState({
    marca: '',
    modelo: '',
    anio: '',
    precio: '',
    imagen: '',
    kilometraje: '',
    color: '',
    transmision: '',
    combustible: '',
    disponible: true,
    caracteristicas: [],
    opcionales: [],
    ubicacion: {
      ciudad: '',
      estado: ''
    }
  })
  
  const [selectedImage, setSelectedImage] = useState(null)
  const [opcionalInput, setOpcionalInput] = useState('')
  const [caracteristica, setCaracteristica] = useState({ nombre: '', valor: '' })

  const resetForm = () => {
    setAutoData({
      marca: '',
      modelo: '',
      anio: '',
      precio: '',
      imagen: '',
      kilometraje: '',
      color: '',
      transmision: '',
      combustible: '',
      disponible: true,
      caracteristicas: [],
      opcionales: [],
      ubicacion: {
        ciudad: '',
        estado: ''
      }
    })
    setSelectedImage(null)
    setOpcionalInput('')
    setCaracteristica({ nombre: '', valor: '' })
  }

  useEffect(() => {
    if (id && id !== 'nuevo') {
      getAutoById(id)
    }
    return () => clearError()
  }, [id, getAutoById, clearError])

  useEffect(() => {
    if (!id || id === 'nuevo') {
      resetForm()
    } else if (currentAuto) {
      setAutoData({
        marca: currentAuto.marca || '',
        modelo: currentAuto.modelo || '',
        anio: currentAuto.anio || '',
        precio: currentAuto.precio || '',
        imagen: currentAuto.imagen || '',
        kilometraje: currentAuto.kilometraje || '',
        color: currentAuto.color || '',
        transmision: currentAuto.transmision || '',
        combustible: currentAuto.combustible || '',
        disponible: currentAuto.disponible !== undefined ? currentAuto.disponible : true,
        caracteristicas: currentAuto.caracteristicas || [],
        opcionales: currentAuto.opcionales || [],
        ubicacion: {
          ciudad: currentAuto.ubicacion?.ciudad || '',
          estado: currentAuto.ubicacion?.estado || ''
        }
      })
    }
  }, [currentAuto, id])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('ubicacion.')) {
      const field = name.split('.')[1]
      setAutoData(prev => ({
        ...prev,
        ubicacion: {
          ...prev.ubicacion,
          [field]: value
        }
      }))
    } else {
      setAutoData(prev => ({ 
        ...prev, 
        [name]: value 
      }))
    }
  }

  const handleAddOpcional = () => {
    if (opcionalInput && !autoData.opcionales.includes(opcionalInput)) {
      setAutoData(prev => ({
        ...prev,
        opcionales: [...prev.opcionales, opcionalInput]
      }))
      setOpcionalInput('')
    }
  }

  const handleRemoveOpcional = (opcional) => {
    setAutoData(prev => ({
      ...prev,
      opcionales: prev.opcionales.filter(o => o !== opcional)
    }))
  }

  const handleAddCaracteristica = () => {
    if (caracteristica.nombre && caracteristica.valor) {
      setAutoData(prev => ({
        ...prev,
        caracteristicas: [...prev.caracteristicas, caracteristica]
      }))
      setCaracteristica({ nombre: '', valor: '' })
    }
  }

  const handleRemoveCaracteristica = (index) => {
    setAutoData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      
      // Agregar campos básicos
      formData.append('marca', autoData.marca)
      formData.append('modelo', autoData.modelo)
      formData.append('anio', autoData.anio)
      formData.append('precio', autoData.precio)
      formData.append('kilometraje', autoData.kilometraje)
      formData.append('color', autoData.color)
      formData.append('transmision', autoData.transmision)
      formData.append('combustible', autoData.combustible)
      formData.append('disponible', autoData.disponible)
      
      // Agregar ubicación
      formData.append('ubicacion[ciudad]', autoData.ubicacion.ciudad)
      formData.append('ubicacion[estado]', autoData.ubicacion.estado)
      
      // Agregar arrays
      autoData.caracteristicas.forEach((car, index) => {
        formData.append(`caracteristicas[${index}][nombre]`, car.nombre)
        formData.append(`caracteristicas[${index}][valor]`, car.valor)
      })
      
      autoData.opcionales.forEach((opcional, index) => {
        formData.append(`opcionales[${index}]`, opcional)
      })
  
      // Manejo de imagen
      if (selectedImage instanceof File) {
        formData.append('imagen', selectedImage)
      } else if (autoData.imagen && !selectedImage) {
        // Si hay una imagen existente y no se seleccionó una nueva
        formData.append('imagen', autoData.imagen)
      }
  
      if (id && id !== 'nuevo') {
        await updateAuto(id, formData)
      } else {
        await createAuto(formData)
      }
      navigate('/autos')
    } catch (err) {
      console.error('Error al guardar el auto:', err)
    }
  }

  return (
    <div className="container mt-4">
      <h2>{id && id !== 'nuevo' ? 'Editar Auto' : 'Nuevo Auto'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <ImageUploader 
          onFileSelect={setSelectedImage} 
          initialImage={autoData.imagen}
        />
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Marca *</Form.Label>
              <Form.Control
                type="text"
                name="marca"
                value={autoData.marca}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Modelo *</Form.Label>
              <Form.Control
                type="text"
                name="modelo"
                value={autoData.modelo}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Año *</Form.Label>
              <Form.Control
                type="number"
                name="anio"
                value={autoData.anio}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Precio *</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={autoData.precio}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Kilometraje</Form.Label>
              <Form.Control
                type="number"
                name="kilometraje"
                value={autoData.kilometraje}
                onChange={handleChange}
                min="0"
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                name="color"
                value={autoData.color}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Transmisión</Form.Label>
              <Form.Select
                name="transmision"
                value={autoData.transmision}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="manual">Manual</option>
                <option value="automatica">Automática</option>
                <option value="semi-automatica">Semi-automática</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Combustible</Form.Label>
              <Form.Select
                name="combustible"
                value={autoData.combustible}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="gasolina">Gasolina</option>
                <option value="diesel">Diesel</option>
                <option value="electrico">Eléctrico</option>
                <option value="hibrido">Híbrido</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type="text"
                name="ubicacion.ciudad"
                value={autoData.ubicacion.ciudad}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                name="ubicacion.estado"
                value={autoData.ubicacion.estado}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-3">
          <Form.Label>Opcionales</Form.Label>
          <div className="d-flex mb-2">
            <Form.Control
              type="text"
              value={opcionalInput}
              onChange={(e) => setOpcionalInput(e.target.value)}
              placeholder="Agregar opcional"
            />
            <Button variant="outline-primary" onClick={handleAddOpcional} className="ms-2">
              +
            </Button>
          </div>
          {autoData.opcionales?.length > 0 && (
            <div className="d-flex flex-wrap gap-2">
              {autoData.opcionales.map((opcional, index) => (
                <Badge key={index} bg="secondary" className="d-flex align-items-center">
                  {opcional}
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-white p-0 ms-1" 
                    onClick={() => handleRemoveOpcional(opcional)}
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Características</Form.Label>
          <Row className="mb-3">
            <Col md={5}>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={caracteristica.nombre}
                onChange={(e) => setCaracteristica({...caracteristica, nombre: e.target.value})}
              />
            </Col>
            <Col md={5}>
              <Form.Control
                type="text"
                placeholder="Valor"
                value={caracteristica.valor}
                onChange={(e) => setCaracteristica({...caracteristica, valor: e.target.value})}
              />
            </Col>
            <Col md={2}>
              <Button variant="outline-primary" onClick={handleAddCaracteristica}>
                Agregar
              </Button>
            </Col>
          </Row>
          {autoData.caracteristicas?.length > 0 && (
            <ListGroup>
              {autoData.caracteristicas.map((car, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{car.nombre}:</strong> {car.valor}
                  </div>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleRemoveCaracteristica(index)}
                  >
                    ×
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            id="disponible-switch"
            label="Disponible"
            name="disponible"
            checked={autoData.disponible}
            onChange={(e) => setAutoData({...autoData, disponible: e.target.checked})}
          />
        </Form.Group>
        
        <div className="d-flex justify-content-end gap-2">
          <Button as={Link} to="/autos" variant="secondary">
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Guardar'}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AutoForm
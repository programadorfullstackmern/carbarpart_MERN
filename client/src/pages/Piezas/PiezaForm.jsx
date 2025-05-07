import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Form, Button, Alert, Spinner, Row, Col, ListGroup, Badge } from 'react-bootstrap'
import { PiezaContext } from '../../context/PiezaContext'
import ImageUploader from '../../components/common/ImageUploader'

const PiezaForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    currentPieza, 
    createPieza, 
    updatePieza, 
    getPiezaById, 
    loading, 
    error,
    clearError
  } = useContext(PiezaContext)
  
  const [piezaData, setPiezaData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    stock: 0,
    imagen: '',
    marcaCompatibilidad: [],
    modeloCompatibilidad: [],
    anioMin: '',
    anioMax: '',
    caracteristicas: []
  })
  
  const [selectedImage, setSelectedImage] = useState(null)
  const [marcaInput, setMarcaInput] = useState('')
  const [modeloInput, setModeloInput] = useState('')
  const [caracteristica, setCaracteristica] = useState({ nombre: '', valor: '' })

  // Función para resetear el formulario
  const resetForm = () => {
    setPiezaData({
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: '',
      stock: 0,
      imagen: '',
      marcaCompatibilidad: [],
      modeloCompatibilidad: [],
      anioMin: '',
      anioMax: '',
      caracteristicas: []
    })
    setSelectedImage(null)
    setMarcaInput('')
    setModeloInput('')
    setCaracteristica({ nombre: '', valor: '' })
  }


  useEffect(() => {
    if (id && id !== 'nuevo') {
      getPiezaById(id)
    }
    return () => clearError()
  }, [id, getPiezaById, clearError])


  useEffect(() => {
      if (!id || id === 'nuevo') {
        resetForm()
      } else if (currentPieza) {
        setPiezaData({
          nombre: currentPieza.nombre || '',
          descripcion: currentPieza.descripcion || '',
          categoria: currentPieza.categoria || '',
          precio: currentPieza.precio || '',
          stock: currentPieza.stock || 0,
          imagen: currentPieza.imagen || '',
          marcaCompatibilidad: currentPieza.marcaCompatibilidad || [],
          modeloCompatibilidad: currentPieza.modeloCompatibilidad || [],
          anioMin: currentPieza.anioMin || '',
          anioMax: currentPieza.anioMax || '',
          caracteristicas: currentPieza.caracteristicas || []
        })
      }
    }, [currentPieza, id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setPiezaData(prev => ({ 
      ...prev, 
      [name]: value 
    }))
  }

  const handleAddMarca = () => {
    if (marcaInput && !piezaData.marcaCompatibilidad.includes(marcaInput)) {
      setPiezaData(prev => ({
        ...prev,
        marcaCompatibilidad: [...prev.marcaCompatibilidad, marcaInput]
      }))
      setMarcaInput('')
    }
  }

  const handleRemoveMarca = (marca) => {
    setPiezaData(prev => ({
      ...prev,
      marcaCompatibilidad: prev.marcaCompatibilidad.filter(m => m !== marca)
    }))
  }

  const handleAddModelo = () => {
    if (modeloInput && !piezaData.modeloCompatibilidad.includes(modeloInput)) {
      setPiezaData(prev => ({
        ...prev,
        modeloCompatibilidad: [...prev.modeloCompatibilidad, modeloInput]
      }))
      setModeloInput('')
    }
  }

  const handleRemoveModelo = (modelo) => {
    setPiezaData(prev => ({
      ...prev,
      modeloCompatibilidad: prev.modeloCompatibilidad.filter(m => m !== modelo)
    }))
  }

  const handleAddCaracteristica = () => {
    if (caracteristica.nombre && caracteristica.valor) {
      setPiezaData(prev => ({
        ...prev,
        caracteristicas: [...prev.caracteristicas, caracteristica]
      }))
      setCaracteristica({ nombre: '', valor: '' })
    }
  }

  const handleRemoveCaracteristica = (index) => {
    setPiezaData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()

      // Agregar campos básicos
      formData.append('nombre', piezaData.nombre)
      formData.append('categoria', piezaData.categoria)
      formData.append('descripcion', piezaData.descripcion)
      formData.append('precio', piezaData.precio)
      formData.append('stock', piezaData.stock)
      // En el handleSubmit, antes de agregar los campos al formData
const anioMinToSend = piezaData.anioMin === '' ? null : piezaData.anioMin
const anioMaxToSend = piezaData.anioMax === '' ? null : piezaData.anioMax

if (anioMinToSend !== null) {
  formData.append('anioMin', anioMinToSend)
}
if (anioMaxToSend !== null) {
  formData.append('anioMax', anioMaxToSend)
}
      
      // Agregar arrays de compatibilidad
      piezaData.marcaCompatibilidad.forEach((marcaCompatible, index) => {
        formData.append(`marcaCompatibilidad[${index}]`, marcaCompatible)
      })

      piezaData.modeloCompatibilidad.forEach((modeloCompatible, index) => {
        formData.append(`modeloCompatibilidad[${index}]`, modeloCompatible)
      })
      
      // Agregar características
      piezaData.caracteristicas.forEach((car, index) => {
        formData.append(`caracteristicas[${index}][nombre]`, car.nombre)
        formData.append(`caracteristicas[${index}][valor]`, car.valor)
      })
  
      // Manejo de imagen
      if (selectedImage instanceof File) {
        formData.append('imagen', selectedImage)
      } else if (piezaData.imagen && !selectedImage) {
        // Si hay una imagen existente y no se seleccionó una nueva
        formData.append('imagen', piezaData.imagen)
      }
  
      if (id && id !== 'nuevo') {
        await updatePieza(id, formData)
      } else {
        await createPieza(formData)
      }
      navigate('/piezas')
    } catch (err) {
      console.error('Error al guardar la pieza:', err)
    }
  }

  return (
    <div className="container mt-4">
      <h2>{id && id !== 'nuevo' ? 'Editar Pieza' : 'Nueva Pieza'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <ImageUploader 
          onFileSelect={setSelectedImage} 
          initialImage={piezaData.imagen}
        />
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={piezaData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Categoría *</Form.Label>
              <Form.Select
                name="categoria"
                value={piezaData.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una categoría</option>
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
        </Row>
        
        <Form.Group className="mb-3">
          <Form.Label>Descripción *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion"
            value={piezaData.descripcion}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Precio *</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={piezaData.precio}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Stock *</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={piezaData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Marcas Compatibles</Form.Label>
              <div className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={marcaInput}
                  onChange={(e) => setMarcaInput(e.target.value)}
                  placeholder="Agregar marca"
                />
                <Button variant="outline-primary" onClick={handleAddMarca} className="ms-2">
                  +
                </Button>
              </div>
              {piezaData.marcaCompatibilidad.length > 0 && (
                <div className="d-flex flex-wrap gap-2">
                  {piezaData.marcaCompatibilidad.map((marca, index) => (
                    <Badge key={index} bg="secondary" className="d-flex align-items-center">
                      {marca}
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-white p-0 ms-1" 
                        onClick={() => handleRemoveMarca(marca)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Modelos Compatibles</Form.Label>
              <div className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={modeloInput}
                  onChange={(e) => setModeloInput(e.target.value)}
                  placeholder="Agregar modelo"
                />
                <Button variant="outline-primary" onClick={handleAddModelo} className="ms-2">
                  +
                </Button>
              </div>
              {piezaData.modeloCompatibilidad.length > 0 && (
                <div className="d-flex flex-wrap gap-2">
                  {piezaData.modeloCompatibilidad.map((modelo, index) => (
                    <Badge key={index} bg="secondary" className="d-flex align-items-center">
                      {modelo}
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-white p-0 ms-1" 
                        onClick={() => handleRemoveModelo(modelo)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Año Mínimo</Form.Label>
              <Form.Control
                type="number"
                name="anioMin"
                value={piezaData.anioMin}
                onChange={handleChange}
                min="1900"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Año Máximo</Form.Label>
              <Form.Control
                type="number"
                name="anioMax"
                value={piezaData.anioMax}
                onChange={handleChange}
                min="1900"
              />
            </Form.Group>
          </Col>
        </Row>
        
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
          {piezaData.caracteristicas.length > 0 && (
            <ListGroup>
              {piezaData.caracteristicas.map((car, index) => (
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
        
        <div className="d-flex justify-content-end gap-2">
          <Button as={Link} to="/piezas" variant="secondary">
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

export default PiezaForm
import { useState } from 'react'
import { Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Gear, CashCoin, CarFront, ZoomIn } from 'react-bootstrap-icons'
import ImageModal from './ImageModal'

const PiezaCard = ({ pieza }) => {
  const API_URL_IMAGE = import.meta.env.VITE_API_URL_IMAGE || 'https://carbarpart-mern.onrender.com/uploads'
  const [showImageModal, setShowImageModal] = useState(false)

  return (
    <>
      <Card className="h-100 shadow-sm">
        <div 
          className="ratio ratio-16x9 bg-light position-relative"
          style={{ 
            backgroundImage: `url(${API_URL_IMAGE}/piezas/${pieza.imagen})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            cursor: pieza.imagen ? 'pointer' : 'default'
          }}
          aria-label={`Imagen de ${pieza.nombre}`}
          onClick={() => pieza.imagen && setShowImageModal(true)}
        >
          {!pieza.imagen && (
            <div className="d-flex align-items-center justify-content-center text-muted">
              <Gear size={48} />
            </div>
          )}
          {pieza.imagen && (
            <div className="position-absolute bottom-0 end-0 m-2">
              <Button 
                variant="light" 
                size="sm" 
                className="rounded-circle shadow-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowImageModal(true)
                }}
                aria-label="Ampliar imagen"
              >
                <ZoomIn />
              </Button>
            </div>
          )}
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="d-flex justify-content-between align-items-start">
            <span>
              {pieza.nombre}
              {pieza.stock > 0 ? (
                <Badge bg="success" className="ms-2">Disponible</Badge>
              ) : (
                <Badge bg="secondary" className="ms-2">Agotado</Badge>
              )}
            </span>
          </Card.Title>
          <Card.Text className="mb-2">
            <Badge bg="info">{pieza.categoria}</Badge>
          </Card.Text>
          <Card.Text className="text-truncate mb-3">{pieza.descripcion}</Card.Text>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 text-primary">
                <CashCoin className="me-1" /> ${pieza.precio.toLocaleString()}
              </h5>
              {pieza.autosCompatibles?.length > 0 && (
                <small className="text-muted">
                  <CarFront className="me-1" /> {pieza.autosCompatibles.length} autos
                </small>
              )}
            </div>
            <div className="d-grid gap-2">
              <Button as={Link} to={`/piezas/${pieza._id}`} variant="primary">
                Ver detalles
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <ImageModal 
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={`${API_URL_IMAGE}/piezas/${pieza.imagen}`}
        altText={pieza.nombre}
      />
    </>
  )
}

export default PiezaCard
import { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  CarFront,
  Gear,
  CashCoin,
  Calendar,
  ZoomIn,
} from "react-bootstrap-icons";
import ImageModal from "./ImageModal";

const AutoCard = ({ auto }) => {
  const API_URL_IMAGE = import.meta.env.VITE_API_URL_IMAGE;
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
      <Card className="h-100 shadow-sm">
        <div
          className="ratio ratio-16x9 bg-light position-relative"
          style={{
            backgroundImage: `url(${API_URL_IMAGE}/autos/${auto.imagen})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: auto.imagen ? "pointer" : "default",
          }}
          aria-label={`Imagen de ${auto.marca} ${auto.modelo}`}
          onClick={() => auto.imagen && setShowImageModal(true)}
        >
          {!auto.imagen && (
            <div className="d-flex align-items-center justify-content-center text-muted">
              <CarFront size={48} />
            </div>
          )}
          {auto.imagen && (
            <div className="position-absolute bottom-0 end-0 m-2">
              <Button
                variant="light"
                size="sm"
                className="rounded-circle shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageModal(true);
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
              {auto.marca} {auto.modelo}
              {auto.disponible ? (
                <Badge bg="success" className="ms-2">
                  Disponible
                </Badge>
              ) : (
                <Badge bg="secondary" className="ms-2">
                  Agotado
                </Badge>
              )}
            </span>
          </Card.Title>
          <Card.Text className="text-muted mb-2">
            <Calendar className="me-1" /> {auto.año}
          </Card.Text>
          <Card.Text className="text-truncate mb-3">
            {auto.descripcion}
          </Card.Text>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 text-primary">
                <CashCoin className="me-1" /> ${auto.precio.toLocaleString()}
              </h5>
              {auto.piezasCompatibles?.length > 0 && (
                <small className="text-muted">
                  <Gear className="me-1" /> {auto.piezasCompatibles.length}{" "}
                  piezas
                </small>
              )}
            </div>
            <div className="d-grid gap-2">
              <Button as={Link} to={`/autos/${auto._id}`} variant="primary">
                Ver detalles
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={`${API_URL_IMAGE}/autos/${auto.imagen}`}
        altText={`${auto.marca} ${auto.modelo}`}
      />
    </>
  );
};

export default AutoCard;

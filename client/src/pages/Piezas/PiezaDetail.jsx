import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
  ListGroup,
} from "react-bootstrap";
import {
  Gear,
  CashCoin,
  ArrowLeft,
  Pencil,
  Trash,
  CarFront,
} from "react-bootstrap-icons";
import AutoCard from "../../components/ui/AutoCard";
import DeleteModal from "../../components/ui/DeleteModal";
import { PiezaContext } from "../../context/PiezaContext";
import ImageModal from "../../components/ui/ImageModal";

const PiezaDetail = () => {
  const API_URL_IMAGE =
    import.meta.env.VITE_API_URL_IMAGE || "http://localhost:5000/uploads";
  const [showImageModal, setShowImageModal] = useState(false);

  const { id } = useParams();
  const { currentPieza, getPiezaById, deletePieza } = useContext(PiezaContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPieza = async () => {
      try {
        setLoading(true);
        const response = await getPiezaById(id);
      } catch (err) {
        setError(err.message || "Error al cargar la pieza");
      } finally {
        setLoading(false);
      }
    };
    fetchPieza();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePieza(id);
      navigate("/piezas");
    } catch (err) {
      setError(err.message || "Error al eliminar la pieza");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando pieza...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!currentPieza) {
    return <Alert variant="warning">Pieza no encontrada</Alert>;
  }

  return (
    <>
      <Button
        variant="outline-secondary"
        onClick={() => navigate("/piezas")}
        className="mb-3 d-flex align-items-center"
      >
        <ArrowLeft className="me-1" /> Volver a la lista
      </Button>

      <Card className="mb-4">
        <Row className="g-0">
          <Col md={6} lg={5}>
            <div
              className="h-100 ratio ratio-16x9 bg-light"
              style={{
                backgroundImage: `url(${API_URL_IMAGE}/piezas/${currentPieza.imagen})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "300px",
              }}
              aria-label={`Imagen de ${currentPieza.nombre}`}
              onClick={() => currentPieza.imagen && setShowImageModal(true)}
            >
              {!currentPieza.imagen && (
                <div className="d-flex align-items-center justify-content-center text-muted">
                  <Gear size={64} />
                </div>
              )}
            </div>
          </Col>
          <Col md={6} lg={7}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <Card.Title as="h2" className="mb-0">
                  {currentPieza.nombre}
                  {currentPieza.disponible ? (
                    <Badge bg="success" className="ms-2">
                      Disponible
                    </Badge>
                  ) : (
                    <Badge bg="secondary" className="ms-2">
                      Agotado
                    </Badge>
                  )}
                </Card.Title>
                <div>
                  <Button
                    variant="outline-primary"
                    onClick={() =>
                      navigate(`/piezas/editar/${currentPieza._id}`)
                    }
                    className="me-2"
                  >
                    <Pencil /> Editar
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash /> Eliminar
                  </Button>
                </div>
              </div>

              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item>
                  <strong>Categoría:</strong>{" "}
                  <Badge bg="info">{currentPieza.categoria}</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>
                    <CashCoin className="me-2" /> Precio:
                  </strong>{" "}
                  ${currentPieza.precio.toLocaleString()}
                </ListGroup.Item>
              </ListGroup>

              <Card.Text>{currentPieza.descripcion}</Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {currentPieza.autosCompatibles?.length > 0 && (
        <section className="mb-5">
          <h3 className="mb-4">Autos compatibles</h3>
          <Row xs={1} md={2} lg={3} className="g-4">
            {currentPieza.autosCompatibles.map((auto) => (
              <Col key={auto._id}>
                <AutoCard auto={auto} />
              </Col>
            ))}
          </Row>
        </section>
      )}

      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={`${API_URL_IMAGE}/piezas/${currentPieza.imagen}`}
        altText={`${currentPieza.marca} ${currentPieza.modelo}`}
      />

      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Pieza"
        message={`¿Estás seguro que deseas eliminar la pieza ${currentPieza.nombre}? Esta acción no se puede deshacer.`}
      />
    </>
  );
};

export default PiezaDetail;

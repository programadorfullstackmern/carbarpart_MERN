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
  CarFront,
  Gear,
  CashCoin,
  Calendar,
  ArrowLeft,
  Pencil,
  Trash,
} from "react-bootstrap-icons";
import PiezaCard from "../../components/ui/PiezaCard";
import DeleteModal from "../../components/ui/DeleteModal";
import { AutoContext } from "../../context/AutoContext";
import ImageModal from "../../components/ui/ImageModal";

const AutoDetail = () => {
  const API_URL_IMAGE = import.meta.env.VITE_API_URL_IMAGE;
    const [showImageModal, setShowImageModal] = useState(false);

  const { id } = useParams();
  const { currentAuto, getAutoById, deleteAuto } = useContext(AutoContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchAuto = async () => {
      try {
        setLoading(true);
        const response = await getAutoById(id);
      } catch (err) {
        setError(err.message || "Error al cargar el auto");
      } finally {
        setLoading(false);
      }
    };
    fetchAuto();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteAuto(id);
      navigate("/autos");
    } catch (err) {
      setError(err.message || "Error al eliminar el auto");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando auto...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!currentAuto) {
    return <Alert variant="warning">Auto no encontrado</Alert>;
  }

  return (
    <>
      <Button
        variant="outline-secondary"
        onClick={() => navigate("/autos")}
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
                backgroundImage: `url(${API_URL_IMAGE}/autos/${currentAuto.imagen})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "300px",
              }}
              aria-label={`Imagen de ${currentAuto.marca} ${currentAuto.modelo}`}
              onClick={() => currentAuto.imagen && setShowImageModal(true)}
            >
              {!currentAuto.imagen && (
                <div className="d-flex align-items-center justify-content-center text-muted">
                  <CarFront size={64} />
                </div>
              )}
            </div>
          </Col>
          <Col md={6} lg={7}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <Card.Title as="h2" className="mb-0">
                  {currentAuto.marca} {currentAuto.modelo}
                  {currentAuto.disponible ? (
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
                    onClick={() => navigate(`/autos/editar/${currentAuto._id}`)}
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
                  <strong>
                    <Calendar className="me-2" /> Año:
                  </strong>{" "}
                  {currentAuto.anio}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>
                    <CashCoin className="me-2" /> Precio:
                  </strong>{" "}
                  ${currentAuto.precio.toLocaleString()}
                </ListGroup.Item>
              </ListGroup>

              <Card.Text>{currentAuto.descripcion}</Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {currentAuto.piezasCompatibles?.length > 0 && (
        <section className="mb-5">
          <h3 className="mb-4">Piezas compatibles</h3>
          <Row xs={1} md={2} lg={3} className="g-4">
            {currentAuto.piezasCompatibles.map((pieza) => (
              <Col key={pieza._id}>
                <PiezaCard pieza={pieza} />
              </Col>
            ))}
          </Row>
        </section>
      )}

      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={`${API_URL_IMAGE}/autos/${currentAuto.imagen}`}
        altText={`${currentAuto.marca} ${currentAuto.modelo}`}
      />

      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Auto"
        message={`¿Estás seguro que deseas eliminar el auto ${currentAuto.marca} ${currentAuto.modelo}? Esta acción no se puede deshacer.`}
      />
    </>
  );
};

export default AutoDetail;

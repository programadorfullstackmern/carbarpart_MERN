import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Envelope, Telephone } from 'react-bootstrap-icons'

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>CarBar & Parts</h5>
            <p>
              Venta de autos y piezas originales con la mejor calidad y servicio.
            </p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Enlaces rápidos</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/autos" className="text-decoration-none">
                  Autos disponibles
                </Link>
              </li>
              <li>
                <Link to="/piezas" className="text-decoration-none">
                  Piezas en stock
                </Link>
              </li>
              <li>
                <Link to="/buscar/autos" className="text-decoration-none">
                  Buscar autos
                </Link>
              </li>
              <li>
                <Link to="/buscar/piezas" className="text-decoration-none">
                  Buscar piezas
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contacto</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <Envelope className="me-2" /> carbarparts@gmail.com
              </li>
              <li className="d-flex align-items-center">
                <Telephone className="me-2" /> (+1 234 567 890)  (+1 234 567 890)
              </li>
            </ul>
            <div className="mt-3">
              <a href="#" className="me-3" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="me-3" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="me-3" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </Col>
        </Row>
        <hr className="my-4 bg-secondary" />
        <Row>
          <Col className="text-center">
            <small>&copy; {new Date().getFullYear()} CarBar & Parts. Todos los derechos reservados.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
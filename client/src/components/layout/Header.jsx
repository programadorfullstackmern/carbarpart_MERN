import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CarFront, Gear, Search, HouseDoor, PlusCircle } from 'react-bootstrap-icons'

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <CarFront className="me-2" />
          CarBar & Parts
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <HouseDoor className="me-1" /> Inicio
            </Nav.Link>
            
            <NavDropdown title="Buscar" id="search-dropdown" menuVariant="dark">
              <NavDropdown.Item as={Link} to="/buscar/autos" className="d-flex align-items-center">
                <CarFront className="me-2" /> Autos
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/buscar/piezas" className="d-flex align-items-center">
                <Gear className="me-2" /> Piezas
              </NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown title="Registrar" id="register-dropdown" menuVariant="dark">
              <NavDropdown.Item as={Link} to="/autos/nuevo" className="d-flex align-items-center">
                <PlusCircle className="me-2" /> Auto
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/piezas/nueva" className="d-flex align-items-center">
                <PlusCircle className="me-2" /> Pieza
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Listar" id="register-dropdown" menuVariant="dark">
              <NavDropdown.Item as={Link} to="/autos" className="d-flex align-items-center">
                <PlusCircle className="me-2" /> Autos
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/piezas" className="d-flex align-items-center">
                <PlusCircle className="me-2" /> Piezas
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
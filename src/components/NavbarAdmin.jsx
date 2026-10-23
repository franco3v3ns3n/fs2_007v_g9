import { useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'

function NavbarAdmin() {
  const [expanded, setExpanded] = useState(false)

  function cerrarMenu() {
    setExpanded(false)
  }

  return (
    <header>
      <Navbar expand="lg" expanded={expanded} onToggle={setExpanded}
        className="bg-body-tertiary border-bottom" aria-label="Navegación administrativa">
        <Container>
          <Navbar.Brand as={Link} to="/admin" className="mb-0" onClick={cerrarMenu}>
            <img src="/img/logo/logo-huertohogar.webp" alt="Logo de HuertoHogar"
              className="brand-logo" width="1254" height="1254" />
            HuertoHogar <small className="d-block d-lg-inline fs-6">— Administración</small>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="menuAdministrativo" aria-expanded={expanded}
            label="Mostrar u ocultar menú" />
          <Navbar.Collapse id="menuAdministrativo">
            <Nav as="ul" className="ms-auto mb-2 mb-lg-0">
              <Nav.Item as="li"><Nav.Link as={NavLink} to="/admin" end onClick={cerrarMenu}>Inicio</Nav.Link></Nav.Item>
              <Nav.Item as="li"><Nav.Link as={NavLink} to="/admin/productos" onClick={cerrarMenu}>Productos</Nav.Link></Nav.Item>
              <Nav.Item as="li"><Nav.Link as={NavLink} to="/admin/usuarios" onClick={cerrarMenu}>Usuarios</Nav.Link></Nav.Item>
              <Nav.Item as="li"><Nav.Link as={Link} to="/" onClick={cerrarMenu}>Volver a tienda</Nav.Link></Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default NavbarAdmin

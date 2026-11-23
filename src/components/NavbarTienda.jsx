import { useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function NavbarTienda({ cantidadCarrito, nombreSesion, cerrarSesion }) {
  const [expanded, setExpanded] = useState(false)

  function cerrarMenu() {
    setExpanded(false)
  }

  function salir() {
    cerrarMenu()
    cerrarSesion()
  }

  return (
    <header>
      <Navbar expand="xl" expanded={expanded} onToggle={setExpanded}
        className="navbar-tienda bg-body-tertiary border-bottom" aria-label="Navegación principal">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="mb-0" onClick={cerrarMenu}>
            <img src="/img/logo/logo-huertohogar.webp" alt="Logo de HuertoHogar"
              className="brand-logo" width="1254" height="1254" />
            HuertoHogar
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="menuPrincipal" aria-expanded={expanded} label="Mostrar u ocultar menú" />
          <Navbar.Collapse id="menuPrincipal">
            <Nav as="ul" className="ms-auto mb-2 mb-lg-0">
              <Nav.Item as="li"><Nav.Link as={NavLink} to="/" end onClick={cerrarMenu}>Inicio</Nav.Link></Nav.Item>
              <Nav.Item as="li"><Nav.Link as={NavLink} to="/productos" onClick={cerrarMenu}>Productos</Nav.Link></Nav.Item>
              <Nav.Item as="li"><Nav.Link as={NavLink} to="/nosotros" onClick={cerrarMenu}>Nosotros</Nav.Link></Nav.Item>
              <Nav.Item as="li"><Nav.Link as={NavLink} to="/blog" onClick={cerrarMenu}>Blog</Nav.Link></Nav.Item>
              <Nav.Item as="li"><Nav.Link as={NavLink} to="/contacto" onClick={cerrarMenu}>Contacto</Nav.Link></Nav.Item>
              {nombreSesion ? (
                <>
                  <Nav.Item as="li"><Navbar.Text className="px-xl-2">{nombreSesion}</Navbar.Text></Nav.Item>
                  <Nav.Item as="li"><Nav.Link as="button" type="button" onClick={salir}>Cerrar sesión</Nav.Link></Nav.Item>
                </>
              ) : (
                <>
                  <Nav.Item as="li"><Nav.Link as={NavLink} to="/login" onClick={cerrarMenu}>Iniciar sesión</Nav.Link></Nav.Item>
                  <Nav.Item as="li"><Nav.Link as={NavLink} to="/registro" onClick={cerrarMenu}>Registro</Nav.Link></Nav.Item>
                </>
              )}
              <Nav.Item as="li"><Nav.Link as={NavLink} to="/carrito" onClick={cerrarMenu}>Carrito ({cantidadCarrito})</Nav.Link></Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default NavbarTienda

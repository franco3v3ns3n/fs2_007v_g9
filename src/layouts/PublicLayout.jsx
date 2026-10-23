import { Alert, Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import NavbarTienda from '../components/NavbarTienda'
import FooterTienda from '../components/FooterTienda'

function PublicLayout({ cantidadCarrito, mensajeCarrito }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarTienda cantidadCarrito={cantidadCarrito} />
      <Container as="main" className="flex-grow-1 py-4 py-lg-5">
        {mensajeCarrito && <Alert variant="success" role="status">{mensajeCarrito}</Alert>}
        <Outlet />
      </Container>
      <FooterTienda />
    </div>
  )
}

export default PublicLayout

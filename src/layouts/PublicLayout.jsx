import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import NavbarTienda from '../components/NavbarTienda'
import FooterTienda from '../components/FooterTienda'

function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarTienda />
      <Container as="main" className="flex-grow-1 py-5">
        <Outlet />
      </Container>
      <FooterTienda />
    </div>
  )
}

export default PublicLayout

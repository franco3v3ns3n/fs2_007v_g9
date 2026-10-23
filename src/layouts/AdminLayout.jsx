import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import NavbarAdmin from '../components/NavbarAdmin'
import FooterAdmin from '../components/FooterAdmin'

function AdminLayout() {
  return (
    <div className="admin-page d-flex flex-column min-vh-100">
      <NavbarAdmin />
      <Container as="main" className="flex-grow-1 py-4 py-lg-5">
        <Outlet />
      </Container>
      <FooterAdmin />
    </div>
  )
}

export default AdminLayout

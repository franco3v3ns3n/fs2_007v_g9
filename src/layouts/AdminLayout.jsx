import { Container } from 'react-bootstrap'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import NavbarAdmin from '../components/NavbarAdmin'
import FooterAdmin from '../components/FooterAdmin'

function AdminLayout({ sesion, nombreSesion, cerrarSesion }) {
  const { pathname, search, hash } = useLocation()
  if (!sesion) return <Navigate to="/login" replace state={{ volverAdmin: pathname + search + hash }} />
  if (sesion.usuario.rol !== 'ADMINISTRADOR') return <Navigate to="/" replace />

  return (
    <div className="admin-page d-flex flex-column min-vh-100">
      <NavbarAdmin nombreSesion={nombreSesion} cerrarSesion={cerrarSesion} />
      <Container as="main" className="flex-grow-1 py-4 py-lg-5">
        <Outlet />
      </Container>
      <FooterAdmin />
    </div>
  )
}

export default AdminLayout

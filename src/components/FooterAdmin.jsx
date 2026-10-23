import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function FooterAdmin() {
  return (
    <footer className="site-footer admin-footer border-top bg-body-tertiary py-3">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
          <div>
            <p className="footer-brand mb-1">HuertoHogar — Administración</p>
            <p className="footer-description mb-0">Panel de gestión de productos y usuarios.</p>
          </div>
          <Link to="/" className="footer-store-link">Volver a la tienda</Link>
        </div>
        <div className="footer-bottom border-top mt-3 pt-3">
          <p className="mb-0">© 2026 HuertoHogar</p>
        </div>
      </Container>
    </footer>
  )
}

export default FooterAdmin

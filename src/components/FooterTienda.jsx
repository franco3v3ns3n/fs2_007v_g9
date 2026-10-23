import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function FooterTienda() {
  return (
    <footer className="site-footer border-top bg-body-tertiary py-4">
      <Container>
        <p className="footer-brand mb-1">HuertoHogar</p>
        <p className="footer-description mb-3">Productos frescos y naturales, del campo a tu hogar.</p>
        <nav className="footer-nav d-flex flex-wrap gap-3" aria-label="Navegación del pie de página">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>
        <div className="footer-bottom border-top mt-3 pt-3">
          <p className="mb-0">© 2026 HuertoHogar</p>
        </div>
      </Container>
    </footer>
  )
}

export default FooterTienda

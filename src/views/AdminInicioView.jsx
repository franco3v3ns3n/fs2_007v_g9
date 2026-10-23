import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext'

function AdminInicioView() {
  const { productos } = useProductos()
  return (
    <>
      <section className="mb-4">
        <h1>Administración HuertoHogar</h1>
        <p className="lead">
          Desde esta sección puedes acceder a las vistas de gestión de productos y
          usuarios del prototipo administrativo.
        </p>
      </section>

      <Row className="g-4">
        <Col xs={12} md={6} lg={4}>
          <Card as="section" className="h-100">
            <Card.Body>
              <Card.Title as="h2" className="h4">Productos</Card.Title>
              <p>Consulta los productos disponibles en el catálogo de HuertoHogar.</p>
              <Button as={Link} role="link" to="/admin/productos" variant="outline-primary">Ir a Productos</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card as="section" className="h-100">
            <Card.Body>
              <Card.Title as="h2" className="h4">Usuarios</Card.Title>
              <p>Accede al listado administrativo de usuarios del prototipo.</p>
              <Button as={Link} role="link" to="/admin/usuarios" variant="outline-primary">Ir a Usuarios</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card as="section" className="h-100">
            <Card.Body>
              <Card.Title as="h2" className="h4">Resumen administrativo</Card.Title>
              <p>{productos.length} productos en el catálogo</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AdminInicioView

import { Button, Col, Image, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'

function DetalleProductoView({ productos }) {
  const { codigo } = useParams()
  const producto = productos.find((item) => item.codigo === codigo)

  if (!producto) {
    return (
      <>
        <h1 className="mb-4">Producto no encontrado</h1>
        <Button as={Link} role="link" to="/productos" variant="outline-primary">Volver al catálogo</Button>
      </>
    )
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} lg={9} xl={8}>
        <article className="bg-body p-4 p-md-5 border rounded-3">
          <Image src={producto.imagen} alt={producto.imagenReferencial ? 'Imagen referencial de productos de HuertoHogar' : producto.nombre} fluid
            className="product-detail-image" width="1200" height="900" />
          {producto.imagenReferencial && <p className="small text-body-secondary">Imagen referencial de HuertoHogar; no representa una fotografía individual del producto.</p>}
          <h1 className="mb-4">{producto.nombre}</h1>
          <p><strong>Código:</strong> {producto.codigo}</p>
          <p><strong>Categoría:</strong> {producto.categoria}</p>

          <section className="mb-4">
            <h2 className="h4">Precio y disponibilidad</h2>
            <p className="product-price"><strong>Precio:</strong> ${producto.precio.toLocaleString('es-CL')} por {producto.unidadPrecio}</p>
            <p><strong>Stock:</strong> {producto.stock} {producto.unidadStock}</p>
          </section>

          <section className="mb-4">
            <h2 className="h4">Descripción</h2>
            <p>{producto.descripcion}</p>
          </section>

          <section className="mb-4">
            <h2 className="h4">Origen</h2>
            <p>{producto.origen}</p>
            {producto.origenSimulado && (
              <p className="small text-body-secondary">Origen referencial: dato simulado para el prototipo.</p>
            )}
          </section>

          <Button as={Link} role="link" to="/productos" variant="outline-primary">Volver al catálogo</Button>
        </article>
      </Col>
    </Row>
  )
}

export default DetalleProductoView

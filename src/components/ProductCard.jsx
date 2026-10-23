import { Button, Card } from 'react-bootstrap'

function ProductCard({ producto }) {
  return (
    <Card as="article" className="h-100">
      <Card.Img variant="top" src={producto.imagen} alt={producto.nombre}
        className="product-card-image" width="1200" height="900" />
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h3" className="h5">{producto.nombre}</Card.Title>
        <Card.Text><strong>Código:</strong> {producto.codigo}</Card.Text>
        <Card.Text className="product-price">
          <strong>Precio:</strong> ${producto.precio.toLocaleString('es-CL')} por {producto.unidadPrecio}
        </Card.Text>
        <Card.Text><strong>Stock:</strong> {producto.stock} {producto.unidadStock}</Card.Text>
        <Card.Text>{producto.descripcion}</Card.Text>
        <Button type="button" variant="outline-secondary" className="mt-auto align-self-start" disabled>
          Ver detalle
        </Button>
      </Card.Body>
    </Card>
  )
}

export default ProductCard

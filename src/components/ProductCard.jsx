import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { maximoComprable } from '../utils/carrito'

function ProductCard({ producto, cantidadEnCarrito, agregarAlCarrito }) {
  const maximo = maximoComprable(producto)
  return (
    <Card as="article" className="h-100">
      <Card.Img variant="top" src={producto.imagen} alt={producto.imagenReferencial ? 'Imagen referencial de productos de HuertoHogar' : producto.nombre}
        className="product-card-image" width="1200" height="900" />
      <Card.Body className="d-flex flex-column">
        {producto.imagenReferencial && <p className="small text-body-secondary">Imagen referencial de HuertoHogar.</p>}
        <Card.Title as="h3" className="h5">{producto.nombre}</Card.Title>
        <Card.Text><strong>Código:</strong> {producto.codigo}</Card.Text>
        <Card.Text className="product-price">
          <strong>Precio:</strong> ${producto.precio.toLocaleString('es-CL')} por {producto.unidadPrecio}
        </Card.Text>
        <Card.Text><strong>Stock:</strong> {producto.stock} {producto.unidadStock}</Card.Text>
        <Card.Text>{producto.descripcion}</Card.Text>
        <div className="mt-auto d-flex flex-column align-items-start gap-2">
          <Button as={Link} role="link" to={`/producto/${producto.codigo}`} variant="outline-primary">Ver detalle</Button>
          <Button onClick={() => agregarAlCarrito(producto.codigo)} disabled={maximo < 1 || cantidadEnCarrito >= maximo}
            aria-label={`Agregar al carrito: ${producto.nombre}`}>Agregar al carrito</Button>
          {maximo < 1 ? <p className="small text-body-secondary mb-0">No disponible para agregar una unidad entera.</p>
            : cantidadEnCarrito >= maximo && <p className="small text-body-secondary mb-0">Has alcanzado el stock disponible en el carrito.</p>}
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProductCard

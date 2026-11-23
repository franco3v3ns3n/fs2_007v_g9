import { Button, Card, Col, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { maximoComprable } from '../utils/carrito'

function CarritoView({ carrito, productos, modificarCantidad, eliminarDelCarrito, confirmarCompra }) {
  const cantidadTotal = carrito.reduce((suma, articulo) => suma + articulo.cantidad, 0)
  const total = carrito.reduce((suma, articulo) => {
    const producto = productos.find((item) => item.codigo === articulo.codigo)
    return suma + (producto ? producto.precio * articulo.cantidad : 0)
  }, 0)

  return (
    <>
      <h1 className="mb-4">Carrito de compras</h1>
      {carrito.length === 0 ? (
        <>
          <p>Tu carrito está vacío.</p>
          <Button as={Link} role="link" to="/productos" variant="outline-primary">Ver productos</Button>
        </>
      ) : (
        <Row className="g-4">
          <Col xs={12} lg={8}>
            {carrito.map((articulo) => {
              const producto = productos.find((item) => item.codigo === articulo.codigo)
              if (!producto) return null
              return (
                <Card as="article" key={articulo.codigo} className="carrito-articulo mb-4">
                  <Card.Body>
                    <Row className="g-3 align-items-start">
                      <Col xs={12} md={4}>
                        <Image src={producto.imagen} className="carrito-imagen" width="1200" height="900"
                          alt={producto.imagenReferencial ? 'Imagen referencial de productos de HuertoHogar' : producto.nombre} />
                        {producto.imagenReferencial && <p className="small text-body-secondary mt-2">Imagen referencial de HuertoHogar.</p>}
                      </Col>
                      <Col xs={12} md={8}>
                        <Card.Title as="h2" className="h4"><Link to={`/producto/${producto.codigo}`}>{producto.nombre}</Link></Card.Title>
                        <p><strong>Código:</strong> {producto.codigo}</p>
                        <p><strong>Precio unitario:</strong> ${producto.precio.toLocaleString('es-CL')} por {producto.unidadPrecio}</p>
                        <div className="d-flex flex-wrap align-items-center gap-2" role="group" aria-label={`Cantidad de ${producto.nombre}`}>
                          <Button variant="outline-primary" aria-label={`Disminuir cantidad de ${producto.nombre}`}
                            disabled={articulo.cantidad <= 1} onClick={() => modificarCantidad(producto.codigo, articulo.cantidad - 1)}>−</Button>
                          <span>Cantidad: <strong>{articulo.cantidad}</strong></span>
                          <Button variant="outline-primary" aria-label={`Aumentar cantidad de ${producto.nombre}`}
                            disabled={articulo.cantidad >= maximoComprable(producto)} onClick={() => modificarCantidad(producto.codigo, articulo.cantidad + 1)}>+</Button>
                        </div>
                        <p className="product-price mt-3"><strong>Subtotal:</strong> ${(producto.precio * articulo.cantidad).toLocaleString('es-CL')}</p>
                        <Button variant="outline-secondary" aria-label={`Eliminar ${producto.nombre} del carrito`}
                          onClick={() => eliminarDelCarrito(producto.codigo)}>Eliminar</Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )
            })}
          </Col>
          <Col xs={12} lg={4}>
            <Card as="aside">
              <Card.Body>
                <h2 className="h4">Resumen del carrito</h2>
                <p><strong>Número total de artículos:</strong> {cantidadTotal}</p>
                <p className="product-price"><strong>Total del carrito:</strong> ${total.toLocaleString('es-CL')}</p>
                <div className="d-grid mb-2">
                  <Button type="button" onClick={confirmarCompra}>Confirmar compra</Button>
                </div>
                <Button as={Link} role="link" to="/productos" variant="outline-primary">Seguir viendo productos</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      <p className="small text-body-secondary mt-4">Este carrito es una demostración. No se procesan pagos reales.</p>
    </>
  )
}

export default CarritoView

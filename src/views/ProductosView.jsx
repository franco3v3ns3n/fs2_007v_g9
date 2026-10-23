import { Col, Row } from 'react-bootstrap'
import ProductCard from '../components/ProductCard'

const categorias = [
  {
    nombre: 'Frutas Frescas',
    descripcion: 'Frutas cultivadas y cosechadas en el punto óptimo de madurez para asegurar su sabor y frescura.',
  },
  {
    nombre: 'Verduras Orgánicas',
    descripcion: 'Verduras cultivadas sin el uso de pesticidas ni químicos y seleccionadas por su calidad y valor nutricional.',
  },
  {
    nombre: 'Productos Orgánicos',
    descripcion: 'Productos elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables.',
  },
  {
    nombre: 'Productos Lácteos',
    descripcion: 'Productos provenientes de granjas locales dedicadas a una producción responsable y de calidad.',
  },
]

function ProductosView({ productos }) {
  return (
    <>
      <section className="mb-5">
        <h1 className="mb-3">Catálogo de productos</h1>
        <p className="lead">
          Conoce la selección de productos frescos y naturales que HuertoHogar lleva
          directamente del campo a tu hogar.
        </p>
      </section>
      {categorias.map((categoria) => (
        <section className="mb-5" key={categoria.nombre}>
          <h2>{categoria.nombre}</h2>
          <p>{categoria.descripcion}</p>
          <Row className="g-4">
            {productos
              .filter((producto) => producto.categoria === categoria.nombre)
              .map((producto) => (
                <Col xs={12} md={6} lg={4} key={producto.codigo}>
                  <ProductCard producto={producto} />
                </Col>
              ))}
          </Row>
          {!productos.some((producto) => producto.categoria === categoria.nombre) && (
            <p className="small text-body-secondary">No hay productos disponibles en esta categoría.</p>
          )}
        </section>
      ))}
    </>
  )
}

export default ProductosView

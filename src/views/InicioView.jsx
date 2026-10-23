import { Button, Card, Col, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { productosIniciales } from '../data/productosIniciales'

const categorias = [
  { nombre: 'Frutas Frescas', descripcion: 'Frutas seleccionadas para disfrutar su sabor y frescura.' },
  { nombre: 'Verduras Orgánicas', descripcion: 'Verduras cultivadas mediante prácticas responsables.' },
  { nombre: 'Productos Orgánicos', descripcion: 'Alternativas naturales elaboradas por productores locales.' },
  { nombre: 'Productos Lácteos', descripcion: 'Productos lácteos seleccionados por su calidad y sabor.' },
]

const destacados = [
  { codigo: 'FR001', descripcion: 'Manzanas crujientes y dulces cultivadas en el Valle del Maule.' },
  { codigo: 'VR001', descripcion: "Zanahorias frescas cultivadas sin pesticidas en la Región de O'Higgins." },
  { codigo: 'PO001', descripcion: 'Miel pura y orgánica producida por apicultores locales.' },
]

function InicioView() {
  return (
    <>
      <section className="home-hero p-4 p-lg-5 mb-5 bg-body-tertiary">
        <Row className="g-4 align-items-center">
          <Col xs={12} lg={7}>
            <h1 className="display-5 fw-semibold">Productos frescos del campo a tu hogar</h1>
            <p className="lead">HuertoHogar es una tienda online de productos frescos y naturales que busca acercar los alimentos del campo a las familias de manera simple y confiable.</p>
            <Button as={Link} role="link" to="/productos">Conoce nuestros productos</Button>
          </Col>
          <Col xs={12} lg={5}>
            <Image src="/img/portada/portada-huertohogar.webp" fluid className="home-hero-image" alt="Selección de frutas, verduras y productos frescos" width="1600" height="900" />
          </Col>
        </Row>
      </section>
      <section className="mb-5">
        <h2>Categorías</h2>
        <Row className="g-4">
          {categorias.map((categoria) => (
            <Col xs={12} md={6} xl={3} key={categoria.nombre}>
              <Card as="article" className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title as="h3" className="h5">{categoria.nombre}</Card.Title>
                  <p>{categoria.descripcion}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
      <section className="mb-5">
        <h2>Productos destacados</h2>
        <Row className="g-4">
          {destacados.map((destacado) => {
            const producto = productosIniciales.find((item) => item.codigo === destacado.codigo)
            // Inicio abrevia la unidad (por ejemplo, "frasco") como en EP1.
            const unidadBreve = producto.unidadPrecio.split(' de ')[0]
            return (
              <Col xs={12} md={6} lg={4} key={producto.codigo}>
                <Card as="article" className="h-100">
                  <Card.Img variant="top" src={producto.imagen} className="product-card-image" alt={producto.nombre} width="1200" height="900" />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title as="h3" className="h5">{producto.nombre}</Card.Title>
                    <p><strong>Código:</strong> {producto.codigo}</p>
                    <p className="product-price"><strong>Precio:</strong> ${producto.precio.toLocaleString('es-CL')} por {unidadBreve}</p>
                    <p>{destacado.descripcion}</p>
                    <Button as={Link} role="link" to={`/producto/${producto.codigo}`} variant="outline-primary" className="mt-auto align-self-start">Ver detalle</Button>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      </section>
      <section className="mb-5">
        <h2>Conoce HuertoHogar</h2>
        <p className="lead">Conectamos a los consumidores con productos del campo, promoviendo alimentos frescos, el apoyo a productores locales y prácticas más sostenibles.</p>
        <Button as={Link} role="link" to="/nosotros">Conoce más sobre nosotros</Button>
      </section>
    </>
  )
}

export default InicioView

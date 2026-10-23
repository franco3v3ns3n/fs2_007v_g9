import { Button, Col, Image, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { articulosBlog } from '../data/articulosBlog'

function DetalleBlogView() {
  const { slug } = useParams()
  const articulo = articulosBlog.find((item) => item.slug === slug)

  if (!articulo) {
    return (
      <>
        <h1 className="mb-4">Artículo no encontrado</h1>
        <Button as={Link} role="link" to="/blog" variant="outline-primary">Volver al Blog</Button>
      </>
    )
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} lg={9} xl={8}>
        <article className="bg-body p-4 p-md-5 border rounded-3">
          <h1 className="mb-4">{articulo.titulo}</h1>
          <Image src={articulo.imagen} fluid className="blog-detail-image" alt={articulo.imagenAlt} width="1200" height="900" />
          <p>{articulo.introduccion}</p>
          {articulo.secciones.map((seccion) => (
            <section className="mb-4" key={seccion.titulo}>
              <h2 className="h4">{seccion.titulo}</h2>
              {seccion.parrafos.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
            </section>
          ))}
          <Button as={Link} role="link" to="/blog" variant="outline-primary">Volver al Blog</Button>
        </article>
      </Col>
    </Row>
  )
}

export default DetalleBlogView

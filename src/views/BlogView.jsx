import { Col, Row } from 'react-bootstrap'
import BlogCard from '../components/BlogCard'
import { articulosBlog } from '../data/articulosBlog'

function BlogView() {
  return (
    <>
      <section className="mb-5">
        <h1 className="mb-3">Blog HuertoHogar</h1>
        <p className="lead">Un espacio para compartir contenidos sobre alimentación saludable, productos frescos y decisiones cotidianas relacionadas con la sostenibilidad.</p>
      </section>
      <section className="mb-5">
        <h2>Artículos</h2>
        <Row className="g-4">
          {articulosBlog.map((articulo) => (
            <Col xs={12} md={6} lg={4} key={articulo.slug}>
              <BlogCard articulo={articulo} />
            </Col>
          ))}
        </Row>
      </section>
    </>
  )
}

export default BlogView

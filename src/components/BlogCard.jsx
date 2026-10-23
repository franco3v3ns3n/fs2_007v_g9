import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function BlogCard({ articulo }) {
  return (
    <Card as="article" className="h-100">
      <Card.Img variant="top" src={articulo.imagen} className="blog-card-image" alt={articulo.imagenAlt} width="1200" height="900" loading="lazy" />
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h3" className="h5">{articulo.titulo}</Card.Title>
        <p>{articulo.resumen}</p>
        <Button as={Link} role="link" to={`/blog/${articulo.slug}`} variant="outline-primary" className="mt-auto align-self-start">Leer más</Button>
      </Card.Body>
    </Card>
  )
}

export default BlogCard

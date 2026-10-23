import { Card, Col, Image, Row } from 'react-bootstrap'

function NosotrosView() {
  return (
    <>
      <section className="mb-4">
        <Row className="g-4 align-items-center">
          <Col xs={12} lg={6}>
            <h1>Sobre HuertoHogar</h1>
            <p className="lead">HuertoHogar es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de sus clientes en Chile. Cuenta con más de 6 años de experiencia y opera en más de 9 puntos a lo largo del país. Su propósito es conectar a las familias chilenas con el campo y promover un estilo de vida saludable y sostenible.</p>
          </Col>
          <Col xs={12} lg={6}>
            <Image src="/img/nosotros/campo-huertohogar.webp" fluid className="about-image" alt="Huerto con cultivos de hortalizas y paisaje rural" width="1200" height="900" loading="lazy" />
          </Col>
        </Row>
      </section>
      <Row className="g-4">
        <Col xs={12} md={6}>
          <Card as="section" className="h-100">
            <Card.Body>
              <Card.Title as="h2" className="h4">Misión</Card.Title>
              <p>Nuestra misión es proporcionar productos frescos y de calidad directamente desde el campo hasta la puerta de nuestros clientes, garantizando la frescura y el sabor en cada entrega. Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores locales, apoyando prácticas agrícolas sostenibles y promoviendo una alimentación saludable en todos los hogares chilenos.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card as="section" className="h-100">
            <Card.Body>
              <Card.Title as="h2" className="h4">Visión</Card.Title>
              <p>Nuestra visión es ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad. Aspiramos a expandir nuestra presencia a nivel nacional e internacional, estableciendo un nuevo estándar en la distribución de productos agrícolas directos del productor al consumidor.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card as="section" className="h-100">
            <Card.Body>
              <Card.Title as="h2" className="h4">Nuestra presencia</Card.Title>
              <p>Entre las ciudades donde HuertoHogar está presente se encuentran:</p>
              <ul>
                <li>Santiago</li><li>Puerto Montt</li><li>Villarica</li><li>Nacimiento</li>
                <li>Viña del Mar</li><li>Valparaíso</li><li>Concepción</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card as="section" className="h-100">
            <Card.Body>
              <Card.Title as="h2" className="h4">Nuestro compromiso</Card.Title>
              <p>Nos comprometemos a ofrecer productos frescos y de calidad, fortalecer la conexión entre consumidores y agricultores locales, apoyar prácticas agrícolas sostenibles y promover una alimentación saludable.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default NosotrosView

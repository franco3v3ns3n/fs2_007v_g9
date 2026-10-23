import { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import CampoFormulario from '../components/CampoFormulario'
import { validarCorreo } from '../utils/validaciones'

function ContactoView() {
  const [valores, setValores] = useState({ nombre: '', correo: '', comentario: '' })
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  function cambiar(event) {
    const { name, value } = event.target
    setValores({ ...valores, [name]: value })
    setErrores({ ...errores, [name]: '' })
    setMensaje('')
  }

  function enviar(event) {
    event.preventDefault()
    const nuevosErrores = {
      nombre: valores.nombre.trim() ? '' : 'Ingresa tu nombre.',
      correo: validarCorreo(valores.correo),
      comentario: valores.comentario.trim() ? '' : 'Ingresa un comentario.',
    }
    setErrores(nuevosErrores)
    setMensaje(Object.values(nuevosErrores).some(Boolean) ? '' : 'Formulario de contacto validado correctamente.')
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={8} xl={6}>
        <Card as="section" className="shadow-sm">
          <Card.Body className="p-4">
            <h1 className="h2 mb-3">Contacto</h1>
            <p>Si tienes una consulta sobre HuertoHogar o nuestros productos, completa el siguiente formulario para comunicarte con nosotros.</p>
            <Form noValidate className="mt-4" onSubmit={enviar}>
              <CampoFormulario id="nombreContacto" nombre="nombre" etiqueta="Nombre:" valor={valores.nombre} onChange={cambiar} error={errores.nombre} />
              <CampoFormulario id="correoContacto" nombre="correo" etiqueta="Correo electrónico:" tipo="email" valor={valores.correo} onChange={cambiar} error={errores.correo} />
              <CampoFormulario id="comentarioContacto" nombre="comentario" etiqueta="Comentario:" filas={6} valor={valores.comentario} onChange={cambiar} error={errores.comentario} />
              <Button type="submit">Enviar</Button>
              <p className="text-success mt-3 mb-0" role="status" aria-live="polite">{mensaje}</p>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default ContactoView

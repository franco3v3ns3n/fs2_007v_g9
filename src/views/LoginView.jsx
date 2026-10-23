import { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import CampoFormulario from '../components/CampoFormulario'
import { validarCorreo, validarPassword } from '../utils/validaciones'

function LoginView() {
  const [valores, setValores] = useState({ correo: '', password: '' })
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
    const nuevosErrores = { correo: validarCorreo(valores.correo), password: validarPassword(valores.password) }
    setErrores(nuevosErrores)
    setMensaje(Object.values(nuevosErrores).some(Boolean) ? '' : 'Datos de inicio de sesión válidos.')
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={8} xl={6}>
        <Card as="section" className="shadow-sm">
          <Card.Body className="p-4">
            <h1 className="h2 mb-3">Inicio de sesión</h1>
            <p>Ingresa tu correo electrónico y contraseña para acceder a HuertoHogar.</p>
            <Form noValidate className="mt-4" onSubmit={enviar}>
              <CampoFormulario id="correoLogin" nombre="correo" etiqueta="Correo electrónico:" tipo="email" valor={valores.correo} onChange={cambiar} error={errores.correo} />
              <CampoFormulario id="passwordLogin" nombre="password" etiqueta="Contraseña:" tipo="password" valor={valores.password} onChange={cambiar} error={errores.password} />
              <Button type="submit">Iniciar sesión</Button>
              <p className="text-success mt-3 mb-0" role="status" aria-live="polite">{mensaje}</p>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginView

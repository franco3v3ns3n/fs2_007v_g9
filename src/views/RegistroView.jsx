import { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import CampoFormulario from '../components/CampoFormulario'
import { validarCorreo, validarPassword, validarTelefono } from '../utils/validaciones'

function RegistroView() {
  const [valores, setValores] = useState({ nombre: '', apellido: '', correo: '', telefono: '', password: '', confirmar: '' })
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
      apellido: valores.apellido.trim() ? '' : 'Ingresa tu apellido.',
      correo: validarCorreo(valores.correo),
      telefono: validarTelefono(valores.telefono),
      password: validarPassword(valores.password),
      confirmar: valores.confirmar === '' ? 'Confirma tu contraseña.' : valores.confirmar !== valores.password ? 'Las contraseñas no coinciden.' : '',
    }
    setErrores(nuevosErrores)
    setMensaje(Object.values(nuevosErrores).some(Boolean) ? '' : 'Formulario de registro validado correctamente.')
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={8} xl={6}>
        <Card as="section" className="shadow-sm">
          <Card.Body className="p-4">
            <h1 className="h2 mb-3">Registro</h1>
            <p>Completa tus datos para crear tu cuenta en HuertoHogar.</p>
            <Form noValidate className="mt-4" onSubmit={enviar}>
              <CampoFormulario id="nombreRegistro" nombre="nombre" etiqueta="Nombre:" valor={valores.nombre} onChange={cambiar} error={errores.nombre} />
              <CampoFormulario id="apellidoRegistro" nombre="apellido" etiqueta="Apellido:" valor={valores.apellido} onChange={cambiar} error={errores.apellido} />
              <CampoFormulario id="correoRegistro" nombre="correo" etiqueta="Correo electrónico:" tipo="email" valor={valores.correo} onChange={cambiar} error={errores.correo} />
              <CampoFormulario id="telefonoRegistro" nombre="telefono" etiqueta="Teléfono:" tipo="tel" prefijo="+56" valor={valores.telefono} onChange={cambiar} error={errores.telefono} />
              <CampoFormulario id="passwordRegistro" nombre="password" etiqueta="Contraseña:" tipo="password" valor={valores.password} onChange={cambiar} error={errores.password} />
              <CampoFormulario id="confirmarPasswordRegistro" nombre="confirmar" etiqueta="Confirmar contraseña:" tipo="password" valor={valores.confirmar} onChange={cambiar} error={errores.confirmar} />
              <Button type="submit">Registrarse</Button>
              <p className="text-success mt-3 mb-0" role="status" aria-live="polite">{mensaje}</p>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default RegistroView

import { useRef, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import CampoFormulario from '../components/CampoFormulario'
import { registrarUsuario } from '../services/authService'
import { getErrorMessage } from '../utils/getErrorMessage'
import { normalizarCorreo, validarUsuario } from '../utils/usuarios'

const valoresIniciales = { nombre: '', apellido: '', correo: '', telefono: '', password: '', confirmar: '' }

function RegistroView() {
  const [valores, setValores] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [registrando, setRegistrando] = useState(false)
  const enviando = useRef(false)

  function cambiar(event) {
    const { name, value } = event.target
    setValores({ ...valores, [name]: value })
    setErrores({ ...errores, [name]: '', general: '' })
    setMensaje('')
  }

  async function enviar(event) {
    event.preventDefault()
    if (enviando.current) return
    const nuevosErrores = validarUsuario(valores, { registroPublico: true })
    setErrores(nuevosErrores)
    setMensaje('')
    if (Object.keys(nuevosErrores).length) return

    enviando.current = true
    setRegistrando(true)
    try {
      await registrarUsuario({ ...valores, correo: normalizarCorreo(valores.correo) })
      setValores(valoresIniciales)
      setMensaje('Cuenta creada correctamente.')
    } catch (error) {
      const campo = error?.response?.status === 409 ? 'correo' : 'general'
      setErrores({ [campo]: getErrorMessage(error, 'No se pudo crear la cuenta', 'No se pudo contactar con el servidor para crear la cuenta.') })
    } finally {
      enviando.current = false
      setRegistrando(false)
    }
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
              {errores.general && <p className="text-danger" role="alert">{errores.general}</p>}
              <Button type="submit" disabled={registrando}>{registrando ? 'Registrando...' : 'Registrarse'}</Button>
              <p className="text-success mt-3 mb-0" role="status" aria-live="polite">{mensaje}</p>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default RegistroView

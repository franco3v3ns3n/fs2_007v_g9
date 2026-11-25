import { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Form, Row, Tab, Tabs } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import CampoFormulario from '../components/CampoFormulario'
import { iniciarSesion } from '../services/authService'
import { getErrorMessage } from '../utils/getErrorMessage'
import { crearSesion } from '../utils/sesion'
import { normalizarCorreo } from '../utils/usuarios'
import { validarCorreo, validarPassword } from '../utils/validaciones'

const valoresIniciales = { correo: '', password: '' }

function LoginView({ alIniciarSesion }) {
  const navegar = useNavigate()
  const { state } = useLocation()
  const volverAdmin = typeof state?.volverAdmin === 'string' && /^\/admin(?:\/[a-z0-9-]+)*\/?(?:[?#].*)?$/i.test(state.volverAdmin)
    ? state.volverAdmin
    : null
  const [tipo, setTipo] = useState(volverAdmin ? 'administrador' : 'cliente')
  const [valores, setValores] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [ingresando, setIngresando] = useState(false)
  const solicitud = useRef(null)

  useEffect(() => () => { solicitud.current?.abort() }, [])

  function cambiarTipo(nuevoTipo) {
    if (!nuevoTipo || nuevoTipo === tipo || solicitud.current) return
    setTipo(nuevoTipo)
    setValores(valoresIniciales)
    setErrores({})
    setMensaje('')
  }

  function cambiar(event) {
    const { name, value } = event.target
    setValores({ ...valores, [name]: value })
    setErrores({ ...errores, [name]: '' })
    setMensaje('')
  }

  async function enviar(event) {
    event.preventDefault()
    if (solicitud.current) return
    const nuevosErrores = { correo: validarCorreo(valores.correo), password: validarPassword(valores.password) }
    setErrores(nuevosErrores)
    if (Object.values(nuevosErrores).some(Boolean)) {
      setMensaje('')
      return
    }
    const controlador = new AbortController()
    solicitud.current = controlador
    setIngresando(true)
    setMensaje('')
    try {
      const respuesta = await iniciarSesion({ ...valores, correo: normalizarCorreo(valores.correo) }, controlador.signal)
      if (controlador.signal.aborted) return
      const nuevaSesion = crearSesion(respuesta)
      if (!nuevaSesion) {
        setMensaje('El servidor no devolvió una sesión válida.')
        return
      }
      const administrador = nuevaSesion.usuario.rol === 'ADMINISTRADOR'
      if (administrador !== (tipo === 'administrador')) {
        setMensaje(`Esta cuenta debe iniciar sesión en la pestaña ${administrador ? 'Administrador' : 'Cliente'}.`)
        return
      }
      alIniciarSesion(nuevaSesion)
      const destinoCliente = state?.volverAlCarrito === true ? '/carrito' : '/'
      navegar(administrador ? volverAdmin ?? '/admin' : destinoCliente, { replace: true })
    } catch (error) {
      if (!controlador.signal.aborted) {
        setMensaje(error?.response?.status === 401
          ? 'Correo electrónico o contraseña incorrectos.'
          : getErrorMessage(error, 'No se pudo iniciar sesión', 'No se pudo contactar con el servidor para iniciar sesión.'))
      }
    } finally {
      solicitud.current = null
      if (!controlador.signal.aborted) setIngresando(false)
    }
  }

  const formulario = (
    <Form noValidate className="mt-4" onSubmit={enviar}>
      <CampoFormulario id="correoLogin" nombre="correo" etiqueta="Correo electrónico:" tipo="email" valor={valores.correo} onChange={cambiar} error={errores.correo} />
      <CampoFormulario id="passwordLogin" nombre="password" etiqueta="Contraseña:" tipo="password" valor={valores.password} onChange={cambiar} error={errores.password} />
      <Button type="submit" disabled={ingresando}>{ingresando ? 'Ingresando...' : 'Iniciar sesión'}</Button>
      {mensaje && <p className="text-danger mt-3 mb-0" role="alert">{mensaje}</p>}
    </Form>
  )

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={8} xl={6}>
        <Card as="section" className="shadow-sm">
          <Card.Body className="p-4">
            <h1 className="h2 mb-3">Inicio de sesión</h1>
            <p>Ingresa tu correo electrónico y contraseña para acceder a HuertoHogar.</p>
            <Tabs id="tipoSesion" aria-label="Tipo de cuenta" activeKey={tipo} onSelect={cambiarTipo} transition={false}>
              <Tab eventKey="cliente" title="Cliente" disabled={ingresando && tipo !== 'cliente'}>{tipo === 'cliente' && formulario}</Tab>
              <Tab eventKey="administrador" title="Administrador" disabled={ingresando && tipo !== 'administrador'}>{tipo === 'administrador' && formulario}</Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginView

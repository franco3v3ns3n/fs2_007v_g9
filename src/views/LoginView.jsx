import { useState } from 'react'
import { Button, Card, Col, Form, Row, Tab, Tabs } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import CampoFormulario from '../components/CampoFormulario'
import { administradorDemo } from '../data/administradorDemo'
import { validarCorreo, validarPassword } from '../utils/validaciones'

const valoresIniciales = { correo: '', password: '' }

function LoginView({ iniciarSesion }) {
  const navegar = useNavigate()
  const { state } = useLocation()
  const [tipo, setTipo] = useState('cliente')
  const [valores, setValores] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  function cambiarTipo(nuevoTipo) {
    if (!nuevoTipo || nuevoTipo === tipo) return
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

  function enviar(event) {
    event.preventDefault()
    const nuevosErrores = { correo: validarCorreo(valores.correo), password: validarPassword(valores.password) }
    setErrores(nuevosErrores)
    if (Object.values(nuevosErrores).some(Boolean)) {
      setMensaje('')
      return
    }
    if (!iniciarSesion(tipo, valores)) {
      setMensaje('Correo electrónico o contraseña incorrectos.')
      return
    }
    const destinoCliente = state?.volverAlCarrito === true ? '/carrito' : '/'
    navegar(tipo === 'administrador' ? '/admin' : destinoCliente, { replace: true })
  }

  const formulario = (
    <Form noValidate className="mt-4" onSubmit={enviar}>
      <CampoFormulario id="correoLogin" nombre="correo" etiqueta="Correo electrónico:" tipo="email" valor={valores.correo} onChange={cambiar} error={errores.correo} />
      <CampoFormulario id="passwordLogin" nombre="password" etiqueta="Contraseña:" tipo="password" valor={valores.password} onChange={cambiar} error={errores.password} />
      <Button type="submit">Iniciar sesión</Button>
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
              <Tab eventKey="cliente" title="Cliente">{tipo === 'cliente' && formulario}</Tab>
              <Tab eventKey="administrador" title="Administrador">{tipo === 'administrador' && formulario}</Tab>
            </Tabs>
          </Card.Body>
        </Card>
        {tipo === 'administrador' && (
          <aside aria-labelledby="credencialesAdmin" className="bg-warning-subtle text-dark rounded-1 shadow-sm mt-3 p-3">
            <h2 id="credencialesAdmin" className="h6 fw-bold mb-2">Credenciales</h2>
            <p className="mb-1"><strong>Correo:</strong> <code>{administradorDemo.correo}</code></p>
            <p className="mb-0"><strong>Contraseña:</strong> <code>{administradorDemo.password}</code></p>
          </aside>
        )}
      </Col>
    </Row>
  )
}

export default LoginView

import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CampoFormulario from './CampoFormulario'
import { validarUsuario } from '../utils/usuarios'

function UsuarioFormulario({ usuario, onGuardar }) {
  const editar = Boolean(usuario)
  const navigate = useNavigate()
  const [valores, setValores] = useState(() => ({
    nombre: usuario?.nombre ?? '',
    apellido: usuario?.apellido ?? '',
    correo: usuario?.correo ?? '',
    telefono: usuario?.telefono ?? '',
    direccion: usuario?.direccion ?? '',
    ...(editar ? {} : { password: '' }),
  }))
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const enviando = useRef(false)

  useEffect(() => () => { enviando.current = false }, [])

  function cambiar(event) {
    const { name, value } = event.target
    setValores({ ...valores, [name]: value })
    setErrores({ ...errores, [name]: '', general: '' })
  }

  async function enviar(event) {
    event.preventDefault()
    if (enviando.current) return
    const nuevosErrores = validarUsuario(valores, { editar })
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length) return

    enviando.current = true
    setGuardando(true)
    try {
      const { usuario: guardado } = await onGuardar(valores)
      if (!enviando.current) return
      navigate('/admin/usuarios', {
        replace: true,
        state: { mensaje: `Registro de ${guardado.nombre} ${guardado.apellido} ${editar ? 'actualizado' : 'agregado'} correctamente.` },
      })
    } catch (error) {
      if (enviando.current) {
        const campo = error.status === 409 ? 'correo' : 'general'
        setErrores({ [campo]: error.message })
      }
    } finally {
      if (enviando.current) {
        enviando.current = false
        setGuardando(false)
      }
    }
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={8} xl={6}>
        <Card as="section" className="shadow-sm">
          <Card.Body className="p-4">
            <h1 className="h2 mb-3">{editar ? 'Editar usuario' : 'Nuevo usuario'}</h1>
            <p>{editar
              ? 'Actualiza los datos del cliente.'
              : 'Completa los datos para crear una cuenta de cliente.'}</p>
            <Form noValidate className="mt-4" onSubmit={enviar}>
              <CampoFormulario id="nombreUsuario" nombre="nombre" etiqueta="Nombre:" valor={valores.nombre} onChange={cambiar} error={errores.nombre} />
              <CampoFormulario id="apellidoUsuario" nombre="apellido" etiqueta="Apellido:" valor={valores.apellido} onChange={cambiar} error={errores.apellido} />
              <CampoFormulario id="correoUsuario" nombre="correo" etiqueta="Correo electrónico:" tipo="email" valor={valores.correo} onChange={cambiar} error={errores.correo} />
              <CampoFormulario id="telefonoUsuario" nombre="telefono" etiqueta="Teléfono:" tipo="tel" prefijo="+56" valor={valores.telefono} onChange={cambiar} error={errores.telefono} />
              <CampoFormulario id="direccionUsuario" nombre="direccion" etiqueta="Dirección:" valor={valores.direccion} onChange={cambiar} error={errores.direccion} requerido={!editar} />
              {!editar && (
                <>
                  <CampoFormulario id="passwordUsuario" nombre="password" etiqueta="Contraseña:" tipo="password" valor={valores.password} onChange={cambiar} error={errores.password} />
                  <p className="small text-body-secondary">Usa una contraseña de 4 a 10 caracteres.</p>
                </>
              )}
              {errores.general && <Alert variant="danger" role="alert">{errores.general}</Alert>}
              <Button type="submit" disabled={guardando}>{guardando ? 'Guardando...' : editar ? 'Guardar cambios' : 'Guardar usuario'}</Button>
            </Form>
            <p className="mt-4"><Button as={Link} role="link" to="/admin/usuarios" variant="outline-secondary">Volver a Usuarios</Button></p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default UsuarioFormulario

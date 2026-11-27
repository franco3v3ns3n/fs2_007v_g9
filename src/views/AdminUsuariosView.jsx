import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Button, Modal, Table } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useConsultaUsuarios } from '../hooks/useConsultaUsuarios'
import { eliminarUsuario, listarUsuarios } from '../services/usuarioService'

function AdminUsuariosView({ ejecutarUsuario }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mensaje, setMensaje] = useState(location.state?.mensaje ?? '')
  const [seleccionado, setSeleccionado] = useState(null)
  const [errorEliminacion, setErrorEliminacion] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const eliminacionEnCurso = useRef(false)
  const consultar = useCallback((signal) => ejecutarUsuario((token) => listarUsuarios(token, signal)), [ejecutarUsuario])
  const { datos: usuarios, error, cargando, recargar, actualizarDatos } = useConsultaUsuarios(consultar)

  useEffect(() => {
    if (!location.state?.mensaje) return
    const { mensaje: confirmacion, ...estado } = location.state
    setMensaje(confirmacion)
    navigate({ pathname: location.pathname, search: location.search, hash: location.hash }, {
      replace: true,
      state: estado,
    })
  }, [location, navigate])

  function seleccionar(usuario) {
    setMensaje('')
    setErrorEliminacion(null)
    setSeleccionado(usuario)
  }

  function cerrarModal() {
    if (eliminacionEnCurso.current) return
    setSeleccionado(null)
  }

  async function confirmarEliminacion() {
    if (!seleccionado || eliminacionEnCurso.current) return
    eliminacionEnCurso.current = true
    setEliminando(true)
    setErrorEliminacion(null)
    try {
      await ejecutarUsuario((token) => eliminarUsuario(seleccionado.id, token))
      actualizarDatos((actuales) => actuales.filter((usuario) => usuario.id !== seleccionado.id))
      setMensaje(`Registro de ${seleccionado.nombre} ${seleccionado.apellido} eliminado.`)
      setSeleccionado(null)
    } catch (error) {
      setErrorEliminacion(error)
    } finally {
      eliminacionEnCurso.current = false
      setEliminando(false)
    }
  }

  function actualizarListado() {
    cerrarModal()
    recargar()
  }

  return (
    <>
      <section className="mb-4">
        <h1>Administración de usuarios</h1>
        <p>Consulta y administra las cuentas de clientes de HuertoHogar.</p>
        <Button as={Link} role="link" to="/admin/usuarios/nuevo">Nuevo usuario</Button>
      </section>
      {mensaje && <Alert variant="success" role="status">{mensaje}</Alert>}
      <section className="mb-4">
        <h2>Listado de usuarios</h2>
        {cargando && <p role="status">Cargando usuarios…</p>}
        {error && (
          <Alert variant="danger" role="alert">
            <p>{error.message}</p>
            <Button variant="outline-danger" size="sm" onClick={recargar}>Reintentar consulta</Button>
          </Alert>
        )}
        {usuarios?.length === 0 && <p>No hay usuarios registrados.</p>}
        {usuarios?.length > 0 && (
          <div className="table-responsive border rounded" role="region" aria-label="Listado de usuarios" tabIndex={0}>
            <Table striped hover className="align-middle mb-0">
              <thead>
                <tr>{['Nombre', 'Correo', 'Teléfono', 'Acción'].map((columna) => <th key={columna} scope="col" className="text-nowrap">{columna}</th>)}</tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="text-nowrap">{usuario.nombre} {usuario.apellido}</td>
                    <td className="text-nowrap">{usuario.correo}</td>
                    <td className="text-nowrap">+56 {usuario.telefono}</td>
                    <td className="text-nowrap">
                      <Button as={Link} role="link" to={`/admin/usuarios/${usuario.id}/editar`} variant="outline-primary" size="sm">Editar</Button>{' '}
                      <Button variant="outline-danger" size="sm" onClick={() => seleccionar(usuario)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </section>
      <Modal show={Boolean(seleccionado)} onHide={cerrarModal} centered aria-labelledby="tituloEliminarUsuario">
        <Modal.Header closeButton={!eliminando} closeLabel="Cerrar">
          <Modal.Title id="tituloEliminarUsuario">Eliminar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className={errorEliminacion ? 'mb-3' : 'mb-0'}>¿Quieres eliminar el registro de {seleccionado?.nombre} {seleccionado?.apellido}? Esta acción no se puede deshacer.</p>
          {errorEliminacion && <Alert variant="danger" role="alert" className="mb-0">{errorEliminacion.message}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" disabled={eliminando} onClick={cerrarModal}>Cancelar</Button>
          {errorEliminacion?.status === 404 && <Button variant="outline-primary" onClick={actualizarListado}>Actualizar listado</Button>}
          <Button variant="danger" disabled={eliminando} onClick={confirmarEliminacion}>{eliminando ? 'Eliminando...' : 'Eliminar usuario'}</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminUsuariosView

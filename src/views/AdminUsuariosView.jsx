import { useEffect, useState } from 'react'
import { Alert, Button, Modal, Table } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function AdminUsuariosView({ usuarios, eliminarUsuario }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mensaje, setMensaje] = useState(location.state?.mensaje ?? '')
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    if (!location.state?.mensaje) return
    const { mensaje: confirmacion, ...estado } = location.state
    setMensaje(confirmacion)
    navigate({ pathname: location.pathname, search: location.search, hash: location.hash }, {
      replace: true,
      state: estado,
    })
  }, [location, navigate])

  function confirmarEliminacion() {
    eliminarUsuario(seleccionado.id)
    setMensaje(`Registro de ${seleccionado.nombre} ${seleccionado.apellido} eliminado.`)
    setSeleccionado(null)
  }

  return (
    <>
      <section className="mb-4">
        <h1>Administración de usuarios</h1>
        <p>Consulta el listado de usuarios simulados del prototipo de HuertoHogar.</p>
        <Button as={Link} role="link" to="/admin/usuarios/nuevo">Nuevo usuario</Button>
      </section>
      {mensaje && <Alert variant="success" role="status">{mensaje}</Alert>}
      <section className="mb-4">
        <h2>Listado de usuarios</h2>
        <p className="small text-body-secondary">Este listado provisional utiliza datos de este navegador. Las altas, ediciones y eliminaciones de esta sección solo afectan a los registros locales.</p>
        {usuarios.length === 0 ? <p>No hay usuarios registrados en el prototipo.</p> : (
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
                      <Button variant="outline-danger" size="sm" onClick={() => setSeleccionado(usuario)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </section>
      <Modal show={Boolean(seleccionado)} onHide={() => setSeleccionado(null)} centered aria-labelledby="tituloEliminarUsuario">
        <Modal.Header closeButton closeLabel="Cerrar">
          <Modal.Title id="tituloEliminarUsuario">Eliminar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Quieres eliminar el registro de {seleccionado?.nombre} {seleccionado?.apellido}? Esta acción no se puede deshacer.</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setSeleccionado(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarEliminacion}>Eliminar usuario</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminUsuariosView

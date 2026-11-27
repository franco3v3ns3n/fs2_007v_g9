import { useCallback } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import UsuarioFormulario from '../components/UsuarioFormulario'
import { useConsultaUsuarios } from '../hooks/useConsultaUsuarios'
import { actualizarUsuario, buscarUsuario } from '../services/usuarioService'

function AdminEditarUsuarioView({ ejecutarUsuario }) {
  const { id } = useParams()
  const idUsuario = Number(id)
  const idValido = /^[1-9]\d*$/.test(id) && Number.isSafeInteger(idUsuario)
  const consultar = useCallback((signal) => {
    if (!idValido) return null
    return ejecutarUsuario((token) => buscarUsuario(idUsuario, token, signal))
  }, [ejecutarUsuario, idValido, idUsuario])
  const { datos: usuario, error, cargando, recargar } = useConsultaUsuarios(consultar)

  if (!idValido || error?.status === 404) {
    return (
      <>
        <h1 className="mb-4">Usuario no encontrado</h1>
        <Button as={Link} role="link" to="/admin/usuarios" variant="outline-primary">Volver a Usuarios</Button>
      </>
    )
  }

  if (cargando || error) {
    return (
      <>
        <h1 className="mb-4">Editar usuario</h1>
        {cargando && <p role="status">Cargando usuario…</p>}
        {error && (
          <Alert variant="danger" role="alert">
            <p>{error.message}</p>
            <Button variant="outline-danger" size="sm" onClick={recargar}>Reintentar consulta</Button>
          </Alert>
        )}
        <Button as={Link} role="link" to="/admin/usuarios" variant="outline-primary">Volver a Usuarios</Button>
      </>
    )
  }

  async function guardar(datos) {
    const actualizado = await ejecutarUsuario((token) => actualizarUsuario(usuario.id, datos, token))
    return { usuario: actualizado }
  }

  return <UsuarioFormulario key={usuario.id} usuario={usuario} onGuardar={guardar} />
}

export default AdminEditarUsuarioView
